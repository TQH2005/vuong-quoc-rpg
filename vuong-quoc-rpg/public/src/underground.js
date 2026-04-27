// ═══════════════════════════════════════════
// UNDERGROUND DUNGEON SYSTEM
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// UNDERGROUND DUNGEON — Walkable Side-Scrolling Engine
// ═══════════════════════════════════════════════════════════════
const ugCanvas=document.getElementById('underground-canvas');
const ugCtx=ugCanvas?ugCanvas.getContext('2d'):null;
if(ugCanvas){ ugCanvas.width=640; ugCanvas.height=300; }

let ugAnimId=null, ugFrame=0;

// ── Room layout constants ────────────────────────────────────
const UG_W=1600;   // each room world width (player scrolls inside)
const UG_H=300;    // canvas height
const UG_GY=240;   // ground Y inside room
const UG_CEIL=30;  // ceiling Y

// ── Underground player state ─────────────────────────────────
const UP={x:80,y:UG_GY-80,w:36,h:60,vx:0,vy:0,speed:2.2,onGround:false,facing:1,hurtAnim:0,attackAnim:0};
let ugCamX=0;

// ── Per-room monster state ───────────────────────────────────
let ugMon=null;  // {x,y,w,h,dir,mt,hp,maxHp,type,alive,patrol}
let ugDoorOpen=false;   // door to next room open?
let ugRoomCleared=false;
let ugInBattle=false;   // waiting for quiz battle to resolve
let ugExitDoor=false;   // floor 10: portal to fire dragon hell
const ugKeys={left:false,right:false,jump:false,attack:false};

// ── Floor definitions ────────────────────────────────────────
// (reuse UNDERGROUND_FLOORS already defined above)

// ── Open underground ─────────────────────────────────────────
function openUnderground(){
  if(gameState!=='WORLD') return;
  // Resize canvas to match device
  if(ugCanvas){ ugCanvas.width=_isTouchDevice?360:640; ugCanvas.height=_isTouchDevice?260:300; }
  undergroundFloor=1;
  undergroundActive=true;
  ugDoorOpen=false; ugRoomCleared=false; ugInBattle=false;
  UP.x=80; UP.y=UG_GY-UP.h; UP.vx=0; UP.vy=0; UP.facing=1;
  ugCamX=0;
  _spawnUGMonster();
  document.getElementById('underground-overlay').classList.add('on');
  // Show mobile controls on touch device
  const ctrl=document.getElementById('ug-controls');
  if(ctrl) ctrl.style.display=_isTouchDevice?'flex':'none';
  gameState='UNDERGROUND';
  if(ugCtx) _startUGLoop();
  showNotif('⛏ Bạn đã vào lòng đất — Tầng 1/10');
}

function exitUnderground(){
  undergroundActive=false;
  document.getElementById('underground-overlay').classList.remove('on');
  gameState='WORLD';
  if(ugAnimId){ cancelAnimationFrame(ugAnimId); ugAnimId=null; }
  // Đảm bảo world canvas hiện lại
  const _gc=document.getElementById('gc');
  if(_gc) _gc.style.visibility='visible';
  updateHUD();
}

// ── Spawn room monster ───────────────────────────────────────
function _spawnUGMonster(){
  const fl=UNDERGROUND_FLOORS[undergroundFloor-1];
  if(!fl) return;
  const isHell=undergroundFloor===10;
  const isBoss=fl.monster.isBoss||isHell;
  const _mtype=fl.monster.type;
  const mh=isHell?171:(_mtype==='bat'?28:_mtype==='orc'?72:56);
  const mw=isHell?177:(_mtype==='bat'?40:_mtype==='orc'?36:32);
  const spawnX=isHell?Math.floor(UG_W/2):UG_W-300;
  ugMon={
    x:spawnX, y:UG_GY-mh,
    w:mw, h:mh,
    dir:-1, mt:0,
    hp:fl.monster.hp, maxHp:fl.monster.hp,
    type:fl.monster.type, name:fl.monster.name,
    alive:true, patrol:spawnX,
    isBoss, isFireDragon:isHell,
    rw:fl.monster.rw, dragonAtk:fl.monster.dragonAtk||0,
    dragonCritChance:fl.monster.dragonCritChance||0.15,
  };
  ugDoorOpen=false;
  ugRoomCleared=false;
  // Update HUD
  document.getElementById('ug-floor-txt').textContent='Tầng '+undergroundFloor+' / 10';
  document.getElementById('ug-floor-name').textContent=fl.name;
  document.getElementById('ug-hp-txt').textContent='❤ '+playerHP;
}

