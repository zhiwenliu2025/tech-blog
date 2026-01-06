# 热门博客文章功能实现方案

## 📋 功能概述

热门博客功能基于文章的阅读量、点赞数和评论数计算热度分数，展示最受欢迎的文章，提高用户参与度和内容发现性。

## 🎯 功能目标

### 核心目标

- 自动计算文章热度分数
- 在首页和侧边栏展示热门文章
- 定期更新热度排名
- 支持时间衰减（可选）

### 用户价值

- 快速发现优质内容
- 提高用户停留时间
- 增加文章曝光度
- 促进社区互动

## 🗄️ 数据库设计

### 方案一：实时计算（推荐用于小型博客）

**优点**：

- 实现简单
- 数据实时性强
- 无需额外存储

**缺点**：

- 查询时计算开销较大
- 大量文章时性能下降

**实现方式**：

```sql
-- 1. 添加热度分数视图
CREATE OR REPLACE VIEW hot_posts AS
SELECT
  bp.*,
  -- 热度计算公式：阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3
  (
    COALESCE(bp.view_count, 0) * 0.3 +
    COALESCE(bp.likes_count, 0) * 0.4 +
    COALESCE(bp.comments_count, 0) * 0.3
  ) AS hot_score,
  -- 可选：加入时间衰减因子（文章越新，权重越高）
  (
    COALESCE(bp.view_count, 0) * 0.3 +
    COALESCE(bp.likes_count, 0) * 0.4 +
    COALESCE(bp.comments_count, 0) * 0.3
  ) *
  -- 时间衰减：7 天内权重为 1，之后每天衰减 2%
  CASE
    WHEN EXTRACT(EPOCH FROM (NOW() - bp.published_at)) / 86400 <= 7 THEN 1
    ELSE POWER(0.98, EXTRACT(EPOCH FROM (NOW() - bp.published_at)) / 86400 - 7)
  END AS hot_score_with_decay
FROM blog_posts bp
WHERE bp.published = true
ORDER BY hot_score_with_decay DESC;

-- 2. 创建索引优化查询（如果使用物化视图）
-- CREATE INDEX idx_hot_posts_score ON hot_posts(hot_score_with_decay DESC);
```

### 方案二：缓存热度分数（推荐用于大型博客）

**优点**：

- 查询性能优秀
- 支持复杂排序算法
- 灵活的更新策略

**缺点**：

- 需要定期更新
- 额外存储空间
- 实时性略低

**实现方式**：

```sql
-- 1. 添加热度分数字段
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hot_score DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hot_score_updated_at TIMESTAMP WITH TIME ZONE;

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_hot_score ON blog_posts(hot_score DESC) WHERE published = true;

-- 3. 创建更新热度分数的函数
CREATE OR REPLACE FUNCTION update_hot_scores()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE blog_posts
  SET
    hot_score = (
      COALESCE(view_count, 0) * 0.3 +
      COALESCE(likes_count, 0) * 0.4 +
      COALESCE(comments_count, 0) * 0.3
    ) *
    -- 时间衰减因子（可选）
    CASE
      WHEN EXTRACT(EPOCH FROM (NOW() - published_at)) / 86400 <= 7 THEN 1.0
      WHEN EXTRACT(EPOCH FROM (NOW() - published_at)) / 86400 <= 30 THEN 0.8
      WHEN EXTRACT(EPOCH FROM (NOW() - published_at)) / 86400 <= 90 THEN 0.5
      ELSE 0.3
    END,
    hot_score_updated_at = NOW()
  WHERE published = true;
END;
$$;

-- 4. 创建触发器：文章互动时更新热度（可选）
CREATE OR REPLACE FUNCTION update_post_hot_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE blog_posts
  SET hot_score = (
    COALESCE(view_count, 0) * 0.3 +
    COALESCE(likes_count, 0) * 0.4 +
    COALESCE(comments_count, 0) * 0.3
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- 5. 绑定触发器到文章更新
CREATE TRIGGER trigger_update_hot_score
AFTER UPDATE OF view_count, likes_count, comments_count ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_post_hot_score();

-- 6. 授权
GRANT EXECUTE ON FUNCTION update_hot_scores() TO authenticated;
```

