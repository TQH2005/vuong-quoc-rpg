// ══════════════════════════════════════════════
// LOGIN.JS — Học sinh vào game / Giáo viên xem bảng quản lý
// ══════════════════════════════════════════════
(function(){
  const wrap = document.getElementById('wrap');
  wrap.style.visibility   = 'hidden';
  wrap.style.pointerEvents = 'none';
  window._currentUser   = null;
  window._currentUserId = null;

  // ── Panel helpers ───────────────────────────
  const PANELS = ['lg-role-panel','lg-student-login-panel','lg-student-register-panel',
                  'lg-teacher-login-panel','lg-teacher-register-panel'];
  function hideAll(){ PANELS.forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; }); }
  function show(id){ hideAll(); const el=document.getElementById(id); if(el) el.style.display=''; }

  window.showRolePanel       = ()=>show('lg-role-panel');
  window.showStudentLogin    = ()=>{ show('lg-student-login-panel');    document.getElementById('lg-user')?.focus(); };
  window.showStudentRegister = ()=>{ show('lg-student-register-panel'); document.getElementById('rg-name')?.focus(); };
  window.showTeacherLogin    = ()=>{ show('lg-teacher-login-panel');    document.getElementById('tc-user')?.focus(); };
  window.showTeacherRegister = ()=>{ show('lg-teacher-register-panel'); document.getElementById('tr-name')?.focus(); };
  window.showLogin    = window.showStudentLogin;
  window.showRegister = window.showStudentRegister;
  window.showRoleSelect = window.showRolePanel;
  window.selectRole   = (r)=> r==='teacher' ? showTeacherLogin() : showStudentLogin();

  // ── Msg helpers ─────────────────────────────
  function setMsg(id, msg, ok=false){
    const el=document.getElementById(id); if(!el) return;
    el.textContent=msg; el.className=ok?'lg-msg-ok':'lg-msg-err';
  }
  function clearMsg(id){ const el=document.getElementById(id); if(el){el.textContent='';el.className='lg-msg-err';} }

  // ══════════════════════════════════════════
  // HỌC SINH — Đăng nhập
  // ══════════════════════════════════════════
  window.doLogin = async function(){
    if(window._loginCooldown) return;
    const user = document.getElementById('lg-user')?.value.trim().toLowerCase();
    const pass = document.getElementById('lg-pass')?.value;
    const btn  = document.getElementById('lg-btn');
    clearMsg('lg-err');
    if(!user||!pass) return setMsg('lg-err','❌ Vui lòng nhập đầy đủ thông tin!');
    btn.disabled=true; btn.textContent='⏳ Đang đăng nhập...';
    const res = await window.API.login(user, pass);
    if(res.error){
      setMsg('lg-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='⚔️ VÀO GAME';
      document.getElementById('lg-pass').value='';
      return;
    }
    btn.textContent='✅ ĐANG VÀO...';
    setTimeout(()=>enterGame(res.user_id, user, res.displayName), 500);
  };

  // ══════════════════════════════════════════
  // HỌC SINH — Đăng ký
  // ══════════════════════════════════════════
  window.doRegister = async function(){
    const name   = document.getElementById('rg-name')?.value.trim();
    const born   = document.getElementById('rg-born')?.value;
    const tccode = document.getElementById('rg-tccode')?.value.trim().toUpperCase();
    const user   = document.getElementById('rg-user')?.value.trim().toLowerCase();
    const pass   = document.getElementById('rg-pass')?.value;
    const pass2  = document.getElementById('rg-pass2')?.value;
    const btn    = document.getElementById('rg-btn');
    clearMsg('lg-reg-err'); clearMsg('lg-reg-ok');
    if(!name)               return setMsg('lg-reg-err','❌ Vui lòng nhập họ và tên!');
    if(!tccode)             return setMsg('lg-reg-err','❌ Vui lòng nhập mã giáo viên!');
    if(!user||user.length<3)return setMsg('lg-reg-err','❌ Tên tài khoản tối thiểu 3 ký tự!');
    if(!pass||pass.length<4)return setMsg('lg-reg-err','❌ Mật khẩu tối thiểu 4 ký tự!');
    if(pass!==pass2)        return setMsg('lg-reg-err','❌ Mật khẩu xác nhận không khớp!');
    btn.disabled=true; btn.textContent='⏳ Đang đăng ký...';
    const res = await window.API.register(user, pass, name, tccode, born||null);
    if(res.error){
      setMsg('lg-reg-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='📜 ĐĂNG KÝ';
      return;
    }
    setMsg('lg-reg-ok','✅ Đăng ký thành công! Đang vào game...', true);
    setTimeout(()=>enterGame(res.user_id, user, name), 800);
  };

  // ══════════════════════════════════════════
  // GIÁO VIÊN — Đăng nhập → Dashboard
  // ══════════════════════════════════════════
  window.doTeacherLogin = async function(){
    const user = document.getElementById('tc-user')?.value.trim().toLowerCase();
    const pass = document.getElementById('tc-pass')?.value;
    const btn  = document.getElementById('tc-btn');
    clearMsg('tc-err');
    if(!user||!pass) return setMsg('tc-err','❌ Vui lòng nhập đầy đủ thông tin!');
    btn.disabled=true; btn.textContent='⏳ Đang đăng nhập...';
    const res = await fetch('/api/teacher/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:user, password:pass})
    }).then(r=>r.json()).catch(()=>({error:'Không thể kết nối server'}));
    if(res.error){
      setMsg('tc-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='👨‍🏫 VÀO BẢNG QUẢN LÝ';
      return;
    }
    showTeacherDashboard(res.teacher_id, res.displayName, res.teacher_code);
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
    if(!user||user.length<3)return setMsg('tr-err','❌ Tên tài khoản tối thiểu 3 ký tự!');
    if(!pass||pass.length<6)return setMsg('tr-err','❌ Mật khẩu tối thiểu 6 ký tự!');
    if(pass!==pass2)      return setMsg('tr-err','❌ Mật khẩu không khớp!');
    btn.disabled=true; btn.textContent='⏳ Đang đăng ký...';
    const res = await fetch('/api/teacher/register',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:user, password:pass, displayName:name})
    }).then(r=>r.json()).catch(()=>({error:'Không thể kết nối server'}));
    if(res.error){
      setMsg('tr-err','❌ '+res.error);
      btn.disabled=false; btn.textContent='📋 ĐĂNG KÝ';
      return;
    }
    setMsg('tr-ok',`✅ Đăng ký thành công! Mã GV của bạn: ${res.teacher_code} — Chia sẻ cho học sinh!`, true);
    setTimeout(()=>showTeacherDashboard(res.teacher_id, name, res.teacher_code), 1500);
  };

  // ══════════════════════════════════════════
  // DASHBOARD GIÁO VIÊN
  // ══════════════════════════════════════════
  function showTeacherDashboard(teacherId, displayName, teacherCode){
    document.getElementById('login-screen').innerHTML = `
<style>
#tc-dash{max-width:900px;margin:0 auto;padding:24px 16px;color:#d4b86a;font-family:'Times New Roman',serif;}
.tc-header{text-align:center;margin-bottom:24px;}
.tc-name{font-family:'Cinzel',serif;font-size:22px;color:#ffd700;letter-spacing:3px;margin-bottom:4px;}
.tc-code-box{display:inline-block;background:rgba(255,215,0,0.12);border:2px solid #8B6914;border-radius:8px;padding:10px 24px;margin:10px 0;}
.tc-code-label{font-size:11px;color:#9a7a3a;letter-spacing:2px;margin-bottom:4px;}
.tc-code{font-size:28px;font-weight:700;color:#ffd700;letter-spacing:6px;font-family:'Cinzel',serif;}
.tc-code-hint{font-size:11px;color:#7a5a2a;margin-top:4px;}
.tc-section{background:rgba(0,0,0,0.4);border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:16px;margin-bottom:16px;}
.tc-section-title{font-size:13px;letter-spacing:2px;color:#ffd700;margin-bottom:14px;border-bottom:1px solid rgba(255,215,0,0.15);padding-bottom:6px;}
.tc-table{width:100%;border-collapse:collapse;}
.tc-table th{background:rgba(255,215,0,0.08);color:#ffd700;padding:10px 12px;text-align:left;font-size:12px;letter-spacing:1px;border-bottom:1px solid rgba(255,215,0,0.2);}
.tc-table td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px;color:#c4a85a;}
.tc-table tr:hover td{background:rgba(255,215,0,0.04);cursor:pointer;}
.tc-rank{font-weight:700;font-size:16px;}
.tc-btn-view{background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:4px;color:#ffd700;padding:5px 12px;cursor:pointer;font-size:11px;font-family:'Times New Roman',serif;}
.tc-btn-view:hover{background:rgba(255,215,0,0.2);}
.tc-logout{background:transparent;border:1px solid rgba(200,80,80,0.4);color:#cc6666;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:11px;margin-left:12px;}
.tc-logout:hover{border-color:#cc4444;color:#ff8888;}
.tc-empty{text-align:center;color:#5a4a2a;padding:24px;font-size:13px;}
/* Detail panel */
#tc-detail{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;align-items:center;justify-content:center;}
#tc-detail.show{display:flex;}
.tc-detail-box{background:linear-gradient(135deg,#0a0418,#150830);border:2px solid #7a5820;border-radius:10px;padding:28px 32px;width:min(500px,90vw);max-height:85vh;overflow-y:auto;position:relative;}
.tc-detail-close{position:absolute;top:12px;right:16px;background:transparent;border:none;color:#9a7a3a;font-size:22px;cursor:pointer;}
.tc-detail-name{font-family:'Cinzel',serif;font-size:18px;color:#ffd700;margin-bottom:16px;border-bottom:1px solid rgba(255,215,0,0.2);padding-bottom:10px;}
.tc-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.tc-stat-card{background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:6px;padding:12px;text-align:center;}
.tc-stat-val{font-size:22px;font-weight:700;color:#ffd700;margin-bottom:2px;}
.tc-stat-lbl{font-size:10px;color:#7a5a2a;letter-spacing:1px;}
.tc-progress-section{margin-top:12px;}
.tc-progress-title{font-size:11px;color:#9a7a3a;letter-spacing:2px;margin-bottom:8px;}
.tc-progress-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;}
.tc-progress-key{color:#9a7a3a;}
.tc-progress-val{color:#c4a85a;font-weight:600;}
</style>
<div id="login-screen" style="overflow-y:auto;align-items:flex-start;">
<div id="tc-dash">
  <div class="tc-header">
    <div class="tc-name">⚔️ BẢNG QUẢN LÝ GIÁO VIÊN</div>
    <div style="color:#9a7a3a;font-size:13px;margin-bottom:10px;">Xin chào, <strong style="color:#ffd700">${displayName}</strong>
      <button class="tc-logout" onclick="location.reload()">Đăng xuất</button>
    </div>
    <div class="tc-code-box">
      <div class="tc-code-label">MÃ GIÁO VIÊN CỦA BẠN</div>
      <div class="tc-code">${teacherCode}</div>
      <div class="tc-code-hint">📋 Chia sẻ mã này cho học sinh khi đăng ký tài khoản</div>
    </div>
  </div>

  <div class="tc-section">
    <div class="tc-section-title">📊 DANH SÁCH HỌC SINH (<span id="tc-count">đang tải...</span>)</div>
    <div id="tc-student-list"><div class="tc-empty">⏳ Đang tải danh sách...</div></div>
  </div>
</div>

<!-- DETAIL PANEL -->
<div id="tc-detail">
  <div class="tc-detail-box">
    <button class="tc-detail-close" onclick="document.getElementById('tc-detail').classList.remove('show')">✕</button>
    <div class="tc-detail-name" id="tc-detail-name">Học sinh</div>
    <div class="tc-stat-grid" id="tc-stat-grid"></div>
    <div class="tc-progress-section" id="tc-progress-section"></div>
  </div>
</div>
</div>`;

    loadStudents(teacherCode);
  }

  async function loadStudents(teacherCode){
    const listEl  = document.getElementById('tc-student-list');
    const countEl = document.getElementById('tc-count');
    const rows = await fetch(`/api/teacher/students/${teacherCode}`)
      .then(r=>r.json()).catch(()=>[]);

    if(!rows.length){
      countEl.textContent='0 học sinh';
      listEl.innerHTML='<div class="tc-empty">📭 Chưa có học sinh nào nhập mã của bạn.<br><span style="font-size:11px">Chia sẻ mã GV để học sinh đăng ký!</span></div>';
      return;
    }
    countEl.textContent = rows.length+' học sinh';
    const medals=['🥇','🥈','🥉'];
    listEl.innerHTML=`
      <table class="tc-table">
        <thead><tr>
          <th>#</th><th>Họ tên</th><th>Tài khoản</th>
          <th>Năm sinh</th><th>Cấp độ</th><th>EXP</th><th>Xu</th><th></th>
        </tr></thead>
        <tbody>
        ${rows.map((r,i)=>`<tr onclick="viewStudent(${r.id},'${r.name}')">
          <td class="tc-rank">${i<3?medals[i]:i+1}</td>
          <td><strong>${r.name}</strong></td>
          <td style="color:#7a6a3a;font-size:12px">${r.username}</td>
          <td>${r.birth_year||'—'}</td>
          <td>⭐ Lv${r.level}</td>
          <td>✨ ${Number(r.exp).toLocaleString()}</td>
          <td>🪙 ${Number(r.gold).toLocaleString()}</td>
          <td><button class="tc-btn-view" onclick="event.stopPropagation();viewStudent(${r.id},'${r.name}')">Chi tiết</button></td>
        </tr>`).join('')}
        </tbody>
      </table>`;
  }

  window.viewStudent = async function(userId, name){
    document.getElementById('tc-detail').classList.add('show');
    document.getElementById('tc-detail-name').textContent='⏳ Đang tải...';
    document.getElementById('tc-stat-grid').innerHTML='';
    document.getElementById('tc-progress-section').innerHTML='';

    const r = await fetch(`/api/teacher/student-detail/${userId}`)
      .then(res=>res.json()).catch(()=>null);
    if(!r){ document.getElementById('tc-detail-name').textContent='❌ Lỗi tải dữ liệu'; return; }

    const stats = typeof r.stats==='string' ? JSON.parse(r.stats||'{}') : (r.stats||{});
    document.getElementById('tc-detail-name').textContent='🧑‍🎓 '+r.name;

    document.getElementById('tc-stat-grid').innerHTML=`
      <div class="tc-stat-card"><div class="tc-stat-val">⭐ Lv${r.level}</div><div class="tc-stat-lbl">CẤP ĐỘ</div></div>
      <div class="tc-stat-card"><div class="tc-stat-val">✨ ${Number(r.exp).toLocaleString()}</div><div class="tc-stat-lbl">KINH NGHIỆM</div></div>
      <div class="tc-stat-card"><div class="tc-stat-val">🪙 ${Number(r.gold).toLocaleString()}</div><div class="tc-stat-lbl">XU TÍCH LŨY</div></div>
      <div class="tc-stat-card"><div class="tc-stat-val">❤️ ${r.hp}</div><div class="tc-stat-lbl">MÁU HIỆN TẠI</div></div>`;

    // Thống kê học tập
    const correct = stats.correct||0;
    const wrong   = stats.wrong  ||0;
    const total   = correct+wrong;
    const acc     = total>0 ? Math.round(correct/total*100) : 0;
    const battles = stats.battles||0;
    const updated = r.updated_at ? new Date(r.updated_at).toLocaleString('vi-VN') : '—';

    document.getElementById('tc-progress-section').innerHTML=`
      <div class="tc-progress-title">📚 THỐNG KÊ HỌC TẬP</div>
      <div class="tc-progress-row"><span class="tc-progress-key">✅ Câu trả lời đúng</span><span class="tc-progress-val">${correct}</span></div>
      <div class="tc-progress-row"><span class="tc-progress-key">❌ Câu trả lời sai</span><span class="tc-progress-val">${wrong}</span></div>
      <div class="tc-progress-row"><span class="tc-progress-key">📊 Độ chính xác</span><span class="tc-progress-val">${acc}%</span></div>
      <div class="tc-progress-row"><span class="tc-progress-key">⚔️ Số trận chiến</span><span class="tc-progress-val">${battles}</span></div>
      <div class="tc-progress-row"><span class="tc-progress-key">🎂 Năm sinh</span><span class="tc-progress-val">${r.birth_year||'—'}</span></div>
      <div class="tc-progress-row"><span class="tc-progress-key">🕐 Cập nhật lần cuối</span><span class="tc-progress-val">${updated}</span></div>`;
  };

  // ══════════════════════════════════════════
  // VÀO GAME — Học sinh
  // ══════════════════════════════════════════
  async function enterGame(userId, username, displayName){
    window._currentUser   = username;
    window._currentUserId = userId;
    await window.loadGameData(userId);
    document.getElementById('login-screen').classList.add('off');
    wrap.style.visibility   = 'visible';
    wrap.style.pointerEvents = '';
    window._loginCooldown = true;
    setTimeout(()=>{ window._loginCooldown=false; }, 1500);
    if(typeof updateHUD==='function') updateHUD();
    setTimeout(()=>{ if(typeof showNotif==='function') showNotif('⚔️ Chào mừng, '+displayName+'!'); }, 300);
    window.addEventListener('beforeunload', ()=>{ window.saveGameData(); });
  }

  // ══════════════════════════════════════════
  // SAVE / LOAD
  // ══════════════════════════════════════════
  function _getGameData(){
    return {
      gold : typeof coins       !=='undefined'?coins:0,
      exp  : typeof playerXP    !=='undefined'?playerXP:0,
      level: typeof playerLevel !=='undefined'?playerLevel:1,
      hp   : typeof playerHP    !=='undefined'?playerHP:100,
      inventory:{
        potions: typeof potions!=='undefined'?potions:{},
        weapons: typeof weapons!=='undefined'?weapons.map(w=>({id:w.id,owned:!!w.owned})):[],
        armors : typeof armors !=='undefined'?armors.map(a=>({id:a.id,owned:!!a.owned})):[],
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
    try { await window.API.saveGame(window._currentUserId, _getGameData()); } catch(e){}
  };

  window.loadGameData = async function(userId){
    try {
      const gd = await window.API.loadGame(userId);
      if(!gd||gd.error) return false;
      if(typeof coins       !=='undefined') coins       = gd.gold ||0;
      if(typeof playerXP    !=='undefined') playerXP    = gd.exp  ||0;
      if(typeof playerLevel !=='undefined') playerLevel = gd.level||1;
      if(typeof playerHP    !=='undefined') playerHP    = gd.hp   ||100;
      const inv=gd.inventory||{};
      if(inv.potions&&typeof potions!=='undefined'){ potions.hp=inv.potions.hp||0; potions.mana=inv.potions.mana||0; }
      if(inv.weapons&&typeof weapons!=='undefined') inv.weapons.forEach(ow=>{const w=weapons.find(x=>x.id===ow.id);if(w)w.owned=ow.owned;});
      if(inv.armors &&typeof armors !=='undefined') inv.armors.forEach(oa=>{const a=armors.find(x=>x.id===oa.id);if(a)a.owned=oa.owned;});
      if(inv.equippedMeleeId&&typeof weapons!=='undefined'){const w=weapons.find(x=>x.id===inv.equippedMeleeId);if(w){equippedMelee=w;equippedWpn=w;}}
      if(inv.equippedMagicId&&typeof weapons!=='undefined'){const w=weapons.find(x=>x.id===inv.equippedMagicId);if(w)equippedMagic=w;}
      if(inv.equippedArmorId&&typeof armors !=='undefined'){const a=armors.find(x=>x.id===inv.equippedArmorId);if(a)equippedArmor=a;}
      const fl=gd.flags||{};
      if(typeof hacLongUnlocked!=='undefined') hacLongUnlocked=fl.hacLongUnlocked||false;
      if(typeof thuLongUnlocked!=='undefined') thuLongUnlocked=fl.thuLongUnlocked||false;
      if(gd.stats&&typeof learnStats!=='undefined') Object.assign(learnStats,gd.stats);
      return true;
    } catch(e){ return false; }
  };

  setInterval(()=>{ window.saveGameData(); }, 30000);

  // Patch API.register để nhận teacher_code
  window.API = window.API || {};
  window.API.register = async function(username, password, displayName, teacher_code, birth_year){
    try {
      const res = await fetch('/api/auth/register',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username, password, displayName, teacher_code, birth_year})
      });
      return await res.json();
    } catch(e){ return {error:'Không thể kết nối server'}; }
  };

  // Keyboard shortcuts
  document.getElementById('lg-pass')  ?.addEventListener('keydown',e=>{ if(e.key==='Enter') doLogin(); });
  document.getElementById('lg-user')  ?.addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('lg-pass')?.focus(); });
  document.getElementById('tc-pass')  ?.addEventListener('keydown',e=>{ if(e.key==='Enter') doTeacherLogin(); });
  document.getElementById('rg-pass2') ?.addEventListener('keydown',e=>{ if(e.key==='Enter') doRegister(); });
  document.getElementById('rg-tccode')?.addEventListener('input',  e=>{ e.target.value=e.target.value.toUpperCase(); });
})();
