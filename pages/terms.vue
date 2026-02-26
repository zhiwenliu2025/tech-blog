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
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="bg-violet-600/8 pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl"
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
          <span class="ml-3 font-mono text-xs text-slate-500">terms.of.service</span>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="mb-2 font-mono text-xs text-primary-400">// legal.document</div>
            <h1 class="text-3xl font-bold text-white sm:text-4xl">服务条款</h1>
            <p class="mt-2 font-mono text-sm text-slate-400">使用本网站即表示您同意以下条款</p>
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
                class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-slate-50 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400"
              >
                <span
                  class="flex-shrink-0 font-mono text-[10px] text-slate-300 dark:text-slate-700"
                  >{{ String(i + 1).padStart(2, '0') }}</span
                >
                <span class="text-slate-600 dark:text-slate-400">{{ section.title }}</span>
              </a>
            </nav>
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
                  <span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 底部提示 -->
          <div
            class="rounded-xl border border-primary-200/50 bg-primary-50/50 px-5 py-4 dark:border-primary-800/30 dark:bg-primary-900/10"
          >
            <div class="flex items-start gap-3">
              <Icon
                name="heroicons:information-circle"
                class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
              />
              <p class="text-sm text-primary-700 dark:text-primary-300">
                如果您对这些服务条款有任何疑问，请通过
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
  title: '服务条款',
  meta: [{ name: 'description', content: '查看我们的服务条款，了解使用本网站的规则和条件' }]
})

const sections = [
  {
    title: '接受条款',
    text: '通过访问和使用本网站，您同意遵守这些服务条款。如果您不同意这些条款，请不要使用本网站。'
  },
  {
    title: '网站内容',
    text: '本网站的内容仅供参考和信息目的。我们不对内容的准确性、完整性或适用性做出任何保证。',
    text2: '本网站的内容受版权法保护，未经授权不得复制、分发或以其他方式使用。'
  },
  {
    title: '用户行为',
    text: '使用本网站时，您同意：',
    items: [
      '不发布非法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容',
      '不侵犯他人的知识产权',
      '不发布虚假或误导性信息',
      '不传播病毒或恶意代码',
      '不干扰或破坏本网站的运行'
    ]
  },
  {
    title: '知识产权',
    text: '本网站及其内容（包括但不限于文本、图形、图像、软件）受知识产权法保护，归我们或我们的内容提供商所有。'
  },
  {
    title: '免责声明',
    text: '本网站按"原样"提供，不提供任何明示或暗示的保证。我们不保证本网站的无错误运行或不间断服务。'
  },
  {
    title: '责任限制',
    text: '在任何情况下，我们都不对因使用或无法使用本网站而导致的任何间接、附带、特殊或后果性损害承担责任。'
  },
  {
    title: '条款变更',
    text: '我们保留随时修改或终止本网站的权利，恕不另行通知。我们也可能随时更新这些服务条款，请定期查阅本页面以获取最新版本。'
  },
  {
    title: '联系我们',
    text: '如果您对这些服务条款有任何疑问，请通过我们的联系页面与我们取得联系，我们将尽快回复。'
  }
]
</script>
