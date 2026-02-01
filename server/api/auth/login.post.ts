import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { sendOtpEmail } from '~~/server/utils/email'
import { 
  verifyPassword, 
  generateOtp, 
  generateSessionToken,
  getOtpExpiry,
  getSessionExpiry 
} from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, phone, password } = body

  if (!email && !phone) {
    throw createError({
      statusCode: 400,
      message: 'Email hoặc số điện thoại là bắt buộc'
    })
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      message: 'Mật khẩu là bắt buộc'
    })
  }

  const supabase = getSupabaseAdmin()

  // Find user
  let query = supabase.from('users').select('*')
  
  if (email) {
    query = query.eq('email', email)
  } else if (phone) {
    query = query.eq('phone', phone)
  }

  const { data: user, error } = await query.single()

  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Email/số điện thoại hoặc mật khẩu không đúng'
    })
  }

  // Check if user is active
  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      message: 'Tài khoản đã bị khóa'
    })
  }

  // Verify password
  if (!verifyPassword(password, user.password_hash)) {
    throw createError({
      statusCode: 401,
      message: 'Email/số điện thoại hoặc mật khẩu không đúng'
    })
  }

  // Check if email is verified
  if (email && !user.email_verified) {
    // Send new OTP
    const otpCode = generateOtp()
    const otpExpiry = getOtpExpiry()

    await supabase.from('otp_codes').insert({
      user_id: user.id,
      email: email,
      code: otpCode,
      type: 'register',
      expires_at: otpExpiry.toISOString()
    })

    await sendOtpEmail(email, otpCode, 'register')

    return {
      requireOtp: true,
      type: 'verify_email',
      email,
      message: 'Vui lòng xác thực email. Mã OTP đã được gửi.'
    }
  }

  // Check if 2FA is enabled
  if (user.is_2fa_enabled) {
    const otpCode = generateOtp()
    const otpExpiry = getOtpExpiry()

    await supabase.from('otp_codes').insert({
      user_id: user.id,
      email: user.email,
      code: otpCode,
      type: 'login',
      expires_at: otpExpiry.toISOString()
    })

    if (user.email) {
      await sendOtpEmail(user.email, otpCode, 'login')
    }

    return {
      requireOtp: true,
      type: '2fa',
      email: user.email,
      message: 'Vui lòng nhập mã OTP từ email của bạn'
    }
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
    user: safeUser,
    message: 'Đăng nhập thành công'
  }
})
