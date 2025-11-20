<template>
  <div class="animate-pulse">
    <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <!-- 封面图占位符 -->
      <div class="h-48 bg-gray-200 dark:bg-gray-700" />

      <!-- 内容占位符 -->
      <div class="p-6">
        <!-- 分类和日期占位符 -->
        <div class="mb-2 flex items-center">
          <div class="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div class="ml-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- 标题占位符 -->
        <div class="mb-2 h-6 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

        <!-- 摘要占位符 -->
        <div class="mb-4 space-y-2">
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- 标签占位符 -->
        <div class="mb-4 flex space-x-2">
          <div class="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-6 w-14 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- 元信息占位符 -->
        <div class="flex items-center justify-between">
          <div class="flex space-x-4">
            <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这是一个加载状态组件，不需要任何逻辑
</script>
