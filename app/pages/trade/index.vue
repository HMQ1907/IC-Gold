<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Trade</h1>
      <p class="text-gray-400">Track markets and Copy Trade from experts</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <TradeTradingViewWidget :height="550" />
      </div>
      <div class="space-y-6">
        <TradeCopyTradeButton />
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">Available Balance</span>
            <UBadge color="primary" variant="subtle">{{ canCopyTrade ? 'Eligible' : 'Not Eligible' }}</UBadge>
          </div>
          <p class="text-3xl font-bold text-white mb-4">${{ formatNumber(user?.balance || 0) }}</p>
          <div class="flex gap-2">
            <UButton to="/wallet/deposit" color="primary" size="sm" class="flex-1">Deposit More</UButton>
            <UButton to="/wallet/withdraw" color="neutral" variant="outline" size="sm" class="flex-1">Withdraw</UButton>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8"><TradeMarketTable /></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user } = useAuth()
const canCopyTrade = computed(() => (user.value?.balance || 0) >= 1000)
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}
</script>
