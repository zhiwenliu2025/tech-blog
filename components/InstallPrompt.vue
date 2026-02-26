<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
    >
      <div
        class="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <!-- macOS 标题栏 -->
        <div
          class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2"
        >
          <div class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-[10px] text-slate-500">pwa.install</span>
          </div>
          <button
            class="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-700 hover:text-slate-400"
            @click="dismissPrompt"
          >
            <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- 内容 -->
        <div class="flex items-start gap-3 p-4">
          <img
            src="/pwa-192x192.png"
            alt="TechBlog"
            class="h-12 w-12 flex-shrink-0 rounded-2xl shadow-md shadow-black/30"
          />
          <div class="min-w-0 flex-1">
            <p class="font-mono text-xs text-primary-400">// app.install</p>
            <h3 class="mt-0.5 text-sm font-semibold text-white">安装应用</h3>
            <p class="mt-0.5 font-mono text-[11px] text-slate-500">添加到主屏幕，获得更好的体验</p>
            <div class="mt-3 flex gap-2">
              <button
                class="flex-1 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                @click="installApp"
              >
                立即安装
              </button>
              <button
                class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:border-slate-600 hover:text-slate-300"
                @click="dismissPrompt"
              >
                稍后
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isProduction = process.env.NODE_ENV === 'production'
const showPrompt = ref(false)

let $pwa: any = null
let isInstallable: any = null
let triggerInstall: any = null

if (isProduction) {
  try {
    $pwa = useNuxtApp().$pwa
    const pwaHelpers = usePWAHelpers()
    isInstallable = pwaHelpers.isInstallable
    triggerInstall = pwaHelpers.triggerInstall
  } catch (e) {
    console.warn('PWA module not available')
  }
}

onMounted(() => {
  if (!isProduction) return
  if (typeof window === 'undefined') return
  if (window.matchMedia('(display-mode: standalone)').matches) return

  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10)
    if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return
  }

  if (isInstallable) {
    watch(
      isInstallable,
      value => {
        if (value) showPrompt.value = true
      },
      { immediate: true }
    )
  }
  if ($pwa?.installPrompt) showPrompt.value = true
})

const installApp = async () => {
  if (!isProduction) return
  if (triggerInstall) {
    const installed = await triggerInstall()
    if (installed) {
      showPrompt.value = false
      return
    }
  }
  if ($pwa?.install) {
    await $pwa.install()
    showPrompt.value = false
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }
}
</script>
