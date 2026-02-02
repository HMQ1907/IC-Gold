<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto min-w-[320px] max-w-[420px] rounded-lg shadow-lg p-4 flex items-start gap-3"
        :class="toastClass(toast.type)"
      >
        <div class="flex-shrink-0">
          <UIcon :name="toastIcon(toast.type)" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">{{ toast.title }}</p>
          <p v-if="toast.description" class="text-sm opacity-90 mt-1">{{ toast.description }}</p>
        </div>
        <button
          @click="remove(toast.id)"
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToastCustom()

function toastClass(type: string | undefined) {
  switch (type) {
    case 'success':
      return 'bg-green-600 text-white'
    case 'error':
      return 'bg-red-600 text-white'
    case 'warning':
      return 'bg-yellow-500 text-white'
    case 'info':
    default:
      return 'bg-blue-600 text-white'
  }
}

function toastIcon(type: string | undefined) {
  switch (type) {
    case 'success':
      return 'i-heroicons-check-circle'
    case 'error':
      return 'i-heroicons-x-circle'
    case 'warning':
      return 'i-heroicons-exclamation-triangle'
    case 'info':
    default:
      return 'i-heroicons-information-circle'
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
