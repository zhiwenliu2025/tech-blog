export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useSupabaseAuth()

  // If user is not authenticated, redirect to login page
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
