<template>
  <Transition
    enter-active-class="transition-all ease-out duration-300"
    enter-from-class="opacity-0 scale-75"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <div
      v-if="showButton"
      class="group fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2"
    >
      <!-- Tooltip -->
      <div
        class="pointer-events-none translate-y-1 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1 font-mono text-[10px] text-slate-600 opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700/60 dark:bg-slate-900/95 dark:text-slate-400"
      >
        返回顶部
      </div>

      <!-- Button -->
      <button
        class="touch-optimized relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 hover:shadow-xl active:scale-95 dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-primary-500/60 dark:hover:bg-slate-800/90 dark:hover:text-primary-400"
        aria-label="返回顶部"
        @click="scrollToTop"
      >
        <!-- Scroll progress ring -->
        <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" fill="none">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke-width="2.5"
            class="stroke-slate-100 dark:stroke-slate-800"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke-width="2.5"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="stroke-primary-500 transition-[stroke-dashoffset] duration-150 ease-out dark:stroke-primary-400"
          />
        </svg>

        <!-- Arrow icon -->
        <Icon
          name="heroicons:arrow-up"
          class="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showButton = ref(false)
const scrollProgress = ref(0)
const scrollThreshold = 400
const circumference = 2 * Math.PI * 20

const strokeDashoffset = computed(() => circumference * (1 - scrollProgress.value))

const updateScrollState = () => {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  showButton.value = scrollTop > scrollThreshold
  scrollProgress.value = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
}

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', updateScrollState, { passive: true })
  updateScrollState()
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', updateScrollState)
})
</script>
