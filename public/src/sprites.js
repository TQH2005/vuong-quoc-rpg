function drawKnight(cx,x,y,flip,walking,frame,forceIdle){
  const sc=2;
  // p() = có flip (thân, mũ, khiên, chân)
  const p=(px,py,w,h,c)=>{
    if(!c)return; cx.fillStyle=c;
    const rx=flip?x+(26-px-w)*sc:x+px*sc;
    cx.fillRect(rx,y+py*sc,w*sc,h*sc);
  };
  // abs() = tọa độ tuyệt đối KHÔNG flip (kiếm nghiêng)
  const abs=(ax,ay,w,h,c)=>{
    if(!c)return; cx.fillStyle=c;
    cx.fillRect(ax,ay,w*sc,h*sc);
  };

  // Bảng màu
  const D1='#282828',D2='#404040',D3='#505050';
  const M1='#606060',M2='#707070',M3='#808080';
  const L1='#909090',L2='#a0a0a0',L3='#b0b0b0';
  const S1='#c0c0c0',S2='#d0d0d0',S3='#e0e0e0';
  const VI='#0a0a0a';
  const GD='#c08000',GM='#d09000',GH='#f0b000';
  const BR='#7a5020',BD='#4a2c10',BK='#2a1408';
  const SW='#c8d4e0',SL='#dceaf4',SH='#eef6ff';

  const lL=walking?(Math.sin(frame*0.18)*2.5)|0:0;
  const lR=walking?(-Math.sin(frame*0.18)*2.5)|0:0;

  // Kiểm tra có đang tấn công không
  const isAttacking = !forceIdle && P.attackAnim > 0;
  const atkPhase = isAttacking ? Math.floor((32-P.attackAnim)/32*4) : -1;

  // ── KHIÊN (vẽ trước) ──
  p(-3,12,2,14,GD); p(-3,12,12,2,GD); p(-3,24,12,2,GD); p(7,12,2,14,GD);
  p(-2,13,9,11,BR); p(-1,14,7,9,BD);
  p(2,17,3,3,GH); p(3,18,1,1,GD);
  p(-2,13,1,4,GM); p(-2,13,4,1,GM);

  // ── MŨ GIÁP ──
  p(8,0,10,1,M2);p(9,0,8,1,L1);
  p(7,1,12,1,M2);p(8,1,10,1,L1);
  p(6,2,14,1,M1);p(7,2,12,1,L1);p(9,2,6,1,L2);
  p(5,3,16,2,M1);p(6,3,14,2,L1);p(8,3,8,2,L2);p(10,3,4,1,S1);
  p(5,5,16,3,M1);p(6,5,12,3,L1);p(8,5,7,2,L2);p(10,5,3,2,S1);
  p(5,7,16,2,VI); // visor đen
  p(5,9,16,1,M2);p(6,9,12,1,L1);
  p(5,10,16,2,M1);p(6,10,10,2,L1);p(8,10,6,1,L2);
  p(8,11,8,2,M2);p(9,11,6,2,M3);p(10,12,4,1,L1);
  p(5,3,2,8,L2);p(6,4,1,6,L3);
  p(19,3,2,8,M1);p(20,4,1,7,M2);

  // ── THÂN GIÁP ──
  p(7,13,12,10,M1);p(8,13,10,10,L1);p(9,14,8,8,L2);
  p(10,15,5,6,S1);p(11,15,3,5,S2);p(12,16,1,3,S3);
  p(8,15,10,1,L2);p(8,18,10,1,L2);
  p(7,13,12,1,L2);
  p(7,13,2,10,M1);p(17,13,2,10,M1);
  p(7,23,12,2,GD);p(8,23,10,1,GM);p(10,23,5,1,GH);
  p(11,23,4,2,GH);p(12,23,2,1,S1);

  // ── PAULDRON TRÁI ──
  p(3,12,5,1,L1);
  p(2,13,6,6,M2);p(3,13,5,6,L1);p(3,14,5,5,L2);p(4,14,4,4,S1);p(5,15,2,2,S2);
  p(2,13,1,5,L2);p(2,18,6,1,GH);p(7,13,1,6,M1);

  // ── PAULDRON PHẢI ──
  p(18,12,5,1,L1);
  p(18,13,6,6,M2);p(18,13,5,6,L1);p(19,14,4,5,L2);p(19,14,3,4,S1);p(21,15,2,2,S2);
  p(22,13,1,5,L2);p(18,18,5,1,GH);p(17,13,1,6,M1);

  // ── TAY TRÁI (giữ khiên) ──
  p(5,18,3,4,M2);p(6,18,2,4,L1);p(6,19,2,3,L2);
  p(5,21,3,1,M1);
  p(5,22,3,3,BR);p(6,22,2,2,BD);

  // ── VÁY GIÁP ──
  p(7,25,5,4,M2);p(8,25,4,4,L1);p(8,26,3,3,L2);
  p(14,25,5,4,M2);p(14,25,4,4,L1);p(15,26,3,3,L2);
  p(12,25,2,3,M1);

  // ── CHÂN với walking animation ──
  p(7,29+lL,5,4,M2);p(8,29+lL,4,4,L1);p(9,29+lL,3,3,L2);p(9,30+lL,2,2,S1);
  p(7,33+lL,5,2,M1);p(8,33+lL,4,1,L2);
  p(7,35+lL,5,4,M2);p(8,35+lL,4,4,L1);p(9,36+lL,3,3,L2);
  p(6,38+lL,6,2,D2);p(7,38+lL,5,2,M1);p(8,38+lL,3,1,L1);p(6,39+lL,7,1,D1);

  p(14,29+lR,5,4,M2);p(14,29+lR,4,4,L1);p(15,29+lR,3,3,L2);p(15,30+lR,2,2,S1);
  p(14,33+lR,5,2,M1);p(15,33+lR,4,1,L2);
  p(14,35+lR,5,4,M2);p(14,35+lR,4,4,L1);p(15,36+lR,3,3,L2);
  p(13,38+lR,6,2,D2);p(14,38+lR,5,2,M1);p(15,38+lR,3,1,L1);p(13,39+lR,7,1,D1);

  // ── TAY PHẢI + KIẾM (4 frame tấn công / idle) ──
  if(!isAttacking){
    // IDLE: kiếm thẳng đứng bên phải
    p(19,13,4,5,M2);p(20,13,3,5,L1);p(20,14,2,4,L2);
    p(19,13,1,5,M1);p(22,13,1,5,M1);
    p(19,17,4,2,M1);
    p(19,18,4,3,M2);p(20,18,3,3,L1);
    p(19,20,4,3,BR);p(20,20,3,2,BD);
    // Guard vàng
    p(17,21,7,2,GD);p(18,21,5,1,GH);p(17,21,1,2,GD);p(23,21,1,2,GD);
    // Tay cầm
    p(19,23,3,4,BR);p(20,23,2,3,BD);
    p(18,23,1,4,D2);p(22,23,1,4,D2);
    // Pommel
    p(18,26,4,2,GD);p(19,26,3,1,GH);p(18,27,4,1,GD);
    // Lưỡi kiếm thẳng đứng
    p(19,0,3,21,SW);p(20,0,2,21,SL);p(20,0,1,21,SH);
    p(20,0,2,1,SH);
    p(19,0,1,21,D2);p(21,0,1,21,D2);

  } else if(atkPhase===0){
    // Frame 0: chuẩn bị — kiếm giơ cao sau lưng
    p(19,12,3,4,M2);p(20,12,2,4,L1);
    p(19,15,3,3,M1);p(20,15,2,2,L2);
    p(19,17,3,2,BR);p(20,17,2,1,BD);
    p(19,14,5,2,GD);p(20,14,3,1,GH);
    p(20,16,2,3,BR);p(20,16,1,3,BD);
    p(19,19,3,2,GD);p(20,19,2,1,GH);
    // Kiếm thẳng đứng
    p(20,0,2,14,SW);p(21,0,1,14,SH);p(20,0,1,14,SL);
    p(20,0,2,1,SH);p(20,13,2,1,D2);

  } else if(atkPhase===1){
    // Frame 1: vung ra — kiếm 45° ra trước
    p(19,13,4,4,M2);p(20,13,3,4,L1);
    p(22,12,3,4,M1);p(23,12,2,3,L2);
    p(23,15,3,2,BR);p(24,15,2,1,BD);
    p(21,14,6,2,GD);p(22,14,4,1,GH);
    p(23,16,3,3,BR);p(23,16,2,2,BD);
    p(22,19,3,2,GD);p(23,19,2,1,GH);
    // Lưỡi kiếm 45° — tọa độ tuyệt đối (không flip)
    {const bx=flip?x-4*sc:x+23*sc, by=y+13*sc, dir=flip?-1:1;
    [SH,SH,SL,SL,SW,SW,SW,SW,SW,SW,SW,SW].forEach((col,i)=>{
      abs(bx+dir*i*sc, by-i*sc, 2,2,col);
    });}

  } else if(atkPhase===2){
    // Frame 2: đỉnh vung — kiếm NGANG hoàn toàn
    p(19,14,5,4,M2);p(20,14,4,4,L1);
    p(23,14,4,3,M1);p(24,14,3,2,L2);
    p(25,15,3,2,BR);p(26,15,2,1,BD);
    // Guard dọc
    p(24,12,2,5,GD);p(24,12,1,5,GH);
    p(24,11,2,1,GD);p(24,16,2,1,GD);
    p(25,14,3,4,BR);p(25,14,2,3,BD);
    p(27,14,3,3,GD);p(27,14,2,2,GH);
    // Lưỡi kiếm NGANG — tọa độ tuyệt đối không flip
    {const bx=flip?x+5*sc:x+sc, by=y+12*sc;
    abs(bx,by,23,1,D2);              // viền trên
    abs(bx,by+sc,2,2,SH);            // mũi nhọn
    abs(bx+2*sc,by+sc,20,2,SW);      // thân kiếm
    abs(bx+2*sc,by+sc,20,1,SH);      // highlight
    abs(bx,by+3*sc,22,1,D2);}        // viền dưới

  } else {
    // Frame 3: thu về — kiếm 45° xuống
    p(19,14,4,5,M2);p(20,14,3,5,L1);
    p(22,17,3,4,M1);p(23,17,2,3,L2);
    p(22,20,3,2,BR);p(23,20,2,1,BD);
    p(20,18,6,2,GD);p(21,18,4,1,GH);
    p(22,20,3,3,BR);p(22,20,2,2,BD);
    p(21,23,3,2,GD);p(22,23,2,1,GH);
    // Lưỡi kiếm 45° xuống — tọa độ tuyệt đối
    {const bx=flip?x+3*sc:x+21*sc, by=y+17*sc, dir=flip?1:-1;
    [SH,SH,SL,SL,SW,SW,SW,SW,SW,SW,SW,SW].forEach((col,i)=>{
      abs(bx+dir*i*sc, by+i*sc, 2,2,col);
    });}
  }
}




// ══════════════════════════════════════════════════════════════
// SEA CREATURES — pixel-art, matching reference images exactly
// All use p(rx,ry,w,h,col) = fillRect helper
// ══════════════════════════════════════════════════════════════

