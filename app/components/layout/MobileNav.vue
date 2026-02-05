<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
    <div class="flex items-center justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-3 py-2 text-gray-400 hover:text-gray-200 transition-colors"
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
const { t } = useI18n()

const navItems = computed(() => {
  if (!user.value) {
    // Menu for guests
    return [
      { to: '/', label: t('nav.home'), icon: 'i-heroicons-home' },
      { to: '/trade', label: t('nav.trade'), icon: 'i-heroicons-chart-bar' },
      { to: '/support/faq', label: t('nav.faq'), icon: 'i-heroicons-question-mark-circle' },
      { to: '/auth/login', label: t('nav.signIn'), icon: 'i-heroicons-arrow-right-on-rectangle' },
    ]
  }
  // Menu for logged-in users
  return [
    { to: '/dashboard', label: t('nav.home'), icon: 'i-heroicons-home' },
    { to: '/trade', label: t('nav.trade'), icon: 'i-heroicons-chart-bar' },
    { to: '/wallet/deposit', label: t('nav.deposit'), icon: 'i-heroicons-plus-circle' },
    { to: '/wallet/withdraw', label: t('nav.withdraw'), icon: 'i-heroicons-minus-circle' },
    { to: '/settings', label: t('nav.settings'), icon: 'i-heroicons-cog-6-tooth' },
  ]
})
</script>
