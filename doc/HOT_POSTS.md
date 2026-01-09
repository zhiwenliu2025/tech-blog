# 热门文章功能文档

## 概述

热门文章功能通过综合文章的阅读量、点赞数、评论数和发布时间，计算热度分数并排序，展示最受欢迎的内容。

## 热度算法

### 计算公式

```
热度分数 = (阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3) × 时间衰减因子

时间衰减因子 = max(0.1, 1 - 发布天数 / 统计天数)
```

### 权重说明

- **阅读量**（30%）：基础指标，反映曝光度
- **点赞数**（40%）：最重要指标，直接反映内容质量
- **评论数**（30%）：互动指标，反映讨论度

### 时间衰减

- 刚发布的文章权重为 1.0
- 随时间推移权重逐渐降低
- 最低权重为 0.1（保证老文章仍有机会）

## API 接口

### 获取热门文章

**端点：** `GET /api/posts/hot`

**参数：**

```typescript
{
  limit?: number  // 返回数量，默认 10
  days?: number   // 统计天数，默认 30
}
```

**响应：**

```typescript
{
  success: true,
  data: [
    {
      id: string
      title: string
      slug: string
      excerpt: string
      cover_image: string
      view_count: number
      published_at: string
      category: string
      tags: string[]
      likeCount: number
      commentCount: number
      hotScore: number  // 热度分数
      profiles: {
        id: string
        username: string
        full_name: string
        avatar_url: string
      }
    }
  ],
  cached: boolean  // 是否从缓存获取
}
```

### 使用示例

```typescript
// 获取最近 30 天的 TOP 10 热门文章
const { data } = await $fetch('/api/posts/hot?limit=10&days=30')

// 获取最近 7 天的 TOP 5 热门文章
const { data } = await $fetch('/api/posts/hot?limit=5&days=7')
```

## 实现细节

### 服务端实现

**文件：** `server/api/posts/hot.get.ts`

```typescript
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const limit = parseInt((query.limit as string) || '10')
  const days = parseInt((query.days as string) || '30')

  const cacheKey = `${CACHE_KEYS.HOT_POSTS}:${limit}:${days}`

  const hotPosts = await serverCache.getOrSet(
    cacheKey,
    async () => {
      const client = await serverSupabaseClient(event)

      // 1. 获取指定天数内的已发布文章
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - days)

      const { data: posts } = await client
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .gte('published_at', daysAgo.toISOString())

      // 2. 获取每篇文章的点赞数和评论数
      const postsWithStats = await Promise.all(
        posts.map(async post => {
          const [likeCount, commentCount] = await Promise.all([
            client.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
            client
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)
          ])

          // 3. 计算热度分数
          const hotScore =
            (post.view_count || 0) * 0.3 +
            (likeCount.count || 0) * 0.4 +
            (commentCount.count || 0) * 0.3

          // 4. 应用时间衰减
          const daysSincePublished = Math.floor(
            (Date.now() - new Date(post.published_at).getTime()) / (1000 * 60 * 60 * 24)
          )
          const timeFactor = Math.max(0.1, 1 - daysSincePublished / days)

          return {
            ...post,
            likeCount: likeCount.count || 0,
            commentCount: commentCount.count || 0,
            hotScore: hotScore * timeFactor
          }
        })
      )

      // 5. 按热度分数排序并返回前 N 篇
      return postsWithStats.sort((a, b) => b.hotScore - a.hotScore).slice(0, limit)
    },
    CACHE_TTL.HOT_POSTS // 缓存 5 分钟
  )

  return { success: true, data: hotPosts, cached: serverCache.has(cacheKey) }
})
```

### 客户端使用

**Composable：** `composables/useBlogPosts.ts`

```typescript
export function useBlogPosts() {
  const getHotPosts = async (limit = 10, days = 30) => {
    try {
      const { data } = await $fetch(`/api/posts/hot?limit=${limit}&days=${days}`)
      return data
    } catch (error) {
      console.error('Error fetching hot posts:', error)
      return []
    }
  }

  return { getHotPosts }
}
```

