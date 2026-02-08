import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event)
  
  const { adminId, date } = body
  
  if (!adminId) {
    throw createError({
      statusCode: 400,
      message: 'Missing adminId'
    })
  }
  
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  // Get all pending requests for the date
  const { data: pendingRequests, error: fetchError } = await client
    .from('daily_copy_trade_requests')
    .select('*, users!daily_copy_trade_requests_user_id_fkey(id, balance)')
    .eq('status', 'pending')
    .eq('request_date', targetDate)
  
  if (fetchError) {
    console.error('Error fetching pending requests:', fetchError)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch pending requests'
    })
  }
  
  if (!pendingRequests || pendingRequests.length === 0) {
    return {
      success: true,
      message: 'Không có yêu cầu nào cần duyệt',
      approvedCount: 0
    }
  }
  
  let approvedCount = 0
  const errors: string[] = []
  
  // Process each request
  for (const request of pendingRequests) {
    try {
      // Update user balance
      const newBalance = (request.users?.balance || 0) + request.amount
      
      await client
        .from('users')
        .update({ balance: newBalance })
        .eq('id', request.user_id)
      
      // Create transaction record
      await client
        .from('transactions')
        .insert({
          user_id: request.user_id,
          type: 'copy_trade',
          amount: request.amount,
          status: 'completed',
          admin_note: `Daily Copy Trade bonus - ${request.time_window}`,
          processed_by: adminId,
          processed_at: new Date().toISOString()
        })
      
      // Update request status
      await client
        .from('daily_copy_trade_requests')
        .update({
          status: 'approved',
          processed_by: adminId,
          processed_at: new Date().toISOString(),
          admin_note: 'Bulk approved'
        })
        .eq('id', request.id)
      
      approvedCount++
    } catch (error: any) {
      errors.push(`User ${request.user_id}: ${error.message}`)
    }
  }
  
  return {
    success: true,
    message: `Đã duyệt ${approvedCount}/${pendingRequests.length} yêu cầu`,
    approvedCount,
    totalAmount: approvedCount * 10,
    errors: errors.length > 0 ? errors : undefined
  }
})
