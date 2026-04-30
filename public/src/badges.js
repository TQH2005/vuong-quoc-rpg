// ══════════════════════════════════════════════════════════
// BADGES.JS — Hệ thống Huy Hiệu
// ══════════════════════════════════════════════════════════

// ── Định nghĩa tất cả huy hiệu ────────────────────────────
const BADGE_DEFS = {

  // ── TOÁN ──────────────────────────────────────────────
  math_1: { id:'math_1', icon:'📐', name:'Nhà Toán Học Tân Binh',    desc:'Giải 50 câu Toán',          color:'#3498db' },
  math_2: { id:'math_2', icon:'📏', name:'Học Trò Số Học',           desc:'Giải 200 câu Toán',         color:'#2980b9' },
  math_3: { id:'math_3', icon:'🔢', name:'Chiến Binh Đại Số',        desc:'Giải 400 câu Toán',         color:'#1a6aa8' },
  math_4: { id:'math_4', icon:'∑',  name:'Bậc Thầy Phương Trình',    desc:'Giải 700 câu Toán',         color:'#0f4f8a' },
  math_5: { id:'math_5', icon:'🧮', name:'Nhà Bác Học Toán Thiên Tài',desc:'Giải 1000 câu Toán',       color:'#ffd700' },

  // ── ĐỊA LÝ ────────────────────────────────────────────
  geo_1:  { id:'geo_1',  icon:'🗺️', name:'Kẻ Lữ Hành Mới',          desc:'Giải 50 câu Địa lý',        color:'#27ae60' },
  geo_2:  { id:'geo_2',  icon:'🧭', name:'Người Khám Phá',           desc:'Giải 200 câu Địa lý',       color:'#229954' },
  geo_3:  { id:'geo_3',  icon:'🌏', name:'Nhà Thám Hiểm',            desc:'Giải 400 câu Địa lý',       color:'#1e8449' },
  geo_4:  { id:'geo_4',  icon:'🏔️', name:'Chinh Phục Đại Lục',       desc:'Giải 700 câu Địa lý',       color:'#196f3d' },
  geo_5:  { id:'geo_5',  icon:'🌍', name:'Bậc Thầy Địa Cầu',         desc:'Giải 1000 câu Địa lý',      color:'#ffd700' },

  // ── LỊCH SỬ ───────────────────────────────────────────
  history_1: { id:'history_1', icon:'📜', name:'Học Giả Sử Học',        desc:'Giải 50 câu Lịch sử',      color:'#e67e22' },
  history_2: { id:'history_2', icon:'🏛️', name:'Nhà Biên Sử',           desc:'Giải 200 câu Lịch sử',     color:'#ca6f1e' },
  history_3: { id:'history_3', icon:'⚔️', name:'Chiến Lược Gia',         desc:'Giải 400 câu Lịch sử',     color:'#b9770e' },
  history_4: { id:'history_4', icon:'👑', name:'Vị Quan Triều Đình',     desc:'Giải 700 câu Lịch sử',     color:'#9a7d0a' },
  history_5: { id:'history_5', icon:'🏯', name:'Sử Gia Huyền Thoại',     desc:'Giải 1000 câu Lịch sử',   color:'#ffd700' },

  // ── VĂN ───────────────────────────────────────────────
  literature_1: { id:'literature_1', icon:'📖', name:'Người Yêu Văn Chương',  desc:'Giải 50 câu Văn',         color:'#8e44ad' },
  literature_2: { id:'literature_2', icon:'✍️', name:'Cây Bút Trẻ',           desc:'Giải 200 câu Văn',        color:'#7d3c98' },
  literature_3: { id:'literature_3', icon:'📚', name:'Học Giả Văn Học',        desc:'Giải 400 câu Văn',        color:'#6c3483' },
  literature_4: { id:'literature_4', icon:'🖋️', name:'Nhà Văn Tài Ba',         desc:'Giải 700 câu Văn',        color:'#5b2c6f' },
  literature_5: { id:'literature_5', icon:'🌹', name:'Thi Hào Bất Tử',         desc:'Giải 1000 câu Văn',       color:'#ffd700' },

  // ── GDCD ──────────────────────────────────────────────
  civic_1: { id:'civic_1', icon:'⚖️', name:'Công Dân Gương Mẫu',      desc:'Giải 50 câu GDCD',         color:'#1abc9c' },
  civic_2: { id:'civic_2', icon:'🏅', name:'Người Giữ Đạo Đức',       desc:'Giải 200 câu GDCD',        color:'#17a589' },
  civic_3: { id:'civic_3', icon:'🛡️', name:'Người Bảo Vệ Lẽ Phải',    desc:'Giải 400 câu GDCD',        color:'#148f77' },
  civic_4: { id:'civic_4', icon:'🗽', name:'Chiến Sĩ Công Lý',        desc:'Giải 700 câu GDCD',        color:'#117a65' },
  civic_5: { id:'civic_5', icon:'⭐', name:'Bậc Thầy Đạo Đức',        desc:'Giải 1000 câu GDCD',       color:'#ffd700' },

  // ── TIẾNG ANH ─────────────────────────────────────────
  english_1: { id:'english_1', icon:'🔤', name:'Học Viên Ngôn Ngữ',      desc:'Giải 50 câu Tiếng Anh',   color:'#e74c3c' },
  english_2: { id:'english_2', icon:'💬', name:'Người Đối Thoại',        desc:'Giải 200 câu Tiếng Anh',  color:'#cb4335' },
  english_3: { id:'english_3', icon:'🗣️', name:'Diễn Giả Lưu Loát',     desc:'Giải 400 câu Tiếng Anh',  color:'#b03a2e' },
  english_4: { id:'english_4', icon:'🌐', name:'Đại Sứ Ngôn Ngữ',        desc:'Giải 700 câu Tiếng Anh',  color:'#922b21' },
  english_5: { id:'english_5', icon:'👑', name:'Bậc Thầy Ngoại Ngữ',     desc:'Giải 1000 câu Tiếng Anh', color:'#ffd700' },

  // ── CHIẾN ĐẤU — QUÁI MẶT ĐẤT ─────────────────────────
  battle_1: { id:'battle_1', icon:'🗡️', name:'Hiệp Sĩ Tập Sự',         desc:'Đánh bại 30 quái vật',     color:'#95a5a6' },
  battle_2: { id:'battle_2', icon:'⚔️', name:'Kiếm Sĩ Dũng Cảm',       desc:'Đánh bại 60 quái vật',     color:'#7f8c8d' },
  battle_3: { id:'battle_3', icon:'🛡️', name:'Chiến Binh Vinh Quang',   desc:'Đánh bại 150 quái vật',    color:'#e67e22' },
  battle_4: { id:'battle_4', icon:'🏹', name:'Dũng Sĩ Bất Khuất',       desc:'Đánh bại 250 quái vật',    color:'#e74c3c' },
  battle_5: { id:'battle_5', icon:'⚡', name:'Chiến Sĩ Huyền Thoại',    desc:'Đánh bại 300 quái vật',    color:'#ffd700' },

  // ── BOSS ──────────────────────────────────────────────
  boss_thu:  { id:'boss_thu',  icon:'🌊', name:'Vị Thần Của Biển Cả',    desc:'Đánh bại Thủy Long Vương', color:'#4dcfff' },
  boss_hoa:  { id:'boss_hoa',  icon:'🔥', name:'Chiến Binh Hỏa Vương',   desc:'Đánh bại Hỏa Long Vương',  color:'#ff6600' },
  boss_hac:  { id:'boss_hac',  icon:'🌑', name:'Hắc Hiệp Sĩ',            desc:'Đánh bại Hắc Long Vương',  color:'#aa44ff' },
  boss_all:  { id:'boss_all',  icon:'🐉', name:'Hiệp Sĩ Long Vương',      desc:'Tiêu diệt cả 3 con rồng',  color:'#ffd700' },
};

