// ═══════════════════════════════════════════
// WORLD DRAWING — HD
// ═══════════════════════════════════════════
let timeOfDay=0; // 0-1 day cycle

function drawSky(c,camX){
  const td=Math.sin(timeOfDay*Math.PI*2);
  const isDawn=timeOfDay>0.1&&timeOfDay<0.3;
  const isDusk=timeOfDay>0.6&&timeOfDay<0.85;
  const isNight=td<-0.1;

  // Sky gradient
  let skyTop,skyMid,skyBot;
  if(isNight){
    skyTop='#020410';skyMid='#050820';skyBot='#0a0d1a';
  } else if(isDawn){
    const t=(timeOfDay-0.1)/0.2;
    skyTop=`hsl(240,60%,${8+t*22}%)`;skyMid=`hsl(${220+t*40},70%,${18+t*30}%)`;skyBot=`hsl(${10+t*20},80%,${30+t*25}%)`;
  } else if(isDusk){
    const t=(timeOfDay-0.6)/0.25;
    skyTop=`hsl(${240-t*60},55%,${30-t*12}%)`;skyMid=`hsl(${30+t*10},90%,${40+t*5}%)`;skyBot=`hsl(${15},95%,${50}%)`;
  } else {
    skyTop=`hsl(210,${60+td*30}%,${15+td*38}%)`;skyMid=`hsl(200,55%,${25+td*35}%)`;skyBot=`hsl(195,${50+td*20}%,${35+td*30}%)`;
  }
  const sky=c.createLinearGradient(0,0,0,GH*(0.65));
  sky.addColorStop(0,skyTop);sky.addColorStop(0.5,skyMid);sky.addColorStop(1,skyBot);
  c.fillStyle=sky;c.fillRect(0,0,GW,GH*(0.65));

  // Aurora effect at night
  if(isNight){
    c.save();
    for(let a=0;a<3;a++){
      const ax=(camX*0.02+a*200+frameCount*0.3)%GW;
      const aw=120+a*40;
      const ay=GH*0.1+Math.sin(frameCount*0.008+a)*GH*0.08;
      c.globalAlpha=0.06+Math.sin(frameCount*0.015+a)*0.04;
      const ag=c.createLinearGradient(ax,ay,ax,ay+80);
      const aColors=['rgba(0,255,150,1)','rgba(100,0,255,1)','rgba(0,180,255,1)'];
      ag.addColorStop(0,'transparent');ag.addColorStop(0.3,aColors[a]);ag.addColorStop(1,'transparent');
      c.fillStyle=ag;c.fillRect(ax-aw/2,ay,aw,80);
    }
    c.restore();
  }

  // Stars — pixel style
  if(td<0.3){
    c.save();c.globalAlpha=Math.min(1,(0.3-td)/0.3);
    for(let s=0;s<80;s++){
      const sx=(s*157+33)%GW;
      const sy=(s*97)%130;
      const size=s%7===0?2:1;
      const flicker=0.4+Math.sin(frameCount*0.04+s*1.3)*0.6;
      c.fillStyle=s%5===0?'#aaddff':'#ffffff';
      c.globalAlpha*=flicker;
      c.fillRect(sx,sy,size,size);
      c.globalAlpha=Math.min(1,(0.3-td)/0.3);
    }
    // Moon
    const moonX=GW*0.2-camX*0.02;
    const moonY=40;
    c.globalAlpha=0.9;
    c.shadowColor='#cceeff';c.shadowBlur=20;
    c.fillStyle='#e8f0ff';c.beginPath();c.arc(moonX,moonY,16,0,Math.PI*2);c.fill();
    c.fillStyle='#c8d8f0';c.beginPath();c.arc(moonX+4,moonY-3,13,0,Math.PI*2);c.fill(); // crescent shadow
    c.shadowBlur=0;
    c.restore();
  }

  // Sun
  if(td>-0.1){
    const sunX=GW*0.72-camX*0.04;
    const sunY=50+td*(-35);
    c.save();
    // Sun glow halo
    const halo=c.createRadialGradient(sunX,sunY,0,sunX,sunY,70);
    if(isDusk||isDawn){
      halo.addColorStop(0,'rgba(255,180,60,0.5)');halo.addColorStop(0.4,'rgba(255,120,30,0.2)');halo.addColorStop(1,'transparent');
    } else {
      halo.addColorStop(0,'rgba(255,230,150,0.4)');halo.addColorStop(0.5,'rgba(255,210,100,0.1)');halo.addColorStop(1,'transparent');
    }
    c.fillStyle=halo;c.beginPath();c.arc(sunX,sunY,70,0,Math.PI*2);c.fill();
    // Sun body (pixel squares for pixel art feel)
    const sunCol=isDusk||isDawn?'#ff8c00':'#fff5cc';
    const sunBright=isDusk||isDawn?'#ffcc44':'#fffde0';
    c.shadowColor=sunCol;c.shadowBlur=30;
    c.fillStyle=sunCol;c.fillRect(sunX-11,sunY-11,22,22);
    c.fillStyle=sunBright;c.fillRect(sunX-7,sunY-7,14,14);
    c.fillStyle='#ffffff';c.fillRect(sunX-3,sunY-8,6,4);
    // Pixel rays
    const rayCol=isDusk||isDawn?'rgba(255,140,0,0.4)':'rgba(255,220,100,0.35)';
    c.strokeStyle=rayCol;c.lineWidth=2;
    for(let r=0;r<8;r++){
      const a=r*Math.PI/4+frameCount*0.006;
      c.beginPath();c.moveTo(sunX+Math.cos(a)*16,sunY+Math.sin(a)*16);c.lineTo(sunX+Math.cos(a)*30,sunY+Math.sin(a)*30);c.stroke();
    }
    // Extra long rays at dawn/dusk
    if(isDusk||isDawn){
      c.globalAlpha=0.15;c.strokeStyle='#ff8800';c.lineWidth=1;
      for(let r=0;r<16;r++){
        const a=r*Math.PI/8+frameCount*0.003;
        c.beginPath();c.moveTo(sunX+Math.cos(a)*20,sunY+Math.sin(a)*20);c.lineTo(sunX+Math.cos(a)*55,sunY+Math.sin(a)*55);c.stroke();
      }
    }
    c.restore();
  }

  // Distant mountains — parallax layer 1
  c.save();c.globalAlpha=isNight?0.7:0.55;
  const mt=c.createLinearGradient(0,GH*(0.30),0,GH*(0.65));
  const mCol1=isNight?'#0d1525':'#1e2d4a';
  const mCol2=isNight?'#060a12':'#0e1825';
  mt.addColorStop(0,mCol1);mt.addColorStop(1,mCol2);
  c.fillStyle=mt;
  const mpts=[[0,0.5],[0.05,0.25],[0.12,0.45],[0.18,0.18],[0.26,0.38],[0.35,0.15],[0.44,0.33],[0.52,0.12],[0.60,0.3],[0.68,0.08],[0.78,0.26],[0.88,0.1],[1,0.28],[1,1]];
  c.beginPath();c.moveTo(-10,GH*(0.65));
  const mOff=(camX*0.14)%(GW*1.5);
  mpts.forEach(([fx,fy])=>{
    const mx=fx*1400-mOff;
    c.lineTo(mx,GH*(0.32+fy*0.33));
    c.lineTo(mx+700,GH*(0.32+fy*0.33));
  });
  c.lineTo(GW+10,GH*(0.65));c.closePath();c.fill();
  c.restore();

  // Closer hills — parallax layer 2
  c.save();c.globalAlpha=isNight?0.85:0.75;
  const hil=c.createLinearGradient(0,GH*(0.40),0,GH*(0.65));
  const hCol1=isNight?'#0d1a12':'#1a3a22';
  const hCol2=isNight?'#080d09':'#0f2215';
  hil.addColorStop(0,hCol1);hil.addColorStop(1,hCol2);
  c.fillStyle=hil;
  c.beginPath();c.moveTo(-10,GH*(0.65));
  for(let hx=0;hx<=GW+100;hx+=6){
    const hy=GH*0.57+Math.sin((hx+camX*0.32)*0.011)*24+Math.sin((hx+camX*0.32)*0.023)*13;
    c.lineTo(hx,hy);
  }
  c.lineTo(GW+10,GH*(0.65));c.closePath();c.fill();
  // Hill highlight edge
  c.globalAlpha=0.15;c.strokeStyle=isNight?'#203828':'#4a8a52';c.lineWidth=1.5;
  c.beginPath();
  for(let hx=0;hx<=GW+100;hx+=6){
    const hy=GH*0.57+Math.sin((hx+camX*0.32)*0.011)*24+Math.sin((hx+camX*0.32)*0.023)*13;
    if(hx===0)c.moveTo(hx,hy);else c.lineTo(hx,hy);
  }
  c.stroke();
  c.restore();

  // Moving pixel-art clouds
  c.save();
  const cloudDefs=[
    {ox:0,   oy:GH*0.12, speed:0.06, scale:1.0,  alpha:isNight?0.07:0.92},
    {ox:420, oy:GH*0.07, speed:0.04, scale:1.5,  alpha:isNight?0.06:0.88},
    {ox:820, oy:GH*0.16, speed:0.08, scale:0.72, alpha:isNight?0.05:0.85},
    {ox:1240,oy:GH*0.10, speed:0.05, scale:1.2,  alpha:isNight?0.06:0.90},
    {ox:1660,oy:GH*0.19, speed:0.07, scale:0.85, alpha:isNight?0.05:0.86},
    {ox:2060,oy:GH*0.08, speed:0.06, scale:1.35, alpha:isNight?0.06:0.89},
    {ox:2460,oy:GH*0.14, speed:0.05, scale:0.65, alpha:isNight?0.04:0.82},
  ];
  cloudDefs.forEach(cl=>{
    const cx2=((cl.ox - camX*cl.speed*0.4 + frameCount*cl.speed*0.5)%((GW+340))+(GW+340))%(GW+340)-170;
    const cy2=cl.oy + Math.sin(frameCount*0.005+cl.ox*0.003)*4;
    c.globalAlpha = cl.alpha;
    drawPixelCloud(c, cx2, cy2, cl.scale, frameCount + cl.ox);
  });
  c.restore();

  // Dusk/dawn sky glow on horizon
  if(isDusk||isDawn){
    c.save();c.globalAlpha=0.22;
    const hg=c.createLinearGradient(0,GH*(0.45),0,GH*(0.65));
    hg.addColorStop(0,'#ff7700');hg.addColorStop(1,'transparent');
    c.fillStyle=hg;c.fillRect(0,GH*0.5,GW,GH*0.15);
    c.restore();
  }
}

