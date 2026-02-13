import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'
import { hashPassword, verifyPassword, validatePassword } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: 'Current password and new password are required'
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

  // Verify current password
  const isValid = await verifyPassword(currentPassword, user.password_hash)
  if (!isValid) {
    throw createError({
      statusCode: 400,
      message: 'Current password is incorrect'
    })
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword)

  // Update password in database
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('users')
    .update({ password_hash: newPasswordHash })
    .eq('id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update password'
    })
  }

  return {
    success: true,
    message: 'Password changed successfully'
  }
})
