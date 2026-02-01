export default defineNuxtRouteMiddleware(async () => {
  const { user, initialized, init } = useAuth()

  // Wait for auth to initialize
  if (!initialized.value) {
    await init()
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo('/auth/login')
  }

  // Redirect to dashboard if not admin
  if (!user.value.is_admin) {
    return navigateTo('/dashboard')
  }
})
