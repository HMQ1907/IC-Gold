<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white mb-2">Deposit</h1>
        <p class="text-gray-400">Deposit USDT via TRC20 network</p>
      </div>

      <UCard class="bg-gray-900 border-gray-800">
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">1</div>
            <h3 class="text-white font-semibold">Send USDT to this address</h3>
          </div>

          <div v-if="loadingAddress" class="flex items-center justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" />
          </div>

          <div v-else-if="depositAddress" class="space-y-4">
            <div class="bg-white p-4 rounded-xl w-fit mx-auto">
              <div class="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                <span class="text-gray-500 text-xs text-center px-4">QR Code for<br/>{{ depositAddress.address.slice(0, 12) }}...</span>
              </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <p class="text-gray-400 text-sm mb-2">TRC20 Wallet Address:</p>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-amber-500 text-sm break-all">{{ depositAddress.address }}</code>
                <UButton color="neutral" variant="ghost" icon="i-heroicons-clipboard-document" @click="copyAddress" />
              </div>
            </div>

            <UAlert color="primary" variant="subtle" icon="i-heroicons-exclamation-triangle" title="Important" description="Only send USDT via TRC20 network. Sending via wrong network may result in permanent loss of funds." />
          </div>
        </div>

        <USeparator class="my-6" />

        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">2</div>
            <h3 class="text-white font-semibold">Enter transaction details</h3>
          </div>

          <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
            <UFormField label="Amount (USDT)" name="amount">
              <UInput v-model.number="state.amount" type="number" placeholder="100" icon="i-heroicons-currency-dollar" size="lg">
                <template #trailing><span class="text-gray-500">USDT</span></template>
              </UInput>
              <template #hint><span class="text-gray-500">Minimum: $10</span></template>
            </UFormField>

            <UFormField label="Transaction Hash (TxID)" name="txHash">
              <UInput v-model="state.txHash" placeholder="Enter transaction hash from your wallet" icon="i-heroicons-hashtag" size="lg" />
              <template #hint><span class="text-gray-500">Get this from your wallet after successful transfer</span></template>
            </UFormField>

            <UButton type="submit" color="primary" block size="lg" :loading="submitting">
              <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 mr-2" />
              Confirm Deposit
            </UButton>
          </UForm>
        </div>
      </UCard>

      <div class="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h4 class="text-white font-semibold mb-4">How to Deposit</h4>
        <ol class="space-y-3 text-gray-400">
          <li class="flex gap-3"><span class="text-amber-500 font-bold">1.</span>Copy the TRC20 wallet address above</li>
          <li class="flex gap-3"><span class="text-amber-500 font-bold">2.</span>Open your crypto wallet and select send USDT via TRC20 network</li>
          <li class="flex gap-3"><span class="text-amber-500 font-bold">3.</span>Paste the wallet address and enter the amount</li>
          <li class="flex gap-3"><span class="text-amber-500 font-bold">4.</span>Confirm the transaction and wait for processing (usually 1-5 minutes)</li>
          <li class="flex gap-3"><span class="text-amber-500 font-bold">5.</span>Copy the Transaction Hash (TxID) and enter it in the form above</li>
          <li class="flex gap-3"><span class="text-amber-500 font-bold">6.</span>Admin will verify and credit your account within 24h</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
definePageMeta({ middleware: 'auth' })
const toast = useToast()
const { getDepositAddress, requestDeposit } = useWallet()
const loadingAddress = ref(true)
const submitting = ref(false)
const depositAddress = ref<{ address: string; network: string } | null>(null)
const schema = z.object({ amount: z.number().min(10, 'Minimum amount is $10'), txHash: z.string().min(10, 'Invalid transaction hash') })
const state = reactive({ amount: null as number | null, txHash: '' })

onMounted(async () => {
  try { depositAddress.value = await getDepositAddress() } 
  catch { toast.add({ title: 'Error', description: 'Failed to load deposit address', color: 'error' }) } 
  finally { loadingAddress.value = false }
})

async function copyAddress() {
  if (!depositAddress.value) return
  await navigator.clipboard.writeText(depositAddress.value.address)
  toast.add({ title: 'Address copied', color: 'success' })
}

async function onSubmit() {
  if (!state.amount || !state.txHash) return
  submitting.value = true
  try { await requestDeposit(state.amount, state.txHash); state.amount = null; state.txHash = '' } 
  catch {} finally { submitting.value = false }
}
</script>
