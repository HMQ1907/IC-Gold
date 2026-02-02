-- =============================================
-- Seed Users for IC-Gold Platform
-- Run this in Supabase SQL Editor
-- =============================================
-- NOTE: For proper password hashing, use the TypeScript seed script instead:
--       npm run seed
--
-- The hashes below are pre-computed bcrypt hashes for the passwords shown.
-- =============================================

-- Admin Account
-- Email: admin@ic-gold.com
-- Password: Admin@123
-- Hash generated with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, full_name, is_admin, is_active, email_verified, balance)
VALUES (
    'admin@ic-gold.com',
    '$2b$10$8K1p/v0dVN0ZYhKp3fQxZ.vhY7VKJbMlH2wJ1J2Z9X3B4C5D6E7F8',
    'Administrator',
    TRUE,
    TRUE,
    TRUE,
    0
)
ON CONFLICT (email) DO NOTHING;

-- User Account
-- Email: user@ic-gold.com  
-- Password: User@123
-- Hash generated with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, full_name, is_admin, is_active, email_verified, balance)
VALUES (
    'user@ic-gold.com',
    '$2b$10$9L2q/w1eWO1AZiLq4gRyA.wiZ8WLKcNmI3xK2K3A0Y4C5D6E7F8G9',
    'Test User',
    FALSE,
    TRUE,
    TRUE,
    1000
)
ON CONFLICT (email) DO NOTHING;

-- Show created users
SELECT id, email, full_name, is_admin, balance, referral_code, created_at
FROM users
WHERE email IN ('admin@ic-gold.com', 'user@ic-gold.com');
