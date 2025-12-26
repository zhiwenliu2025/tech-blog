import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config()

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL
// 优先使用新的 SUPABASE_SECRET_KEY，如果不存在则回退到旧的 SUPABASE_SERVICE_KEY（向后兼容）
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

// 检查必要的环境变量是否存在
if (!supabaseUrl) {
  console.error('错误: SUPABASE_URL 环境变量未设置')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('错误: SUPABASE_SECRET_KEY 或 SUPABASE_SERVICE_KEY 环境变量未设置')
  console.error('提示: SUPABASE_SERVICE_KEY 已弃用，请使用 SUPABASE_SECRET_KEY')
  process.exit(1)
}

// 创建 Supabase 客户端（使用 service key）
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 测试数据
const testPosts = [
  {
    title: 'Vue 3 Composition API 入门指南',
    slug: 'vue3-composition-api-guide',
    excerpt: 'Vue 3 的 Composition API 是一个强大的功能，它允许我们以更灵活的方式组织组件逻辑。',
    content: `# Vue 3 Composition API 入门指南

Vue 3 的 Composition API 是一个强大的功能，它允许我们以更灵活的方式组织组件逻辑。

## 什么是 Composition API？

Composition API 是 Vue 3 中引入的一套新的 API，它提供了一种更灵活的方式来组织组件逻辑。

## 为什么使用 Composition API？

1. **更好的逻辑复用**：通过组合函数实现逻辑复用
2. **更灵活的代码组织**：相关逻辑可以组织在一起
3. **更好的 TypeScript 支持**：提供更好的类型推断

## 基本用法

\`\`\`javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubled,
      increment
    }
  }
}
\`\`\`

## 总结

Composition API 为 Vue 3 带来了更强大的功能和更灵活的代码组织方式。`,
    category: '前端开发',
    tags: ['Vue', 'JavaScript', '前端框架'],
    published: true,
    published_at: new Date().toISOString()
  },
  {
    title: '使用 Nuxt 3 构建全栈应用',
    slug: 'building-fullstack-apps-with-nuxt3',
    excerpt:
      'Nuxt 3 是一个基于 Vue 3 的全栈框架，它提供了许多强大的功能，使开发全栈应用变得更加简单。',
    content: `# 使用 Nuxt 3 构建全栈应用

Nuxt 3 是一个基于 Vue 3 的全栈框架，它提供了许多强大的功能，使开发全栈应用变得更加简单。

## Nuxt 3 的主要特性

1. **服务器端渲染 (SSR)**：提高首屏加载速度和 SEO
2. **静态站点生成 (SSG)**：生成静态 HTML 文件
3. **API 路由**：内置 API 路由支持
4. **文件系统路由**：基于文件系统的自动路由生成
5. **模块化架构**：通过模块扩展功能

## 创建 Nuxt 3 项目

\`\`\`bash
npx nuxi init my-nuxt-app
cd my-nuxt-app
npm install
npm run dev
\`\`\`

## 创建 API 路由

在 \`server/api\` 目录下创建文件：

\`\`\`javascript
// server/api/hello.js
export default defineEventHandler(async (event) => {
  return {
    message: 'Hello from Nuxt 3 API!'
  }
})
\`\`\`

## 总结

Nuxt 3 是一个强大的全栈框架，它使构建全栈应用变得更加简单和高效。`,
    category: '前端开发',
    tags: ['Nuxt', 'Vue', '全栈开发'],
    published: true,
    published_at: new Date().toISOString()
  },
  {
    title: 'Supabase 数据库设计与优化',
    slug: 'supabase-database-design-optimization',
    excerpt:
      'Supabase 是一个开源的 Firebase 替代品，它提供了 PostgreSQL 数据库、身份验证、存储等功能。',
    content: `# Supabase 数据库设计与优化

Supabase 是一个开源的 Firebase 替代品，它提供了 PostgreSQL 数据库、身份验证、存储等功能。

## 数据库设计原则

1. **规范化**：避免数据冗余
2. **索引优化**：提高查询性能
3. **关系设计**：合理使用外键关系
4. **安全性**：使用 RLS (行级安全)

## 创建表

\`\`\`sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 行级安全 (RLS)

\`\`\`sql
-- 启用 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);
\`\`\`

## 优化查询

1. **使用索引**：为常用查询字段创建索引
2. **选择特定字段**：避免 SELECT *
3. **使用连接**：减少查询次数

## 总结

良好的数据库设计和优化是应用性能的关键。`,
    category: '后端开发',
    tags: ['Supabase', '数据库', 'PostgreSQL'],
    published: true,
    published_at: new Date().toISOString()
  },
  {
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-type-techniques',
    excerpt:
      'TypeScript 提供了强大的类型系统，掌握高级类型技巧可以让我们写出更安全、更可维护的代码。',
    content: `# TypeScript 高级类型技巧

TypeScript 提供了强大的类型系统，掌握高级类型技巧可以让我们写出更安全、更可维护的代码。

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type Test1 = IsString<string>  // true
type Test2 = IsString<number>  // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

## 模板字面量类型

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ClickEvent = EventName<'click'>  // 'onClick'
\`\`\`

## 实用工具类型

1. **Pick<T, K>**：选择特定属性
2. **Omit<T, K>**：排除特定属性
3. **Record<K, T>**：创建对象类型
4. **Exclude<T, U>**：排除联合类型中的某些类型

## 总结

掌握 TypeScript 高级类型技巧可以大大提高代码质量和开发效率。`,
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    published: true,
    published_at: new Date().toISOString()
  },
  {
    title: '使用 Docker 部署 Node.js 应用',
    slug: 'deploying-nodejs-apps-with-docker',
    excerpt: 'Docker 是一个开源的容器化平台，它可以让我们轻松地打包、分发和运行应用程序。',
    content: `# 使用 Docker 部署 Node.js 应用

Docker 是一个开源的容器化平台，它可以让我们轻松地打包、分发和运行应用程序。

## Dockerfile 基础

\`\`\`dockerfile
# 使用官方 Node.js 运行时作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["node", "server.js"]
\`\`\`

## 构建和运行

\`\`\`bash
# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run -p 3000:3000 my-node-app
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

## 最佳实践

1. **使用多阶段构建**：减小镜像大小
2. **使用 .dockerignore**：排除不必要的文件
3. **使用非 root 用户**：提高安全性
4. **健康检查**：确保容器正常运行

## 总结

Docker 为 Node.js 应用的部署提供了强大而灵活的解决方案。`,
    category: 'DevOps',
    tags: ['Docker', 'Node.js', '部署'],
    published: true,
    published_at: new Date().toISOString()
  }
]

