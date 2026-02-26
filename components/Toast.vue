<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Transition v-for="toast in toasts" :key="toast.id" name="toast" appear>
        <div
          v-if="toast.show"
          class="flex w-80 items-start gap-3 overflow-hidden rounded-xl border bg-slate-900 p-3.5 shadow-xl shadow-black/40 backdrop-blur-sm"
          :class="borderClasses[toast.type]"
        >
          <!-- 左侧色条 -->
          <div
            class="absolute inset-y-0 left-0 w-0.5 rounded-l-xl"
            :class="barClasses[toast.type]"
          />

          <!-- 图标 -->
          <div
            class="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            :class="iconBgClasses[toast.type]"
          >
            <Icon
              v-if="toast.type === ToastType.SUCCESS"
              name="heroicons:check-circle"
              class="h-4 w-4"
              :class="iconClasses[toast.type]"
            />
            <Icon
              v-else-if="toast.type === ToastType.ERROR"
              name="heroicons:x-circle"
              class="h-4 w-4"
              :class="iconClasses[toast.type]"
            />
            <Icon
              v-else-if="toast.type === ToastType.WARNING"
              name="heroicons:exclamation-triangle"
              class="h-4 w-4"
              :class="iconClasses[toast.type]"
            />
            <Icon
              v-else
              name="heroicons:information-circle"
              class="h-4 w-4"
              :class="iconClasses[toast.type]"
            />
          </div>

          <!-- 文本 -->
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold leading-snug text-white">
              {{ toast.title }}
            </p>
            <p
              v-if="toast.description"
              class="mt-0.5 font-mono text-[11px] leading-snug"
              :class="descClasses[toast.type]"
            >
              {{ toast.description }}
            </p>
          </div>

          <!-- 关闭按钮 -->
          <button
            class="flex-shrink-0 rounded-lg p-0.5 text-slate-600 transition-colors hover:bg-slate-800 hover:text-slate-300 focus:outline-none"
            @click="removeToast(toast.id)"
          >
            <span class="sr-only">关闭</span>
            <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ToastType } from '~/composables/useToast'

const { toasts, remove } = useToast()

const borderClasses = {
  [ToastType.SUCCESS]: 'border-emerald-800/60',
  [ToastType.ERROR]: 'border-rose-800/60',
  [ToastType.WARNING]: 'border-amber-800/60',
  [ToastType.INFO]: 'border-primary-800/60'
}

const barClasses = {
  [ToastType.SUCCESS]: 'bg-emerald-500',
  [ToastType.ERROR]: 'bg-rose-500',
  [ToastType.WARNING]: 'bg-amber-500',
  [ToastType.INFO]: 'bg-primary-500'
}

const iconBgClasses = {
  [ToastType.SUCCESS]: 'bg-emerald-900/50',
  [ToastType.ERROR]: 'bg-rose-900/50',
  [ToastType.WARNING]: 'bg-amber-900/50',
  [ToastType.INFO]: 'bg-primary-900/50'
}

const iconClasses = {
  [ToastType.SUCCESS]: 'text-emerald-400',
  [ToastType.ERROR]: 'text-rose-400',
  [ToastType.WARNING]: 'text-amber-400',
  [ToastType.INFO]: 'text-primary-400'
}

const descClasses = {
  [ToastType.SUCCESS]: 'text-emerald-500',
  [ToastType.ERROR]: 'text-rose-500',
  [ToastType.WARNING]: 'text-amber-500',
  [ToastType.INFO]: 'text-primary-500'
}

const removeToast = id => remove(id)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(110%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(110%);
}
</style>
