<template>
  <div>
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div class="card overflow-hidden">
        <div class="relative h-48 overflow-hidden sm:h-56 md:h-64 lg:h-80">
          <NuxtImg
            src="https://picsum.photos/seed/about-hero/1200/400.jpg"
            alt="关于我"
            preset="cover"
            :sizes="'(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          />
          <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">关于我</h1>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div class="prose prose-base max-w-none dark:prose-invert sm:prose-lg">
            <p
              class="lead mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-xl"
            >
              欢迎来到我的技术博客！我是一名全栈工程师和系统架构师，拥有丰富的全栈开发经验和大型系统架构设计能力。
              我专注于构建高性能、可扩展的Web应用，从前端用户体验到后端服务架构，从数据库设计到DevOps实践，致力于打造完整的技术解决方案。
            </p>

            <h2 class="mb-4 mt-8 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              核心技能
            </h2>

            <div class="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Icon
                      name="heroicons:code-bracket"
                      class="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    前端技术
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Vue.js / Nuxt.js / React / Next.js
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    TypeScript / JavaScript (ES6+)
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Tailwind CSS / SCSS
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Webpack / Vite / 微前端架构
                  </li>
                </ul>
              </div>

              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
                  >
                    <Icon
                      name="heroicons:server"
                      class="h-5 w-5 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    后端技术
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Node.js / Express / Koa
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Python / Django / FastAPI
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Java / Spring Boot
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    RESTful API / GraphQL / gRPC
                  </li>
                </ul>
              </div>

              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
                  >
                    <Icon
                      name="heroicons:circle-stack"
                      class="h-5 w-5 text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    数据库
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    PostgreSQL / MySQL
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    MongoDB / Redis
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Elasticsearch / 全文搜索
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    数据库设计与优化
                  </li>
                </ul>
              </div>

              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30"
                  >
                    <Icon
                      name="heroicons:cube"
                      class="h-5 w-5 text-orange-600 dark:text-orange-400"
                    />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    架构设计
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    微服务架构 / 分布式系统
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    系统设计 / 高并发架构
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    消息队列 / 事件驱动架构
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    性能优化 / 可扩展性设计
                  </li>
                </ul>
              </div>

              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30"
                  >
                    <Icon name="heroicons:cloud" class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    云服务 & DevOps
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    AWS / Azure / 阿里云
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Docker / Kubernetes
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    CI/CD / GitLab / GitHub Actions
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Terraform / 基础设施即代码
                  </li>
                </ul>
              </div>

              <div
                class="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 sm:p-5"
              >
                <div class="mb-3 flex items-center">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30"
                  >
                    <Icon
                      name="heroicons:wrench-screwdriver"
                      class="h-5 w-5 text-red-600 dark:text-red-400"
                    />
                  </div>
                  <h3 class="ml-3 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    工具 & 其他
                  </h3>
                </div>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Git / 版本控制
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    Supabase / Firebase
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    测试驱动开发 (TDD)
                  </li>
                  <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Icon
                      name="heroicons:check-circle"
                      class="mr-2 h-4 w-4 text-green-500 sm:h-5 sm:w-5"
                    />
                    敏捷开发 / Scrum
                  </li>
                </ul>
              </div>
            </div>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">职业经历</h2>

            <div class="mb-8 space-y-6">
              <div class="border-l-4 border-blue-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">技术架构师</h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某大型科技公司 | 2022年至今</p>
                <ul class="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-blue-500"
                    />
                    <span
                      >负责公司核心业务系统的架构设计，设计并实施微服务架构，支持日活千万级用户</span
                    >
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-blue-500"
                    />
                    <span>主导技术选型，建立技术标准和最佳实践，提升团队整体技术能力</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-blue-500"
                    />
                    <span>优化系统性能，通过架构重构将系统响应时间降低60%，成本节省40%</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-blue-500"
                    />
                    <span>设计高可用、可扩展的分布式系统架构，系统可用性达到99.99%</span>
                  </li>
                </ul>
              </div>

              <div class="border-l-4 border-green-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">高级全栈工程师</h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某互联网公司 | 2019年 - 2022年</p>
                <ul class="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500"
                    />
                    <span>负责全栈应用开发，从前端UI到后端API，从数据库设计到部署上线</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500"
                    />
                    <span>设计和实现RESTful API，支持移动端和Web端多平台接入</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500"
                    />
                    <span>优化数据库查询性能，通过索引优化和查询重构，将查询速度提升5倍</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500"
                    />
                    <span>建立CI/CD流程，实现自动化部署，将发布效率提升80%</span>
                  </li>
                </ul>
              </div>

              <div class="border-l-4 border-purple-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">全栈开发工程师</h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某创业公司 | 2017年 - 2019年</p>
                <ul class="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-purple-500"
                    />
                    <span>从零开始构建公司核心产品，负责前后端全栈开发</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-purple-500"
                    />
                    <span>设计数据库架构，实现用户认证、权限管理等核心功能模块</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-purple-500"
                    />
                    <span>参与产品需求分析和技术方案设计，与产品、设计团队紧密协作</span>
                  </li>
                  <li class="flex items-start">
                    <Icon
                      name="heroicons:arrow-right"
                      class="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-purple-500"
                    />
                    <span>快速迭代开发，在3个月内完成MVP版本并成功上线</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">核心能力</h2>

            <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-3 flex items-center">
                  <Icon name="heroicons:light-bulb" class="mr-2 h-6 w-6 text-yellow-500" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">系统架构设计</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  具备大型分布式系统架构设计能力，熟悉微服务、事件驱动、CQRS等架构模式，
                  能够设计高可用、高性能、可扩展的系统架构。
                </p>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-3 flex items-center">
                  <Icon name="heroicons:rocket-launch" class="mr-2 h-6 w-6 text-blue-500" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">全栈开发</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  精通前后端技术栈，能够独立完成从需求分析、系统设计、开发实现到部署运维的完整流程，
                  具备快速交付高质量产品的能力。
                </p>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-3 flex items-center">
                  <Icon name="heroicons:chart-bar" class="mr-2 h-6 w-6 text-green-500" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">性能优化</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  擅长系统性能分析和优化，包括前端性能优化、数据库查询优化、API响应时间优化等，
                  能够识别瓶颈并提出有效的解决方案。
                </p>
              </div>

              <div
                class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="mb-3 flex items-center">
                  <Icon name="heroicons:user-group" class="mr-2 h-6 w-6 text-purple-500" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">技术领导力</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  具备技术团队管理和指导能力，能够制定技术规范、进行代码审查、组织技术分享，
                  帮助团队成员成长，提升团队整体技术水平。
                </p>
              </div>
            </div>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">联系我</h2>

            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:map-pin" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">地址</h3>
                  <p class="text-gray-600 dark:text-gray-400">中国，上海</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:chat-bubble-left-right" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">微信</h3>
                  <p class="text-gray-600 dark:text-gray-400">braveheartonline</p>
                </div>
              </div>
            </div>

            <div class="rounded-md border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/20">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:light-bulb" class="h-6 w-6 text-blue-500" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100">博客宗旨</h3>
                  <div class="mt-2 text-blue-700 dark:text-blue-200">
                    <p class="mb-3">
                      这个博客是我分享全栈开发经验和系统架构设计心得的平台。在这里，我会分享：
                    </p>
                    <ul class="ml-4 list-disc space-y-1">
                      <li>全栈开发实践：从前端到后端，从数据库到DevOps的完整技术栈经验</li>
                      <li>架构设计思考：微服务、分布式系统、高并发架构等系统设计经验</li>
                      <li>技术深度解析：深入理解技术原理，分享最佳实践和踩坑经验</li>
                      <li>性能优化技巧：系统性能优化、数据库优化、前端优化等实战案例</li>
                      <li>技术趋势洞察：关注新技术发展，分享对技术趋势的思考和实践</li>
                    </ul>
                    <p class="mt-3">
                      我希望通过这个平台，与更多的开发者交流学习，共同成长。如果你有任何技术问题、架构设计问题或合作机会，欢迎随时联系我！
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
  title: '关于我',
  description: '了解更多关于我的信息'
})
</script>
