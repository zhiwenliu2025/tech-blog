<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- 离线/在线状态提示 -->
    <OfflineIndicator />
    <!-- PWA 安装提示（仅在生产环境显示） -->
    <InstallPrompt v-if="isProduction" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const isProduction = process.env.NODE_ENV === 'production'
</script>
