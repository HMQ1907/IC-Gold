import { requireAdmin, getSupabaseAdmin } from '~~/server/utils/supabase'
import { getPaginationParams, createPaginatedResult } from '~~/server/utils/helpers'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)
  const { page, limit } = getPaginationParams(query as Record<string, any>)
  const { search } = query

  const supabase = getSupabaseAdmin()

  if (search) {
    // When searching: find matched users + their parents + their children
    const { data: matchedUsers } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', false)
      .or(`email.ilike.%${search}%,phone.ilike.%${search}%,full_name.ilike.%${search}%`)

    if (!matchedUsers || matchedUsers.length === 0) {
      return createPaginatedResult([], 0, { page, limit })
    }

    const matchedIds = matchedUsers.map(u => u.id)
    const parentIds = matchedUsers
      .map(u => u.referred_by)
      .filter((id): id is number => id !== null && !matchedIds.includes(id))

    // Fetch parent users (người đã giới thiệu)
    let parentUsers: any[] = []
    if (parentIds.length > 0) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .in('id', parentIds)
      parentUsers = data || []
    }

    // Fetch children users (người được giới thiệu bởi matched users)
    const { data: childUsers } = await supabase
      .from('users')
      .select('*')
      .in('referred_by', matchedIds)
      .not('id', 'in', `(${matchedIds.join(',')})`)

    // Combine all unique users
    const allUsersMap = new Map<number, any>()
    const matchedSet = new Set(matchedIds)
    const parentSet = new Set(parentIds)

    for (const u of parentUsers) {
      allUsersMap.set(u.id, { ...u, _relation: 'parent' })
    }
    for (const u of matchedUsers) {
      allUsersMap.set(u.id, { ...u, _relation: 'matched' })
    }
    for (const u of (childUsers || [])) {
      if (!allUsersMap.has(u.id)) {
        allUsersMap.set(u.id, { ...u, _relation: 'child' })
      }
    }

    // Sort: parents first, then matched, then children
    const relationOrder: Record<string, number> = { parent: 0, matched: 1, child: 2 }
    const sortedUsers = Array.from(allUsersMap.values()).sort((a, b) => {
      return (relationOrder[a._relation] || 1) - (relationOrder[b._relation] || 1)
    })

    // Build final results with referral tree + relation tag
    const users = []
    for (const { password_hash, _relation, ...user } of sortedUsers) {
      const referralChildren = await getReferralChildren(supabase, user.id)
      users.push({ ...user, referral_children: referralChildren, _relation })
    }

    return {
      ...createPaginatedResult(users, users.length, { page: 1, limit: users.length || 1 }),
      searchMode: true
    }
  }

  // Normal listing (no search)
  let dbQuery = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

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

  const users = []
  for (const { password_hash, ...user } of data || []) {
    const referralChildren = await getReferralChildren(supabase, user.id)
    users.push({ ...user, referral_children: referralChildren })
  }

  return createPaginatedResult(users, count || 0, { page, limit })
})

async function getReferralChildren(supabase: any, userId: number) {
  const { data: children } = await supabase
    .from('users')
    .select('id, email, phone, full_name')
    .eq('referred_by', userId)

  const referralChildren: Array<{
    name: string
    email: string
    grandchildren?: Array<{ name: string; email: string }>
  }> = []

  if (children && children.length > 0) {
    for (const child of children) {
      const { data: grandchildren } = await supabase
        .from('users')
        .select('id, email, phone, full_name')
        .eq('referred_by', child.id)

      const grandchildrenData = grandchildren?.map((gc: any) => ({
        name: gc.full_name || 'N/A',
        email: gc.email || gc.phone || `User #${gc.id}`
      })) || []

      referralChildren.push({
        name: child.full_name || 'N/A',
        email: child.email || child.phone || `User #${child.id}`,
        grandchildren: grandchildrenData.length > 0 ? grandchildrenData : undefined
      })
    }
  }

  return referralChildren
}
