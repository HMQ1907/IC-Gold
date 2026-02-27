import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event)

  const { adminId, date } = body

  if (!adminId) {
    throw createError({
      statusCode: 400,
      message: 'Missing adminId'
    })
  }

  const targetDate = date || new Date().toISOString().split('T')[0]

  const { data: pendingRequests, error: fetchError } = await client
    .from('daily_copy_trade_requests')
    .select('id')
    .eq('status', 'pending')
    .eq('request_date', targetDate)

  if (fetchError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch pending requests'
    })
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return {
      success: true,
      message: 'Không có yêu cầu nào cần từ chối',
      rejectedCount: 0
    }
  }

  const ids = pendingRequests.map(r => r.id)

  const { error: updateError } = await client
    .from('daily_copy_trade_requests')
    .update({
      status: 'rejected',
      processed_by: adminId,
      processed_at: new Date().toISOString(),
      admin_note: 'Bulk rejected'
    })
    .in('id', ids)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to reject requests'
    })
  }

  return {
    success: true,
    message: `Đã từ chối ${pendingRequests.length} yêu cầu`,
    rejectedCount: pendingRequests.length
  }
})
