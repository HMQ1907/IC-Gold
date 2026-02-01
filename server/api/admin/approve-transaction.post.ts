import { requireAdmin, getSupabaseAdmin, logAdminAction, createNotification } from '~~/server/utils/supabase'
import { sendTransactionEmail } from '~~/server/utils/email'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)
  const { transactionId, action, note } = body

  if (!transactionId || !['approve', 'reject'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Transaction ID và action là bắt buộc'
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
      message: 'Không tìm thấy giao dịch'
    })
  }

  if (tx.status !== 'pending') {
    throw createError({
      statusCode: 400,
      message: 'Giao dịch đã được xử lý'
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
      message: 'Không thể cập nhật giao dịch'
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
  const actionText = action === 'approve' ? 'đã được duyệt' : 'đã bị từ chối'
  const typeText = tx.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'
  
  await createNotification(
    tx.user_id,
    `${typeText} ${actionText}`,
    `Yêu cầu ${typeText.toLowerCase()} $${tx.amount} ${actionText}${note ? `. Ghi chú: ${note}` : ''}`,
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
    message: `Giao dịch đã ${action === 'approve' ? 'được duyệt' : 'bị từ chối'}`,
    status: newStatus
  }
})
