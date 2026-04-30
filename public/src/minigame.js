// ══════════════════════════════════════════════════════════════════════
// MINIGAME SYSTEM — Cổng Vào Boss
// Hắc Long:  bấm cổng lâu đài ban đêm → Cờ Vua → xuất hiện boss → Battle
// Hỏa Long:  tầng 9 xong → cổng lửa → Mật Mã → tầng 10 boss → Battle
// Thủy Long: tầng 9 ocean xong → Cờ Caro → tầng 10 ocean → Battle
// ══════════════════════════════════════════════════════════════════════

// ── State flags ───────────────────────────────────────────────────────
// (khai báo ở đầu file dòng ~7616)

// ── Castle gate proximity (thêm vào updatePhysics) ───────────────────
// Được gọi trong updatePhysics; castleMidX ~ (HELL_START+HELL_END)/2
const _origUpdatePhysics = window.updatePhysics || null;
// Patch: sau updatePhysics gọi thêm _checkCastleGate
const _castleGateX = (HELL_START + HELL_END) / 2;
function _checkCastleGate(){
  if(inOcean || gameState !== 'WORLD') { _nearCastleGate=false; return; }
  const dist = Math.abs(P.x + P.w/2 - _castleGateX);
  _nearCastleGate = dist < 120;
}

// Patch updatePhysics để gọi thêm _checkCastleGate
(function(){
  const _orig = updatePhysics;
  updatePhysics = function(){
    _orig();
    _checkCastleGate();
  };
})();

// Patch interact() để xử lý cổng lâu đài
(function(){
  const _orig = interact;
  interact = function(){
    // Cổng lâu đài ban đêm — chỉ khi chưa unlock
    if(gameState==='WORLD' && _nearCastleGate && isNightTime() && !hacLongUnlocked){
      _showBossDialog(
        '🏰 CỔNG LÂU ĐÀI BÓNG TỐI',
        'Tiếng rít của Hắc Long vang vọng từ bên trong... "Ngươi dám đến đây? Hãy chứng minh bản thân qua bàn cờ — ta sẽ chờ ngươi!"',
        '♟ VÀO ĐẤU CỜ VUA',
        () => openMinigame('chess',
        () => { // thắng cờ vua
            hacLongUnlocked = true;
            const db = monsters.find(m=>m.id==='dragon_boss');
            if(db){
              db.alive = true;
              db.hp = db.maxHp;
              db.deathTime = 0;
              db.wy = GND - GRASS_H - 175;
            }
            showNotif('🐉 HẮC LONG VƯƠNG xuất hiện! Hãy đến lâu đài ban đêm để chiến đấu!');
          },
          () => showNotif('♟ Bạn thua cờ vua... Hắc Long cười khẩy.')
        )
      );
      return;
    }
    _orig();
  };
})();



// Biến dùng để chặn door ocean floor 9→10
window._oceanDoor9BlockHandled = false;

// Patch đoạn advance ocean floor: gọi hàm này thay vì code inline
function _tryAdvanceOceanFloor(){
  if(oceanFloor === 9 && oceanFloorCleared && !thuLongUnlocked){
    // Chặn lại — hiện thoại
    if(!window._oceanDoor9BlockHandled){
      window._oceanDoor9BlockHandled = true;
      _showBossDialog(
        '🌊 CỔNG TẦNG 10 ĐẠI DƯƠNG',
        'Sóng cuộn dữ dội... Thủy Long Vương đang chờ ở tầng sâu nhất. Hãy chứng tỏ tài năng qua bàn cờ caro trước khi đối mặt với Ngài!',
        '🎯 VÀO ĐẤU CỜ CARO',
        () => openMinigame('caro',
          () => { // thắng
            thuLongUnlocked = true;
            window._oceanDoor9BlockHandled = false;
            // Advance floor thật sự
            oceanFloor++; oceanFloorCleared=false; oceanBattleActive=false;
            const nf=oceanChallengeFloors[oceanFloor-1];
            if(nf) nf.monster.hp=nf.monster.maxHp;
            showNotif('🌊 Tầng 10/10 — Thủy Long Vương đang chờ!');
          },
          () => { window._oceanDoor9BlockHandled = false; showNotif('🌊 Bạn thua cờ caro... Thử lại đi!'); }
        )
      );
    }
    return; // không advance
  }
  // Các trường hợp khác — advance bình thường
  if(oceanFloor < 10){
    oceanFloor++; oceanFloorCleared=false; oceanBattleActive=false;
    const nf=oceanChallengeFloors[oceanFloor-1];
    if(nf) nf.monster.hp=nf.monster.maxHp;
    showNotif('🌊 Tầng '+oceanFloor+'/10 — '+(nf?nf.name:''));
  } else {
    exitOceanWorld(); showNotif('🏆 Chinh phục Đại Dương! +500 xu!'); coins+=500; updateHUD();
  }
}

