<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- 离线/在线状态提示 -->
    <OfflineIndicator />
    <!-- PWA 安装提示 -->
    <InstallPrompt />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
