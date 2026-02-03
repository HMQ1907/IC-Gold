<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Reset Password</h1>
      <p class="text-gray-400">Enter your email to receive a reset code</p>
    </div>

    <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
      <!-- Step 1: Enter Email -->
      <form v-if="step === 1" @submit.prevent="requestOtp" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="email@example.com"
              class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Sending...' : 'Send Reset Code' }}
        </button>
      </form>

      <!-- Step 2: Enter OTP and New Password -->
      <form v-else @submit.prevent="resetPassword" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
          <input
            v-model="otp"
            type="text"
            placeholder="Enter 6-digit code"
            maxlength="6"
            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-center text-2xl tracking-widest"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
            >
              <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>

        <button
          type="button"
          @click="step = 1"
          class="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
        >
          Back to email input
        </button>
      </form>

      <!-- Back to login -->
      <p class="text-center text-gray-400 mt-6">
        Remember your password?
        <NuxtLink to="/auth/login" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
          Sign In
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const router = useRouter()
const toast = useToastCustom()

const step = ref(1)
const loading = ref(false)
const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

async function requestOtp() {
  if (!email.value) return
  
  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    toast.success('OTP sent', 'Please check your email')
    step.value = 2
  } catch (error: any) {
    toast.error('Error', error.data?.message || 'Failed to send reset code')
  } finally {
    loading.value = false
  }
}

async function resetPassword() {
  if (!otp.value || !newPassword.value || !confirmPassword.value) return
  
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Error', 'Passwords do not match')
    return
  }
  
  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: email.value,
        code: otp.value,
        password: newPassword.value
      }
    })
    toast.success('Password reset', 'You can now login with your new password')
    await router.push('/auth/login')
  } catch (error: any) {
    toast.error('Error', error.data?.message || 'Failed to reset password')
  } finally {
    loading.value = false
  }
}
</script>
