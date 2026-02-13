interface ImageItem {
  src: string
  alt?: string
  title?: string
}

interface LightboxState {
  visible: boolean
  images: ImageItem[]
  currentIndex: number
}

const state = reactive<LightboxState>({
  visible: false,
  images: [],
  currentIndex: 0
})

export const useImageLightbox = () => {
  const open = (images: ImageItem | ImageItem[], index = 0) => {
    const imageArray = Array.isArray(images) ? images : [images]
    state.images = imageArray
    state.currentIndex = imageArray.length > 1 ? index : 0
    state.visible = true
  }

  const close = () => {
    state.visible = false
    state.images = []
    state.currentIndex = 0
  }

  const show = (src: string, alt?: string, title?: string) => {
    open({ src, alt, title })
  }

  return {
    state: readonly(state),
    open,
    close,
    show
  }
}
