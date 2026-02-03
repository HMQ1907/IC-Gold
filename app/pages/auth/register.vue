<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p class="text-gray-400">Start your investment journey</p>
    </div>

    <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="state.fullName"
              type="text"
              placeholder="John Doe"
              class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="state.email"
              type="email"
              placeholder="email@example.com"
              class="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Phone (optional)</label>
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
            <label class="block text-sm font-medium text-gray-300">Password</label>
            <span class="text-xs text-gray-500">Min 8 chars, uppercase, lowercase, number</span>
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
          <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
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
            Passwords do not match
          </p>
        </div>

        <!-- Referral Code -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Referral Code (optional)</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-gift" class="w-5 h-5 text-gray-500" />
            </div>
            <input
              v-model="state.referralCode"
              type="text"
              placeholder="ABCD1234"
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
            I agree to the
            <NuxtLink to="/support/terms" class="text-amber-500 hover:text-amber-400">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/support/terms" class="text-amber-500 hover:text-amber-400">Privacy Policy</NuxtLink>
          </span>
        </label>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || !agreeTerms || !isFormValid"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-gray-800/50 text-gray-500">or</span>
        </div>
      </div>

      <!-- Login link -->
      <p class="text-center text-gray-400">
        Already have an account?
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

const { register } = useAuth()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const showPassword = ref(false)
const agreeTerms = ref(false)

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

// Get referral code from URL if present
onMounted(() => {
  if (route.query.ref) {
    state.referralCode = route.query.ref as string
  }
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
    
    if (result?.success) {
      await router.push({
        path: '/auth/verify',
        query: { 
          email: result.email,
          type: 'register'
        }
      })
    }
  } catch (error) {
    // Error handled by composable
  } finally {
    loading.value = false
  }
}
</script>
