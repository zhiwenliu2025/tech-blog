# 键盘输入优化使用指南

## 概述

键盘输入优化功能用于解决移动端输入框获得焦点时，键盘弹出可能遮挡输入框的问题。当用户在移动设备上点击输入框时，页面会自动滚动，确保输入框在键盘上方可见。

## 功能特性

- ✅ 自动检测移动设备
- ✅ iOS 设备特殊处理
- ✅ 可配置滚动延迟、行为和位置
- ✅ 支持多个输入框优化
- ✅ 平滑滚动动画

## 使用方法

### 基础用法

```vue
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

// 创建键盘输入优化实例
const keyboardInput = useKeyboardInput(inputRef, {
  scrollDelay: 300, // 滚动延迟（毫秒）
  behavior: 'smooth', // 滚动行为
  block: 'center', // 滚动位置
  mobileOnly: true, // 仅移动端启用
  offset: -20 // 额外偏移量（像素）
})
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    @focus="keyboardInput.handleFocus"
    @blur="keyboardInput.handleBlur"
    placeholder="输入内容..."
  />
</template>
```

### 在 textarea 中使用

```vue
<script setup lang="ts">
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const keyboardInput = useKeyboardInput(textareaRef, {
  scrollDelay: 300,
  behavior: 'smooth',
  block: 'center',
  offset: -20
})
</script>

<template>
  <textarea
    ref="textareaRef"
    @focus="keyboardInput.handleFocus"
    @blur="keyboardInput.handleBlur"
    placeholder="输入评论..."
  />
</template>
```

### 多个输入框优化

```vue
<script setup lang="ts">
const titleInput = ref<HTMLInputElement | null>(null)
const excerptInput = ref<HTMLTextAreaElement | null>(null)

// 为每个输入框创建独立的优化实例
const titleKeyboardInput = useKeyboardInput(titleInput, {
  scrollDelay: 300,
  offset: -10
})

const excerptKeyboardInput = useKeyboardInput(excerptInput, {
  scrollDelay: 300,
  offset: -10
})
</script>

<template>
  <input
    ref="titleInput"
    @focus="titleKeyboardInput.handleFocus"
    @blur="titleKeyboardInput.handleBlur"
  />

  <textarea
    ref="excerptInput"
    @focus="excerptKeyboardInput.handleFocus"
    @blur="excerptKeyboardInput.handleBlur"
  />
</template>
```

### 使用 useKeyboardInputMultiple

```vue
<script setup lang="ts">
const input1 = ref<HTMLInputElement | null>(null)
const input2 = ref<HTMLInputElement | null>(null)
const input3 = ref<HTMLInputElement | null>(null)

// 为多个输入框创建优化
const { handlers, isAnyKeyboardOpen } = useKeyboardInputMultiple([input1, input2, input3], {
  scrollDelay: 300,
  offset: -10
})
</script>

<template>
  <input ref="input1" @focus="handlers[0].handleFocus" @blur="handlers[0].handleBlur" />
  <input ref="input2" @focus="handlers[1].handleFocus" @blur="handlers[1].handleBlur" />
  <input ref="input3" @focus="handlers[2].handleFocus" @blur="handlers[2].handleBlur" />

  <!-- 显示是否有键盘打开 -->
  <div v-if="isAnyKeyboardOpen">键盘已打开</div>
</template>
```

## 配置选项

### UseKeyboardInputOptions

| 选项          | 类型                    | 默认值     | 说明                                                  |
| ------------- | ----------------------- | ---------- | ----------------------------------------------------- |
| `scrollDelay` | `number`                | `300`      | 滚动延迟时间（毫秒），等待键盘动画完成                |
| `behavior`    | `ScrollBehavior`        | `'smooth'` | 滚动行为：`'smooth'` 或 `'auto'`                      |
| `block`       | `ScrollLogicalPosition` | `'center'` | 滚动位置：`'start'`、`'center'`、`'end'`、`'nearest'` |
| `mobileOnly`  | `boolean`               | `true`     | 是否仅在移动端启用                                    |
| `offset`      | `number`                | `0`        | 额外的偏移量（像素），用于调整滚动位置                |

## 返回值

### useKeyboardInput

返回一个对象，包含以下属性：

- `isKeyboardOpen`: `Readonly<Ref<boolean>>` - 键盘是否打开
- `handleFocus`: `() => void` - 处理焦点事件
- `handleBlur`: `() => void` - 处理失焦事件
- `scroll`: `() => void` - 手动触发滚动

### useKeyboardInputMultiple

返回一个对象，包含以下属性：

- `handlers`: `Array<ReturnType<typeof useKeyboardInput>>` - 每个输入框的处理器数组
- `isAnyKeyboardOpen`: `ComputedRef<boolean>` - 是否有任何键盘打开

## 实际应用示例

### 文章详情页评论输入框

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const commentInput = ref<HTMLTextAreaElement | null>(null)

const keyboardInput = useKeyboardInput(commentInput, {
  scrollDelay: 300,
  behavior: 'smooth',
  block: 'center',
  mobileOnly: true,
  offset: -20
})
</script>

<template>
  <textarea
    ref="commentInput"
    v-model="newComment"
    @focus="keyboardInput.handleFocus"
    @blur="keyboardInput.handleBlur"
    placeholder="写下你的评论..."
  />
</template>
```

### 创建文章页面

```vue
<!-- pages/blog/create.vue -->
<script setup>
const titleInput = (ref < HTMLInputElement) | (null > null)
const excerptInput = (ref < HTMLTextAreaElement) | (null > null)

const titleKeyboardInput = useKeyboardInput(titleInput, {
  scrollDelay: 300,
  offset: -10
})

const excerptKeyboardInput = useKeyboardInput(excerptInput, {
  scrollDelay: 300,
  offset: -10
})
</script>

<template>
  <input
    ref="titleInput"
    v-model="post.title"
    @focus="titleKeyboardInput.handleFocus"
    @blur="titleKeyboardInput.handleBlur"
  />

  <textarea
    ref="excerptInput"
    v-model="post.excerpt"
    @focus="excerptKeyboardInput.handleFocus"
    @blur="excerptKeyboardInput.handleBlur"
  />
</template>
```

## 工作原理

1. **设备检测**: 自动检测是否为移动设备
2. **焦点监听**: 监听输入框的 `focus` 和 `blur` 事件
3. **延迟滚动**: 等待键盘动画完成后再滚动（默认 300ms）
4. **iOS 特殊处理**:
   - 监听视口高度变化（键盘弹出/收起）
   - 额外的滚动处理确保输入框可见
5. **平滑滚动**: 使用 `scrollIntoView` API 实现平滑滚动

## 注意事项

1. **仅在移动端生效**: 默认情况下，仅在移动设备上启用（`mobileOnly: true`）
2. **滚动延迟**: 需要等待键盘动画完成，延迟时间可根据实际情况调整
3. **iOS 特殊处理**: iOS 设备需要额外的处理，因为键盘弹出会改变视口高度
4. **偏移量调整**: 可以根据实际布局调整 `offset` 值，确保输入框上方有足够空间

## 浏览器支持

- ✅ iOS Safari 11.3+
- ✅ Chrome (Android)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ✅ Edge (Mobile)

## 相关文档

- [移动端优化建议](./MOBILE_OPTIMIZATION_RECOMMENDATIONS.md)
- [移动端优化总结](./MOBILE_OPTIMIZATION_SUMMARY.md)
- [触摸优化指南](./TOUCH_OPTIMIZATION.md)
