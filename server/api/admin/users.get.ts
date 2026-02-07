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

  // Remove password hash and add referral children (con và cháu)
  const users = []
  for (const { password_hash, ...user } of data || []) {
    // Get children (những người được user này giới thiệu)
    const { data: children } = await supabase
      .from('users')
      .select('id, email, phone, full_name')
      .eq('referred_by', user.id)
    
    const referralChildren: Array<{
      name: string
      email: string
      grandchildren?: Array<{ name: string; email: string }>
    }> = []
    
    if (children && children.length > 0) {
      for (const child of children) {
        const childName = child.full_name || 'N/A'
        const childEmail = child.email || child.phone || `User #${child.id}`
        
        // Get grandchildren (những người được user con giới thiệu)
        const { data: grandchildren } = await supabase
          .from('users')
          .select('id, email, phone, full_name')
          .eq('referred_by', child.id)
        
        const grandchildrenData = grandchildren?.map(gc => ({
          name: gc.full_name || 'N/A',
          email: gc.email || gc.phone || `User #${gc.id}`
        })) || []
        
        referralChildren.push({
          name: childName,
          email: childEmail,
          grandchildren: grandchildrenData.length > 0 ? grandchildrenData : undefined
        })
      }
    }
    
    users.push({ ...user, referral_children: referralChildren })
  }

  return createPaginatedResult(users, count || 0, { page, limit })
})
