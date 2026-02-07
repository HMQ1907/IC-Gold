<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
    <!-- PageLoading tắt hẳn — overlay gây bóng trắng mờ khi chuyển trang -->
    <LayoutToast />
  </UApp>
</template>

<script setup lang="ts">
// Initialize auth on app mount
const { init } = useAuth()
const route = useRoute()

// Đóng mọi overlay khi chuyển trang (tránh bóng trắng mờ còn sót từ modal/dropdown)
const overlay = useOverlay()
const overlayCleanupTimers = new Map<symbol, ReturnType<typeof setTimeout>>()

function forceCleanupOverlays() {
  // Đóng tất cả overlay đang mở
  overlay.closeAll()
  // Unmount mạnh tay những overlay bị kẹt (mounted nhưng không open)
  setTimeout(() => {
    for (const o of overlay.overlays) {
      if (o?.isMounted && !o?.isOpen) {
        try {
          overlay.unmount(o.id)
        } catch {
          // ignore
        }
      }
    }
  }, 250)
}

watch(() => route.path, () => {
  nextTick(() => forceCleanupOverlays())
}, { immediate: false })

// Dọn overlay "kẹt" sau các tương tác (thường gây màn hình phủ xám, click lại mới hết)
watch(
  () => overlay.overlays.map(o => ({ id: o.id, isOpen: o.isOpen, isMounted: o.isMounted })),
  (list) => {
    for (const o of list) {
      // Nếu overlay đã đóng nhưng còn mounted quá lâu -> unmount
      if (o.isMounted && !o.isOpen) {
        if (overlayCleanupTimers.has(o.id)) continue
        overlayCleanupTimers.set(o.id, setTimeout(() => {
          overlayCleanupTimers.delete(o.id)
          try {
            // overlay có thể đã bị remove khỏi list
            if (overlay.isOpen(o.id) === false) overlay.unmount(o.id)
          } catch {
            // ignore
          }
        }, 400))
      } else {
        const t = overlayCleanupTimers.get(o.id)
        if (t) {
          clearTimeout(t)
          overlayCleanupTimers.delete(o.id)
        }
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    await init()
  } catch (e) {
    console.error('Auth init error:', e)
  }
  nextTick(() => forceCleanupOverlays())
})
</script>

<!-- <style>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> -->