// ── PIXEL-ART CLOUD (like reference image) ──────────────────
// Big fluffy bubble clusters with blue outline, small floating bubbles
function drawPixelCloud(c, x, y, sc, seed){
  c.save();
  c.imageSmoothingEnabled = false;

  const OUTLINE  = '#5599cc';   // blue outline
  const FILL_TOP = '#ffffff';   // bright white top
  const FILL_MID = '#ddeeff';   // light blue-white mid
  const FILL_BOT = '#c8e0f8';   // slightly blue bottom
  const SHINE    = '#ffffff';   // inner shine dots

  // ── Main blob cluster (big + medium circles packed together) ──
  // Each blob: [relX, relY, radius]
  const blobs = [
    // bottom row (base)
    [-28,  8, 13],
    [ -8, 12, 16],
    [ 16, 14, 15],
    [ 36, 10, 13],
    [ 54,  6, 11],
    // mid row
    [-18,  -2, 15],
    [  2,  -8, 18],
    [ 24,  -6, 17],
    [ 44,  -2, 14],
    // top row
    [ 10, -18, 13],
    [ 28, -16, 14],
  ];

  // Draw outline (slightly larger, blue)
  c.fillStyle = OUTLINE;
  blobs.forEach(([bx, by, br]) => {
    c.beginPath();
    c.arc(x + bx*sc, y + by*sc, (br+2)*sc, 0, Math.PI*2);
    c.fill();
  });

  // Draw shadow fill (bottom-shifted, slightly darker)
  c.fillStyle = FILL_BOT;
  blobs.forEach(([bx, by, br]) => {
    c.beginPath();
    c.arc(x + bx*sc, y + (by+1.5)*sc, br*sc, 0, Math.PI*2);
    c.fill();
  });

  // Draw main fill
  c.fillStyle = FILL_MID;
  blobs.forEach(([bx, by, br]) => {
    c.beginPath();
    c.arc(x + bx*sc, y + by*sc, br*sc, 0, Math.PI*2);
    c.fill();
  });

  // Draw bright top highlight on each blob
  c.fillStyle = FILL_TOP;
  blobs.forEach(([bx, by, br]) => {
    c.beginPath();
    c.arc(x + bx*sc - br*sc*0.2, y + by*sc - br*sc*0.25, br*sc*0.62, 0, Math.PI*2);
    c.fill();
  });

  // Tiny shine dot on each blob
  c.fillStyle = SHINE;
  blobs.forEach(([bx, by, br]) => {
    c.beginPath();
    c.arc(x + bx*sc - br*sc*0.3, y + by*sc - br*sc*0.38, Math.max(1.5, br*sc*0.22), 0, Math.PI*2);
    c.fill();
  });

  // ── Floating mini-bubbles around the cloud (animated) ──
  const t = seed * 0.012;
  const miniBubbles = [
    { angle: 0.3,  dist: 1.18, r: 5, phase: 0 },
    { angle: 1.1,  dist: 1.25, r: 7, phase: 1.5 },
    { angle: 2.2,  dist: 1.2,  r: 4, phase: 0.8 },
    { angle: 3.0,  dist: 1.3,  r: 6, phase: 2.2 },
    { angle: 4.2,  dist: 1.15, r: 4, phase: 3.1 },
    { angle: 5.1,  dist: 1.28, r: 5, phase: 1.0 },
  ];

  // Cloud bounding radius for bubble orbit
  const cloudR = 38 * sc;
  miniBubbles.forEach(mb => {
    const wobble = Math.sin(t * 0.8 + mb.phase) * 3 * sc;
    const bx2 = x + 13*sc + Math.cos(mb.angle) * cloudR * mb.dist + wobble;
    const by2 = y - 4*sc  + Math.sin(mb.angle) * cloudR * 0.55 * mb.dist + wobble * 0.5;
    const br2 = mb.r * sc;

    // Outline
    c.fillStyle = OUTLINE;
    c.beginPath(); c.arc(bx2, by2, br2 + 1.2*sc, 0, Math.PI*2); c.fill();
    // Fill
    c.fillStyle = FILL_MID;
    c.beginPath(); c.arc(bx2, by2, br2, 0, Math.PI*2); c.fill();
    // Shine
    c.fillStyle = FILL_TOP;
    c.beginPath(); c.arc(bx2 - br2*0.28, by2 - br2*0.3, br2*0.55, 0, Math.PI*2); c.fill();
    c.fillStyle = SHINE;
    c.beginPath(); c.arc(bx2 - br2*0.38, by2 - br2*0.42, br2*0.22, 0, Math.PI*2); c.fill();
  });

  c.restore();
}

function drawGround(c,camX){
  const gY=GH*(0.65);

  // Dirt base layers
  const dirt=c.createLinearGradient(0,gY+12,0,GH);
  dirt.addColorStop(0,'#8B6914');dirt.addColorStop(0.08,'#7a5c0f');
  dirt.addColorStop(0.25,'#6b4c0a');dirt.addColorStop(1,'#3a2204');
  c.fillStyle=dirt;c.fillRect(0,gY+12,GW,GH-gY-12);

  // Dirt texture strata lines
  for(let dl=0;dl<9;dl++){
    c.fillStyle=`rgba(0,0,0,${0.04+dl*0.012})`;c.fillRect(0,gY+14+dl*11,GW,5);
    c.fillStyle=`rgba(255,255,255,${0.015})`;c.fillRect(0,gY+13+dl*11,GW,1);
  }

  // Rocks/pebbles in dirt
  for(let p=0;p<32;p++){
    const px2=((p*139+camX*0.8)%GW);
    const py2=gY+18+(p*43)%55;
    const rs=2+p%4;
    c.fillStyle=`rgba(0,0,0,0.18)`;c.beginPath();c.ellipse(px2+1,py2+1,rs+1,rs*0.6,0,0,Math.PI*2);c.fill();
    c.fillStyle=p%3===0?'rgba(160,140,90,0.4)':'rgba(130,110,70,0.35)';
    c.beginPath();c.ellipse(px2,py2,rs,rs*0.6,0,0,Math.PI*2);c.fill();
    c.fillStyle='rgba(220,200,160,0.2)';c.beginPath();c.arc(px2-rs*0.3,py2-rs*0.2,rs*0.3,0,Math.PI*2);c.fill();
  }

  // Grass top — base stripe (skip lake area)
  const gr=c.createLinearGradient(0,gY,0,gY+14);
  gr.addColorStop(0,'#56c45a');gr.addColorStop(0.25,'#4caf50');gr.addColorStop(0.6,'#43a047');gr.addColorStop(1,'#388e3c');
  // Vẽ cỏ 2 đoạn: trái hồ và phải hồ
  [[0, LAKE_X1-camX],[LAKE_X2-camX, GW]].forEach(([x1,x2])=>{
    if(x2<=0||x1>=GW) return;
    const cx1=Math.max(0,x1), cx2=Math.min(GW,x2);
    c.fillStyle=gr;c.fillRect(cx1,gY,cx2-cx1,14);
    c.fillStyle='#76c442';c.fillRect(cx1,gY,cx2-cx1,2);
    c.fillStyle='#96e060';c.fillRect(cx1,gY,cx2-cx1,1);
  });

  // Grass blades — animated sway (skip lake area)
  for(let gx=0;gx<GW+24;gx+=4){
    const worldX=gx+camX;
    if(worldX>LAKE_X1-10 && worldX<LAKE_X2+10) continue; // không cỏ trên hồ
    const seed=Math.floor(worldX/4);
    const h=3+Math.sin(seed*7.3)*2.5;
    const sway=Math.sin(frameCount*0.04+(worldX*0.05))*1.2*(seed%3===0?1.5:0.8);
    const thick=seed%5===0?2:1;
    const bright=seed%4===0;
    c.fillStyle=bright?'#a0e860':'#76c442';
    c.beginPath();
    c.moveTo(gx,gY);
    c.lineTo(gx+sway,gY-h);
    c.lineTo(gx+thick+sway*0.7,gY-h);
    c.lineTo(gx+thick,gY);
    c.fill();
  }

  // Flowers scattered on grass
  const flowerPositions=[120,280,450,620,800,1050,1380,1600,1850,2100,2300];
  flowerPositions.forEach((wx,fi)=>{
    const rx=wx-camX;
    if(rx<-20||rx>GW+20)return;
    if(wx>LAKE_X1-20 && wx<LAKE_X2+20)return; // không hoa trên hồ
    const flColors=[['#ff6b9d','#ffdd00'],['#ff8c00','#ffffaa'],['#aa88ff','#ffeecc'],['#ff4488','#ffffff']];
    const [petCol,centCol]=flColors[fi%flColors.length];
    const bob=Math.sin(frameCount*0.06+fi)*1.5;
    // Stem
    c.fillStyle='#4a8c20';c.fillRect(rx,gY-8+bob,1,8);
    // Petals (5 pixel rects around center)
    c.fillStyle=petCol;
    [[0,-3],[3,0],[0,3],[-3,0],[2,-2],[-2,2],[2,2],[-2,-2]].forEach(([px,py],i)=>{
      if(i<5) c.fillRect(rx+px-1,gY-10+bob+py-1,2,2);
    });
    // Center
    c.fillStyle=centCol;c.fillRect(rx-1,gY-10+bob-1,3,3);
  });

  // Dirt path hints — worn track where player walks
  for(let px=0;px<GW;px+=3){
    const wx=px+camX;
    if(wx%80<3){
      c.fillStyle='rgba(100,70,20,0.12)';c.fillRect(px,gY+2,3,8);
    }
  }

  // World edge walls
  if(camX<8){
    const wg=c.createLinearGradient(0,0,20,0);
    wg.addColorStop(0,'rgba(255,80,0,0.6)');wg.addColorStop(1,'transparent');
    c.fillStyle=wg;c.fillRect(0,0,20,GH);
    c.fillStyle='#ff6600';c.font='bold 13px "Times New Roman"';c.textAlign='center';
    c.fillText('◄ BIÊN',14,GH/2);
  }
  const rightBound=WORLD_W-GW;
  if(camX>=rightBound-8){
    const wg2=c.createLinearGradient(GW-20,0,GW,0);
    wg2.addColorStop(0,'transparent');wg2.addColorStop(1,'rgba(255,80,0,0.6)');
    c.fillStyle=wg2;c.fillRect(GW-20,0,20,GH);
    c.fillStyle='#ff6600';c.font='bold 13px "Times New Roman"';c.textAlign='center';
    c.fillText('BIÊN ►',GW-14,GH/2);
  }
}

