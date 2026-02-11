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
      const response = await $fetch<{ user?: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.user) {
        authState.user = response.user
        toast.success('Login successful', 'Welcome back!')
        // Admin goes to admin panel, regular user goes to dashboard
        if (response.user.is_admin) {
          await router.push('/admin')
        } else {
          await router.push('/dashboard')
        }
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
      const response = await $fetch<{ success: boolean; user: User; message: string }>('/api/auth/register', {
        method: 'POST',
        body: data
      })

      if (response.user) {
        authState.user = response.user
      }

      toast.success('Đăng ký thành công', 'Chào mừng bạn đến với IC-Gold!')

      return { success: true }
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Registration failed'
      toast.error('Đăng ký thất bại', message)
      throw error
    } finally {
      authState.loading = false
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
    logout,
    refreshUser
  }
}
