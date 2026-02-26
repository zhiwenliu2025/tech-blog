<template>
  <div>
    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="{ width: `${readingProgress}%` }" />

    <!-- 文章内容 -->
    <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-4 h-64 w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-80" />
        <div class="mb-3 mt-6 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700 sm:mb-4" />
        <div class="mb-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 sm:mb-6" />
        <div class="space-y-3">
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center sm:py-16">
        <div
          class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
        >
          <Icon name="heroicons:exclamation-triangle" class="h-10 w-10 text-red-500" />
        </div>
        <h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">加载失败</h2>
        <p class="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          {{ error }}
        </p>
        <button
          class="touch-optimized inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="navigateTo('/')"
        >
          <Icon name="heroicons:arrow-left" class="h-4 w-4" />
          返回首页
        </button>
      </div>

      <!-- Blog Post -->
      <article v-else-if="post" class="prose prose-base max-w-none dark:prose-invert sm:prose-lg">
        <!-- 封面图片 -->
        <div
          v-if="post.cover_image"
          class="relative -mx-3 mb-6 overflow-hidden rounded-2xl sm:-mx-4 sm:mb-8 md:-mx-6 lg:-mx-8"
        >
          <div class="aspect-[21/9] sm:aspect-[2/1]">
            <NuxtImg
              :src="post.cover_image"
              :alt="post.title"
              preset="cover"
              :sizes="'(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          />
        </div>

        <header class="mb-6 sm:mb-8">
          <!-- 元信息行：分类 + 日期 + 时间 + 阅读量 -->
          <div class="mb-5 flex flex-wrap items-center gap-2">
            <NuxtLink
              :to="`/blog?category=${encodeURIComponent(post.category || '')}`"
              class="touch-optimized inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 font-mono text-xs font-semibold text-primary-700 transition-all hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
            >
              <Icon name="heroicons:folder" class="h-3 w-3" />
              {{ post.category }}
            </NuxtLink>
            <span class="text-slate-300 dark:text-slate-700">/</span>
            <div
              class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
            >
              <Icon name="heroicons:calendar" class="h-3 w-3" />
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
            </div>
            <span class="text-slate-300 dark:text-slate-700">/</span>
            <div
              class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
            >
              <Icon name="heroicons:clock" class="h-3 w-3" />
              {{ readTime }} min read
            </div>
            <span class="text-slate-300 dark:text-slate-700">/</span>
            <div
              class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
            >
              <Icon name="heroicons:eye" class="h-3 w-3" />
              {{ viewCount || 0 }} views
            </div>
          </div>

          <!-- 标题 -->
          <h1
            class="mb-4 text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:mb-5 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.2]"
          >
            {{ post.title }}
          </h1>

          <!-- 摘要 -->
          <p
            v-if="post.excerpt"
            class="mb-6 border-l-[3px] border-primary-500 pl-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:mb-8 sm:text-lg"
          >
            {{ post.excerpt }}
          </p>

          <!-- 作者信息卡片 (终端风格) -->
          <div
            class="mb-6 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/40 sm:mb-8"
          >
            <!-- 窗口标题栏 -->
            <div
              class="flex items-center gap-2 rounded-t-xl border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700/60 dark:bg-slate-800"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-400">author.json</span>
            </div>
            <div
              class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="author?.avatar_url"
                    :src="author.avatar_url"
                    :alt="author?.username || '作者'"
                    class="h-11 w-11 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
                  />
                  <div
                    v-else
                    class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700"
                  >
                    <Icon name="heroicons:user" class="h-5 w-5 text-white" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-slate-900 dark:text-white">
                    {{ author?.username || '匿名作者' }}
                  </p>
                  <p v-if="author?.bio" class="truncate text-sm text-slate-500 dark:text-slate-400">
                    {{ author.bio }}
                  </p>
                </div>
              </div>
              <button
                v-if="post?.author_id"
                type="button"
                class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-xl"
                @click="navigateTo(`/authors/${post.author_id}`)"
              >
                查看主页
                <Icon name="heroicons:arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1.5">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog?tag=${encodeURIComponent(tag)}`"
              class="touch-optimized inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500 transition-all hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </header>

        <!-- 文章内容 -->
        <ClientOnly>
          <BlogContentRenderer :content="post.content" content-type="auto" />
          <template #fallback>
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <div class="animate-pulse space-y-4">
                <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </template>
        </ClientOnly>

        <!-- 文章底部 -->
        <footer class="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700/60 sm:mt-12">
          <!-- 互动统计卡 -->
          <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700/60 sm:mb-8">
            <!-- 统计行 -->
            <div
              class="flex flex-wrap items-center justify-between gap-4 rounded-t-xl bg-slate-50 px-5 py-4 dark:bg-slate-800/40"
            >
              <!-- 左侧：点赞 + 评论 -->
              <div class="flex items-center gap-3">
                <button
                  :disabled="likeLoading || !user"
                  class="touch-optimized group flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
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
                  <span>{{ likesCount }}</span>
                </button>
                <div
                  class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon name="heroicons:chat-bubble-left-right" class="h-4 w-4" />
                  <span>{{ commentsCount }}</span>
                </div>
              </div>
              <!-- 右侧：阅读量 + 时间 -->
              <div
                class="flex items-center gap-3 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                <span class="flex items-center gap-1">
                  <Icon name="heroicons:eye" class="h-3.5 w-3.5" />
                  {{ viewCount || 0 }}
                </span>
                <span class="text-slate-300 dark:text-slate-700">·</span>
                <span class="flex items-center gap-1">
                  <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
                  {{ readTime }} min
                </span>
              </div>
            </div>

            <!-- 分享按钮行 -->
            <div class="border-t border-slate-200 px-5 py-4 dark:border-slate-700/60">
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
            <div
              v-if="prevPost"
              class="touch-optimized group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-primary-700"
            >
              <NuxtLink :to="`/blog/${prevPost.slug}`" class="block">
                <p
                  class="mb-1.5 flex items-center gap-1 font-mono text-xs text-slate-400 group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400"
                >
                  <Icon name="heroicons:arrow-left" class="h-3 w-3" />
                  上一篇
                </p>
                <p
                  class="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                >
                  {{ prevPost.title }}
                </p>
              </NuxtLink>
            </div>

            <div
              v-if="nextPost"
              class="touch-optimized group rounded-xl border border-slate-200 bg-slate-50 p-4 text-right transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-primary-700 md:text-left"
            >
              <NuxtLink :to="`/blog/${nextPost.slug}`" class="block">
                <p
                  class="mb-1.5 flex items-center justify-end gap-1 font-mono text-xs text-slate-400 group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400 md:justify-start"
                >
                  下一篇
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
        </footer>
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
          <!-- macOS 标题栏 -->
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-[10px] text-slate-500">comment.new</span>
            <!-- 用户信息 -->
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
                class="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
              class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg"
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
              <div class="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />
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
          <!-- 空状态 -->
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

          <!-- 评论卡片列表 -->
          <div v-else class="space-y-3">
            <div
              v-for="(comment, idx) in comments"
              :key="comment.id"
              class="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <!-- 评论标题栏 -->
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
                <!-- 时间 -->
                <time
                  :datetime="comment.created_at"
                  class="font-mono text-[10px] text-slate-400 dark:text-slate-600"
                >
                  {{ formatDate(comment.created_at) }}
                </time>
              </div>

              <!-- 评论内容区 -->
              <div class="flex gap-3 p-4 sm:gap-4 sm:p-5">
                <!-- 头像 -->
                <div class="flex-shrink-0">
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

                <!-- 内容 -->
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ comment.profiles?.username || comment.profiles?.full_name || '匿名用户' }}
                    </p>
                    <!-- 删除按钮 -->
                    <button
                      v-if="canDeleteComment(comment)"
                      :disabled="deleteLoading === comment.id"
                      class="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-rose-500 opacity-0 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
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
// 获取路由参数
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

// 获取认证状态
const { user } = useSupabaseAuth()

// 获取博客文章
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

// 使用缓存获取统计信息
const { getStats, incrementView } = usePostStats()
const { invalidateLike, invalidateComment } = useCacheManager()

// 状态（部分状态保留，因为需要响应式更新）
// 状态（保留需要响应式更新的状态）
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
  offset: -20 // 向上偏移 20px，确保输入框上方有足够空间
})

// 计算阅读时间
const readTime = computed(() => {
  if (!post.value?.content) return 0

  // 假设每分钟阅读200字
  const wordsPerMinute = 200
  const text = post.value.content.replace(/<[^>]*>/g, '') // 移除HTML标签
  const wordCount = text.length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})

// 获取上一篇/下一篇文章
const { data: adjacentPosts } = await useAsyncData(`adjacent-posts-${slug}`, async () => {
  if (!post.value) return { prev: null, next: null }

  // 这里需要实现获取相邻文章的逻辑
  // 暂时返回null，稍后实现
  return { prev: null, next: null }
})

const prevPost = computed(() => adjacentPosts.value?.prev)
const nextPost = computed(() => adjacentPosts.value?.next)

// 使用 useAsyncData 缓存文章详情（基于 slug）
const {
  data: postData,
  pending: postPending,
  error: postError,
  refresh: refreshPost
} = await useAsyncData(
  `post-${slug}`,
  async () => {
    const result = await getPostBySlug(slug)
    if (result.error) {
      throw new Error(result.error)
    }
    if (!result.data) {
      throw new Error('文章不存在')
    }
    return result.data
  },
  {
    default: () => null,
    server: true
  }
)

// 从缓存数据中提取文章信息
const post = computed(() => postData.value)
const author = computed(() => postData.value?.profiles || null)
const loading = computed(() => postPending.value)
const error = computed(() => {
  if (postError.value) {
    return postError.value.message || '加载失败'
  }
  return null
})

// 使用 useAsyncData 缓存评论（评论需要实时性，但可以短时间缓存）
const {
  data: commentsData,
  pending: commentsPending,
  refresh: refreshComments
} = await useAsyncData(
  `post-comments-${slug}`,
  async () => {
    // 等待文章数据加载完成
    if (!postData.value?.id) {
      return []
    }
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
    // 评论需要实时性，但可以短时间缓存
    watch: [() => postData.value?.id] // 当文章ID变化时自动刷新
  }
)

const comments = computed(() => commentsData.value || [])
const commentsLoading = computed(() => commentsPending.value)

// 获取评论（保留用于手动刷新）
const fetchComments = async () => {
  await refreshComments()
}

// 使用缓存 API 获取互动数据（点赞数和评论数）
const likesCount = ref(0)
const commentsCount = ref(0)
const viewCount = ref(0)

// 获取统计数据（从缓存）
const fetchInteractionCounts = async () => {
  if (!postData.value?.id) return

  try {
    const stats = await getStats(postData.value.id)
    likesCount.value = stats.likeCount || 0
    commentsCount.value = stats.commentCount || 0
    viewCount.value = stats.viewCount || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!user.value || !postData.value?.id) return

  try {
    const result = await checkIfUserLikedPost(user.value.sub, postData.value.id)
    isLiked.value = result.data ? true : false
  } catch (err) {
    console.error('检查点赞状态失败:', err)
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
      // 清除缓存并刷新数据
      await invalidateComment(postData.value.id)
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    }
  } catch (err) {
    console.error('发表评论失败:', err)
  } finally {
    commentLoading.value = false
  }
}

// 检查管理员状态
const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }

  try {
    const result = await checkIsAdmin(user.value.sub)
    if (!result.error) {
      isAdmin.value = result.data || false
    }
  } catch (err) {
    console.error('检查管理员状态失败:', err)
    isAdmin.value = false
  }
}

// 检查是否可以删除评论
const canDeleteComment = (comment: any) => {
  if (!user.value) return false
  // 如果是评论作者或管理员，可以删除
  return comment.user_id === user.value.sub || isAdmin.value
}

// 删除评论
const handleDeleteComment = async (commentId: string) => {
  if (!confirm('确定要删除这条评论吗？')) return

  deleteLoading.value = commentId

  try {
    const result = await deleteComment(commentId)
    if (!result.error) {
      // 清除缓存并刷新数据
      if (postData.value?.id) {
        await invalidateComment(postData.value.id)
      }
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    } else {
      alert('删除评论失败：' + result.error)
    }
  } catch (err) {
    console.error('删除评论失败:', err)
    alert('删除评论失败')
  } finally {
    deleteLoading.value = null
  }
}

// 切换点赞状态
const toggleLike = async () => {
  if (!user.value || !postData.value?.id || likeLoading.value) return

  likeLoading.value = true

  try {
    let result

    if (isLiked.value) {
      result = await unlikePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = false
        // 清除缓存并刷新数据
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    } else {
      result = await likePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = true
        // 清除缓存并刷新数据
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
  } finally {
    likeLoading.value = false
  }
}

// 计算分享 URL
const config = useRuntimeConfig()
const shareUrl = computed(() => {
  if (!post.value) return ''
  const baseUrl =
    config.public.appUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/blog/${post.value.slug}`
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} 周前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} 个月前`
  } else {
    return `${Math.floor(diffDays / 365)} 年前`
  }
}

// 页面元数据
useHead(() => ({
  title: () => (post.value ? `${post.value.title} - 技术博客` : '文章详情'),
  meta: [
    {
      name: 'description',
      content: () => (post.value ? post.value.excerpt || post.value.title : '文章详情')
    },
    {
      property: 'og:title',
      content: () => (post.value ? post.value.title : '文章详情')
    },
    {
      property: 'og:description',
      content: () => (post.value ? post.value.excerpt || post.value.title : '文章详情')
    },
    {
      property: 'og:image',
      content: () => post.value?.cover_image || '/og-image.jpg'
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
}))

// 监听文章数据变化，初始化相关数据
watch(
  () => postData.value?.id,
  async postId => {
    if (postId) {
      // 增加阅读量（使用缓存API）
      await incrementView(postId)

      // 获取统计数据（从缓存）
      await fetchInteractionCounts()

      if (user.value) {
        await checkLikeStatus()
        await checkAdminStatus()
      }
    }
  },
  { immediate: true }
)

// 监听用户登录状态变化
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
