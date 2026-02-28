<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('wallet.withdrawTitle') }}</h1>
        <p class="text-gray-400">{{ $t('wallet.withdrawDesc') }}</p>
      </div>

      <!-- Withdrawal Rules -->
      <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-information-circle" class="w-8 h-8 text-amber-500" />
          </div>
          <div class="flex-1">
            <ul class="text-gray-300 space-y-2">
              <li>- {{ locale === 'vi' ? 'Rút gốc trước 30 ngày là mất phí 30%, khấu trừ toàn bộ lợi nhuận.' : 'Withdrawing principal before 30 days incurs 30% fee, all profits will be deducted.' }}</li>
              <li>- {{ locale === 'vi' ? 'Rút lợi nhuận, phí rút 5%.' : 'Withdrawing profits incurs 5% fee.' }}</li>
              <li>- {{ locale === 'vi' ? 'Rút tối thiểu 20$/lần.' : 'Minimum withdrawal $20/transaction.' }}</li>
              <li>- {{ locale === 'vi' ? 'Mỗi ngày thực hiện 1 lệnh rút tiền.' : 'Only 1 withdrawal request per day.' }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 mb-6">
        <p class="text-amber-100 text-sm mb-1">{{ $t('wallet.availableBalance') }}</p>
        <p class="text-4xl font-bold text-white">${{ formatNumber(userBalance) }}</p>
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
                <span class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Tối thiểu: $20' : 'Minimum: $20' }}</span>
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
                  @click="state.amount = userBalance"
                >
                  MAX
                </UButton>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300">{{ locale === 'vi' ? 'Địa chỉ ví TRC20 ' : 'TRC20  Wallet Address' }}</label>
                <span class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Địa chỉ ví TRC20  nhận USDT' : 'TRC20  wallet address to receive USDT' }}</span>
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
                <span class="text-gray-400">{{ locale === 'vi' ? 'Phí giao dịch (5%)' : 'Transaction Fee (5%)' }}</span>
                <span class="text-white font-medium">-${{ formatNumber(fee) }}</span>
              </div>
              <div class="border-t border-gray-700 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-white font-semibold">{{ locale === 'vi' ? 'Bạn nhận được' : "You'll Receive" }}</span>
                  <span class="text-amber-500 font-bold text-xl">${{ formatNumber(receiveAmount) }}</span>
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

      <!-- Confirm popup: Custom Modal -->
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
            v-if="showHighProfitModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <!-- Backdrop -->
            <div
              class="absolute inset-0 bg-black/70 backdrop-blur-sm"
              @click="showHighProfitModal = false"
            />

            <!-- Modal Content -->
            <div class="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
              <!-- Header -->
              <div class="flex items-start gap-4 p-6 border-b border-gray-700">
                <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-7 h-7 text-amber-500" />
                </div>
                <div class="flex-1 min-w-0 pt-0.5">
                  <h3 class="text-lg font-semibold text-white break-words">{{ $t('wallet.highProfitConfirmTitle') }}</h3>
                </div>
                <button
                  @click="showHighProfitModal = false"
                  class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <!-- Body -->
              <div class="p-6">
                <p class="text-gray-300 leading-relaxed">{{ $t('wallet.highProfitConfirmDesc') }}</p>
              </div>

              <!-- Footer -->
              <div class="flex justify-end gap-3 p-6 border-t border-gray-700">
                <button
                  @click="showHighProfitModal = false"
                  class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  {{ $t('wallet.cancel') }}
                </button>
                <button
                  :disabled="submitting"
                  @click="doWithdrawAfterConfirm"
                  class="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <UIcon v-if="submitting" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  {{ $t('wallet.continueWithdraw') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
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

const copyTradeActive = ref(false)
const showHighProfitModal = ref(false)

// Fee calculation (5%)
const fee = computed(() => (state.amount || 0) * 0.05)
const receiveAmount = computed(() => (state.amount || 0) - fee.value)

// Get user balance as number (to handle string from database)
const userBalance = computed(() => Number(user.value?.balance) || 0)

const canWithdraw = computed(() => 
  state.amount && 
  state.amount >= 20 && 
  state.amount <= userBalance.value && 
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
    toast.error(locale.value === 'vi' ? 'Lỗi' : 'Error', message)
  } finally {
    submitting.value = false
  }
}

async function onSubmit() {
  if (!state.amount || !state.walletAddress) return
  if (copyTradeActive.value) {
    showHighProfitModal.value = true
    return
  }
  await doWithdrawAfterConfirm()
}

// Check copy trade status on mount
onMounted(async () => {
  showHighProfitModal.value = false
  try {
    const data = await $fetch<{ copyTradeActive?: boolean }>('/api/wallet/withdraw-status')
    if (data?.copyTradeActive) {
      copyTradeActive.value = true
    }
  } catch (e) {
    console.error('Failed to check withdraw status:', e)
  }
})
</script>