// Patch _advanceUGFloor để chặn lòng đất tầng 9→10
(function(){
  const _orig = _advanceUGFloor;
  _advanceUGFloor = function(){
    if(undergroundFloor === 9 && !hoaLongUnlocked){
      _showBossDialog(
        '🔥 CỔNG ĐỊA NGỤC — TẦNG 10',
        'Một cánh cổng khổng lồ bằng đá đen, họa tiết lửa bao quanh rừng rực... Hỏa Long Vương rít lên: "Trước khi vào, hãy giải mật mã này — nếu không ngươi sẽ tan thành tro!"',
        '🔐 GIẢI MẬT MÃ',
        () => openMinigame('sudoku',
          () => { // thắng
            hoaLongUnlocked = true;
            _orig(); // advance thật — vào tầng 10
            showNotif('🔥 Cổng địa ngục mở! HỎA LONG VƯƠNG đang chờ!');
          },
          () => showNotif('🔐 Sai mật mã... Hỏa Long cười lửa.')
        )
      );
      return;
    }
    _orig();
  };
})();

// ── Dialog helper — hoạt động trong cả WORLD và CAVE/UNDERGROUND ─────
function _showBossDialog(title, text, btnLabel, onConfirm){
  // Tạo overlay riêng nếu chưa có
  let ov = document.getElementById('_boss-dialog-ov');
  if(!ov){
    ov = document.createElement('div');
    ov.id = '_boss-dialog-ov';
    ov.style.cssText = 'position:fixed;inset:0;z-index:19999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.82);';
    document.body.appendChild(ov);
  }
  ov.innerHTML = `
    <div style="max-width:480px;width:90%;background:linear-gradient(135deg,#0e0814,#1a0e28);border:2px solid #5a2a8a;border-radius:8px;padding:24px 28px;font-family:'Times New Roman',serif;color:#d0b8f0;box-shadow:0 0 40px rgba(120,0,200,0.4);">
      <div style="font-size:15px;font-weight:700;letter-spacing:2px;color:#cc88ff;margin-bottom:12px;text-align:center;">${title}</div>
      <div id="_bdtxt" style="font-size:13px;line-height:1.65;color:#b0a0d0;margin-bottom:20px;min-height:60px;"></div>
      <div style="display:flex;gap:10px;">
        <button id="_bdyes" style="flex:1;padding:11px;background:linear-gradient(135deg,#4a0088,#7700cc);border:1.5px solid #aa44ff;border-radius:4px;color:#f0d8ff;font-size:13px;letter-spacing:2px;cursor:pointer;font-family:inherit;">${btnLabel}</button>
        <button id="_bdno"  style="flex:0 0 auto;padding:11px 16px;background:rgba(40,20,60,0.8);border:1px solid #3a1a5a;border-radius:4px;color:#7a5a9a;font-size:12px;cursor:pointer;font-family:inherit;">✕ Chưa sẵn sàng</button>
      </div>
    </div>`;
  ov.style.display = 'flex';
  const prevState = gameState;
  gameState = 'DIALOG';
  // Typing effect
  const txtEl = document.getElementById('_bdtxt');
  let i = 0; clearInterval(window._typingInt2);
  window._typingInt2 = setInterval(()=>{ if(i<text.length){txtEl.textContent+=text[i++];}else{clearInterval(window._typingInt2);} }, 18);
  document.getElementById('_bdyes').onclick = ()=>{
    ov.style.display = 'none';
    gameState = prevState;
    onConfirm();
  };
  document.getElementById('_bdno').onclick = ()=>{
    ov.style.display = 'none';
    gameState = prevState;
  };
}

