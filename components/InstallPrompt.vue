<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-lg md:border"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <Icon
            name="heroicons:device-phone-mobile"
            class="h-6 w-6 text-primary-600 dark:text-primary-400"
          />
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">安装应用</h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            将此应用添加到主屏幕，获得更好的体验
          </p>
          <div class="mt-3 flex space-x-2">
            <button
              class="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              @click="installApp"
            >
              安装
            </button>
            <button
              class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="dismissPrompt"
            >
              稍后
            </button>
          </div>
        </div>
        <button
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="dismissPrompt"
        >
          <Icon name="heroicons:x-mark" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()
const { isInstallable, triggerInstall } = usePWAHelpers()
const showPrompt = ref(false)

onMounted(() => {
  // 检查是否已经安装
  if (typeof window === 'undefined') return

  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  // 检查是否已经拒绝过
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10)
    // 如果拒绝时间超过7天，再次显示
    if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      return
    }
  }

  // 监听安装可用状态
  watch(
    isInstallable,
    value => {
      if (value) {
        showPrompt.value = true
      }
    },
    { immediate: true }
  )

  // 使用 PWA 模块的安装提示
  if ($pwa?.installPrompt) {
    showPrompt.value = true
  }
})

const installApp = async () => {
  const installed = await triggerInstall()
  if (installed) {
    showPrompt.value = false
  } else if ($pwa?.install) {
    await $pwa.install()
    showPrompt.value = false
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }
}
</script>
