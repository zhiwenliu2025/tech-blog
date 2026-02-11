# 图片上传系统文档

## 概述

本项目包含两套图片上传系统，都使用 Supabase Storage 作为存储后端。

## 1. 博客图片上传系统

### 1.1 导入图片（服务端）

**位置**: `server/utils/import-utils.ts` - `processAllImages()` 函数

**特性**:

- ✅ 基于内容的哈希去重（MD5）
- ✅ 自动下载外部图片
- ✅ 批量处理（最多 3 个并发）
- ✅ 大小限制（单张 10MB，总共 50MB）
- ✅ 统一的文件路径：`{userId}/imported/hash-{md5}.{ext}`
- ✅ 缓存控制：3600 秒

**工作流程**:

1. 从文章内容中提取所有图片 URL
2. 下载图片并计算 MD5 哈希
3. 检查是否已存在相同哈希的图片
4. 如果存在，直接使用；否则上传新图片
5. 替换 Markdown 中的图片 URL

### 1.2 手动上传图片（客户端）

**位置**: `components/ImageUploader.vue`

**特性**:

- ✅ 基于内容的哈希去重（SHA-256）
- ✅ 自动压缩和优化（最大宽度 1920px）
- ✅ WebP 格式转换（如果浏览器支持）
- ✅ 拖拽上传支持
- ✅ 实时上传进度
- ✅ Alt 文本编辑
- ✅ 统一的文件路径：`{userId}/manual/hash-{sha256}.{ext}`
- ✅ 缓存控制：3600 秒
- ✅ 用户 ID 获取逻辑：`user.id || user.sub`（与导入逻辑一致）

**工作流程**:

1. 用户选择或拖拽图片
2. 验证用户登录状态并获取用户 ID（兼容 `id` 和 `sub` 属性）
3. 验证文件类型和大小（最大 5MB）
4. 压缩和优化图片
5. 计算 SHA-256 哈希
6. 检查是否已存在相同哈希的图片
7. 如果存在，直接使用；否则上传新图片
8. 等待用户输入 Alt 文本
9. 确认后插入到编辑器

### 1.3 图片去重机制

两套系统都实现了图片去重，避免重复存储相同内容的图片：

| 特性         | 导入图片（服务端）      | 手动上传（客户端）      |
| ------------ | ----------------------- | ----------------------- |
| 哈希算法     | MD5                     | SHA-256                 |
| 环境         | Node.js (crypto)        | 浏览器 (Web Crypto API) |
| 存储路径     | `{userId}/imported/`    | `{userId}/manual/`      |
| 文件命名     | `hash-{md5}.{ext}`      | `hash-{sha256}.{ext}`   |
| 用户 ID 获取 | `user.id \|\| user.sub` | `user.id \|\| user.sub` |

**去重流程**:

1. 验证用户登录状态
2. 获取用户 ID（兼容 `id` 和 `sub` 属性，统一逻辑）
3. 计算文件内容哈希
4. 在对应目录中搜索 `hash-{hash}` 文件
5. 如果找到，返回已存在的 URL
6. 如果未找到，上传新文件

### 1.4 删除机制

**位置**: `composables/useBlogPosts.ts` - `deletePost()` 函数

删除博客文章时，会自动删除关联的图片：

1. **收集图片 URL**:
   - 封面图片 (`cover_image`)
   - 内容中的 Markdown 图片: `![alt](url)`
   - 内容中的 HTML 图片: `<img src="url" />`

2. **解析 URL**:
   - 从完整 URL 提取文件路径
   - 格式: `https://xxx.supabase.co/storage/v1/object/public/blog-images/path/to/file.webp`
   - 提取: `path/to/file.webp`

3. **批量删除**:
   - 使用 `supabase.storage.from('blog-images').remove(filePaths)`
   - 即使删除失败也不影响文章删除

## 2. 头像上传系统

**位置**: `components/AvatarUploader.vue`

**特性**:

