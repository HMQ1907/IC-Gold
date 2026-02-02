<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
    <LayoutPageLoading />
    <LayoutToast />
  </UApp>
</template>

<script setup lang="ts">
// Initialize auth on app mount
const { init } = useAuth()

onMounted(async () => {
  try {
    await init()
  } catch (e) {
    console.error('Auth init error:', e)
  }
})
</script>

<style>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
