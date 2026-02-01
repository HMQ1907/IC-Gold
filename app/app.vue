<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UToaster />
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
