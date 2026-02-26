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
        class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="bg-indigo-600/8 pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-1 font-mono text-xs text-primary-400">// profile.settings</div>
        <h1 class="text-2xl font-bold text-white">个人资料</h1>
        <p class="mt-1.5 font-mono text-sm text-slate-400">管理您的个人信息和账户设置</p>
      </div>
    </div>

    <!-- ═══════════ 主内容 ═══════════ -->
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <!-- ──────── 左侧：资料卡片 ──────── -->
        <div class="space-y-5 md:col-span-1">
          <!-- 个人资料卡（深色终端风格） -->
          <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
            <!-- 终端标题栏 -->
            <div
              class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">profile.json</span>
            </div>

            <div class="p-5">
              <!-- 头像 -->
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800"
                >
                  <img
                    v-if="profile?.avatar_url"
                    :src="profile.avatar_url"
                    alt="头像"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <Icon name="i-heroicons-user" class="h-7 w-7 text-slate-500" />
                  </div>
                  <!-- 在线指示器 -->
                  <span
                    class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400"
                  />
                </div>
                <div class="min-w-0">
                  <p class="truncate font-semibold text-white">
                    {{ profile?.full_name || nuxtUser?.email?.split('@')[0] || 'User' }}
                  </p>
                  <p class="font-mono text-xs text-slate-500">
                    @{{ profile?.username || nuxtUser?.email?.split('@')[0] || 'user' }}
                  </p>
                </div>
              </div>

              <!-- 简介 -->
              <p v-if="profile?.bio" class="mb-4 text-xs leading-relaxed text-slate-400">
                {{ profile.bio }}
              </p>

              <!-- 徽章行 -->
              <div class="flex flex-wrap gap-1.5">
                <a
                  v-if="profile?.website"
                  :href="profile.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400 transition-colors hover:border-primary-700/60 hover:text-primary-400"
                >
                  <Icon name="i-heroicons-globe-alt" class="h-3 w-3" />
                  网站
                  <Icon name="heroicons:arrow-top-right-on-square" class="h-2.5 w-2.5 opacity-60" />
                </a>
                <span
                  class="inline-flex items-center gap-1 rounded-md border border-emerald-800/60 bg-emerald-900/30 px-2 py-0.5 font-mono text-xs text-emerald-400"
                >
                  <Icon name="i-heroicons-check-circle" class="h-3 w-3" />
                  已验证
                </span>
                <span
                  v-if="profile?.is_admin"
                  class="inline-flex items-center gap-1 rounded-md border border-purple-800/60 bg-purple-900/30 px-2 py-0.5 font-mono text-xs text-purple-400"
                >
                  <Icon name="i-heroicons-shield-check" class="h-3 w-3" />
                  Admin
                </span>
              </div>

              <!-- email 行 -->
              <div class="mt-4 border-t border-slate-800 pt-3">
                <p class="font-mono text-[10px] text-slate-600">email</p>
                <p class="mt-0.5 truncate font-mono text-xs text-slate-400">
                  {{ nuxtUser?.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- 活动统计 -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
              <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                >// activity.stats</span
              >
            </div>
            <div class="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-slate-900 dark:text-white">{{
                  stats.postsCount
                }}</span>
                <span class="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500"
                  >posts</span
                >
              </div>
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-slate-900 dark:text-white">{{
                  stats.commentsCount
                }}</span>
                <span class="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500"
                  >comments</span
                >
              </div>
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-slate-900 dark:text-white">{{
                  stats.likesCount
                }}</span>
                <span class="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500"
                  >likes</span
                >
              </div>
            </div>
          </div>

          <!-- 管理后台入口 -->
          <div
            v-if="profile?.is_admin"
            class="overflow-hidden rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-800/40 dark:bg-purple-900/10"
          >
            <div class="p-4">
              <div class="mb-3 flex items-center gap-2">
                <div
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40"
                >
                  <Icon
                    name="i-heroicons-cog-6-tooth"
                    class="h-4 w-4 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <span class="text-sm font-semibold text-purple-900 dark:text-purple-300"
                  >管理功能</span
                >
              </div>
              <NuxtLink
                to="/admin"
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-500 hover:shadow-lg"
              >
                <Icon name="i-heroicons-arrow-right-circle" class="h-4 w-4" />
                进入管理后台
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ──────── 右侧：表单区 ──────── -->
        <div class="space-y-5 md:col-span-2">
          <!-- 编辑个人资料 -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <!-- 标题栏 -->
            <div
              class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">// edit.profile</span>
            </div>

            <form class="p-5 sm:p-6" @submit.prevent="updateProfile">
              <div class="space-y-5">
                <!-- 头像上传 -->
                <div>
                  <p class="mb-2 font-mono text-xs text-slate-400 dark:text-slate-500">
                    <span class="text-primary-500">avatar</span>
                    <span class="text-slate-300 dark:text-slate-700"
                      >// 支持 JPG/PNG/WebP，最大 2MB</span
                    >
                  </p>
                  <AvatarUploader
                    :avatar-url="profile?.avatar_url"
                    @uploaded="handleAvatarUploaded"
                    @error="handleAvatarError"
                  />
                </div>

                <!-- 用户名 & 全名 -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="username"
                      class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                    >
                      <span class="text-primary-500">username</span>
                    </label>
                    <div class="relative">
                      <span
                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400"
                        >@</span
                      >
                      <input
                        id="username"
                        v-model="form.username"
                        type="text"
                        placeholder="your_username"
                        class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-3 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="full_name"
                      class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                    >
                      <span class="text-primary-500">full_name</span>
                    </label>
                    <input
                      id="full_name"
                      v-model="form.full_name"
                      type="text"
                      placeholder="您的全名"
                      class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <!-- 网站 -->
                <div>
                  <label
                    for="website"
                    class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                  >
                    <span class="text-primary-500">website</span>
                  </label>
                  <div
                    class="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all focus-within:border-primary-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus-within:bg-slate-800"
                  >
                    <span
                      class="flex items-center border-r border-slate-200 bg-slate-100 px-3 font-mono text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                    >
                      https://
                    </span>
                    <input
                      id="website"
                      v-model="form.website"
                      type="url"
                      placeholder="example.com"
                      class="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                <!-- 个人简介 -->
                <div>
                  <label
                    for="bio"
                    class="mb-1.5 flex items-center justify-between font-mono text-xs text-slate-400 dark:text-slate-500"
                  >
                    <span class="text-primary-500">bio</span>
                    <span class="text-[10px] text-slate-400"
                      >{{ (form.bio || '').length }} chars</span
                    >
                  </label>
                  <textarea
                    id="bio"
                    v-model="form.bio"
                    rows="3"
                    placeholder="介绍一下您自己..."
                    class="block w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                  />
                </div>

                <!-- 邮箱（只读） -->
                <div>
                  <label
                    for="email"
                    class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                  >
                    <span class="text-slate-400">email</span>
                    <span
                      class="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      >readonly</span
                    >
                  </label>
                  <div
                    class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <Icon
                      name="i-heroicons-lock-closed"
                      class="h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                    />
                    <span class="font-mono text-sm text-slate-500 dark:text-slate-400">{{
                      nuxtUser?.email
                    }}</span>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div
                  class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800"
                >
                  <button
                    type="button"
                    class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    @click="resetForm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon
                      v-if="loading"
                      name="i-heroicons-arrow-path"
                      class="h-4 w-4 animate-spin"
                    />
                    <Icon v-else name="i-heroicons-check" class="h-4 w-4" />
                    保存更改
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- 账户设置 -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                >// account.settings</span
              >
            </div>
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              <!-- 修改密码 -->
              <div class="flex items-center justify-between px-5 py-4">
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">修改密码</p>
                  <p class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500">
                    定期更改密码以保护账户安全
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-primary-700/60 dark:hover:text-primary-400"
                  @click="resetPassword"
                >
                  发送重置链接
                </button>
              </div>
              <!-- 删除账户 -->
              <div class="flex items-center justify-between px-5 py-4">
                <div>
                  <p class="text-sm font-medium text-rose-600 dark:text-rose-400">删除账户</p>
                  <p class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500">
                    永久删除您的账户和所有相关数据
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
                  @click="confirmDeleteAccount"
                >
                  删除账户
                </button>
              </div>
            </div>
          </div>

          <!-- 关联账号 -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs text-slate-400 dark:text-slate-500"
                  >// linked.accounts</span
                >
                <span class="font-mono text-[10px] text-slate-400">绑定第三方账号以便快速登录</span>
              </div>
            </div>

            <div class="p-5">
              <!-- 已关联列表 -->
              <div v-if="identities.length > 0" class="mb-4 space-y-2">
                <div
                  v-for="identity in identities"
                  :key="identity.id"
                  class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                    >
                      <Icon
                        v-if="identity.provider === 'github'"
                        name="i-simple-icons-github"
                        class="h-4 w-4 text-slate-800 dark:text-slate-200"
                      />
                      <Icon
                        v-else
                        name="i-heroicons-globe-alt"
                        class="h-4 w-4 text-slate-500 dark:text-slate-400"
                      />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-900 dark:text-white">
                        {{ getProviderName(identity.provider) }}
                      </p>
                      <p class="font-mono text-xs text-slate-400 dark:text-slate-500">
                        {{ identity.identity_data?.email || '已关联' }}
                      </p>
                    </div>
                  </div>
                  <button
                    v-if="identities.length > 1"
                    type="button"
                    :disabled="unlinking"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
                    @click="unlinkAccount(identity)"
                  >
                    <Icon
                      v-if="unlinking"
                      name="i-heroicons-arrow-path"
                      class="h-3 w-3 animate-spin"
                    />
                    解除关联
                  </button>
                  <span
                    v-else
                    class="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[10px] text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
                  >
                    主登录方式
                  </span>
                </div>
              </div>

              <!-- 添加新登录方式 -->
              <div
                :class="
                  identities.length > 0
                    ? 'border-t border-slate-100 pt-4 dark:border-slate-800'
                    : ''
                "
              >
                <p class="mb-3 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                  // 添加登录方式
                </p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="!isProviderLinked('github')"
                    type="button"
                    :disabled="linking"
                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    @click="linkGitHub"
                  >
                    <Icon name="i-simple-icons-github" class="h-4 w-4" />
                    <span v-if="linking">关联中...</span>
                    <span v-else>关联 GitHub</span>
                  </button>
                  <span
                    v-if="isProviderLinked('github')"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    <Icon name="heroicons:check-circle" class="h-4 w-4" />
                    GitHub 已关联
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ 确认删除弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showDeleteDialog = false"
      >
        <!-- 背景遮罩 -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="showDeleteDialog = false"
        />

        <!-- 弹窗（终端风格） -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-if="showDeleteDialog"
            class="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
            @click.stop
          >
            <!-- 终端标题栏 -->
            <div
              class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
            >
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span class="ml-2 font-mono text-xs text-slate-500">account.delete</span>
              </div>
              <button
                class="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
                @click="showDeleteDialog = false"
              >
                <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
              </button>
            </div>

            <div class="p-5">
              <div class="mb-5 flex items-start gap-3">
                <div
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-900/40"
                >
                  <Icon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-rose-400" />
                </div>
                <div>
                  <p class="font-semibold text-white">确认删除账户</p>
                  <p class="mt-1.5 text-sm leading-relaxed text-slate-400">
                    此操作将<span class="text-white">永久删除</span>您的账户及所有相关数据，且<span
                      class="text-rose-400"
                      >无法撤销</span
                    >。请确认您已备份所需数据。
                  </p>
                </div>
              </div>

              <!-- 终端确认提示 -->
              <div class="mb-5 rounded-lg border border-rose-900/40 bg-rose-950/30 px-4 py-3">
                <p class="font-mono text-xs text-rose-400">
                  <span class="text-slate-500">$</span> rm -rf account --force --no-recover
                </p>
              </div>

              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                  @click="showDeleteDialog = false"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-500"
                  @click="deleteAccount"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { UserIdentity } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string
  full_name: string
  website: string
  bio: string
  avatar_url?: string
  is_admin?: boolean
}

