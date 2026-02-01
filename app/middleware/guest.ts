export default defineNuxtRouteMiddleware(async () => {
  const { user, initialized, init } = useAuth()

  // Wait for auth to initialize
  if (!initialized.value) {
    await init()
  }

  // Redirect to dashboard if already authenticated
  if (user.value) {
    return navigateTo('/dashboard')
  }
})
