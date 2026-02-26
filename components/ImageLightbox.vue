<template>
  <ClientOnly>
    <VueEasyLightbox
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
          <template v-if="state.images.length > 1">
            <button class="toolbar-btn" title="上一张" @click="prevImage">
              <Icon name="heroicons:chevron-left" class="h-5 w-5" />
            </button>
            <span class="toolbar-counter">
              {{ state.currentIndex + 1 }}<span class="toolbar-sep">/</span
              >{{ state.images.length }}
            </span>
            <button class="toolbar-btn" title="下一张" @click="nextImage">
              <Icon name="heroicons:chevron-right" class="h-5 w-5" />
            </button>
            <div class="toolbar-divider" />
          </template>
          <button class="toolbar-btn toolbar-btn--close" title="关闭 (ESC)" @click="close">
            <Icon name="heroicons:x-mark" class="h-5 w-5" />
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

const imageUrls = computed(() =>
  state.images.map(img => ({ src: img.src, title: img.alt || img.title || '' }))
)

const handleIndexChange = (newIndex: number) => {
  state.currentIndex = newIndex
}
const prevImage = () => {
  if (state.images.length > 0)
    state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length
}
const nextImage = () => {
  if (state.images.length > 0) state.currentIndex = (state.currentIndex + 1) % state.images.length
}
</script>

<style>
.image-lightbox {
  z-index: 9999 !important;
}

/* 覆盖 VueEasyLightbox 背景 */
.vel-modal {
  background-color: rgba(2, 6, 23, 0.95) !important;
  backdrop-filter: blur(8px) !important;
}

.vel-img-title {
  color: rgb(148 163 184) !important;
  background: rgba(15, 23, 42, 0.8) !important;
  padding: 0.375rem 0.75rem !important;
  border-radius: 0.5rem !important;
  border: 1px solid rgba(51, 65, 85, 0.6) !important;
  font-size: 0.75rem !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}

/* 自定义工具栏 */
.lightbox-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 0.75rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  color: rgb(148 163 184);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.toolbar-btn:hover {
  background: rgba(51, 65, 85, 0.6);
  color: white;
}

.toolbar-btn--close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252 165 165);
}

.toolbar-counter {
  color: rgb(148 163 184);
  font-size: 0.6875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 500;
  padding: 0 0.375rem;
  min-width: 2.5rem;
  text-align: center;
}

.toolbar-sep {
  margin: 0 0.125rem;
  color: rgb(71 85 105);
}

.toolbar-divider {
  width: 1px;
  height: 1rem;
  background: rgba(51, 65, 85, 0.8);
  margin: 0 0.25rem;
}
</style>
