// ─── Shared helpers ──────────────────────────────────────────────────────────
function drawDoorGlow(c,h,doorMidX,doorY){
  const distD=Math.abs(P.x-(h.worldX+h.width/2))+Math.abs(P.y-doorY);
  if(distD<90&&gameState==='WORLD'){
    c.save();c.globalAlpha=0.4+Math.sin(frameCount*0.12)*0.15;
    const dg=c.createRadialGradient(doorMidX,doorY+25,0,doorMidX,doorY+25,32);
    dg.addColorStop(0,'rgba(255,215,0,0.8)');dg.addColorStop(1,'transparent');
    c.fillStyle=dg;c.fillRect(doorMidX-35,doorY-12,70,75);
    c.restore();
    c.fillStyle='#ffd700';c.font='bold 20px "Times New Roman"';c.textAlign='center';
    c.shadowColor='#ffd700';c.shadowBlur=8;
    c.fillText('↑ VÀO',doorMidX,doorY-14);
    c.shadowBlur=0;
  }
}
function drawSmoke(c,x,y){
  for(let sp=0;sp<4;sp++){
    const spx=x+Math.sin(frameCount*0.03+sp*1.2)*3;
    const spy=y-sp*9+((frameCount*0.4+sp*7)%16);
    c.save();c.globalAlpha=(1-sp*0.22)*0.3;
    c.fillStyle='#d0ccc8';c.shadowBlur=4;
    const sr=5+sp*3;c.beginPath();c.arc(spx,spy,sr,0,Math.PI*2);c.fill();
    c.restore();
  }
}
function drawHouseSign(c,rx,gY,W,name,signCol,textCol){
  // Hanging sign on a post
  const sx=rx+W/2,sy=gY-4;
  // Post
  c.fillStyle='#5d3a20';c.fillRect(sx-2,sy-30,4,30);
  // Sign board
  c.fillStyle=signCol||'#4a2f1a';c.fillRect(sx-36,sy-44,72,18);
  c.fillStyle=darkenColor(signCol||'#4a2f1a',0.15);c.fillRect(sx-34,sy-42,68,14);
  // Chains
  c.strokeStyle='rgba(180,160,100,0.7)';c.lineWidth=1;
  [[sx-28,sy-44,sx-30,sy-50],[sx+28,sy-44,sx+30,sy-50]].forEach(([x1,y1,x2,y2])=>{
    c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
  });
  c.fillStyle=textCol||'#ffd700';c.font='bold 13px "Times New Roman"';c.textAlign='center';
  c.shadowColor=textCol||'#ffd700';c.shadowBlur=3;
  c.fillText(name,sx,sy-32);c.shadowBlur=0;
}
function drawWindowGlass(c,wx,wy,ww,wh,col1,col2,glow){
  const gg=c.createLinearGradient(wx,wy,wx+ww,wy+wh);
  gg.addColorStop(0,col1);gg.addColorStop(1,col2);
  c.fillStyle=gg;c.fillRect(wx,wy,ww,wh);
  // Reflection
  c.save();c.globalAlpha=0.55;c.fillStyle='#fff';c.fillRect(wx+2,wy+2,ww*0.35,wh*0.3);c.restore();
  // Interior glow
  if(glow){
    c.save();c.globalAlpha=0.18+Math.sin(frameCount*0.05+wx)*0.08;
    c.fillStyle=glow;c.fillRect(wx,wy,ww,wh);c.restore();
  }
}
// ─────────────────────────────────────────────────────────────────────────────



// ═══════════════════════════════════════════════════════════════════
// HOUSE DRAWING — 6 ngôi nhà cân đối, mái rõ ràng, consistent style
// Quy ước chung: W=chiều rộng, H=chiều cao tường, ry=gY-H (đỉnh tường)
// Mái luôn ngồi TRÊN tường, phần mái = ~40-50% H riêng
// ═══════════════════════════════════════════════════════════════════

// Helper: vẽ mái tam giác đơn giản cân đối
function drawTriRoof(c,rx,wallTop,W,roofH,col1,col2,overhang=8){
  const cx=rx+W/2;
  // Shadow
  c.save();c.globalAlpha=0.25;c.fillStyle='#000';
  c.beginPath();c.moveTo(rx-overhang-3,wallTop);c.lineTo(cx,wallTop-roofH-3);c.lineTo(rx+W+overhang+3,wallTop);c.closePath();c.fill();c.restore();
  // Roof fill
  const rg=c.createLinearGradient(cx,wallTop-roofH,cx,wallTop);
  rg.addColorStop(0,col1);rg.addColorStop(1,col2);
  c.fillStyle=rg;
  c.beginPath();c.moveTo(rx-overhang,wallTop+2);c.lineTo(cx,wallTop-roofH);c.lineTo(rx+W+overhang,wallTop+2);c.closePath();c.fill();
  // Roof edge highlight
  c.save();c.globalAlpha=0.3;c.strokeStyle='rgba(255,255,255,0.5)';c.lineWidth=1.5;
  c.beginPath();c.moveTo(rx-overhang,wallTop+2);c.lineTo(cx,wallTop-roofH);c.lineTo(rx+W+overhang,wallTop+2);c.stroke();c.restore();
  // Tile lines
  c.save();c.globalAlpha=0.12;c.strokeStyle='#000';c.lineWidth=0.6;
  const steps=Math.floor(roofH/6);
  for(let i=1;i<steps;i++){
    const t=i/steps;
    const tw=(W+overhang*2)*(1-t);
    const ty=wallTop-roofH*t;
    c.beginPath();c.moveTo(cx-tw/2,ty);c.lineTo(cx+tw/2,ty);c.stroke();
  }
  c.restore();
  // Eaves (cornice) at bottom
  c.fillStyle=col2;
  c.fillRect(rx-overhang-2,wallTop,W+overhang*2+4,5);
  c.save();c.globalAlpha=0.2;c.fillStyle='#000';c.fillRect(rx-overhang-2,wallTop+4,W+overhang*2+4,2);c.restore();
}

// Helper: vẽ cửa sổ cân đối với khung gỗ
function drawNiceWindow(c,wx,wy,ww,wh,glassCol,frameCol,withGlow){
  // Frame outer
  c.fillStyle=frameCol;c.fillRect(wx-3,wy-3,ww+6,wh+6);
  // Sill
  c.fillStyle=frameCol;c.fillRect(wx-5,wy+wh,ww+10,5);
  // Glass
  const gg=c.createLinearGradient(wx,wy,wx+ww,wy+wh);
  gg.addColorStop(0,'#aaddff');gg.addColorStop(1,'#6699cc');
  c.fillStyle=gg;c.fillRect(wx,wy,ww,wh);
  // Reflection
  c.save();c.globalAlpha=0.5;c.fillStyle='#fff';c.fillRect(wx+2,wy+2,ww*0.4,wh*0.3);c.restore();
  // Cross divider
  c.fillStyle=frameCol;
  c.fillRect(wx+ww/2-1,wy,2,wh);
  c.fillRect(wx,wy+wh/2-1,ww,2);
  // Glow
  if(withGlow){
    c.save();c.globalAlpha=0.12+Math.sin(frameCount*0.05+wx*0.02)*0.06;
    c.fillStyle=glassCol||'#ffeeaa';c.fillRect(wx,wy,ww,wh);c.restore();
  }
}

// Helper: ống khói + khói
function drawChimney(c,chx,wallTop,col1,col2){
  c.fillStyle=col1;c.fillRect(chx-5,wallTop-20,10,24);
  c.fillStyle=col2;c.fillRect(chx-7,wallTop-22,14,4);
  c.save();c.globalAlpha=0.08;c.strokeStyle='#000';c.lineWidth=0.5;
  for(let r=0;r<4;r++) c.strokeRect(chx-5,wallTop-20+r*5,10,5);
  c.restore();
  drawSmoke(c,chx,wallTop-24);
}

// Helper: nền nhà (foundation)
function drawFoundation(c,rx,gY,W,col1,col2){
  const fh=10;
  const fg=c.createLinearGradient(rx,gY-fh,rx,gY);
  fg.addColorStop(0,col1);fg.addColorStop(1,col2);
  c.fillStyle=fg;c.fillRect(rx-4,gY-fh,W+8,fh);
  c.fillStyle='rgba(0,0,0,0.2)';c.fillRect(rx-4,gY-2,W+8,2);
  c.fillStyle='rgba(255,255,255,0.15)';c.fillRect(rx-4,gY-fh,W+8,2);
}

