# 移动端触摸优化指南

## 概述

本项目已实现全面的移动端触摸优化，提供流畅、响应迅速的触摸体验。

## 已实现的优化

### 1. CSS 触摸优化

#### 1.1 基础触摸优化

- ✅ 移除点击高亮（`-webkit-tap-highlight-color: transparent`）
- ✅ 触摸操作优化（`touch-action: manipulation`）
- ✅ 防止双击缩放
- ✅ 最小触摸区域（44x44px，符合 Apple 和 Google 指南）

#### 1.2 触摸反馈

- ✅ 触摸时的缩放反馈（`scale(0.97)`）
- ✅ 触摸时的透明度变化（`opacity: 0.8`）
- ✅ 平滑的过渡动画

#### 1.3 滚动优化

- ✅ 平滑滚动（`-webkit-overflow-scrolling: touch`）
- ✅ 防止滚动链（`overscroll-behavior: contain`）
- ✅ 改善滚动性能

#### 1.4 输入框优化

- ✅ 防止 iOS 自动缩放（`font-size: 16px`）
- ✅ 移除 iOS 默认样式
- ✅ 改善触摸响应

### 2. 工具类

#### 2.1 基础类

```html
<!-- 触摸优化 -->
<div class="touch-optimized">内容</div>

<!-- 触摸反馈 -->
<button class="touch-feedback">按钮</button>

<!-- 触摸区域扩展 -->
<div class="touch-target">小元素</div>

<!-- 防止文本选择 -->
<div class="no-select">按钮文本</div>
```

#### 2.2 手势类

```html
<!-- 可滑动 -->
<div class="swipeable">可滑动内容</div>

<!-- 水平滑动 -->
<div class="swipe-horizontal">
  <div>项目 1</div>
  <div>项目 2</div>
</div>

<!-- 垂直滑动 -->
<div class="swipe-vertical">可滚动内容</div>

<!-- 快速触摸（移除延迟） -->
<button class="touch-fast">快速响应</button>
```

#### 2.3 安全区域适配

```html
<!-- 适配 iPhone X 等设备的安全区域 -->
<div class="safe-area-top safe-area-bottom">内容</div>
```

### 3. Composable API

#### 3.1 触摸反馈

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { addTouchFeedback } = useTouch()
const buttonRef = ref<HTMLElement>()

onMounted(() => {
  if (buttonRef.value) {
    addTouchFeedback(buttonRef.value)
  }
})
</script>

<template>
  <button ref="buttonRef">点击我</button>
</template>
```

#### 3.2 滑动检测

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { useSwipe } = useTouch()
const containerRef = ref<HTMLElement>()

onMounted(() => {
  if (containerRef.value) {
    useSwipe(containerRef.value, {
      onSwipeLeft: () => {
        console.log('向左滑动')
        // 执行操作，如返回上一页
        navigateTo(-1)
      },
      onSwipeRight: () => {
        console.log('向右滑动')
      },
      threshold: 50, // 滑动阈值（像素）
      velocityThreshold: 0.3 // 速度阈值
    })
  }
})
</script>

<template>
  <div ref="containerRef">滑动我</div>
</template>
```

#### 3.3 长按检测

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { useLongPress } = useTouch()
const elementRef = ref<HTMLElement>()

onMounted(() => {
  if (elementRef.value) {
    useLongPress(elementRef.value, {
      onLongPress: () => {
        console.log('长按触发')
        // 显示上下文菜单或其他操作
      },
      duration: 500 // 长按持续时间（毫秒）
    })
  }
})
</script>

<template>
  <div ref="elementRef">长按我</div>
</template>
```

#### 3.4 双击检测

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { useDoubleTap } = useTouch()
const elementRef = ref<HTMLElement>()

onMounted(() => {
  if (elementRef.value) {
    useDoubleTap(elementRef.value, {
      onDoubleTap: () => {
        console.log('双击触发')
        // 执行操作，如点赞、收藏等
      },
      delay: 300 // 双击间隔时间（毫秒）
    })
  }
})
</script>

<template>
  <div ref="elementRef">双击我</div>
</template>
```

