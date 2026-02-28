<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Quản lý Ví TRC20 </h1>
      <p class="text-gray-400">Chọn ví nhận tiền nạp từ người dùng</p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="wallet in wallets"
        :key="wallet.address"
        @click="selectWallet(wallet.address)"
        class="bg-gray-900 border rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02]"
        :class="activeWallet === wallet.address ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-800 hover:border-gray-700'"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400 text-sm">Ví #{{ wallet.id }}</span>
          <UBadge v-if="activeWallet === wallet.address" color="primary" variant="subtle">
            Đang hoạt động
          </UBadge>
        </div>

        <div class="flex justify-center mb-4">
          <img
            :src="`/IC-Gold-TRC20/${wallet.address}.jpg`"
            :alt="wallet.address"
            class="w-40 h-40 rounded-lg border border-gray-700"
          />
        </div>

        <div class="bg-gray-800 rounded-lg p-3">
          <p class="text-gray-400 text-xs mb-1">Địa chỉ ví:</p>
          <p class="text-white text-sm font-mono break-all">{{ wallet.address }}</p>
        </div>

        <div class="mt-4 flex justify-center">
          <UButton
            v-if="activeWallet !== wallet.address"
            color="primary"
            size="sm"
            @click.stop="selectWallet(wallet.address)"
          >
            Chọn ví này
          </UButton>
          <UBadge v-else color="success" variant="subtle" size="sm" class="gap-1">
            <UIcon name="i-heroicons-check" class="w-4 h-4" />
            Đã chọn
          </UBadge>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-white font-semibold mb-4">Hướng dẫn</h3>
      <ul class="space-y-2 text-gray-400 text-sm">
        <li class="flex items-start gap-2">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-500 mt-0.5" />
          <span>Chọn một ví để nhận tiền nạp từ người dùng. Người dùng sẽ thấy mã QR và địa chỉ ví đã chọn.</span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-500 mt-0.5" />
          <span>Chỉ nên thay đổi ví khi cần thiết để tránh nhầm lẫn cho người dùng.</span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 mt-0.5" />
          <span>Đảm bảo kiểm tra kỹ trước khi thay đổi ví đang hoạt động.</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastCustom()
const loading = ref(true)
const activeWallet = ref('')
const saving = ref(false)

// List of available wallets from public folder
const wallets = [
  { id: 1, address: 'TBSY63beVMYPydicVB8HhmcNnVKsQ9oM5u' },
  { id: 2, address: 'THKV6EzkiUNz1ekSy5oBKeJgr8GqPddGPQ' },
  { id: 3, address: 'TJNA5L6KCuWxGbnUGoQJWpr6ZEH21xq2Xs' },
  { id: 4, address: 'TJZhJktZMHHTJRt2WQDbdgqp53yUH7BmG8' },
  { id: 5, address: 'TRxKFuHUsMMVn9tCWVqfXZ3UcFEMFyXWiz' },
  { id: 6, address: '0x1f428DfF592B8B6eA9D23962034eF0E1f6B737c9' },
  { id: 7, address: '0xa739271429E7aC055a57357eABee9eF664E01860' }
]

onMounted(async () => {
  try {
    const { data } = await useFetch<{ settings: Record<string, string> }>('/api/admin/settings')
    if (data.value?.settings) {
      activeWallet.value = data?.value?.settings?.trc20_wallet_address ?? (wallets?.length ? wallets[0].address : '')
    }
  } catch (error) {
    toast.error('Lỗi', 'Không thể tải cài đặt')
  } finally {
    loading.value = false
  }
})

async function selectWallet(address: string) {
  if (saving.value || address === activeWallet.value) return
  
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        settings: {
          trc20_wallet_address: address
        }
      }
    })
    activeWallet.value = address
    toast.success('Thành công', 'Đã cập nhật ví nhận tiền')
  } catch (error) {
    toast.error('Lỗi', 'Không thể cập nhật ví')
  } finally {
    saving.value = false
  }
}
</script>
