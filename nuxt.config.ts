// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    // 只在生产环境启用 PWA
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : [])
  ],

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

  // Color mode（暗黑模式）
  colorMode: {
    preference: 'system', // 默认跟随系统
    fallback: 'light', // 系统不支持时回退到浅色
    classSuffix: '', // 使用 .dark 类（配合 TailwindCSS）
    storageKey: 'nuxt-color-mode' // 本地存储键名
  },

  // Supabase
  supabase: {
    redirect: false,
    // 使用 NUXT_PUBLIC_ 前缀的环境变量，确保在客户端和服务端都能访问
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY,
    // 注意：@nuxtjs/supabase 模块会检查环境变量 SUPABASE_SERVICE_KEY，如果存在会发出警告
    // 请确保在 .env 文件中使用 SUPABASE_SECRET_KEY 而不是 SUPABASE_SERVICE_KEY
    serviceKey: process.env.SUPABASE_SECRET_KEY
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY,

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

  // PWA Configuration (仅在生产环境生效)
  // @ts-ignore - PWA module types
  ...(process.env.NODE_ENV === 'production'
    ? {
        pwa: {
          registerType: 'autoUpdate',
          // 确保 manifest 文件正确生成
          manifestFilename: 'manifest.webmanifest',
          strategies: 'generateSW',
          workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp,woff,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'supabase-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 // 24 hours
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  }
                }
              }
            ]
          },
          client: {
            installPrompt: true,
            periodicSyncForUpdates: 20
          },
          devOptions: {
            enabled: false,
            suppressWarnings: true,
            navigateFallbackAllowlist: [/^\/$/],
            type: 'module'
          },
          manifest: {
            name: '技术博客',
            short_name: '技术博客',
            description: '基于 Nuxt 3 的现代化技术博客系统',
            theme_color: '#3b82f6',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            id: '/',
            icons: [
              {
                src: '/pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png'
              },
              {
                src: '/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: '/maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ]
          }
        }
      }
    : {}),

  // App config
  app: {
    head: {
      title: '技术博客',
      titleTemplate: '%s | 技术博客',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
        },
        { name: 'description', content: '基于 Nuxt 3 的技术博客' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: '技术博客' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // 只在生产环境添加 manifest 链接
        ...(process.env.NODE_ENV === 'production'
          ? [{ rel: 'manifest', href: '/manifest.webmanifest' }]
          : []),
        // DNS 预解析 - 提升外部资源加载速度
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        // 预连接关键资源
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ]
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
    moduleSideEffects: ['@supabase/supabase-js'],
    // 外部依赖 - 不打包这些模块，而是从 node_modules 加载
    externals: {
      inline: [
        // 内联这些包以避免运行时错误
        'unhead',
        '@unhead/vue',
        '@unhead/ssr'
      ]
    },
    // 压缩配置
    compressPublicAssets: true,
    // 移动端优化 - 启用 gzip 压缩
    minify: true
  },

  // 性能优化
  experimental: {
    // 启用 payload 提取,减少 HTML 大小
    payloadExtraction: true
  },

  // TypeScript 配置
  typescript: {
    tsConfig: {
      include: ['types/**/*.d.ts']
    }
  }
})
