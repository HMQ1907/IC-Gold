<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white mb-2">Withdraw</h1>
        <p class="text-gray-400">Withdraw USDT to your TRC20 wallet</p>
      </div>

      <div class="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-6 mb-6">
        <p class="text-amber-100 text-sm mb-1">Available Balance</p>
        <p class="text-3xl font-bold text-white">${{ formatNumber(user?.balance || 0) }}</p>
      </div>

      <UCard class="bg-gray-900 border-gray-800">
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormField label="Withdrawal Amount (USDT)" name="amount">
            <UInput v-model.number="state.amount" type="number" placeholder="100" icon="i-heroicons-currency-dollar" size="lg">
              <template #trailing>
                <UButton color="primary" variant="ghost" size="xs" @click="state.amount = user?.balance || 0">MAX</UButton>
              </template>
            </UInput>
            <template #hint><span class="text-gray-500">Minimum: $50</span></template>
          </UFormField>

          <UFormField label="TRC20 Wallet Address" name="walletAddress">
            <UInput v-model="state.walletAddress" placeholder="Txxx..." icon="i-heroicons-wallet" size="lg" />
            <template #hint><span class="text-gray-500">TRC20 wallet address to receive USDT</span></template>
          </UFormField>

          <div class="bg-gray-800 rounded-lg p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Withdrawal Amount</span>
              <span class="text-white">${{ formatNumber(state.amount || 0) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Transaction Fee</span>
              <span class="text-white">$0.00</span>
            </div>
            <USeparator />
            <div class="flex items-center justify-between">
              <span class="text-white font-semibold">You'll Receive</span>
              <span class="text-amber-500 font-bold">${{ formatNumber(state.amount || 0) }}</span>
            </div>
          </div>

          <UAlert color="primary" variant="subtle" icon="i-heroicons-exclamation-triangle">
            <template #description>
              <ul class="text-sm space-y-1">
                <li>• Please verify wallet address before submitting</li>
                <li>• Withdrawals are processed within 24 hours</li>
                <li>• Cannot be cancelled once submitted</li>
              </ul>
            </template>
          </UAlert>

          <UButton type="submit" color="primary" block size="lg" :loading="submitting" :disabled="!canWithdraw">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 mr-2" />
            Confirm Withdrawal
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
definePageMeta({ middleware: 'auth' })
const { user } = useAuth()
const { requestWithdraw } = useWallet()
const submitting = ref(false)
const schema = z.object({
  amount: z.number().min(50, 'Minimum withdrawal is $50').refine((val) => val <= (user.value?.balance || 0), 'Insufficient balance'),
  walletAddress: z.string().min(1, 'Wallet address is required').regex(/^T[A-Za-z0-9]{33}$/, 'Invalid TRC20 wallet address')
})
const state = reactive({ amount: null as number | null, walletAddress: '' })
const canWithdraw = computed(() => state.amount && state.amount >= 50 && state.amount <= (user.value?.balance || 0) && state.walletAddress.length > 0)
function formatNumber(num: number): string { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) }
async function onSubmit() {
  if (!state.amount || !state.walletAddress) return
  submitting.value = true
  try { await requestWithdraw(state.amount, state.walletAddress); state.amount = null; state.walletAddress = '' } catch {} finally { submitting.value = false }
}
</script>
