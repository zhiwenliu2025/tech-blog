# API 安全性改进文档

## 背景

本次改进针对项目中 Supabase 客户端权限使用不当的问题。之前多个 API 端点过度使用 `serverSupabaseServiceRole`（service_role key），这带来了潜在的安全风险。

## 问题分析

### 什么是 service_role？

`service_role key` 是 Supabase 提供的管理员级别密钥，具有：

- ✅ 绕过所有 RLS (Row Level Security) 策略的权限
- ✅ 完整的数据库读写权限
- ✅ 可以访问所有表的所有数据
- ⚠️ 如果泄露，可能导致整个数据库被完全控制

### 安全风险

使用 `service_role` 的风险包括：

1. **权限过高**：即使只需要读取公开数据，也拥有了完整的数据库权限
2. **绕过安全策略**：RLS 策略被完全忽略，无法依赖数据库层的安全保护
3. **难以审计**：无法区分哪些操作真正需要高权限
4. **潜在的数据泄露**：如果代码逻辑有漏洞，可能暴露敏感数据

## 改进内容

### 修改的文件列表

以下文件已从 `serverSupabaseServiceRole` 改为 `serverSupabaseClient`：

#### 1. 文章统计 API

- ✅ `server/api/posts/[id]/stats.get.ts` - 获取单个文章统计
- ✅ `server/api/posts/stats.get.ts` - 批量获取文章统计
- ✅ `server/api/posts/list.get.ts` - 获取文章列表
- ✅ `server/api/posts/hot.get.ts` - 获取热门文章

**原因**：这些 API 只读取已发布文章的公开数据（点赞数、评论数、阅读数），不需要特殊权限。

#### 2. 用户资料 API

- ✅ `server/api/profiles/[id].get.ts` - 获取单个用户资料
- ✅ `server/api/profiles/batch.get.ts` - 批量获取用户资料

**原因**：只读取用户的公开资料信息，不需要特殊权限。

### 保留 service_role 的文件

以下文件仍然使用 `serverSupabaseServiceRole`，因为它们需要特殊权限：

- ✅ `server/api/posts/[id]/increment-view.post.ts` - 增加文章阅读数

**原因**：

- 需要写入 `view_count` 字段
- 匿名用户（未登录）也需要能增加阅读数
- 如果使用普通客户端，需要配置 RLS 策略允许匿名写入，这不安全

## 技术细节

### serverSupabaseClient vs serverSupabaseServiceRole

| 特性     | serverSupabaseClient | serverSupabaseServiceRole |
| -------- | -------------------- | ------------------------- |
| 权限级别 | 普通用户             | 管理员（完整权限）        |
| RLS 策略 | ✅ 受 RLS 保护       | ❌ 绕过所有 RLS           |
| 使用场景 | 读取公开数据         | 管理操作、特殊写入        |
| 安全性   | ✅ 高                | ⚠️ 需谨慎使用             |
| API Key  | anon/public key      | service_role key          |

### 代码变更示例

**修改前（不安全）：**

```typescript
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async event => {
  // 使用 service_role - 权限过高！
  const client = serverSupabaseServiceRole(event)

  const { data } = await client.from('blog_posts').select('*') // 可以访问所有文章，包括未发布的
})
```

**修改后（安全）：**

```typescript
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async event => {
  // 使用普通客户端 - 受 RLS 保护
  const client = await serverSupabaseClient(event)

  const { data } = await client
    .from('blog_posts')
    .select('*') // 只能访问 RLS 允许的数据
    .eq('published', true) // 明确只查询已发布文章
})
```

## 配置建议

### 1. Supabase RLS 策略

确保在 Supabase 中配置了适当的 RLS 策略：

```sql
-- 允许所有人读取已发布的文章
CREATE POLICY "Public can view published posts"
ON blog_posts FOR SELECT
USING (published = true);

-- 允许所有人读取评论
CREATE POLICY "Public can view comments"
ON comments FOR SELECT
USING (true);

-- 允许所有人读取点赞
CREATE POLICY "Public can view likes"
ON likes FOR SELECT
USING (true);

-- 允许所有人读取用户公开资料
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true);
```

### 2. 使用 service_role 的准则

只在以下场景使用 `serverSupabaseServiceRole`：

