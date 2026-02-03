<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Sign In</h1>
      <p class="text-gray-400">Welcome back to IC-Gold</p>
    </div>

    <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8">
      <form @submit.prevent="onSubmit" class="space-y-5">
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

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
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

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-600 bg-gray-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-900"
            />
            <span class="text-sm text-gray-400">Remember me</span>
          </label>
          <NuxtLink to="/auth/forgot-password" class="text-sm text-amber-500 hover:text-amber-400 transition-colors">
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
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

      <!-- Register link -->
      <p class="text-center text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-amber-500 hover:text-amber-400 font-medium transition-colors">
          Sign Up
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

const { login } = useAuth()
const router = useRouter()

const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit() {
  if (!state.email || !state.password) return
  
  loading.value = true
  try {
    const result = await login(state.email, state.password)
    
    if (result?.requireOtp) {
      await router.push({
        path: '/auth/verify',
        query: { 
          email: result.email,
          type: 'login'
        }
      })
    }
  } catch (error: any) {
    // Error toast already handled in useAuth
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>
