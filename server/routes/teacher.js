// ══════════════════════════════════════════════
// ROUTES/TEACHER.JS — Giáo viên
// Mã GV = username viết hoa (cố định, dễ nhớ)
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// POST /api/teacher/register
router.post('/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password || !displayName)
    return res.status(400).json({ error: 'Thiếu thông tin đăng ký' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const teacherCode = username.toUpperCase(); // mã GV = username hoa
    const [result] = await db.query(
      'INSERT INTO teachers (username, password_hash, display_name, teacher_code) VALUES (?, ?, ?, ?)',
      [username.toLowerCase(), hash, displayName, teacherCode]
    );
    res.json({ success: true, teacher_id: result.insertId, displayName, teacher_code: teacherCode });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/teacher/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu tài khoản hoặc mật khẩu' });
  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE username = ?', [username.toLowerCase()]);
    if (!rows.length) return res.status(404).json({ error: 'Tài khoản không tồn tại' });
    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Sai mật khẩu' });
    res.json({
      success: true,
      teacher_id: rows[0].id,
      displayName: rows[0].display_name,
      teacher_code: rows[0].teacher_code
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/teacher/students/:teacher_code — danh sách học sinh
router.get('/students/:teacher_code', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id, u.display_name AS name, u.username, u.birth_year,
        COALESCE(gs.exp,   0) AS exp,
        COALESCE(gs.gold,  0) AS gold,
        COALESCE(gs.level, 1) AS level,
        COALESCE(gs.stats, '{}') AS stats,
        gs.updated_at
      FROM users u
      LEFT JOIN game_saves gs ON gs.user_id = u.id
      WHERE u.teacher_code = ?
      ORDER BY exp DESC
    `, [req.params.teacher_code.toUpperCase()]);
    res.json(rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/teacher/student-detail/:user_id — chi tiết 1 học sinh
router.get('/student-detail/:user_id', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, display_name AS name, username, birth_year FROM users WHERE id = ?',
      [req.params.user_id]
    );
    if (!users.length) return res.status(404).json({ error: 'Không tìm thấy học sinh' });
    const [saves] = await db.query(
      'SELECT * FROM game_saves WHERE user_id = ?',
      [req.params.user_id]
    );
    const save = saves[0] || {};
    res.json({
      ...users[0],
      exp:   save.exp   || 0,
      gold:  save.gold  || 0,
      level: save.level || 1,
      hp:    save.hp    || 100,
      stats: save.stats || '{}',
      flags: save.flags || '{}',
      updated_at: save.updated_at
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/teacher/verify/:teacher_code — kiểm tra mã GV hợp lệ
router.get('/verify/:teacher_code', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT display_name FROM teachers WHERE teacher_code = ?',
      [req.params.teacher_code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ error: 'Mã giáo viên không tồn tại' });
    res.json({ success: true, teacher_name: rows[0].display_name });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;