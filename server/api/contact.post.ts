import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * 提交联系表单消息（无需登录，使用 service_role 写入）
 * POST /api/contact
 * Body: { name, email, subject, message }
 */
export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: 'name, email and message are required' })
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address' })
  }

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { error } = await adminClient.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
      read: false
    })

    if (error) throw error

    return { success: true, message: 'Message sent successfully' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to send message' })
  }
})
