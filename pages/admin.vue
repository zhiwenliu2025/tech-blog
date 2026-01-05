<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">管理后台</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">管理博客文章、用户和系统设置</p>
        </div>

        <div class="mb-6">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
                ]"
                @click="activeTab = tab.id"
              >
                <Icon :name="tab.icon" class="mr-2 h-5 w-5" />
                {{ tab.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- 文章管理 -->
        <div v-if="activeTab === 'posts'" class="space-y-6">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章管理</h3>
                <NuxtLink
                  to="/blog/create"
                  class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Icon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
                  新建文章
                </NuxtLink>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      标题
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      作者
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      分类
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      状态
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      创建时间
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                >
                  <tr v-for="post in posts" :key="post.id">
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ post.title }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ post.excerpt?.substring(0, 50) }}...
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ getAuthorName(post.author_id) }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ post.category || '未分类' }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="[
                          post.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium'
                        ]"
                      >
                        {{ post.published ? '已发布' : '草稿' }}
                      </span>
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ formatDate(post.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <NuxtLink
                        :to="`/blog/edit/${post.id}`"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        编辑
                      </NuxtLink>
                      <button
                        type="button"
                        class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        @click="confirmDeletePost(post)"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="posts.length === 0"
                class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                暂无文章
              </div>
            </div>
          </div>
        </div>

        <!-- 消息管理 -->
        <div v-if="activeTab === 'messages'" class="space-y-6">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">消息管理</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    共 {{ messages.length }} 条消息
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">|</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    未读 {{ unreadCount }} 条
                  </span>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      状态
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      发送人
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      邮箱
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      主题
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      消息内容
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      发送时间
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                >
                  <tr
                    v-for="message in messages"
                    :key="message.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="[
                          message.read
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium'
                        ]"
                      >
                        {{ message.read ? '已读' : '未读' }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ message.name }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ message.email }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ message.subject }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="max-w-xs truncate text-sm text-gray-900 dark:text-white">
                        {{ message.message }}
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ formatDate(message.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        class="mr-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        @click="openMessage(message)"
                      >
                        查看
                      </button>
                      <button
                        v-if="!message.read"
                        type="button"
                        class="mr-4 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        @click="markAsRead(message)"
                      >
                        标记已读
                      </button>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        @click="confirmDeleteMessage(message)"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="messages.length === 0"
                class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                暂无消息
              </div>
            </div>
          </div>
        </div>

        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="space-y-6">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">用户管理</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      用户
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      邮箱
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      角色
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      注册时间
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                >
                  <tr v-for="user in users" :key="user.id">
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
                          >
                            <Icon name="i-heroicons-user" class="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ user.full_name || user.username || '未知用户' }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            @{{ user.username || 'unknown' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">
                        {{ getUserEmail(user.id) }}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="[
                          user.is_admin
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium'
                        ]"
                      >
                        {{ user.is_admin ? '管理员' : '普通用户' }}
                      </span>
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ formatDate(user.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        :class="[
                          user.is_admin
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                            : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
                          'mr-4'
                        ]"
                        @click="toggleAdminRole(user)"
                      >
                        {{ user.is_admin ? '取消管理员' : '设为管理员' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="users.length === 0"
                class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                暂无用户
              </div>
            </div>
          </div>
        </div>

        <!-- 系统设置 -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">系统设置</h3>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div>
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">站点信息</h4>
                  <div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label
                        for="site_name"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >站点名称</label
                      >
                      <div class="mt-1">
                        <input
                          id="site_name"
                          v-model="settings.site_name"
                          type="text"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="site_description"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >站点描述</label
                      >
                      <div class="mt-1">
                        <input
                          id="site_description"
                          v-model="settings.site_description"
                          type="text"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">功能设置</h4>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-900 dark:text-white"
                          >允许用户注册</span
                        >
                        <span class="text-sm text-gray-500 dark:text-gray-400"
                          >新用户可以自行注册账户</span
                        >
                      </div>
                      <button
                        type="button"
                        :class="[
                          settings.allow_registration
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        ]"
                        @click="settings.allow_registration = !settings.allow_registration"
                      >
                        <span
                          :class="[
                            settings.allow_registration ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          ]"
                        />
                      </button>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-900 dark:text-white"
                          >文章需要审核</span
                        >
                        <span class="text-sm text-gray-500 dark:text-gray-400"
                          >新发布的文章需要管理员审核后才能公开</span
                        >
                      </div>
                      <button
                        type="button"
                        :class="[
                          settings.require_approval
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        ]"
                        @click="settings.require_approval = !settings.require_approval"
                      >
                        <span
                          :class="[
                            settings.require_approval ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          ]"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    @click="saveSettings"
                  >
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除文章对话框 -->
    <div v-if="showDeletePostDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="showDeletePostDialog = false"
        />
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10"
              >
                <Icon
                  name="i-heroicons-exclamation-triangle"
                  class="h-6 w-6 text-red-600 dark:text-red-400"
                />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  删除文章
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    您确定要删除文章 "{{ postToDelete?.title }}" 吗？此操作无法撤销。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deletePost"
            >
              删除
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showDeletePostDialog = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息详情对话框 -->
    <div v-if="showMessageDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="showMessageDialog = false"
        />
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle"
        >
          <div class="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10"
              >
                <Icon
                  name="i-heroicons-envelope"
                  class="h-6 w-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  消息详情
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >发送人</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ messageToView?.name }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >邮箱</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ messageToView?.email }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >主题</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ messageToView?.subject }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >消息内容</label
                    >
                    <div
                      class="mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <p class="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                        {{ messageToView?.message }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >发送时间</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ formatDate(messageToView?.created_at) }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >状态</label
                    >
                    <span
                      :class="[
                        messageToView?.read
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                        'inline-flex rounded-full px-2 py-1 text-xs font-medium'
                      ]"
                    >
                      {{ messageToView?.read ? '已读' : '未读' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              v-if="!messageToView?.read"
              type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="markAsRead(messageToView)"
            >
              标记为已读
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showMessageDialog = false"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除消息对话框 -->
    <div v-if="showDeleteMessageDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="showDeleteMessageDialog = false"
        />
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10"
              >
                <Icon
                  name="i-heroicons-exclamation-triangle"
                  class="h-6 w-6 text-red-600 dark:text-red-400"
                />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  删除消息
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    您确定要删除来自 "{{ messageToDelete?.name }}" 的消息吗？此操作无法撤销。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteMessage"
            >
              删除
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showDeleteMessageDialog = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
definePageMeta({
  title: '管理后台',
  description: '管理博客文章、用户和系统设置',
  middleware: 'admin'
})

// 状态
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

// 设置
const settings = reactive({
  site_name: '技术博客',
  site_description: '分享技术知识和经验',
  allow_registration: true,
  require_approval: false
})

// 标签页
const tabs = [
  { id: 'posts', name: '文章管理', icon: 'i-heroicons-document-text' },
  { id: 'messages', name: '消息管理', icon: 'i-heroicons-envelope' },
  { id: 'users', name: '用户管理', icon: 'i-heroicons-users' },
  { id: 'settings', name: '系统设置', icon: 'i-heroicons-cog-6-tooth' }
]

// 获取文章列表
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

// 获取用户列表
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

// 获取消息列表
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

// 计算未读消息数量
const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length
})

