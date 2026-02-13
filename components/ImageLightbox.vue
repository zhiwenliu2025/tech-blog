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
          <button
            v-if="state.images.length > 1"
            class="toolbar-btn"
            title="上一张"
            @click="prevImage"
          >
            <Icon name="heroicons:chevron-left" class="h-6 w-6" />
          </button>
          <span v-if="state.images.length > 1" class="toolbar-text">
            {{ state.currentIndex + 1 }} / {{ state.images.length }}
          </span>
          <button
            v-if="state.images.length > 1"
            class="toolbar-btn"
            title="下一张"
            @click="nextImage"
          >
            <Icon name="heroicons:chevron-right" class="h-6 w-6" />
          </button>
          <button class="toolbar-btn" title="关闭" @click="close">
            <Icon name="heroicons:x-mark" class="h-6 w-6" />
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

const imageUrls = computed(() => {
  return state.images.map(img => ({
    src: img.src,
    title: img.alt || img.title || ''
  }))
})

const handleIndexChange = (newIndex: number) => {
  state.currentIndex = newIndex
}

const prevImage = () => {
  if (state.images.length > 0) {
    state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length
  }
}

const nextImage = () => {
  if (state.images.length > 0) {
    state.currentIndex = (state.currentIndex + 1) % state.images.length
  }
}
</script>

<style>
.image-lightbox {
  z-index: 9999 !important;
}

.lightbox-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.5rem;
  backdrop-filter: blur(4px);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toolbar-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

.toolbar-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 0.5rem;
  min-width: 3rem;
  text-align: center;
}

.vel-modal {
  background-color: rgba(0, 0, 0, 0.9) !important;
}

.vel-img-title {
  color: white !important;
  background: rgba(0, 0, 0, 0.6) !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem !important;
  font-size: 0.875rem !important;
}
</style>
