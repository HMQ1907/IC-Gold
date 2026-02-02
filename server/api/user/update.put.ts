import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { fullName, phone } = body

  const supabase = getSupabaseAdmin()
  const updateData: Record<string, any> = {}

  if (fullName !== undefined) {
    updateData.full_name = fullName
  }

  if (phone !== undefined) {
    // Check if phone already exists
    if (phone) {
      const { data: existingPhone } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)
        .neq('id', user.id)
        .single()

      if (existingPhone) {
        throw createError({
          statusCode: 400,
          message: 'Phone number is already in use'
        })
      }
    }
    updateData.phone = phone || null
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No data to update'
    })
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update profile'
    })
  }

  return {
    message: 'Profile updated successfully'
  }
})