// ── VẼ HỒ NƯỚC ───────────────────────────────────────────────
function drawLake(c, camX, gY){
  const lx1 = LAKE_X1 - camX;
  const lx2 = LAKE_X2 - camX;
  if(lx2 < -50 || lx1 > GW+50) return;
  
  const lW = lx2 - lx1;
  const surfY = gY;       // mặt hồ = mặt đất
  const deepY = gY + 200; // hiển thị 200px sâu trên màn
  
  // Nền hồ gradient xanh đậm → đen
  const waterGrad = c.createLinearGradient(0, surfY, 0, deepY);
  waterGrad.addColorStop(0, 'rgba(0,80,160,0.85)');
  waterGrad.addColorStop(0.4,'rgba(0,50,120,0.9)');
  waterGrad.addColorStop(1, 'rgba(0,20,60,0.95)');
  c.fillStyle = waterGrad;
  c.fillRect(lx1, surfY, lW, deepY - surfY);
  
  // Gợn sóng mặt nước
  c.save(); c.globalAlpha = 0.5;
  c.strokeStyle = '#7ad4ff'; c.lineWidth = 1.5;
  for(let wi=0; wi<6; wi++){
    const wx = lx1 + (wi*lW/6) + Math.sin(frameCount*0.04+wi)*8;
    const wy = surfY + 2 + Math.sin(frameCount*0.06+wi*0.8)*2;
    c.beginPath(); c.moveTo(wx, wy);
    c.quadraticCurveTo(wx+lW/14, wy-3, wx+lW/7, wy);
    c.stroke();
  }
  c.restore();
  
  // Highlight mặt nước (phản chiếu ánh sáng)
  c.save(); c.globalAlpha = 0.25;
  const hlg = c.createLinearGradient(lx1, surfY, lx2, surfY);
  hlg.addColorStop(0,'transparent'); hlg.addColorStop(0.3,'#aaeeff');
  hlg.addColorStop(0.7,'#aaeeff'); hlg.addColorStop(1,'transparent');
  c.fillStyle=hlg; c.fillRect(lx1, surfY, lW, 4);
  c.restore();
  
  // San hô dưới nước (hiện khi nhìn vào)
  const corals = [
    {rx: 0.1, col:'#ff4488', h:22, type:'branch'},
    {rx: 0.2, col:'#ff8800', h:16, type:'fan'},
    {rx: 0.35,col:'#ff2266', h:28, type:'branch'},
    {rx: 0.5, col:'#ffaa00', h:18, type:'round'},
    {rx: 0.6, col:'#ff3377', h:24, type:'fan'},
    {rx: 0.72,col:'#ee1155', h:20, type:'branch'},
    {rx: 0.85,col:'#ff6600', h:14, type:'round'},
  ];
  corals.forEach(cr=>{
    const cx2 = lx1 + lW*cr.rx;
    const cy  = surfY + (deepY-surfY)*0.85;
    drawCoral(c, cx2, cy, cr.col, cr.h, cr.type);
  });
  
  // Bong bóng nổi lên
  c.save(); c.globalAlpha = 0.6;
  for(let bi=0; bi<8; bi++){
    const bx = lx1 + lW*(0.1+bi*0.12);
    const bPhase = (frameCount*0.02 + bi*0.8) % 1;
    const by  = surfY + (deepY-surfY)*(1-bPhase*0.9);
    const br  = 1.5 + bi%3;
    c.strokeStyle = '#88ddff'; c.lineWidth=1;
    c.beginPath(); c.arc(bx + Math.sin(frameCount*0.03+bi)*3, by, br, 0, Math.PI*2);
    c.stroke();
  }
  c.restore();
  
  // Portal ở đáy hồ (phát sáng)
  const portalX = lx1 + lW/2;
  const portalY = surfY + (deepY-surfY)*0.88;
  c.save();
  const pulse = 0.4 + Math.sin(frameCount*0.08)*0.2;
  c.globalAlpha = pulse;
  const pg = c.createRadialGradient(portalX,portalY,0,portalX,portalY,30);
  pg.addColorStop(0,'#00ffee'); pg.addColorStop(0.5,'rgba(0,200,255,0.4)');
  pg.addColorStop(1,'transparent');
  c.fillStyle=pg; c.beginPath(); c.arc(portalX,portalY,30,0,Math.PI*2); c.fill();
  c.globalAlpha=0.8; c.strokeStyle='#00ffee'; c.lineWidth=2;
  c.beginPath(); c.arc(portalX,portalY,18,0,Math.PI*2); c.stroke();
  c.globalAlpha=1; c.fillStyle='#00ffee'; c.font='bold 8px serif'; c.textAlign='center';
  c.fillText('▼ ĐẠI DƯƠNG', portalX, portalY-24);
  c.restore();

  // Bờ hồ (đất nâu 2 bên)
  c.fillStyle='#5a8a30'; // cỏ bờ
  c.fillRect(lx1-8, surfY-2, 10, 6);
  c.fillRect(lx2, surfY-2, 10, 6);
  // Đá bờ
  [[lx1-5,surfY+2,8,6],[lx1-3,surfY+7,6,4],
   [lx2+1,surfY+2,8,6],[lx2+2,surfY+7,6,5]].forEach(([rx,ry,rw,rh])=>{
    c.fillStyle='#887766'; c.fillRect(rx,ry,rw,rh);
  });

  // ── Pixel splash animations ──
  lakeSplashes.forEach(sp=>{
    const sx = lx1 + sp.wx; // wx = world-relative x offset from lx1
    drawPixelSplash(c, sx, surfY, sp.frame);
  });
}

// ── Pixel water splash (4-frame animation) ─────────────────
// Inspired by pixel art wave/splash sprite sheet
function drawPixelSplash(c, x, y, frame){
  c.save();
  const P1='#aaddff', P2='#7bbfee', P3='#4499cc', P4='#2266aa', OUT='#334488';
  c.imageSmoothingEnabled=false;

  if(frame===0){
    // Frame 0: dome shape rising
    const pts=[
      // outer outline (dark)
      [x-10,y,   20,2, OUT],
      [x-12,y-4, 24,4, OUT],
      [x-10,y-10,20,6, OUT],
      [x-6, y-15,12,5, OUT],
      [x-3, y-18,6, 3, OUT],
      // inner fill light
      [x-8, y-2,  16,2, P1],
      [x-9, y-6,  18,3, P2],
      [x-8, y-10, 16,5, P1],
      [x-5, y-14, 10,4, P2],
      [x-2, y-17, 4, 2, P1],
      // dark center
      [x-4, y-8,  8, 4, P3],
      [x-2, y-12, 4, 3, P3],
    ];
    pts.forEach(([px,py,pw,ph,col])=>{c.fillStyle=col;c.fillRect(px,py,pw,ph);});
    // droplets above
    [[x-8,y-22,3,3],[x+5,y-20,3,3]].forEach(([dx,dy,dw,dh])=>{
      c.fillStyle=OUT;c.fillRect(dx-1,dy-1,dw+2,dh+2);
      c.fillStyle=P1;c.fillRect(dx,dy,dw,dh);
    });

  }else if(frame===1){
    // Frame 1: wave curling right
    const pts=[
      [x-10,y,   22,2, OUT],[x-12,y-4,24,4,OUT],[x-11,y-9,22,5,OUT],
      [x-8, y-14,18,5,OUT],[x-4, y-19,14,4,OUT],[x+2, y-22,8, 4,OUT],
      [x+6, y-19,6, 5,OUT],[x+8, y-14,5, 6,OUT],
      // fill
      [x-9, y-1, 20,2,P1],[x-10,y-5, 22,3,P2],[x-9, y-10,20,4,P1],
      [x-6, y-15,16,4,P2],[x-2, y-20,12,3,P1],[x+3, y-22,6, 3,P2],
      [x+7, y-19,4, 4,P1],[x+8, y-15,4, 5,P3],
      [x-3, y-10,6, 6,P3],[x+1, y-16,4, 4,P3],
    ];
    pts.forEach(([px,py,pw,ph,col])=>{c.fillStyle=col;c.fillRect(px,py,pw,ph);});
    // droplets
    [[x+12,y-26,3,3],[x+16,y-22,3,3],[x-2,y-27,3,3]].forEach(([dx,dy,dw,dh])=>{
      c.fillStyle=OUT;c.fillRect(dx-1,dy-1,dw+2,dh+2);
      c.fillStyle=P1;c.fillRect(dx,dy,dw,dh);
    });

  }else if(frame===2){
    // Frame 2: wave breaking, taller
    const pts=[
      [x-8, y,   18,2,OUT],[x-10,y-4,20,4,OUT],[x-10,y-9,20,5,OUT],
      [x-7, y-14,16,5,OUT],[x-2, y-20,12,5,OUT],[x+3, y-24,8, 4,OUT],
      [x+7, y-21,5, 8,OUT],[x+9, y-14,4, 7,OUT],
      // fill
      [x-7, y-1, 16,2,P1],[x-8, y-5, 18,3,P2],[x-8, y-10,18,4,P1],
      [x-5, y-15,14,4,P2],[x,   y-21,10,4,P1],[x+4, y-24,6, 3,P2],
      [x+8, y-21,3, 7,P1],[x+9, y-15,3, 6,P3],
      [x-1, y-12,5, 7,P3],[x+2, y-18,4, 5,P3],
    ];
    pts.forEach(([px,py,pw,ph,col])=>{c.fillStyle=col;c.fillRect(px,py,pw,ph);});
    // droplets
    [[x+14,y-28,3,3],[x+18,y-24,3,3],[x+10,y-32,3,3],[x-4,y-29,3,3]].forEach(([dx,dy,dw,dh])=>{
      c.fillStyle=OUT;c.fillRect(dx-1,dy-1,dw+2,dh+2);
      c.fillStyle=P1;c.fillRect(dx,dy,dw,dh);
    });

  }else if(frame===3){
    // Frame 3: falling back down, wide splash
    const pts=[
      [x-12,y,   26,2,OUT],[x-14,y-3,28,3,OUT],[x-12,y-7,24,4,OUT],
      [x-8, y-12,18,4,OUT],[x-3, y-17,12,4,OUT],[x+3, y-20,8, 4,OUT],
      [x+7, y-17,5, 6,OUT],[x+9, y-12,4, 6,OUT],
      // fill
      [x-11,y-1, 24,2,P1],[x-12,y-4, 26,2,P2],[x-10,y-8, 22,3,P1],
      [x-6, y-13,16,3,P2],[x-1, y-18,10,3,P1],[x+4, y-20,6, 3,P2],
      [x+7, y-18,4, 5,P1],[x+9, y-13,3, 5,P3],
      [x,   y-10,4, 5,P3],[x+3, y-16,3, 4,P3],
    ];
    pts.forEach(([px,py,pw,ph,col])=>{c.fillStyle=col;c.fillRect(px,py,pw,ph);});
    // droplets (more scattered — splash peak)
    [[x+14,y-26,3,3],[x+18,y-22,4,4],[x+20,y-16,3,3],[x-5,y-26,3,3],[x-8,y-20,3,3]].forEach(([dx,dy,dw,dh])=>{
      c.fillStyle=OUT;c.fillRect(dx-1,dy-1,dw+2,dh+2);
      c.fillStyle=P1;c.fillRect(dx,dy,dw,dh);
    });
  }
  c.restore();
}

