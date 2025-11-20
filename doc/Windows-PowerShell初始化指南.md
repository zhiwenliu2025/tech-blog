# Nuxt 3技术博客项目初始化指南 (Windows PowerShell版)

本文档提供了在Windows PowerShell环境中手动初始化Nuxt 3技术博客项目的详细步骤和脚本。

## 系统要求

- Windows 10/11
- PowerShell 5.1 或更高版本
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

## 项目概述

本项目使用以下技术栈：

- **前端框架**: Nuxt 3 (基于Vue 3)
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **后端服务**: Supabase (数据库、认证、存储)
- **富文本编辑器**: TipTap
- **状态管理**: Pinia
- **内容管理**: Nuxt Content

## 初始化步骤

### 1. 创建项目目录

打开PowerShell，执行以下命令：

```powershell
# 创建并进入项目目录
mkdir nuxt-tech-blog
cd nuxt-tech-blog
```

### 2. 初始化Nuxt 3项目

```powershell
# 使用nuxi创建Nuxt 3项目
npx nuxi@latest init .
```

### 3. 安装基础依赖

```powershell
# 安装基础依赖
npm install
```

### 4. 安装项目特定依赖

```powershell
# 安装核心依赖
npm install @nuxtjs/tailwindcss @nuxtjs/supabase @pinia/nuxt @vueuse/nuxt
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image
npm install @supabase/supabase-js @supabase/auth-helpers-nuxt
npm install @nuxt/image @nuxt/content
npm install fuse.js jsdom

# 安装开发依赖
npm install -D @types/jsdom
```

### 5. 创建项目目录结构

```powershell
# 创建必要的目录结构
mkdir components\ui
mkdir components\editor
mkdir components\layout
mkdir composables
mkdir stores
mkdir types
mkdir utils
mkdir middleware
mkdir server\api
mkdir assets\css
```

### 6. 配置环境变量

创建 `.env.local` 文件：

```powershell
# 创建环境变量文件
New-Item -Path ".env.local" -ItemType File -Value @"
# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# 站点配置
NUXT_PUBLIC_SITE_NAME="技术博客"
NUXT_PUBLIC_SITE_DESCRIPTION="基于Nuxt 3的技术博客系统"
"@ -Encoding utf8
```

### 7. 配置Nuxt

创建 `nuxt.config.ts` 文件：

```powershell
# 创建Nuxt配置文件
New-Item -Path "nuxt.config.ts" -ItemType File -Value @"
export default defineNuxtConfig({
  // 模块
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/content',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image'
  ],

  // 运行时配置
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || '技术博客',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || '基于Nuxt 3的技术博客系统'
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
"@ -Encoding utf8
```

### 8. 配置Tailwind CSS

创建 `tailwind.config.js` 文件：

```powershell
# 创建Tailwind配置文件
New-Item -Path "tailwind.config.js" -ItemType File -Value @"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
"@ -Encoding utf8
```

### 9. 创建主CSS文件

创建 `assets/css/main.css` 文件：

```powershell
# 创建主CSS文件
New-Item -Path "assets\css\main.css" -ItemType File -Value @"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }

  .btn-secondary {
    @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
  }

  .card {
    @apply bg-white overflow-hidden shadow rounded-lg;
  }
}
"@ -Encoding utf8
```

### 10. 创建类型定义

创建 `types/index.ts` 文件：

```powershell
# 创建类型定义文件
New-Item -Path "types\index.ts" -ItemType File -Value @"
export interface User {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
}

export interface Post {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  published: boolean
  tags: string[]
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
  author?: User
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
  author?: User
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}
"@ -Encoding utf8
```

### 11. 创建认证组合式函数

创建 `composables/useAuth.ts` 文件：

```powershell
# 创建认证组合式函数
New-Item -Path "composables\useAuth.ts" -ItemType File -Value @"
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

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (!error) user.value = data.user
    return { data, error }
  }

  const signOut = async () => {
    await client.auth.signOut()
    user.value = null
    await navigateTo('/auth/signin')
  }

  const signInWithProvider = async (provider: 'github' | 'google') => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `\${window.location.origin}/auth/callback`
      }
    })

    return { data, error }
  }

  // 监听认证状态变化
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      user.value = session.user
    } else if (event === 'SIGNED_OUT') {
      user.value = null
    }
  })

  return {
    user: readonly(user),
    signIn,
    signUp,
    signOut,
    signInWithProvider
  }
}
"@ -Encoding utf8
```

### 12. 创建博客文章组合式函数

创建 `composables/usePosts.ts` 文件：