1. **管理员操作**
   - 需要验证用户是管理员
   - 例如：删除任何用户的文章、管理用户权限

2. **绕过 RLS 的必要操作**
   - 有正当理由需要访问受保护的数据
   - 例如：统计所有用户数据（包括未发布的）

3. **系统级操作**
   - 自动化任务、数据迁移
   - 例如：定时清理过期数据

4. **特殊写入权限**
   - 匿名用户需要写入的场景
   - 例如：增加文章阅读数（但要严格限制可写入的字段）

### 3. 代码审查清单

在使用 `serverSupabaseServiceRole` 时，确保：

- [ ] 有明确的理由说明为什么需要 service_role
- [ ] 添加了适当的业务逻辑检查（如：验证用户权限）
- [ ] 限制了可访问/修改的字段
- [ ] 记录了安全相关的操作
- [ ] 考虑是否可以通过 RLS 策略替代

## 安全最佳实践

### 1. 最小权限原则

```typescript
// ❌ 不好：默认使用 service_role
const client = serverSupabaseServiceRole(event)

// ✅ 好：优先使用普通客户端
const client = await serverSupabaseClient(event)
// 只在确实需要时才使用 service_role
```

### 2. 明确查询条件

```typescript
// ❌ 不好：查询所有数据
const { data } = await client.from('blog_posts').select('*')

// ✅ 好：明确查询已发布的文章
const { data } = await client.from('blog_posts').select('*').eq('published', true)
```

### 3. 输入验证

```typescript
// ✅ 好：验证输入参数
const id = getRouterParam(event, 'id')
if (!id || !isValidUUID(id)) {
  throw createError({
    statusCode: 400,
    message: 'Invalid ID'
  })
}
```

### 4. 错误处理

```typescript
// ✅ 好：不泄露敏感信息
try {
  // ...
} catch (error: any) {
  console.error('Detailed error:', error) // 记录详细错误
  throw createError({
    statusCode: 500,
    message: 'Failed to fetch data' // 返回通用错误消息
  })
}
```

## 影响评估

### 功能影响

- ✅ **无功能影响**：所有 API 功能保持不变
- ✅ **性能影响**：无明显性能变化
- ✅ **兼容性**：完全向后兼容

### 安全改进

- ✅ **降低权限**：6 个 API 端点从管理员权限降级为普通权限
- ✅ **RLS 保护**：现在依赖数据库层的安全策略
- ✅ **审计友好**：清晰区分哪些操作需要特殊权限

### 测试建议

1. **功能测试**
   - 测试所有修改的 API 端点是否正常工作
   - 验证数据返回是否正确
   - 确认缓存功能正常

2. **权限测试**
   - 测试匿名用户是否只能访问公开数据
   - 测试登录用户的权限是否正确
   - 验证 RLS 策略是否生效

3. **性能测试**
   - 对比修改前后的响应时间
   - 检查数据库查询是否有性能问题

## 迁移步骤

如果你的项目也有类似问题，可以按以下步骤进行：

1. **识别问题**

   ```bash
   # 搜索所有使用 service_role 的地方
   grep -r "serverSupabaseServiceRole" server/api/
   ```

2. **分析每个使用场景**
   - 是否只读取公开数据？ → 改用 `serverSupabaseClient`
   - 是否需要写入权限？ → 评估是否可以通过 RLS 实现
   - 是否真正需要管理员权限？ → 保留 `service_role`，但添加额外检查

3. **配置 RLS 策略**
   - 在 Supabase Dashboard 配置适当的策略
   - 或在 SQL 文件中定义策略

4. **修改代码**
   - 替换为 `serverSupabaseClient`
   - 添加必要的过滤条件（如 `published = true`）

5. **测试验证**
   - 本地测试所有修改的端点
   - 部署到测试环境验证
   - 生产环境灰度发布

## 相关文档

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Nuxt Supabase Module](https://supabase.nuxtjs.org/)

## 总结

本次安全改进：

- 🔒 **降低了 6 个 API 端点的权限级别**
- 🛡️ **增强了数据访问的安全性**
- 📝 **提高了代码的可维护性**
- ✅ **没有功能和性能损失**

这是一个遵循"最小权限原则"的良好实践，建议在所有新代码中都采用这种模式。
