export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useSupabaseAuth()

  // 如果用户未登录，重定向到登录页面
  if (!user.value) {
    return navigateTo('/auth/login')
  }

  // 检查用户是否是管理员
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.value.sub)
      .single()

    if (error || !data?.is_admin) {
      // 如果用户不是管理员，重定向到首页
      return navigateTo('/')
    }
  } catch (error) {
    console.error('检查管理员权限失败:', error)
    // 出现错误时，重定向到首页
    return navigateTo('/')
  }
})
