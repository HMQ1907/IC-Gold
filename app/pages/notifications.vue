<template>
  <div class="min-h-screen bg-gray-950">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Thông báo</h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới' }}
          </p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors cursor-pointer"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
      </div>

      <!-- Empty -->
      <div v-else-if="notifications.length === 0" class="text-center py-16">
        <UIcon name="i-heroicons-bell-slash" class="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">Không có thông báo nào</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-2">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
          :class="{ 'border-l-2 border-l-amber-500 bg-amber-500/5': !notification.is_read }"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              :class="getIconBg(notification.type)"
            >
              <UIcon :name="getIcon(notification.type)" class="w-5 h-5" :class="getIconColor(notification.type)" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-white font-medium">{{ notification.title }}</p>
                <span v-if="!notification.is_read" class="w-2 h-2 bg-amber-500 rounded-full shrink-0"></span>
              </div>
              <p class="text-gray-400 text-sm">{{ notification.message }}</p>
              <p class="text-gray-500 text-xs mt-2">{{ formatTime(notification.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="text-center pt-4">
          <UButton
            color="neutral"
            variant="outline"
            :loading="loadingMore"
            @click="loadMore"
          >
            Tải thêm
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const loading = ref(true)
const loadingMore = ref(false)
const notifications = ref<any[]>([])
const unreadCount = ref(0)
const currentLimit = ref(30)
const hasMore = ref(false)

async function fetchNotifications(loadMore = false) {
  if (loadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const data = await $fetch('/api/user/notifications', {
      params: { limit: currentLimit.value }
    })
    notifications.value = data.notifications
    unreadCount.value = data.unreadCount
    hasMore.value = data.notifications.length >= currentLimit.value
  } catch (e) {
    console.error('Failed to fetch notifications:', e)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadMore() {
  currentLimit.value += 30
  fetchNotifications(true)
}

async function markAsRead(id: number) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification?.is_read) return

  try {
    await $fetch('/api/user/notifications', {
      method: 'POST',
      body: { notificationId: id }
    })
    if (notification) {
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
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

onMounted(() => fetchNotifications())
</script>
