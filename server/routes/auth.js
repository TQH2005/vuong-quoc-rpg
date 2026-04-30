// ══════════════════════════════════════════════
// ROUTES/AUTH.JS — Học sinh đăng ký / đăng nhập
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, displayName, teacher_code, birth_year } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu username hoặc password' });
  if (!displayName)           return res.status(400).json({ error: 'Vui lòng nhập họ và tên' });
  if (!teacher_code)          return res.status(400).json({ error: 'Vui lòng nhập mã giáo viên' });

  // Kiểm tra mã GV
  try {
    const [tc] = await db.query(
      'SELECT teacher_code FROM teachers WHERE teacher_code = ?',
      [teacher_code.toUpperCase()]
    );
    if (!tc.length) return res.status(404).json({ error: 'Mã giáo viên không tồn tại!' });
  } catch(e) { return res.status(500).json({ error: e.message }); }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash, display_name, teacher_code, birth_year, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username.toLowerCase(), hash, displayName, teacher_code.toUpperCase(), birth_year||null, 'student']
    );
    res.json({ success: true, user_id: result.insertId, username, displayName });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu username hoặc password' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username.toLowerCase()]);
    if (!rows.length) return res.status(404).json({ error: 'Tài khoản không tồn tại' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Sai mật khẩu' });
    res.json({
      success: true,
      user_id: user.id,
      username: user.username,
      displayName: user.display_name,
      teacher_code: user.teacher_code || ''
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;