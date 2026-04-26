// ═══════════════════════════════════════════
// PHYSICS
// ═══════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// OCEAN WORLD — thế giới đại dương khi nhảy vào portal
// ══════════════════════════════════════════════════════════════

function startOceanBattle(floorData){
  const mon={
    ...floorData.monster,
    wx:0,wy:0,w:44,h:72,
    alive:true,dir:-1,mt:0,
  };
  // Dùng hệ thống battle hiện có
  startBattle(mon);
  // Sau khi thắng sẽ gọi endBattle → ta hook vào onBattleWin
  window._oceanBattlePending=true;
}

// Hook endBattle để biết khi nào thắng trong ocean
const _origEndBattle=window.endBattle||function(){};
window.endBattle=function(won,rw,...args){
  if(won && window._oceanBattlePending && inOcean){
    window._oceanBattlePending=false;
    oceanFloorCleared=true;
    oceanBattleActive=false;
    showNotif('✅ Thắng! '+(oceanFloor<10?'Tìm cửa tiếp theo →':'Chinh phục Đại Dương! 🏆'));
  } else if(!won && window._oceanBattlePending){
    // Thua: reset để cho chiến lại
    window._oceanBattlePending=false;
    oceanBattleActive=false;
  }
  _origEndBattle(won,rw,...args);
};

function initOceanWorld(){
  inOcean=true; oceanFloor=1; oceanFloorCleared=false; oceanDoorOpen=false; oceanBattleActive=false;
  const CP=['#ff2266','#ff6600','#ff44aa','#ee1155','#ff8800','#cc44ff','#ff44cc','#ffaa00','#22ddbb','#ff5533','#dd2288','#ffcc44'];
  oceanCorals=[];
  for(let i=0;i<36;i++) oceanCorals.push({x:20+i*55+Math.random()*30,y:OCEAN_H-38,col:CP[i%CP.length],col2:CP[(i+4)%CP.length],h:18+Math.random()*44,type:['branch','fan','round','tube','bush','spike'][Math.floor(Math.random()*6)],seed:Math.floor(Math.random()*999)});
  oceanRuins=[
    {x:80,type:'wall',w:90,h:160,seed:11},{x:250,type:'arch',w:80,h:130,seed:22},
    {x:420,type:'pillar',w:16,h:120,seed:33},{x:520,type:'rubble',w:60,h:40,seed:44},
    {x:680,type:'wall',w:70,h:100,seed:55},{x:850,type:'arch',w:88,h:140,seed:66},
    {x:1020,type:'pillar',w:14,h:90,seed:77},{x:1150,type:'wall',w:80,h:120,seed:88},
    {x:1350,type:'arch',w:76,h:150,seed:99},{x:1550,type:'pillar',w:16,h:110,seed:110},
    {x:1700,type:'rubble',w:70,h:45,seed:121},{x:1860,type:'wall',w:85,h:130,seed:132},
  ];
  oceanSeaweed=[];
  for(let i=0;i<28;i++) oceanSeaweed.push({x:40+i*72+Math.random()*40,h:28+Math.random()*48,col:['#1a6622','#228833','#33aa44','#2d7a3a','#44bb55','#1a8830'][i%6],phase:Math.random()*Math.PI*2,segs:6+Math.floor(Math.random()*5)});
  oceanFish=[];
  const FP=[{c:'#ff5533',c2:'#ffaa44',sz:9},{c:'#ffcc00',c2:'#ff9900',sz:7},{c:'#3399ff',c2:'#88ccff',sz:10},{c:'#ff66bb',c2:'#ffaadd',sz:6},{c:'#88ffaa',c2:'#33cc66',sz:8},{c:'#cc44ff',c2:'#ee99ff',sz:7},{c:'#ff4444',c2:'#ff9999',sz:11},{c:'#ffee44',c2:'#ffcc00',sz:5}];
  for(let i=0;i<16;i++){const fp=FP[i%FP.length];oceanFish.push({x:Math.random()*OCEAN_W,y:OCEAN_SURF+50+Math.random()*(OCEAN_H-OCEAN_SURF-230),vx:(0.4+Math.random()*0.9)*(Math.random()<0.5?1:-1),vy:(Math.random()-0.5)*0.3,col:fp.c,col2:fp.c2,size:fp.sz,tailPhase:Math.random()*Math.PI*2});}
  oceanSmallFish=[];
  const SC=['#88ccff','#ffee88','#ffaacc','#aaffcc'];
  for(let s=0;s<4;s++){const bx=100+s*480,by=OCEAN_SURF+80+s*50;for(let f=0;f<7;f++)oceanSmallFish.push({x:bx+Math.random()*80,y:by+Math.random()*28,vx:0.5+Math.random()*0.3,vy:0,col:SC[s],school:s});}
  oceanBubbles=[];
  for(let i=0;i<45;i++) oceanBubbles.push({x:Math.random()*OCEAN_W,y:OCEAN_H-Math.random()*320,r:0.7+Math.random()*3.2,vy:0.22+Math.random()*0.55});
  oceanDebris=[];
  for(let i=0;i<20;i++) oceanDebris.push({x:60+i*98+Math.random()*60,w:5+Math.random()*12,h:8+Math.random()*16,col:['#667799','#778899','#556688'][i%3]});
  P.x=200;P.y=OCEAN_SURF+50;P.vx=0;P.vy=0;
  oceanCam.x=Math.max(0,Math.min(OCEAN_W-GW,P.x-GW/2));oceanCam.y=0;
  document.getElementById('ocean-exit-btn').style.display='block';
  showNotif('🌊 Vương Quốc Đáy Biển! Nhảy lên để thoát.');
}

