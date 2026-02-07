<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <UIcon name="i-heroicons-bell" class="w-6 h-6" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between">
          <h3 class="text-white font-semibold">Thông báo</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-amber-500 hover:text-amber-400 text-sm font-medium cursor-pointer"
          >
            Đánh dấu đã đọc
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="loading" class="p-8 text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-gray-500 animate-spin mx-auto" />
          </div>
          <div v-else-if="notifications.length === 0" class="p-8 text-center">
            <UIcon name="i-heroicons-bell-slash" class="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p class="text-gray-400">Không có thông báo</p>
          </div>
          <div v-else class="divide-y divide-gray-800">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer"
              :class="{ 'bg-amber-500/5': !notification.is_read }"
              @click="markAsRead(notification.id)"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="getIconBg(notification.type)"
                >
                  <UIcon :name="getIcon(notification.type)" class="w-4 h-4" :class="getIconColor(notification.type)" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-white font-medium text-sm">{{ notification.title }}</p>
                    <span v-if="!notification.is_read" class="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                  </div>
                  <p class="text-gray-400 text-sm mt-0.5 line-clamp-2">{{ notification.message }}</p>
                  <p class="text-gray-500 text-xs mt-1">{{ formatTime(notification.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notifications.length > 0" class="px-4 py-3 border-t border-gray-700 bg-gray-800/50">
          <NuxtLink
            to="/notifications"
            class="block text-center text-amber-500 hover:text-amber-400 text-sm font-medium"
            @click="isOpen = false"
          >
            Xem tất cả thông báo
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const loading = ref(true)
const notifications = ref<any[]>([])
const unreadCount = ref(0)

async function fetchNotifications() {
  loading.value = true
  try {
    const data = await $fetch('/api/user/notifications?limit=10')
    notifications.value = data.notifications
    unreadCount.value = data.unreadCount
  } catch (e) {
    console.error('Failed to fetch notifications:', e)
  } finally {
    loading.value = false
  }
}

async function markAsRead(id: number) {
  try {
    await $fetch('/api/user/notifications', {
      method: 'POST',
      body: { notificationId: id }
    })
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.is_read) {
      notification.is_read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } catch (e) {
    console.error('Failed to mark as read:', e)
  }
}

async function markAllAsRead() {
  try {
    await $fetch('/api/user/notifications', {
      method: 'POST',
      body: { markAll: true }
    })
    notifications.value.forEach(n => n.is_read = true)
    unreadCount.value = 0
  } catch (e) {
    console.error('Failed to mark all as read:', e)
  }
}

function getIcon(type: string) {
  switch (type) {
    case 'success': return 'i-heroicons-check-circle'
    case 'warning': return 'i-heroicons-exclamation-triangle'
    case 'error': return 'i-heroicons-x-circle'
    default: return 'i-heroicons-information-circle'
  }
}

function getIconBg(type: string) {
  switch (type) {
    case 'success': return 'bg-green-500/20'
    case 'warning': return 'bg-yellow-500/20'
    case 'error': return 'bg-red-500/20'
    default: return 'bg-blue-500/20'
  }
}

function getIconColor(type: string) {
  switch (type) {
    case 'success': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'error': return 'text-red-500'
    default: return 'text-blue-500'
  }
}

function formatTime(date: string) {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

// Fetch on mount and when opened
onMounted(fetchNotifications)
watch(isOpen, (val) => {
  if (val) fetchNotifications()
})

// Auto refresh every 30 seconds
let interval: NodeJS.Timeout
onMounted(() => {
  interval = setInterval(fetchNotifications, 30000)
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>
