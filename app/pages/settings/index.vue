<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white mb-2">Account Settings</h1>
        <p class="text-gray-400">Manage your account information and security</p>
      </div>

      <UCard class="bg-gray-900 border-gray-800 mb-6">
        <template #header><h3 class="text-white font-semibold">Personal Information</h3></template>
        <div class="space-y-4">
          <UFormField label="Full Name"><UInput v-model="profile.fullName" placeholder="Enter your name" size="lg" /></UFormField>
          <UFormField label="Email"><UInput :model-value="user?.email || ''" disabled size="lg" /></UFormField>
          <UFormField label="Phone"><UInput v-model="profile.phone" placeholder="Enter phone number" size="lg" /></UFormField>
          <UButton color="primary" :loading="savingProfile" @click="saveProfile">Save Changes</UButton>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800 mb-6">
        <template #header><h3 class="text-white font-semibold">Security</h3></template>
        <div class="space-y-6">
          <div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p class="text-white font-medium">Two-Factor Authentication (2FA)</p>
              <p class="text-gray-400 text-sm">Secure your account with OTP via email</p>
            </div>
            <USwitch :model-value="user?.is_2fa_enabled || false" @update:model-value="toggle2FA" />
          </div>
          <USeparator />
          <h4 class="text-white font-medium">Change Password</h4>
          <UFormField label="Current Password"><UInput v-model="password.current" type="password" placeholder="Enter current password" size="lg" /></UFormField>
          <UFormField label="New Password"><UInput v-model="password.new" type="password" placeholder="Enter new password" size="lg" /></UFormField>
          <UFormField label="Confirm New Password"><UInput v-model="password.confirm" type="password" placeholder="Re-enter new password" size="lg" /></UFormField>
          <UButton color="primary" :loading="changingPassword" @click="handleChangePassword">Change Password</UButton>
        </div>
      </UCard>

      <UCard class="bg-gray-900 border-gray-800">
        <template #header><h3 class="text-white font-semibold">Account Information</h3></template>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg"><span class="text-gray-400">Account ID</span><span class="text-white font-mono">#{{ user?.id }}</span></div>
          <div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <span class="text-gray-400">Referral Code</span>
            <div class="flex items-center gap-2"><code class="text-amber-500">{{ user?.referral_code }}</code><UButton color="neutral" variant="ghost" icon="i-heroicons-clipboard-document" size="xs" @click="copyReferralCode" /></div>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg"><span class="text-gray-400">Account Created</span><span class="text-white">{{ formatDate(user?.created_at || '') }}</span></div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user, refreshUser } = useAuth()
const { updateProfile, changePassword, enable2FA, disable2FA } = useUser()
const toast = useToast()
const savingProfile = ref(false)
const changingPassword = ref(false)
const profile = reactive({ fullName: user.value?.full_name || '', phone: user.value?.phone || '' })
const password = reactive({ current: '', new: '', confirm: '' })

watch(user, (newUser) => { if (newUser) { profile.fullName = newUser.full_name || ''; profile.phone = newUser.phone || '' } }, { immediate: true })

async function saveProfile() { savingProfile.value = true; try { await updateProfile({ fullName: profile.fullName, phone: profile.phone }) } catch {} finally { savingProfile.value = false } }
async function handleChangePassword() {
  if (password.new !== password.confirm) { toast.add({ title: 'Error', description: 'Passwords do not match', color: 'error' }); return }
  changingPassword.value = true; try { await changePassword(password.current, password.new); password.current = ''; password.new = ''; password.confirm = '' } catch {} finally { changingPassword.value = false }
}
async function toggle2FA(enabled: boolean) { try { if (enabled) { await enable2FA() } else { await disable2FA('') } await refreshUser() } catch {} }
async function copyReferralCode() { if (user.value?.referral_code) { await navigator.clipboard.writeText(user.value.referral_code); toast.add({ title: 'Referral code copied', color: 'success' }) } }
function formatDate(date: string) { return date ? new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date)) : '' }
</script>
