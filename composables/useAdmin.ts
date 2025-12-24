export const useAdmin = () => {
  const { user } = useSupabaseAuth()
  const supabase = useSupabaseClient()
  const isAdmin = ref(false)
  const loading = ref(false)

  // 检查用户是否是管理员
  const checkAdminStatus = async () => {
    if (!user.value) {
      isAdmin.value = false
      return false
    }

    loading.value = true
    try {
      const userId = user.value.id || user.value.sub
      if (!userId) {
        isAdmin.value = false
        return false
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error || !data) {
        isAdmin.value = false
        return false
      }

      isAdmin.value = data.is_admin || false
      return isAdmin.value
    } catch (error) {
      console.error('检查管理员权限失败:', error)
      isAdmin.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  // 监听用户变化，自动检查管理员状态
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
