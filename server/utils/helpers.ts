import { createHash, randomBytes } from 'crypto'
import { customAlphabet } from 'nanoid'
import bcrypt from 'bcrypt'

// Generate OTP code (6 digits)
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

// Generate referral code (8 characters, uppercase + numbers)
const nanoidReferral = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)
export function generateReferralCode(): string {
  return nanoidReferral()
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password using bcrypt
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(password, storedHash)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone format (Vietnam)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number' }
  }
  return { valid: true, message: '' }
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date, locale: string = 'vi-VN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Calculate OTP expiry (10 minutes from now)
export function getOtpExpiry(): Date {
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 10)
  return expiry
}

// Calculate session expiry (7 days from now)
export function getSessionExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  return expiry
}

// Mask email for display
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  return `${local[0]}${local[1]}***@${domain}`
}

// Mask phone for display
export function maskPhone(phone: string): string {
  if (phone.length <= 4) {
    return '***' + phone.slice(-2)
  }
  return phone.slice(0, 3) + '****' + phone.slice(-3)
}

// Validate TRC20 address
export function isValidTrc20Address(address: string): boolean {
  // TRC20 addresses start with 'T' and are 34 characters
  return /^T[A-Za-z0-9]{33}$/.test(address)
}

// Sanitize string for SQL
export function sanitizeString(str: string): string {
  return str.replace(/[<>'"]/g, '')
}

// Pagination helper
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export function getPaginationParams(query: Record<string, any>): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
  return { page, limit }
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit)
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
    hasMore: params.page < totalPages
  }
}
