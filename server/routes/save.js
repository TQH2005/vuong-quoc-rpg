// ══════════════════════════════════════════════
// ROUTES/SAVE.JS — Lưu & Load game
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST /api/save — lưu game
router.post('/', async (req, res) => {
  const { user_id, gold, exp, level, hp, pos_x, pos_y, inventory, flags, stats } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Thiếu user_id' });
  try {
    await db.query(`
      INSERT INTO game_saves
        (user_id, gold, exp, level, hp, pos_x, pos_y, inventory, flags, stats)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        gold=VALUES(gold), exp=VALUES(exp), level=VALUES(level),
        hp=VALUES(hp), pos_x=VALUES(pos_x), pos_y=VALUES(pos_y),
        inventory=VALUES(inventory), flags=VALUES(flags),
        stats=VALUES(stats), updated_at=NOW()
    `, [
      user_id,
      gold   || 0,
      exp    || 0,
      level  || 1,
      hp     || 100,
      pos_x  || 0,
      pos_y  || 0,
      JSON.stringify(inventory || {}),
      JSON.stringify(flags     || {}),
      JSON.stringify(stats     || {})
    ]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/save/:user_id — load game
router.get('/:user_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM game_saves WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      [req.params.user_id]
    );
    if (!rows.length) return res.json(null);
    const save = rows[0];
    // Parse JSON fields
    save.inventory = JSON.parse(save.inventory || '{}');
    save.flags     = JSON.parse(save.flags     || '{}');
    save.stats     = JSON.parse(save.stats     || '{}');
    res.json(save);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/save/class — đặt mã lớp cho user
router.post('/class', async (req, res) => {
  const { user_id, class_code } = req.body;
  if (!user_id || !class_code) return res.status(400).json({ error: 'Thiếu thông tin' });
  try {
    await db.query('UPDATE users SET class_code=? WHERE id=?', [class_code.toUpperCase(), user_id]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ranking?classCode=XXX — bảng xếp hạng lớp
router.get('/ranking', async (req, res) => {
  const { classCode } = req.query;
  if (!classCode) return res.status(400).json({ error: 'Thiếu classCode' });
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.username, u.display_name,
             COALESCE(gs.level, 1)  AS level,
             COALESCE(gs.exp,   0)  AS exp,
             COALESCE(gs.gold,  0)  AS gold,
             gs.stats
      FROM users u
      LEFT JOIN game_saves gs ON gs.user_id = u.id
      WHERE u.teacher_code = ?
      ORDER BY COALESCE(gs.level,1) DESC,
               COALESCE(gs.exp,0)   DESC
    `, [classCode.toUpperCase()]);

    const members = rows.map(r => {
      let stats = {};
      try { stats = JSON.parse(r.stats || '{}'); } catch {}
      const subjects = stats.subjects || {};
      // Tính avgPct trung bình tất cả môn
      let total = 0, count = 0;
      Object.values(subjects).forEach(s => {
        if (s.answered > 0) {
          total += Math.round((s.correct || 0) / s.answered * 100);
          count++;
        }
      });
      return {
        username:    r.username,
        displayName: r.display_name || r.username,
        level:       r.level  || 1,
        exp:         r.exp    || 0,
        gold:        r.gold   || 0,
        avgPct:      count > 0 ? Math.round(total / count) : 0,
        subjects:    subjects
      };
    });

    res.json({ classCode, members });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;