function exitOceanWorld(){
  inOcean=false; P.x=LAKE_X2+80; P.y=GND-GRASS_H-P.h-2; P.vy=-3; P.vx=1; P.onGround=false;
  cam.x=Math.max(0,Math.min(WORLD_W-GW,P.x+P.w/2-GW/2));
  document.getElementById('ocean-exit-btn').style.display='none';
  showNotif('🌿 Bạn đã trở về mặt đất!');
}

function updateOcean(){
  if(!inOcean)return;
  if(keys['a']||keys['A']||keys['ArrowLeft']){P.vx=-P.speed;P.facing=-1;}
  else if(keys['d']||keys['D']||keys['ArrowRight']){P.vx=P.speed;P.facing=1;}
  else P.vx*=0.75;
  if(jumpPressed&&P.onGround){P.vy=-9;P.onGround=false;spawnParticles(P.x+P.w/2,P.y+P.h,'#88ddff',5,1.5);}
  jumpPressed=false;
  if(P.attackAnim>0)P.attackAnim--;
  if(P.hurtAnim>0)P.hurtAnim--;
  oceanFish.forEach(f=>{f.x+=f.vx;f.y+=Math.sin(frameCount*0.02+f.x*0.01)*0.3;if(f.x<0)f.x=OCEAN_W;if(f.x>OCEAN_W)f.x=0;if(f.y<OCEAN_SURF+30)f.y=OCEAN_SURF+30;if(f.y>OCEAN_H-120)f.y=OCEAN_H-120;});
  if(oceanSmallFish)oceanSmallFish.forEach(f=>{f.x+=f.vx;f.y+=Math.sin(frameCount*0.05+f.x*0.03+f.school)*0.35;if(f.x<20)f.vx=Math.abs(f.vx);if(f.x>OCEAN_W-20)f.vx=-Math.abs(f.vx);if(f.y<OCEAN_SURF+30)f.y=OCEAN_SURF+30;if(f.y>OCEAN_H-70)f.y=OCEAN_H-70;});
  oceanBubbles.forEach(b=>{b.y-=b.vy;b.x+=Math.sin(frameCount*0.03+b.y*0.01)*0.35;if(b.y<OCEAN_SURF){b.y=OCEAN_H-20;b.x=Math.random()*OCEAN_W;}});
  const seaBedY=OCEAN_H-40;
  if(!P.onGround)P.vy+=0.45;
  P.vy=Math.max(-10,Math.min(10,P.vy));
  P.x+=P.vx;P.y+=P.vy;
  P.x=Math.max(0,Math.min(OCEAN_W-P.w,P.x));
  P.onGround=false;
  if(P.y+P.h>=seaBedY){P.y=seaBedY-P.h;P.vy=0;P.onGround=true;}
  if(P.y<=OCEAN_SURF){P.y=OCEAN_SURF;if(P.vy<0)P.vy=0;}
  oceanCam.x=Math.max(0,Math.min(OCEAN_W-GW,P.x+P.w/2-GW/2));
  oceanCam.y=Math.max(0,Math.min(OCEAN_H-GH,P.y+P.h/2-GH*0.5));
}

