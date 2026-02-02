import type { User } from '~~/server/utils/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

const authState = reactive<AuthState>({
  user: null,
  loading: false,
  initialized: false
})

export const useAuth = () => {
  const toast = useToastCustom()
  const router = useRouter()

  // Initialize auth state
  async function init() {
    if (authState.initialized) return
    
    authState.loading = true
    try {
      const response = await $fetch<{ user: User }>('/api/user/profile')
      if (response.user) {
        authState.user = response.user
      }
    } catch (error) {
      // Not logged in
    } finally {
      authState.loading = false
      authState.initialized = true
    }
  }

  // Login
  async function login(email: string, password: string) {
    authState.loading = true
    try {
      const response = await $fetch<{ user?: User; requireOtp?: boolean; email?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.requireOtp) {
        return { requireOtp: true, email: response.email || email }
      }

      if (response.user) {
        authState.user = response.user
        toast.success('Login successful', 'Welcome back!')
        await router.push('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Login failed'
      toast.error('Login failed', message)
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Register
  async function register(data: {
    email?: string
    phone?: string
    password: string
    fullName?: string
    referralCode?: string
  }) {
    authState.loading = true
    try {
      await $fetch<{ message: string }>('/api/auth/register', {
        method: 'POST',
        body: data
      })

      toast.success('Registration successful', 'Please check your email to verify your account')

      return { success: true, email: data.email, phone: data.phone }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Registration failed'
      toast.error('Registration failed', message)
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Verify OTP
  async function verifyOtp(code: string, email?: string, phone?: string, type: string = 'register') {
    authState.loading = true
    try {
      const response = await $fetch<{ user: User }>('/api/auth/verify-otp', {
        method: 'POST',
        body: { code, email, phone, type }
      })

      if (response.user) {
        authState.user = response.user
        toast.success('Verification successful', 'Your account has been activated')
        await router.push('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Verification failed'
      toast.error('Verification failed', message)
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Resend OTP
  async function resendOtp(email?: string, phone?: string, type: string = 'register') {
    try {
      await $fetch('/api/auth/resend-otp', {
        method: 'POST',
        body: { email, phone, type }
      })

      toast.success('OTP code sent', 'Please check your email')
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Failed to resend code'
      toast.error('Error', message)
      throw error
    }
  }

  // Logout
  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // Ignore errors
    } finally {
      authState.user = null
      toast.info('Logged out')
      await router.push('/')
    }
  }

  // Refresh user data
  async function refreshUser() {
    try {
      const response = await $fetch<{ user: User }>('/api/user/profile')
      if (response.user) {
        authState.user = response.user
      }
    } catch (error) {
      // Handle error silently
    }
  }

  return {
    user: computed(() => authState.user),
    loading: computed(() => authState.loading),
    initialized: computed(() => authState.initialized),
    isAuthenticated: computed(() => !!authState.user),
    isAdmin: computed(() => authState.user?.is_admin || false),
    init,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    refreshUser
  }
}
