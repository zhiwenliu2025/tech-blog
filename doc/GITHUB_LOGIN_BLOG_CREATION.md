# GitHub 登录用户创建博客说明

## 概述

**是的，GitHub 登录的用户完全可以创建博客！** 本系统已经完整支持通过 GitHub OAuth 登录的用户创建和管理博客文章。

## 功能支持

### ✅ 已支持的功能

1. **GitHub OAuth 登录**
   - 用户可以通过 GitHub 账户登录
   - 自动创建用户资料（profiles）
   - 自动获取 GitHub 用户信息（用户名、头像、全名等）

2. **创建博客文章**
   - GitHub 登录用户可以访问 `/blog/create` 页面
   - 可以创建新的博客文章
   - 支持保存为草稿或立即发布

3. **管理博客文章**
   - 可以编辑自己创建的文章
   - 可以删除自己创建的文章
   - 可以查看自己的所有文章（包括草稿）

4. **用户资料管理**
   - 自动同步 GitHub 用户信息（头像、用户名等）
   - 可以编辑个人资料

## 工作流程

### 1. 用户登录流程

```
用户点击 "使用 GitHub 登录"
    ↓
跳转到 GitHub 授权页面
    ↓
用户授权后返回应用
    ↓
Supabase 自动创建 auth.users 记录
    ↓
数据库触发器自动创建 profiles 记录
    ↓
客户端插件检查并补充用户信息（头像、全名等）
    ↓
登录完成，用户可以使用所有功能
```

### 2. 创建博客流程

```
GitHub 登录用户访问 /blog/create
    ↓
auth 中间件检查用户是否登录
    ↓
如果已登录，显示创建页面
    ↓
用户填写文章信息并提交
    ↓
系统获取用户ID（user.id）
    ↓
创建 blog_posts 记录，author_id = 用户ID
    ↓
数据库 RLS 策略验证权限
    ↓
文章创建成功
```

## 权限说明

### 数据库权限策略（RLS）

系统使用 Supabase 的行级安全策略（RLS）来控制权限：

1. **查看文章**
   - 所有人可以查看已发布的文章
   - 用户只能查看自己的草稿
   - 管理员可以查看所有文章

2. **创建文章**
   - 任何已认证用户（包括 GitHub 登录用户）都可以创建文章
   - 策略：`auth.uid() = author_id`

3. **编辑文章**
   - 用户只能编辑自己创建的文章
   - 管理员可以编辑所有文章

4. **删除文章**
   - 用户只能删除自己创建的文章
   - 管理员可以删除所有文章

## 用户信息处理

### GitHub OAuth 用户信息映射

当用户通过 GitHub 登录时，Supabase 会在 `user_metadata` 中包含以下信息：

| GitHub 信息  | Supabase 字段              | Profiles 表字段 |
| ------------ | -------------------------- | --------------- |
| `user_name`  | `user_metadata.user_name`  | `username`      |
| `full_name`  | `user_metadata.full_name`  | `full_name`     |
| `avatar_url` | `user_metadata.avatar_url` | `avatar_url`    |
| `email`      | `email`                    | -               |

### 自动创建用户资料

系统会在以下情况下自动创建或更新用户资料：

1. **首次登录时**
   - 数据库触发器自动创建 profiles 记录
   - 客户端插件补充 GitHub 用户信息

2. **后续登录时**
   - 如果用户资料缺少 GitHub 信息（如头像），会自动更新

## 使用示例

### 1. 登录并创建博客

```javascript
// 1. 用户通过 GitHub 登录
const { signInWithGitHub } = useSupabaseAuth()
await signInWithGitHub()

// 2. 登录成功后，访问创建页面
navigateTo('/blog/create')

// 3. 填写文章信息并提交
// 系统会自动使用当前登录用户的 ID 作为 author_id
```

### 2. 检查用户登录状态

```javascript
const { user } = useSupabaseAuth()

if (user.value) {
  // 用户已登录，可以创建博客
  console.log('用户ID:', user.value.id)
  console.log('用户名:', user.value.user_metadata?.user_name)
} else {
  // 用户未登录，需要先登录
  navigateTo('/auth/login')
}
```

## 常见问题

### Q1: GitHub 登录后为什么看不到创建博客的按钮？

**A:** 请检查：

1. 是否成功登录（检查浏览器控制台是否有错误）
2. 用户资料是否已创建（检查 `profiles` 表）
3. 导航菜单是否正确显示登录状态

### Q2: GitHub 登录后创建博客时提示"无法获取用户ID"？

**A:** 这通常是因为：

1. 用户资料未正确创建
2. 用户对象结构异常

**解决方案：**

- 检查 `plugins/init-profile.client.ts` 是否正常运行
- 检查数据库触发器是否正常工作
- 查看浏览器控制台的错误信息

### Q3: GitHub 用户的头像和用户名没有显示？

**A:** 系统会自动从 GitHub 获取这些信息，但可能需要：

1. 等待几秒钟让插件完成同步
2. 刷新页面
3. 如果仍未显示，可以手动编辑个人资料

### Q4: GitHub 登录用户和邮箱登录用户有什么区别？

**A:** 功能上完全相同，区别仅在于：

- GitHub 登录用户会自动获取 GitHub 头像和用户名
- 邮箱登录用户需要手动设置头像和用户名

## 技术细节

### 相关文件

- `pages/auth/login.vue` - 登录页面（包含 GitHub 登录按钮）
- `pages/auth/callback.vue` - OAuth 回调处理
- `pages/blog/create.vue` - 创建博客页面
- `middleware/auth.ts` - 认证中间件
- `plugins/init-profile.client.ts` - 用户资料自动创建插件
- `composables/useSupabase.ts` - Supabase 认证组合函数
- `supabase/schema.sql` - 数据库结构和 RLS 策略

### 数据库表结构

```sql
-- profiles 表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- blog_posts 表
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 总结

GitHub 登录用户拥有与邮箱登录用户完全相同的权限和功能，可以：

- ✅ 创建博客文章
- ✅ 编辑自己的文章
- ✅ 删除自己的文章
- ✅ 管理个人资料
- ✅ 发表评论
- ✅ 点赞文章

系统会自动处理用户资料创建和信息同步，无需额外配置。
