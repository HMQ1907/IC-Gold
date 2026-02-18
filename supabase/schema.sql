-- =============================================
-- IC-Gold Investment Platform
-- Database Schema for Supabase
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ENUM Types
-- =============================================

CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw', 'referral_bonus', 'admin_adjust', 'copy_trade');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'rejected', 'cancelled');
CREATE TYPE otp_type AS ENUM ('login', 'register', 'withdraw', '2fa', 'reset_password');

-- =============================================
-- Users Table
-- =============================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    
    -- Balance
    balance DECIMAL(18, 2) DEFAULT 0.00,
    
    -- Referral system
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    referral_uses INT DEFAULT 0,
    max_referral_uses INT DEFAULT 10,
    referred_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- Account status
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Copy trade
    copy_trade_active BOOLEAN DEFAULT FALSE,
    copy_trade_percentage DECIMAL(5, 2) DEFAULT 5.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT check_balance_positive CHECK (balance >= 0),
    CONSTRAINT check_referral_uses CHECK (referral_uses >= 0 AND referral_uses <= max_referral_uses)
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- =============================================
-- Transactions Table
-- =============================================

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type transaction_type NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    
    -- For deposits
    tx_hash VARCHAR(100),
    wallet_address VARCHAR(100),
    network VARCHAR(20) DEFAULT 'TRC20',
    
    -- For withdrawals
    withdraw_address VARCHAR(100),
    
    -- Admin handling
    processed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    admin_note TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT check_amount_positive CHECK (amount > 0)
);

-- Indexes for transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);

-- =============================================
-- Referrals Table
-- =============================================

CREATE TABLE referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bonus_amount DECIMAL(18, 2) DEFAULT 10.00,
    bonus_paid BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id),
    CONSTRAINT no_self_referral CHECK (referrer_id != referred_id)
);

-- Indexes for referrals
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);

-- =============================================
-- OTP Codes Table
-- =============================================

CREATE TABLE otp_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    code VARCHAR(6) NOT NULL,
    type otp_type NOT NULL,
    
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- At least one identifier required
    CONSTRAINT check_identifier CHECK (user_id IS NOT NULL OR email IS NOT NULL OR phone IS NOT NULL)
);

-- Indexes for otp_codes
CREATE INDEX idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX idx_otp_codes_email ON otp_codes(email);
CREATE INDEX idx_otp_codes_code ON otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);

-- =============================================
-- Copy Trade Logs Table
-- =============================================

