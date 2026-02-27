<template>
  <node-view-wrapper as="figure" class="image-figure not-prose">
    <!-- 骨架屏（加载中） -->
    <div v-if="imageLoading && !imageError" class="image-skeleton" />

    <!-- 图片容器 -->
    <div
      v-show="!imageLoading && !imageError"
      class="image-container"
      role="button"
      tabindex="0"
      aria-label="点击放大查看图片"
      @click="openLightbox"
      @keydown.enter="openLightbox"
      @keydown.space.prevent="openLightbox"
    >
      <NuxtImg
        v-if="node.attrs.src"
        :src="node.attrs.src"
        :alt="node.attrs.alt || ''"
        :title="node.attrs.title || node.attrs.alt"
        preset="article"
        loading="lazy"
        :placeholder="[20, 11, 75, 5]"
        class="image-main"
        @load="handleLoad"
        @error="handleError"
      />
      <!-- 悬停遮罩 -->
      <div class="image-overlay" aria-hidden="true">
        <div class="image-overlay-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 加载失败占位 -->
    <div v-if="imageError" class="image-error">
      <Icon name="heroicons:photo" class="h-8 w-8 text-slate-400 dark:text-slate-600" />
      <span class="image-error-text">图片加载失败</span>
      <code class="image-error-src">{{ node.attrs.src }}</code>
    </div>

    <!-- 图注（alt 或 title） -->
    <figcaption v-if="caption" class="image-caption">
      {{ caption }}
    </figcaption>
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
  updateAttributes: (attrs: Record<string, unknown>) => void
  deleteNode: () => void
}

const props = defineProps<Props>()

const imageLoading = ref(true)
const imageError = ref(false)

const caption = computed(() => {
  const t = props.node.attrs.title?.trim()
  const a = props.node.attrs.alt?.trim()
  // title 优先；alt 仅在看起来像描述文字时显示（非文件名）
  if (t) return t
  if (a && !/\.(jpe?g|png|gif|webp|svg|avif)$/i.test(a)) return a
  return ''
})

const handleLoad = () => {
  imageLoading.value = false
}

const handleError = () => {
  imageLoading.value = false
  imageError.value = true
  console.warn(`[OptimizedImage] 图片加载失败: ${props.node.attrs.src}`)
}

const { show } = useImageLightbox()

const openLightbox = () => {
  if (props.node.attrs.src) {
    show(props.node.attrs.src, props.node.attrs.alt, props.node.attrs.title)
  }
}
</script>

<style scoped>
.image-figure {
  display: block;
  margin: 2rem 0;
  text-align: center;
}

/* 骨架屏 */
.image-skeleton {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  background: linear-gradient(
    90deg,
    rgb(226 232 240) 0%,
    rgb(241 245 249) 50%,
    rgb(226 232 240) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

:global(.dark) .image-skeleton {
  background: linear-gradient(90deg, rgb(30 41 59) 0%, rgb(44 55 74) 50%, rgb(30 41 59) 100%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 图片容器 */
.image-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
  border-radius: 0.875rem;
  overflow: hidden;
  cursor: zoom-in;
  outline: none;
}

.image-container:focus-visible {
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5);
}

/* 图片主体 */
.image-main {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 0.875rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 16px -4px rgba(0, 0, 0, 0.12),
    0 1px 4px -1px rgba(0, 0, 0, 0.08);
}

.image-container:hover .image-main {
  transform: scale(1.015);
}

/* 悬停遮罩 */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease;
  border-radius: 0.875rem;
}

.image-container:hover .image-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.image-overlay-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  opacity: 0;
  transform: scale(0.7);
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.image-overlay-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.image-container:hover .image-overlay-icon {
  opacity: 1;
  transform: scale(1);
}

/* 加载失败 */
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.5rem;
  background: rgb(248 250 252);
  border: 1px dashed rgb(203 213 225);
  border-radius: 0.875rem;
  color: rgb(100 116 139);
}

:global(.dark) .image-error {
  background: rgb(15 23 42);
  border-color: rgb(51 65 85);
  color: rgb(100 116 139);
}

.image-error-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.image-error-src {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  color: rgb(148 163 184);
  word-break: break-all;
  max-width: 100%;
}

/* 图注 */
.image-caption {
  display: block;
  margin-top: 0.625rem;
  font-size: 0.8125rem;
  color: rgb(100 116 139);
  font-style: italic;
  line-height: 1.5;
  text-align: center;
}

:global(.dark) .image-caption {
  color: rgb(100 116 139);
}
</style>
