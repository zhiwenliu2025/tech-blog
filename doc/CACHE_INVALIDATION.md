# 博客缓存自动失效机制

## 概述

为确保数据一致性，所有博客文章的操作（创建、修改、删除、导入）都会自动触发缓存失效，同时清除客户端和服务端缓存。

## 缓存架构

### 1. 客户端缓存（Nuxt Data）

- 使用 `clearNuxtData()` 清除
- 缓存键格式：
  - 文章详情：`post-{slug}`
  - 文章评论：`post-comments-{slug}`
  - 文章互动：`post-interaction-{slug}`
  - 首页文章列表：`home-posts`
  - 博客列表：`blog-all-posts`
  - 分类列表：`blog-categories`
  - 标签列表：`blog-tags`
  - 分类页：`posts-{category}`

### 2. 服务端缓存（LRU Cache）

- 使用 `/api/cache/invalidate` API 清除
- 缓存键前缀（定义在 `server/utils/cache.ts`）：
  - `post:stats:` - 文章统计
  - `post:detail:` - 文章详情
  - `hot:posts` - 热门文章
  - `posts:list:` - 文章列表
  - `category:posts:` - 分类文章
  - `tag:posts:` - 标签文章
  - `profile:` - 用户资料

## 自动失效触发点

### 1. 创建文章 (`savePost` - 新建)

**位置**：`composables/useBlogPosts.ts` → `savePost()`

**失效范围**：

- ✅ 客户端：
  - 首页文章列表
  - 博客所有文章列表
  - 分类列表
  - 标签列表
  - 相关分类页

- ✅ 服务端（通过 `/api/cache/invalidate`）：
  - 文章详情缓存
  - 文章统计缓存
  - 热门文章缓存
  - 文章列表缓存

**代码片段**：

```typescript
// 清除客户端缓存
await clearNuxtData('home-posts')
await clearNuxtData('blog-all-posts')
await clearNuxtData('blog-categories')
await clearNuxtData('blog-tags')
if (post.category) {
  await clearNuxtData(`posts-${post.category}`)
}

// 清除服务端缓存
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'post',
    postId: postId
  }
})
```

### 2. 修改文章 (`savePost` - 更新)

**位置**：`composables/useBlogPosts.ts` → `savePost()`

**失效范围**：

- ✅ 客户端：
  - 旧 slug 相关的所有缓存
  - 新 slug 相关的所有缓存（如果 slug 改变）
  - 首页文章列表
  - 博客所有文章列表
  - 分类列表
  - 标签列表
  - 相关分类页

- ✅ 服务端（通过 `/api/cache/invalidate`）：
  - 文章详情缓存
  - 文章统计缓存
  - 热门文章缓存
  - 文章列表缓存

**特殊处理**：

- 如果 slug 改变，同时清除新旧两个 slug 的缓存
- 如果发布状态改变（草稿 → 发布），设置 `published_at`

### 3. 删除文章 (`deletePost`)

**位置**：`composables/useBlogPosts.ts` → `deletePost()`

**失效范围**：

- ✅ 客户端：
  - 文章详情缓存
  - 文章评论缓存
  - 文章互动缓存
  - 首页文章列表
  - 博客所有文章列表
  - 分类列表
  - 标签列表
  - 相关分类页

- ✅ 服务端（通过 `/api/cache/invalidate`）：
  - 文章详情缓存
  - 文章统计缓存
  - 热门文章缓存
  - 文章列表缓存

**代码片段**：

```typescript
// 先获取文章信息
const { data: postToDelete } = await supabase
  .from('blog_posts')
  .select('slug, category')
  .eq('id', id)
  .single()

// 删除文章
await supabase.from('blog_posts').delete().eq('id', id)

// 清除客户端缓存
if (postData?.slug) {
  await clearNuxtData(`post-${postData.slug}`)
  await clearNuxtData(`post-comments-${postData.slug}`)
  await clearNuxtData(`post-interaction-${postData.slug}`)
}
await clearNuxtData('home-posts')
await clearNuxtData('blog-all-posts')
// ... 其他缓存

// 清除服务端缓存
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: { type: 'post', postId: id }
})
```

### 4. 导入文章

**位置**：`composables/useImport.ts` → `saveAsPost()` → 调用 `useBlogPosts().savePost()`

**失效范围**：

- ✅ 继承 `savePost()` 的所有缓存失效逻辑
- 自动触发客户端和服务端缓存清除

**流程**：

1. 用户通过 `/api/import/fetch` 获取文章内容
2. 调用 `saveAsPost()` 保存文章
3. `saveAsPost()` 内部调用 `savePost()`
4. `savePost()` 自动触发所有缓存失效

## 服务端缓存失效 API

### API 端点：`POST /api/cache/invalidate`

**位置**：`server/api/cache/invalidate.post.ts`

**支持的失效类型**：

#### 1. 文章相关 (`type: 'post'`)

```typescript
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'post',
    postId: 'xxx'
  }
})
```

**失效范围**：

- 文章详情：`post:detail:{postId}`
- 文章统计：`post:stats:{postId}`
- 热门文章：`hot:posts`
- 所有文章列表：`posts:list:*`（前缀匹配）

