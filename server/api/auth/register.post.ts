import { getSupabaseAdmin } from '~~/server/utils/supabase'
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
  const body = await readBody(event) || {}
  const { email, phone, password, fullName, referralCode } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required'
    })
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      message: 'Password is required'
    })
  }

  if (!isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  if (phone && !isValidPhone(phone)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid phone number format'
    })
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    throw createError({
      statusCode: 400,
      message: passwordValidation.message
    })
  }

  const supabase = getSupabaseAdmin()

  // Check if email already exists
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id, email_verified')
    .eq('email', email)
    .single()

  if (existingEmail) {
    if (existingEmail.email_verified) {
      throw createError({
        statusCode: 400,
        message: 'Email is already in use'
      })
    }
    // Unverified account exists — delete it so user can re-register
    await supabase.from('otp_codes').delete().eq('user_id', existingEmail.id)
    await supabase.from('sessions').delete().eq('user_id', existingEmail.id)
    await supabase.from('referrals').delete().eq('referred_id', existingEmail.id)
    await supabase.from('users').delete().eq('id', existingEmail.id)
  }

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

  const { data: maxRefSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'max_referral_uses')
    .single()
  
  const maxReferralUses = maxRefSetting?.value ? parseInt(maxRefSetting.value) : 10

  let referrerId: number | null = null
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id, referral_uses')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (!referrer) {
      throw createError({
        statusCode: 400,
        message: 'Invalid referral code'
      })
    }

    if (referrer.referral_uses >= maxReferralUses) {
      throw createError({
        statusCode: 400,
        message: 'Referral code has reached its usage limit'
      })
    }

    referrerId = referrer.id
  }

  const passwordHash = await hashPassword(password)

  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase().trim(),
      phone: phone || null,
      password_hash: passwordHash,
      full_name: fullName || null,
      referred_by: referrerId,
      email_verified: false
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

    const { data: referrer } = await supabase
      .from('users')
      .select('referral_uses')
      .eq('id', referrerId)
      .single()

    if (referrer) {
      await supabase
        .from('users')
        .update({ referral_uses: referrer.referral_uses + 1 })
        .eq('id', referrerId)
    }
  }

  // Generate OTP and send verification email
  const otp = generateOtp()
  const expiresAt = getOtpExpiry()

  await supabase.from('otp_codes').insert({
    user_id: newUser.id,
    email: newUser.email,
    code: otp,
    type: 'register',
    expires_at: expiresAt.toISOString()
  })

  await sendOtpEmail(newUser.email!, otp, 'register')

  return {
    success: true,
    needsVerification: true,
    message: 'Registration successful. Please verify your email.',
    email: newUser.email
  }
})
