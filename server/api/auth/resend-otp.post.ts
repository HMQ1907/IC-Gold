import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { sendOtpEmail } from '~~/server/utils/email'
import { generateOtp, getOtpExpiry } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, type } = body

  if (!email || !type) {
    throw createError({
      statusCode: 400,
      message: 'Email and type are required'
    })
  }

  const allowedTypes = ['register', 'reset_password']
  if (!allowedTypes.includes(type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid OTP type'
    })
  }

  const supabase = getSupabaseAdmin()

  const { data: user } = await supabase
    .from('users')
    .select('id, email, is_active')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!user) {
    // Don't reveal if user exists
    return { success: true, message: 'If the email exists, a new OTP has been sent' }
  }

  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      message: 'Account is deactivated'
    })
  }

  // Rate limit: check if OTP was sent within the last 60 seconds
  const { data: recentOtp } = await supabase
    .from('otp_codes')
    .select('created_at')
    .eq('user_id', user.id)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (recentOtp) {
    const lastSent = new Date(recentOtp.created_at).getTime()
    const now = Date.now()
    if (now - lastSent < 60_000) {
      throw createError({
        statusCode: 429,
        message: 'Please wait before requesting a new OTP'
      })
    }
  }

  // Invalidate previous OTPs of the same type
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('user_id', user.id)
    .eq('type', type)
    .eq('used', false)

  const otp = generateOtp()
  const expiresAt = getOtpExpiry()

  await supabase.from('otp_codes').insert({
    user_id: user.id,
    email: user.email,
    code: otp,
    type,
    expires_at: expiresAt.toISOString()
  })

  await sendOtpEmail(user.email!, otp, type)

  return {
    success: true,
    message: 'A new OTP has been sent to your email'
  }
})
