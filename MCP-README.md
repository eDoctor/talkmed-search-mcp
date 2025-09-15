# TalkMED Search MCP 服务器

这是一个 Model Context Protocol (MCP) 服务器，提供 TalkMED 平台的医学内容搜索功能。

## 功能特性

- 🔍 搜索 TalkMED 平台的医学课程和会议内容
- 📋 支持按内容类型筛选（全部/课程/会议）
- 📄 支持分页浏览
- 🌐 通过 MCP 协议提供标准化的工具接口

## 安装和配置

### 1. 安装依赖

```bash
npm install
npm run build
```

### 2. 配置 MCP 客户端

将以下配置添加到您的 MCP 客户端配置文件中：

```json
{
  "mcpServers": {
    "talkmed-search": {
      "command": "npx",
      "args": ["talkmed-search-mcp"],
      "env": {},
      "description": "TalkMED 医学内容搜索工具",
      "capabilities": ["tools"]
    }
  }
}
```

### 3. 直接运行 MCP 服务器

```bash
# 使用 npm 脚本
npm run mcp

# 或直接运行
node dist/mcp-server.js
```

## 可用工具

### search_medical_content

搜索 TalkMED 平台的医学内容。

**参数：**
- `keyword` (必需): 搜索关键词
- `type` (可选): 内容类型，可选值：
  - `all` - 全部内容（默认）
  - `course` - 仅课程
  - `live` - 仅会议
- `page` (可选): 页码，默认为 1

**示例调用：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_medical_content",
    "arguments": {
      "keyword": "糖尿病",
      "type": "all",
      "page": 1
    }
  }
}
```

**返回结果：**

```json
{
  "success": true,
  "keyword": "糖尿病",
  "searchType": "all",
  "page": 1,
  "results": {
    "courses": [...],
    "lives": [...],
    "pagination": {
      "currentPage": 1,
      "hasMore": true,
      "totalDisplayed": 10
    },
    "totalResults": 10
  },
  "hasResults": true
}
```

## 测试

### 手动测试

```bash
# 测试工具列表
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/mcp-server.js

# 测试搜索功能
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_medical_content","arguments":{"keyword":"糖尿病","type":"all","page":1}}}' | node dist/mcp-server.js
```

### 使用测试脚本

```bash
node test-mcp.js
```

## 开发

### 项目结构

```
src/
├── mcp-server.ts          # MCP 服务器主文件
├── services/
│   ├── api.ts            # TalkMED API 客户端
│   └── search.ts         # 搜索服务（包含 MCP 专用方法）
├── types/
│   └── index.ts          # 类型定义
└── utils/
    ├── cli.ts            # CLI 工具
    ├── formatter.ts      # 结果格式化
    └── interactive.ts    # 交互式处理
```

### 开发模式

```bash
# 开发模式运行 MCP 服务器
npm run dev:mcp

# 构建项目
npm run build
```

## 故障排除

### 常见问题

1. **服务器无法启动**
   - 确保已安装所有依赖：`npm install`
   - 确保已构建项目：`npm run build`

2. **搜索无结果**
   - 检查网络连接
   - 尝试不同的搜索关键词
   - 某些特定术语可能在数据库中没有对应内容

3. **MCP 客户端连接失败**
   - 检查配置文件路径是否正确
   - 确保 `talkmed-search-mcp` 命令可用

### 调试

启用调试模式查看详细日志：

```bash
DEBUG=* node dist/mcp-server.js
```

## 许可证

MIT License

## 支持

如有问题或建议，请提交 Issue 或联系开发团队。