definePageMeta({
  title: '个人资料',
  description: '管理您的个人信息和账户设置',
  middleware: 'auth'
})

const { user: nuxtUser, signOut } = useSupabaseAuth()
const supabase = useSupabaseClient()

const loading = ref(false)
const profile = ref<Profile | null>(null)
const showDeleteDialog = ref(false)
const identities = ref<UserIdentity[]>([])
const linking = ref(false)
const unlinking = ref(false)

console.log('useSupabaseAuth nuxtUser:', nuxtUser.value)
console.log('用户ID (sub):', nuxtUser.value?.sub)

const form = reactive({
  username: '',
  full_name: '',
  website: '',
  bio: ''
})

const stats = reactive({
  postsCount: 0,
  commentsCount: 0,
  likesCount: 0
})

const fetchProfile = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    return
  }

  console.log('用户对象完整结构:', nuxtUser.value)
  console.log('用户ID类型:', typeof nuxtUser.value.sub)
  console.log('用户ID值:', nuxtUser.value.sub)

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  try {
    console.log('获取用户资料，用户ID:', nuxtUser.value.sub)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', nuxtUser.value.sub)
      .single()

    if (error) {
      console.error('获取用户资料错误:', error)
      throw error
    }

    console.log('获取到的用户资料:', data)
    profile.value = data as Profile
    const formRef = form as Record<string, string>
    const dataRef = data as Record<string, string>
    Object.keys(form).forEach(key => {
      formRef[key] = dataRef[key] || ''
    })
  } catch (error) {
    console.error('获取用户资料失败:', error)
    if ((error as { code?: string }).code === 'PGRST116') {
      console.log('用户资料不存在，创建默认资料')
      try {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: nuxtUser.value.sub,
            username: nuxtUser.value.email?.split('@')[0] || 'user',
            full_name: '',
            website: '',
            bio: ''
          } as any)
          .select()
          .single()

        if (createError) throw createError

        console.log('创建的用户资料:', newProfile)
        profile.value = newProfile as Profile
        const formRef2 = form as Record<string, string>
        const newRef = newProfile as Record<string, string>
        Object.keys(form).forEach(key => {
          formRef2[key] = newRef[key] || ''
        })
      } catch (createErr) {
        console.error('创建用户资料失败:', createErr)
      }
    }
  }
}