// ── Update lake splashes each frame ────────────────────────
function updateLakeSplashes(){
  if(inOcean) return;
  // Advance existing splashes
  lakeSplashes = lakeSplashes.filter(sp=>{
    sp.timer++;
    if(sp.timer >= sp.interval){
      sp.timer=0; sp.frame++;
    }
    return sp.frame < 4;
  });
  // Spawn new splash randomly
  lakeSplashTimer--;
  if(lakeSplashTimer <= 0){
    // random position along lake surface (world-relative offset from lx1)
    const lakeW = LAKE_X2 - LAKE_X1;
    const offsetX = 20 + Math.random()*(lakeW-40);
    lakeSplashes.push({wx: offsetX, frame:0, timer:0, interval: 8+Math.floor(Math.random()*4)});
    lakeSplashTimer = 120 + Math.floor(Math.random()*180); // ~2-5 seconds at 60fps
  }
}

function drawCoral(c,x,y,col,h,type){
  c.save(); c.globalAlpha=0.9;
  if(type==='branch'){
    // Nhánh san hô
    c.strokeStyle=col; c.lineWidth=3;
    c.beginPath(); c.moveTo(x,y); c.lineTo(x,y-h); c.stroke();
    c.lineWidth=2;
    c.beginPath(); c.moveTo(x,y-h*0.4); c.lineTo(x-5,y-h*0.7); c.stroke();
    c.beginPath(); c.moveTo(x,y-h*0.6); c.lineTo(x+6,y-h*0.85); c.stroke();
    c.fillStyle=col; c.lineWidth=1;
    [[x,y-h],[x-5,y-h*0.7],[x+6,y-h*0.85]].forEach(([px,py])=>{
      c.beginPath(); c.arc(px,py,2.5,0,Math.PI*2); c.fill();
    });
  } else if(type==='fan'){
    // San hô dạng quạt
    c.strokeStyle=col; c.lineWidth=2;
    for(let a=-40;a<=40;a+=15){
      const rad=a*Math.PI/180;
      c.beginPath(); c.moveTo(x,y);
      c.lineTo(x+Math.sin(rad)*h, y-Math.cos(rad)*h); c.stroke();
    }
    // Nối đỉnh
    c.beginPath(); c.arc(x,y-h*0.8,h*0.5,Math.PI*1.2,Math.PI*1.8); c.stroke();
  } else {
    // San hô tròn
    c.fillStyle=col;
    c.beginPath(); c.arc(x,y-h*0.5,h*0.45,0,Math.PI*2); c.fill();
    c.fillStyle='rgba(255,255,255,0.3)';
    c.beginPath(); c.arc(x-2,y-h*0.6,h*0.15,0,Math.PI*2); c.fill();
    c.strokeStyle=col; c.lineWidth=2;
    c.beginPath(); c.moveTo(x,y); c.lineTo(x,y-h*0.1); c.stroke();
  }
  c.restore();
}

// ═══ TREES & ROCKS ════════════════════════════════════════════

function drawHDTree(c,rx,camX){
  const gY=GH*(0.65);
  const wSway=Math.sin(frameCount*0.03+(rx+camX)*0.005)*1.5;

  // Shadow
  c.save();c.globalAlpha=0.18;
  c.fillStyle='#000';c.beginPath();c.ellipse(rx+20,gY+9,30+Math.abs(wSway),6,0,0,Math.PI*2);c.fill();
  c.restore();

  // Roots
  c.fillStyle='#5d4037';
  [[rx+6,gY+8,rx+13,gY+3],[rx+27,gY+8,rx+20,gY+3],[rx+4,gY+5,rx+9,gY],[rx+30,gY+5,rx+24,gY]].forEach(([x1,y1,x2,y2])=>{
    c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo((x1+x2)/2+wSway*0.2,y2+3,x2,y2);c.lineWidth=2;c.strokeStyle='#5d4037';c.stroke();
  });

  // Trunk
  const tr=c.createLinearGradient(rx+14,0,rx+26,0);
  tr.addColorStop(0,'#8d6e63');tr.addColorStop(0.25,'#a0856a');tr.addColorStop(0.5,'#8d6e63');tr.addColorStop(0.7,'#7a5c50');tr.addColorStop(1,'#5d4037');
  c.fillStyle=tr;c.fillRect(rx+14+wSway*0.1,gY-48,12,52);
  c.fillStyle='rgba(0,0,0,0.18)';
  for(let bl=0;bl<7;bl++) c.fillRect(rx+15+bl%2*4+wSway*0.1,gY-46+bl*6,3+bl%3,1);
  c.fillStyle='rgba(255,255,255,0.07)';
  c.fillRect(rx+14+wSway*0.1,gY-48,2,52);

  // Foliage
  const td=Math.sin(timeOfDay*Math.PI*2);
  const bright=td>0;
  const foliageData=[
    {x:20,y:-82,r:24,col:bright?'#1b5e20':'#0d3010'},
    {x:8, y:-68,r:20,col:bright?'#2e7d32':'#1a4820'},
    {x:32,y:-65,r:18,col:bright?'#2e7d32':'#1a4820'},
    {x:20,y:-92,r:22,col:bright?'#388e3c':'#204a22'},
    {x:7, y:-76,r:19,col:bright?'#43a047':'#2a5a2e'},
    {x:33,y:-74,r:18,col:bright?'#388e3c':'#204a22'},
    {x:20,y:-60,r:26,col:bright?'#33691e':'#1c3b10'},
    {x:10,y:-55,r:18,col:bright?'#388e3c':'#204a22'},
    {x:30,y:-55,r:17,col:bright?'#2e7d32':'#1a4820'},
    {x:13,y:-88,r:12,col:bright?'#4caf50':'#2a6030'},
    {x:28,y:-80,r:11,col:bright?'#43a047':'#265028'},
  ];
  const sw=wSway*0.6;
  foliageData.forEach((f,i)=>{
    const ls=sw*(i<3?0.5:i<9?0.8:1.1);
    c.fillStyle=f.col;
    c.beginPath();c.arc(rx+f.x+ls,gY+f.y,f.r,0,Math.PI*2);c.fill();
  });

  // Highlights
  c.save();c.globalAlpha=0.35+td*0.1;c.fillStyle='#76c442';
  [[14,-90,10],[27,-75,8],[10,-65,7]].forEach(([lx,ly,lr])=>{
    c.beginPath();c.arc(rx+lx+sw,gY+ly,lr,0,Math.PI*2);c.fill();
  });
  c.globalAlpha=0.15;c.fillStyle='#c8f098';
  c.beginPath();c.arc(rx+16+sw,gY-94,5,0,Math.PI*2);c.fill();
  c.restore();

  // Fruits/berries
  [['#e53935',28,-66],['#c62828',12,-52],['#ef5350',22,-47],['#ff7043',35,-70]].forEach(([col,fx,fy])=>{
    c.fillStyle=col;c.beginPath();c.arc(rx+fx+sw*0.7,gY+fy,2.5,0,Math.PI*2);c.fill();
    c.fillStyle='rgba(255,255,255,0.5)';c.beginPath();c.arc(rx+fx+sw*0.7-0.8,gY+fy-0.8,0.8,0,Math.PI*2);c.fill();
  });

  // Ground glow
  c.save();c.globalAlpha=0.08+td*0.04;
  const tg=c.createRadialGradient(rx+20,gY,0,rx+20,gY,38);
  tg.addColorStop(0,'#4caf50');tg.addColorStop(1,'transparent');
  c.fillStyle=tg;c.beginPath();c.ellipse(rx+20,gY,38,9,0,0,Math.PI*2);c.fill();
  c.restore();
}