// ── Điều kiện mở khóa từng badge ──────────────────────────
function _checkBadgeUnlock(id){
  const s = learnStats.subjects;
  const f = typeof flags !== 'undefined' ? flags : {};
  const kc = (typeof learnStats.killCount !== 'undefined') ? learnStats.killCount : 0;

  switch(id){
    // Toán
    case 'math_1': return (s.math?.answered||0)>=50;
    case 'math_2': return (s.math?.answered||0)>=200;
    case 'math_3': return (s.math?.answered||0)>=400;
    case 'math_4': return (s.math?.answered||0)>=700;
    case 'math_5': return (s.math?.answered||0)>=1000;
    // Địa
    case 'geo_1':  return (s.geo?.answered||0)>=50;
    case 'geo_2':  return (s.geo?.answered||0)>=200;
    case 'geo_3':  return (s.geo?.answered||0)>=400;
    case 'geo_4':  return (s.geo?.answered||0)>=700;
    case 'geo_5':  return (s.geo?.answered||0)>=1000;
    // Sử
    case 'history_1': return (s.history?.answered||0)>=50;
    case 'history_2': return (s.history?.answered||0)>=200;
    case 'history_3': return (s.history?.answered||0)>=400;
    case 'history_4': return (s.history?.answered||0)>=700;
    case 'history_5': return (s.history?.answered||0)>=1000;
    // Văn
    case 'literature_1': return (s.literature?.answered||0)>=50;
    case 'literature_2': return (s.literature?.answered||0)>=200;
    case 'literature_3': return (s.literature?.answered||0)>=400;
    case 'literature_4': return (s.literature?.answered||0)>=700;
    case 'literature_5': return (s.literature?.answered||0)>=1000;
    // GDCD
    case 'civic_1': return (s.civic?.answered||0)>=50;
    case 'civic_2': return (s.civic?.answered||0)>=200;
    case 'civic_3': return (s.civic?.answered||0)>=400;
    case 'civic_4': return (s.civic?.answered||0)>=700;
    case 'civic_5': return (s.civic?.answered||0)>=1000;
    // Anh
    case 'english_1': return (s.english?.answered||0)>=50;
    case 'english_2': return (s.english?.answered||0)>=200;
    case 'english_3': return (s.english?.answered||0)>=400;
    case 'english_4': return (s.english?.answered||0)>=700;
    case 'english_5': return (s.english?.answered||0)>=1000;
    // Chiến đấu
    case 'battle_1': return kc>=30;
    case 'battle_2': return kc>=60;
    case 'battle_3': return kc>=150;
    case 'battle_4': return kc>=250;
    case 'battle_5': return kc>=300;
    // Boss
    case 'boss_thu': return !!f.thuLongDefeated;
    case 'boss_hoa': return !!f.hoaLongDefeated;
    case 'boss_hac': return !!f.hacLongDefeated;
    case 'boss_all': return !!(f.thuLongDefeated && f.hoaLongDefeated && f.hacLongDefeated);
    default: return false;
  }
}

