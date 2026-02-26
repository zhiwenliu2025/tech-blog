<template>
  <div>
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white"
    >
      <!-- 点状网格背景 -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.22]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 30px 30px;
        "
      />
      <!-- 渐变光晕 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute -right-56 -top-28 h-[580px] w-[580px] rounded-full bg-primary-600/15 blur-3xl"
        />
        <div
          class="absolute -left-56 bottom-0 h-[480px] w-[480px] rounded-full bg-indigo-600/15 blur-3xl"
        />
        <div
          class="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-400/[0.07] blur-3xl"
        />
      </div>
      <!-- 底部渐变淡出 -->
      <div
        class="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-slate-900/60 to-transparent"
      />

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- 主 Hero 内容 -->
        <div class="flex flex-col items-center py-20 sm:py-28 lg:flex-row lg:gap-16 lg:py-32">
          <!-- 左侧文字区 -->
          <div class="flex-1 text-center lg:text-left">
            <!-- 状态徽章 -->
            <div
              class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"
                />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
              </span>
              持续更新中
            </div>

            <h1
              class="mb-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl"
            >
              <span
                class="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
              >
                探索技术世界
              </span>
            </h1>
            <p
              class="mx-auto mb-10 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl lg:mx-0"
            >
              分享前端开发、后端技术、云计算、架构设计等深度技术文章，让知识触手可及
            </p>

            <div
              class="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <NuxtLink
                to="/blog"
                class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/40 active:translate-y-0"
              >
                <Icon name="i-heroicons-book-open" class="h-5 w-5" />
                浏览文章
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 active:translate-y-0"
              >
                <Icon name="i-heroicons-information-circle" class="h-5 w-5" />
                了解更多
              </NuxtLink>
            </div>

            <!-- 技术标签行 -->
            <div
              class="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start"
            >
              <span
                v-for="tech in techTags"
                :key="tech"
                class="cursor-default rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 font-mono text-slate-400 backdrop-blur-sm transition-colors duration-150 hover:border-primary-500/40 hover:bg-primary-900/20 hover:text-primary-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- 右侧装饰卡片 (仅桌面) -->
          <div class="hidden lg:block lg:w-80 xl:w-96">
            <div
              class="relative rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-sm"
            >
              <!-- 窗口标题栏 -->
              <div
                class="flex items-center gap-2 rounded-t-2xl border-b border-slate-700/60 bg-slate-800/60 px-4 py-3"
              >
                <div class="h-3 w-3 rounded-full bg-red-500/80" />
                <div class="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div class="h-3 w-3 rounded-full bg-green-500/80" />
                <span class="ml-2 font-mono text-xs text-slate-500">blog.config.ts</span>
              </div>
              <!-- 代码内容 -->
              <div class="space-y-1 p-5 font-mono text-sm leading-relaxed">
                <div>
                  <span class="text-purple-400">const</span>
                  <span class="text-blue-300"> blog</span>
                  <span class="text-slate-300"> = {</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">framework</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-amber-300">'Nuxt 4'</span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">database</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-amber-300">'Supabase'</span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">language</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-amber-300">'TypeScript'</span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">hosting</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-amber-300">'Vercel'</span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">posts</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-sky-300">
                    <span v-if="loading" class="animate-pulse text-slate-600">...</span>
                    <span v-else>{{ posts.length }}</span>
                  </span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">categories</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-sky-300">
                    <span v-if="categoriesLoading" class="animate-pulse text-slate-600">...</span>
                    <span v-else>{{ categories.length }}</span>
                  </span>
                  <span class="text-slate-300">,</span>
                </div>
                <div class="pl-4">
                  <span class="text-emerald-400">tags</span>
                  <span class="text-slate-300">: </span>
                  <span class="text-sky-300">
                    <span v-if="tagsLoading" class="animate-pulse text-slate-600">...</span>
                    <span v-else>{{ tags.length }}</span>
                  </span>
                  <span class="text-slate-300">,</span>
                </div>
                <div>
                  <span class="text-slate-300">}</span>
                </div>
                <!-- 光标闪烁 -->
                <div class="mt-2 flex items-center gap-1.5">
                  <span class="text-slate-500">$</span>
                  <span class="text-primary-400">nuxt dev</span>
                  <span class="inline-block h-4 w-0.5 animate-pulse bg-primary-400 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats 统计条 -->
        <div class="border-t border-white/[0.07]">
          <div class="grid grid-cols-3 divide-x divide-white/[0.07]">
            <div class="flex flex-col items-center py-5 sm:flex-row sm:justify-center sm:gap-3">
              <span class="text-2xl font-bold text-white sm:text-3xl">
                <span v-if="loading" class="animate-pulse text-slate-600">—</span>
                <span v-else
                  >{{ posts.length }}<span class="text-lg text-primary-400">+</span></span
                >
              </span>
              <span class="text-xs text-slate-400 sm:text-sm">技术文章</span>
            </div>
            <div class="flex flex-col items-center py-5 sm:flex-row sm:justify-center sm:gap-3">
              <span class="text-2xl font-bold text-white sm:text-3xl">
                <span v-if="categoriesLoading" class="animate-pulse text-slate-600">—</span>
                <span v-else
                  >{{ categories.length }}<span class="text-lg text-primary-400">+</span></span
                >
              </span>
              <span class="text-xs text-slate-400 sm:text-sm">技术分类</span>
            </div>
            <div class="flex flex-col items-center py-5 sm:flex-row sm:justify-center sm:gap-3">
              <span class="text-2xl font-bold text-white sm:text-3xl">
                <span v-if="tagsLoading" class="animate-pulse text-slate-600">—</span>
                <span v-else>{{ tags.length }}<span class="text-lg text-primary-400">+</span></span>
              </span>
              <span class="text-xs text-slate-400 sm:text-sm">热门标签</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主内容 -->
    <main class="animate-fade-in bg-gray-50/50 dark:bg-transparent">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <!-- 主内容区 -->
          <div class="lg:col-span-3">
            <!-- 板块标题 -->
            <div class="mb-5 flex items-end justify-between">
              <div>
                <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary-500">
                  Latest
                </p>
                <div class="flex items-center gap-3">
                  <div class="h-6 w-1 rounded-full bg-primary-500" />
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    最新文章
                  </h2>
                </div>
              </div>
              <NuxtLink
                to="/blog"
                class="group mb-0.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary-600 transition-all duration-150 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
              >
                查看全部
                <Icon
                  name="i-heroicons-arrow-right"
                  class="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
                />
              </NuxtLink>
            </div>

            <!-- 分类快速筛选 -->
            <div
              v-if="!categoriesLoading && categories.length > 0"
              class="mb-5 flex flex-wrap gap-2"
            >
              <button
                :class="[
                  'rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
                  selectedCategory === null
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                ]"
                @click="setCategory(null)"
              >
                全部
              </button>
              <button
                v-for="cat in categories.slice(0, 6)"
                :key="cat"
                :class="[
                  'rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                ]"
                @click="setCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="space-y-4">
              <BlogPostCardSkeleton v-for="i in postsPerPage" :key="i" />
            </div>

            <!-- 错误状态 -->
            <div
              v-else-if="error"
              class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <EmptyState
                icon="i-heroicons-exclamation-triangle"
                title="加载失败"
                :description="error || '加载文章失败'"
                action-text="重试"
                @action="refreshPosts"
              />
            </div>

            <!-- 文章列表 -->
            <div v-else-if="filteredPosts.length > 0" class="space-y-4">
              <BlogPostCard
                v-for="post in paginatedPosts"
                :key="post.id"
                :post="post"
                :likes-count="post.likes_count || 0"
                :comments-count="post.comments_count || 0"
                :show-cover="false"
              />

              <!-- 分页 -->
              <div
                v-if="totalPages > 1"
                class="mt-6 flex flex-col items-center justify-between gap-4 sm:mt-8 sm:flex-row"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  显示第
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ (currentPage - 1) * postsPerPage + 1 }}
                  </span>
                  –
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ Math.min(currentPage * postsPerPage, filteredPosts.length) }}
                  </span>
                  条，共
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ filteredPosts.length }}
                  </span>
                  条
                </div>
                <nav
                  class="flex w-full items-center justify-center gap-1 overflow-x-auto pb-2 sm:w-auto sm:justify-start sm:pb-0"
                >
                  <button
                    :disabled="currentPage === 1"
                    class="touch-optimized flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    @click="goToPage(currentPage - 1)"
                  >
                    <Icon name="i-heroicons-chevron-left" class="h-4 w-4" />
                    <span class="hidden sm:inline">上一页</span>
                  </button>

                  <template v-if="totalPages <= 7">
                    <button
                      v-for="page in totalPages"
                      :key="page"
                      :class="[
                        'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 sm:min-w-[40px] sm:px-3',
                        currentPage === page
                          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                      ]"
                      @click="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                  </template>
                  <template v-else>
                    <button
                      :class="[
                        'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 sm:min-w-[40px] sm:px-3',
                        currentPage === 1
                          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                      ]"
                      @click="goToPage(1)"
                    >
                      1
                    </button>

                    <span
                      v-if="currentPage > 3"
                      class="select-none px-1 text-gray-400 dark:text-gray-600"
                      >···</span
                    >

                    <template v-for="page in visiblePages" :key="page">
                      <button
                        v-if="page !== 1 && page !== totalPages"
                        :class="[
                          'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 sm:min-w-[40px] sm:px-3',
                          currentPage === page
                            ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                        ]"
                        @click="goToPage(page)"
                      >
                        {{ page }}
                      </button>
                    </template>

                    <span
                      v-if="currentPage < totalPages - 2"
                      class="select-none px-1 text-gray-400 dark:text-gray-600"
                      >···</span
                    >

                    <button
                      :class="[
                        'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 sm:min-w-[40px] sm:px-3',
                        currentPage === totalPages
                          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                      ]"
                      @click="goToPage(totalPages)"
                    >
                      {{ totalPages }}
                    </button>
                  </template>

                  <button
                    :disabled="currentPage === totalPages"
                    class="touch-optimized flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    @click="goToPage(currentPage + 1)"
                  >
                    <span class="hidden sm:inline">下一页</span>
                    <Icon name="i-heroicons-chevron-right" class="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-else
              class="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <EmptyState
                icon="i-heroicons-document-text"
                :title="selectedCategory ? `「${selectedCategory}」暂无文章` : '暂无文章'"
                :description="selectedCategory ? '换个分类试试看？' : '还没有发布任何文章'"
                :action-text="selectedCategory ? '查看全部' : undefined"
                @action="selectedCategory ? setCategory(null) : undefined"
              />
            </div>
          </div>

          <!-- 侧边栏 -->
          <div class="lg:col-span-1">
            <div class="sticky top-20 space-y-4">
              <!-- 写文章入口 (仅登录用户) -->
              <div v-if="user" class="card overflow-hidden">
                <div class="p-4">
                  <NuxtLink
                    to="/blog/write"
                    class="touch-optimized flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all duration-200 hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
                  >
                    <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />
                    写文章
                  </NuxtLink>
                </div>
              </div>

              <!-- 热门文章组件 -->
              <HotPosts :limit="5" :days="30" :use-decay="true" :show-score="false" />

              <!-- 关于博客 -->
              <div class="card overflow-hidden">
                <div
                  class="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-3.5"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style="
                      background-image: radial-gradient(circle, white 1px, transparent 1px);
                      background-size: 14px 14px;
                    "
                  />
                  <h3 class="relative flex items-center gap-2 text-sm font-semibold text-white">
                    <Icon name="i-heroicons-sparkles" class="h-4 w-4 text-primary-200" />
                    关于博客
                  </h3>
                </div>
                <div class="p-4">
                  <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    基于 Nuxt 4 + Supabase 构建的技术博客，专注分享前端、后端、架构设计等深度内容。
                  </p>
                  <NuxtLink
                    to="/about"
                    class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 transition-all duration-150 hover:gap-1.5 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    了解更多
                    <Icon name="i-heroicons-arrow-right" class="h-3 w-3" />
                  </NuxtLink>
                </div>
              </div>

              <!-- 文章分类 -->
              <div class="card overflow-hidden">
                <div class="sidebar-widget-header">
                  <h3 class="sidebar-widget-title">
                    <Icon name="i-heroicons-folder" class="h-4 w-4 text-primary-500" />
                    文章分类
                  </h3>
                </div>
                <div class="p-2">
                  <div v-if="categoriesLoading" class="space-y-1.5 p-2">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  <div v-else-if="categories && categories.length > 0">
                    <NuxtLink
                      v-for="category in categories.slice(0, 6)"
                      :key="category"
                      :to="`/blog?category=${encodeURIComponent(category)}`"
                      class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-primary-400"
                    >
                      <span>{{ category }}</span>
                      <Icon name="i-heroicons-chevron-right" class="h-3.5 w-3.5 text-gray-400" />
                    </NuxtLink>
                  </div>
                  <div v-else class="py-4 text-center text-sm text-gray-400">暂无分类</div>
                </div>
              </div>

              <!-- 热门标签 -->
              <div class="card overflow-hidden">
                <div class="sidebar-widget-header">
                  <h3 class="sidebar-widget-title">
                    <Icon name="i-heroicons-tag" class="h-4 w-4 text-primary-500" />
                    热门标签
                  </h3>
                </div>
                <div class="p-4">
                  <div v-if="tagsLoading" class="flex flex-wrap gap-2">
                    <div
                      v-for="i in 8"
                      :key="i"
                      class="h-6 w-14 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  <div v-else-if="tags && tags.length > 0" class="flex flex-wrap gap-1.5">
                    <NuxtLink
                      v-for="tag in tags.slice(0, 12)"
                      :key="tag"
                      :to="`/blog?tag=${encodeURIComponent(tag)}`"
                      class="tag text-xs"
                    >
                      #{{ tag }}
                    </NuxtLink>
                  </div>
                  <div v-else class="py-4 text-center text-sm text-gray-400">暂无标签</div>
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
const route = useRoute()
const router = useRouter()

