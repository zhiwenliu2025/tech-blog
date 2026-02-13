<template>
  <div>
    <NuxtRouteAnnouncer />
    <OfflineIndicator />
    <InstallPrompt v-if="isProduction" />
    <BackToTop />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ImageLightbox />
  </div>
</template>

<script setup lang="ts">
const isProduction = process.env.NODE_ENV === 'production'
</script>
