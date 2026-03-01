import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const query = getQuery(event)

  const userId = query.userId as string
  const timeWindow = query.timeWindow as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Missing userId'
    })
  }

  // Use Vietnam timezone for date consistency
  const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000)
  const today = vnNow.toISOString().split('T')[0]

  let normalizedWindow = timeWindow
  if (!normalizedWindow) {
    const hours = vnNow.getUTCHours()
    if (hours >= 10 && hours < 15) {
      normalizedWindow = '10:00'
    } else if (hours >= 15 && hours < 20) {
      normalizedWindow = '15:00'
    } else if (hours === 20) {
      normalizedWindow = '20:00'
    } else {
      normalizedWindow = '21:00'
    }
  } else {
    normalizedWindow = timeWindow.includes('10:') && !timeWindow.includes('20:') ? '10:00' :
                       timeWindow.includes('15:') ? '15:00' :
                       timeWindow.includes('20:') ? '20:00' :
                       timeWindow.includes('21:') ? '21:00' : timeWindow
  }

  const { data: rows } = await client
    .from('daily_copy_trade_requests')
    .select('id, status, time_window, created_at')
    .eq('user_id', userId)
    .eq('request_date', today)
    .eq('time_window', normalizedWindow)
    .limit(1)

  const data = rows?.[0] || null

  return {
    hasSubmittedToday: !!data,
    status: data?.status || null,
    timeWindow: data?.time_window || null,
    submittedAt: data?.created_at || null
  }
})