```powershell
# 创建博客文章组合式函数
New-Item -Path "composables\usePosts.ts" -ItemType File -Value @"
import type { Post } from '~/types'

export const usePosts = () => {
  const client = useSupabaseClient()

  const getPosts = async (publishedOnly = true, limit = 10) => {
    let query = client
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (data) {
      return data.map(post => ({
        ...post,
        author: post.profiles
      })) as Post[]
    }

    return []
  }

  const getPostBySlug = async (slug: string) => {
    const { data, error } = await client
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .eq('slug', slug)
      .single()

    if (data) {
      return {
        ...data,
        author: data.profiles
      } as Post
    }

    return null
  }

  const createPost = async (post: Partial<Post>) => {
    const { data, error } = await client
      .from('posts')
      .insert({
        ...post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    return { data, error }
  }

  const updatePost = async (id: string, post: Partial<Post>) => {
    const { data, error } = await client
      .from('posts')
      .update({
        ...post,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  const deletePost = async (id: string) => {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id)

    return { error }
  }

  const incrementViewCount = async (id: string) => {
    await client.rpc('increment_view_count', { post_id: id })
  }

  return {
    getPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    incrementViewCount
  }
}
"@ -Encoding utf8
```

### 13. 创建工具函数

创建 `utils/index.ts` 文件：

```powershell
# 创建工具函数
New-Item -Path "utils\index.ts" -ItemType File -Value @"
export const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return new Date(date).toLocaleDateString('zh-CN', options)
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格和下划线替换为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const readingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
"@ -Encoding utf8
```

### 14. 创建主布局

创建 `layouts/default.vue` 文件：

```powershell
# 创建主布局
New-Item -Path "layouts\default.vue" -ItemType File -Value @"
<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 获取站点配置
const config = useRuntimeConfig()
const siteName = config.public.siteName
const siteDescription = config.public.siteDescription

// 设置页面元数据
useHead({
  titleTemplate: \`%s - \${siteName}\`,
  meta: [
    { name: 'description', content: siteDescription }
  ]
})
</script>
"@ -Encoding utf8
```

### 15. 创建页头组件

创建 `components/AppHeader.vue` 文件：

```powershell
# 创建页头组件
New-Item -Path "components\AppHeader.vue" -ItemType File -Value @"
<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            {{ siteName }}
          </NuxtLink>
        </div>
        <nav class="hidden md:flex space-x-8">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-primary-600 border-b-2 border-primary-600': \$route.path === item.to }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>
        <div class="flex items-center space-x-4">
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <Icon v-if="isDark" name="heroicons:sun" class="h-5 w-5" />
            <Icon v-else name="heroicons:moon" class="h-5 w-5" />
          </button>
          <div v-if="user" class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <img
                v-if="user.user_metadata.avatar_url"
                :src="user.user_metadata.avatar_url"
                :alt="user.user_metadata.full_name || user.email"
                class="h-8 w-8 rounded-full"
              />
              <div v-else class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                {{ (user.user_metadata.full_name || user.email || '').charAt(0).toUpperCase() }}
              </div>
            </button>
            <div
              v-if="isUserMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50"
            >
              <NuxtLink
                to="/dashboard"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isUserMenuOpen = false"
              >
                控制面板
              </NuxtLink>
              <button
                @click="handleSignOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                退出登录
              </button>
            </div>
          </div>
          <div v-else class="flex space-x-4">
            <NuxtLink
              to="/auth/signin"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              登录
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="btn btn-primary"
            >
              注册
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth()
const config = useRuntimeConfig()
const siteName = config.public.siteName

const isDark = ref(false)
const isUserMenuOpen = ref(false)

const navigation = [
  { name: '首页', to: '/' },
  { name: '文章', to: '/posts' },
  { name: '标签', to: '/tags' },
  { name: '关于', to: '/about' }
]

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  // 这里可以集成实际的暗色模式逻辑
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleSignOut = async () => {
  await signOut()
  isUserMenuOpen.value = false
}

// 点击外部关闭用户菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isUserMenuOpen.value = false
    }
  })
})
</script>
"@ -Encoding utf8
```

### 16. 创建页脚组件

创建 `components/AppFooter.vue` 文件：

```powershell
# 创建页脚组件
New-Item -Path "components\AppFooter.vue" -ItemType File -Value @"
<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ siteName }}</h3>
          <p class="text-gray-600 mb-4">{{ siteDescription }}</p>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">GitHub</span>
              <Icon name="simple-icons:github" class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <Icon name="simple-icons:twitter" class="h-6 w-6" />
            </a>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">导航</h3>
          <ul class="space-y-4">
            <li v-for="item in navigation" :key="item.name">
              <NuxtLink :to="item.to" class="text-base text-gray-500 hover:text-gray-900">
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">法律</h3>
          <ul class="space-y-4">
            <li>
              <NuxtLink to="/privacy" class="text-base text-gray-500 hover:text-gray-900">
                隐私政策
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-base text-gray-500 hover:text-gray-900">
                服务条款
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 border-t border-gray-200 pt-8">
        <p class="text-base text-gray-400 text-center">
          &copy; {{ currentYear }} {{ siteName }}. 保留所有权利.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteName = config.public.siteName
const siteDescription = config.public.siteDescription

const currentYear = new Date().getFullYear()

const navigation = [
  { name: '首页', to: '/' },
  { name: '文章', to: '/posts' },
  { name: '标签', to: '/tags' },
  { name: '关于', to: '/about' }
]
</script>
"@ -Encoding utf8
```

### 17. 创建首页

