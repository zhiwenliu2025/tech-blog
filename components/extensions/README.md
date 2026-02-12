# 自定义 TipTap 扩展

## OptimizedImage - 响应式 WebP 图片扩展

这是一个自定义的 TipTap Image 扩展，使用 NuxtImg 组件来实现自动 WebP 转换。

### 特性

✅ **自动 WebP 转换** - 所有图片自动转换为 WebP 格式  
✅ **保持原始尺寸** - 不改变图片的宽高，只转换格式  
✅ **懒加载** - 使用 `loading="lazy"` 延迟加载  
✅ **占位符** - 显示模糊占位符提升用户体验  
✅ **错误处理** - 图片加载失败时显示占位符

### 文件说明

#### OptimizedImage.ts

自定义 TipTap Node 扩展，定义了图片节点的结构和行为。

**主要特性：**

- 继承 TipTap 的 Node 类型
- 支持 `src`、`alt`、`title` 属性
- 提供 `setImage` 命令用于插入图片
- 使用 VueNodeViewRenderer 渲染自定义组件

#### OptimizedImageComponent.vue

Vue 组件，实际渲染图片的地方。

**主要特性：**

- 使用 NuxtImg 组件渲染图片
- 使用 `article` 预设：只转换格式，不改变尺寸
- 错误处理和占位符显示

### 使用方式

#### 在 BlogContentRenderer.vue 中使用

```typescript
import { OptimizedImage } from './extensions/OptimizedImage'

const editor = useEditor({
  extensions: [
    StarterKit,
    OptimizedImage.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4 mx-auto block'
      }
    })
  ]
})
```

#### 在 MarkdownEditor.vue 中使用

```typescript
import { OptimizedImage } from './extensions/OptimizedImage'

// 使用 setImage 命令插入图片
editor.value.chain().focus().setImage({ src: imageUrl, alt: 'Image description' }).run()
```

### 图片预设配置

在 `nuxt.config.ts` 中配置的预设：

- **article** (保持原尺寸, quality 85) - 用于文章正文图片，只转换格式
- **cover** (800x450, quality 85) - 用于封面图
- **thumbnail** (400x300, quality 75) - 用于缩略图
- **hd** (1920x1080, quality 90) - 用于高清图（限制最大尺寸）
- **mobile** (640px, quality 75) - 用于移动端

### 响应式尺寸策略

**注意**：文章正文图片不使用响应式尺寸调整，保持原始尺寸，只转换为 WebP 格式。

封面图和缩略图等使用响应式尺寸优化。

### 工作流程

1. **编辑器插入图片** → 使用 `setImage` 命令
2. **渲染节点** → OptimizedImageComponent 接收节点属性
3. **NuxtImg 处理** → 使用 `article` 预设（只转换格式）
4. **IPX 服务** → 实时转换为 WebP，保持原始尺寸
5. **浏览器加载** → 加载 WebP 格式的图片

### 性能优化

- **7天缓存** - IPX 生成的图片缓存7天
- **懒加载** - 图片进入视口时才加载
- **占位符** - 低质量占位符立即显示
- **WebP/AVIF** - 自动选择最优格式
- **保持尺寸** - 不缩放图片，保留原始分辨率

### 兼容性

- 支持所有 TipTap 的标准操作（复制、粘贴、拖拽等）
- 兼容 Markdown 和 HTML 内容
- 支持图片删除时自动清理 Storage

### 注意事项

1. **节点名称**: 自定义扩展使用 `optimizedImage` 而非 `image`
2. **图片来源**: Supabase Storage 图片使用 `hd` 预设，外部图片使用默认预设
3. **错误处理**: 加载失败时显示占位符，不会中断渲染
4. **Storage 清理**: 编辑器中删除图片时自动清理 Supabase Storage

### 对比原生 Image 扩展

| 特性       | 原生 Image | OptimizedImage |
| ---------- | ---------- | -------------- |
| WebP 转换  | ❌         | ✅             |
| 保持原尺寸 | ✅         | ✅             |
| 懒加载     | ✅         | ✅             |
| 占位符     | ❌         | ✅             |
| 自动优化   | ❌         | ✅ (仅格式)    |
| 缓存策略   | ❌         | ✅             |
| AVIF 支持  | ❌         | ✅             |

### 扩展配置选项

```typescript
OptimizedImage.configure({
  // 是否内联显示（false 为块级元素）
  inline: false,

  // 是否允许 base64 图片（建议关闭以避免性能问题）
  allowBase64: false,

  // HTML 属性
  HTMLAttributes: {
    class: 'rounded-lg max-w-full h-auto my-4 mx-auto block'
  }
})
```

### 未来改进

- [ ] 支持图片尺寸调整（拖拽调整大小）
- [ ] 支持图片对齐方式（左对齐、居中、右对齐）
- [ ] 支持图片标题和描述
- [ ] 支持图片画廊功能
- [ ] 支持图片压缩质量自定义
- [ ] 支持图片格式选择（WebP、AVIF、原格式）
