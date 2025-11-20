# Nuxt 3技术博客技术栈文档

## 概述

本文档介绍了一个基于Nuxt 3、TypeScript、Tailwind CSS和Supabase构建的现代化技术博客系统。该系统支持在线编辑博客内容、从其他资源导入博客内容，并针对Vercel部署进行了优化。

## 技术栈详情

### 前端框架

#### Nuxt 3
- **版本**: 最新稳定版
- **渲染模式**: 混合渲染（SSR + SSG + CSR）
- **特性**:
  - 基于Vue 3的Composition API
  - 内置TypeScript支持
  - 文件系统路由
  - 自动代码分割
  - 服务端组件支持
  - Nitro引擎提供高性能服务端渲染

#### Vue 3
- **版本**: 3.3+
- **核心特性**:
  - Composition API
  - 更好的TypeScript集成
  - 性能优化
  - 更小的包体积

### 样式框架

#### Tailwind CSS
- **版本**: 3.3+
- **集成方式**: @nuxtjs/tailwindcss模块
- **特性**:
  - 实用优先的CSS框架
  - 响应式设计
  - 暗色模式支持
  - 自定义主题配置

### 数据库与后端服务

#### Supabase
- **服务**: 托管的PostgreSQL数据库 + 实时API
- **特性**:
  - 实时数据同步
  - 内置认证系统
  - 文件存储
  - 边缘函数
  - 自动生成API

#### Prisma (可选)
- **用途**: 类型安全的数据库访问
- **集成**: 与Supabase PostgreSQL配合使用

### 认证与授权

#### Supabase Auth
- **支持方式**: 
  - 邮箱/密码
  - OAuth (GitHub, Google等)
  - 魔法链接
- **特性**:
  - JWT令牌
  - 行级安全策略(RLS)

### 内容编辑

#### 富文本编辑器
- **推荐**: Tiptap
- **特性**:
  - 基于ProseMirror
  - Vue 3兼容
  - 可扩展
  - 支持Markdown

#### Markdown支持
- **库**: @nuxt/content
- **特性**:
  - 文件系统内容管理
  - Markdown解析
  - 语法高亮
  - 查询API

### 部署平台

#### Vercel
- **优势**:
  - 原生Nuxt 3支持
  - 自动CI/CD
  - 边缘函数
  - 全球CDN
  - 无缝Supabase集成

## 项目结构

```
nuxt-tech-blog/
├── components/           # Vue组件
│   ├── ui/              # UI基础组件
│   ├── editor/          # 编辑器组件
│   └── layout/          # 布局组件
├── composables/         # 组合式函数
├── layouts/             # Nuxt布局
├── pages/               # 页面路由
├── plugins/             # Nuxt插件
├── server/              # 服务器API
│   └── api/             # API路由
├── stores/              # Pinia状态管理
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
├── assets/              # 静态资源
├── public/              # 公共资源
├── middleware/          # 路由中间件
├── nuxt.config.ts       # Nuxt配置
├── tailwind.config.js   # Tailwind配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 核心功能实现

### 1. 用户认证

使用Supabase Auth实现用户认证：

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const client = useSupabaseClient()
  const user = useState('user', () => null)
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    })
    
    if (!error) user.value = data.user
    return { data, error }
  }
  
  const signOut = async () => {
    await client.auth.signOut()
    user.value = null
  }
  
  return {
    user,
    signIn,
    signOut
  }
}
```

### 2. 博客文章管理

使用Supabase数据库存储博客文章：

```typescript
// composables/usePosts.ts
export const usePosts = () => {
  const client = useSupabaseClient()
  
  const getPosts = async (publishedOnly = true) => {
    let query = client.from('posts').select('*')
    
    if (publishedOnly) {
      query = query.eq('published', true)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    return { data, error }
  }
  
  const getPostBySlug = async (slug: string) => {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    return { data, error }
  }
  
  const createPost = async (post: PostCreate) => {
    const { data, error } = await client
      .from('posts')
      .insert(post)
      .select()
    
    return { data, error }
  }
  
  return {
    getPosts,
    getPostBySlug,
    createPost
  }
}
```

