<template>
  <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span class="text-xl font-bold text-gray-900">IC</span>
          </div>
          <span class="text-xl font-bold text-white hidden sm:block">IC-Gold</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            active-class="!text-amber-500 !bg-amber-500/10"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <button
            v-if="user"
            class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors relative"
          >
            <UIcon name="i-heroicons-bell" class="w-5 h-5" />
          </button>

          <!-- User menu -->
          <template v-if="user">
            <UDropdownMenu :items="userMenuItems">
              <button class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm">
                  {{ (user.full_name || user.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <span class="hidden sm:block text-sm">{{ user.full_name || user.email }}</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </button>
            </UDropdownMenu>
          </template>

          <!-- Auth buttons -->
          <template v-else>
            <NuxtLink 
              to="/auth/login" 
              class="px-4 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-gray-800 transition-colors font-medium"
            >
              Sign In
            </NuxtLink>
            <NuxtLink 
              to="/auth/register" 
              class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold transition-colors"
            >
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const navItems = computed(() => {
  if (!user.value) {
    return [
      { to: '/', label: 'Home' },
      { to: '/trade', label: 'Trade' },
      { to: '/support/faq', label: 'FAQ' },
      { to: '/support/terms', label: 'Terms' },
    ]
  }
  return [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/trade', label: 'Trade' },
    { to: '/wallet/deposit', label: 'Deposit' },
    { to: '/wallet/withdraw', label: 'Withdraw' },
    { to: '/referral', label: 'Referral' },
  ]
})

const userMenuItems = computed(() => [
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
  }],
  [...(user.value?.is_admin ? [{
    label: 'Admin Panel',
    icon: 'i-heroicons-shield-check',
    to: '/admin'
  }] : [])],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: logout
  }]
])
</script>
