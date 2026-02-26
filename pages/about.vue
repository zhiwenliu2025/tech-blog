<template>
  <div>
    <!-- ═══════════════════════════════════════════
         Hero 英雄区
    ════════════════════════════════════════════ -->
    <div class="relative overflow-hidden bg-slate-900">
      <!-- 点阵底纹 -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <!-- 光晕 -->
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <!-- 底部过渡 -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <!-- 眉题 -->
        <div class="mb-4 font-mono text-xs text-primary-400">// about.me</div>

        <!-- 主标题 -->
        <h1 class="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          全栈工程师
          <span
            class="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent"
            >&</span
          >
          系统架构师
        </h1>

        <!-- 简介 -->
        <p class="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          欢迎来到我的技术博客！拥有丰富的全栈开发经验和大型系统架构设计能力，专注于构建高性能、可扩展的
          Web 应用。 从前端用户体验到后端服务架构，从数据库设计到 DevOps
          实践，致力于打造完整的技术解决方案。
        </p>

        <!-- 联系行 -->
        <div class="mb-10 flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-400"
          >
            <Icon name="heroicons:map-pin" class="h-3.5 w-3.5 text-slate-500" />
            上海，中国
          </span>
          <a
            href="https://github.com"
            target="_blank"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-white"
          >
            <Icon name="i-simple-icons-github" class="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href="mailto:contact@example.com"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-white"
          >
            <Icon name="heroicons:envelope" class="h-3.5 w-3.5" />
            邮件联系
          </a>
          <span
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-400"
          >
            <Icon name="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" />
            微信：braveheartonline
          </span>
        </div>

        <!-- 数据指标条 -->
        <div class="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
          <div v-for="stat in heroStats" :key="stat.label" class="text-center sm:text-left">
            <div class="text-2xl font-bold text-white sm:text-3xl">
              {{ stat.value }}
            </div>
            <div class="mt-0.5 font-mono text-xs text-slate-500">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <!-- ═══════════════════════════════════════════
           技术技能
      ════════════════════════════════════════════ -->
      <section class="mb-16">
        <!-- 区块标题 -->
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">// skills.map</span>
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="skill in skills"
            :key="skill.title"
            class="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <!-- 终端标题栏 -->
            <div
              class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <span class="h-2 w-2 rounded-full" :class="skill.dotColor" />
              <span class="font-mono text-xs text-slate-500">$ {{ skill.cmd }}</span>
            </div>
            <!-- 技能列表 -->
            <div class="p-4">
              <div class="mb-3 flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg"
                  :class="skill.iconBg"
                >
                  <Icon :name="skill.icon" class="h-4 w-4" :class="skill.iconColor" />
                </div>
                <h3 class="font-semibold text-slate-900 dark:text-white">
                  {{ skill.title }}
                </h3>
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="item in skill.items"
                  :key="item"
                  class="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-400"
                >
                  <span class="text-emerald-500">›</span>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════
           职业经历时间轴
      ════════════════════════════════════════════ -->
      <section class="mb-16">
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">// career.log</span>
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="relative">
          <!-- 垂直时间轴线 -->
          <div
            class="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary-500 via-slate-200 to-transparent dark:via-slate-700 sm:left-6"
          />

          <div class="space-y-6">
            <div v-for="(job, idx) in career" :key="idx" class="group relative pl-12 sm:pl-16">
              <!-- 时间轴节点 -->
              <div
                class="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 transition-all duration-200 group-hover:border-primary-200 group-hover:bg-primary-50 dark:border-slate-900 dark:bg-slate-800 dark:group-hover:bg-primary-900/30 sm:left-2"
              >
                <div class="h-2.5 w-2.5 rounded-full transition-colors" :class="job.nodeColor" />
              </div>

              <!-- 卡片 -->
              <div
                class="rounded-xl border border-slate-200 bg-white p-5 transition-all group-hover:border-slate-300 group-hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <!-- 标题行 -->
                <div class="mb-1 flex flex-wrap items-start justify-between gap-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white sm:text-lg">
                    {{ job.title }}
                  </h3>
                  <span
                    class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {{ job.period }}
                  </span>
                </div>
                <p class="mb-3 font-mono text-xs text-slate-400">
                  <span :class="job.companyColor">@</span> {{ job.company }}
                </p>
                <!-- 成就列表 -->
                <ul class="space-y-1.5">
                  <li
                    v-for="item in job.items"
                    :key="item"
                    class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <Icon
                      name="heroicons:arrow-right"
                      class="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                      :class="job.arrowColor"
                    />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════
           核心能力
      ════════════════════════════════════════════ -->
      <section class="mb-16">
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
            >// core.abilities</span
          >
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="ability in abilities"
            :key="ability.title"
            class="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <!-- 背景装饰 -->
            <div
              class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-[0.04]"
              :class="ability.bgDecor"
            />
            <div class="mb-3 flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg"
                :class="ability.iconBg"
              >
                <Icon :name="ability.icon" class="h-5 w-5" :class="ability.iconColor" />
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white">
                {{ ability.title }}
              </h3>
            </div>
            <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {{ ability.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════
           博客宗旨（终端 README 风格）
      ════════════════════════════════════════════ -->
      <section class="mb-16">
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">// blog.readme</span>
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          <!-- 窗口标题栏 -->
          <div
            class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-xs text-slate-500">README.md</span>
          </div>
          <!-- 内容 -->
          <div class="p-5 sm:p-6">
            <p class="mb-4 font-mono text-sm text-slate-300">
              <span class="text-emerald-400">$</span>
              <span class="ml-2 text-slate-400">cat README.md</span>
            </p>
            <div class="space-y-3 pl-4 font-mono text-sm text-slate-400">
              <p class="text-slate-300">## 这个博客分享什么？</p>
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <span class="mt-0.5 text-primary-400">→</span>
                  <span
                    ><span class="text-yellow-400">全栈开发实践</span
                    >：从前端到后端，完整技术栈实战经验</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5 text-primary-400">→</span>
                  <span
                    ><span class="text-purple-400">架构设计思考</span
                    >：微服务、分布式系统、高并发架构</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5 text-primary-400">→</span>
                  <span
                    ><span class="text-sky-400">技术深度解析</span
                    >：深入原理，分享最佳实践和踩坑经验</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5 text-primary-400">→</span>
                  <span
                    ><span class="text-emerald-400">性能优化技巧</span
                    >：数据库、API、前端优化实战案例</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5 text-primary-400">→</span>
                  <span
                    ><span class="text-orange-400">技术趋势洞察</span
                    >：关注新技术发展，分享前沿思考</span
                  >
                </li>
              </ul>
              <p class="mt-4 border-t border-slate-800 pt-4 text-slate-500">
                # 欢迎与我交流学习，共同成长 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════
           联系方式
      ════════════════════════════════════════════ -->
      <section>
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">// contact.info</span>
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            v-for="contact in contacts"
            :key="contact.label"
            :href="contact.href"
            :target="contact.external ? '_blank' : undefined"
            :rel="contact.external ? 'noopener noreferrer' : undefined"
            class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            :class="contact.hover"
          >
            <div
              class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
              :class="[contact.iconBg, contact.groupIconBg]"
            >
              <Icon :name="contact.icon" class="h-4 w-4" :class="contact.iconColor" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-400 dark:text-slate-500">{{ contact.label }}</p>
              <p class="truncate font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ contact.value }}
              </p>
            </div>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '关于我',
  description: '了解更多关于我的信息'
})

