export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useSupabaseAuth()

  if (!user.value) {
    return navigateTo('/auth/login')
  }

  try {
    const res: any = await $fetch('/api/profiles/me')
    if (!res.data?.is_admin) {
      return navigateTo('/')
    }
  } catch {
    return navigateTo('/')
  }
})
