# GitHub OAuth 重定向 URL 错误排查指南

## 错误信息

```
The redirect_uri is not associated with this application.
The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.
```

## 问题原因

这个错误表示 GitHub OAuth App 中配置的 **Authorization callback URL** 与代码中实际使用的 `redirectTo` URL **不匹配**。

## 解决步骤

### 步骤 1: 检查代码中使用的 redirectTo URL

代码中使用的回调 URL 格式为：`{appUrl}/auth/callback`

其中 `appUrl` 的获取优先级：

1. 环境变量 `NUXT_PUBLIC_APP_URL`
2. 浏览器当前页面的 `window.location.origin`
3. 默认值 `http://localhost:3000`

**检查方法：**

1. 打开浏览器开发者工具（F12）
2. 在控制台中运行：
   ```javascript
   console.log(window.location.origin)
   ```
3. 记录显示的 URL（例如：`http://localhost:3000` 或 `https://yourdomain.com`）

### 步骤 2: 检查 GitHub OAuth App 配置

1. 登录 GitHub，进入 **Settings** → **Developer settings** → **OAuth Apps**
2. 找到你的 OAuth App 并点击 **Edit**
3. 检查 **Authorization callback URL** 字段

**重要检查点：**

- ✅ URL 必须**完全匹配**（包括协议、域名、路径）
- ✅ 不能有多余的尾随斜杠（`/auth/callback/` ❌）
- ✅ 必须包含协议（`http://` 或 `https://`）
- ✅ 路径必须是 `/auth/callback`（不是 `/auth/callback/`）

### 步骤 3: 修复配置

#### 情况 A: 本地开发环境

如果你的应用运行在 `http://localhost:3000`：

1. **在 GitHub OAuth App 中配置：**

   ```
   Authorization callback URL: http://localhost:3000/auth/callback
   ```

2. **确保 `.env` 文件中有：**

   ```env
   NUXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **在 Supabase Dashboard 中配置：**
   - 进入 **Authentication** → **URL Configuration**
   - 在 **Redirect URLs** 中添加：`http://localhost:3000/auth/callback`

#### 情况 B: 生产环境

如果你的应用部署在 `https://yourdomain.com`：

1. **在 GitHub OAuth App 中配置：**

   ```
   Authorization callback URL: https://yourdomain.com/auth/callback
   ```

2. **确保环境变量中有：**

   ```env
   NUXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **在 Supabase Dashboard 中配置：**
   - 进入 **Authentication** → **URL Configuration**
   - 在 **Redirect URLs** 中添加：`https://yourdomain.com/auth/callback`

#### 情况 C: 需要支持多个环境

如果你需要同时支持开发和生产环境，可以：

**方案 1: 创建多个 GitHub OAuth App（推荐）**

- 创建一个用于开发环境（`http://localhost:3000`）
- 创建一个用于生产环境（`https://yourdomain.com`）
- 在不同环境中使用不同的 Client ID 和 Secret

**方案 2: 在同一个 OAuth App 中添加多个回调 URL**

- GitHub OAuth Apps 支持添加多个回调 URL
- 在 **Authorization callback URL** 字段中，每行一个 URL：
  ```
  http://localhost:3000/auth/callback
  https://yourdomain.com/auth/callback
  ```

### 步骤 4: 验证配置

1. **保存 GitHub OAuth App 配置**
2. **等待几秒钟**（GitHub 配置可能需要几秒生效）
3. **清除浏览器缓存和 Cookie**
4. **重新尝试登录**

## 常见错误配置示例

### ❌ 错误 1: 缺少协议

```
localhost:3000/auth/callback
```

**正确：**

```
http://localhost:3000/auth/callback
```

### ❌ 错误 2: 多余的尾随斜杠

```
http://localhost:3000/auth/callback/
```

**正确：**

```
http://localhost:3000/auth/callback
```

### ❌ 错误 3: 路径不匹配

```
http://localhost:3000/callback
http://localhost:3000/auth
```

**正确：**

```
http://localhost:3000/auth/callback
```

### ❌ 错误 4: 大小写不匹配（虽然通常不敏感，但建议保持一致）

```
http://localhost:3000/Auth/Callback
```

**正确：**

```
http://localhost:3000/auth/callback
```

### ❌ 错误 5: 端口号不匹配

```
http://localhost:3000/auth/callback  # 代码中使用 3000
http://localhost:8080/auth/callback   # GitHub 中配置 8080
```

**必须完全匹配！**

## 调试技巧

### 1. 检查实际使用的 redirectTo URL

在 `composables/useSupabase.ts` 中添加日志：

```javascript
const signInWithGitHub = async () => {
  // ... 现有代码 ...

  const appUrl =
    config.public.appUrl || (process.client ? window.location.origin : 'http://localhost:3000')
  const redirectTo = `${appUrl}/auth/callback`

  console.log('GitHub OAuth redirectTo:', redirectTo) // 添加这行

  const { data, error: authError } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectTo
    }
  })

  // ... 其余代码 ...
}
```

### 2. 检查 GitHub OAuth App 配置

在 GitHub OAuth App 设置页面，确认：

- **Application name**: 你的应用名称
- **Homepage URL**: 你的应用主页 URL
- **Authorization callback URL**: **必须与代码中的 redirectTo 完全匹配**

### 3. 检查 Supabase 配置

在 Supabase Dashboard 中：

1. **Authentication** → **Providers** → **GitHub**
   - 确认 Client ID 和 Secret 正确
   - 确认 GitHub Provider 已启用

2. **Authentication** → **URL Configuration**
   - 确认 **Site URL** 正确
   - 确认 **Redirect URLs** 中包含回调 URL

## 完整配置检查清单

- [ ] GitHub OAuth App 的 **Authorization callback URL** 与代码中的 `redirectTo` 完全匹配
- [ ] URL 包含正确的协议（`http://` 或 `https://`）
- [ ] URL 没有多余的尾随斜杠
- [ ] 环境变量 `NUXT_PUBLIC_APP_URL` 已正确设置（如果使用）
- [ ] Supabase Dashboard 中的 **Redirect URLs** 已配置
- [ ] GitHub OAuth App 的 Client ID 和 Secret 已正确配置到 Supabase
- [ ] 已清除浏览器缓存和 Cookie
- [ ] 已等待几秒钟让配置生效

## 如果问题仍然存在

1. **检查网络环境**
   - 确认没有代理或防火墙阻止重定向
   - 尝试使用不同的网络环境

2. **检查 Supabase 日志**
   - 在 Supabase Dashboard 中查看 Authentication 日志
   - 查看是否有相关错误信息

3. **重新创建 OAuth App**
   - 如果配置多次修改后仍有问题，可以尝试删除并重新创建 OAuth App

4. **联系支持**
   - 如果以上步骤都无法解决问题，可以：
     - 查看 [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
     - 查看 [Supabase Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-github)

## 相关文件

- `composables/useSupabase.ts` - GitHub OAuth 登录实现
- `pages/auth/callback.vue` - OAuth 回调处理页面
- `doc/GITHUB_OAUTH_SETUP.md` - 初始配置指南
