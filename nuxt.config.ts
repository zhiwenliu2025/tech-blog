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
    // 显式配置 Supabase URL 和 Key，确保在 Vercel 上正确读取环境变量
    // 注意：不要使用空字符串作为默认值，让模块自己处理 undefined
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
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
