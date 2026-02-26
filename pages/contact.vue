<template>
  <div>
    <!-- ═══════════════════════
         深色英雄区
    ══════════════════════════ -->
    <div class="relative overflow-hidden bg-slate-900">
      <!-- 点阵底纹 -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <div
        class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="mb-0.5 font-mono text-xs text-primary-400">// contact.me</div>
        <h1 class="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">联系我</h1>
        <p class="mt-3 max-w-lg font-mono text-sm text-slate-400">
          有技术问题、合作意向或只是想打个招呼？随时欢迎联系。
        </p>
        <!-- 响应时间提示 -->
        <div
          class="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
            />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span class="font-mono text-xs text-slate-400"
            >通常在 <span class="text-emerald-400">24小时</span> 内回复</span
          >
        </div>
      </div>
    </div>

    <!-- ═══════════════════════
         主内容区
    ══════════════════════════ -->
    <main class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
        <!-- ── 左侧：联系表单（3列） ── -->
        <div class="lg:col-span-3">
          <!-- 终端风格表单卡片 -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <!-- 标题栏 -->
            <div
              class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">// compose.message</span>
            </div>

            <div class="p-5 sm:p-6">
              <!-- 成功提示 -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="successMessage"
                  class="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/20"
                >
                  <Icon
                    name="heroicons:check-circle"
                    class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
                  />
                  <div>
                    <p
                      class="font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                    >
                      message.sent = true
                    </p>
                    <p class="mt-0.5 text-sm text-emerald-700 dark:text-emerald-400">
                      {{ successMessage }}
                    </p>
                  </div>
                </div>
              </Transition>

              <!-- 错误提示 -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="errorMessage"
                  class="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
                >
                  <Icon
                    name="heroicons:x-circle"
                    class="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                  />
                  <div>
                    <p class="font-mono text-xs font-semibold text-red-800 dark:text-red-300">
                      error: send failed
                    </p>
                    <p class="mt-0.5 text-sm text-red-700 dark:text-red-400">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </Transition>

              <form class="space-y-4" @submit.prevent="submitForm">
                <!-- 姓名 -->
                <div>
                  <label
                    for="name"
                    class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    <span class="text-primary-500">name</span><span class="text-slate-400">:</span>
                    <span class="text-[10px] text-rose-400">required</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="heroicons:user"
                      class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      placeholder="你的名字"
                      class="block w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all dark:text-white dark:placeholder-slate-500"
                      :class="
                        errors.name
                          ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-700 dark:bg-red-900/20'
                          : 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800'
                      "
                    />
                  </div>
                  <p
                    v-if="errors.name"
                    class="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
                  >
                    <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />{{ errors.name }}
                  </p>
                </div>

                <!-- 邮箱 -->
                <div>
                  <label
                    for="email"
                    class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    <span class="text-primary-500">email</span><span class="text-slate-400">:</span>
                    <span class="text-[10px] text-rose-400">required</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="heroicons:envelope"
                      class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      class="block w-full rounded-lg border py-2.5 pl-10 pr-4 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all dark:text-white dark:placeholder-slate-500"
                      :class="
                        errors.email
                          ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-700 dark:bg-red-900/20'
                          : 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800'
                      "
                    />
                  </div>
                  <p
                    v-if="errors.email"
                    class="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
                  >
                    <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />{{ errors.email }}
                  </p>
                </div>

                <!-- 主题 -->
                <div>
                  <label
                    for="subject"
                    class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    <span class="text-primary-500">subject</span
                    ><span class="text-slate-400">:</span>
                    <span class="text-[10px] text-rose-400">required</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="heroicons:tag"
                      class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      id="subject"
                      v-model="form.subject"
                      type="text"
                      placeholder="消息主题"
                      class="block w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all dark:text-white dark:placeholder-slate-500"
                      :class="
                        errors.subject
                          ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-700 dark:bg-red-900/20'
                          : 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800'
                      "
                    />
                  </div>
                  <p
                    v-if="errors.subject"
                    class="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
                  >
                    <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />{{ errors.subject }}
                  </p>
                </div>

                <!-- 消息 -->
                <div>
                  <label
                    for="message"
                    class="mb-1.5 flex items-center justify-between font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    <span class="flex items-center gap-1.5">
                      <span class="text-primary-500">message</span
                      ><span class="text-slate-400">:</span>
                      <span class="text-[10px] text-rose-400">required</span>
                    </span>
                    <span class="text-[10px] text-slate-400">{{ form.message.length }} chars</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    placeholder="写下你想说的话..."
                    class="block w-full resize-none rounded-lg border p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all dark:text-white dark:placeholder-slate-500"
                    :class="
                      errors.message
                        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:bg-slate-800'
                    "
                  />
                  <p
                    v-if="errors.message"
                    class="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
                  >
                    <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />{{ errors.message }}
                  </p>
                </div>

                <!-- 提交按钮 -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="touch-optimized group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="heroicons:arrow-path"
                    class="h-4 w-4 animate-spin"
                  />
                  <Icon
                    v-else
                    name="heroicons:paper-airplane"
                    class="h-4 w-4 transition-transform group-hover:-rotate-45"
                  />
                  {{ isSubmitting ? '发送中...' : '发送消息' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- ── 右侧：联系信息（2列） ── -->
        <div class="space-y-5 lg:col-span-2">
          <!-- 联系方式卡片（深色终端风格） -->
          <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
            <div
              class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">contact.json</span>
            </div>
            <div class="space-y-0 p-1">
              <!-- 地点 -->
              <div
                class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-800/50"
              >
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-900/50"
                >
                  <Icon name="heroicons:map-pin" class="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p class="font-mono text-xs text-slate-500">location</p>
                  <p class="text-sm font-medium text-slate-200">中国，上海</p>
                </div>
              </div>
              <div class="mx-4 border-t border-slate-800" />

              <!-- 邮件 -->
              <a
                href="mailto:contact@example.com"
                class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-800/50"
              >
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-900/50"
                >
                  <Icon name="heroicons:envelope" class="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p class="font-mono text-xs text-slate-500">email</p>
                  <p
                    class="font-mono text-sm text-primary-400 transition-colors hover:text-primary-300"
                  >
                    contact@example.com
                  </p>
                </div>
              </a>
              <div class="mx-4 border-t border-slate-800" />

              <!-- 微信 -->
              <div
                class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-800/50"
              >
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-900/50"
                >
                  <Icon name="i-simple-icons-wechat" class="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p class="font-mono text-xs text-slate-500">wechat</p>
                  <p class="font-mono text-sm text-slate-200">braveheartonline</p>
                </div>
              </div>
              <div class="mx-4 border-t border-slate-800" />

              <!-- 工作时间 -->
              <div
                class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-800/50"
              >
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-900/50"
                >
                  <Icon name="heroicons:clock" class="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p class="font-mono text-xs text-slate-500">working_hours</p>
                  <p class="font-mono text-xs text-slate-300">Mon–Fri&nbsp;&nbsp;09:00–18:00</p>
                  <p class="font-mono text-xs text-slate-500">Sat–Sun&nbsp;10:00–16:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 社交媒体 -->
          <div
            class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p class="mb-3 font-mono text-xs text-slate-400 dark:text-slate-500">// social.links</p>
            <div class="grid grid-cols-4 gap-2">
              <a
                v-for="s in socials"
                :key="s.label"
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40"
                :class="s.hover"
              >
                <Icon
                  :name="s.icon"
                  class="h-5 w-5 transition-colors"
                  :class="[s.color, s.groupColor]"
                />
                <span
                  class="font-mono text-[10px] text-slate-400 transition-colors"
                  :class="s.labelHover"
                  >{{ s.label }}</span
                >
              </a>
            </div>
          </div>

          <!-- 提示信息 -->
          <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
            <div class="border-b border-slate-800 bg-slate-800/80 px-4 py-2">
              <span class="font-mono text-xs text-slate-500">$ tips</span>
            </div>
            <div class="p-4">
              <p class="font-mono text-xs leading-relaxed text-slate-400">
                <span class="text-emerald-400">›</span> 通常在
                <span class="text-white">24小时</span> 内回复<br />
                <span class="text-emerald-400">›</span> 紧急事项请发邮件至<br />
                <span class="ml-3 text-primary-400">contact@example.com</span><br />
                <span class="text-emerald-400">›</span> 欢迎技术交流 &amp; 合作咨询
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '联系我',
  description: '通过表单或直接联系方式与我取得联系'
})

