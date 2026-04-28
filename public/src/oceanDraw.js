// ── OCEAN MONSTERS ─────────────────────────────────────────
function drawSeaCrab(cx,x,y,frame,sc){
  sc=sc||2;cx.save();cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;
    cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));
  };
  // Palette
  const K ='#1a0000'; // outline dark
  const R1='#771100'; // darkest red-orange
  const R2='#aa2200'; // dark shell
  const R3='#cc3300'; // mid shell
  const R4='#ee5522'; // bright shell
  const R5='#ff7744'; // highlight
  const R6='#ffaa88'; // sheen
  const B1='#cc1100'; // claw dark
  const B2='#dd2200'; // claw mid
  const B3='#ff3311'; // claw bright
  const U ='#ff9966'; // belly
  const U2='#ffbb88'; // belly light
  const E ='#1133cc'; // eye blue
  const EL='#4466ff'; // eye light
  const EW='#ffffff'; // eye white
  const S ='#ff4422'; // spike

  const bob=Math.round(Math.sin(frame*0.18)*1.5);
  const clap=Math.sin(frame*0.14)*2.5; // claw animation

  // ── LEGS (6 legs, 3 per side, behind body) ─────────────────
  // Left legs
  p(-14, 6+bob, 4,2,R2); p(-16, 8+bob, 3,2,R1); p(-18,10+bob, 3,2,K);  // leg 1
  p(-13, 8+bob, 4,2,R2); p(-15,10+bob, 3,2,R1); p(-17,12+bob, 3,2,K);  // leg 2
  p(-12,10+bob, 4,2,R2); p(-14,12+bob, 3,2,R1); p(-16,14+bob, 3,2,K);  // leg 3
  // Right legs
  p( 26, 6+bob, 4,2,R2); p( 29, 8+bob, 3,2,R1); p( 31,10+bob, 3,2,K);
  p( 25, 8+bob, 4,2,R2); p( 28,10+bob, 3,2,R1); p( 30,12+bob, 3,2,K);
  p( 24,10+bob, 4,2,R2); p( 27,12+bob, 3,2,R1); p( 29,14+bob, 3,2,K);

  // ── LEFT CLAW ──────────────────────────────────────────────
  // Arm
  p(-22, 0+bob, 8,4,R3); p(-26,-2+bob, 6,4,R2); p(-30,-4+bob, 5,4,R2);
  p(-22,-4+bob, 6,2,R4); // arm top highlight
  // Upper pincer
  p(-36,-8+clap, 12,5,B3); p(-40,-8+clap, 5,4,B2); p(-44,-8+clap, 4,3,B1); p(-46,-8+clap, 3,2,K);
  p(-36,-6+clap,  8,2,R5); // pincer highlight
  p(-38,-10+clap, 3,2,S);  // claw tip spike
  // Lower pincer
  p(-36, 2-clap, 12,5,B3); p(-40, 4-clap, 5,4,B2); p(-44, 5-clap, 4,3,B1); p(-46, 6-clap, 3,2,K);
  p(-38,  3-clap, 3,2,S);  // claw tip spike
  // Claw joint
  p(-30,-4+bob, 6,10,R2); p(-28,-2+bob, 5,8,R3);

  // ── RIGHT CLAW ─────────────────────────────────────────────
  // Arm
  p( 30, 0+bob, 8,4,R3); p( 34,-2+bob, 6,4,R2); p( 38,-4+bob, 5,4,R2);
  p( 30,-4+bob, 6,2,R4);
  // Upper pincer
  p( 38,-8+clap, 12,5,B3); p( 44,-8+clap, 5,4,B2); p( 48,-8+clap, 4,3,B1); p( 51,-8+clap, 3,2,K);
  p( 38,-6+clap,  8,2,R5);
  p( 49,-10+clap, 3,2,S);
  // Lower pincer
  p( 38, 2-clap, 12,5,B3); p( 44, 4-clap, 5,4,B2); p( 48, 5-clap, 4,3,B1); p( 51, 6-clap, 3,2,K);
  p( 49,  3-clap, 3,2,S);
  // Claw joint
  p( 36,-4+bob, 6,10,R2); p( 37,-2+bob, 5,8,R3);

  // ── BODY SHELL (carapace) ───────────────────────────────────
  // Outline
  p( -6,-18+bob,28,2,K); p(-10,-16+bob,36,2,K); p(-12,-14+bob,40,2,K);
  p(-14,-12+bob,44,2,K); p(-14, -2+bob,44,2,K);
  p(-12,  8+bob,40,2,K); p(-10, 12+bob,36,2,K); p( -6, 14+bob,28,2,K);
  p(-16, -2+bob, 2,10,K); p( 30, -2+bob, 2,10,K);
  // Base shell (dark)
  p( -6,-16+bob,28,2,R1); p(-10,-14+bob,36,2,R1);
  p(-12,-12+bob,40,2,R2); p(-14,-10+bob,44,4,R2);
  p(-14, -6+bob,44,4,R3); p(-14, -2+bob,44,4,R3);
  p(-14,  2+bob,44,4,R2); p(-12,  6+bob,40,2,R2);
  p(-10, 10+bob,36,2,R1); p( -6, 12+bob,28,2,R1);
  p(-14,-12+bob, 2,24,R2); p( 28,-12+bob, 2,24,R2);
  // Mid shell (brighter)
  p( -8,-14+bob,24,2,R3); p(-10,-12+bob,28,2,R3);
  p(-12,-10+bob,30,4,R4); p(-12, -6+bob,30,6,R4);
  p(-12, -2+bob,30,4,R4); p(-12,  2+bob,30,4,R3);
  p(-10,  6+bob,28,2,R3); p( -8,  8+bob,24,2,R3);
  // Highlight (top-left sheen)
  p( -6,-12+bob,14,2,R5); p( -8,-10+bob,12,2,R5);
  p(-10, -8+bob,10,4,R5); p(-10, -4+bob, 6,2,R5);
  p( -4,-10+bob, 6,4,R6); p( -2, -8+bob, 4,2,R6);
  // Pattern lines (shell segments)
  p( -2,  0+bob,20,1,R2); // mid horizontal line
  p(-10, -4+bob, 2,8,R2); p( 24, -4+bob, 2,8,R2); // side grooves

  // ── BELLY / UNDERSIDE ───────────────────────────────────────
  p( -4,  4+bob,24,6,U);  p( -2,  6+bob,20,4,U2);
  p( -2, 10+bob,20,2,U);

  // ── EYES on stalks ─────────────────────────────────────────
  // Left eye stalk
  p(  2,-24+bob, 3,8,R3); p(  1,-26+bob, 3,2,R2);
  // Left eyeball
  p( -1,-32+bob, 8,7,K);  // outline
  p(  0,-31+bob, 6,5,E);  // blue iris
  p(  1,-30+bob, 4,3,EL); // lighter iris
  p(  1,-31+bob, 2,2,EW); // white glint
  p(  2,-30+bob, 1,1,EW); // sparkle
  // Right eye stalk
  p( 11,-24+bob, 3,8,R3); p( 12,-26+bob, 3,2,R2);
  // Right eyeball
  p( 10,-32+bob, 8,7,K);
  p( 11,-31+bob, 6,5,E);
  p( 12,-30+bob, 4,3,EL);
  p( 13,-31+bob, 2,2,EW);
  p( 14,-30+bob, 1,1,EW);

  // ── ANTENNAE ───────────────────────────────────────────────
  cx.strokeStyle=R2; cx.lineWidth=Math.max(1,sc*0.6);
  cx.beginPath(); cx.moveTo(Math.round(x+ 2*sc),Math.round(y+(-30+bob)*sc));
  cx.lineTo(Math.round(x+(-8*sc)),Math.round(y+(-44+bob)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(x+14*sc),Math.round(y+(-30+bob)*sc));
  cx.lineTo(Math.round(x+24*sc), Math.round(y+(-44+bob)*sc)); cx.stroke();
  // Antennae tips
  p(-10,-46+bob, 2,2,R4); p(22,-46+bob, 2,2,R4);

  // ── MOUTH / MANDIBLES ──────────────────────────────────────
  p(  4, 12+bob,10,3,K);  p(  6, 11+bob, 6,2,R1);
  p(  5, 14+bob, 3,2,K);  p(  9, 14+bob, 3,2,K);

  cx.restore();
}

