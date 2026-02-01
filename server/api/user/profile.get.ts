import { getUserFromSession } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Remove sensitive data
  const { password_hash, ...safeUser } = user

  return {
    user: safeUser
  }
})