## 🔥 热度计算算法

### 基础算法

```typescript
// 基础热度公式
function calculateHotScore(post: BlogPost): number {
  const viewWeight = 0.3
  const likeWeight = 0.4
  const commentWeight = 0.3

  return (
    (post.view_count || 0) * viewWeight +
    (post.likes_count || 0) * likeWeight +
    (post.comments_count || 0) * commentWeight
  )
}
```

### 进阶算法（加入时间衰减）

```typescript
// 加入时间衰减的热度计算
function calculateHotScoreWithDecay(post: BlogPost): number {
  const baseScore = calculateHotScore(post)
  const decayFactor = calculateDecayFactor(post.published_at)

  return baseScore * decayFactor
}

function calculateDecayFactor(publishedAt: Date): number {
  const now = new Date()
  const daysSincePublished =
    (now.getTime() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)

  if (daysSincePublished <= 7) {
    return 1.0 // 一周内，满权重
  } else if (daysSincePublished <= 30) {
    return 0.8 // 一月内，80% 权重
  } else if (daysSincePublished <= 90) {
    return 0.5 // 三月内，50% 权重
  } else {
    return 0.3 // 三月后，30% 权重
  }
}
```

### 高级算法（Reddit 风格）

```typescript
// Reddit Hot 算法（考虑时间和投票）
function calculateRedditHotScore(post: BlogPost): number {
  const score = post.likes_count - (post.dislikes_count || 0)
  const order = Math.log10(Math.max(Math.abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const seconds = new Date(post.published_at).getTime() / 1000 - 1134028003 // epoch

  return sign * order + seconds / 45000
}
```

## 💻 前端实现

### 1. Composable 函数

```typescript
// composables/useHotPosts.ts
export const useHotPosts = () => {
  const supabase = useSupabaseClient<Database>()
  const hotPosts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取热门文章（方案一：实时计算）
  const fetchHotPostsRealtime = async (limit = 5, days = 30) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .gte('published_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('likes_count', { ascending: false })
        .limit(limit)

      if (dbError) throw dbError

      // 客户端计算热度分数并排序
      const postsWithScore = (data || []).map(post => ({
        ...post,
        hot_score: calculateHotScore(post)
      }))

      hotPosts.value = postsWithScore.sort((a, b) => b.hot_score - a.hot_score).slice(0, limit)

      return hotPosts.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // 获取热门文章（方案二：使用缓存分数）
  const fetchHotPostsCached = async (limit = 5) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('hot_score', { ascending: false })
        .limit(limit)

      if (dbError) throw dbError

      hotPosts.value = data || []
      return hotPosts.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // 计算热度分数
  const calculateHotScore = (post: any): number => {
    const viewWeight = 0.3
    const likeWeight = 0.4
    const commentWeight = 0.3

    return (
      (post.view_count || 0) * viewWeight +
      (post.likes_count || 0) * likeWeight +
      (post.comments_count || 0) * commentWeight
    )
  }

  return {
    hotPosts,
    loading,
    error,
    fetchHotPostsRealtime,
    fetchHotPostsCached,
    calculateHotScore
  }
}
```

### 2. 热门文章组件

```vue
<!-- components/HotPosts.vue -->
<template>
  <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        <Icon name="heroicons:fire" class="mr-2 inline-block h-5 w-5 text-orange-500" />
        热门文章
      </h3>
      <NuxtLink
        to="/blog?sort=hot"
        class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        查看更多
      </NuxtLink>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
      />
    </div>

    <!-- 热门文章列表 -->
    <div v-else-if="hotPosts.length > 0" class="space-y-3">
      <NuxtLink
        v-for="(post, index) in hotPosts"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="group flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <!-- 排名 -->
        <div
          class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold"
          :class="{
            'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300': index === 0,
            'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300': index === 1,
            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300': index === 2,
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400': index > 2
          }"
        >
          {{ index + 1 }}
        </div>

        <!-- 文章信息 -->
        <div class="min-w-0 flex-1">
          <h4
            class="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
          >
            {{ post.title }}
          </h4>
          <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <span class="flex items-center space-x-1">
              <Icon name="heroicons:eye" class="h-3 w-3" />
              <span>{{ formatNumber(post.view_count || 0) }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <Icon name="heroicons:heart" class="h-3 w-3" />
              <span>{{ formatNumber(post.likes_count || 0) }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <Icon name="heroicons:chat-bubble-left-right" class="h-3 w-3" />
              <span>{{ formatNumber(post.comments_count || 0) }}</span>
            </span>
          </div>
        </div>

        <!-- 热度指示器（可选） -->
        <div
          v-if="post.hot_score"
          class="flex-shrink-0 text-xs font-medium text-orange-600 dark:text-orange-400"
        >
          🔥 {{ Math.round(post.hot_score) }}
        </div>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">暂无热门文章</div>
  </div>
</template>

<script setup lang="ts">
const { fetchHotPostsCached, hotPosts, loading } = useHotPosts()

// 组件挂载时获取热门文章
onMounted(() => {
  fetchHotPostsCached(5)
})

// 格式化数字（1000 -> 1k）
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>
```