function drawHermitCrab(cx,x,y,frame,sc){
  // Pixel art ốc mượn hồn — vẽ pixel-perfect từ ảnh tham chiếu
  // Sprite 35x32 art pixels. Anchor: tâm vỏ ốc ≈ (col+18, row+8) từ góc trên-trái
  sc=sc||3;cx.save();cx.imageSmoothingEnabled=false;

  // neo: x,y = tâm toàn sprite, offset để căn giữa
  // Sprite rộng ~35px, cao ~32px art pixel
  // Tâm ở khoảng col=17, row=16 => offset ox=-17*sc, oy=-16*sc
  const ox=x-17*sc, oy=y-10*sc;
  const p=(c,r,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;
    cx.fillRect(Math.round(ox+c*sc),Math.round(oy+r*sc),Math.round(w*sc),Math.round(h*sc));
  };

  // ─── PALETTE ───────────────────────────────────────────────────
  // Vỏ ốc — nâu vàng đất (từ ảnh)
  const K  ='#1a0f00'; // outline đen nâu
  const D1 ='#3d2200'; // nâu rất tối — đường xoắn, viền ngoài
  const S1 ='#5c3a10'; // nâu tối  
  const S2 ='#7a5218'; // nâu trung
  const S3 ='#9a6e28'; // nâu vàng
  const S4 ='#b88c3a'; // vàng nâu sáng
  const S5 ='#cca84e'; // vàng nhạt
  const S6 ='#dfc070'; // kem vàng
  const SH ='#ead888'; // highlight sáng nhất
  // Thân — cam đất nhạt (như tôm)
  const T1 ='#1e0800'; // outline thân
  const T2 ='#5a2c10'; // nâu tối thân
  const T3 ='#8a4820'; // cam nâu tối
  const T4 ='#b06030'; // cam nâu
  const T5 ='#cc7c48'; // cam nhạt
  const T6 ='#e0a06a'; // kem cam sáng (belly)
  // Mắt xanh
  const EB ='#2060c0';
  const EBL='#4090e0';
  const EW ='#ddeeff';

  const bob=Math.sin(frame*0.13)*0.8;

  // ════════════════════════════════════════════════════════
  // VỎ ỐC XOẮN — góc trên-phải của sprite
  // Scan từ grid ảnh (cột 18-34, hàng 1-17)
  // ════════════════════════════════════════════════════════

  // Hàng 1: đỉnh vỏ
  p(24,1, 2,1,D1); p(26,1,2,1,S1); p(28,1,1,1,D1);

  // Hàng 2: mở rộng
  p(22,2, 2,1,D1); p(24,2,2,1,S1); p(26,2,2,1,S2); p(28,2,2,1,S1); p(30,2,1,1,D1);

  // Hàng 3: vỏ trên  
  p(20,3, 1,1,D1); p(21,3,2,1,S1); p(23,3,2,1,S2); p(25,3,2,1,S3); p(27,3,2,1,S2); p(29,3,2,1,S1); p(31,3,1,1,D1);

  // Hàng 4:
  p(19,4, 1,1,D1); p(20,4,1,1,S1); p(21,4,2,1,S2); p(23,4,2,1,S3); p(25,4,2,1,S4); p(27,4,2,1,S3); p(29,4,2,1,S2); p(31,4,1,1,S1); p(32,4,1,1,D1);

  // Hàng 5:
  p(18,5, 1,1,D1); p(19,5,1,1,S1); p(20,5,2,1,S2); p(22,5,1,1,S2); p(23,5,1,1,D1); p(24,5,1,1,S3); p(25,5,2,1,S4); p(27,5,2,1,S5); p(29,5,2,1,S4); p(31,5,1,1,S3); p(32,5,1,1,S2); p(33,5,1,1,D1);

  // Hàng 6:
  p(18,6, 1,1,D1); p(19,6,1,1,S1); p(20,6,1,1,S2); p(21,6,1,1,D1); p(22,6,2,1,S3); p(24,6,1,1,S4); p(25,6,2,1,S5); p(27,6,2,1,S6); p(29,6,2,1,S5); p(31,6,1,1,S4); p(32,6,1,1,S3); p(33,6,1,1,S2); p(34,6,1,1,D1);

  // Hàng 7:
  p(18,7, 1,1,D1); p(19,7,1,1,S2); p(20,7,1,1,D1); p(21,7,1,1,S3); p(22,7,1,1,S4); p(23,7,1,1,S5); p(24,7,1,1,D1); p(25,7,1,1,S5); p(26,7,2,1,SH); p(28,7,1,1,S6); p(29,7,2,1,S5); p(31,7,1,1,S4); p(32,7,1,1,S3); p(33,7,1,1,S2); p(34,7,1,1,D1);

  // Hàng 8: (tâm xoắn ốc)
  p(17,8, 1,1,D1); p(18,8,1,1,D1); p(19,8,1,1,S2); p(20,8,1,1,S3); p(21,8,1,1,S5); p(22,8,1,1,S6); p(23,8,1,1,K);  p(24,8,1,1,S6); p(25,8,1,1,SH); p(26,8,2,1,SH); p(28,8,1,1,SH); p(29,8,1,1,S6); p(30,8,1,1,S5); p(31,8,1,1,S4); p(32,8,1,1,S3); p(33,8,1,1,S2); p(34,8,1,1,D1);

  // Hàng 9:
  p(17,9, 1,1,D1); p(18,9,1,1,S1); p(19,9,1,1,S2); p(20,9,1,1,S3); p(21,9,1,1,S5); p(22,9,1,1,K);  p(23,9,1,1,S4); p(24,9,1,1,S6); p(25,9,1,1,SH); p(26,9,2,1,S6); p(28,9,1,1,S5); p(29,9,1,1,S4); p(30,9,1,1,S3); p(31,9,1,1,S2); p(32,9,1,1,S1); p(33,9,1,1,D1);

  // Hàng 10: (vòng xoắn giữa)
  p(17,10,1,1,D1); p(18,10,1,1,S2); p(19,10,1,1,S3); p(20,10,1,1,S4); p(21,10,1,1,S5); p(22,10,1,1,D1); p(23,10,1,1,D1); p(24,10,1,1,S5); p(25,10,2,1,S6); p(27,10,1,1,S5); p(28,10,1,1,S4); p(29,10,1,1,S3); p(30,10,1,1,S2); p(31,10,1,1,S1); p(32,10,1,1,D1);

  // Hàng 11:
  p(17,11,1,1,D1); p(18,11,1,1,S2); p(19,11,1,1,S3); p(20,11,1,1,S4); p(21,11,1,1,D1); p(22,11,1,1,S4); p(23,11,1,1,S5); p(24,11,1,1,S4); p(25,11,1,1,S3); p(26,11,1,1,D1); p(27,11,1,1,S4); p(28,11,1,1,S3); p(29,11,1,1,S2); p(30,11,1,1,S1); p(31,11,1,1,D1);

  // Hàng 12: (vòng trong)
  p(17,12,1,1,D1); p(18,12,1,1,S1); p(19,12,1,1,S2); p(20,12,1,1,S3); p(21,12,1,1,D1); p(22,12,1,1,S3); p(23,12,2,1,S4); p(25,12,1,1,D1); p(26,12,1,1,S3); p(27,12,1,1,S2); p(28,12,1,1,S1); p(29,12,1,1,D1);

  // Hàng 13:
  p(16,13,1,1,D1); p(17,13,1,1,S1); p(18,13,1,1,S2); p(19,13,1,1,S3); p(20,13,1,1,D1); p(21,13,1,1,D1); p(22,13,1,1,S3); p(23,13,2,1,S2); p(25,13,1,1,D1); p(26,13,1,1,S2); p(27,13,1,1,S1); p(28,13,1,1,D1);

  // Hàng 14: miệng vỏ — nơi thân thò ra
  p(15,14,1,1,D1); p(16,14,1,1,S1); p(17,14,1,1,D1); p(18,14,2,1,S2); p(20,14,1,1,D1); p(21,14,1,1,S2); p(22,14,2,1,S1); p(24,14,1,1,D1); p(25,14,1,1,S1); p(26,14,1,1,D1); p(32,14,1,1,D1);

  // Hàng 15: dưới miệng vỏ
  p(15,15,1,1,D1); p(16,15,1,1,S1); p(17,15,2,1,S2); p(19,15,2,1,S1); p(21,15,1,1,D1); p(22,15,1,1,S1); p(23,15,1,1,D1);

  // Hàng 16:  
  p(14,16,1,1,D1); p(15,16,2,1,S1); p(17,16,2,1,S2); p(19,16,1,1,S1); p(20,16,1,1,D1);

  // Hàng 17: đáy vỏ
  p(13,17,1,1,D1); p(14,17,2,1,S1); p(16,17,2,1,D1); p(18,17,1,1,D1);

  // ════════════════════════════════════════════════════════
  // THÂN TÔM/MỰC — dài chéo xuống-trái
  // Mỗi đốt ~3 pixel art rộng, 2 pixel art cao
  // Thân đi từ (col≈14,row≈14) chéo xuống (col≈0,row≈30)
  // ════════════════════════════════════════════════════════

  // Đốt 1 — gần miệng vỏ (row 14-15)
  p(12,14+bob,3,2,T2); p(13,14+bob,2,2,T3); p(14,14+bob,1,2,T4); p(11,14+bob,1,2,T1);

  // Đốt 2 (row 16-17)
  p(10,16+bob,3,2,T2); p(11,16+bob,2,2,T3); p(12,16+bob,1,2,T4); p(9,16+bob,1,2,T1);

  // Đốt 3 (row 18-19)
  p(8,18+bob, 3,2,T3); p(9,18+bob, 2,2,T4); p(10,18+bob,1,2,T5); p(7,18+bob, 1,2,T2); p(11,18+bob,1,2,T2);

  // Đốt 4 (row 20-21)
  p(6,20+bob, 3,2,T3); p(7,20+bob, 2,2,T4); p(8,20+bob, 2,2,T5); p(5,20+bob, 1,2,T2); p(9,20+bob, 1,2,T2);

  // Đốt 5 (row 22-23)
  p(4,22+bob, 3,2,T3); p(5,22+bob, 3,2,T4); p(7,22+bob, 2,2,T5); p(3,22+bob, 1,2,T2); p(8,22+bob, 1,2,T2);

  // Đốt 6 (row 24-25)
  p(2,24+bob, 3,2,T3); p(3,24+bob, 3,2,T4); p(5,24+bob, 2,2,T5); p(1,24+bob, 1,2,T2); p(6,24+bob, 1,2,T2);

  // Đốt 7 — nhỏ dần (row 26-27)
  p(1,26+bob, 3,2,T3); p(2,26+bob, 2,2,T4); p(4,26+bob, 2,2,T5); p(0,26+bob, 1,2,T2); p(5,26+bob, 1,2,T1);

  // Đuôi (row 28-30) — nhọn dần
  p(0,28+bob, 3,1,T3); p(1,28+bob, 2,1,T4);
  p(0,29+bob, 2,1,T2); p(1,29+bob, 1,1,T3);
  p(0,30+bob, 1,1,T1);

  // Chân bơi nhỏ (pleopods) dọc theo thân — rung
  const lw=Math.sin(frame*0.22)*0.8;
  cx.strokeStyle=T2; cx.lineWidth=Math.max(1,sc*0.5); cx.globalAlpha=0.85;
  // Chân bên phải thân
  cx.beginPath(); cx.moveTo(Math.round(ox+12*sc),Math.round(oy+(16+bob)*sc)); cx.lineTo(Math.round(ox+14*sc),Math.round(oy+(18+bob+lw)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+10*sc),Math.round(oy+(18+bob)*sc)); cx.lineTo(Math.round(ox+12*sc),Math.round(oy+(20+bob-lw)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+8*sc), Math.round(oy+(20+bob)*sc)); cx.lineTo(Math.round(ox+10*sc),Math.round(oy+(22+bob+lw)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+6*sc), Math.round(oy+(22+bob)*sc)); cx.lineTo(Math.round(ox+8*sc), Math.round(oy+(24+bob-lw)*sc)); cx.stroke();
  // Chân bên trái thân  
  cx.beginPath(); cx.moveTo(Math.round(ox+11*sc),Math.round(oy+(16+bob)*sc)); cx.lineTo(Math.round(ox+9*sc), Math.round(oy+(18+bob-lw)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+9*sc), Math.round(oy+(18+bob)*sc)); cx.lineTo(Math.round(ox+7*sc), Math.round(oy+(20+bob+lw)*sc)); cx.stroke();
  cx.globalAlpha=1;

  // ════════════════════════════════════════════════════════
  // ĐẦU — nối vỏ và thân (row 14, col 11-14)
  // Mắt xanh nhỏ + râu
  // ════════════════════════════════════════════════════════
  // Vùng đầu
  p(13,13,2,2,T3); p(14,13,1,2,T4); p(12,13,1,2,T2);

  // Mắt xanh (1 mắt rõ)
  p(14,12,2,2,EB);   // socket
  p(14,12,2,2,EBL);  // tròng
  p(15,12,1,1,EW);   // highlight

  // Râu ngắn
  cx.globalAlpha=0.9;
  cx.strokeStyle=T2; cx.lineWidth=Math.max(1,sc*0.4);
  const ant=Math.sin(frame*0.18)*1.2;
  cx.beginPath(); cx.moveTo(Math.round(ox+14*sc),Math.round(oy+12*sc)); cx.lineTo(Math.round(ox+11*sc),Math.round(oy+(9+ant)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+15*sc),Math.round(oy+12*sc)); cx.lineTo(Math.round(ox+18*sc),Math.round(oy+(10-ant)*sc)); cx.stroke();
  // Râu dài
  cx.strokeStyle=T1; cx.lineWidth=Math.max(1,sc*0.3); cx.globalAlpha=0.7;
  cx.beginPath(); cx.moveTo(Math.round(ox+13*sc),Math.round(oy+12*sc)); cx.lineTo(Math.round(ox+8*sc), Math.round(oy+(6+ant*2)*sc)); cx.stroke();
  cx.beginPath(); cx.moveTo(Math.round(ox+16*sc),Math.round(oy+12*sc)); cx.lineTo(Math.round(ox+21*sc),Math.round(oy+(7-ant*2)*sc)); cx.stroke();
  cx.globalAlpha=1;

  cx.restore();
}

