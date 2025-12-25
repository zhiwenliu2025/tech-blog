<template>
  <div>
    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div class="relative h-64">
          <img
            src="https://picsum.photos/seed/contact-hero/1200/400.jpg"
            alt="联系我"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <h1 class="text-3xl font-bold text-white md:text-4xl">联系我</h1>
          </div>
        </div>

        <div class="p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- 联系表单 -->
            <div>
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">发送消息</h2>

              <form class="space-y-6" @submit.prevent="submitForm">
                <div>
                  <label
                    for="name"
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    :class="{ 'border-red-500': errors.name }"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                    {{ errors.name }}
                  </p>
                </div>

                <div>
                  <label
                    for="email"
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    邮箱 <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    :class="{ 'border-red-500': errors.email }"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                    {{ errors.email }}
                  </p>
                </div>

                <div>
                  <label
                    for="subject"
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    主题 <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    required
                    class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    :class="{ 'border-red-500': errors.subject }"
                  />
                  <p v-if="errors.subject" class="mt-1 text-sm text-red-600">
                    {{ errors.subject }}
                  </p>
                </div>

                <div>
                  <label
                    for="message"
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    消息 <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    required
                    class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    :class="{ 'border-red-500': errors.message }"
                  />
                  <p v-if="errors.message" class="mt-1 text-sm text-red-600">
                    {{ errors.message }}
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon
                      v-if="isSubmitting"
                      name="i-heroicons-arrow-path"
                      class="mr-2 h-5 w-5 animate-spin"
                    />
                    {{ isSubmitting ? '发送中...' : '发送消息' }}
                  </button>
                </div>
              </form>

              <!-- 成功消息 -->
              <div
                v-if="successMessage"
                class="mt-4 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-check-circle" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                      消息发送成功
                    </h3>
                    <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                      {{ successMessage }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 错误消息 -->
              <div
                v-if="errorMessage"
                class="mt-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-x-circle" class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200">发送失败</h3>
                    <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                      {{ errorMessage }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div>
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">联系信息</h2>

              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-map-pin" class="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">工作地点</h3>
                    <p class="text-gray-600 dark:text-gray-400">中国，上海</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-chat-bubble-left-right" class="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">微信号</h3>
                    <p class="text-gray-600 dark:text-gray-400">请通过表单联系获取</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-clock" class="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">工作时间</h3>
                    <p class="text-gray-600 dark:text-gray-400">周一至周五: 9:00 - 18:00</p>
                    <p class="text-gray-600 dark:text-gray-400">周末: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">社交媒体</h3>
                <div class="flex space-x-4">
                  <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                    <Icon name="i-heroicons-link" class="h-8 w-8" />
                  </a>
                  <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                    <Icon name="i-heroicons-link" class="h-8 w-8" />
                  </a>
                  <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                    <Icon name="i-heroicons-link" class="h-8 w-8" />
                  </a>
                  <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                    <Icon name="i-heroicons-link" class="h-8 w-8" />
                  </a>
                </div>
              </div>

              <div
                class="mt-8 rounded-md border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/20"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon name="i-heroicons-information-circle" class="h-6 w-6 text-blue-500" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100">回复时间</h3>
                    <div class="mt-2 text-blue-700 dark:text-blue-200">
                      <p>
                        我会尽快回复您的消息，通常在24小时内。如果您的消息比较紧急，
                        请在主题中标注"紧急"，我会优先处理。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '联系我',
  description: '通过表单或直接联系方式与我取得联系'
})

// 表单状态
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// 表单验证
const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }

  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = '请输入您的姓名'
    isValid = false
  }

  if (!form.value.email.trim()) {
    errors.value.email = '请输入您的邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!form.value.subject.trim()) {
    errors.value.subject = '请输入消息主题'
    isValid = false
  }

  if (!form.value.message.trim()) {
    errors.value.message = '请输入消息内容'
    isValid = false
  }

  return isValid
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const supabase = useSupabaseClient()

    // 保存联系消息到数据库
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        subject: form.value.subject.trim(),
        message: form.value.message.trim()
      } as any)
      .select()
      .single()

    if (error) {
      console.error('插入联系消息失败:', error)
      // 检查是否是权限错误
      if (
        error.code === '42501' ||
        error.message?.includes('permission') ||
        error.message?.includes('policy')
      ) {
        throw new Error('没有权限发送消息，请检查数据库策略设置')
      }
      throw error
    }

    // 成功消息
    successMessage.value = '您的消息已成功发送！我会尽快回复您。'

    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    // 5秒后清除成功消息
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error: any) {
    console.error('发送消息失败:', error)
    errorMessage.value = error.message || '发送消息时出现错误，请稍后再试。'

    // 5秒后清除错误消息
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
