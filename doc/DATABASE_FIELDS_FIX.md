# 🔧 数据库字段修复总结

## 修复的问题

### 错误 1: `read_time` 字段不存在

```
ERROR: column blog_posts.read_time does not exist
```

**原因：** 数据库表中没有 `read_time` 列

**修复：** 从 API 查询中移除了 `read_time` 字段

**修复的文件：**

- ✅ `server/api/posts/list.get.ts`

---

## 当前 API 查询字段

### 文章列表 API (`/api/posts/list`)

```typescript
select(`
  id,
  title,
  slug,
  excerpt,
  cover_image,
  view_count,
  published,
  published_at,
  created_at,
  category,
  tags,
  author_id
`)
```

### 热门文章 API (`/api/posts/hot`)

```typescript
select(`
  id,
  title,
  slug,
  excerpt,
  cover_image,
  view_count,
  published_at,
  category,
  tags,
  author_id
`)
```

---

## 返回的数据格式

```typescript
{
  success: true,
  data: {
    posts: [
      {
        id: "uuid",
        title: "文章标题",
        slug: "article-slug",
        excerpt: "文章摘要",
        cover_image: "https://...",
        view_count: 100,
        published: true,
        published_at: "2024-01-01T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
        category: "技术",
        tags: ["Vue", "Nuxt"],
        author_id: "uuid",
        likes_count: 10,      // API 添加
        comments_count: 5,    // API 添加
        likeCount: 10,       // 兼容格式
        commentCount: 5      // 兼容格式
      }
    ],
    total: 50,
    page: 1,
    limit: 10,
    totalPages: 5
  },
  cached: false
}
```

---

## 如需添加 read_time 字段

如果将来需要阅读时间功能，可以：

### 选项 1：添加数据库列

```sql
-- 在 Supabase SQL Editor 中执行
ALTER TABLE blog_posts
ADD COLUMN read_time INTEGER DEFAULT 5;

-- 更新现有文章的阅读时间（基于内容长度）
UPDATE blog_posts
SET read_time = GREATEST(1, LENGTH(content) / 200);
```

然后在 API 查询中添加：

```typescript
select(`
  ...,
  read_time
`)
```

### 选项 2：前端计算（当前方案）✅

在前端根据内容长度动态计算：

```typescript
// pages/blog/[slug].vue 已实现
const readTime = computed(() => {
  if (!post.value?.content) return 0
  const wordsPerMinute = 200
  const text = post.value.content.replace(/<[^>]*>/g, '')
  const wordCount = text.length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})
```

---

## 修复状态

✅ 移除 `read_time` 字段  
✅ 移除 `profiles:author_id` 嵌套查询  
✅ 无 linter 错误  
✅ API 查询简化，性能更好  
✅ 缓存系统正常工作

---

## 测试验证

```bash
# 测试文章列表
curl http://localhost:3000/api/posts/list?page=1&limit=10

# 测试热门文章
curl http://localhost:3000/api/posts/hot?limit=5

# 测试缓存统计
curl http://localhost:3000/api/cache/stats
```

所有 API 现在应该正常工作了！🎉

---

## 数据库表结构参考

基于当前查询，`blog_posts` 表应该包含以下列：

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  view_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  category TEXT,
  tags TEXT[],
  author_id UUID REFERENCES profiles(id)
);
```

---

## 下一步

系统现在已经完全就绪：

- ✅ 所有导入修复
- ✅ 外键关系简化
- ✅ 数据库字段对齐
- ✅ 缓存系统工作
- ✅ 页面组件使用缓存API

**可以正常使用了！** 🚀