function drawBigCrab(cx,x,y,frame,sc){
  cx.save();
  const pulse=0.5+Math.sin(frame*0.08)*0.35;
  cx.globalAlpha=pulse*0.4;cx.fillStyle='#ff1100';
  cx.beginPath();cx.ellipse(x+16*sc,y+12*sc,38*sc,20*sc,0,0,Math.PI*2);cx.fill();
  cx.globalAlpha=1;drawSeaCrab(cx,x,y,frame,sc);cx.restore();
}

function drawOctopus(cx,x,y,frame,sc){
  sc=sc||2;cx.save();cx.imageSmoothingEnabled=false;
  const p=(gx,gy,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;
    cx.fillRect(Math.round(x+gx*sc),Math.round(y+gy*sc),Math.round(w*sc),Math.round(h*sc));
  };
  // Offset để căn giữa (grid 23 wide, 30 tall)
  const ox=-11, oy=-15;
  const pp=(gx,gy,w,h,col)=>p(gx+ox,gy+oy,w,h,col);

  // Palette (từ ảnh gốc)
  const K ='#180830'; // viền đen tím
  const P1='#4b2870'; // tím rất tối
  const P2='#6b3d94'; // tím tối
  const P3='#8855b8'; // tím vừa
  const P4='#a272cc'; // tím chính
  const P5='#b990da'; // tím sáng
  const P6='#d2b0e8'; // tím nhạt
  const PH='#e4c8f0'; // highlight
  const SK='#e8a8b8'; // hồng da (bụng xúc tu)
  const E ='#4a2858'; // mắt tối
  const EW='#f8f0ff'; // trắng mắt

  const bob=Math.round(Math.sin(frame*0.1)*1);

  // ── THÂN CHÍNH (rows 0-16) ─────────────────────────────────
  // r0
  pp(7,0,1,1,P2);pp(8,0,1,1,P3);pp(9,0,1,1,P2);pp(10,0,3,1,P3);pp(13,0,2,1,P2);pp(15,0,1,1,P3);
  // r1
  pp(5,1,1,1,EW);pp(6,1,3,1,P3);pp(9,1,5,1,P4);pp(14,1,4,1,P3);
  // r2
  pp(5,2,1,1,PH);pp(6,2,1,1,P2);pp(7,2,1,1,P3);pp(8,2,2,1,P4);pp(10,2,1,1,P5);pp(11,2,5,1,P4);pp(16,2,1,1,P3);pp(17,2,1,1,P2);
  // r3
  pp(5,3,2,1,P3);pp(7,3,3,1,P4);pp(10,3,1,1,P5);pp(11,3,5,1,P4);pp(16,3,1,1,P3);pp(17,3,1,1,P2);pp(18,3,1,1,P4);
  // r4
  pp(5,4,1,1,P2);pp(6,4,1,1,P3);pp(7,4,9,1,P4);pp(16,4,1,1,P3);pp(17,4,1,1,P2);pp(18,4,1,1,P3);
  // r5
  pp(5,5,1,1,P2);pp(6,5,1,1,P3);pp(7,5,8,1,P4);pp(15,5,4,1,P3);
  // r6
  pp(5,6,1,1,P2);pp(6,6,2,1,P3);pp(8,6,7,1,P4);pp(15,6,4,1,P3);
  // r7 — mắt khu vực
  pp(5,7,1,1,P2);pp(6,7,2,1,P3);pp(8,7,1,1,E);pp(9,7,1,1,P3);pp(10,7,4,1,P4);pp(14,7,2,1,P2);pp(16,7,1,1,P3);pp(17,7,1,1,P2);pp(18,7,1,1,P3);
  // r8 — mắt + xúc tu bên
  pp(0,8,2,1,P3);pp(2,8,1,1,P2);pp(3,8,1,1,P5);pp(5,8,1,1,PH);pp(6,8,1,1,P2);pp(7,8,2,1,E);pp(9,8,1,1,P2);pp(10,8,3,1,P4);pp(13,8,1,1,P3);pp(14,8,2,1,E);pp(16,8,2,1,P3);pp(19,8,1,1,P4);pp(20,8,2,1,P3);
  // r9
  pp(0,9,1,1,P2);pp(1,9,1,1,P3);pp(2,9,1,1,P4);pp(3,9,2,1,P3);pp(5,9,1,1,PH);pp(6,9,1,1,P2);pp(7,9,1,1,P3);pp(8,9,1,1,P1);pp(9,9,1,1,P3);pp(10,9,4,1,P4);pp(14,9,3,1,P2);pp(17,9,1,1,P3);pp(18,9,1,1,EW);pp(19,9,3,1,P3);pp(22,9,1,1,P2);
  // r10
  pp(0,10,1,1,P2);pp(1,10,1,1,P3);pp(2,10,1,1,P2);pp(3,10,2,1,P3);pp(6,10,1,1,P2);pp(7,10,1,1,P3);pp(8,10,7,1,P4);pp(15,10,1,1,P3);pp(16,10,1,1,P2);pp(17,10,1,1,P3);pp(18,10,1,1,PH);pp(19,10,2,1,P2);pp(21,10,2,1,P3);
  // r11
  pp(0,11,1,1,EW);pp(1,11,6,1,P3);pp(7,11,1,1,P4);pp(8,11,1,1,P3);pp(9,11,6,1,P4);pp(15,11,3,1,P3);pp(18,11,1,1,P6);pp(19,11,2,1,P3);pp(21,11,2,1,P2);
  // r12
  pp(0,12,1,1,P2);pp(1,12,5,1,P3);pp(6,12,1,1,P4);pp(7,12,1,1,P3);pp(8,12,1,1,P2);pp(9,12,1,1,P3);pp(10,12,1,1,P4);pp(11,12,1,1,P3);pp(12,12,2,1,P4);pp(14,12,4,1,P3);pp(18,12,1,1,P2);pp(19,12,3,1,P3);pp(22,12,1,1,P2);
  // r13
  pp(0,13,1,1,P2);pp(1,13,1,1,P3);pp(2,13,2,1,P2);pp(4,13,3,1,P3);pp(7,13,2,1,P2);pp(9,13,2,1,P4);pp(11,13,2,1,P3);pp(13,13,2,1,P4);pp(15,13,1,1,P2);pp(16,13,5,1,P3);pp(21,13,1,1,P4);pp(22,13,1,1,P2);
  // r14
  pp(0,14,1,1,P2);pp(1,14,1,1,P4);pp(2,14,4,1,P3);pp(6,14,2,1,P2);pp(8,14,1,1,P3);pp(9,14,1,1,P4);pp(10,14,1,1,P3);pp(11,14,2,1,P2);pp(13,14,1,1,P3);pp(14,14,1,1,P4);pp(15,14,1,1,P3);pp(16,14,2,1,P2);pp(18,14,4,1,P3);pp(22,14,1,1,P2);
  // r15
  pp(0,15,2,1,P2);pp(2,15,1,1,P4);pp(3,15,2,1,P3);pp(5,15,1,1,P2);pp(6,15,1,1,P3);pp(7,15,1,1,P2);pp(8,15,1,1,P4);pp(9,15,2,1,P3);pp(11,15,2,1,P2);pp(13,15,3,1,P3);pp(16,15,6,1,P2);
  // r16
  pp(0,16,1,1,PH);pp(1,16,1,1,P5);pp(2,16,3,1,P2);pp(5,16,1,1,PH);pp(6,16,1,1,P2);pp(7,16,1,1,P4);pp(8,16,5,1,P3);pp(13,16,1,1,P2);pp(14,16,1,1,P3);pp(15,16,1,1,P4);pp(16,16,1,1,P3);pp(17,16,1,1,P2);pp(18,16,1,1,P5);pp(19,16,1,1,P4);pp(20,16,1,1,P3);pp(21,16,1,1,P4);
  // ── XÚC TU (8 tentacles, rõ ràng, dày, uốn lượn) ────────────
  // Mỗi xúc tu vẽ theo chuỗi đốt từ thân xuống, có phần bụng hồng
  const t=frame*0.09;

  // Hàm vẽ 1 đốt xúc tu (rect tròn 2x2 cell)
  const seg=(gx,gy,col,thick)=>{
    thick=thick||2;
    pp(gx,gy,thick,thick,col);
  };

  // 8 xúc tu tỏa ra từ đáy thân (thân đáy ~row 16, cols 4-18)
  // Mỗi xúc tu: 7-9 đốt, uốn wave theo sin, tip cuộn
  const tentacles=[
    // [startCol, wavePhase, direction: -1=trái, 1=phải, waveAmp]
    {cx:4,  phase:0.0,  amp:1.8, len:9,  lean:-1.2}, // xúc tu 1 - trái ngoài
    {cx:6,  phase:0.7,  amp:1.2, len:8,  lean:-0.6}, // xúc tu 2
    {cx:8,  phase:1.4,  amp:0.8, len:9,  lean:-0.2}, // xúc tu 3
    {cx:10, phase:2.1,  amp:0.6, len:9,  lean: 0.1}, // xúc tu 4 - giữa trái
    {cx:12, phase:2.8,  amp:0.6, len:9,  lean: 0.1}, // xúc tu 5 - giữa phải
    {cx:14, phase:3.5,  amp:0.8, len:9,  lean: 0.2}, // xúc tu 6
    {cx:16, phase:4.2,  amp:1.2, len:8,  lean: 0.6}, // xúc tu 7
    {cx:18, phase:4.9,  amp:1.8, len:9,  lean: 1.2}, // xúc tu 8 - phải ngoài
  ];

  tentacles.forEach((tk,ti)=>{
    let gx=tk.cx, gy=16; // bắt đầu từ đáy thân
    for(let s=0;s<tk.len;s++){
      const wave=Math.sin(t+tk.phase+s*0.55)*tk.amp + tk.lean*(s*0.18);
      const nx=gx+wave;
      const thick = s<4 ? 2 : s<7 ? 2 : 1; // dày ở gốc, mảnh ở tip
      // Màu: gốc tím đậm, thân tím vừa, bụng hồng ở giữa
      const col = s===0 ? P2 :
                  s<3   ? P3 :
                  s<6   ? P4 :
                  s<8   ? P3 : P2;
      // Bụng hồng (highlight ở mặt trong)
      seg(nx, gy+s, col, thick);
      if(s>=2 && s<=6 && thick>=2){
        pp(nx+0.5, gy+s, 1, 1, SK); // điểm hồng bụng
      }
      // Tip cuộn (2 đốt cuối uốn ngược)
      if(s===tk.len-2){
        const curlX=nx+Math.sin(t+tk.phase)*0.8*tk.amp;
        seg(curlX, gy+s+1, P3, 1);
      }
      if(s===tk.len-1){
        const curlX=nx-Math.sin(t+tk.phase+0.5)*1.2;
        seg(curlX, gy+s+1, P2, 1);
      }
    }
  });

  // ── MẮT (vẽ lại rõ hơn, căn vị trí đúng) ───────────────────
  // Mắt trái (ở grid ~col 7-9, row 7-9)
  const elx=ox+7, ely=oy+7;
  pp(elx-ox,ely-oy,  3,3,E);      // vòng mắt tối
  pp(elx-ox+1,ely-oy+1,1,1,EW);  // điểm trắng

  // Mắt phải (grid ~col 14-16, row 7-9)
  const erx=ox+14, ery=oy+7;
  pp(erx-ox,ery-oy,  3,3,E);
  pp(erx-ox+1,ery-oy+1,1,1,EW);

  cx.restore();
}

