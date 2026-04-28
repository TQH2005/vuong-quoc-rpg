-- ══════════════════════════════════════════════════
-- MIGRATE.SQL — Thêm cột role, class_id, born, phone
-- Chạy 1 lần trên database vuong_quoc_rpg
-- ══════════════════════════════════════════════════

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role      ENUM('student','teacher') NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS class_id  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS born      YEAR         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS phone     VARCHAR(20)  DEFAULT NULL;

-- Index để query nhanh theo lớp
CREATE INDEX IF NOT EXISTS idx_users_class ON users (class_id, role);
