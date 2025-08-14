# GitHub集成设置指南

本指南将帮助你设置GitHub OAuth应用，以便EchoNote可以将数据存储到GitHub仓库。

## 第一步：在GitHub上注册OAuth应用

### 1. 访问GitHub开发者设置
- 打开浏览器，访问：https://github.com/settings/developers
- 如果你还没有登录GitHub，请先登录

### 2. 创建新的OAuth应用
- 点击 "New OAuth App" 按钮
- 填写应用信息：

```
Application name: EchoNote
Homepage URL: http://localhost:3000
Application description: EchoNote - Personal Knowledge Management System
Authorization callback URL: http://localhost:3000/auth/github/callback
```

### 3. 注册应用
- 点击 "Register application" 按钮
- GitHub会生成Client ID和Client Secret
- **重要**：请保存Client ID，Client Secret请保密

## 第二步：配置环境变量

### 1. 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录执行
touch .env.local
```

### 2. 添加配置信息
在 `.env.local` 文件中添加以下内容：

```env
# GitHub OAuth应用配置
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_GITHUB_DEFAULT_OWNER=your_github_username_here
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
VITE_GITHUB_DEFAULT_REPO=echonote-data
```

**请替换以下值：**
- `your_github_client_id_here`: 第一步获取的Client ID
- `your_github_username_here`: 你的GitHub用户名

## 第三步：创建数据存储仓库

### 1. 创建新仓库
- 在GitHub上创建一个新的仓库
- 仓库名称建议：`echonote-data`
- 可以选择公开或私有（私有需要repo权限）

### 2. 仓库结构建议
```
echonote-data/
├── README.md
├── data/
│   ├── notes/
│   ├── attachments/
│   └── config/
└── .gitignore
```

## 第四步：权限说明

### OAuth权限范围
应用会请求以下权限：

- **repo**: 访问你的仓库（包括私有仓库）
- **user**: 读取你的用户信息
- **workflow**: 管理GitHub Actions工作流

### 安全说明
- 应用只会访问你明确授权的仓库
- 你可以随时在GitHub设置中撤销授权
- 访问令牌存储在本地，不会发送到第三方服务器

## 第五步：测试配置

### 1. 启动应用
```bash
pnpm dev
```

### 2. 测试认证
- 访问应用主页
- 点击"连接GitHub"按钮
- 完成GitHub授权流程
- 验证是否成功获取用户信息

### 3. 测试数据存储
- 创建一些测试数据
- 验证数据是否成功保存到GitHub仓库

## 常见问题

### Q: 认证失败怎么办？
A: 检查以下几点：
- Client ID是否正确
- 回调URL是否匹配
- 网络连接是否正常
- GitHub服务是否可用

### Q: 权限不足怎么办？
A: 确保：
- 仓库存在且你有访问权限
- OAuth应用有足够的权限范围
- 用户已正确授权

### Q: 如何撤销授权？
A: 访问 https://github.com/settings/applications，找到EchoNote应用并点击"Revoke"

### Q: 生产环境如何配置？
A: 修改环境变量：
- 将localhost改为你的域名
- 确保HTTPS协议
- 更新GitHub OAuth应用的回调URL

## 技术支持

如果遇到问题，请：
1. 检查浏览器控制台的错误信息
2. 验证环境变量配置
3. 确认GitHub OAuth应用设置
4. 查看应用日志

## 下一步

配置完成后，你可以：
- 使用GitHub存储笔记和附件
- 启用自动同步功能
- 配置备份策略
- 管理版本历史