function renderOcean(){
  if(!inOcean)return;
  ctx.clearRect(0,0,GW,GH);
  const cx=oceanCam.x,cy=oceanCam.y;
  const sandY_w=OCEAN_H-40, sandY_s=sandY_w-cy;

  // 1. Nền gradient
  const bg=ctx.createLinearGradient(0,0,0,GH);
  bg.addColorStop(0,'#1a4a7a');bg.addColorStop(0.2,'#0e3868');
  bg.addColorStop(0.5,'#082850');bg.addColorStop(0.8,'#041830');bg.addColorStop(1,'#020e1e');
  ctx.fillStyle=bg;ctx.fillRect(0,0,GW,GH);

  // 2. Tia sáng caustic
  ctx.save();
  for(let r=0;r<9;r++){
    const rx=GW*(0.08+r*0.105)+Math.sin(frameCount*0.016+r*0.9)*18;
    const rw=5+Math.sin(frameCount*0.022+r*0.6)*3;
    ctx.globalAlpha=0.055+Math.sin(frameCount*0.02+r*0.7)*0.02;
    ctx.fillStyle='#aaddff';
    ctx.beginPath();ctx.moveTo(rx-rw,0);ctx.lineTo(rx+rw,0);ctx.lineTo(rx+rw*4,GH);ctx.lineTo(rx-rw*4,GH);ctx.closePath();ctx.fill();
  }ctx.restore();

  // 3. Hạt phù du
  ctx.save();ctx.globalAlpha=0.4;
  for(let p=0;p<30;p++){
    const px=((p*149+frameCount*0.22+cx*0.07)%GW),py=((p*97+frameCount*(0.06+p%5*0.025))%GH);
    ctx.fillStyle=p%3===0?'#aaffee':p%3===1?'#88ddff':'#ffeebb';
    ctx.fillRect(px,py,1,1);
  }ctx.restore();

  // 4. Cá nhỏ theo đàn
  if(oceanSmallFish){ctx.save();
    oceanSmallFish.forEach(f=>{
      const fx=f.x-cx,fy=f.y-cy;
      if(fx<-8||fx>GW+8||fy<-8||fy>GH+8)return;
      ctx.fillStyle=f.col;ctx.globalAlpha=0.75;
      ctx.fillRect(fx-(f.vx>0?3:0),fy-1,4,2);
      ctx.fillRect(fx+(f.vx>0?-5:1),fy-2,2,4);
    });ctx.restore();
  }

  // 5. Cá lớn pixel-art
  oceanFish.forEach(f=>{
    const fx=f.x-cx,fy=f.y-cy;
    if(fx<-30||fx>GW+30||fy<-20||fy>GH+20)return;
    _drawPixelFish(ctx,fx,fy,f);
  });

  // 6. Bong bóng
  ctx.save();
  oceanBubbles.forEach(b=>{
    const bx=b.x-cx,by2=b.y-cy;
    if(bx<-8||bx>GW+8||by2<-8||by2>GH+8)return;
    ctx.globalAlpha=0.5;ctx.strokeStyle='#88ddff';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.arc(bx,by2,b.r,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=0.2;ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(bx-b.r*0.3,by2-b.r*0.3,b.r*0.35,0,Math.PI*2);ctx.fill();
  });ctx.restore();

  // 7. Đáy biển
  if(sandY_s<GH+20){
    const sg=ctx.createLinearGradient(0,sandY_s,0,sandY_s+60);
    sg.addColorStop(0,'#b8945a');sg.addColorStop(0.5,'#997040');sg.addColorStop(1,'#705028');
    ctx.fillStyle=sg;ctx.fillRect(0,sandY_s,GW,GH-sandY_s+2);
    ctx.save();ctx.globalAlpha=0.22;ctx.strokeStyle='#7a5020';ctx.lineWidth=0.9;
    for(let ri=0;ri<6;ri++){const ry=sandY_s+5+ri*10;ctx.beginPath();ctx.moveTo(0,ry);for(let rx2=0;rx2<GW;rx2+=26)ctx.quadraticCurveTo(rx2+13,ry-2,rx2+26,ry);ctx.stroke();}
    ctx.restore();
    if(oceanDebris)oceanDebris.forEach(d=>{const dx=d.x-cx;if(dx<-20||dx>GW+20)return;ctx.fillStyle=d.col;ctx.fillRect(dx-d.w/2,sandY_s-d.h,d.w,d.h);ctx.fillStyle='rgba(180,210,240,0.3)';ctx.fillRect(dx-d.w/2,sandY_s-d.h,d.w,2);});
    if(oceanRuins)oceanRuins.forEach(ruin=>{const rx=ruin.x-cx;if(rx<-150||rx>GW+150)return;_drawPixelRuin(ctx,rx,sandY_s-ruin.h,ruin);});
    oceanCorals.forEach(cr=>{const crx=cr.x-cx;if(crx<-60||crx>GW+60)return;_drawPixelCoral(ctx,crx,sandY_s,cr);});
    if(oceanSeaweed)oceanSeaweed.forEach(sw=>{const swx=sw.x-cx;if(swx<-30||swx>GW+30)return;_drawPixelSeaweed(ctx,swx,sandY_s,sw);});
  }

  // 8. Mặt nước
  const surf_s=OCEAN_SURF-cy;
  if(surf_s>-10&&surf_s<GH+10){
    ctx.save();
    const sG=ctx.createLinearGradient(0,surf_s,0,surf_s+30);
    sG.addColorStop(0,'rgba(120,210,255,0.6)');sG.addColorStop(1,'transparent');
    ctx.fillStyle=sG;ctx.fillRect(0,surf_s,GW,30);
    ctx.strokeStyle='#66bbee';ctx.lineWidth=1.5;ctx.globalAlpha=0.7;
    for(let w=0;w<6;w++){const wy=surf_s+2+w*5+Math.sin(frameCount*0.05+w*0.9)*2;ctx.beginPath();ctx.moveTo(0,wy);for(let wx=0;wx<GW;wx+=30)ctx.quadraticCurveTo(wx+15,wy-2,wx+30,wy);ctx.stroke();}
    ctx.globalAlpha=0.55;ctx.fillStyle='#cceeff';
    for(let s=0;s<14;s++)ctx.fillRect(((s*83+frameCount*2)%GW),surf_s+1+Math.sin(frameCount*0.1+s)*2,2,1);
    ctx.restore();
  }

  // 9. Player
  drawKnight(ctx,P.x-cx,P.y-cy,P.facing<0,false,frameCount,true);

  // 10. Monster
  const oFloor=oceanChallengeFloors[oceanFloor-1];
  if(!oceanFloorCleared&&oFloor){
    // Non-boss: swim back/forth with flip + walk animation
    const _isBoss = oFloor.monster && oFloor.monster.isBoss;
    // Swim oscillation
    const _swimSpeed = _isBoss ? 0 : 0.022;
    const _swimAmp   = _isBoss ? 0 : 70;
    const _swimVal   = Math.sin(frameCount * _swimSpeed); // -1..1
    const _swimX     = _swimVal * _swimAmp;
    const _swimDir   = Math.cos(frameCount * _swimSpeed); // >0=right, <0=left
    const _mworldX   = OCEAN_W * 0.75 + _swimX;
    const mx = _mworldX - cx;
    const sandY_s=sandY_w-cy;
    // Walk/swim frame — faster cycle when moving
    const _animSpeed = _isBoss ? 8 : 5;
    const mf = Math.floor(frameCount / _animSpeed);
    const _dfn = oFloor.drawFn ? window[oFloor.drawFn] : null;
    const _sc  = oFloor.sc || 1;
    const _anchor = oFloor.anchorRows || 20;
    const _my = sandY_s - _anchor * _sc;
    ctx.save();
    if(typeof _dfn === 'function'){
      // Each sprite has its own default facing direction:
      // shark: faces LEFT by default → flip when swimming RIGHT (_swimDir > 0)
      // tropical/octopus/squid/crab: faces RIGHT → flip when swimming LEFT (_swimDir < 0)
      const _sharkType = oFloor.drawFn === 'drawShark' || oFloor.drawFn === 'drawSharkSwim';
      const _shouldFlip = _sharkType ? (_swimDir > 0) : (_swimDir < 0);
      if(!_isBoss && _shouldFlip){
        ctx.save();
        ctx.translate(mx, 0);
        ctx.scale(-1, 1);
        ctx.translate(-mx, 0);
        _dfn(ctx, mx, _my, mf, _sc);
        ctx.restore();
      } else {
        _dfn(ctx, mx, _my, mf, _sc);
      }
    }
    ctx.restore();
    const _anchor2 = oFloor.anchorRows || 20;
    const _topRows = oFloor.topRows || 0;
    const _my2 = sandY_s - _anchor2 * _sc;
    const _barY = _my2 - _topRows * _sc - 20;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(mx-44,_barY,88,10);
    ctx.fillStyle='#e74c3c';ctx.fillRect(mx-44,_barY,88*(oFloor.monster.hp/oFloor.monster.maxHp),10);
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=0.5;ctx.strokeRect(mx-44,_barY,88,10);
    ctx.fillStyle='#fff';ctx.font='bold 8px serif';ctx.textAlign='center';
    ctx.fillText(oFloor.monster.name,mx,_barY-4);ctx.restore();
    if(Math.hypot(P.x-_mworldX,P.y-(sandY_w-40))<160){
      ctx.save();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(GW/2-80,GH/2-12,160,20);
      ctx.fillStyle='#ffcc44';ctx.font='bold 9px serif';ctx.textAlign='center';ctx.fillText('[F] CHIẾN ĐẤU: '+oFloor.monster.name,GW/2,GH/2+2);ctx.restore();
      if(P.attackAnim>0&&!oceanBattleActive){oceanBattleActive=true;startOceanBattle(oFloor);}
    }
  }
  if(oceanFloorCleared){
    const dx=OCEAN_W*0.9-cx,dy=sandY_w-cy-50;
    ctx.save();ctx.globalAlpha=0.5+Math.sin(frameCount*0.1)*0.3;ctx.fillStyle='#00ffee';ctx.fillRect(dx-12,dy,24,48);
    ctx.globalAlpha=1;ctx.strokeStyle='#00ffee';ctx.lineWidth=2;ctx.strokeRect(dx-12,dy,24,48);
    ctx.fillStyle='#fff';ctx.font='bold 8px serif';ctx.textAlign='center';ctx.fillText(oceanFloor<10?'TẦNG '+(oceanFloor+1):'CHIẾN THẮNG!',dx,dy-6);ctx.restore();
    if(Math.abs(P.x-(OCEAN_W*0.9))<40&&Math.abs((P.y+P.h)-(sandY_w-2))<30){
      if(oceanFloor<10){oceanFloor++;oceanFloorCleared=false;oceanBattleActive=false;const nf=oceanChallengeFloors[oceanFloor-1];if(nf)nf.monster.hp=nf.monster.maxHp;showNotif('🌊 Tầng '+oceanFloor+'/10 — '+nf.name);}
      else{exitOceanWorld();showNotif('🏆 Chinh phục Đại Dương! +500 xu!');coins+=500;updateHUD();}
    }
  }

  // 11. HUD
  ctx.save();ctx.fillStyle='rgba(0,12,40,0.88)';ctx.fillRect(0,0,GW,18);
  ctx.fillStyle='#66ccff';ctx.font='bold 9px serif';ctx.textAlign='left';
  ctx.fillText('🌊 ĐẠI DƯƠNG — Tầng '+oceanFloor+'/10: '+(oceanChallengeFloors[oceanFloor-1]?.name||''),6,12);
  ctx.textAlign='right';ctx.fillStyle='#88ddff';ctx.fillText('[F] Đánh | [E] Thoát',GW-6,12);ctx.restore();
}

// ━━━━━ PIXEL-ART HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function _drawPixelRuin(ctx,rx,ry,ruin){
  ctx.save();
  const SL='#99aacc',SM='#7788aa',SD='#556688',SS='#334455';
  const w=ruin.w,h=ruin.h;
  if(ruin.type==='arch'){
    const pw=14;
    for(let row=0;row<h;row+=6){
      ctx.fillStyle=row%12===0?SL:SM;ctx.fillRect(rx,ry+row,pw,5);
      ctx.fillStyle=SD;ctx.fillRect(rx+pw-2,ry+row,2,5);
      ctx.fillStyle=SS;ctx.fillRect(rx,ry+row+5,pw,1);
      ctx.fillStyle=row%12===0?SL:SM;ctx.fillRect(rx+w-pw,ry+row,pw,5);
      ctx.fillStyle=SD;ctx.fillRect(rx+w-pw,ry+row,2,5);
      ctx.fillStyle=SS;ctx.fillRect(rx+w-pw,ry+row+5,pw,1);
    }
    const ah=Math.round(h*0.22);
    for(let ax=pw;ax<w-pw;ax+=8){
      const bh=5+(ax%16===0?4:0);
      ctx.fillStyle=SM;ctx.fillRect(rx+ax,ry,8,ah+bh);
      ctx.fillStyle=SL;ctx.fillRect(rx+ax,ry,8,1);
      ctx.fillStyle=SD;ctx.fillRect(rx+ax+6,ry,2,ah+bh);
    }
    for(let g=pw;g<w-pw;g+=20){if((ruin.seed+g)%3===0)ctx.clearRect(rx+g,ry,6,ah*0.4);}
    ctx.fillStyle='rgba(20,80,35,0.5)';ctx.fillRect(rx,ry,pw,7);ctx.fillRect(rx+w-pw,ry,pw,7);
  }else if(ruin.type==='pillar'){
    for(let row=0;row<h;row+=6){
      ctx.fillStyle=row%12===0?SL:SM;ctx.fillRect(rx,ry+row,w,5);
      ctx.fillStyle='rgba(180,200,240,0.2)';ctx.fillRect(rx,ry+row,2,5);
      ctx.fillStyle=SD;ctx.fillRect(rx+w-2,ry+row,2,5);
      ctx.fillStyle=SS;ctx.fillRect(rx,ry+row+5,w,1);
    }
    ctx.fillStyle=SL;ctx.fillRect(rx-5,ry,w+10,6);ctx.fillRect(rx-3,ry+6,w+6,3);
    for(let c=0;c<w;c+=4)if((ruin.seed+c)%5===0)ctx.clearRect(rx+c,ry,3,5);
    ctx.fillStyle='rgba(20,80,35,0.5)';ctx.fillRect(rx,ry,w,5);
  }else if(ruin.type==='wall'){
    for(let row=0;row<h;row+=7){
      const off=(Math.floor(row/7))%2===0?0:9;
      for(let col=0;col<w;col+=18){
        const bx=rx+col+off;if(bx>rx+w)break;
        const bw=Math.min(17,rx+w-bx);
        ctx.fillStyle=SM;ctx.fillRect(bx,ry+row,bw,6);
        ctx.fillStyle=SL;ctx.fillRect(bx,ry+row,bw,1);
        ctx.fillStyle=SD;ctx.fillRect(bx+bw-1,ry+row,1,6);
        ctx.fillStyle=SS;ctx.fillRect(bx,ry+row+6,bw,1);
      }
    }
    for(let c=0;c<w;c+=9)if((ruin.seed+c)%3!==0)ctx.clearRect(rx+c,ry,5,8+(ruin.seed+c)%8);
    ctx.fillStyle='rgba(20,80,35,0.5)';ctx.fillRect(rx,ry,w,6);
  }else{
    for(let i=0;i<8;i++){
      const bx=rx+((ruin.seed*11+i*31)%Math.max(w,1));
      const by2=ry+h*0.5+(i%3)*8,bw=7+i%6*3,bh=5+i%4*3;
      ctx.fillStyle=i%2===0?SM:SD;ctx.fillRect(bx,by2,bw,bh);
      ctx.fillStyle=SL;ctx.fillRect(bx,by2,bw,1);
      ctx.fillStyle=SS;ctx.fillRect(bx,by2+bh-1,bw,1);
    }
  }
  ctx.globalAlpha=0.18;ctx.fillStyle='#2a6633';
  for(let ag=0;ag<w;ag+=5)if((ruin.seed+ag)%4<2)ctx.fillRect(rx+ag,ry+h-8,4,8);
  ctx.restore();
}

