-- =============================================
-- Fix daily_copy_trade_requests constraint
-- Cho phép 2 request mỗi ngày (1 sáng 10:00, 1 chiều 15:00)
-- =============================================

-- Xóa constraint cũ (chỉ cho phép 1 request/ngày)
ALTER TABLE daily_copy_trade_requests 
DROP CONSTRAINT IF EXISTS daily_copy_trade_requests_user_id_request_date_key;

-- Thêm constraint mới (cho phép 2 request/ngày với time_window khác nhau)
ALTER TABLE daily_copy_trade_requests 
ADD CONSTRAINT daily_copy_trade_requests_user_date_window_key 
UNIQUE (user_id, request_date, time_window);

-- Nếu bảng chưa tồn tại, tạo mới với cấu trúc đúng
-- CREATE TABLE IF NOT EXISTS daily_copy_trade_requests (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     request_date DATE NOT NULL DEFAULT CURRENT_DATE,
--     time_window VARCHAR(50) NOT NULL,
--     amount DECIMAL(18, 2) DEFAULT 0,
--     status VARCHAR(20) DEFAULT 'pending',
--     processed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
--     processed_at TIMESTAMP WITH TIME ZONE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     -- Cho phép 2 request mỗi ngày (sáng + chiều)
--     CONSTRAINT daily_copy_trade_requests_user_date_window_key UNIQUE (user_id, request_date, time_window)
-- );