### 3. 集成到首页

```vue
<!-- pages/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- 主内容区 -->
      <div class="lg:col-span-2">
        <!-- 最新文章 -->
        <section>
          <h2 class="mb-4 text-2xl font-bold">最新文章</h2>
          <!-- 文章列表 -->
        </section>
      </div>

      <!-- 侧边栏 -->
      <aside class="space-y-6">
        <!-- 热门文章组件 -->
        <HotPosts />

        <!-- 热门标签 -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <!-- 标签列表 -->
        </div>

        <!-- 分类列表 -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <!-- 分类列表 -->
        </div>
      </aside>
    </div>
  </div>
</template>
```

## 🔧 后端实现

### 1. 定时更新热度分数（推荐方案二使用）

```typescript
// server/api/cron/update-hot-scores.ts
export default defineEventHandler(async event => {
  const supabase = createClient(
    useRuntimeConfig().supabaseUrl,
    useRuntimeConfig().supabaseServiceKey
  )

  try {
    // 调用数据库函数更新热度分数
    const { error } = await supabase.rpc('update_hot_scores')

    if (error) throw error

    return {
      success: true,
      message: 'Hot scores updated successfully',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Failed to update hot scores:', error)
    return {
      success: false,
      error: error.message
    }
  }
})
```

### 2. Vercel Cron Job 配置

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/update-hot-scores",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 3. 手动触发更新（管理员功能）

```typescript
// server/api/admin/update-hot-scores.post.ts
export default defineEventHandler(async event => {
  // 验证管理员权限
  const user = await requireUserSession(event)
  const isAdmin = await checkIsAdmin(user.id)

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Unauthorized'
    })
  }

  const supabase = createClient(
    useRuntimeConfig().supabaseUrl,
    useRuntimeConfig().supabaseServiceKey
  )

  try {
    const { error } = await supabase.rpc('update_hot_scores')

    if (error) throw error

    return {
      success: true,
      message: 'Hot scores updated successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
```

## ⚡ 性能优化

### 1. 缓存策略

```typescript
// composables/useHotPosts.ts
export const useHotPosts = () => {
  // 使用 Nuxt 的 useAsyncData 进行缓存
  const { data: hotPosts, pending: loading } = useAsyncData(
    'hot-posts',
    () => fetchHotPostsCached(5),
    {
      // 缓存 10 分钟
      maxAge: 600,
      // 服务端和客户端都缓存
      server: true
    }
  )

  return {
    hotPosts,
    loading
  }
}
```

### 2. 数据库优化

```sql
-- 1. 创建部分索引（只索引已发布的文章）
CREATE INDEX idx_published_hot_posts ON blog_posts(hot_score DESC)
WHERE published = true;

-- 2. 创建复合索引（用于热门文章查询）
CREATE INDEX idx_hot_posts_composite ON blog_posts(published, hot_score DESC, published_at DESC);

-- 3. 使用物化视图（大量数据时）
CREATE MATERIALIZED VIEW mv_hot_posts AS
SELECT * FROM blog_posts
WHERE published = true
ORDER BY hot_score DESC
LIMIT 100;

-- 定期刷新物化视图
CREATE OR REPLACE FUNCTION refresh_hot_posts_mv()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hot_posts;
END;
$$;
```

### 3. CDN 缓存