// ── Advance to next floor ─────────────────────────────────────
function _advanceUGFloor(){
  if(undergroundFloor>=10){
    // Floor 10 cleared — fire dragon defeated
    // Không set undergroundActive=false ở đây — để _onUGBattleEnd xử lý
    setTimeout(()=>{
      exitUnderground();
      showNotif('🏆 Bạn đã chinh phục lòng đất! Thoát lên mặt đất!');
    },1500);
    return;
  }
  undergroundFloor++;
  UP.x=80; UP.y=UG_GY-UP.h; UP.vx=0; UP.vy=0;
  ugCamX=0;
  ugDoorOpen=false; ugRoomCleared=false;
  _spawnUGMonster();
  showNotif('⛏ Tầng '+undergroundFloor+'/10 — tiếp tục xuống sâu!');
}

// ── Physics update ───────────────────────────────────────────
function _updateUGPhysics(){
  if(ugInBattle) return;
  const W=ugCanvas?ugCanvas.width:640;

  // Input
  if(ugKeys.left){ UP.vx=-UP.speed; UP.facing=-1; }
  else if(ugKeys.right){ UP.vx=UP.speed; UP.facing=1; }
  else UP.vx*=0.7;

  if(ugKeys.jump&&UP.onGround){ UP.vy=-9; UP.onGround=false; ugKeys.jump=false; }
  UP.vy=Math.min(UP.vy+0.5,14);
  UP.x+=UP.vx; UP.y+=UP.vy;
  UP.onGround=false;

  // Ground collision
  if(UP.y+UP.h>=UG_GY){ UP.y=UG_GY-UP.h; UP.vy=0; UP.onGround=true; }
  // Ceiling
  if(UP.y<UG_CEIL){ UP.y=UG_CEIL; UP.vy=0; }
  // Left wall
  if(UP.x<10) UP.x=10;
  // Right wall — only passable if door open
  const doorX=UG_W-60;
  if(!ugDoorOpen && UP.x+UP.w>doorX) UP.x=doorX-UP.w;
  // World right edge
  if(UP.x+UP.w>UG_W) UP.x=UG_W-UP.w;

  // Camera
  ugCamX=Math.max(0,Math.min(UG_W-W, UP.x+UP.w/2-W/2));

  // Patrol monster (boss fire dragon stands still)
  if(ugMon&&ugMon.alive){
    if(!ugMon.isFireDragon){
      ugMon.mt++;
      if(ugMon.mt>100){ ugMon.dir*=-1; ugMon.mt=0; }
      const patrolRange=180;
      ugMon.x+=ugMon.dir*1.2;
      ugMon.x=Math.max(ugMon.patrol-patrolRange, Math.min(ugMon.patrol+patrolRange, ugMon.x));
    }
    ugMon.y=UG_GY-ugMon.h;
  }

  // Proximity to monster
  if(ugMon&&ugMon.alive){
    const dist=Math.hypot(UP.x+UP.w/2-ugMon.x-ugMon.w/2, UP.y+UP.h/2-ugMon.y-ugMon.h/2);
    const prompt=document.getElementById('ug-prompt');
    if(dist<90){
      if(prompt){ prompt.style.display='block'; prompt.textContent='[F / ⚔] KHIÊU CHIẾN — '+ugMon.name+' (HP '+ugMon.hp+')'; }
      if(ugKeys.attack){ ugKeys.attack=false; _startUGBattle(); }
    } else {
      if(prompt) prompt.style.display='none';
    }
  }

  // Door walk-through
  if(ugDoorOpen){
    const prompt=document.getElementById('ug-prompt');
    const atDoor=UP.x+UP.w>UG_W-70;
    if(atDoor&&prompt){ prompt.style.display='block'; prompt.textContent='→ ĐI TIẾP (tầng '+(undergroundFloor+1)+')'; }
    if(UP.x+UP.w>UG_W-10) _advanceUGFloor();
  }

  if(UP.attackAnim>0) UP.attackAnim--;
  if(UP.hurtAnim>0) UP.hurtAnim--;
  document.getElementById('ug-hp-txt').textContent='❤ '+playerHP;
}

// ── Start battle from underground ────────────────────────────
function _startUGBattle(){
  if(ugInBattle||!ugMon||!ugMon.alive) return;
  ugInBattle=true;
  // Build monster for the main battle system
  const m={
    ...ugMon,
    id:'ug_'+undergroundFloor,
    wx:2000,wy:0, alive:true, mt:0,
  };
  document.getElementById('underground-overlay').classList.remove('on');
  startBattle(m);
  gameState='BATTLE';
}

