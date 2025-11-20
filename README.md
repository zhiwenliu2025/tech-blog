# 技术博客

基于 Nuxt 3 和 Supabase 构建的技术博客系统。

## 功能特点

- 📝 文章发布与管理
- 🏷️ 分类和标签系统
- 👤 用户认证系统
- 💬 评论功能
- 👍 点赞功能
- 🌙 暗色模式支持
- 📱 响应式设计
- 🔍 SEO 优化

## 技术栈

- **前端框架**: Nuxt 3
- **UI 框架**: Tailwind CSS
- **数据库**: Supabase
- **认证**: Supabase Auth
- **内容管理**: Nuxt Content
- **状态管理**: Pinia
- **代码质量**: ESLint, Prettier, Husky

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env` 并填入你的 Supabase 配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# App Configuration
NUXT_PUBLIC_APP_NAME=技术博客
NUXT_PUBLIC_APP_DESCRIPTION=基于 Nuxt 3 的技术博客
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NUXT_PUBLIC_COMMENTS_ENABLED=true
NUXT_PUBLIC_ANALYTICS_ENABLED=false
```

### 3. 设置 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 在 Supabase 控制台的 SQL 编辑器中运行 `supabase/schema.sql` 文件中的 SQL 代码
3. 在 Supabase 控制台的 Authentication > Settings 中配置你的网站 URL

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的博客。

## 项目结构

```
tech-blog/
├── assets/                 # 静态资源
│   └── css/
│       └── main.css        # Tailwind CSS 主样式文件
├── components/              # Vue 组件
├── composables/            # 组合式函数
│   └── useBlogPosts.ts     # 博客文章相关操作
├── layouts/                # 布局组件
├── pages/                  # 页面组件
│   ├── auth/
│   │   └── login.vue       # 登录/注册页面
│   ├── blog/
│   │   └── [slug].vue      # 文章详情页
│   └── index.vue           # 首页
├── plugins/                # Nuxt 插件
│   └── supabase.client.ts  # Supabase 客户端插件
├── supabase/
│   └── schema.sql          # 数据库架构
├── .env.example            # 环境变量示例
├── eslint.config.js        # ESLint 配置
├── nuxt.config.ts          # Nuxt 配置
├── package.json            # 项目依赖
├── tailwind.config.js      # Tailwind CSS 配置
└── README.md               # 项目说明
```

## 可用脚本

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm generate` - 生成静态网站
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行 ESLint 检查
- `pnpm lint:fix` - 自动修复 ESLint 错误
- `pnpm format` - 格式化代码

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 控制台添加环境变量
4. 部署项目

### 其他平台

本项目可以部署到任何支持 Node.js 的平台，如 Netlify、Heroku、AWS 等。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
