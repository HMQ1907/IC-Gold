<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Bảng điều khiển Admin</h1>
      <p class="text-gray-300">Tổng quan hệ thống</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Tổng người dùng</p>
            <p class="text-2xl font-bold text-white">
              {{ stats?.totalUsers || 0 }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <UBadge color="success" variant="subtle" size="xs" class="mt-2"
          >+{{ stats?.newUsers24h || 0 }} trong 24h</UBadge
        >
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Tổng nạp</p>
            <p class="text-2xl font-bold text-white">
              ${{ formatNumber(stats?.totalDeposits || 0) }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-arrow-down-tray"
              class="w-6 h-6 text-green-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Tổng rút</p>
            <p class="text-2xl font-bold text-white">
              ${{ formatNumber(stats?.totalWithdrawals || 0) }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-arrow-up-tray"
              class="w-6 h-6 text-red-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Chờ xử lý</p>
            <p class="text-2xl font-bold text-white">
              {{ stats?.pendingTransactions || 0 }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <UButton
          to="/admin/transactions?status=pending"
          color="primary"
          variant="link"
          size="xs"
          class="mt-2 p-0"
          >Xem chi tiết →</UButton
        >
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Tổng số dư người dùng</p>
            <p class="text-2xl font-bold text-white">
              ${{ formatNumber(stats?.totalUserBalance || 0) }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon name="i-heroicons-wallet" class="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">Lợi nhuận ròng</p>
            <p class="text-2xl font-bold text-green-500">
              ${{
                formatNumber(
                  (stats?.totalDeposits || 0) - (stats?.totalWithdrawals || 0),
                )
              }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chart-bar"
              class="w-6 h-6 text-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
const { getDashboardStats } = useAdmin();
const loading = ref(true);
const stats = ref<any>(null);

onMounted(async () => {
  try {
    stats.value = await getDashboardStats();
  } catch {
  } finally {
    loading.value = false;
  }
});

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
</script>
