<template>
  <div class="min-h-screen bg-gray-950">
    <LayoutHeader />
    <main class="pb-20 lg:pb-0">
      <slot />
    </main>
    <LayoutFooter />
    <LayoutMobileNav />
    
  </div>
</template>

<script setup lang="ts">
// Default layout with header, footer and mobile nav
</script>
