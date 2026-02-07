<template>
  <div></div>
</template>

<script setup lang="ts">
// Redirect /admin to /admin/users
definePageMeta({
  middleware: () => {
    return navigateTo('/admin/users', { replace: true })
  }
})
</script>
