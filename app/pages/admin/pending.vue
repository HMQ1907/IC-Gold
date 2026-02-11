<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Quản lý Nạp/Rút</h1>
      <p class="text-gray-300">Duyệt các yêu cầu nạp và rút tiền đang chờ xử lý</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Pending Deposits -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-800 bg-success/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 class="text-white font-semibold">Yêu cầu Nạp tiền</h3>
              <p class="text-gray-200 text-sm">{{ pendingDeposits.length }} yêu cầu đang chờ</p>
            </div>
          </div>
        </div>

        <div v-if="loadingDeposits" class="p-8 text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
        </div>
        <div v-else-if="pendingDeposits.length === 0" class="p-8 text-center">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p class="text-gray-300">Không có yêu cầu nạp tiền nào</p>
        </div>
        <div v-else class="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          <div v-for="tx in pendingDeposits" :key="tx.id" class="p-4 hover:bg-gray-800/50 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-white font-bold text-lg">${{ tx.amount.toLocaleString() }}</span>
                  <UBadge color="warning" variant="subtle" size="xs">Pending</UBadge>
                </div>
                <p class="text-gray-200 text-sm mb-1">
                  <span class="text-gray-300">User:</span> {{ tx.user?.email || tx.user?.phone }}
                </p>
                <p class="text-gray-200 text-sm mb-1" v-if="tx.user?.full_name">
                  <span class="text-gray-300">Tên:</span> {{ tx.user.full_name }}
                </p>
                <p class="text-gray-300 text-xs mb-2" v-if="tx.tx_hash">
                  TxHash: {{ tx.tx_hash.slice(0, 20) }}...
                </p>
                <!-- Referral Hierarchy -->
                <div v-if="tx.user?.referral_hierarchy" class="mt-2 p-2 bg-gray-800/50 rounded-lg">
                  <p class="text-gray-300 text-xs mb-1">Chuỗi giới thiệu:</p>
                  <div class="flex items-center gap-1 flex-wrap text-xs">
                    <template v-if="tx.user.referral_hierarchy.grandparent">
                      <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                        👴 {{ tx.user.referral_hierarchy.grandparent }}
                      </span>
                      <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-400" />
                    </template>
                    <template v-if="tx.user.referral_hierarchy.parent">
                      <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        👨 {{ tx.user.referral_hierarchy.parent }}
                      </span>
                      <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-400" />
                    </template>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      👶 {{ tx.user?.email || tx.user?.phone }}
                    </span>
                  </div>
                </div>
                <p class="text-gray-300 text-xs mt-2">{{ formatDate(tx.created_at) }}</p>
              </div>
              <div class="flex flex-col gap-2 min-w-[100px]">
                <UButton color="success" block :loading="processingId === tx.id && processingAction === 'approve'"
                  :disabled="processingId === tx.id" @click="processTransaction(tx.id, 'approve')"
                  icon="i-heroicons-check">
                  Duyệt
                </UButton>
                <UButton color="error" variant="outline" block
                  :loading="processingId === tx.id && processingAction === 'reject'" :disabled="processingId === tx.id"
                  @click="processTransaction(tx.id, 'reject')" icon="i-heroicons-x-mark">
                  Từ chối
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Withdrawals -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-800 bg-error/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-error" />
            </div>
            <div>
              <h3 class="text-white font-semibold">Yêu cầu Rút tiền</h3>
              <p class="text-gray-200 text-sm">{{ pendingWithdrawals.length }} yêu cầu đang chờ</p>
            </div>
          </div>
        </div>

        <div v-if="loadingWithdrawals" class="p-8 text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
        </div>
        <div v-else-if="pendingWithdrawals.length === 0" class="p-8 text-center">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p class="text-gray-300">Không có yêu cầu rút tiền nào</p>
        </div>
        <div v-else class="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          <div v-for="tx in pendingWithdrawals" :key="tx.id" class="p-4 hover:bg-gray-800/50 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-white font-bold text-lg">${{ tx.amount.toLocaleString() }}</span>
                  <UBadge color="warning" variant="subtle" size="xs">Pending</UBadge>
                </div>
                <p class="text-gray-200 text-sm mb-1">
                  <span class="text-gray-300">User:</span> {{ tx.user?.email || tx.user?.phone }}
                </p>
                <p class="text-gray-200 text-sm mb-1" v-if="tx.user?.full_name">
                  <span class="text-gray-300">Tên:</span> {{ tx.user.full_name }}
                </p>
                <p class="text-gray-200 text-sm mb-1" v-if="tx.user?.balance !== undefined">
                  <span class="text-gray-300">Số dư hiện tại:</span>
                  <span class="text-primary font-semibold">${{ tx.user.balance.toLocaleString() }}</span>
                </p>
                <p class="text-gray-300 text-xs mb-2 break-all" v-if="tx.withdraw_address">
                  Đến: {{ tx.withdraw_address }}
                </p>
                <!-- Referral Hierarchy -->
                <div v-if="tx.user?.referral_hierarchy" class="mt-2 p-2 bg-gray-800/50 rounded-lg">
                  <p class="text-gray-300 text-xs mb-1">Chuỗi giới thiệu:</p>
                  <div class="flex items-center gap-1 flex-wrap text-xs">
                    <template v-if="tx.user.referral_hierarchy.grandparent">
                      <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                        👴 {{ tx.user.referral_hierarchy.grandparent }}
                      </span>
                      <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-400" />
                    </template>
                    <template v-if="tx.user.referral_hierarchy.parent">
                      <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        👨 {{ tx.user.referral_hierarchy.parent }}
                      </span>
                      <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-400" />
                    </template>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      👶 {{ tx.user?.email || tx.user?.phone }}
                    </span>
                  </div>
                </div>
                <p class="text-gray-300 text-xs mt-2">{{ formatDate(tx.created_at) }}</p>
              </div>
              <div class="flex flex-col gap-2 min-w-[100px]">
                <UButton color="success" block :loading="processingId === tx.id && processingAction === 'approve'"
                  :disabled="processingId === tx.id" @click="processTransaction(tx.id, 'approve')"
                  icon="i-heroicons-check">
                  Duyệt
                </UButton>
                <UButton color="error" variant="outline" block
                  :loading="processingId === tx.id && processingAction === 'reject'" :disabled="processingId === tx.id"
                  @click="processTransaction(tx.id, 'reject')" icon="i-heroicons-x-mark">
                  Từ chối
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastCustom()
const loadingDeposits = ref(true)
const loadingWithdrawals = ref(true)
const pendingDeposits = ref<any[]>([])
const pendingWithdrawals = ref<any[]>([])
const processingId = ref<number | null>(null)
const processingAction = ref<string | null>(null)