function drawSquid(cx,x,y,frame,sc){
  sc=sc||2;cx.save();cx.imageSmoothingEnabled=false;
  const p=(gx,gy,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;
    // Offset: căn giữa theo chiều ngang (grid 20 wide → -10)
    // gy=0 = đỉnh đầu nhọn
    cx.fillRect(Math.round(x+(gx-10)*sc), Math.round(y+gy*sc), Math.round(w*sc), Math.round(h*sc));
  };

  const K  ='#1a0008';
  const D1 ='#5a0820';
  const D2 ='#7a1530';
  const M1 ='#a82040';
  const M2 ='#c03050';
  const P1 ='#e05070';
  const P2 ='#ee8898';
  const P3 ='#f4aab8';
  const PH ='#fdd0d8';
  const CR ='#e8d498';
  const CRD='#c8a860';
  const CRK='#6a4010';

  const t=frame*0.09;

  // ══════════════════════════════════════════
  // ĐẦU NHỌN / VÂY (rows 0-8) — hình thoi bậc thang
  // ══════════════════════════════════════════
  p(9, 0, 2,1,M1);                    // đỉnh nhọn nhất
  p(8, 1, 4,1,M2);                    // r1
  p(7, 2, 6,1,M2);                    // r2
  p(6, 3, 8,1,M2); p(8,3,4,1,P1);    // r3 — sáng giữa
  p(5, 4,10,1,M2); p(7,4,6,1,P1);    // r4
  p(4, 5,12,1,M2); p(6,5,8,1,P1);    // r5 — vây bên ra
  // Vây bên trái/phải (tai vây nhọn)
  p(2, 5, 2,1,M1); p(16,5,2,1,M1);
  p(3, 6,14,1,M2); p(5,6,10,1,P1);   // r6
  p(1, 6, 2,1,M1); p(17,6,2,1,M1);
  p(4, 7,12,1,M2); p(6,7,8,1,P1);    // r7
  p(0, 7, 4,1,M1); p(16,7,4,1,M1);   // vây ngoài
  p(5, 8,10,1,M2); p(7,8,6,1,P1);    // r8

  // ══════════════════════════════════════════
  // THÂN DÀI (rows 9-24) — hình chữ nhật to
  // ══════════════════════════════════════════
  for(let r=9;r<=24;r++){
    p(5,r,10,1,M2);   // viền tối 2 bên
    p(6,r, 8,1,P1);   // thân chính
    p(7,r, 6,1,P2);   // sáng giữa
    p(8,r, 4,1,P3);   // sáng hơn
    p(9,r, 2,1,PH);   // highlight trục giữa
  }
  // Viền outline thân
  p(5, 9,1,16,M1);    // viền trái
  p(14,9,1,16,M1);    // viền phải

  // ══════════════════════════════════════════
  // MẮT (row 18-19)
  // ══════════════════════════════════════════
  p(6, 18,2,2,D1);    // mắt trái
  p(7, 18,1,2,K);
  p(12,18,2,2,D1);    // mắt phải
  p(12,18,1,2,K);

  // ══════════════════════════════════════════
  // 2 XÚC TU DÀI ĐẶC BIỆT (hunting tentacles)
  // Nhô ra 2 bên thân, có đầu kem cuộn tròn
  // ══════════════════════════════════════════
  const wL=Math.sin(t+0.3)*1.2;
  const wR=Math.sin(t+1.0)*1.2;

  // Xúc tu trái — ngang ra bên trái rồi cong xuống
  // Cánh tay (arm) ngang
  p(0+wL, 20,5,2,M2); p(1+wL,20,3,2,M1);
  p(-1+wL,21,4,2,M1); p(-2+wL,22,3,2,D2);
  // Đầu kem cuộn
  p(-3+wL,20,4,3,CR); p(-2+wL,21,2,2,CRD);
  p(-4+wL,22,3,2,CR); p(-3+wL,23,2,1,CRK);
  p(-3+wL,19,3,2,CR);

  // Xúc tu phải
  p(15+wR,20,5,2,M2); p(16+wR,20,3,2,M1);
  p(17+wR,21,4,2,M1); p(18+wR,22,3,2,D2);
  p(19+wR,20,4,3,CR); p(20+wR,21,2,2,CRD);
  p(20+wR,22,3,2,CR); p(21+wR,23,2,1,CRK);
  p(19+wR,19,3,2,CR);

  // ══════════════════════════════════════════
  // 8 XÚC TU NGẮN (rows 25-36)
  // 4 cặp, tỏa ra từ đáy thân
  // ══════════════════════════════════════════
  // Mỗi xúc tu: chuỗi đốt 2 cell wide, 2 cell tall
  // Cặp 1: ngoài cùng trái/phải
  const a1=Math.sin(t+0.0)*1.4;
  const a2=Math.sin(t+0.7)*1.2;
  const a3=Math.sin(t+1.4)*1.0;
  const a4=Math.sin(t+2.1)*0.8;

  // Xúc tu trái ngoài (cặp 1L)
  p(5+a1, 25,2,2,M2); p(4+a1, 27,2,2,M1); p(3+a1, 29,2,2,D2);
  p(2+a1, 31,2,2,D2); p(1+a1, 33,2,2,D1); p(0+a1, 35,2,1,D1);
  // Xúc tu trái trong (cặp 2L)
  p(7+a2, 25,2,2,M2); p(6+a2, 27,2,2,M1); p(5+a2, 29,2,2,M1);
  p(4+a2, 31,2,2,D2); p(4+a2, 33,2,2,D2); p(3+a2, 35,2,1,D1);
  // Xúc tu phải trong (cặp 3R)
  p(11+a3,25,2,2,M2); p(12+a3,27,2,2,M1); p(12+a3,29,2,2,M1);
  p(13+a3,31,2,2,D2); p(13+a3,33,2,2,D2); p(14+a3,35,2,1,D1);
  // Xúc tu phải ngoài (cặp 4R)
  p(13+a4,25,2,2,M2); p(14+a4,27,2,2,M1); p(15+a4,29,2,2,D2);
  p(16+a4,31,2,2,D2); p(17+a4,33,2,2,D1); p(18+a4,35,2,1,D1);

  // Đáy thân nối vào xúc tu
  p(5,24,10,2,M2); p(6,24,8,1,M1); // bridge row

  cx.restore();
}