// 获取作者名称
const getAuthorName = authorId => {
  const user = users.value.find(u => u.id === authorId)
  return user?.full_name || user?.username || '未知用户'
}

// 获取用户邮箱
const getUserEmail = userId => {
  // 这里需要从auth.users获取邮箱，但当前API无法直接访问
  // 可以通过用户资料中的邮箱字段或创建一个API端点来获取
  return 'user@example.com' // 临时占位符
}

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 确认删除文章
const confirmDeletePost = post => {
  postToDelete.value = post
  showDeletePostDialog.value = true
}

// 删除文章
const deletePost = async () => {
  if (!postToDelete.value) return

  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('blog_posts').delete().eq('id', postToDelete.value.id)

    if (error) throw error

    // 更新文章列表
    await fetchPosts()
    showDeletePostDialog.value = false
    postToDelete.value = null

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '文章已删除')
  } catch (error) {
    console.error('删除文章失败:', error)
    const toast = useToast()
    toast.error('错误', '删除文章失败')
  }
}

// 切换管理员角色
const toggleAdminRole = async user => {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !user.is_admin })
      .eq('id', user.id)

    if (error) throw error

    // 更新用户列表
    await fetchUsers()

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', `已${user.is_admin ? '取消' : '设置'}管理员权限`)
  } catch (error) {
    console.error('更新用户角色失败:', error)
    const toast = useToast()
    toast.error('错误', '更新用户角色失败')
  }
}

// 打开消息详情
const openMessage = message => {
  messageToView.value = message
  showMessageDialog.value = true
}

// 标记消息为已读
const markAsRead = async message => {
  try {
    const supabase = useSupabaseClient()
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', message.id)

    if (error) throw error

    await fetchMessages()

    const toast = useToast()
    toast.success('成功', '消息已标记为已读')
  } catch (error) {
    console.error('标记消息失败:', error)
    const toast = useToast()
    toast.error('错误', '标记消息失败')
  }
}

// 确认删除消息
const confirmDeleteMessage = message => {
  messageToDelete.value = message
  showDeleteMessageDialog.value = true
}

// 删除消息
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

    const toast = useToast()
    toast.success('成功', '消息已删除')
  } catch (error) {
    console.error('删除消息失败:', error)
    const toast = useToast()
    toast.error('错误', '删除消息失败')
  }
}

// 保存设置
const saveSettings = async () => {
  try {
    // 这里可以将设置保存到数据库或配置文件
    // 目前只是一个模拟实现

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    const toast = useToast()
    toast.error('错误', '保存设置失败')
  }
}

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchPosts(), fetchUsers(), fetchMessages()])
})
</script>
