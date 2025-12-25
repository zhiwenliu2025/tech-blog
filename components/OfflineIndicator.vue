<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-[-100%]"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-[-100%]"
  >
    <div
      v-if="isOffline"
      class="fixed left-0 right-0 top-0 z-50 bg-yellow-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-center space-x-2">
        <Icon name="heroicons:wifi" class="h-5 w-5" />
        <span>您当前处于离线状态，部分功能可能无法使用</span>
      </div>
    </div>
  </Transition>

  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-[-100%]"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-[-100%]"
  >
    <div
      v-if="isOnline && showOnlineMessage"
      class="fixed left-0 right-0 top-0 z-50 bg-green-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-center space-x-2">
        <Icon name="heroicons:check-circle" class="h-5 w-5" />
        <span>网络连接已恢复</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isOffline = ref(false)
const isOnline = ref(true)
const showOnlineMessage = ref(false)

onMounted(() => {
  // 检测网络状态
  isOffline.value = !navigator.onLine
  isOnline.value = navigator.onLine

  // 监听网络状态变化
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

const handleOnline = () => {
  isOffline.value = false
  isOnline.value = true
  showOnlineMessage.value = true

  // 3秒后隐藏在线消息
  setTimeout(() => {
    showOnlineMessage.value = false
  }, 3000)
}

const handleOffline = () => {
  isOffline.value = true
  isOnline.value = false
  showOnlineMessage.value = false
}
</script>
