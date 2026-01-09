# 技术博客

基于 Nuxt 3 和 Supabase 构建的现代化技术博客系统。

## 功能特点

- 📝 文章发布与管理（创建、编辑、删除）
- 🏷️ 分类和标签系统
- 👤 用户认证系统（邮箱/密码、GitHub OAuth）
- 💬 评论功能
- 👍 点赞功能
- 🔥 热门文章（实时热度计算，智能排序）
- 👁️ 阅读量统计
- 🔍 全文搜索（PostgreSQL 全文搜索）
- ✍️ 富文本编辑器（Tiptap）
- 🌙 暗色模式支持
- 📱 响应式设计
- 🔒 行级安全策略（RLS）
- ⚡ 高性能搜索索引（自动维护）
- 💾 应用层缓存（LRU 缓存，减少 80% 数据库查询）
- 📲 PWA 支持（可安装、离线访问）
- 🎯 移动端优化（触摸优化、安全区域适配）
- 💾 草稿自动保存（本地存储，防止内容丢失）
- 🔄 无限滚动加载
- 👆 下拉刷新
- 📤 文章分享功能
- 👨‍💻 作者页面和作者列表
- 📄 我的博客页面
- 🔍 搜索模态框
- ⬆️ 返回顶部按钮
- 📊 SEO 优化（Sitemap、Robots.txt）
- 🖼️ 图片优化和上传
- ⌨️ 键盘输入优化

## 技术栈

- **前端框架**: Nuxt 3 (4.2.1)
- **UI 框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **富文本编辑器**: Tiptap
- **图标**: Nuxt Icon (Heroicons, Simple Icons)
- **代码质量**: ESLint, Prettier, Husky
- **包管理器**: pnpm

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
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

**⚠️ 重要迁移说明**：

如果你之前使用的是 `SUPABASE_SERVICE_KEY`，请按以下步骤迁移：

1. 打开你的 `.env` 文件
2. 找到 `SUPABASE_SERVICE_KEY=...` 这一行
3. 将其改为 `SUPABASE_SECRET_KEY=...`（值保持不变）
4. **删除**旧的 `SUPABASE_SERVICE_KEY` 行
5. 保存文件并重启开发服务器

**为什么需要迁移？**

`@nuxtjs/supabase` 模块在初始化时会检查环境变量。如果检测到 `SUPABASE_SERVICE_KEY`，会发出弃用警告。即使代码中已经更新，只要环境变量中存在 `SUPABASE_SERVICE_KEY`，警告就会持续出现。

# App Configuration

NUXT_PUBLIC_APP_NAME=技术博客
NUXT_PUBLIC_APP_DESCRIPTION=基于 Nuxt 3 的技术博客
NUXT_PUBLIC_APP_URL=http://localhost:3000

````

### 3. 设置 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 在 Supabase 控制台的 SQL 编辑器中运行 `supabase/schema.sql` 文件中的 SQL 代码
3. 在 Supabase 控制台的 Authentication > Settings 中配置你的网站 URL

### 4. 初始化数据库（可选）

运行数据库初始化脚本，插入测试数据并验证全文搜索功能：

