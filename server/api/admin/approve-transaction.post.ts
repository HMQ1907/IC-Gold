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
    .eq('id', Number(transactionId))
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
      processed_by: Number(admin.id),
      processed_at: new Date().toISOString(),
      admin_note: note || null
    })
    .eq('id', Number(transactionId))

  if (updateError) {
    console.error('Transaction update error:', updateError)
    throw createError({
      statusCode: 500,
      message: `Failed to update transaction: ${updateError.message}`
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

  // Notify user - Vietnamese
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(tx.amount)
  const typeText = tx.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'
  
  let title, message
  if (action === 'approve') {
    title = `${typeText} thành công`
    message = tx.type === 'deposit' 
      ? `Yêu cầu nạp $${formattedAmount} của bạn đã được duyệt. Số dư đã được cộng vào tài khoản.${note ? ` Ghi chú: ${note}` : ''}`
      : `Yêu cầu rút $${formattedAmount} của bạn đã được duyệt. Vui lòng kiểm tra ví của bạn.${note ? ` Ghi chú: ${note}` : ''}`
  } else {
    title = `${typeText} bị từ chối`
    message = tx.type === 'deposit'
      ? `Yêu cầu nạp $${formattedAmount} của bạn đã bị từ chối.${note ? ` Lý do: ${note}` : ''}`
      : `Yêu cầu rút $${formattedAmount} của bạn đã bị từ chối. Số tiền đã được hoàn lại vào tài khoản.${note ? ` Lý do: ${note}` : ''}`
  }
  
  await createNotification(
    tx.user_id,
    title,
    message,
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
