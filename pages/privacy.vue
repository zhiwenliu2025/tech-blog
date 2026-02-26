<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- ═══════════ 深色标题区 ═══════════ -->
    <div class="relative overflow-hidden bg-slate-900">
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-600/10 blur-3xl"
      />
      <div
        class="bg-primary-600/8 pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <!-- macOS 窗口栏 -->
        <div class="mb-6 flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-red-400/70" />
          <span class="h-3 w-3 rounded-full bg-amber-400/70" />
          <span class="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span class="ml-3 font-mono text-xs text-slate-500">privacy.policy</span>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="mb-2 font-mono text-xs text-emerald-400">// legal.document</div>
            <h1 class="text-3xl font-bold text-white sm:text-4xl">隐私政策</h1>
            <p class="mt-2 font-mono text-sm text-slate-400">
              了解我们如何收集、使用和保护您的个人信息
            </p>
          </div>
          <div
            class="flex-shrink-0 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-right"
          >
            <div class="font-mono text-[10px] text-slate-500">last_updated</div>
            <div class="mt-0.5 font-mono text-sm text-slate-300">
              {{ new Date().toLocaleDateString('zh-CN') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ 主内容 ═══════════ -->
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-start">
        <!-- 左侧目录（桌面端 sticky） -->
        <aside class="lg:sticky lg:top-20 lg:w-56 lg:flex-shrink-0">
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500">// toc</span>
            </div>
            <nav class="p-2">
              <a
                v-for="(section, i) in sections"
                :key="i"
                :href="`#section-${i}`"
                class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-slate-50 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
              >
                <span
                  class="flex-shrink-0 font-mono text-[10px] text-slate-300 dark:text-slate-700"
                  >{{ String(i + 1).padStart(2, '0') }}</span
                >
                <span class="text-slate-600 dark:text-slate-400">{{ section.title }}</span>
              </a>
            </nav>
          </div>

          <!-- 安全承诺卡片 -->
          <div
            class="mt-4 overflow-hidden rounded-xl border border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-900/10"
          >
            <div class="px-4 py-3">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="heroicons:shield-check" class="h-4 w-4 text-emerald-500" />
                <span class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
                  >security.pledge</span
                >
              </div>
              <p class="text-xs text-emerald-700 dark:text-emerald-300">
                我们承诺不会出售您的个人数据给任何第三方。
              </p>
            </div>
          </div>
        </aside>

        <!-- 右侧内容 -->
        <div class="min-w-0 flex-1 space-y-4">
          <div
            v-for="(section, i) in sections"
            :id="`section-${i}`"
            :key="i"
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <!-- 条款标题栏 -->
            <div
              class="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <span class="font-mono text-xs text-slate-300 dark:text-slate-600">{{
                String(i + 1).padStart(2, '0')
              }}</span>
              <h2 class="font-semibold text-slate-800 dark:text-white">
                {{ section.title }}
              </h2>
              <!-- 高亮标签 -->
              <span
                v-if="section.badge"
                class="ml-auto rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                {{ section.badge }}
              </span>
            </div>
            <!-- 内容 -->
            <div class="px-5 py-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <p v-if="section.text" class="mb-3">
                {{ section.text }}
              </p>
              <p v-if="section.text2" class="mb-3">
                {{ section.text2 }}
              </p>
              <ul v-if="section.items" class="space-y-2">
                <li v-for="(item, j) in section.items" :key="j" class="flex items-start gap-2">
                  <span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 底部提示 -->
          <div
            class="rounded-xl border border-emerald-200/50 bg-emerald-50/50 px-5 py-4 dark:border-emerald-800/30 dark:bg-emerald-900/10"
          >
            <div class="flex items-start gap-3">
              <Icon
                name="heroicons:information-circle"
                class="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500"
              />
              <p class="text-sm text-emerald-700 dark:text-emerald-300">
                如果您对本隐私政策有任何疑问，请通过
                <NuxtLink to="/contact" class="font-semibold underline underline-offset-2">
                  联系页面
                </NuxtLink>
                与我们联系。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '隐私政策',
  meta: [
    { name: 'description', content: '查看我们的隐私政策，了解我们如何收集、使用和保护您的个人信息' }
  ]
})

const sections = [
  {
    title: '信息收集',
    text: '我们可能收集以下类型的信息：',
    items: [
      '您主动提供的信息（如评论、联系表单）',
      '技术信息（如 IP 地址、浏览器类型、访问时间）',
      '使用信息（如浏览的页面、点击的链接）'
    ]
  },
  {
    title: '信息使用',
    text: '我们收集的信息可能用于：',
    items: ['提供和维护本网站的服务', '改进用户体验', '发送重要通知', '防范欺诈和滥用']
  },
  {
    title: '信息共享',
    badge: '不出售数据',
    text: '我们不会向第三方出售、交易或转让您的个人信息，除非：',
    items: ['获得您的明确同意', '法律要求或法院命令要求', '保护我们的权利、财产或安全']
  },
  {
    title: '数据安全',
    badge: '加密传输',
    text: '我们采取合理的安全措施保护您的个人信息，但请注意，没有任何互联网传输方法是 100% 安全的。我们会持续更新安全措施以跟上行业最佳实践。'
  },
  {
    title: 'Cookie',
    text: '本网站可能使用 Cookie 来改善用户体验，用于记录您的偏好设置、保持登录状态等。您可以通过浏览器设置选择接受或拒绝 Cookie，但这可能影响某些功能的正常使用。'
  },
  {
    title: '政策变更',
    text: '我们可能会不时更新本隐私政策。任何变更都会在此页面上发布，并立即生效。建议您定期查阅本页面以获取最新版本。'
  },
  {
    title: '联系我们',
    text: '如果您对本隐私政策有任何疑问，或希望行使您的数据权利，请通过我们的联系页面与我们取得联系，我们将尽快回复。'
  }
]
</script>