const techTags = [
  'Vue.js',
  'Nuxt 4',
  'TypeScript',
  'Node.js',
  'Docker',
  'PostgreSQL',
  'Go',
  'React'
]

// 分页与筛选状态
const currentPage = ref(parseInt((route.query.page as string) || '1'))
const postsPerPage = 5
const selectedCategory = ref<string | null>((route.query.category as string) || null)

const { fetchCategories, fetchTags } = useBlogPosts()

// 用户状态
const { user } = useSupabaseAuth()

// 使用缓存版本的文章列表
const {
  posts: cachedPosts,
  loading: postsLoading,
  error: postsError,
  fetchPosts
} = useCachedPostsList()

// 使用 useAsyncData 缓存分类列表
const { data: categoriesData, pending: categoriesPending } = await useAsyncData(
  'blog-categories',
  () => fetchCategories(),
  {
    default: () => [],
    server: true
  }
)

// 使用 useAsyncData 缓存标签列表
const { data: tagsData, pending: tagsPending } = await useAsyncData(
  'blog-tags',
  () => fetchTags(),
  {
    default: () => [],
    server: true
  }
)

// 计算属性
const posts = computed(() => {
  return Array.isArray(cachedPosts.value) ? cachedPosts.value : []
}) as ComputedRef<Array<any>>
const categories = computed(() => categoriesData.value || [])
const tags = computed(() => tagsData.value || [])
const loading = computed(() => postsLoading.value)
const error = computed(() => postsError.value)
const categoriesLoading = computed(() => categoriesPending.value)
const tagsLoading = computed(() => tagsPending.value)