创建 `pages/index.vue` 文件：

```powershell
# 创建首页
New-Item -Path "pages\index.vue" -ItemType File -Value @"
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
        <span class="block">欢迎来到</span>
        <span class="block text-primary-600">{{ siteName }}</span>
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        {{ siteDescription }}
      </p>
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <div class="rounded-md shadow">
          <NuxtLink to="/posts" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
            浏览文章
          </NuxtLink>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <NuxtLink to="/about" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            了解更多
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 最新文章 -->
    <div class="mt-16">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">最新文章</h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          探索最新的技术文章和教程
        </p>
      </div>
      <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
      <div class="mt-12 text-center">
        <NuxtLink to="/posts" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          查看所有文章
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteName = config.public.siteName
const siteDescription = config.public.siteDescription

// 获取最新文章
const { getPosts } = usePosts()
const posts = await getPosts(true, 6) // 获取6篇已发布的文章

// 设置页面元数据
useHead({
  title: '首页',
  meta: [
    { name: 'description', content: siteDescription }
  ]
})
</script>
"@ -Encoding utf8
```

### 18. 创建文章卡片组件

创建 `components/PostCard.vue` 文件：

```powershell
# 创建文章卡片组件
New-Item -Path "components\PostCard.vue" -ItemType File -Value @"
<template>
  <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
    <div class="flex-shrink-0">
      <img
        v-if="post.cover_image_url"
        class="h-48 w-full object-cover"
        :src="post.cover_image_url"
        :alt="post.title"
      />
      <div v-else class="h-48 w-full bg-gray-200 flex items-center justify-center">
        <Icon name="heroicons:document-text" class="h-12 w-12 text-gray-400" />
      </div>
    </div>
    <div class="flex-1 bg-white p-6 flex flex-col justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-primary-600">
          <span v-for="(tag, index) in post.tags" :key="index">
            {{ tag }}
            <span v-if="index < post.tags.length - 1">, </span>
          </span>
        </p>
        <NuxtLink :to="\`/posts/\${post.slug}\`" class="block mt-2">
          <p class="text-xl font-semibold text-gray-900">{{ post.title }}</p>
          <p class="mt-3 text-base text-gray-500">{{ post.excerpt }}</p>
        </NuxtLink>
      </div>
      <div class="mt-6 flex items-center">
        <div class="flex-shrink-0">
          <span class="sr-only">作者</span>
          <img
            v-if="post.author?.avatar_url"
            class="h-10 w-10 rounded-full"
            :src="post.author.avatar_url"
            :alt="post.author.username || post.author.full_name"
          />
          <div v-else class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
            {{ (post.author?.username || post.author?.full_name || '').charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            {{ post.author?.username || post.author?.full_name || '匿名' }}
          </p>
          <div class="flex space-x-1 text-sm text-gray-500">
            <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{{ readingTime(post.content) }} 分钟阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

defineProps<{
  post: Post
}>()

const { formatDate, readingTime } = useUtils()
</script>
"@ -Encoding utf8
```

## 启动项目

完成以上步骤后，您可以通过以下命令启动开发服务器：

```powershell
# 启动开发服务器
npm run dev
```

## 配置Supabase

1. 访问 [Supabase](https://supabase.com/) 并创建一个新项目
2. 在Supabase项目中创建以下表：

```sql
-- 用户资料表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- 文章表
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞表
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 创建函数：增加文章浏览量
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 设置行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 用户资料表策略
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 文章表策略
CREATE POLICY "Published posts are viewable by everyone" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Users can view own posts" ON posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- 评论表策略
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- 点赞表策略
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);
```

3. 在Supabase项目的设置中找到API密钥
4. 更新项目中的 `.env.local` 文件，填入您的Supabase URL和密钥

## 后续开发

项目基础结构已经搭建完成，您可以继续开发以下功能：

1. 用户认证页面（登录、注册）
2. 文章管理页面（创建、编辑、删除）
3. 富文本编辑器集成
4. 文章详情页面
5. 评论系统
6. 标签系统
7. 搜索功能
8. 用户个人资料页面

## 部署

项目开发完成后，您可以将其部署到以下平台：

- Vercel（推荐）
- Netlify
- Heroku
- DigitalOcean
- 任何支持Node.js的服务器

## 常见问题

### 1. PowerShell执行策略问题

如果遇到"无法加载文件...因为在此系统上禁止运行脚本"的错误，请执行以下命令：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. 依赖安装失败

如果依赖安装失败，可以尝试以下解决方案：

```powershell
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 重新安装依赖
npm install
```

### 3. TypeScript类型错误

如果遇到TypeScript类型错误，可以尝试：

```powershell
# 重新生成类型
npx nuxi typecheck
```

## 总结

通过以上步骤，您已经成功创建了一个基于Nuxt 3、TypeScript、Tailwind CSS和Supabase的技术博客项目。这个项目具有现代化的技术栈，支持在线编辑和内容导入功能，并且具有良好的可扩展性。

如果您需要进一步的帮助或有任何问题，请随时查阅相关文档或联系技术支持。