const heroStats = [
  { value: '8+', label: 'years experience' },
  { value: '1000万', label: 'daily active users' },
  { value: '99.99%', label: 'availability' },
  { value: '60%', label: 'cost reduced' }
]

const skills = [
  {
    title: '前端技术',
    cmd: 'frontend --list',
    dotColor: 'bg-sky-400',
    icon: 'heroicons:code-bracket',
    iconBg: 'bg-sky-50 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
    items: [
      'Vue.js / Nuxt.js / React / Next.js',
      'TypeScript / JavaScript (ES6+)',
      'Tailwind CSS / SCSS',
      'Webpack / Vite / 微前端架构'
    ]
  },
  {
    title: '后端技术',
    cmd: 'backend --list',
    dotColor: 'bg-emerald-400',
    icon: 'heroicons:server',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    items: [
      'Node.js / Express / Koa',
      'Python / Django / FastAPI',
      'Java / Spring Boot',
      'RESTful API / GraphQL / gRPC'
    ]
  },
  {
    title: '数据库',
    cmd: 'database --list',
    dotColor: 'bg-purple-400',
    icon: 'heroicons:circle-stack',
    iconBg: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    items: ['PostgreSQL / MySQL', 'MongoDB / Redis', 'Elasticsearch / 全文搜索', '数据库设计与优化']
  },
  {
    title: '架构设计',
    cmd: 'architecture --list',
    dotColor: 'bg-orange-400',
    icon: 'heroicons:cube',
    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    items: [
      '微服务架构 / 分布式系统',
      '系统设计 / 高并发架构',
      '消息队列 / 事件驱动架构',
      '性能优化 / 可扩展性设计'
    ]
  },
  {
    title: '云服务 & DevOps',
    cmd: 'devops --list',
    dotColor: 'bg-cyan-400',
    icon: 'heroicons:cloud',
    iconBg: 'bg-cyan-50 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    items: [
      'AWS / Azure / 阿里云',
      'Docker / Kubernetes',
      'CI/CD / GitLab / GitHub Actions',
      'Terraform / 基础设施即代码'
    ]
  },
  {
    title: '工具 & 其他',
    cmd: 'tools --list',
    dotColor: 'bg-rose-400',
    icon: 'heroicons:wrench-screwdriver',
    iconBg: 'bg-rose-50 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    items: ['Git / 版本控制', 'Supabase / Firebase', '测试驱动开发 (TDD)', '敏捷开发 / Scrum']
  }
]

