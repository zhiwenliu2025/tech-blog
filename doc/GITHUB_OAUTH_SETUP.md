# GitHub OAuth 登录配置指南

本文档说明如何在 Supabase 中配置 GitHub OAuth 登录功能。

## 前置条件

1. 拥有一个 GitHub 账户
2. 拥有一个 Supabase 项目
3. 应用已部署或可在本地访问（用于配置回调 URL）

## 步骤 1: 在 GitHub 创建 OAuth App

1. 登录 GitHub，进入 **Settings** → **Developer settings** → **OAuth Apps**
2. 点击 **New OAuth App** 按钮
3. 填写以下信息：
   - **Application name**: 你的应用名称（例如：技术博客）
   - **Homepage URL**: 你的应用 URL
     - 开发环境：`http://localhost:3000`
     - 生产环境：你的实际域名（例如：`https://yourdomain.com`）
   - **Authorization callback URL**:
     - 开发环境：`http://localhost:3000/auth/callback`
     - 生产环境：`https://yourdomain.com/auth/callback`
     - ⚠️ **重要**：这个 URL 必须与代码中使用的 `redirectTo` **完全匹配**（包括协议、域名、端口、路径）
     - ⚠️ **注意**：不要添加尾随斜杠（`/auth/callback/` ❌），必须是 `/auth/callback` ✅
4. 点击 **Register application**
5. **重要**：复制 **Client ID** 和 **Client Secret**（稍后需要在 Supabase 中使用）

### ⚠️ 常见错误

如果遇到 "The redirect_uri is not associated with this application" 错误，请检查：

1. **URL 必须完全匹配**（包括协议 `http://` 或 `https://`）
2. **不能有多余的尾随斜杠**
3. **端口号必须匹配**（开发环境通常是 3000）
4. **路径必须是 `/auth/callback`**（不是 `/callback` 或其他）

详细排查步骤请参考：[GitHub OAuth 故障排除指南](./GITHUB_OAUTH_TROUBLESHOOTING.md)

## 步骤 2: 在 Supabase 中配置 GitHub Provider

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **Providers**
4. 找到 **GitHub** 并点击启用
5. 填写以下信息：
   - **Client ID (for OAuth)**: 从 GitHub 复制的 Client ID
   - **Client Secret (for OAuth)**: 从 GitHub 复制的 Client Secret
6. 点击 **Save**

## 步骤 3: 配置 Supabase 重定向 URL

1. 在 Supabase Dashboard 中，进入 **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 中添加以下 URL：
   - 开发环境：`http://localhost:3000/auth/callback`
   - 生产环境：`https://yourdomain.com/auth/callback`
3. 点击 **Save**

## 步骤 4: 配置环境变量（可选）

确保你的 `.env` 文件中包含正确的应用 URL：

```env
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

生产环境应设置为：

```env
NUXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 步骤 5: 测试 GitHub 登录

1. 启动开发服务器：`pnpm dev`
2. 访问登录页面：`http://localhost:3000/auth/login`
3. 点击 **使用 GitHub 登录** 按钮
4. 应该会跳转到 GitHub 授权页面
5. 授权后，应该会重定向回应用并自动登录

## 常见问题

### 1. 重定向 URL 不匹配

**错误信息**：`redirect_uri_mismatch`

**解决方案**：

- 确保 GitHub OAuth App 中的 **Authorization callback URL** 与 Supabase 中的 **Redirect URLs** 完全匹配
- 确保 URL 包含协议（`http://` 或 `https://`）
- 确保 URL 末尾没有斜杠（除非必要）

### 2. 客户端 ID 或密钥错误

**错误信息**：`invalid_client`

**解决方案**：

- 检查 Supabase 中配置的 Client ID 和 Client Secret 是否正确
- 确保从 GitHub 复制的值没有多余的空格

### 3. 回调页面显示错误

**解决方案**：

- 检查 Supabase 项目设置中的 **Site URL** 是否正确
- 确保回调页面路由 `/auth/callback` 存在且可访问

### 4. 登录后没有创建用户资料

**解决方案**：

- 检查数据库中的 `profiles` 表是否有相应的触发器或函数自动创建用户资料
- 如果没有，可能需要手动创建或添加数据库触发器

## 安全建议

1. **不要**将 Client Secret 提交到代码仓库
2. 使用环境变量存储敏感信息
3. 在生产环境中使用 HTTPS
4. 定期轮换 OAuth 密钥
5. 限制 GitHub OAuth App 的权限范围（只请求必要的权限）

## 相关文件

- `composables/useSupabase.ts` - GitHub OAuth 登录实现
- `pages/auth/login.vue` - 登录页面（包含 GitHub 登录按钮）
- `pages/auth/callback.vue` - OAuth 回调处理页面

## 参考链接

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Supabase GitHub Provider 配置](https://supabase.com/docs/guides/auth/social-login/auth-github)
