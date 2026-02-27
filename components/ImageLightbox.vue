<template>
  <ClientOnly>
    <VueEasyLightbox
      ref="lightboxRef"
      :visible="state.visible"
      :imgs="imageUrls"
      :index="state.currentIndex"
      :loop="true"
      :move-disabled="false"
      :pinch-disabled="false"
      :zoom-disabled="false"
      :rotate-disabled="true"
      :fullscreen="true"
      :scroll-disabled="true"
      class="image-lightbox"
      @hide="close"
      @on-index-change="handleIndexChange"
    >
      <template #toolbar>
        <div class="lightbox-toolbar">
          <!-- 上一张 / 计数 / 下一张 -->
          <template v-if="state.images.length > 1">
            <button class="toolbar-btn" title="上一张 (←)" @click="prevImage">
              <Icon name="heroicons:chevron-left" class="h-4 w-4" />
            </button>
            <span class="toolbar-counter">
              <span class="toolbar-counter-cur">{{ state.currentIndex + 1 }}</span>
              <span class="toolbar-sep">/</span>
              <span>{{ state.images.length }}</span>
            </span>
            <button class="toolbar-btn" title="下一张 (→)" @click="nextImage">
              <Icon name="heroicons:chevron-right" class="h-4 w-4" />
            </button>
            <div class="toolbar-divider" />
          </template>

          <!-- 缩放控制 -->
          <button class="toolbar-btn" title="缩小 (-)" @click="handleZoomOut">
            <Icon name="heroicons:minus" class="h-4 w-4" />
          </button>
          <button
            class="toolbar-btn toolbar-btn--zoom-reset"
            title="重置缩放 (0)"
            @click="handleZoomReset"
          >
            <span class="zoom-label">{{ zoomPercent }}%</span>
          </button>
          <button class="toolbar-btn" title="放大 (+)" @click="handleZoomIn">
            <Icon name="heroicons:plus" class="h-4 w-4" />
          </button>

          <div class="toolbar-divider" />

          <!-- 下载 -->
          <a
            class="toolbar-btn"
            :href="currentImageSrc"
            :download="currentImageFilename"
            target="_blank"
            rel="noopener noreferrer"
            title="下载图片"
          >
            <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
          </a>

          <!-- 关闭 -->
          <button class="toolbar-btn toolbar-btn--close" title="关闭 (ESC)" @click="close">
            <Icon name="heroicons:x-mark" class="h-4 w-4" />
          </button>
        </div>
      </template>
    </VueEasyLightbox>
  </ClientOnly>
</template>

<script setup lang="ts">
import VueEasyLightbox from 'vue-easy-lightbox/external-css'
import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css'

const { state, close } = useImageLightbox()

const lightboxRef = ref()
const zoomPercent = ref(100)

const imageUrls = computed(() =>
  state.images.map(img => ({ src: img.src, title: img.alt || img.title || '' }))
)

const currentImageSrc = computed(() => state.images[state.currentIndex]?.src || '')

const currentImageFilename = computed(() => {
  const src = currentImageSrc.value
  if (!src) return 'image'
  return src.split('/').pop()?.split('?')[0] || 'image'
})

const handleIndexChange = (newIndex: number) => {
  state.currentIndex = newIndex
  zoomPercent.value = 100
}

const prevImage = () => {
  if (state.images.length > 0) {
    state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length
    zoomPercent.value = 100
  }
}

const nextImage = () => {
  if (state.images.length > 0) {
    state.currentIndex = (state.currentIndex + 1) % state.images.length
    zoomPercent.value = 100
  }
}

const handleZoomIn = () => {
  lightboxRef.value?.zoomIn?.()
  zoomPercent.value = Math.min(400, zoomPercent.value + 25)
}

const handleZoomOut = () => {
  lightboxRef.value?.zoomOut?.()
  zoomPercent.value = Math.max(25, zoomPercent.value - 25)
}

const handleZoomReset = () => {
  // vue-easy-lightbox 没有直接 reset，触发两次重置方向代替
  // 通过重新渲染当前图片来达到 reset 效果
  const cur = state.currentIndex
  state.currentIndex = -1
  nextTick(() => {
    state.currentIndex = cur
    zoomPercent.value = 100
  })
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (!state.visible) return
  switch (e.key) {
    case '+':
    case '=':
      handleZoomIn()
      break
    case '-':
      handleZoomOut()
      break
    case '0':
      handleZoomReset()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 打开时重置缩放比例
watch(
  () => state.visible,
  visible => {
    if (visible) zoomPercent.value = 100
  }
)
</script>

<style>
.image-lightbox {
  z-index: 9999 !important;
}

/* 背景遮罩 */
.vel-modal {
  background-color: rgba(2, 6, 23, 0.96) !important;
  backdrop-filter: blur(12px) !important;
}

/* 图片标题 */
.vel-img-title {
  color: rgb(148 163 184) !important;
  background: rgba(15, 23, 42, 0.85) !important;
  padding: 0.375rem 0.875rem !important;
  border-radius: 0.5rem !important;
  border: 1px solid rgba(51, 65, 85, 0.6) !important;
  font-size: 0.75rem !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  backdrop-filter: blur(8px) !important;
}

/* ── 工具栏 ── */
.lightbox-toolbar {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.3125rem 0.5rem;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(51, 65, 85, 0.7);
  border-radius: 0.875rem;
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.375rem;
  border-radius: 0.5rem;
  color: rgb(148 163 184);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  text-decoration: none;
  font-size: 0.75rem;
}

.toolbar-btn:hover {
  background: rgba(51, 65, 85, 0.6);
  color: rgb(226 232 240);
}

.toolbar-btn--close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252 165 165);
}

.toolbar-btn--zoom-reset {
  padding: 0 0.5rem;
}

.zoom-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgb(148 163 184);
  min-width: 2.5rem;
  text-align: center;
  display: block;
}

.toolbar-btn--zoom-reset:hover .zoom-label {
  color: rgb(226 232 240);
}

.toolbar-counter {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgb(148 163 184);
  padding: 0 0.375rem;
  min-width: 3rem;
  justify-content: center;
}

.toolbar-counter-cur {
  color: rgb(226 232 240);
  font-weight: 700;
}

.toolbar-sep {
  margin: 0 0.0625rem;
  color: rgb(71 85 105);
}

.toolbar-divider {
  width: 1px;
  height: 1.125rem;
  background: rgba(51, 65, 85, 0.8);
  margin: 0 0.25rem;
  flex-shrink: 0;
}

/* 移动端：工具栏排列紧凑 */
@media (max-width: 480px) {
  .lightbox-toolbar {
    gap: 0;
    padding: 0.25rem 0.375rem;
    border-radius: 0.75rem;
  }

  .toolbar-btn {
    min-width: 1.875rem;
    height: 1.875rem;
    padding: 0 0.25rem;
  }

  .zoom-label {
    font-size: 0.625rem;
    min-width: 2rem;
  }

  .toolbar-counter {
    min-width: 2.5rem;
    font-size: 0.625rem;
  }
}
</style>
