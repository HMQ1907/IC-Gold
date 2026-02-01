<template>
  <nav
    v-if="user"
    class="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
  >
    <div class="flex items-center justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
        active-class="!text-amber-500"
      >
        <UIcon :name="item.icon" class="w-6 h-6" />
        <span class="text-xs">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user } = useAuth()

const navItems = [
  { to: '/dashboard', label: 'Home', icon: 'i-heroicons-home' },
  { to: '/trade', label: 'Trade', icon: 'i-heroicons-chart-bar' },
  { to: '/wallet/deposit', label: 'Deposit', icon: 'i-heroicons-plus-circle' },
  { to: '/wallet/withdraw', label: 'Withdraw', icon: 'i-heroicons-minus-circle' },
  { to: '/settings', label: 'Settings', icon: 'i-heroicons-cog-6-tooth' },
]
</script>
