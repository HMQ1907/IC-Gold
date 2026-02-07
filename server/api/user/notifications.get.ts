import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const { unreadOnly, limit = 20 } = query

  const supabase = getSupabaseAdmin()

  let dbQuery = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(Number(limit))

  if (unreadOnly === 'true') {
    dbQuery = dbQuery.eq('is_read', false)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('Notifications error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch notifications'
    })
  }

  // Count unread
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return {
    notifications: data || [],
    unreadCount: count || 0
  }
})
