import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const query = getQuery(event)
  
  const userId = query.userId as string
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Missing userId'
    })
  }
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  
  // Check if user has submitted today
  const { data, error } = await client
    .from('daily_copy_trade_requests')
    .select('id, status, time_window, created_at')
    .eq('user_id', userId)
    .eq('request_date', today)
    .single()
  
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