// ── 🦀 CUA BIỂN — pixel-art crab (Image 1 reference)
// Red body, big orange claws raised up, eye stalks, pixel steps
function drawSeaCrab(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  // Palette (exact crab image colors)
  const D='#1a0000',O1='#cc2200',O2='#dd3311',O3='#ee4422',O4='#ff6644',O5='#ff9966',
        E='#2244cc',EW='#aabbff',W='#ffffff',CL='#bb1100',CL2='#cc3300';
  const bob=Math.sin(frame*0.2)*1; // leg bob

  // === LEGS (drawn behind body) ===
  // Left legs — diagonal going down-left
  p(-8, 10+bob, 4,2,O2); p(-10,12+bob,3,2,O1); p(-12,14+bob,3,2,D);
  p(-7, 14+bob, 4,2,O2); p(-9, 16+bob,3,2,O1); p(-11,18+bob,2,2,D);
  p(-6, 18+bob, 4,2,O2); p(-8, 20+bob,3,2,O1); p(-10,22+bob,2,2,D);
  // Right legs
  p(20, 10+bob, 4,2,O2); p(23, 12+bob,3,2,O1); p(25, 14+bob,3,2,D);
  p(19, 14+bob, 4,2,O2); p(22, 16+bob,3,2,O1); p(24, 18+bob,2,2,D);
  p(18, 18+bob, 4,2,O2); p(21, 20+bob,3,2,O1); p(23, 22+bob,2,2,D);

  // === LEFT CLAW (raised, open pincer) ===
  // Upper arm
  p(-16, 2,6,4,O3); p(-18,0,4,4,O3); p(-20,-2,4,4,O2); p(-22,-4,4,4,O2);
  // Upper pincer tip
  p(-26,-6,4,4,CL2); p(-28,-8,4,4,CL); p(-28,-10,4,3,D); p(-26,-11,3,2,D);
  // Lower pincer
  p(-24, 0,4,4,CL2); p(-26, 2,4,4,CL); p(-28,  3,4,3,D);
  // Pincer gap
  p(-26,-2,2,2,D);
  // Highlight on claw
  p(-20,-1,3,2,O4);

  // === RIGHT CLAW (raised, mirror) ===
  p(26, 2,6,4,O3); p(30,0,4,4,O3); p(32,-2,4,4,O2); p(34,-4,4,4,O2);
  p(36,-6,4,4,CL2); p(38,-8,4,4,CL); p(38,-10,4,3,D); p(37,-11,3,2,D);
  p(32, 0,4,4,CL2); p(34, 2,4,4,CL); p(36,  3,4,3,D);
  p(34,-2,2,2,D);
  p(33,-1,3,2,O4);

  // === BODY (carapace) — rounded pixel hexagon ===
  // Outline row by row
  p(-2, -2,20,2,D);        // top edge
  p(-6,  0,28,2,D);        // top sides
  p(-8,  2,32,2,O1);       // body top
  p(-10, 4,36,6,O2);       // body wide
  p(-10,10,36,6,O3);       // body mid
  p(-10,16,36,4,O2);       // body low
  p(-8, 20,32,2,O1);       // body bottom
  p(-6, 22,28,2,D);        // bottom edge
  p(-2, 24,20,2,D);        // bottom taper
  // Side outlines
  p(-10, 4,2,16,D); p(34,4,2,16,D);

  // Highlights (top-left bright)
  p(-4, 2,10,2,O4);
  p(-6, 4, 8,4,O4);
  p(-4, 8, 6,3,O5);
  p(-2,10, 4,2,W);  // shine

  // Shadow (bottom-right dark)
  p( 8,18,18,4,O1);
  p(12,22,12,2,CL);

  // === EYES on stalks ===
  // Left stalk + eye
  p( 0,-8,3,8,O2);   // stalk
  p(-2,-12,6,5,O2);  // eye base
  p(-2,-12,6,5,E);   // iris
  p(-1,-11,2,2,EW);  // reflection
  p(-1,-10,1,1,W);   // shine

  // Right stalk + eye
  p(13,-8,3,8,O2);
  p(12,-12,6,5,O2);
  p(12,-12,6,5,E);
  p(13,-11,2,2,EW);
  p(14,-10,1,1,W);

  // === MOUTH (small line) ===
  p( 4,16,8,2,D);
  p( 6,14,2,2,D); p(10,14,2,2,D);

  cx.restore();
}

// ── 🐚 ỐC MƯỢN HỒN — pixel-art hermit crab (Image 2 reference)
// Golden spiral shell, red-orange body, one big claw, eye stalks
function drawHermitCrab(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  // Shell palette (warm orange/gold like image 2)
  const S1='#cc6600',S2='#dd8800',S3='#eeaa22',S4='#ffcc44',S5='#ffee88',SS='#884400',SD='#331100';
  // Body palette (red-orange)
  const B1='#881100',B2='#aa2200',B3='#cc3300',B4='#ee5522';
  const CL='#cc2200',CL2='#ee4400',W='#ffffff',E='#110022',EG='#663388';

  const bob=Math.sin(frame*0.16)*1.2;
  const clw=Math.sin(frame*0.13)*2;

  // === SHELL (large coiled snail shell — dominant feature) ===
  // Shell body — layered concentric arcs (pixel staircase)
  // Outermost layer (dark orange)
  p(10,-30,24,4,S2); p( 6,-26,32,4,S2); p( 2,-22,38,4,S2);
  p(-2,-18,44,4,S1); p(-4,-14,46,4,S2); p(-4,-10,46,4,S1);
  p(-2, -6,44,4,S2); p( 2, -2,38,4,S1); p( 6,  2,32,4,SS);
  p(10,  6,24,4,SS); p(14, 10,16,4,SD);
  // Second layer (brighter)
  p(14,-26,16,4,S3); p(10,-22,24,4,S3); p( 6,-18,30,4,S3);
  p( 4,-14,34,4,S4); p( 4,-10,34,4,S3); p( 6, -6,30,4,S4);
  p(10, -2,24,4,S3); p(14,  2,16,4,S2);
  // Inner bright
  p(18,-22, 8,4,S4); p(16,-18,14,4,S4); p(14,-14,16,4,S5);
  p(14,-10,16,4,S4); p(16, -6,12,4,S3);
  // Center spiral dot
  p(20,-14, 6,4,S1); p(22,-12, 4,4,SD); p(22,-12,4,4,SD);
  // Shell highlight (top-left white streak)
  p(10,-28,6,2,S5); p( 8,-26,4,2,W);
  // Shell outline
  p( 8,-32,20,2,SD); p( 4,-28,2,2,SD); p(34,-28,2,2,SD);
  p( 0,-20,2,20,SD); p(40,-20,2,18,SD);
  p( 6, 12,28,2,SD);

  // === BODY (peek out bottom-left of shell) ===
  p(-8, 2,16,8,B3);
  p(-10,10,18,8,B2);
  p(-8, 18,14,6,B1);
  // Body outline
  p(-10, 2,2,22,SD); p( 6, 2,2,16,SD);

  // === LEGS (small, bob) ===
  p(-12,12+bob,5,2,B2); p(-15,14+bob,4,3,B1); p(-14,17+bob,3,2,SD);
  p( -4,14+bob,5,2,B2); p( -5,16+bob,4,3,B1); p( -4,19+bob,3,2,SD);
  p(  4,14+bob,5,2,B2); p(  5,16+bob,4,3,B1); p(  5,19+bob,3,2,SD);

  // === BIG LEFT CLAW (extended, animated — main feature) ===
  // Arm
  p(-22, 4+clw, 14,6,B3); p(-26, 2+clw, 6,5,B3); p(-28, 0+clw,4,5,B2);
  // Claw upper jaw
  p(-32,-4+clw,10,5,CL2); p(-38,-6+clw,8,5,CL);  p(-42,-8+clw,6,4,CL);
  p(-44,-8+clw,4,3,SD);
  // Claw lower jaw
  p(-32, 2+clw,10,5,CL2); p(-38, 4+clw,8,5,CL);  p(-42, 5+clw,6,4,CL);
  p(-44, 6+clw,4,3,SD);
  // Claw gap
  p(-34,-2+clw,2,4,SD);
  // Highlight
  p(-30,-3+clw,4,2,CL2);

  // === SMALL RIGHT CLAW ===
  p(6, 0,8,4,B3); p(12,-2,6,4,CL2); p(16,-3,4,4,CL); p(18,-4,4,3,SD);
  p(14, 2,4,3,CL2);

  // === HEAD / EYES on stalks ===
  // Left eye stalk
  p(-6,-6,3,8,B3); p(-7,-14,5,5,B2); p(-8,-14,5,5,E);
  p(-6,-13,2,2,EG); p(-6,-12,1,1,W);
  // Right eye stalk
  p( 2,-6,3,8,B3); p( 1,-14,5,5,B2); p( 1,-14,5,5,E);
  p( 2,-13,2,2,EG); p( 3,-12,1,1,W);

  // === ANTENNAE ===
  cx.strokeStyle=B2; cx.lineWidth=Math.max(1,sc*0.5);
  cx.beginPath(); cx.moveTo(x+(-4)*sc,y+(-14)*sc); cx.lineTo(x+(-14)*sc,y+(-24)*sc); cx.stroke();
  cx.beginPath(); cx.moveTo(x+(4)*sc, y+(-14)*sc); cx.lineTo(x+(12)*sc, y+(-26)*sc); cx.stroke();

  cx.restore();
}

// ── BIG CRAB — boss crab with red aura
function drawBigCrab(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save();
  const pulse=0.5+Math.sin(frame*0.08)*0.35;
  cx.globalAlpha=pulse*0.4;
  cx.fillStyle='#ff1100';
  cx.beginPath(); cx.ellipse(x+16*sc,y+12*sc,38*sc,20*sc,0,0,Math.PI*2); cx.fill();
  cx.globalAlpha=1;
  drawSeaCrab(cx,x,y,frame,sc);
  cx.restore();
}

// ── 🐙 BẠCH TUỘC — pixel-art octopus (new!)
// Purple round head, 8 wavy tentacles, big round eyes
function drawOctopus(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  const P1='#220044',P2='#440088',P3='#6600aa',P4='#8822cc',P5='#aa44ee',PH='#cc88ff';
  const E='#ff2200',EW='#ffffff',SK='#ff4499';
  const t=frame*0.15;

  // === TENTACLES (8, wavy animation) ===
  for(let i=0;i<8;i++){
    const angle=(i/8)*Math.PI*2;
    const wv=Math.sin(t+i*0.8)*3;
    const sx=Math.cos(angle)*8, sy=Math.sin(angle)*8+16;
    // Each tentacle: 4 pixel segments curving out
    for(let seg=0;seg<5;seg++){
      const ta=angle+Math.sin(t+i*0.6+seg*0.4)*0.4;
      const tx=sx+Math.cos(ta)*(seg*4+2)+wv;
      const ty=sy+Math.sin(ta)*(seg*4+2)+seg*2;
      p(tx-1,ty-1,4,4,seg<2?P3:seg<4?P2:P1);
      if(seg>2) p(tx,ty,2,2,SK); // suckers pink
    }
  }

  // === HEAD (round) ===
  p(-6,-18,28,4,P2);   // top row
  p(-10,-14,36,4,P3);
  p(-12,-10,40,6,P4);
  p(-12, -4,40,6,P4);
  p(-10,  2,36,6,P3);
  p(-6,   8,28,6,P2);
  p(-2,  14,22,4,P1);
  // Outline
  p(-8,-20,20,2,P1); p(-14,-16,2,20,P1); p(24,-16,2,20,P1); p(-4,16,20,2,P1);
  // Highlights
  p(-4,-16,10,4,P5); p(-6,-12,8,4,PH); p(-4,-8,4,2,EW);
  // Mantle bump top
  p( 2,-22,12,6,P3); p( 4,-24,8,4,P4); p( 6,-24,4,2,P5);

  // === EYES (big, round, angry) ===
  p(-6,-6,12,8,EW);  // L eye white
  p(-4,-8, 8,10,E);  // L iris red
  p(-2,-6, 4, 6,P1); // L pupil dark
  p(-4,-7, 2, 2,EW); // shine
  p(10,-6,12,8,EW);
  p(12,-8, 8,10,E);
  p(14,-6, 4, 6,P1);
  p(10,-7, 2, 2,EW);

  // === MOUTH ===
  p( 2, 6,12,3,P1);
  p( 4, 4, 2,2,P1); p(12, 4,2,2,P1);

  cx.restore();
}

