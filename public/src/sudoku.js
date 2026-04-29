// ══════════════════════════════════════════════
// SUDOKU.JS — Ô Số Sudoku 9×9
// Dùng cho cổng tầng 9→10 lòng đất
// ══════════════════════════════════════════════

// ── Sinh puzzle Sudoku hợp lệ ───────────────
function _sudokuGenBase(){
  // Base grid hợp lệ, shuffle bằng hoán vị hàng/cột trong band
  const base=[
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8],
  ];
  // Shuffle số 1-9
  const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
  const mapped=base.map(row=>row.map(v=>nums[v-1]));
  // Shuffle hàng trong từng band (3 band × 3 hàng)
  for(let b=0;b<3;b++){
    const rows=[b*3,b*3+1,b*3+2].sort(()=>Math.random()-.5);
    const tmp=[mapped[b*3],mapped[b*3+1],mapped[b*3+2]];
    for(let i=0;i<3;i++) mapped[b*3+i]=tmp[rows[i]-b*3];
  }
  // Shuffle cột trong từng band
  for(let b=0;b<3;b++){
    const cols=[b*3,b*3+1,b*3+2].sort(()=>Math.random()-.5);
    for(let r=0;r<9;r++){
      const tmp=[mapped[r][b*3],mapped[r][b*3+1],mapped[r][b*3+2]];
      for(let i=0;i<3;i++) mapped[r][b*3+i]=tmp[cols[i]-b*3];
    }
  }
  // Shuffle band hàng
  const bands=[0,1,2].sort(()=>Math.random()-.5);
  const banded=[];
  for(const b of bands) for(let i=0;i<3;i++) banded.push(mapped[b*3+i]);
  return banded;
}

function _sudokuMakePuzzle(difficulty=38){
  // difficulty = số ô bị ẩn (38=dễ, 46=vừa, 52=khó)
  const solution=_sudokuGenBase();
  const puzzle=solution.map(r=>[...r]);
  let removed=0;
  const cells=[];
  for(let r=0;r<9;r++) for(let c=0;c<9;c++) cells.push([r,c]);
  cells.sort(()=>Math.random()-.5);
  for(const [r,c] of cells){
    if(removed>=difficulty) break;
    puzzle[r][c]=0;
    removed++;
  }
  return {puzzle, solution};
}

