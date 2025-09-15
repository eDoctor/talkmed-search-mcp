import * as readline from 'readline';
import chalk from 'chalk';
import { SearchResultSummary, DisplayItem, CourseItem, LiveItem, PaginationInfo } from '../types/index.js';
import { ResultFormatter } from './formatter.js';

export class InteractiveHandler {
  private formatter: ResultFormatter;
  private rl: readline.Interface;

  constructor() {
    this.formatter = new ResultFormatter();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * 处理交互式操作
   * @param summary 搜索结果汇总
   */
  public async handleInteraction(summary: SearchResultSummary): Promise<void> {
    console.log(chalk.cyan('\n🎯 交互式模式已启用'));
    console.log(chalk.gray('输入帮助命令查看可用操作\n'));

    while (true) {
      try {
        const command = await this.promptUser('请输入命令 (help 查看帮助): ');
        const shouldExit = await this.processCommand(command.trim(), summary);
        
        if (shouldExit) {
          break;
        }
      } catch (error) {
        console.error(chalk.red('命令处理错误:'), error instanceof Error ? error.message : '未知错误');
      }
    }

    this.rl.close();
  }

  /**
   * 处理用户命令
   * @param command 用户输入的命令
   * @param summary 搜索结果汇总
   * @returns 是否退出交互模式
   */
  private async processCommand(command: string, summary: SearchResultSummary): Promise<boolean> {
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
      case 'h':
        this.showHelp();
        break;

      case 'list':
      case 'l':
        this.showList(summary);
        break;

      case 'detail':
      case 'd':
        await this.showDetail(args, summary);
        break;

      case 'course':
      case 'c':
        this.showCourses(summary);
        break;

      case 'live':
      case 'v':
        this.showLives(summary);
        break;

      case 'stats':
      case 's':
        this.showStats(summary);
        break;

      case 'exit':
      case 'quit':
      case 'q':
        console.log(chalk.green('👋 退出交互模式'));
        return true;

      case '':
        // 空命令，不做任何操作
        break;

      default:
        console.log(chalk.red(`❌ 未知命令: ${cmd}`));
        console.log(chalk.gray('输入 "help" 查看可用命令'));
        break;
    }

    return false;
  }

  /**
   * 显示帮助信息
   */
  private showHelp(): void {
    console.log(chalk.cyan('\n📖 可用命令:'));
    console.log(chalk.yellow('  help, h        ') + chalk.gray('- 显示此帮助信息'));
    console.log(chalk.yellow('  list, l        ') + chalk.gray('- 显示所有搜索结果'));
    console.log(chalk.yellow('  detail <id>, d ') + chalk.gray('- 显示指定 ID 的详细信息'));
    console.log(chalk.yellow('  course, c      ') + chalk.gray('- 只显示课程结果'));
    console.log(chalk.yellow('  live, v        ') + chalk.gray('- 只显示会议结果'));
    console.log(chalk.yellow('  stats, s       ') + chalk.gray('- 显示搜索统计信息'));
    console.log(chalk.yellow('  exit, quit, q  ') + chalk.gray('- 退出交互模式'));
    console.log();
  }

  /**
   * 显示搜索结果列表
   * @param summary 搜索结果汇总
   */
  private showList(summary: SearchResultSummary): void {
    console.log(chalk.cyan('\n📋 搜索结果列表:'));
    
    if (summary.courses.length > 0) {
      console.log(chalk.blue('\n📚 课程:'));
      summary.courses.forEach((course, index) => {
        console.log(chalk.yellow(`  ${index + 1}. [${course.id}] ${course.title}`));
      });
    }
    
    if (summary.lives.length > 0) {
      console.log(chalk.green('\n🎥 会议:'));
      summary.lives.forEach((live, index) => {
        console.log(chalk.yellow(`  ${index + 1}. [${live.id}] ${live.title}`));
      });
    }
    
    console.log();
  }

  /**
   * 显示详细信息
   * @param args 命令参数
   * @param summary 搜索结果汇总
   */
  private async showDetail(args: string[], summary: SearchResultSummary): Promise<void> {
    if (args.length === 0) {
      console.log(chalk.red('❌ 请提供要查看的项目 ID'));
      console.log(chalk.gray('用法: detail <id>'));
      return;
    }

    const id = parseInt(args[0]);
    if (isNaN(id)) {
      console.log(chalk.red('❌ 无效的 ID，请提供数字'));
      return;
    }

    const item = this.findItemById(id, summary);
    if (!item) {
      console.log(chalk.red(`❌ 未找到 ID 为 ${id} 的项目`));
      return;
    }

    this.formatter.displayItemDetails(item);
  }

