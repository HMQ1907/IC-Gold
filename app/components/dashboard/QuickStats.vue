<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="stat in stats" :key="stat.label" class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="stat.bgColor">
          <UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
        </div>
        <div>
          <p class="text-gray-400 text-xs">{{ stat.label }}</p>
          <p class="text-white font-semibold">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalDeposits: number
  totalWithdrawals: number
  referralBonus: number
  referralCount: number
}>()

const formatCurrency = (num: number) => '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)

const stats = computed(() => [
  { label: 'Total Deposits', value: formatCurrency(props.totalDeposits), icon: 'i-heroicons-arrow-down-tray', bgColor: 'bg-green-500/20', iconColor: 'text-green-500' },
  { label: 'Total Withdrawals', value: formatCurrency(props.totalWithdrawals), icon: 'i-heroicons-arrow-up-tray', bgColor: 'bg-red-500/20', iconColor: 'text-red-500' },
  { label: 'Referral Bonus', value: formatCurrency(props.referralBonus), icon: 'i-heroicons-gift', bgColor: 'bg-purple-500/20', iconColor: 'text-purple-500' },
  { label: 'Referrals', value: props.referralCount.toString(), icon: 'i-heroicons-users', bgColor: 'bg-blue-500/20', iconColor: 'text-blue-500' }
])
</script>
