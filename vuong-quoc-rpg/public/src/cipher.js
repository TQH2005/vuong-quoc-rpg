
// ══════════════ MẬT MÃ ENGINE ════════════════════════════════════════
const _CP_HOUSES=[
  {id:'math',name:'Toán Học',icon:'📐',sym:'⚔',bc:'#446',hc:'#6688ff',bg1:'#0a0c1a',bg2:'#141828',clue:'Nơi những con số ẩn sau tường đá xám'},
  {id:'geo',name:'Địa Lý',icon:'🌏',sym:'🌿',bc:'#5a3a10',hc:'#cc8844',bg1:'#1a0c00',bg2:'#2a1800',clue:'Nơi bản đồ thế giới treo trên vách gỗ'},
  {id:'history',name:'Lịch Sử',icon:'🏛️',sym:'💎',bc:'#5a5a20',hc:'#ddcc66',bg1:'#121208',bg2:'#1e1e10',clue:'Nơi câu chuyện ngàn năm được khắc ghi'},
  {id:'literature',name:'Văn Học',icon:'📖',sym:'📜',bc:'#6a4a10',hc:'#ffcc44',bg1:'#120c00',bg2:'#1e1600',clue:'Nơi con chữ bay như ánh nến lung linh'},
  {id:'civic',name:'Công Dân',icon:'🏫',sym:'🛡',bc:'#104060',hc:'#4499cc',bg1:'#000a14',bg2:'#001020',clue:'Nơi lá cờ đỏ phấp phới trước cổng'},
  {id:'english',name:'Tiếng Anh',icon:'🔤',sym:'⚡',bc:'#660010',hc:'#ff4444',bg1:'#120000',bg2:'#1e0000',clue:'Nơi tiếng ngoại bang vang vọng qua hành lang'},
];
let _cpPuzzle=[], _cpAnswers=[], _cpFound=new Set();
function _cpShuffle(a){return [...a].sort(()=>Math.random()-.5);}
function _cpGen(){ _cpFound.clear(); const sel=_cpShuffle(_CP_HOUSES).slice(0,5); _cpPuzzle=sel.map(h=>({...h,answer:Math.floor(Math.random()*9)+1})); _cpAnswers=new Array(5).fill(''); _cpRenderCode(); _cpRenderHouses(); _cpRenderSlots(); const r=document.getElementById('mg-cp-result'); if(r)r.style.display='none'; }
function _cpRenderCode(){ const el=document.getElementById('mg-cp-code'); if(!el)return; el.innerHTML=_cpPuzzle.map((h,i)=>`<div class="cp-char">${h.sym}<span class="ci">${i+1}</span></div>`).join(''); }
function _cpRenderHouses(){ const el=document.getElementById('mg-cp-houses'); if(!el)return; el.innerHTML=_CP_HOUSES.map(h=>{ const pi=_cpPuzzle.findIndex(p=>p.id===h.id); const inP=pi!==-1; return `<div class="cp-hcard${_cpFound.has(h.id)?' found':''}" id="mg-hc-${h.id}" style="--h-bg1:${h.bg1};--h-bg2:${h.bg2};--h-bc:${h.bc};--h-hc:${h.hc}" onclick="${inP?`_cpReveal('${h.id}')`:''}"><div class="cp-seal">${inP?_cpPuzzle[pi].sym:'❓'}</div><div class="cp-hi">${h.icon}</div><div class="cp-hn">${h.name}</div><div class="cp-hclue">${inP?h.clue:'Không có manh mối...'}</div>${inP?`<div class="cp-hans" id="mg-ha-${h.id}">— ${_cpPuzzle[pi].answer} —</div>`:''}</div>`; }).join(''); }
function _cpReveal(id){ if(_cpFound.has(id))return; _cpFound.add(id); const card=document.getElementById('mg-hc-'+id); if(card)card.classList.add('found'); const pi=_cpPuzzle.findIndex(p=>p.id===id); if(pi!==-1){ _cpAnswers[pi]=_cpPuzzle[pi].answer; _cpUpdateSlot(pi); } }
function _cpUpdateSlot(i){ const slot=document.getElementById('mg-slot-'+i); if(slot){slot.textContent=_cpAnswers[i]||'';const lbl=slot.querySelector('.sl');if(lbl)lbl.textContent=_cpPuzzle[i].sym;if(_cpAnswers[i])slot.classList.add('filled');else slot.classList.remove('filled');} }
function _cpRenderSlots(){ const el=document.getElementById('mg-cp-slots'); if(!el)return; el.innerHTML=_cpPuzzle.map((h,i)=>`<div class="cp-slot${_cpAnswers[i]?' filled':''}" id="mg-slot-${i}">${_cpAnswers[i]||''}<span class="sl">${h.sym}</span></div>`).join(''); }
function _cpCheck(){ const allFilled=_cpAnswers.every(a=>a!==''); if(!allFilled){_cpShowResult(false,'Chưa tìm đủ manh mối! Hãy ghé thăm tất cả địa điểm.');return;} const code=_cpAnswers.join(''); const correct=_cpPuzzle.map(p=>p.answer).join(''); if(code===correct){_cpShowResult(true,'🔥 MẬT MÃ CHÍNH XÁC! Cổng địa ngục rung chuyển...');setTimeout(()=>closeMinigame(true),2000);}else{_cpShowResult(false,'❌ Sai rồi! Hãy kiểm tra lại các địa điểm.');} }
function _cpShowResult(ok,msg){ const el=document.getElementById('mg-cp-result'); if(!el)return; el.style.display='block'; el.className='cp-result '+(ok?'correct':'wrong'); el.innerHTML=`<h3>${ok?'✅ Thành Công!':'❌ Thất Bại!'}</h3><p>${msg}</p>`; }

