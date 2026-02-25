<template>
  <div>
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="relative h-48 overflow-hidden sm:h-56 md:h-64">
          <NuxtImg
            src="https://picsum.photos/seed/contact-hero/1200/400.jpg"
            alt="联系我"
            preset="cover"
            :sizes="'(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          />
          <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">联系我</h1>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- 联系表单 -->
            <div>
              <div class="mb-6 flex items-center gap-3 sm:mb-8">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30"
                >
                  <Icon
                    name="heroicons:paper-airplane"
                    class="h-5 w-5 text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  发送消息
                </h2>
              </div>

              <form class="space-y-5" @submit.prevent="submitForm">
                <div>
                  <label
                    for="name"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    姓名 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
                    >
                      <Icon name="heroicons:user" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                      :class="{ 'border-red-500 bg-red-50 dark:bg-red-900/20': errors.name }"
                    />
                  </div>
                  <p v-if="errors.name" class="mt-1 text-sm text-red-500">
                    {{ errors.name }}
                  </p>
                </div>

                <div>
                  <label
                    for="email"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    邮箱 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
                    >
                      <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                      :class="{ 'border-red-500 bg-red-50 dark:bg-red-900/20': errors.email }"
                    />
                  </div>
                  <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                  </p>
                </div>

                <div>
                  <label
                    for="subject"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    主题 <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
                    >
                      <Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="subject"
                      v-model="form.subject"
                      type="text"
                      required
                      class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                      :class="{ 'border-red-500 bg-red-50 dark:bg-red-900/20': errors.subject }"
                    />
                  </div>
                  <p v-if="errors.subject" class="mt-1 text-sm text-red-500">
                    {{ errors.subject }}
                  </p>
                </div>

                <div>
                  <label
                    for="message"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    消息 <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    required
                    class="block w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    :class="{ 'border-red-500 bg-red-50 dark:bg-red-900/20': errors.message }"
                    placeholder="写下你想说的话..."
                  />
                  <p v-if="errors.message" class="mt-1 text-sm text-red-500">
                    {{ errors.message }}
                  </p>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="touch-optimized flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="heroicons:arrow-path"
                    class="h-5 w-5 animate-spin"
                  />
                  <Icon v-else name="heroicons:paper-airplane" class="h-5 w-5" />
                  {{ isSubmitting ? '发送中...' : '发送消息' }}
                </button>
              </form>

              <!-- 成功消息 -->
              <div
                v-if="successMessage"
                class="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/50 dark:bg-green-900/20"
              >
                <div class="flex items-start gap-3">
                  <Icon
                    name="heroicons:check-circle"
                    class="h-5 w-5 flex-shrink-0 text-green-500"
                  />
                  <div>
                    <h3 class="font-medium text-green-800 dark:text-green-200">消息发送成功</h3>
                    <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                      {{ successMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 错误消息 -->
              <div
                v-if="errorMessage"
                class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
              >
                <div class="flex items-start gap-3">
                  <Icon name="heroicons:x-circle" class="h-5 w-5 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 class="font-medium text-red-800 dark:text-red-200">发送失败</h3>
                    <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div>
              <div class="mb-6 flex items-center gap-3 sm:mb-8">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30"
                >
                  <Icon
                    name="heroicons:information-circle"
                    class="h-5 w-5 text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  联系信息
                </h2>
              </div>

              <div class="space-y-5">
                <div
                  class="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Icon
                      name="heroicons:map-pin"
                      class="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">工作地点</h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">中国，上海</p>
                  </div>
                </div>

                <div
                  class="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
                  >
                    <Icon
                      name="heroicons:chat-bubble-left-right"
                      class="h-5 w-5 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">微信号</h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">请通过表单联系获取</p>
                  </div>
                </div>

                <div
                  class="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
                  >
                    <Icon
                      name="heroicons:clock"
                      class="h-5 w-5 text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">工作时间</h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      周一至周五: 9:00 - 18:00
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">周末: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 sm:mt-8">
                <h3 class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">社交媒体</h3>
                <div class="flex gap-3">
                  <a
                    href="#"
                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-primary-100 hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
                  >
                    <Icon name="simple-icons:github" class="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                  >
                    <Icon name="simple-icons:twitter" class="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-green-100 hover:text-green-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                  >
                    <Icon name="simple-icons:weixin" class="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-red-100 hover:text-red-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
                    <Icon name="heroicons:envelope" class="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div
                class="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-5 dark:border-primary-800/50 dark:bg-primary-900/20"
              >
                <div class="flex items-start gap-3">
                  <Icon
                    name="heroicons:light-bulb"
                    class="h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400"
                  />
                  <div>
                    <h3 class="font-medium text-primary-800 dark:text-primary-200">温馨提示</h3>
                    <p class="mt-1 text-sm text-primary-700 dark:text-primary-300">
                      我们通常会在24小时内回复您发送的消息。如果您需要紧急帮助，请直接发送邮件至
                      support@example.com
                    </p>
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
