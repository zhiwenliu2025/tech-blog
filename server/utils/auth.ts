import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}

export async function isAdminUser(event: H3Event): Promise<boolean> {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) return false

    const userId = user.id || (user as any).sub
    if (!userId) return false

    const adminClient = serverSupabaseServiceRole(event)
    const { data } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle()

    return data?.is_admin === true
  } catch {
    return false
  }
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event)
  const admin = await isAdminUser(event)
  if (!admin) {
    throw createError({ statusCode: 403, message: 'Forbidden: Admin only' })
  }
  return user
}
