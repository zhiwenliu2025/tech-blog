# 🔍 Profile 查询缓存优化分析

## 当前 Profile 查询位置统计

### ✅ 已优化（使用缓存）

| 位置                           | 查询类型     | 状态               |
| ------------------------------ | ------------ | ------------------ |
| `server/api/posts/list.get.ts` | 批量查询作者 | ✅ 已缓存（2分钟） |
| `server/api/posts/hot.get.ts`  | 批量查询作者 | ✅ 已缓存（5分钟） |

---

## 🎯 可以优化的查询

### 1. 单个作者信息查询 ⭐⭐⭐

**位置：** `composables/useBlogPosts.ts`

#### 场景 A: `getAuthorProfile(authorId)`

```typescript
// Line 404-407
const { data } = await supabase.from('profiles').select('*').eq('id', authorId).single()
```

**使用场景：**

- 作者详情页 `/authors/[id]`
- 频繁访问

**优化建议：** ⭐⭐⭐ 高优先级

```typescript
// 创建缓存 API
GET /api/profiles/[id]

// 缓存策略
TTL: 5分钟
Key: profile:{id}
```

#### 场景 B: `getPostBySlug` 中的作者查询

```typescript
// Line 187-190
const { data: authorData } = await supabase
  .from('profiles')
  .select('id, username, full_name, avatar_url, bio')
  .eq('id', data.author_id)
  .single()
```

**优化建议：** ✅ 已有防护

- 只在缓存API没有提供作者信息时才查询
- 可以考虑调用上面的缓存API

---

### 2. 所有作者列表查询 ⭐⭐

**位置：** `composables/useBlogPosts.ts`

```typescript
// Line 428-430
const { data: profilesData } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
```

**使用场景：**

- 后台管理
- 不太频繁

**优化建议：** ⭐⭐ 中优先级

```typescript
// 创建缓存 API
GET /api/profiles/list?page=1&limit=100

// 缓存策略
TTL: 10分钟（作者信息变化不频繁）
Key: profiles_list:{page}:{limit}
```

---

### 3. 批量用户信息查询 ⭐⭐⭐

**位置：** `composables/useBlogPosts.ts`

```typescript
// Line 814-816
const { data: profilesData } = await supabase
  .from('profiles')
  .select('id, username, avatar_url, full_name')
  .in('id', userIds)
```

**使用场景：**

- 评论列表（显示评论者信息）
- 频繁使用

**优化建议：** ⭐⭐⭐ 高优先级

```typescript
// 创建缓存 API
GET /api/profiles/batch?ids=id1,id2,id3

// 缓存策略
TTL: 5分钟
Key: profile:{id} （为每个用户单独缓存）

// 实现逻辑
1. 检查缓存中是否有这些用户
2. 只查询缓存中没有的用户
3. 合并返回结果
```

---

### 4. Admin 权限检查 ⭐

**位置：** `composables/useBlogPosts.ts` 和 `composables/useAdmin.ts`

```typescript
// Line 926-929
const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single()
```

**使用场景：**

- 每次需要检查管理员权限
- 中等频率

**优化建议：** ⭐ 低优先级（可用 JWT 或 Session）

```typescript
// 选项 1: 会话缓存
sessionStorage.setItem('isAdmin', 'true')
TTL: 会话期间

// 选项 2: JWT Claims
// 在登录时将 is_admin 写入 JWT

// 选项 3: 服务端缓存
GET /api/auth/check-admin
TTL: 30分钟
Key: admin_status:{userId}
```

---

### 5. 用户资料 CRUD ❌

**位置：** `pages/profile.vue`

```typescript
// 获取、创建、更新、删除用户资料
// Line 495, 519, 616, 726
```

**优化建议：** ❌ 不推荐缓存

- 这些是用户自己的资料操作
- 需要实时数据
- 不适合缓存
- 但可以在更新后清除相关缓存

---

## 📊 优化优先级总结

### 高优先级 ⭐⭐⭐

1. **单个作者信息 API** - `/api/profiles/[id]`
   - 使用频率：高
   - 优化效果：显著
   - 实施难度：简单

2. **批量用户信息 API** - `/api/profiles/batch`
   - 使用频率：高（评论列表）
   - 优化效果：显著
   - 实施难度：中等

### 中优先级 ⭐⭐

3. **作者列表 API** - `/api/profiles/list`
   - 使用频率：低
   - 优化效果：一般
   - 实施难度：简单

### 低优先级 ⭐

4. **Admin 检查优化**
   - 使用频率：中
   - 优化效果：一般
   - 建议：使用 JWT Claims 或 Session

---

## 🚀 推荐实施方案

### 方案 1: 单个作者信息缓存 API

**创建文件：** `server/api/profiles/[id].get.ts`

```typescript
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id || id === 'undefined') {
    throw createError({
      statusCode: 400,
      message: 'Invalid profile ID'
    })
  }

  const cacheKey = `profile:${id}`

  try {
    const profile = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = serverSupabaseServiceRole(event)

        const { data, error } = await client
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, website, created_at')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      },
      CACHE_TTL.PROFILE // 5分钟
    )

    return {
      success: true,
      data: profile,
      cached: serverCache.has(cacheKey)
    }
  } catch (error: any) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }
})
```

