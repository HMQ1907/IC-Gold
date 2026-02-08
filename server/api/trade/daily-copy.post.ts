import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event)
  
  const { userId, timeWindow } = body
  
  if (!userId || !timeWindow) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }
  
  // Get today's date (YYYY-MM-DD format)
  const today = new Date().toISOString().split('T')[0]
  
  // Check if user already submitted today
  const { data: existing } = await client
    .from('daily_copy_trade_requests')
    .select('id, status')
    .eq('user_id', userId)
    .eq('request_date', today)
    .single()
  
  if (existing) {
    return {
      success: false,
      alreadySubmitted: true,
      status: existing.status,
      message: existing.status === 'pending' 
        ? 'Bạn đã gửi yêu cầu hôm nay, đang chờ Admin duyệt'
        : existing.status === 'approved'
        ? 'Yêu cầu hôm nay đã được duyệt'
        : 'Yêu cầu hôm nay đã bị từ chối'
    }
  }
  
  // Insert new request
  const { data, error } = await client
    .from('daily_copy_trade_requests')
    .insert({
      user_id: userId,
      request_date: today,
      time_window: timeWindow,
      status: 'pending',
      amount: 10.00
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating daily copy trade request:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create request'
    })
  }
  
  return {
    success: true,
    message: 'Yêu cầu Copy Trade theo ngày đã được gửi thành công!',
    data
  }
})
