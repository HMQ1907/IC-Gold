import { requireAuth, getSupabaseAdmin, createNotification, getSiteSetting } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { amount, txHash } = body

  // Validate input
  if (!amount || amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Invalid amount'
    })
  }

  if (!txHash) {
    throw createError({
      statusCode: 400,
      message: 'Transaction hash is required'
    })
  }

  // Check minimum deposit
  const minDeposit = parseFloat(await getSiteSetting('min_deposit') || '10')
  if (amount < minDeposit) {
    throw createError({
      statusCode: 400,
      message: `Minimum deposit amount is $${minDeposit}`
    })
  }

  const supabase = getSupabaseAdmin()

  // Check if tx_hash already exists
  const { data: existingTx } = await supabase
    .from('transactions')
    .select('id')
    .eq('tx_hash', txHash)
    .single()

  if (existingTx) {
    throw createError({
      statusCode: 400,
      message: 'Transaction hash has already been used'
    })
  }

  // Get wallet address
  const walletAddress = await getSiteSetting('trc20_wallet_address')

  // Create transaction record
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'deposit',
      amount,
      status: 'pending',
      tx_hash: txHash,
      wallet_address: walletAddress,
      network: 'TRC20'
    })
    .select()
    .single()

  if (error) {
    console.error('Create deposit error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create deposit request'
    })
  }

  // Create notification
  await createNotification(
    user.id,
    'Deposit request submitted',
    `Your deposit request of $${amount} is pending confirmation. Please wait for admin processing.`,
    'info'
  )

  return {
    message: 'Deposit request submitted',
    transaction
  }
})
