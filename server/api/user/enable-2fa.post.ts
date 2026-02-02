import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = getSupabaseAdmin()

  if (!user.email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required to enable 2FA'
    })
  }

  if (user.is_2fa_enabled) {
    throw createError({
      statusCode: 400,
      message: '2FA is already enabled'
    })
  }

  const { error } = await supabase
    .from('users')
    .update({ is_2fa_enabled: true })
    .eq('id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to enable 2FA'
    })
  }

  return {
    message: '2FA enabled successfully'
  }
})
