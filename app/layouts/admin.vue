<template>
  <div class="min-h-screen bg-gray-950 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex lg:flex-col w-64 bg-gray-900 border-r border-gray-800">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-800">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span class="text-xl font-bold text-gray-900">IC</span>
          </div>
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
            <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          block
          class="mt-2"
          @click="logout"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
          Logout
        </UButton>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center justify-between p-4">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span class="text-sm font-bold text-gray-900">IC</span>
          </div>
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

    <!-- Mobile menu -->
    <UDrawer v-model:open="mobileMenuOpen">
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

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'i-heroicons-home' },
  { to: '/admin/users', label: 'Manage Users', icon: 'i-heroicons-users' },
  { to: '/admin/transactions', label: 'Transactions', icon: 'i-heroicons-banknotes' },
  { to: '/admin/settings', label: 'Settings', icon: 'i-heroicons-cog-6-tooth' },
]
</script>