// ── 🦑 MỰC ỐNG — pixel-art squid (new!)
// Elongated body, pink-red, 10 tentacles, large eyes
function drawSquid(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  const Q1='#cc0044',Q2='#ee2266',Q3='#ff4488',Q4='#ff88aa',QH='#ffccdd';
  const E='#ff6600',EW='#ffffff',FIN='#aa0033',T='#880022';
  const t=frame*0.14;

  // === TENTACLES (10 — front cluster) ===
  for(let i=0;i<10;i++){
    const ox=(i-4.5)*3, wv=Math.sin(t+i*0.55)*4, wv2=Math.sin(t*1.3+i*0.4)*2;
    p(ox+wv, 14,3,5,Q2); p(ox+wv,19,3,5,Q1);
    p(ox+wv2, 24,2,5,T); p(ox+wv2,29,2,4,T);
    // sucker dots
    p(ox+wv+1,22,1,1,QH);
  }
  // 2 long tentacles (longer pair)
  p(-4+Math.sin(t)*3, 14,3,18,Q2); p(-4+Math.sin(t)*3, 32,2,8,T);
  p( 8+Math.sin(t+1)*3,14,3,18,Q2); p( 8+Math.sin(t+1)*3,32,2,8,T);

  // === BODY (elongated torpedo) ===
  p(-6,-24,20,4,Q2);  // top narrow
  p(-8,-20,24,4,Q3);
  p(-10,-16,28,6,Q3);
  p(-10,-10,28,8,Q3);
  p(-10, -2,28,8,Q2);
  p(-8,   6,24,6,Q1);
  p(-6,  12,20,4,Q1);
  // Outline
  p(-8,-26,18,2,FIN); p(-12,-22,2,36,T); p(22,-22,2,36,T); p(-6,14,18,2,T);
  // Highlight stripe
  p(-4,-22, 6,4,Q4); p(-4,-18,6,6,QH); p(-2,-14,4,4,QH);
  p(-2,-10,2,4,EW);

  // === FINS (side triangles) ===
  p(-14,-20,4,10,FIN); p(-16,-18,2,8,FIN); p(-18,-16,2,6,FIN);
  p( 22,-20,4,10,FIN); p( 24,-18,2,8,FIN); p( 26,-16,2,6,FIN);

  // === EYES (big round) ===
  p(-4,-6,8,8,EW);  p(-4,-6,8,8,E);  p(-2,-4,4,5,T);  p(-3,-5,2,2,EW);
  p(10,-6,8,8,EW);  p(10,-6,8,8,E);  p(12,-4,4,5,T);  p(11,-5,2,2,EW);

  // === TAIL / MANTLE TIP ===
  p(-4,-28,16,4,Q2); p(-2,-30,12,4,Q1); p(0,-32,8,4,FIN); p(2,-34,4,4,FIN);

  cx.restore();
}

// ── 🦈 CÁ MẬP — pixel-art shark (new!)
// Grey torpedo body, white belly, black eye, big dorsal fin, teeth
function drawShark(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  const SG='#4466aa',SG2='#5577bb',SG3='#6688cc',SH='#aabbdd',SD='#223355';
  const BL='#eef2ff',T='#eef2ff',OUT='#112233',EY='#111111',EW='#ffffff';
  const t=frame*0.12;
  const swm=Math.sin(t)*3; // swim wiggle

  // Tail wiggle
  const tw=Math.sin(t*1.5)*4;

  // === TAIL FIN ===
  p(-20+tw, -4,8,6,SG2); p(-24+tw,-2,6,5,SG);
  p(-20+tw,  4,8,6,SG2); p(-24+tw, 2,6,5,SG);
  p(-20+tw, -2,4,6,SG3);

  // === BODY ===
  p(-16,-6,50,4,SG);   // back
  p(-18,-2,54,6,SG2);
  p(-18, 4,54,6,SG2);
  p(-16,10,50,4,SG);
  // Belly (white)
  p(-10, 2,36,6,BL);
  p(-12, 0,4,8,BL); p(30, 0,4,8,BL);
  // Outline
  p(-18,-8,50,2,OUT); p(-18,14,50,2,OUT);
  p(-20,-6,2,22,OUT); p(32,-6,2,22,OUT);
  // Highlight top
  p(-8,-4,20,2,SH); p(-4,-6,12,2,SH);

  // === DORSAL FIN ===
  p(10,-18,6,12,SG2); p( 8,-14,6,8,SG2);
  p( 6,-10,6,4,SG);   p(12,-22,4,4,SG);
  p(12,-22,4,22,SG2); // back of fin
  p(12,-24,4,2,OUT); p(10,-20,2,14,OUT); p(16,-20,2,14,OUT);

  // === PECTORAL FINS (sides) ===
  p(  4, 8,10,4,SG); p(  2,10,8,4,SG2); p( 0,12,6,3,SG);
  p( 18, 8,10,4,SG); p( 20,10,8,4,SG2); p(22,12,6,3,SG);

  // === HEAD / SNOUT ===
  p(30,-4,8,12,SG2);  p(36,-2,4,8,SG);
  p(38, 0,4,8,SG3);   p(40, 2,2,4,SG3);
  // Snout outline
  p(30,-6,12,2,OUT); p(30,14,12,2,OUT); p(40,0,2,8,OUT);

  // === EYE ===
  p(26,-2,6,6,EY); p(27,-1,3,3,EW); p(27,-1,2,2,EY); p(28,-2,1,1,EW);

  // === TEETH (bottom jaw) ===
  p(30, 8,2,4,EW); p(32, 8,2,4,EW); p(34, 8,2,4,EW); p(36, 8,2,4,EW);
  p(30, 4,1,2,OUT); p(32, 4,1,2,OUT); // gum line

  // === GILL SLITS ===
  p(18,-4,1,10,SD); p(22,-4,1,10,SD); p(26,-4,1,10,SD);

  cx.restore();
}

// ── 🐠 CÁ THẦN — pixel-art tropical fish (new, smaller)
function drawTropicalFish(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save(); cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  const F1='#ff6600',F2='#ff8800',F3='#ffaa00',FH='#ffcc44',FW='#ffffff';
  const S1='#ffffff',S2='#aaddff';
  const OUT='#552200',EY='#000000';
  const tw=Math.sin(frame*0.25)*2;

  // Tail
  p(-10+tw,-4,6,12,F2); p(-12+tw,-2,4,8,F1); p(-14+tw,0,3,4,OUT);

  // Body
  p(-6,-6,24,4,F1);
  p(-8,-2,28,8,F2);
  p(-8, 6,28,8,F1);
  p(-6,14,24,4,F2);
  p(-4,-8,20,2,OUT); p(-4,16,20,2,OUT);
  p(-10,-4,2,16,OUT); p(20,-4,2,16,OUT);
  // Highlight
  p(-4,-4,10,4,F3); p(-2,-2,6,4,FH); p( 0, 0,4,2,FW);
  // Stripes
  p(4,-4,3,18,S1); p(8,-4,3,18,S1);

  // Dorsal fin
  p(4,-12,8,6,F2); p(6,-14,4,6,F1); p(8,-14,2,8,OUT);

  // Head
  p(18,-4,8,12,F2); p(22,-2,6,8,F1); p(24, 0,4,6,F3);

  // Eye
  p(20,-2,5,5,FW); p(21,-1,3,3,EY); p(21,-1,1,1,FW);

  // Mouth
  p(26, 4,2,3,OUT);

  cx.restore();
}

// ── HERMIT BOSS (large hermit crab)
function drawHermitBoss(cx, x, y, frame, sc){
  sc=sc||2;
  cx.save();
  const pulse=0.5+Math.sin(frame*0.07)*0.35;
  cx.globalAlpha=pulse*0.4;
  cx.fillStyle='#ff8800';
  cx.beginPath(); cx.ellipse(x+14*sc,y*1,36*sc,24*sc,0,0,Math.PI*2); cx.fill();
  cx.globalAlpha=1;
  drawHermitCrab(cx,x,y,frame,sc);
  cx.restore();
}