function drawPixelRock(c, rx, rtype, sc){
  const gY = GH*(0.65);
  sc = (sc||1) * 1.5;
  c.save(); c.imageSmoothingEnabled = false;

  // Color palette (grey stone like reference image)
  const OUT  = '#3a4a58';   // dark outline
  const BASE = '#7a8ea0';   // mid grey-blue
  const MID  = '#96aabf';   // lighter mid
  const LT   = '#b8ccd8';   // light face
  const HI   = '#d8eaf4';   // highlight
  const SHD  = '#4a5a6a';   // shadow bottom

  // Draw one pixel-art rock blob
  const drawRock = (x, y, w, h) => {
    const bx = x, by = y; // top-left

    // Shadow ellipse below
    c.save(); c.globalAlpha = 0.2; c.fillStyle = '#000';
    c.beginPath(); c.ellipse(bx+w*0.5, by+h+4, w*0.48, 4, 0, 0, Math.PI*2); c.fill();
    c.restore();

    // Pixel outline shape (irregular polygon, pixel-stepped)
    c.fillStyle = OUT;
    // Draw outline as thick border by drawing bigger shape first
    _rockShape(c, bx-1, by-1, w+2, h+2);

    // Base fill (darker bottom half)
    c.fillStyle = SHD;
    _rockShape(c, bx, by + h*0.45, w, h*0.55);

    // Main body
    c.fillStyle = BASE;
    _rockShape(c, bx, by, w, h*0.8);

    // Mid-tone upper
    c.fillStyle = MID;
    _rockShape(c, bx+w*0.1, by, w*0.8, h*0.55);

    // Light face (left-center)
    c.fillStyle = LT;
    _rockShape(c, bx+w*0.12, by+h*0.08, w*0.55, h*0.38);

    // Bright highlight top-left
    c.fillStyle = HI;
    c.fillRect(Math.round(bx+w*0.14), Math.round(by+h*0.1), Math.round(w*0.22), Math.round(h*0.16));

    // Pixel crack line (single-pixel dark line)
    c.fillStyle = OUT;
    const cx2 = Math.round(bx + w*0.56), cy2 = Math.round(by + h*0.22);
    c.fillRect(cx2,   cy2,   1, Math.round(h*0.18));
    c.fillRect(cx2+1, cy2+Math.round(h*0.1), 1, Math.round(h*0.1));

    // Small moss dots at base
    c.fillStyle = '#4a7a30';
    for(let m=0; m<3; m++){
      c.fillRect(Math.round(bx + w*(0.2+m*0.22)), Math.round(by+h*0.85), 2, 2);
    }
  };

  // Helper: draw irregular rock polygon with pixel steps
  function _rockShape(c, x, y, w, h){
    if(w<=0||h<=0)return;
    x=Math.round(x); y=Math.round(y); w=Math.round(w); h=Math.round(h);
    c.beginPath();
    c.moveTo(x+w*0.2, y);
    c.lineTo(x+w*0.55, y);
    c.lineTo(x+w*0.78, y+h*0.06);
    c.lineTo(x+w,      y+h*0.3);
    c.lineTo(x+w*0.92, y+h*0.7);
    c.lineTo(x+w*0.72, y+h);
    c.lineTo(x+w*0.28, y+h);
    c.lineTo(x+w*0.06, y+h*0.72);
    c.lineTo(x,        y+h*0.38);
    c.lineTo(x+w*0.08, y+h*0.12);
    c.closePath();
    c.fill();
  }

  // Small pixel grass tufts at rock base
  const drawTuft = (x, groundY) => {
    c.fillStyle = '#3a9a22';
    [[0,5],[3,7],[6,4],[9,6],[12,5]].forEach(([dx,gh])=>{
      c.fillRect(Math.round(x+dx*sc), Math.round(groundY-gh*0.4*sc), Math.round(sc), Math.round(gh*0.4*sc));
    });
  };

  if(rtype === 0){
    // Single medium rock
    const rw=30*sc, rh=22*sc;
    drawRock(rx, gY-rh, rw, rh);
    drawTuft(rx-2*sc, gY);
  }
  else if(rtype === 1){
    // Big rock + small rock cluster (like left group in image)
    const rw=38*sc, rh=28*sc;
    drawRock(rx, gY-rh, rw, rh);
    // small rock right
    const sw=18*sc, sh=13*sc;
    drawRock(rx+rw*0.72, gY-sh, sw, sh);
    drawTuft(rx, gY);
  }
  else if(rtype === 2){
    // Three rocks: medium left, big center, small right (like center group)
    const bw=32*sc, bh=24*sc;
    const sw=16*sc, sh=12*sc;
    const tw=12*sc, th=9*sc;
    drawRock(rx+sw*0.6, gY-bh, bw, bh);          // big center
    drawRock(rx,        gY-sh, sw, sh);             // small left
    drawRock(rx+bw+sw*0.4, gY-th, tw, th);         // tiny right
    drawTuft(rx-2*sc, gY);
  }
  else if(rtype === 3){
    // Flat wide rock (like rounded boulder in image)
    const rw=42*sc, rh=18*sc;
    drawRock(rx, gY-rh, rw, rh);
    drawTuft(rx+rw*0.1, gY);
  }
  else {
    // Two rocks side by side
    const w1=28*sc, h1=21*sc;
    const w2=20*sc, h2=15*sc;
    drawRock(rx,        gY-h1, w1, h1);
    drawRock(rx+w1*0.8, gY-h2, w2, h2);
    drawTuft(rx, gY);
  }

  c.restore();
}


function lightenColor(hex,amt){
  try{
    let r=parseInt(hex.slice(1,3),16)+Math.floor(amt*255);
    let g=parseInt(hex.slice(3,5),16)+Math.floor(amt*255);
    let b=parseInt(hex.slice(5,7),16)+Math.floor(amt*255);
    return `rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`;
  }catch(e){return hex;}
}
function darkenColor(hex,amt){
  try{
    let r=parseInt(hex.slice(1,3),16)-Math.floor(amt*255);
    let g=parseInt(hex.slice(3,5),16)-Math.floor(amt*255);
    let b=parseInt(hex.slice(5,7),16)-Math.floor(amt*255);
    return `rgb(${Math.max(0,r)},${Math.max(0,g)},${Math.max(0,b)})`;
  }catch(e){return hex;}
}

// ═══════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════
let gameState='WORLD';
let coins=0,playerHP=100,playerMaxHP=100,playerMana=80,playerMaxMana=80,playerArmor=0;
// ── Minigame unlock flags (khai báo sớm để render loop dùng được) ──
let hacLongUnlocked  = false;
let hoaLongUnlocked  = false;
let thuLongUnlocked  = false;
let _mgPendingBoss   = null;
let _nearCastleGate  = false;
let playerLevel=1,playerXP=0;
let frameCount=0;

const keys={};
let cam={x:0};
let typingInt=null;
let currentHouse=null;

const gY = GH * (_isTouchDevice ? 0.72 : 0.65); // ground Y: mobile=portrait ratio, desktop=landscape ratio

// Player in world coords
const P={
  x:300,y:0,w:52,h:80,
  vx:0,vy:0,speed:1.8,
  onGround:false,facing:1,
  walkTimer:0,attacking:0,hurtAnim:0
};

let bMon=null,bPHP=100,bMHP=100,bMaxPHP=100,bMaxMHP=100,bActive=false;
let bKnightAtkAnim=0; // animation đánh trong battle (32→0)
// Battle effect states
let bBurnTurns=0;      // số lượt thiêu đốt còn lại
let bStunned=false;    // địch bị choáng 1 lượt
let bWindShield=false; // khiên gió người chơi (chặn 1 đòn)
let bWindDebuff=false; // địch bị giảm sát thương
let bLastAnim='';      // animation flag for current attack
let bDragonHitCount=0; // đếm số lần rồng đánh (để trigger phun lửa)
let bPlayerBurnTurns=0;// người chơi bị đốt bởi rồng
// Shadow Dragon states
let bShadowSoulState=false;
let bShadowSoulTurns=0;
let bShadowDmgDebuff=false;
let bShadowDebuffTurns=0;
// Hắc Long Vương kỹ năng
let bHacDmgDebuff=false;    // Quả cầu hắc ám: giảm 40% sát thương player
let bHacDmgTurns=0;
let bHacDefDebuff=false;    // Hơi thở bóng tối: giảm phòng thủ player
let bHacDefTurns=0;
let bHacSkillCount=0;       // Số lần đã dùng kỹ năng (để luân phiên)
let bHacNormalCount=0;      // Đếm đòn tấn công THƯỜNG (cứ 2 đòn → 1 kỹ năng)
let bFireNormalCount=0;     // Hỏa Long: đếm đòn thường (cứ 3 đòn → Hơi Thở Địa Ngục)
let bHacPhase2=false;       // Phase 2: Linh Hồn Bóng Tối (sau khi chết lần 1)

// ── HẮC LONG VƯƠNG BATTLE EFFECTS ────────────────────────────
let dragonParticles=[], dragonTrails=[];
let dragonClawFlash=0, dragonBreathAnim=0, dragonHurtFlash=0;

function dragonSpawnP(x,y,vx,vy,col,life,size,type){
  dragonParticles.push({x,y,vx,vy,col,ml:life,size,type,age:0});
}

function dragonOrbFX(bc, MCX, MGY){
  // Tọa độ battle canvas: knight ở x=62,y=groundY-40; dragon ở MCX,MGY-60
  const BH=bcv.height;
  const groundY=BH-52;
  const PLscr=62, PLy=groundY-40; // knight center trong battle canvas
  const DRX=MCX-30, DRY=MGY-70;  // rồng center
  const angles=[-0.5,-0.25,0,0.25,0.5,-0.35,0.35];
  angles.forEach((angle, i)=>{
    setTimeout(()=>{
      dragonTrails.push({
        sx:DRX+Math.sin(angle)*15, sy:DRY+Math.cos(angle)*10,
        ex:PLscr+Math.sin(angle)*20, ey:PLy+Math.cos(angle)*15,
        prog:0, life:30,
        col:`hsl(${265+i*10},90%,60%)`, w:7, isOrb:true
      });
      for(let j=0;j<4;j++)
        dragonSpawnP(
          DRX+Math.random()*20-10, DRY+Math.random()*20-10,
          (PLscr-DRX)/40+(Math.random()-0.5)*2,
          (PLy-DRY)/40+(Math.random()-0.5)*1.5,
          `hsla(${255+Math.random()*40},90%,65%,0.9)`,
          25+Math.random()*12, 4+Math.random()*2, 'curse'
        );
    }, i*90);
  });
  dragonClawFlash=50; // flash tím nhẹ (không đỏ)
}

function dragonTriggerClaw(isShadow, MCX, MGY){
  const BH=bcv.height, groundY=BH-52;
  const PLscr=62, PLy=groundY-40; // knight center trong battle canvas
  for(let i=0;i<3;i++){
    setTimeout(()=>{
      dragonTrails.push({
        sx:MCX-20, sy:MGY-60,
        ex:PLscr,  ey:PLy,
        prog:0, life:22,
        col:isShadow?'#9900cc':'#ff4400', w:isShadow?5:4
      });
    }, i*55);
  }
  dragonClawFlash = 55;
  for(let j=0;j<12;j++)
    dragonSpawnP(
      PLscr+Math.random()*40-20, PLy+Math.random()*30,
      (Math.random()-0.5)*3, -(2+Math.random()*3),
      isShadow
        ? `hsla(${270+Math.random()*60},90%,60%,0.9)`
        : `hsl(${15+Math.random()*25},100%,65%)`,
      30, 3+Math.random()*2, isShadow?'curse':'spark'
    );
}

function dragonTriggerBreath(isShadow, MCX, MGY){
  const BH=bcv.height, groundY=BH-52;
  const PLscr=62, PLy=groundY-40; // target = knight
  for(let i=0;i<30;i++){
    setTimeout(()=>{
      const dx=(PLscr-MCX)/30, dy=(PLy-MGY)/30;
      dragonSpawnP(
        MCX-20+Math.random()*20, MGY-60+Math.random()*30,
        dx*(0.6+Math.random()*0.8)+(Math.random()-0.5)*0.8,
        dy*(0.6+Math.random()*0.8)+(Math.random()-0.5)*0.5,
        isShadow
          ? `hsla(${250+Math.random()*60},60%,22%,0.85)`
          : `hsla(${280+Math.random()*40},55%,20%,0.8)`,
        65+Math.random()*25, 10+Math.random()*8, 'mist'
      );
    }, i*16);
  }
  dragonBreathAnim = 70;
  // Impact particles tại vị trí knight trong battle canvas
  setTimeout(()=>{
    for(let j=0;j<10;j++)
      dragonSpawnP(PLscr+Math.random()*40-20, PLy+Math.random()*30,
        (Math.random()-0.5)*3, -(1+Math.random()*2),
        `hsla(${260+Math.random()*50},80%,55%,0.9)`, 35, 3, 'curse');
  }, 450);
}

