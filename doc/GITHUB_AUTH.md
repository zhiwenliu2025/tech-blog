# GitHub OAuth 认证文档

## 概述

本项目支持 GitHub OAuth 登录，用户可以使用 GitHub 账号快速注册和登录。

## 配置步骤

### 1. 创建 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **"New OAuth App"**
3. 填写应用信息：
   - **Application name**: 技术博客
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/auth/callback`
4. 点击 **"Register application"**
5. 复制 **Client ID** 和生成 **Client Secret**

### 2. 配置 Supabase

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择你的项目
3. 进入 **Authentication** > **Providers**
4. 找到 **GitHub**，启用它
5. 填入 GitHub OAuth App 的信息：
   - **Client ID**: 从 GitHub 复制
   - **Client Secret**: 从 GitHub 复制
6. 复制 **Callback URL**: `https://xxxxx.supabase.co/auth/v1/callback`
7. 回到 GitHub OAuth App 设置，更新 **Authorization callback URL**

### 3. 本地开发配置

**环境变量：** `.env`

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

**GitHub OAuth App 回调 URL（开发环境）：**

```
http://localhost:3000/auth/callback
```

## 实现代码

### 登录页面

**文件：** `pages/auth/login.vue`

```vue
<script setup lang="ts">
const { login } = useSupabase()
const loading = ref(false)

const handleGitHubLogin = async () => {
  loading.value = true
  try {
    await login('github')
  } catch (error) {
    console.error('GitHub login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <button @click="handleGitHubLogin" :disabled="loading">
      <icon name="simple-icons:github" />
      {{ loading ? '登录中...' : '使用 GitHub 登录' }}
    </button>
  </div>
</template>
```

### 回调页面

**文件：** `pages/auth/callback.vue`

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  // Supabase 自动处理回调
  // 检查认证状态
  const supabase = useSupabaseClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    // 登录成功，重定向到首页
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } else {
    // 登录失败，返回登录页
    router.push('/auth/login')
  }
})
</script>

<template>
  <div class="py-12 text-center">
    <p>正在处理登录...</p>
  </div>
</template>
```

### Composable

**文件：** `composables/useSupabase.ts`

```typescript
export function useSupabase() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const login = async (provider: 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigateTo('/auth/login')
  }

  return { user, login, logout }
}
```

## 用户资料处理

### 首次登录自动创建资料

**文件：** `plugins/init-profile.client.ts`

```typescript
export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  if (user.value) {
    // 检查用户资料是否存在
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.value.id)
      .single()

    if (!profile) {
      // 首次登录，创建资料
      await supabase.from('profiles').insert({
        id: user.value.id,
        username: user.value.user_metadata.user_name || user.value.email?.split('@')[0],
        full_name: user.value.user_metadata.full_name || user.value.user_metadata.name,
        avatar_url: user.value.user_metadata.avatar_url,
        email: user.value.email
      })
    }
  }
})
```

## 权限和功能

### GitHub 登录用户可以

- ✅ 浏览文章
- ✅ 点赞和评论
- ✅ 创建自己的博客文章
- ✅ 编辑和删除自己的文章
- ✅ 管理个人资料

### 注意事项

- GitHub 登录用户默认**不是管理员**
- 需要在数据库中手动设置 `is_admin` 字段

## 故障排除

### 问题 1：回调 URL 不匹配

**错误：** `redirect_uri_mismatch`

**解决：**

1. 检查 GitHub OAuth App 的回调 URL
2. 确保与 Supabase 的回调 URL 一致
3. 开发环境使用 `http://localhost:3000/auth/callback`
4. 生产环境使用 `https://your-domain.com/auth/callback`

### 问题 2：登录后重定向到错误页面

**原因：** 回调页面逻辑错误

**解决：**

1. 检查 `pages/auth/callback.vue`
2. 确保正确处理用户状态
3. 添加错误处理逻辑

### 问题 3：用户资料未创建

**原因：** 插件未正确执行

**解决：**

1. 检查 `plugins/init-profile.client.ts`
2. 查看浏览器控制台错误
3. 确认数据库权限配置（RLS）

### 问题 4：GitHub 授权范围不足

**错误：** 无法获取用户信息

**解决：**
在登录时指定授权范围：

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'read:user user:email',
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### 问题 5：开发环境回调失败

**原因：** HTTPS 要求

**解决：**

- Supabase 要求 HTTPS
- 本地开发可以使用 `http://localhost`（例外）
- 确保在 Supabase Dashboard 中启用了开发环境回调 URL

## 测试

### 本地测试

1. 启动开发服务器：`pnpm dev`
2. 访问登录页面：`http://localhost:3000/auth/login`
3. 点击 GitHub 登录按钮
4. 授权应用
5. 检查是否正确重定向
6. 验证用户资料是否创建

### 生产环境测试

1. 部署到 Vercel/Netlify
2. 更新 GitHub OAuth App 回调 URL
3. 更新 Supabase 授权域名
4. 测试登录流程

## 数据库 RLS 策略

确保以下 RLS 策略已配置：

```sql
-- 允许用户创建自己的资料
CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 允许用户更新自己的资料
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 允许所有人查看资料
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 允许用户创建文章
CREATE POLICY "Users can create posts"
ON blog_posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- 允许用户编辑自己的文章
CREATE POLICY "Users can update their own posts"
ON blog_posts FOR UPDATE
USING (auth.uid() = author_id);
```

## 安全建议

### 1. 保护敏感信息

- ❌ 不要在客户端暴露 Client Secret
- ✅ Client Secret 只在 Supabase 后台配置

### 2. 验证用户身份

```typescript
// 在服务端 API 中验证
export default defineEventHandler(async event => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  // 处理请求
})
```

### 3. 限制授权范围

只请求必要的 GitHub 权限：

```typescript
scopes: 'read:user user:email' // 不要请求 repo 等敏感权限
```

## 相关文件

- `pages/auth/login.vue` - 登录页面
- `pages/auth/callback.vue` - OAuth 回调
- `composables/useSupabase.ts` - 认证工具
- `plugins/init-profile.client.ts` - 自动创建资料
- `middleware/auth.ts` - 认证中间件

## 总结

GitHub OAuth 登录提供：

- ✅ 快速注册/登录流程
- ✅ 自动同步 GitHub 头像和信息
- ✅ 安全可靠的第三方认证
- ✅ 良好的用户体验

适合技术类博客，吸引开发者用户。
