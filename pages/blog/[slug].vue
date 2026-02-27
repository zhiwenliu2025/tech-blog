<template>
  <div>
    <!-- ── 阅读进度条 ── -->
    <div
      class="fixed left-0 top-0 z-50 h-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-150"
      :style="{ width: `${readingProgress}%` }"
    />

    <!-- ── 粘性顶部工具栏（滚动后显示） ── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="readingProgress > 5 && post"
        class="fixed left-0 right-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90"
      >
        <div class="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            class="flex-shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            @click="navigateTo('/blog')"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4" />
          </button>
          <p class="min-w-0 flex-1 truncate font-mono text-xs text-slate-600 dark:text-slate-400">
            {{ post.title }}
          </p>
          <span class="flex-shrink-0 font-mono text-[10px] text-primary-500">
            {{ Math.round(readingProgress) }}%
          </span>
        </div>
        <div
          class="h-0.5 bg-gradient-to-r from-primary-500 to-indigo-500"
          :style="{ width: `${readingProgress}%` }"
        />
      </div>
    </Transition>

    <!-- ── 主内容 ── -->
    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <!-- ── Loading State ── -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-6 h-52 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-72" />
        <div class="mb-4 flex gap-2">
          <div class="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div class="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div class="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div class="mb-3 h-8 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800 sm:h-10" />
        <div class="mb-8 h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 sm:h-10" />
        <div class="flex gap-8">
          <div class="flex-1 space-y-3">
            <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="mt-6 h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div class="hidden w-60 shrink-0 space-y-3 lg:block">
            <div class="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-3 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <!-- ── Error State ── -->
      <div v-else-if="error" class="py-16 text-center">
        <div
          class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-800/40 dark:bg-rose-900/20"
        >
          <Icon name="heroicons:exclamation-triangle" class="h-8 w-8 text-rose-500" />
        </div>
        <p class="mb-1 font-mono text-xs text-slate-400 dark:text-slate-600">
          // error.loading.post
        </p>
        <h2 class="mb-2 text-xl font-bold text-slate-900 dark:text-white">加载失败</h2>
        <p class="mx-auto mb-7 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {{ error }}
        </p>
        <div class="flex items-center justify-center gap-3">
          <button
            class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:text-primary-400"
            @click="navigateTo('/blog')"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4" />
            回到列表
          </button>
          <button
            class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500"
            @click="refreshPost"
          >
            <Icon name="heroicons:arrow-path" class="h-4 w-4" />
            重试
          </button>
        </div>
      </div>

      <!-- ── Blog Post ── -->
      <article v-else-if="post">
        <!-- 面包屑 -->
        <nav
          class="mb-6 flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-slate-600"
        >
          <NuxtLink
            to="/"
            class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            ~
          </NuxtLink>
          <span>/</span>
          <NuxtLink
            to="/blog"
            class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            blog
          </NuxtLink>
          <span>/</span>
          <span class="truncate text-slate-500 dark:text-slate-500">{{ post.slug }}</span>
        </nav>

        <!-- ══ 封面图（满宽） ══ -->
        <div v-if="post.cover_image" class="relative mb-8 overflow-hidden rounded-2xl">
          <div class="aspect-[21/9] sm:aspect-[3/1]">
            <NuxtImg
              :src="post.cover_image"
              :alt="post.title"
              preset="cover"
              :sizes="'(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1400px'"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          />
          <!-- 分类标签 -->
          <div v-if="post.category" class="absolute left-4 top-4">
            <span
              class="rounded-lg bg-slate-900/80 px-2.5 py-1 font-mono text-xs text-primary-300 backdrop-blur-sm"
            >
              {{ post.category }}
            </span>
          </div>
          <!-- 封面上的标题 -->
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div class="mx-auto max-w-3xl">
              <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <div
                  class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/70"
                >
                  <time :datetime="post.created_at" class="flex items-center gap-1">
                    <Icon name="heroicons:calendar" class="h-3 w-3" />
                    {{ formatDate(post.created_at) }}
                  </time>
                  <span>·</span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:clock" class="h-3 w-3" />
                    {{ readTime }} min read
                  </span>
                  <span>·</span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:eye" class="h-3 w-3" />
                    {{ viewCount || 0 }} views
                  </span>
                </div>
              </div>
              <h1
                class="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl"
              >
                {{ post.title }}
              </h1>
            </div>
          </div>
        </div>

        <!-- ══ 无封面时的文章头 ══ -->
        <div v-else class="not-prose mb-8">
          <div class="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <NuxtLink
              v-if="post.category"
              :to="`/blog?category=${encodeURIComponent(post.category || '')}`"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 font-mono text-xs font-semibold text-primary-700 transition-all hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
            >
              <Icon name="heroicons:folder" class="h-3 w-3" />
              {{ post.category }}
            </NuxtLink>
            <div
              class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-slate-400 dark:text-slate-500"
            >
              <time :datetime="post.created_at" class="flex items-center gap-1">
                <Icon name="heroicons:calendar" class="h-3 w-3" />
                {{ formatDate(post.created_at) }}
              </time>
              <span class="text-slate-300 dark:text-slate-700">·</span>
              <span class="flex items-center gap-1">
                <Icon name="heroicons:clock" class="h-3 w-3" />
                {{ readTime }} min read
              </span>
              <span class="text-slate-300 dark:text-slate-700">·</span>
              <span class="flex items-center gap-1">
                <Icon name="heroicons:eye" class="h-3 w-3" />
                {{ viewCount || 0 }} views
              </span>
            </div>
          </div>
          <h1
            class="mb-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl lg:text-[2.6rem] lg:leading-[1.2]"
          >
            {{ post.title }}
          </h1>
        </div>

        <!-- ══ 摘要（满宽，在两列上方） ══ -->
        <p
          v-if="post.excerpt"
          class="not-prose mb-8 border-l-[3px] border-primary-500 pl-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          {{ post.excerpt }}
        </p>

        <!-- ══ 两列布局：正文 + 侧边栏 ══ -->
        <div class="flex gap-10 xl:gap-14">
          <!-- 左：正文 -->
          <div class="min-w-0 flex-1">
            <!-- 作者信息卡（终端窗口风格） -->
            <div
              class="not-prose mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/40"
            >
              <div
                class="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5 dark:border-slate-700/60 dark:bg-slate-800"
              >
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span class="ml-2 font-mono text-[10px] text-slate-500">author.json</span>
              </div>
              <div
                class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="shrink-0">
                    <img
                      v-if="author?.avatar_url"
                      :src="author.avatar_url"
                      :alt="author?.username || '作者'"
                      class="h-10 w-10 rounded-xl object-cover ring-2 ring-primary-200 dark:ring-primary-800"
                    />
                    <div
                      v-else
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700"
                    >
                      <Icon name="heroicons:user" class="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-slate-900 dark:text-white">
                      {{ author?.username || '匿名作者' }}
                    </p>
                    <p
                      v-if="author?.bio"
                      class="mt-0.5 truncate font-mono text-xs text-slate-500 dark:text-slate-400"
                    >
                      {{ author.bio }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="post?.author_id"
                  type="button"
                  class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg"
                  @click="navigateTo(`/authors/${post.author_id}`)"
                >
                  查看主页
                  <Icon name="heroicons:arrow-right" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- ── 正文内容（prose 区域）── -->
            <div
              ref="articleContentRef"
              class="prose prose-base max-w-none dark:prose-invert sm:prose-lg"
            >
              <ClientOnly>
                <BlogContentRenderer :content="post.content" content-type="auto" />
                <template #fallback>
                  <div class="not-prose animate-pulse space-y-3">
                    <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div class="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div class="mt-4 h-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div class="h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div class="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </template>
              </ClientOnly>
            </div>

            <!-- ══ 文章底部 ══ -->
            <div class="not-prose mt-10 border-t border-slate-200 pt-8 dark:border-slate-700/60">
              <!-- 标签 -->
              <div
                v-if="post.tags && post.tags.length > 0"
                class="mb-6 flex flex-wrap items-center gap-1.5"
              >
                <span class="mr-1 font-mono text-[10px] text-slate-400 dark:text-slate-600">
                  // tags
                </span>
                <NuxtLink
                  v-for="tag in post.tags"
                  :key="tag"
                  :to="`/blog?tag=${encodeURIComponent(tag)}`"
                  class="inline-flex cursor-pointer items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500 transition-all hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                >
                  #{{ tag }}
                </NuxtLink>
              </div>

              <!-- 互动卡（macOS 窗口风格） -->
              <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700/60 sm:mb-8">
                <div
                  class="flex items-center justify-between rounded-t-xl border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-red-400/60" />
                    <span class="h-2 w-2 rounded-full bg-amber-400/60" />
                    <span class="h-2 w-2 rounded-full bg-emerald-400/60" />
                    <span class="ml-1.5 font-mono text-[10px] text-slate-500">post.stats</span>
                  </div>
                  <div
                    class="flex items-center gap-3 font-mono text-[10px] text-slate-400 dark:text-slate-600"
                  >
                    <span class="flex items-center gap-1">
                      <Icon name="heroicons:eye" class="h-3 w-3" />
                      {{ viewCount || 0 }}
                    </span>
                    <span>·</span>
                    <span class="flex items-center gap-1">
                      <Icon name="heroicons:clock" class="h-3 w-3" />
                      {{ readTime }} min
                    </span>
                  </div>
                </div>

                <!-- 点赞 + 评论 -->
                <div
                  class="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800"
                >
                  <button
                    :disabled="likeLoading || !user"
                    class="group flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    :class="
                      isLiked
                        ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-800/50 dark:hover:text-rose-400'
                    "
                    @click="toggleLike"
                  >
                    <Icon
                      :name="isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                      class="h-4 w-4 transition-transform group-active:scale-125"
                    />
                    <span class="font-mono text-xs">{{ likesCount }}</span>
                  </button>
                  <div
                    class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <Icon name="heroicons:chat-bubble-left-right" class="h-4 w-4" />
                    <span class="font-mono text-xs">{{ commentsCount }}</span>
                  </div>
                  <span
                    v-if="!user"
                    class="font-mono text-[10px] text-slate-400 dark:text-slate-600"
                  >
                    // login to like
                  </span>
                </div>

                <!-- 分享 -->
                <div class="px-4 py-3">
                  <ShareButton
                    :title="post.title"
                    :url="shareUrl"
                    :excerpt="post.excerpt"
                    :cover-image="post.cover_image"
                  />
                </div>
              </div>

              <!-- 上一篇 / 下一篇 -->
              <div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <NuxtLink
                  v-if="prevPost"
                  :to="`/blog/${prevPost.slug}`"
                  class="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-primary-700"
                >
                  <p
                    class="mb-1.5 flex items-center gap-1 font-mono text-[10px] text-slate-400 transition-colors group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400"
                  >
                    <Icon name="heroicons:arrow-left" class="h-3 w-3" />
                    prev.post
                  </p>
                  <p
                    class="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                  >
                    {{ prevPost.title }}
                  </p>
                </NuxtLink>

                <NuxtLink
                  v-if="nextPost"
                  :to="`/blog/${nextPost.slug}`"
                  class="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-4 text-right transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-primary-700 md:text-left"
                >
                  <p
                    class="mb-1.5 flex items-center justify-end gap-1 font-mono text-[10px] text-slate-400 transition-colors group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400 md:justify-start"
                  >
                    next.post
                    <Icon name="heroicons:arrow-right" class="h-3 w-3" />
                  </p>
                  <p
                    class="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                  >
                    {{ nextPost.title }}
                  </p>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- 右：粘性侧边栏 -->
          <aside class="hidden w-56 shrink-0 xl:block">
            <div class="sticky top-20 space-y-5">
              <!-- 目录 TOC -->
              <div
                v-if="tocItems.length > 0"
                class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/60"
              >
                <div
                  class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <span class="h-2 w-2 rounded-full bg-red-400/60" />
                  <span class="h-2 w-2 rounded-full bg-amber-400/60" />
                  <span class="h-2 w-2 rounded-full bg-emerald-400/60" />
                  <span class="ml-1 font-mono text-[10px] text-slate-500">toc.md</span>
                </div>
                <nav class="p-3">
                  <ul class="space-y-0.5">
                    <li
                      v-for="item in tocItems"
                      :key="item.id"
                      :class="item.level === 3 ? 'pl-3' : ''"
                    >
                      <a
                        :href="`#${item.id}`"
                        class="block cursor-pointer truncate rounded-md px-2 py-1.5 font-mono text-[11px] leading-snug transition-all"
                        :class="
                          activeTocId === item.id
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        "
                        @click.prevent="scrollToHeading(item.id)"
                      >
                        {{ item.text }}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <!-- 快速统计 -->
              <div
                class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/60"
              >
                <div
                  class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <span class="h-2 w-2 rounded-full bg-red-400/60" />
                  <span class="h-2 w-2 rounded-full bg-amber-400/60" />
                  <span class="h-2 w-2 rounded-full bg-emerald-400/60" />
                  <span class="ml-1 font-mono text-[10px] text-slate-500">stats.json</span>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                  <div class="flex items-center justify-between px-4 py-2.5">
                    <span class="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                      <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
                      阅读时长
                    </span>
                    <span class="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                      {{ readTime }} min
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2.5">
                    <span class="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                      <Icon name="heroicons:eye" class="h-3.5 w-3.5" />
                      浏览量
                    </span>
                    <span class="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                      {{ viewCount || 0 }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2.5">
                    <span class="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                      <Icon name="heroicons:heart" class="h-3.5 w-3.5" />
                      点赞
                    </span>
                    <span class="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                      {{ likesCount }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2.5">
                    <span
                      class="flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                    >
                      <Icon name="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" />
                      评论
                    </span>
                    <span class="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                      {{ commentsCount }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 进度 -->
              <div
                class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/60"
              >
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="font-mono text-[11px] text-slate-500">阅读进度</span>
                  <span class="font-mono text-[11px] text-primary-500">
                    {{ Math.round(readingProgress) }}%
                  </span>
                </div>
                <div
                  class="mx-4 mb-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <div
                    class="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-300"
                    :style="{ width: `${readingProgress}%` }"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <!-- ═══════════ 评论区 ═══════════ -->
      <section v-if="post" class="mt-14 sm:mt-20">
        <!-- 区块标题 -->
        <div class="mb-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs text-slate-400 dark:text-slate-600">// comments</span>
            <span
              v-if="commentsCount > 0"
              class="rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
            >
              {{ commentsCount }}
            </span>
          </div>
          <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <!-- ── 已登录：评论输入框 ── -->
        <div
          v-if="user"
          class="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900"
        >
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-[10px] text-slate-500">comment.new</span>
            <div class="ml-auto flex items-center gap-2">
              <img
                v-if="user.email"
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`"
                alt="我的头像"
                class="h-5 w-5 rounded-full"
              />
              <span class="font-mono text-[10px] text-slate-500">{{ user.email }}</span>
            </div>
          </div>

          <form class="p-4" @submit.prevent="submitComment">
            <textarea
              ref="commentInput"
              v-model="newComment"
              placeholder="写下你的评论..."
              rows="4"
              class="mb-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:bg-slate-800"
              @focus="keyboardInput.handleFocus"
              @blur="keyboardInput.handleBlur"
            />
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] text-slate-400 dark:text-slate-600">
                {{ newComment.length }} chars
              </span>
              <button
                type="submit"
                :disabled="commentLoading || !newComment.trim()"
                class="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon
                  v-if="commentLoading"
                  name="heroicons:arrow-path"
                  class="h-4 w-4 animate-spin"
                />
                <Icon
                  v-else
                  name="heroicons:paper-airplane"
                  class="h-4 w-4 transition-transform group-hover:-rotate-45"
                />
                发表评论
              </button>
            </div>
          </form>
        </div>

        <!-- ── 未登录提示 ── -->
        <div
          v-else
          class="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900"
        >
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-[10px] text-slate-500">comment.new</span>
          </div>
          <div class="flex flex-col items-center gap-4 py-10 text-center">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
            >
              <Icon
                name="heroicons:lock-closed"
                class="h-5 w-5 text-slate-400 dark:text-slate-500"
              />
            </div>
            <div>
              <p class="font-mono text-xs text-slate-400 dark:text-slate-600">// auth.required</p>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">登录后才能发表评论</p>
            </div>
            <button
              class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg"
              @click="navigateTo('/auth/login')"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
              立即登录
            </button>
          </div>
        </div>

        <!-- ── 评论加载骨架 ── -->
        <div v-if="commentsLoading" class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <div
              class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div class="ml-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div class="flex gap-3 p-4">
              <div class="h-8 w-8 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div class="flex-1 space-y-2 pt-0.5">
                <div class="h-2.5 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div class="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                <div class="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        <!-- ── 评论列表 ── -->
        <template v-else>
          <div
            v-if="!comments || comments.length === 0"
            class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center dark:border-slate-800 dark:bg-slate-900/30"
          >
            <Icon
              name="heroicons:chat-bubble-left-right"
              class="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700"
            />
            <p class="font-mono text-xs text-slate-400 dark:text-slate-600">// no.comments.yet</p>
            <p class="mt-1 text-sm text-slate-400 dark:text-slate-500">来发表第一条评论吧！</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(comment, idx) in comments"
              :key="comment.id"
              class="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div
                class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-red-400/50" />
                  <span class="h-2 w-2 rounded-full bg-amber-400/50" />
                  <span class="h-2 w-2 rounded-full bg-emerald-400/50" />
                  <span class="ml-1.5 font-mono text-[10px] text-slate-400 dark:text-slate-600">
                    comment.{{ String(idx + 1).padStart(2, '0') }}
                  </span>
                </div>
                <time
                  :datetime="comment.created_at"
                  class="font-mono text-[10px] text-slate-400 dark:text-slate-600"
                >
                  {{ formatDate(comment.created_at) }}
                </time>
              </div>

              <div class="flex gap-3 p-4 sm:gap-4 sm:p-5">
                <div class="shrink-0">
                  <img
                    v-if="comment.profiles?.avatar_url"
                    :src="comment.profiles.avatar_url"
                    :alt="comment.profiles?.username || '用户'"
                    class="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                  />
                  <div
                    v-else
                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                  >
                    <Icon
                      name="heroicons:user"
                      class="h-4 w-4 text-slate-500 dark:text-slate-400"
                    />
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ comment.profiles?.username || comment.profiles?.full_name || '匿名用户' }}
                    </p>
                    <button
                      v-if="canDeleteComment(comment)"
                      :disabled="deleteLoading === comment.id"
                      class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-rose-500 opacity-0 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                      @click="handleDeleteComment(comment.id)"
                    >
                      <Icon
                        v-if="deleteLoading === comment.id"
                        name="heroicons:arrow-path"
                        class="h-3 w-3 animate-spin"
                      />
                      <Icon v-else name="heroicons:trash" class="h-3 w-3" />
                      删除
                    </button>
                  </div>
                  <p
                    class="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  level: number
}

const route = useRoute()
const slug = route.params.slug as string

// 阅读进度
const readingProgress = ref(0)

const updateReadingProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  updateReadingProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

// 认证状态
const { user } = useSupabaseAuth()

// 博客 API
const {
  getPostBySlug,
  getPostComments,
  addComment,
  deleteComment,
  checkIsAdmin,
  likePost,
  unlikePost,
  checkIfUserLikedPost
} = useBlogPosts()

const { getStats, incrementView } = usePostStats()
const { invalidateLike, invalidateComment } = useCacheManager()

// 状态
const commentLoading = ref(false)
const newComment = ref('')
const likeLoading = ref(false)
const isLiked = ref(false)
const deleteLoading = ref(null)
const isAdmin = ref(false)

// 评论输入框 ref
const commentInput = ref<HTMLTextAreaElement | null>(null)

// 键盘输入优化
const keyboardInput = useKeyboardInput(commentInput, {
  scrollDelay: 300,
  behavior: 'smooth',
  block: 'center',
  mobileOnly: true,
  offset: -20
})

// ── TOC ──
const articleContentRef = ref<HTMLElement | null>(null)
const tocItems = ref<TocItem[]>([])
const activeTocId = ref<string>('')

const buildToc = () => {
  if (!articleContentRef.value) return
  const headings = articleContentRef.value.querySelectorAll('h2, h3')
  const items: TocItem[] = []

  headings.forEach(heading => {
    const el = heading as HTMLElement
    const text = el.textContent?.trim() || ''
    if (!text) return

    // 生成或复用 ID
    if (!el.id) {
      el.id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]/g, '')
        .substring(0, 60)
    }

    items.push({
      id: el.id,
      text,
      level: heading.tagName === 'H2' ? 2 : 3
    })
  })

  tocItems.value = items
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

// IntersectionObserver 追踪当前 heading
let tocObserver: IntersectionObserver | null = null

const setupTocObserver = () => {
  if (tocObserver) {
    tocObserver.disconnect()
  }
  if (!articleContentRef.value || tocItems.value.length === 0) return

  const headingEls = tocItems.value
    .map(item => document.getElementById(item.id))
    .filter(Boolean) as HTMLElement[]

  tocObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
  )

  headingEls.forEach(el => tocObserver!.observe(el))
}

onUnmounted(() => {
  tocObserver?.disconnect()
})

// 阅读时间
const readTime = computed(() => {
  if (!post.value?.content) return 0
  const text = post.value.content.replace(/<[^>]*>/g, '')
  return Math.max(1, Math.ceil(text.length / 200))
})

// 相邻文章
const { data: adjacentPosts } = await useAsyncData(`adjacent-posts-${slug}`, async () => {
  if (!post.value) return { prev: null, next: null }
  return { prev: null, next: null }
})

const prevPost = computed(() => adjacentPosts.value?.prev)
const nextPost = computed(() => adjacentPosts.value?.next)

// 文章数据
const {
  data: postData,
  pending: postPending,
  error: postError,
  refresh: refreshPost
} = await useAsyncData(
  `post-${slug}`,
  async () => {
    const result = await getPostBySlug(slug)
    if (result.error) throw new Error(result.error)
    if (!result.data) throw new Error('文章不存在')
    return result.data
  },
  { default: () => null, server: true }
)

const post = computed(() => postData.value)
const author = computed(() => postData.value?.profiles || null)
const loading = computed(() => postPending.value)
const error = computed(() => {
  if (postError.value) return postError.value.message || '加载失败'
  return null
})

// 评论数据
const {
  data: commentsData,
  pending: commentsPending,
  refresh: refreshComments
} = await useAsyncData(
  `post-comments-${slug}`,
  async () => {
    if (!postData.value?.id) return []
    const result = await getPostComments(postData.value.id)
    if (result.error) {
      console.error('获取评论失败:', result.error)
      return []
    }
    return result.data || []
  },
  {
    default: () => [],
    server: true,
    watch: [() => postData.value?.id]
  }
)

const comments = computed(() => commentsData.value || [])
const commentsLoading = computed(() => commentsPending.value)

// 统计数据
const likesCount = ref(0)
const commentsCount = ref(0)
const viewCount = ref(0)

const fetchInteractionCounts = async () => {
  if (!postData.value?.id) return
  try {
    const stats = await getStats(postData.value.id)
    likesCount.value = stats.likeCount || 0
    commentsCount.value = stats.commentCount || 0
    viewCount.value = stats.viewCount || 0
  } catch (e) {
    console.error('获取统计数据失败:', e)
  }
}

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!user.value || !postData.value?.id) return
  try {
    const result = await checkIfUserLikedPost(user.value.sub, postData.value.id)
    isLiked.value = !!result.data
  } catch (e) {
    console.error('检查点赞状态失败:', e)
  }
}

// 提交评论
const submitComment = async () => {
  if (!user.value || !postData.value?.id || !newComment.value.trim()) return
  commentLoading.value = true
  try {
    const result = await addComment({
      post_id: postData.value.id,
      user_id: user.value.sub,
      content: newComment.value.trim()
    })
    if (!result.error) {
      newComment.value = ''
      await invalidateComment(postData.value.id)
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    }
  } catch (e) {
    console.error('发表评论失败:', e)
  } finally {
    commentLoading.value = false
  }
}

// 管理员检查
const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }
  try {
    const result = await checkIsAdmin(user.value.sub)
    if (!result.error) isAdmin.value = result.data || false
  } catch (e) {
    console.error('检查管理员状态失败:', e)
    isAdmin.value = false
  }
}

const canDeleteComment = (comment: any) => {
  if (!user.value) return false
  return comment.user_id === user.value.sub || isAdmin.value
}

const handleDeleteComment = async (commentId: string) => {
  if (!confirm('确定要删除这条评论吗？')) return
  deleteLoading.value = commentId
  try {
    const result = await deleteComment(commentId)
    if (!result.error) {
      if (postData.value?.id) await invalidateComment(postData.value.id)
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    } else {
      alert('删除评论失败：' + result.error)
    }
  } catch (e) {
    console.error('删除评论失败:', e)
    alert('删除评论失败')
  } finally {
    deleteLoading.value = null
  }
}

// 切换点赞
const toggleLike = async () => {
  if (!user.value || !postData.value?.id || likeLoading.value) return
  likeLoading.value = true
  try {
    if (isLiked.value) {
      const result = await unlikePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = false
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    } else {
      const result = await likePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = true
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    }
  } catch (e) {
    console.error('点赞操作失败:', e)
  } finally {
    likeLoading.value = false
  }
}

// 分享 URL
const config = useRuntimeConfig()
const shareUrl = computed(() => {
  if (!post.value) return ''
  const baseUrl =
    config.public.appUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/blog/${post.value.slug}`
})