function drawShark(cx,x,y,frame,sc){
  sc=sc||2;cx.save();cx.imageSmoothingEnabled=false;
  const p=(gx,gy,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(Math.round(x+(gx-22)*sc), Math.round(y+(gy-10)*sc), Math.round(w*sc), Math.round(h*sc));
  };

  // Palette (scan từ ảnh)
  const K ='#080808'; // đen
  const DB='#1e2022'; // xanh đen (vây, đuôi)
  const DG='#363a3e'; // xám tối
  const MG='#5f6368'; // xám vừa (lưng)
  const G ='#8a8c90'; // xám sáng (thân)
  const LG='#afb2b4'; // xám nhạt (bụng trên)
  const W ='#d7d9db'; // trắng xám (bụng)
  const WH='#f0f1f2'; // trắng sáng

  const tw=Math.sin(frame*0.18)*2.2; // tail wave — stronger

  // ── VÂY LƯNG (r1-r6, phần trên) ─────────────────────────────
  p(17,1, 2,1,DB);
  p(16,2, 1,1,DB); p(17,2,1,1,MG); p(18,2,1,1,DB);
  p(15,3, 1,1,DB); p(16,3,1,1,DG); p(17,3,1,1,MG); p(18,3,1,1,DG); p(19,3,1,1,DB);
  p(15,4, 1,1,DB); p(16,4,2,1,MG); p(18,4,1,1,DG); p(19,4,1,1,DB);
  p(10,5, 5,1,DB); p(15,5,1,1,DG); p(16,5,3,1,MG); p(19,5,2,1,DB);
  p(7, 6, 5,1,DB); p(12,6,2,1,DG); p(14,6,5,1,MG); p(19,6,1,1,DG); p(20,6,4,1,DB);

  // ── VÂY ĐUÔI TRÊN (r5-r7, bên phải) ─────────────────────────
  p(36+tw,5, 1,1,DB); p(37+tw,5,1,1,DG); p(38+tw,5,1,1,MG); p(39+tw,5,1,1,DG); p(40+tw,5,2,1,DB);
  p(35+tw,6, 1,1,DB); p(36+tw,6,2,1,MG); p(38+tw,6,1,1,DG); p(39+tw,6,1,1,DB);
  p(34+tw,7, 1,1,DG); p(35+tw,7,1,1,G);  p(36+tw,7,1,1,MG); p(37+tw,7,2,1,DB);

  // ── THÂN CHÍNH ────────────────────────────────────────────────
  // r7 — thân trên + vây ngực trái
  p(2, 7,1,1,DB); p(3,7,1,1,K);  p(4,7,3,1,DB); p(7,7,2,1,DG); p(9,7,13,1,MG);
  p(22,7,2,1,DG); p(24,7,2,1,DB);

  // r8 — thân đầy
  p(1, 8,3,1,DG); p(4,8,5,1,MG); p(9,8,1,1,DG); p(10,8,16,1,MG); p(26,8,3,1,DG);
  p(29,8,2,1,DB); p(33,8,2,1,MG); p(35,8,1,1,DG); p(36,8,3,1,DB);

  // r9 — bụng trắng (LG/G)
  p(1, 9,1,1,DG); p(2,9,1,1,MG); p(3,9,5,1,G);   p(8,9,2,1,MG); p(10,9,1,1,DG);
  p(11,9,1,1,MG); p(12,9,14,1,G); p(26,9,8,1,MG); p(34,9,1,1,DG); p(35,9,3+tw,1,DB);

  // r10 — bụng trắng (sáng nhất)
  p(2,10,1,1,DB); p(3,10,2,1,DG); p(5,10,1,1,MG); p(6,10,3,1,G);  p(9,10,1,1,MG);
  p(10,10,1,1,DG);p(11,10,1,1,MG);p(12,10,16,1,G);p(28,10,6,1,DG);p(34,10,3,1,DB);

  // r11 — thân dưới
  p(4,11,3,1,DG); p(7,11,1,1,MG); p(8,11,2,1,G); p(10,11,1,1,DG); p(11,11,2,1,MG);
  p(13,11,1,1,DG);p(14,11,1,1,MG);p(15,11,7,1,G); p(22,11,2,1,DG);p(24,11,2,1,DB);
  p(26,11,1,1,K); p(27,11,1,1,DB);p(28,11,2,1,DG);p(30,11,1,1,DB);p(33,11,2,1,DG);
  p(35,11,1,1,DB);

  // r12 — mõm + vây bụng
  p(7,12,1,1,DB); p(8,12,1,1,K);  p(9,12,1,1,DG); p(10,12,1,1,DB);p(11,12,2,1,MG);
  p(13,12,1,1,DB);p(14,12,1,1,DG);p(15,12,3,1,MG);p(18,12,1,1,DG);p(19,12,3,1,K);

  // r13 — bụng dưới
  p(10,13,1,1,DB);p(11,13,1,1,DG);p(12,13,1,1,MG);p(13,13,2,1,DB);

  // ── VÂY ĐUÔI DƯỚI (r12-r13, bên phải) ───────────────────────
  p(34+tw,12,1,1,DB); p(35+tw,12,1,1,DG); p(36+tw,12,1,1,K);
  p(34+tw,13,1,1,DB); p(35+tw,13,1,1,DG); p(36+tw,13,1,1,DB);

  // ── VÂY BỤNG / ĐUÔI DƯỚI THÂN ────────────────────────────────
  p(11,14,1,1,DG); p(12,14,1,1,MG); p(13,14,2,1,DB);
  p(11,15,1,1,DB); p(12,15,1,1,MG); p(13,15,2,1,DB);
  p(11,16,1,1,DB); p(12,16,2,1,DG); p(14,16,1,1,DB);
  p(12,17,2,1,DG); p(14,17,1,1,K);
  p(12,18,1,1,DB); p(13,18,1,1,DG); p(14,18,1,1,DB);
  p(13,19,1,1,DB);

  // ── MẮT (mắt trắng + tròng đen + shine) ────────────────────────
  p(8,8,3,3,WH);  // sclera trắng
  p(9,9,1,1,K);   // pupil đen
  p(8,8,1,1,LG);  // highlight

  // ── MANG CÁ (3 kẽ hở) ────────────────────────────────────────
  cx.save();
  cx.strokeStyle=DG; cx.lineWidth=Math.max(1,sc*0.5); cx.globalAlpha=0.55;
  for(let gi=0;gi<3;gi++){
    const gx=Math.round(x+(5+gi*2-22)*sc);
    cx.beginPath();
    cx.moveTo(gx, Math.round(y+(7-10)*sc));
    cx.lineTo(gx, Math.round(y+(12-10)*sc));
    cx.stroke();
  }
  cx.restore();

  // ── BỤNG TRẮNG (viền sắc nét) ────────────────────────────────
  cx.save();
  cx.strokeStyle=WH; cx.lineWidth=Math.max(1,sc*0.7); cx.globalAlpha=0.65;
  cx.beginPath();
  cx.moveTo(Math.round(x+(3-22)*sc), Math.round(y+(10-10)*sc));
  cx.lineTo(Math.round(x+(33-22)*sc), Math.round(y+(10-10)*sc));
  cx.stroke();
  cx.restore();

  // ── ĐƯỜNG PHÂN CÁCH LƯNG/BỤNG (lateral line) ─────────────────
  cx.save();
  cx.strokeStyle=DG; cx.lineWidth=Math.max(1,sc*0.4);
  cx.setLineDash([Math.round(sc),Math.round(sc)]);
  cx.globalAlpha=0.5;
  cx.beginPath();
  cx.moveTo(Math.round(x+(4-22)*sc), Math.round(y+(9-10)*sc));
  cx.lineTo(Math.round(x+(28-22)*sc),Math.round(y+(9-10)*sc));
  cx.stroke();
  cx.restore();

  cx.restore();
}