// Called by endBattle when underground battle ends
function _onUGBattleEnd(won){
  if(!undergroundActive) return;
  ugInBattle=false;
  setTimeout(()=>{
    if(!undergroundActive) return;
    document.getElementById('underground-overlay').classList.add('on');
    gameState='UNDERGROUND';
    if(won){
      ugMon.alive=false;
      ugDoorOpen=true;
      ugRoomCleared=true;
      showNotif('🏆 Thắng! Cửa mở — hãy đi tiếp!');
      document.getElementById('ug-prompt').style.display='none';
    } else {
      showNotif('💀 Bạn thua! Thử lại...');
    }
    if(ugCtx) _startUGLoop();
  }, 400);
}

// ── Draw one room ─────────────────────────────────────────────
// ── Pixel Art Fire Animation ─────────────────────────────────────
// 5-frame animation matching reference: orange base, yellow center, scattered sparks
// cx=canvas, bx/by=bottom-center position, frameN=frame counter, sc=scale(1=normal ~20px tall)
function _drawPixelFire(cx,bx,by,frameN,sc){
  if(!cx||!isFinite(bx)||!isFinite(by)) return;
  sc=sc||1;
  const ps=Math.max(1,Math.round(2*sc)); // pixel size
  const fr=Math.floor(frameN/6)%5; // 5 frames, ~10fps

  // Each frame: array of [col, gx, gy] where gx/gy are grid coords
  // Grid: 0,0 = top-left, positive y = down
  // bx/by = bottom-center of fire base
  // Palette
  const R='#dd2200'; // dark red-orange (outer)
  const O='#ff5500'; // orange (main body)
  const Y='#ff9900'; // yellow-orange
  const W='#ffdd00'; // yellow core
  const WW='#ffffff';// white hot center

  // 5 frames of pixel fire (each ~9 wide x 12 tall grid units)
  // Format: [col, dx_from_center, dy_from_bottom]
  const frames=[
    // Frame 0 — full tall flame
    [[O,-4,-1],[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],[O,4,-1],
     [O,-3,-2],[O,-2,-2],[O,-1,-2],[O,0,-2],[O,1,-2],[O,2,-2],[O,3,-2],
     [O,-2,-3],[Y,-1,-3],[Y,0,-3],[Y,1,-3],[O,2,-3],
     [O,-2,-4],[Y,-1,-4],[Y,0,-4],[Y,1,-4],[O,2,-4],
     [Y,-1,-5],[W,0,-5],[Y,1,-5],
     [Y,-1,-6],[W,0,-6],[Y,1,-6],
     [O,0,-7],[O,-1,-7],
     [O,0,-8],
     // sparks
     [R,-5,-2],[R,5,-2],[R,-4,-3],[R,4,-3],
     [R,-3,-6],[R,3,-5],[R,2,-7],[R,-2,-8],
     [R,1,-9],[R,-1,-10]],
    // Frame 1 — leaning right
    [[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],[O,4,-1],
     [O,-2,-2],[O,-1,-2],[O,0,-2],[O,1,-2],[O,2,-2],[O,3,-2],
     [O,-1,-3],[Y,0,-3],[Y,1,-3],[Y,2,-3],[O,3,-3],
     [Y,0,-4],[Y,1,-4],[W,2,-4],
     [Y,1,-5],[W,2,-5],[W,3,-5],
     [Y,2,-6],[Y,3,-6],
     [O,3,-7],
     [R,-4,-1],[R,5,-2],[R,6,-3],
     [R,-3,-4],[R,4,-6],[R,5,-7],[R,3,-8]],
    // Frame 2 — wide squat
    [[O,-4,-1],[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],[O,4,-1],
     [O,-4,-2],[O,-3,-2],[O,-2,-2],[O,-1,-2],[O,0,-2],[O,1,-2],[O,2,-2],[O,3,-2],[O,4,-2],
     [O,-3,-3],[Y,-2,-3],[Y,-1,-3],[Y,0,-3],[Y,1,-3],[Y,2,-3],[O,3,-3],
     [Y,-2,-4],[W,-1,-4],[W,0,-4],[W,1,-4],[Y,2,-4],
     [Y,-1,-5],[W,0,-5],[W,1,-5],[Y,2,-5],
     [Y,0,-6],[Y,1,-6],
     [R,-5,-1],[R,5,-1],[R,-5,-2],[R,5,-2],
     [R,-4,-4],[R,4,-4],[R,-3,-5],[R,3,-6]],
    // Frame 3 — leaning left
    [[O,-4,-1],[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],
     [O,-4,-2],[O,-3,-2],[O,-2,-2],[O,-1,-2],[O,0,-2],[O,1,-2],[O,2,-2],
     [O,-4,-3],[Y,-3,-3],[Y,-2,-3],[Y,-1,-3],[O,0,-3],
     [W,-3,-4],[W,-2,-4],[Y,-1,-4],
     [W,-3,-5],[W,-2,-5],[Y,-1,-5],
     [Y,-2,-6],[Y,-1,-6],
     [O,-2,-7],
     [R,4,-1],[R,-5,-2],[R,-6,-3],
     [R,-4,-6],[R,-5,-7],[R,-3,-8],[R,3,-5]],
    // Frame 4 — dying down
    [[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],
     [O,-2,-2],[Y,-1,-2],[Y,0,-2],[Y,1,-2],[O,2,-2],
     [Y,-1,-3],[W,0,-3],[W,1,-3],[Y,2,-3],
     [Y,0,-4],[W,1,-4],[Y,2,-4],
     [Y,1,-5],[Y,2,-5],
     [O,1,-6],
     [R,-4,-1],[R,4,-1],[R,-3,-2],[R,3,-3],
     [R,3,-7],[R,-2,-5],[R,2,-6]],
  ];

  cx.save();
  cx.imageSmoothingEnabled=false;
  const pixels=frames[fr];
  pixels.forEach(([col,dx,dy])=>{
    cx.fillStyle=col;
    cx.fillRect(
      Math.round(bx + dx*ps - ps/2),
      Math.round(by + dy*ps),
      ps, ps
    );
  });
  cx.restore();
}

