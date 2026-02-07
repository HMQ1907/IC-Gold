import { requireAdmin, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = getSupabaseAdmin()

  // Get pending deposits with user info and referral hierarchy
  const { data: deposits, error: depositsError } = await supabase
    .from('transactions')
    .select(`
      *,
      user:users!transactions_user_id_fkey (
        id, email, phone, full_name, balance, referral_code, referred_by
      )
    `)
    .eq('type', 'deposit')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (depositsError) {
    console.error('Deposits error:', depositsError)
  }

  // Get pending withdrawals with user info
  const { data: withdrawals, error: withdrawalsError } = await supabase
    .from('transactions')
    .select(`
      *,
      user:users!transactions_user_id_fkey (
        id, email, phone, full_name, balance, referral_code, referred_by
      )
    `)
    .eq('type', 'withdraw')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (withdrawalsError) {
    console.error('Withdrawals error:', withdrawalsError)
  }

  // Build referral hierarchy for each user (3 levels: grandparent -> parent -> child)
  const enrichWithHierarchy = async (transactions: any[]) => {
    if (!transactions) return []
    
    for (const tx of transactions) {
      if (tx.user) {
        const hierarchy: { parent?: string; grandparent?: string } = {}
        
        // Get parent (người giới thiệu trực tiếp)
        if (tx.user.referred_by) {
          const { data: parent } = await supabase
            .from('users')
            .select('id, email, phone, referred_by')
            .eq('referral_code', tx.user.referred_by)
            .single()
          
          if (parent) {
            hierarchy.parent = parent.email || parent.phone || `User #${parent.id}`
            
            // Get grandparent (ông nội - người giới thiệu của parent)
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
        
        tx.user.referral_hierarchy = hierarchy
      }
    }
    
    return transactions
  }

  const enrichedDeposits = await enrichWithHierarchy(deposits || [])
  const enrichedWithdrawals = await enrichWithHierarchy(withdrawals || [])

  return {
    deposits: enrichedDeposits,
    withdrawals: enrichedWithdrawals
  }
})