const fetchStats = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    return
  }

  try {
    const { count: postsCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', nuxtUser.value.sub)

    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', nuxtUser.value.sub)

    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', nuxtUser.value.sub)

    stats.postsCount = postsCount || 0
    stats.commentsCount = commentsCount || 0
    stats.likesCount = likesCount || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const updateProfile = async () => {
  if (!nuxtUser.value) {
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    const updateData: Partial<Omit<Profile, 'id'>> = {}

    if (form.username !== undefined && form.username !== '') updateData.username = form.username
    if (form.full_name !== undefined && form.full_name !== '') updateData.full_name = form.full_name
    if (form.website !== undefined && form.website !== '') updateData.website = form.website
    if (form.bio !== undefined && form.bio !== '') updateData.bio = form.bio

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData as never)
      .eq('id', nuxtUser.value.sub)
      .select()

    if (error) throw error

    console.log('更新成功，返回数据:', data)
    await fetchProfile()

    const toast = useToast()
    toast.success('成功', '您的个人资料已更新')
  } catch (error) {
    console.error('更新个人资料失败:', error)
    const toast = useToast()
    toast.error('错误', `更新个人资料失败: ${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (profile.value) {
    const formRef = form as Record<string, string>
    const profileRef = profile.value as unknown as Record<string, string>
    Object.keys(form).forEach(key => {
      formRef[key] = profileRef[key] || ''
    })
  }
}

const handleAvatarUploaded = async (url: string) => {
  const toast = useToast()
  try {
    await fetchProfile()
    toast.success('成功', '头像已更新')
  } catch (error) {
    console.error('刷新资料失败:', error)
    toast.error('错误', '头像已上传，但刷新资料失败')
  }
}

const handleAvatarError = (error: string) => {
  const toast = useToast()
  toast.error('错误', error)
}

const resetPassword = async () => {
  if (!nuxtUser.value?.email) {
    const toast = useToast()
    toast.error('错误', '用户邮箱不存在，请重新登录')
    return
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(nuxtUser.value.email)
    if (error) throw error

    const toast = useToast()
    toast.success('成功', '密码重置链接已发送到您的邮箱')
  } catch (error) {
    console.error('重置密码失败:', error)
    const toast = useToast()
    toast.error('错误', '重置密码失败，请重试')
  }
}

const confirmDeleteAccount = () => {
  showDeleteDialog.value = true
}

const deleteAccount = async () => {
  if (!nuxtUser.value?.sub) {
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', nuxtUser.value.sub)

    if (profileError) throw profileError

    const { error: authError } = await supabase.rpc('delete_user')
    if (authError) throw authError

    await signOut()
    await navigateTo('/')

    const toast = useToast()
    toast.success('成功', '您的账户已删除')
  } catch (error) {
    console.error('删除账户失败:', error)
    const toast = useToast()
    toast.error('错误', '删除账户失败，请重试')
  } finally {
    loading.value = false
    showDeleteDialog.value = false
  }
}

const fetchIdentities = async () => {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    identities.value = (user?.identities ?? []) as UserIdentity[]
  } catch (error) {
    console.error('获取关联账号失败:', error)
    identities.value = []
  }
}

const getProviderName = (provider: string) => {
  const providerNames: Record<string, string> = {
    email: '邮箱',
    github: 'GitHub',
    google: 'Google'
  }
  return providerNames[provider] || provider
}

const isProviderLinked = (provider: string) => {
  return identities.value.some(identity => identity.provider === provider)
}

const linkGitHub = async () => {
  linking.value = true
  try {
    const config = useRuntimeConfig()
    const appUrl =
      config.public.appUrl || (process.client ? window.location.origin : 'http://localhost:3000')

    const { error: linkError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${appUrl}/auth/callback`,
        skipBrowserRedirect: false
      }
    })

    if (linkError) throw linkError

    const toast = useToast()
    toast.success('成功', '正在跳转到 GitHub 进行授权...')
  } catch (error) {
    console.error('关联 GitHub 失败:', error)
    const toast = useToast()
    toast.error('错误', '关联 GitHub 失败，请重试')
  } finally {
    linking.value = false
  }
}

const unlinkAccount = async (identity: UserIdentity) => {
  unlinking.value = true
  try {
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity)
    if (unlinkError) throw unlinkError

    await fetchIdentities()

    const toast = useToast()
    toast.success('成功', '已解除关联')
  } catch (error) {
    console.error('解除关联失败:', error)
    const toast = useToast()
    toast.error('错误', '解除关联失败，请重试')
  } finally {
    unlinking.value = false
  }
}

onMounted(() => {
  fetchProfile()
  fetchStats()
  fetchIdentities()
})

watch(nuxtUser, newUser => {
  if (newUser) {
    fetchProfile()
    fetchStats()
    fetchIdentities()
  }
})
</script>
