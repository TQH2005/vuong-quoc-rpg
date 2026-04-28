// ══════════════════════════════════════════════
// ROUTES/CLASSROOM.JS — Bảng xếp hạng lớp học
// ══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/classroom/:classId/leaderboard
// Trả về danh sách học sinh + điểm số của lớp đó
router.get('/:classId/leaderboard', async (req, res) => {
  const { classId } = req.params;
  const { teacherUser } = req.query; // optional: xác minh giáo viên
  try {
    // Lấy tất cả học sinh trong lớp + save của họ
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.display_name,
        u.username,
        u.born,
        COALESCE(g.level, 1)   AS level,
        COALESCE(g.exp, 0)     AS exp,
        COALESCE(g.gold, 0)    AS gold,
        COALESCE(g.hp, 100)    AS hp,
        g.stats,
        g.updated_at
      FROM users u
      LEFT JOIN game_saves g ON g.user_id = u.id
        AND g.updated_at = (
          SELECT MAX(g2.updated_at) FROM game_saves g2 WHERE g2.user_id = u.id
        )
      WHERE u.class_id = ?
        AND u.role = 'student'
      ORDER BY COALESCE(g.exp, 0) DESC, COALESCE(g.level, 1) DESC
    `, [classId]);

    const students = rows.map(r => ({
      id         : r.id,
      displayName: r.display_name,
      username   : r.username,
      born       : r.born,
      level      : r.level,
      exp        : r.exp,
      gold       : r.gold,
      hp         : r.hp,
      stats      : (() => { try { return JSON.parse(r.stats || '{}'); } catch{ return {}; } })(),
      lastSave   : r.updated_at
    }));

    res.json({ success: true, classId, students });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
