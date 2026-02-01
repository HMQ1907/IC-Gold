export default defineNuxtRouteMiddleware(async (to) => {
  const { user, initialized, init } = useAuth()

  // Wait for auth to initialize
  if (!initialized.value) {
    await init()
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
})
