// ══════════════ CỜ VUA ENGINE ════════════════════════════════════════
// Quân người chơi = TRẮNG (đi trước, dưới bàn cờ)
// Quân AI/Ám Long = ĐEN (trên bàn cờ)
// Kết thúc = chiếu hết (không thể ăn vua trực tiếp)
// ── BÓNG TỐI TRÓI: xác suất 15% mỗi lượt AI đánh xong ──────────────
const _CS_PIECES={wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'};
const _CS_VALS={K:10000,Q:900,R:500,B:330,N:320,P:100};
let _csBoard=[], _csSel=null, _csTurn='w', _csMoves=[], _csOver=false, _csDiffLevel=1;
let _csCapW=[], _csCapB=[], _csLogs=[], _csScoreX=0, _csScoreO=0;

// ── Shadow Bind state ─────────────────────────────────────────────────
let _csBoundIdx=null;      // ô đang bị trói (-1 = không ai)
let _csBoundTurns=0;       // còn bao nhiêu lượt bị trói
let _csBoundAnim=0;        // frame đếm cho animation
let _csBoundAnimId=null;   // requestAnimationFrame id
const _CS_BIND_PROB=0.15;  // xác suất 15% mỗi lượt AI
const _CS_BIND_TURNS=2;    // bị trói 2 lượt của người chơi

// CSS animation inject (chỉ inject 1 lần)
(function(){
  if(document.getElementById('cs-shadow-style')) return;
  const s=document.createElement('style');
  s.id='cs-shadow-style';
  s.textContent=`
@keyframes cs-bind-pulse{
  0%  {box-shadow:inset 0 0 0 2px rgba(160,0,255,0.4),0 0 6px rgba(120,0,200,0.5);}
  30% {box-shadow:inset 0 0 0 3px rgba(200,80,255,0.8),0 0 18px rgba(180,0,255,0.9);}
  60% {box-shadow:inset 0 0 0 2px rgba(120,0,180,0.6),0 0 10px rgba(100,0,160,0.7);}
  100%{box-shadow:inset 0 0 0 2px rgba(160,0,255,0.4),0 0 6px rgba(120,0,200,0.5);}
}
@keyframes cs-bind-chain{
  0%  {opacity:0.6;transform:scale(0.85) rotate(0deg);}
  50% {opacity:1;  transform:scale(1.15) rotate(8deg);}
  100%{opacity:0.6;transform:scale(0.85) rotate(0deg);}
}
@keyframes cs-bind-smoke{
  0%  {opacity:0;transform:translateY(0) scale(0.8);}
  30% {opacity:0.7;}
  100%{opacity:0;transform:translateY(-18px) scale(1.3);}
}
.cs.shadow-bound{
  animation:cs-bind-pulse 0.8s ease-in-out infinite !important;
  background:rgba(80,0,140,0.35) !important;
  cursor:not-allowed !important;
  position:relative;
}
.cs.shadow-bound::before{
  content:'⛓';
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;z-index:5;
  animation:cs-bind-chain 0.9s ease-in-out infinite;
  pointer-events:none;
}
.cs.shadow-bound::after{
  content:'';
  position:absolute;inset:0;
  background:radial-gradient(circle,rgba(160,0,255,0.18) 0%,transparent 70%);
  pointer-events:none;z-index:4;
}
.cs-smoke{
  position:absolute;font-size:14px;pointer-events:none;
  animation:cs-bind-smoke 0.9s ease-out forwards;
  z-index:10;
}
#cs-bind-warn{
  font-size:11px;color:#cc88ff;text-align:center;
  min-height:14px;letter-spacing:1px;margin-top:4px;
  animation:cs-warn-blink 1s ease-in-out infinite alternate;
}
@keyframes cs-warn-blink{from{opacity:0.5;}to{opacity:1;}}
`;
  document.head.appendChild(s);
})();

function _csSetDiff(d){ _csDiffLevel=d; ['mg-d1','mg-d2','mg-d3'].forEach((id,i)=>{ const el=document.getElementById(id); if(el) el.classList.toggle('act',i+1===d); }); }
function _csInitBoard(){ const r=['bR','bN','bB','bQ','bK','bB','bN','bR','bP','bP','bP','bP','bP','bP','bP','bP',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'wP','wP','wP','wP','wP','wP','wP','wP','wR','wN','wB','wQ','wK','wB','wN','wR']; return r.map(p=>p?{type:p[1],color:p[0]}:null); }
function _csInit(){
  _csBoard=_csInitBoard(); _csSel=null; _csTurn='w'; _csOver=false;
  _csCapW=[]; _csCapB=[]; _csMoves=[]; _csLogs=[];
  _csBoundIdx=null; _csBoundTurns=0;
  // Thêm warn div nếu chưa có
  const side=document.querySelector('.mg-side');
  if(side&&!document.getElementById('cs-bind-warn')){
    const d=document.createElement('div');
    d.id='cs-bind-warn'; side.appendChild(d);
  }
  _csRender();
  _csSetStatus('⚔ Lượt của bạn','your-turn');
  const w=document.getElementById('mg-cs-win'); if(w) w.classList.remove('show');
  _csLog('Ván đấu bắt đầu...','ev');
  _csUpdateCap(); _csUpdateLog();
}
function _csIB(r,f){ return r>=0&&r<8&&f>=0&&f<8; }
function _csRC(i){ return [Math.floor(i/8),i%8]; }
function _csIDX(r,f){ return r*8+f; }
// _csSlide nhận board b để dùng khi kiểm tra nước đi hợp lệ (không dùng global)
function _csSlide(i,dirs,c,b){ const res=[]; const[r0,f0]=_csRC(i); for(const[dr,df]of dirs){let r=r0+dr,f=f0+df; while(_csIB(r,f)){const t=_csIDX(r,f); if(!b[t]){res.push(t);}else{if(b[t].color!==c)res.push(t);break;} r+=dr;f+=df;}} return res; }
function _csPseudo(i,b){ if(!b)b=_csBoard; const p=b[i]; if(!p)return[]; const c=p.color; const[r,f]=_csRC(i); const res=[]; const push=(r2,f2)=>{if(_csIB(r2,f2)){const t=_csIDX(r2,f2);if(!(b[t]&&b[t].color===c))res.push(t);}};
  if(p.type==='R')return _csSlide(i,[[0,1],[0,-1],[1,0],[-1,0]],c,b);
  if(p.type==='B')return _csSlide(i,[[1,1],[1,-1],[-1,1],[-1,-1]],c,b);
  if(p.type==='Q')return _csSlide(i,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]],c,b);
  if(p.type==='N'){[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,df])=>push(r+dr,f+df));}
  if(p.type==='K'){[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,df])=>push(r+dr,f+df));}
  if(p.type==='P'){const dir=c==='w'?-1:1; if(_csIB(r+dir,f)&&!b[_csIDX(r+dir,f)])res.push(_csIDX(r+dir,f)); const start=c==='w'?6:1; if(r===start&&!b[_csIDX(r+dir,f)]&&!b[_csIDX(r+dir*2,f)])res.push(_csIDX(r+dir*2,f)); [[dir,-1],[dir,1]].forEach(([dr,df])=>{if(_csIB(r+dr,f+df)&&b[_csIDX(r+dr,f+df)]&&b[_csIDX(r+dr,f+df)].color!==c)res.push(_csIDX(r+dr,f+df));});}
  return res;
}
function _csFindK(c,b){ return b.findIndex(p=>p&&p.type==='K'&&p.color===c); }
function _csCheck(c,b){ if(!b)b=_csBoard; const ki=_csFindK(c,b); if(ki<0)return false; const opp=c==='w'?'b':'w'; for(let i=0;i<64;i++){if(b[i]&&b[i].color===opp&&_csPseudo(i,b).includes(ki))return true;} return false; }
// _csLegal: lọc nước đi hợp lệ — không bao gồm nước đi làm vua của mình bị chiếu
function _csLegal(i){ const p=_csBoard[i]; if(!p)return[]; return _csPseudo(i,_csBoard).filter(t=>{
  const nb=_csBoard.map(x=>x?{...x}:null); // deep copy từng ô
  nb[t]=nb[i]; nb[i]=null;
  return !_csCheck(p.color,nb);
}); }
function _csAllLegal(c){ const all=[]; for(let i=0;i<64;i++){if(_csBoard[i]&&_csBoard[i].color===c)_csLegal(i).forEach(t=>all.push([i,t]));} return all; }
function _csEval(){ let s=0; _csBoard.forEach(p=>{if(p){const v=_CS_VALS[p.type]||0; s+=p.color==='b'?v:-v;}}); return s; }
function _csAI(){ const legal=_csAllLegal('b'); if(!legal.length)return null; if(_csDiffLevel===1)return legal[Math.floor(Math.random()*legal.length)]; let best=null,bs=-Infinity; for(const[f,t]of legal){const nb=_csBoard.map(x=>x?{...x}:null);const cap=nb[t];nb[t]=nb[f];nb[f]=null;let sc=cap?(_CS_VALS[cap.type]||0):0;if(_csDiffLevel===3)sc-=_csEval();if(sc>bs){bs=sc;best=[f,t];}} return best||legal[Math.floor(Math.random()*legal.length)]; }
function _csDoMove(from,to){ const p=_csBoard[from]; const cap=_csBoard[to]; let promo=p; if(p.type==='P'){if((p.color==='w'&&Math.floor(to/8)===0)||(p.color==='b'&&Math.floor(to/8)===7))promo={...p,type:'Q'};} _csBoard[to]=promo; _csBoard[from]=null; if(cap){if(p.color==='w')_csCapB.push(cap);else _csCapW.push(cap);} const files='abcdefgh'; const[r0,f0]=_csRC(from); const[r1,f1]=_csRC(to); _csLog(`${_CS_PIECES[p.color+p.type]}${files[f0]}${8-r0}→${files[f1]}${8-r1}`,p.color==='w'?'w':'b'); }
function _csSq(i){
  if(_csOver)return; if(_csTurn!=='w')return;
  // Không thể chọn quân đang bị trói
  if(_csSel===null){
    if(_csBoard[i]&&_csBoard[i].color==='w'){
      if(i===_csBoundIdx){
        // Cố chọn quân bị trói → cảnh báo
        _csSetWarn('⛓ Quân này đang bị Bóng Tối trói! Chọn quân khác.');
        _csRender(); return;
      }
      _csSel=i; _csRender();
    }
  } else {
    const legal=_csLegal(_csSel);
    if(legal.includes(i)){
      // Không thể ăn quân bị trói (quân ĐEN bị trói cũng bất tử)
      if(i===_csBoundIdx&&_csBoard[i]&&_csBoard[i].color==='b'){
        _csSetWarn('⛓ Quân này được Bóng Tối bảo vệ — không thể ăn!');
        _csSel=null; _csRender(); return;
      }
      _csDoMove(_csSel,i);
      // Giảm lượt bind khi người chơi đi
      if(_csBoundIdx!==null){ _csBoundTurns--; if(_csBoundTurns<=0){ _csBoundIdx=null; _csSetWarn('✨ Bóng Tối đã tan!'); } }
      _csSel=null; _csTurn='b';
      _csUpdateCap(); _csUpdateLog(); _csRender();
      _csCheckState('b');
      if(!_csOver) setTimeout(_csDragon,600);
    } else if(_csBoard[i]&&_csBoard[i].color==='w'){
      if(i===_csBoundIdx){ _csSetWarn('⛓ Quân này đang bị Bóng Tối trói!'); _csSel=null; _csRender(); return; }
      _csSel=i; _csRender();
    } else { _csSel=null; _csRender(); }
  }
}

