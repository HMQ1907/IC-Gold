import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = getSupabaseAdmin()

  if (!user.email) {
    throw createError({
      statusCode: 400,
      message: 'Cần có email để bật 2FA'
    })
  }

  if (user.is_2fa_enabled) {
    throw createError({
      statusCode: 400,
      message: '2FA đã được bật'
    })
  }

  const { error } = await supabase
    .from('users')
    .update({ is_2fa_enabled: true })
    .eq('id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Không thể bật 2FA'
    })
  }

  return {
    message: '2FA đã được bật thành công'
  }
})
