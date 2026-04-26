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

module.exports = router;