**Vue 组件：**

```vue
<script setup lang="ts">
const { getHotPosts } = useBlogPosts()
const hotPosts = ref([])

onMounted(async () => {
  hotPosts.value = await getHotPosts(5, 30)
})
</script>

<template>
  <div>
    <h2>热门文章</h2>
    <div v-for="post in hotPosts" :key="post.id">
      <NuxtLink :to="`/blog/${post.slug}`">
        {{ post.title }}
      </NuxtLink>
      <div class="stats">
        <span>👁️ {{ post.view_count }}</span>
        <span>❤️ {{ post.likeCount }}</span>
        <span>💬 {{ post.commentCount }}</span>
        <span>🔥 {{ post.hotScore.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>
```

## 性能优化

### 1. 缓存策略

- **TTL**: 5 分钟（热门文章变化不频繁）
- **键格式**: `posts:hot:{limit}:{days}`
- **自动失效**: 发布新文章时可选择失效缓存

### 2. 查询优化

- 只查询指定天数内的文章
- 使用并行查询获取统计数据
- 限制返回数量

### 3. 数据库索引

确保以下字段有索引：

```sql
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

## 使用场景

### 1. 首页热门文章

```vue
<!-- pages/index.vue -->
<HotPostsList :limit="5" :days="30" />
```

### 2. 侧边栏推荐

```vue
<!-- components/Sidebar.vue -->
<div class="hot-posts">
  <h3>🔥 本周热门</h3>
  <HotPostsList :limit="5" :days="7" />
</div>
```

### 3. 文章详情页相关推荐

```vue
<!-- pages/blog/[slug].vue -->
<div class="related-posts">
  <h3>热门推荐</h3>
  <HotPostsList 
    :limit="3" 
    :days="7"
    :exclude="currentPostId"
  />
</div>
```

## 扩展功能

### 1. 分类热门文章

```typescript
// 扩展 API 支持分类过滤
const { data } = await $fetch('/api/posts/hot?category=技术&limit=5')
```

### 2. 标签热门文章

```typescript
// 扩展 API 支持标签过滤
const { data } = await $fetch('/api/posts/hot?tag=Vue&limit=5')
```

### 3. 个性化推荐

```typescript
// 基于用户兴趣推荐
const { data } = await $fetch('/api/posts/hot?personalized=true')
```

## 调试和监控

### 查看热度分数

在开发环境中，可以在响应中包含热度计算详情：

```json
{
  "id": "xxx",
  "title": "文章标题",
  "hotScore": 125.5,
  "debug": {
    "viewCount": 500,
    "likeCount": 20,
    "commentCount": 10,
    "baseScore": 159,
    "timeFactor": 0.79,
    "finalScore": 125.5
  }
}
```

### 监控热门文章变化

```bash
# 查看缓存状态
curl http://localhost:3000/api/cache/stats | jq '.topKeys'

# 输出：
# [
#   "posts:hot:10:30",
#   "posts:hot:5:7"
# ]
```

## 常见问题

**Q: 为什么新发布的文章没有出现在热门列表？**  
A: 新文章的统计数据（点赞、评论）较少，需要积累一定数据才能进入热门。

**Q: 如何调整热度算法权重？**  
A: 修改 `server/api/posts/hot.get.ts` 中的权重参数（0.3, 0.4, 0.3）。

**Q: 热门文章列表多久更新一次？**  
A: 缓存 5 分钟，每 5 分钟重新计算一次。

**Q: 如何立即更新热门文章？**  
A: 调用缓存失效 API：`POST /api/cache/invalidate`

## 相关文件

- `server/api/posts/hot.get.ts` - 热门文章 API
- `composables/useBlogPosts.ts` - 客户端工具
- `components/HotPostsList.vue` - 热门文章列表组件

## 总结

热门文章功能特点：

- ✅ 综合多维度数据计算热度
- ✅ 时间衰减保证新鲜度
- ✅ 缓存优化提升性能
- ✅ 灵活配置适应不同场景

适合展示最受欢迎的内容，提升用户参与度。