// ──────────────────────────────────────────────────────────────
// GOBLIN  16×28 grid · sc=2 → 32×56px
// Image 3: vivid green skin, HUGE ears, big yellow eyes, cloth belt
// ──────────────────────────────────────────────────────────────
function drawGoblin(cx,x,y,flip,frame){
  const sc=2;
  const p=(px,py,w,h,col)=>{
    if(!col||col==='T')return; cx.fillStyle=col;
    cx.fillRect(flip?x+(16-px-w)*sc:x+px*sc, y+py*sc, w*sc, h*sc);
  };
  const lL=(Math.sin(frame*0.2)*2)|0;
  const lR=(-Math.sin(frame*0.2)*2)|0;
  const aR=(Math.sin(frame*0.2)*1.5)|0;

  // ── BIG POINTED EARS (very prominent in image 3) ──
  p(-2,3,3,6,C.g2);p(-2,4,3,5,C.g1);p(-1,3,2,2,C.g3);p(-1,5,1,3,C.gc3);// L
  p(15,3,3,6,C.g2);p(15,4,3,5,C.g1);p(15,3,2,2,C.g3);p(15,5,1,3,C.gc3);// R

  // ── Head (round, large) ──
  p(2,0,12,3,C.g2);p(1,1,14,2,C.g1);p(2,2,12,1,C.g3);// top
  p(1,2,14,8,C.g1);p(2,3,12,7,C.g2);p(3,4,10,6,C.g3);
  // Head shading
  p(3,2,10,2,C.g3);p(4,2,8,1,C.g5);p(5,2,6,1,C.g6);

  // ── EYES (key feature: large yellow-orange) ──
  p(2,3,5,4,C.gy);p(9,3,5,4,C.gy);// outer yellow
  p(3,3,4,4,C.gy2);p(10,3,4,4,C.gy2);// inner orange
  p(4,4,2,2,C.gy3);p(11,4,2,2,C.gy3);// pupil center
  p(4,4,1,1,C.gy4);p(12,4,1,1,C.gy4);// darkest pupil
  p(3,3,1,1,'#ffffe0');p(9,3,1,1,'#ffffe0');// eye shine top-left
  p(5,3,1,1,'#ffffc0');p(12,3,1,1,'#ffffc0');// secondary shine

  // ── Brow ridge ──
  p(2,3,5,1,C.g2);p(9,3,5,1,C.g2);

  // ── Nose ──
  p(7,6,2,1,C.g4);p(6,7,4,2,C.g4);p(7,7,2,1,C.g2);

  // ── Mouth (grinning) ──
  p(4,8,8,1,C.g4);p(5,9,6,2,'#1a3a0a');
  p(5,8,1,3,'#eeeecc');p(6,8,1,2,'#eeeecc');// L fangs
  p(9,8,1,3,'#eeeecc');p(10,8,1,2,'#eeeecc');// R fangs
  // Chin
  p(4,10,8,1,C.g2);p(5,10,6,1,C.g3);

  // ── Neck ──
  p(6,10,4,2,C.g2);p(7,11,2,2,C.g3);

  // ── Torso ──
  p(3,12,10,9,C.g1);p(4,13,8,8,C.g2);p(5,14,6,6,C.g3);p(6,15,4,4,C.g5);
  // Belly highlight
  p(6,14,4,5,C.g5);p(7,14,2,4,C.g6);

  // ── Cloth loincloth (brown, main body covering) ──
  p(3,19,10,5,C.gc);p(4,20,8,4,C.gc2);p(5,19,6,1,C.gc3);
  // Belt strip
  p(2,19,12,2,C.gc2);p(5,19,6,2,C.gc3);p(6,19,4,2,C.gc);

  // ── Arms ──
  p(0,12,4,6,C.g2);p(1,13,3,5,C.g1);p(1,14,2,4,C.g3);// L upper
  p(-1,17,4,4,C.g2);p(0,18,3,3,C.g3);// L forearm
  p(-1,20,4,3,C.g2);// L hand
  p(-2,21,2,2,C.g4);p(-1,21,1,3,C.g4);p(0,21,1,3,C.g4);p(1,21,1,2,C.g4);// L claws
  // R arm animated
  p(12,12+aR,4,6,C.g2);p(12,13+aR,3,5,C.g1);p(12,14+aR,2,4,C.g3);
  p(13,17+aR,4,4,C.g2);p(13,18+aR,3,3,C.g3);
  p(13,20+aR,4,3,C.g2);
  p(13,21+aR,1,3,C.g4);p(14,21+aR,1,3,C.g4);p(15,21+aR,1,3,C.g4);p(16,21+aR,1,2,C.g4);

  // ── Legs ──
  p(4,23+lL,4,5,C.g1);p(5,24+lL,2,5,C.g2);p(5,23+lL,2,2,C.g3);
  p(3,27+lL,5,2,C.gc);p(3,28+lL,6,2,C.gc2);p(3,29+lL,6,1,C.gc3);// boot L
  p(8,23+lR,4,5,C.g1);p(9,24+lR,2,5,C.g2);p(9,23+lR,2,2,C.g3);
  p(8,27+lR,5,2,C.gc);p(8,28+lR,6,2,C.gc2);p(8,29+lR,6,1,C.gc3);// boot R
}


// ──────────────────────────────────────────────────────────────
// ORC  22×36 grid · sc=2 → 44×72px
// Image 2: big olive orc, brown leather vest, ORANGE belt+silver buckle
// ──────────────────────────────────────────────────────────────
function drawOrc(cx,x,y,flip,frame){
  const sc=2;
  const p=(px,py,w,h,col)=>{
    if(!col||col==='T')return; cx.fillStyle=col;
    cx.fillRect(flip?x+(22-px-w)*sc:x+px*sc, y+py*sc, w*sc, h*sc);
  };
  const lL=(Math.sin(frame*0.18)*2.5)|0;
  const lR=(-Math.sin(frame*0.18)*2.5)|0;
  const aR=(Math.sin(frame*0.18))|0;

  // ── Head (big square) ──
  p(5,0,12,3,C.o2);p(4,1,14,2,C.o1);
  p(3,2,16,10,C.o1);p(4,3,14,9,C.o2);p(5,4,12,8,C.o3);p(6,5,10,6,C.o5);
  // Top square shape
  p(5,0,12,4,C.o2);p(6,1,10,3,C.o1);p(7,2,8,2,C.o3);

  // ── Brow + Eyes (dark slits, very orc-like) ──
  p(5,4,12,3,C.o2);// thick brow
  p(5,5,4,3,C.o3);p(13,5,4,3,C.o3);// eye pockets
  p(6,6,3,2,C.o4);p(14,6,3,2,C.o4);// dark pupils
  p(5,6,1,1,C.o3);p(13,6,1,1,C.o3);// brow shadow
  p(7,6,1,1,'#c8e070');p(15,6,1,1,'#c8e070');// iris glow

  // ── Nose (flat wide) ──
  p(9,7,4,3,C.o2);p(9,8,2,2,C.o1);p(11,8,2,2,C.o1);
  p(9,9,2,1,C.o4);p(11,9,2,1,C.o4);// nostrils

  // ── Jaw + Tusks ──
  p(6,10,10,3,C.o2);p(7,11,8,2,C.o4);
  p(7,10,2,5,'#ddeebb');p(13,10,2,5,'#ddeebb');// white tusks
  p(8,10,1,4,'#aabbaa');p(14,10,1,3,'#aabbaa');// tusk shadow

  // ── Neck ──
  p(8,12,6,3,C.o3);p(9,13,4,2,C.o2);

  // ── Backpack on back left (image 2) ──
  p(0,10,4,13,C.o2);p(0,11,4,12,C.o3);p(1,10,3,2,C.o1);

  // ── Massive Shoulders ──
  p(0,11,5,6,C.o1);p(0,12,5,5,C.o2);p(1,11,4,2,C.o3);p(0,16,5,1,C.o4);
  p(17,11,5,6,C.o1);p(17,12,5,5,C.o2);p(17,11,4,2,C.o3);p(17,16,5,1,C.o4);

  // ── Leather vest / chest armor ──
  p(4,13,14,11,C.ol);p(5,14,12,10,C.ol2);p(6,15,10,8,C.ol3);
  // Leather straps (crossing diagonally)
  p(5,13,2,11,C.ol2);p(15,13,2,11,C.ol2);
  p(7,13,8,1,C.ol2);// collar strap
  p(5,17,12,1,C.ol2);// horizontal center strap
  // Chest detail
  p(8,15,6,7,C.ol3);p(9,16,4,5,C.ol);

  // ── ORANGE BELT (most important feature from image 2) ──
  p(4,23,14,3,C.oo);p(5,23,12,3,C.oo2);p(4,23,14,1,C.oo3);p(4,25,14,1,C.oo3);
  // SILVER BUCKLE (rectangular, centered)
  p(9,23,4,3,C.om2);p(9,23,4,1,C.om3);// buckle frame
  p(10,24,2,1,C.om);// buckle bar
  p(9,25,4,1,C.om2);
  // Belt rivets
  p(6,23,1,3,C.oo3);p(15,23,1,3,C.oo3);

  // ── Lower torso ──
  p(5,25,12,5,C.o1);p(6,26,10,4,C.o2);p(7,27,8,3,C.o3);

  // ── Arms ──
  p(0,16,5,8,C.o2);p(0,17,5,8,C.o1);p(1,18,4,7,C.o3);// L upper
  p(-2,23,6,5,C.o1);p(-1,24,5,4,C.o2);p(-1,23,5,1,C.o3);// L fist
  p(-2,26,4,2,C.o3);p(-1,27,3,1,C.o4);// L knuckles
  p(17,16+aR,5,8,C.o2);p(17,17+aR,5,8,C.o1);p(17,18+aR,4,7,C.o3);
  p(18,23+aR,6,5,C.o1);p(18,24+aR,5,4,C.o2);p(18,23+aR,5,1,C.o3);
  p(18,26+aR,4,2,C.o3);p(19,27+aR,3,1,C.o4);

  // ── Legs ──
  p(6,29+lL,5,8,C.o1);p(7,30+lL,3,8,C.o2);p(7,29+lL,3,2,C.o3);
  p(5,35+lL,7,4,C.ol);p(5,37+lL,8,2,C.ol2);// boot L
  p(11,29+lR,5,8,C.o1);p(12,30+lR,3,8,C.o2);p(12,29+lR,3,2,C.o3);
  p(10,35+lR,7,4,C.ol);p(10,37+lR,8,2,C.ol2);// boot R
}


// ──────────────────────────────────────────────────────────────
// BAT  20×14 grid · sc=2 → 40×28px
// Image 1: near-black angular wings, BRIGHT YELLOW eyes, pointed ears
// ──────────────────────────────────────────────────────────────
function drawBat(cx,x,y,frame){
  const sc=2;
  const p=(px,py,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(x+px*sc,y+py*sc,w*sc,h*sc);
  };
  const up=frame%18<9; const wy=up?-1:1;

  // ── LEFT WING (angular, jagged tips from image 1) ──
  // Outermost tip
  p(0,3+wy,1,5,C.b1);p(0,4+wy,2,4,C.b2);
  // Second finger
  p(1,1+wy,2,3,C.b1);p(1,2+wy,3,5,C.b2);
  // Third finger (longest)
  p(2,0+wy,2,2,C.b1);p(2,1+wy,4,5,C.b2);p(3,1+wy,3,5,C.b3);
  // Wing membrane (dark fill between fingers)
  p(0,5+wy,5,3,C.b1);p(1,4+wy,4,3,C.b2);p(2,3+wy,3,3,C.b3);
  // Bottom wing edge
  p(0,6+wy,6,2,C.b1);p(1,7+wy,5,1,C.b4);
  // Wing finger bones
  p(0,3+wy,1,5,C.b4);p(2,1+wy,1,5,C.b4);p(4,2+wy,1,4,C.b4);
  // Wing-body connection
  p(6,4+wy,2,3,C.b2);p(5,5+wy,2,2,C.b3);

  // ── RIGHT WING (mirror) ──
  p(19,3-wy,1,5,C.b1);p(18,4-wy,2,4,C.b2);
  p(17,1-wy,2,3,C.b1);p(16,2-wy,3,5,C.b2);
  p(16,0-wy,2,2,C.b1);p(14,1-wy,4,5,C.b2);p(14,1-wy,3,5,C.b3);
  p(14,5-wy,5,3,C.b1);p(15,4-wy,4,3,C.b2);p(15,3-wy,3,3,C.b3);
  p(14,6-wy,6,2,C.b1);p(14,7-wy,5,1,C.b4);
  p(19,3-wy,1,5,C.b4);p(17,1-wy,1,5,C.b4);p(15,2-wy,1,4,C.b4);
  p(12,4-wy,2,3,C.b2);p(13,5-wy,2,2,C.b3);

  // ── BODY (central oval, dark) ──
  p(7,4,6,8,C.b2);p(8,5,4,7,C.b1);p(8,5,4,6,C.b3);
  p(9,5,2,4,C.b5);// center highlight

  // ── HEAD ──
  p(7,1,6,5,C.b2);p(8,2,4,4,C.b1);p(9,2,2,3,C.b3);
  // EARS — very pointy, prominent
  p(7,0,3,3,C.b1);p(7,0,2,2,C.b2);p(8,0,1,1,C.b3);// L ear
  p(10,0,3,3,C.b1);p(11,0,2,2,C.b2);p(11,0,1,1,C.b3);// R ear
  // Ear inner tiny detail
  p(8,1,1,1,C.b4);p(11,1,1,1,C.b4);

  // ── FACE ──
  // BRIGHT YELLOW EYES (the most distinctive feature from image 1)
  p(8,2,3,3,C.by);p(11,2,3,3,C.by);// outer yellow
  p(8,2,2,2,C.by2);p(12,2,2,2,C.by2);// mid yellow
  p(9,2,1,1,C.by3);p(12,2,1,1,C.by3);// inner bright
  p(8,3,3,1,'#000000');p(11,3,3,1,'#000000');// horizontal pupil slit
  p(8,2,1,1,'#ffff99');p(11,2,1,1,'#ffff99');// shine
  // Nose
  p(9,4,2,1,C.b2);p(9,5,2,1,C.b3);
  // Mouth + fangs
  p(8,5,4,1,C.b3);p(9,6,2,1,C.b4);
  p(8,5,1,2,'#e0f0ff');p(11,5,1,2,'#e0f0ff');// fangs

  // ── FEET (clinging claws) ──
  p(8,11,2,2,C.b1);p(10,11,2,2,C.b1);
  p(7,12,2,1,C.b4);p(11,12,2,1,C.b4);
  // Tail
  p(9,11,2,4,C.b2);p(8,14,4,1,C.b4);
}


