export const useAdmin = () => {
  const { user } = useSupabaseAuth()
  const isAdmin = ref(false)
  const loading = ref(false)

  const checkAdminStatus = async () => {
    if (!user.value) {
      isAdmin.value = false
      return false
    }

    loading.value = true
    try {
      const res: any = await $fetch('/api/profiles/me')
      isAdmin.value = res.data?.is_admin === true
      return isAdmin.value
    } catch {
      isAdmin.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  watch(
    user,
    async newUser => {
      if (newUser) {
        await checkAdminStatus()
      } else {
        isAdmin.value = false
      }
    },
    { immediate: true }
  )

  return {
    isAdmin: readonly(isAdmin),
    loading: readonly(loading),
    checkAdminStatus
  }
}
