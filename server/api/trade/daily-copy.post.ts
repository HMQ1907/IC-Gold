import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event) || {}
  const { userId, timeWindow } = body

  if (!userId || !timeWindow) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  // Use Vietnam timezone for date consistency
  const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000)
  const today = vnNow.toISOString().split('T')[0]

  const normalizedTimeWindow = timeWindow.includes('10:') && !timeWindow.includes('20:') ? '10:00' :
                               timeWindow.includes('15:') ? '15:00' :
                               timeWindow.includes('20:') ? '20:00' :
                               timeWindow.includes('21:') ? '21:00' : '10:00'

  // Check existing - use limit(1) instead of maybeSingle() to avoid multi-row errors
  const { data: existingList } = await client
    .from('daily_copy_trade_requests')
    .select('id, status')
    .eq('user_id', userId)
    .eq('request_date', today)
    .eq('time_window', normalizedTimeWindow)
    .limit(1)

  const existing = existingList?.[0]

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

  const { data: userData } = await client
    .from('users')
    .select('balance')
    .eq('id', userId)
    .single()

  const previewAmount = Number(((userData?.balance || 0) * 0.01).toFixed(2))

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
    // Handle duplicate insert (race condition)
    if (error.code === '23505') {
      return {
        success: false,
        alreadySubmitted: true,
        status: 'pending',
        message: `Bạn đã gửi yêu cầu cho khung giờ ${normalizedTimeWindow}, đang chờ Admin duyệt`
      }
    }
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
