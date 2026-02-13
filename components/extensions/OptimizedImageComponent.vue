<template>
  <node-view-wrapper class="optimized-image-wrapper">
    <NuxtImg
      v-if="node.attrs.src"
      :src="node.attrs.src"
      :alt="node.attrs.alt || '图片'"
      :title="node.attrs.title"
      preset="article"
      loading="lazy"
      :placeholder="[20, 11, 75, 5]"
      class="mx-auto my-4 block h-auto max-w-full cursor-zoom-in rounded-lg transition-transform hover:scale-[1.02]"
      @click="openLightbox"
      @error="handleImageError"
    />
    <div v-else class="image-placeholder">
      <Icon name="heroicons:photo" class="h-12 w-12 text-gray-400" />
      <p class="text-sm text-gray-500">图片加载失败</p>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

interface Props {
  node: {
    attrs: {
      src: string
      alt?: string
      title?: string
    }
  }
  updateAttributes: (attrs: any) => void
  deleteNode: () => void
}

const props = defineProps<Props>()

const { show } = useImageLightbox()

const openLightbox = () => {
  if (props.node.attrs.src) {
    show(props.node.attrs.src, props.node.attrs.alt, props.node.attrs.title)
  }
}

const handleImageError = (event: Event) => {
  console.warn(`[OptimizedImage] 图片加载失败: ${props.node.attrs.src}`)
}
</script>

<style scoped>
.optimized-image-wrapper {
  display: block;
  margin: 1rem 0;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgb(243 244 246);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.dark .image-placeholder {
  background-color: rgb(31 41 55);
}

:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem auto;
  display: block;
}

:deep(img) {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.2s ease-in-out;
}
</style>