// Dragon FX loop riêng — chạy song song với FX._loop()
let _dragonFXRaf=null;
function startDragonFXLoop(){
  if(_dragonFXRaf) return;
  function tick(){
    if(!bActive){ _dragonFXRaf=null; fxctx.clearRect(0,0,bcv.width,bcv.height); return; }
    const BW=bcv.width, BH=bcv.height;
    const groundY=BH-52;
    const MCX=Math.round(BW*0.78);
    const MGY=groundY;
    // Clear trước khi vẽ FX mới
    if(!FX.active) fxctx.clearRect(0,0,BW,BH);
    renderDragonFX(fxctx, MCX, MGY, bShadowSoulState);
    _dragonFXRaf=requestAnimationFrame(tick);
  }
  _dragonFXRaf=requestAnimationFrame(tick);
}
function stopDragonFXLoop(){
  if(_dragonFXRaf){cancelAnimationFrame(_dragonFXRaf);_dragonFXRaf=null;}
  dragonParticles=[]; dragonTrails=[];
  dragonClawFlash=0; dragonBreathAnim=0; dragonHurtFlash=0;
}

function renderDragonFX(bc, MCX, MGY, isShadow){
  const BW=bc.canvas.width, BH=bc.canvas.height;

  // ── Aura bóng tối + orbs xoay ──
  if(isShadow){
    bc.save();
    const ap=0.14+Math.sin(frameCount*0.07)*0.06;
    const ag=bc.createRadialGradient(MCX,MGY-60,5,MCX,MGY-60,110);
    ag.addColorStop(0,`rgba(130,0,200,${ap})`);
    ag.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=ag; bc.beginPath();
    bc.arc(MCX,MGY-60,110,0,Math.PI*2); bc.fill();
    for(let i=0;i<3;i++){
      const a=frameCount*0.04+i*2.1;
      bc.globalAlpha=0.5+Math.sin(frameCount*0.1+i)*0.2;
      bc.fillStyle=`hsl(${270+i*30},80%,55%)`;
      bc.beginPath();
      bc.arc(MCX+Math.cos(a)*55,MGY-60+Math.sin(a)*35,4,0,Math.PI*2);
      bc.fill();
    }
    bc.globalAlpha=0.75+Math.sin(frameCount*0.1)*0.2;
    bc.fillStyle='#dd00ff';
    bc.font='bold 9px "Times New Roman",serif';
    bc.textAlign='center';
    bc.shadowColor='#9900cc'; bc.shadowBlur=10;
    bc.fillText('💀 BÓNG TỐI', MCX, MGY-148);
    bc.shadowBlur=0; bc.globalAlpha=1;
    bc.restore();
  }

  // ── Claw flash ──
  if(dragonClawFlash>0){
    bc.save();
    // Flash nhỏ chỉ vùng rồng, không phủ toàn màn
    bc.globalAlpha=dragonClawFlash/50*0.25;
    const flashG=bc.createRadialGradient(MCX,MGY-60,10,MCX,MGY-60,120);
    flashG.addColorStop(0,'rgba(130,0,200,0.6)');
    flashG.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=flashG;
    bc.beginPath();bc.arc(MCX,MGY-60,120,0,Math.PI*2);bc.fill();
    bc.restore(); dragonClawFlash--;
  }

  // ── Breath mist overlay ──
  if(dragonBreathAnim>0){
    bc.save();
    // Chỉ vẽ mist stream nhỏ từ rồng sang knight, không phủ toàn màn
    bc.globalAlpha=dragonBreathAnim/70*0.35;
    const PLscr=BW*0.14;
    const mg=bc.createLinearGradient(MCX-30,MGY-60,PLscr+20,MGY-40);
    mg.addColorStop(0,'rgba(80,0,120,0.8)');
    mg.addColorStop(0.6,'rgba(40,0,80,0.5)');
    mg.addColorStop(1,'rgba(20,0,40,0)');
    bc.fillStyle=mg;
    // Hình ellipse ngang thay vì fillRect toàn màn
    bc.beginPath();
    bc.ellipse((MCX+PLscr)/2, MGY-50, (MCX-PLscr)/2+30, 35, 0, 0, Math.PI*2);
    bc.fill();
    bc.restore(); dragonBreathAnim--;
  }

  // ── Trails (claw lines) ──
  dragonTrails=dragonTrails.filter(t=>{
    t.prog+=t.isOrb?0.05:0.07; t.life--;
    if(t.life<=0) return false;
    const px=t.sx+(t.ex-t.sx)*t.prog;
    const py=t.sy+(t.ey-t.sy)*t.prog;
    bc.save();
    if(t.isOrb){
      // Quả cầu hắc ám: vẽ orb tròn phát sáng
      const r=6+Math.sin(t.prog*Math.PI)*4;
      bc.globalAlpha=t.life/28*0.95;
      const og=bc.createRadialGradient(px,py,0,px,py,r*2.5);
      og.addColorStop(0,'rgba(255,255,255,0.9)');
      og.addColorStop(0.3,t.col.replace('hsl','hsla').replace(')',',0.9)'));
      og.addColorStop(1,'rgba(80,0,120,0)');
      bc.fillStyle=og; bc.beginPath(); bc.arc(px,py,r*2.5,0,Math.PI*2); bc.fill();
      // Vệt đuôi
      bc.globalAlpha=t.life/28*0.4; bc.strokeStyle=t.col;
      bc.lineWidth=3; bc.shadowColor=t.col; bc.shadowBlur=8;
      bc.beginPath(); bc.moveTo(t.sx,t.sy); bc.lineTo(px,py); bc.stroke();
    } else {
      // Claw trail thường
      bc.globalAlpha=t.life/22*0.9;
      bc.strokeStyle=t.col; bc.lineWidth=t.w*(1-t.prog*0.4);
      bc.shadowColor=t.col; bc.shadowBlur=12;
      bc.beginPath(); bc.moveTo(t.sx,t.sy); bc.lineTo(px,py); bc.stroke();
      bc.fillStyle='#ff8844'; bc.globalAlpha*=0.75;
      bc.beginPath(); bc.arc(px,py,4,0,Math.PI*2); bc.fill();
    }
    bc.restore();
    return true;
  });

  // ── Particles ──
  dragonParticles=dragonParticles.filter(p=>{
    p.age++; p.x+=p.vx; p.y+=p.vy;
    if(p.type!=='mist') p.vy+=0.1;
    const life=1-p.age/p.ml;
    if(life<=0) return false;
    bc.save();
    if(p.type==='mist'){
      p.size+=0.35; p.vx*=0.96; p.vy*=0.96;
      bc.globalAlpha=life*0.5; bc.fillStyle=p.col;
      bc.beginPath(); bc.arc(p.x,p.y,p.size,0,Math.PI*2); bc.fill();
    } else if(p.type==='curse'){
      bc.globalAlpha=life*0.9;
      bc.shadowColor='#9900ff'; bc.shadowBlur=8;
      bc.fillStyle=p.col;
      bc.beginPath(); bc.arc(p.x,p.y,p.size*life+1,0,Math.PI*2); bc.fill();
    } else {
      bc.globalAlpha=life; bc.fillStyle=p.col;
      bc.beginPath(); bc.arc(p.x,p.y,p.size*life,0,Math.PI*2); bc.fill();
    }
    bc.restore();
    return true;
  });

  // ── Dragon hurt flash ──
  if(dragonHurtFlash>0){
    bc.save();
    bc.globalAlpha=dragonHurtFlash/20*0.55;
    bc.fillStyle='#ffffff';
    bc.fillRect(MCX-120,0,180,MGY+10);
    bc.restore(); dragonHurtFlash--;
  }
}
// Underground dungeon
let undergroundFloor=0;
let undergroundActive=false;
let undergroundMonsterIdx=0;
let undergroundFireDragonDefeated=false;
let jumpPressed=false;
// Combo & streak system
let comboCount=0, streakCount=0, totalCorrect=0, totalAnswered=0;

// ═══════════════════════════════════════════
// HỆ THỐNG THEO DÕI TIẾN ĐỘ HỌC TẬP
// ═══════════════════════════════════════════
const SUBJ_CONFIG = {
  math:       {name:'Toán Học',    icon:'📐', color:'#e74c3c'},
  geo:        {name:'Địa Lý',      icon:'🌏', color:'#3498db'},
  history:    {name:'Lịch Sử',     icon:'🏛️', color:'#9b59b6'},
  literature: {name:'Văn Học',     icon:'📖', color:'#2ecc40'},
  civic:      {name:'Công Dân',    icon:'🏫', color:'#1a88dd'},
  english:    {name:'Tiếng Anh',   icon:'🔤', color:'#e84040'},
};
const Q_TYPE_CONFIG = {
  mcq:      {name:'Trắc nghiệm', icon:'🔤'},
  imgpick:  {name:'Chọn hình',   icon:'🖼️'},
  match:    {name:'Nối đôi',     icon:'🔗'},
  wordfill: {name:'Điền từ',     icon:'✏️'},
  sort:     {name:'Sắp xếp',     icon:'📋'},
};

