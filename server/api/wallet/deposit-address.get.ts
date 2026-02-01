import { requireAuth, getSiteSetting } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const address = await getSiteSetting('trc20_wallet_address')

  if (!address) {
    throw createError({
      statusCode: 500,
      message: 'Địa chỉ ví chưa được cấu hình'
    })
  }

  return {
    address,
    network: 'TRC20 (Tron Network)'
  }
})
