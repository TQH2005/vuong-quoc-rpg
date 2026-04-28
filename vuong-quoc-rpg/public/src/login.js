// ══════════════════════════════════════════════════════
// LOGIN.JS — Đăng nhập & Lưu game | Học sinh + Giảng viên
// ══════════════════════════════════════════════════════
(function(){
  const wrap = document.getElementById('wrap');
  wrap.style.visibility   = 'hidden';
  wrap.style.pointerEvents = 'none';

  window._currentUser     = null;
  window._currentUserId   = null;
  window._currentRole     = null;   // 'student' | 'teacher'
  window._currentClass    = null;   // mã lớp học

  // ── Helpers ẩn/hiện panel ───────────────────────────
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

  // ── Điều hướng màn hình ──────────────────────────────

  window.showRoleSelect = function(){
    showOnly('lg-role-panel');
  };

  window.selectRole = function(role){
    const sel = document.getElementById('lg-role-select');
    sel.value = role;
    const title = document.getElementById('lg-login-title');
    title.textContent = role === 'teacher'
      ? '— ĐĂNG NHẬP GIẢNG VIÊN —'
      : '— ĐĂNG NHẬP HỌC SINH —';
    const btn = document.getElementById('lg-btn');
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

  // Đồng bộ title & màu nút khi đổi select
  document.getElementById('lg-role-select').addEventListener('change', function(){
    const role  = this.value;
    const title = document.getElementById('lg-login-title');
    const btn   = document.getElementById('lg-btn');
    title.textContent = role === 'teacher'
      ? '— ĐĂNG NHẬP GIẢNG VIÊN —'
      : '— ĐĂNG NHẬP HỌC SINH —';
    if(role === 'teacher') btn.classList.add('lg-btn-teacher');
    else btn.classList.remove('lg-btn-teacher');
  });

  // ── Lấy dữ liệu game hiện tại ───────────────────────
  function _getGameData(){
    return {
      gold  : typeof coins       !== 'undefined' ? coins       : 0,
      exp   : typeof playerXP    !== 'undefined' ? playerXP    : 0,
      level : typeof playerLevel !== 'undefined' ? playerLevel : 1,
      hp    : typeof playerHP    !== 'undefined' ? playerHP    : 100,
      pos_x : typeof player      !== 'undefined' ? (player.wx||0) : 0,
      pos_y : typeof player      !== 'undefined' ? (player.wy||0) : 0,
      inventory:{
        potions  : typeof potions !== 'undefined' ? potions : {},
        weapons  : typeof weapons !== 'undefined' ? weapons.map(w=>({id:w.id,owned:!!w.owned})) : [],
        armors   : typeof armors  !== 'undefined' ? armors.map(a=>({id:a.id,owned:!!a.owned}))  : [],
        equippedMeleeId: typeof equippedMelee !== 'undefined' && equippedMelee ? equippedMelee.id : null,
        equippedMagicId: typeof equippedMagic !== 'undefined' && equippedMagic ? equippedMagic.id : null,
        equippedArmorId: typeof equippedArmor !== 'undefined' && equippedArmor ? equippedArmor.id : null,
      },
      flags:{
        hacLongUnlocked : typeof hacLongUnlocked !== 'undefined' ? hacLongUnlocked : false,
        thuLongUnlocked : typeof thuLongUnlocked !== 'undefined' ? thuLongUnlocked : false,
        inOcean         : typeof inOcean         !== 'undefined' ? inOcean         : false,
      },
      stats : typeof learnStats !== 'undefined' ? learnStats : {},
      role  : window._currentRole  || 'student',
      class : window._currentClass || ''
    };
  }

  // ── Lưu game ────────────────────────────────────────
  window.saveGameData = async function(){
    if(!window._currentUserId) return;
    try { await window.API.saveGame(window._currentUserId, _getGameData()); }
    catch(e){ console.warn('saveGameData error:', e); }
  };

  // ── Load game ────────────────────────────────────────
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

  // Tự động lưu mỗi 30 giây
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
    setTimeout(()=>{ enterGame(res.user_id, user, res.displayName, role, classId); }, 600);
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
    if(!user || user.length < 3){ err.textContent='❌ Tên tài khoản tối thiểu 3 ký tự!'; err.classList.add('on'); return; }
    if(!pass || pass.length < 4){ err.textContent='❌ Mật khẩu tối thiểu 4 ký tự!';      err.classList.add('on'); return; }
    if(pass !== pass2){ err.textContent='❌ Mật khẩu xác nhận không khớp!'; err.classList.add('on'); return; }

    btn.disabled    = true;
    btn.textContent = '⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name, { role:'student', classId, born, phone });

    if(res.error){
      err.textContent = '❌ ' + res.error;
      err.classList.add('on');
      btn.disabled    = false;
      btn.textContent = '📜 ĐĂNG KÝ';
      return;
    }

    ok.textContent = '✅ Đăng ký thành công! Đang vào game...';
    ok.classList.add('on');
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
    if(!user || user.length < 3){ err.textContent='❌ Tên tài khoản tối thiểu 3 ký tự!'; err.classList.add('on'); return; }
    if(!pass || pass.length < 4){ err.textContent='❌ Mật khẩu tối thiểu 4 ký tự!';      err.classList.add('on'); return; }
    if(pass !== pass2){ err.textContent='❌ Mật khẩu xác nhận không khớp!'; err.classList.add('on'); return; }

    btn.disabled    = true;
    btn.textContent = '⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name, { role:'teacher', classId, phone });

    if(res.error){
      err.textContent = '❌ ' + res.error;
      err.classList.add('on');
      btn.disabled    = false;
      btn.textContent = '🎓 ĐĂNG KÝ GIẢNG VIÊN';
      return;
    }

    ok.textContent = '✅ Đăng ký thành công! Mã lớp của bạn: ' + classId;
    ok.classList.add('on');
    // Sau 2s → preset đăng nhập, chuyển về màn đăng nhập giảng viên
    setTimeout(()=>{
      ok.classList.remove('on');
      btn.disabled    = false;
      btn.textContent = '🎓 ĐĂNG KÝ GIẢNG VIÊN';
      document.getElementById('lg-user').value  = user;
      document.getElementById('lg-class').value = classId;
      selectRole('teacher');
    }, 2000);
  };

  // ── VÀO GAME ────────────────────────────────────────
  async function enterGame(userId, username, displayName, role, classId){
    window._currentUser   = username;
    window._currentUserId = userId;
    window._currentRole   = role    || 'student';
    window._currentClass  = classId || '';

    const loaded = await window.loadGameData(userId);

    document.getElementById('login-screen').classList.add('off');
    wrap.style.visibility    = 'visible';
    wrap.style.pointerEvents = '';
    window._nearHouse        = null;
    window._loginCooldown    = true;
    setTimeout(()=>{ window._loginCooldown = false; }, 1500);

    if(typeof updateHUD === 'function') updateHUD();

    const roleLabel = role === 'teacher' ? '👨‍🏫 Giảng viên' : '🧑‍🎓 Học sinh';
    const msg = loaded
      ? `⚔️ Chào mừng trở lại, ${displayName}! (${roleLabel})`
      : `⚔️ Chào mừng, ${displayName}! (${roleLabel})`;
    setTimeout(()=>{ if(typeof showNotif==='function') showNotif(msg); }, 300);

    window.addEventListener('beforeunload', ()=>{ window.saveGameData(); });
  }

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

  // ── Khởi tạo: hiện màn chọn vai ─────────────────────
  showOnly('lg-role-panel');
})();