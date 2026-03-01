import { getSupabaseAdmin, createNotification } from '~~/server/utils/supabase'
import { generateSessionToken, getSessionExpiry } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { email, code } = body

  if (!email || !code) {
    throw createError({
      statusCode: 400,
      message: 'Email and OTP code are required'
    })
  }

  const supabase = getSupabaseAdmin()

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, email_verified')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (userError || !user) {
    throw createError({
      statusCode: 400,
      message: 'Invalid verification request'
    })
  }

  if (user.email_verified) {
    throw createError({
      statusCode: 400,
      message: 'Email is already verified'
    })
  }

  // Verify OTP
  const { data: otpRecord, error: otpError } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('user_id', user.id)
    .eq('code', code)
    .eq('type', 'register')
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (otpError || !otpRecord) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired OTP code'
    })
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', otpRecord.id)

  // Set email_verified = true
  await supabase
    .from('users')
    .update({
      email_verified: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  // Create session and auto-login
  const token = generateSessionToken()
  const expiresAt = getSessionExpiry()

  await supabase.from('sessions').insert({
    user_id: user.id,
    token,
    ip_address: getHeader(event, 'x-forwarded-for') || null,
    user_agent: getHeader(event, 'user-agent') || null,
    expires_at: expiresAt.toISOString()
  })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  })

  await createNotification(
    user.id,
    'Chào mừng đến với IC-Gold!',
    'Cảm ơn bạn đã đăng ký. Hãy nạp tiền để bắt đầu đầu tư!',
    'success'
  )

  return {
    success: true,
    message: 'Email verified successfully',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name
    }
  }
})
