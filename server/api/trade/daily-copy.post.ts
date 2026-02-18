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
  
  // Normalize time window to base format (10:00 or 15:00)
  // This ensures consistent storage regardless of the display format
  const normalizedTimeWindow = timeWindow.includes('10:') && !timeWindow.includes('20:') ? '10:00' : 
                               timeWindow.includes('15:') ? '15:00' : 
                               timeWindow.includes('20:') ? '20:00' :
                               timeWindow.includes('21:') ? '21:00' : '10:00'
  
  // Check if user already submitted today for THIS SPECIFIC time window
  const { data: existing, error: checkError } = await client
    .from('daily_copy_trade_requests')
    .select('id, status')
    .eq('user_id', userId)
    .eq('request_date', today)
    .eq('time_window', normalizedTimeWindow)
    .maybeSingle()
  
  if (checkError) {
    console.error('Error checking existing request:', checkError)
  }
  
  if (existing) {
    return {
      success: false,
      alreadySubmitted: true,
      status: existing.status,
      message: existing.status === 'pending' 
        ? `Bạn đã gửi yêu cầu cho khung giờ ${normalizedTimeWindow}, đang chờ Admin duyệt`
        : existing.status === 'approved'
        ? `Yêu cầu khung giờ ${normalizedTimeWindow} đã được duyệt`
        : `Yêu cầu khung giờ ${normalizedTimeWindow} đã bị từ chối`
    }
  }

  const { data: userData, error: userError } = await client
    .from('users')
    .select('balance')
    .eq('id', userId)
    .single()

  if (userError) {
    console.error('Error fetching user balance:', userError)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user balance'
    })
  }

  const previewAmount = Number(((userData?.balance || 0) * 0.01).toFixed(2))
  
  // Insert new request with normalized time window
  const { data, error } = await client
    .from('daily_copy_trade_requests')
    .insert({
      user_id: userId,
      request_date: today,
      time_window: normalizedTimeWindow,
      status: 'pending',
      amount: previewAmount
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating daily copy trade request:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create request: ' + error.message
    })
  }
  
  return {
    success: true,
    message: 'Yêu cầu Copy Trade theo ngày đã được gửi thành công!',
    data
  }
})
