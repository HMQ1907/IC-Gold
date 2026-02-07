import { requireAuth, getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const { notificationId, markAll } = body

  const supabase = getSupabaseAdmin()

  if (markAll) {
    // Mark all as read
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to mark notifications as read'
      })
    }

    return { message: 'All notifications marked as read' }
  }

  if (notificationId) {
    // Mark single notification as read
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Failed to mark notification as read'
      })
    }

    return { message: 'Notification marked as read' }
  }

  throw createError({
    statusCode: 400,
    message: 'notificationId or markAll is required'
  })
})