// 按分类筛选
const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value
  return posts.value.filter((p: any) => p.category === selectedCategory.value)
})

// 切换分类筛选
const setCategory = (cat: string | null) => {
  selectedCategory.value = cat
  currentPage.value = 1
  updateQueryParams()
}

// 刷新文章（使用缓存API）
const refreshPosts = async () => {
  await fetchPosts({ page: 1, limit: 100 })
}

// 初始加载文章
onMounted(async () => {
  await refreshPosts()
})

// 分页计算属性
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

// 计算可见的页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 分页方法
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    updateQueryParams()
    if (process.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// 更新URL查询参数
const updateQueryParams = () => {
  const query: Record<string, string> = {}

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString()
  }
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }

  router.replace({ query })
}

// 监听路由变化，同步页码和分类
watch(
  () => route.query,
  newQuery => {
    const page = newQuery.page ? parseInt(newQuery.page as string) : 1
    if (page >= 1) currentPage.value = page
    selectedCategory.value = (newQuery.category as string) || null
  },
  { immediate: true }
)

useHead({
  title: '技术博客 - 首页',
  meta: [
    {
      name: 'description',
      content: '基于 Nuxt 4 和 Supabase 构建的技术博客，分享前端开发、后端技术、云计算等相关内容。'
    },
    { property: 'og:title', content: '技术博客' },
    {
      property: 'og:description',
      content: '分享前端开发、后端技术、云计算、架构设计等深度技术文章，让知识触手可及。'
    },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
