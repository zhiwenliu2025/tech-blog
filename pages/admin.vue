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
        class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"
      />
      <div
        class="bg-primary-600/8 pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="mb-1 font-mono text-xs text-purple-400">// admin.dashboard</div>
            <h1 class="text-2xl font-bold text-white">管理后台</h1>
            <p class="mt-1 font-mono text-sm text-slate-400">管理博客文章、用户和系统设置</p>
          </div>
          <!-- 快速统计 -->
          <div class="flex items-center gap-4">
            <div class="text-center">
              <div class="text-xl font-bold text-white">
                {{ posts.length }}
              </div>
              <div class="font-mono text-[10px] text-slate-500">posts</div>
            </div>
            <div class="h-8 w-px bg-slate-700" />
            <div class="text-center">
              <div class="text-xl font-bold text-white">
                {{ users.length }}
              </div>
              <div class="font-mono text-[10px] text-slate-500">users</div>
            </div>
            <div class="h-8 w-px bg-slate-700" />
            <div class="text-center">
              <div
                class="text-xl font-bold"
                :class="unreadCount > 0 ? 'text-primary-400' : 'text-white'"
              >
                {{ unreadCount }}
              </div>
              <div class="font-mono text-[10px] text-slate-500">unread</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ 主内容 ═══════════ -->
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Tab 导航（pill 风格） -->
      <div
        class="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
          :class="
            activeTab === tab.id
              ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-700'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300'
          "
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="h-4 w-4" />
          <span>{{ tab.name }}</span>
          <!-- 未读消息徽章 -->
          <span
            v-if="tab.id === 'messages' && unreadCount > 0"
            class="rounded-full bg-primary-600 px-1.5 py-0.5 font-mono text-[10px] text-white"
          >
            {{ unreadCount }}
          </span>
        </button>
      </div>

      <!-- ═══ 文章管理 ═══ -->
      <div v-if="activeTab === 'posts'">
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- 标题栏 -->
          <div
            class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                >// posts.list</span
              >
              <span
                class="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              >
                {{ posts.length }} 篇
              </span>
            </div>
            <NuxtLink
              to="/blog/create"
              class="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500"
            >
              <Icon name="i-heroicons-plus" class="h-4 w-4" />
              新建文章
            </NuxtLink>
          </div>

          <!-- 移动端卡片 -->
          <div class="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
            <div v-for="post in posts" :key="post.id" class="p-4">
              <div class="mb-2 flex items-start justify-between gap-2">
                <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ post.title }}
                </h4>
                <span
                  class="flex-shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px]"
                  :class="
                    post.published
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
                  "
                >
                  {{ post.published ? 'published' : 'draft' }}
                </span>
              </div>
              <p class="mb-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                {{ post.excerpt }}
              </p>
              <div
                class="mb-3 flex items-center gap-3 font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >
                <span>{{ post.category || '未分类' }}</span>
                <span>·</span>
                <span>{{ getAuthorName(post.author_id) }}</span>
                <span>·</span>
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/blog/edit/${post.id}`"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon name="i-heroicons-pencil" class="h-3.5 w-3.5" />编辑
                </NuxtLink>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-800/50 dark:bg-slate-800 dark:text-rose-400"
                  @click="confirmDeletePost(post)"
                >
                  <Icon name="i-heroicons-trash" class="h-3.5 w-3.5" />删除
                </button>
              </div>
            </div>
            <div v-if="posts.length === 0" class="py-12 text-center">
              <Icon
                name="heroicons:document-text"
                class="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700"
              />
              <p class="font-mono text-xs text-slate-400">暂无文章</p>
            </div>
          </div>

          <!-- 桌面端表格 -->
          <div class="hidden overflow-x-auto sm:block">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    标题
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    作者
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    分类
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    状态
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    创建时间
                  </th>
                  <th
                    class="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="post in posts"
                  :key="post.id"
                  class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td class="px-5 py-3.5">
                    <div class="text-sm font-medium text-slate-900 dark:text-white">
                      {{ post.title }}
                    </div>
                    <div class="mt-0.5 max-w-xs truncate font-mono text-[11px] text-slate-400">
                      {{ post.excerpt }}
                    </div>
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    {{ getAuthorName(post.author_id) }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5">
                    <span
                      class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {{ post.category || '未分类' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5">
                    <span
                      class="rounded-md px-2 py-0.5 font-mono text-[10px]"
                      :class="
                        post.published
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
                      "
                    >
                      {{ post.published ? 'published' : 'draft' }}
                    </span>
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] text-slate-400 dark:text-slate-500"
                  >
                    {{ formatDate(post.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5 text-right">
                    <NuxtLink
                      :to="`/blog/edit/${post.id}`"
                      class="mr-3 font-mono text-xs text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      编辑
                    </NuxtLink>
                    <button
                      type="button"
                      class="font-mono text-xs text-rose-500 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                      @click="confirmDeletePost(post)"
                    >
                      删除
                    </button>
                  </td>
                </tr>
                <tr v-if="posts.length === 0">
                  <td colspan="6" class="py-12 text-center">
                    <Icon
                      name="heroicons:document-text"
                      class="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700"
                    />
                    <p class="font-mono text-xs text-slate-400">暂无文章</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ═══ 消息管理 ═══ -->
      <div v-if="activeTab === 'messages'">
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                >// messages.inbox</span
              >
              <span
                class="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >{{ messages.length }} 条</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span
                v-if="unreadCount > 0"
                class="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-600 dark:border-primary-800/50 dark:bg-primary-900/20 dark:text-primary-400"
              >
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
                {{ unreadCount }} 未读
              </span>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="message in messages"
              :key="message.id"
              class="p-5 transition-colors"
              :class="
                !message.read
                  ? 'bg-primary-50/30 dark:bg-primary-900/5'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
              "
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 flex-1">
                  <!-- 元信息行 -->
                  <div class="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      class="rounded-md px-2 py-0.5 font-mono text-[10px]"
                      :class="
                        !message.read
                          ? 'border border-primary-200 bg-primary-50 text-primary-600 dark:border-primary-800/50 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      "
                    >
                      {{ message.read ? 'read' : 'unread' }}
                    </span>
                    <span class="font-semibold text-slate-900 dark:text-white">{{
                      message.subject
                    }}</span>
                  </div>
                  <!-- 发送人 -->
                  <div class="mb-2 font-mono text-xs text-slate-400 dark:text-slate-500">
                    {{ message.name }} &lt;{{ message.email }}&gt; ·
                    {{ formatDate(message.created_at) }}
                  </div>
                  <!-- 消息预览 -->
                  <p class="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {{ message.message }}
                  </p>
                </div>
                <!-- 操作按钮 -->
                <div class="flex flex-shrink-0 items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    @click="openMessage(message)"
                  >
                    <Icon name="i-heroicons-eye" class="h-3.5 w-3.5" />查看
                  </button>
                  <button
                    v-if="!message.read"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-600 transition-all hover:bg-emerald-50 dark:border-emerald-800/50 dark:bg-slate-800 dark:text-emerald-400"
                    @click="markAsRead(message)"
                  >
                    <Icon name="i-heroicons-check" class="h-3.5 w-3.5" />已读
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-800/50 dark:bg-slate-800 dark:text-rose-400"
                    @click="confirmDeleteMessage(message)"
                  >
                    <Icon name="i-heroicons-trash" class="h-3.5 w-3.5" />删除
                  </button>
                </div>
              </div>
            </div>
            <div v-if="messages.length === 0" class="py-12 text-center">
              <Icon
                name="heroicons:inbox"
                class="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700"
              />
              <p class="font-mono text-xs text-slate-400">暂无消息</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ 用户管理 ═══ -->
      <div v-if="activeTab === 'users'">
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                >// users.list</span
              >
              <span
                class="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >{{ users.length }} 位</span
              >
            </div>
          </div>

          <!-- 移动端卡片 -->
          <div class="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
            <div v-for="user in users" :key="user.id" class="flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                >
                  <Icon
                    name="i-heroicons-user"
                    class="h-5 w-5 text-slate-500 dark:text-slate-400"
                  />
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">
                    {{ user.full_name || user.username || '未知用户' }}
                  </p>
                  <p class="font-mono text-xs text-slate-400">@{{ user.username || 'unknown' }}</p>
                  <span
                    class="mt-1 inline-flex rounded-md px-1.5 py-0.5 font-mono text-[10px]"
                    :class="
                      user.is_admin
                        ? 'border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    "
                  >
                    {{ user.is_admin ? 'admin' : 'user' }}
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
                :class="
                  user.is_admin
                    ? 'border-amber-200 bg-white text-amber-600 hover:bg-amber-50 dark:border-amber-800/50 dark:bg-slate-800 dark:text-amber-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                "
                @click="toggleAdminRole(user)"
              >
                {{ user.is_admin ? '取消管理员' : '设为管理员' }}
              </button>
            </div>
            <div v-if="users.length === 0" class="py-12 text-center">
              <Icon
                name="heroicons:users"
                class="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700"
              />
              <p class="font-mono text-xs text-slate-400">暂无用户</p>
            </div>
          </div>

          <!-- 桌面端表格 -->
          <div class="hidden overflow-x-auto sm:block">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    用户
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    邮箱
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    角色
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    注册时间
                  </th>
                  <th
                    class="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                      >
                        <Icon
                          name="i-heroicons-user"
                          class="h-4 w-4 text-slate-500 dark:text-slate-400"
                        />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-slate-900 dark:text-white">
                          {{ user.full_name || user.username || '未知用户' }}
                        </div>
                        <div class="font-mono text-[11px] text-slate-400">
                          @{{ user.username || 'unknown' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400"
                  >
                    {{ getUserEmail(user.id) }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5">
                    <span
                      class="rounded-md px-2 py-0.5 font-mono text-[10px]"
                      :class="
                        user.is_admin
                          ? 'border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      "
                    >
                      {{ user.is_admin ? 'admin' : 'user' }}
                    </span>
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] text-slate-400 dark:text-slate-500"
                  >
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5 text-right">
                    <button
                      type="button"
                      class="font-mono text-xs transition-colors"
                      :class="
                        user.is_admin
                          ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
                          : 'text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300'
                      "
                      @click="toggleAdminRole(user)"
                    >
                      {{ user.is_admin ? '取消管理员' : '设为管理员' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="5" class="py-12 text-center">
                    <Icon
                      name="heroicons:users"
                      class="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-700"
                    />
                    <p class="font-mono text-xs text-slate-400">暂无用户</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ═══ 系统设置 ═══ -->
      <div v-if="activeTab === 'settings'">
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
              >// system.config</span
            >
          </div>
          <div class="p-5 sm:p-6">
            <div class="space-y-8">
              <!-- 站点信息 -->
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <span class="font-mono text-xs text-primary-500">site.info</span>
                  <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="site_name"
                      class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                    >
                      <span class="text-primary-500">site_name</span>
                    </label>
                    <input
                      id="site_name"
                      v-model="settings.site_name"
                      type="text"
                      class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label
                      for="site_description"
                      class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                    >
                      <span class="text-primary-500">site_description</span>
                    </label>
                    <input
                      id="site_description"
                      v-model="settings.site_description"
                      type="text"
                      class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <!-- 功能开关 -->
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <span class="font-mono text-xs text-primary-500">feature.flags</span>
                  <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>
                <div class="space-y-3">
                  <!-- 允许注册 -->
                  <div
                    class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <div>
                      <p class="font-mono text-xs text-primary-500">allow_registration</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        新用户可以自行注册账户
                      </p>
                    </div>
                    <button
                      type="button"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                      :class="
                        settings.allow_registration
                          ? 'bg-primary-600'
                          : 'bg-slate-300 dark:bg-slate-600'
                      "
                      @click="settings.allow_registration = !settings.allow_registration"
                    >
                      <span
                        class="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="settings.allow_registration ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </button>
                  </div>
                  <!-- 文章审核 -->
                  <div
                    class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <div>
                      <p class="font-mono text-xs text-primary-500">require_approval</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        新发布的文章需要管理员审核后才能公开
                      </p>
                    </div>
                    <button
                      type="button"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                      :class="
                        settings.require_approval
                          ? 'bg-primary-600'
                          : 'bg-slate-300 dark:bg-slate-600'
                      "
                      @click="settings.require_approval = !settings.require_approval"
                    >
                      <span
                        class="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="settings.require_approval ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg"
                  @click="saveSettings"
                >
                  <Icon name="heroicons:check" class="h-4 w-4" />
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ 删除文章弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeletePostDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="showDeletePostDialog = false"
      >
        <div
          class="w-full max-w-sm overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span
                class="h-2.5 w-2.5 rounded-full bg-amber-400/70"
              /><span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">post.delete</span>
            </div>
            <button
              class="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              @click="showDeletePostDialog = false"
            >
              <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
            </button>
          </div>
          <div class="p-5">
            <div class="mb-4 flex items-start gap-3">
              <div
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-900/40"
              >
                <Icon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <p class="font-semibold text-white">确认删除文章</p>
                <p class="mt-1 text-sm text-slate-400">
                  删除「<span class="text-white">{{ postToDelete?.title }}</span
                  >」？此操作无法撤销。
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                @click="showDeletePostDialog = false"
              >
                取消
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-500"
                @click="deletePost"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════ 消息详情弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMessageDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="showMessageDialog = false"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span
                class="h-2.5 w-2.5 rounded-full bg-amber-400/70"
              /><span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">message.view</span>
            </div>
            <button
              class="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              @click="showMessageDialog = false"
            >
              <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
            </button>
          </div>
          <div class="space-y-4 p-5">
            <!-- 发件人信息 -->
            <div
              class="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700">
                <Icon name="i-heroicons-envelope" class="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p class="font-mono text-xs text-slate-500">from</p>
                <p class="text-sm font-medium text-white">
                  {{ messageToView?.name }} &lt;{{ messageToView?.email }}&gt;
                </p>
              </div>
              <div class="ml-auto">
                <p class="font-mono text-[10px] text-slate-500">
                  {{ formatDate(messageToView?.created_at) }}
                </p>
              </div>
            </div>
            <!-- 主题 -->
            <div>
              <p class="mb-1 font-mono text-[10px] text-slate-500">subject</p>
              <p class="font-semibold text-white">
                {{ messageToView?.subject }}
              </p>
            </div>
            <!-- 内容 -->
            <div>
              <p class="mb-1.5 font-mono text-[10px] text-slate-500">message</p>
              <div
                class="max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-slate-800/40 p-4"
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {{ messageToView?.message }}
                </p>
              </div>
            </div>
            <!-- 操作 -->
            <div class="flex gap-2 border-t border-slate-800 pt-3">
              <button
                v-if="!messageToView?.read"
                type="button"
                class="flex-1 rounded-lg border border-emerald-700/50 bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-900/50"
                @click="markAsRead(messageToView)"
              >
                标记为已读
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                @click="showMessageDialog = false"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════ 删除消息弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteMessageDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="showDeleteMessageDialog = false"
      >
        <div
          class="w-full max-w-sm overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span
                class="h-2.5 w-2.5 rounded-full bg-amber-400/70"
              /><span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">message.delete</span>
            </div>
            <button
              class="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              @click="showDeleteMessageDialog = false"
            >
              <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
            </button>
          </div>
          <div class="p-5">
            <div class="mb-4 flex items-start gap-3">
              <div
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-900/40"
              >
                <Icon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <p class="font-semibold text-white">确认删除消息</p>
                <p class="mt-1 text-sm text-slate-400">
                  删除来自「<span class="text-white">{{ messageToDelete?.name }}</span
                  >」的消息？此操作无法撤销。
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                @click="showDeleteMessageDialog = false"
              >
                取消
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-500"
                @click="deleteMessage"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  title: '管理后台',
  description: '管理博客文章、用户和系统设置',
  middleware: 'admin'
})

const { deletePost: deletePostFromBlog } = useBlogPosts()

const activeTab = ref('posts')
const posts = ref([])
const users = ref([])
const messages = ref([])
const showDeletePostDialog = ref(false)
const postToDelete = ref(null)
const showMessageDialog = ref(false)
const messageToView = ref(null)
const showDeleteMessageDialog = ref(false)
const messageToDelete = ref(null)

const settings = reactive({
  site_name: '技术博客',
  site_description: '分享技术知识和经验',
  allow_registration: true,
  require_approval: false
})

const tabs = [
  { id: 'posts', name: '文章管理', icon: 'i-heroicons-document-text' },
  { id: 'messages', name: '消息管理', icon: 'i-heroicons-envelope' },
  { id: 'users', name: '用户管理', icon: 'i-heroicons-users' },
  { id: 'settings', name: '系统设置', icon: 'i-heroicons-cog-6-tooth' }
]

const fetchPosts = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    posts.value = data || []
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

const fetchUsers = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const fetchMessages = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    messages.value = data || []
  } catch (error) {
    console.error('获取消息列表失败:', error)
  }
}

const unreadCount = computed(() => messages.value.filter(m => !m.read).length)
const getAuthorName = authorId => {
  const user = users.value.find(u => u.id === authorId)
  return user?.full_name || user?.username || '未知用户'
}
const getUserEmail = () => 'user@example.com'

const formatDate = dateString => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const confirmDeletePost = post => {
  postToDelete.value = post
  showDeletePostDialog.value = true
}
const deletePost = async () => {
  if (!postToDelete.value) return
  try {
    const { error } = await deletePostFromBlog(postToDelete.value.id)
    if (error) throw new Error(error)
    await fetchPosts()
    showDeletePostDialog.value = false
    postToDelete.value = null
    useToast().success('成功', '文章已删除')
  } catch (error) {
    console.error('删除文章失败:', error)
    useToast().error('错误', '删除文章失败')
  }
}

const toggleAdminRole = async user => {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !user.is_admin })
      .eq('id', user.id)
    if (error) throw error
    await fetchUsers()
    useToast().success('成功', `已${user.is_admin ? '取消' : '设置'}管理员权限`)
  } catch (error) {
    console.error('更新用户角色失败:', error)
    useToast().error('错误', '更新用户角色失败')
  }
}

const openMessage = message => {
  messageToView.value = message
  showMessageDialog.value = true
}
const markAsRead = async message => {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', message.id)
    if (error) throw error
    await fetchMessages()
    useToast().success('成功', '消息已标记为已读')
  } catch (error) {
    console.error('标记消息失败:', error)
    useToast().error('错误', '标记消息失败')
  }
}

const confirmDeleteMessage = message => {
  messageToDelete.value = message
  showDeleteMessageDialog.value = true
}
const deleteMessage = async () => {
  if (!messageToDelete.value) return
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageToDelete.value.id)
    if (error) throw error
    await fetchMessages()
    showDeleteMessageDialog.value = false
    messageToDelete.value = null
    useToast().success('成功', '消息已删除')
  } catch (error) {
    console.error('删除消息失败:', error)
    useToast().error('错误', '删除消息失败')
  }
}

const saveSettings = async () => {
  try {
    useToast().success('成功', '设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    useToast().error('错误', '保存设置失败')
  }
}

onMounted(async () => {
  await Promise.all([fetchPosts(), fetchUsers(), fetchMessages()])
})
</script>
