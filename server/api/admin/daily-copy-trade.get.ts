import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const query = getQuery(event)
  
  const status = query.status as string || 'all'
  const date = query.date as string || new Date().toISOString().split('T')[0]
  
  // Build query
  let dbQuery = client
    .from('daily_copy_trade_requests')
    .select(`
      id,
      user_id,
      request_date,
      time_window,
      status,
      amount,
      processed_by,
      processed_at,
      admin_note,
      created_at,
      users!daily_copy_trade_requests_user_id_fkey (
        id,
        full_name,
        email,
        balance
      )
    `)
    .order('created_at', { ascending: false })
  
  // Filter by status
  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }
  
  // Filter by date
  if (date) {
    dbQuery = dbQuery.eq('request_date', date)
  }
  
  const { data, error } = await dbQuery
  
  if (error) {
    console.error('Error fetching daily copy trade requests:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch requests'
    })
  }
  
  // Get stats
  const { data: statsData } = await client
    .from('daily_copy_trade_requests')
    .select('status')
    .eq('request_date', date)
  
  const stats = {
    total: statsData?.length || 0,
    pending: statsData?.filter(r => r.status === 'pending').length || 0,
    approved: statsData?.filter(r => r.status === 'approved').length || 0,
    rejected: statsData?.filter(r => r.status === 'rejected').length || 0
  }
  
  return {
    requests: data || [],
    stats
  }
})
