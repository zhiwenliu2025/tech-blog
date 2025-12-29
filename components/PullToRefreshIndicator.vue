<template>
  <div
    v-if="pullDistance > 0"
    class="fixed left-0 right-0 top-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-800/90"
    :style="{
      transform: `translateY(${pullDistance}px)`,
      height: `${Math.min(pullDistance, threshold)}px`
    }"
  >
    <div class="flex flex-col items-center gap-2">
      <Icon
        name="heroicons:arrow-down"
        class="h-6 w-6 text-primary-600 transition-transform dark:text-primary-400"
        :class="{ 'rotate-180': pullDistance >= threshold }"
      />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ pullDistance >= threshold ? '释放刷新' : '下拉刷新' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pullDistance: number
  threshold: number
}

defineProps<Props>()
</script>
