import { requireAuth } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  return {
    copyTradeActive: !!user.copy_trade_active
  }
})
