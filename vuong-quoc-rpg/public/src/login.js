// ══════════════════════════════════════════════
// LOGIN.JS — Đăng nhập & Lưu game qua MySQL
// ══════════════════════════════════════════════
(function(){
  const wrap = document.getElementById('wrap');
  wrap.style.visibility = 'hidden';
  wrap.style.pointerEvents = 'none';

  window._currentUser   = null;
  window._currentUserId = null;

  // ── Lấy dữ liệu game hiện tại ──────────────
  function _getGameData() {
    return {
      gold  : typeof coins       !== 'undefined' ? coins       : 0,
      exp   : typeof playerXP    !== 'undefined' ? playerXP    : 0,
      level : typeof playerLevel !== 'undefined' ? playerLevel : 1,
      hp    : typeof playerHP    !== 'undefined' ? playerHP    : 100,
      pos_x : typeof player      !== 'undefined' ? (player.wx||0) : 0,
      pos_y : typeof player      !== 'undefined' ? (player.wy||0) : 0,
      inventory: {
        potions  : typeof potions !== 'undefined' ? potions : {},
        weapons  : typeof weapons !== 'undefined' ? weapons.map(w=>({id:w.id,owned:!!w.owned})) : [],
        armors   : typeof armors  !== 'undefined' ? armors.map(a=>({id:a.id,owned:!!a.owned}))  : [],
        equippedMeleeId: typeof equippedMelee !== 'undefined' && equippedMelee ? equippedMelee.id : null,
        equippedMagicId: typeof equippedMagic !== 'undefined' && equippedMagic ? equippedMagic.id : null,
        equippedArmorId: typeof equippedArmor !== 'undefined' && equippedArmor ? equippedArmor.id : null,
      },
      flags: {
        hacLongUnlocked : typeof hacLongUnlocked  !== 'undefined' ? hacLongUnlocked  : false,
        thuLongUnlocked : typeof thuLongUnlocked  !== 'undefined' ? thuLongUnlocked  : false,
        inOcean         : typeof inOcean          !== 'undefined' ? inOcean          : false,
      },
      stats: typeof learnStats !== 'undefined' ? learnStats : {}
    };
  }

  // ── Lưu game lên MySQL ──────────────────────
  window.saveGameData = async function(){
    if(!window._currentUserId) return;
    try {
      await window.API.saveGame(window._currentUserId, _getGameData());
    } catch(e) {
      console.warn('saveGameData error:', e);
    }
  };

  // ── Load game từ MySQL ──────────────────────
  window.loadGameData = async function(userId){
    try {
      const gd = await window.API.loadGame(userId);
      if(!gd) return false;
      // Áp dụng dữ liệu vào game
      if(typeof coins       !== 'undefined') coins       = gd.gold   || 0;
      if(typeof playerXP    !== 'undefined') playerXP    = gd.exp    || 0;
      if(typeof playerLevel !== 'undefined') playerLevel = gd.level  || 1;
      if(typeof playerHP    !== 'undefined') playerHP    = gd.hp     || 100;
      const inv = gd.inventory || {};
      if(inv.potions && typeof potions !== 'undefined'){
        potions.hp   = inv.potions.hp   || 0;
        potions.mana = inv.potions.mana || 0;
      }
      if(inv.weapons && typeof weapons !== 'undefined'){
        inv.weapons.forEach(ow=>{ const w=weapons.find(x=>x.id===ow.id); if(w) w.owned=ow.owned; });
      }
      if(inv.armors && typeof armors !== 'undefined'){
        inv.armors.forEach(oa=>{ const a=armors.find(x=>x.id===oa.id); if(a) a.owned=oa.owned; });
      }
      if(inv.equippedMeleeId && typeof weapons !== 'undefined'){
        const w=weapons.find(x=>x.id===inv.equippedMeleeId); if(w){ equippedMelee=w; equippedWpn=w; }
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
    } catch(e) {
      console.warn('loadGameData error:', e);
      return false;
    }
  };

  // Tự động lưu mỗi 30 giây
  setInterval(()=>{ window.saveGameData(); }, 30000);

  // ── Hiển thị form ───────────────────────────
  window.showRegister = function(){
    document.getElementById('lg-login-panel').style.display='none';
    document.getElementById('lg-register-panel').style.display='';
    document.getElementById('rg-name').focus();
  };
  window.showLogin = function(){
    document.getElementById('lg-register-panel').style.display='none';
    document.getElementById('lg-login-panel').style.display='';
    document.getElementById('lg-user').focus();
  };

  // ── Đăng ký ────────────────────────────────
  window.doRegister = async function(){
    const name  = document.getElementById('rg-name').value.trim();
    const user  = document.getElementById('rg-user').value.trim().toLowerCase();
    const pass  = document.getElementById('rg-pass').value;
    const pass2 = document.getElementById('rg-pass2').value;
    const err   = document.getElementById('lg-reg-err');
    const ok    = document.getElementById('lg-reg-ok');
    const btn   = document.getElementById('rg-btn');

    err.classList.remove('on'); ok.classList.remove('on');

    if(!name){ err.textContent='❌ Vui lòng nhập họ và tên!'; err.classList.add('on'); return; }
    if(!user || user.length < 3){ err.textContent='❌ Tên tài khoản tối thiểu 3 ký tự!'; err.classList.add('on'); return; }
    if(!pass || pass.length < 4){ err.textContent='❌ Mật khẩu tối thiểu 4 ký tự!'; err.classList.add('on'); return; }
    if(pass !== pass2){ err.textContent='❌ Mật khẩu xác nhận không khớp!'; err.classList.add('on'); return; }

    btn.disabled = true;
    btn.textContent = '⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name);
    if(res.error){
      err.textContent = '❌ ' + res.error;
      err.classList.add('on');
      btn.disabled = false;
      btn.textContent = '▶ ĐĂNG KÝ';
      return;
    }

    ok.textContent = '✅ Đăng ký thành công! Đang vào game...';
    ok.classList.add('on');
    setTimeout(()=>{ enterGame(res.user_id, user, name); }, 900);
  };

  // ── Đăng nhập ──────────────────────────────
  window.doLogin = async function(){
    if(window._loginCooldown) return;
    const user = document.getElementById('lg-user').value.trim().toLowerCase();
    const pass = document.getElementById('lg-pass').value;
    const err  = document.getElementById('lg-err');
    const btn  = document.getElementById('lg-btn');

    err.classList.remove('on');
    btn.textContent = '⏳ Đang đăng nhập...';
    btn.disabled = true;

    const res = await window.API.login(user, pass);
    if(res.error){
      err.textContent = '❌ ' + res.error;
      err.classList.add('on');
      btn.textContent = '▶  VÀO GAME';
      btn.disabled = false;
      btn.style.animation = 'lgShake .4s ease';
      setTimeout(()=>{ btn.style.animation=''; }, 400);
      document.getElementById('lg-pass').value = '';
      document.getElementById('lg-pass').focus();
      return;
    }

    btn.textContent = '✅  ĐANG VÀO...';
    setTimeout(()=>{ enterGame(res.user_id, user, res.displayName); }, 600);
  };

  // ── Vào game ───────────────────────────────
  async function enterGame(userId, username, displayName){
    window._currentUser   = username;
    window._currentUserId = userId;

    const loaded = await window.loadGameData(userId);

    document.getElementById('login-screen').classList.add('off');
    wrap.style.visibility  = 'visible';
    wrap.style.pointerEvents = '';
    window._nearHouse     = null;
    window._loginCooldown = true;
    setTimeout(()=>{ window._loginCooldown = false; }, 1500);
    if(typeof updateHUD === 'function') updateHUD();
    const msg = loaded
      ? '⚔️ Chào mừng trở lại, ' + displayName + '!'
      : '⚔️ Chào mừng, ' + displayName + '!';
    setTimeout(()=>{ if(typeof showNotif==='function') showNotif(msg); }, 300);
    window.addEventListener('beforeunload', ()=>{ window.saveGameData(); });
  }

  // Keyboard shortcuts
  document.getElementById('lg-pass').addEventListener('keydown',  e=>{ if(e.key==='Enter') doLogin(); });
  document.getElementById('lg-user').addEventListener('keydown',  e=>{ if(e.key==='Enter') document.getElementById('lg-pass').focus(); });
  document.getElementById('rg-pass2').addEventListener('keydown', e=>{ if(e.key==='Enter') doRegister(); });
  document.getElementById('rg-pass').addEventListener('keydown',  e=>{ if(e.key==='Enter') document.getElementById('rg-pass2').focus(); });
})();
