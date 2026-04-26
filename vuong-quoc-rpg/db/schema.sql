-- ══════════════════════════════════════════════
-- SCHEMA.SQL — Tạo database & bảng
-- Chạy: mysql -u root -p < db/schema.sql
-- ══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS vuong_quoc_rpg
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vuong_quoc_rpg;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu game (1 slot/user — ON DUPLICATE KEY UPDATE)
CREATE TABLE IF NOT EXISTS game_saves (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  gold       INT     DEFAULT 0,
  exp        INT     DEFAULT 0,
  level      INT     DEFAULT 1,
  hp         INT     DEFAULT 100,
  pos_x      FLOAT   DEFAULT 0,
  pos_y      FLOAT   DEFAULT 0,
  inventory  JSON,     -- { items: [...], equipped: {...} }
  flags      JSON,     -- { hacLongUnlocked: false, thuLongUnlocked: false, ... }
  stats      JSON,     -- { correct: 0, wrong: 0, battles: 0, ... }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT 'Database và bảng đã được tạo thành công! ✅' AS result;
