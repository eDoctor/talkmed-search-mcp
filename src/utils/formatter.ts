import chalk from 'chalk';
import { SearchResponse, CourseItem, LiveItem, SearchResultSummary, DisplayItem } from '../types/index.js';

export class ResultFormatter {
  /**
   * 显示搜索结果
   * @param summary 搜索结果汇总
   */
  public displayResults(summary: SearchResultSummary): void {
    this.displayHeader(summary);
    
    if (summary.courses.length > 0) {
      this.displayCourses(summary.courses);
    }
    
    if (summary.lives.length > 0) {
      this.displayLives(summary.lives);
    }
    
    this.displayFooter(summary);
  }

  /**
   * 显示搜索结果头部信息
   * @param summary 搜索结果汇总
   */
  private displayHeader(summary: SearchResultSummary): void {
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold(`🔍 搜索结果: "${summary.keyword}"`));
    console.log(chalk.gray(`搜索类型: ${this.getTypeDisplayName(summary.searchType)} | 页码: ${summary.pagination.currentPage}`));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log();
  }

  /**
   * 显示课程结果
   * @param courses 课程列表
   */
  private displayCourses(courses: CourseItem[]): void {
    console.log(chalk.blue.bold(`📚 课程 (${courses.length} 个结果)`));
    console.log(chalk.blue('─'.repeat(60)));
    
    courses.forEach((course, index) => {
      console.log(chalk.yellow(`${index + 1}. ${course.title}`));
      
      // 价格信息
      const priceInfo = this.formatPrice(course.price, course.original_price, course.price_type);
      console.log(chalk.green(`   💰 ${priceInfo}`));
      
      // 学习统计
      console.log(chalk.gray(`   👥 学习人数: ${course.learn_count_show} | 课程数: ${course.course_count}`));
      
      // 标签
      if (course.tag_name) {
        console.log(chalk.magenta(`   🏷️  ${course.tag_name}`));
      }
      
      // 课程 ID
      console.log(chalk.gray(`   🆔 ID: ${course.id}`));
      console.log();
    });
  }

  /**
   * 显示会议结果
   * @param lives 会议列表
   */
  private displayLives(lives: LiveItem[]): void {
    console.log(chalk.green.bold(`🎥 会议 (${lives.length} 个结果)`));
    console.log(chalk.green('─'.repeat(60)));
    
    lives.forEach((live, index) => {
      console.log(chalk.yellow(`${index + 1}. ${live.title}`));
      
      // 副标题
      if (live.sub_title) {
        console.log(chalk.gray(`   📝 ${live.sub_title}`));
      }
      
      // 描述
      if (live.des) {
        const shortDesc = live.des.length > 100 ? live.des.substring(0, 100) + '...' : live.des;
        console.log(chalk.gray(`   📄 ${shortDesc}`));
      }
      
      // 时间信息
      const timeInfo = this.formatLiveTime(live.start_at, live.end_at);
      console.log(chalk.cyan(`   ⏰ ${timeInfo}`));
      
      // 状态
      console.log(chalk.blue(`   📊 状态: ${live.live_status_text}`));
      
      // 标签
      if (live.tag) {
        console.log(chalk.magenta(`   🏷️  ${live.tag}`));
      }
      
      // 会议 ID
      console.log(chalk.gray(`   🆔 ID: ${live.id}`));
      console.log();
    });
  }

  /**
   * 显示搜索结果底部信息
   * @param summary 搜索结果汇总
   */
  private displayFooter(summary: SearchResultSummary): void {
    console.log(chalk.cyan('─'.repeat(80)));
    console.log(chalk.cyan(`📊 总计: ${summary.pagination.totalDisplayed} 个结果`));
    
    if (summary.pagination.hasMore) {
      console.log(chalk.yellow('📄 还有更多结果，使用 --page 参数查看下一页'));
    }
    
    console.log(chalk.cyan('═'.repeat(80)));
    console.log();
  }

  /**
   * 格式化价格信息
   * @param price 当前价格
   * @param originalPrice 原价
   * @param priceType 价格类型
   * @returns 格式化的价格字符串
   */
  private formatPrice(price: number, originalPrice: number, priceType: number): string {
    if (priceType === 0 || price === 0) {
      return '免费';
    }
    
    let priceStr = `¥${price}`;
    
    if (originalPrice > price) {
      priceStr += chalk.strikethrough.gray(` ¥${originalPrice}`);
    }
    
    return priceStr;
  }

  /**
   * 格式化会议时间
   * @param startAt 开始时间
   * @param endAt 结束时间
   * @returns 格式化的时间字符串
   */
  private formatLiveTime(startAt: string, endAt: string): string {
    try {
      const start = new Date(startAt);
      const end = new Date(endAt);
      
      const formatDate = (date: Date) => {
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
      
      return `${formatDate(start)} ~ ${formatDate(end)}`;
    } catch (error) {
      return `${startAt} ~ ${endAt}`;
    }
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
   * 显示详细信息
   * @param item 显示项目
   */
  public displayItemDetails(item: DisplayItem): void {
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold(`📋 详细信息`));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log();
    
    console.log(chalk.yellow.bold(`标题: ${item.title}`));
    console.log(chalk.gray(`类型: ${item.type === 'course' ? '📚 课程' : '🎥 会议'}`));
    console.log(chalk.gray(`ID: ${item.id}`));
    
    if (item.description) {
      console.log(chalk.white(`描述: ${item.description}`));
    }
    
    if (item.status) {
      console.log(chalk.blue(`状态: ${item.status}`));
    }
    
    if (item.url) {
      console.log(chalk.green(`链接: ${item.url}`));
    }
    
    console.log();
    console.log(chalk.cyan('═'.repeat(80)));
    console.log();
  }
}