// ── Open Minigame ─────────────────────────────────────────────────────
function openMinigame(type, onWin, onLose){
  _mgPendingBoss = { type, onWin, onLose };
  const overlay = document.getElementById('minigame-overlay');
  const inner   = document.getElementById('minigame-inner');
  const title   = document.getElementById('minigame-title');
  const hint    = document.getElementById('minigame-hint');

  overlay.style.background = type==='chess' ? '#06040a'
    : type==='caro' ? '#000c1a' : '#0d0805';

  if(type==='chess'){
    title.textContent = '♟ CỜ VUA — THÁCH ĐẤU HẮC LONG';
    hint.textContent  = 'Thắng cờ vua để Hắc Long Vương xuất hiện';
  } else if(type==='caro'){
    title.textContent = '🌊 CỜ CARO — THÁCH ĐẤU THỦY LONG';
    hint.textContent  = 'Thắng cờ caro để vào tầng 10 đại dương';
  } else {
    title.textContent = '🔢 Ô SỐ SUDOKU — MỞ CỔNG ĐỊA NGỤC';
    hint.textContent  = 'Hoàn thành Sudoku để vào tầng 10 lòng đất';
  }

  inner.innerHTML = _buildMinigameHTML(type);
  overlay.classList.add('on');
  gameState = 'MINIGAME';

  // Init game sau khi DOM render
  setTimeout(()=>{ _initMG(type); }, 80);
}

function closeMinigame(won){
  // Dừng timer Sudoku
  if(typeof _sdkTimerInt!=='undefined'&&_sdkTimerInt){clearInterval(_sdkTimerInt);_sdkTimerInt=null;}
  if(typeof _sdkFireInt !=='undefined'&&_sdkFireInt ){clearInterval(_sdkFireInt);_sdkFireInt=null;}
  if(typeof _sdkOver   !=='undefined') _sdkOver=true;
  const overlay = document.getElementById('minigame-overlay');
  if(overlay) overlay.classList.remove('on');
  const inner=document.getElementById('minigame-inner');
  if(inner) inner.innerHTML='';
  if(typeof undergroundActive!=='undefined'&&undergroundActive) gameState='UNDERGROUND';
  else gameState='WORLD';
  if(!_mgPendingBoss) return;
  const { onWin, onLose } = _mgPendingBoss;
  _mgPendingBoss = null;
  if(won && typeof onWin === 'function') onWin();
  else if(!won && typeof onLose === 'function') onLose();
}

// ── Build HTML nội dung minigame ──────────────────────────────────────
function _buildMinigameHTML(type){
  if(type==='chess')  return _chessHTML();
  if(type==='caro')   return _caroHTML();
  if(type==='cipher') return _cipherHTML();
  if(type==='sudoku') return typeof _sudokuHTML==='function'?_sudokuHTML():'<div style="color:#fff;padding:40px;text-align:center">⏳ Đang tải Sudoku...</div>';
  return '';
}

