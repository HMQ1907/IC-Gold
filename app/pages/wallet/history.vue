<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Transaction History</h1>
      <p class="text-gray-400">View all your transactions</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-6">
      <USelect v-model="selectedType" :options="typeOptions" placeholder="Type" class="w-40" />
      <USelect v-model="selectedStatus" :options="statusOptions" placeholder="Status" class="w-40" />
    </div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
      </div>

      <div v-else-if="!transactions?.length" class="p-8 text-center">
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p class="text-gray-500">No transactions yet</p>
      </div>

      <div v-else>
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-800/50">
              <tr>
                <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Type</th>
                <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Amount</th>
                <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Status</th>
                <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Details</th>
                <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-800/50">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getStyle(tx.type).bgColor">
                      <UIcon :name="getStyle(tx.type).icon" class="w-4 h-4" :class="getStyle(tx.type).iconColor" />
                    </div>
                    <span class="text-white">{{ getLabel(tx.type) }}</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <span class="font-semibold" :class="tx.type === 'withdraw' ? 'text-red-500' : 'text-green-500'">
                    {{ tx.type === 'withdraw' ? '-' : '+' }}${{ tx.amount.toLocaleString() }}
                  </span>
                </td>
                <td class="px-4 py-4"><UBadge :color="getStatusColor(tx.status)" variant="subtle">{{ getStatusLabel(tx.status) }}</UBadge></td>
                <td class="px-4 py-4 text-gray-400 text-sm max-w-[200px] truncate">
                  <template v-if="tx.tx_hash">TxHash: {{ tx.tx_hash.slice(0, 8) }}...</template>
                  <template v-else-if="tx.withdraw_address">To: {{ tx.withdraw_address.slice(0, 8) }}...</template>
                  <template v-else>-</template>
                </td>
                <td class="px-4 py-4 text-gray-400 text-sm">{{ formatDate(tx.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden divide-y divide-gray-800">
          <div v-for="tx in transactions" :key="tx.id" class="p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getStyle(tx.type).bgColor">
                  <UIcon :name="getStyle(tx.type).icon" class="w-4 h-4" :class="getStyle(tx.type).iconColor" />
                </div>
                <span class="text-white font-medium">{{ getLabel(tx.type) }}</span>
              </div>
              <span class="font-semibold" :class="tx.type === 'withdraw' ? 'text-red-500' : 'text-green-500'">
                {{ tx.type === 'withdraw' ? '-' : '+' }}${{ tx.amount.toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <UBadge :color="getStatusColor(tx.status)" variant="subtle" size="xs">{{ getStatusLabel(tx.status) }}</UBadge>
              <span class="text-gray-500 text-sm">{{ formatDate(tx.created_at) }}</span>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="p-4 border-t border-gray-800 flex justify-center">
          <UPagination v-model="currentPage" :total="total" :page-count="limit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~~/server/utils/supabase'
definePageMeta({ middleware: 'auth' })
const { getTransactions } = useWallet()
const loading = ref(true)
const transactions = ref<Transaction[]>([])
const currentPage = ref(1)
const total = ref(0)
const limit = 20

const typeOptions = [{ label: 'All', value: '' }, { label: 'Deposit', value: 'deposit' }, { label: 'Withdrawal', value: 'withdraw' }, { label: 'Referral Bonus', value: 'referral_bonus' }, { label: 'Adjustment', value: 'admin_adjust' }]
const statusOptions = [{ label: 'All', value: '' }, { label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }, { label: 'Rejected', value: 'rejected' }]
const selectedType = ref(typeOptions[0])
const selectedStatus = ref(statusOptions[0])
const totalPages = computed(() => Math.ceil(total.value / limit))

async function loadTransactions() {
  loading.value = true
  try {
    const result = await getTransactions({ type: selectedType.value.value || undefined, status: selectedStatus.value.value || undefined, page: currentPage.value, limit })
    transactions.value = result?.data || []
    total.value = result?.total || 0
  } catch {} finally { loading.value = false }
}

onMounted(() => loadTransactions())
watch([selectedType, selectedStatus], () => { currentPage.value = 1; loadTransactions() })
watch(currentPage, () => loadTransactions())

const styles: Record<string, any> = {
  deposit: { icon: 'i-heroicons-arrow-down-tray', bgColor: 'bg-green-500/20', iconColor: 'text-green-500' },
  withdraw: { icon: 'i-heroicons-arrow-up-tray', bgColor: 'bg-red-500/20', iconColor: 'text-red-500' },
  referral_bonus: { icon: 'i-heroicons-gift', bgColor: 'bg-purple-500/20', iconColor: 'text-purple-500' },
  admin_adjust: { icon: 'i-heroicons-adjustments-horizontal', bgColor: 'bg-blue-500/20', iconColor: 'text-blue-500' },
  copy_trade: { icon: 'i-heroicons-document-duplicate', bgColor: 'bg-amber-500/20', iconColor: 'text-amber-500' }
}
function getStyle(type: string) { return styles[type] || styles.deposit }
function getLabel(type: string) { return { deposit: 'Deposit', withdraw: 'Withdrawal', referral_bonus: 'Referral Bonus', admin_adjust: 'Adjustment', copy_trade: 'Copy Trade' }[type] || type }
function getStatusColor(status: string) { return { pending: 'yellow', completed: 'green', rejected: 'red', cancelled: 'gray' }[status] || 'gray' }
function getStatusLabel(status: string) { return { pending: 'Pending', completed: 'Completed', rejected: 'Rejected', cancelled: 'Cancelled' }[status] || status }
function formatDate(date: string) { return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date)) }
</script>
