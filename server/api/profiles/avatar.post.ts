import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { serverCache, CACHE_KEYS } from '~/server/utils/cache'

/**
 * 上传用户头像到 Storage 并更新 profiles.avatar_url
 * POST /api/profiles/avatar
 * Body: FormData { file: File }
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)

  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File | null

    if (!file) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${user.id}/avatar.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const adminClient = serverSupabaseServiceRole(event)

    // 上传到 avatars bucket（upsert 覆盖已有文件）
    const { error: uploadError } = await adminClient.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      })

    if (uploadError) throw uploadError

    // 获取公开 URL
    const { data: urlData } = adminClient.storage.from('avatars').getPublicUrl(filePath)
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

    // 更新 profiles.avatar_url
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (updateError) throw updateError

    // 清除缓存
    serverCache.delete(`${CACHE_KEYS.PROFILE}${user.id}`)
    serverCache.delete(`${CACHE_KEYS.PROFILES_LIST}all`)

    return { success: true, data: { avatar_url: avatarUrl } }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: error.message || 'Failed to upload avatar' })
  }
})
