<template>
  <div>
    <main class="mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 lg:px-8 lg:py-12">
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-8 dark:from-green-700 dark:to-emerald-700 sm:px-6 md:px-8"
        >
          <div class="mx-auto max-w-3xl">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur"
              >
                <Icon name="heroicons:shield-check" class="h-6 w-6 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-white sm:text-3xl">隐私政策</h1>
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
            <h2>信息收集</h2>
            <p>我们可能收集以下类型的信息：</p>
            <ul>
              <li>您主动提供的信息（如评论、联系表单）</li>
              <li>技术信息（如IP地址、浏览器类型、访问时间）</li>
              <li>使用信息（如浏览的页面、点击的链接）</li>
            </ul>

            <h2>信息使用</h2>
            <p>我们收集的信息可能用于：</p>
            <ul>
              <li>提供和维护本网站的服务</li>
              <li>改进用户体验</li>
              <li>发送重要通知</li>
              <li>防范欺诈和滥用</li>
            </ul>

            <h2>信息共享</h2>
            <p>我们不会向第三方出售、交易或转让您的个人信息，除非：</p>
            <ul>
              <li>获得您的明确同意</li>
              <li>法律要求或法院命令要求</li>
              <li>保护我们的权利、财产或安全</li>
            </ul>

            <h2>数据安全</h2>
            <p>
              我们采取合理的安全措施保护您的个人信息，但请注意，没有任何互联网传输方法是100%安全的。
            </p>

            <h2>Cookie</h2>
            <p>本网站可能使用Cookie来改善用户体验。您可以通过浏览器设置选择接受或拒绝Cookie。</p>

            <h2>隐私政策的变更</h2>
            <p>我们可能会不时更新本隐私政策。任何变更都会在此页面上发布，并立即生效。</p>

            <h2>联系我们</h2>
            <p>如果您对本隐私政策有任何疑问，请通过我们的联系方式与我们联系。</p>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '隐私政策',
  meta: [
    { name: 'description', content: '查看我们的隐私政策，了解我们如何收集、使用和保护您的个人信息' }
  ]
})
</script>
