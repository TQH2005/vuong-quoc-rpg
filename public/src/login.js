// ══════════════════════════════════════════════════════
// LOGIN.JS — Đăng nhập & Lưu game | Học sinh + Giảng viên
// ══════════════════════════════════════════════════════
(function(){
  const wrap = document.getElementById('wrap');
  wrap.style.visibility    = 'hidden';
  wrap.style.pointerEvents = 'none';

  window._currentUser    = null;
  window._currentUserId  = null;
  window._currentRole    = null;
  window._currentClass   = null;

  // ── Ẩn/hiện các panel đăng nhập ─────────────────────
  const PANELS = [
    'lg-role-panel',
    'lg-login-panel',
    'lg-register-panel',
    'lg-teacher-register-panel'
  ];
  function showOnly(id){
    PANELS.forEach(p => {
      document.getElementById(p).style.display = (p === id) ? '' : 'none';
    });
  }

  // ── Điều hướng ───────────────────────────────────────
  window.showRoleSelect = function(){
    showOnly('lg-role-panel');
  };

  window.selectRole = function(role){
    const sel   = document.getElementById('lg-role-select');
    sel.value   = role;
    const title = document.getElementById('lg-login-title');
    const btn   = document.getElementById('lg-btn');
    title.textContent = role === 'teacher'
      ? '— ĐĂNG NHẬP GIẢNG VIÊN —'
      : '— ĐĂNG NHẬP HỌC SINH —';
    btn.textContent = role === 'teacher' ? '▶  VÀO HỆ THỐNG' : '▶  VÀO GAME';
    if(role === 'teacher') btn.classList.add('lg-btn-teacher');
    else btn.classList.remove('lg-btn-teacher');
    showOnly('lg-login-panel');
    document.getElementById('lg-user').focus();
  };

  window.showRegister = function(){
    showOnly('lg-register-panel');
    document.getElementById('rg-name').focus();
  };

  window.showTeacherRegister = function(){
    showOnly('lg-teacher-register-panel');
    document.getElementById('tr-name').focus();
  };

  window.showLogin = function(){
    showOnly('lg-login-panel');
    document.getElementById('lg-user').focus();
  };

  document.getElementById('lg-role-select').addEventListener('change', function(){
    const role  = this.value;
    const title = document.getElementById('lg-login-title');
    const btn   = document.getElementById('lg-btn');
    title.textContent = role === 'teacher'
      ? '— ĐĂNG NHẬP GIẢNG VIÊN —'
      : '— ĐĂNG NHẬP HỌC SINH —';
    btn.textContent = role === 'teacher' ? '▶  VÀO HỆ THỐNG' : '▶  VÀO GAME';
    if(role === 'teacher') btn.classList.add('lg-btn-teacher');
    else btn.classList.remove('lg-btn-teacher');
  });

  // ── Lấy dữ liệu game ─────────────────────────────────
  function _getGameData(){
    return {
      gold : typeof coins       !== 'undefined' ? coins       : 0,
      exp  : typeof playerXP    !== 'undefined' ? playerXP    : 0,
      level: typeof playerLevel !== 'undefined' ? playerLevel : 1,
      hp   : typeof playerHP    !== 'undefined' ? playerHP    : 100,
      pos_x: typeof player      !== 'undefined' ? (player.wx||0) : 0,
      pos_y: typeof player      !== 'undefined' ? (player.wy||0) : 0,
      inventory:{
        potions  : typeof potions !== 'undefined' ? potions : {},
        weapons  : typeof weapons !== 'undefined' ? weapons.map(w=>({id:w.id,owned:!!w.owned})) : [],
        armors   : typeof armors  !== 'undefined' ? armors.map(a=>({id:a.id,owned:!!a.owned}))  : [],
        equippedMeleeId: typeof equippedMelee !== 'undefined' && equippedMelee ? equippedMelee.id : null,
        equippedMagicId: typeof equippedMagic !== 'undefined' && equippedMagic ? equippedMagic.id : null,
        equippedArmorId: typeof equippedArmor !== 'undefined' && equippedArmor ? equippedArmor.id : null,
      },
      flags:{
        hacLongUnlocked: typeof hacLongUnlocked !== 'undefined' ? hacLongUnlocked : false,
        thuLongUnlocked: typeof thuLongUnlocked !== 'undefined' ? thuLongUnlocked : false,
        inOcean        : typeof inOcean         !== 'undefined' ? inOcean         : false,
      },
      stats : typeof learnStats !== 'undefined' ? learnStats : {},
      role  : window._currentRole  || 'student',
      class : window._currentClass || ''
    };
  }

  window.saveGameData = async function(){
    if(!window._currentUserId) return;
    try { await window.API.saveGame(window._currentUserId, _getGameData()); }
    catch(e){ console.warn('saveGameData error:', e); }
  };

  window.loadGameData = async function(userId){
    try {
      const gd = await window.API.loadGame(userId);
      if(!gd) return false;
      if(typeof coins       !== 'undefined') coins       = gd.gold  || 0;
      if(typeof playerXP    !== 'undefined') playerXP    = gd.exp   || 0;
      if(typeof playerLevel !== 'undefined') playerLevel = gd.level || 1;
      if(typeof playerHP    !== 'undefined') playerHP    = gd.hp    || 100;
      const inv = gd.inventory || {};
      if(inv.potions && typeof potions !== 'undefined'){
        potions.hp   = inv.potions.hp   || 0;
        potions.mana = inv.potions.mana || 0;
      }
      if(inv.weapons && typeof weapons !== 'undefined')
        inv.weapons.forEach(ow=>{ const w=weapons.find(x=>x.id===ow.id); if(w) w.owned=ow.owned; });
      if(inv.armors && typeof armors !== 'undefined')
        inv.armors.forEach(oa=>{ const a=armors.find(x=>x.id===oa.id); if(a) a.owned=oa.owned; });
      if(inv.equippedMeleeId && typeof weapons !== 'undefined'){
        const w=weapons.find(x=>x.id===inv.equippedMeleeId);
        if(w){ equippedMelee=w; equippedWpn=w; }
      }
      if(inv.equippedMagicId && typeof weapons !== 'undefined'){
        const w=weapons.find(x=>x.id===inv.equippedMagicId); if(w) equippedMagic=w;
      }
      if(inv.equippedArmorId && typeof armors !== 'undefined'){
        const a=armors.find(x=>x.id===inv.equippedArmorId); if(a) equippedArmor=a;
      }
      const flags = gd.flags || {};
      if(typeof hacLongUnlocked !== 'undefined') hacLongUnlocked = flags.hacLongUnlocked || false;
      if(typeof thuLongUnlocked !== 'undefined') thuLongUnlocked = flags.thuLongUnlocked || false;
      if(gd.stats && typeof learnStats !== 'undefined') Object.assign(learnStats, gd.stats);
      return true;
    } catch(e){ console.warn('loadGameData error:', e); return false; }
  };

  setInterval(()=>{ window.saveGameData(); }, 30000);

  // ── ĐĂNG NHẬP ────────────────────────────────────────
  window.doLogin = async function(){
    if(window._loginCooldown) return;
    const user    = document.getElementById('lg-user').value.trim().toLowerCase();
    const pass    = document.getElementById('lg-pass').value;
    const classId = document.getElementById('lg-class').value.trim();
    const role    = document.getElementById('lg-role-select').value;
    const err     = document.getElementById('lg-err');
    const btn     = document.getElementById('lg-btn');

    err.classList.remove('on');
    if(!user){    err.textContent='❌ Vui lòng nhập tài khoản!';  err.classList.add('on'); return; }
    if(!pass){    err.textContent='❌ Vui lòng nhập mật khẩu!';   err.classList.add('on'); return; }
    if(!classId){ err.textContent='❌ Vui lòng nhập mã lớp học!'; err.classList.add('on'); return; }

    btn.textContent = '⏳ Đang đăng nhập...';
    btn.disabled    = true;

    const res = await window.API.login(user, pass, { role, classId });

    if(res.error){
      err.textContent = '❌ ' + res.error;
      err.classList.add('on');
      btn.textContent = role === 'teacher' ? '▶  VÀO HỆ THỐNG' : '▶  VÀO GAME';
      btn.disabled    = false;
      btn.style.animation = 'lgShake .4s ease';
      setTimeout(()=>{ btn.style.animation=''; }, 400);
      document.getElementById('lg-pass').value = '';
      document.getElementById('lg-pass').focus();
      return;
    }

    btn.textContent = '✅  ĐANG VÀO...';
    setTimeout(()=>{
      if(role === 'teacher')
        enterTeacherDashboard(res.user_id, user, res.displayName, classId);
      else
        enterGame(res.user_id, user, res.displayName, role, classId);
    }, 600);
  };

  // ── ĐĂNG KÝ HỌC SINH ────────────────────────────────
  window.doRegister = async function(){
    const name    = document.getElementById('rg-name').value.trim();
    const user    = document.getElementById('rg-user').value.trim().toLowerCase();
    const pass    = document.getElementById('rg-pass').value;
    const pass2   = document.getElementById('rg-pass2').value;
    const classId = document.getElementById('rg-class').value.trim();
    const born    = document.getElementById('rg-born').value;
    const phone   = document.getElementById('rg-phone').value.trim();
    const err     = document.getElementById('lg-reg-err');
    const ok      = document.getElementById('lg-reg-ok');
    const btn     = document.getElementById('rg-btn');

    err.classList.remove('on'); ok.classList.remove('on');
    if(!name){    err.textContent='❌ Vui lòng nhập họ và tên!';         err.classList.add('on'); return; }
    if(!classId){ err.textContent='❌ Vui lòng nhập mã lớp học!';        err.classList.add('on'); return; }
    if(!user || user.length<3){ err.textContent='❌ Tên tài khoản tối thiểu 3 ký tự!'; err.classList.add('on'); return; }
    if(!pass || pass.length<4){ err.textContent='❌ Mật khẩu tối thiểu 4 ký tự!';      err.classList.add('on'); return; }
    if(pass !== pass2){ err.textContent='❌ Mật khẩu xác nhận không khớp!'; err.classList.add('on'); return; }

    btn.disabled = true; btn.textContent = '⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name, { role:'student', classId, born, phone });
    if(res.error){
      err.textContent = '❌ ' + res.error; err.classList.add('on');
      btn.disabled = false; btn.textContent = '📜 ĐĂNG KÝ'; return;
    }
    ok.textContent = '✅ Đăng ký thành công! Đang vào game...'; ok.classList.add('on');
    setTimeout(()=>{ enterGame(res.user_id, user, name, 'student', classId); }, 900);
  };

  // ── ĐĂNG KÝ GIẢNG VIÊN ──────────────────────────────
  window.doTeacherRegister = async function(){
    const name    = document.getElementById('tr-name').value.trim();
    const user    = document.getElementById('tr-user').value.trim().toLowerCase();
    const pass    = document.getElementById('tr-pass').value;
    const pass2   = document.getElementById('tr-pass2').value;
    const classId = document.getElementById('tr-class').value.trim();
    const phone   = document.getElementById('tr-phone').value.trim();
    const err     = document.getElementById('lg-tr-err');
    const ok      = document.getElementById('lg-tr-ok');
    const btn     = document.getElementById('tr-btn');

    err.classList.remove('on'); ok.classList.remove('on');
    if(!name){    err.textContent='❌ Vui lòng nhập họ và tên!';         err.classList.add('on'); return; }
    if(!classId){ err.textContent='❌ Vui lòng nhập mã lớp học!';        err.classList.add('on'); return; }
    if(!user || user.length<3){ err.textContent='❌ Tên tài khoản tối thiểu 3 ký tự!'; err.classList.add('on'); return; }
    if(!pass || pass.length<4){ err.textContent='❌ Mật khẩu tối thiểu 4 ký tự!';      err.classList.add('on'); return; }
    if(pass !== pass2){ err.textContent='❌ Mật khẩu xác nhận không khớp!'; err.classList.add('on'); return; }

    btn.disabled = true; btn.textContent = '⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name, { role:'teacher', classId, phone });
    if(res.error){
      err.textContent = '❌ ' + res.error; err.classList.add('on');
      btn.disabled = false; btn.textContent = '🎓 ĐĂNG KÝ GIẢNG VIÊN'; return;
    }
    ok.textContent = '✅ Đăng ký thành công! Mã lớp: ' + classId; ok.classList.add('on');
    setTimeout(()=>{
      ok.classList.remove('on');
      btn.disabled = false; btn.textContent = '🎓 ĐĂNG KÝ GIẢNG VIÊN';
      document.getElementById('lg-user').value  = user;
      document.getElementById('lg-class').value = classId;
      selectRole('teacher');
    }, 2200);
  };

  // ── VÀO GAME (học sinh) ───────────────────────────────
  async function enterGame(userId, username, displayName, role, classId){
    window._currentUser   = username;
    window._currentUserId = userId;
    window._currentRole   = role    || 'student';
    window._currentClass  = classId || '';

    const loaded = await window.loadGameData(userId);
    document.getElementById('login-screen').classList.add('off');
    wrap.style.visibility    = 'visible';
    wrap.style.pointerEvents = '';
    window._nearHouse     = null;
    window._loginCooldown = true;
    setTimeout(()=>{ window._loginCooldown = false; }, 1500);
    if(typeof updateHUD === 'function') updateHUD();
    const msg = loaded
      ? `⚔️ Chào mừng trở lại, ${displayName}!`
      : `⚔️ Chào mừng, ${displayName}! 🧑‍🎓`;
    setTimeout(()=>{ if(typeof showNotif==='function') showNotif(msg); }, 300);
    window.addEventListener('beforeunload', ()=>{ window.saveGameData(); });
  }

  // ── VÀO DASHBOARD GIÁO VIÊN ──────────────────────────
  window._leaderboardData = [];

  async function enterTeacherDashboard(userId, username, displayName, classId){
    window._currentUser   = username;
    window._currentUserId = userId;
    window._currentRole   = 'teacher';
    window._currentClass  = classId;

    // Ẩn login-screen, hiện dashboard
    document.getElementById('login-screen').classList.add('off');
    document.getElementById('teacher-dashboard').classList.add('on');

    // Điền thông tin header
    document.getElementById('td-classid').textContent     = classId;
    document.getElementById('td-teacher-name').textContent = '👤 ' + (displayName || username);
    document.getElementById('td-subtitle').textContent     = 'Giảng viên: ' + (displayName || username);

    await loadLeaderboard();
  }

  window.teacherLogout = function(){
    window._currentUser   = null;
    window._currentUserId = null;
    window._currentRole   = null;
    window._currentClass  = null;
    window._leaderboardData = [];
    document.getElementById('teacher-dashboard').classList.remove('on');
    document.getElementById('login-screen').classList.remove('off');
    // Reset form
    document.getElementById('lg-user').value = '';
    document.getElementById('lg-pass').value = '';
    document.getElementById('lg-class').value = '';
    document.getElementById('lg-btn').textContent = '▶  VÀO HỆ THỐNG';
    showOnly('lg-role-panel');
  };

  window.loadLeaderboard = async function(){
    const tbody = document.getElementById('td-tbody');
    tbody.innerHTML = '<tr><td colspan="9" class="td-loading">⏳ Đang tải...</td></tr>';

    const res = await window.API.getClassLeaderboard(window._currentClass);

    if(res.error){
      tbody.innerHTML = `<tr><td colspan="9" class="td-loading td-error">❌ ${res.error}</td></tr>`;
      return;
    }

    window._leaderboardData = res.students || [];
    _updateStats(window._leaderboardData);
    filterLeaderboard();
  };

  function _updateStats(students){
    const n = students.length;
    document.getElementById('td-total').textContent   = n;
    if(!n){
      document.getElementById('td-avg-lv').textContent  = '—';
      document.getElementById('td-avg-exp').textContent = '—';
      document.getElementById('td-top-name').textContent= '—';
      return;
    }
    const avgLv  = (students.reduce((s,x)=>s+x.level,0)/n).toFixed(1);
    const avgExp = Math.round(students.reduce((s,x)=>s+x.exp,0)/n);
    document.getElementById('td-avg-lv').textContent   = avgLv;
    document.getElementById('td-avg-exp').textContent  = avgExp.toLocaleString('vi-VN');
    document.getElementById('td-top-name').textContent = students[0]?.displayName || '—';
  }

  window.filterLeaderboard = function(){
    const q     = (document.getElementById('td-search').value||'').trim().toLowerCase();
    const sort  = document.getElementById('td-sort').value;
    let data    = [...window._leaderboardData];

    if(q) data = data.filter(s => s.displayName.toLowerCase().includes(q) || s.username.toLowerCase().includes(q));

    if(sort === 'exp')     data.sort((a,b)=>b.exp - a.exp);
    else if(sort==='level')data.sort((a,b)=>b.level - a.level);
    else if(sort==='name') data.sort((a,b)=>a.displayName.localeCompare(b.displayName,'vi'));
    else if(sort==='gold') data.sort((a,b)=>b.gold - a.gold);
    else if(sort==='correct'){
      data.sort((a,b)=>{
        const ca = a.stats?.correct||0, cb = b.stats?.correct||0;
        return cb - ca;
      });
    }

    _renderTable(data);
  };

  function _renderTable(data){
    const tbody = document.getElementById('td-tbody');
    if(!data.length){
      tbody.innerHTML = '<tr><td colspan="9" class="td-loading">📭 Chưa có học sinh trong lớp này</td></tr>';
      return;
    }

    tbody.innerHTML = data.map((s, i) => {
      const correct = s.stats?.correct || 0;
      const wrong   = s.stats?.wrong   || 0;
      const total   = correct + wrong;
      const pct     = total > 0 ? Math.round(correct/total*100) : 0;
      const pctBar  = `<div class="td-pct-wrap"><div class="td-pct-bar" style="width:${pct}%"></div><span>${pct}%</span></div>`;

      const lastSave = s.lastSave
        ? new Date(s.lastSave).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})
        : '—';

      const rankIcon = i===0?'🥇':i===1?'🥈':i===2?'🥉':String(i+1);
      const rowClass = i===0?'td-row-gold':i===1?'td-row-silver':i===2?'td-row-bronze':'';

      return `<tr class="${rowClass}">
        <td class="td-rank">${rankIcon}</td>
        <td class="td-name">
          <div class="td-name-main">${_esc(s.displayName)}</div>
          <div class="td-name-sub">@${_esc(s.username)}</div>
        </td>
        <td><span class="td-badge td-badge-lv">Lv${s.level}</span></td>
        <td><span class="td-exp">${s.exp.toLocaleString('vi-VN')}</span></td>
        <td>${s.gold.toLocaleString('vi-VN')}</td>
        <td class="td-correct">${correct}</td>
        <td class="td-wrong">${wrong}</td>
        <td>${pctBar}</td>
        <td class="td-time">${lastSave}</td>
      </tr>`;
    }).join('');
  }

  function _esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Keyboard shortcuts ───────────────────────────────
  document.getElementById('lg-user').addEventListener('keydown',
    e=>{ if(e.key==='Enter') document.getElementById('lg-pass').focus(); });
  document.getElementById('lg-pass').addEventListener('keydown',
    e=>{ if(e.key==='Enter') document.getElementById('lg-class').focus(); });
  document.getElementById('lg-class').addEventListener('keydown',
    e=>{ if(e.key==='Enter') doLogin(); });
  document.getElementById('rg-pass').addEventListener('keydown',
    e=>{ if(e.key==='Enter') document.getElementById('rg-pass2').focus(); });
  document.getElementById('rg-pass2').addEventListener('keydown',
    e=>{ if(e.key==='Enter') doRegister(); });
  document.getElementById('tr-pass').addEventListener('keydown',
    e=>{ if(e.key==='Enter') document.getElementById('tr-pass2').focus(); });
  document.getElementById('tr-pass2').addEventListener('keydown',
    e=>{ if(e.key==='Enter') doTeacherRegister(); });

  // Khởi tạo
  showOnly('lg-role-panel');
})();