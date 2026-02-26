<template>
  <div class="relative">
    <!-- 触发按钮 -->
    <button
      class="touch-optimized group inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-700/60 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
      @click="toggleShareMenu"
    >
      <Icon
        name="heroicons:paper-airplane"
        class="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45 group-hover:scale-110"
      />
      <span>分享文章</span>
    </button>

    <!-- 下拉分享菜单（终端窗口风格） -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="showMenu"
        class="absolute left-0 z-50 mt-2 w-64 origin-top-left overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <!-- 终端标题栏 -->
        <div class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5">
          <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span class="ml-2 font-mono text-xs text-slate-500">// share.to</span>
        </div>

        <div class="space-y-2 p-3">
          <!-- 系统分享（仅移动端有） -->
          <button
            v-if="isWebShareSupportedComputed"
            class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-800 px-3 py-2 text-left text-sm text-slate-300 transition-all hover:border-primary-700/50 hover:bg-slate-700 hover:text-white"
            @click="handleWebShare"
          >
            <Icon name="heroicons:device-phone-mobile" class="h-4 w-4 text-primary-400" />
            <span class="font-mono text-xs">系统分享</span>
          </button>

          <!-- 社交平台 3×2 网格 -->
          <div class="grid grid-cols-3 gap-1.5">
            <!-- Twitter -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-sky-700/40 hover:bg-sky-950/60"
              @click="handleShare('twitter')"
            >
              <Icon name="simple-icons:twitter" class="h-4 w-4 text-sky-400" />
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-sky-400"
                >Twitter</span
              >
            </button>
            <!-- Facebook -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-blue-700/40 hover:bg-blue-950/60"
              @click="handleShare('facebook')"
            >
              <Icon name="simple-icons:facebook" class="h-4 w-4 text-blue-400" />
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-blue-400"
                >Facebook</span
              >
            </button>
            <!-- LinkedIn -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-blue-600/40 hover:bg-blue-950/60"
              @click="handleShare('linkedin')"
            >
              <Icon name="simple-icons:linkedin" class="h-4 w-4 text-blue-300" />
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-blue-300"
                >LinkedIn</span
              >
            </button>
            <!-- 微博 -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-red-700/40 hover:bg-red-950/60"
              @click="handleShare('weibo')"
            >
              <svg class="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM8.716 17.69c-.233.544-.809.815-1.286.6-.477-.213-.604-.838-.369-1.386.233-.545.805-.813 1.282-.6.477.212.604.837.373 1.386zm2.267-1.322c-.095.25-.35.373-.57.277-.218-.092-.31-.357-.217-.6.09-.24.344-.363.56-.273.22.093.315.357.227.596zm2.011-4.936c-1.124-.288-2.395-.132-3.402.427-1.027.566-1.682 1.53-1.873 2.582-.188 1.038.142 2.086.85 2.856.715.779 1.745 1.254 2.873 1.373 1.125.117 2.267-.122 3.177-.693 1.033-.65 1.64-1.718 1.702-2.88.062-1.147-.39-2.266-1.2-3.083-.427-.433-.97-.742-1.585-.87l.458.288zm7.386-6.75C18.29 2.685 14.624 1 10.653 1 5.409 1 1 5.038 1 10.044c0 2.843 1.338 5.553 3.592 7.415L4.23 19.89c-.063.188 0 .41.16.535.104.07.223.098.343.098.1 0 .2-.03.29-.086l3.084-2.005c.9.278 1.85.441 2.822.441 5.247 0 9.656-4.039 9.656-9.044 0-2.375-.879-4.621-2.404-6.367z"
                />
              </svg>
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-red-400"
                >微博</span
              >
            </button>
            <!-- Reddit -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-orange-700/40 hover:bg-orange-950/60"
              @click="handleShare('reddit')"
            >
              <Icon name="simple-icons:reddit" class="h-4 w-4 text-orange-400" />
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-orange-400"
                >Reddit</span
              >
            </button>
            <!-- 微信 -->
            <button
              class="group/btn flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-2.5 transition-all hover:border-emerald-700/40 hover:bg-emerald-950/60"
              @click="handleShare('wechat')"
            >
              <Icon name="simple-icons:wechat" class="h-4 w-4 text-emerald-400" />
              <span class="font-mono text-[10px] text-slate-500 group-hover/btn:text-emerald-400"
                >微信</span
              >
            </button>
          </div>

          <!-- 复制链接（终端命令行风格） -->
          <button
            class="group/copy flex w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2 transition-all hover:border-emerald-700/40 hover:bg-slate-800"
            :class="copied ? 'border-emerald-600/60 bg-emerald-950/40' : ''"
            @click="handleShare('copy')"
          >
            <span class="font-mono text-xs text-emerald-500">$</span>
            <span
              class="flex-1 truncate text-left font-mono text-xs text-slate-400 group-hover/copy:text-slate-300"
            >
              {{ copied ? 'link copied!' : 'copy link' }}
            </span>
            <Icon
              :name="copied ? 'heroicons:check' : 'heroicons:clipboard-document'"
              class="h-3.5 w-3.5 flex-shrink-0 transition-colors"
              :class="
                copied ? 'text-emerald-400' : 'text-slate-500 group-hover/copy:text-slate-300'
              "
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- 微信二维码模态框 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showWeChatModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click="showWeChatModal = false"
      >
        <div
          class="w-72 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50"
          @click.stop
        >
          <!-- 终端标题栏 -->
          <div
            class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
          >
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span class="ml-2 font-mono text-xs text-slate-500">// wechat.qrcode</span>
            </div>
            <button
              class="cursor-pointer rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
              @click="showWeChatModal = false"
            >
              <Icon name="heroicons:x-mark" class="h-4 w-4" />
            </button>
          </div>

          <div class="p-5 text-center">
            <p class="mb-4 font-mono text-xs text-slate-500">$ scan to share via wechat</p>
            <div
              class="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border border-slate-700 bg-white"
            >
              <img
                v-if="weChatQrCode"
                :src="weChatQrCode"
                alt="微信分享二维码"
                class="h-full w-full rounded-lg object-contain"
              />
            </div>
            <p class="mt-3 truncate font-mono text-[10px] text-slate-600">
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
const copied = ref(false)

const isWebShareSupportedComputed = computed(() => isWebShareSupported())

const toggleShareMenu = () => {
  showMenu.value = !showMenu.value
}

const closeShareMenu = () => {
  showMenu.value = false
}

const handleWebShare = async () => {
  const url = props.url || getCurrentUrl()
  const shared = await shareViaWebAPI(props.title, props.excerpt || props.title, url)
  if (shared) closeShareMenu()
}

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
      copied.value = true
      setTimeout(() => {
        copied.value = false
        closeShareMenu()
      }, 1500)
      break
  }
}

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