  /**
   * 只显示课程
   * @param summary 搜索结果汇总
   */
  private showCourses(summary: SearchResultSummary): void {
    if (summary.courses.length === 0) {
      console.log(chalk.yellow('\n📚 没有找到课程结果'));
      return;
    }

    console.log(chalk.blue('\n📚 课程结果:'));
    summary.courses.forEach((course, index) => {
      console.log(chalk.yellow(`${index + 1}. [${course.id}] ${course.title}`));
      console.log(chalk.gray(`   💰 ${this.formatPrice(course.price, course.price_type)}`));
      console.log(chalk.gray(`   👥 学习人数: ${course.learn_count_show}`));
      console.log();
    });
  }

  /**
   * 只显示会议
   * @param summary 搜索结果汇总
   */
  private showLives(summary: SearchResultSummary): void {
    if (summary.lives.length === 0) {
      console.log(chalk.yellow('\n🎥 没有找到会议结果'));
      return;
    }

    console.log(chalk.green('\n🎥 会议结果:'));
    summary.lives.forEach((live, index) => {
      console.log(chalk.yellow(`${index + 1}. [${live.id}] ${live.title}`));
      console.log(chalk.gray(`   📊 状态: ${live.live_status_text}`));
      if (live.sub_title) {
        console.log(chalk.gray(`   📝 ${live.sub_title}`));
      }
      console.log();
    });
  }

  /**
   * 显示统计信息
   * @param summary 搜索结果汇总
   */
  private showStats(summary: SearchResultSummary): void {
    console.log(chalk.cyan('\n📊 搜索统计:'));
    console.log(chalk.gray(`关键词: ${summary.keyword}`));
    console.log(chalk.gray(`搜索类型: ${summary.searchType}`));
    console.log(chalk.gray(`当前页码: ${summary.pagination.currentPage}`));
    console.log(chalk.blue(`课程数量: ${summary.courses.length}`));
    console.log(chalk.green(`会议数量: ${summary.lives.length}`));
    console.log(chalk.yellow(`总结果数: ${summary.pagination.totalDisplayed}`));
    console.log(chalk.magenta(`还有更多: ${summary.pagination.hasMore ? '是' : '否'}`));
    console.log();
  }

  /**
   * 根据 ID 查找项目
   * @param id 项目 ID
   * @param summary 搜索结果汇总
   * @returns 找到的项目或 null
   */
  private findItemById(id: number, summary: SearchResultSummary): DisplayItem | null {
    // 在课程中查找
    const course = summary.courses.find(c => c.id === id);
    if (course) {
      return this.convertCourseToDisplayItem(course);
    }

    // 在会议中查找
    const live = summary.lives.find(l => l.id === id);
    if (live) {
      return this.convertLiveToDisplayItem(live);
    }

    return null;
  }

  /**
   * 转换课程为显示项目
   * @param course 课程项目
   * @returns 显示项目
   */
  private convertCourseToDisplayItem(course: CourseItem): DisplayItem {
    return {
      id: course.id,
      title: course.title,
      type: 'course',
      description: `价格: ${this.formatPrice(course.price, course.price_type)} | 学习人数: ${course.learn_count_show} | 课程数: ${course.course_count}`,
      status: course.tag_name || '无标签'
    };
  }

  /**
   * 转换会议为显示项目
   * @param live 会议项目
   * @returns 显示项目
   */
  private convertLiveToDisplayItem(live: LiveItem): DisplayItem {
    return {
      id: live.id,
      title: live.title,
      type: 'live',
      description: live.des || live.sub_title || '无描述',
      status: live.live_status_text,
      url: live.url || undefined
    };
  }

  /**
   * 格式化价格
   * @param price 价格
   * @param priceType 价格类型
   * @returns 格式化的价格字符串
   */
  private formatPrice(price: number, priceType: number): string {
    return priceType === 0 || price === 0 ? '免费' : `¥${price}`;
  }

  /**
   * 提示用户输入
   * @param question 提示问题
   * @returns 用户输入
   */
  private promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(chalk.cyan(question), (answer) => {
        resolve(answer);
      });
    });
  }
}