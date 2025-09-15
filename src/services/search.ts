import { TalkMEDAPI } from './api.js';
import { CLIOptions, SearchRequest, SearchResponse, SearchResultSummary, DisplayItem, PaginationInfo } from '../types/index.js';
import { ResultFormatter } from '../utils/formatter.js';
import { InteractiveHandler } from '../utils/interactive.js';

export class SearchService {
  private api: TalkMEDAPI;
  private formatter: ResultFormatter;
  private interactive: InteractiveHandler;

  constructor() {
    this.api = new TalkMEDAPI();
    this.formatter = new ResultFormatter();
    this.interactive = new InteractiveHandler();
  }

  /**
   * 执行搜索并处理结果
   * @param keyword 搜索关键词
   * @param options CLI 选项
   */
  public async performSearch(keyword: string, options: CLIOptions): Promise<void> {
    try {
      console.log(`\n🔍 搜索关键词: "${keyword}"`);
      console.log(`📋 搜索类型: ${this.getTypeDisplayName(options.type || 'all')}`);
      console.log(`📄 页码: ${options.page || 1}\n`);

      const searchRequest: SearchRequest = {
        word: keyword,
        type: options.type,
        page: options.page
      };

      const response = await this.api.search(searchRequest);
      const summary = this.processSearchResponse(response, keyword, options.type || 'all');

      if (this.hasResults(summary)) {
        this.formatter.displayResults(summary);
        
        if (options.interactive) {
          await this.interactive.handleInteraction(summary);
        }
      } else {
        this.displayNoResults(keyword, options.type || 'all');
      }

    } catch (error) {
      this.handleSearchError(error, keyword);
    }
  }

  /**
   * 处理搜索响应数据
   * @param response API 响应
   * @param keyword 搜索关键词
   * @param searchType 搜索类型
   * @returns 搜索结果汇总
   */
  private processSearchResponse(
    response: SearchResponse, 
    keyword: string, 
    searchType: string
  ): SearchResultSummary {
    const courses = response.data.course?.items || [];
    const lives = response.data.live?.items || [];
    
    const pagination: PaginationInfo = {
      currentPage: 1, // API 暂不返回当前页码，默认为 1
      hasMore: response.data.course?.has_more || false,
      totalDisplayed: courses.length + lives.length
    };

    return {
      courses,
      lives,
      pagination,
      keyword,
      searchType
    };
  }

  /**
   * 检查是否有搜索结果
   * @param summary 搜索结果汇总
   * @returns 是否有结果
   */
  private hasResults(summary: SearchResultSummary): boolean {
    return summary.courses.length > 0 || summary.lives.length > 0;
  }

  /**
   * 显示无结果信息
   * @param keyword 搜索关键词
   * @param searchType 搜索类型
   */
  private displayNoResults(keyword: string, searchType: string): void {
    console.log('❌ 未找到相关结果\n');
    console.log('💡 建议:');
    console.log('  • 尝试使用不同的关键词');
    console.log('  • 检查关键词拼写');
    console.log('  • 尝试更通用的搜索词');
    if (searchType !== 'all') {
      console.log('  • 尝试搜索所有类型 (--type all)');
    }
    console.log();
  }

  /**
   * 处理搜索错误
   * @param error 错误对象
   * @param keyword 搜索关键词
   */
  private handleSearchError(error: unknown, keyword: string): void {
    console.error('\n❌ 搜索失败\n');
    
    if (error instanceof Error) {
      console.error('错误信息:', error.message);
    } else {
      console.error('未知错误');
    }

    console.log('\n🔧 故障排除:');
    console.log('  • 检查网络连接');
    console.log('  • 确认 TalkMED 服务可用');
    console.log('  • 稍后重试');
    console.log();

    process.exit(1);
  }

  /**
   * 获取类型显示名称
   * @param type 类型代码
   * @returns 显示名称
   */
  private getTypeDisplayName(type: string): string {
    const typeMap: Record<string, string> = {
      'all': '全部',
      'course': '课程',
      'live': '会议'
    };
    return typeMap[type] || '全部';
  }

  /**
   * 测试 API 连接
   * @returns 连接状态
   */
  public async testConnection(): Promise<boolean> {
    return await this.api.testConnection();
  }
}