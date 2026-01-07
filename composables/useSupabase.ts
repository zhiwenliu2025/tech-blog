export const useSupabaseAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(false)
  const error = ref(null)

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signOut()

      if (authError) throw authError

      user.value = null
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email)

      if (authError) throw authError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signInWithGitHub = async () => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const appUrl =
        config.public.appUrl || (process.client ? window.location.origin : 'http://localhost:3000')

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${appUrl}/auth/callback`
        }
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const linkIdentity = async (provider: 'github' | 'google') => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const appUrl =
        config.public.appUrl || (process.client ? window.location.origin : 'http://localhost:3000')

      const { data, error: linkError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${appUrl}/auth/callback`,
          skipBrowserRedirect: false
        }
      })

      if (linkError) throw linkError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const unlinkIdentity = async (identityId: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: unlinkError } = await supabase.auth.unlinkIdentity({
        identity_id: identityId
      })

      if (unlinkError) throw unlinkError

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getIdentities = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      return user?.identities || []
    } catch (err: any) {
      return []
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithGitHub,
    linkIdentity,
    unlinkIdentity,
    getIdentities
  }
}
