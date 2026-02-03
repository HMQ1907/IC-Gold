<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Quản lý giao dịch</h1>
      <p class="text-gray-300">Xem và duyệt yêu cầu nạp/rút tiền</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-6">
      <USelect
        v-model="selectedType"
        :options="typeOptions"
        placeholder="Loại"
        class="w-40"
      />
      <USelect
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="Trạng thái"
        class="w-40"
      />
    </div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 text-gray-500 animate-spin"
        />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/50">
            <tr>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                ID
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Người dùng
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Loại
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Số tiền
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Trạng thái
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Chi tiết
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Ngày
              </th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="tx in transactions"
              :key="tx.id"
              class="hover:bg-gray-800/50"
            >
              <td class="px-4 py-4 text-gray-300">#{{ tx.id }}</td>
              <td class="px-4 py-4">
                <p class="text-white text-sm">
                  {{ (tx.user as any)?.email || (tx.user as any)?.phone }}
                </p>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="
                    tx.type === 'deposit'
                      ? 'success'
                      : tx.type === 'withdraw'
                        ? 'error'
                        : 'neutral'
                  "
                  variant="subtle"
                  >{{ getTypeLabel(tx.type) }}</UBadge
                >
              </td>
              <td class="px-4 py-4">
                <span class="text-white font-semibold"
                  >${{ tx.amount.toLocaleString() }}</span
                >
              </td>
              <td class="px-4 py-4">
                <UBadge :color="getStatusColor(tx.status)" variant="subtle">{{
                  getStatusLabel(tx.status)
                }}</UBadge>
              </td>
              <td
                class="px-4 py-4 text-gray-300 text-sm max-w-[200px] truncate"
              >
                <template v-if="tx.tx_hash"
                  >TxHash: {{ tx.tx_hash.slice(0, 12) }}...</template
                >
                <template v-else-if="tx.withdraw_address"
                  >To: {{ tx.withdraw_address.slice(0, 12) }}...</template
                >
                <template v-else>-</template>
              </td>
              <td class="px-4 py-4 text-gray-300 text-sm">
                {{ formatDate(tx.created_at) }}
              </td>
              <td class="px-4 py-4">
                <div v-if="tx.status === 'pending'" class="flex gap-2">
                  <UButton
                    color="success"
                    size="xs"
                    :loading="
                      processingId === tx.id && processingAction === 'approve'
                    "
                    @click="processTransaction(tx.id, 'approve')"
                    >Duyệt</UButton
                  >
                  <UButton
                    color="error"
                    variant="outline"
                    size="xs"
                    :loading="
                      processingId === tx.id && processingAction === 'reject'
                    "
                    @click="processTransaction(tx.id, 'reject')"
                    >Từ chối</UButton
                  >
                </div>
                <span v-else class="text-gray-400 text-sm">Đã xử lý</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="totalPages > 1"
        class="p-4 border-t border-gray-800 flex justify-center"
      >
        <UPagination v-model="currentPage" :total="total" :page-count="limit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
const route = useRoute();
const { getTransactions, processTransaction: processTransactionApi } =
  useAdmin();
const loading = ref(true);
const transactions = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);
const limit = 20;
const processingId = ref<number | null>(null);
const processingAction = ref<string | null>(null);

const typeOptions = [
  { label: "Tất cả", value: "" },
  { label: "Nạp tiền", value: "deposit" },
  { label: "Rút tiền", value: "withdraw" },
  { label: "Thưởng giới thiệu", value: "referral_bonus" },
  { label: "Điều chỉnh", value: "admin_adjust" },
];
const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Từ chối", value: "rejected" },
];
const selectedType = ref(typeOptions[0]);
const selectedStatus = ref(
  statusOptions.find((s) => s.value === route.query.status) || statusOptions[0],
);
const totalPages = computed(() => Math.ceil(total.value / limit));

async function loadTransactions() {
  loading.value = true;
  try {
    const result = await getTransactions({
      type: selectedType.value.value || undefined,
      status: selectedStatus.value.value || undefined,
      page: currentPage.value,
      limit,
    });
    transactions.value = result?.data || [];
    total.value = result?.total || 0;
  } catch {
  } finally {
    loading.value = false;
  }
}
onMounted(() => loadTransactions());
watch([selectedType, selectedStatus], () => {
  currentPage.value = 1;
  loadTransactions();
});
watch(currentPage, () => loadTransactions());

async function processTransaction(txId: number, action: "approve" | "reject") {
  processingId.value = txId;
  processingAction.value = action;
  try {
    await processTransactionApi(txId, action);
    loadTransactions();
  } catch {
  } finally {
    processingId.value = null;
    processingAction.value = null;
  }
}

function getTypeLabel(type: string) {
  return (
    {
      deposit: "Nạp tiền",
      withdraw: "Rút tiền",
      referral_bonus: "Thưởng",
      admin_adjust: "Điều chỉnh",
      copy_trade: "Copy Trade",
    }[type] || type
  );
}
function getStatusColor(status: string) {
  return (
    {
      pending: "warning",
      completed: "success",
      rejected: "error",
      cancelled: "neutral",
    }[status] || "neutral"
  );
}
function getStatusLabel(status: string) {
  return (
    {
      pending: "Chờ xử lý",
      completed: "Hoàn thành",
      rejected: "Từ chối",
      cancelled: "Đã hủy",
    }[status] || status
  );
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
</script>
