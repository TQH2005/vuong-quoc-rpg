const API_URL = window.location.origin;

window.API = {

  async register(username, password, displayName) {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
      });
      return await res.json();
    } catch(e) {
      return { error: 'Không thể kết nối server' };
    }
  },

  async login(username, password) {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await res.json();
    } catch(e) {
      return { error: 'Không thể kết nối server' };
    }
  },

  async saveGame(userId, gameData) {
    try {
      await fetch(`${API_URL}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...gameData })
      });
    } catch(e) {
      console.error('API saveGame error:', e);
    }
  },

  async loadGame(userId) {
    try {
      const res = await fetch(`${API_URL}/api/save/${userId}`);
      return await res.json();
    } catch(e) {
      return null;
    }
  }
};