// ── ESC đóng minigame ─────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if(e.key==='Escape' && gameState==='MINIGAME'){ closeMinigame(false); }
}, true);

// ── Hint gần cổng lâu đài ────────────────────────────────────────────
// Hiện notif một lần khi player lại gần
let _castleHintShown = false;
setInterval(()=>{
  if(_nearCastleGate && isNightTime() && !hacLongUnlocked && gameState==='WORLD'){
    if(!_castleHintShown){ _castleHintShown=true; showNotif('🏰 [E] Bấm để vào cổng lâu đài — Thách ♟ Hắc Long Vương!'); }
  } else { _castleHintShown=false; }
}, 1000);

// ── Patch ocean floor walk-through (line ~9601) ────────────────────────
// Thay thế đoạn inline bằng hàm _tryAdvanceOceanFloor
// Vì code nằm trong drawOcean inline, ta dùng MutationObserver không được
// → Patch bằng override biến sau khi file load: sử dụng cờ _oceanDoor9Override
// Cách đơn giản nhất: wrap updateOcean nếu có, hoặc dùng event check mỗi frame
// Ta đã define _tryAdvanceOceanFloor; giờ patch bằng cách ghi đè nội dung liên quan
// Thực tế code tại dòng 9601 là:
//   if(oceanFloor<10){oceanFloor++;...}else{exitOceanWorld()...}
// Ta không thể str_replace runtime, nhưng ta có thể override bằng cách:
// Wrap _origUpdateOcean/drawOcean nếu chúng tồn tại
// => Dùng approach: check mỗi frame trong game loop
(function(){
  // Patch: mỗi khi player ở gần door tầng 9 ocean và floor cleared → intercept
  // Ta override bằng cách set flag rồi check trong _tryAdvanceOceanFloor
  // Nhưng code advance nằm trong drawOcean inline nên cần patch khác:
  // Override oceanFloor setter bằng defineProperty
  let _oceanFloorVal = typeof oceanFloor !== 'undefined' ? oceanFloor : 1;
  // Không thể dễ dàng defineProperty cho let variable
  // => Approach thực tế: patch bằng cách monitor & rollback sau khi advance
  // khi floor 9 cleared và chưa unlock → nếu oceanFloor đã thành 10, rollback + show dialog
  let _prevOceanFloor = _oceanFloorVal;
  setInterval(()=>{
    if(typeof oceanFloor === 'undefined' || !inOcean) return;
    if(oceanFloor === 10 && !thuLongUnlocked && !window._oceanDoor9BlockHandled){
      // Bị advance tự động → rollback
      oceanFloor = 9;
      oceanFloorCleared = true;
      oceanBattleActive = false;
      // Hiện dialog
      window._oceanDoor9BlockHandled = true;
      _showBossDialog(
        '🌊 CỔNG TẦNG 10 ĐẠI DƯƠNG',
        'Sóng cuộn dữ dội... Thủy Long Vương đang chờ ở tầng sâu nhất. Hãy chứng tỏ tài năng qua bàn cờ caro trước khi đối mặt với Ngài!',
        '🎯 VÀO ĐẤU CỜ CARO',
        () => openMinigame('caro',
          () => {
            thuLongUnlocked = true;
            window._oceanDoor9BlockHandled = false;
            oceanFloor = 10; oceanFloorCleared = false; oceanBattleActive = false;
            const nf = oceanChallengeFloors[oceanFloor-1];
            if(nf) nf.monster.hp = nf.monster.maxHp;
            showNotif('🌊 Tầng 10/10 — Thủy Long Vương đang chờ!');
          },
          () => { window._oceanDoor9BlockHandled = false; showNotif('🌊 Thua cờ caro... Thử lại!'); }
        )
      );
    }
  }, 200);
})();