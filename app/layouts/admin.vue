<template>
  <div class="min-h-screen bg-gray-950 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-gray-900 border-r border-gray-800">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-800">
        <NuxtLink to="/admin/users" class="flex items-center gap-2">
          <img src="/IC-Gold-TRC20/logo.png" alt="IC-Gold" class="w-10 h-10 rounded-lg object-cover" />
          <div>
            <span class="text-xl font-bold text-white">IC-Gold</span>
            <span class="block text-xs text-amber-500">Admin Panel</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          active-class="!text-amber-500 !bg-amber-500/10"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User info -->
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3 px-4 py-3">
          <UAvatar
            :alt="user?.full_name || 'Admin'"
            size="sm"
            class="bg-amber-500"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.full_name || 'Admin' }}</p>
            <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="soft"
          block
          class="mt-2"
          icon="i-heroicons-arrow-right-on-rectangle"
          @click="logout"
        >
          Đăng xuất
        </UButton>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center justify-between p-4">
        <NuxtLink to="/admin/users" class="flex items-center gap-2">
          <img src="/IC-Gold-TRC20/logo.png" alt="IC-Gold" class="w-8 h-8 rounded-lg object-cover" />
          <span class="font-bold text-white">Admin</span>
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-bars-3"
          @click="mobileMenuOpen = true"
        />
      </div>
    </div>

    <!-- Mobile menu — chỉ hiện trên màn hình nhỏ, tránh menu trùng (phần khoanh đỏ) trên desktop -->
    <UDrawer v-model:open="mobileMenuOpen" v-if="isMobile">
      <div class="p-4 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          active-class="!text-amber-500 !bg-amber-500/10"
          @click="mobileMenuOpen = false"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </UDrawer>

    <!-- Main content -->
    <main class="flex-1 lg:overflow-auto">
      <div class="pt-16 lg:pt-0">
        <slot />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const { user, logout } = useAuth()
const route = useRoute()

// Chỉ render drawer trên mobile (tránh menu trùng / phần khoanh đỏ trên desktop)
const isMobile = ref(false)
const checkMobile = () => { isMobile.value = window.innerWidth < 1024 }
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Đóng drawer khi chuyển trang
watch(() => route.path, () => {
  mobileMenuOpen.value = false
}, { immediate: false })

const navItems = [
  { to: '/admin/users', label: 'Quản lý Users', icon: 'i-heroicons-users' },
  { to: '/admin/pending', label: 'Duyệt Nạp/Rút', icon: 'i-heroicons-clock' },
  { to: '/admin/daily-copy-trade', label: 'Copy Trade/ngày', icon: 'i-heroicons-currency-dollar' },
  { to: '/admin/transactions', label: 'Lịch sử GD', icon: 'i-heroicons-banknotes' },
  { to: '/admin/wallets', label: 'Ví TRC20', icon: 'i-heroicons-wallet' },
  { to: '/admin/settings', label: 'Cài đặt', icon: 'i-heroicons-cog-6-tooth' },
]
</script>