function _drawUGRoom(){
  const W=ugCanvas.width, H=ugCanvas.height;
  const isHell=(undergroundFloor===10);
  const isBoss5=(undergroundFloor===5);
  const fl=UNDERGROUND_FLOORS[undergroundFloor-1];

  ugCtx.clearRect(0,0,W,H);

  // ── Background ──────────────────────────────────────────────
  if(isHell){
    // Hell: red-orange sky
    const hellBg=ugCtx.createLinearGradient(0,0,0,H);
    hellBg.addColorStop(0,'#1a0000');hellBg.addColorStop(0.5,'#2a0800');hellBg.addColorStop(1,'#3a0a00');
    ugCtx.fillStyle=hellBg;ugCtx.fillRect(0,0,W,H);

    // Distant hell mountains
    ugCtx.fillStyle='#0f0000';
    const hellMX=-(ugCamX*0.2)%400;
    ugCtx.beginPath();ugCtx.moveTo(hellMX,H);
    for(let hm=0;hm<10;hm++){ugCtx.lineTo(hellMX+hm*45+20,H*0.4+Math.sin(hm*1.8)*H*0.15);}
    ugCtx.lineTo(hellMX+450,H);ugCtx.closePath();ugCtx.fill();
  } else {
    // Normal cave room — darkness gradient deepens each floor
    const depth=undergroundFloor/10;
    const caveBg=ugCtx.createLinearGradient(0,0,0,H);
    caveBg.addColorStop(0,`hsl(20,${15-depth*8}%,${7-depth*4}%)`);
    caveBg.addColorStop(1,`hsl(10,${10-depth*5}%,${4-depth*3}%)`);
    ugCtx.fillStyle=caveBg;ugCtx.fillRect(0,0,W,H);

    // Parallax far wall texture (vertical cracks)
    for(let cr=0;cr<8;cr++){
      const crx=(cr*200-ugCamX*0.12+40)%W;
      ugCtx.strokeStyle=`rgba(60,30,0,${0.15+cr*0.02})`;ugCtx.lineWidth=1;
      ugCtx.beginPath();ugCtx.moveTo(crx,0);
      let cy2=0;while(cy2<H){cy2+=20;ugCtx.lineTo(crx+Math.sin(cr+cy2)*3,cy2);}
      ugCtx.stroke();
    }
  }

  // ── Ceiling stalactites ─────────────────────────────────────
  ugCtx.fillStyle=isHell?'#2a0500':'#1a1008';
  for(let s=0;s<18;s++){
    const sx=(s*95-ugCamX*0.8+30)%(W+80)-20;
    const sh=18+Math.sin(s*1.7)*15+Math.sin(ugFrame*0.015+s)*3;
    ugCtx.beginPath();ugCtx.moveTo(sx,UG_CEIL);ugCtx.lineTo(sx+10,UG_CEIL);ugCtx.lineTo(sx+5,UG_CEIL+sh);ugCtx.closePath();ugCtx.fill();
    if(isHell){// dripping lava
      ugCtx.globalAlpha=0.4+Math.sin(ugFrame*0.08+s)*0.3;
      ugCtx.fillStyle='#ff4400';ugCtx.beginPath();ugCtx.arc(sx+5,UG_CEIL+sh,2,0,Math.PI*2);ugCtx.fill();
      ugCtx.globalAlpha=1;ugCtx.fillStyle='#2a0500';
    }
  }

  // ── Ground / floor ──────────────────────────────────────────
  const groundColor=isHell?'#2a0a00':'#2a1a0a';
  ugCtx.fillStyle=groundColor;ugCtx.fillRect(0,UG_GY,W,H-UG_GY);
  // Ground detail line
  ugCtx.fillStyle=isHell?'#3a0e00':'#3d2a10';ugCtx.fillRect(0,UG_GY,W,4);

  if(isHell){
    // Lava cracks in floor
    for(let lc=0;lc<10;lc++){
      const lcx=(lc*160-ugCamX*0.9+50)%(W+100)-50;
      const glow=0.5+Math.sin(ugFrame*0.07+lc)*0.3;
      ugCtx.strokeStyle=`rgba(255,100,0,${glow})`;ugCtx.lineWidth=2;
      ugCtx.shadowColor='#ff4400';ugCtx.shadowBlur=5;
      ugCtx.beginPath();ugCtx.moveTo(lcx,UG_GY);ugCtx.bezierCurveTo(lcx+20,UG_GY+8,lcx+45,UG_GY+3,lcx+65,UG_GY+10);ugCtx.stroke();
      ugCtx.shadowBlur=0;
      // Small lava puddle
      const lvp=0.4+Math.sin(ugFrame*0.06+lc)*0.25;
      const lpg=ugCtx.createRadialGradient(lcx+32,UG_GY+5,1,lcx+32,UG_GY+5,18);
      lpg.addColorStop(0,`rgba(255,${120+Math.floor(lvp*80)},0,${lvp})`);lpg.addColorStop(1,'transparent');
      ugCtx.fillStyle=lpg;ugCtx.beginPath();ugCtx.ellipse(lcx+32,UG_GY+5,18,6,0,0,Math.PI*2);ugCtx.fill();
    }

    // ── PIXEL FIRE ANIMATIONS — along the floor only ────────────
    const firePositions=[
      80, 200, 340, 480, 620, 760, 920, 1080, 1240, 1400, 1540,
    ];
    firePositions.forEach((wx,fi)=>{
      const sx=wx-ugCamX;
      if(sx<-30||sx>W+30) return;
      const size=[2,2.8,2,2.4,2.6][fi%5];
      _drawPixelFire(ugCtx, sx, UG_GY-2, ugFrame+fi*7, size);
    });
  } else {
    // Stalagmites from floor
    ugCtx.fillStyle='#3a2a12';
    for(let s=0;s<8;s++){
      const sx=(s*210-ugCamX*0.8+80)%(W+100)-50;
      const sh=12+Math.sin(s*1.3)*10;
      ugCtx.beginPath();ugCtx.moveTo(sx,UG_GY);ugCtx.lineTo(sx+12,UG_GY);ugCtx.lineTo(sx+6,UG_GY-sh);ugCtx.closePath();ugCtx.fill();
    }
    // Torches on walls
    for(let t=0;t<5;t++){
      const tx=(t*340+120-ugCamX*0.95+10)%(W+50)-25;
      const ty=UG_CEIL+45;
      const flicker=0.5+Math.sin(ugFrame*0.13+t*1.5)*0.35;
      const tg=ugCtx.createRadialGradient(tx,ty,2,tx,ty,38);
      tg.addColorStop(0,`rgba(255,160,40,${flicker})`);tg.addColorStop(1,'transparent');
      ugCtx.fillStyle=tg;ugCtx.beginPath();ugCtx.arc(tx,ty,38,0,Math.PI*2);ugCtx.fill();
      ugCtx.fillStyle='#8b4513';ugCtx.fillRect(tx-3,ty+3,6,14);
      ugCtx.fillStyle='#ff8800';ugCtx.beginPath();ugCtx.arc(tx,ty,5+flicker*2,0,Math.PI*2);ugCtx.fill();
      ugCtx.fillStyle='#ffee66';ugCtx.beginPath();ugCtx.arc(tx,ty-3,3,0,Math.PI*2);ugCtx.fill();
    }
  }

  // ── Door (right side) ───────────────────────────────────────
  const doorWX=UG_W-60, doorRX=doorWX-ugCamX;
  if(doorRX>-30&&doorRX<W+10){
    const doorH=100, doorW=36, doorY=UG_GY-doorH;
    if(ugDoorOpen){
      // Open door — glowing portal
      const pg=ugCtx.createRadialGradient(doorRX+doorW/2,doorY+doorH/2,5,doorRX+doorW/2,doorY+doorH/2,doorH/2);
      const gp=0.6+Math.sin(ugFrame*0.08)*0.3;
      if(isHell){pg.addColorStop(0,`rgba(255,150,0,${gp})`);pg.addColorStop(1,'transparent');}
      else{pg.addColorStop(0,`rgba(80,220,255,${gp})`);pg.addColorStop(1,'transparent');}
      ugCtx.fillStyle=pg;ugCtx.beginPath();ugCtx.arc(doorRX+doorW/2,doorY+doorH/2,doorH/2,0,Math.PI*2);ugCtx.fill();
      ugCtx.fillStyle=isHell?'#1a0500':'#001a2a';ugCtx.fillRect(doorRX,doorY,doorW,doorH);
      // Shimmering opening
      ugCtx.save();ugCtx.globalAlpha=0.4+Math.sin(ugFrame*0.12)*0.3;
      ugCtx.fillStyle=isHell?'#ff8800':'#44ddff';
      ugCtx.fillRect(doorRX+4,doorY+4,doorW-8,doorH-8);ugCtx.restore();
      // Arrow
      ugCtx.fillStyle='#ffd700';ugCtx.font='bold 18px serif';ugCtx.textAlign='center';
      ugCtx.fillText('→',doorRX+doorW/2,doorY-8);
    } else {
      // Closed door — heavy stone gate
      ugCtx.fillStyle='#1a1008';ugCtx.fillRect(doorRX,doorY,doorW,doorH);
      ugCtx.strokeStyle='#4a3010';ugCtx.lineWidth=2;ugCtx.strokeRect(doorRX,doorY,doorW,doorH);
      // Bars
      for(let b=0;b<4;b++){
        ugCtx.fillStyle='#3a2808';ugCtx.fillRect(doorRX+4+b*7,doorY+5,5,doorH-10);
      }
      // Lock
      ugCtx.fillStyle='#5a3800';ugCtx.fillRect(doorRX+10,doorY+doorH/2-6,16,12);
      ugCtx.fillStyle='#ffd700';ugCtx.beginPath();ugCtx.arc(doorRX+18,doorY+doorH/2-6,5,0,Math.PI*2);ugCtx.fill();
      // Warning text
      ugCtx.fillStyle='rgba(200,80,0,0.8)';ugCtx.font='bold 10px serif';ugCtx.textAlign='center';
      ugCtx.fillText('🔒 ĐÁ BẠI',doorRX+doorW/2+4,doorY-6);
      ugCtx.fillText('QUÁI ĐỂ',doorRX+doorW/2+4,doorY-16);
      ugCtx.fillText('MỞ CỬA',doorRX+doorW/2+4,doorY-26);
    }
  }

  // ── Entry arch (left) ───────────────────────────────────────
  const entryRX=0-ugCamX;
  if(entryRX>-40&&entryRX<80){
    ugCtx.fillStyle='#0a0500';ugCtx.fillRect(0,UG_GY-90,20,90);
    ugCtx.strokeStyle='#4a3010';ugCtx.lineWidth=2;ugCtx.strokeRect(0,UG_GY-90,20,90);
  }

  // ── Monster ─────────────────────────────────────────────────
  if(ugMon&&ugMon.alive){
    const mx=ugMon.x-ugCamX, my=ugMon.y;
    const mw=ugMon.w, mh=ugMon.h;

    // Aura
    if(ugMon.isFireDragon||ugMon.isBoss){
      ugCtx.save();
      const aColor=ugMon.isFireDragon?`rgba(255,80,0,`:`rgba(150,0,200,`;
      const ap=0.2+Math.sin(ugFrame*0.07)*0.1;
      const ag=ugCtx.createRadialGradient(mx+mw/2,my+mh/2,5,mx+mw/2,my+mh/2,mw*0.8);
      ag.addColorStop(0,aColor+ap+')');ag.addColorStop(1,'transparent');
      ugCtx.fillStyle=ag;ugCtx.beginPath();ugCtx.ellipse(mx+mw/2,my+mh/2,mw*0.8,mh*0.7,0,0,Math.PI*2);ugCtx.fill();
      ugCtx.restore();
    }

    ugCtx.save();
    if(ugMon.isFireDragon){
      // Hỏa Long Vương — sc=3 (177×171px), quay trái, đứng im
      // Chân tại my+mh, tâm x tại mx+mw/2
      drawFireDragon(ugCtx, mx+mw/2-88, my+mh-171, false, 0); // false=nhìn trái, 0=đứng im
    } else if(ugMon.isBoss){
      // Boss dragon (floor 5 sub-boss)
      ugCtx.translate(mx+mw/2, my+mh);
      ugCtx.scale(0.6,0.6);
      ugCtx.translate(-(mx+mw/2),-(my+mh));
      drawDragon(ugCtx, mx+mw/2-52, my+mh-88, true, ugFrame);
    } else {
      // Use real world monster pixel art sprites
      // Adjust y so visual feet touch ground (UG_GY)
      // Each sprite's visual bottom pixel offset from sprite top
      const _footOff = ugMon.type==='bat'?24 : ugMon.type==='orc'?70 : 54; // goblin=54 default
      const _ry = UG_GY - _footOff; // render y so visual feet = UG_GY
      if(ugMon.type==='goblin')      drawGoblin(ugCtx, mx, _ry, ugMon.dir>0, ugFrame);
      else if(ugMon.type==='bat')    drawBat(ugCtx, mx, _ry, ugFrame);
      else if(ugMon.type==='orc')    drawOrc(ugCtx, mx, _ry, ugMon.dir>0, ugFrame);
      else drawGoblin(ugCtx, mx, _ry, ugMon.dir>0, ugFrame); // fallback
    }
    ugCtx.restore();

    // HP bar
    const bw=mw+10, bx=mx-5, by=my-14;
    ugCtx.fillStyle='rgba(0,0,0,0.7)';ugCtx.fillRect(bx,by,bw,7);
    const hpPct=ugMon.hp/ugMon.maxHp;
    ugCtx.fillStyle=hpPct>0.6?'#ff4444':hpPct>0.3?'#ff8800':'#e74c3c';
    ugCtx.fillRect(bx,by,bw*hpPct,7);
    ugCtx.strokeStyle='rgba(255,255,255,0.25)';ugCtx.lineWidth=0.5;ugCtx.strokeRect(bx,by,bw,7);

    // Name tag
    ugCtx.fillStyle='rgba(0,0,0,0.8)';ugCtx.fillRect(mx+mw/2-38,by-14,76,12);
    ugCtx.fillStyle='#ffcc44';ugCtx.font='bold 10px "Times New Roman"';ugCtx.textAlign='center';
    ugCtx.fillText(ugMon.name,mx+mw/2,by-4);

    // Patrol eyes glow
    const epulse=0.6+Math.sin(ugFrame*0.15)*0.4;
    ugCtx.save();ugCtx.globalCompositeOperation='lighter';ugCtx.globalAlpha=epulse;
    const eyeC=ugMon.isFireDragon?'#ff6600':'#ff2200';
    [[mx+mw*0.35,my+mh*0.3],[mx+mw*0.65,my+mh*0.3]].forEach(([ex,ey])=>{
      const eg=ugCtx.createRadialGradient(ex,ey,0,ex,ey,5);
      eg.addColorStop(0,eyeC);eg.addColorStop(1,'transparent');
      ugCtx.fillStyle=eg;ugCtx.beginPath();ugCtx.arc(ex,ey,5,0,Math.PI*2);ugCtx.fill();
    });
    ugCtx.restore();
  }

  // ── Player ──────────────────────────────────────────────────
  const prx=UP.x-ugCamX;
  ugCtx.save();
  if(UP.hurtAnim>0){ugCtx.globalAlpha=0.5+Math.sin(UP.hurtAnim*0.5)*0.5;}
  // Draw player using main drawKnight function
  const ugWalking=Math.abs(UP.vx)>0.3&&UP.onGround;
  drawKnight(ugCtx,prx,UP.y,UP.facing<0,ugWalking,ugFrame,false);
  ugCtx.restore();

  // ── Hell floor 10 extra effects ─────────────────────────────
  if(isHell){
    // Overhead glow
    ugCtx.save();ugCtx.globalAlpha=0.08+Math.sin(ugFrame*0.04)*0.04;
    const hg=ugCtx.createRadialGradient(W/2,H,10,W/2,H,W*0.8);
    hg.addColorStop(0,'rgba(255,80,0,1)');hg.addColorStop(1,'transparent');
    ugCtx.fillStyle=hg;ugCtx.fillRect(0,0,W,H);ugCtx.restore();

    // Floor title
    ugCtx.save();ugCtx.globalAlpha=0.7+Math.sin(ugFrame*0.06)*0.3;
    ugCtx.fillStyle='#ff4400';ugCtx.font='bold 13px "Times New Roman"';ugCtx.textAlign='left';
    ugCtx.shadowColor='#ff2200';ugCtx.shadowBlur=12;
    ugCtx.fillText('🔥 ĐỊA NGỤC — TẦNG 10',12,20);ugCtx.restore();
  } else {
    // Floor label
    ugCtx.fillStyle='rgba(200,130,60,0.55)';ugCtx.font='bold 11px "Times New Roman"';ugCtx.textAlign='left';
    ugCtx.fillText('⛏ '+fl.name,10,18);
  }

  // ── Depth fog overlay ───────────────────────────────────────
  const fogAlpha=0.03*(undergroundFloor-1);
  if(fogAlpha>0){
    ugCtx.save();ugCtx.globalAlpha=fogAlpha;
    ugCtx.fillStyle='#000';ugCtx.fillRect(0,0,W,H);ugCtx.restore();
  }
}

