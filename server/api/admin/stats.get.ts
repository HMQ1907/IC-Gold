import { requireAdmin, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = getSupabaseAdmin()

  // Get stats from view
  const { data: stats, error } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single()

  if (error) {
    // Fallback to manual queries
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { count: newUsers24h } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())

    const { data: deposits } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'deposit')
      .eq('status', 'completed')

    const { data: withdrawals } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'withdraw')
      .eq('status', 'completed')

    const { count: pendingTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { data: balances } = await supabase
      .from('users')
      .select('balance')
      .eq('is_admin', false)

    return {
      totalUsers: totalUsers || 0,
      newUsers24h: newUsers24h || 0,
      totalDeposits: deposits?.reduce((sum, d) => sum + d.amount, 0) || 0,
      totalWithdrawals: withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0,
      pendingTransactions: pendingTransactions || 0,
      totalUserBalance: balances?.reduce((sum, u) => sum + u.balance, 0) || 0
    }
  }

  return stats
})