async function fetchPendingTransactions() {
  loadingDeposits.value = true
  loadingWithdrawals.value = true

  try {
    const data = await $fetch('/api/admin/pending-transactions')
    if (data) {
      pendingDeposits.value = data.deposits || []
      pendingWithdrawals.value = data.withdrawals || []
    }
  } catch (error) {
    console.error('Failed to fetch pending transactions:', error)
  } finally {
    loadingDeposits.value = false
    loadingWithdrawals.value = false
  }
}

async function processTransaction(txId: number, action: 'approve' | 'reject') {
  processingId.value = txId
  processingAction.value = action

  try {
    await $fetch('/api/admin/approve-transaction', {
      method: 'POST',
      body: { transactionId: txId, action }
    })

    toast.success(action === 'approve' ? 'Đã duyệt giao dịch' : 'Đã từ chối giao dịch')

    // Remove from local list immediately
    pendingDeposits.value = pendingDeposits.value.filter(tx => tx.id !== txId)
    pendingWithdrawals.value = pendingWithdrawals.value.filter(tx => tx.id !== txId)
  } catch (err: any) {
    toast.error('Lỗi', err?.data?.message || err.message || 'Có lỗi xảy ra')
  } finally {
    processingId.value = null
    processingAction.value = null
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

onMounted(fetchPendingTransactions)
</script>