// 日期格式化
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays} 天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`
  return `${Math.floor(diffDays / 365)} 年前`
}

// 页面元数据
useHead(() => ({
  title: () => (post.value ? `${post.value.title} - 技术博客` : '文章详情'),
  meta: [
    { name: 'description', content: () => post.value?.excerpt || post.value?.title || '文章详情' },
    { property: 'og:title', content: () => post.value?.title || '文章详情' },
    {
      property: 'og:description',
      content: () => post.value?.excerpt || post.value?.title || '文章详情'
    },
    { property: 'og:image', content: () => post.value?.cover_image || '/og-image.jpg' },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
}))

// 监听文章数据变化
watch(
  () => postData.value?.id,
  async postId => {
    if (postId) {
      await incrementView(postId)
      await fetchInteractionCounts()
      if (user.value) {
        await checkLikeStatus()
        await checkAdminStatus()
      }
    }
  },
  { immediate: true }
)

// 文章内容渲染后构建 TOC
watch(
  () => postData.value?.content,
  async () => {
    if (postData.value?.content) {
      await nextTick()
      // 等待 ClientOnly 渲染
      setTimeout(() => {
        buildToc()
        setupTocObserver()
      }, 500)
    }
  },
  { immediate: true }
)

// 监听用户登录状态
watch(user, async newUser => {
  if (newUser && postData.value) {
    await checkLikeStatus()
    await checkAdminStatus()
  } else if (!newUser) {
    isLiked.value = false
    isAdmin.value = false
  }
})
</script>