function _drawPixelCoral(ctx,cx,sandY,cr){
  ctx.save();
  const h=cr.h,col=cr.col,col2=cr.col2;
  const sw=Math.sin(frameCount*0.03+cr.seed*0.007)*2.5;
  if(cr.type==='branch'){
    ctx.strokeStyle=col;ctx.lineWidth=3;ctx.lineCap='square';
    ctx.beginPath();ctx.moveTo(cx,sandY);ctx.lineTo(cx+sw*0.5,sandY-h);ctx.stroke();
    for(let b=0;b<5;b++){
      const by2=sandY-h*(0.25+b*0.14),dir=b%2===0?1:-1,bl=8+b*3;
      ctx.strokeStyle=b%2===0?col:col2;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(cx+sw*0.4,by2);ctx.lineTo(cx+dir*bl+sw,by2-h*0.12);ctx.stroke();
      ctx.fillStyle=b%2===0?col2:col;ctx.fillRect(cx+dir*bl+sw-2,by2-h*0.12-2,5,5);
    }
  }else if(cr.type==='fan'){
    for(let f=-4;f<=4;f++){
      ctx.strokeStyle=f%2===0?col:col2;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(cx,sandY);ctx.lineTo(cx+f*7+sw,sandY-h);ctx.stroke();
    }
    for(let l=2;l<8;l++){const ly=sandY-h*(l/8),lsp=l*7;ctx.fillStyle=col2;ctx.globalAlpha=0.4;ctx.fillRect(cx-lsp/2+sw*0.3,ly,lsp,1.5);ctx.globalAlpha=1;}
  }else if(cr.type==='round'){
    const r=h*0.38;
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,sandY);ctx.lineTo(cx+sw*0.4,sandY-h*0.55);ctx.stroke();
    ctx.fillStyle=col;
    for(let a=0;a<Math.PI*2;a+=0.35)ctx.fillRect(cx+sw*0.4+Math.cos(a)*r-2,sandY-h*0.55+Math.sin(a)*r*0.65-2,5,5);
    ctx.fillStyle=col2;ctx.globalAlpha=0.6;ctx.fillRect(cx+sw*0.4-r*0.4,sandY-h*0.55-r*0.35,r*0.8,r*0.5);ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(cx+sw*0.4-r*0.25,sandY-h*0.55-r*0.52,r*0.28,r*0.22);
  }else if(cr.type==='tube'){
    const nc=2+Math.floor(cr.seed%3);
    for(let t=0;t<nc;t++){
      const tx=cx+(t-(nc-1)/2)*8+sw*0.5,th=h*(0.55+t%2*0.25);
      ctx.fillStyle=t%2===0?col:col2;ctx.fillRect(tx-3,sandY-th,6,th);
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(tx+1,sandY-th,2,th);
      ctx.fillStyle='#110008';ctx.fillRect(tx-3,sandY-th-3,6,4);
      ctx.fillStyle=col;ctx.fillRect(tx-4,sandY-th-4,8,2);
    }
  }else if(cr.type==='spike'){
    for(let s=0;s<3;s++){
      const spx=cx+(s-1)*9+sw,sh=h*(0.6+s%2*0.3);
      ctx.fillStyle=s%2===0?col:col2;
      ctx.beginPath();ctx.moveTo(spx-4,sandY);ctx.lineTo(spx+4,sandY);ctx.lineTo(spx,sandY-sh);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.2)';
      ctx.beginPath();ctx.moveTo(spx-2,sandY-4);ctx.lineTo(spx,sandY-sh);ctx.lineTo(spx+1,sandY-sh*0.7);ctx.closePath();ctx.fill();
    }
  }else{
    for(let b=-3;b<=3;b++){const bh=h*(0.55+Math.abs(b)*0.06);ctx.fillStyle=b%2===0?col:col2;ctx.fillRect(cx+b*6+sw-2,sandY-bh,5,bh);}
    for(let b=-3;b<=3;b++){ctx.fillStyle=b%2===0?col2:col;ctx.fillRect(cx+b*6+sw-3,sandY-h*(0.55+Math.abs(b)*0.06)-4,8,6);}
  }
  ctx.restore();
}

