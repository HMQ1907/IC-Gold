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
      message: 'Failed to load users'
    })
  }

  // Remove password hash and add referral hierarchy
  const users = []
  for (const { password_hash, ...user } of data || []) {
    const hierarchy: { parent?: string; grandparent?: string } = {}
    
    // Get parent (người giới thiệu trực tiếp)
    if (user.referred_by) {
      const { data: parent } = await supabase
        .from('users')
        .select('id, email, phone, referred_by')
        .eq('referral_code', user.referred_by)
        .single()
      
      if (parent) {
        hierarchy.parent = parent.email || parent.phone || `User #${parent.id}`
        
        // Get grandparent (ông nội)
        if (parent.referred_by) {
          const { data: grandparent } = await supabase
            .from('users')
            .select('id, email, phone')
            .eq('referral_code', parent.referred_by)
            .single()
          
          if (grandparent) {
            hierarchy.grandparent = grandparent.email || grandparent.phone || `User #${grandparent.id}`
          }
        }
      }
    }
    
    users.push({ ...user, referral_hierarchy: hierarchy })
  }

  return createPaginatedResult(users, count || 0, { page, limit })
})
