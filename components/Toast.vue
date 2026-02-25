<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Transition v-for="toast in toasts" :key="toast.id" name="toast" appear>
        <div
          v-if="toast.show"
          class="flex w-80 items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg shadow-gray-900/10 backdrop-blur-sm"
          :class="toastClasses[toast.type]"
        >
          <!-- 图标 -->
          <div class="mt-0.5 flex-shrink-0">
            <Icon
              v-if="toast.type === ToastType.SUCCESS"
              name="heroicons:check-circle"
              class="h-5 w-5"
            />
            <Icon
              v-else-if="toast.type === ToastType.ERROR"
              name="heroicons:x-circle"
              class="h-5 w-5"
            />
            <Icon
              v-else-if="toast.type === ToastType.WARNING"
              name="heroicons:exclamation-triangle"
              class="h-5 w-5"
            />
            <Icon v-else name="heroicons:information-circle" class="h-5 w-5" />
          </div>
          <!-- 文本 -->
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold leading-snug">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="mt-0.5 text-xs leading-snug opacity-80">
              {{ toast.description }}
            </p>
          </div>
          <!-- 关闭按钮 -->
          <button
            class="flex-shrink-0 cursor-pointer rounded-lg p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
            :class="focusClasses[toast.type]"
            @click="removeToast(toast.id)"
          >
            <span class="sr-only">关闭</span>
            <Icon name="heroicons:x-mark" class="h-4 w-4" />
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ToastType } from '~/composables/useToast'

// Get toast state
const { toasts, remove } = useToast()

// Toast type classes
const toastClasses = {
  [ToastType.SUCCESS]:
    'bg-white border-green-200 text-green-800 dark:bg-gray-900 dark:border-green-800/60 dark:text-green-300',
  [ToastType.ERROR]:
    'bg-white border-red-200 text-red-800 dark:bg-gray-900 dark:border-red-800/60 dark:text-red-300',
  [ToastType.WARNING]:
    'bg-white border-yellow-200 text-yellow-800 dark:bg-gray-900 dark:border-yellow-800/60 dark:text-yellow-300',
  [ToastType.INFO]:
    'bg-white border-blue-200 text-blue-800 dark:bg-gray-900 dark:border-blue-800/60 dark:text-blue-300'
}

// Focus ring classes for close button
const focusClasses = {
  [ToastType.SUCCESS]: 'focus:ring-green-500',
  [ToastType.ERROR]: 'focus:ring-red-500',
  [ToastType.WARNING]: 'focus:ring-yellow-500',
  [ToastType.INFO]: 'focus:ring-blue-500'
}

// Remove toast
const removeToast = id => {
  remove(id)
}
</script>

<style scoped>
/* Toast transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