// ─────────────────────────────────────────────────────────────────
// 🔢 TOÁN HỌC — Tháp Gothic xám với mái nhọn + đồng hồ
// ─────────────────────────────────────────────────────────────────
function drawMathHouse(c,h,rx,gY){
  const W=h.width, H=h.height, ry=gY-H;
  const cx=rx+W/2;
  // Shadow
  c.save();c.globalAlpha=0.18;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+6,W/2+14,7,0,0,Math.PI*2);c.fill();c.restore();
  // Foundation
  drawFoundation(c,rx,gY,W,'#888898','#666676');
  // Wall — dark grey stone
  const wg=c.createLinearGradient(rx,ry,rx+W,ry+H);
  wg.addColorStop(0,'#6e6e7a');wg.addColorStop(0.5,'#5a5a66');wg.addColorStop(1,'#484858');
  c.fillStyle=wg;c.fillRect(rx,ry,W,H);
  // Stone block texture
  c.save();c.globalAlpha=0.14;
  for(let row=0;row<Math.floor(H/11);row++){
    for(let col=0;col<Math.ceil(W/14);col++){
      const offx=row%2?7:0;
      c.strokeStyle='#000';c.lineWidth=0.5;
      c.strokeRect(rx+col*14+offx,ry+row*11,13,10);
    }
  }
  c.restore();
  // Side shadow
  c.save();c.globalAlpha=0.2;
  const ss=c.createLinearGradient(rx,0,rx+W,0);
  ss.addColorStop(0,'rgba(0,0,0,0.5)');ss.addColorStop(0.12,'transparent');
  ss.addColorStop(0.88,'transparent');ss.addColorStop(1,'rgba(0,0,0,0.35)');
  c.fillStyle=ss;c.fillRect(rx,ry,W,H);c.restore();

  // Crenellations (battlements) at top of wall
  const crenH=10;
  for(let cr=0;cr<Math.ceil(W/10);cr++){
    if(cr%2===0){
      c.fillStyle='#5a5a66';c.fillRect(rx+cr*10,ry-crenH,8,crenH);
      c.strokeStyle='rgba(0,0,0,0.3)';c.lineWidth=0.5;c.strokeRect(rx+cr*10,ry-crenH,8,crenH);
    }
  }

  // Mái nhọn Gothic — nằm trên crenellations
  const roofH=H*0.55;
  const wallTopForRoof=ry-crenH;
  drawTriRoof(c,rx,wallTopForRoof,W,roofH,'#2a2a3a','#3a3a4c',6);
  // Spire
  c.fillStyle='#888898';c.fillRect(cx-2,wallTopForRoof-roofH-16,4,18);
  c.fillStyle='#aaaacc';
  c.beginPath();c.moveTo(cx-5,wallTopForRoof-roofH);c.lineTo(cx,wallTopForRoof-roofH-22);c.lineTo(cx+5,wallTopForRoof-roofH);c.closePath();c.fill();
  c.fillStyle='#ffd700';c.shadowColor='#ffd700';c.shadowBlur=8;
  c.beginPath();c.arc(cx,wallTopForRoof-roofH-22,3,0,Math.PI*2);c.fill();c.shadowBlur=0;

  // Side turrets (cân đối)
  [-1,1].forEach(side=>{
    const tx=cx+side*(W/2+6);
    const th=H*0.6,tw=16;
    const tg=c.createLinearGradient(tx-tw/2,ry,tx+tw/2,ry+th);
    tg.addColorStop(0,'#606070');tg.addColorStop(1,'#484858');
    c.fillStyle=tg;c.fillRect(tx-tw/2,gY-th,tw,th);
    // Turret crenellations
    for(let cr=0;cr<3;cr++){
      if(cr%2===0) c.fillStyle='#5a5a66';
      else c.fillStyle='transparent';
      if(cr%2===0) c.fillRect(tx-tw/2+cr*(tw/3),gY-th-7,tw/3-1,7);
    }
    // Turret cone roof
    const trH=20;
    const trTop=gY-th-7;
    const trg=c.createLinearGradient(tx,trTop-trH,tx,trTop);
    trg.addColorStop(0,'#1a1a2a');trg.addColorStop(1,'#2a2a3a');
    c.fillStyle=trg;
    c.beginPath();c.moveTo(tx-tw/2-2,trTop);c.lineTo(tx,trTop-trH);c.lineTo(tx+tw/2+2,trTop);c.closePath();c.fill();
    // Arrow slit
    c.fillStyle='#1a1a22';c.fillRect(tx-1.5,gY-th+10,3,12);
    c.beginPath();c.moveTo(tx-1.5,gY-th+10);c.lineTo(tx,gY-th+5);c.lineTo(tx+1.5,gY-th+10);c.closePath();c.fill();
  });

  // Clock face — centered in wall
  const clkY=ry+H*0.32;
  c.fillStyle='#1a1a22';c.beginPath();c.arc(cx,clkY,16,0,Math.PI*2);c.fill();
  c.strokeStyle='#aaaacc';c.lineWidth=1.5;c.beginPath();c.arc(cx,clkY,14,0,Math.PI*2);c.stroke();
  c.fillStyle='#e8e8f0';c.beginPath();c.arc(cx,clkY,12,0,Math.PI*2);c.fill();
  c.fillStyle='#334';
  for(let n=0;n<12;n++){
    const a=n*Math.PI/6-Math.PI/2;
    c.beginPath();c.arc(cx+Math.cos(a)*(n%3===0?10:11),clkY+Math.sin(a)*(n%3===0?10:11),n%3===0?1.5:0.8,0,Math.PI*2);c.fill();
  }
  const hr=(frameCount*0.002)%(Math.PI*2), mn=(frameCount*0.024)%(Math.PI*2);
  c.strokeStyle='#1a1a30';c.lineWidth=2;
  c.beginPath();c.moveTo(cx,clkY);c.lineTo(cx+Math.cos(hr-Math.PI/2)*7,clkY+Math.sin(hr-Math.PI/2)*7);c.stroke();
  c.lineWidth=1.5;c.beginPath();c.moveTo(cx,clkY);c.lineTo(cx+Math.cos(mn-Math.PI/2)*10,clkY+Math.sin(mn-Math.PI/2)*10);c.stroke();
  c.fillStyle='#cc2200';c.beginPath();c.arc(cx,clkY,1.5,0,Math.PI*2);c.fill();

  // Windows (2, cân đối)
  const winY=ry+H*0.56;
  [cx-W*0.22, cx+W*0.22-18].forEach(wx=>{
    drawNiceWindow(c,wx,winY,18,22,'#ffeeaa','#3a3a4c',true);
    // Gothic pointed arch top
    c.fillStyle='#3a3a4c';
    c.beginPath();c.moveTo(wx-3,winY);c.lineTo(wx+9,winY-9);c.lineTo(wx+21,winY);c.closePath();c.fill();
    c.fillStyle='#6688bb';c.beginPath();c.moveTo(wx,winY);c.lineTo(wx+9,winY-7);c.lineTo(wx+18,winY);c.closePath();c.fill();
  });

  // Door — portcullis
  const dW=24,dH=40,dX=cx-dW/2,dY=gY-dH;
  c.fillStyle='#2a2a30';c.fillRect(dX-3,dY-3,dW+6,dH+3);
  c.fillStyle='#2a2a30';c.beginPath();c.arc(cx,dY,dW/2+1,Math.PI,0);c.fill();
  c.fillStyle='#3d3048';c.fillRect(dX,dY,dW,dH);
  c.strokeStyle='#5a5068';c.lineWidth=1;
  for(let gx=0;gx<4;gx++){c.beginPath();c.moveTo(dX+gx*(dW/3),dY);c.lineTo(dX+gx*(dW/3),dY+dH);c.stroke();}
  for(let gy=0;gy<5;gy++){c.beginPath();c.moveTo(dX,dY+gy*(dH/4));c.lineTo(dX+dW,dY+gy*(dH/4));c.stroke();}
  c.strokeStyle='#888898';c.lineWidth=1.5;c.beginPath();c.arc(dX+dW*0.75,dY+dH*0.55,3,0,Math.PI*2);c.stroke();
  drawDoorGlow(c,h,cx,dY);

  // Math symbols (floating, cân đối)
  [{s:'∑',x:-W*0.28,y:H*0.15},{s:'π',x:W*0.28,y:H*0.15},{s:'√',x:-W*0.32,y:H*0.48},{s:'∞',x:W*0.32,y:H*0.48}].forEach((ms,i)=>{
    const bob=Math.sin(frameCount*0.05+i*1.5)*2;
    c.save();c.globalAlpha=0.5;c.fillStyle='#aaccff';c.font='bold 9px serif';c.textAlign='center';
    c.shadowColor='#aaccff';c.shadowBlur=5;
    c.fillText(ms.s,cx+ms.x,ry+ms.y+bob);c.restore();
  });

  // Chimneys (cân đối)
  [cx-W*0.2, cx+W*0.2].forEach(chx=>drawChimney(c,chx,ry,'#5a5a66','#4a4a55'));

  drawHouseSign(c,rx,gY,W,h.name,'#2a2a3a','#aaccff');
}


