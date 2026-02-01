import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (token) {
    const supabase = getSupabaseAdmin()
    
    // Delete session
    await supabase.from('sessions').delete().eq('token', token)
  }

  // Clear cookie
  deleteCookie(event, 'auth_token', {
    path: '/'
  })

  return {
    message: 'Đăng xuất thành công'
  }
})
