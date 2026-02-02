import { requireAdmin, getSupabaseAdmin, logAdminAction } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const supabase = getSupabaseAdmin()
  const method = event.method

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value, description')

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to load settings'
      })
    }

    const settings = data?.reduce((acc, item) => {
      acc[item.key] = item.value || ''
      return acc
    }, {} as Record<string, string>)

    return { settings }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      throw createError({
        statusCode: 400,
        message: 'Settings is required'
      })
    }

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: value as string,
          updated_at: new Date().toISOString(),
          updated_by: admin.id
        })
        .eq('key', key)

      if (error) {
        console.error(`Error updating setting ${key}:`, error)
      }
    }

    // Log admin action
    await logAdminAction(admin.id, 'update_settings', {
      newValue: JSON.stringify(settings),
      ipAddress: getHeader(event, 'x-forwarded-for') || undefined,
      userAgent: getHeader(event, 'user-agent') || undefined
    })

    return { message: 'Settings updated successfully' }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
