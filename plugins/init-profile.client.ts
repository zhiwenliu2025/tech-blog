export default defineNuxtPlugin(async () => {
  const { user } = useSupabaseAuth()
  const supabase = useSupabaseClient()

  // Watch for user changes
  watch(
    user,
    async newUser => {
      if (newUser) {
        // Check if user profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .single()

        // If profile doesn't exist, create one
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await supabase.from('profiles').insert({
            id: newUser.id,
            username: newUser.email?.split('@')[0] || 'user',
            full_name: newUser.user_metadata?.full_name || '',
            created_at: new Date().toISOString()
          })
        }
      }
    },
    { immediate: true }
  )
})