// 初始化数据库
async function initializeDatabase() {
  try {
    console.log('开始初始化数据库...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key:', supabaseServiceKey.substring(0, 20) + '...')

    console.log('步骤 1: 检查数据库连接...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1)

    if (connectionError) {
      console.error('数据库连接失败:', connectionError)
      console.error('错误详情:', JSON.stringify(connectionError, null, 2))
      return
    }

    console.log('数据库连接成功!')

    console.log('步骤 2: 检查现有数据...')
    // 检查是否已有数据
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    if (countError) {
      console.error('检查数据失败:', countError)
      console.error('错误详情:', JSON.stringify(countError, null, 2))
      return
    }

    console.log(`当前数据库中有 ${count} 篇已发布的文章`)

    if (count > 0) {
      console.log(`数据库中已有 ${count} 篇文章，跳过初始化`)
      console.log('如果需要重新初始化，请先清空数据库中的数据')
      return
    }

    console.log('步骤 3: 准备插入测试数据...')
    console.log(`准备插入 ${testPosts.length} 篇测试文章`)

    // 打印即将插入的文章标题
    testPosts.forEach((post, index) => {
      console.log(`文章 ${index + 1}: ${post.title} (${post.slug})`)
    })

    console.log('步骤 4: 插入测试数据...')
    // 插入测试数据
    const { data, error } = await supabase.from('blog_posts').insert(testPosts).select()

    if (error) {
      console.error('插入数据失败:', error)
      console.error('错误详情:', JSON.stringify(error, null, 2))
      return
    }

    console.log(`成功插入 ${data.length} 篇测试文章`)

    // 打印插入的文章详情
    data.forEach((post, index) => {
      console.log(`已插入文章 ${index + 1}: ${post.title} (ID: ${post.id})`)
    })

    console.log('步骤 5: 验证数据插入结果...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, published')
      .eq('published', true)

    if (verifyError) {
      console.error('验证数据失败:', verifyError)
      console.error('错误详情:', JSON.stringify(verifyError, null, 2))
      return
    }

    console.log(`验证成功: 数据库中现在有 ${verifyData.length} 篇已发布的文章`)

    console.log('步骤 6: 测试全文搜索功能...')
    // 测试全文搜索功能
    try {
      const { data: searchResults, error: searchError } = await supabase.rpc('search_blog_posts', {
        search_query: 'Vue',
        result_limit: 5,
        result_offset: 0
      })

      if (searchError) {
        console.warn('全文搜索功能测试失败:', searchError.message)
        console.warn('这可能是因为搜索函数尚未创建，请确保已运行完整的 schema.sql')
      } else {
        console.log(`全文搜索测试成功: 找到 ${searchResults?.length || 0} 篇相关文章`)
        if (searchResults && searchResults.length > 0) {
          searchResults.forEach((post, index) => {
            console.log(
              `  结果 ${index + 1}: ${post.title} (相关性: ${post.rank?.toFixed(4) || 'N/A'})`
            )
          })
        }
      }
    } catch (searchTestError) {
      console.warn('全文搜索功能测试出错:', searchTestError.message)
      console.warn('请确保已运行完整的 schema.sql 以创建搜索函数和索引')
    }

    console.log('数据库初始化完成!')
  } catch (error) {
    console.error('初始化数据库过程中发生未预期的错误:', error)
    console.error('错误堆栈:', error.stack)
  }
}

// 运行初始化
initializeDatabase()
