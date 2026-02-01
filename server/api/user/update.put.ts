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
          message: 'Số điện thoại đã được sử dụng'
        })
      }
    }
    updateData.phone = phone || null
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Không có dữ liệu để cập nhật'
    })
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Không thể cập nhật thông tin'
    })
  }

  return {
    message: 'Cập nhật thành công'
  }
})
