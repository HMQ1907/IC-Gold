import { requireAuth, getSupabaseAdmin, createNotification, getSiteSetting } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { action, percentage = 5 } = body

  const supabase = getSupabaseAdmin()

  if (action === 'start') {
    const minBalance = parseFloat((await getSiteSetting('copy_trade_min_balance')) || '500')
    // Check minimum balance
    if (user.balance < minBalance) {
      throw createError({
        statusCode: 400,
        message: `Minimum balance for Copy Trade is $${minBalance}`
      })
    }

    // Check if already copying
    if (user.copy_trade_active) {
      throw createError({
        statusCode: 400,
        message: 'Copy Trade is already active'
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
        message: 'Failed to start Copy Trade'
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
      'Copy Trade started',
      `Copying ${percentage}% of assets ($${amount.toFixed(2)})`,
      'success'
    )

    return {
      message: 'Copy Trade started',
      percentage,
      amount
    }
  }

  if (action === 'stop') {
    // Check if copying
    if (!user.copy_trade_active) {
      throw createError({
        statusCode: 400,
        message: 'Copy Trade is not active'
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
        message: 'Failed to stop Copy Trade'
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
      'Copy Trade stopped',
      'You have successfully stopped Copy Trade',
      'info'
    )

    return {
      message: 'Copy Trade stopped'
    }
  }

  throw createError({
    statusCode: 400,
    message: 'Invalid action'
  })
})
