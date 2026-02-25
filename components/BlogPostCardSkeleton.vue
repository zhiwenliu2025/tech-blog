<template>
  <div
    class="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- 封面图占位符 -->
    <div class="h-44 bg-gray-100 dark:bg-gray-800 sm:h-48" />

    <!-- 内容占位符 -->
    <div class="p-4 sm:p-5">
      <!-- 元信息占位符 -->
      <div class="mb-3 flex items-center gap-3">
        <div class="h-4 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div class="h-4 w-20 rounded-md bg-gray-100 dark:bg-gray-800" />
      </div>

      <!-- 标题占位符 -->
      <div class="mb-1.5 h-5 rounded-md bg-gray-100 dark:bg-gray-800" />
      <div class="mb-3 h-5 w-2/3 rounded-md bg-gray-100 dark:bg-gray-800" />

      <!-- 摘要占位符 -->
      <div class="mb-3.5 space-y-2">
        <div class="h-3.5 rounded-md bg-gray-100 dark:bg-gray-800" />
        <div class="h-3.5 w-5/6 rounded-md bg-gray-100 dark:bg-gray-800" />
      </div>

      <!-- 标签占位符 -->
      <div class="mb-3.5 flex gap-1.5">
        <div class="h-5 w-12 rounded-md bg-gray-100 dark:bg-gray-800" />
        <div class="h-5 w-16 rounded-md bg-gray-100 dark:bg-gray-800" />
        <div class="h-5 w-10 rounded-md bg-gray-100 dark:bg-gray-800" />
      </div>

      <!-- 底部占位符 -->
      <div
        class="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800"
      >
        <div class="flex gap-3">
          <div class="h-3.5 w-10 rounded-md bg-gray-100 dark:bg-gray-800" />
          <div class="h-3.5 w-8 rounded-md bg-gray-100 dark:bg-gray-800" />
        </div>
        <div class="h-3.5 w-12 rounded-md bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这是一个加载状态组件，不需要任何逻辑
</script>
