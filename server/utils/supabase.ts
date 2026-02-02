import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

// Types for database tables
export interface User {
  id: number
  email: string | null
  phone: string | null
  password_hash: string
  full_name: string | null
  avatar_url: string | null
  balance: number
  referral_code: string
  referral_uses: number
  max_referral_uses: number
  referred_by: number | null
  is_admin: boolean
  is_active: boolean
  is_2fa_enabled: boolean
  email_verified: boolean
  phone_verified: boolean
  copy_trade_active: boolean
  copy_trade_percentage: number
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export interface Transaction {
  id: number
  user_id: number
  type: 'deposit' | 'withdraw' | 'referral_bonus' | 'admin_adjust' | 'copy_trade'
  amount: number
  status: 'pending' | 'completed' | 'rejected' | 'cancelled'
  tx_hash: string | null
  wallet_address: string | null
  network: string
  withdraw_address: string | null
  processed_by: number | null
  processed_at: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
}

export interface Referral {
  id: number
  referrer_id: number
  referred_id: number
  bonus_amount: number
  bonus_paid: boolean
  created_at: string
}

export interface OtpCode {
  id: number
  user_id: number | null
  email: string | null
  phone: string | null
  code: string
  type: 'login' | 'register' | 'withdraw' | '2fa' | 'reset_password'
  expires_at: string
  used: boolean
  used_at: string | null
  created_at: string
}

export interface Session {
  id: number
  user_id: number
  token: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  created_at: string
  last_activity_at: string
}

export interface SiteSetting {
  id: number
  key: string
  value: string | null
  description: string | null
  updated_at: string
  updated_by: number | null
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface AdminLog {
  id: number
  admin_id: number
  action: string
  target_user_id: number | null
  target_transaction_id: number | null
  old_value: string | null
  new_value: string | null
  amount_change: number | null
  ip_address: string | null
  user_agent: string | null
  note: string | null
  created_at: string
}

export interface CopyTradeLog {
  id: number
  user_id: number
  percentage: number
  amount: number
  balance_before: number
  balance_after: number
  status: string
  created_at: string
  ended_at: string | null
}

// Create Supabase client for server-side
let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const config = useRuntimeConfig()
    supabaseAdmin = createClient(
      config.public.supabaseUrl,
      process.env.SUPABASE_SERVICE_KEY || config.public.supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdmin
}

// Get user from session token
export async function getUserFromSession(event: H3Event): Promise<User | null> {
  const token = getCookie(event, 'auth_token') || getHeader(event, 'Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }

  const supabase = getSupabaseAdmin()
  
  // Find valid session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    return null
  }

  // Update last activity
  await supabase
    .from('sessions')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', session.id)

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user_id)
    .eq('is_active', true)
    .single()

  if (userError || !user) {
    return null
  }

  return user as User
}

// Require authenticated user
export async function requireAuth(event: H3Event): Promise<User> {
  const user = await getUserFromSession(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Please login to continue'
    })
  }

  return user
}

// Require admin user
export async function requireAdmin(event: H3Event): Promise<User> {
  const user = await requireAuth(event)
  
  if (!user.is_admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have access permission'
    })
  }

  return user
}

// Get site setting
export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    return null
  }

  return data.value
}

// Get multiple site settings
export async function getSiteSettings(keys: string[]): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', keys)

  if (error || !data) {
    return {}
  }

  return data.reduce((acc, item) => {
    acc[item.key] = item.value || ''
    return acc
  }, {} as Record<string, string>)
}

// Log admin action
export async function logAdminAction(
  adminId: number,
  action: string,
  options: {
    targetUserId?: number
    targetTransactionId?: number
    oldValue?: string
    newValue?: string
    amountChange?: number
    note?: string
    ipAddress?: string
    userAgent?: string
  } = {}
): Promise<void> {
  const supabase = getSupabaseAdmin()
  
  await supabase.from('admin_logs').insert({
    admin_id: adminId,
    action,
    target_user_id: options.targetUserId,
    target_transaction_id: options.targetTransactionId,
    old_value: options.oldValue,
    new_value: options.newValue,
    amount_change: options.amountChange,
    note: options.note,
    ip_address: options.ipAddress,
    user_agent: options.userAgent
  })
}

// Create notification
export async function createNotification(
  userId: number,
  title: string,
  message: string,
  type: string = 'info'
): Promise<void> {
  const supabase = getSupabaseAdmin()
  
  await supabase.from('notifications').insert({
    user_id: userId,
    title,
    message,
    type
  })
}