const form = ref({ name: '', email: '', subject: '', message: '' })
const errors = ref({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: 'i-simple-icons-github',
    color: 'text-slate-500 dark:text-slate-400',
    groupColor: 'group-hover:text-slate-900 dark:group-hover:text-white',
    hover: 'hover:border-slate-400 dark:hover:border-slate-600',
    labelHover: 'group-hover:text-slate-600 dark:group-hover:text-slate-300'
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: 'i-simple-icons-twitter',
    color: 'text-slate-500 dark:text-slate-400',
    groupColor: 'group-hover:text-sky-500',
    hover: 'hover:border-sky-200 dark:hover:border-sky-800/60',
    labelHover: 'group-hover:text-sky-500'
  },
  {
    label: 'WeChat',
    href: '#',
    icon: 'i-simple-icons-wechat',
    color: 'text-slate-500 dark:text-slate-400',
    groupColor: 'group-hover:text-emerald-500',
    hover: 'hover:border-emerald-200 dark:hover:border-emerald-800/60',
    labelHover: 'group-hover:text-emerald-500'
  },
  {
    label: 'Email',
    href: 'mailto:contact@example.com',
    icon: 'heroicons:envelope',
    color: 'text-slate-500 dark:text-slate-400',
    groupColor: 'group-hover:text-primary-600 dark:group-hover:text-primary-400',
    hover: 'hover:border-primary-200 dark:hover:border-primary-800/60',
    labelHover: 'group-hover:text-primary-600 dark:group-hover:text-primary-400'
  }
]

const validateForm = () => {
  errors.value = { name: '', email: '', subject: '', message: '' }
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

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
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
      if (
        error.code === '42501' ||
        error.message?.includes('permission') ||
        error.message?.includes('policy')
      ) {
        throw new Error('没有权限发送消息，请检查数据库策略设置')
      }
      throw error
    }

    successMessage.value = '您的消息已成功发送！我会尽快回复您。'
    form.value = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (err: any) {
    errorMessage.value = err.message || '发送消息时出现错误，请稍后再试。'
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
