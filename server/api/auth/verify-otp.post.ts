import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { sendWelcomeEmail } from '~~/server/utils/email'
import { generateSessionToken, getSessionExpiry } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code, email, phone, type = 'register' } = body

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'OTP code is required'
    })
  }

  if (!email && !phone) {
    throw createError({
      statusCode: 400,
      message: 'Email or phone number is required'
    })
  }

  const supabase = getSupabaseAdmin()

  // Find OTP
  let query = supabase
    .from('otp_codes')
    .select('*')
    .eq('code', code)
    .eq('type', type)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())

  if (email) {
    query = query.eq('email', email)
  } else if (phone) {
    query = query.eq('phone', phone)
  }

  const { data: otp, error: otpError } = await query.single()

  if (otpError || !otp) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired OTP code'
    })
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', otp.id)

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', otp.user_id)
    .single()

  if (userError || !user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Update user verification status
  const updateData: Record<string, any> = {}
  if (type === 'register' && email) {
    updateData.email_verified = true
    // Send welcome email
    await sendWelcomeEmail(email, user.full_name)
  } else if (type === 'register' && phone) {
    updateData.phone_verified = true
  }

  if (Object.keys(updateData).length > 0) {
    await supabase.from('users').update(updateData).eq('id', user.id)
  }

  // Create session
  const sessionToken = generateSessionToken()
  const sessionExpiry = getSessionExpiry()

  await supabase.from('sessions').insert({
    user_id: user.id,
    token: sessionToken,
    ip_address: getHeader(event, 'x-forwarded-for') || 'unknown',
    user_agent: getHeader(event, 'user-agent') || 'unknown',
    expires_at: sessionExpiry.toISOString()
  })

  // Update last login
  await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id)

  // Set cookie
  setCookie(event, 'auth_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  // Remove sensitive data
  const { password_hash, ...safeUser } = user

  return {
    user: { ...safeUser, ...updateData },
    message: 'Verification successful'
  }
})
