<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">分类: {{ category }}</h1>
    <div v-if="pending" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BlogPostCardSkeleton v-for="i in 6" :key="i" />
    </div>
    <div v-else-if="posts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <EmptyState v-else message="该分类下暂无文章" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const category = computed(() => route.params.slug as string)

// 获取分类下的文章
const { getPostsByCategory } = useBlogPosts()
const { data: posts, pending } = await useLazyAsyncData(`posts-${category.value}`, () =>
  getPostsByCategory(category.value)
)

// 设置页面元数据
useHead({
  title: `分类: ${category.value}`,
  meta: [{ name: 'description', content: `浏览 ${category.value} 分类下的所有文章` }]
})
</script>
