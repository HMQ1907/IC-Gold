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
          autocomplete="off"
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
                Đã giới thiệu
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
              <th class="px-4 py-3 text-left text-gray-200 font-medium text-sm">
                Hành động
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
                  v-if="user.referral_children && user.referral_children.length > 0"
                  class="flex flex-col gap-2 text-xs max-w-[250px]"
                >
                  <div
                    v-for="(child, idx) in user.referral_children"
                    :key="idx"
                    class="flex flex-col gap-0.5"
                  >
                    <div class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      <div class="font-medium">👤 {{ child.name }}</div>
                      <div class="text-blue-300/70 text-xs">{{ truncateEmail(child.email) }}</div>
                    </div>
                    <div 
                      v-if="child.grandchildren && child.grandchildren.length > 0"
                      class="ml-3 flex flex-col gap-0.5"
                    >
                      <div 
                        v-for="(gc, gcIdx) in child.grandchildren" 
                        :key="gcIdx"
                        class="px-2 py-1 bg-green-500/20 text-green-400 rounded"
                      >
                        <div class="font-medium">↳ {{ gc.name }}</div>
                        <div class="text-green-300/70 text-xs">{{ truncateEmail(gc.email) }}</div>
                      </div>
                    </div>
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
              <td class="px-4 py-4">
                <UButton
                  color="warning"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-key"
                  @click="openResetPasswordModal(user)"
                >
                  Đổi MK
                </UButton>
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

    <!-- Bulk Adjust by Fixed Amount -->
    <UCard
      class="mt-6 bg-gray-900 border border-gray-700"
    >
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-green-500" />
            <h3 class="text-white font-semibold text-lg">Điều chỉnh số dư theo số tiền</h3>
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

          <!-- Fixed Amount Input -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Số tiền điều chỉnh ($)</label
            >
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium"
                  >$</span
                >
                <input
                  v-model.number="fixedAmount"
                  type="number"
                  step="0.01"
                  placeholder="VD: 100 để cộng $100, -50 để trừ $50"
                  class="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>
            <div class="flex gap-2 mt-3">
              <UButton
                v-for="preset in [-100, -50, -10, 10, 50, 100, 500, 1000]"
                :key="preset"
                type="button"
                size="xs"
                :color="preset > 0 ? 'success' : 'error'"
                variant="soft"
                @click.stop="fixedAmount = preset"
              >
                {{ preset > 0 ? "+" : "" }}${{ preset }}
              </UButton>
            </div>
          </div>

          <!-- Preview Changes -->
          <div
            v-if="fixedAmount"
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
                      fixedAmount >= 0 ? 'text-green-400' : 'text-red-400'
                    "
                    class="font-medium"
                  >
                    ${{ calculateNewBalanceFixed(user.balance).toLocaleString() }}
                  </span>
                  <span
                    :class="
                      fixedAmount >= 0
                        ? 'text-green-400/60'
                        : 'text-red-400/60'
                    "
                    class="text-xs"
                  >
                    ({{ fixedAmount >= 0 ? "+" : "" }}${{
                      fixedAmount.toLocaleString()
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
                :class="fixedAmount >= 0 ? 'text-green-400' : 'text-red-400'"
                class="text-lg"
              >
                ${{ totalNewBalanceFixed.toLocaleString() }}
              </span>
            </div>
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Ghi chú</label
            >
            <textarea
              v-model="fixedNote"
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
            color="success"
            variant="outline"
            :loading="fixedAdjusting"
            :disabled="!fixedAmount"
            type="button"
            @click="submitFixedAdjust"
          >
            {{ fixedAdjusting ? "Đang xử lý..." : "Xác nhận điều chỉnh" }}
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Reset Password Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showResetPasswordModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="showResetPasswordModal = false"
          />

          <!-- Modal Content -->
          <div class="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between gap-3 p-6 border-b border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-key" class="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 class="text-white font-semibold">Đổi mật khẩu người dùng</h3>
                  <p class="text-gray-400 text-sm">{{ resetPasswordUser?.email || resetPasswordUser?.phone }}</p>
                </div>
              </div>
              <button
                @click="showResetPasswordModal = false"
                class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Mật khẩu mới</label>
                <input
                  v-model="newPasswordInput"
                  type="password"
                  placeholder="Nhập mật khẩu mới..."
                  autocomplete="new-password"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <p class="text-gray-500 text-xs mt-1">Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu</label>
                <input
                  v-model="confirmPasswordInput"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới..."
                  autocomplete="new-password"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-6 border-t border-gray-700">
              <button
                @click="showResetPasswordModal = false"
                class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                :disabled="!newPasswordInput || newPasswordInput !== confirmPasswordInput || resettingPassword"
                @click="submitResetPassword"
                class="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <UIcon v-if="resettingPassword" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                {{ resettingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

// Fixed amount state
const fixedAmount = ref<number | null>(null);
const fixedNote = ref("");
const fixedAdjusting = ref(false);

// Password reset state
const showResetPasswordModal = ref(false);
const resetPasswordUser = ref<any>(null);
const newPasswordInput = ref("");
const confirmPasswordInput = ref("");
const resettingPassword = ref(false);

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

// Fixed amount computed
const totalNewBalanceFixed = computed(() =>
  selectedUsers.value.reduce(
    (sum, user) => sum + calculateNewBalanceFixed(user.balance),
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
  bulkPercentage.value = null;
  bulkNote.value = "";
  fixedAmount.value = null;
  fixedNote.value = "";
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

function calculateNewBalanceFixed(currentBalance: number): number {
  if (!fixedAmount.value) return currentBalance;
  const newBalance = currentBalance + fixedAmount.value;
  return Math.round(Math.max(0, newBalance) * 100) / 100;
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
    await loadUsers();
  } catch {
    toast.error("Lỗi", "Đã xảy ra lỗi khi điều chỉnh số dư");
  } finally {
    bulkAdjusting.value = false;
  }
}

async function submitFixedAdjust() {
  if (!fixedAmount.value || selectedUsers.value.length === 0) return;

  fixedAdjusting.value = true;
  let successCount = 0;
  let errorCount = 0;

  try {
    for (const user of selectedUsers.value) {
      try {
        await adjustBalance(
          user.id,
          fixedAmount.value,
          fixedNote.value || `Điều chỉnh ${fixedAmount.value >= 0 ? '+' : ''}$${fixedAmount.value} vào số dư`,
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
    fixedAmount.value = null;
    fixedNote.value = "";
    await loadUsers();
  } catch {
    toast.error("Lỗi", "Đã xảy ra lỗi khi điều chỉnh số dư");
  } finally {
    fixedAdjusting.value = false;
  }
}

function openResetPasswordModal(user: any) {
  resetPasswordUser.value = user;
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
  showResetPasswordModal.value = true;
}

async function submitResetPassword() {
  if (!resetPasswordUser.value || !newPasswordInput.value) return;
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    toast.error("Lỗi", "Mật khẩu không khớp");
    return;
  }

  resettingPassword.value = true;
  try {
    await $fetch('/api/admin/reset-password', {
      method: 'POST',
      body: {
        userId: resetPasswordUser.value.id,
        newPassword: newPasswordInput.value
      }
    });
    toast.success("Đã đổi mật khẩu thành công");
    showResetPasswordModal.value = false;
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    resetPasswordUser.value = null;
  } catch (err: any) {
    toast.error("Lỗi", err?.data?.message || "Không thể đổi mật khẩu");
  } finally {
    resettingPassword.value = false;
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
