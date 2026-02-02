import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'
import { getPaginationParams, createPaginatedResult } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const { page, limit } = getPaginationParams(query as Record<string, any>)
  const { type, status } = query

  const supabase = getSupabaseAdmin()

  // Build query
  let dbQuery = supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (type) {
    dbQuery = dbQuery.eq('type', type)
  }

  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to load transactions'
    })
  }

  return createPaginatedResult(data || [], count || 0, { page, limit })
})