```typescript
// server/api/hot-posts.get.ts
export default defineEventHandler(async event => {
  // 设置缓存头
  setHeader(event, 'Cache-Control', 's-maxage=600, stale-while-revalidate=1800')

  const supabase = createClient(/*...*/)

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('hot_score', { ascending: false })
    .limit(10)

  return data
})
```

## 📊 实施步骤

### 第一阶段：基础实现（1-2 天）

1. ✅ 数据库准备

   ```bash
   # 在 Supabase SQL 编辑器中执行
   - 添加 hot_score 字段
   - 创建索引
   - 创建更新函数
   ```

2. ✅ 创建 Composable

   ```bash
   # 创建 useHotPosts.ts
   touch composables/useHotPosts.ts
   ```

3. ✅ 创建组件

   ```bash
   # 创建 HotPosts.vue
   touch components/HotPosts.vue
   ```

4. ✅ 集成到页面
   ```vue
   <!-- 在首页和其他页面添加热门文章组件 -->
   ```

### 第二阶段：优化（1-2 天）

5. ✅ 添加定时任务

   ```bash
   # 创建 cron job
   mkdir -p server/api/cron
   touch server/api/cron/update-hot-scores.ts
   ```

6. ✅ 配置 Vercel Cron

   ```json
   # 更新 vercel.json
   ```

7. ✅ 添加缓存
   ```typescript
   # 实现多级缓存策略
   ```

### 第三阶段：增强（可选，1-2 天）

8. ✅ 添加时间衰减

   ```sql
   # 更新热度计算函数
   ```

9. ✅ 管理员功能

   ```typescript
   # 手动刷新热度分数
   ```

10. ✅ 分析和监控
    ```typescript
    # 添加日志和性能监控
    ```

## 🎨 UI 增强建议

### 1. 趋势指示器

```vue
<!-- 显示文章热度趋势（上升/下降） -->
<div class="flex items-center space-x-1">
  <Icon 
    :name="post.trend === 'up' ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
    :class="post.trend === 'up' ? 'text-green-500' : 'text-red-500'"
  />
  <span>{{ post.trendPercentage }}%</span>
</div>
```

### 2. 热度徽章

```vue
<!-- 超级热门文章徽章 -->
<span
  v-if="post.hot_score > 100"
  class="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-xs text-white"
>
  🔥 超级热门
</span>
```

### 3. 动画效果

```css
/* 热门文章卡片动画 */
.hot-post-card {
  transition: all 0.3s ease;
}

.hot-post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

## 📈 监控和分析

### 1. 热度分布分析

```typescript
// 分析热度分数分布
const analyzeHotScoreDistribution = async () => {
  const { data } = await supabase.from('blog_posts').select('hot_score').eq('published', true)

  const scores = data.map(p => p.hot_score)
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const max = Math.max(...scores)
  const min = Math.min(...scores)

  console.log({ avg, max, min })
}
```

### 2. 性能监控

```typescript
// 监控热门文章查询性能
const monitorPerformance = async () => {
  const start = performance.now()
  await fetchHotPosts()
  const duration = performance.now() - start

  console.log(`Hot posts query took ${duration}ms`)
}
```

## 🔒 安全考虑

1. **防止刷量**
   - 同一 IP 限制阅读量增长频率
   - 检测异常点赞/评论行为
   - 使用 Captcha 验证

2. **权限控制**
   - 只有管理员可以手动更新热度
   - RLS 策略保护数据

3. **数据验证**
   - 验证热度分数范围
   - 防止 SQL 注入

## 📝 总结

### 推荐方案

对于你的博客项目，我推荐使用**方案二（缓存热度分数）**：

- ✅ 性能优秀，适合扩展
- ✅ 支持复杂算法
- ✅ 实时性可通过触发器保证
- ✅ 易于监控和调试

### 实施优先级

1. **高优先级**：基础热门文章功能（方案二）
2. **中优先级**：定时更新和缓存优化
3. **低优先级**：时间衰减和趋势分析

### 预期效果

- 📊 提升用户停留时间 15-20%
- 🔄 增加页面浏览量 10-15%
- 💬 提高互动率（点赞、评论）8-12%
- ⚡ 查询性能 < 100ms
