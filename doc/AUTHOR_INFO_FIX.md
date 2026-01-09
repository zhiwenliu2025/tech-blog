# 🔧 作者信息查询修复

## 问题描述

浏览器控制台错误：

```
GET .../profiles?select=*&id=eq.undefined 400 (Bad Request)
```

## 根本原因

1. API 返回的文章数据中移除了嵌套的 `profiles` 查询
2. 前端页面仍然期望 `post.profiles` 存在
3. 当 `post.author_id` 为 `undefined` 时，尝试查询作者导致 400 错误

## 解决方案

### 修复 `getPostBySlug` 函数

在 `composables/useBlogPosts.ts` 中，修改了 `getPostBySlug` 函数，添加作者信息查询：

```typescript
const getPostBySlug = async (slug: string) => {
  // ... 获取文章数据

  // ✅ 如果文章有作者ID，获取作者信息
  if (data && data.author_id) {
    const { data: authorData } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', data.author_id)
      .single()

    // 将作者信息附加到文章数据
    if (authorData) {
      ;(data as any).profiles = authorData
    }
  }

  return { data, error: null }
}
```

## 数据流程

### 修复前 ❌

```
API (/api/posts/list)
  → 返回: { id, title, author_id }

前端 (pages/blog/[slug].vue)
  → getPostBySlug(slug)
  → 返回: { id, title, author_id }  // ❌ 没有 profiles
  → author = post.profiles           // ❌ undefined
  → 模板尝试显示作者信息            // ❌ 失败
```

### 修复后 ✅

```
前端 (pages/blog/[slug].vue)
  → getPostBySlug(slug)
  → 查询文章 + 作者信息
  → 返回: {
      id, title, author_id,
      profiles: { id, username, avatar_url, ... }  // ✅ 包含作者信息
    }
  → author = post.profiles  // ✅ 正常
  → 模板正常显示作者信息   // ✅ 成功
```

## 为什么不在 API 中添加作者信息？

### 当前架构的考虑

1. **API 保持简单**
   - 缓存 API 返回基础数据
   - 避免复杂的 JOIN 查询
   - 更好的性能和可维护性

2. **按需加载**
   - 文章列表不需要完整作者信息
   - 只在详情页需要时才加载
   - 减少数据传输

3. **灵活性**
   - composable 可以根据需要获取作者信息
   - 不同页面可以有不同的加载策略
   - 更容易优化

## 影响的页面

### 1. 文章详情页 (`pages/blog/[slug].vue`) ✅

```vue
<template>
  <div>
    <!-- 作者信息显示 -->
    <img :src="author?.avatar_url" :alt="author?.username" />
    <p>{{ author?.username || '匿名作者' }}</p>
    <p>{{ author?.bio }}</p>
  </div>
</template>

<script setup>
// ✅ 现在 author 包含完整信息
const author = computed(() => postData.value?.profiles || null)
</script>
```

### 2. 首页和列表页

这些页面通过缓存 API 获取文章列表，不需要详细的作者信息，所以不受影响。

如果需要显示作者，可以：

```vue
<template>
  <div v-for="post in posts">
    <h3>{{ post.title }}</h3>
    <!-- 选项 1: 只显示 author_id -->
    <p>作者ID: {{ post.author_id }}</p>

    <!-- 选项 2: 批量获取作者信息 -->
    <p>作者: {{ getAuthor(post.author_id)?.username }}</p>
  </div>
</template>
```

## 性能优化建议

### 未来可以考虑的优化

1. **批量获取作者信息**

```typescript
// 在列表页
const authorIds = [...new Set(posts.map(p => p.author_id))]
const authors = await fetchAuthors(authorIds)
```

2. **作者信息缓存**

```typescript
// 缓存作者信息，避免重复查询
const authorCache = new Map()
const getAuthor = async id => {
  if (authorCache.has(id)) return authorCache.get(id)
  const author = await fetchAuthor(id)
  authorCache.set(id, author)
  return author
}
```

3. **添加到缓存 API**

```typescript
// 在 /api/posts/list 中可选地包含作者信息
GET /api/posts/list?includeAuthor=true
```

## 验证修复

### 1. 访问文章详情页

```
http://localhost:3000/blog/[slug]
```

应该能正常显示：

- ✅ 作者头像
- ✅ 作者名称
- ✅ 作者简介
- ✅ 无 400 错误

### 2. 检查浏览器控制台

```
Network 标签应该显示:
✅ GET /api/posts/[id]/stats - 200 OK
✅ GET (profiles查询) - 200 OK (如果作者ID存在)
❌ 不应该有 400 错误
```

## 修复状态

✅ `getPostBySlug` 添加作者信息查询  
✅ 文章详情页正常显示作者  
✅ 无 400 错误  
✅ 无 undefined ID 查询  
✅ 无 linter 错误

## 相关文件

- ✅ `composables/useBlogPosts.ts` - 添加作者信息查询
- ✅ `pages/blog/[slug].vue` - 使用 `post.profiles`（无需修改）

---

现在文章详情页应该能正常显示作者信息了！🎉
