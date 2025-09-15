# TalkMED 搜索工具

🏥  TalkMED 医学站点内容搜索命令行工具，支持搜索课程和会议内容。

## 功能特性

- 🔍 **智能搜索**: 支持关键词搜索医学课程和会议
- 📚 **类型筛选**: 可按课程、会议或全部类型进行筛选
- 📄 **分页支持**: 支持分页浏览搜索结果
- 🎨 **美观展示**: 彩色格式化输出，信息清晰易读
- 🎯 **交互模式**: 支持交互式浏览和详情查看
- ⚡ **快速安装**: 通过 npx 直接使用，无需安装

## 快速开始

### 使用 npx (推荐)

```bash
# 搜索所有类型的内容
npx talkmed-search "心脏病"

# 只搜索课程
npx talkmed-search "糖尿病" --type course

# 只搜索会议
npx talkmed-search "外科手术" --type live

# 启用交互式模式
npx talkmed-search "医学影像" --interactive
```

### 本地安装

```bash
# 克隆项目
git clone <repository-url>
cd talkmed-search

# 安装依赖
npm install

# 构建项目
npm run build

# 运行
npm start "搜索关键词"
```

## 使用说明

### 基本语法

```bash
npx talkmed-search <关键词> [选项]
```

### 命令选项

| 选项 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--type <type>` | `-t` | 内容类型 (all\|course\|live) | all |
| `--page <page>` | `-p` | 页码 | 1 |
| `--interactive` | `-i` | 启用交互式模式 | false |
| `--help` | `-h` | 显示帮助信息 | - |

### 使用示例

```bash
# 基础搜索
npx talkmed-search "心脏病"

# 搜索特定类型
npx talkmed-search "糖尿病" --type course
npx talkmed-search "学术会议" --type live

# 分页搜索
npx talkmed-search "外科" --page 2

# 交互式模式
npx talkmed-search "医学" --interactive

# 组合使用
npx talkmed-search "肿瘤" --type course --page 1 --interactive
```

## 交互式模式

启用交互式模式后，可以使用以下命令：

| 命令 | 简写 | 描述 |
|------|------|------|
| `help` | `h` | 显示帮助信息 |
| `list` | `l` | 显示所有搜索结果 |
| `detail <id>` | `d` | 显示指定 ID 的详细信息 |
| `course` | `c` | 只显示课程结果 |
| `live` | `v` | 只显示会议结果 |
| `stats` | `s` | 显示搜索统计信息 |
| `exit` | `q` | 退出交互模式 |

## 输出格式

### 课程信息
- 📚 标题
- 💰 价格信息
- 👥 学习人数
- 🏷️ 标签
- 🆔 课程 ID

### 会议信息
- 🎥 标题
- 📝 副标题/描述
- ⏰ 时间安排
- 📊 状态
- 🏷️ 标签
- 🆔 会议 ID

## 开发

### 项目结构

```
src/
├── types/          # TypeScript 类型定义
├── services/       # API 服务和搜索逻辑
├── utils/          # 工具类 (CLI、格式化、交互)
└── index.ts        # 主入口文件
```

### 开发命令

```bash
# 开发模式
npm run dev "搜索关键词"

# 构建
npm run build

# 运行构建后的版本
npm start "搜索关键词"
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **Commander.js**: 命令行参数解析
- **Axios**: HTTP 客户端
- **Chalk**: 终端颜色输出
- **Readline**: 交互式输入处理

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- ✨ 初始版本发布
- 🔍 支持关键词搜索
- 📚 支持课程和会议筛选
- 🎨 美观的格式化输出
- 🎯 交互式模式
- ⚡ npx 直接使用