// ── Simple sprite for regular underground monsters ────────────
function _drawUGMonsterSprite(c,type,x,y,w,h,dir,fr){
  c.save();
  if(dir>0){c.translate(x+w,y+h);c.scale(-1,1);c.translate(-w,-h);}
  else{c.translate(x,y);}
  const sc=w/44;
  c.scale(sc,h/70);
  if(type==='goblin'){
    c.fillStyle='#2d5a1b';c.fillRect(8,20,28,30); // body
    c.fillStyle='#3d7a28';c.fillRect(10,8,24,20); // head
    c.fillStyle='#ff2222';c.fillRect(12,12,8,5);c.fillRect(24,12,8,5); // eyes
    c.fillStyle='#5a3010';c.fillRect(6,50,10,20);c.fillRect(28,50,10,20); // legs
    c.fillStyle='#3a2008';c.fillRect(0,22,8,20);c.fillRect(36,22,8,20); // arms
    c.fillStyle='#8b6914';c.fillRect(30,15,14,4); // ear
  } else if(type==='bat'){
    c.fillStyle='#2a0a2a';c.fillRect(14,22,16,18); // body
    c.fillStyle='#3a1040';c.fillRect(8,14,28,14); // head
    c.fillStyle='#ff3333';c.fillRect(12,16,6,4);c.fillRect(26,16,6,4); // eyes
    c.fillStyle='#1a0820';c.fillRect(0,10,15,25);c.fillRect(29,10,15,25); // wings
    c.fillStyle='#cc00cc';c.fillRect(16,5,12,8); // ear
  } else {
    // orc
    c.fillStyle='#3a5a1a';c.fillRect(6,14,32,36); // body
    c.fillStyle='#4a7022';c.fillRect(8,2,28,22); // head
    c.fillStyle='#ff4444';c.fillRect(10,6,8,6);c.fillRect(26,6,8,6); // eyes
    c.fillStyle='#4a3010';c.fillRect(4,50,12,20);c.fillRect(28,50,12,20); // legs
    c.fillStyle='#2a1a06';c.fillRect(0,16,8,24);c.fillRect(36,16,8,24); // arms
    c.fillStyle='#8b6914';c.fillRect(36,0,8,18); // weapon
  }
  // Walk animation bob
  const bob=Math.sin(fr*0.12)*2;
  c.translate(0,bob);
  c.restore();
}

