import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { sendOtpEmail } from '~~/server/utils/email'
import { generateOtp, getOtpExpiry } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, phone, type = 'register' } = body

  if (!email && !phone) {
    throw createError({
      statusCode: 400,
      message: 'Email or phone number is required'
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
      statusCode: 404,
      message: 'Account not found'
    })
  }

  // Check rate limit (max 1 OTP per minute)
  const oneMinuteAgo = new Date()
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1)

  const { data: recentOtp } = await supabase
    .from('otp_codes')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', type)
    .gt('created_at', oneMinuteAgo.toISOString())
    .single()

  if (recentOtp) {
    throw createError({
      statusCode: 429,
      message: 'Please wait 1 minute before resending'
    })
  }

  // Generate new OTP
  const otpCode = generateOtp()
  const otpExpiry = getOtpExpiry()

  await supabase.from('otp_codes').insert({
    user_id: user.id,
    email: email || null,
    phone: phone || null,
    code: otpCode,
    type,
    expires_at: otpExpiry.toISOString()
  })

  // Send OTP
  if (email) {
    await sendOtpEmail(email, otpCode, type)
  }

  return {
    message: 'OTP code has been resent'
  }
})
