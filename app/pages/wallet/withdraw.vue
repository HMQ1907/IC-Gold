<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Withdraw</h1>
        <p class="text-gray-400">Withdraw USDT to your TRC20 wallet</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 mb-6">
        <p class="text-amber-100 text-sm mb-1">Available Balance</p>
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
              <h3 class="text-white font-semibold">Withdrawal Details</h3>
              <p class="text-gray-500 text-sm">Enter amount and wallet address</p>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300">Withdrawal Amount (USDT)</label>
                <span class="text-gray-500 text-sm">Minimum: $50</span>
              </div>
              <div class="relative">
                <input 
                  v-model.number="state.amount" 
                  type="number" 
                  placeholder="100" 
                  class="w-full px-4 py-3 pr-20 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <button 
                  type="button"
                  @click="state.amount = user?.balance || 0"
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  MAX
                </button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300">TRC20 Wallet Address</label>
                <span class="text-gray-500 text-sm">TRC20 wallet address to receive USDT</span>
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
                <span class="text-gray-400">Withdrawal Amount</span>
                <span class="text-white font-medium">${{ formatNumber(state.amount || 0) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Transaction Fee</span>
                <span class="text-white font-medium">$0.00</span>
              </div>
              <div class="border-t border-gray-700 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-white font-semibold">You'll Receive</span>
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
                    <li>• Please verify wallet address before submitting</li>
                    <li>• Withdrawals are processed within 24 hours</li>
                    <li>• Cannot be cancelled once submitted</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="submitting || !canWithdraw"
              class="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UIcon v-if="submitting" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              <UIcon v-else name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
              Confirm Withdrawal
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user } = useAuth()
const { requestWithdraw } = useWallet()
const submitting = ref(false)
const state = reactive({ amount: null as number | null, walletAddress: '' })
const canWithdraw = computed(() => state.amount && state.amount >= 50 && state.amount <= (user.value?.balance || 0) && state.walletAddress.length > 0)
function formatNumber(num: number): string { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) }
async function onSubmit() {
  if (!state.amount || !state.walletAddress) return
  submitting.value = true
  try { await requestWithdraw(state.amount, state.walletAddress); state.amount = null; state.walletAddress = '' } catch {} finally { submitting.value = false }
}
</script>