// ── Main underground game loop ───────────────────────────────
function _startUGLoop(){
  if(ugAnimId) cancelAnimationFrame(ugAnimId);
  function ugLoop(){
    if(gameState!=='UNDERGROUND'){ ugAnimId=null; return; }
    ugFrame++;
    _updateUGPhysics();
    _drawUGRoom();
    ugAnimId=requestAnimationFrame(ugLoop);
  }
  ugLoop();
}

// ── Wire touch controls ──────────────────────────────────────
(function(){
  function wireUG(id, downKey, upKey){
    const el=document.getElementById(id);
    if(!el) return;
    el.addEventListener('touchstart',e=>{e.preventDefault();ugKeys[downKey]=true;if(upKey)ugKeys[upKey]=false;},{passive:false});
    el.addEventListener('touchend',e=>{e.preventDefault();ugKeys[downKey]=false;},{passive:false});
    el.addEventListener('mousedown',()=>{ugKeys[downKey]=true;});
    el.addEventListener('mouseup',()=>{ugKeys[downKey]=false;});
  }
  wireUG('ug-left','left');
  wireUG('ug-right','right');
  wireUG('ug-jump','jump');
  wireUG('ug-attack','attack');
})();

// ── Keyboard pass-through for underground ───────────────────
document.addEventListener('keydown',e=>{
  if(gameState!=='UNDERGROUND') return;
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') ugKeys.left=true;
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') ugKeys.right=true;
  if((e.key==='ArrowUp'||e.key===' '||e.key==='w'||e.key==='W')&&!e.repeat) ugKeys.jump=true;
  if(e.key==='f'||e.key==='F') ugKeys.attack=true;
  if(e.key==='Escape') exitUnderground();
},{capture:false});
document.addEventListener('keyup',e=>{
  if(gameState!=='UNDERGROUND') return;
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') ugKeys.left=false;
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') ugKeys.right=false;
  if(e.key==='ArrowUp'||e.key===' '||e.key==='w'||e.key==='W') ugKeys.jump=false;
  if(e.key==='f'||e.key==='F') ugKeys.attack=false;
},{capture:false});