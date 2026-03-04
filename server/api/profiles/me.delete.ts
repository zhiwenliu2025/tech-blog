import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'

/**
 * 删除当前用户账户（调用 RPC delete_user，需要 service_role 删除 auth.users）
 * DELETE /api/profiles/me
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub

  try {
    const client = await serverSupabaseClient(event)

    // 调用数据库 RPC 删除用户数据（级联删除 profiles、posts 等）
    const { error: rpcError } = await (client.rpc as any)('delete_user')
    if (rpcError) throw rpcError

    // 用 service_role 删除 auth.users 中的用户
    const adminClient = serverSupabaseServiceRole(event)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)
    if (authError) throw authError

    return { success: true, message: 'Account deleted' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to delete account' })
  }
})
