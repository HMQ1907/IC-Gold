<template>
  <div class="p-6">
    <div class="mb-8"><h1 class="text-2xl font-bold text-white mb-2">Manage Transactions</h1><p class="text-gray-400">View and approve deposit/withdrawal requests</p></div>

    <div class="flex flex-wrap gap-4 mb-6">
      <USelect v-model="selectedType" :options="typeOptions" placeholder="Type" class="w-40" />
      <USelect v-model="selectedStatus" :options="statusOptions" placeholder="Status" class="w-40" />
    </div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" /></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/50">
            <tr>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">ID</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">User</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Type</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Amount</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Status</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Details</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Date</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-800/50">
              <td class="px-4 py-4 text-gray-400">#{{ tx.id }}</td>
              <td class="px-4 py-4"><p class="text-white text-sm">{{ (tx.user as any)?.email || (tx.user as any)?.phone }}</p></td>
              <td class="px-4 py-4"><UBadge :color="tx.type === 'deposit' ? 'green' : tx.type === 'withdraw' ? 'red' : 'gray'" variant="subtle">{{ getTypeLabel(tx.type) }}</UBadge></td>
              <td class="px-4 py-4"><span class="text-white font-semibold">${{ tx.amount.toLocaleString() }}</span></td>
              <td class="px-4 py-4"><UBadge :color="getStatusColor(tx.status)" variant="subtle">{{ getStatusLabel(tx.status) }}</UBadge></td>
              <td class="px-4 py-4 text-gray-400 text-sm max-w-[200px] truncate">
                <template v-if="tx.tx_hash">TxHash: {{ tx.tx_hash.slice(0, 12) }}...</template>
                <template v-else-if="tx.withdraw_address">To: {{ tx.withdraw_address.slice(0, 12) }}...</template>
                <template v-else>-</template>
              </td>
              <td class="px-4 py-4 text-gray-400 text-sm">{{ formatDate(tx.created_at) }}</td>
              <td class="px-4 py-4">
                <div v-if="tx.status === 'pending'" class="flex gap-2">
                  <UButton color="green" size="xs" :loading="processingId === tx.id && processingAction === 'approve'" @click="processTransaction(tx.id, 'approve')">Approve</UButton>
                  <UButton color="red" variant="outline" size="xs" :loading="processingId === tx.id && processingAction === 'reject'" @click="processTransaction(tx.id, 'reject')">Reject</UButton>
                </div>
                <span v-else class="text-gray-500 text-sm">Processed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-800 flex justify-center"><UPagination v-model="currentPage" :total="total" :page-count="limit" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute()
const { getTransactions, processTransaction: processTransactionApi } = useAdmin()
const loading = ref(true)
const transactions = ref<any[]>([])
const currentPage = ref(1)
const total = ref(0)
const limit = 20
const processingId = ref<number | null>(null)
const processingAction = ref<string | null>(null)

const typeOptions = [{ label: 'All', value: '' }, { label: 'Deposit', value: 'deposit' }, { label: 'Withdrawal', value: 'withdraw' }, { label: 'Referral Bonus', value: 'referral_bonus' }, { label: 'Adjustment', value: 'admin_adjust' }]
const statusOptions = [{ label: 'All', value: '' }, { label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }, { label: 'Rejected', value: 'rejected' }]
const selectedType = ref(typeOptions[0])
const selectedStatus = ref(statusOptions.find(s => s.value === route.query.status) || statusOptions[0])
const totalPages = computed(() => Math.ceil(total.value / limit))

async function loadTransactions() { loading.value = true; try { const result = await getTransactions({ type: selectedType.value.value || undefined, status: selectedStatus.value.value || undefined, page: currentPage.value, limit }); transactions.value = result?.data || []; total.value = result?.total || 0 } catch {} finally { loading.value = false } }
onMounted(() => loadTransactions())
watch([selectedType, selectedStatus], () => { currentPage.value = 1; loadTransactions() })
watch(currentPage, () => loadTransactions())

async function processTransaction(txId: number, action: 'approve' | 'reject') { processingId.value = txId; processingAction.value = action; try { await processTransactionApi(txId, action); loadTransactions() } catch {} finally { processingId.value = null; processingAction.value = null } }

function getTypeLabel(type: string) { return { deposit: 'Deposit', withdraw: 'Withdrawal', referral_bonus: 'Bonus', admin_adjust: 'Adjustment', copy_trade: 'Copy Trade' }[type] || type }
function getStatusColor(status: string) { return { pending: 'yellow', completed: 'green', rejected: 'red', cancelled: 'gray' }[status] || 'gray' }
function getStatusLabel(status: string) { return { pending: 'Pending', completed: 'Completed', rejected: 'Rejected', cancelled: 'Cancelled' }[status] || status }
function formatDate(date: string) { return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date)) }
</script>
