const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/save',    require('./routes/save'));
app.use('/api/teacher', require('./routes/teacher'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏰 Vương Quốc RPG Server đang chạy!`);
  console.log(`👉 Mở trình duyệt: http://localhost:${PORT}\n`);
  require('./db').query('SELECT 1')
    .then(()=>console.log('✅ Kết nối MySQL thành công!'))
    .catch(e=>console.error('❌ MySQL lỗi:', e.message));
});
