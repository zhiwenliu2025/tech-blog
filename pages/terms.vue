<template>
  <div>
    <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-8 dark:from-primary-700 dark:to-primary-800 sm:px-6 md:px-8"
        >
          <div class="mx-auto max-w-3xl">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur"
              >
                <Icon name="heroicons:document-check" class="h-6 w-6 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-white sm:text-3xl">服务条款</h1>
            </div>
            <p class="mt-3 text-sm text-white/80">
              最后更新：{{ new Date().toLocaleDateString('zh-CN') }}
            </p>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <article
            class="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-li:text-gray-300"
          >
            <h2>接受条款</h2>
            <p>
              通过访问和使用本网站，您同意遵守这些服务条款。如果您不同意这些条款，请不要使用本网站。
            </p>

            <h2>网站内容</h2>
            <p>
              本网站的内容仅供参考和信息目的。我们不对内容的准确性、完整性或适用性做出任何保证。
            </p>
            <p>本网站的内容受版权法保护，未经授权不得复制、分发或以其他方式使用。</p>

            <h2>用户行为</h2>
            <p>使用本网站时，您同意：</p>
            <ul>
              <li>不发布非法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容</li>
              <li>不侵犯他人的知识产权</li>
              <li>不发布虚假或误导性信息</li>
              <li>不传播病毒或恶意代码</li>
              <li>不干扰或破坏本网站的运行</li>
            </ul>

            <h2>知识产权</h2>
            <p>
              本网站及其内容（包括但不限于文本、图形、图像、软件）受知识产权法保护，归我们或我们的内容提供商所有。
            </p>

            <h2>免责声明</h2>
            <p>
              本网站按"原样"提供，不提供任何明示或暗示的保证。我们不保证本网站的无错误运行或不间断服务。
            </p>

            <h2>责任限制</h2>
            <p>
              在任何情况下，我们都不对因使用或无法使用本网站而导致的任何间接、附带、特殊或后果性损害承担责任。
            </p>

            <h2>变更</h2>
            <p>
              我们保留随时修改或终止本网站的权利，恕不另行通知。我们也可能随时更新这些服务条款。
            </p>

            <h2>联系我们</h2>
            <p>如果您对这些服务条款有任何疑问，请通过我们的联系方式与我们联系。</p>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '服务条款',
  meta: [{ name: 'description', content: '查看我们的服务条款，了解使用本网站的规则和条件' }]
})
</script>
