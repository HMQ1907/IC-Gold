import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend(): Resend {
  if (!resendClient) {
    const config = useRuntimeConfig()
    resendClient = new Resend(config.resendApiKey)
  }
  return resendClient
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const resend = getResend()
    const fromEmail = process.env.EMAIL_FROM || 'noreply@ic-gold.com'
    
    const { error } = await resend.emails.send({
      from: `IC-Gold <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export async function sendOtpEmail(email: string, code: string, type: string): Promise<boolean> {
  const typeLabels: Record<string, string> = {
    register: 'đăng ký tài khoản',
    login: 'đăng nhập',
    withdraw: 'rút tiền',
    '2fa': 'xác thực 2 bước',
    reset_password: 'đặt lại mật khẩu'
  }

  const typeLabel = typeLabels[type] || 'xác thực'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #1f2937; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #374151; color: #f59e0b; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0; }
        .text { color: #9ca3af; }
        .warning { color: #fbbf24; font-size: 14px; margin-top: 20px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🪙 IC-Gold</h1>
        </div>
        <div class="content">
          <p class="text">Xin chào,</p>
          <p class="text">Mã OTP của bạn để ${typeLabel} là:</p>
          <div class="code">${code}</div>
          <p class="text">Mã này sẽ hết hạn sau <strong style="color: #f59e0b;">10 phút</strong>.</p>
          <p class="warning">⚠️ Không chia sẻ mã này với bất kỳ ai. IC-Gold sẽ không bao giờ hỏi mã OTP của bạn.</p>
        </div>
        <div class="footer">
          <p>© 2024 IC-Gold. All rights reserved.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `[IC-Gold] Mã xác thực ${typeLabel}: ${code}`,
    html,
    text: `Mã OTP của bạn để ${typeLabel} là: ${code}. Mã này sẽ hết hạn sau 10 phút.`
  })
}

export async function sendWelcomeEmail(email: string, fullName?: string): Promise<boolean> {
  const name = fullName || 'bạn'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #1f2937; padding: 30px; border-radius: 0 0 10px 10px; }
        .text { color: #9ca3af; }
        .highlight { color: #f59e0b; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
        .features { margin: 20px 0; }
        .feature { color: #9ca3af; margin: 10px 0; }
        .feature span { color: #f59e0b; margin-right: 10px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🪙 IC-Gold</h1>
        </div>
        <div class="content">
          <h2 style="color: white;">Chào mừng ${name} đến với IC-Gold! 🎉</h2>
          <p class="text">Cảm ơn bạn đã đăng ký tài khoản. Bạn đã sẵn sàng để bắt đầu hành trình đầu tư của mình.</p>
          
          <div class="features">
            <div class="feature"><span>✓</span> Theo dõi biểu đồ crypto real-time</div>
            <div class="feature"><span>✓</span> Copy Trade từ các chuyên gia</div>
            <div class="feature"><span>✓</span> Nạp/Rút tiền nhanh chóng qua TRC20</div>
            <div class="feature"><span>✓</span> Nhận $10 cho mỗi lượt giới thiệu thành công</div>
          </div>
          
          <p class="text">Bắt đầu ngay bằng cách nạp tiền vào tài khoản của bạn!</p>
          
          <center><a href="${process.env.SITE_URL || 'http://localhost:3000'}/dashboard" class="button">Vào Dashboard</a></center>
        </div>
        <div class="footer">
          <p>© 2024 IC-Gold. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '🎉 Chào mừng đến với IC-Gold!',
    html,
    text: `Chào mừng ${name} đến với IC-Gold! Cảm ơn bạn đã đăng ký tài khoản.`
  })
}

export async function sendTransactionEmail(
  email: string,
  type: 'deposit' | 'withdraw',
  amount: number,
  status: 'pending' | 'completed' | 'rejected'
): Promise<boolean> {
  const typeLabels = {
    deposit: 'Nạp tiền',
    withdraw: 'Rút tiền'
  }

  const statusLabels = {
    pending: 'Đang chờ xử lý',
    completed: 'Thành công',
    rejected: 'Bị từ chối'
  }

  const statusColors = {
    pending: '#fbbf24',
    completed: '#10b981',
    rejected: '#ef4444'
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #1f2937; padding: 30px; border-radius: 0 0 10px 10px; }
        .text { color: #9ca3af; }
        .amount { color: #f59e0b; font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; }
        .status { text-align: center; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: bold; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🪙 IC-Gold</h1>
        </div>
        <div class="content">
          <h2 style="color: white;">${typeLabels[type]}</h2>
          <p class="text">Giao dịch ${typeLabels[type].toLowerCase()} của bạn:</p>
          <div class="amount">$${amount.toLocaleString()}</div>
          <center>
            <span class="status" style="background: ${statusColors[status]}20; color: ${statusColors[status]};">
              ${statusLabels[status]}
            </span>
          </center>
          <p class="text" style="margin-top: 20px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ bộ phận hỗ trợ.</p>
        </div>
        <div class="footer">
          <p>© 2024 IC-Gold. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `[IC-Gold] ${typeLabels[type]} $${amount.toLocaleString()} - ${statusLabels[status]}`,
    html,
    text: `${typeLabels[type]} $${amount.toLocaleString()} - ${statusLabels[status]}`
  })
}