### 3. 在线编辑器

使用Tiptap实现富文本编辑器：

```vue
<!-- components/editor/TiptapEditor.vue -->
<template>
  <div class="tiptap-editor">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false)
  }
})
</script>
```

### 4. 内容导入功能

实现从微信公众号等平台导入内容：

```typescript
// composables/useContentImport.ts
export const useContentImport = () => {
  const importFromWeChat = async (htmlContent: string) => {
    // 使用jsdom解析HTML内容
    const { JSDOM } = await import('jsdom')
    const dom = new JSDOM(htmlContent)
    const document = dom.window.document
    
    // 提取标题
    const title = document.querySelector('h1, h2, h3')?.textContent || ''
    
    // 提取正文内容
    const contentElement = document.querySelector('.rich_media_content')
    let content = ''
    
    if (contentElement) {
      // 清理微信特定的样式和标签
      content = contentElement.innerHTML
        .replace(/<section[^>]*>/g, '<div>')
        .replace(/<\/section>/g, '</div>')
        .replace(/style="[^"]*"/g, '')
    }
    
    // 提取图片并上传到Supabase存储
    const images = document.querySelectorAll('img')
    for (const img of images) {
      const src = img.getAttribute('data-src') || img.getAttribute('src')
      if (src && src.startsWith('http')) {
        // 下载并上传图片到Supabase
        const newUrl = await uploadImageToSupabase(src)
        img.setAttribute('src', newUrl)
      }
    }
    
    return {
      title,
      content: contentElement?.outerHTML || ''
    }
  }
  
  const uploadImageToSupabase = async (imageUrl: string): Promise<string> => {
    // 下载图片
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    // 上传到Supabase存储
    const client = useSupabaseClient()
    const fileName = `images/${Date.now()}-${Math.random().toString(36).substring(2)}`
    
    const { data } = await client.storage
      .from('blog-images')
      .upload(fileName, blob)
    
    if (data) {
      const { data: { publicUrl } } = client.storage
        .from('blog-images')
        .getPublicUrl(data.path)
      
      return publicUrl
    }
    
    return imageUrl // 如果上传失败，返回原始URL
  }
  
  return {
    importFromWeChat
  }
}
```

## 数据库设计

### Supabase数据库表结构

```sql
-- 用户表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 博客文章表
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞表
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的配置文件
CREATE POLICY "Users can view own profile." ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 所有人可以查看已发布的文章
CREATE POLICY "Anyone can view published posts." ON posts FOR SELECT USING (published = true);

-- 只有作者可以查看自己的未发布文章
CREATE POLICY "Authors can view own posts." ON posts FOR SELECT USING (auth.uid() = author_id);

-- 只有作者可以创建和修改自己的文章
CREATE POLICY "Authors can create posts." ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts." ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts." ON posts FOR DELETE USING (auth.uid() = author_id);

-- 所有人可以查看评论
CREATE POLICY "Anyone can view comments." ON comments FOR SELECT USING (true);

-- 只有登录用户可以创建评论
CREATE POLICY "Authenticated users can create comments." ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 只有作者可以修改自己的评论
CREATE POLICY "Authors can update own comments." ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments." ON comments FOR DELETE USING (auth.uid() = author_id);

-- 所有人可以查看点赞
CREATE POLICY "Anyone can view likes." ON likes FOR SELECT USING (true);

-- 只有登录用户可以创建和删除自己的点赞
CREATE POLICY "Authenticated users can create likes." ON likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own likes." ON likes FOR DELETE USING (auth.uid() = user_id);
```

## 部署配置

### Vercel配置

```json
// vercel.json
{
  "buildCommand": "nuxt build",
  "devCommand": "nuxt dev",
  "installCommand": "npm install",
  "framework": "nuxtjs",
  "functions": {
    "server/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

### Nuxt配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 模块
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/content',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // 运行时配置
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    public: {
      siteName: '技术博客',
      siteDescription: '基于Nuxt 3的技术博客系统'
    }
  },

  // CSS配置
  css: ['~/assets/css/main.css'],

  // 构建配置
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },

  // 内容配置
  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'vue', 'bash']
    }
  },

  // 应用配置
  app: {
    head: {
      title: '技术博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于Nuxt 3的技术博客系统' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
```

