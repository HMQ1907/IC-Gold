import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = getSupabaseAdmin()

  // 25-day lock from FIRST approved deposit (sau khi nạp tiền lần đầu 25 ngày mới được rút)
  const { data: firstDeposit } = await supabase
    .from('transactions')
    .select('created_at, processed_at')
    .eq('user_id', user.id)
    .eq('type', 'deposit')
    .eq('status', 'completed')
    .order('processed_at', { ascending: true })
    .limit(1)
    .single()

  if (!firstDeposit) {
    return {
      locked: true,
      remainingDays: 25,
      copyTradeActive: !!user.copy_trade_active
    }
  }

  const depositDate = new Date(firstDeposit.processed_at || firstDeposit.created_at)
  const now = new Date()
  const daysSinceDeposit = Math.floor((now.getTime() - depositDate.getTime()) / (1000 * 60 * 60 * 24))
  const lockDays = 25

  if (daysSinceDeposit < lockDays) {
    const remainingDays = lockDays - daysSinceDeposit
    return {
      locked: true,
      remainingDays,
      depositDate: depositDate.toISOString(),
      unlockDate: new Date(depositDate.getTime() + lockDays * 24 * 60 * 60 * 1000).toISOString(),
      copyTradeActive: !!user.copy_trade_active
    }
  }

  return {
    locked: false,
    remainingDays: 0,
    copyTradeActive: !!user.copy_trade_active
  }
})
