<template>
  <div ref="container" class="relative w-full">
    <!-- 触发按钮 -->
    <button
      type="button"
      class="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border bg-gray-50 py-2.5 pl-3 pr-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800/50"
      :class="[
        isOpen
          ? 'border-primary-500 bg-white shadow-sm dark:bg-gray-800'
          : 'border-gray-200 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:hover:bg-gray-800',
        modelValue && modelValue !== '' ? 'border-primary-300 dark:border-primary-700' : ''
      ]"
      @click="toggleOpen"
    >
      <!-- 左侧图标 -->
      <div class="flex-shrink-0">
        <Icon
          :name="icon"
          class="h-4 w-4 transition-colors duration-200"
          :class="
            modelValue && modelValue !== ''
              ? 'text-primary-500 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500'
          "
        />
      </div>

      <!-- 已选值文本 -->
      <span
        class="min-w-0 flex-1 truncate text-left"
        :class="
          modelValue && modelValue !== ''
            ? 'font-medium text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        {{ selectedLabel }}
      </span>

      <!-- 已选指示点 -->
      <span
        v-if="modelValue && modelValue !== ''"
        class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500"
      />

      <!-- 右侧箭头 -->
      <Icon
        name="heroicons:chevron-down"
        class="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 dark:text-gray-500"
        :class="isOpen ? 'rotate-180 text-primary-500' : ''"
      />
    </button>

    <!-- 下拉面板 -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/60"
      >
        <div class="max-h-52 overflow-y-auto py-1">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-100"
            :class="
              option.value === modelValue
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
            "
            @click="selectOption(option)"
          >
            <!-- 选中图标 -->
            <span class="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <Icon
                v-if="option.value === modelValue"
                name="heroicons:check"
                class="h-3.5 w-3.5 text-primary-600 dark:text-primary-400"
              />
            </span>
            <span class="truncate" :class="option.value === modelValue ? 'font-medium' : ''">
              {{ option.label }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  icon: {
    type: String,
    default: 'heroicons:chevron-up-down'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const container = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : (props.options[0]?.label ?? '')
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const selectOption = option => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleOutsideClick = e => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>
