// ══════════════════════════════════════════════
// ROUTES/AUTH.JS — Đăng ký & Đăng nhập
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, displayName, role, classId, born, phone } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  const userRole = role === 'teacher' ? 'teacher' : 'student';
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (username, password_hash, display_name, role, class_id, born, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hash, displayName || username, userRole, classId || null, born || null, phone || null]
    );
    res.json({ success: true, user_id: result.insertId, username, displayName: displayName || username, role: userRole, classId });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY')
      res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    else
      res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password, role, classId } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu username hoặc password' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(404).json({ error: 'Tài khoản không tồn tại' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Sai mật khẩu' });

    // Kiểm tra chức vụ có khớp không
    if (role && user.role !== role)
      return res.status(403).json({ error: `Tài khoản này không phải ${role === 'teacher' ? 'giảng viên' : 'học sinh'}` });

    // Kiểm tra mã lớp học
    if (classId && user.class_id !== classId)
      return res.status(403).json({ error: 'Mã lớp học không khớp' });

    res.json({
      success    : true,
      user_id    : user.id,
      username   : user.username,
      displayName: user.display_name,
      role       : user.role,
      classId    : user.class_id
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;