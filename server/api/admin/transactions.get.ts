import { requireAdmin, getSupabaseAdmin } from '~~/server/utils/supabase'
import { getPaginationParams, createPaginatedResult } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)
  const { page, limit } = getPaginationParams(query as Record<string, any>)
  const { userId, type, status } = query

  const supabase = getSupabaseAdmin()

  let dbQuery = supabase
    .from('transactions')
    .select(`
      *,
      user:user_id (
        id,
        email,
        phone,
        full_name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (userId) {
    dbQuery = dbQuery.eq('user_id', userId)
  }

  if (type) {
    dbQuery = dbQuery.eq('type', type)
  }

  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Không thể tải giao dịch'
    })
  }

  return createPaginatedResult(data || [], count || 0, { page, limit })
})
