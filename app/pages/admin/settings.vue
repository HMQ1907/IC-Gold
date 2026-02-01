<template>
  <div class="p-6">
    <div class="mb-8"><h1 class="text-2xl font-bold text-white mb-2">System Settings</h1><p class="text-gray-400">Configure system parameters</p></div>

    <div v-if="loading" class="text-center py-8"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 animate-spin" /></div>

    <div v-else class="space-y-6">
      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">TRC20 Wallet Settings</h3></template>
        <UFormField label="TRC20 Deposit Wallet Address"><UInput v-model="settings.trc20_wallet_address" placeholder="Txxx..." size="lg" /></UFormField>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">Transaction Settings</h3></template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormField label="Minimum Deposit ($)"><UInput v-model="settings.min_deposit" type="number" placeholder="10" /></UFormField>
          <UFormField label="Minimum Withdrawal ($)"><UInput v-model="settings.min_withdraw" type="number" placeholder="50" /></UFormField>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">Referral Settings</h3></template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormField label="Referral Bonus ($)"><UInput v-model="settings.referral_bonus" type="number" placeholder="10" /></UFormField>
          <UFormField label="Max Referral Uses"><UInput v-model="settings.max_referral_uses" type="number" placeholder="10" /></UFormField>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">Copy Trade Settings</h3></template>
        <div class="grid md:grid-cols-2 gap-4">
          <UFormField label="Minimum Balance for Copy Trade ($)"><UInput v-model="settings.copy_trade_min_balance" type="number" placeholder="1000" /></UFormField>
          <UFormField label="Default Copy Trade Percentage (%)"><UInput v-model="settings.copy_trade_percentage" type="number" placeholder="5" /></UFormField>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">Site Information</h3></template>
        <div class="space-y-4">
          <UFormField label="Site Name"><UInput v-model="settings.site_name" placeholder="IC-Gold" /></UFormField>
          <UFormField label="Description"><UTextarea v-model="settings.site_description" placeholder="Site description..." /></UFormField>
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Support Email"><UInput v-model="settings.support_email" placeholder="support@example.com" /></UFormField>
            <UFormField label="Telegram Link"><UInput v-model="settings.telegram_link" placeholder="https://t.me/..." /></UFormField>
          </div>
        </div>
      </UCard>

      <div class="flex justify-end">
        <UButton color="primary" size="lg" :loading="saving" @click="saveSettings">
          <UIcon name="i-heroicons-check" class="w-5 h-5 mr-2" />Save Settings
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { getSettings, updateSettings } = useAdmin()
const loading = ref(true)
const saving = ref(false)
const settings = ref<Record<string, string>>({
  trc20_wallet_address: '', min_deposit: '10', min_withdraw: '50', referral_bonus: '10', max_referral_uses: '10',
  copy_trade_min_balance: '1000', copy_trade_percentage: '5', site_name: 'IC-Gold', site_description: '', support_email: '', telegram_link: ''
})

onMounted(async () => { try { const data = await getSettings(); if (data) settings.value = { ...settings.value, ...data } } catch {} finally { loading.value = false } })
async function saveSettings() { saving.value = true; try { await updateSettings(settings.value) } catch {} finally { saving.value = false } }
</script>
