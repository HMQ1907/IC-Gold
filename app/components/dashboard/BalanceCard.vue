<template>
  <div class="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="text-amber-100 text-sm mb-1">Total Balance</p>
        <h2 class="text-3xl font-bold">${{ formatNumber(balance) }}</h2>
      </div>
      <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        <UIcon name="i-heroicons-wallet" class="w-6 h-6" />
      </div>
    </div>

    <div class="flex gap-3 mt-6">
      <UButton to="/wallet/deposit" color="white" variant="solid" class="flex-1">
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
        Deposit
      </UButton>
      <UButton to="/wallet/withdraw" color="white" variant="outline" class="flex-1 !text-white !border-white/50 hover:!bg-white/10">
        <UIcon name="i-heroicons-minus" class="w-4 h-4 mr-1" />
        Withdraw
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ balance: number }>()

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}
</script>
