/**
 * Seed script to create admin and user accounts
 * Run with: npx tsx supabase/seed.ts
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

// Load environment variables
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface UserSeed {
  email: string
  password: string
  full_name: string
  is_admin: boolean
  balance: number
}

const users: UserSeed[] = [
  {
    email: 'admin@ic-gold.com',
    password: 'Admin@123',
    full_name: 'Administrator',
    is_admin: true,
    balance: 0
  },
  {
    email: 'user@ic-gold.com',
    password: 'User@123',
    full_name: 'Test User',
    is_admin: false,
    balance: 1000
  }
]

async function seed() {
  console.log('🌱 Starting seed process...\n')

  for (const user of users) {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', user.email)
      .single()

    if (existingUser) {
      console.log(`⚠️  User ${user.email} already exists (ID: ${existingUser.id}), skipping...`)
      continue
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(user.password, saltRounds)

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: user.email,
        password_hash,
        full_name: user.full_name,
        is_admin: user.is_admin,
        is_active: true,
        email_verified: true,
        balance: user.balance
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error.message)
    } else {
      console.log(`✅ Created ${user.is_admin ? 'ADMIN' : 'USER'}: ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log(`   ID: ${data.id}`)
      console.log(`   Referral Code: ${data.referral_code}`)
      console.log('')
    }
  }

  console.log('\n🎉 Seed process completed!')
  console.log('\n📋 Account Summary:')
  console.log('─'.repeat(50))
  console.log('ADMIN Account:')
  console.log('  Email:    admin@ic-gold.com')
  console.log('  Password: Admin@123')
  console.log('')
  console.log('USER Account:')
  console.log('  Email:    user@ic-gold.com')
  console.log('  Password: User@123')
  console.log('  Balance:  $1,000')
  console.log('─'.repeat(50))
}

seed().catch(console.error)
