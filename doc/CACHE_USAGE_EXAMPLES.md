# 缓存使用示例

## 示例 1: 文章详情页使用缓存统计

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
import { usePostStats } from '~/composables/useCache'
import { useCacheManager } from '~/composables/useCache'

const route = useRoute()
const slug = route.params.slug as string

// 获取文章详情（原有逻辑）
const { data: post } = await useAsyncData(`post-${slug}`, async () => {
  const supabase = useSupabaseClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
  return data
})

// 使用缓存获取统计
const { getStats, incrementView } = usePostStats()
const stats = ref({ likeCount: 0, commentCount: 0, viewCount: 0 })
const loading = ref(true)

onMounted(async () => {
  if (post.value?.id) {
    // 增加阅读量（异步，不阻塞渲染）
    incrementView(post.value.id)

    // 获取统计（从缓存）
    stats.value = await getStats(post.value.id)
    loading.value = false
  }
})

// 点赞后清除缓存
const { invalidateLike } = useCacheManager()
const handleLike = async () => {
  // ... 点赞逻辑
  await invalidateLike(post.value.id)
  // 重新获取统计
  stats.value = await getStats(post.value.id)
}

// 评论后清除缓存
const { invalidateComment } = useCacheManager()
const handleComment = async (content: string) => {
  // ... 评论逻辑
  await invalidateComment(post.value.id)
  // 重新获取统计
  stats.value = await getStats(post.value.id)
}
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>

    <!-- 文章统计 -->
    <div v-if="!loading" class="stats">
      <span>👁️ {{ stats.viewCount }} 阅读</span>
      <span>❤️ {{ stats.likeCount }} 点赞</span>
      <span>💬 {{ stats.commentCount }} 评论</span>
    </div>

    <!-- 文章内容 -->
    <div v-html="post.content"></div>

    <!-- 点赞按钮 -->
    <button @click="handleLike">点赞</button>

    <!-- 评论区 -->
    <div class="comments">
      <!-- ... 评论组件 -->
    </div>
  </article>
</template>
```

---

## 示例 2: 首页热门文章组件

```vue
<!-- components/HotPosts.vue -->
<script setup lang="ts">
import { useCachedHotPosts } from '~/composables/useCache'

const props = defineProps({
  limit: {
    type: Number,
    default: 10
  },
  days: {
    type: Number,
    default: 30
  }
})

const { posts, loading, error, fetchHotPosts } = useCachedHotPosts()

