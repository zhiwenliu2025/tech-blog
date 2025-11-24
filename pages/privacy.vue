<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">隐私政策</h1>
    <div class="prose prose-lg max-w-none dark:prose-invert">
      <p class="mb-4">最后更新：{{ new Date().toLocaleDateString('zh-CN') }}</p>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">信息收集</h2>
      <p class="mb-4">我们可能收集以下类型的信息：</p>
      <ul class="mb-6 list-disc pl-6">
        <li>您主动提供的信息（如评论、联系表单）</li>
        <li>技术信息（如IP地址、浏览器类型、访问时间）</li>
        <li>使用信息（如浏览的页面、点击的链接）</li>
      </ul>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">信息使用</h2>
      <p class="mb-4">我们收集的信息可能用于：</p>
      <ul class="mb-6 list-disc pl-6">
        <li>提供和维护本网站的服务</li>
        <li>改进用户体验</li>
        <li>发送重要通知</li>
        <li>防范欺诈和滥用</li>
      </ul>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">信息共享</h2>
      <p class="mb-4">我们不会向第三方出售、交易或转让您的个人信息，除非：</p>
      <ul class="mb-6 list-disc pl-6">
        <li>获得您的明确同意</li>
        <li>法律要求或法院命令要求</li>
        <li>保护我们的权利、财产或安全</li>
      </ul>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">数据安全</h2>
      <p class="mb-6">
        我们采取合理的安全措施保护您的个人信息，但请注意，没有任何互联网传输方法是100%安全的。
      </p>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">Cookie</h2>
      <p class="mb-4">
        本网站可能使用Cookie来改善用户体验。您可以通过浏览器设置选择接受或拒绝Cookie。
      </p>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">隐私政策的变更</h2>
      <p class="mb-6">我们可能会不时更新本隐私政策。任何变更都会在此页面上发布，并立即生效。</p>

      <h2 class="mb-4 mt-8 text-2xl font-semibold">联系我们</h2>
      <p class="mb-6">如果您对本隐私政策有任何疑问，请通过我们的联系方式与我们联系。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
useHead({
  title: '隐私政策',
  meta: [
    { name: 'description', content: '查看我们的隐私政策，了解我们如何收集、使用和保护您的个人信息' }
  ]
})
</script>