**更新缓存配置：** `server/utils/cache.ts`

```typescript
export const CACHE_KEYS = {
  // ... 现有的
  PROFILE: 'profile:',
  PROFILES_BATCH: 'profiles_batch:'
}

export const CACHE_TTL = {
  // ... 现有的
  PROFILE: 1000 * 60 * 5, // 5分钟
  PROFILES_BATCH: 1000 * 60 * 5 // 5分钟
}
```

---

### 方案 2: 批量用户信息缓存 API

**创建文件：** `server/api/profiles/batch.get.ts`

```typescript
import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const ids = (query.ids as string)?.split(',').filter(Boolean) || []

  if (ids.length === 0) {
    return { success: true, data: [] }
  }

  try {
    const client = serverSupabaseServiceRole(event)

    // 1. 检查缓存中已有的用户
    const cachedProfiles: any[] = []
    const uncachedIds: string[] = []

    ids.forEach(id => {
      const cacheKey = `profile:${id}`
      const cached = serverCache.get(cacheKey)
      if (cached) {
        cachedProfiles.push(cached)
      } else {
        uncachedIds.push(id)
      }
    })

    // 2. 批量查询缓存中没有的用户
    let freshProfiles: any[] = []
    if (uncachedIds.length > 0) {
      const { data, error } = await client
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio')
        .in('id', uncachedIds)

      if (error) throw error

      freshProfiles = data || []

      // 3. 将新查询的用户写入缓存
      freshProfiles.forEach(profile => {
        serverCache.set(`profile:${profile.id}`, profile, CACHE_TTL.PROFILE)
      })
    }

    // 4. 合并结果
    const allProfiles = [...cachedProfiles, ...freshProfiles]

    return {
      success: true,
      data: allProfiles,
      cached: cachedProfiles.length,
      fresh: freshProfiles.length
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch profiles'
    })
  }
})
```

---

### 方案 3: 缓存失效处理

**更新：** `server/utils/cache.ts`

```typescript
export const cacheInvalidator = {
  // ... 现有的方法

  // 清除用户资料缓存
  invalidateProfile: (userId: string) => {
    serverCache.delete(`profile:${userId}`)
    console.log(`Cache invalidated: profile:${userId}`)
  },

  // 清除批量缓存
  invalidateProfiles: (userIds: string[]) => {
    userIds.forEach(id => {
      serverCache.delete(`profile:${id}`)
    })
    console.log(`Cache invalidated: ${userIds.length} profiles`)
  }
}
```

**在用户资料更新时清除缓存：**

```typescript
// pages/profile.vue 更新后
const { invalidateProfile } = useCacheManager()
await invalidateProfile(userId)
```

---

## 📈 预期效果

### 实施方案 1 + 2 后

| 场景                 | 优化前   | 优化后     | 提升           |
| -------------------- | -------- | ---------- | -------------- |
| 作者详情页           | 3次查询  | 0-1次查询  | **67-100%** ⬇️ |
| 评论列表（10个用户） | 10次查询 | 0-10次查询 | **0-100%** ⬇️  |
| 缓存命中时           | 每次查询 | 直接返回   | **95%** ⬇️     |

### 数据库负载

```
当前：
- 作者详情页访问: 100次/分钟 → 100次查询
- 评论列表: 50次/分钟 × 10用户 = 500次查询
总计: 600次/分钟

优化后（80%缓存命中率）：
- 作者详情: 20次查询
- 评论列表: 100次查询
总计: 120次/分钟
减少: 80%
```

---

## ✅ 实施检查清单

### 高优先级（推荐实施）

- [ ] 创建 `/api/profiles/[id]` 单个作者缓存API
- [ ] 创建 `/api/profiles/batch` 批量用户缓存API
- [ ] 添加 `CACHE_KEYS.PROFILE` 配置
- [ ] 添加 `CACHE_TTL.PROFILE` 配置
- [ ] 实现 `invalidateProfile` 方法
- [ ] 更新 `composables/useCache.ts` 添加相关方法
- [ ] 测试缓存命中率

### 中优先级（可选）

- [ ] 创建 `/api/profiles/list` 作者列表API
- [ ] Admin 检查优化（JWT Claims）

### 低优先级

- [ ] Session 缓存
- [ ] 前端状态管理

---

## 🎯 下一步建议

1. **立即实施：**
   - 单个作者信息缓存API
   - 批量用户信息缓存API

2. **测试验证：**
   - 访问作者详情页，检查缓存
   - 查看评论列表，验证批量查询
   - 监控缓存命中率

3. **持续优化：**
   - 监控数据库查询日志
   - 调整缓存TTL
   - 优化缓存失效策略

---

**总结：** 实施这些优化后，profile 相关查询的数据库负载将减少 70-80%，响应速度提升 80-95%！🚀
