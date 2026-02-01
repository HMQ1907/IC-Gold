import { requireAuth, getSupabaseAdmin, createNotification } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { action, percentage = 5 } = body

  const supabase = getSupabaseAdmin()

  if (action === 'start') {
    // Check minimum balance
    if (user.balance < 1000) {
      throw createError({
        statusCode: 400,
        message: 'Số dư tối thiểu để sử dụng Copy Trade là $1,000'
      })
    }

    // Check if already copying
    if (user.copy_trade_active) {
      throw createError({
        statusCode: 400,
        message: 'Copy Trade đang hoạt động'
      })
    }

    // Calculate amount
    const amount = user.balance * (percentage / 100)

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        copy_trade_active: true,
        copy_trade_percentage: percentage
      })
      .eq('id', user.id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: 'Không thể bắt đầu Copy Trade'
      })
    }

    // Log copy trade
    await supabase.from('copy_trade_logs').insert({
      user_id: user.id,
      percentage,
      amount,
      balance_before: user.balance,
      balance_after: user.balance,
      status: 'active'
    })

    // Create notification
    await createNotification(
      user.id,
      'Copy Trade đã bắt đầu',
      `Đang sao chép ${percentage}% tài sản ($${amount.toFixed(2)})`,
      'success'
    )

    return {
      message: 'Copy Trade đã bắt đầu',
      percentage,
      amount
    }
  }

  if (action === 'stop') {
    // Check if copying
    if (!user.copy_trade_active) {
      throw createError({
        statusCode: 400,
        message: 'Copy Trade không hoạt động'
      })
    }

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        copy_trade_active: false
      })
      .eq('id', user.id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: 'Không thể dừng Copy Trade'
      })
    }

    // Update copy trade log
    await supabase
      .from('copy_trade_logs')
      .update({
        status: 'stopped',
        ended_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Create notification
    await createNotification(
      user.id,
      'Copy Trade đã dừng',
      'Bạn đã dừng Copy Trade thành công',
      'info'
    )

    return {
      message: 'Copy Trade đã dừng'
    }
  }

  throw createError({
    statusCode: 400,
    message: 'Action không hợp lệ'
  })
})
