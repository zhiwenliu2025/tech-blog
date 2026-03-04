export default defineNuxtPlugin(async () => {
  const { user } = useSupabaseAuth()

  watch(
    user,
    async newUser => {
      if (!newUser?.id) return

      try {
        // 尝试获取现有资料
        const res: any = await $fetch('/api/profiles/me').catch(() => null)

        if (!res?.data) {
          // 资料不存在，通过 upsert 创建
          const metadata = newUser.user_metadata || {}
          const username =
            metadata.user_name ||
            metadata.preferred_username ||
            newUser.email?.split('@')[0] ||
            'user'
          const full_name = metadata.full_name || metadata.name || ''
          const avatar_url = metadata.avatar_url || metadata.picture || ''

          await $fetch('/api/profiles/me', {
            method: 'PUT' as any,
            body: { username, full_name, avatar_url }
          }).catch(console.error)
        } else {
          // 资料已存在，补全 OAuth 信息（如 GitHub 头像/全名）
          const metadata = newUser.user_metadata || {}
          const updates: Record<string, string> = {}

          if (!res.data.avatar_url && metadata.avatar_url) {
            updates.avatar_url = metadata.avatar_url
          }
          if (!res.data.full_name && (metadata.full_name || metadata.name)) {
            updates.full_name = metadata.full_name || metadata.name
          }

          if (Object.keys(updates).length > 0) {
            await $fetch('/api/profiles/me', {
              method: 'PUT' as any,
              body: updates
            }).catch(console.error)
          }
        }
      } catch (err) {
        console.warn('[init-profile] 初始化资料失败:', err)
      }
    },
    { immediate: true }
  )
})