// ─────────────────────────────────────────────────────────────────
// 🌍 ĐỊA LÝ — Chùa Á Đông 3 tầng, mái cong cân đối
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// 🌍 ĐỊA LÝ — Đền Nhật Bản (Shrine) với mái cong kiểu irimoya
// ─────────────────────────────────────────────────────────────────
function drawGeoHouse(c,h,rx,gY){
  const W=h.width, H=h.height, ry=gY-H;
  const cx=rx+W/2;
  c.save();c.globalAlpha=0.18;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+6,W/2+14,7,0,0,Math.PI*2);c.fill();c.restore();

  // ── Torii gate nhỏ phía trước ──
  const toriiX=cx, toriiY=gY-10;
  // Cột torii
  c.fillStyle='#cc2200';
  c.fillRect(toriiX-W*0.36-3,toriiY-55,6,55);
  c.fillRect(toriiX+W*0.36-3,toriiY-55,6,55);
  // Kasagi (thanh ngang trên)
  c.fillRect(toriiX-W*0.4,toriiY-56,W*0.8,7);
  // Shimaki (thanh ngang giữa)
  c.fillRect(toriiX-W*0.32,toriiY-40,W*0.64,5);
  // Đầu kasagi cong nhẹ
  c.fillStyle='#aa1a00';
  c.fillRect(toriiX-W*0.4,toriiY-58,8,4);
  c.fillRect(toriiX+W*0.4-8,toriiY-58,8,4);

  // ── Nền đá thanh lịch ──
  const platH=14;
  const pg2=c.createLinearGradient(rx-6,gY-platH,rx+W+6,gY);
  pg2.addColorStop(0,'#c0b898');pg2.addColorStop(0.5,'#d4c8aa');pg2.addColorStop(1,'#a89a80');
  c.fillStyle=pg2;c.fillRect(rx-6,gY-platH,W+12,platH);
  c.fillStyle='#887858';c.fillRect(rx-6,gY-platH-2,W+12,3);
  c.fillStyle='rgba(255,255,255,0.15)';c.fillRect(rx-6,gY-platH,W+12,2);
  // Tile joints
  c.save();c.globalAlpha=0.12;c.strokeStyle='#000';c.lineWidth=0.5;
  for(let t=0;t<Math.ceil((W+12)/22);t++) c.strokeRect(rx-6+t*22,gY-platH,21,platH);
  c.restore();

  // ── Thân tường — gỗ tối ấm ──
  const wallG=c.createLinearGradient(rx,ry,rx+W,ry+H);
  wallG.addColorStop(0,'#8B4513');wallG.addColorStop(0.5,'#7a3a10');wallG.addColorStop(1,'#5a2a08');
  c.fillStyle=wallG;c.fillRect(rx,ry,W,H-platH+2);
  // Dầm gỗ ngang
  c.save();c.globalAlpha=0.18;c.strokeStyle='#3a1a00';c.lineWidth=1;
  for(let b=0;b<=Math.floor(W/18);b++){c.beginPath();c.moveTo(rx+b*18,ry);c.lineTo(rx+b*18,ry+H-platH);c.stroke();}
  [0.3,0.6].forEach(p=>{
    c.strokeStyle='rgba(255,220,150,0.2)';c.lineWidth=1.5;
    c.beginPath();c.moveTo(rx,ry+(H-platH)*p);c.lineTo(rx+W,ry+(H-platH)*p);c.stroke();
  });
  c.restore();
  c.save();const ss=c.createLinearGradient(rx,0,rx+W,0);
  ss.addColorStop(0,'rgba(0,0,0,0.3)');ss.addColorStop(0.1,'transparent');
  ss.addColorStop(0.9,'transparent');ss.addColorStop(1,'rgba(0,0,0,0.25)');
  c.fillStyle=ss;c.fillRect(rx,ry,W,H-platH);c.restore();

  // ── Mái irimoya Nhật Bản — 2 tầng cong mạnh ──
  // Helper vẽ mái cong kiểu Nhật
  function japanesRoof(c,cx,baseY,rW,rH,col1,col2,col3,curl){
    // Mái chính (4 mặt tam giác cân + cong nhẹ 2 đầu)
    const rg=c.createLinearGradient(cx,baseY-rH,cx,baseY);
    rg.addColorStop(0,col1);rg.addColorStop(0.5,col2);rg.addColorStop(1,col3);
    c.fillStyle=rg;
    // Mái trái phải với eaves cong
    c.beginPath();
    c.moveTo(cx-rW/2-curl, baseY+5);
    c.bezierCurveTo(cx-rW/3, baseY+2, cx-rW/6, baseY-rH*0.4, cx, baseY-rH);
    c.bezierCurveTo(cx+rW/6, baseY-rH*0.4, cx+rW/3, baseY+2, cx+rW/2+curl, baseY+5);
    c.closePath();c.fill();
    // Underside shadow
    c.save();c.globalAlpha=0.4;c.fillStyle='#1a0800';
    c.beginPath();
    c.moveTo(cx-rW/2-curl,baseY+5);
    c.bezierCurveTo(cx-rW/4,baseY+7,cx,baseY+5,cx+rW/4,baseY+7);
    c.lineTo(cx+rW/2+curl,baseY+5);
    c.bezierCurveTo(cx+rW/3,baseY+1,cx,baseY+2,cx-rW/3,baseY+1);
    c.closePath();c.fill();c.restore();
    // Nokisakikawarabaori (eaves edge line)
    c.save();c.globalAlpha=0.35;c.strokeStyle='#ffd090';c.lineWidth=1.2;
    c.beginPath();
    c.moveTo(cx-rW/2-curl,baseY+4);
    c.bezierCurveTo(cx-rW/3,baseY+1,cx-rW/6,baseY-rH*0.38,cx,baseY-rH);
    c.bezierCurveTo(cx+rW/6,baseY-rH*0.38,cx+rW/3,baseY+1,cx+rW/2+curl,baseY+4);
    c.stroke();c.restore();
    // Tile lines (kawara)
    c.save();c.globalAlpha=0.1;c.strokeStyle='#000';c.lineWidth=0.5;
    for(let tl=2;tl<Math.floor(rH/5);tl++){
      const t=tl/Math.floor(rH/5);
      const tw=(rW+curl*2)*(1-t*0.85);
      const ty=baseY-tl*5;
      c.beginPath();c.moveTo(cx-tw/2,ty);c.lineTo(cx+tw/2,ty);c.stroke();
    }
    c.restore();
    // Corner gold tips (onigawara)
    c.fillStyle='#cc8800';c.shadowColor='#ffaa00';c.shadowBlur=6;
    [-1,1].forEach(s=>{
      c.beginPath();c.arc(cx+s*(rW/2+curl),baseY+5,3,0,Math.PI*2);c.fill();
      // Upturn tip
      c.fillRect(cx+s*(rW/2+curl-2)-1,baseY+3,3,5);
    });
    c.shadowBlur=0;
    // Ridge cap (munagi)
    const ridgeW=8,ridgeH=5;
    const ridgeG=c.createLinearGradient(cx-ridgeW/2,baseY-rH-ridgeH,cx+ridgeW/2,baseY-rH);
    ridgeG.addColorStop(0,'#555');ridgeG.addColorStop(1,'#333');
    c.fillStyle=ridgeG;
    c.fillRect(cx-ridgeW/2,baseY-rH-ridgeH,ridgeW,rH*0.3+ridgeH);
    c.fillStyle='#888';c.fillRect(cx-ridgeW/2-1,baseY-rH-ridgeH-2,ridgeW+2,3);
  }

  // Tầng mái dưới (rộng, base ~60% H)
  const roof1Y=ry+H*0.60;
  japanesRoof(c,cx,roof1Y,W+40,H*0.30,'#2a2a2a','#3d3d3d','#1a1a1a',24);
  // Tầng mái trên (hẹp hơn, base ~20% H)
  const roof2Y=ry+H*0.18;
  japanesRoof(c,cx,roof2Y,W*0.55+14,H*0.22,'#333333','#484848','#222222',14);
  // Finial (sorin)
  const sorinY=roof2Y-H*0.22-28;
  c.fillStyle='#cc8800';c.fillRect(cx-2,sorinY,4,28);
  // Rings
  [5,10,16,22].forEach(dy=>{
    c.strokeStyle='#cc8800';c.lineWidth=2;
    c.beginPath();c.arc(cx,sorinY+dy,3+dy*0.08,0,Math.PI*2);c.stroke();
  });
  c.fillStyle='#ffd700';c.shadowColor='#ffd700';c.shadowBlur=10;
  c.beginPath();c.arc(cx,sorinY,5,0,Math.PI*2);c.fill();c.shadowBlur=0;

  // ── Cửa sổ shoji (cân đối 2 bên) ──
  const winY=ry+H*0.33;
  [cx-W*0.26, cx+W*0.26-16].forEach(wx=>{
    c.fillStyle='#2a1000';c.fillRect(wx-2,winY-2,20,22);
    c.fillStyle='#f5e8d0';c.fillRect(wx,winY,16,18);
    // Grid shoji
    c.fillStyle='#8B4513';
    c.fillRect(wx+7,winY,2,18);c.fillRect(wx,winY+8,16,2);
    // Glow nhẹ
    c.save();c.globalAlpha=0.15+Math.sin(frameCount*0.05+wx)*0.07;
    c.fillStyle='#ffee88';c.fillRect(wx,winY,16,18);c.restore();
  });

  // ── Đèn lồng chochin (2 bên cân đối) ──
  [cx-W*0.28, cx+W*0.28].forEach((lx,li)=>{
    const swing=Math.sin(frameCount*0.04+li*1.8)*2.5;
    const ly=roof1Y+12+swing;
    c.strokeStyle='rgba(150,100,40,0.7)';c.lineWidth=0.8;
    c.beginPath();c.moveTo(lx,roof1Y+4);c.lineTo(lx+swing*0.3,ly-10);c.stroke();
    c.fillStyle='#cc1100';c.save();c.globalAlpha=0.9;
    // Thân đèn hình bầu dục
    c.beginPath();c.ellipse(lx,ly,5,8,0,0,Math.PI*2);c.fill();
    const lg=c.createRadialGradient(lx,ly,1,lx,ly,12);
    lg.addColorStop(0,'rgba(255,180,0,0.7)');lg.addColorStop(1,'transparent');
    c.fillStyle=lg;c.beginPath();c.arc(lx,ly,12,0,Math.PI*2);c.fill();
    c.fillStyle='#ffcc00';c.beginPath();c.arc(lx,ly,2,0,Math.PI*2);c.fill();
    c.fillStyle='#882200';
    c.fillRect(lx-6,ly-9,12,3);c.fillRect(lx-6,ly+6,12,3);
    c.restore();
  });

  // ── Cửa chính — shoji screen ──
  const dW=30,dH=46,dX=cx-dW/2,dY=gY-dH-platH+4;
  c.fillStyle='#2a1000';c.fillRect(dX-3,dY-3,dW+6,dH+3);
  c.fillStyle='#f5e8d0';c.fillRect(dX,dY,dW/2,dH);c.fillRect(dX+dW/2,dY,dW/2,dH);
  // Shoji grid
  c.strokeStyle='#8B4513';c.lineWidth=1;
  for(let gr=0;gr<4;gr++){
    c.beginPath();c.moveTo(dX,dY+gr*(dH/3));c.lineTo(dX+dW,dY+gr*(dH/3));c.stroke();
  }
  c.beginPath();c.moveTo(dX+dW/4,dY);c.lineTo(dX+dW/4,dY+dH);c.stroke();
  c.beginPath();c.moveTo(dX+dW*3/4,dY);c.lineTo(dX+dW*3/4,dY+dH);c.stroke();
  c.beginPath();c.moveTo(cx,dY);c.lineTo(cx,dY+dH);c.stroke();
  c.fillStyle='rgba(255,220,100,0.12)';c.fillRect(dX,dY,dW,dH);
  drawDoorGlow(c,h,cx,dY);

  drawHouseSign(c,rx,gY,W,h.name,'#882200','#fff8e8');
}
// ─────────────────────────────────────────────────────────────────
// 🏛️ LỊCH SỬ — Đền Hy Lạp cổ đại
// ─────────────────────────────────────────────────────────────────
function drawHistoryHouse(c,h,rx,gY){
  const W=h.width,H=h.height;

  // ═══ Kích thước kiến trúc chính xác ═══════════════════════
  const STEP_H   = 7;   // chiều cao mỗi bậc thềm
  const STEPS    = 3;   // số bậc
  const stepBase = gY;  // mặt đất
  const topmostStep = stepBase - STEPS * STEP_H; // mặt stylobate (đỉnh bậc trên cùng)

  const COL_N    = 6;
  const COL_W    = 13;  // chiều rộng cột
  const ENTAB_H  = 20;  // chiều cao entablature (architrave+frieze+cornice)
  const PED_H    = 38;  // chiều cao pediment (tam giác)

  // Tổng chiều cao cột = H - bậc thềm - entablature - pediment
  const COL_H    = H - STEPS*STEP_H - ENTAB_H - PED_H;

  const colBottom = topmostStep;          // chân cột = mặt stylobate
  const colTop    = colBottom - COL_H;    // đỉnh cột
  const entabBot  = colTop;               // đáy entablature = đỉnh cột
  const entabTop  = entabBot - ENTAB_H;   // đỉnh entablature
  const pedBot    = entabTop;             // đáy pediment = đỉnh entablature
  const pedApex   = pedBot - PED_H;       // đỉnh tam giác

  // Chiều rộng entablature/pediment = chiều rộng đền + 2 bên overhang
  const OVERHANG  = 8;
  const entabLeft = rx - OVERHANG;
  const entabRight= rx + W + OVERHANG;
  const entabW    = entabRight - entabLeft;
  const cx        = rx + W/2;  // tâm đền

  // ═══ 1. SHADOW ═════════════════════════════════════════════
  c.save();c.globalAlpha=0.2;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+8,W/2+20,8,0,0,Math.PI*2);c.fill();c.restore();

  // ═══ 2. BẬC THỀM (Stylobate / Krepidoma) ═════════════════
  for(let s=STEPS-1;s>=0;s--){
    const bw = W + OVERHANG*2 + (STEPS-1-s)*14;
    const bx = cx - bw/2;
    const by = stepBase - (STEPS-s)*STEP_H;
    const sg = c.createLinearGradient(bx,by,bx,by+STEP_H);
    sg.addColorStop(0,'#f5eed8');sg.addColorStop(0.5,'#ece2c8');sg.addColorStop(1,'#cdc3ac');
    c.fillStyle=sg; c.fillRect(bx,by,bw,STEP_H);
    // Edge shadow
    c.fillStyle='rgba(0,0,0,0.18)'; c.fillRect(bx,by+STEP_H-2,bw,2);
    // Top highlight
    c.fillStyle='rgba(255,255,255,0.22)'; c.fillRect(bx,by,bw,2);
    // Vertical face shadow on left/right
    c.save();c.globalAlpha=0.12;
    c.fillStyle='#000';c.fillRect(bx,by,4,STEP_H);
    c.fillStyle='rgba(255,255,255,0.15)';c.fillRect(bx+bw-4,by,4,STEP_H);
    c.restore();
  }

  // ═══ 3. CELLA (tường trong) — vẽ trước cột ═══════════════
  // Cella nằm bên trong hàng cột, từ đỉnh cột xuống stylobate
  const cellaMargin = 18; // cách đều 2 cột biên
  const cellaX = rx + cellaMargin;
  const cellaW = W - cellaMargin*2;
  const cg = c.createLinearGradient(cellaX, colTop, cellaX+cellaW, colBottom);
  cg.addColorStop(0,'#f8f2e4'); cg.addColorStop(0.5,'#f0e8d4'); cg.addColorStop(1,'#ddd4c0');
  c.fillStyle=cg; c.fillRect(cellaX, colTop, cellaW, COL_H);
  // Block texture trên tường
  c.save();c.globalAlpha=0.07;c.strokeStyle='#886640';c.lineWidth=0.5;
  for(let row=0;row<Math.floor(COL_H/13);row++){
    const offx=row%2?0:18;
    for(let col=0;col<Math.ceil(cellaW/22);col++){
      c.strokeRect(cellaX+col*22+offx,colTop+row*13,21,12);
    }
  }
  c.restore();
  // Bóng tối hai bên cella (giữa cột và tường)
  c.save();
  const cs=c.createLinearGradient(cellaX,0,cellaX+cellaW,0);
  cs.addColorStop(0,'rgba(0,0,0,0.18)');cs.addColorStop(0.08,'transparent');
  cs.addColorStop(0.92,'transparent');cs.addColorStop(1,'rgba(0,0,0,0.14)');
  c.fillStyle=cs;c.fillRect(cellaX,colTop,cellaW,COL_H);c.restore();

  // ═══ 4. CỬA (nằm giữa cella, vẽ trước cột phủ lên) ═══════
  const doorW=28, doorH=Math.min(50, COL_H*0.65);
  const doorX = cx - doorW/2;
  const doorY = colBottom - doorH;
  // Door surround
  c.fillStyle='#c8bca8'; c.fillRect(doorX-4,doorY-3,doorW+8,doorH+3);
  // Door body
  const dg=c.createLinearGradient(doorX,doorY,doorX+doorW,doorY+doorH);
  dg.addColorStop(0,'#5c3c1e');dg.addColorStop(1,'#3a2410');
  c.fillStyle=dg; c.fillRect(doorX,doorY,doorW,doorH);
  // Door panels (4 ô)
  [[0,0],[1,0],[0,1],[1,1]].forEach(([px,py])=>{
    const pw=11,ph=(doorH-8)*0.48;
    const pdx=doorX+2+px*14,pdy=doorY+3+py*(ph+4);
    c.fillStyle='rgba(255,255,255,0.05)';c.fillRect(pdx,pdy,pw,ph);
    c.strokeStyle='rgba(255,255,255,0.12)';c.lineWidth=0.5;c.strokeRect(pdx,pdy,pw,ph);
  });
  // Lintel ngang trên cửa
  c.fillStyle='#d8ceb8'; c.fillRect(doorX-4,doorY-3,doorW+8,5);
  // Door handle
  c.fillStyle='#cc9900';c.beginPath();c.arc(doorX+doorW-5,doorY+doorH*0.45,2.5,0,Math.PI*2);c.fill();
  // Hinges
  c.fillStyle='#888';
  [[doorX+1,doorY+8],[doorX+1,doorY+doorH-14]].forEach(([hx,hy])=>c.fillRect(hx,hy,3,5));

  // ═══ 5. CỘT (vẽ sau cella, CHE lên tường) ═════════════════
  const colSpacing = (W - COL_W) / (COL_N - 1);
  for(let ci=0;ci<COL_N;ci++){
    const colCX = rx + ci * colSpacing + COL_W/2;

    // ── Base (stylobate contact) ──
    c.fillStyle='#d8d0be'; c.fillRect(colCX-COL_W/2-1,colBottom-5,COL_W+2,5);
    c.fillStyle='rgba(0,0,0,0.1)'; c.fillRect(colCX-COL_W/2-1,colBottom-1,COL_W+2,1);

    // ── Shaft (Entasis — phình nhẹ ở giữa) ──
    c.save();
    const sg2=c.createLinearGradient(colCX-COL_W/2,0,colCX+COL_W/2,0);
    sg2.addColorStop(0,'#d8d0be');
    sg2.addColorStop(0.25,'#f8f2e4');
    sg2.addColorStop(0.55,'#f0ead8');
    sg2.addColorStop(0.8,'#e0d8c8');
    sg2.addColorStop(1,'#c0b8a8');
    c.fillStyle=sg2;
    const topW  = COL_W - 2;   // cột thon nhỏ ở trên
    const botW  = COL_W;        // cột to hơn ở dưới
    const midBulge = 0.8;       // độ phình ở giữa (px)
    c.beginPath();
    // left edge
    c.moveTo(colCX - botW/2,      colBottom-5);
    c.bezierCurveTo(
      colCX - botW/2 - midBulge, colBottom - COL_H*0.35,
      colCX - topW/2 - midBulge, colTop + COL_H*0.2,
      colCX - topW/2,             colTop
    );
    // top
    c.lineTo(colCX + topW/2, colTop);
    // right edge
    c.bezierCurveTo(
      colCX + topW/2 + midBulge, colTop + COL_H*0.2,
      colCX + botW/2 + midBulge, colBottom - COL_H*0.35,
      colCX + botW/2,             colBottom-5
    );
    c.closePath();c.fill();
    c.restore();

    // ── Fluting (rãnh dọc) ──
    c.save();c.globalAlpha=0.13;c.strokeStyle='#8a8070';c.lineWidth=0.5;
    for(let fl=1;fl<5;fl++){
      const fx = colCX - topW/2 + fl*(topW/5);
      c.beginPath();c.moveTo(fx,colTop+3);c.lineTo(fx,colBottom-7);c.stroke();
    }
    c.restore();

    // ── Capital Doric (echinus + abacus) ──
    // Echinus (phần cong tròn)
    const echH=6;
    c.fillStyle='#e8e0d0';
    c.beginPath();
    c.moveTo(colCX-topW/2,colTop+echH);
    c.bezierCurveTo(colCX-topW/2-2,colTop+echH*0.5,colCX-(COL_W+6)/2,colTop+1,colCX-(COL_W+6)/2,colTop);
    c.lineTo(colCX+(COL_W+6)/2,colTop);
    c.bezierCurveTo(colCX+(COL_W+6)/2,colTop+1,colCX+topW/2+2,colTop+echH*0.5,colCX+topW/2,colTop+echH);
    c.closePath();c.fill();
    c.fillStyle='rgba(0,0,0,0.08)';c.fillRect(colCX-(COL_W+6)/2,colTop,COL_W+6,2);
    // Abacus (tấm phẳng trên đỉnh)
    c.fillStyle='#ddd5c2';c.fillRect(colCX-(COL_W+7)/2,colTop-5,COL_W+7,5);
    c.fillStyle='rgba(255,255,255,0.2)';c.fillRect(colCX-(COL_W+7)/2,colTop-5,COL_W+7,1);
    c.fillStyle='rgba(0,0,0,0.12)';c.fillRect(colCX-(COL_W+7)/2,colTop-1,COL_W+7,1);
  }

  // ═══ 6. ENTABLATURE ════════════════════════════════════════
  // Architrave (band dưới cùng)
  const archH=7;
  const archG=c.createLinearGradient(entabLeft,entabBot-ENTAB_H,entabRight,entabBot);
  archG.addColorStop(0,'#f5eed8');archG.addColorStop(1,'#ddd5c0');
  c.fillStyle=archG;c.fillRect(entabLeft,entabBot-ENTAB_H,entabW,archH);
  c.fillStyle='rgba(255,255,255,0.2)';c.fillRect(entabLeft,entabBot-ENTAB_H,entabW,1);

  // Frieze (band giữa — triglyphs + metopes)
  const friezeY=entabBot-ENTAB_H+archH, friezeH=9;
  const fg2=c.createLinearGradient(entabLeft,friezeY,entabRight,friezeY+friezeH);
  fg2.addColorStop(0,'#ede5d0');fg2.addColorStop(1,'#d5cdb8');
  c.fillStyle=fg2;c.fillRect(entabLeft,friezeY,entabW,friezeH);
  // Triglyphs (hình chữ nhật xẫm — cách đều)
  const tgW=8, tgGap=Math.floor(entabW/(COL_N));
  for(let t=0;t<COL_N;t++){
    const tx=entabLeft + t*tgGap + (tgGap-tgW)/2;
    c.fillStyle='#9a8e78';c.fillRect(tx,friezeY+1,tgW,friezeH-2);
    // 3 grooves trên triglyph
    c.save();c.globalAlpha=0.35;c.strokeStyle='#6a6050';c.lineWidth=1;
    [2,4,6].forEach(gx=>{
      c.beginPath();c.moveTo(tx+gx,friezeY+1);c.lineTo(tx+gx,friezeY+friezeH-1);c.stroke();
    });
    c.restore();
  }
  // Metopes — hình trang trí giữa triglyphs (vẽ nhẹ)
  for(let t=0;t<COL_N-1;t++){
    const mx=entabLeft+t*tgGap+tgW+(tgGap-tgW)/2+1;
    const mw=tgGap-tgW-2;
    c.save();c.globalAlpha=0.18;c.fillStyle='#b0a490';
    // Hình trang trí đơn giản (khiên tròn)
    c.beginPath();c.arc(mx+mw/2,friezeY+friezeH/2,Math.min(3,mw/2-1),0,Math.PI*2);c.fill();
    c.restore();
  }

  // Cornice (band trên cùng — nhô ra ngoài nhất)
  const cornH=4;
  const cornY=friezeY+friezeH;
  const cornOvh=4; // nhô thêm so với entab
  c.fillStyle='#f0e8d4';c.fillRect(entabLeft-cornOvh,cornY,entabW+cornOvh*2,cornH);
  c.fillStyle='rgba(0,0,0,0.15)';c.fillRect(entabLeft-cornOvh,cornY+cornH-1,entabW+cornOvh*2,1);
  c.fillStyle='rgba(255,255,255,0.25)';c.fillRect(entabLeft-cornOvh,cornY,entabW+cornOvh*2,1);

  // ═══ 7. PEDIMENT (tam giác) ════════════════════════════════
  const pedLeft  = entabLeft  - cornOvh;
  const pedRight = entabRight + cornOvh;
  const pedWidth = pedRight - pedLeft;

  // Fill tam giác pediment
  const pg=c.createLinearGradient(cx,pedApex,cx,pedBot);
  pg.addColorStop(0,'#f8f4e8');pg.addColorStop(1,'#e8e0cc');
  c.fillStyle=pg;
  c.beginPath();
  c.moveTo(pedLeft,  pedBot);
  c.lineTo(cx,       pedApex);
  c.lineTo(pedRight, pedBot);
  c.closePath();c.fill();

  // Tympanum — phần trong tam giác (sáng hơn một chút)
  const tympInset=6;
  const tympScale=(pedWidth-tympInset*2)/pedWidth;
  c.save();c.globalAlpha=0.5;c.fillStyle='#f5f0e0';
  c.beginPath();
  c.moveTo(pedLeft+tympInset, pedBot-2);
  c.lineTo(cx, pedApex+tympInset/tympScale*1.4);
  c.lineTo(pedRight-tympInset, pedBot-2);
  c.closePath();c.fill();c.restore();

  // Tượng điêu khắc bên trong tympanum — cân đối 2 bên
  c.save();c.globalAlpha=0.55;c.fillStyle='#c8b890';
  // Nhân vật trung tâm (đứng)
  const figMidY = pedBot - (pedBot-pedApex)*0.38;
  c.beginPath();c.arc(cx, figMidY-8, 6, Math.PI, 0);c.fill();    // đầu
  c.fillRect(cx-3, figMidY-8, 6, 16);                              // thân
  // Nhân vật bên trái (quỳ)
  const lFigX=cx - pedWidth*0.22;
  const lFigY=pedBot - (pedBot-pedApex)*0.15;
  c.beginPath();c.arc(lFigX, lFigY-5, 4, Math.PI,0);c.fill();
  c.fillRect(lFigX-2, lFigY-5, 5, 10);
  c.fillRect(lFigX-5, lFigY+3, 12, 4);  // ngồi
  // Nhân vật bên phải (đối xứng)
  const rFigX=cx + pedWidth*0.22;
  const rFigY=lFigY;
  c.beginPath();c.arc(rFigX, rFigY-5, 4, Math.PI,0);c.fill();
  c.fillRect(rFigX-3, rFigY-5, 5, 10);
  c.fillRect(rFigX-7, rFigY+3, 12, 4);
  // Hình nằm ở góc (Reclining figure — cân đối)
  [[cx-pedWidth*0.38, pedBot-5, 16,5],[cx+pedWidth*0.22+14, pedBot-5, 16,5]].forEach(([fx,fy,fw,fh])=>{
    c.beginPath();c.ellipse(fx+fw/2,fy,fw/2,fh/2,0,0,Math.PI*2);c.fill();
  });
  c.restore();

  // Raking cornice (viền tam giác) — dày rõ
  c.strokeStyle='#c8bca8';c.lineWidth=2.5;
  c.beginPath();
  c.moveTo(pedLeft, pedBot);
  c.lineTo(cx,      pedApex);
  c.lineTo(pedRight,pedBot);
  c.stroke();
  // Horizontal cornice (đáy tam giác)
  c.strokeStyle='#b8b0a0';c.lineWidth=2;
  c.beginPath();c.moveTo(pedLeft,pedBot);c.lineTo(pedRight,pedBot);c.stroke();

  // Acroteria — chóp trang trí 3 đỉnh
  // Trung tâm
  c.fillStyle='#e8e0d0';
  c.fillRect(cx-4, pedApex-12, 8, 12);
  c.beginPath();c.moveTo(cx-6,pedApex-12);c.lineTo(cx,pedApex-20);c.lineTo(cx+6,pedApex-12);c.closePath();c.fill();
  // Trái
  c.fillRect(pedLeft-4, pedBot-10, 8, 10);
  c.beginPath();c.moveTo(pedLeft-6,pedBot-10);c.lineTo(pedLeft,pedBot-18);c.lineTo(pedLeft+6,pedBot-10);c.closePath();c.fill();
  // Phải (đối xứng)
  c.fillRect(pedRight-4, pedBot-10, 8, 10);
  c.beginPath();c.moveTo(pedRight-6,pedBot-10);c.lineTo(pedRight,pedBot-18);c.lineTo(pedRight+6,pedBot-10);c.closePath();c.fill();

  // ═══ 8. DOOR GLOW ══════════════════════════════════════════
  drawDoorGlow(c,h,cx,doorY);

  // ═══ 9. BIỂN TÊN ═══════════════════════════════════════════
  drawHouseSign(c,rx,gY,W,h.name,'#d8d0be','#3a2a10');
}


