<template>
  <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/IC-Gold-TRC20/logo.png" alt="IC-Gold" class="w-10 h-10 rounded-lg object-cover" />
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
            <div class="relative" ref="dropdownRef">
              <button 
                @click="toggleDropdown"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ (user.full_name || user.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <span class="hidden sm:block text-sm">{{ user.full_name || user.email }}</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </button>
              
              <!-- Dropdown menu -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="dropdownOpen" 
                  class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50"
                >
                  <NuxtLink 
                    to="/dashboard" 
                    class="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                    @click="dropdownOpen = false"
                  >
                    <UIcon name="i-heroicons-home" class="w-4 h-4" />
                    Dashboard
                  </NuxtLink>
                  <NuxtLink 
                    to="/settings" 
                    class="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                    @click="dropdownOpen = false"
                  >
                    <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4" />
                    Settings
                  </NuxtLink>
                  <NuxtLink 
                    v-if="user?.is_admin"
                    to="/admin" 
                    class="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                    @click="dropdownOpen = false"
                  >
                    <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                    Admin Panel
                  </NuxtLink>
                  <div class="border-t border-gray-700 my-1"></div>
                  <button 
                    @click="handleLogout"
                    class="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left cursor-pointer"
                  >
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </Transition>
            </div>
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
              class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors cursor-pointer"
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

// Dropdown state
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleLogout() {
  dropdownOpen.value = false
  logout()
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}
</script>
