import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event)
  
  const { requestId, action, adminId, note } = body
  
  if (!requestId || !action || !adminId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }
  
  if (!['approve', 'reject'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid action'
    })
  }
  
  // Get the request
  const { data: request, error: fetchError } = await client
    .from('daily_copy_trade_requests')
    .select('*, users!daily_copy_trade_requests_user_id_fkey(id, balance)')
    .eq('id', requestId)
    .single()
  
  if (fetchError || !request) {
    throw createError({
      statusCode: 404,
      message: 'Request not found'
    })
  }
  
  if (request.status !== 'pending') {
    throw createError({
      statusCode: 400,
      message: 'Request already processed'
    })
  }
  
  const newStatus = action === 'approve' ? 'approved' : 'rejected'
  
  // Start transaction-like operations
  if (action === 'approve') {
    const currentBalance = request.users?.balance || 0
    const bonusAmount = Number((currentBalance * 0.01).toFixed(2))
    const newBalance = currentBalance + bonusAmount
    
    const { error: balanceError } = await client
      .from('users')
      .update({ balance: newBalance })
      .eq('id', request.user_id)
    
    if (balanceError) {
      console.error('Error updating balance:', balanceError)
      throw createError({
        statusCode: 500,
        message: 'Failed to update balance'
      })
    }
    
    // Create transaction record
    await client
      .from('transactions')
      .insert({
        user_id: request.user_id,
        type: 'copy_trade',
        amount: bonusAmount,
        status: 'completed',
        admin_note: `Daily Copy Trade bonus - ${request.time_window}`,
        processed_by: adminId,
        processed_at: new Date().toISOString()
      })

    await client
      .from('daily_copy_trade_requests')
      .update({ amount: bonusAmount })
      .eq('id', requestId)
  }
  
  // Update request status
  const { error: updateError } = await client
    .from('daily_copy_trade_requests')
    .update({
      status: newStatus,
      processed_by: adminId,
      processed_at: new Date().toISOString(),
      admin_note: note || null
    })
    .eq('id', requestId)
  
  if (updateError) {
    console.error('Error updating request:', updateError)
    throw createError({
      statusCode: 500,
      message: 'Failed to update request'
    })
  }
  
  return {
    success: true,
    message: action === 'approve' 
      ? 'Đã duyệt và cộng 1% số dư hiện tại cho user'
      : 'Đã từ chối yêu cầu'
  }
})
