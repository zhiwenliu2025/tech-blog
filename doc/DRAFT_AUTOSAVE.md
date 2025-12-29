# 博客草稿自动保存功能

## 功能概述

博客草稿自动保存功能使用 `localStorage` 在本地保存文章编辑内容，防止因意外关闭页面、浏览器崩溃或网络问题导致的内容丢失。

## 功能特性

### ✅ 已实现功能

1. **自动保存**
   - 每 30 秒自动保存一次草稿
   - 只在有内容时保存（标题或内容不为空）
   - 保存状态实时显示

2. **草稿恢复**
   - 页面加载时自动检测草稿
   - 显示恢复对话框
   - 支持恢复或忽略草稿

3. **手动保存**
   - 取消编辑时自动保存草稿
   - 成功发布后自动清除草稿

4. **草稿管理**
   - 草稿保留 7 天，过期自动清理
   - 每个文章使用独立的草稿键
   - 自动清理过期草稿

5. **保存状态提示**
   - 显示最后保存时间
   - 保存中显示加载动画
   - 保存成功显示绿色对勾

## 使用方法

### 创建文章页面

1. 开始编辑文章时，系统会自动开始保存草稿
2. 每 30 秒自动保存一次
3. 右上角显示保存状态和时间
4. 如果关闭页面后重新打开，会提示恢复草稿

### 编辑文章页面

1. 编辑现有文章时，系统会自动检测是否有未保存的草稿
2. 如果草稿比当前文章更新，会提示恢复
3. 自动保存功能与创建页面相同

## 技术实现

### Composable: `useDraft`

位置：`composables/useDraft.ts`

**主要方法**：

- `saveDraft(data)` - 保存草稿
- `loadDraft()` - 加载草稿
- `clearDraft()` - 清除草稿
- `startAutoSave(getData)` - 开始自动保存
- `stopAutoSave()` - 停止自动保存
- `manualSave(data)` - 手动保存

**返回值**：

- `isSaving` - 是否正在保存（只读）
- `lastSavedAt` - 最后保存时间戳（只读）
- `formatSavedTime(timestamp)` - 格式化保存时间

### 草稿数据结构

```typescript
interface DraftData {
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  category: string
  tags: string[]
  published: boolean
  savedAt: number // 保存时间戳
}
```

### 存储键格式

- 创建页面：`blog_draft_create`
- 编辑页面：`blog_draft_edit_{文章ID}`

## 配置选项

### 保存间隔

默认 30 秒自动保存一次，可在 `useDraft.ts` 中修改：

```typescript
const SAVE_INTERVAL = 30000 // 30秒，单位：毫秒
```

### 草稿保留时间

默认保留 7 天，可在 `useDraft.ts` 中修改：

```typescript
const MAX_DRAFT_AGE = 7 * 24 * 60 * 60 * 1000 // 7天，单位：毫秒
```

## 注意事项

1. **localStorage 限制**
   - 浏览器 localStorage 通常有 5-10MB 限制
   - 如果存储空间不足，会自动清理过期草稿
   - 建议定期清理不需要的草稿

2. **隐私和安全**
   - 草稿仅存储在用户本地浏览器
   - 不会上传到服务器
   - 清除浏览器数据会删除所有草稿

3. **多设备同步**
   - 草稿不会跨设备同步
   - 每台设备有独立的草稿存储

4. **浏览器兼容性**
   - 需要支持 localStorage 的现代浏览器
   - 不支持 IE 9 及以下版本

## 故障排除

### 草稿未保存

1. 检查浏览器是否支持 localStorage
2. 检查 localStorage 是否已满
3. 检查浏览器是否禁用了 localStorage

### 草稿恢复失败

1. 检查草稿是否已过期（超过 7 天）
2. 检查 localStorage 数据是否损坏
3. 尝试清除浏览器缓存后重试

## 未来改进

- [ ] 支持草稿版本历史
- [ ] 支持手动删除草稿
- [ ] 支持草稿列表查看
- [ ] 支持草稿导出/导入
- [ ] 支持服务器端草稿同步（可选）

## 相关文件

- `composables/useDraft.ts` - 草稿功能核心逻辑
- `pages/blog/create.vue` - 创建页面集成
- `pages/blog/edit/[id].vue` - 编辑页面集成
