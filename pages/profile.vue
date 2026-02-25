<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">个人资料</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">管理您的个人信息和账户设置</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- 左侧个人信息卡片 -->
        <div class="space-y-5 md:col-span-1">
          <!-- 个人信息卡片 -->
          <div
            class="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          >
            <!-- Banner 渐变 -->
            <div class="relative h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <div
                class="bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'15\' cy=\'15\' r=\'1\' fill=\'white\' fill-opacity=\'0.15\'/%3E%3C/svg%3E')] absolute inset-0 opacity-60"
              />
            </div>
            <!-- 头像 & 信息 -->
            <div class="relative px-5 pb-5">
              <div class="absolute -top-11 left-5">
                <div
                  class="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg dark:border-gray-900 dark:bg-gray-800"
                >
                  <img
                    v-if="profile?.avatar_url"
                    :src="profile.avatar_url"
                    alt="头像"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center">
                    <Icon name="i-heroicons-user" class="h-10 w-10 text-gray-400" />
                  </div>
                </div>
              </div>
              <div class="pt-12">
                <h2 class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ profile?.full_name || nuxtUser?.email }}
                </h2>
                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {{
                    profile?.username
                      ? '@' + profile.username
                      : '@' + (nuxtUser?.email?.split('@')[0] || 'user')
                  }}
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <a
                    v-if="profile?.website"
                    :href="profile.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 transition-colors duration-150 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800 dark:hover:bg-indigo-900/50"
                  >
                    <Icon name="i-heroicons-globe-alt" class="h-3 w-3" />
                    网站
                  </a>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800"
                  >
                    <Icon name="i-heroicons-check-circle" class="h-3 w-3" />
                    已验证
                  </span>
                </div>
                <p
                  v-if="profile?.bio"
                  class="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400"
                >
                  {{ profile.bio }}
                </p>
              </div>
            </div>
          </div>

          <!-- 活动统计 -->
          <div class="rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <div class="border-b border-gray-100 px-5 py-3.5 dark:border-gray-800">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">活动统计</h3>
            </div>
            <div class="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{
                  stats.postsCount
                }}</span>
                <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">文章</span>
              </div>
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{
                  stats.commentsCount
                }}</span>
                <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">评论</span>
              </div>
              <div class="flex flex-col items-center py-4">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{
                  stats.likesCount
                }}</span>
                <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">获赞</span>
              </div>
            </div>
          </div>

          <!-- 管理后台入口 -->
          <div
            v-if="profile?.is_admin"
            class="rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
                >
                  <Icon
                    name="i-heroicons-cog-6-tooth"
                    class="h-4 w-4 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">管理功能</h3>
              </div>
              <NuxtLink
                to="/admin"
                class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                <Icon name="i-heroicons-arrow-right-circle" class="h-4 w-4" />
                进入管理后台
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- 右侧表单区域 -->
        <div class="space-y-5 md:col-span-2">
          <!-- 编辑个人资料 -->
          <div
            class="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div
              class="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30"
              >
                <Icon
                  name="i-heroicons-user-circle"
                  class="h-4 w-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">编辑个人资料</h3>
            </div>
            <form class="p-6" @submit.prevent="updateProfile">
              <div class="grid gap-5">
                <!-- 头像上传 -->
                <div>
                  <label
                    class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    头像
                  </label>
                  <div class="mt-2">
                    <AvatarUploader
                      :avatar-url="profile?.avatar_url"
                      @uploaded="handleAvatarUploaded"
                      @error="handleAvatarError"
                    />
                    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      支持 JPG、PNG、GIF、WebP，最大 2MB。支持拖拽上传。
                    </p>
                  </div>
                </div>

                <!-- 用户名 & 全名 -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="username"
                      class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      用户名
                    </label>
                    <div class="mt-1.5">
                      <input
                        id="username"
                        v-model="form.username"
                        type="text"
                        class="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
                        placeholder="your_username"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="full_name"
                      class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      全名
                    </label>
                    <div class="mt-1.5">
                      <input
                        id="full_name"
                        v-model="form.full_name"
                        type="text"
                        class="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
                        placeholder="您的全名"
                      />
                    </div>
                  </div>
                </div>

                <!-- 网站 -->
                <div>
                  <label
                    for="website"
                    class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    网站
                  </label>
                  <div class="mt-1.5 flex rounded-lg shadow-none">
                    <span
                      class="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <Icon name="i-heroicons-globe-alt" class="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="website"
                      v-model="form.website"
                      type="url"
                      class="block w-full min-w-0 flex-1 rounded-r-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <!-- 个人简介 -->
                <div>
                  <label
                    for="bio"
                    class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    个人简介
                  </label>
                  <div class="mt-1.5">
                    <textarea
                      id="bio"
                      v-model="form.bio"
                      rows="3"
                      class="block w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
                      placeholder="介绍一下您自己..."
                    />
                  </div>
                </div>

                <!-- 邮箱（只读） -->
                <div>
                  <label
                    for="email"
                    class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    邮箱
                  </label>
                  <div class="mt-1.5">
                    <input
                      id="email"
                      :value="nuxtUser?.email"
                      type="email"
                      disabled
                      class="block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                    />
                  </div>
                  <p
                    class="mt-1.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
                  >
                    <Icon name="i-heroicons-lock-closed" class="h-3 w-3" />
                    邮箱地址无法更改
                  </p>
                </div>

                <!-- 操作按钮 -->
                <div
                  class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"
                >
                  <button
                    type="button"
                    class="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    @click="resetForm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
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
            class="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div
              class="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Icon
                  name="i-heroicons-shield-check"
                  class="h-4 w-4 text-gray-600 dark:text-gray-400"
                />
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">账户设置</h3>
            </div>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <!-- 修改密码 -->
              <div class="flex items-center justify-between px-6 py-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">修改密码</h4>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    定期更改密码以保护账户安全
                  </p>
                </div>
                <button
                  type="button"
                  class="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  @click="resetPassword"
                >
                  发送重置链接
                </button>
              </div>
              <!-- 删除账户 -->
              <div class="flex items-center justify-between px-6 py-4">
                <div>
                  <h4 class="text-sm font-medium text-red-600 dark:text-red-400">删除账户</h4>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    永久删除您的账户和所有相关数据
                  </p>
                </div>
                <button
                  type="button"
                  class="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-150 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                  @click="confirmDeleteAccount"
                >
                  删除账户
                </button>
              </div>
            </div>
          </div>

          <!-- 关联账号 -->
          <div
            class="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
          >
            <div
              class="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Icon name="i-heroicons-link" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">关联账号</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">绑定第三方账号以便快速登录</p>
              </div>
            </div>
            <div class="space-y-4 p-6">
              <!-- 已关联账号列表 -->
              <div v-if="identities.length > 0" class="space-y-2.5">
                <div
                  v-for="identity in identities"
                  :key="identity.id"
                  class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
                    >
                      <Icon
                        v-if="identity.provider === 'github'"
                        name="i-simple-icons-github"
                        class="h-5 w-5 text-gray-800 dark:text-gray-200"
                      />
                      <Icon
                        v-else
                        name="i-heroicons-globe-alt"
                        class="h-5 w-5 text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ getProviderName(identity.provider) }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ identity.identity_data?.email || '已关联' }}
                      </p>
                    </div>
                  </div>
                  <button
                    v-if="identities.length > 1"
                    type="button"
                    :disabled="unlinking"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                  >
                    主登录方式
                  </span>
                </div>
              </div>

              <!-- 添加新登录方式 -->
              <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
                <p
                  class="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  添加登录方式
                </p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="!isProviderLinked('github')"
                    type="button"
                    :disabled="linking"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    @click="linkGitHub"
                  >
                    <Icon name="i-simple-icons-github" class="h-4 w-4" />
                    <span v-if="linking">关联中...</span>
                    <span v-else>关联 GitHub</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除账户对话框 -->
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 背景遮罩 -->
        <div
          class="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
          @click="showDeleteDialog = false"
        />
        <!-- 对话框 -->
        <div
          class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
              >
                <Icon
                  name="i-heroicons-exclamation-triangle"
                  class="h-5 w-5 text-red-600 dark:text-red-400"
                />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">确认删除账户</h3>
                <p class="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  此操作将<strong class="font-medium text-gray-900 dark:text-white">永久删除</strong
                  >您的账户及所有相关数据，且无法撤销。请确认您已备份所需数据。
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <button
              type="button"
              class="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="showDeleteDialog = false"
            >
              取消
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              @click="deleteAccount"
            >
              确认删除
            </button>
          </div>
        </div>
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

