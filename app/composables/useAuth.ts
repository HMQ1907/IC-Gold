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
  const toast = useToast()
  const router = useRouter()

  // Initialize auth state
  async function init() {
    if (authState.initialized) return
    
    authState.loading = true
    try {
      const { data } = await useFetch<{ user: User }>('/api/user/profile')
      if (data.value?.user) {
        authState.user = data.value.user
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
      const { data, error } = await useFetch<{ user: User; requireOtp: boolean }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Login failed')
      }

      if (data.value?.requireOtp) {
        return { requireOtp: true, email }
      }

      if (data.value?.user) {
        authState.user = data.value.user
        toast.add({
          title: 'Login successful',
          description: 'Welcome back!',
          color: 'success'
        })
        await router.push('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      toast.add({
        title: 'Login failed',
        description: error.message,
        color: 'error'
      })
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
      const { data: result, error } = await useFetch<{ message: string }>('/api/auth/register', {
        method: 'POST',
        body: data
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Registration failed')
      }

      toast.add({
        title: 'Registration successful',
        description: 'Please check your email to verify your account',
        color: 'success'
      })

      return { success: true, email: data.email, phone: data.phone }
    } catch (error: any) {
      toast.add({
        title: 'Registration failed',
        description: error.message,
        color: 'error'
      })
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Verify OTP
  async function verifyOtp(code: string, email?: string, phone?: string, type: string = 'register') {
    authState.loading = true
    try {
      const { data, error } = await useFetch<{ user: User }>('/api/auth/verify-otp', {
        method: 'POST',
        body: { code, email, phone, type }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Verification failed')
      }

      if (data.value?.user) {
        authState.user = data.value.user
        toast.add({
          title: 'Verification successful',
          description: 'Your account has been activated',
          color: 'success'
        })
        await router.push('/dashboard')
        return { success: true }
      }
    } catch (error: any) {
      toast.add({
        title: 'Verification failed',
        description: error.message,
        color: 'error'
      })
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Resend OTP
  async function resendOtp(email?: string, phone?: string, type: string = 'register') {
    try {
      const { error } = await useFetch('/api/auth/resend-otp', {
        method: 'POST',
        body: { email, phone, type }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Failed to resend code')
      }

      toast.add({
        title: 'OTP code sent',
        description: 'Please check your email',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Logout
  async function logout() {
    try {
      await useFetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // Ignore errors
    } finally {
      authState.user = null
      toast.add({
        title: 'Logged out',
        color: 'neutral'
      })
      await router.push('/')
    }
  }

  // Refresh user data
  async function refreshUser() {
    try {
      const { data } = await useFetch<{ user: User }>('/api/user/profile')
      if (data.value?.user) {
        authState.user = data.value.user
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