// 获取热门文章
onMounted(async () => {
  await fetchHotPosts(props.limit, props.days)
})

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<template>
  <div class="hot-posts">
    <h2 class="title">🔥 热门文章</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="skeleton" v-for="i in 5" :key="i"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>

    <!-- 文章列表 -->
    <div v-else class="posts-list">
      <article v-for="(post, index) in posts" :key="post.id" class="post-item">
        <!-- 排名徽章 -->
        <div
          class="rank"
          :class="{
            'rank-gold': index === 0,
            'rank-silver': index === 1,
            'rank-bronze': index === 2
          }"
        >
          {{ index + 1 }}
        </div>

        <!-- 文章信息 -->
        <div class="post-info">
          <NuxtLink :to="`/blog/${post.slug}`" class="post-title">
            {{ post.title }}
          </NuxtLink>

          <!-- 统计信息 -->
          <div class="post-stats">
            <span title="阅读量"> 👁️ {{ formatNumber(post.viewCount) }} </span>
            <span title="点赞数"> ❤️ {{ formatNumber(post.likeCount) }} </span>
            <span title="评论数"> 💬 {{ formatNumber(post.commentCount) }} </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.hot-posts {
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.post-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.post-item:last-child {
  border-bottom: none;
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #e5e7eb;
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #fff;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #333;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #e8a87c);
  color: #fff;
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-title {
  display: block;
  font-weight: 500;
  color: #1f2937;
  text-decoration: none;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-title:hover {
  color: #3b82f6;
}

.post-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.skeleton {
  height: 3rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

---

## 示例 3: 博客列表页

```vue
<!-- pages/blog/index.vue -->
<script setup lang="ts">
import { useCachedPostsList } from '~/composables/useCache'

const route = useRoute()
const router = useRouter()

const { posts, total, totalPages, loading, fetchPosts } = useCachedPostsList()

const currentPage = computed(() => parseInt(route.query.page as string) || 1)
const currentCategory = computed(() => route.query.category as string)
const currentTag = computed(() => route.query.tag as string)

// 监听路由变化，重新获取数据
watch(
  () => [route.query.page, route.query.category, route.query.tag],
  async () => {
    await fetchPosts({
      page: currentPage.value,
      limit: 10,
      category: currentCategory.value,
      tag: currentTag.value
    })
  },
  { immediate: true }
)

// 翻页
const goToPage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString()
    }
  })
}
</script>

<template>
  <div class="blog-list">
    <h1>博客文章</h1>

    <!-- 过滤器 -->
    <div class="filters">
      <!-- 分类过滤 -->
      <select v-model="currentCategory" @change="goToPage(1)">
        <option value="">所有分类</option>
        <option value="tech">技术</option>
        <option value="life">生活</option>
      </select>

      <!-- 标签过滤 -->
      <input type="text" v-model="currentTag" placeholder="搜索标签..." @change="goToPage(1)" />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div v-for="i in 3" :key="i" class="skeleton"></div>
    </div>

    <!-- 文章列表 -->
    <div v-else class="posts">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <!-- 封面图 -->
        <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title" class="cover" />

        <div class="content">
          <h2>
            <NuxtLink :to="`/blog/${post.slug}`">
              {{ post.title }}
            </NuxtLink>
          </h2>

          <p class="excerpt">{{ post.excerpt }}</p>

          <!-- 统计信息 -->
          <div class="stats">
            <span>👁️ {{ post.viewCount }}</span>
            <span>❤️ {{ post.likeCount }}</span>
            <span>💬 {{ post.commentCount }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>

      <span>第 {{ currentPage }} / {{ totalPages }} 页</span>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
        下一页
      </button>
    </div>

    <!-- 总数显示 -->
    <div class="total">共 {{ total }} 篇文章</div>
  </div>
</template>
```

---

## 示例 4: 批量获取文章统计

```vue
<!-- components/PostsGrid.vue -->
<script setup lang="ts">
import { usePostStats } from '~/composables/useCache'

const props = defineProps({
  posts: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const { getBatchStats } = usePostStats()
const statsMap = ref<Record<string, any>>({})
const loading = ref(true)

// 批量获取统计
onMounted(async () => {
  if (props.posts.length > 0) {
    const postIds = props.posts.map(p => p.id)
    const stats = await getBatchStats(postIds)

    // 转换为 Map 便于查找
    stats.forEach((stat: any) => {
      statsMap.value[stat.postId] = {
        likeCount: stat.likeCount,
        commentCount: stat.commentCount,
        viewCount: stat.viewCount
      }
    })

    loading.value = false
  }
})

// 获取单个文章的统计
const getPostStats = (postId: string) => {
  return (
    statsMap.value[postId] || {
      likeCount: 0,
      commentCount: 0,
      viewCount: 0
    }
  )
}
</script>

<template>
  <div class="posts-grid">
    <article v-for="post in posts" :key="post.id" class="post-card">
      <h3>{{ post.title }}</h3>

      <div v-if="loading" class="stats-loading">加载统计中...</div>

      <div v-else class="stats">
        <span>👁️ {{ getPostStats(post.id).viewCount }}</span>
        <span>❤️ {{ getPostStats(post.id).likeCount }}</span>
        <span>💬 {{ getPostStats(post.id).commentCount }}</span>
      </div>
    </article>
  </div>
</template>
```

---

## 示例 5: 管理后台缓存管理

```vue
<!-- pages/admin/cache.vue -->
<script setup lang="ts">
import { useCacheManager } from '~/composables/useCache'

const { getCacheStats, invalidateAll } = useCacheManager()

const stats = ref<any>(null)
const loading = ref(false)

// 获取缓存统计
const loadStats = async () => {
  loading.value = true
  stats.value = await getCacheStats()
  loading.value = false
}

// 清除所有缓存
const clearAllCache = async () => {
  if (confirm('确定要清除所有缓存吗？')) {
    await invalidateAll()
    await loadStats()
    alert('缓存已清除')
  }
}

onMounted(async () => {
  await loadStats()
})

// 定时刷新统计
setInterval(loadStats, 30000) // 每 30 秒刷新
</script>

<template>
  <div class="admin-cache">
    <h1>缓存管理</h1>

    <!-- 统计信息 -->
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="stats" class="stats-card">
      <div class="stat">
        <label>当前缓存条目:</label>
        <span class="value">{{ stats.size }}</span>
      </div>

      <div class="stat">
        <label>最大容量:</label>
        <span class="value">{{ stats.maxSize }}</span>
      </div>

      <div class="stat">
        <label>使用率:</label>
        <span class="value">{{ stats.usagePercentage }}</span>
      </div>

      <div class="stat">
        <label>总大小:</label>
        <span class="value">{{ (stats.calculatedSize / 1024).toFixed(2) }} KB</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button @click="loadStats" class="btn-refresh">刷新统计</button>

      <button @click="clearAllCache" class="btn-danger">清除所有缓存</button>
    </div>

    <!-- 提示信息 -->
    <div class="tips">
      <h3>缓存说明</h3>
      <ul>
        <li>文章统计缓存 TTL: 1 分钟</li>
        <li>热门文章缓存 TTL: 5 分钟</li>
        <li>文章列表缓存 TTL: 2 分钟</li>
        <li>缓存会在数据更新时自动失效</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.admin-cache {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.stat:last-child {
  border-bottom: none;
}

.value {
  font-weight: bold;
  color: #3b82f6;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-refresh {
  background: #3b82f6;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.tips {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.tips h3 {
  margin-bottom: 0.75rem;
}

.tips ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.tips li {
  margin-bottom: 0.5rem;
  color: #6b7280;
}
</style>
```

---

## 测试缓存效果

### 使用浏览器开发者工具

1. 打开 Network 面板
2. 第一次请求（缓存未命中）：

   ```
   GET /api/posts/hot?limit=10
   Response Time: 245ms
   ```

3. 第二次请求（缓存命中）：
   ```
   GET /api/posts/hot?limit=10
   Response Time: 8ms
   ```

### 使用 Console 测试

```javascript
// 测试缓存效果
const testCache = async () => {
  console.time('First Request')
  await fetch('/api/posts/hot?limit=10')
  console.timeEnd('First Request') // ~245ms

  console.time('Second Request (Cached)')
  await fetch('/api/posts/hot?limit=10')
  console.timeEnd('Second Request (Cached)') // ~8ms

  console.log('性能提升:', (((245 - 8) / 245) * 100).toFixed(1) + '%')
}

testCache()
```

---

## 最佳实践

### 1. 何时使用缓存 API

✅ **推荐使用**:

- 文章列表页（频繁访问）
- 热门文章组件（首页侧边栏）
- 文章统计信息（点赞/评论/阅读数）
- 搜索结果页

❌ **不推荐使用**:

- 用户私有数据（如草稿）
- 实时性要求高的数据（如聊天消息）
- 低频访问的页面

### 2. 缓存失效时机

确保在以下操作后清除相关缓存：

```typescript
// 发布文章后
await publishPost(postId)
await invalidatePost(postId)

// 点赞后
await likePost(postId)
await invalidateLike(postId)

// 评论后
await addComment(postId, content)
await invalidateComment(postId)
```

### 3. 错误处理

```typescript
const { getStats } = usePostStats()

try {
  const stats = await getStats(postId)
  // 使用统计数据
} catch (error) {
  // 降级处理：显示默认值
  const stats = {
    likeCount: 0,
    commentCount: 0,
    viewCount: 0
  }
}
```

---

创建时间: 2026-01-07