// ── Build HTML Sudoku ────────────────────────
function _sudokuHTML(){
  return `
<style>
#sdk-wrap{
  min-height:100%;background:#0a0500;
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:20px 12px;
  font-family:'Times New Roman',serif;color:#e8d5a3;
}
#sdk-title{
  font-size:22px;font-weight:900;letter-spacing:4px;
  background:linear-gradient(135deg,#ff6a00,#ffaa00,#ff4e00);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:4px;text-align:center;
}
#sdk-sub{font-size:12px;color:#a07040;font-style:italic;margin-bottom:16px;text-align:center;}
#sdk-info{display:flex;gap:20px;margin-bottom:14px;align-items:center;flex-wrap:wrap;justify-content:center;}
#sdk-timer{font-size:14px;color:#ffd700;letter-spacing:2px;}
#sdk-mistakes{font-size:13px;color:#ff8888;}
#sdk-diff-row{display:flex;gap:8px;margin-bottom:14px;}
.sdk-dbtn{
  padding:6px 14px;border-radius:4px;cursor:pointer;font-size:11px;letter-spacing:1px;
  background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);color:#c08040;
  transition:all .2s;
}
.sdk-dbtn.act{background:rgba(255,100,0,0.25);border-color:#ff8800;color:#ffaa44;}
.sdk-dbtn:hover{border-color:#ff8800;color:#ffaa44;}
#sdk-board{
  display:grid;grid-template-columns:repeat(9,1fr);
  border:3px solid #8B6914;
  box-shadow:0 0 30px rgba(255,140,0,0.2);
  background:#1a0e06;
  width:min(400px,90vw);
  height:min(400px,90vw);
}
.sdk-cell{
  aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  font-size:clamp(13px,3.5vw,20px);font-weight:700;cursor:pointer;
  border:1px solid #3a2010;position:relative;transition:background .15s;
  user-select:none;-webkit-tap-highlight-color:transparent;
}
/* Box borders */
.sdk-cell[data-c="2"],.sdk-cell[data-c="5"]{border-right:2.5px solid #8B6914;}
.sdk-cell[data-r="2"],.sdk-cell[data-r="5"]{border-bottom:2.5px solid #8B6914;}
/* States */
.sdk-cell.given{color:#ffd700;}
.sdk-cell.user{color:#88ccff;}
.sdk-cell.error{color:#ff5555 !important;background:rgba(255,50,50,0.15)!important;}
.sdk-cell.selected{background:rgba(255,180,0,0.2)!important;}
.sdk-cell.highlight{background:rgba(255,140,0,0.08);}
.sdk-cell.same-num{background:rgba(255,200,50,0.12);}
.sdk-cell:hover:not(.given){background:rgba(255,140,0,0.12);}
/* Numpad */
#sdk-numpad{
  display:grid;grid-template-columns:repeat(9,1fr);
  gap:5px;margin-top:14px;width:min(400px,90vw);
}
.sdk-num{
  aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  background:rgba(255,100,0,0.12);border:1px solid rgba(255,100,0,0.3);
  border-radius:4px;cursor:pointer;font-size:clamp(13px,3vw,18px);
  color:#ffaa44;font-weight:700;transition:all .15s;
  user-select:none;-webkit-tap-highlight-color:transparent;
}
.sdk-num:hover{background:rgba(255,100,0,0.28);border-color:#ff8800;}
.sdk-num.sdk-erase{font-size:11px;color:#cc6644;}
#sdk-actions{display:flex;gap:8px;margin-top:12px;}
.sdk-abtn{
  padding:8px 18px;border-radius:4px;cursor:pointer;font-size:12px;letter-spacing:1px;
  border:1px solid rgba(255,100,0,0.4);color:#cc8840;background:rgba(255,80,0,0.1);
  transition:all .2s;
}
.sdk-abtn:hover{background:rgba(255,80,0,0.2);border-color:#ff8800;color:#ffaa44;}
#sdk-msg{
  margin-top:14px;font-size:13px;text-align:center;min-height:18px;
  color:#88ff99;letter-spacing:1px;
}
#sdk-win{display:none;text-align:center;margin-top:14px;}
#sdk-win-title{font-size:20px;font-weight:700;color:#ffd700;letter-spacing:3px;margin-bottom:8px;}
.sdk-win-btn{
  display:inline-block;padding:12px 28px;margin-top:8px;
  background:linear-gradient(135deg,#8B0000,#cc2200,#ff4400);
  border:2px solid #ff6a00;border-radius:4px;
  font-size:14px;letter-spacing:3px;color:#fff5e0;cursor:pointer;
  text-transform:uppercase;box-shadow:0 4px 16px rgba(255,80,0,0.3);
}
.sdk-win-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,80,0,0.5);}
</style>
<div id="sdk-wrap">
  <div id="sdk-title">🔥 Ô SỐ SUDOKU</div>
  <div id="sdk-sub">Điền số 1–9 vào mỗi hàng, cột và ô 3×3 — không được trùng</div>
  <div id="sdk-diff-row">
    <div class="sdk-dbtn act" id="sdk-d1" onclick="_sdkSetDiff(1)">DỄ</div>
    <div class="sdk-dbtn" id="sdk-d2" onclick="_sdkSetDiff(2)">VỪA</div>
    <div class="sdk-dbtn" id="sdk-d3" onclick="_sdkSetDiff(3)">KHÓ</div>
    <div class="sdk-dbtn" onclick="_sdkNewGame()">↺ Tạo mới</div>
  </div>
  <div id="sdk-info">
    <div id="sdk-timer">⏱ 00:00</div>
    <div id="sdk-mistakes">❌ Sai: 0/5</div>
  </div>
  <div id="sdk-board"></div>
  <div id="sdk-numpad"></div>
  <div id="sdk-actions">
    <div class="sdk-abtn" onclick="_sdkHint()">💡 Gợi ý</div>
    <div class="sdk-abtn" onclick="_sdkClear()">🗑 Xóa ô</div>
  </div>
  <div id="sdk-msg"></div>
  <div id="sdk-win">
    <div id="sdk-win-title">🏆 HOÀN THÀNH!</div>
    <div id="sdk-win-sub" style="color:#c08040;font-size:12px;margin-bottom:8px;"></div>
    <div class="sdk-win-btn" onclick="_sdkOnWin()">⚡ MỞ CỔNG ĐỊA NGỤC</div>
  </div>
</div>`;
}

