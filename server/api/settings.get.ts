import { getSiteSettings } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const settings = await getSiteSettings([
    'copy_trade_min_balance',
    'copy_trade_percentage'
  ])

  return { settings }
})
