// ══════════════════════════════════════════════
// SERVER/INDEX.JS — Express entry point
// ══════════════════════════════════════════════
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/save',      require('./routes/save'));
app.use('/api/classroom', require('./routes/classroom'));

// Fallback: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏰 Vương Quốc RPG Server đang chạy!`);
  console.log(`👉 Mở trình duyệt: http://localhost:${PORT}\n`);
});