function _csSetWarn(msg){
  const el=document.getElementById('cs-bind-warn');
  if(el){ el.textContent=msg; setTimeout(()=>{ if(el.textContent===msg) el.textContent=''; },2500); }
}

function _csTryBind(){
  if(Math.random()>_CS_BIND_PROB) return;
  // Chọn ngẫu nhiên 1 quân TRẮNG còn sống (không phải Vua)
  const whites=[];
  for(let i=0;i<64;i++){
    if(_csBoard[i]&&_csBoard[i].color==='w'&&_csBoard[i].type!=='K') whites.push(i);
  }
  if(!whites.length) return;
  const target=whites[Math.floor(Math.random()*whites.length)];
  _csBoundIdx=target;
  _csBoundTurns=_CS_BIND_TURNS;
  const [r,f]=_csRC(target);
  const pname=_CS_PIECES['w'+_csBoard[target].type];
  _csLog(`🌑 Bóng Tối trói ${pname} tại ${String.fromCharCode(97+f)}${8-r}!`,'ev');
  _csUpdateLog();
  _csSetWarn(`⛓ ${pname} bị Bóng Tối trói ${_CS_BIND_TURNS} lượt!`);
  // Hiệu ứng khói tím tại ô bị trói
  _csSpawnSmoke(target);
  _csRender();
}

