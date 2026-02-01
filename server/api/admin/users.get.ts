import { requireAdmin, getSupabaseAdmin } from '~~/server/utils/supabase'
import { getPaginationParams, createPaginatedResult } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)
  const { page, limit } = getPaginationParams(query as Record<string, any>)
  const { search } = query

  const supabase = getSupabaseAdmin()

  let dbQuery = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  if (search) {
    dbQuery = dbQuery.or(`email.ilike.%${search}%,phone.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Không thể tải danh sách users'
    })
  }

  // Remove password hash
  const users = data?.map(({ password_hash, ...user }) => user) || []

  return createPaginatedResult(users, count || 0, { page, limit })
})
