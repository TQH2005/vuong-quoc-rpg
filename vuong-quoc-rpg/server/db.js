// ══════════════════════════════════════════════
// SERVER/DB.JS — Kết nối MySQL pool
// ══════════════════════════════════════════════
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host    : process.env.DB_HOST     || 'localhost',
  port    : process.env.DB_PORT     || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'vuong_quoc_rpg',
  waitForConnections: true,
  connectionLimit   : 10,
});

// Test kết nối khi khởi động
pool.getConnection()
  .then(conn => {
    console.log('✅ Kết nối MySQL thành công!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    console.error('👉 Kiểm tra lại file .env và đảm bảo MySQL đang chạy');
  });

module.exports = pool;
