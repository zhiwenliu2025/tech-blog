<template>
  <div class="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
    <Toast />
    <SpeedInsights />
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'

// 使用 Tailwind CSS 的暗色模式 + 全局 canonical
const config = useRuntimeConfig()
const route = useRoute()

const canonicalUrl = computed(() => {
  // 基础站点地址（去掉末尾 /）
  const baseUrl = (config.public.appUrl || '').replace(/\/+$/, '')
  // 当前路径（去掉查询参数和 hash）
  const path = route.path || '/'
  return `${baseUrl}${path}`
})

useHead({
  htmlAttrs: {
    class: 'scroll-smooth'
  },
  bodyAttrs: {
    class: 'antialiased'
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ]
})
</script>
