import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = getSupabaseAdmin()

  // Get max_referral_uses from site_settings
  const { data: maxRefSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'max_referral_uses')
    .single()
  
  const maxReferralUses = maxRefSetting?.value ? parseInt(maxRefSetting.value) : 10

  // Get referral stats
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select(`
      id,
      bonus_amount,
      bonus_paid,
      created_at,
      referred:referred_id (
        id,
        email,
        full_name,
        created_at
      )
    `)
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to load referral information'
    })
  }

  // Calculate stats
  const totalReferrals = referrals?.length || 0
  const paidReferrals = referrals?.filter(r => r.bonus_paid).length || 0
  const totalBonus = referrals?.reduce((sum, r) => sum + (r.bonus_paid ? r.bonus_amount : 0), 0) || 0
  const pendingBonus = referrals?.reduce((sum, r) => sum + (!r.bonus_paid ? r.bonus_amount : 0), 0) || 0

  return {
    referralCode: user.referral_code,
    usesRemaining: maxReferralUses - user.referral_uses,
    maxUses: maxReferralUses,
    currentUses: user.referral_uses,
    totalReferrals,
    paidReferrals,
    totalBonus,
    pendingBonus,
    referrals: referrals?.map(r => ({
      id: r.id,
      bonusAmount: r.bonus_amount,
      bonusPaid: r.bonus_paid,
      createdAt: r.created_at,
      referred: r.referred ? {
        email: (r.referred as any).email,
        fullName: (r.referred as any).full_name,
        createdAt: (r.referred as any).created_at
      } : null
    })) || []
  }
})
