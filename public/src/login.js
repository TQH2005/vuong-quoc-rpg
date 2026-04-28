// ══════════════════════════════════════════════
// LOGIN.JS — Hệ thống 3 vai trò: Học sinh / Giáo viên / Phụ huynh
// ══════════════════════════════════════════════
(function(){
  const wrap = document.getElementById('wrap');
  wrap.style.visibility  = 'hidden';
  wrap.style.pointerEvents = 'none';

  window._currentUser   = null;
  window._currentUserId = null;

  // ── Hiển thị/ẩn panel ─────────────────────
  function hideAll(){
    ['lg-role-panel','lg-student-login-panel','lg-student-register-panel',
     'lg-teacher-login-panel','lg-teacher-register-panel','lg-parent-panel'
    ].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });
  }
  function show(id){ hideAll(); const el=document.getElementById(id); if(el) el.style.display=''; }

  window.showRolePanel       = ()=>show('lg-role-panel');
  window.showStudentLogin    = ()=>{ show('lg-student-login-panel'); document.getElementById('lg-user')?.focus(); };
  window.showStudentRegister = ()=>{ show('lg-student-register-panel'); document.getElementById('rg-name')?.focus(); };
  window.showTeacherLogin    = ()=>{ show('lg-teacher-login-panel'); document.getElementById('tc-user')?.focus(); };
  window.showTeacherRegister = ()=>{ show('lg-teacher-register-panel'); document.getElementById('tr-name')?.focus(); };

  window.selectRole = function(role){
    if(role==='student') showStudentLogin();
    else if(role==='teacher') showTeacherLogin();
    else if(role==='parent') show('lg-parent-panel');
  };

  // Compat cũ
  window.showLogin    = showStudentLogin;
  window.showRegister = showStudentRegister;
  window.showRoleSelect = showRolePanel;

  // ── Msg helper ──────────────────────────────
  function setMsg(id, msg, isOk=false){
    const el=document.getElementById(id);
    if(!el) return;
    el.textContent = msg;
    el.className = isOk ? 'lg-msg-ok on' : 'lg-msg-err on';
  }
  function clearMsg(id){ const el=document.getElementById(id); if(el){ el.textContent=''; el.className='lg-msg-err'; } }

  // ══════════════════════════════════════════
  // HỌC SINH — Đăng ký
  // ══════════════════════════════════════════
  window.doRegister = async function(){
    const name  = document.getElementById('rg-name')?.value.trim();
    const born  = document.getElementById('rg-born')?.value;
    const code  = document.getElementById('rg-class')?.value.trim().toUpperCase();
    const user  = document.getElementById('rg-user')?.value.trim().toLowerCase();
    const pass  = document.getElementById('rg-pass')?.value;
    const pass2 = document.getElementById('rg-pass2')?.value;
    const btn   = document.getElementById('rg-btn');

    clearMsg('lg-reg-err'); clearMsg('lg-reg-ok');

    if(!name)            return setMsg('lg-reg-err','❌ Vui lòng nhập họ và tên!');
    if(!code)            return setMsg('lg-reg-err','❌ Vui lòng nhập mã lớp học!');
    if(!user||user.length<3) return setMsg('lg-reg-err','❌ Tên tài khoản tối thiểu 3 ký tự!');
    if(!pass||pass.length<4) return setMsg('lg-reg-err','❌ Mật khẩu tối thiểu 4 ký tự!');
    if(pass!==pass2)     return setMsg('lg-reg-err','❌ Mật khẩu xác nhận không khớp!');

    btn.disabled=true; btn.textContent='⏳ Đang đăng ký...';

    const res = await window.API.register(user, pass, name, code, born||null, null);
    if(res.error){
      setMsg('lg-reg-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='📜 ĐĂNG KÝ';
      return;
    }
    setMsg('lg-reg-ok','✅ Đăng ký thành công! Đang vào game...', true);
    setTimeout(()=>enterGame(res.user_id, user, name), 900);
  };

  // ══════════════════════════════════════════
  // HỌC SINH — Đăng nhập
  // ══════════════════════════════════════════
  window.doLogin = async function(){
    if(window._loginCooldown) return;
    const user = document.getElementById('lg-user')?.value.trim().toLowerCase();
    const pass = document.getElementById('lg-pass')?.value;
    const btn  = document.getElementById('lg-btn');

    clearMsg('lg-err');
    btn.textContent='⏳ Đang đăng nhập...'; btn.disabled=true;

    const res = await window.API.login(user, pass);
    if(res.error){
      setMsg('lg-err','❌ '+res.error);
      btn.textContent='⚔️ VÀO GAME'; btn.disabled=false;
      document.getElementById('lg-pass').value='';
      return;
    }
    btn.textContent='✅ ĐANG VÀO...';
    setTimeout(()=>enterGame(res.user_id, user, res.displayName), 600);
  };

  // ══════════════════════════════════════════
  // GIÁO VIÊN — Đăng nhập → Dashboard
  // ══════════════════════════════════════════
  window.doTeacherLogin = async function(){
    const user = document.getElementById('tc-user')?.value.trim().toLowerCase();
    const pass = document.getElementById('tc-pass')?.value;
    const btn  = document.getElementById('tc-btn');

    clearMsg('tc-err');
    btn.disabled=true; btn.textContent='⏳ Đang đăng nhập...';

    const res = await fetch('/api/teacher/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:user, password:pass})
    }).then(r=>r.json()).catch(()=>({error:'Không thể kết nối server'}));

    if(res.error){
      setMsg('tc-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='👨‍🏫 VÀO BẢNG QUẢN LÝ';
      return;
    }
    // Vào dashboard giáo viên (không vào game)
    enterTeacherDashboard(res.teacher_id, res.displayName);
  };

  // ══════════════════════════════════════════
  // GIÁO VIÊN — Đăng ký
  // ══════════════════════════════════════════
  window.doTeacherRegister = async function(){
    const name  = document.getElementById('tr-name')?.value.trim();
    const user  = document.getElementById('tr-user')?.value.trim().toLowerCase();
    const pass  = document.getElementById('tr-pass')?.value;
    const pass2 = document.getElementById('tr-pass2')?.value;
    const btn   = document.getElementById('tr-btn');

    clearMsg('tr-err'); clearMsg('tr-ok');

    if(!name)             return setMsg('tr-err','❌ Vui lòng nhập họ và tên!');
    if(!user||user.length<3) return setMsg('tr-err','❌ Tên tài khoản tối thiểu 3 ký tự!');
    if(!pass||pass.length<6) return setMsg('tr-err','❌ Mật khẩu tối thiểu 6 ký tự!');
    if(pass!==pass2)      return setMsg('tr-err','❌ Mật khẩu xác nhận không khớp!');

    btn.disabled=true; btn.textContent='⏳ Đang đăng ký...';

    const res = await fetch('/api/teacher/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:user, password:pass, displayName:name})
    }).then(r=>r.json()).catch(()=>({error:'Không thể kết nối server'}));

    if(res.error){
      setMsg('tr-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='📋 ĐĂNG KÝ';
      return;
    }
    setMsg('tr-ok','✅ Đăng ký thành công! Đang vào bảng quản lý...', true);
    setTimeout(()=>enterTeacherDashboard(res.teacher_id, name), 900);
  };

  // ══════════════════════════════════════════
  // PHỤ HUYNH — Xem bảng xếp hạng theo mã lớp
  // ══════════════════════════════════════════
  window.doParentView = async function(){
    const code = document.getElementById('ph-class')?.value.trim().toUpperCase();
    clearMsg('ph-err');
    if(!code) return setMsg('ph-err','❌ Vui lòng nhập mã lớp học!');

    const res = await fetch(`/api/teacher/leaderboard/${code}`)
      .then(r=>r.json()).catch(()=>({error:'Không thể kết nối server'}));

    if(res.error) return setMsg('ph-err','❌ '+res.error);
    showLeaderboard(res, code, true); // isParent=true
  };

  // ══════════════════════════════════════════
  // DASHBOARD GIÁO VIÊN
  // ══════════════════════════════════════════
  function enterTeacherDashboard(teacherId, displayName){
    document.getElementById('login-screen').innerHTML = buildTeacherDashboard(teacherId, displayName);
    loadTeacherClasses(teacherId);
  }

  function buildTeacherDashboard(teacherId, name){
    return `
    <style>
    .td-wrap{max-width:960px;margin:0 auto;padding:20px;font-family:'Times New Roman',serif;color:#d4b86a;}
    .td-header{text-align:center;margin-bottom:24px;}
    .td-title{font-size:22px;letter-spacing:3px;color:#ffd700;font-family:'Cinzel',serif;margin-bottom:4px;}
    .td-sub{font-size:13px;color:#9a7a3a;}
    .td-section{background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:16px;margin-bottom:18px;}
    .td-section-title{font-size:14px;letter-spacing:2px;color:#ffd700;margin-bottom:12px;border-bottom:1px solid rgba(255,215,0,0.15);padding-bottom:6px;}
    .td-create-form{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
    .td-inp{background:rgba(0,0,0,0.5);border:1px solid rgba(255,215,0,0.3);border-radius:4px;color:#d4b86a;padding:8px 12px;font-size:13px;flex:1;min-width:180px;}
    .td-btn{background:linear-gradient(135deg,#4a3000,#6a4500);border:1px solid #8B6914;border-radius:4px;color:#ffd700;padding:9px 18px;cursor:pointer;font-size:12px;letter-spacing:1px;white-space:nowrap;}
    .td-btn:hover{background:rgba(139,105,20,0.4);}
    .td-btn-danger{background:linear-gradient(135deg,#3a0000,#5a0000);border-color:#8B0000;color:#ff8888;}
    .class-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:12px;}
    .class-card{background:rgba(0,0,0,0.4);border:1px solid rgba(255,215,0,0.2);border-radius:6px;padding:14px;cursor:pointer;transition:all .2s;}
    .class-card:hover{border-color:#ffd700;transform:translateY(-2px);}
    .class-code{font-size:20px;font-weight:700;color:#ffd700;letter-spacing:4px;margin-bottom:4px;}
    .class-name{font-size:12px;color:#9a7a3a;}
    .class-count{font-size:11px;color:#6a5a2a;margin-top:4px;}
    .td-msg{margin-top:8px;font-size:12px;}
    .lb-table{width:100%;border-collapse:collapse;font-size:13px;}
    .lb-table th{background:rgba(255,215,0,0.1);color:#ffd700;padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,215,0,0.2);}
    .lb-table td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.05);color:#c4a85a;}
    .lb-table tr:hover td{background:rgba(255,215,0,0.05);}
    .lb-rank{font-weight:700;color:#ffd700;}
    .rank-1{color:#ffd700;font-size:16px;}
    .rank-2{color:#c0c0c0;font-size:15px;}
    .rank-3{color:#cd7f32;font-size:14px;}
    .back-btn{background:transparent;border:1px solid rgba(255,215,0,0.3);color:#9a7a3a;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;margin-bottom:16px;}
    .back-btn:hover{border-color:#ffd700;color:#ffd700;}
    </style>
    <div class="td-wrap">
      <div class="td-header">
        <div class="td-title">⚔️ BẢNG QUẢN LÝ GIÁO VIÊN</div>
        <div class="td-sub">Xin chào, ${name} | <span style="cursor:pointer;color:#cc4444;" onclick="location.reload()">Đăng xuất</span></div>
      </div>

      <div class="td-section">
        <div class="td-section-title">➕ TẠO LỚP HỌC MỚI</div>
        <div class="td-create-form">
          <input class="td-inp" id="new-class-name" placeholder="Tên lớp học (VD: Lớp 2A)..."/>
          <button class="td-btn" onclick="createClass(${teacherId})">Tạo lớp &amp; lấy mã</button>
        </div>
        <div class="td-msg" id="create-msg"></div>
      </div>

      <div class="td-section">
        <div class="td-section-title">🏫 CÁC LỚP HỌC CỦA BẠN</div>
        <div class="class-list" id="class-list">
          <div style="color:#5a4a2a;font-size:12px;">Đang tải...</div>
        </div>
      </div>

      <div class="td-section" id="lb-section" style="display:none">
        <div class="td-section-title" id="lb-title">📊 BẢNG XẾP HẠNG</div>
        <div id="lb-content"></div>
      </div>
    </div>`;
  }

  window.createClass = async function(teacherId){
    const name = document.getElementById('new-class-name')?.value.trim();
    const msg  = document.getElementById('create-msg');
    if(!name){ msg.textContent='❌ Vui lòng nhập tên lớp!'; msg.style.color='#ff6666'; return; }

    const res = await fetch('/api/teacher/create-class', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({teacher_id:teacherId, class_name:name})
    }).then(r=>r.json()).catch(()=>({error:'Lỗi kết nối'}));

    if(res.error){ msg.textContent='❌ '+res.error; msg.style.color='#ff6666'; return; }
    msg.textContent = `✅ Đã tạo lớp "${res.class_name}" — Mã lớp: ${res.class_code} (chia sẻ cho học sinh)`;
    msg.style.color='#88ff88';
    document.getElementById('new-class-name').value='';
    loadTeacherClasses(teacherId);
  };

  window.loadTeacherClasses = async function(teacherId){
    const el = document.getElementById('class-list');
    if(!el) return;
    const rows = await fetch(`/api/teacher/classes/${teacherId}`).then(r=>r.json()).catch(()=>[]);
    if(!rows.length){ el.innerHTML='<div style="color:#5a4a2a;font-size:12px;">Chưa có lớp nào. Hãy tạo lớp đầu tiên!</div>'; return; }
    el.innerHTML = rows.map(c=>`
      <div class="class-card" onclick="loadLeaderboard('${c.class_code}','${c.class_name}')">
        <div class="class-code">${c.class_code}</div>
        <div class="class-name">${c.class_name}</div>
        <div class="class-count">📅 ${new Date(c.created_at).toLocaleDateString('vi-VN')}</div>
      </div>`).join('');
  };

  window.loadLeaderboard = async function(code, className, isParent=false){
    const section = document.getElementById('lb-section');
    const content = document.getElementById('lb-content');
    const title   = document.getElementById('lb-title');
    if(!section) return;

    section.style.display='';
    title.textContent = `📊 BẢNG XẾP HẠNG — ${className||code}`;
    content.innerHTML = '<div style="color:#5a4a2a;font-size:12px;">Đang tải...</div>';

    const rows = await fetch(`/api/teacher/leaderboard/${code}`).then(r=>r.json()).catch(()=>[]);
    if(!rows.length){ content.innerHTML='<div style="color:#5a4a2a;font-size:12px;">Chưa có học sinh nào trong lớp này.</div>'; return; }

    const medals=['🥇','🥈','🥉'];
    content.innerHTML = `
      <table class="lb-table">
        <thead><tr>
          <th>#</th><th>Họ tên</th><th>Tài khoản</th>
          <th>Năm sinh</th><th>Cấp độ</th><th>EXP</th><th>Xu</th><th>Cập nhật</th>
        </tr></thead>
        <tbody>
        ${rows.map((r,i)=>{
          const stats = typeof r.stats==='string' ? JSON.parse(r.stats||'{}') : (r.stats||{});
          const medal = i<3 ? medals[i] : (i+1);
          return `<tr>
            <td class="lb-rank ${i<3?'rank-'+(i+1):''}">${medal}</td>
            <td><strong>${r.name}</strong></td>
            <td style="color:#7a6a3a">${r.username}</td>
            <td>${r.birth_year||'—'}</td>
            <td>⭐ Lv${r.level}</td>
            <td>✨ ${r.exp.toLocaleString()}</td>
            <td>🪙 ${r.gold.toLocaleString()}</td>
            <td style="font-size:11px;color:#5a4a2a">${r.updated_at?new Date(r.updated_at).toLocaleDateString('vi-VN'):'—'}</td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>`;
    section.scrollIntoView({behavior:'smooth'});
  };

  // Phụ huynh xem bảng xếp hạng riêng
  function showLeaderboard(rows, code, isParent){
    const ls = document.getElementById('login-screen');
    const medals=['🥇','🥈','🥉'];
    ls.innerHTML = `
    <style>
      .ph-wrap{max-width:800px;margin:0 auto;padding:20px;font-family:'Times New Roman',serif;color:#d4b86a;}
      .ph-title{font-size:20px;letter-spacing:3px;color:#ffd700;font-family:'Cinzel',serif;text-align:center;margin-bottom:4px;}
      .ph-sub{text-align:center;font-size:13px;color:#9a7a3a;margin-bottom:20px;}
      .lb-table{width:100%;border-collapse:collapse;font-size:14px;}
      .lb-table th{background:rgba(255,215,0,0.1);color:#ffd700;padding:10px;text-align:left;border-bottom:1px solid rgba(255,215,0,0.2);}
      .lb-table td{padding:10px;border-bottom:1px solid rgba(255,255,255,0.05);color:#c4a85a;}
      .lb-table tr:hover td{background:rgba(255,215,0,0.05);}
      .back-btn{background:transparent;border:1px solid rgba(255,215,0,0.3);color:#9a7a3a;padding:8px 18px;border-radius:4px;cursor:pointer;font-size:13px;margin-bottom:18px;display:block;width:fit-content;}
      .back-btn:hover{border-color:#ffd700;color:#ffd700;}
    </style>
    <div class="ph-wrap">
      <button class="back-btn" onclick="location.reload()">← Quay lại</button>
      <div class="ph-title">⚔️ BẢNG XẾP HẠNG LỚP</div>
      <div class="ph-sub">Mã lớp: <strong style="color:#ffd700;letter-spacing:3px">${code}</strong> — ${rows.length} học sinh</div>
      ${rows.length===0 ? '<div style="text-align:center;color:#5a4a2a">Chưa có học sinh nào trong lớp này.</div>' : `
      <table class="lb-table">
        <thead><tr><th>#</th><th>Họ tên</th><th>Cấp độ</th><th>EXP</th><th>Xu</th></tr></thead>
        <tbody>
        ${rows.map((r,i)=>`<tr>
          <td style="font-size:${i<3?18:14}px">${i<3?medals[i]:i+1}</td>
          <td><strong>${r.name}</strong></td>
          <td>⭐ Lv${r.level}</td>
          <td>✨ ${r.exp.toLocaleString()}</td>
          <td>🪙 ${r.gold.toLocaleString()}</td>
        </tr>`).join('')}
        </tbody>
      </table>`}
    </div>`;
  }

  // ══════════════════════════════════════════
  // VÀO GAME — Học sinh
  // ══════════════════════════════════════════
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
    if(typeof updateHUD==='function') updateHUD();
    const msg = loaded ? `⚔️ Chào mừng trở lại, ${displayName}!` : `⚔️ Chào mừng, ${displayName}!`;
    setTimeout(()=>{ if(typeof showNotif==='function') showNotif(msg); }, 300);
    window.addEventListener('beforeunload', ()=>{ window.saveGameData(); });
  }

  // ══════════════════════════════════════════
  // SAVE / LOAD GAME
  // ══════════════════════════════════════════
  function _getGameData(){
    return {
      gold  : typeof coins       !=='undefined'?coins:0,
      exp   : typeof playerXP    !=='undefined'?playerXP:0,
      level : typeof playerLevel !=='undefined'?playerLevel:1,
      hp    : typeof playerHP    !=='undefined'?playerHP:100,
      inventory:{
        potions  : typeof potions!=='undefined'?potions:{},
        weapons  : typeof weapons!=='undefined'?weapons.map(w=>({id:w.id,owned:!!w.owned})):[],
        armors   : typeof armors !=='undefined'?armors.map(a=>({id:a.id,owned:!!a.owned})):[],
        equippedMeleeId: typeof equippedMelee!=='undefined'&&equippedMelee?equippedMelee.id:null,
        equippedMagicId: typeof equippedMagic!=='undefined'&&equippedMagic?equippedMagic.id:null,
        equippedArmorId: typeof equippedArmor!=='undefined'&&equippedArmor?equippedArmor.id:null,
      },
      flags:{
        hacLongUnlocked: typeof hacLongUnlocked!=='undefined'?hacLongUnlocked:false,
        thuLongUnlocked: typeof thuLongUnlocked!=='undefined'?thuLongUnlocked:false,
        inOcean:         typeof inOcean        !=='undefined'?inOcean:false,
      },
      stats: typeof learnStats!=='undefined'?learnStats:{}
    };
  }

  window.saveGameData = async function(){
    if(!window._currentUserId) return;
    try { await window.API.saveGame(window._currentUserId, _getGameData()); }
    catch(e){ console.warn('saveGameData error:',e); }
  };

  window.loadGameData = async function(userId){
    try {
      const gd = await window.API.loadGame(userId);
      if(!gd) return false;
      if(typeof coins      !=='undefined') coins      = gd.gold  ||0;
      if(typeof playerXP   !=='undefined') playerXP   = gd.exp   ||0;
      if(typeof playerLevel!=='undefined') playerLevel= gd.level ||1;
      if(typeof playerHP   !=='undefined') playerHP   = gd.hp    ||100;
      const inv=gd.inventory||{};
      if(inv.potions&&typeof potions!=='undefined'){ potions.hp=inv.potions.hp||0; potions.mana=inv.potions.mana||0; }
      if(inv.weapons&&typeof weapons!=='undefined') inv.weapons.forEach(ow=>{ const w=weapons.find(x=>x.id===ow.id); if(w) w.owned=ow.owned; });
      if(inv.armors &&typeof armors !=='undefined') inv.armors.forEach(oa=>{ const a=armors.find(x=>x.id===oa.id); if(a) a.owned=oa.owned; });
      if(inv.equippedMeleeId&&typeof weapons!=='undefined'){ const w=weapons.find(x=>x.id===inv.equippedMeleeId); if(w){equippedMelee=w;equippedWpn=w;} }
      if(inv.equippedMagicId&&typeof weapons!=='undefined'){ const w=weapons.find(x=>x.id===inv.equippedMagicId); if(w) equippedMagic=w; }
      if(inv.equippedArmorId&&typeof armors !=='undefined'){ const a=armors.find(x=>x.id===inv.equippedArmorId); if(a) equippedArmor=a; }
      const fl=gd.flags||{};
      if(typeof hacLongUnlocked!=='undefined') hacLongUnlocked=fl.hacLongUnlocked||false;
      if(typeof thuLongUnlocked!=='undefined') thuLongUnlocked=fl.thuLongUnlocked||false;
      if(gd.stats&&typeof learnStats!=='undefined') Object.assign(learnStats,gd.stats);
      return true;
    } catch(e){ console.warn('loadGameData error:',e); return false; }
  };

  // Tự động lưu mỗi 30 giây
  setInterval(()=>{ window.saveGameData(); }, 30000);

  // ── API register mở rộng ─────────────────
  window.API = window.API || {};
  const _origRegister = window.API.register;
  window.API.register = async function(username, password, displayName, class_code, birth_year, phone){
    try {
      const res = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username, password, displayName, class_code, birth_year, phone})
      });
      return await res.json();
    } catch(e){ return {error:'Không thể kết nối server'}; }
  };

  // Keyboard shortcuts
  document.getElementById('lg-pass')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  document.getElementById('lg-user')?.addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('lg-pass')?.focus(); });
  document.getElementById('tc-pass')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doTeacherLogin(); });
  document.getElementById('rg-pass2')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doRegister(); });
  document.getElementById('ph-class')?.addEventListener('keydown', e=>{ if(e.key==='Enter') doParentView(); });
})();