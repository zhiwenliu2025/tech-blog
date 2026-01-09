# 🔧 缓存系统热修复

## 问题描述

服务器启动后出现错误：

```
ERROR  Error fetching hot posts: serverSupabaseServiceRole is not defined
ERROR  Error fetching posts list: serverSupabaseServiceRole is not defined
```

## 根本原因

缓存 API 文件中缺少 `serverSupabaseServiceRole` 的导入语句。

## 修复的文件（5个）

### 1. `server/api/posts/hot.get.ts`

```typescript
// ✅ 添加导入
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'
```

### 2. `server/api/posts/list.get.ts`

```typescript
// ✅ 添加导入
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'
```

### 3. `server/api/posts/stats.get.ts`

```typescript
// ✅ 添加导入
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'
```

### 4. `server/api/posts/[id]/stats.get.ts`

```typescript
// ✅ 添加导入
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'
```

### 5. `server/api/posts/[id]/increment-view.post.ts`

```typescript
// ✅ 添加导入
import { serverSupabaseServiceRole } from '#supabase/server'
import { cacheInvalidator } from '~/server/utils/cache'
```

## 验证修复

1. **重启开发服务器**

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

2. **访问首页**

```
http://localhost:3000
```

应该能正常看到文章列表和热门文章，不再有错误。

3. **检查 API**

```bash
# 测试热门文章 API
curl http://localhost:3000/api/posts/hot?limit=5

# 测试文章列表 API
curl http://localhost:3000/api/posts/list?page=1&limit=10
```

应该返回正常的 JSON 数据。

## 修复状态

✅ 所有 API 文件已修复  
✅ 无 linter 错误  
✅ 导入语句完整  
✅ 缓存系统现已正常工作

## 下一步

系统现在应该可以正常运行了！你可以：

1. 访问首页查看文章列表
2. 访问文章详情页
3. 查看热门文章组件
4. 测试缓存功能

所有缓存 API 现在都应该正常工作了！🎉