const career = [
  {
    title: '技术架构师',
    company: '某大型科技公司',
    period: '2022 — 至今',
    nodeColor: 'bg-primary-500',
    companyColor: 'text-primary-400',
    arrowColor: 'text-primary-500',
    items: [
      '负责公司核心业务系统的架构设计，设计并实施微服务架构，支持日活千万级用户',
      '主导技术选型，建立技术标准和最佳实践，提升团队整体技术能力',
      '优化系统性能，通过架构重构将系统响应时间降低 60%，成本节省 40%',
      '设计高可用、可扩展的分布式系统架构，系统可用性达到 99.99%'
    ]
  },
  {
    title: '高级全栈工程师',
    company: '某互联网公司',
    period: '2019 — 2022',
    nodeColor: 'bg-emerald-500',
    companyColor: 'text-emerald-400',
    arrowColor: 'text-emerald-500',
    items: [
      '负责全栈应用开发，从前端 UI 到后端 API，从数据库设计到部署上线',
      '设计和实现 RESTful API，支持移动端和 Web 端多平台接入',
      '优化数据库查询性能，通过索引优化和查询重构，将查询速度提升 5 倍',
      '建立 CI/CD 流程，实现自动化部署，将发布效率提升 80%'
    ]
  },
  {
    title: '全栈开发工程师',
    company: '某创业公司',
    period: '2017 — 2019',
    nodeColor: 'bg-purple-500',
    companyColor: 'text-purple-400',
    arrowColor: 'text-purple-500',
    items: [
      '从零开始构建公司核心产品，负责前后端全栈开发',
      '设计数据库架构，实现用户认证、权限管理等核心功能模块',
      '参与产品需求分析和技术方案设计，与产品、设计团队紧密协作',
      '快速迭代开发，在 3 个月内完成 MVP 版本并成功上线'
    ]
  }
]

const abilities = [
  {
    title: '系统架构设计',
    icon: 'heroicons:light-bulb',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgDecor: 'bg-amber-500',
    desc: '具备大型分布式系统架构设计能力，熟悉微服务、事件驱动、CQRS 等架构模式，能够设计高可用、高性能、可扩展的系统架构。'
  },
  {
    title: '全栈开发',
    icon: 'heroicons:rocket-launch',
    iconBg: 'bg-primary-50 dark:bg-primary-900/20',
    iconColor: 'text-primary-600 dark:text-primary-400',
    bgDecor: 'bg-primary-500',
    desc: '精通前后端技术栈，能够独立完成从需求分析、系统设计、开发实现到部署运维的完整流程，具备快速交付高质量产品的能力。'
  },
  {
    title: '性能优化',
    icon: 'heroicons:chart-bar',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgDecor: 'bg-emerald-500',
    desc: '擅长系统性能分析和优化，包括前端性能优化、数据库查询优化、API 响应时间优化等，能够识别瓶颈并提出有效的解决方案。'
  },
  {
    title: '技术领导力',
    icon: 'heroicons:user-group',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgDecor: 'bg-purple-500',
    desc: '具备技术团队管理和指导能力，能够制定技术规范、进行代码审查、组织技术分享，帮助团队成员成长，提升团队整体技术水平。'
  }
]

const contacts = [
  {
    label: '所在地',
    value: '上海，中国',
    href: '#',
    icon: 'heroicons:map-pin',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    groupIconBg: 'group-hover:bg-slate-200 dark:group-hover:bg-slate-700',
    iconColor: 'text-slate-500',
    hover: 'hover:border-slate-300 dark:hover:border-slate-700',
    external: false
  },
  {
    label: 'GitHub',
    value: 'github.com/me',
    href: 'https://github.com',
    icon: 'i-simple-icons-github',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    groupIconBg: 'group-hover:bg-slate-900 group-hover:text-white',
    iconColor: 'text-slate-600 dark:text-slate-400',
    hover: 'hover:border-slate-400 dark:hover:border-slate-600',
    external: true
  },
  {
    label: '电子邮件',
    value: 'contact@example.com',
    href: 'mailto:contact@example.com',
    icon: 'heroicons:envelope',
    iconBg: 'bg-primary-50 dark:bg-primary-900/30',
    groupIconBg: 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50',
    iconColor: 'text-primary-600 dark:text-primary-400',
    hover: 'hover:border-primary-200 dark:hover:border-primary-800/60',
    external: false
  },
  {
    label: '微信',
    value: 'braveheartonline',
    href: '#',
    icon: 'i-simple-icons-wechat',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    groupIconBg: 'group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:border-emerald-200 dark:hover:border-emerald-800/60',
    external: false
  }
]
</script>
