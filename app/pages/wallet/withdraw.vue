<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('wallet.withdrawTitle') }}</h1>
        <p class="text-gray-400">{{ $t('wallet.withdrawDesc') }}</p>
      </div>

      <!-- 25-day lock (first deposit) -->
      <div v-if="withdrawLocked" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-clock" class="w-8 h-8 text-amber-500" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-amber-400 mb-2">{{ $t('wallet.firstDepositLockTitle') }}</h3>
            <p class="text-gray-300 mb-3">{{ $t('wallet.firstDepositLockDesc', { days: remainingDays }) }}</p>
            <div class="bg-gray-900/50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-400">{{ $t('wallet.remainingLockTime') }}</span>
                <span class="text-amber-400 font-bold">{{ remainingDays }} {{ $t('wallet.days') }}</span>
              </div>
              <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                  :style="{ width: lockProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 mb-6">
        <p class="text-amber-100 text-sm mb-1">{{ $t('wallet.availableBalance') }}</p>
        <p class="text-4xl font-bold text-white">${{ formatNumber(user?.balance || 0) }}</p>
      </div>

      <!-- Withdraw Form -->
      <div class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 class="text-white font-semibold">{{ locale === 'vi' ? 'Chi tiết rút tiền' : 'Withdrawal Details' }}</h3>
              <p class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Nhập số tiền và địa chỉ ví' : 'Enter amount and wallet address' }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300">{{ locale === 'vi' ? 'Số tiền rút (USDT)' : 'Withdrawal Amount (USDT)' }}</label>
                <span class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Tối thiểu: $50' : 'Minimum: $50' }}</span>
              </div>
              <div class="relative">
                <input 
                  v-model.number="state.amount" 
                  type="number" 
                  placeholder="100" 
                  class="w-full px-4 py-3 pr-20 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <UButton
                  type="button"
                  color="primary"
                  variant="soft"
                  size="xs"
                  class="absolute right-2 top-1/2 -translate-y-1/2"
                  @click="state.amount = user?.balance || 0"
                >
                  MAX
                </UButton>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300">{{ locale === 'vi' ? 'Địa chỉ ví TRC20' : 'TRC20 Wallet Address' }}</label>
                <span class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Địa chỉ ví TRC20 nhận USDT' : 'TRC20 wallet address to receive USDT' }}</span>
              </div>
              <input 
                v-model="state.walletAddress" 
                type="text" 
                placeholder="Txxx..." 
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <!-- Summary -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">{{ locale === 'vi' ? 'Số tiền rút' : 'Withdrawal Amount' }}</span>
                <span class="text-white font-medium">${{ formatNumber(state.amount || 0) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">{{ locale === 'vi' ? 'Phí giao dịch' : 'Transaction Fee' }}</span>
                <span class="text-white font-medium">$0.00</span>
              </div>
              <div class="border-t border-gray-700 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-white font-semibold">{{ locale === 'vi' ? 'Bạn nhận được' : "You'll Receive" }}</span>
                  <span class="text-amber-500 font-bold text-xl">${{ formatNumber(state.amount || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Warning -->
            <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div class="flex gap-3">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <ul class="text-gray-300 text-sm space-y-1">
                    <li>• {{ locale === 'vi' ? 'Vui lòng kiểm tra địa chỉ ví trước khi gửi' : 'Please verify wallet address before submitting' }}</li>
                    <li>• {{ locale === 'vi' ? 'Những giao dịch từ 22h-24h sẽ được xử lý nhanh hơn' : 'Transactions from 10pm-12am will be processed faster' }}</li>
                    <li>• {{ locale === 'vi' ? 'Rút tiền được xử lý trong 24 giờ' : 'Withdrawals are processed within 24 hours' }}</li>
                    <li>• {{ locale === 'vi' ? 'Không thể hủy sau khi gửi' : 'Cannot be cancelled once submitted' }}</li>
                    
                  </ul>
                </div>
              </div>
            </div>

            <UButton
              type="submit"
              color="error"
              block
              size="lg"
              :loading="submitting"
              :disabled="!canWithdraw"
              icon="i-heroicons-arrow-down-tray"
            >
              {{ locale === 'vi' ? 'Xác nhận rút tiền' : 'Confirm Withdrawal' }}
            </UButton>
          </form>
        </div>
      </div>

      <!-- Confirm popup: dùng BaseModal (không dùng UModal để tránh kẹt overlay) -->
      <UiBaseModal v-model:open="showHighProfitModal">
        <template #header>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-7 h-7 text-warning" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <h3 class="text-lg font-semibold text-white break-words">{{ $t('wallet.highProfitConfirmTitle') }}</h3>
            </div>
          </div>
        </template>

        <p class="text-gray-300 leading-relaxed">{{ $t('wallet.highProfitConfirmDesc') }}</p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="outline" @click="showHighProfitModal = false">
              {{ $t('wallet.cancel') }}
            </UButton>
            <UButton color="primary" :loading="submitting" @click="doWithdrawAfterConfirm">
              {{ $t('wallet.continueWithdraw') }}
            </UButton>
          </div>
        </template>
      </UiBaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user } = useAuth()
const { requestWithdraw } = useWallet()
const { locale, t } = useI18n()
const toast = useToastCustom()
const submitting = ref(false)
const state = reactive({ amount: null as number | null, walletAddress: '' })

// Withdrawal lock state (25 days after first deposit)
const withdrawLocked = ref(false)
const remainingDays = ref(0)
const copyTradeActive = ref(false)
const showHighProfitModal = ref(false)
const lockProgress = computed(() => ((25 - remainingDays.value) / 25) * 100)

const canWithdraw = computed(() => 
  !withdrawLocked.value && 
  state.amount && 
  state.amount >= 50 && 
  state.amount <= (user.value?.balance || 0) && 
  state.walletAddress.length > 0
)

function formatNumber(num: number): string { 
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) 
}

async function doWithdrawAfterConfirm() {
  showHighProfitModal.value = false
  if (!state.amount || !state.walletAddress) return
  submitting.value = true
  try {
    await requestWithdraw(state.amount, state.walletAddress)
    state.amount = null
    state.walletAddress = ''
    toast.success(locale.value === 'vi' ? 'Đã gửi yêu cầu rút tiền' : 'Withdrawal request submitted')
  } catch (error: any) {
    const message = error?.data?.message || error?.message || ''
    if (message.startsWith('WITHDRAW_LOCKED:')) {
      const days = parseInt(message.split(':')[1])
      withdrawLocked.value = true
      remainingDays.value = days
      toast.warning(t('wallet.firstDepositLockTitle'), t('wallet.firstDepositLockDesc', { days }))
    } else {
      toast.error(locale.value === 'vi' ? 'Lỗi' : 'Error', message)
    }
  } finally {
    submitting.value = false
  }
}

async function onSubmit() {
  if (!state.amount || !state.walletAddress || withdrawLocked.value) return
  if (copyTradeActive.value) {
    showHighProfitModal.value = true
    return
  }
  await doWithdrawAfterConfirm()
}

// Check withdrawal lock status on mount (không mở modal ở đây — chỉ mở khi user bấm Xác nhận rút tiền)
onMounted(async () => {
  showHighProfitModal.value = false
  try {
    const data = await $fetch<{ locked?: boolean; remainingDays?: number; copyTradeActive?: boolean }>('/api/wallet/withdraw-status')
    if (data?.locked) {
      withdrawLocked.value = true
      remainingDays.value = data.remainingDays ?? 25
    }
    if (data?.copyTradeActive) {
      copyTradeActive.value = true
    }
  } catch (e) {
    console.error('Failed to check withdraw status:', e)
  }
})
</script>
