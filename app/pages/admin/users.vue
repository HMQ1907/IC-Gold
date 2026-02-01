<template>
  <div class="p-6">
    <div class="mb-8 flex items-center justify-between">
      <div><h1 class="text-2xl font-bold text-white mb-2">Manage Users</h1><p class="text-gray-400">View and manage all users</p></div>
    </div>

    <div class="mb-6"><UInput v-model="search" placeholder="Search by email, phone or name..." icon="i-heroicons-magnifying-glass" size="lg" class="max-w-md" @input="debouncedSearch" /></div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" /></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/50">
            <tr>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">ID</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">User</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Balance</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Referral</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Status</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Created</th>
              <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-800/50">
              <td class="px-4 py-4 text-gray-400">#{{ user.id }}</td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar :alt="user.full_name || user.email || ''" size="sm" class="bg-gray-700" />
                  <div><p class="text-white font-medium">{{ user.full_name || 'N/A' }}</p><p class="text-gray-500 text-sm">{{ user.email || user.phone }}</p></div>
                </div>
              </td>
              <td class="px-4 py-4"><span class="text-amber-500 font-bold">${{ user.balance.toLocaleString() }}</span></td>
              <td class="px-4 py-4"><code class="text-gray-400 text-sm">{{ user.referral_code }}</code><p class="text-gray-500 text-xs">{{ user.referral_uses }}/{{ user.max_referral_uses }}</p></td>
              <td class="px-4 py-4"><UBadge :color="user.is_active ? 'green' : 'red'" variant="subtle">{{ user.is_active ? 'Active' : 'Inactive' }}</UBadge></td>
              <td class="px-4 py-4 text-gray-400 text-sm">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-4"><UDropdownMenu :items="getUserActions(user)"><UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical" /></UDropdownMenu></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-800 flex justify-center"><UPagination v-model="currentPage" :total="total" :page-count="limit" /></div>
    </div>

    <UModal v-model="showAdjustModal">
      <UCard class="bg-gray-900">
        <template #header><h3 class="text-white font-semibold">Adjust Balance</h3></template>
        <div class="space-y-4">
          <p class="text-gray-400">User: <span class="text-white">{{ selectedUser?.email }}</span></p>
          <p class="text-gray-400">Current Balance: <span class="text-amber-500">${{ selectedUser?.balance.toLocaleString() }}</span></p>
          <UFormField label="Adjustment Amount"><UInput v-model.number="adjustAmount" type="number" placeholder="Positive to add, negative to subtract" /></UFormField>
          <UFormField label="Note"><UTextarea v-model="adjustNote" placeholder="Reason for adjustment..." /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showAdjustModal = false">Cancel</UButton>
            <UButton color="primary" :loading="adjusting" @click="submitAdjust">Confirm</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { getUsers, adjustBalance } = useAdmin()
const loading = ref(true)
const users = ref<any[]>([])
const currentPage = ref(1)
const total = ref(0)
const limit = 20
const search = ref('')
const showAdjustModal = ref(false)
const selectedUser = ref<any>(null)
const adjustAmount = ref<number | null>(null)
const adjustNote = ref('')
const adjusting = ref(false)
const totalPages = computed(() => Math.ceil(total.value / limit))

async function loadUsers() { loading.value = true; try { const result = await getUsers({ search: search.value || undefined, page: currentPage.value, limit }); users.value = result?.data || []; total.value = result?.total || 0 } catch {} finally { loading.value = false } }
const debouncedSearch = useDebounceFn(() => { currentPage.value = 1; loadUsers() }, 500)
onMounted(() => loadUsers())
watch(currentPage, () => loadUsers())

function getUserActions(user: any) { return [[{ label: 'Adjust Balance', icon: 'i-heroicons-currency-dollar', click: () => { selectedUser.value = user; adjustAmount.value = null; adjustNote.value = ''; showAdjustModal.value = true } }], [{ label: user.is_active ? 'Disable Account' : 'Enable Account', icon: user.is_active ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open', click: () => {} }]] }
async function submitAdjust() { if (!selectedUser.value || !adjustAmount.value) return; adjusting.value = true; try { await adjustBalance(selectedUser.value.id, adjustAmount.value, adjustNote.value); showAdjustModal.value = false; loadUsers() } catch {} finally { adjusting.value = false } }
function formatDate(date: string) { return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date)) }
</script>