// 📖 NHÀ VĂN HỌC — Cottage Anh ấm cúng với mái rơm và leo hoa


// ─────────────────────────────────────────────────────────────────
// 📖 VĂN HỌC — Cottage Anh với mái rạ cân đối và hoa leo
// ─────────────────────────────────────────────────────────────────
function drawLitHouse(c,h,rx,gY){
  const W=h.width, H=h.height;
  const cx=rx+W/2;
  const ry=gY-H;

  // Shadow
  c.save();c.globalAlpha=0.2;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+6,W/2+14,7,0,0,Math.PI*2);c.fill();c.restore();

  // ── Nền tường gỗ (half-timbered) ──────────────────────
  c.fillStyle='#f0e8d0';c.fillRect(rx,ry,W,H);

  // Xà gỗ ngang
  const beamColor='#5a3510';
  [0.18,0.44,0.68,0.88].forEach(t=>{
    c.fillStyle=beamColor;c.fillRect(rx,ry+H*t,W,5);
    c.fillStyle='rgba(255,255,255,0.15)';c.fillRect(rx,ry+H*t,W,1);
  });
  // Xà gỗ dọc
  [0.15,0.38,0.62,0.85].forEach(t=>{
    c.fillStyle=beamColor;c.fillRect(rx+W*t,ry,5,H);
  });
  // Xà gỗ chéo (đặc trưng Tudor)
  [[0.15,0.18,0.38,0.44],[0.38,0.44,0.62,0.68]].forEach(([x1,y1,x2,y2])=>{
    c.strokeStyle=beamColor;c.lineWidth=4;
    c.beginPath();c.moveTo(rx+W*x1,ry+H*y1);c.lineTo(rx+W*x2,ry+H*y2);c.stroke();
    c.beginPath();c.moveTo(rx+W*x2,ry+H*y1);c.lineTo(rx+W*x1,ry+H*y2);c.stroke();
  });
  // Lấp plaster giữa xà
  c.fillStyle='#ede0c0';
  c.fillRect(rx+W*0.15+5,ry+5,W*0.23-5,H*0.18-5);
  c.fillRect(rx+W*0.38+5,ry+5,W*0.24-5,H*0.18-5);
  c.fillRect(rx+W*0.62+5,ry+5,W*0.23-5,H*0.18-5);

  // Viền tường
  c.strokeStyle='#4a2e10';c.lineWidth=2;c.strokeRect(rx,ry,W,H);

  // ── Nền foundation ──────────────────────────────────────
  c.fillStyle='#908070';c.fillRect(rx-4,gY-14,W+8,14);
  c.fillStyle='#a09080';c.fillRect(rx-4,gY-14,W+8,4);
  c.strokeStyle='#6a6050';c.lineWidth=1;
  for(let s=0;s<Math.ceil((W+8)/18);s++){
    c.strokeRect(rx-4+s*18,gY-14,18,7);
    c.strokeRect(rx-4+s*18+9,gY-7,18,7);
  }

  // ── CỬA chính ────────────────────────────────────────────
  const dW=28,dH=50,dX=cx-dW/2,dY=gY-dH;
  // Khung cửa gỗ đậm
  c.fillStyle='#3a2010';c.fillRect(dX-4,dY-4,dW+8,dH+4);
  // Cánh cửa
  c.fillStyle='#6a3c18';c.fillRect(dX,dY,dW,dH);
  c.fillStyle='#7a4a20';c.fillRect(dX+1,dY+1,dW/2-2,dH-2);
  // Ô cửa
  [[0,0],[1,0],[0,1],[1,1]].forEach(([ci,ri])=>{
    c.fillStyle='rgba(0,0,0,0.2)';
    c.fillRect(dX+3+ci*(dW/2-2),dY+4+ri*(dH/2-4),dW/2-6,dH/2-8);
  });
  // Tay nắm
  c.fillStyle='#d4a020';c.beginPath();c.arc(dX+dW-5,dY+dH*0.55,3,0,Math.PI*2);c.fill();
  c.fillStyle='#b88800';c.beginPath();c.arc(dX+dW-5,dY+dH*0.55,1.5,0,Math.PI*2);c.fill();
  drawDoorGlow(c,h,cx,dY);

  // ── CỬA SỔ ──────────────────────────────────────────────
  // Trái
  drawNiceWindow(c,rx+W*0.06,ry+H*0.22,26,22,'#d4c88a','#5a3510',true);
  // Phải
  drawNiceWindow(c,rx+W*0.72,ry+H*0.22,26,22,'#d4c88a','#5a3510',true);
  // Tầng 2 giữa (dormant)
  drawNiceWindow(c,cx-13,ry+H*0.06,26,18,'#d4c88a','#5a3510',false);

  // ── MÁI NHÀ (A-frame gỗ Tudor, 3 tầng eaves) ───────────
  const roofBot = ry;           // đáy mái = đỉnh tường
  const roofTop = ry - H*0.52; // đỉnh mái
  const OVHG = 20;              // nhô ra 2 bên

  // Bóng mái
  c.save();c.globalAlpha=0.25;c.fillStyle='#000';
  c.beginPath();
  c.moveTo(rx-OVHG-4,roofBot+4);c.lineTo(cx,roofTop-4);c.lineTo(rx+W+OVHG+4,roofBot+4);
  c.closePath();c.fill();c.restore();

  // Mái chính — màu gạch đỏ nâu (tile)
  c.fillStyle='#8a4428';
  c.beginPath();
  c.moveTo(rx-OVHG,roofBot);c.lineTo(cx,roofTop);c.lineTo(rx+W+OVHG,roofBot);
  c.closePath();c.fill();

  // Hàng ngói (tile rows) — sọc ngang xen kẽ
  const nRows=8;
  for(let r=0;r<nRows;r++){
    const t=(r+0.5)/nRows;
    const rowY=roofBot+(roofTop-roofBot)*t;
    const halfW=(rx+W+OVHG-cx)*(1-t)+(cx-(rx-OVHG))*(1-t);
    const rowLeft=cx-halfW*0.5*(1-t)-(rx+W/2-cx)*(1-t);
    // tính width tại độ cao này
    const frac=1-t;
    const rW=(W+OVHG*2)*frac;
    const rX=cx-rW/2;
    c.fillStyle=r%2===0?'#9a5030':'#7a3820';
    c.fillRect(rX,rowY,rW,Math.abs(roofTop-roofBot)/nRows+1);
    // Đường kẻ ngói nhỏ
    c.save();c.globalAlpha=0.2;c.strokeStyle='#3a1808';c.lineWidth=0.5;
    const tileW=12;
    for(let ti=0;ti<Math.ceil(rW/tileW);ti++){
      c.beginPath();c.moveTo(rX+ti*tileW,rowY);c.lineTo(rX+ti*tileW,rowY+(roofTop-roofBot)/nRows);c.stroke();
    }
    c.restore();
  }

  // Viền raking (2 cạnh bên mái)
  c.strokeStyle='#4a2010';c.lineWidth=3;
  c.beginPath();c.moveTo(rx-OVHG,roofBot);c.lineTo(cx,roofTop);c.lineTo(rx+W+OVHG,roofBot);c.stroke();

  // Eave board (dải gỗ ở đáy mái)
  c.fillStyle='#5a3010';c.fillRect(rx-OVHG,roofBot,W+OVHG*2,6);
  c.fillStyle='rgba(255,255,255,0.15)';c.fillRect(rx-OVHG,roofBot,W+OVHG*2,2);

  // ── DORMER (cửa sổ trong mái) ────────────────────────────
  const dormW=34,dormH=28;
  const dormX=cx-dormW/2, dormY=roofTop+(roofBot-roofTop)*0.38;
  // Mái dormer nhỏ
  c.fillStyle='#7a3820';
  c.beginPath();c.moveTo(dormX-6,dormY+dormH);c.lineTo(cx,dormY-6);c.lineTo(dormX+dormW+6,dormY+dormH);c.closePath();c.fill();
  c.fillStyle='#5a2810';
  c.beginPath();c.moveTo(dormX-6,dormY+dormH);c.lineTo(dormX-6,dormY+dormH+3);c.lineTo(dormX+dormW+6,dormY+dormH+3);c.lineTo(dormX+dormW+6,dormY+dormH);c.closePath();c.fill();
  // Thân dormer
  c.fillStyle='#ede0c0';c.fillRect(dormX,dormY,dormW,dormH);
  c.fillStyle='#5a3510';c.fillRect(dormX,dormY,3,dormH);c.fillRect(dormX+dormW-3,dormY,3,dormH);
  drawNiceWindow(c,dormX+3,dormY+3,dormW-6,dormH-6,'#d4c88a','#5a3510',false);

  // ── ỐNG KHÓI (2 cái) ─────────────────────────────────────
  drawChimney(c,cx-W*0.2,roofTop+(roofBot-roofTop)*0.5,'#8a5030','#6a3820');
  drawChimney(c,cx+W*0.2,roofTop+(roofBot-roofTop)*0.5,'#8a5030','#6a3820');

  // ── ĐỉNH MÁI — weather vane ──────────────────────────────
  c.fillStyle='#5a3010';c.fillRect(cx-1,roofTop-18,2,18);
  c.fillStyle='#c0a000';
  c.beginPath();c.moveTo(cx-8,roofTop-18);c.lineTo(cx+12,roofTop-14);c.lineTo(cx+12,roofTop-10);c.lineTo(cx-8,roofTop-14);c.closePath();c.fill();
  c.fillStyle='#d4b000';c.beginPath();c.arc(cx,roofTop-18,3,0,Math.PI*2);c.fill();

  drawHouseSign(c,rx,gY,W,h.name,'#5a3510','#f0e8d0');
}


