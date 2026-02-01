import { getSupabaseAdmin, createNotification } from '~~/server/utils/supabase'
import { sendOtpEmail } from '~~/server/utils/email'
import { 
  hashPassword, 
  generateOtp, 
  getOtpExpiry,
  isValidEmail,
  isValidPhone,
  validatePassword 
} from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, phone, password, fullName, referralCode } = body

  // Validate input
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

  // Validate email format
  if (email && !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  // Validate phone format
  if (phone && !isValidPhone(phone)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid phone number format'
    })
  }

  // Validate password strength
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    throw createError({
      statusCode: 400,
      message: passwordValidation.message
    })
  }

  const supabase = getSupabaseAdmin()

  // Check if email already exists
  if (email) {
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      throw createError({
        statusCode: 400,
        message: 'Email is already in use'
      })
    }
  }

  // Check if phone already exists
  if (phone) {
    const { data: existingPhone } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existingPhone) {
      throw createError({
        statusCode: 400,
        message: 'Phone number is already in use'
      })
    }
  }

  // Check referral code if provided
  let referrerId: number | null = null
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id, referral_uses, max_referral_uses')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (!referrer) {
      throw createError({
        statusCode: 400,
        message: 'Invalid referral code'
      })
    }

    if (referrer.referral_uses >= referrer.max_referral_uses) {
      throw createError({
        statusCode: 400,
        message: 'Referral code has reached its usage limit'
      })
    }

    referrerId = referrer.id
  }

  // Create user
  const passwordHash = hashPassword(password)

  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert({
      email: email || null,
      phone: phone || null,
      password_hash: passwordHash,
      full_name: fullName || null,
      referred_by: referrerId
    })
    .select()
    .single()

  if (userError || !newUser) {
    console.error('Create user error:', userError)
    throw createError({
      statusCode: 500,
      message: 'Failed to create account'
    })
  }

  // Create referral record if referral code was used
  if (referrerId) {
    await supabase.from('referrals').insert({
      referrer_id: referrerId,
      referred_id: newUser.id,
      bonus_amount: 10.00,
      bonus_paid: false
    })
  }

  // Generate and send OTP
  const otpCode = generateOtp()
  const otpExpiry = getOtpExpiry()

  await supabase.from('otp_codes').insert({
    user_id: newUser.id,
    email: email || null,
    phone: phone || null,
    code: otpCode,
    type: 'register',
    expires_at: otpExpiry.toISOString()
  })

  // Send OTP email
  if (email) {
    await sendOtpEmail(email, otpCode, 'register')
  }

  // Create welcome notification
  await createNotification(
    newUser.id,
    'Welcome to IC-Gold!',
    'Thank you for registering. Please verify your email to start using the platform.',
    'success'
  )

  return {
    message: 'Registration successful. Please check your email to verify your account.',
    email,
    phone
  }
})