- ✅ 固定尺寸（200x200）
- ✅ 圆形裁剪
- ✅ 自动覆盖（每个用户只有一个头像）
- ✅ WebP 格式转换
- ✅ 文件路径：`{userId}/avatar.{ext}`
- ✅ 存储桶：`avatars`（独立于博客图片）

**与博客图片的区别**:

- 不需要去重（每个用户只有一个头像）
- 使用 `x-upsert: true` 允许覆盖
- 使用独立的 `avatars` 存储桶
- 自动更新数据库中的 `profiles.avatar_url`

## 3. 存储结构

### 3.1 blog-images 存储桶

```
blog-images/
├── {userId}/
│   ├── imported/                    # 导入的图片
│   │   ├── hash-{md5hash}.webp
│   │   ├── hash-{md5hash}.jpg
│   │   └── ...
│   └── manual/                      # 手动上传的图片
│       ├── hash-{sha256hash}.webp
│       ├── hash-{sha256hash}.jpg
│       └── ...
```

### 3.2 avatars 存储桶

```
avatars/
├── {userId}/
│   └── avatar.webp                  # 用户头像（覆盖式）
```

## 4. 性能优化

### 4.1 图片压缩

**ImageUploader.vue**:

- 最大宽度：1920px
- WebP 质量：85%
- JPEG 质量：80%
- 启用高质量缩放算法

**AvatarUploader.vue**:

- 固定尺寸：200x200px
- WebP 质量：90%
- JPEG 质量：85%

### 4.2 缓存策略

- 所有图片设置 `cache-control: 3600`（1 小时）
- Supabase Storage 自动设置 CDN 缓存头

### 4.3 并发控制

导入图片时限制并发数为 3，避免：

- 过多并发请求导致速率限制
- 内存使用过高
- 网络带宽占用过多

## 5. 错误处理

### 5.0 用户身份验证

**统一的用户 ID 获取逻辑**：

所有图片上传功能（导入和手动上传）都使用统一的用户 ID 获取逻辑：

```typescript
// 兼容不同的 user 对象结构
const userId = user.id || (user as any).sub

if (!userId) {
  throw new Error('无法获取用户ID')
}
```

**原因**：

- Supabase Auth 在不同情况下可能返回不同结构的 user 对象
- `user.id`：标准属性
- `user.sub`：JWT token 中的 subject claim
- 确保在所有情况下都能正确获取用户 ID

**应用位置**：

- ✅ 服务端图片导入：`server/api/import/fetch.post.ts`
- ✅ 客户端手动上传：`components/ImageUploader.vue`
- ✅ 客户端头像上传：`components/AvatarUploader.vue`

### 5.1 验证

- 文件类型：仅允许 JPG、PNG、GIF、WebP
- 文件大小：
  - 手动上传：最大 5MB
  - 导入图片：单张最大 10MB，总共最大 50MB
  - 头像：最大 2MB
- 图片尺寸：最大 5000x5000px（手动上传）

### 5.2 容错

- 图片下载失败：记录失败的 URL，继续处理其他图片
- 上传失败：提供重试按钮
- 删除失败：不影响文章删除操作，仅记录警告日志
- 竞态条件：如果哈希文件在检查后被其他请求创建，直接使用已存在的

## 6. 最佳实践

### 6.1 导入文章

- 系统会自动下载和上传外部图片
- 重复的图片会被自动去重
- 图片存储在 `imported/` 目录下

### 6.2 手动上传

- 拖拽或点击上传图片
- 系统自动压缩和优化
- 添加有意义的 Alt 文本（有助于 SEO 和无障碍访问）
- 重复上传相同图片会直接使用已存在的

### 6.3 删除文章

- 删除文章时会自动清理所有关联图片
- 包括封面图片和内容中的所有图片
- 不会误删其他文章共享的图片（基于路径判断）

## 7. 未来优化

- [ ] 实现图片引用计数，只删除未被引用的图片
- [ ] 支持图片编辑（裁剪、旋转、滤镜）
- [ ] 批量图片管理界面
- [ ] 图片 CDN 集成
- [ ] 自动生成响应式图片尺寸
- [ ] 延迟加载和渐进式图片
