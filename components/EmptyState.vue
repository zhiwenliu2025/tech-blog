<template>
  <div class="flex flex-col items-center py-16 text-center">
    <div
      class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 shadow-sm dark:bg-gray-800"
    >
      <Icon :name="icon" class="h-10 w-10 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p class="mx-auto max-w-sm text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <button
      v-if="actionText && actionUrl"
      class="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      @click="handleAction"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description: string
  actionText?: string
  actionUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-inbox',
  actionText: undefined,
  actionUrl: undefined
})

const handleAction = () => {
  if (props.actionUrl) {
    navigateTo(props.actionUrl)
  }
}
</script>
