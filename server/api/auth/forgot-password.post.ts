import { getSupabaseAdmin, getSiteSetting } from '~~/server/utils/supabase'
import { sendEmail } from '~~/server/utils/email'
import { generateOtp } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required'
    })
  }

  const supabase = getSupabaseAdmin()

  // Check if user exists
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, is_active')
    .eq('email', email.toLowerCase().trim())
    .single()

  // Don't reveal if user exists or not for security
  if (userError || !user) {
    // Return success anyway to prevent email enumeration
    return {
      success: true,
      message: 'If the email exists, a reset code has been sent'
    }
  }

  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      message: 'Account is deactivated. Please contact support.'
    })
  }

  // Generate OTP
  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  // Invalidate any existing reset_password OTPs for this user
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('user_id', user.id)
    .eq('type', 'reset_password')
    .eq('used', false)

  // Create new OTP
  const { error: otpError } = await supabase
    .from('otp_codes')
    .insert({
      user_id: user.id,
      email: user.email,
      code: otp,
      type: 'reset_password',
      expires_at: expiresAt.toISOString()
    })

  if (otpError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to generate reset code'
    })
  }

  // Get site name
  const siteName = await getSiteSetting('site_name') || 'IC-Gold'

  // Send email
  try {
    await sendEmail({
      to: user.email!,
      subject: `Password Reset Code - ${siteName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Password Reset</h2>
          <p>Hello ${user.full_name || 'User'},</p>
          <p>You requested to reset your password. Use the code below to proceed:</p>
          <div style="background: #1f2937; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
          <p style="color: #888; font-size: 12px;">${siteName} - Secure Crypto Investment Platform</p>
        </div>
      `
    })
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError)
    // Still return success - OTP is saved
  }

  return {
    success: true,
    message: 'If the email exists, a reset code has been sent'
  }
})
