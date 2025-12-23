// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/icon'],

  // PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  // Tailwind CSS
  tailwindcss: {
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true
  },

  // Supabase
  supabase: {
    redirect: false,
    // 使用 NUXT_PUBLIC_ 前缀的环境变量，确保在客户端和服务端都能访问
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

    // Public keys (exposed to client-side)
    // 使用 NUXT_PUBLIC_ 前缀确保客户端可访问
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME || '技术博客',
      appDescription: process.env.NUXT_PUBLIC_APP_DESCRIPTION || '基于 Nuxt 3 的技术博客',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      commentsEnabled: process.env.NUXT_PUBLIC_COMMENTS_ENABLED === 'true',
      analyticsEnabled: process.env.NUXT_PUBLIC_ANALYTICS_ENABLED === 'true'
    }
  },

  // App config
  app: {
    head: {
      title: '技术博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于 Nuxt 3 的技术博客' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  // Nitro 配置 - 确保正确打包依赖
  nitro: {
    esbuild: {
      options: {
        target: 'node18'
      }
    },
    // 确保 Supabase 依赖被正确打包
    moduleSideEffects: ['@supabase/supabase-js']
  }
})