#### 3.5 触摸区域扩展

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { expandTouchTarget } = useTouch()
const smallButtonRef = ref<HTMLElement>()

onMounted(() => {
  if (smallButtonRef.value) {
    // 确保按钮至少有 44x44px 的触摸区域
    expandTouchTarget(smallButtonRef.value, 44)
  }
})
</script>

<template>
  <button ref="smallButtonRef" class="h-6 w-6">小按钮</button>
</template>
```

#### 3.6 防止滚动

```vue
<script setup>
import { useTouch } from '~/composables/useTouch'

const { preventScroll } = useTouch()
const modalRef = ref<HTMLElement>()

const openModal = () => {
  if (modalRef.value) {
    preventScroll(modalRef.value, true) // 防止滚动
  }
}

const closeModal = () => {
  if (modalRef.value) {
    preventScroll(modalRef.value, false) // 恢复滚动
  }
}
</script>
```

## 最佳实践

### 1. 按钮和链接

- ✅ 使用 `touch-optimized` 类
- ✅ 确保最小触摸区域为 44x44px
- ✅ 添加触摸反馈效果

```vue
<template>
  <button class="touch-optimized touch-feedback px-4 py-3">按钮</button>
</template>
```

### 2. 卡片和列表项

- ✅ 使用触摸反馈
- ✅ 允许垂直滚动
- ✅ 添加滑动操作支持

```vue
<template>
  <div class="card touch-feedback" @click="handleClick">卡片内容</div>
</template>
```

### 3. 输入框

- ✅ 使用 16px 字体大小（防止 iOS 自动缩放）
- ✅ 添加足够的 padding
- ✅ 使用触摸优化类

```vue
<template>
  <input type="text" class="touch-fast form-input" placeholder="输入内容" />
</template>
```

### 4. 滚动容器

- ✅ 使用 `mobile-scroll` 类
- ✅ 添加 `overscroll-behavior: contain`
- ✅ 使用 `-webkit-overflow-scrolling: touch`

```vue
<template>
  <div class="mobile-scroll overflow-y-auto">可滚动内容</div>
</template>
```

### 5. 安全区域适配

- ✅ 在固定定位的元素上使用安全区域类
- ✅ 适配 iPhone X 等设备的刘海屏

```vue
<template>
  <header class="safe-area-top fixed top-0">头部内容</header>
  <footer class="safe-area-bottom fixed bottom-0">底部内容</footer>
</template>
```

## 测试指南

### 1. 触摸响应测试

- 测试所有按钮和链接的触摸响应
- 确保触摸区域足够大（至少 44x44px）
- 验证触摸反馈效果

### 2. 滚动测试

- 测试垂直和水平滚动
- 验证滚动性能
- 检查是否有滚动链问题

### 3. 手势测试

- 测试滑动操作
- 测试长按功能
- 测试双击功能

### 4. 输入测试

- 测试输入框在 iOS 上的表现
- 验证不会自动缩放
- 检查触摸响应

## 浏览器支持

- ✅ iOS Safari 11.3+
- ✅ Chrome (Android)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ✅ Edge (Mobile)

## 注意事项

1. **最小触摸区域**: 确保所有可交互元素至少有 44x44px 的触摸区域
2. **触摸反馈**: 为所有交互元素添加视觉反馈
3. **滚动性能**: 使用 `-webkit-overflow-scrolling: touch` 改善滚动性能
4. **输入框字体**: 使用 16px 字体大小防止 iOS 自动缩放
5. **安全区域**: 在固定定位的元素上适配安全区域

## 相关资源

- [Apple Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
- [Google Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [MDN - touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
- [Web.dev - Touch Target Sizes](https://web.dev/tap-targets/)