// ── Sudoku Engine ────────────────────────────
let _sdkPuzzle=[], _sdkSolution=[], _sdkUser=[];
let _sdkSel=null, _sdkMistakes=0, _sdkDiff=1;
let _sdkTimerEl=null, _sdkTimerSec=0, _sdkTimerInt=null;
let _sdkHints=3, _sdkOver=false;

const _SDK_DIFF_HOLES=[38,46,52];

function _sdkSetDiff(d){
  _sdkDiff=d;
  ['sdk-d1','sdk-d2','sdk-d3'].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('act',i+1===d);
  });
  _sdkNewGame();
}

function _sdkNewGame(){
  const {puzzle,solution}=_sudokuMakePuzzle(_SDK_DIFF_HOLES[_sdkDiff-1]);
  _sdkPuzzle=puzzle;
  _sdkSolution=solution;
  _sdkUser=puzzle.map(r=>[...r]);
  _sdkSel=null;
  _sdkMistakes=0;
  _sdkHints=3;
  _sdkOver=false;
  // Reset timer
  clearInterval(_sdkTimerInt);
  _sdkTimerSec=0;
  _sdkTimerInt=setInterval(()=>{
    if(_sdkOver) return;
    _sdkTimerSec++;
    const m=String(Math.floor(_sdkTimerSec/60)).padStart(2,'0');
    const s=String(_sdkTimerSec%60).padStart(2,'0');
    const el=document.getElementById('sdk-timer');
    if(el) el.textContent=`⏱ ${m}:${s}`;
  },1000);
  _sdkRender();
  const msg=document.getElementById('sdk-msg');
  if(msg) msg.textContent='';
  const win=document.getElementById('sdk-win');
  if(win) win.style.display='none';
  _sdkUpdateInfo();
}

function _sdkRender(){
  const board=document.getElementById('sdk-board');
  if(!board) return;
  board.innerHTML='';
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const cell=document.createElement('div');
      cell.className='sdk-cell';
      cell.dataset.r=r; cell.dataset.c=c;
      const given=_sdkPuzzle[r][c]!==0;
      const val=_sdkUser[r][c];
      if(given){
        cell.classList.add('given');
        cell.textContent=val;
      } else if(val!==0){
        cell.textContent=val;
        cell.classList.add(val!==_sdkSolution[r][c]?'error':'user');
      }
      // Selected
      if(_sdkSel&&_sdkSel[0]===r&&_sdkSel[1]===c) cell.classList.add('selected');
      // Highlight same row/col/box
      else if(_sdkSel){
        const [sr,sc]=_sdkSel;
        const sameBox=Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(c/3)===Math.floor(sc/3);
        if(r===sr||c===sc||sameBox) cell.classList.add('highlight');
        // Same number
        const selVal=_sdkUser[sr][sc];
        if(selVal!==0&&val===selVal) cell.classList.add('same-num');
      }
      cell.onclick=()=>_sdkSelect(r,c);
      board.appendChild(cell);
    }
  }
  // Numpad
  const np=document.getElementById('sdk-numpad');
  if(np){
    np.innerHTML='';
    for(let n=1;n<=9;n++){
      const btn=document.createElement('div');
      btn.className='sdk-num';
      btn.textContent=n;
      btn.onclick=()=>_sdkInput(n);
      np.appendChild(btn);
    }
  }
}

function _sdkSelect(r,c){
  _sdkSel=[r,c];
  _sdkRender();
}

