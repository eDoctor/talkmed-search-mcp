#!/usr/bin/env node

/**
 * 简单的 MCP 服务器测试脚本
 * 模拟 MCP 客户端与服务器的交互
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
  console.log('🧪 开始测试 MCP 服务器...\n');

  // 启动 MCP 服务器
  const serverPath = join(__dirname, 'dist', 'mcp-server.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let serverOutput = '';
  let serverError = '';

  server.stdout.on('data', (data) => {
    serverOutput += data.toString();
  });

  server.stderr.on('data', (data) => {
    serverError += data.toString();
  });

  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // 测试 1: 列出工具
    console.log('📋 测试 1: 列出可用工具');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };

    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 500));

    // 测试 2: 调用搜索工具
    console.log('🔍 测试 2: 调用搜索工具');
    const callToolRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'search_medical_content',
        arguments: {
          keyword: '糖尿病',
          type: 'all',
          page: 1
        }
      }
    };

    server.stdin.write(JSON.stringify(callToolRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ 测试完成');
    console.log('\n📤 服务器输出:');
    console.log(serverOutput);
    
    if (serverError) {
      console.log('\n❌ 服务器错误:');
      console.log(serverError);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    server.kill();
  }
}

testMCPServer().catch(console.error);