```bash
node scripts/init-db.js
````

### 5. 启动开发服务器

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
├── components/             # Vue 组件
│   ├── AppHeader.vue       # 网站头部导航
│   ├── AppFooter.vue       # 网站底部
│   ├── BlogPostCard.vue    # 文章卡片组件
│   ├── BlogPostCardSkeleton.vue # 文章卡片骨架屏
│   ├── BlogContentRenderer.vue # 文章内容渲染器
│   ├── MarkdownEditor.vue  # Markdown编辑器
│   ├── Toast.vue           # 提示消息组件
│   ├── AvatarUploader.vue  # 头像上传组件
│   ├── ImageUploader.vue   # 图片上传组件
│   ├── OptimizedImage.vue  # 优化图片组件
│   ├── SearchModal.vue     # 搜索模态框
│   ├── ShareButton.vue     # 分享按钮
│   ├── BackToTop.vue       # 返回顶部按钮
│   ├── EmptyState.vue      # 空状态组件
│   ├── InstallPrompt.vue   # PWA 安装提示
│   └── OfflineIndicator.vue # 离线指示器
├── composables/            # 组合式函数
│   ├── useBlogPosts.ts     # 博客文章相关操作（包含全文搜索）
│   ├── useSupabase.ts      # Supabase认证相关
│   ├── useToast.ts         # 提示消息管理
│   ├── useDraft.ts         # 草稿自动保存
│   ├── useInfiniteScroll.ts # 无限滚动
│   ├── usePullToRefresh.ts # 下拉刷新
│   ├── useShare.ts         # 分享功能
│   ├── usePWA.ts           # PWA 功能
│   ├── useTouch.ts         # 触摸优化
│   ├── useKeyboardInput.ts # 键盘输入优化
│   └── useAdmin.ts         # 管理员功能
├── layouts/                # 布局组件
│   └── default.vue         # 默认布局
├── pages/                   # 页面路由
│   ├── index.vue           # 首页
│   ├── blog/                # 博客相关页面
│   │   ├── index.vue        # 博客列表页
│   │   ├── [slug].vue       # 文章详情页
│   │   ├── create.vue       # 创建文章
│   │   └── edit/[id].vue    # 编辑文章
│   ├── category/[slug].vue # 分类页面
│   ├── authors/            # 作者相关页面
│   │   ├── index.vue       # 作者列表
│   │   └── [id].vue        # 作者详情
│   ├── auth/               # 认证相关页面
│   │   ├── login.vue       # 登录页面
│   │   └── callback.vue    # OAuth 回调页面
│   ├── admin.vue           # 管理后台
│   ├── profile.vue         # 用户资料
│   ├── my-blogs.vue        # 我的博客
│   ├── about.vue           # 关于页面
│   ├── contact.vue         # 联系页面
│   ├── privacy.vue         # 隐私政策
│   └── terms.vue           # 服务条款
├── middleware/             # 路由中间件
│   ├── auth.ts              # 认证中间件
│   └── admin.ts             # 管理员中间件
├── plugins/                 # Nuxt 插件
│   └── init-profile.client.ts # 用户资料初始化
├── scripts/                 # 脚本文件
│   ├── init-db.js          # 数据库初始化脚本
│   ├── clear-db.js         # 数据库清理脚本
│   ├── generate-pwa-icons.js # PWA 图标生成脚本
│   └── clear-cache.js      # 缓存清理脚本
├── server/                  # 服务器API
│   ├── middleware/         # 服务器中间件
│   │   └── sw-handler.ts   # Service Worker 处理
│   └── routes/             # 服务器路由
│       ├── robots.txt.ts   # Robots.txt 生成
│       └── sitemap.xml.ts  # Sitemap 生成
├── supabase/                # Supabase相关
│   └── schema.sql          # 数据库Schema（包含全文搜索）
├── types/                   # TypeScript类型定义
│   ├── blog.ts             # 博客相关类型
│   └── database.types.ts   # 数据库类型
├── nuxt.config.ts          # Nuxt配置
├── tailwind.config.js       # Tailwind配置
├── package.json            # 项目依赖
└── README.md               # 项目说明
```

## 可用脚本

### 开发相关

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm generate` - 生成静态网站
- `pnpm preview` - 预览生产构建

### 代码质量

- `pnpm lint` - 运行 ESLint 检查
- `pnpm lint:fix` - 自动修复 ESLint 错误
- `pnpm format` - 格式化代码
- `pnpm type-check` - TypeScript 类型检查

### 数据库脚本

- `node scripts/init-db.js` - 初始化数据库并插入测试数据
- `node scripts/clear-db.js` - 清理数据库数据

### PWA 相关

- `pnpm generate-icons` - 生成 PWA 图标
- `pnpm clear-cache` - 清理缓存

## 核心功能

### 全文搜索

项目实现了基于 PostgreSQL 全文搜索的高性能搜索功能：

- 自动生成和维护搜索向量
- 支持标题、摘要、内容和标签的全文搜索
- 相关性排序（标题权重最高）
- GIN 索引优化搜索性能
- 搜索向量在数据插入和更新时自动维护

### 文章管理

- 创建、编辑、删除文章
- 文章发布状态控制
- 分类和标签管理
- 封面图片支持
- Markdown 格式支持

### 用户系统

- 用户注册和登录（邮箱/密码）
- GitHub OAuth 登录
- 用户资料管理（头像、简介等）
- 管理员权限控制
- 行级安全策略（RLS）
- 作者页面展示
- 我的博客管理

### 互动功能

- 文章评论
- 文章点赞
- 评论和点赞数量统计
- 文章分享（Web Share API）
- 作者页面展示
- 阅读量统计
- 热门文章排行（实时热度计算）

### 用户体验优化

- 草稿自动保存（每 30 秒自动保存，防止内容丢失）
- 无限滚动加载文章列表
- 下拉刷新功能
- 搜索模态框（快捷键支持）
- 返回顶部按钮
- 骨架屏加载状态
- 空状态提示
- 图片优化和懒加载
- 触摸手势优化
- 键盘快捷键支持

### SEO 和可发现性

- 自动生成 Sitemap.xml
- Robots.txt 配置
- 结构化数据支持
- Open Graph 标签
- 移动端优化

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 控制台添加环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SECRET_KEY` (或 `SUPABASE_SERVICE_KEY`，已弃用)
4. 部署项目

