<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-white font-semibold text-lg">Copy Trade</h3>
        <p class="text-gray-400 text-sm">Automatically copy trades from experts</p>
      </div>
      <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="canCopyTrade ? 'bg-amber-500/20' : 'bg-gray-800'">
        <UIcon name="i-heroicons-document-duplicate" class="w-6 h-6" :class="canCopyTrade ? 'text-amber-500' : 'text-gray-500'" />
      </div>
    </div>

    <div class="bg-gray-800/50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Current Balance</span>
        <span class="text-white font-bold text-lg">${{ formatNumber(balance) }}</span>
      </div>
      <div class="flex items-center justify-between mt-2">
        <span class="text-gray-400">Minimum Required</span>
        <span class="text-amber-500 font-medium">$1,000</span>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="text-gray-400">Progress</span>
        <span class="text-white">{{ Math.min(100, (balance / 1000) * 100).toFixed(0) }}%</span>
      </div>
      <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500" :style="{ width: Math.min(100, (balance / 1000) * 100) + '%' }"></div>
      </div>
    </div>

    <UTooltip v-if="!canCopyTrade" text="Copy Trade is only available for accounts with balance of $1,000 or more" :popper="{ placement: 'top' }">
      <UButton color="neutral" block size="lg" disabled class="opacity-50 cursor-not-allowed">
        <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 mr-2" />
        Copy Trade (Not Eligible)
      </UButton>
    </UTooltip>

    <UButton v-else-if="!isCopying" color="primary" block size="lg" :loading="loading" @click="startCopyTrade">
      <UIcon name="i-heroicons-play" class="w-5 h-5 mr-2" />
      Start Copy Trade
    </UButton>

    <div v-else class="space-y-3">
      <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
        <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p class="text-green-400 font-semibold">Successfully Copied!</p>
        <p class="text-white text-lg font-bold mt-1">{{ copyPercentage }}% of total assets</p>
        <p class="text-gray-400 text-sm mt-1">= ${{ formatNumber(balance * copyPercentage / 100) }}</p>
      </div>
      <UButton color="red" variant="outline" block :loading="loading" @click="stopCopyTrade">
        <UIcon name="i-heroicons-stop" class="w-5 h-5 mr-2" />
        Stop Copy Trade
      </UButton>
    </div>

    <div class="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
      <div class="flex gap-2">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p class="text-amber-200 text-sm">Copy Trade will automatically copy 5% of your assets following expert trades. Profits are added directly to your account.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, refreshUser } = useAuth()
const toast = useToast()
const balance = computed(() => user.value?.balance || 0)
const canCopyTrade = computed(() => balance.value >= 1000)
const loading = ref(false)
const isCopying = ref(false)
const copyPercentage = ref(5)

onMounted(() => { isCopying.value = user.value?.copy_trade_active || false })
watch(() => user.value?.copy_trade_active, (newVal) => { isCopying.value = newVal || false })

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

async function startCopyTrade() {
  if (!canCopyTrade.value) return
  loading.value = true
  try {
    const { error } = await useFetch('/api/trade/copy', { method: 'POST', body: { action: 'start', percentage: copyPercentage.value } })
    if (error.value) throw new Error(error.value.data?.message || 'Failed to start Copy Trade')
    isCopying.value = true
    await refreshUser()
    toast.add({ title: 'Copy Trade started!', description: `Copying ${copyPercentage.value}% of assets ($${formatNumber(balance.value * copyPercentage.value / 100)})`, color: 'green' })
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'red' })
  } finally { loading.value = false }
}

async function stopCopyTrade() {
  loading.value = true
  try {
    const { error } = await useFetch('/api/trade/copy', { method: 'POST', body: { action: 'stop' } })
    if (error.value) throw new Error(error.value.data?.message || 'Failed to stop Copy Trade')
    isCopying.value = false
    await refreshUser()
    toast.add({ title: 'Copy Trade stopped', color: 'gray' })
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'red' })
  } finally { loading.value = false }
}
</script>
