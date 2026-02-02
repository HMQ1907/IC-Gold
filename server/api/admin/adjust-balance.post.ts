import { requireAdmin, getSupabaseAdmin, logAdminAction, createNotification } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)
  const { userId, amount, note } = body

  if (!userId || amount === undefined || amount === 0) {
    throw createError({
      statusCode: 400,
      message: 'User ID and amount are required'
    })
  }

  const supabase = getSupabaseAdmin()

  // Get current user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  const newBalance = user.balance + amount

  if (newBalance < 0) {
    throw createError({
      statusCode: 400,
      message: 'Balance cannot be negative'
    })
  }

  // Update balance
  const { error: updateError } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', userId)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update balance'
    })
  }

  // Create transaction record
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'admin_adjust',
    amount: Math.abs(amount),
    status: 'completed',
    admin_note: note,
    processed_by: admin.id,
    processed_at: new Date().toISOString()
  })

  // Log admin action
  await logAdminAction(admin.id, 'adjust_balance', {
    targetUserId: userId,
    oldValue: user.balance.toString(),
    newValue: newBalance.toString(),
    amountChange: amount,
    note,
    ipAddress: getHeader(event, 'x-forwarded-for') || undefined,
    userAgent: getHeader(event, 'user-agent') || undefined
  })

  // Notify user
  await createNotification(
    userId,
    amount > 0 ? 'Balance increased' : 'Balance decreased',
    `Your account has been ${amount > 0 ? 'credited' : 'debited'} $${Math.abs(amount)}${note ? `. Reason: ${note}` : ''}`,
    amount > 0 ? 'success' : 'warning'
  )

  return {
    message: 'Balance adjusted successfully',
    oldBalance: user.balance,
    newBalance,
    change: amount
  }
})
