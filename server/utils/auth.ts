import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

/**
 * 获取当前登录用户，未登录则抛出 401
 */
export async function requireAuth(event: H3Event) {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}

/**
 * 检查当前用户是否为管理员（通过 service_role 绕过 RLS 查询 profiles）
 */
export async function isAdminUser(event: H3Event): Promise<boolean> {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) return false

    const adminClient = serverSupabaseServiceRole(event)
    const { data } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return data?.is_admin === true
  } catch {
    return false
  }
}

/**
 * 获取当前用户，并验证其拥有管理员权限，否则抛出 403
 */
export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event)
  const admin = await isAdminUser(event)
  if (!admin) {
    throw createError({ statusCode: 403, message: 'Forbidden: Admin only' })
  }
  return user
}