function _drawPixelSeaweed(ctx,sx,sandY,sw){
  ctx.save();ctx.strokeStyle=sw.col;ctx.lineWidth=2.5;ctx.lineCap='square';
  const segH=sw.h/sw.segs;let cx2=sx,cy2=sandY;
  ctx.beginPath();ctx.moveTo(cx2,cy2);
  for(let s=0;s<sw.segs;s++){
    const sway=(s%2===0?1:-1)*5*Math.sin(frameCount*0.04+sw.phase+s*0.55);
    cx2+=sway;cy2-=segH;ctx.lineTo(cx2,cy2);
    if(s%2===1){ctx.fillStyle=sw.col;ctx.fillRect(cx2+(s%4<2?2:-7),cy2-2,7,4);}
  }
  ctx.stroke();ctx.fillStyle=sw.col;ctx.fillRect(cx2-2,cy2-4,6,6);ctx.restore();
}

function _drawPixelFish(ctx,fx,fy,f){
  ctx.save();
  const s=Math.round(f.size),dir=f.vx>0?1:-1;
  const tw=Math.sin(frameCount*0.2+f.tailPhase)*2.5;
  ctx.fillStyle=f.col;ctx.fillRect(fx-s,fy-Math.round(s*0.48),s*2,Math.round(s*0.96));
  ctx.fillStyle=f.col2;ctx.globalAlpha=0.55;ctx.fillRect(fx-Math.round(s*0.55),fy+Math.round(s*0.1),Math.round(s*1.1),Math.round(s*0.32));ctx.globalAlpha=1;
  ctx.fillStyle=f.col;
  ctx.beginPath();ctx.moveTo(fx-dir*s,fy);ctx.lineTo(fx-dir*(s+Math.round(s*0.75)),fy-Math.round(s*0.6)+tw);ctx.lineTo(fx-dir*(s+Math.round(s*0.75)),fy+Math.round(s*0.6)+tw);ctx.closePath();ctx.fill();
  ctx.fillRect(fx-Math.round(s*0.25),fy-Math.round(s*0.48)-Math.round(s*0.42),Math.round(s*0.55),Math.round(s*0.42));
  ctx.fillStyle='#000';ctx.fillRect(fx+dir*Math.round(s*0.42)-1,fy-Math.round(s*0.18)-1,3,3);
  ctx.fillStyle='#fff';ctx.fillRect(fx+dir*Math.round(s*0.42),fy-Math.round(s*0.18)-1,1,1);
  if(s>8){ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(fx-1,fy-Math.round(s*0.42),2,Math.round(s*0.84));}
  ctx.restore();
}