// ─────────────────────────────────────────────────────────────────
// 🏫 CÔNG DÂN — Tòa nhà chính phủ xanh với pediment + cờ
// ─────────────────────────────────────────────────────────────────
function drawCivicHouse(c,h,rx,gY){
  const W=h.width, H=h.height, ry=gY-H;
  const cx=rx+W/2;
  c.save();c.globalAlpha=0.18;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+6,W/2+14,7,0,0,Math.PI*2);c.fill();c.restore();

  // Foundation
  for(let s=0;s<Math.ceil((W+10)/18);s++){
    c.fillStyle=s%2===0?'#6a7a8a':'#7a8a9a';
    c.fillRect(rx-5+s*18,gY-12,17,12);
    c.strokeStyle='rgba(0,0,0,0.2)';c.lineWidth=0.5;c.strokeRect(rx-5+s*18,gY-12,17,12);
  }
  // Wall — deep blue
  const wallG=c.createLinearGradient(rx,ry,rx+W,ry+H);
  wallG.addColorStop(0,'#3a6aaa');wallG.addColorStop(0.5,'#2255a8');wallG.addColorStop(1,'#1a4080');
  c.fillStyle=wallG;c.fillRect(rx,ry,W,H);
  c.save();c.globalAlpha=0.1;c.strokeStyle='#fff';c.lineWidth=0.5;
  for(let row=0;row<Math.floor(H/11);row++){
    c.beginPath();c.moveTo(rx,ry+row*11);c.lineTo(rx+W,ry+row*11);c.stroke();
    for(let col=0;col<5;col++){
      const bx=rx+col*(W/5)+(row%2?W/10:0);
      c.beginPath();c.moveTo(bx,ry+row*11);c.lineTo(bx,ry+row*11+11);c.stroke();
    }
  }
  c.restore();
  c.save();const ss=c.createLinearGradient(rx,0,rx+W,0);
  ss.addColorStop(0,'rgba(0,0,0,0.25)');ss.addColorStop(0.1,'transparent');
  ss.addColorStop(0.9,'transparent');ss.addColorStop(1,'rgba(0,0,0,0.2)');
  c.fillStyle=ss;c.fillRect(rx,ry,W,H);c.restore();

  // Entablature band (nằm trên tường, dưới pediment)
  const ENTAB_H=12, OVH=9;
  c.fillStyle='#c8d8e8';c.fillRect(rx-OVH,ry-ENTAB_H,W+OVH*2,ENTAB_H+2);
  c.fillStyle='rgba(255,255,255,0.25)';c.fillRect(rx-OVH,ry-ENTAB_H,W+OVH*2,2);
  c.fillStyle='rgba(0,0,0,0.15)';c.fillRect(rx-OVH,ry+1,W+OVH*2,2);

  // Cột trắng (3 cột) — chân đất, đỉnh nối entablature
  const COL_N=3, colW=12;
  const colPad=W*0.12;
  const colSpacing=(W-colPad*2-colW)/(COL_N-1);
  const colTop=ry-ENTAB_H;
  const colBottom=gY-12;
  const colH=colBottom-colTop;
  for(let ci=0;ci<COL_N;ci++){
    const ccx=rx+colPad+ci*colSpacing+colW/2;
    const cg=c.createLinearGradient(ccx-colW/2,0,ccx+colW/2,0);
    cg.addColorStop(0,'#d0d8e8');cg.addColorStop(0.3,'#ffffff');cg.addColorStop(0.7,'#eef0f8');cg.addColorStop(1,'#b8c0d0');
    c.fillStyle=cg;c.fillRect(ccx-colW/2,colTop,colW,colH);
    c.fillStyle='rgba(0,0,0,0.1)';c.fillRect(ccx+colW/2-2,colTop,2,colH);
    c.fillStyle='#e8eef8';c.fillRect(ccx-colW/2-3,colTop-4,colW+6,5);
    c.fillStyle='#dde5f0';c.fillRect(ccx-colW/2-2,colBottom-4,colW+4,4);
  }

  // Pediment tam giác
  const pedH=Math.round(W*0.34);
  const pedBase=colTop-1;
  const pedApex=pedBase-pedH;
  const roofG=c.createLinearGradient(rx,pedApex,rx+W,pedBase);
  roofG.addColorStop(0,'#1a3a6a');roofG.addColorStop(1,'#2255a8');
  c.fillStyle=roofG;
  c.beginPath();c.moveTo(rx-OVH,pedBase);c.lineTo(cx,pedApex);c.lineTo(rx+W+OVH,pedBase);c.closePath();c.fill();
  c.strokeStyle='#4488cc';c.lineWidth=1.5;
  c.beginPath();c.moveTo(rx-OVH,pedBase);c.lineTo(cx,pedApex);c.lineTo(rx+W+OVH,pedBase);c.stroke();
  c.beginPath();c.moveTo(rx-OVH,pedBase);c.lineTo(rx+W+OVH,pedBase);c.stroke();
  c.fillStyle='#ffd700';c.font='bold 9px serif';c.textAlign='center';
  c.shadowColor='#ffd700';c.shadowBlur=5;
  c.fillText('★  ★  ★',cx,pedApex+pedH*0.52);c.shadowBlur=0;
  // Cờ
  const flagY=pedApex-22;
  c.strokeStyle='#999';c.lineWidth=1.5;
  c.beginPath();c.moveTo(cx,flagY);c.lineTo(cx,pedApex);c.stroke();
  c.fillStyle='#da0000';c.fillRect(cx,flagY,16,11);
  c.fillStyle='#ffff00';c.font='7px serif';c.textAlign='left';c.fillText('★',cx+4,flagY+8);

  // Cửa đôi chính giữa
  const dW=34,dH=44,dX=cx-dW/2,dY=gY-dH;
  c.fillStyle='#0a2244';c.fillRect(dX-3,dY-3,dW+6,dH+3);
  c.fillStyle='#0d2a50';c.fillRect(dX,dY,dW/2,dH);c.fillRect(dX+dW/2,dY,dW/2,dH);
  c.strokeStyle='#4488cc';c.lineWidth=1;
  c.strokeRect(dX,dY,dW/2,dH);c.strokeRect(dX+dW/2,dY,dW/2,dH);
  [[dX+2,dY+4,12,15],[dX+dW/2+2,dY+4,12,15],[dX+2,dY+24,12,14],[dX+dW/2+2,dY+24,12,14]].forEach(([px,py,pw,ph])=>{
    c.strokeStyle='rgba(100,160,255,0.3)';c.lineWidth=0.7;c.strokeRect(px,py,pw,ph);
  });
  c.fillStyle='#ffd700';
  c.beginPath();c.arc(dX+dW/2-3,dY+dH*0.55,2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(dX+dW/2+3,dY+dH*0.55,2,0,Math.PI*2);c.fill();

  // 4 cửa sổ CÂN ĐỐI — 2 cột x 2 hàng, đối xứng qua trục dọc
  const winW=W*0.2, winH=H*0.17;
  const margin=W*0.07;
  const winXL=rx+margin;
  const winXR=rx+W-margin-winW;
  const winY1=ry+H*0.20;
  const winY2=ry+H*0.52;
  [[winXL,winY1],[winXR,winY1],[winXL,winY2],[winXR,winY2]].forEach(([wx,wy])=>{
    drawNiceWindow(c,wx,wy,winW,winH,'#99ccff','#1a3a6a',false);
  });

  // Emblem
  c.save();c.globalAlpha=0.6;c.fillStyle='#ffd700';c.font='bold 14px serif';c.textAlign='center';
  c.shadowColor='#ffd700';c.shadowBlur=4;c.fillText('🏛',cx,ry+H*0.43);c.restore();

  drawDoorGlow(c,h,cx,dY);
  drawHouseSign(c,rx,gY,W,h.name,'#1a3a6a','#e8f4ff');
}