#### 2. 点赞相关 (`type: 'like'`)

```typescript
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'like',
    postId: 'xxx'
  }
})
```

**失效范围**：

- 文章统计：`post:stats:{postId}`
- 热门文章：`hot:posts`

#### 3. 评论相关 (`type: 'comment'`)

```typescript
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'comment',
    postId: 'xxx'
  }
})
```

**失效范围**：

- 文章统计：`post:stats:{postId}`
- 热门文章：`hot:posts`

#### 4. 用户资料 (`type: 'profile'`)

```typescript
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'profile',
    userId: 'xxx'
  }
})
```

**失效范围**：

- 用户资料：`profile:{userId}`
- 所有文章列表：`posts:list:*`（因为包含作者信息）
- 热门文章：`hot:posts`

#### 5. 全部缓存 (`type: 'all'`)

```typescript
await $fetch('/api/cache/invalidate', {
  method: 'POST',
  body: {
    type: 'all'
  }
})
```

**失效范围**：

- 清除所有服务端缓存

## 缓存失效工具函数

### 位置：`server/utils/cache.ts`

### `cacheInvalidator` 对象方法：

#### `invalidatePost(postId)`

文章创建/更新时调用

```typescript
import { cacheInvalidator } from '~/server/utils/cache'

cacheInvalidator.invalidatePost(postId)
```

#### `invalidateLike(postId)`

点赞/取消点赞时调用

```typescript
cacheInvalidator.invalidateLike(postId)
```

#### `invalidateComment(postId)`

评论创建/删除时调用

```typescript
cacheInvalidator.invalidateComment(postId)
```

#### `invalidateProfile(userId)`

用户资料更新时调用

```typescript
cacheInvalidator.invalidateProfile(userId)
```

#### `invalidateAll()`

清除所有缓存

```typescript
cacheInvalidator.invalidateAll()
```

## 错误处理

所有缓存失效操作都包含错误处理，确保缓存失效失败不会中断主要业务流程：

```typescript
try {
  await $fetch('/api/cache/invalidate', {
    method: 'POST',
    body: { type: 'post', postId: postId }
  })
} catch (cacheError) {
  console.warn('Failed to invalidate server cache:', cacheError)
  // 不中断操作流程，只记录警告
}
```

## 最佳实践

### 1. 操作顺序

1. 先执行数据库操作
2. 操作成功后清除客户端缓存
3. 最后清除服务端缓存
4. 缓存失效失败不影响主流程

### 2. 缓存键命名

- 客户端：使用语义化的键名（`post-{slug}`）
- 服务端：使用带前缀的键名（`post:detail:{id}`）

### 3. 批量失效

- 使用 `deleteByPrefix()` 批量删除相关缓存
- 例如：`serverCache.deleteByPrefix(CACHE_KEYS.POSTS_LIST)`

### 4. 缓存过期时间（TTL）

- 短期：1 分钟（`CACHE_TTL.SHORT`）- 文章统计
- 中期：5 分钟（`CACHE_TTL.MEDIUM`）- 热门文章、文章详情
- 长期：15 分钟（`CACHE_TTL.LONG`）- 很少变化的数据

## 测试验证

### 创建文章

1. 创建新文章
2. 验证首页列表立即显示新文章
3. 验证分类页立即显示新文章
4. 验证热门文章列表更新

### 修改文章

1. 修改文章标题
2. 验证文章详情页立即显示新标题
3. 验证列表页立即显示新标题

### 删除文章

1. 删除文章
2. 验证列表页立即移除该文章
3. 验证访问文章详情页返回 404
4. 验证热门文章列表更新

### 导入文章

1. 通过导入功能导入文章
2. 验证导入后立即出现在列表中
3. 验证分类和标签正确更新

## 相关文件

- **缓存工具**：`server/utils/cache.ts`
- **缓存失效 API**：`server/api/cache/invalidate.post.ts`
- **博客操作**：`composables/useBlogPosts.ts`
- **导入功能**：`composables/useImport.ts`
- **导入 API**：`server/api/import/fetch.post.ts`

## 监控与调试

### 查看缓存统计

```typescript
GET / api / cache / stats
```

返回：

```json
{
  "size": 150,
  "maxSize": 1000,
  "calculatedSize": 5242880
}
```

### 手动清除缓存

```typescript
POST /api/cache/invalidate
{
  "type": "all"
}
```

### 日志

缓存失效操作会在控制台输出日志：

```
Cache invalidated: profile:xxx
Cache invalidated: 5 profiles
```

## 注意事项

1. **性能考虑**：缓存失效是异步操作，不会阻塞主流程
2. **容错性**：缓存失效失败只记录警告，不抛出错误
3. **一致性**：客户端和服务端缓存必须同时失效
4. **前缀匹配**：使用 `deleteByPrefix()` 时注意性能影响

## 未来改进

- [ ] 添加缓存预热机制
- [ ] 实现分布式缓存失效（Redis）
- [ ] 添加缓存命中率统计
- [ ] 实现缓存版本控制
- [ ] 添加智能缓存失效策略（基于访问频率）

---

**最后更新**：2026-02-10
