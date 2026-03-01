import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { hashPassword } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { email, code, password } = body

  if (!email || !code || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email, code, and new password are required'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }

  const supabase = getSupabaseAdmin()

  // Find user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, is_active')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (userError || !user) {
    throw createError({
      statusCode: 400,
      message: 'Invalid reset request'
    })
  }

  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      message: 'Account is deactivated'
    })
  }

  // Verify OTP
  const { data: otpRecord, error: otpError } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('user_id', user.id)
    .eq('code', code)
    .eq('type', 'reset_password')
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (otpError || !otpRecord) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired verification code'
    })
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ 
      used: true,
      used_at: new Date().toISOString()
    })
    .eq('id', otpRecord.id)

  // Hash new password
  const passwordHash = await hashPassword(password)

  // Update user password
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      password_hash: passwordHash,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update password'
    })
  }

  // Invalidate all existing sessions for security
  await supabase
    .from('sessions')
    .delete()
    .eq('user_id', user.id)

  return {
    success: true,
    message: 'Password has been reset successfully'
  }
})