### 其他平台

本项目可以部署到任何支持 Node.js 的平台，如 Netlify、Heroku、AWS 等。

### 环境变量配置

部署时需要配置以下环境变量：

```env
# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SECRET_KEY=your-supabase-service-role-key

# 应用配置
NUXT_PUBLIC_APP_NAME=技术博客
NUXT_PUBLIC_APP_DESCRIPTION=基于 Nuxt 3 的技术博客
NUXT_PUBLIC_APP_URL=https://your-domain.com

# 可选配置
NUXT_PUBLIC_COMMENTS_ENABLED=true
NUXT_PUBLIC_ANALYTICS_ENABLED=false
```

## 数据库

### 表结构

- `blog_posts` - 博客文章表（包含全文搜索向量）
- `profiles` - 用户资料表
- `comments` - 评论表
- `likes` - 点赞表

### 全文搜索

数据库使用 PostgreSQL 的全文搜索功能，包括：

- `blog_posts_search_vector()` 函数 - 生成搜索向量
- `search_blog_posts()` 函数 - 执行搜索并返回相关性排序结果
- GIN 索引 - 优化搜索性能

详细说明请参考 `supabase/schema.sql` 文件。

## 开发指南

### 环境要求

- Node.js 16.x 或更高版本
- pnpm 包管理器
- Supabase 账户

### 开发流程

1. 克隆项目
2. 安装依赖：`pnpm install`
3. 配置环境变量（复制 `.env.example` 为 `.env`）
4. 初始化数据库：在 Supabase 控制台运行 `supabase/schema.sql`
5. （可选）初始化测试数据：`node scripts/init-db.js`
6. 启动开发服务器：`pnpm dev`
7. 访问 [http://localhost:3000](http://localhost:3000)

### GitHub OAuth 登录配置

1. 在 GitHub 创建 OAuth App
2. 在 Supabase 控制台配置 GitHub Provider
3. 设置回调 URL
4. 详细步骤请参考 [GitHub OAuth 设置文档](./doc/GITHUB_OAUTH_SETUP.md)

## 文档

更多详细文档请参考：

- [技术栈文档](./doc/Nuxt3技术栈文档.md) - 详细的技术栈和架构说明
- [Vercel 部署指南](./doc/VERCEL_DEPLOYMENT.md) - Vercel 部署配置和环境变量设置
- [PWA 和移动端优化](./doc/PWA_MOBILE_OPTIMIZATION.md) - PWA 功能和移动端优化实现
- [PWA 图标说明](./doc/PWA图标说明.md) - PWA 图标生成和使用说明
- [草稿自动保存](./doc/DRAFT_AUTOSAVE.md) - 草稿自动保存功能说明
- [热门文章功能](./doc/HOT_POSTS_USAGE.md) - 热门文章功能使用指南
- [热门文章实现方案](./doc/HOT_POSTS_IMPLEMENTATION.md) - 热门文章完整实现方案
- [应用层缓存实现](./doc/CACHE_IMPLEMENTATION.md) - 缓存方案设计和实现说明
- [缓存使用示例](./doc/CACHE_USAGE_EXAMPLES.md) - 缓存 API 使用示例
- [功能路线图](./doc/FEATURE_ROADMAP.md) - 功能规划和优先级
- [GitHub OAuth 设置](./doc/GITHUB_OAUTH_SETUP.md) - GitHub OAuth 登录配置
- [GitHub OAuth 故障排除](./doc/GITHUB_OAUTH_TROUBLESHOOTING.md) - GitHub 登录问题排查
- [GitHub 登录用户创建博客](./doc/GITHUB_LOGIN_BLOG_CREATION.md) - GitHub 登录用户功能说明
- [键盘输入优化](./doc/KEYBOARD_INPUT_OPTIMIZATION.md) - 键盘输入优化说明
- [移动端优化建议](./doc/MOBILE_OPTIMIZATION_RECOMMENDATIONS.md) - 移动端优化建议
- [移动端优化总结](./doc/MOBILE_OPTIMIZATION_SUMMARY.md) - 移动端优化总结
- [触摸优化](./doc/TOUCH_OPTIMIZATION.md) - 触摸手势优化说明

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