function _sdkInput(num){
  if(_sdkOver||!_sdkSel) return;
  const [r,c]=_sdkSel;
  if(_sdkPuzzle[r][c]!==0) return; // given cell
  if(_sdkUser[r][c]===num){ _sdkUser[r][c]=0; _sdkRender(); return; } // toggle off
  _sdkUser[r][c]=num;
  if(num!==_sdkSolution[r][c]){
    _sdkMistakes++;
    _sdkUpdateInfo();
    const msg=document.getElementById('sdk-msg');
    if(msg) msg.textContent='❌ Sai rồi! Hãy thử lại.';
    if(_sdkMistakes>=5){
      _sdkOver=true;
      clearInterval(_sdkTimerInt);
      if(msg) msg.textContent='💀 Quá 5 lỗi! Ván mới sẽ bắt đầu...';
      setTimeout(()=>_sdkNewGame(),2000);
    }
  } else {
    const msg=document.getElementById('sdk-msg');
    if(msg) msg.textContent='';
  }
  _sdkRender();
  // Check complete
  if(_sdkUser.every((row,r)=>row.every((v,c)=>v===_sdkSolution[r][c]))){
    _sdkComplete();
  }
}

function _sdkClear(){
  if(!_sdkSel||_sdkOver) return;
  const [r,c]=_sdkSel;
  if(_sdkPuzzle[r][c]!==0) return;
  _sdkUser[r][c]=0;
  _sdkRender();
}

function _sdkHint(){
  if(_sdkHints<=0||_sdkOver){ const m=document.getElementById('sdk-msg'); if(m) m.textContent='💡 Hết gợi ý!'; return; }
  // Tìm ô trống hoặc sai ngẫu nhiên
  const empties=[];
  for(let r=0;r<9;r++) for(let c=0;c<9;c++)
    if(_sdkPuzzle[r][c]===0&&_sdkUser[r][c]!==_sdkSolution[r][c]) empties.push([r,c]);
  if(!empties.length) return;
  const [r,c]=empties[Math.floor(Math.random()*empties.length)];
  _sdkUser[r][c]=_sdkSolution[r][c];
  _sdkSel=[r,c];
  _sdkHints--;
  const msg=document.getElementById('sdk-msg');
  if(msg) msg.textContent=`💡 Đã gợi ý! Còn ${_sdkHints} gợi ý.`;
  _sdkRender();
  if(_sdkUser.every((row,r)=>row.every((v,c)=>v===_sdkSolution[r][c]))){
    _sdkComplete();
  }
}

function _sdkUpdateInfo(){
  const m=document.getElementById('sdk-mistakes');
  if(m) m.textContent=`❌ Sai: ${_sdkMistakes}/5`;
}

function _sdkComplete(){
  _sdkOver=true;
  clearInterval(_sdkTimerInt);
  const m=String(Math.floor(_sdkTimerSec/60)).padStart(2,'0');
  const s=String(_sdkTimerSec%60).padStart(2,'0');
  const win=document.getElementById('sdk-win');
  const sub=document.getElementById('sdk-win-sub');
  if(sub) sub.textContent=`Thời gian: ${m}:${s} — Lỗi: ${_sdkMistakes}/5`;
  if(win) win.style.display='block';
  const msg=document.getElementById('sdk-msg');
  if(msg) msg.textContent='';
}

function _sdkOnWin(){
  clearInterval(_sdkTimerInt);
  closeMinigame(true);
}

// ── Keyboard support ─────────────────────────
function _sdkKeyHandler(e){
  if(typeof gameState!=='undefined'&&gameState!=='MINIGAME') return;
  const num=parseInt(e.key);
  if(num>=1&&num<=9){ _sdkInput(num); return; }
  if(e.key==='Backspace'||e.key==='Delete'||e.key==='0'){ _sdkClear(); return; }
  if(!_sdkSel) return;
  const [r,c]=_sdkSel;
  if(e.key==='ArrowUp'&&r>0)    { _sdkSel=[r-1,c]; _sdkRender(); }
  if(e.key==='ArrowDown'&&r<8)  { _sdkSel=[r+1,c]; _sdkRender(); }
  if(e.key==='ArrowLeft'&&c>0)  { _sdkSel=[r,c-1]; _sdkRender(); }
  if(e.key==='ArrowRight'&&c<8) { _sdkSel=[r,c+1]; _sdkRender(); }
}
document.addEventListener('keydown', _sdkKeyHandler);

// ── Export: init function called by minigame.js ──
window._initSudoku = function(){
  _sdkDiff=1;
  _sdkNewGame();
};
