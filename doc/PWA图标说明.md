# PWA 图标说明

本项目需要以下 PWA 图标文件，请将它们放置在 `public/` 目录下：

> **注意**：图标文件已通过脚本自动生成，如需重新生成，请运行 `pnpm run generate-icons`

## 必需的图标文件

1. **pwa-64x64.png** - 64x64 像素，用于小图标
2. **pwa-192x192.png** - 192x192 像素，用于 Android 主屏幕
3. **pwa-512x512.png** - 512x512 像素，用于 Android 启动画面
4. **maskable-icon-512x512.png** - 512x512 像素，可遮罩图标（用于 Android）
5. **apple-touch-icon.png** - 180x180 像素，用于 iOS 主屏幕

## 图标设计建议

- 使用简洁、清晰的图标设计
- 确保图标在不同尺寸下都清晰可见
- 使用与应用主题色一致的颜色
- maskable-icon 需要在安全区域内设计（四周留出 10% 的安全边距）

## 生成图标

### 使用项目脚本生成（推荐）

项目已包含图标生成脚本，可以直接运行：

```bash
pnpm run generate-icons
```

或

```bash
node scripts/generate-pwa-icons.js
```

脚本会自动生成所有必需的图标文件到 `public/` 目录。

### 使用其他工具

如果需要自定义图标，可以使用以下工具：

1. **在线工具**：
   - [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder](https://www.pwabuilder.com/imageGenerator)

2. **命令行工具**：
   ```bash
   npm install -g pwa-asset-generator
   pwa-asset-generator logo.png public/
   ```

## 临时占位图标

在开发阶段，你可以：

1. 使用简单的占位图标
2. 或者从 [Iconify](https://iconify.design/) 下载合适的图标
3. 或者使用设计工具（如 Figma、Canva）创建图标

## 注意事项

- 所有图标文件必须是 PNG 格式
- 图标应该使用透明背景（除了 maskable-icon）
- 确保图标文件大小合理（建议每个图标 < 100KB）