// 页面元数据
definePageMeta({
  title: '个人资料',
  description: '管理您的个人信息和账户设置',
  middleware: 'auth'
})

// 用户状态
const { user: nuxtUser, signOut } = useSupabaseAuth()
const supabase = useSupabaseClient()

// 状态
const loading = ref(false)
const profile = ref<Profile | null>(null)
const showDeleteDialog = ref(false)
const identities = ref<UserIdentity[]>([])
const linking = ref(false)
const unlinking = ref(false)

// 调试用户对象
console.log('useSupabaseAuth nuxtUser:', nuxtUser.value)
console.log('用户ID (sub):', nuxtUser.value?.sub)

// 表单数据
const form = reactive({
  username: '',
  full_name: '',
  website: '',
  bio: ''
})

// 统计数据
const stats = reactive({
  postsCount: 0,
  commentsCount: 0,
  likesCount: 0
})

// 获取用户资料
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
    // 填充表单
    const formRef = form as Record<string, string>
    const dataRef = data as Record<string, string>
    Object.keys(form).forEach(key => {
      formRef[key] = dataRef[key] || ''
    })
  } catch (error) {
    console.error('获取用户资料失败:', error)
    // 如果用户资料不存在，创建一个默认的
    if ((error as { code?: string }).code === 'PGRST116') {
      // PGRST116 是 "No rows found" 的错误代码
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
        // 填充表单
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

// 获取用户统计数据
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
    // 获取文章数量
    const { count: postsCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', nuxtUser.value.sub)

    // 获取评论数量
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', nuxtUser.value.sub)

    // 获取点赞数量
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

// 更新用户资料
const updateProfile = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    // 准备更新数据，只包含有值的字段
    const updateData: Partial<Omit<Profile, 'id'>> = {}

    // 只添加有值的字段
    if (form.username !== undefined && form.username !== '') updateData.username = form.username
    if (form.full_name !== undefined && form.full_name !== '') updateData.full_name = form.full_name
    if (form.website !== undefined && form.website !== '') updateData.website = form.website
    if (form.bio !== undefined && form.bio !== '') updateData.bio = form.bio

    console.log('更新数据:', updateData)
    console.log('用户ID:', nuxtUser.value.sub)

    // 使用update而不是upsert，因为我们已经确定用户存在
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData as never)
      .eq('id', nuxtUser.value.sub)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('更新成功，返回数据:', data)

    // 刷新数据
    await fetchProfile()

    // 显示成功消息
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

// 重置表单
const resetForm = () => {
  if (profile.value) {
    const formRef = form as Record<string, string>
    const profileRef = profile.value as unknown as Record<string, string>
    Object.keys(form).forEach(key => {
      formRef[key] = profileRef[key] || ''
    })
  }
}

// 处理头像上传成功
const handleAvatarUploaded = async (url: string) => {
  const toast = useToast()
  try {
    // 刷新数据
    await fetchProfile()
    toast.success('成功', '头像已更新')
  } catch (error) {
    console.error('刷新资料失败:', error)
    toast.error('错误', '头像已上传，但刷新资料失败')
  }
}

// 处理头像上传错误
const handleAvatarError = (error: string) => {
  const toast = useToast()
  toast.error('错误', error)
}

// 重置密码
const resetPassword = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.email) {
    console.error('用户邮箱不存在')
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

// 确认删除账户
const confirmDeleteAccount = () => {
  showDeleteDialog.value = true
}

// 删除账户
const deleteAccount = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    // 删除用户资料
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', nuxtUser.value.sub)

    if (profileError) throw profileError

    // 删除用户认证记录
    const { error: authError } = await supabase.rpc('delete_user')

    if (authError) throw authError

    // 退出登录
    await signOut()

    // 重定向到首页
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

// 获取已关联的账号
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

// 获取提供者名称
const getProviderName = (provider: string) => {
  const providerNames: Record<string, string> = {
    email: '邮箱',
    github: 'GitHub',
    google: 'Google'
  }
  return providerNames[provider] || provider
}

// 检查提供者是否已关联
const isProviderLinked = (provider: string) => {
  return identities.value.some(identity => identity.provider === provider)
}

// 关联 GitHub 账号
const linkGitHub = async () => {
  linking.value = true
  try {
    const config = useRuntimeConfig()
    const appUrl =
      config.public.appUrl || (process.client ? window.location.origin : 'http://localhost:3000')

    const { data, error: linkError } = await supabase.auth.signInWithOAuth({
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

// 解除关联账号
const unlinkAccount = async (identity: UserIdentity) => {
  unlinking.value = true
  try {
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity)

    if (unlinkError) throw unlinkError

    // 刷新关联账号列表
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

// 页面加载时获取数据
onMounted(() => {
  fetchProfile()
  fetchStats()
  fetchIdentities()
})

// 监听用户变化
watch(nuxtUser, newUser => {
  if (newUser) {
    fetchProfile()
    fetchStats()
    fetchIdentities()
  }
})
</script>
