import { requireAdmin, getSupabaseAdmin, logAdminAction } from '~~/server/utils/supabase'
import { hashPassword, validatePassword } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)
  const { userId, newPassword } = body

  if (!userId || !newPassword) {
    throw createError({
      statusCode: 400,
      message: 'User ID and new password are required'
    })
  }

  // Validate new password
  const validation = validatePassword(newPassword)
  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      message: validation.message
    })
  }

  const supabase = getSupabaseAdmin()

  // Check if user exists
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id, email, phone')
    .eq('id', userId)
    .single()

  if (userError || !targetUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword)

  // Update password in database
  const { error } = await supabase
    .from('users')
    .update({ password_hash: newPasswordHash })
    .eq('id', userId)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update password'
    })
  }

  // Log admin action
  await logAdminAction(admin.id, 'reset_user_password', {
    targetUserId: userId,
    note: `Password reset for user ${targetUser.email || targetUser.phone}`,
    ipAddress: getHeader(event, 'x-forwarded-for') || undefined,
    userAgent: getHeader(event, 'user-agent') || undefined
  })

  return {
    success: true,
    message: 'Password reset successfully'
  }
})
