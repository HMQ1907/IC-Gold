<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Bảng điều khiển Admin</h1>
      <p class="text-gray-300">Tổng quan hệ thống</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Tổng người dùng</p><p class="text-2xl font-bold text-white">{{ stats?.totalUsers || 0 }}</p></div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-500" /></div>
        </div>
        <p class="text-green-500 text-sm mt-2">+{{ stats?.newUsers24h || 0 }} trong 24h</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Tổng nạp</p><p class="text-2xl font-bold text-white">${{ formatNumber(stats?.totalDeposits || 0) }}</p></div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-green-500" /></div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Tổng rút</p><p class="text-2xl font-bold text-white">${{ formatNumber(stats?.totalWithdrawals || 0) }}</p></div>
          <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-arrow-up-tray" class="w-6 h-6 text-red-500" /></div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Chờ xử lý</p><p class="text-2xl font-bold text-white">{{ stats?.pendingTransactions || 0 }}</p></div>
          <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-500" /></div>
        </div>
        <NuxtLink to="/admin/transactions?status=pending" class="text-amber-500 text-sm mt-2 block">Xem chi tiết →</NuxtLink>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Tổng số dư người dùng</p><p class="text-2xl font-bold text-white">${{ formatNumber(stats?.totalUserBalance || 0) }}</p></div>
          <div class="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-wallet" class="w-6 h-6 text-amber-500" /></div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div><p class="text-gray-300 text-sm">Lợi nhuận ròng</p><p class="text-2xl font-bold text-green-500">${{ formatNumber((stats?.totalDeposits || 0) - (stats?.totalWithdrawals || 0)) }}</p></div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"><UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-500" /></div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 class="text-white font-semibold mb-4">Thao tác nhanh</h3>
        <div class="space-y-3">
          <NuxtLink to="/admin/users" class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-500" />
            <span class="font-medium">Quản lý người dùng</span>
          </NuxtLink>
          <NuxtLink to="/admin/transactions" class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer">
            <UIcon name="i-heroicons-banknotes" class="w-5 h-5 text-green-500" />
            <span class="font-medium">Xem giao dịch</span>
          </NuxtLink>
          <NuxtLink to="/admin/wallets" class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer">
            <UIcon name="i-heroicons-wallet" class="w-5 h-5 text-amber-500" />
            <span class="font-medium">Quản lý ví TRC20</span>
          </NuxtLink>
          <NuxtLink to="/admin/settings" class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-purple-500" />
            <span class="font-medium">Cài đặt hệ thống</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 class="text-white font-semibold mb-4">Giao dịch chờ xử lý</h3>
        <div v-if="loading" class="text-center py-4"><UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-gray-400 animate-spin" /></div>
        <div v-else-if="!pendingTransactions.length" class="text-center py-4 text-gray-400">Không có giao dịch chờ xử lý</div>
        <div v-else class="space-y-2">
          <div v-for="tx in pendingTransactions.slice(0, 5)" :key="tx.id" class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div><p class="text-white text-sm">{{ (tx.user as any)?.email }}</p><p class="text-gray-300 text-xs">{{ tx.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền' }} ${{ tx.amount }}</p></div>
            <UButton to="/admin/transactions?status=pending" color="primary" size="xs">Xử lý</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { getDashboardStats, getTransactions } = useAdmin()
const loading = ref(true)
const stats = ref<any>(null)
const pendingTransactions = ref<any[]>([])

onMounted(async () => {
  try {
    const [statsData, txData] = await Promise.all([getDashboardStats(), getTransactions({ status: 'pending', limit: 5 })])
    stats.value = statsData
    pendingTransactions.value = txData?.data || []
  } catch {} finally { loading.value = false }
})

function formatNumber(num: number): string { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) }
</script>