// ── State huy hiệu ────────────────────────────────────────
if(!learnStats.unlockedBadges) learnStats.unlockedBadges = [];
if(!learnStats.equippedBadge)  learnStats.equippedBadge  = null;
if(!learnStats.killCount)      learnStats.killCount       = 0;

// ── Kiểm tra và mở khóa huy hiệu mới ─────────────────────
function checkBadges(){
  let newUnlocked = false;
  for(const id of Object.keys(BADGE_DEFS)){
    if(learnStats.unlockedBadges.includes(id)) continue;
    if(_checkBadgeUnlock(id)){
      learnStats.unlockedBadges.push(id);
      newUnlocked = true;
      _showBadgeNotif(BADGE_DEFS[id]);
    }
  }
  if(newUnlocked && typeof window.saveGameData==='function') window.saveGameData();
  return newUnlocked;
}

// ── Thông báo huy hiệu mới ────────────────────────────────
function _showBadgeNotif(badge){
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:60px;left:50%;transform:translateX(-50%) translateY(-20px);
    background:linear-gradient(135deg,#1a1000,#2a1800);
    border:2px solid ${badge.color};border-radius:8px;
    padding:12px 20px;z-index:99999;
    font-family:'Times New Roman',serif;text-align:center;
    box-shadow:0 0 30px ${badge.color}44;
    animation:badgeIn .4s ease forwards;
    pointer-events:none;
  `;
  el.innerHTML = `
    <div style="font-size:10px;color:#a08040;letter-spacing:2px;margin-bottom:4px;">🏅 HUY HIỆU MỚI!</div>
    <div style="font-size:24px;margin-bottom:4px;">${badge.icon}</div>
    <div style="font-size:14px;font-weight:700;color:${badge.color};letter-spacing:1px;">${badge.name}</div>
    <div style="font-size:10px;color:#7a5820;margin-top:3px;">${badge.desc}</div>
  `;
  if(!document.getElementById('badge-anim-style')){
    const s = document.createElement('style');
    s.id = 'badge-anim-style';
    s.textContent = `
      @keyframes badgeIn{from{opacity:0;transform:translateX(-50%) translateY(-30px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      @keyframes badgeOut{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(-20px)}}
    `;
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.animation='badgeOut .4s ease forwards'; setTimeout(()=>el.remove(),400); }, 3500);
}

// ── Trang bị huy hiệu từ túi đồ ──────────────────────────
function equipBadge(id){
  if(!learnStats.unlockedBadges.includes(id)) return;
  learnStats.equippedBadge = (learnStats.equippedBadge === id) ? null : id;
  if(typeof renderBagSections==='function') renderBagSections();
  if(typeof window.saveGameData==='function') window.saveGameData();
}

// ── Lấy tên hiển thị trên đầu nhân vật ───────────────────
function getEquippedBadgeLabel(){
  const id = learnStats.equippedBadge;
  if(!id) return null;
  const b = BADGE_DEFS[id];
  if(!b) return null;
  return { icon: b.icon, name: b.name, color: b.color };
}

// ── Render phần Huy Hiệu trong túi đồ ────────────────────
function renderBadgeSection(container){
  const sec = document.createElement('div');
  sec.style.cssText = 'margin-top:10px;';
  sec.innerHTML = `<div style="font-size:9px;color:#7a5820;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;border-top:1px solid #2a1a00;padding-top:8px;">🏅 HUY HIỆU</div>`;

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';

  const all = Object.values(BADGE_DEFS);
  all.forEach(b => {
    const unlocked = learnStats.unlockedBadges.includes(b.id);
    const equipped = learnStats.equippedBadge === b.id;
    const div = document.createElement('div');
    div.style.cssText = `
      width:54px;height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;
      border-radius:6px;cursor:${unlocked?'pointer':'default'};
      border:${equipped?`2px solid ${b.color}`:'1px solid #2a1a00'};
      background:${unlocked?(equipped?`rgba(${_hexToRgb(b.color)},0.15)`:'rgba(0,0,0,0.3)'):'rgba(0,0,0,0.5)'};
      opacity:${unlocked?1:0.35};position:relative;
      box-shadow:${equipped?`0 0 10px ${b.color}55`:''};
      transition:all .2s;
    `;
    div.innerHTML = `
      <div style="font-size:20px;filter:${unlocked?'none':'grayscale(1)'};">${b.icon}</div>
      <div style="font-size:7px;color:${unlocked?b.color:'#555'};text-align:center;line-height:1.2;margin-top:2px;padding:0 2px;">${b.name}</div>
      ${equipped?`<div style="position:absolute;top:2px;right:2px;font-size:8px;color:${b.color};">✓</div>`:''}
    `;
    div.title = unlocked ? (equipped?'Đang trang bị — Bấm để bỏ':b.desc+'\nBấm để trang bị') : `🔒 ${b.desc}`;
    if(unlocked) div.onclick = () => equipBadge(b.id);
    grid.appendChild(div);
  });

  sec.appendChild(grid);
  container.appendChild(sec);
}

function _hexToRgb(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── Patch endBattle: tăng killCount khi thắng quái thường ─
(function(){
  const _orig = endBattle;
  endBattle = function(won, rw){
    if(won && bMon && bMon.type !== 'dragon' && bMon.type !== 'dragon_shadow'
        && bMon.type !== 'fire_dragon' && bMon.type !== 'sea_dragon'){
      learnStats.killCount = (learnStats.killCount||0) + 1;
    }
    // Boss flags
    if(won && bMon){
      if(bMon.type==='dragon')       { if(typeof flags!=='undefined') flags.hacLongDefeated=true; }
      if(bMon.type==='fire_dragon')  { if(typeof flags!=='undefined') flags.hoaLongDefeated=true; }
      if(bMon.type==='sea_dragon')   { if(typeof flags!=='undefined') flags.thuLongDefeated=true; }
    }
    _orig(won, rw);
    if(won) checkBadges();
  };
})();

// ── Patch endLearnSession: check badge sau mỗi câu học ────
(function(){
  const _orig = endLearnSession;
  endLearnSession = function(...args){
    _orig(...args);
    checkBadges();
  };
})();
