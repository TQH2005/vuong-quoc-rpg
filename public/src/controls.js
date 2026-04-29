function isMobile(){
  return _isTouchDevice;
}

function resizeCanvas(){
  const border = document.getElementById('canvas-border');
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const touch = document.body.classList.contains('touch-mode');

  if(touch){
    // ── Mobile: ALWAYS full width, clip bottom if needed ───
    const vcShown = document.getElementById('vcontrols').classList.contains('show');
    const ctrlH = vcShown ? 90 : 0;
    const availH = vh - ctrlH;
    const useW = vw;
    const useH = Math.floor(vw * GH / GW); // maintain aspect ratio
    // Always use full width; if canvas taller than available, wrap clips it
    border.style.width  = useW + 'px';
    border.style.height = Math.min(useH, availH) + 'px';
    gc.style.width  = useW + 'px';  gc.style.height = useH + 'px';
    ic.style.width  = useW + 'px';  ic.style.height = useH + 'px';
    // Make wrap exactly the visible canvas height
    const wrap = document.getElementById('wrap');
    if(wrap) wrap.style.height = Math.min(useH, availH) + 'px';
  } else {
    // ── Desktop: scale to 85% viewport, keep ratio ──────────
    const scaleW = (vw * 0.85) / GW;
    const scaleH = (vh * 0.85) / GH;
    const scale  = Math.min(scaleW, scaleH);
    const w = Math.floor(GW * scale);
    const h = Math.floor(GH * scale);
    border.style.width  = w + 'px';
    border.style.height = h + 'px';
    gc.style.width  = w + 'px';  gc.style.height = h + 'px';
    ic.style.width  = w + 'px';  ic.style.height = h + 'px';
  }
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', ()=>setTimeout(resizeCanvas, 350));
resizeCanvas();

// ═══════════════════════════════════════════
// VIRTUAL CONTROLS
// ═══════════════════════════════════════════

function initVirtualControls(){
  if(!_isTouchDevice) return;
  // touch-mode already added by early detection
  const vc = document.getElementById('vcontrols');
  vc.classList.add('show');
  setTimeout(resizeCanvas, 50);

  // ── Haptic helper ────────────────────────────────────────────
  function haptic(dur=18){
    if(navigator.vibrate) navigator.vibrate(dur);
  }

  // ── Ripple effect on button press ──────────────────────────
  function addRipple(el){
    const r=document.createElement('div');
    r.className='vc-ripple';
    el.appendChild(r);
    setTimeout(()=>r.remove(),450);
  }

  // ── Action button wiring ────────────────────────────────────
  function wireBtn(id, onPress, onRelease){
    const el=document.getElementById(id);
    if(!el) return;
    const press=(e)=>{
      e.preventDefault();e.stopPropagation();
      el.classList.add('pressed');
      addRipple(el);
      haptic(12);
      if(onPress) onPress();
    };
    const release=(e)=>{
      e.preventDefault();
      el.classList.remove('pressed');
      if(onRelease) onRelease();
    };
    el.addEventListener('touchstart',press,{passive:false});
    el.addEventListener('touchend',release,{passive:false});
    el.addEventListener('touchcancel',release,{passive:false});
    el.addEventListener('mousedown',press);
    el.addEventListener('mouseup',release);
  }

  // ── JOYSTICK ─────────────────────────────────────────────────
  const jZone = document.getElementById('joystick-zone');
  const jKnob = document.getElementById('joystick-knob');
  const JR = 55;       // max knob travel radius
  const DEAD = 0.22;   // dead zone (normalized)
  let jActive=false, jId=null, jOx=0, jOy=0;
  // Current joystick direction state
  let jLeft=false,jRight=false,jUp=false,jDown=false;

  function jSetDir(dx,dy){
    // Clear old
    if(jLeft) keys['ArrowLeft']=false;
    if(jRight) keys['ArrowRight']=false;
    if(jUp){ keys['ArrowUp']=false; }
    if(jDown) keys['ArrowDown']=false;

    const len=Math.sqrt(dx*dx+dy*dy);
    if(len<DEAD){ jLeft=jRight=jUp=jDown=false; return; }

    const nx=dx/len, ny=dy/len;
    jLeft=nx<-0.45; jRight=nx>0.45;
    jUp=ny<-0.45;   jDown=ny>0.45;

    if(jLeft)  keys['ArrowLeft']=true;
    if(jRight) keys['ArrowRight']=true;
    if(jUp){   keys['ArrowUp']=true; jumpPressed=true; }
    if(jDown)  keys['ArrowDown']=true;
  }

  function jMoveKnob(dx,dy){
    const len=Math.sqrt(dx*dx+dy*dy);
    const clamp=Math.min(len,JR);
    const angle=Math.atan2(dy,dx);
    const kx=Math.cos(angle)*clamp;
    const ky=Math.sin(angle)*clamp;
    jKnob.style.transform=`translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
  }

  function jReset(){
    jActive=false; jId=null;
    jLeft=jRight=jUp=jDown=false;
    keys['ArrowLeft']=keys['ArrowRight']=keys['ArrowUp']=keys['ArrowDown']=false;
    jKnob.style.transform='translate(-50%,-50%)';
  }

  jZone.addEventListener('touchstart',e=>{
    e.preventDefault();
    const t=e.changedTouches[0];
    const rect=jZone.getBoundingClientRect();
    jActive=true; jId=t.identifier;
    jOx=rect.left+rect.width/2;
    jOy=rect.top+rect.height/2;
    const dx=(t.clientX-jOx)/JR;
    const dy=(t.clientY-jOy)/JR;
    jSetDir(dx,dy);
    jMoveKnob(t.clientX-jOx, t.clientY-jOy);
  },{passive:false});

  jZone.addEventListener('touchmove',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier!==jId) continue;
      const dx=(t.clientX-jOx)/JR;
      const dy=(t.clientY-jOy)/JR;
      jSetDir(dx,dy);
      jMoveKnob(t.clientX-jOx, t.clientY-jOy);
    }
  },{passive:false});

  jZone.addEventListener('touchend',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===jId) jReset();
    }
  },{passive:false});
  jZone.addEventListener('touchcancel',e=>{ e.preventDefault(); jReset(); },{passive:false});

  // ── JUMP ─────────────────────────────────────────────────────
  wireBtn('btn-jump', ()=>{
    jumpPressed=true; keys['ArrowUp']=true;
    haptic(15);
  }, ()=>{
    keys['ArrowUp']=false;
  });

  // ── ACTION / INTERACT ─────────────────────────────────────────
  wireBtn('btn-action', ()=>{
    haptic(20);
    interact();
  });

  // ── ATTACK ───────────────────────────────────────────────────
  wireBtn('btn-attack', ()=>{
    haptic(30);
    if(inOcean && !oceanBattleActive && !oceanFloorCleared){
      const oFloor=oceanChallengeFloors[oceanFloor-1];
      if(oFloor){ P.attackAnim=32; spawnParticles(P.x+P.w/2,P.y+P.h/2,'#00ddff',8,2); oceanBattleActive=true; startOceanBattle(oFloor); }
      return;
    }
    if(gameState==='WORLD' && window._nearMon){
      P.attackAnim=32;
      spawnParticles(P.x+P.w/2,P.y+P.h/2,'#ff4400',8,3);
      showPreBattle(window._nearMon);
    }
  });

  // ── SHOP ─────────────────────────────────────────────────────
  wireBtn('btn-shop', ()=>{
    haptic(15);
    if(gameState==='WORLD'||gameState==='INDOOR') openShop();
  });

  // ── BAG ──────────────────────────────────────────────────────
  wireBtn('btn-bag', ()=>{
    haptic(15);
    if(gameState==='WORLD'||gameState==='INDOOR'||gameState==='OCEAN'||gameState==='UNDERGROUND') openBag();
    else if(gameState==='BAG') closeBag();
  });

  // ── Interact hint: show when near NPC/chest/door ─────────────
  function updateInteractHint(){
    const hint=document.getElementById('btn-interact-hint');
    if(!hint) return;
    const nearSomething = window._nearHouse||window._nearChest||window._nearCave||window._nearUnderground;
    hint.classList.toggle('show', !!nearSomething && gameState==='WORLD');
  }
  // Patch into game loop
  const _origSync=window.syncVControls||function(){};
  window._mobileHintUpdate=updateInteractHint;

  // ── Swipe-to-interact on canvas ──────────────────────────────
  let swipeStartX=0, swipeStartY=0;
  const cb=document.getElementById('canvas-border');
  cb.addEventListener('touchstart',e=>{
    if(e.target===gc||e.target===ic){
      e.preventDefault();
      swipeStartX=e.touches[0].clientX;
      swipeStartY=e.touches[0].clientY;
    }
  },{passive:false});
  cb.addEventListener('touchend',e=>{
    if(e.target===gc||e.target===ic){
      e.preventDefault();
      const dx=e.changedTouches[0].clientX-swipeStartX;
      const dy=e.changedTouches[0].clientY-swipeStartY;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<12){ // tap on canvas = interact
        if(gameState==='WORLD') interact();
      }
    }
  },{passive:false});
  cb.addEventListener('touchmove',e=>{
    if(e.target===gc||e.target===ic) e.preventDefault();
  },{passive:false});
}

// syncVControls handles show/hide on game state change


// ─── syncVControls: ẩn nút điều khiển khi có overlay đang mở ───
function syncVControls(){
  const vc = document.getElementById('vcontrols');
  if(!vc.classList.contains('show')) return;
  const hideStates = ['DIALOG','PUZZLE','SHOP','BATTLE','RESULT','CAVE'];
  if(hideStates.includes(gameState)){
    vc.classList.add('hide-controls');
  } else {
    vc.classList.remove('hide-controls');
  }
  // Update interact hint
  if(window._mobileHintUpdate) window._mobileHintUpdate();
}

initVirtualControls();
// Final resize after controls are set up
setTimeout(resizeCanvas, 100);