function updatePhysics(){
  if(gameState!=='WORLD')return;
  if(inOcean)return; // ocean has its own physics in updateOcean
  timeOfDay=(timeOfDay+0.0001)%1;

  if(keys['a']||keys['A']||keys['ArrowLeft']){P.vx=-P.speed;P.facing=-1;}
  else if(keys['d']||keys['D']||keys['ArrowRight']){P.vx=P.speed;P.facing=1;}
  else P.vx*=0.75;

  if(jumpPressed&&P.onGround){
    P.vy=-9;P.onGround=false;
    spawnParticles(P.x+P.w/2,P.y+P.h,'#88ddff',5,1.5);
  }
  jumpPressed=false; // consume the flag every frame
  P.vy=Math.min(P.vy+0.45,14);
  P.x+=P.vx;P.y+=P.vy;
  P.onGround=false;

  platforms.forEach(pl=>{
    if(P.x+P.w>pl.wx&&P.x<pl.wx+pl.ww&&P.y+P.h>=pl.wy&&P.y+P.h<pl.wy+pl.wh+16&&P.vy>=0){
      P.y=pl.wy-P.h;P.vy=0;P.onGround=true;
    }
  });

  P.x=Math.max(0,Math.min(WORLD_W-P.w,P.x));
  
  // ── Check portal hồ nước ──
  if(!inOcean && gameState==='WORLD'){
    const inLakeX = P.x+P.w/2 > LAKE_X1 && P.x+P.w/2 < LAKE_X2;
    // Chỉ vào đại dương khi player NHẢY XUỐNG (vy>0) và chạm mặt hồ
    const hittingLakeSurf = P.y+P.h >= GND && P.y+P.h <= GND+40 && P.vy >= 0;
    if(inLakeX && hittingLakeSurf){ initOceanWorld(); }
  }
  if(P.y>500){P.y=GND-GRASS_H-P.h-10;P.vy=0;}
  if(P.attackAnim>0)P.attackAnim--;
  if(P.hurtAnim>0)P.hurtAnim--;

  // Collect coins
  wcoins.forEach(co=>{
    if(!co.collected&&Math.hypot(P.x+P.w/2-co.wx,P.y+P.h/2-co.wy)<22){
      co.collected=true;coins+=5;updateHUD();showNotif('+5 🪙');
      spawnParticles(co.wx,co.wy,'#ffd700',8,2.5,'star');
      spawnParticles(co.wx,co.wy,'#ffee88',6,1.5,'circle');
    }
  });
  // Chest proximity (open with E)
  window._nearChest=null;
  chests.forEach(ch=>{
    if(!ch.opened&&Math.hypot(P.x+P.w/2-ch.wx-14,P.y+P.h/2-ch.wy-14)<70)
      window._nearChest=ch;
  });

  // Camera — always centered
  cam.x=Math.max(0,Math.min(WORLD_W-GW,P.x+P.w/2-GW/2));

  // Monster movement, proximity & respawn
  let nearMon=null;
  monsters.forEach(m=>{
    // Respawn after 3 minutes — nhưng dragon_boss chỉ respawn nếu đã unlock
    if(!m.alive){
      if(m.lockedUntilChess&&!hacLongUnlocked) return; // chưa thắng cờ vua → không hồi sinh
      if(m.deathTime && Date.now()-m.deathTime >= 180000){
        m.alive=true; m.hp=m.maxHp; m.deathTime=0;
        if(m.type==='dragon') m.wy=GND-GRASS_H-175;
        else m.wy=GND-GRASS_H-m.h;
        showNotif('👹 ' + m.name + ' đã hồi sinh!');
      }
      return;
    }
    // Ẩn hoàn toàn dragon_boss nếu chưa unlock hoặc không phải ban đêm
    if(m.lockedUntilChess && (!hacLongUnlocked || !isNightTime())) return;
    m.mt++;if(m.mt>120){m.dir*=-1;m.mt=0;}
    m.wx+=m.dir*0.8;
    // Dragon boss stays near castle gate center (midpoint of castle zone)
    if(m.type==='dragon'){
      const castleMidX=(HELL_START+HELL_END)/2;
      m.wx=Math.max(castleMidX-80,Math.min(castleMidX+80,m.wx));
    } else {
      m.wx=Math.max(60,Math.min(WORLD_W-80,m.wx));
    }
    m.wy=GND-GRASS_H-m.h;
    const dist=Math.hypot(P.x+P.w/2-m.wx-m.w/2,P.y+P.h/2-m.wy-m.h/2);
    if(dist<80)nearMon=m;
  });
  window._nearMon=nearMon;

  // House proximity
  let nearHouse=null;
  houses.forEach(h=>{
    const doorX=h.worldX+h.width/2;
    const doorY=GND;
    if(Math.abs(P.x+P.w/2-doorX)<70&&Math.abs(P.y+P.h-doorY)<60)nearHouse=h;
  });
  window._nearHouse=nearHouse;

  updateParticles();
}

