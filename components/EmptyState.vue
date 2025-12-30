<template>
  <div class="py-12 text-center">
    <div
      class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
    >
      <Icon :name="icon" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p class="mx-auto max-w-md text-gray-600 dark:text-gray-300">
      {{ description }}
    </p>
    <button
      v-if="actionText && actionUrl"
      class="mt-6 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
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