CREATE TABLE copy_trade_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    percentage DECIMAL(5, 2) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    balance_before DECIMAL(18, 2) NOT NULL,
    balance_after DECIMAL(18, 2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'active',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for copy_trade_logs
CREATE INDEX idx_copy_trade_logs_user_id ON copy_trade_logs(user_id);
CREATE INDEX idx_copy_trade_logs_created_at ON copy_trade_logs(created_at DESC);

-- =============================================
-- Daily Copy Trade Requests Table
-- Cho phép mỗi user gửi 2 request/ngày (1 sáng + 1 chiều)
-- =============================================

CREATE TABLE daily_copy_trade_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_window VARCHAR(10) NOT NULL, -- '10:00' or '15:00'
    amount DECIMAL(18, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    processed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique per user, date AND time_window (allows 2 per day)
    CONSTRAINT daily_copy_trade_requests_user_date_window_key UNIQUE (user_id, request_date, time_window)
);

-- Indexes for daily_copy_trade_requests
CREATE INDEX idx_daily_copy_trade_requests_user_id ON daily_copy_trade_requests(user_id);
CREATE INDEX idx_daily_copy_trade_requests_date ON daily_copy_trade_requests(request_date);
CREATE INDEX idx_daily_copy_trade_requests_status ON daily_copy_trade_requests(status);

-- =============================================
-- Admin Logs Table
-- =============================================

CREATE TABLE admin_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL,
    target_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    target_transaction_id BIGINT REFERENCES transactions(id) ON DELETE SET NULL,
    
    old_value TEXT,
    new_value TEXT,
    amount_change DECIMAL(18, 2),
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for admin_logs
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_target_user_id ON admin_logs(target_user_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- =============================================
-- Site Settings Table
-- =============================================

CREATE TABLE site_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
    ('trc20_wallet_address', '', 'Địa chỉ ví TRC20 nhận tiền nạp'),
    ('min_deposit', '10', 'Số tiền nạp tối thiểu (USD)'),
    ('min_withdraw', '50', 'Số tiền rút tối thiểu (USD)'),
    ('referral_bonus', '10', 'Tiền thưởng giới thiệu (USD)'),
    ('max_referral_uses', '10', 'Số lần sử dụng tối đa cho mã giới thiệu'),
    ('copy_trade_min_balance', '500', 'Số dư tối thiểu để sử dụng Copy Trade (USD)'),
    ('copy_trade_percentage', '5', 'Phần trăm Copy Trade mặc định'),
    ('site_name', 'IC-Gold', 'Tên website'),
    ('site_description', 'Nền tảng đầu tư Gold hàng đầu', 'Mô tả website'),
    ('support_email', 'support@ic-gold.com', 'Email hỗ trợ'),
    ('telegram_link', '', 'Link Telegram hỗ trợ');

-- =============================================
-- Sessions Table (for custom auth)
-- =============================================

CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- =============================================
-- Notifications Table
-- =============================================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================
-- Functions and Triggers
-- =============================================

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(10) := '';
    i INT;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * 36 + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to set referral code before insert
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(10);
    code_exists BOOLEAN;
BEGIN
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        LOOP
            new_code := generate_referral_code();
            SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = new_code) INTO code_exists;
            EXIT WHEN NOT code_exists;
        END LOOP;
        NEW.referral_code := new_code;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code
CREATE TRIGGER trigger_set_referral_code
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_referral_code();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus()
RETURNS TRIGGER AS $$
DECLARE
    v_referrer_id BIGINT;
    bonus DECIMAL(18, 2);
    current_uses INT;
    max_uses INT;
BEGIN
    -- Only process for completed deposits (user's first successful transaction)
    IF NEW.type = 'deposit' AND NEW.status = 'completed' AND OLD.status = 'pending' THEN
        -- Get referrer info
        SELECT u.referred_by INTO v_referrer_id
        FROM users u
        WHERE u.id = NEW.user_id;
        
        IF v_referrer_id IS NOT NULL THEN
            -- Check if bonus already paid for this referral
            IF NOT EXISTS (SELECT 1 FROM referrals WHERE referrals.referrer_id = v_referrer_id AND referrals.referred_id = NEW.user_id AND bonus_paid = TRUE) THEN
                -- Get referrer's current referral uses
                SELECT referral_uses, max_referral_uses INTO current_uses, max_uses
                FROM users WHERE id = v_referrer_id;
                
                -- Check if referrer can still receive bonuses
                IF current_uses < max_uses THEN
                    -- Get bonus amount from settings
                    SELECT COALESCE(value::DECIMAL, 10.00) INTO bonus
                    FROM site_settings WHERE key = 'referral_bonus';
                    
                    -- Update referrer's balance and referral_uses
                    UPDATE users
                    SET balance = balance + bonus,
                        referral_uses = referral_uses + 1
                    WHERE id = v_referrer_id;
                    
                    -- Mark referral as paid
                    UPDATE referrals
                    SET bonus_paid = TRUE
                    WHERE referrals.referrer_id = v_referrer_id AND referrals.referred_id = NEW.user_id;
                    
                    -- Create bonus transaction record
                    INSERT INTO transactions (user_id, type, amount, status)
                    VALUES (v_referrer_id, 'referral_bonus', bonus, 'completed');
                END IF;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for referral bonus
CREATE TRIGGER trigger_process_referral_bonus
    AFTER UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION process_referral_bonus();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_trade_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_copy_trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies should be configured based on your authentication setup
-- Below are example policies that can be adjusted

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (true);

-- Users can create their own transactions
CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals" ON referrals
    FOR SELECT USING (true);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (true);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (true);

-- =============================================
-- Insert first admin user (change password after first login!)
-- Password: admin123 (hashed with bcrypt)
-- =============================================

-- Note: Run this manually and change the password immediately
-- INSERT INTO users (email, password_hash, full_name, is_admin, email_verified, referral_code)
-- VALUES ('admin@ic-gold.com', '$2b$10$example_hash_here', 'Administrator', TRUE, TRUE, 'ADMIN001');

-- =============================================
-- Useful Views
-- =============================================

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.phone,
    u.full_name,
    u.balance,
    u.referral_code,
    u.referral_uses,
    u.created_at,
    COUNT(DISTINCT r.id) as total_referrals,
    COALESCE(SUM(CASE WHEN t.type = 'deposit' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) as total_deposits,
    COALESCE(SUM(CASE WHEN t.type = 'withdraw' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) as total_withdrawals,
    COALESCE(SUM(CASE WHEN t.type = 'referral_bonus' THEN t.amount ELSE 0 END), 0) as total_referral_bonus
FROM users u
LEFT JOIN referrals r ON r.referrer_id = u.id
LEFT JOIN transactions t ON t.user_id = u.id
GROUP BY u.id;

-- View for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE is_admin = FALSE) as total_users,
    (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '24 hours') as new_users_24h,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'deposit' AND status = 'completed') as total_deposits,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'withdraw' AND status = 'completed') as total_withdrawals,
    (SELECT COUNT(*) FROM transactions WHERE status = 'pending') as pending_transactions,
    (SELECT COALESCE(SUM(balance), 0) FROM users WHERE is_admin = FALSE) as total_user_balance;
