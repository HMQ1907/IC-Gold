import { getSupabaseAdmin } from '~~/server/utils/supabase'
import {
  verifyPassword,
  generateSessionToken,
  getSessionExpiry
} from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, phone, password } = body

  if (!email && !phone) {
    throw createError({
      statusCode: 400,
      message: 'Email or phone number is required'
    })
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      message: 'Password is required'
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
  console.log(user);
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email/phone or password'
    })
  }

  // Check if user is active
  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      message: 'Account has been deactivated'
    })
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email/phone or password'
    })
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
    message: 'Login successful'
  }
})
