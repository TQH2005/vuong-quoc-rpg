// ══════════════════════════════════════════════
// ROUTES/AUTH.JS — Đăng ký & Đăng nhập Học Sinh
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// POST /api/auth/register — Học sinh
router.post('/register', async (req, res) => {
  const { username, password, displayName, class_code, birth_year, phone } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  if (!class_code)
    return res.status(400).json({ error: 'Vui lòng nhập mã lớp học' });

  try {
    const [classes] = await db.query('SELECT class_code FROM classes WHERE class_code = ?', [class_code.toUpperCase()]);
    if (!classes.length)
      return res.status(404).json({ error: 'Mã lớp học không tồn tại. Hãy hỏi giáo viên!' });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash, display_name, class_code, birth_year, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, hash, displayName || username, class_code.toUpperCase(), birth_year || null, phone || null, 'student']
    );
    res.json({ success: true, user_id: result.insertId, username, displayName: displayName || username });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/login — Học sinh
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(404).json({ error: 'Tài khoản không tồn tại' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Sai mật khẩu' });
    res.json({ success: true, user_id: user.id, username: user.username, displayName: user.display_name });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;