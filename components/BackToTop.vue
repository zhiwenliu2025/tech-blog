<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="showButton"
      class="touch-optimized touch-feedback fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <Icon name="heroicons:arrow-up" class="h-6 w-6" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const showButton = ref(false)
const scrollThreshold = 400

const checkScrollPosition = () => {
  if (typeof window === 'undefined') return
  showButton.value = window.scrollY > scrollThreshold
}

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', checkScrollPosition, { passive: true })
  checkScrollPosition()
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', checkScrollPosition)
})
</script>

<style scoped>
/* 移动端优化 */
@media (max-width: 768px) {
  button {
    bottom: 1.5rem;
    right: 1.5rem;
    height: 3rem;
    width: 3rem;
    /* 确保触摸区域足够大 */
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
