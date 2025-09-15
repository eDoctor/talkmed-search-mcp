#!/usr/bin/env node

import { CLIParser } from './utils/cli.js';

/**
 * TalkMED 搜索工具主入口
 */
async function main(): Promise<void> {
  try {
    const cli = new CLIParser();
    
    // 如果没有提供参数，显示帮助信息
    if (process.argv.length <= 2) {
      console.log('\n🏥 TalkMED 医学内容搜索工具\n');
      cli.getProgram().help();
      cli.showExamples();
      return;
    }
    
    // 解析命令行参数
    cli.parse(process.argv);
    
  } catch (error) {
    console.error('\n❌ 程序执行失败:');
    
    if (error instanceof Error) {
      console.error(error.message);
      
      // 如果是开发模式，显示堆栈跟踪
      if (process.env.NODE_ENV === 'development') {
        console.error('\n堆栈跟踪:');
        console.error(error.stack);
      }
    } else {
      console.error('未知错误');
    }
    
    console.log('\n💡 提示:');
    console.log('  • 检查网络连接');
    console.log('  • 确认搜索关键词正确');
    console.log('  • 使用 --help 查看使用说明');
    console.log();
    
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('\n💥 未捕获的异常:', error.message);
  process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

// 优雅退出处理
process.on('SIGINT', () => {
  console.log('\n\n👋 程序被用户中断，正在退出...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 程序被终止，正在退出...');
  process.exit(0);
});

// 启动程序
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };