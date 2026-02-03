<template>
  <div class="min-h-screen bg-gray-950 flex flex-col">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Header minimal -->
    <header class="relative py-6 px-4">
      <div class="container mx-auto">
        <NuxtLink to="/" class="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/IC-Gold-TRC20/logo.png" alt="IC-Gold" class="w-10 h-10 rounded-lg object-cover" />
          <span class="text-xl font-bold text-white">IC-Gold</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Main content -->
    <main class="relative flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <!-- Footer minimal -->
    <footer class="relative py-6 px-4 text-center text-gray-500 text-sm">
      <p>© 2024 IC-Gold. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Auth layout - minimal design for login/register pages
</script>
