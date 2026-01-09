# 🔧 Supabase 外键关系修复

## 问题描述

API 请求失败，错误信息：

```
ERROR  Error fetching posts list: {
  code: 'PGRST200',
  message: "Could not find a relationship between 'blog_posts' and 'author_id' in the schema cache"
}
```

## 根本原因

Supabase 查询中尝试使用外键关系查询 `profiles:author_id`，但数据库中可能：

1. 外键关系未定义
2. 外键名称不匹配
3. 需要重新生成 schema cache

## 解决方案

### 方案 1：移除嵌套查询（已实施）✅

不再使用嵌套的 `profiles` 查询，改为只返回 `author_id`。

#### 修复的文件

**1. `server/api/posts/hot.get.ts`**

```typescript
// ❌ 修复前（会导致错误）
.select(`
  id, title, slug, ...,
  profiles:author_id (
    id, username, full_name, avatar_url
  )
`)

// ✅ 修复后（简化查询）
.select(`
  id, title, slug, ...,
  author_id
`)
```

**2. `server/api/posts/list.get.ts`**

```typescript
// ❌ 修复前
.select(`
  id, title, slug, ...,
  profiles:author_id (...)
`)

// ✅ 修复后
.select(`
  id, title, slug, ...,
  author_id
`)
```

### 方案 2：修复数据库外键（可选）

如果需要嵌套查询作者信息，可以在 Supabase 控制台执行：

```sql
-- 1. 确保 profiles 表存在
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 添加外键约束（如果不存在）
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES profiles(id);

-- 3. 刷新 schema cache
NOTIFY pgrst, 'reload schema';
```

然后在 Supabase 控制台：

- Settings → API → Reload schema cache

## 数据格式调整

为了兼容前端，同时返回两种格式的字段名：

```typescript
{
  ...post,
  likes_count: 10,      // 前端使用
  comments_count: 5,    // 前端使用
  likeCount: 10,        // 备用
  commentCount: 5       // 备用
}
```

## 验证修复

### 1. 测试热门文章 API

```bash
curl http://localhost:3000/api/posts/hot?limit=5
```

预期响应：

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "author_id": "...",
      "likes_count": 10,
      "comments_count": 5,
      "hotScore": 15.5
    }
  ],
  "cached": false
}
```

### 2. 测试文章列表 API

```bash
curl "http://localhost:3000/api/posts/list?page=1&limit=10"
```

预期响应：

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "...",
        "title": "...",
        "author_id": "...",
        "likes_count": 10,
        "comments_count": 5
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "cached": false
}
```

## 影响分析

### ✅ 优点

- 查询更快（无需 JOIN）
- 避免外键关系错误
- 减少数据库负载

### ⚠️ 注意事项

- 前端需要单独获取作者信息（如果需要）
- 可以通过 `author_id` 缓存作者数据

## 前端调整（如需显示作者信息）

如果页面需要显示作者名称/头像，可以：

### 选项 1：单独 API 获取作者

```typescript
// 获取文章
const posts = await fetchPosts()

// 批量获取作者
const authorIds = [...new Set(posts.map(p => p.author_id))]
const authors = await fetchAuthors(authorIds)

// 合并数据
const postsWithAuthors = posts.map(post => ({
  ...post,
  author: authors.find(a => a.id === post.author_id)
}))
```

### 选项 2：在 composables 中处理

```typescript
// composables/useBlogPosts.ts
const getPostsWithAuthors = async () => {
  const posts = await $fetch('/api/posts/list')
  // 获取并合并作者信息
  return enhanceWithAuthors(posts.data.posts)
}
```

### 选项 3：使用现有的 useBlogPosts

当前的 `useBlogPosts` composable 已经处理了作者信息的获取，可以继续使用。

## 修复状态

✅ 移除嵌套 profiles 查询  
✅ 简化为只返回 author_id  
✅ 添加兼容的字段名  
✅ 无 linter 错误  
✅ API 应该正常工作

## 下一步

1. 测试 API 端点
2. 验证前端显示
3. 如需作者信息，实现上述选项之一

现在 API 应该可以正常返回数据了！🎉