function _csSpawnSmoke(idx){
  const board=document.getElementById('mg-cs-board');
  if(!board) return;
  const cell=board.querySelector(`[data-sq="${idx}"]`);
  if(!cell) return;
  const rect=cell.getBoundingClientRect();
  const boardRect=board.getBoundingClientRect();
  for(let i=0;i<5;i++){
    setTimeout(()=>{
      const smoke=document.createElement('div');
      smoke.className='cs-smoke';
      smoke.textContent=['💜','🌑','⛓','✨'][Math.floor(Math.random()*4)];
      smoke.style.left=(rect.left-boardRect.left+Math.random()*30-5)+'px';
      smoke.style.top=(rect.top-boardRect.top+Math.random()*20)+'px';
      board.style.position='relative';
      board.appendChild(smoke);
      setTimeout(()=>smoke.remove(),900);
    },i*120);
  }
}

function _csDragon(){
  const mv=_csAI(); if(!mv){_csEndGame('w','Ám Long hết nước đi — Hòa!');return;}
  _csDoMove(mv[0],mv[1]); _csTurn='w';
  _csUpdateCap(); _csUpdateLog(); _csRender(); _csCheckState('w');
  // Thử trói sau khi AI đi xong
  if(!_csOver) setTimeout(_csTryBind, 400);
}
function _csCheckState(c){ const inChk=_csCheck(c,_csBoard); const legal=_csAllLegal(c); if(!legal.length){if(inChk)_csEndGame(c==='w'?'b':'w','Chiếu hết!');else _csEndGame(null,'Hết nước — Hòa!');return;} if(inChk){_csLog(`${c==='w'?'Bạn':'Ám Long'} bị chiếu!`,'ev');_csSetStatus(c==='w'?'⚠ BẠN BỊ CHIẾU!':'⚠ ÁM LONG BỊ CHIẾU!','check');setTimeout(()=>_csSetStatus(c==='w'?'⚔ Lượt của bạn':'🌑 Ám Long...',c==='w'?'your-turn':'dragon-turn'),1400);}else{_csSetStatus(c==='w'?'⚔ Lượt của bạn':'🌑 Ám Long...',c==='w'?'your-turn':'dragon-turn');} }
function _csEndGame(winner,reason){ _csOver=true; _csLog(`⚔ ${reason}`,'ev'); _csUpdateLog(); const ov=document.getElementById('mg-cs-win'); if(!ov)return; ov.classList.add('show'); const msg=document.getElementById('mg-cs-winmsg'); const sub=document.getElementById('mg-cs-winsub'); if(!winner){msg.textContent='☯ HÒA!';sub.textContent=reason;}else if(winner==='w'){msg.innerHTML='🏆 <span style="color:#ffd700">BẠN THẮNG!</span>';sub.textContent='Ám Long gục ngã!'; setTimeout(()=>closeMinigame(true),1800);}else{msg.innerHTML='💀 <span style="color:#cc44ff">ÁM LONG THẮNG</span>';sub.textContent='Thử lại đi!';} }
function _csRender(){
  const el=document.getElementById('mg-cs-board'); if(!el)return;
  const legal=_csSel!==null?_csLegal(_csSel):[];
  const wchk=_csCheck('w',_csBoard), bchk=_csCheck('b',_csBoard);
  el.innerHTML='';
  for(let i=0;i<64;i++){
    const[r,f]=_csRC(i);
    const sq=document.createElement('div');
    sq.className=`cs ${(r+f)%2===0?'light':'dark'}`;
    sq.dataset.sq=i; // dùng cho smoke effect
    if(i===_csSel)sq.classList.add('sel');
    // Shadow bind — quân bị trói (cả trắng lẫn đen nếu cần)
    if(i===_csBoundIdx&&_csBoundTurns>0) sq.classList.add('shadow-bound');
    if(legal.includes(i)){
      // Ô có quân địch bị trói → không cho ăn
      if(i===_csBoundIdx&&_csBoard[i]&&_csBoard[i].color==='b'){
        // bỏ qua — không show move indicator
      } else {
        if(_csBoard[i]){sq.classList.add('mv','hp');}else{sq.classList.add('mv');}
      }
    }
    const p=_csBoard[i];
    if(p){
      if((p.type==='K'&&p.color==='w'&&wchk)||(p.type==='K'&&p.color==='b'&&bchk))sq.classList.add('chk');
      const pe=document.createElement('div');
      pe.className='csp';
      pe.dataset.side=p.color;
      pe.textContent=_CS_PIECES[p.color+p.type];
      sq.appendChild(pe);
    }
    sq.onclick=()=>_csSq(i);
    el.appendChild(sq);
  }
}
function _csSetStatus(msg,cls){ const el=document.getElementById('mg-cs-status'); if(el){el.textContent=msg;el.className='mg-status '+cls;} }
function _csUpdateCap(){ const b=document.getElementById('mg-cs-capB'),w=document.getElementById('mg-cs-capW'); if(b)b.innerHTML=_csCapB.map(p=>_CS_PIECES[p.color+p.type]).join(''); if(w)w.innerHTML=_csCapW.map(p=>_CS_PIECES[p.color+p.type]).join(''); }
function _csLog(msg,cls=''){ _csLogs.unshift({msg,cls}); }
function _csUpdateLog(){ const el=document.getElementById('mg-cs-log'); if(el)el.innerHTML=_csLogs.slice(0,24).map(e=>`<div class="mg-log-e ${e.cls}">${e.msg}</div>`).join(''); }