<template>
  <div>
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon :name="step === 1 ? 'i-heroicons-key' : 'i-heroicons-shield-check'" class="w-8 h-8 text-amber-500" />
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">{{ $t('auth.resetPassword') }}</h1>
      <p class="text-gray-400">
        {{ step === 1 
          ? $t('auth.forgotPasswordDesc') 
          : (locale === 'vi' ? 'Nhập mã OTP đã gửi đến email của bạn' : 'Enter the OTP code sent to your email') 
        }}
      </p>
      <p v-if="step === 2" class="text-amber-500 font-medium mt-1">{{ email }}</p>
    </div>

    <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
      <!-- Step 1: Enter Email -->
      <form v-if="step === 1" @submit.prevent="requestOtp" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.email') }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="email"
              type="email"
              :placeholder="$t('auth.emailPlaceholder')"
              class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || !email"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? $t('common.loading') : $t('auth.sendResetLink') }}
        </button>
      </form>

      <!-- Step 2: Enter OTP and New Password -->
      <form v-else @submit.prevent="resetPassword" class="space-y-5">
        <!-- OTP Input -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3 text-center">{{ $t('auth.enterOtp') }}</label>
          <div class="flex justify-center gap-2 sm:gap-3">
            <input
              v-for="(_, idx) in 6"
              :key="idx"
              ref="otpInputs"
              v-model="otpDigits[idx]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="w-11 h-13 sm:w-13 sm:h-15 bg-gray-900 border border-gray-700 rounded-xl text-white text-center text-xl sm:text-2xl font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              @input="onOtpInput(idx)"
              @keydown.backspace="onOtpBackspace(idx, $event)"
              @paste.prevent="onOtpPaste"
            />
          </div>
          <!-- Resend -->
          <div class="text-center mt-3">
            <button
              v-if="resendCountdown <= 0"
              type="button"
              @click="requestOtp"
              :disabled="loading"
              class="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors cursor-pointer"
            >
              {{ $t('auth.resendCode') }}
            </button>
            <span v-else class="text-gray-500 text-sm">
              {{ $t('auth.resendIn') }} {{ resendCountdown }}s
            </span>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.newPassword') }}</label>
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

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.confirmPassword') }}</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            required
          />
          <p v-if="confirmPassword && newPassword !== confirmPassword" class="mt-1 text-sm text-red-500">
            {{ $t('errors.passwordMismatch') }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || otpCode.length !== 6 || !newPassword || newPassword !== confirmPassword"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? $t('common.loading') : $t('auth.resetPasswordButton') }}
        </button>

        <button
          type="button"
          @click="step = 1"
          class="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
        >
          {{ $t('common.back') }}
        </button>
      </form>

      <!-- Back to login -->
      <p class="text-center text-gray-400 mt-6">
        {{ locale === 'vi' ? 'Nhớ mật khẩu?' : 'Remember your password?' }}
        <NuxtLink to="/auth/login" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
          {{ $t('nav.signIn') }}
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
const { locale } = useI18n()

const step = ref(1)
const loading = ref(false)
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

// OTP input
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])
const otpCode = computed(() => otpDigits.value.join(''))

function onOtpInput(idx: number) {
  const val = otpDigits.value[idx]
  if (val && !/^\d$/.test(val)) {
    otpDigits.value[idx] = ''
    return
  }
  if (val && idx < 5) {
    otpInputs.value[idx + 1]?.focus()
  }
}

function onOtpBackspace(idx: number, event: KeyboardEvent) {
  if (!otpDigits.value[idx] && idx > 0) {
    otpInputs.value[idx - 1]?.focus()
  }
}

function onOtpPaste(event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6)
  if (!pasted) return
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = pasted[i] || ''
  }
  const focusIdx = Math.min(pasted.length, 5)
  otpInputs.value[focusIdx]?.focus()
}

// Resend countdown
const resendCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  resendCountdown.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

async function requestOtp() {
  if (!email.value) return
  
  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    toast.success(
      locale.value === 'vi' ? 'Đã gửi OTP' : 'OTP sent',
      locale.value === 'vi' ? 'Vui lòng kiểm tra email' : 'Please check your email'
    )
    step.value = 2
    startCountdown()
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } catch (error: any) {
    toast.error(
      locale.value === 'vi' ? 'Lỗi' : 'Error',
      error.data?.message || (locale.value === 'vi' ? 'Không thể gửi mã' : 'Failed to send reset code')
    )
  } finally {
    loading.value = false
  }
}

async function resetPassword() {
  if (otpCode.value.length !== 6 || !newPassword.value || !confirmPassword.value) return
  
  if (newPassword.value !== confirmPassword.value) {
    toast.error(
      locale.value === 'vi' ? 'Lỗi' : 'Error',
      locale.value === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match'
    )
    return
  }
  
  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: email.value,
        code: otpCode.value,
        password: newPassword.value
      }
    })
    toast.success(
      locale.value === 'vi' ? 'Đặt lại mật khẩu thành công' : 'Password reset',
      locale.value === 'vi' ? 'Bạn có thể đăng nhập với mật khẩu mới' : 'You can now login with your new password'
    )
    await router.push('/auth/login')
  } catch (error: any) {
    toast.error(
      locale.value === 'vi' ? 'Lỗi' : 'Error',
      error.data?.message || (locale.value === 'vi' ? 'Không thể đặt lại mật khẩu' : 'Failed to reset password')
    )
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } finally {
    loading.value = false
  }
}
</script>