function drawTropical(cx,x,y,frame,sc){
  sc=sc||2;cx.save();cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{if(!col)return;cx.fillStyle=col;cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));};
  const F1='#ff6600',F2='#ff8800',F3='#ffaa00',FH='#ffcc44',FW='#ffffff';
  const OUT='#552200',EY='#000000';
  const tw=Math.sin(frame*0.25)*2;
  p(-10+tw,-4,6,12,F2);p(-12+tw,-2,4,8,F1);p(-14+tw,0,3,4,OUT);
  p(-6,-6,24,4,F1);p(-8,-2,28,8,F2);p(-8,6,28,8,F1);p(-6,14,24,4,F2);
  p(-4,-8,20,2,OUT);p(-4,16,20,2,OUT);p(-10,-4,2,16,OUT);p(20,-4,2,16,OUT);
  p(-4,-4,10,4,F3);p(-2,-2,6,4,FH);p(0,0,4,2,FW);
  p(4,-4,3,18,FW);p(8,-4,3,18,FW);
  p(4,-12,8,6,F2);p(6,-14,4,6,F1);p(8,-14,2,8,OUT);
  p(18,-4,8,12,F2);p(22,-2,6,8,F1);p(24,0,4,6,F3);
  p(20,-2,5,5,FW);p(21,-1,3,3,EY);p(21,-1,1,1,FW);
  p(26,4,2,3,OUT);
  cx.restore();
}

function drawHermitBoss(cx,x,y,frame,sc){
  cx.save();
  const pulse=0.5+Math.sin(frame*0.07)*0.35;
  cx.globalAlpha=pulse*0.4;cx.fillStyle='#ff8800';
  cx.beginPath();cx.ellipse(x+14*sc,y,36*sc,24*sc,0,0,Math.PI*2);cx.fill();
  cx.globalAlpha=1;drawHermitCrab(cx,x,y,frame,sc);cx.restore();
}

function drawDragonMini(cx,x,y,frame,sc){
  sc=sc||1;cx.save();cx.imageSmoothingEnabled=false;
  const p=(rx,ry,w,h,col)=>{if(!col)return;cx.fillStyle=col;cx.fillRect(Math.round(x+rx*sc),Math.round(y+ry*sc),Math.round(w*sc),Math.round(h*sc));};
  const D1='#003366',D2='#004488',D3='#0055aa',D4='#0066cc',DH='#44aaff';
  const E='#ff4400',EW='#ffffff',SC='#002244',W='#ffffff';
  const t=frame*0.1,bob=Math.sin(t)*2;
  // Wings
  p(-30,-20+bob,14,24,D2);p(-36,-16+bob,8,18,D1);p(-40,-10+bob,6,12,SC);
  p(20,-20+bob,14,24,D2);p(34,-16+bob,8,18,D1);p(38,-10+bob,6,12,SC);
  // Body
  p(-10,-10+bob,36,8,D3);p(-14,-4+bob,42,10,D3);p(-14,6+bob,42,10,D3);
  p(-10,16+bob,36,8,D3);p(-6,24+bob,28,6,D2);p(-2,30+bob,20,4,D1);
  // Belly
  p(-8,2+bob,30,12,D4);p(-6,4+bob,26,8,DH);
  // Neck+head
  p(-4,-24+bob,22,14,D3);p(-2,-34+bob,18,12,D3);p(0,-42+bob,14,10,D3);
  // Snout
  p(2,-46+bob,10,6,D2);p(4,-48+bob,6,4,D2);p(8,-50+bob,4,4,D1);
  // Horns
  p(-2,-50+bob,4,10,SC);p(12,-50+bob,4,10,SC);
  // Eyes
  p(-2,-38+bob,6,5,E);p(-1,-37+bob,3,3,EW);p(-1,-37+bob,2,2,E);p(0,-38+bob,1,1,EW);
  p(8,-38+bob,6,5,E);p(9,-37+bob,3,3,EW);p(9,-37+bob,2,2,E);p(10,-38+bob,1,1,EW);
  // Teeth
  p(4,-44+bob,2,4,EW);p(6,-44+bob,2,4,EW);p(8,-44+bob,2,4,EW);
  // Tail
  p(-14,30+bob,10,6,D2);p(-18,34+bob,8,6,D2);p(-20,38+bob,6,5,D1);p(-22,42+bob,5,4,D1);p(-24,45+bob,4,4,SC);
  // Spines
  for(let s=0;s<4;s++){p(-8+s*6,-8+bob,3,6,SC);}
  cx.restore();
}

