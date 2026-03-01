import { requireAuth, getSupabaseAdmin, createNotification, getSiteSetting } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event) || {}
  const { amount, walletAddress } = body

  // Validate input
  if (!amount || amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Invalid amount'
    })
  }

  if (!walletAddress) {
    throw createError({
      statusCode: 400,
      message: 'Wallet address is required'
    })
  }

  // Check minimum withdrawal ($20)
  const minWithdraw = parseFloat(await getSiteSetting('min_withdraw') || '20')
  if (amount < minWithdraw) {
    throw createError({
      statusCode: 400,
      message: `Minimum withdrawal amount is $${minWithdraw}`
    })
  }

  // Check balance
  if (amount > user.balance) {
    throw createError({
      statusCode: 400,
      message: 'Insufficient balance'
    })
  }

  const supabase = getSupabaseAdmin()

  // Deduct balance (hold)
  const { error: balanceError } = await supabase
    .from('users')
    .update({ balance: user.balance - amount })
    .eq('id', user.id)

  if (balanceError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to deduct balance'
    })
  }

  // Create transaction record
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'withdraw',
      amount,
      status: 'pending',
      withdraw_address: walletAddress,
      network: 'TRC20'
    })
    .select()
    .single()

  if (error) {
    // Rollback balance
    await supabase
      .from('users')
      .update({ balance: user.balance })
      .eq('id', user.id)

    console.error('Create withdraw error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create withdrawal request'
    })
  }

  // Create notification
  await createNotification(
    user.id,
    'Withdrawal request submitted',
    `Your withdrawal request of $${amount} to ${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)} is pending.`,
    'info'
  )

  return {
    message: 'Withdrawal request submitted',
    transaction
  }
})