function drawDragon(cx,x,y,flip,frame){
  // Hắc Long Vương — original dark dragon pixel art
  // Grid 64x56, sc=2.5 => ~160x140px
  const sc=2.5;
  const GW=64;
  const breathe=Math.round(Math.sin(frame*0.04)*1);
  const d=(px,py,w,h,col)=>{
    if(!col)return;
    cx.fillStyle=col;
    const rx=flip?x+(GW-px-w)*sc:x+px*sc;
    cx.fillRect(rx,y+py*sc+breathe,w*sc,h*sc);
  };
  // BODY (black silhouette)
  d(20,0,4,1,'#111');d(27,0,1,1,'#111');d(29,0,2,1,'#111');d(33,0,2,1,'#111');d(36,0,3,1,'#111');d(40,0,4,1,'#111');
  d(20,1,4,1,'#111');d(27,1,1,1,'#111');d(29,1,2,1,'#111');d(33,1,2,1,'#111');d(36,1,3,1,'#111');d(40,1,4,1,'#111');
  d(17,2,11,1,'#111');d(29,2,2,1,'#111');d(32,2,3,1,'#111');d(37,2,11,1,'#111');
  d(13,3,14,1,'#111');d(29,3,8,1,'#111');d(40,3,11,1,'#111');
  d(13,4,14,1,'#111');d(29,4,8,1,'#111');d(40,4,11,1,'#111');
  d(11,5,14,1,'#111');d(28,5,9,1,'#111');d(41,5,12,1,'#111');
  d(8,6,16,1,'#111');d(29,6,7,1,'#111');d(43,6,12,1,'#111');
  d(8,7,16,1,'#111');d(29,7,7,1,'#111');d(43,7,12,1,'#111');
  d(7,8,17,1,'#111');d(29,8,3,1,'#111');d(33,8,3,1,'#111');d(43,8,13,1,'#111');
  d(7,9,17,1,'#111');d(29,9,3,1,'#111');d(33,9,3,1,'#111');d(43,9,13,1,'#111');
  d(5,10,19,1,'#111');d(28,10,9,1,'#111');d(43,10,14,1,'#111');
  d(4,11,20,1,'#111');d(28,11,11,1,'#111');d(41,11,18,1,'#111');
  d(4,12,20,1,'#111');d(28,12,11,1,'#111');d(41,12,18,1,'#111');
  d(3,13,22,1,'#111');d(28,13,3,1,'#111');d(33,13,6,1,'#111');d(41,13,19,1,'#111');
  d(1,14,26,1,'#111');d(32,14,7,1,'#111');d(40,14,21,1,'#111');
  d(1,15,26,1,'#111');d(32,15,7,1,'#111');d(40,15,21,1,'#111');
  d(1,16,36,1,'#111');d(39,16,22,1,'#111');
  d(1,17,36,1,'#111');d(39,17,22,1,'#111');
  d(0,18,63,3,'#111');
  d(0,21,1,1,'#111');d(3,21,10,1,'#111');d(16,21,31,1,'#111');d(49,21,15,1,'#111');
  d(3,22,10,1,'#111');d(17,22,4,1,'#111');d(24,22,16,1,'#111');d(43,22,2,1,'#111');d(49,22,11,1,'#111');d(63,22,1,1,'#111');
  d(3,23,10,1,'#111');d(17,23,4,1,'#111');d(24,23,16,1,'#111');d(43,23,2,1,'#111');d(49,23,11,1,'#111');d(63,23,1,1,'#111');
  d(3,24,10,1,'#111');d(19,24,1,1,'#111');d(24,24,15,1,'#111');d(43,24,1,1,'#111');d(49,24,11,1,'#111');
  d(3,25,10,1,'#111');d(19,25,1,1,'#111');d(24,25,15,1,'#111');d(43,25,1,1,'#111');d(49,25,11,1,'#111');
  d(3,26,10,1,'#111');d(24,26,3,1,'#111');d(28,26,9,1,'#111');d(49,26,11,1,'#111');
  d(4,27,9,1,'#111');d(24,27,1,1,'#111');d(28,27,7,1,'#111');d(49,27,11,1,'#111');
  d(4,28,9,1,'#111');d(24,28,1,1,'#111');d(28,28,7,1,'#111');d(49,28,11,1,'#111');
  d(4,29,3,1,'#111');d(8,29,5,1,'#111');d(28,29,8,1,'#111');d(49,29,11,1,'#111');
  d(4,30,1,1,'#111');d(9,30,6,1,'#111');d(27,30,9,1,'#111');d(48,30,5,1,'#111');d(56,30,4,1,'#111');
  d(4,31,1,1,'#111');d(9,31,6,1,'#111');d(27,31,9,1,'#111');d(48,31,5,1,'#111');d(56,31,4,1,'#111');
  d(11,32,4,1,'#111');d(27,32,9,1,'#111');d(48,32,4,1,'#111');d(57,32,3,1,'#111');
  d(11,33,4,1,'#111');d(27,33,9,1,'#111');d(48,33,4,1,'#111');d(57,33,3,1,'#111');
  d(12,34,3,1,'#111');d(27,34,9,1,'#111');d(48,34,3,1,'#111');d(59,34,1,1,'#111');
  d(12,35,4,1,'#111');d(27,35,8,1,'#111');d(47,35,4,1,'#111');
  d(12,36,4,1,'#111');d(27,36,8,1,'#111');d(47,36,4,1,'#111');
  d(13,37,3,1,'#111');d(28,37,7,1,'#111');d(47,37,2,1,'#111');
  d(15,38,2,1,'#111');d(27,38,8,1,'#111');d(45,38,3,1,'#111');
  d(15,39,2,1,'#111');d(27,39,8,1,'#111');d(45,39,3,1,'#111');
  d(27,40,6,1,'#111');d(45,40,2,1,'#111');
  d(27,41,6,1,'#111');d(45,41,2,1,'#111');
  d(25,42,6,1,'#111');d(37,42,3,1,'#111');
  d(25,43,4,1,'#111');d(35,43,6,1,'#111');
  d(25,44,4,1,'#111');d(35,44,6,1,'#111');
  d(25,45,4,1,'#111');d(33,45,10,1,'#111');
  d(25,46,4,1,'#111');d(33,46,2,1,'#111');d(40,46,3,1,'#111');
  d(25,47,4,1,'#111');d(33,47,2,1,'#111');d(40,47,3,1,'#111');
  d(25,48,4,1,'#111');d(40,48,3,1,'#111');
  d(25,49,4,1,'#111');d(40,49,3,1,'#111');
  d(27,50,2,1,'#111');d(39,50,4,1,'#111');
  d(27,51,4,1,'#111');d(37,51,4,1,'#111');
  d(27,52,4,1,'#111');d(37,52,4,1,'#111');
  d(28,53,12,1,'#111');
  d(29,54,10,2,'#111');
  // RED EYE
  d(32,8,1,2,'#ff0000');
  // EYE GLOW
  const ex=flip?x+(GW-33)*sc:x+32*sc;
  const ey=y+8*sc+breathe;
  if(isFinite(ex)&&isFinite(ey)){
    cx.save();cx.globalCompositeOperation='lighter';
    const eg=cx.createRadialGradient(ex,ey,0,ex,ey,sc*4);
    eg.addColorStop(0,'rgba(255,30,0,0.9)');eg.addColorStop(1,'rgba(180,0,0,0)');
    cx.fillStyle=eg;cx.beginPath();cx.arc(ex,ey,sc*4,0,Math.PI*2);cx.fill();
    cx.restore();
  }
}

