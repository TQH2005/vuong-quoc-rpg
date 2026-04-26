// ══════════════════════════════════════════════
// API.JS — Kết nối frontend ↔ Express server
// ══════════════════════════════════════════════

const API_URL = 'http://localhost:3000/api';

window.API = {

  // ── Đăng ký tài khoản mới ─────────────────
  async register(username, password, displayName) {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
      });
      return await res.json();
    } catch(e) {
      console.error('API register error:', e);
      return { error: 'Không thể kết nối server' };
    }
  },

  // ── Đăng nhập ─────────────────────────────
  async login(username, password) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await res.json();
    } catch(e) {
      console.error('API login error:', e);
      return { error: 'Không thể kết nối server' };
    }
  },

  // ── Lưu game lên MySQL ────────────────────
  async saveGame(userId, gameData) {
    try {
      await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...gameData })
      });
    } catch(e) {
      console.error('API saveGame error:', e);
    }
  },

  // ── Load game từ MySQL ────────────────────
  async loadGame(userId) {
    try {
      const res = await fetch(`${API_URL}/save/${userId}`);
      return await res.json();
    } catch(e) {
      console.error('API loadGame error:', e);
      return null;
    }
  }
};
