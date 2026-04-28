// ══════════════════════════════════════════════
// ROUTES/TEACHER.JS — Giáo viên: đăng ký, đăng nhập, quản lý lớp
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db');

// ── POST /api/teacher/register ─────────────────
router.post('/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password || !displayName)
    return res.status(400).json({ error: 'Thiếu thông tin đăng ký' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO teachers (username, password_hash, display_name) VALUES (?, ?, ?)',
      [username, hash, displayName]
    );
    res.json({ success: true, teacher_id: result.insertId, displayName });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/teacher/login ────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Thiếu tài khoản hoặc mật khẩu' });
  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE username = ?', [username]);
    if (!rows.length) return res.status(404).json({ error: 'Tài khoản không tồn tại' });
    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Sai mật khẩu' });
    res.json({ success: true, teacher_id: rows[0].id, displayName: rows[0].display_name });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/teacher/create-class ─────────────
router.post('/create-class', async (req, res) => {
  const { teacher_id, class_name } = req.body;
  if (!teacher_id || !class_name)
    return res.status(400).json({ error: 'Thiếu thông tin lớp học' });
  // Tạo mã lớp ngẫu nhiên 6 ký tự chữ hoa
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    await db.query(
      'INSERT INTO classes (class_code, class_name, teacher_id) VALUES (?, ?, ?)',
      [code, class_name, teacher_id]
    );
    res.json({ success: true, class_code: code, class_name });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/teacher/classes/:teacher_id ────────
router.get('/classes/:teacher_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC',
      [req.params.teacher_id]
    );
    res.json(rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/teacher/leaderboard/:class_code ────
// Bảng xếp hạng học sinh theo lớp — sắp xếp theo EXP giảm dần
router.get('/leaderboard/:class_code', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.display_name  AS name,
        u.username,
        u.birth_year,
        COALESCE(gs.exp,   0) AS exp,
        COALESCE(gs.gold,  0) AS gold,
        COALESCE(gs.level, 1) AS level,
        COALESCE(gs.stats, '{}') AS stats,
        gs.updated_at
      FROM users u
      LEFT JOIN game_saves gs ON gs.user_id = u.id
      WHERE u.class_code = ? AND u.role = 'student'
      ORDER BY exp DESC
    `, [req.params.class_code]);
    res.json(rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/teacher/verify-class/:code ─────────
router.get('/verify-class/:code', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT class_code, class_name FROM classes WHERE class_code = ?',
      [req.params.code]
    );
    if (!rows.length) return res.status(404).json({ error: 'Mã lớp không tồn tại' });
    res.json({ success: true, class_name: rows[0].class_name });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
