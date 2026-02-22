<template>
  <div>
    <!-- Step 1: Registration Form -->
    <template v-if="step === 'form'">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('auth.registerButton') }}</h1>
        <p class="text-gray-400">{{ locale === 'vi' ? 'Bắt đầu hành trình đầu tư của bạn' : 'Start your investment journey' }}</p>
      </div>

      <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.fullName') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.fullName"
                type="text"
                :placeholder="$t('auth.fullNamePlaceholder')"
                class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.email') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Số điện thoại (tùy chọn)' : 'Phone (optional)' }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.phone"
                type="tel"
                placeholder="+1234567890"
                class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-300">{{ $t('auth.password') }}</label>
              <span class="text-xs text-gray-500">{{ locale === 'vi' ? 'Tối thiểu 8 ký tự, chữ hoa, chữ thường, số' : 'Min 8 chars, uppercase, lowercase, number' }}</span>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.password"
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
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
            <p v-if="state.confirmPassword && state.password !== state.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ $t('errors.passwordMismatch') }}
            </p>
          </div>

          <!-- Referral Code -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('auth.referralCode') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UIcon name="i-heroicons-gift" class="w-5 h-5 text-gray-500" />
              </div>
              <input
                v-model="state.referralCode"
                type="text"
                :placeholder="$t('auth.referralCodePlaceholder')"
                class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <!-- Terms -->
          <label class="flex items-start gap-3 cursor-pointer mt-4">
            <input
              v-model="agreeTerms"
              type="checkbox"
              class="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-900"
            />
            <span class="text-sm text-gray-400">
              {{ locale === 'vi' ? 'Tôi đồng ý với' : 'I agree to the' }}
              <NuxtLink to="/support/legal" class="text-amber-500 hover:text-amber-400">{{ $t('footer.termsOfService') }}</NuxtLink>
              {{ locale === 'vi' ? 'và' : 'and' }}
              <NuxtLink to="/support/legal" class="text-amber-500 hover:text-amber-400">{{ $t('footer.privacyPolicy') }}</NuxtLink>
            </span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !agreeTerms || !isFormValid"
            class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
            {{ loading ? $t('common.loading') : $t('nav.signUp') }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-gray-800/50 text-gray-500">{{ locale === 'vi' ? 'hoặc' : 'or' }}</span>
          </div>
        </div>

        <!-- Login link -->
        <p class="text-center text-gray-400">
          {{ $t('auth.hasAccount') }}
          <NuxtLink to="/auth/login" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
            {{ $t('nav.signIn') }}
          </NuxtLink>
        </p>
      </div>
    </template>

    <!-- Step 2: OTP Verification -->
    <template v-else>
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-envelope-open" class="w-8 h-8 text-amber-500" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('auth.verifyEmail') }}</h1>
        <p class="text-gray-400">
          {{ $t('auth.verifyDesc') }}
        </p>
        <p class="text-amber-500 font-medium mt-1">{{ registeredEmail }}</p>
      </div>

      <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
        <form @submit.prevent="onVerify" class="space-y-6">
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
          </div>

          <!-- Verify Button -->
          <button
            type="submit"
            :disabled="verifyLoading || otpCode.length !== 6"
            class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UIcon v-if="verifyLoading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
            {{ verifyLoading ? $t('common.loading') : $t('auth.verifyButton') }}
          </button>

          <!-- Resend -->
          <div class="text-center">
            <p class="text-sm text-gray-400 mb-2">
              {{ locale === 'vi' ? 'Không nhận được mã?' : "Didn't receive the code?" }}
            </p>
            <button
              v-if="resendCountdown <= 0"
              type="button"
              @click="onResend"
              :disabled="resendLoading"
              class="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors cursor-pointer"
            >
              {{ resendLoading ? $t('common.loading') : $t('auth.resendCode') }}
            </button>
            <span v-else class="text-gray-500 text-sm">
              {{ $t('auth.resendIn') }} {{ resendCountdown }}s
            </span>
          </div>
        </form>

        <!-- Back -->
        <button
          type="button"
          @click="step = 'form'"
          class="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
        >
          {{ $t('common.back') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { register, verifyRegistration, resendOtp } = useAuth()
const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const step = ref<'form' | 'otp'>('form')
const loading = ref(false)
const verifyLoading = ref(false)
const resendLoading = ref(false)
const showPassword = ref(false)
const agreeTerms = ref(false)
const registeredEmail = ref('')

const state = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  referralCode: ''
})

const isFormValid = computed(() => {
  return state.email && 
         state.password.length >= 8 && 
         state.password === state.confirmPassword
})

onMounted(() => {
  if (route.query.ref) {
    state.referralCode = route.query.ref as string
  }
})

// OTP input handling
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
const resendCountdown = ref(60)
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

async function onSubmit() {
  if (!agreeTerms.value || !isFormValid.value) return
  
  loading.value = true
  try {
    const result = await register({
      email: state.email,
      phone: state.phone || undefined,
      password: state.password,
      fullName: state.fullName || undefined,
      referralCode: state.referralCode || undefined
    })
    
    if (result?.needsVerification) {
      registeredEmail.value = result.email
      step.value = 'otp'
      startCountdown()
      nextTick(() => {
        otpInputs.value[0]?.focus()
      })
    }
  } catch (error) {
    // Error handled by composable
  } finally {
    loading.value = false
  }
}

async function onVerify() {
  if (otpCode.value.length !== 6) return
  
  verifyLoading.value = true
  try {
    const result = await verifyRegistration(registeredEmail.value, otpCode.value)
    if (result?.success) {
      await router.push('/dashboard')
    }
  } catch (error) {
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      otpInputs.value[0]?.focus()
    })
  } finally {
    verifyLoading.value = false
  }
}

async function onResend() {
  resendLoading.value = true
  try {
    await resendOtp(registeredEmail.value, 'register')
    startCountdown()
  } catch (error) {
    // Error handled by composable
  } finally {
    resendLoading.value = false
  }
}
</script>
