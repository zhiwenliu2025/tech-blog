<template>
  <div class="relative">
    <!-- 分享按钮 -->
    <button
      class="touch-optimized flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      @click="toggleShareMenu"
    >
      <Icon name="heroicons:share" class="h-5 w-5" />
      <span>分享</span>
    </button>

    <!-- 分享菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showMenu"
        class="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/60"
      >
        <div class="p-2">
          <!-- Web Share API -->
          <button
            v-if="isWebShareSupportedComputed"
            class="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
            @click="handleWebShare"
          >
            <Icon name="heroicons:device-phone-mobile" class="h-5 w-5 text-primary-500" />
            <span>使用系统分享</span>
          </button>
          <div
            v-if="isWebShareSupportedComputed"
            class="my-1.5 border-t border-gray-100 dark:border-gray-700/60"
          />

          <!-- 社交媒体 grid -->
          <div class="grid grid-cols-3 gap-1">
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('twitter')"
            >
              <Icon name="simple-icons:twitter" class="h-5 w-5 text-[#1DA1F2]" />
              <span>Twitter</span>
            </button>
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('facebook')"
            >
              <Icon name="simple-icons:facebook" class="h-5 w-5 text-[#1877F2]" />
              <span>Facebook</span>
            </button>
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('linkedin')"
            >
              <Icon name="simple-icons:linkedin" class="h-5 w-5 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </button>
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('weibo')"
            >
              <svg class="h-5 w-5 text-[#E6162D]" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M9.517 24c-2.345-.011-4.69-.051-6.99-.169-1.8-.09-3.573-.225-4.9-1.672-.03-.033 0-.78.105-1.14.825-2.79 2.76-4.44 5.955-5.655.39-.15 1.155-.315 1.29-.36.06-.03.06-.36.06-.645 0-1.17.03-2.34.06-3.495.09-3.75.54-6.975 1.5-10.05.33-1.08.72-2.1 1.23-3.06.27-.51.555-.99.885-1.44.27-.36.27-.36.6-.36.18 0 .33.03.45.12.15.12.24.33.3.6.12.45.18.9.21 1.38.06.81.12 1.62.12 2.43 0 .81-.06 1.62-.12 2.4-.06.54-.12 1.08-.24 1.59-.06.3-.15.57-.27.84-.06.15-.12.27-.18.42 0 .06-.03.12-.03.18 0 .12.03.21.09.3.06.12.15.21.24.3.15.12.33.21.51.27.21.09.45.12.69.12.24 0 .48-.03.69-.12.18-.06.36-.15.51-.27.09-.09.18-.18.24-.3.06-.09.09-.18.09-.3 0-.06-.03-.12-.03-.18-.06-.15-.12-.27-.18-.42-.12-.27-.21-.54-.27-.84-.12-.51-.18-1.05-.24-1.59-.06-.78-.12-1.59-.12-2.4 0-.81.06-1.62.12-2.43.03-.48.09-.93.21-1.38.06-.27.15-.48.3-.6.12-.09.27-.12.45-.12.33 0 .33 0 .6.36.33.45.615.93.885 1.44.51.96.9 1.98 1.23 3.06.96 3.075 1.41 6.3 1.5 10.05.03 1.155.06 2.325.06 3.495 0 .285 0 .615.06.645.135.045.9.21 1.29.36 3.195 1.215 5.13 2.865 5.955 5.655.105.36.135 1.107.105 1.14-1.327 1.447-3.1 1.582-4.9 1.672-2.3.118-4.645.158-6.99.169z"
                />
              </svg>
              <span>微博</span>
            </button>
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('reddit')"
            >
              <Icon name="simple-icons:reddit" class="h-5 w-5 text-[#FF4500]" />
              <span>Reddit</span>
            </button>
            <button
              class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
              @click="handleShare('wechat')"
            >
              <Icon name="simple-icons:wechat" class="h-5 w-5 text-[#07C160]" />
              <span>微信</span>
            </button>
          </div>

          <div class="my-1.5 border-t border-gray-100 dark:border-gray-700/60" />

          <!-- 复制链接 -->
          <button
            class="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
            @click="handleShare('copy')"
          >
            <Icon name="heroicons:link" class="h-4 w-4 text-gray-400" />
            <span>复制链接</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- 微信二维码模态框 -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showWeChatModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="showWeChatModal = false"
      >
        <div
          class="w-72 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-2xl dark:border-gray-700/60 dark:bg-gray-800"
          @click.stop
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/60"
          >
            <div class="flex items-center gap-2">
              <Icon name="simple-icons:wechat" class="h-5 w-5 text-[#07C160]" />
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">微信分享</h3>
            </div>
            <button
              class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              @click="showWeChatModal = false"
            >
              <Icon name="heroicons:x-mark" class="h-4 w-4" />
            </button>
          </div>
          <div class="p-5 text-center">
            <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">使用微信扫描二维码分享</p>
            <div
              class="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
            >
              <img
                v-if="weChatQrCode"
                :src="weChatQrCode"
                alt="微信分享二维码"
                class="h-full w-full rounded-xl object-contain"
              />
            </div>
            <p class="mt-3 truncate text-[11px] text-gray-400 dark:text-gray-500">
              {{ shareUrl }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  url?: string
  excerpt?: string
  coverImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  excerpt: '',
  coverImage: ''
})

const {
  getCurrentUrl,
  isWebShareSupported,
  shareViaWebAPI,
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn,
  shareToReddit,
  shareToWeibo,
  shareToWeChat,
  copyLink
} = useShare()

const showMenu = ref(false)
const showWeChatModal = ref(false)
const weChatQrCode = ref('')
const shareUrl = ref('')

const isWebShareSupportedComputed = computed(() => isWebShareSupported())

// 切换分享菜单
const toggleShareMenu = () => {
  showMenu.value = !showMenu.value
}

// 关闭分享菜单
const closeShareMenu = () => {
  showMenu.value = false
}

// 处理 Web Share API
const handleWebShare = async () => {
  const url = props.url || getCurrentUrl()
  const shared = await shareViaWebAPI(props.title, props.excerpt || props.title, url)

  if (shared) {
    closeShareMenu()
  }
}

// 处理分享
const handleShare = async (platform: string) => {
  const url = props.url || getCurrentUrl()
  shareUrl.value = url

  switch (platform) {
    case 'twitter':
      shareToTwitter(props.title, url)
      closeShareMenu()
      break

    case 'facebook':
      shareToFacebook(url)
      closeShareMenu()
      break

    case 'linkedin':
      shareToLinkedIn(props.title, url, props.excerpt)
      closeShareMenu()
      break

    case 'reddit':
      shareToReddit(props.title, url)
      closeShareMenu()
      break

    case 'weibo':
      shareToWeibo(props.title, url, props.coverImage)
      closeShareMenu()
      break

    case 'wechat': {
      const weChatData = shareToWeChat(url, props.title)
      weChatQrCode.value = weChatData.qrCodeUrl
      showWeChatModal.value = true
      closeShareMenu()
      break
    }

    case 'copy':
      await copyLink(url)
      closeShareMenu()
      break
  }
}

// 点击外部关闭菜单
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (showMenu.value && !target.closest('.relative')) {
      closeShareMenu()
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleClickOutside)
    }
  })
})
</script>