// Learning stats — persisted in memory
const learnStats = {
  totalSessions: 0,
  totalTime: 0,         // ms
  totalCoinsEarned: 0,
  // Per subject: {sessions, correct, answered, totalScore, maxScore, bestStars, time}
  subjects: {
    math:       {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
    geo:        {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
    history:    {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
    literature: {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
    civic:      {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
    english:    {sessions:0,correct:0,answered:0,totalScore:0,maxScore:0,bestStars:0,time:0,levels:{}},
  },
  // Per question type: {correct, answered}
  types: {mcq:{c:0,a:0}, imgpick:{c:0,a:0}, match:{c:0,a:0}, wordfill:{c:0,a:0}, sort:{c:0,a:0}},
  // Session log (last 30)
  log: [],
};

let _sessStart = 0; // timestamp when puzzle starts

// Track question type accuracy
function trackAnswer(qType, correct){
  if(!learnStats.types[qType]) return;
  learnStats.types[qType].a++;
  if(correct) learnStats.types[qType].c++;
}

// Called at start of each puzzle session
function startLearnSession(){
  _sessStart = Date.now();
}

// Called at end of puzzle session
function endLearnSession(subject, score, maxScore, stars, correct, answered, coinsEarned, level){
  const elapsed = Date.now() - _sessStart;
  const subj = learnStats.subjects[subject];
  if(!subj) return;
  subj.sessions++;
  subj.correct += correct;
  subj.answered += answered;
  subj.totalScore += score;
  subj.maxScore += maxScore;
  subj.time += elapsed;
  subj.bestStars = Math.max(subj.bestStars, stars);
  if(level !== undefined){
    const lk = 'lv'+(level+1);
    if(!subj.levels[lk] || stars > (subj.levels[lk].stars||0))
      subj.levels[lk] = {stars, score, maxScore};
  }
  learnStats.totalSessions++;
  learnStats.totalTime += elapsed;
  learnStats.totalCoinsEarned += coinsEarned;
  // Log entry
  const entry = {
    t: Date.now(),
    subject,
    score, maxScore, stars,
    correct, answered,
    coins: coinsEarned,
    ms: elapsed,
    isCave: level !== undefined,
  };
  learnStats.log.unshift(entry);
  if(learnStats.log.length > 50) learnStats.log.pop();
  // Tự động lưu sau mỗi buổi học
  if(window.saveGameData) window.saveGameData();
}
// Treasure chests in world
// chests wy set after GND is defined (see below)
const chests=[
  {wx:2800,wy:0,opened:false},
  {wx:4000,wy:0,opened:false},
  {wx:5300,wy:0,opened:false},
  {wx:6600,wy:0,opened:false},
  {wx:7400,wy:0,opened:false},
];
// NPC tips per subject
const npcTips={
  math:['Đếm trên tay nhé! 🖐️','Bảng cửu chương rất quan trọng! 📊','Số chẵn chia hết cho 2! 🔢'],
  geo:['Mặt trời mọc ở hướng Đông! ☀️','Việt Nam có 63 tỉnh thành! 🗺️','Biển Đông ở phía Đông nước ta! 🌊'],
  history:['Hãy kính yêu bố mẹ! ❤️','Lễ phép với thầy cô! 👩‍🏫','Ngày 2/9 là Quốc khánh! 🎉'],
  literature:['Đọc sách mỗi ngày! 📚','Viết chữ đẹp và rõ ràng! ✏️','Học thuộc lòng thơ ca! 🌸'],
  civic:['Kính trên nhường dưới! 🙏','Giữ gìn môi trường sạch đẹp! 🌿','Tuân thủ luật lệ giao thông! 🚦'],
  english:['Practice every day! 📅','Alphabet has 26 letters! 🔤','Good morning = Chào buổi sáng! ☀️'],
}; // true only on the frame Space/W/Up was first pressed
let pSess={qs:[],idx:0,score:0,earned:0,subject:''};
let matchPairs={},wfFilled=[],wfSelChip=null,wfSelBlank=null;

// ═══════════════════════════════════════════
// WORLD SETUP
// ═══════════════════════════════════════════
const weapons=[
  {id:'woodsword', name:'Kiếm Gỗ',    icon:'🪵', dmg:8,  price:0,   owned:true,  type:'melee',
   desc:'Vũ khí khởi đầu, không có hiệu ứng đặc biệt.'},
  {id:'ironsword', name:'Kiếm Sắt',   icon:'⚔️', dmg:15, price:40,  owned:false, type:'melee',
   desc:'20% tỉ lệ <b>Chí Mạng</b> — gây gấp đôi sát thương!', special:'crit', critChance:0.2},
  {id:'fireaxe',   name:'Rìu Lửa',   icon:'🪓', dmg:30, price:80,  owned:false, type:'melee',
   desc:'20% tỉ lệ <b>Thiêu Đốt</b> — mục tiêu mất 8 HP mỗi lượt (3 lượt)!', special:'burn', burnChance:0.2},
  {id:'windsword', name:'Kiếm Gió',   icon:'🌀', dmg:30, price:85,  owned:false, type:'melee',
   desc:'20% tỉ lệ <b>Đánh Đôi</b> — tung 2 đòn cùng lúc!', special:'double', doubleChance:0.2},
  {id:'watersword',name:'Kiếm Thủy',  icon:'💧', dmg:30, price:90,  owned:false, type:'melee',
   desc:'20% tỉ lệ <b>Hồi Mana</b> — hồi lại 1/4 mana tối đa!', special:'manaon', manaChance:0.2},
  // MAGIC
  {id:'wand',      name:'Gậy Phép',   icon:'🪄', dmg:12, price:50,  owned:false, type:'magic',
   desc:'Tăng nhẹ sát thương phép thuật.', special:'none'},
  {id:'firewand',  name:'Gậy Lửa',   icon:'🔥', dmg:20, price:75,  owned:false, type:'magic',
   desc:'<b>Thiêu Đốt</b> — mục tiêu mất 5 HP mỗi lượt (tối đa 3 lượt)!', special:'magicburn'},
  {id:'thunderwand',name:'Gậy Sét',  icon:'⚡', dmg:35, price:110, owned:false, type:'magic',
   desc:'30% tỉ lệ <b>Choáng</b> — kẻ địch không tấn công được 1 lượt!', special:'stun', stunChance:0.3},
  {id:'windwand',  name:'Gậy Gió',   icon:'🌪️', dmg:30, price:100, owned:false, type:'magic',
   desc:'Giảm sát thương địch, 10% tạo <b>Khiên Gió</b> chặn 1 đòn!', special:'windshield', shieldChance:0.1},
  // ══ CAVE REWARDS ══
  {id:'naturewand', name:'Gậy Thiên Nhiên', icon:'🌿', dmg:40, price:0, owned:false, type:'magic', isCaveReward:true, caveChap:0,
   desc:'🏆 Phần thưởng Đồng Cỏ! 30-40% <b>Trói chân</b> — kẻ địch bị <b>Nhiễm Độc</b> (-6HP/lượt×3) và giảm sát thương 40%!',
   special:'naturebind', bindChance:0.35},
  {id:'trident',    name:'Đinh Ba Thần Biển', icon:'🔱', dmg:50, price:0, owned:false, type:'melee', isCaveReward:true, caveChap:1,
   desc:'🏆 Phần thưởng Đại Dương! 30-40% <b>Hồi Phục</b> — hồi 1/4 HP & Mana sau mỗi đòn!',
   special:'tideheal', healChance:0.35},
];
// Dual weapon system: one melee + one magic simultaneously
let equippedWpn=null;       // active primary (shown in HUD, used for melee btn)
let equippedMelee=null;     // equipped melee slot
let equippedMagic=null;     // equipped magic slot

const armors=[
  {id:'cloth', name:'Áo Vải',    icon:'👕', hp:0,  armor:0,  price:0,   owned:true,  equipped:true,  desc:'Quần áo thường'},
  {id:'leather',name:'Giáp Da',  icon:'🥋', hp:20, armor:10, price:35,  owned:false, equipped:false, desc:'+20 HP, -10% sát thương'},
  {id:'chain',  name:'Giáp Lưới',icon:'⛓️', hp:40, armor:20, price:70,  owned:false, equipped:false, desc:'+40 HP, -20% sát thương'},
  {id:'plate',  name:'Giáp Thép',icon:'🛡️', hp:70, armor:35, price:120, owned:false, equipped:false, desc:'+70 HP, -35% sát thương'},
  {id:'magic',  name:'Áo Pháp',  icon:'🔮', hp:30, armor:15, price:90,  owned:false, equipped:false, desc:'+30 HP, +30 Mana, giảm mana dùng phép'},
  {id:'dragon', name:'Giáp Rồng',icon:'🐉', hp:100,armor:50, price:200, owned:false, equipped:false, dragonBonus:0.5, desc:'+100 HP, -50% sát thương, +20 Mana, ⚔+50% DMG với Rồng'},
  // CAVE REWARD
  {id:'angelarmor', name:'Giáp Thiên Thần', icon:'👼', hp:280, armor:45, price:0, owned:false, equipped:false, isCaveReward:true, caveChap:2,
   desc:'🏆 Phần thưởng Bầu Trời! +150 HP, 30-40% <b>Né đòn</b>, 20% <b>Đánh 3 đòn</b>, <b>Hồi Sinh 1 lần</b> khi chết hồi 30% HP+chặn 1 đòn!',
   dodgeChance:0.35, tripleChance:0.20, hasRevive:true},
];

// Init dual weapon slots
equippedMelee = weapons.find(w=>w.id==='woodsword');
equippedWpn   = equippedMelee; // default primary is melee
let equippedArmor=armors[0];

// Angel armor battle state
let bAngelReviveUsed=false; // once per battle
let bAngelBlocked=false;    // post-revive block 1 hit
let bNatureBind=false;      // enemy is bound + poisoned
let bNatureBindTurns=0;     // turns remaining
let bNaturePoisonTurns=0;

// Inventory: potions (consumables)
let potions={hp:0, mana:0};  // stack count
const potionDefs=[
  {id:'hp_sm',  name:'Bình HP Nhỏ', icon:'🧪', restore:30,  type:'hp',   price:15, desc:'Hồi 30 HP'},
  {id:'hp_lg',  name:'Bình HP Lớn', icon:'❤️', restore:70,  type:'hp',   price:35, desc:'Hồi 70 HP'},
  {id:'mana_sm',name:'Bình Mana Nhỏ',icon:'💧',restore:25,  type:'mana', price:12, desc:'Hồi 25 Mana'},
  {id:'mana_lg',name:'Bình Mana Lớn',icon:'💎',restore:60,  type:'mana', price:28, desc:'Hồi 60 Mana'},
  {id:'full',   name:'Linh Dược',   icon:'✨', restore:999, type:'full',  price:80, desc:'Hồi đầy HP + Mana'},
];

// Ground platform Y in world coords (= gY in screen when cam.x=0... actually screen gY is fixed, world coords = screen Y for platformer)
const GND=gY; // player walks on gY

const GRASS_H = 0; // player feet touch gY = top of green grass stripe
const platforms=[
  // Đất trái hồ (0 → hồ)
  {wx:0,  wy:GND-GRASS_H, ww:LAKE_X1,           wh:40+GRASS_H},
  // Đất phải hồ (hết hồ → cuối map)
  {wx:LAKE_X2, wy:GND-GRASS_H, ww:WORLD_W-LAKE_X2, wh:40+GRASS_H},
];

const houses=[
  {id:'math',worldX:2080,width:120,height:175,
   roofCol:'#2a2a3a',wallCol:'#5a5a66',
   name:'Toán Học',icon:'📐',subj:'math',
   npcName:'Cô Lan',npcType:'wizard',
   greet:'Xin chào! Cô Lan dạy Toán đây. Em có muốn làm bài tập Toán thú vị không?'},
  {id:'geo',worldX:2650,width:130,height:185,
   roofCol:'#cc3322',wallCol:'#aa2211',
   name:'Địa Lý',icon:'🌏',subj:'geo',
   npcName:'Thầy Nam',npcType:'merchant',
   greet:'Chào em! Thầy Nam đây. Cùng khám phá thế giới qua Địa lý nhé!'},
  {id:'history',worldX:3300,width:155,height:185,
   roofCol:'#e8e0d0',wallCol:'#f5ecda',
   name:'Lịch Sử',icon:'🏛️',subj:'history',
   npcName:'Bà Hoa',npcType:'wizard',
   greet:'Ối con ơi! Bà Hoa đây! Hãy cùng bà tìm hiểu lịch sử Việt Nam hào hùng!'},
  {id:'literature',worldX:4050,width:135,height:175,
   roofCol:'#c89820',wallCol:'#f2e8cc',
   name:'Văn Học',icon:'📖',subj:'literature',
   npcName:'Thầy Bình',npcType:'merchant',
   greet:'Chào học sinh! Thầy Bình dạy Văn học. Cùng chơi bài tập Tiếng Việt nhé!'},
  {id:'civic',worldX:4900,width:140,height:180,
   roofCol:'#1a4a8a',wallCol:'#2255a8',
   name:'Công Dân',icon:'🏫',subj:'civic',
   npcName:'Cô Mai',npcType:'wizard',
   greet:'Xin chào em! Cô Mai dạy Giáo dục Công dân. Cùng học về quyền và bổn phận nhé!'},
  {id:'english',worldX:5700,width:145,height:185,
   roofCol:'#8b1a1a',wallCol:'#cc2222',
   name:'Tiếng Anh',icon:'🔤',subj:'english',
   npcName:'Thầy Tom',npcType:'merchant',
   greet:'Hello! I am Teacher Tom! Let\'s learn English together! Cùng học Tiếng Anh nhé!'},
];
// Cave entrance (special - opens cave map)
const caveEntrance={worldX:6200,width:160,height:120};

const monsters=[
  // Zone 1: Weak (near start)
  {id:'g1',wx:2280,wy:0,w:32,h:56,type:'goblin',name:'Goblin Xanh',hp:30,maxHp:30,alive:true,dir:1,mt:0,rw:6},
  {id:'b1',wx:2450,wy:0,w:40,h:28,type:'bat',name:'Dơi Đỏ',hp:40,maxHp:40,alive:true,dir:-1,mt:0,rw:8},
  {id:'g2',wx:2560,wy:0,w:32,h:56,type:'goblin',name:'Goblin Nhỏ',hp:28,maxHp:28,alive:true,dir:1,mt:0,rw:6},
  // Zone 2: Medium-weak
  {id:'b2',wx:2900,wy:0,w:40,h:28,type:'bat',name:'Dơi Xám',hp:55,maxHp:55,alive:true,dir:1,mt:0,rw:10},
  {id:'o1',wx:3050,wy:0,w:44,h:78,type:'orc',name:'Orc Xanh',hp:90,maxHp:90,alive:true,dir:1,mt:0,rw:18},
  {id:'g3',wx:3200,wy:0,w:32,h:56,type:'goblin',name:'Goblin Vàng',hp:50,maxHp:50,alive:true,dir:-1,mt:0,rw:10},
  // Zone 3: Medium
  {id:'b3',wx:3550,wy:0,w:40,h:28,type:'bat',name:'Dơi Tím',hp:70,maxHp:70,alive:true,dir:1,mt:0,rw:13},
  {id:'o2',wx:3750,wy:0,w:44,h:78,type:'orc',name:'Orc Đỏ',hp:130,maxHp:130,alive:true,dir:1,mt:0,rw:24},
  {id:'g4',wx:3900,wy:0,w:32,h:56,type:'goblin',name:'Goblin Lửa',hp:75,maxHp:75,alive:true,dir:-1,mt:0,rw:15},
  // Zone 4: Medium-hard (between literature & civic)
  {id:'b4',wx:4400,wy:0,w:40,h:28,type:'bat',name:'Dơi Bóng Tối',hp:100,maxHp:100,alive:true,dir:-1,mt:0,rw:19},
  {id:'o3',wx:4600,wy:0,w:44,h:78,type:'orc',name:'Orc Chiến Binh',hp:180,maxHp:180,alive:true,dir:1,mt:0,rw:31},
  {id:'g5',wx:4750,wy:0,w:32,h:56,type:'goblin',name:'Goblin Bạc',hp:95,maxHp:95,alive:true,dir:1,mt:0,rw:18},
  // Zone 5: Hard (between civic & english)
  {id:'b5',wx:5200,wy:0,w:40,h:28,type:'bat',name:'Dơi Quỷ',hp:140,maxHp:140,alive:true,dir:-1,mt:0,rw:26},
  {id:'o4',wx:5400,wy:0,w:44,h:78,type:'orc',name:'Orc Hắc Ám',hp:240,maxHp:240,alive:true,dir:1,mt:0,rw:42},
  {id:'g6',wx:5600,wy:0,w:32,h:56,type:'goblin',name:'Goblin Vương',hp:120,maxHp:120,alive:true,dir:-1,mt:0,rw:23},
  // Zone 6: Very hard (between english & cave)
  {id:'b6',wx:6200,wy:0,w:40,h:28,type:'bat',name:'Dơi Địa Ngục',hp:180,maxHp:180,alive:true,dir:1,mt:0,rw:33},
  {id:'o5',wx:6500,wy:0,w:44,h:78,type:'orc',name:'Orc Thần',hp:320,maxHp:320,alive:true,dir:-1,mt:0,rw:56},
  {id:'g7',wx:6750,wy:0,w:32,h:56,type:'goblin',name:'Goblin Hắc',hp:160,maxHp:160,alive:true,dir:1,mt:0,rw:30},
  // Zone 7: Near dragon
  {id:'b7',wx:7300,wy:0,w:40,h:28,type:'bat',name:'Dơi Rồng',hp:220,maxHp:220,alive:true,dir:1,mt:0,rw:40},
  {id:'o6',wx:7550,wy:0,w:44,h:78,type:'orc',name:'Orc Long Vệ',hp:400,maxHp:400,alive:true,dir:-1,mt:0,rw:70},
  // DRAGON BOSS — Hắc Long Vương at haunted castle gate center, night-only
  {id:'dragon_boss',wx:9400,wy:0,w:160,h:140,type:'dragon',name:'🐉 Hắc Long Vương',hp:1200,maxHp:1200,alive:false,dir:-1,mt:0,rw:180,isBoss:true,dragonAtk:28,dragonCritChance:0.20,nightOnly:true,lockedUntilChess:true},
];
// Set monster Y and chest Y (after GND is defined) — stand on grass
monsters.forEach(m=>{ m.wy=GND-GRASS_H-m.h; });
// Dragon boss: adjust Y so it sits on ground properly
const dragonBoss=monsters.find(m=>m.type==='dragon');
if(dragonBoss) dragonBoss.wy=GND-GRASS_H-175;
chests.forEach(ch=>{ ch.wy=GND-GRASS_H-28; });

// Hell corridor starts after town (past the cave), dragon waits at the far end
const HELL_START=8800;   // lâu đài bóng đêm cuối bản đồ
const HELL_END=10000;    // kết thúc lâu đài
const hellCorridor={worldX:HELL_START, endX:HELL_END};

// Underground entrance — outside of town, far right past cave
const undergroundEntrance={worldX:7200,width:80,height:60};

// Coins along the world
const wcoins=[];
for(let i=0;i<4;i++) wcoins.push({wx:300+i*450,wy:GND-GRASS_H-30,collected:false});

// Underground dungeon floors (10 tầng)
const UNDERGROUND_FLOORS=[
  {floor:1, name:'Tầng 1 — Hang Tối',      monster:{type:'goblin',name:'Goblin Hang Đá',    hp:80,  maxHp:80,  rw:8,  dragonAtk:0}},
  {floor:2, name:'Tầng 2 — Hầm Đá',        monster:{type:'bat',   name:'Dơi Hầm Mộ',       hp:120, maxHp:120, rw:10, dragonAtk:0}},
  {floor:3, name:'Tầng 3 — Mê Cung',       monster:{type:'orc',   name:'Orc Hầm Tối',      hp:200, maxHp:200, rw:20, dragonAtk:0}},
  {floor:4, name:'Tầng 4 — Hang Quỷ',      monster:{type:'goblin',name:'Goblin Địa Ngục',   hp:300, maxHp:300, rw:28, dragonAtk:0}},
  {floor:5, name:'Tầng 5 — Thủ Lĩnh',      monster:{type:'orc',   name:'Orc Thủ Lĩnh',     hp:500, maxHp:500, rw:70, dragonAtk:20,dragonCritChance:0.15,isBoss:true,subBoss:true}},
  {floor:6, name:'Tầng 6 — Vực Thẳm',      monster:{type:'bat',   name:'Dơi Địa Ngục',     hp:380, maxHp:380, rw:35, dragonAtk:0}},
  {floor:7, name:'Tầng 7 — Hang Lửa',      monster:{type:'orc',   name:'Orc Lửa',          hp:480, maxHp:480, rw:42, dragonAtk:0}},
  {floor:8, name:'Tầng 8 — Dung Nham',     monster:{type:'orc',   name:'Orc Dung Nham',    hp:600, maxHp:600, rw:52, dragonAtk:0}},
  {floor:9, name:'Tầng 9 — Cổng Địa Ngục', monster:{type:'goblin',name:'Goblin Cận Vệ Lửa', hp:800, maxHp:800, rw:90, dragonAtk:28,dragonCritChance:0.18,isBoss:false}},
  {floor:10,name:'Tầng 10 — ĐỊA NGỤC',     monster:{type:'fire_dragon',name:'🔥 HỎA LONG VƯƠNG',hp:1500,maxHp:1500,rw:160,dragonAtk:35,dragonCritChance:0.22,isBoss:true,fireDragon:true}},
];

// Build blocked zones: lake + all houses + cave + underground
