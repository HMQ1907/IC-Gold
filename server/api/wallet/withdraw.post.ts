import { requireAuth, getSupabaseAdmin, createNotification, getSiteSetting } from '~~/server/utils/supabase'
import { isValidTrc20Address } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { amount, walletAddress } = body

  // Validate input
  if (!amount || amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Số tiền không hợp lệ'
    })
  }

  if (!walletAddress) {
    throw createError({
      statusCode: 400,
      message: 'Địa chỉ ví là bắt buộc'
    })
  }

  // Validate TRC20 address
  if (!isValidTrc20Address(walletAddress)) {
    throw createError({
      statusCode: 400,
      message: 'Địa chỉ ví TRC20 không hợp lệ'
    })
  }

  // Check minimum withdrawal
  const minWithdraw = parseFloat(await getSiteSetting('min_withdraw') || '50')
  if (amount < minWithdraw) {
    throw createError({
      statusCode: 400,
      message: `Số tiền rút tối thiểu là $${minWithdraw}`
    })
  }

  // Check balance
  if (amount > user.balance) {
    throw createError({
      statusCode: 400,
      message: 'Số dư không đủ'
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
      message: 'Không thể trừ số dư'
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
      message: 'Không thể tạo yêu cầu rút tiền'
    })
  }

  // Create notification
  await createNotification(
    user.id,
    'Yêu cầu rút tiền đã được gửi',
    `Yêu cầu rút $${amount} về địa chỉ ${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)} đang chờ xử lý.`,
    'info'
  )

  return {
    message: 'Yêu cầu rút tiền đã được gửi',
    transaction
  }
})