## 性能优化

### 1. 图片优化

使用Nuxt Image模块优化图片加载：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    // ...其他模块
  ],
  image: {
    supabase: {
      baseURL: process.env.SUPABASE_URL + '/storage/v1/render/image/public'
    }
  }
})
```

### 2. 代码分割

利用Nuxt 3的自动代码分割和动态导入：

```vue
<!-- 动态导入编辑器组件 -->
<template>
  <div>
    <ClientOnly>
      <LazyTiptapEditor v-model="content" />
    </ClientOnly>
  </div>
</template>
```

### 3. 缓存策略

使用Nitro缓存API响应：

```typescript
// server/api/posts/index.get.ts
export default defineEventHandler(async (event) => {
  const posts = await getPosts()
  
  // 缓存5分钟
  await useStorage('cache').setItem('posts', posts, { ttl: 300 })
  
  return posts
})
```

## 开发工作流

### 1. 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd nuxt-tech-blog

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

### 2. 部署到Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel --prod
```

### 3. 数据库迁移

使用Supabase CLI管理数据库迁移：

```bash
# 安装Supabase CLI
npm install -g supabase

# 登录Supabase
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 应用迁移
supabase db push
```

## 扩展功能

### 1. 搜索功能

使用Fuse.js实现客户端全文搜索：

```typescript
// composables/useSearch.ts
import Fuse from 'fuse.js'

export const useSearch = () => {
  const posts = useState<Post[]>('posts', () => [])
  
  const searchPosts = (query: string) => {
    if (!query.trim()) return posts.value
    
    const fuse = new Fuse(posts.value, {
      keys: ['title', 'excerpt', 'content', 'tags'],
      threshold: 0.3
    })
    
    return fuse.search(query).map(result => result.item)
  }
  
  return {
    searchPosts
  }
}
```

### 2. 评论系统

使用Supabase实时功能实现实时评论：

```vue
<!-- components/Comments.vue -->
<template>
  <div class="comments">
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <p>{{ comment.content }}</p>
      <small>{{ comment.author.username }} - {{ formatDate(comment.created_at) }}</small>
    </div>
    
    <form @submit.prevent="addComment">
      <textarea v-model="newComment" placeholder="添加评论..."></textarea>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const postId = useRoute().params.id as string
const user = useSupabaseUser()

const comments = ref<Comment[]>([])
const newComment = ref('')

// 获取评论
const fetchComments = async () => {
  const { data } = await client
    .from('comments')
    .select('*, profiles(username)')
    .eq('post_id', postId)
    .order('created_at')
  
  comments.value = data || []
}

// 实时监听评论变化
client
  .channel(`comments:${postId}`)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
    (payload) => {
      comments.value.push(payload.new as Comment)
    }
  )
  .subscribe()

// 添加评论
const addComment = async () => {
  if (!user.value || !newComment.value.trim()) return
  
  await client.from('comments').insert({
    post_id: postId,
    author_id: user.value.id,
    content: newComment.value
  })
  
  newComment.value = ''
}

onMounted(fetchComments)
</script>
```

## 总结

这个基于Nuxt 3、TypeScript、Tailwind CSS和Supabase的技术博客系统提供了：

1. **现代化开发体验** - 使用最新的Vue 3生态系统
2. **类型安全** - 全面的TypeScript支持
3. **快速开发** - Nuxt 3的约定优于配置
4. **无服务器后端** - Supabase提供完整的后端服务
5. **优秀的性能** - Nitro引擎和Vercel边缘网络
6. **易于部署** - Vercel一键部署
7. **可扩展性** - 模块化架构，易于添加新功能

这个技术栈特别适合快速构建和部署现代化的技术博客系统，同时保持代码的可维护性和扩展性。