<template>
  <div class="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
    <AppHeader />
    <main class="container mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <slot />
    </main>
    <AppFooter />
    <Toast />
  </div>
</template>

<script setup lang="ts">
// 使用 Tailwind CSS 的暗色模式
useHead({
  htmlAttrs: {
    class: 'scroll-smooth'
  },
  bodyAttrs: {
    class: 'antialiased'
  }
})
</script>
