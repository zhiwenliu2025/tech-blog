# Vercel 部署指南

## 环境变量配置

在 Vercel 部署时，需要在 Vercel 控制台配置以下环境变量：

### 必需的环境变量

1. **SUPABASE_URL**
   - 获取方式：登录 [Supabase Dashboard](https://supabase.com/dashboard)
   - 进入你的项目 → Settings → API
   - 复制 "Project URL"

2. **SUPABASE_KEY**
   - 获取方式：在同一个页面（Settings → API）
   - 复制 "anon" 或 "public" key（不是 service_role key）

3. **SUPABASE_SERVICE_KEY**（可选，用于服务端操作）
   - 获取方式：在同一个页面（Settings → API）
   - 复制 "service_role" key（⚠️ 注意：这个 key 有完整权限，请保密）

### 在 Vercel 中配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

5. 选择环境（Production、Preview、Development）
6. 点击 **Save**
7. 重新部署项目

### 验证环境变量

部署后，如果仍然出现 "URL and Key are required" 错误，请按以下步骤排查：

#### 步骤 1: 检查环境变量是否已设置

1. 在 Vercel Dashboard → Settings → Environment Variables
2. 确认以下变量都已添加：
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`（可选）

#### 步骤 2: 检查环境变量值

1. 确保 `SUPABASE_URL` 格式正确：
   - ✅ 正确：`https://xxxxx.supabase.co`
   - ❌ 错误：`https://xxxxx.supabase.co/`（末尾不要有斜杠）
   - ❌ 错误：`xxxxx.supabase.co`（缺少 https://）

2. 确保 `SUPABASE_KEY` 是 anon key（不是 service_role key）
   - 在 Supabase Dashboard → Settings → API
   - 复制 "anon public" 下的 key

3. 检查是否有多余的空格或换行符

#### 步骤 3: 检查环境变量作用域

确保为每个环境变量选择了正确的环境：

- **Production**: 生产环境
- **Preview**: 预览环境（Pull Request 部署）
- **Development**: 开发环境

建议：至少为 Production 和 Preview 都设置环境变量

#### 步骤 4: 重新部署

1. 保存环境变量后，必须重新部署
2. 在 Vercel Dashboard → Deployments
3. 找到最新的部署，点击 **⋯** → **Redeploy**
4. 或者推送新的 commit 触发自动部署

#### 步骤 5: 检查构建日志

1. 在 Vercel Dashboard → Deployments → 选择部署
2. 查看 **Build Logs**
3. 搜索 "SUPABASE" 关键词，查看是否有相关错误
4. 如果看到环境变量未定义的错误，说明环境变量没有正确传递

#### 步骤 6: 验证环境变量在运行时可用

如果问题仍然存在，可以在代码中临时添加调试日志（仅用于调试）：

```typescript
// 在 nuxt.config.ts 中临时添加（调试后删除）
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '已设置' : '未设置')
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '已设置' : '未设置')
```

**注意**：调试完成后请删除这些日志，避免泄露敏感信息。

### 常见问题

**Q: 为什么本地可以运行，但 Vercel 部署失败？**
A: 本地有 `.env` 文件，但 Vercel 需要手动配置环境变量。

**Q: 环境变量配置后还是报错？**
A: 需要重新部署项目，环境变量在构建时才会生效。

**Q: 如何查看 Vercel 构建日志？**
A: 在 Vercel Dashboard → Deployments → 选择部署 → 查看 Build Logs。

## 获取 Supabase 凭证的详细步骤

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（如果没有，先创建一个）
3. 点击左侧菜单的 **Settings**（齿轮图标）
4. 点击 **API**
5. 在 "Project API keys" 部分，你会看到：
   - **Project URL**: 这就是 `SUPABASE_URL`
   - **anon public**: 这就是 `SUPABASE_KEY`
   - **service_role** (需要点击 "Reveal" 显示): 这就是 `SUPABASE_SERVICE_KEY`

## 注意事项

- ⚠️ `SUPABASE_SERVICE_KEY` 具有完整权限，请勿在前端代码中使用
- ✅ `SUPABASE_KEY` (anon key) 可以安全地在前端使用
- ✅ 环境变量配置后，需要重新部署才能生效
