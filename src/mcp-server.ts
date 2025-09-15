#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { SearchService } from './services/search.js';
import { CLIOptions } from './types/index.js';

/**
 * TalkMED MCP 服务器
 * 提供医学内容搜索工具
 */
class TalkMEDMCPServer {
  private server: Server;
  private searchService: SearchService;

  constructor() {
    this.server = new Server(
      {
        name: 'talkmed-search',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.searchService = new SearchService();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_medical_content',
            description: '搜索 TalkMED 平台的医学内容，包括课程和会议',
            inputSchema: {
              type: 'object',
              properties: {
                keyword: {
                  type: 'string',
                  description: '搜索关键词',
                },
                type: {
                  type: 'string',
                  enum: ['all', 'course', 'live'],
                  default: 'all',
                  description: '内容类型：all(全部)、course(课程)、live(会议)',
                },
                page: {
                  type: 'integer',
                  minimum: 1,
                  default: 1,
                  description: '页码',
                },
              },
              required: ['keyword'],
            },
          } as Tool,
        ],
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      if (name === 'search_medical_content') {
        return await this.handleSearchTool(args);
      }

      throw new Error(`未知的工具: ${name}`);
    });
  }

  private async handleSearchTool(args: any) {
    try {
      const { keyword, type = 'all', page = 1 } = args;

      if (!keyword || typeof keyword !== 'string') {
        throw new Error('关键词是必需的，且必须是字符串');
      }

      const options: CLIOptions = {
        type: this.validateType(type),
        page: parseInt(page.toString()) || 1,
        interactive: false,
      };

      // 执行搜索
      const result = await this.searchService.performSearchForMCP(keyword, options);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: errorMessage,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  }

  private validateType(type: string): 'all' | 'course' | 'live' {
    const validTypes = ['all', 'course', 'live'];
    if (validTypes.includes(type)) {
      return type as 'all' | 'course' | 'live';
    }
    return 'all';
  }

  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('TalkMED MCP 服务器已启动');
  }
}

// 启动服务器
async function main() {
  const server = new TalkMEDMCPServer();
  await server.run();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('MCP 服务器启动失败:', error);
    process.exit(1);
  });
}

export { TalkMEDMCPServer };