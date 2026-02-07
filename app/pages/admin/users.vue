<template>
  <div class="p-6">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Quản lý người dùng</h1>
        <p class="text-gray-300">Xem và quản lý tất cả người dùng</p>
      </div>
    </div>

    <!-- Search and Bulk Actions -->
    <div
      class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div class="relative max-w-md w-full">
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Tìm kiếm theo email, SĐT hoặc tên..."
          class="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          @input="debouncedSearch"
        />
      </div>

      <!-- Bulk Actions Bar -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-if="selectedUsers.length > 0"
          class="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2"
        >
          <span class="text-amber-500 font-medium"
            >{{ selectedUsers.length }} đã chọn</span
          >
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            @click="clearSelection"
          >
            Bỏ chọn
          </UButton>
        </div>
      </Transition>
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
              <th class="px-4 py-3 text-left">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isPartiallySelected"
                    @change="toggleSelectAll"
                    class="w-5 h-5 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                ID
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Người dùng
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Số dư
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Mã giới thiệu
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Chuỗi giới thiệu
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Trạng thái
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Copy Trade
              </th>
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-gray-800/50"
              :class="{ 'bg-amber-500/10': isUserSelected(user.id) }"
            >
              <td class="px-4 py-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="isUserSelected(user.id)"
                    @change="toggleUserSelection(user)"
                    class="w-5 h-5 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
              </td>
              <td class="px-4 py-4 text-white">#{{ user.id }}</td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <!-- <UAvatar
                    :alt="user.full_name || user.email || ''"
                    size="sm"
                    class="bg-gray-700"
                  /> -->
                  <div>
                    <p class="text-white font-medium">
                      {{ user.full_name || "N/A" }}
                    </p>
                    <p class="text-gray-200 text-sm">
                      {{ user.email || user.phone }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="text-white font-bold"
                  >${{ user.balance.toLocaleString() }}</span
                >
              </td>
              <td class="px-4 py-4">
                <code class="text-gray-200 text-sm">{{
                  user.referral_code
                }}</code>
                <p class="text-gray-300 text-xs">
                  {{ user.referral_uses }}/{{ user.max_referral_uses }}
                </p>
              </td>
              <td class="px-4 py-4">
                <div
                  v-if="
                    user.referral_hierarchy?.parent ||
                    user.referral_hierarchy?.grandparent
                  "
                  class="flex flex-col gap-1 text-xs"
                >
                  <div
                    v-if="user.referral_hierarchy?.grandparent"
                    class="flex items-center gap-1"
                  >
                    <span
                      class="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded"
                      >👴
                      {{
                        truncateEmail(user.referral_hierarchy.grandparent)
                      }}</span
                    >
                  </div>
                  <div
                    v-if="user.referral_hierarchy?.parent"
                    class="flex items-center gap-1"
                  >
                    <span
                      class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded"
                      >👨
                      {{ truncateEmail(user.referral_hierarchy.parent) }}</span
                    >
                  </div>
                  <div class="flex items-center gap-1">
                    <span
                      class="px-2 py-0.5 bg-green-500/20 text-green-400 rounded"
                      >👶 {{ truncateEmail(user.email || user.phone) }}</span
                    >
                  </div>
                </div>
                <span v-else class="text-gray-300 text-xs">Không có</span>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="user.is_active ? 'success' : 'error'"
                  variant="solid"
                >
                  {{ user.is_active ? "Hoạt động" : "Ngừng" }}
                </UBadge>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="user.copy_trade_active ? 'success' : 'error'"
                  :variant="user.copy_trade_active ? 'solid' : 'subtle'"
                  size="md"
                >
                  {{ user.copy_trade_active ? "Đang bật" : "Chưa bật" }}
                </UBadge>
              </td>
              <td class="px-4 py-4 text-gray-200 text-sm">
                {{ formatDate(user.created_at) }}
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

    <!-- Bulk Adjust (inline) -->
    <UCard
      class="mt-6 bg-gray-900 border border-gray-700"
    >
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-primary" />
            <h3 class="text-white font-semibold text-lg">Điều chỉnh số dư theo %</h3>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            type="button"
            @click="clearSelection"
          />
        </div>
      </template>

      <div class="space-y-5">
          <!-- Selected Users Info -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p class="text-gray-400 text-sm mb-2">
              Đã chọn {{ selectedUsers.length }} người dùng:
            </p>
            <div class="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              <span
                v-for="user in selectedUsers"
                :key="user.id"
                class="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg text-sm text-white"
              >
                {{ user.email || user.phone }}
                <span class="text-amber-500 font-medium"
                  >${{ user.balance.toLocaleString() }}</span
                >
              </span>
            </div>
          </div>

          <!-- Total Balance Preview -->
          <div
            class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
          >
            <p class="text-gray-300 text-sm mb-1">Tổng số dư hiện tại:</p>
            <p class="text-amber-500 font-bold text-2xl">
              ${{ totalSelectedBalance.toLocaleString() }}
            </p>
          </div>

          <!-- Percentage Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Phần trăm điều chỉnh (%)</label
            >
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  v-model.number="bulkPercentage"
                  type="number"
                  step="0.1"
                  placeholder="VD: 10 để tăng 10%, -5 để giảm 5%"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium"
                  >%</span
                >
              </div>
            </div>
            <div class="flex gap-2 mt-3">
              <UButton
                v-for="preset in [-10, -5, 5, 10, 20, 50]"
                :key="preset"
                type="button"
                size="xs"
                :color="preset > 0 ? 'success' : 'error'"
                variant="soft"
                @click.stop="bulkPercentage = preset"
              >
                {{ preset > 0 ? "+" : "" }}{{ preset }}%
              </UButton>
            </div>
          </div>

          <!-- Preview Changes -->
          <div
            v-if="bulkPercentage"
            class="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
          >
            <p class="text-gray-300 text-sm mb-3">Xem trước thay đổi:</p>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <div
                v-for="user in selectedUsers"
                :key="user.id"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-400">{{
                  user.email || user.phone
                }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400"
                    >${{ user.balance.toLocaleString() }}</span
                  >
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="w-4 h-4 text-gray-500"
                  />
                  <span
                    :class="
                      bulkPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                    "
                    class="font-medium"
                  >
                    ${{ calculateNewBalance(user.balance).toLocaleString() }}
                  </span>
                  <span
                    :class="
                      bulkPercentage >= 0
                        ? 'text-green-400/60'
                        : 'text-red-400/60'
                    "
                    class="text-xs"
                  >
                    ({{ bulkPercentage >= 0 ? "+" : "" }}${{
                      calculateAdjustment(user.balance).toLocaleString()
                    }})
                  </span>
                </div>
              </div>
            </div>
            <div
              class="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between font-medium"
            >
              <span class="text-gray-300">Tổng sau điều chỉnh:</span>
              <span
                :class="bulkPercentage >= 0 ? 'text-green-400' : 'text-red-400'"
                class="text-lg"
              >
                ${{ totalNewBalance.toLocaleString() }}
              </span>
            </div>
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Ghi chú</label
            >
            <textarea
              v-model="bulkNote"
              placeholder="Lý do điều chỉnh..."
              rows="2"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            ></textarea>
          </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            class="cursor-pointer"
            color="neutral"
            variant="outline"
            type="button"
            @click="clearSelection"
          >
            Hủy
          </UButton>
          <UButton
            class="cursor-pointer"
            color="primary"
            variant="outline"
            :loading="bulkAdjusting"
            :disabled="!bulkPercentage"
            type="button"
            @click="submitBulkAdjust"
          >
            {{ bulkAdjusting ? "Đang xử lý..." : "Xác nhận điều chỉnh" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
definePageMeta({ layout: "admin", middleware: "admin" });
const { getUsers, adjustBalance } = useAdmin();
const toast = useToastCustom();
const loading = ref(true);
const users = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);
const limit = 20;
const search = ref("");
const totalPages = computed(() => Math.ceil(total.value / limit));

// Bulk selection state
const selectedUsers = ref<any[]>([]);
const bulkPercentage = ref<number | null>(null);
const bulkNote = ref("");
const bulkAdjusting = ref(false);

// Computed properties for selection
const isAllSelected = computed(
  () =>
    users.value.length > 0 && selectedUsers.value.length === users.value.length,
);
const isPartiallySelected = computed(
  () =>
    selectedUsers.value.length > 0 &&
    selectedUsers.value.length < users.value.length,
);
const totalSelectedBalance = computed(() =>
  selectedUsers.value.reduce((sum, user) => sum + (user.balance || 0), 0),
);
const totalNewBalance = computed(() =>
  selectedUsers.value.reduce(
    (sum, user) => sum + calculateNewBalance(user.balance),
    0,
  ),
);

function isUserSelected(userId: number) {
  return selectedUsers.value.some((u) => u.id === userId);
}

function toggleUserSelection(user: any) {
  const index = selectedUsers.value.findIndex((u) => u.id === user.id);
  if (index === -1) {
    selectedUsers.value.push(user);
  } else {
    selectedUsers.value.splice(index, 1);
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = [...users.value];
  }
}

function clearSelection() {
  selectedUsers.value = [];
}

function calculateNewBalance(currentBalance: number): number {
  if (!bulkPercentage.value) return currentBalance;
  const adjustment = currentBalance * (bulkPercentage.value / 100);
  return Math.round((currentBalance + adjustment) * 100) / 100;
}

function calculateAdjustment(currentBalance: number): number {
  if (!bulkPercentage.value) return 0;
  return Math.round(currentBalance * (bulkPercentage.value / 100) * 100) / 100;
}

async function submitBulkAdjust() {
  if (!bulkPercentage.value || selectedUsers.value.length === 0) return;

  bulkAdjusting.value = true;
  let successCount = 0;
  let errorCount = 0;

  try {
    for (const user of selectedUsers.value) {
      const adjustmentAmount = calculateAdjustment(user.balance);
      try {
        await adjustBalance(
          user.id,
          adjustmentAmount,
          bulkNote.value || `Điều chỉnh ${bulkPercentage.value}% số dư`,
        );
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Đã điều chỉnh thành công ${successCount} người dùng`);
    }
    if (errorCount > 0) {
      toast.error("Lỗi", `${errorCount} người dùng không thể điều chỉnh`);
    }

    clearSelection();
    loadUsers();
  } catch {
    toast.error("Lỗi", "Đã xảy ra lỗi khi điều chỉnh số dư");
  } finally {
    bulkAdjusting.value = false;
  }
}

async function loadUsers() {
  loading.value = true;
  try {
    const result = await getUsers({
      search: search.value || undefined,
      page: currentPage.value,
      limit,
    });
    users.value = result?.data || [];
    total.value = result?.total || 0;
    // Clear selection when users change
    clearSelection();
  } catch {
  } finally {
    loading.value = false;
  }
}
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  loadUsers();
}, 500);
onMounted(() => loadUsers());

watch(currentPage, () => loadUsers());

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
function truncateEmail(email: string | undefined): string {
  if (!email) return "";
  if (email.length <= 15) return email;
  if (email.includes("@")) {
    const [name, domain] = email.split("@");
    if (name.length > 8) {
      return name.slice(0, 6) + "..@" + domain;
    }
  }
  return email.slice(0, 12) + "...";
}
</script>
