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
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  
  // Normalize time window to base format
  let normalizedWindow = timeWindow
  if (!normalizedWindow) {
    // Auto-detect based on current hour
    const now = new Date()
    const hours = now.getHours()
    if (hours >= 10 && hours < 15) {
      normalizedWindow = '10:00'
    } else if (hours >= 15 && hours < 20) {
      normalizedWindow = '15:00'
    } else if (hours === 20) {
      normalizedWindow = '20:00' // Test window
    } else {
      normalizedWindow = '21:00' // Test window
    }
  } else {
    // Normalize input
    normalizedWindow = timeWindow.includes('10:') && !timeWindow.includes('20:') ? '10:00' : 
                       timeWindow.includes('15:') ? '15:00' : 
                       timeWindow.includes('20:') ? '20:00' :
                       timeWindow.includes('21:') ? '21:00' : timeWindow
  }
  
  // Check if user has submitted today for this specific time window
  const { data, error } = await client
    .from('daily_copy_trade_requests')
    .select('id, status, time_window, created_at')
    .eq('user_id', userId)
    .eq('request_date', today)
    .eq('time_window', normalizedWindow)
    .maybeSingle()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking daily copy trade status:', error)
  }
  
  return {
    hasSubmittedToday: !!data,
    status: data?.status || null,
    timeWindow: data?.time_window || null,
    submittedAt: data?.created_at || null
  }
})
