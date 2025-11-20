<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />

    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div class="relative h-64 md:h-80">
          <img
            src="https://picsum.photos/seed/about-hero/1200/400.jpg"
            alt="关于我"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <h1 class="text-3xl font-bold text-white md:text-4xl">关于我</h1>
          </div>
        </div>

        <div class="p-8">
          <div class="prose prose-lg max-w-none dark:prose-invert">
            <p class="lead mb-8 text-xl text-gray-600 dark:text-gray-300">
              欢迎来到我的技术博客！我是一名热爱编程和技术的开发者，专注于前端开发和用户体验设计。
            </p>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">我的技能</h2>

            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">前端开发</h3>
                <ul class="space-y-2">
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    HTML5 & CSS3
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    JavaScript (ES6+)
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    Vue.js / Nuxt.js
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    React / Next.js
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    Tailwind CSS
                  </li>
                </ul>
              </div>

              <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">后端开发</h3>
                <ul class="space-y-2">
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    Node.js
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    Express.js
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    Python
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    PostgreSQL
                  </li>
                  <li class="flex items-center text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:check-circle" class="mr-2 h-5 w-5 text-green-500" />
                    MongoDB
                  </li>
                </ul>
              </div>
            </div>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">我的经历</h2>

            <div class="mb-8 space-y-6">
              <div class="border-l-4 border-blue-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">高级前端工程师</h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某科技公司 | 2020年至今</p>
                <p class="text-gray-700 dark:text-gray-300">
                  负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目的交付。
                </p>
              </div>

              <div class="border-l-4 border-blue-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">前端开发工程师</h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某互联网公司 | 2018年 - 2020年</p>
                <p class="text-gray-700 dark:text-gray-300">
                  参与公司多个Web应用的开发，优化前端性能，提升用户体验。
                </p>
              </div>

              <div class="border-l-4 border-blue-500 pl-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  初级前端开发工程师
                </h3>
                <p class="mb-2 text-gray-600 dark:text-gray-400">某初创公司 | 2016年 - 2018年</p>
                <p class="text-gray-700 dark:text-gray-300">
                  负责公司官网和内部管理系统的前端开发工作。
                </p>
              </div>
            </div>

            <h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white">联系我</h2>

            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:envelope" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">邮箱</h3>
                  <p class="text-gray-600 dark:text-gray-400">contact@example.com</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:phone" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">电话</h3>
                  <p class="text-gray-600 dark:text-gray-400">+86 123 4567 8900</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:map-pin" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">地址</h3>
                  <p class="text-gray-600 dark:text-gray-400">中国，北京</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:link" class="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">社交媒体</h3>
                  <div class="mt-1 flex space-x-2">
                    <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                      <Icon name="heroicons:link" class="h-5 w-5" />
                    </a>
                    <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                      <Icon name="heroicons:link" class="h-5 w-5" />
                    </a>
                    <a href="#" class="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                      <Icon name="heroicons:link" class="h-5 w-5" />
                    </a>
                  </div>
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
                    <p>
                      这个博客旨在分享我在技术学习和项目开发中的经验与心得。我希望通过这个平台，
                      与更多的开发者交流，共同进步。如果你有任何问题或建议，欢迎随时联系我！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '关于我',
  description: '了解更多关于我的信息'
})
</script>