// ─────────────────────────────────────────────────────────────────────
// CỜ VUA (Hắc Long)
// ─────────────────────────────────────────────────────────────────────
function _chessHTML(){
  return `<style>
.mg-layout{display:flex;height:100%;min-height:500px;background:#06040a;font-family:'Times New Roman',serif;color:#d0c0e8;}
.mg-side{width:180px;background:rgba(10,5,18,0.97);border-right:1px solid #2a1a44;padding:16px 12px;display:flex;flex-direction:column;gap:10px;flex-shrink:0;}
.mg-main{flex:1;display:flex;align-items:center;justify-content:center;padding:16px;}
.mg-title{font-size:13px;font-weight:700;letter-spacing:3px;color:#cc88ff;text-align:center;border-bottom:1px solid #2a1a44;padding-bottom:8px;}
.mg-dragon{font-size:32px;text-align:center;animation:mgFloat 3s ease-in-out infinite;}
@keyframes mgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.mg-status{padding:6px 10px;border-radius:3px;font-size:10px;letter-spacing:1px;text-align:center;border:1px solid #2a1a44;}
.mg-status.your-turn{border-color:#44ff88;color:#44ff88;background:rgba(68,255,136,0.08);}
.mg-status.dragon-turn{border-color:#cc44ff;color:#cc44ff;background:rgba(180,60,255,0.08);animation:mgPulse .8s infinite alternate;}
.mg-status.check{border-color:#ff3333;color:#ff3333;}
.mg-status.game-over{border-color:#ffd700;color:#ffd700;}
@keyframes mgPulse{from{opacity:1}to{opacity:.5}}
.mg-cap-label{font-size:8px;color:#5a3a7a;letter-spacing:1px;}
.mg-cap{display:flex;flex-wrap:wrap;gap:2px;min-height:20px;font-size:12px;padding:3px;background:rgba(0,0,0,0.3);border:1px solid #1a0a28;border-radius:2px;}
.mg-log{flex:1;overflow-y:auto;max-height:160px;display:flex;flex-direction:column;gap:2px;}
.mg-log-e{font-size:9px;color:#7a5a9a;padding:2px 0;border-bottom:1px solid rgba(40,20,60,0.5);}
.mg-log-e.w{color:#b0a0d0;}.mg-log-e.b{color:#aa66ff;}.mg-log-e.ev{color:#ff8888;font-style:italic;}
.mg-btn{background:linear-gradient(135deg,#200040,#3a0060);border:1.5px solid #7700cc;border-radius:3px;color:#cc88ff;font-size:10px;letter-spacing:2px;padding:8px;cursor:pointer;text-transform:uppercase;width:100%;}
.mg-btn:hover{background:rgba(120,0,200,0.35);}
.chess-board{display:grid;grid-template-columns:repeat(8,52px);grid-template-rows:repeat(8,52px);border:3px solid #3a1a5a;box-shadow:0 0 40px rgba(120,0,200,0.3);}
.cs{width:52px;height:52px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background .1s;}
.cs.light{background:#d4c4f0;}.cs.dark{background:#3a2060;}
.cs.sel{background:rgba(170,68,255,0.6)!important;box-shadow:inset 0 0 0 3px #aa44ff;}
.cs.mv::after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:rgba(68,255,136,0.45);border:2px solid rgba(68,255,136,0.8);z-index:2;pointer-events:none;}
.cs.mv.hp::after{content:'';position:absolute;inset:3px;border-radius:2px;background:transparent;border:3px solid rgba(255,160,0,0.7);width:auto;height:auto;}
.cs.chk{background:rgba(255,40,40,0.55)!important;}
.cs.wc{animation:wg .5s ease-in-out infinite alternate;}
@keyframes wg{from{background:rgba(255,210,50,0.15)!important}to{background:rgba(255,210,50,0.35)!important}}
/* Quân cờ: dùng data-side để tô màu nền badge rõ ràng */
.csp{font-size:26px;position:relative;z-index:3;user-select:none;line-height:1;
  width:36px;height:36px;display:flex;align-items:center;justify-content:center;
  border-radius:4px;transition:transform .1s;}
.csp[data-side="w"]{
  background:linear-gradient(135deg,#fff8dc,#ffe066);
  box-shadow:0 2px 6px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.8);
  filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8));
  color:#1a0a00;text-shadow:none;}
.csp[data-side="b"]{
  background:linear-gradient(135deg,#2d0060,#5500aa);
  box-shadow:0 2px 6px rgba(0,0,0,0.8),inset 0 1px 0 rgba(180,100,255,0.3);
  filter:drop-shadow(0 0 4px rgba(180,60,255,0.5));
  color:#f0d0ff;text-shadow:0 0 6px rgba(220,100,255,0.8);}
.chess-win{display:none;position:absolute;inset:0;background:rgba(0,0,0,.88);z-index:20;align-items:center;justify-content:center;flex-direction:column;gap:10px;}
.chess-win.show{display:flex;}
.chess-win-msg{font-size:18px;letter-spacing:3px;text-align:center;color:#ffd700;}
.diff-row{display:flex;gap:4px;}
.diff-btn{flex:1;padding:4px;background:rgba(20,10,30,.8);border:1px solid #2a1a44;border-radius:2px;color:#7a5a9a;font-size:8px;cursor:pointer;letter-spacing:1px;text-align:center;}
.diff-btn.act{border-color:#aa44ff;color:#cc88ff;background:rgba(100,40,160,.25);}
</style>
<div class="mg-layout">
  <div class="mg-side">
    <div class="mg-title">♟ CỜ VUA BÓ TỐI</div>
    <div class="mg-dragon">🐉</div>
    <div class="mg-status your-turn" id="mg-cs-status">⚔ Lượt của bạn</div>
    <div class="mg-cap-label">Bạn bắt được</div>
    <div class="mg-cap" id="mg-cs-capB"></div>
    <div class="mg-cap-label">Ám Long bắt</div>
    <div class="mg-cap" id="mg-cs-capW"></div>
    <div class="mg-cap-label" style="margin-bottom:3px">Độ khó AI</div>
    <div class="diff-row">
      <div class="diff-btn act" id="mg-d1" onclick="_csSetDiff(1)">DỄ</div>
      <div class="diff-btn" id="mg-d2" onclick="_csSetDiff(2)">VỪA</div>
      <div class="diff-btn" id="mg-d3" onclick="_csSetDiff(3)">KHÓ</div>
    </div>
    <div class="mg-log" id="mg-cs-log"></div>
    <button class="mg-btn" onclick="_csInit()">↺ Ván Mới</button>
  </div>
  <div class="mg-main" style="position:relative;">
    <div style="position:relative;">
      <div class="chess-board" id="mg-cs-board"></div>
      <div class="chess-win" id="mg-cs-win">
        <div class="chess-win-msg" id="mg-cs-winmsg"></div>
        <div style="font-size:11px;color:#9a7ab8;font-style:italic;" id="mg-cs-winsub"></div>
        <button class="mg-btn" style="width:160px;margin-top:6px;" onclick="_csInit()">↺ Chơi lại</button>
      </div>
    </div>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────
// CỜ CARO (Thủy Long)
// ─────────────────────────────────────────────────────────────────────
function _caroHTML(){
  return `<style>
.cr-layout{display:flex;height:100%;min-height:500px;background:#000c1a;font-family:'Times New Roman',serif;color:#b0dff0;}
.cr-side{width:170px;background:rgba(0,8,18,.97);border-right:1px solid rgba(0,120,160,.3);padding:16px 12px;display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
.cr-main{flex:1;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;}
.cr-title{font-size:12px;font-weight:700;letter-spacing:3px;color:#4dcfff;text-align:center;border-bottom:1px solid rgba(0,150,200,.2);padding-bottom:8px;text-shadow:0 0 12px rgba(0,200,255,.5);}
.cr-dragon{font-size:32px;text-align:center;animation:crBob 3s ease-in-out infinite;}
@keyframes crBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.cr-score{display:grid;grid-template-columns:1fr auto 1fr;gap:4px;align-items:center;padding:8px;background:rgba(0,20,40,.8);border:1px solid rgba(0,100,150,.3);border-radius:3px;}
.cr-snum{font-size:22px;font-weight:700;text-align:center;}
.cr-sx{color:#4dcfff;text-shadow:0 0 10px rgba(77,207,255,.5);}
.cr-so{color:#ff6b6b;text-shadow:0 0 10px rgba(255,107,107,.5);}
.cr-status{padding:6px;border-radius:3px;font-size:10px;letter-spacing:1px;text-align:center;border:1px solid;transition:all .3s;}
.cr-status.your{border-color:#4dcfff;color:#4dcfff;background:rgba(77,207,255,.08);}
.cr-status.ai{border-color:#ff6b6b;color:#ff6b6b;background:rgba(255,107,107,.08);animation:crP .8s infinite alternate;}
.cr-status.win{border-color:#ffd166;color:#ffd166;}
@keyframes crP{from{opacity:1}to{opacity:.5}}
.cr-log{flex:1;overflow-y:auto;max-height:160px;display:flex;flex-direction:column;gap:2px;}
.cr-log-e{font-size:8px;color:#3a7a9a;padding:2px 0;border-bottom:1px solid rgba(0,40,60,.4);}
.cr-log-e.x{color:#6ad0f0;}.cr-log-e.o{color:#ff9090;}.cr-log-e.ev{color:#ffd166;font-style:italic;}
.cr-btn{background:linear-gradient(135deg,#001428,#002a4a);border:1.5px solid rgba(0,150,200,.5);border-radius:3px;color:#4dcfff;font-size:10px;letter-spacing:2px;padding:8px;cursor:pointer;text-transform:uppercase;width:100%;}
.cr-btn:hover{background:rgba(0,80,140,.5);}
.caro-board{display:inline-grid;gap:0;border:2px solid rgba(0,120,180,.5);box-shadow:0 0 30px rgba(0,160,220,.2);background:rgba(0,20,40,.9);}
.cc{width:36px;height:36px;border:1px solid rgba(0,80,120,.4);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .1s;position:relative;}
.cc:hover:not(.tk){background:rgba(0,150,200,.15);}
.cc.cx-c .cm::before{content:'';position:absolute;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(150,240,255,.9),rgba(77,207,255,.7) 60%,transparent);box-shadow:0 0 6px rgba(77,207,255,.6);}
.cc.co-c .cm::before{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:transparent;border:3.5px solid rgba(255,100,100,.85);box-shadow:0 0 6px rgba(255,107,107,.5);}
.cc.wc-c{animation:crWin .5s ease-in-out infinite alternate;}
@keyframes crWin{from{background:rgba(255,210,50,.1)}to{background:rgba(255,210,50,.3)}}
.cm{width:100%;height:100%;display:flex;align-items:center;justify-content:center;animation:crPop .2s cubic-bezier(.175,.885,.32,1.275);}
@keyframes crPop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.cr-win-ov{display:none;position:absolute;inset:0;background:rgba(0,10,20,.9);z-index:20;align-items:center;justify-content:center;flex-direction:column;gap:8px;}
.cr-win-ov.show{display:flex;}
.cr-win-msg{font-size:18px;letter-spacing:3px;text-align:center;}
</style>
<div class="cr-layout">
  <div class="cr-side">
    <div class="cr-title">🌊 CỜ CARO ĐẠI DƯƠNG</div>
    <div class="cr-dragon">🐉</div>
    <div class="cr-score">
      <div style="text-align:center"><div style="font-size:8px;color:#5a9ab8;margin-bottom:2px;">BẠN</div><div class="cr-snum cr-sx" id="mg-cr-sx">0</div></div>
      <div style="font-size:10px;color:#3a6a80;letter-spacing:2px;">VS</div>
      <div style="text-align:center"><div style="font-size:8px;color:#5a9ab8;margin-bottom:2px;">HẢI LONG</div><div class="cr-snum cr-so" id="mg-cr-so">0</div></div>
    </div>
    <div style="font-size:8px;color:#3a6a80;text-align:center;">Cần <span style="color:#ffd166;">6</span> liên tiếp</div>
    <div class="cr-status your" id="mg-cr-status">💧 Lượt của bạn (X)</div>
    <div class="cr-log" id="mg-cr-log"></div>
    <button class="cr-btn" onclick="_crInit()">↺ Ván Mới</button>
  </div>
  <div class="cr-main">
    <div style="position:relative;">
      <div class="caro-board" id="mg-cr-board"></div>
      <div class="cr-win-ov" id="mg-cr-win">
        <div class="cr-win-msg" id="mg-cr-winmsg"></div>
        <div style="font-size:11px;color:#5a9ab8;font-style:italic;" id="mg-cr-winsub"></div>
        <button class="cr-btn" style="width:160px;margin-top:6px;" onclick="_crInit()">↺ Chơi lại</button>
      </div>
    </div>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────
// MẬT MÃ (Hỏa Long)
// ─────────────────────────────────────────────────────────────────────
function _cipherHTML(){
  return `<style>
.cp-wrap{max-width:740px;margin:0 auto;padding:24px 16px;font-family:'Times New Roman',serif;color:#e8d5a3;}
.cp-title-main{text-align:center;font-size:26px;font-weight:900;background:linear-gradient(135deg,#ff6a00,#ffaa00,#ff4e00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:4px;filter:drop-shadow(0 0 14px rgba(255,100,0,.5));margin-bottom:4px;}
.cp-sub{text-align:center;font-size:13px;color:#a07040;font-style:italic;letter-spacing:2px;margin-bottom:20px;}
.cp-cipher-box{background:linear-gradient(135deg,#1a0e06,#2a1a0a);border:2px solid #5a3010;border-radius:4px;padding:18px 24px;margin-bottom:22px;text-align:center;box-shadow:0 0 30px rgba(255,80,0,.12);}
.cp-cipher-label{font-size:10px;color:#7a4a20;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;}
.cp-cipher-code{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;}
.cp-char{width:48px;height:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#2a1500,#3d2000);border:1.5px solid #6a3510;border-radius:3px;font-size:20px;position:relative;}
.cp-char .ci{position:absolute;bottom:2px;right:3px;font-size:7px;color:#6a4020;}
.cp-cipher-hint{font-size:10px;color:#7a4a20;font-style:italic;}
.cp-sec-title{font-size:12px;letter-spacing:3px;color:#c9940a;text-transform:uppercase;margin-bottom:10px;border-bottom:1px solid #3a2010;padding-bottom:5px;}
.cp-houses{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px;}
.cp-hcard{background:linear-gradient(135deg,var(--h-bg1,#1a1200),var(--h-bg2,#2a2000));border:1.5px solid var(--h-bc,#4a3010);border-radius:4px;padding:10px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.cp-hcard:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.5);border-color:var(--h-hc,#ff6a00);}
.cp-hcard.found{border-color:#22aa44!important;box-shadow:0 0 16px rgba(34,170,68,.25);}
.cp-hcard.found::after{content:'✓';position:absolute;top:5px;right:7px;color:#22aa44;font-size:14px;font-weight:bold;}
.cp-hi{font-size:22px;margin-bottom:4px;}.cp-hn{font-size:10px;letter-spacing:1px;color:#d4a050;margin-bottom:3px;}
.cp-hclue{font-size:9px;color:#7a5030;font-style:italic;line-height:1.4;}
.cp-hans{display:none;margin-top:6px;padding:5px 8px;background:rgba(255,100,0,.12);border:1px solid rgba(255,100,0,.25);border-radius:2px;font-size:16px;color:#ff8844;letter-spacing:3px;text-align:center;}
.cp-hcard.found .cp-hans{display:block;}
.cp-seal{position:absolute;top:0;right:0;width:22px;height:22px;background:linear-gradient(135deg,#3a2010,#5a3018);clip-path:polygon(0 0,100% 0,100% 100%);display:flex;align-items:flex-start;justify-content:flex-end;padding:2px;font-size:8px;}
.cp-ans-sec{background:linear-gradient(135deg,#0e0a04,#1a1208);border:2px solid #5a3010;border-radius:4px;padding:16px;margin-bottom:16px;}
.cp-ans-grid{display:flex;gap:6px;justify-content:center;margin:10px 0;}
.cp-slot{width:44px;height:52px;background:linear-gradient(135deg,#1a0e04,#2a1a08);border:2px solid #4a2a0a;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#ff8844;position:relative;transition:all .3s;}
.cp-slot.filled{border-color:#ff6a00;box-shadow:0 0 10px rgba(255,100,0,.25);}
.cp-slot .sl{position:absolute;bottom:2px;font-size:7px;color:#6a3a10;}
.cp-submit{display:block;width:100%;padding:12px;background:linear-gradient(135deg,#8B0000,#cc2200,#ff4400);border:2px solid #ff6a00;border-radius:3px;font-size:14px;letter-spacing:4px;color:#fff5e0;cursor:pointer;text-transform:uppercase;box-shadow:0 4px 16px rgba(255,80,0,.25);margin-top:10px;}
.cp-submit:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(255,80,0,.4);}
.cp-result{text-align:center;padding:14px;border-radius:4px;margin-top:12px;display:none;}
.cp-result.wrong{background:rgba(200,0,0,.12);border:1px solid #cc0000;color:#ff8888;}
.cp-result.correct{background:rgba(0,200,0,.08);border:1px solid #00cc44;color:#88ff99;}
.cp-result h3{font-size:16px;letter-spacing:2px;margin-bottom:4px;}
.cp-reset-btn{background:transparent;border:1px solid #5a3010;border-radius:3px;color:#7a5030;font-size:11px;padding:4px 12px;cursor:pointer;float:right;margin-top:-3px;}
.cp-reset-btn:hover{border-color:#aa6030;color:#cc8040;}
</style>
<div style="background:#0d0805;min-height:100%;overflow-y:auto;">
<div class="cp-wrap">
  <div class="cp-title-main">🔥 MẬT MÃ RỒNG LỬA</div>
  <div class="cp-sub">Giải mã để mở cánh cửa địa ngục</div>
  <div class="cp-cipher-box">
    <div class="cp-cipher-label">⟨ Mật Mã Bí Ẩn ⟩</div>
    <div class="cp-cipher-code" id="mg-cp-code"></div>
    <div class="cp-cipher-hint">Mỗi biểu tượng chỉ đến một ngôi nhà — tìm đến đó để lấy con số</div>
  </div>
  <div class="cp-sec-title">📍 Các Địa Điểm <button class="cp-reset-btn" onclick="_cpGen()">↺ Tạo mã mới</button></div>
  <div class="cp-houses" id="mg-cp-houses"></div>
  <div class="cp-ans-sec">
    <div class="cp-sec-title">🗝 Nhập Mật Mã</div>
    <div class="cp-ans-grid" id="mg-cp-slots"></div>
    <button class="cp-submit" onclick="_cpCheck()">⚡ Mở Cổng Địa Ngục</button>
    <div class="cp-result" id="mg-cp-result"></div>
  </div>
</div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────
// INIT MINIGAME ENGINE
// ─────────────────────────────────────────────────────────────────────
function _initMG(type){
  if(type==='chess')  _csInit();
  if(type==='caro')   _crInit();
  if(type==='cipher') _cpGen();
  if(type==='sudoku'){
    if(typeof _initSudoku==='function') _initSudoku();
    else if(typeof _sdkSetDiff==='function') _sdkSetDiff(1);
    else if(typeof _sdkNewGame==='function') _sdkNewGame();
  }
}