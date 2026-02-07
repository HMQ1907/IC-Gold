import { requireAuth, getSupabaseAdmin, createNotification, getSiteSetting } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
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

  // Check minimum withdrawal
  const minWithdraw = parseFloat(await getSiteSetting('min_withdraw') || '50')
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

  // 25-day lock from FIRST approved deposit
  const { data: firstDeposit } = await supabase
    .from('transactions')
    .select('created_at, processed_at')
    .eq('user_id', user.id)
    .eq('type', 'deposit')
    .eq('status', 'completed')
    .order('processed_at', { ascending: true })
    .limit(1)
    .single()

  if (firstDeposit) {
    const depositDate = new Date(firstDeposit.processed_at || firstDeposit.created_at)
    const now = new Date()
    const daysSinceDeposit = Math.floor((now.getTime() - depositDate.getTime()) / (1000 * 60 * 60 * 24))
    const lockDays = 25
    if (daysSinceDeposit < lockDays) {
      const remainingDays = lockDays - daysSinceDeposit
      throw createError({
        statusCode: 400,
        message: `WITHDRAW_LOCKED:${remainingDays}`
      })
    }
  } else {
    // No completed deposit yet: cannot withdraw until first deposit is completed and 25 days passed
    throw createError({
      statusCode: 400,
      message: 'WITHDRAW_LOCKED:25'
    })
  }

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
