<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <Transition v-for="toast in toasts" :key="toast.id" name="toast" appear>
        <div
          v-if="toast.show"
          class="flex w-80 items-start rounded-lg p-4 shadow-lg"
          :class="toastClasses[toast.type]"
        >
          <div class="flex-shrink-0">
            <Icon
              v-if="toast.type === ToastType.SUCCESS"
              name="i-heroicons-check-circle"
              class="h-6 w-6"
            />
            <Icon
              v-else-if="toast.type === ToastType.ERROR"
              name="i-heroicons-x-circle"
              class="h-6 w-6"
            />
            <Icon
              v-else-if="toast.type === ToastType.WARNING"
              name="i-heroicons-exclamation-triangle"
              class="h-6 w-6"
            />
            <Icon v-else name="i-heroicons-information-circle" class="h-6 w-6" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="mt-1 text-sm opacity-90">
              {{ toast.description }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="focusClasses[toast.type]"
              @click="removeToast(toast.id)"
            >
              <span class="sr-only">关闭</span>
              <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
            </button>
          </div>
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
  [ToastType.SUCCESS]: 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  [ToastType.ERROR]: 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  [ToastType.WARNING]: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  [ToastType.INFO]: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
}

// Focus ring classes for close button
const focusClasses = {
  [ToastType.SUCCESS]:
    'focus:ring-green-500 focus:ring-offset-green-50 dark:focus:ring-offset-green-900/20',
  [ToastType.ERROR]:
    'focus:ring-red-500 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/20',
  [ToastType.WARNING]:
    'focus:ring-yellow-500 focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900/20',
  [ToastType.INFO]:
    'focus:ring-blue-500 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900/20'
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
