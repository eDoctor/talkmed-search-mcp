import { Command } from 'commander';
import { SearchService } from '../services/search.js';
import { CLIOptions } from '../types/index.js';

export class CLIParser {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('talkmed-search')
      .description('TalkMED 医学内容搜索工具')
      .version('1.0.0');

    // 主搜索命令
    this.program
      .argument('<keyword>', '搜索关键词')
      .option('-t, --type <type>', '内容类型 (all|course|live)', 'all')
      .option('-p, --page <page>', '页码', '1')
      .option('-i, --interactive', '启用交互式模式', false)
      .action((keyword: string, options: any) => {
        this.handleSearch(keyword, options);
      });

    // 帮助命令
    this.program
      .command('help')
      .description('显示帮助信息')
      .action(() => {
        this.program.help();
      });
  }

  private async handleSearch(keyword: string, options: any): Promise<void> {
    const cliOptions: CLIOptions = {
      type: this.validateType(options.type),
      page: parseInt(options.page) || 1,
      interactive: options.interactive
    };

    // 动态导入搜索服务以避免循环依赖
    const { SearchService } = await import('../services/search.js');
    const searchService = new SearchService();
    
    try {
      await searchService.performSearch(keyword, cliOptions);
      process.exit(0); // 成功执行后正常退出
    } catch (error) {
      console.error('搜索失败:', error instanceof Error ? error.message : '未知错误');
      process.exit(1);
    }
  }

  private validateType(type: string): 'all' | 'course' | 'live' {
    const validTypes = ['all', 'course', 'live'];
    if (validTypes.includes(type)) {
      return type as 'all' | 'course' | 'live';
    }
    console.warn(`无效的类型参数: ${type}，使用默认值 'all'`);
    return 'all';
  }

  public parse(argv?: string[]): void {
    this.program.parse(argv);
  }

  public getProgram(): Command {
    return this.program;
  }

  // 显示使用示例
  public showExamples(): void {
    console.log('\n使用示例:');
    console.log('  npx talkmed-search "心脏病"                    # 搜索所有类型的心脏病相关内容');
    console.log('  npx talkmed-search "糖尿病" --type course      # 只搜索课程');
    console.log('  npx talkmed-search "会议" --type live          # 只搜索会议');
    console.log('  npx talkmed-search "医学" --page 2             # 搜索第2页');
    console.log('  npx talkmed-search "外科" --interactive        # 启用交互式模式');
    console.log('  npx talkmed-search help                        # 显示帮助信息\n');
  }
}