// ─────────────────────────────────────────────────────────────
// HỎA LONG VƯƠNG — Pixel art y hệt ảnh gốc (lửa đỏ cam)
// Grid 34×28 cells, sc=4 => 136×112px, faces LEFT, phun lửa
// ─────────────────────────────────────────────────────────────
function drawFireDragon(cx,x,y,flip,frame){
  // HỎA LONG VƯƠNG — sc=3, quay TRÁI, đứng im
  const sc=3;
  const GW=59;
  const bob=0; // đứng im tuyệt đối
  // flip=true → quay trái: gx thực = GW-gx-w
  const p=(gx,gy,w,h,col)=>{
    if(!col||w<=0||h<=0)return;
    cx.fillStyle=col;
    const rx=flip?x+(GW-gx-w)*sc:x+gx*sc;
    cx.fillRect(rx, y+gy*sc+bob, w*sc, h*sc);
  };
  // Palette
  const K='#000000';
  const R1='#500000';const R2='#8c0000';const R3='#b90f0f';
  const R4='#dc1919';const R5='#ff3232';const R6='#ff6e6e';
  const G1='#2d323c';const G2='#556473';const G3='#8296a8';
  const G4='#afc3d4';const G5='#d2e1ee';
  const YE='#ffc800';const OR='#eb7300';const W='#ffffff';

  // row 0
  p(12,0,1,1,W);p(13,0,1,1,OR);p(14,0,1,1,G4);
  // row 1
  p(2,1,2,1,R6);p(7,1,1,1,R6);p(8,1,1,1,OR);p(9,1,1,1,R6);p(12,1,1,1,W);p(13,1,1,1,OR);p(14,1,1,1,YE);p(15,1,1,1,R6);
  // row 2
  p(2,2,2,1,OR);p(4,2,2,1,R6);p(6,2,1,1,W);p(7,2,1,1,R6);p(8,2,2,1,OR);p(10,2,1,1,R6);p(12,2,1,1,W);p(13,2,1,1,OR);p(14,2,1,1,YE);p(15,2,1,1,R6);
  // row 3
  p(2,3,1,1,R6);p(3,3,3,1,OR);p(6,3,1,1,R6);p(7,3,1,1,G4);p(8,3,1,1,R6);p(9,3,2,1,OR);p(12,3,1,1,W);p(13,3,1,1,OR);p(14,3,1,1,R6);p(15,3,1,1,G5);
  // row 4
  p(4,4,1,1,G4);p(5,4,2,1,OR);p(7,4,1,1,R6);p(8,4,1,1,G5);p(9,4,2,1,R6);p(11,4,1,1,G4);
  // row 5
  p(2,5,4,1,W);p(6,5,2,1,OR);p(8,5,1,1,YE);p(9,5,3,1,OR);p(14,5,3,1,W);
  // row 6
  p(2,6,1,1,R6);p(3,6,2,1,OR);p(5,6,1,1,W);p(6,6,2,1,OR);p(8,6,4,1,YE);p(14,6,1,1,R5);p(15,6,2,1,R6);
  // row 7
  p(2,7,2,1,R6);p(4,7,3,1,OR);p(7,7,5,1,YE);p(12,7,1,1,G5);p(13,7,1,1,W);p(14,7,1,1,R3);p(15,7,1,1,R4);p(16,7,1,1,R5);p(17,7,1,1,R6);p(52,7,1,1,R4);p(53,7,1,1,R3);
  // row 8
  p(3,8,2,1,R6);p(5,8,4,1,OR);p(9,8,3,1,YE);p(12,8,1,1,R6);p(13,8,1,1,W);p(14,8,1,1,R6);p(15,8,1,1,R3);p(16,8,1,1,R4);p(17,8,1,1,R5);p(18,8,2,1,R6);p(20,8,1,1,W);p(50,8,1,1,R4);p(51,8,2,1,R3);p(53,8,1,1,G2);
  // row 9
  p(4,9,1,1,G4);p(5,9,2,1,OR);p(7,9,1,1,R6);p(8,9,1,1,OR);p(9,9,3,1,YE);p(12,9,1,1,R6);p(13,9,1,1,W);p(15,9,2,1,R3);p(17,9,1,1,R4);p(18,9,2,1,R5);p(20,9,3,1,R6);p(23,9,1,1,G3);p(24,9,3,1,G2);p(46,9,1,1,R6);p(47,9,2,1,R3);p(49,9,1,1,R6);p(50,9,2,1,R3);p(52,9,2,1,G2);
  // row 10
  p(8,10,2,1,R6);p(10,10,3,1,G5);p(13,10,1,1,W);p(16,10,1,1,R6);p(17,10,1,1,R3);p(18,10,2,1,R4);p(20,10,1,1,R5);p(21,10,2,1,R6);p(23,10,1,1,R5);p(24,10,1,1,G2);p(25,10,2,1,G3);p(27,10,2,1,G2);p(29,10,1,1,G3);p(44,10,1,1,R6);p(45,10,2,1,R4);p(47,10,2,1,R3);p(49,10,1,1,R5);p(50,10,1,1,R4);p(51,10,2,1,G3);p(53,10,1,1,G2);
  // row 11
  p(13,11,3,1,R6);p(17,11,1,1,R6);p(18,11,1,1,R3);p(19,11,2,1,R4);p(21,11,1,1,G1);p(22,11,1,1,R3);p(23,11,1,1,R4);p(24,11,1,1,R5);p(25,11,2,1,G4);p(27,11,2,1,G2);p(29,11,2,1,G3);p(41,11,3,1,R6);p(44,11,1,1,R4);p(45,11,2,1,R3);p(47,11,2,1,R6);p(49,11,1,1,R3);p(50,11,1,1,G3);p(51,11,1,1,G4);p(52,11,1,1,G3);p(53,11,1,1,G2);p(54,11,1,1,G4);
  // row 12
  p(1,12,4,1,W);p(12,12,1,1,G5);p(13,12,1,1,R2);p(14,12,1,1,R4);p(15,12,1,1,R5);p(16,12,2,1,W);p(18,12,1,1,R6);p(19,12,2,1,R4);p(21,12,1,1,R6);p(22,12,1,1,G2);p(23,12,1,1,R3);p(24,12,2,1,R4);p(26,12,1,1,G4);p(27,12,2,1,G5);p(29,12,1,1,G3);p(30,12,1,1,G2);p(40,12,1,1,G5);p(41,12,3,1,R2);p(44,12,1,1,R4);p(45,12,2,1,R6);p(47,12,1,1,R4);p(48,12,1,1,R2);p(49,12,1,1,G4);p(50,12,1,1,G5);p(51,12,1,1,G4);p(52,12,1,1,G3);p(53,12,2,1,G2);
  // row 13
  p(0,13,1,1,W);p(1,13,2,1,YE);p(3,13,1,1,R6);p(4,13,1,1,G5);p(13,13,1,1,G4);p(14,13,1,1,R3);p(15,13,11,1,R4);p(26,13,4,1,G4);p(30,13,1,1,G3);p(31,13,1,1,G2);p(39,13,1,1,R6);p(40,13,1,1,R3);p(41,13,3,1,R6);p(44,13,1,1,R5);p(45,13,2,1,R4);p(47,13,1,1,R2);p(48,13,1,1,G4);p(49,13,3,1,G2);p(52,13,2,1,G3);p(54,13,1,1,G2);
  // row 14
  p(0,14,1,1,R6);p(1,14,2,1,OR);p(3,14,1,1,YE);p(4,14,1,1,G4);p(14,14,2,1,R6);p(16,14,1,1,R4);p(17,14,2,1,R3);p(19,14,1,1,R4);p(20,14,1,1,G4);p(21,14,1,1,G3);p(22,14,2,1,R4);p(24,14,2,1,R3);p(26,14,1,1,G4);p(27,14,1,1,G2);p(28,14,2,1,G4);p(30,14,2,1,G3);p(39,14,1,1,R6);p(40,14,1,1,R2);p(41,14,1,1,R6);p(42,14,1,1,R5);p(43,14,4,1,R4);p(47,14,1,1,R2);p(48,14,1,1,G5);p(49,14,3,1,G4);p(52,14,1,1,G3);p(53,14,1,1,G4);p(54,14,1,1,G3);p(55,14,1,1,G2);p(56,14,1,1,G3);
  // row 15
  p(0,15,1,1,R6);p(1,15,3,1,OR);p(4,15,1,1,G5);p(13,15,1,1,G2);p(14,15,1,1,G3);p(16,15,1,1,R6);p(17,15,1,1,R3);p(18,15,1,1,R4);p(19,15,1,1,R6);p(20,15,1,1,G3);p(21,15,1,1,G4);p(22,15,1,1,R6);p(23,15,1,1,R5);p(24,15,1,1,R4);p(25,15,2,1,R3);p(27,15,3,1,G3);p(38,15,1,1,R6);p(39,15,1,1,R3);p(40,15,1,1,R5);p(41,15,1,1,R6);p(42,15,5,1,R4);p(47,15,1,1,R3);p(48,15,3,1,R6);p(51,15,1,1,R4);p(52,15,3,1,R3);p(55,15,1,1,R2);p(56,15,1,1,G3);
  // row 16
  p(1,16,1,1,R6);p(2,16,1,1,OR);p(3,16,1,1,R6);p(9,16,3,1,G3);p(12,16,1,1,G2);p(13,16,2,1,G3);p(19,16,1,1,G5);p(20,16,1,1,G2);p(21,16,1,1,G3);p(22,16,1,1,G4);p(23,16,1,1,R6);p(24,16,2,1,R4);p(26,16,1,1,R2);p(27,16,4,1,G3);p(38,16,2,1,R3);p(40,16,2,1,R6);p(42,16,5,1,R4);p(47,16,5,1,R6);p(52,16,1,1,G2);p(53,16,3,1,R3);p(56,16,1,1,R6);
  // row 17
  p(8,17,1,1,G3);p(9,17,2,1,G2);p(11,17,1,1,G3);p(12,17,1,1,G2);p(13,17,2,1,G4);p(21,17,1,1,G2);p(22,17,1,1,G4);p(23,17,1,1,R6);p(24,17,2,1,R4);p(26,17,1,1,R2);p(27,17,1,1,G2);p(28,17,1,1,G4);p(29,17,3,1,G3);p(38,17,2,1,R3);p(40,17,2,1,R6);p(42,17,3,1,R4);p(45,17,1,1,R3);p(46,17,1,1,R6);p(47,17,1,1,G4);p(48,17,1,1,G5);p(49,17,3,1,G4);p(52,17,2,1,G3);p(54,17,1,1,G2);
  // row 18
  p(8,18,3,1,G2);p(11,18,1,1,G3);p(12,18,1,1,G2);p(13,18,2,1,G4);p(21,18,1,1,G2);p(22,18,2,1,G4);p(24,18,1,1,R6);p(25,18,1,1,R4);p(26,18,1,1,R2);p(27,18,1,1,G5);p(28,18,1,1,G2);p(29,18,1,1,G4);p(30,18,1,1,G3);p(31,18,1,1,G2);p(37,18,1,1,G4);p(38,18,2,1,R3);p(40,18,1,1,R6);p(41,18,3,1,R4);p(44,18,1,1,R3);p(45,18,1,1,R6);p(46,18,1,1,G4);p(47,18,1,1,G2);p(48,18,3,1,G4);p(51,18,1,1,G3);p(52,18,2,1,G2);
  // row 19
  p(8,19,1,1,G2);p(9,19,2,1,G3);p(11,19,1,1,G2);p(12,19,3,1,G4);p(22,19,1,1,G2);p(23,19,1,1,G3);p(24,19,1,1,R6);p(25,19,1,1,R4);p(26,19,1,1,R2);p(27,19,1,1,G5);p(37,19,1,1,R4);p(38,19,1,1,R2);p(39,19,1,1,R3);p(40,19,1,1,R6);p(41,19,2,1,R4);p(43,19,1,1,R3);p(44,19,1,1,R6);p(45,19,3,1,G5);p(48,19,1,1,G2);p(49,19,2,1,G3);p(51,19,1,1,G2);
  // row 20
  p(7,20,1,1,G2);p(8,20,1,1,G3);p(9,20,1,1,G4);p(10,20,1,1,G3);p(11,20,1,1,G2);p(12,20,2,1,R2);p(14,20,3,1,R3);p(22,20,3,1,G2);p(25,20,1,1,R4);p(26,20,1,1,R2);p(27,20,1,1,G5);p(37,20,2,1,R3);p(39,20,1,1,R6);p(40,20,3,1,R4);p(43,20,1,1,R3);p(44,20,1,1,R2);p(45,20,1,1,R6);p(46,20,3,1,G4);p(49,20,1,1,G2);p(50,20,1,1,G3);p(51,20,1,1,G4);
  // row 21
  p(7,21,1,1,G2);p(8,21,2,1,G3);p(10,21,2,1,R3);p(12,21,6,1,R6);p(18,21,1,1,R2);p(19,21,1,1,R3);p(20,21,1,1,G5);p(22,21,1,1,G2);p(23,21,1,1,G3);p(24,21,1,1,R6);p(25,21,1,1,R4);p(26,21,1,1,R2);p(27,21,1,1,G5);p(36,21,1,1,R4);p(37,21,2,1,R5);p(39,21,3,1,R4);p(42,21,1,1,R3);p(43,21,2,1,R6);p(45,21,1,1,R4);p(46,21,3,1,G4);p(49,21,2,1,G2);
  // row 22
  p(7,22,2,1,G2);p(9,22,1,1,R4);p(10,22,10,1,R5);p(20,22,2,1,R3);p(22,22,1,1,G3);p(23,22,1,1,G4);p(24,22,1,1,R6);p(25,22,1,1,R4);p(26,22,1,1,R2);p(27,22,1,1,G5);p(35,22,1,1,R3);p(36,22,2,1,R5);p(38,22,2,1,R4);p(40,22,1,1,R3);p(41,22,2,1,R6);p(43,22,2,1,G4);p(45,22,2,1,R6);p(47,22,1,1,G4);p(48,22,2,1,G3);p(50,22,1,1,G2);
  // row 23
  p(7,23,1,1,G2);p(8,23,1,1,R2);p(9,23,1,1,R3);p(10,23,2,1,R5);p(12,23,1,1,R4);p(13,23,1,1,R3);p(14,23,1,1,R5);p(15,23,4,1,R6);p(19,23,1,1,R5);p(20,23,2,1,R4);p(22,23,1,1,G3);p(23,23,1,1,G4);p(24,23,1,1,R6);p(25,23,1,1,R4);p(26,23,1,1,R2);p(27,23,1,1,G5);p(35,23,1,1,R5);p(36,23,1,1,R6);p(37,23,1,1,R5);p(38,23,1,1,R4);p(39,23,1,1,R3);p(40,23,1,1,R6);p(41,23,2,1,G5);p(43,23,2,1,G4);p(45,23,1,1,G3);p(46,23,1,1,R3);p(47,23,2,1,G2);p(49,23,1,1,G3);
  // row 24
  p(7,24,1,1,R3);p(8,24,1,1,G1);p(9,24,1,1,G2);p(10,24,1,1,R3);p(11,24,1,1,R4);p(12,24,1,1,R3);p(13,24,1,1,R2);p(14,24,2,1,G4);p(16,24,3,1,G3);p(19,24,1,1,R4);p(20,24,2,1,R6);p(22,24,2,1,G3);p(24,24,1,1,R6);p(25,24,1,1,R4);p(26,24,1,1,R2);p(27,24,2,1,R6);p(34,24,1,1,R4);p(35,24,2,1,R6);p(37,24,1,1,R5);p(38,24,1,1,R4);p(39,24,1,1,R6);p(40,24,1,1,G4);p(41,24,1,1,G5);p(42,24,3,1,G4);p(45,24,1,1,G3);p(46,24,2,1,R3);p(48,24,1,1,G2);p(49,24,1,1,G3);
  // row 25
  p(7,25,1,1,R3);p(8,25,1,1,R2);p(9,25,1,1,G2);p(10,25,1,1,R6);p(11,25,1,1,R4);p(12,25,1,1,R2);p(13,25,1,1,R3);p(14,25,1,1,R6);p(15,25,4,1,G2);p(19,25,2,1,G3);p(21,25,2,1,G4);p(23,25,1,1,G3);p(24,25,1,1,G2);p(25,25,1,1,R4);p(26,25,2,1,R2);p(28,25,1,1,R6);p(29,25,1,1,G4);p(33,25,1,1,G5);p(34,25,1,1,R2);p(35,25,1,1,R6);p(36,25,1,1,R5);p(37,25,1,1,R4);p(38,25,1,1,R5);p(39,25,1,1,G4);p(40,25,1,1,G2);p(41,25,7,1,G4);p(48,25,1,1,R3);p(49,25,1,1,R6);
  // row 26
  p(6,26,1,1,W);p(7,26,1,1,R6);p(8,26,1,1,R5);p(9,26,1,1,R4);p(10,26,1,1,R3);p(11,26,2,1,R2);p(13,26,1,1,G5);p(16,26,5,1,G2);p(21,26,1,1,G4);p(22,26,2,1,G3);p(24,26,1,1,R6);p(25,26,2,1,R4);p(27,26,2,1,R2);p(29,26,1,1,R5);p(33,26,1,1,G5);p(34,26,1,1,R2);p(35,26,1,1,R6);p(36,26,1,1,R5);p(37,26,1,1,R3);p(38,26,1,1,R4);p(39,26,2,1,G5);p(41,26,1,1,G2);p(42,26,3,1,G4);p(45,26,1,1,G3);p(46,26,1,1,G2);p(47,26,1,1,G4);
  // row 27
  p(5,27,1,1,W);p(6,27,1,1,R3);p(7,27,1,1,R6);p(8,27,1,1,R5);p(9,27,1,1,R4);p(10,27,2,1,R3);p(12,27,1,1,G4);p(15,27,1,1,G2);p(16,27,1,1,G3);p(17,27,1,1,G4);p(18,27,1,1,G3);p(19,27,3,1,G2);p(22,27,3,1,G4);p(25,27,1,1,G3);p(26,27,2,1,R4);p(28,27,3,1,R3);p(31,27,1,1,R4);p(32,27,2,1,R3);p(34,27,1,1,R6);p(35,27,2,1,R4);p(37,27,1,1,R3);p(38,27,1,1,R4);p(39,27,2,1,G5);p(41,27,1,1,G4);p(42,27,3,1,G3);p(45,27,1,1,G2);p(46,27,1,1,G3);p(47,27,1,1,G4);p(48,27,3,1,G2);
  // row 28
  p(5,28,1,1,W);p(6,28,1,1,R6);p(7,28,2,1,R4);p(9,28,3,1,R3);p(15,28,1,1,G2);p(16,28,1,1,G3);p(17,28,1,1,G4);p(18,28,4,1,G2);p(22,28,4,1,G4);p(26,28,1,1,R6);p(27,28,2,1,R4);p(29,28,2,1,R3);p(31,28,1,1,R4);p(32,28,2,1,R6);p(34,28,3,1,R4);p(37,28,1,1,R3);p(38,28,1,1,R4);p(39,28,3,1,G4);p(42,28,4,1,G3);p(47,28,1,1,G5);p(48,28,1,1,G2);p(49,28,1,1,G4);p(50,28,1,1,G3);p(51,28,2,1,G2);
  // row 29
  p(4,29,1,1,G4);p(5,29,1,1,R6);p(6,29,1,1,R5);p(7,29,1,1,R4);p(8,29,3,1,R3);p(11,29,1,1,R4);p(15,29,2,1,G2);p(17,29,1,1,R3);p(18,29,2,1,R2);p(20,29,3,1,G3);p(23,29,2,1,G4);p(25,29,1,1,G3);p(26,29,1,1,R6);p(27,29,2,1,R4);p(29,29,2,1,R3);p(31,29,1,1,R4);p(32,29,2,1,R5);p(34,29,3,1,R4);p(37,29,1,1,R3);p(38,29,1,1,R4);p(39,29,3,1,G4);p(42,29,3,1,G3);p(47,29,1,1,G5);p(48,29,1,1,G2);p(49,29,4,1,G3);p(53,29,1,1,R3);
  // row 30
  p(4,30,2,1,R6);p(6,30,1,1,R4);p(7,30,4,1,R3);p(14,30,1,1,R6);p(15,30,2,1,R3);p(17,30,3,1,R4);p(20,30,1,1,R6);p(21,30,1,1,G4);p(22,30,4,1,G3);p(26,30,1,1,R6);p(27,30,10,1,R4);p(37,30,1,1,R3);p(38,30,1,1,R4);p(39,30,2,1,G4);p(41,30,3,1,G3);p(49,30,1,1,G2);p(50,30,1,1,G3);p(51,30,1,1,G4);p(52,30,1,1,R6);p(53,30,3,1,R3);p(56,30,1,1,R6);
  // row 31
  p(4,31,1,1,G4);p(5,31,1,1,R6);p(6,31,1,1,R4);p(7,31,1,1,R3);p(8,31,1,1,R6);p(9,31,2,1,R3);p(14,31,2,1,R3);p(16,31,1,1,R4);p(17,31,3,1,R6);p(20,31,1,1,R3);p(21,31,1,1,R6);p(22,31,1,1,G3);p(23,31,1,1,G2);p(24,31,1,1,G3);p(25,31,1,1,G4);p(26,31,1,1,R6);p(27,31,10,1,R4);p(37,31,2,1,R3);p(39,31,2,1,G4);p(41,31,1,1,G2);p(42,31,1,1,G3);p(50,31,1,1,G2);p(51,31,1,1,G3);p(52,31,1,1,R6);p(53,31,1,1,R4);p(54,31,2,1,R3);p(56,31,2,1,R6);
  // row 32
  p(8,32,3,1,R3);p(13,32,1,1,R6);p(14,32,1,1,R3);p(15,32,1,1,R5);p(16,32,1,1,G2);p(17,32,1,1,R2);p(18,32,2,1,R4);p(20,32,1,1,R6);p(21,32,1,1,R3);p(22,32,1,1,G2);p(23,32,1,1,G3);p(24,32,2,1,G4);p(26,32,1,1,R6);p(27,32,10,1,R4);p(37,32,2,1,R3);p(39,32,1,1,G3);p(40,32,1,1,G4);p(41,32,1,1,G2);p(42,32,1,1,G3);p(51,32,1,1,R3);p(52,32,1,1,R4);p(53,32,1,1,R6);p(54,32,2,1,R4);p(56,32,1,1,R3);p(57,32,1,1,R5);p(58,32,1,1,R6);
  // row 33
  p(8,33,2,1,R3);p(12,33,1,1,W);p(13,33,1,1,R2);p(14,33,1,1,R6);p(15,33,1,1,G2);p(16,33,1,1,G3);p(17,33,1,1,R6);p(18,33,3,1,R4);p(21,33,1,1,R6);p(22,33,1,1,G2);p(23,33,1,1,G3);p(24,33,2,1,G4);p(26,33,1,1,R6);p(27,33,10,1,R4);p(37,33,1,1,R3);p(38,33,1,1,R2);p(39,33,1,1,R3);p(40,33,1,1,G4);p(41,33,1,1,G2);p(42,33,1,1,G3);p(52,33,1,1,R6);p(53,33,1,1,R3);p(54,33,1,1,R6);p(55,33,2,1,R4);p(57,33,2,1,R3);
  // row 34
  p(8,34,2,1,G4);p(12,34,1,1,G5);p(13,34,1,1,R2);p(14,34,1,1,R6);p(15,34,4,1,R4);p(19,34,2,1,R2);p(21,34,5,1,G4);p(26,34,2,1,R6);p(28,34,12,1,R4);p(40,34,2,1,R2);p(42,34,1,1,R3);p(43,34,1,1,R5);p(52,34,1,1,G4);p(53,34,1,1,R6);p(54,34,1,1,R3);p(55,34,1,1,R6);p(56,34,1,1,R4);p(57,34,2,1,R3);
  // row 35
  p(12,35,1,1,G5);p(13,35,1,1,R2);p(14,35,1,1,R6);p(15,35,1,1,R5);p(16,35,2,1,R4);p(18,35,1,1,R3);p(19,35,1,1,R6);p(20,35,2,1,G2);p(22,35,2,1,G4);p(24,35,2,1,G3);p(26,35,1,1,G4);p(27,35,1,1,R6);p(28,35,15,1,R4);p(43,35,1,1,R3);p(44,35,2,1,R2);p(46,35,1,1,R3);p(53,35,1,1,R6);p(54,35,1,1,R2);p(55,35,1,1,R6);p(56,35,2,1,R4);p(58,35,1,1,R3);
  // row 36
  p(11,36,1,1,R6);p(12,36,1,1,R3);p(13,36,2,1,R5);p(15,36,1,1,R4);p(16,36,2,1,R3);p(18,36,1,1,R4);p(19,36,1,1,W);p(20,36,2,1,G2);p(22,36,3,1,G3);p(25,36,2,1,G4);p(27,36,1,1,R6);p(28,36,16,1,R4);p(44,36,4,1,R3);p(48,36,1,1,W);p(53,36,1,1,R6);p(54,36,1,1,R2);p(55,36,1,1,R6);p(56,36,2,1,R4);p(58,36,1,1,R3);
  // row 37
  p(11,37,1,1,R3);p(12,37,1,1,R2);p(13,37,1,1,R6);p(14,37,1,1,R4);p(15,37,3,1,R3);p(20,37,1,1,G2);p(21,37,4,1,G3);p(25,37,2,1,G4);p(27,37,1,1,R6);p(28,37,19,1,R4);p(47,37,1,1,R3);p(48,37,1,1,R4);p(49,37,1,1,R6);p(53,37,1,1,R6);p(54,37,1,1,R3);p(55,37,2,1,R5);p(57,37,1,1,R4);p(58,37,1,1,R3);
  // row 38
  p(11,38,1,1,R3);p(12,38,1,1,R2);p(13,38,1,1,R5);p(14,38,1,1,R4);p(15,38,1,1,R3);p(16,38,1,1,R4);p(20,38,1,1,G2);p(21,38,5,1,G4);p(26,38,1,1,G3);p(27,38,1,1,R6);p(28,38,1,1,R5);p(29,38,19,1,R4);p(48,38,1,1,R2);p(49,38,1,1,R3);p(54,38,1,1,R6);p(55,38,1,1,R2);p(56,38,1,1,R6);p(57,38,1,1,R4);p(58,38,1,1,R3);
  // row 39
  p(11,39,1,1,R6);p(12,39,3,1,R3);p(15,39,1,1,R4);p(19,39,1,1,G5);p(20,39,1,1,G2);p(21,39,4,1,G4);p(25,39,1,1,G3);p(26,39,1,1,G2);p(27,39,2,1,R6);p(29,39,2,1,R4);p(31,39,2,1,R3);p(33,39,5,1,R4);p(38,39,7,1,R3);p(45,39,3,1,R4);p(48,39,1,1,R2);p(49,39,1,1,R3);p(54,39,1,1,R6);p(55,39,1,1,R2);p(56,39,1,1,R6);p(57,39,1,1,R4);p(58,39,1,1,R3);
  // row 40
  p(21,40,5,1,G2);p(26,40,1,1,G5);p(27,40,2,1,R6);p(29,40,2,1,R4);p(31,40,2,1,R3);p(33,40,3,1,R4);p(36,40,1,1,R3);p(37,40,1,1,R2);p(38,40,1,1,R3);p(39,40,5,1,R6);p(44,40,1,1,R4);p(45,40,1,1,R3);p(46,40,2,1,R4);p(48,40,1,1,R2);p(49,40,1,1,R6);p(54,40,1,1,G4);p(55,40,1,1,R2);p(56,40,1,1,R6);p(57,40,1,1,R4);p(58,40,1,1,R3);
  // row 41
  p(21,41,1,1,G2);p(22,41,1,1,G3);p(23,41,4,1,G4);p(27,41,1,1,R6);p(28,41,3,1,R4);p(31,41,2,1,R3);p(33,41,2,1,R4);p(35,41,1,1,R3);p(36,41,1,1,R2);p(37,41,1,1,R4);p(38,41,4,1,R6);p(42,41,2,1,R4);p(44,41,2,1,R5);p(46,41,1,1,R3);p(47,41,1,1,R4);p(48,41,1,1,R2);p(49,41,1,1,R3);p(50,41,1,1,R4);p(54,41,1,1,G4);p(55,41,1,1,R2);p(56,41,1,1,R6);p(57,41,1,1,R4);p(58,41,1,1,R3);
  // row 42
  p(21,42,3,1,G3);p(24,42,3,1,G4);p(27,42,2,1,R6);p(29,42,1,1,R4);p(30,42,3,1,R3);p(33,42,2,1,R4);p(35,42,1,1,R3);p(36,42,1,1,R4);p(37,42,2,1,R6);p(39,42,6,1,R4);p(45,42,2,1,R5);p(47,42,1,1,R3);p(48,42,1,1,R4);p(49,42,1,1,R2);p(50,42,1,1,R3);p(53,42,1,1,R6);p(54,42,1,1,R3);p(55,42,1,1,R2);p(56,42,1,1,R6);p(57,42,1,1,R4);p(58,42,1,1,R3);
  // row 43
  p(22,43,3,1,G3);p(25,43,2,1,G4);p(27,43,2,1,R6);p(29,43,1,1,R4);p(30,43,1,1,R3);p(31,43,2,1,R2);p(33,43,2,1,R3);p(35,43,1,1,R2);p(36,43,2,1,R5);p(38,43,7,1,R4);p(45,43,1,1,R5);p(46,43,1,1,R6);p(47,43,1,1,R2);p(48,43,1,1,R4);p(49,43,1,1,R3);p(50,43,1,1,R4);p(53,43,1,1,R6);p(54,43,3,1,R5);p(57,43,1,1,R4);p(58,43,1,1,R3);
  // row 44
  p(23,44,1,1,G2);p(24,44,3,1,G3);p(27,44,1,1,R6);p(28,44,1,1,R5);p(29,44,1,1,R4);p(30,44,1,1,R3);p(31,44,1,1,R2);p(32,44,3,1,R3);p(35,44,1,1,R2);p(36,44,2,1,R5);p(38,44,7,1,R4);p(45,44,1,1,R5);p(46,44,1,1,R6);p(47,44,1,1,R2);p(48,44,1,1,R3);p(49,44,1,1,R2);p(50,44,1,1,R3);p(51,44,1,1,R6);p(52,44,1,1,R3);p(53,44,1,1,R5);p(54,44,2,1,R6);p(56,44,1,1,R4);p(57,44,2,1,R3);
  // row 45
  p(24,45,1,1,G3);p(25,45,2,1,G2);p(27,45,1,1,R6);p(28,45,2,1,R4);p(30,45,2,1,R3);p(32,45,1,1,R4);p(33,45,2,1,G4);p(35,45,1,1,R3);p(36,45,2,1,R5);p(38,45,8,1,R4);p(46,45,1,1,R5);p(47,45,1,1,R3);p(48,45,2,1,R2);p(50,45,1,1,R3);p(51,45,1,1,R4);p(52,45,1,1,R3);p(53,45,1,1,R4);p(54,45,2,1,R6);p(56,45,1,1,R4);p(57,45,2,1,R3);
  // row 46
  p(26,46,1,1,G5);p(27,46,1,1,R2);p(28,46,1,1,R6);p(29,46,1,1,R4);p(30,46,2,1,R3);p(32,46,3,1,G4);p(35,46,1,1,R3);p(36,46,2,1,R5);p(38,46,10,1,R4);p(48,46,3,1,R2);p(51,46,1,1,R4);p(52,46,3,1,R6);p(55,46,2,1,R4);p(57,46,2,1,R3);
  // row 47
  p(26,47,1,1,G5);p(27,47,1,1,R2);p(28,47,1,1,R6);p(29,47,1,1,R4);p(30,47,1,1,R3);p(31,47,1,1,R2);p(32,47,3,1,G2);p(35,47,1,1,R2);p(36,47,2,1,R5);p(38,47,10,1,R4);p(48,47,3,1,R2);p(51,47,1,1,R4);p(52,47,3,1,R6);p(55,47,2,1,R4);p(57,47,2,1,R3);
  // row 48
  p(26,48,1,1,G5);p(27,48,1,1,R2);p(28,48,1,1,R6);p(29,48,1,1,R4);p(30,48,2,1,R3);p(32,48,3,1,G3);p(35,48,1,1,R3);p(36,48,2,1,R5);p(38,48,10,1,R4);p(48,48,1,1,R2);p(49,48,5,1,R6);p(54,48,2,1,R4);p(56,48,1,1,R3);p(57,48,1,1,R6);p(58,48,1,1,G3);
  // row 49
  p(27,49,2,1,R3);p(29,49,1,1,R4);p(30,49,2,1,R3);p(35,49,1,1,R6);p(36,49,1,1,R4);p(37,49,2,1,R5);p(39,49,8,1,R4);p(47,49,1,1,R3);p(48,49,3,1,R6);p(51,49,1,1,R5);p(52,49,3,1,R4);p(55,49,1,1,R3);p(56,49,1,1,R4);p(57,49,1,1,G3);
  // row 50
  p(28,50,4,1,R3);p(36,50,1,1,R5);p(37,50,2,1,R4);p(39,50,2,1,R5);p(41,50,6,1,R4);p(47,50,1,1,R3);p(48,50,3,1,R5);p(51,50,3,1,R4);p(54,50,1,1,R3);p(55,50,1,1,R4);p(56,50,1,1,R6);
  // row 51
  p(28,51,4,1,R3);p(37,51,2,1,R3);p(39,51,3,1,R5);p(42,51,5,1,R4);p(47,51,7,1,R3);p(54,51,1,1,R2);p(55,51,1,1,W);
  // row 52
  p(24,52,2,1,G5);p(26,52,2,1,G4);p(28,52,3,1,R3);p(31,52,1,1,R4);p(32,52,1,1,G4);p(33,52,1,1,G5);p(37,52,3,1,R3);p(40,52,1,1,R2);p(41,52,1,1,R6);p(42,52,4,1,R4);p(46,52,1,1,R3);p(47,52,2,1,R2);p(49,52,6,1,R3);p(55,52,1,1,W);
  // row 53
  p(23,53,1,1,G3);p(24,53,4,1,G4);p(28,53,2,1,R3);p(30,53,1,1,G2);p(31,53,3,1,G4);p(34,53,1,1,G3);p(39,53,1,1,G3);p(40,53,9,1,R3);p(49,53,1,1,R6);
  // row 54
  p(23,54,1,1,G3);p(24,54,3,1,G2);p(27,54,1,1,G5);p(28,54,3,1,G4);p(31,54,1,1,G3);p(32,54,3,1,G2);p(35,54,1,1,G3);p(38,54,1,1,G5);p(39,54,7,1,G4);p(49,54,1,1,W);
  // row 55
  p(23,55,3,1,G3);p(26,55,1,1,G4);p(27,55,1,1,G2);p(28,55,1,1,G3);p(29,55,2,1,G4);p(31,55,4,1,G3);p(37,55,1,1,G3);p(38,55,1,1,G2);p(39,55,1,1,G3);p(40,55,1,1,G4);p(41,55,2,1,G2);p(43,55,1,1,G3);p(44,55,2,1,G4);
  // row 56
  p(25,56,1,1,G3);p(26,56,1,1,G2);p(27,56,2,1,G3);p(37,56,3,1,G3);p(41,56,3,1,G3);

  // Eye glow — tính đúng vị trí theo flip
  const eyeX=flip?x+(GW-15)*sc:x+14*sc;
  const eyeY=y+13*sc;
  if(isFinite(eyeX)&&isFinite(eyeY)){
    cx.save();cx.globalCompositeOperation='lighter';
    const eg=cx.createRadialGradient(eyeX,eyeY,0,eyeX,eyeY,sc*3);
    eg.addColorStop(0,'rgba(255,200,0,0.9)');
    eg.addColorStop(0.5,'rgba(255,100,0,0.4)');
    eg.addColorStop(1,'rgba(200,0,0,0)');
    cx.fillStyle=eg;cx.beginPath();cx.arc(eyeX,eyeY,sc*3,0,Math.PI*2);cx.fill();
    cx.restore();
  }
}