function drawSeaDragon(cx,x,y,frame,sc){
  // Hải Long Vương — pixel-perfect từ ảnh tham chiếu
  // Grid 66x64 art pixels. Anchor = tâm sprite (col33, row32)
  sc=sc||1; cx.save(); cx.imageSmoothingEnabled=false;
  const bob=Math.sin(frame*0.07)*1.5;
  const ox=Math.round(x-33*sc), oy=Math.round(y-32*sc+bob);
  const p=(c,r,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(ox+c*sc, oy+r*sc, Math.max(1,w*sc), Math.max(1,h*sc));
  };

  // PALETTE — scan từ ảnh
  const K ='#0d2020'; // outline xanh đen
  const D ='#145050'; // teal rất tối
  const T1='#1a6868'; // teal tối (thân chính)
  const T2='#229090'; // teal trung
  const T3='#2aaaaa'; // teal sáng
  const T4='#40c0c0'; // teal nhạt
  const TL='#70d8d8'; // teal highlight/sáng nhất
  const Y1='#806010'; // vàng tối
  const Y2='#b08820'; // vàng trung
  const Y3='#d4b040'; // vàng sáng
  const Y4='#ecd860'; // vàng nhạt
  const O ='#885030'; // nâu cam (đốt bụng tối)
  const RE='#cc1010'; // mắt đỏ
  const WH='#c8e8ec'; // trắng xanh (răng/highlight)
  const B1='#0a1840'; // xanh navy tối (nước)
  const B2='#1030a0'; // xanh navy
  const B3='#2858c8'; // xanh dương
  const BF='#90c8e0'; // bọt xanh nhạt
  const BW='#daf0f8'; // bọt trắng

  // ═══════════════════════════════════════════════════════
  // ĐẦU RỒNG (row 0-17, col 32-65)  
  // Mõm dài sang phải, ngẩng lên, hàm mở
  // ═══════════════════════════════════════════════════════
  // Sừng/Gai đỉnh đầu (row 0-4)
  p(32,0, 2,2,T3); p(34,0,2,3,T2); p(36,1,2,2,T3);
  // Đỉnh đầu (row 3-7)
  p(30,3, 6,2,T2); p(34,3,4,2,T3); p(32,5,6,2,T2);
  p(30,5, 2,2,T1); p(36,5,4,2,T3); p(38,5,2,2,T4);
  // Thân đầu (row 6-12)
  p(28,6, 8,3,T1); p(32,6,6,3,T2); p(36,6,4,3,T3); p(40,6,2,2,T4);
  p(28,9, 8,3,T1); p(32,9,6,3,T2); p(36,9,6,3,T3); p(42,9,2,2,T4);
  p(28,12,8,3,T2); p(34,12,6,3,T3); p(40,12,4,2,T4);
  // Mõm trên (row 8-12, col 40-65)
  p(42,7, 4,2,T2); p(46,7,6,2,T3); p(52,7,4,2,T4); p(56,7,4,2,T3); p(60,7,2,2,T2);
  p(44,9, 4,2,T2); p(48,9,6,2,T3); p(54,9,4,2,T4); p(58,9,4,2,T3); p(62,9,2,2,T2);
  p(42,11,4,2,T1); p(46,11,6,2,T2); p(52,11,6,2,T3); p(58,11,4,2,T2); p(62,11,2,2,T1);
  // Mắt đỏ
  p(40,8, 3,3,RE); p(41,8,1,1,WH); p(42,9,1,1,K);
  // Hàm dưới / miệng mở (row 12-17)
  p(44,12,4,2,T1); p(48,12,6,2,T2); p(54,12,4,2,T1);
  p(46,14,4,2,K);  p(50,14,4,2,K);  // khoang miệng tối
  p(48,13,2,1,WH); p(52,13,2,1,WH); p(56,13,2,1,WH); // răng
  p(46,15,4,2,T1); p(50,15,6,2,T2); p(56,15,4,2,T1);
  p(44,16,4,2,T2); p(48,16,6,2,T3); p(54,16,4,2,T2);
  // Gai cổ/bờm
  p(26,7, 3,2,T1); p(24,8,3,2,T2); p(22,9,3,2,T1);
  p(26,11,3,2,T2); p(24,12,3,2,T1);

  // ═══════════════════════════════════════════════════════
  // CỔ (row 13-30, col 14-32) — cong xuống-trái
  // ═══════════════════════════════════════════════════════
  p(28,13,6,3,T1); p(30,14,4,3,T2); p(28,15,2,2,T3);
  p(24,16,6,3,T1); p(26,17,4,3,T2); p(26,18,2,2,T3);
  p(20,19,6,3,T1); p(22,20,4,3,T2); p(24,20,2,2,T3);
  p(16,22,6,3,T1); p(18,23,4,3,T2); p(20,23,2,2,T3);
  p(14,25,6,3,T1); p(16,26,4,3,T2); p(18,26,2,2,T3);
  p(13,28,6,3,T1); p(15,29,4,3,T2); p(17,29,2,2,T3);
  // Gai lưng cổ
  p(30,16,2,2,T1); p(31,15,1,2,D);
  p(26,20,2,2,T1); p(27,19,1,2,D);
  p(22,23,2,2,T1); p(23,22,1,2,D);
  p(18,26,2,2,T1); p(19,25,1,2,D);

  // ═══════════════════════════════════════════════════════
  // BỤNG VÀNG (row 22-50, col 13-20) — dọc thân chữ S
  // ═══════════════════════════════════════════════════════
  // Dải bụng vàng dọc theo thân
  p(14,22,4,3,Y3); p(15,22,2,3,Y4); p(14,22,1,3,Y2);
  p(14,25,4,3,O);  p(15,25,2,3,Y2); p(14,25,1,3,Y1);
  p(14,28,4,3,Y3); p(15,28,2,3,Y4); p(14,28,1,3,Y2);
  p(14,31,4,3,O);  p(15,31,2,3,Y2); p(14,31,1,3,Y1);
  p(14,34,4,3,Y3); p(15,34,2,3,Y4); p(14,34,1,3,Y2);
  p(14,37,4,3,O);  p(15,37,2,3,Y2); p(14,37,1,3,Y1);
  p(14,40,4,3,Y3); p(15,40,2,3,Y4); p(14,40,1,3,Y2);
  p(15,43,4,3,O);  p(16,43,2,3,Y2); p(15,43,1,3,Y1);
  p(16,46,3,3,Y3); p(17,46,2,3,Y4); p(16,46,1,3,Y2);
  p(17,49,3,2,O);  p(18,49,2,2,Y2);

  // ═══════════════════════════════════════════════════════
  // THÂN GIỮA — xoắn chữ S (col 10-35, row 28-55)
  // ═══════════════════════════════════════════════════════
  // Thân trái đi xuống (row 28-50)
  p(10,28,8,3,T1); p(11,29,6,3,T2); p(13,29,3,2,T3);
  p(10,31,8,3,T1); p(11,32,6,3,T2); p(13,32,3,2,T3);
  p(10,34,8,3,T1); p(11,35,6,3,T2); p(13,35,3,2,T3);
  p(10,37,8,3,T1); p(11,38,6,3,T2); p(13,38,3,2,T3);
  p(10,40,8,3,T1); p(11,41,6,3,T2); p(13,41,3,2,T3);
  p(10,43,8,3,T1); p(11,44,6,3,T2); p(13,44,3,2,T3);
  p(10,46,8,3,T1); p(11,47,6,3,T2); p(13,47,3,2,T3);
  // Gai lưng trái
  p(9,30, 2,2,T1); p(8,31,1,2,D);
  p(9,35, 2,2,T1); p(8,36,1,2,D);
  p(9,40, 2,2,T1); p(8,41,1,2,D);
  p(9,45, 2,2,T1); p(8,46,1,2,D);

  // Thân cong phải (row 32-55, col 18-36)
  p(18,32,8,3,T1); p(20,33,6,3,T2); p(22,33,3,2,T3);
  p(20,35,8,3,T1); p(22,36,6,3,T2); p(24,36,3,2,T3);
  p(22,38,8,3,T1); p(24,39,6,3,T2); p(26,39,3,2,T3);
  p(24,41,8,3,T1); p(26,42,6,3,T2); p(28,42,3,2,T3);
  p(24,44,8,3,T1); p(26,45,6,3,T2); p(28,45,3,2,T3);
  p(22,47,8,3,T1); p(24,48,6,3,T2); p(26,48,3,2,T3);
  p(20,50,8,3,T1); p(22,51,6,3,T2); p(24,51,3,2,T3);
  // Gai lưng phải
  p(33,33,2,2,T1); p(34,34,1,2,D);
  p(35,36,2,2,T1); p(36,37,1,2,D);
  p(33,39,2,2,T1); p(34,40,1,2,D);
  p(32,42,2,2,T1); p(33,43,1,2,D);

  // Đuôi cong vào (row 50-63, col 12-22)
  p(16,53,8,3,T1); p(18,54,6,3,T2); p(14,54,3,2,T3);
  p(14,56,8,3,T1); p(16,57,6,3,T2); p(12,57,3,2,T3);
  p(12,59,8,3,T1); p(14,60,6,3,T2); p(10,60,3,2,T3);
  p(10,62,6,3,T1); p(12,62,4,3,T2);
  // Vây đuôi
  p(6,55, 4,3,T1); p(5,56,3,3,T2); p(4,57,3,2,T1);
  p(5,59, 3,2,T2); p(4,60,2,2,T1);
  p(8,53, 3,2,T2); p(7,54,2,2,T1);
  // Vây sườn giữa
  p(34,45,4,3,T1); p(35,44,3,2,T2); p(36,43,2,3,T1); p(37,42,2,2,T2);
  p(38,41,2,3,T1); p(38,40,2,2,D);

  // ═══════════════════════════════════════════════════════
  // SÓNG BIỂN (row 54-63, full width)
  // ═══════════════════════════════════════════════════════
  const wv=Math.sin(frame*0.09)*1;
  // Lớp nước nền
  p(0,58+wv, 66,5,B1);
  p(0,60+wv, 66,4,B2);
  p(2,62+wv, 62,3,B1);
  // Đỉnh sóng
  p(0,56+wv,  8,3,B2); p(10,55+wv,6,3,B3); p(18,56+wv,8,3,B2);
  p(28,55+wv, 6,3,B3); p(36,56+wv,8,3,B2); p(46,55+wv,6,3,B3);
  p(54,56+wv, 8,3,B2);
  // Bọt trắng xanh đỉnh sóng
  p(2,55+wv,  4,2,BF); p(12,54+wv,4,2,BF); p(22,55+wv,4,2,BF);
  p(32,54+wv, 4,2,BF); p(40,55+wv,4,2,BF); p(50,54+wv,4,2,BF);
  p(6,55+wv,  2,1,BW); p(16,54+wv,2,1,BW); p(26,55+wv,2,1,BW);
  p(38,54+wv, 2,1,BW); p(48,55+wv,2,1,BW); p(58,54+wv,2,1,BW);
  // Bọt vỡ nhỏ
  cx.save(); cx.globalAlpha=0.75;
  p(4,54+wv,  2,1,BW); p(14,53+wv,2,1,BF); p(24,54+wv,2,1,BW);
  p(34,53+wv, 2,1,BF); p(44,54+wv,2,1,BW); p(54,53+wv,2,1,BF);
  cx.restore();

  cx.restore();
}

