import { requireAdmin, getSupabaseAdmin, logAdminAction, createNotification } from '~~/server/utils/supabase'
import { sendTransactionEmail } from '~~/server/utils/email'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)
  const { transactionId, action, note } = body

  if (!transactionId || !['approve', 'reject'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Transaction ID and action are required'
    })
  }

  const supabase = getSupabaseAdmin()

  // Get transaction
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .select('*, user:user_id (*)')
    .eq('id', transactionId)
    .single()

  if (txError || !tx) {
    throw createError({
      statusCode: 404,
      message: 'Transaction not found'
    })
  }

  if (tx.status !== 'pending') {
    throw createError({
      statusCode: 400,
      message: 'Transaction has already been processed'
    })
  }

  const newStatus = action === 'approve' ? 'completed' : 'rejected'

  // Update transaction
  const { error: updateError } = await supabase
    .from('transactions')
    .update({
      status: newStatus,
      processed_by: admin.id,
      processed_at: new Date().toISOString(),
      admin_note: note
    })
    .eq('id', transactionId)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update transaction'
    })
  }

  // Handle balance changes
  if (tx.type === 'deposit' && action === 'approve') {
    // Add balance for approved deposit
    await supabase
      .from('users')
      .update({ balance: (tx.user as any).balance + tx.amount })
      .eq('id', tx.user_id)
  } else if (tx.type === 'withdraw' && action === 'reject') {
    // Refund balance for rejected withdrawal
    await supabase
      .from('users')
      .update({ balance: (tx.user as any).balance + tx.amount })
      .eq('id', tx.user_id)
  }

  // Log admin action
  await logAdminAction(admin.id, `${action}_transaction`, {
    targetUserId: tx.user_id,
    targetTransactionId: transactionId,
    oldValue: 'pending',
    newValue: newStatus,
    amountChange: tx.amount,
    note,
    ipAddress: getHeader(event, 'x-forwarded-for') || undefined,
    userAgent: getHeader(event, 'user-agent') || undefined
  })

  // Notify user
  const actionText = action === 'approve' ? 'approved' : 'rejected'
  const typeText = tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'
  
  await createNotification(
    tx.user_id,
    `${typeText} ${actionText}`,
    `Your ${typeText.toLowerCase()} request of $${tx.amount} has been ${actionText}${note ? `. Note: ${note}` : ''}`,
    action === 'approve' ? 'success' : 'error'
  )

  // Send email
  if ((tx.user as any).email) {
    await sendTransactionEmail(
      (tx.user as any).email,
      tx.type as 'deposit' | 'withdraw',
      tx.amount,
      newStatus as 'completed' | 'rejected'
    )
  }

  return {
    message: `Transaction has been ${action === 'approve' ? 'approved' : 'rejected'}`,
    status: newStatus
  }
})
