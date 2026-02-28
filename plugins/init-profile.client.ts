export default defineNuxtPlugin(async () => {
  const { user } = useSupabaseAuth()
  const supabase = useSupabaseClient()

  // Watch for user changes
  watch(
    user,
    async newUser => {
      if (newUser && newUser.id) {
        // Check if user profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .single()

        // If profile doesn't exist, create one
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          // 优先使用 GitHub 用户信息，如果没有则使用邮箱或默认值
          const metadata = newUser.user_metadata || {}
          const username =
            metadata.user_name || // GitHub 用户名
            metadata.preferred_username || // 其他 OAuth 提供商的用户名
            newUser.email?.split('@')[0] || // 从邮箱提取
            'user' // 默认值

          const fullName =
            metadata.full_name || // GitHub 全名
            metadata.name || // 其他提供商的名称
            '' // 空字符串

          const avatarUrl =
            metadata.avatar_url || // GitHub 头像
            metadata.picture || // 其他提供商的头像
            '' // 空字符串

          await supabase.from('profiles').insert({
            id: newUser.id,
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          })
        } else if (profile) {
          // 如果用户资料已存在，但缺少 GitHub 信息，尝试更新
          const metadata = newUser.user_metadata || {}
          const updates = {}

          // 如果用户资料中没有头像，但 GitHub 有，则更新
          if (!profile.avatar_url && metadata.avatar_url) {
            updates.avatar_url = metadata.avatar_url
          }

          // 如果用户资料中没有全名，但 GitHub 有，则更新
          if (!profile.full_name && metadata.full_name) {
            updates.full_name = metadata.full_name
          }

          // 如果有更新，则保存
          if (Object.keys(updates).length > 0) {
            await supabase.from('profiles').update(updates).eq('id', newUser.id)
          }
        }
      }
    },
    { immediate: true }
  )
})