function drawWizard(cx,x,y,frame){
  const sc=2;
  const d=(px,py,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;cx.fillRect(x+px*sc,y+py*sc,w*sc,h*sc);
  };
  const bob=Math.floor(Math.sin(frame*0.06)*1);
  // Hat tall
  d(4,0,8,1,C.WP3);d(5,1,6,1,C.WP2);d(3,2,10,1,C.WP);
  d(2,3,12,1,C.WP2);d(2,4,12,1,C.WP3);
  d(4,5,8,6,C.WP2);d(5,5,6,6,C.WP);
  // Hat star
  d(7,2,2,1,C.WG);d(6,3,4,1,C.WG);d(7,4,2,1,C.WG);
  // Hat brim
  d(1,11,14,2,C.WP3);d(2,11,12,1,C.WP2);
  // Face
  d(4,10,8,7,C.WF);d(5,11,6,5,'#ffddbb');
  // Beard (long white)
  d(3,14,10,3,'#e8e8f8');d(4,16,8,4,'#d0d0e8');d(5,18,6,4,'#c8c8e0');
  // Eyes
  d(5,11,2,2,'#1a1a4a');d(9,11,2,2,'#1a1a4a');
  d(6,11,1,1,'#8844cc');d(10,11,1,1,'#8844cc');
  // Eyebrows bushy
  d(4,10,3,1,'#aaaacc');d(9,10,3,1,'#aaaacc');
  // Robe body
  d(2,17+bob,12,10,C.WP3);d(3,18+bob,10,9,C.WP2);d(4,18+bob,8,8,C.WP);
  // Robe trim gold
  d(2,17+bob,12,2,C.WG2);d(2,24+bob,12,2,C.WG2);
  // Star patterns on robe
  d(6,19+bob,4,1,C.WP3);d(7,20+bob,2,2,C.WP3);
  // Staff
  d(14,6,1,20,'#886633');d(14,5,1,1,'#aa8844');
  // Crystal orb on staff
  d(13,4,3,3,C.WP3);d(13,4,3,3,C.WP2);d(14,4,1,1,'#ffffff');
  cx.save();cx.globalAlpha=0.6+Math.sin(frame*0.1)*0.3;
  cx.fillStyle=C.WP3;cx.shadowColor=C.WP3;cx.shadowBlur=8;
  cx.fillRect(x+13*sc,y+4*sc,3*sc,3*sc);cx.restore();
  // Sleeves
  d(0,18+bob,3,5,C.WP2);d(13,18+bob,3,5,C.WP2);
  // Hands
  d(0,22+bob,3,3,C.WF);d(13,22+bob,3,3,C.WF);
  // Robe bottom / legs hidden
  d(3,27+bob,10,4,C.WP3);d(4,28+bob,8,4,C.WP2);
  // Boots peeking
  d(4,31+bob,3,2,'#553300');d(9,31+bob,3,2,'#553300');
}

function drawMerchant(cx,x,y,frame){
  const sc=2;
  const d=(px,py,w,h,col)=>{
    if(!col)return;cx.fillStyle=col;cx.fillRect(x+px*sc,y+py*sc,w*sc,h*sc);
  };
  const bob=Math.floor(Math.sin(frame*0.05)*1);
  // Hat (wide merchant hat)
  d(2,1,12,1,C.MH3);d(1,2,14,2,C.MH);d(3,4,10,5,C.MH2);d(4,4,8,4,C.MH);
  // Feather in hat
  d(13,2,2,4,'#ff4455');d(14,2,1,3,'#ff8899');
  // Face
  d(4,8,8,7,C.MF);d(5,9,6,5,'#ffddbb');
  // Full mustache
  d(4,12,8,2,'#6b4420');d(5,12,6,1,'#8B5E3C');
  // Eyes
  d(5,9,2,2,'#553311');d(9,9,2,2,'#553311');
  d(6,9,1,1,'#8B4513');d(10,9,1,1,'#8B4513');
  // Eyebrows
  d(4,8,3,1,'#5a3d1a');d(9,8,3,1,'#5a3d1a');
  // Cheeks rosy
  cx.save();cx.globalAlpha=0.3;cx.fillStyle='#ff8866';
  cx.fillRect(x+4*sc,y+11*sc,2*sc,2*sc);cx.fillRect(x+10*sc,y+11*sc,2*sc,2*sc);cx.restore();
  // Big coat body
  d(1,15+bob,14,12,C.MH);d(2,16+bob,12,11,C.MH2);d(3,16+bob,10,10,C.MH3);
  // Coat lapels
  d(5,16+bob,2,6,C.MH2);d(9,16+bob,2,6,C.MH2);
  // Green vest
  d(5,17+bob,6,7,C.MG);d(6,17+bob,4,7,C.MG2);
  // Buttons
  d(7,18+bob,2,1,C.MC);d(7,20+bob,2,1,C.MC);d(7,22+bob,2,1,C.MC);
  // Coin pouch
  d(9,21+bob,3,4,'#cc8800');d(10,21+bob,2,3,'#ddaa00');
  // Belt
  d(3,23+bob,10,2,'#442200');d(7,23+bob,2,2,C.MC);
  // Sleeves
  d(0,16+bob,2,7,C.MH2);d(14,16+bob,2,7,C.MH2);
  // Hands holding ledger
  d(0,22+bob,3,3,C.MF);d(13,22+bob,3,3,C.MF);
  // Ledger book
  d(14,20+bob,4,5,'#ddccaa');d(14,21+bob,4,4,'#cc9966');
  // Legs
  const loff=frame%2===0?0:-1;
  d(4,26,4,6,'#443322');d(5,27,2,5,'#554433');
  d(8,26+loff,4,6,'#443322');d(9,27+loff,2,5,'#554433');
  // Boots nice
  d(3,31,5,3,'#331100');d(8,31+loff,5,3,'#331100');
  d(3,33,6,2,'#221100');d(8,33+loff,5,2,'#221100');
}

