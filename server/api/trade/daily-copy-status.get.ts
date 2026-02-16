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
  
  // Determine which time window to check
  // If no timeWindow provided, check current time
  let windowToCheck = timeWindow
  if (!windowToCheck) {
    const now = new Date()
    const hours = now.getHours()
    if (hours >= 10 && hours < 15) {
      windowToCheck = '10:00'
    } else if (hours >= 15 && hours < 21) {
      windowToCheck = '15:00'
    } else {
      // For test window or outside hours, check any match
      windowToCheck = ''
    }
  }
  
  // Check if user has submitted today for this specific time window
  let queryBuilder = client
    .from('daily_copy_trade_requests')
    .select('id, status, time_window, created_at')
    .eq('user_id', userId)
    .eq('request_date', today)
  
  // If we have a specific window, filter by it
  if (windowToCheck) {
    queryBuilder = queryBuilder.ilike('time_window', `${windowToCheck}%`)
  }
  
  const { data, error } = await queryBuilder.maybeSingle()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking daily copy trade status:', error)
  }
  
  return {
    hasSubmittedToday: !!data,
    status: data?.status || null,
    timeWindow: data?.time_window || null,
    submittedAt: data?.created_at || null
  }
})
