<template>
  <div>
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-amber-500" />
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Verify OTP</h1>
      <p class="text-gray-400">
        Verification code has been sent to
        <span class="text-white font-medium">{{ maskedEmail }}</span>
      </p>
    </div>

    <UCard class="bg-gray-900 border-gray-800">
      <div class="space-y-6">
        <!-- OTP Input -->
        <div class="flex justify-center gap-2">
          <input
            v-for="(_, index) in 6"
            :key="index"
            :ref="(el) => (otpInputs[index] = el as HTMLInputElement)"
            v-model="otpDigits[index]"
            type="text"
            maxlength="1"
            class="w-12 h-14 text-center text-2xl font-bold bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
            @input="onOtpInput(index)"
            @keydown="onOtpKeydown($event, index)"
            @paste="onOtpPaste"
          />
        </div>

        <UButton
          color="primary"
          block
          size="lg"
          :loading="loading"
          :disabled="otpCode.length !== 6"
          @click="onSubmit"
        >
          Verify
        </UButton>

        <!-- Resend OTP -->
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-2">
            Didn't receive the code?
          </p>
          <UButton
            v-if="resendCountdown === 0"
            color="neutral"
            variant="ghost"
            :loading="resending"
            @click="onResend"
          >
            Resend Code
          </UButton>
          <p v-else class="text-gray-500 text-sm">
            Resend in {{ resendCountdown }}s
          </p>
        </div>
      </div>
    </UCard>

    <p class="text-center text-gray-500 text-sm mt-4">
      <NuxtLink to="/auth/login" class="text-amber-500 hover:text-amber-400">
        ← Back to Sign In
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const { verifyOtp, resendOtp } = useAuth()

const email = computed(() => route.query.email as string || '')
const phone = computed(() => route.query.phone as string || '')
const type = computed(() => route.query.type as string || 'register')

const maskedEmail = computed(() => {
  if (!email.value) return phone.value
  const [local, domain] = email.value.split('@')
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}${local[1]}***@${domain}`
})

const loading = ref(false)
const resending = ref(false)
const resendCountdown = ref(60)

const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])

const otpCode = computed(() => otpDigits.value.join(''))

// Countdown timer
let countdownInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  startCountdown()
  nextTick(() => {
    otpInputs.value[0]?.focus()
  })
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

function startCountdown() {
  resendCountdown.value = 60
  countdownInterval = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
    }
  }, 1000)
}

function onOtpInput(index: number) {
  const value = otpDigits.value[index]
  
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }

  if (otpCode.value.length === 6) {
    onSubmit()
  }
}

function onOtpKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

function onOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
    }
  })

  const lastIndex = Math.min(digits.length, 5)
  otpInputs.value[lastIndex]?.focus()

  if (digits.length === 6) {
    onSubmit()
  }
}

async function onSubmit() {
  if (otpCode.value.length !== 6) return
  
  loading.value = true
  try {
    await verifyOtp(
      otpCode.value,
      email.value || undefined,
      phone.value || undefined,
      type.value
    )
  } catch (error) {
    otpDigits.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
  } finally {
    loading.value = false
  }
}

async function onResend() {
  resending.value = true
  try {
    await resendOtp(
      email.value || undefined,
      phone.value || undefined,
      type.value
    )
    startCountdown()
  } catch (error) {
    // Error handled by composable
  } finally {
    resending.value = false
  }
}
</script>