// ─────────────────────────────────────────────────────────────────
// 🔤 TIẾNG ANH — Trường Anh gạch đỏ với đồng hồ tháp và cờ
// ─────────────────────────────────────────────────────────────────
function drawEnglishHouse(c,h,rx,gY){
  const W=h.width, H=h.height, ry=gY-H;
  const cx=rx+W/2;
  c.save();c.globalAlpha=0.18;c.fillStyle='#000';
  c.beginPath();c.ellipse(cx,gY+6,W/2+14,7,0,0,Math.PI*2);c.fill();c.restore();

  // Foundation đá
  drawFoundation(c,rx,gY,W,'#665555','#443333');

  // Wall — brick đỏ đậm
  const wallG=c.createLinearGradient(rx,ry,rx+W,ry+H);
  wallG.addColorStop(0,'#c43030');wallG.addColorStop(0.5,'#b02020');wallG.addColorStop(1,'#8c1010');
  c.fillStyle=wallG;c.fillRect(rx,ry,W,H);
  // Brick pattern
  c.save();c.globalAlpha=0.13;
  for(let row=0;row<Math.floor(H/9);row++){
    c.strokeStyle='#220000';c.lineWidth=0.6;
    c.beginPath();c.moveTo(rx,ry+row*9);c.lineTo(rx+W,ry+row*9);c.stroke();
    for(let col=0;col<6;col++){
      const bx=rx+col*(W/5.5)+(row%2?W/11:0);
      c.beginPath();c.moveTo(bx,ry+row*9);c.lineTo(bx,ry+row*9+9);c.stroke();
    }
  }
  c.restore();
  // Quoins góc (trắng)
  [[0],[W-10]].forEach(([ox])=>{
    for(let q=0;q<Math.floor(H/20);q++){
      c.fillStyle=q%2===0?'#dddddd':'#cccccc';
      c.fillRect(rx+ox,ry+q*20+(q%2?8:0),10,q%2===0?10:8);
    }
  });
  c.save();const ss=c.createLinearGradient(rx,0,rx+W,0);
  ss.addColorStop(0,'rgba(0,0,0,0.2)');ss.addColorStop(0.1,'transparent');
  ss.addColorStop(0.9,'transparent');ss.addColorStop(1,'rgba(0,0,0,0.15)');
  c.fillStyle=ss;c.fillRect(rx,ry,W,H);c.restore();

  // Mái tam giác (peaked roof) — nằm trên tường
  const roofH=H*0.42;
  drawTriRoof(c,rx,ry,W,roofH,'#7a1515','#b02020',7);

  // Cột cờ + cờ Union Jack
  const flagX=cx+2, flagY=ry-roofH-22;
  c.strokeStyle='#aaa';c.lineWidth=1.5;c.beginPath();c.moveTo(flagX,flagY);c.lineTo(flagX,ry-roofH);c.stroke();
  c.fillStyle='#003399';c.fillRect(flagX,flagY,18,12);
  c.fillStyle='#cc0000';c.fillRect(flagX+6,flagY,6,12);c.fillRect(flagX,flagY+4,18,4);
  c.fillStyle='#fff';c.fillRect(flagX+7,flagY,4,12);c.fillRect(flagX,flagY+5,18,2);

  // Đồng hồ trên mặt trước (dưới mái)
  const clx=cx, cly=ry+H*0.2;
  c.fillStyle='#ffffff';c.beginPath();c.arc(clx,cly,16,0,Math.PI*2);c.fill();
  c.strokeStyle='#444';c.lineWidth=1.5;c.beginPath();c.arc(clx,cly,16,0,Math.PI*2);c.stroke();
  c.fillStyle='#333';c.font='5px sans-serif';c.textAlign='center';
  ['12','3','6','9'].forEach((num,i)=>{
    const a=i*Math.PI/2-Math.PI/2;
    c.fillText(num,clx+Math.cos(a)*12,cly+Math.sin(a)*12+1.5);
  });
  const now=new Date();
  const hr=(now.getHours()%12+now.getMinutes()/60)*(Math.PI/6)-Math.PI/2;
  const mn=now.getMinutes()*(Math.PI/30)-Math.PI/2;
  c.strokeStyle='#111';c.lineWidth=2;c.beginPath();c.moveTo(clx,cly);c.lineTo(clx+Math.cos(hr)*8,cly+Math.sin(hr)*8);c.stroke();
  c.lineWidth=1;c.beginPath();c.moveTo(clx,cly);c.lineTo(clx+Math.cos(mn)*12,cly+Math.sin(mn)*12);c.stroke();
  c.fillStyle='#cc2200';c.beginPath();c.arc(clx,cly,1.5,0,Math.PI*2);c.fill();
  // Viền đồng hồ
  c.strokeStyle='#888';c.lineWidth=1;c.strokeRect(clx-18,cly-18,36,6);c.strokeRect(clx-18,cly+12,36,6);

  // Cửa sổ (4, cân đối 2×2)
  [[0.07,0.4],[0.68,0.4],[0.07,0.64],[0.68,0.64]].forEach(([xf,yf])=>{
    drawNiceWindow(c,rx+xf*W,ry+yf*H,W*0.22,H*0.18,'#aaddff','#881a1a',true);
  });

  // Chữ "ABC" decorative
  c.save();c.globalAlpha=0.7;c.fillStyle='#ffe0e0';c.font='bold 11px "Times New Roman"';c.textAlign='center';
  c.shadowColor='#cc2222';c.shadowBlur=4;c.fillText('A B C',cx,ry+H*0.56);c.restore();

  // Cửa chính arched
  const dW=28,dH=44,dX=cx-dW/2,dY=gY-dH;
  c.fillStyle='#1a0000';
  c.beginPath();c.arc(cx,dY,dW/2+1,Math.PI,0);c.fill();
  c.fillRect(dX,dY,dW,dH);
  c.strokeStyle='#ff8888';c.lineWidth=1;
  c.beginPath();c.arc(cx,dY,dW/2+3,Math.PI,0);c.stroke();
  c.strokeRect(dX-2,dY-1,dW+4,dH+1);
  // Đá vòm keystone
  c.fillStyle='#ddd';c.fillRect(cx-3,dY-dW/2-1,6,7);
  // Door panels
  c.fillStyle='#2d0505';c.fillRect(dX+2,dY+4,11,36);c.fillRect(dX+15,dY+4,11,36);
  c.fillStyle='#aa1515';
  [[dX+5,dY+8],[dX+18,dY+8],[dX+5,dY+24],[dX+18,dY+24]].forEach(([px,py])=>{
    c.fillRect(px,py,5,8);
  });
  c.fillStyle='#ffdd88';c.beginPath();c.arc(dX+dW/2-2,dY+dH*0.48,2,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(dX+dW/2+2,dY+dH*0.48,2,0,Math.PI*2);c.fill();
  drawDoorGlow(c,h,cx,dY);

  // Chimney nhỏ
  drawChimney(c,cx+W*0.24,ry,'#aa3333','#882222');

  drawHouseSign(c,rx,gY,W,h.name,'#8b1a1a','#fff0f0');
}


// ─── Dispatcher ──────────────────────────────────────────────────────────────
function drawHDHouse(c,h,camX){
  const gY=GH*(0.65);
  const rx=h.worldX-camX;
  if(rx>GW+100||rx+h.width<-100)return;

  // Ground shadow under all houses
  c.save();c.globalAlpha=0.22;c.fillStyle='#000';
  c.beginPath();c.ellipse(rx+h.width/2,gY+7,h.width/2+10,8,0,0,Math.PI*2);c.fill();
  c.restore();

  if(h.id==='math')       drawMathHouse(c,h,rx,gY);
  else if(h.id==='geo')   drawGeoHouse(c,h,rx,gY);
  else if(h.id==='history') drawHistoryHouse(c,h,rx,gY);
  else if(h.id==='literature') drawLitHouse(c,h,rx,gY);
  else if(h.id==='civic') drawCivicHouse(c,h,rx,gY);
  else if(h.id==='english') drawEnglishHouse(c,h,rx,gY);
}

