function drawBattleScene(atk,def,animType){
  const bc=bctx;
  bc.clearRect(0,0,bcv.width,bcv.height);

  // Night battle: shift background to blood red/purple
  const night=isNightTime();
  const nMult=getNightMult();

  // Dynamic battle BG
  const isFireDragonBattle=bMon&&bMon.type==='fire_dragon';
  const isShadowBattle=bMon&&bMon.type==='dragon_shadow';
  const isHacLongBattle=bMon&&bMon.type==='dragon';

  if(isHacLongBattle){
    drawHacLongBG(bc, bcv.width, bcv.height);

  } else if(isShadowBattle){
    // ── ÁM LONG BÓNG TỐI ─────────────────────────────────────
    const bbg=bc.createLinearGradient(0,0,0,bcv.height);
    bbg.addColorStop(0,'#08000f');bbg.addColorStop(0.5,'#100520');bbg.addColorStop(1,'#050008');
    bc.fillStyle=bbg;bc.fillRect(0,0,bcv.width,bcv.height);
    [[20,0,18,95],[400,0,18,95],[190,0,14,90],[240,0,14,90]].forEach(([px,py,pw,ph])=>{
      const pg=bc.createLinearGradient(px,0,px+pw,0);
      pg.addColorStop(0,'#1a1018');pg.addColorStop(0.4,'#241520');pg.addColorStop(1,'#1a1018');
      bc.fillStyle=pg;bc.fillRect(px,py,pw,ph);
      bc.strokeStyle='rgba(255,255,255,0.04)';bc.lineWidth=1;bc.strokeRect(px,py,pw,ph);
    });
    bc.save();bc.globalAlpha=0.06+Math.sin(frameCount*0.1)*0.03;bc.strokeStyle='#8833ff';bc.lineWidth=1;
    for(let i=0;i<3;i++){bc.beginPath();bc.moveTo(210+i*5,0);for(let y=0;y<100;y+=8){bc.lineTo(210+i*5+Math.sin((y+frameCount*2+i*50)*0.3)*4,y);}bc.stroke();}
    bc.restore();

  } else if(isFireDragonBattle){
    // ── HỎA LONG — nền địa ngục lửa ─────────────────────────
    const BW=bcv.width, BH=bcv.height;
    const fbg=bc.createLinearGradient(0,0,0,BH);
    fbg.addColorStop(0,'#150000');fbg.addColorStop(0.4,'#280600');fbg.addColorStop(1,'#3a0a00');
    bc.fillStyle=fbg;bc.fillRect(0,0,BW,BH);
    // Núi lửa xa
    bc.fillStyle='#0f0000';
    bc.beginPath();bc.moveTo(0,BH);
    for(let hm=0;hm<8;hm++){bc.lineTo(hm*60+20,BH*0.42+Math.sin(hm*1.9)*BH*0.14);}
    bc.lineTo(BW,BH);bc.closePath();bc.fill();
    // Nền lửa dưới đất
    const groundY_f=Math.round(BH*0.76);
    const dirtF=bc.createLinearGradient(0,groundY_f,0,BH);
    dirtF.addColorStop(0,'#2a0800');dirtF.addColorStop(1,'#180400');
    bc.fillStyle=dirtF;bc.fillRect(0,groundY_f,BW,BH-groundY_f);
    // Vết nứt dung nham
    bc.save();
    for(let lc=0;lc<6;lc++){
      const lcx=lc*70+30;const glow=0.45+Math.sin(frameCount*0.07+lc)*0.3;
      bc.strokeStyle=`rgba(255,100,0,${glow})`;bc.lineWidth=2;
      bc.shadowColor='#ff4400';bc.shadowBlur=4;
      bc.beginPath();bc.moveTo(lcx,groundY_f);bc.bezierCurveTo(lcx+15,groundY_f+6,lcx+35,groundY_f+2,lcx+50,groundY_f+8);bc.stroke();
    }
    bc.shadowBlur=0;bc.restore();
    // Lửa bập bùng
    bc.save();
    for(let l=0;l<5;l++){
      const lx=50+l*90,lp=0.35+Math.sin(frameCount*0.08+l)*0.2;
      const lg=bc.createRadialGradient(lx,groundY_f,2,lx,groundY_f,32);
      lg.addColorStop(0,`rgba(255,130,0,${lp})`);lg.addColorStop(0.5,`rgba(180,30,0,${lp*0.5})`);lg.addColorStop(1,'transparent');
      bc.fillStyle=lg;bc.beginPath();bc.ellipse(lx,groundY_f,32,8,0,0,Math.PI*2);bc.fill();
    }
    // Tàn lửa bay
    for(let e=0;e<10;e++){
      const ep=(frameCount*0.025+e*0.4)%1;
      const ex=40+e*45+Math.sin(frameCount*0.05+e)*12;
      const ey=groundY_f*(1-ep);
      bc.globalAlpha=ep*(1-ep)*3.5;
      bc.fillStyle=e%2===0?'#ff6600':'#ffaa00';
      bc.beginPath();bc.arc(ex,ey,1.5,0,Math.PI*2);bc.fill();
    }
    bc.restore();

  } else if(undergroundActive && bMon){
    // ── LÒNG ĐẤT — hang động nâu, nhũ đá ────────────────────
    const BW=bcv.width, BH=bcv.height;
    const depth=(typeof undergroundFloor!=='undefined'?undergroundFloor:5)/10;
    const caveBg=bc.createLinearGradient(0,0,0,BH);
    caveBg.addColorStop(0,`hsl(22,${18-depth*8}%,${9-depth*4}%)`);
    caveBg.addColorStop(1,`hsl(12,${12-depth*5}%,${5-depth*3}%)`);
    bc.fillStyle=caveBg;bc.fillRect(0,0,BW,BH);
    // Vết nứt tường
    bc.save();
    for(let cr=0;cr<6;cr++){
      bc.strokeStyle=`rgba(80,40,10,${0.18+cr*0.02})`;bc.lineWidth=1;
      bc.beginPath();bc.moveTo(cr*80+20,0);
      let cy2=0;while(cy2<BH){cy2+=18;bc.lineTo(cr*80+20+Math.sin(cr+cy2)*4,cy2);}
      bc.stroke();
    }
    bc.restore();
    // Nhũ đá trên trần
    bc.fillStyle='#1e1208';
    for(let s=0;s<14;s++){
      const sx=s*32+8+Math.sin(s*2.3)*8;
      const sh=16+Math.sin(s*1.7)*14;
      bc.beginPath();bc.moveTo(sx,0);bc.lineTo(sx+14,0);bc.lineTo(sx+7,sh);bc.closePath();bc.fill();
      // Highlight nhũ đá
      bc.save();bc.globalAlpha=0.18;bc.fillStyle='#7a5030';
      bc.beginPath();bc.moveTo(sx+2,0);bc.lineTo(sx+6,0);bc.lineTo(sx+7,sh*0.6);bc.closePath();bc.fill();bc.restore();
    }
    // Nền đất nâu
    const groundY_c=Math.round(BH*0.76);
    const dirtC=bc.createLinearGradient(0,groundY_c,0,BH);
    dirtC.addColorStop(0,'#3a2010');dirtC.addColorStop(1,'#1e0e06');
    bc.fillStyle=dirtC;bc.fillRect(0,groundY_c,BW,BH-groundY_c);
    bc.fillStyle='#4a2a12';bc.fillRect(0,groundY_c,BW,4);
    // Măng đá từ sàn
    bc.fillStyle='#2e1a0a';
    for(let s=0;s<6;s++){
      const sx=s*68+30+Math.sin(s*1.9)*15;const sh=10+Math.sin(s*1.3)*8;
      bc.beginPath();bc.moveTo(sx,groundY_c);bc.lineTo(sx+10,groundY_c);bc.lineTo(sx+5,groundY_c-sh);bc.closePath();bc.fill();
    }
    // Đuốc
    bc.save();
    for(let t=0;t<3;t++){
      const tx=80+t*160,ty=Math.round(BH*0.22);
      const flicker=0.5+Math.sin(frameCount*0.13+t*1.5)*0.35;
      const tg=bc.createRadialGradient(tx,ty,2,tx,ty,34);
      tg.addColorStop(0,`rgba(255,160,40,${flicker})`);tg.addColorStop(1,'transparent');
      bc.fillStyle=tg;bc.beginPath();bc.arc(tx,ty,34,0,Math.PI*2);bc.fill();
      bc.fillStyle='#8b4513';bc.fillRect(tx-3,ty+3,6,12);
      bc.fillStyle='#ff8800';bc.beginPath();bc.arc(tx,ty,4+flicker*2,0,Math.PI*2);bc.fill();
      bc.fillStyle='#ffee66';bc.beginPath();bc.arc(tx,ty-3,2.5,0,Math.PI*2);bc.fill();
    }
    bc.restore();

  } else if(inOcean && bMon){
    // ── ĐẠI DƯƠNG ────────────────────────────────────────────
    const BW=bcv.width, BH=bcv.height;
    const obg=bc.createLinearGradient(0,0,0,BH);
    obg.addColorStop(0,'#001428');obg.addColorStop(0.6,'#002244');obg.addColorStop(1,'#001830');
    bc.fillStyle=obg;bc.fillRect(0,0,BW,BH);
    bc.save();
    for(let i=0;i<5;i++){
      const lx=60+i*80,lp=0.08+Math.sin(frameCount*0.06+i)*0.04;
      const lg=bc.createRadialGradient(lx,0,0,lx,0,60);
      lg.addColorStop(0,`rgba(0,180,220,${lp})`);lg.addColorStop(1,'transparent');
      bc.fillStyle=lg;bc.fillRect(0,0,BW,BH);
    }
    bc.restore();
    const sandY=Math.round(BH*0.78);
    const sandG=bc.createLinearGradient(0,sandY,0,BH);
    sandG.addColorStop(0,'#1a3a20');sandG.addColorStop(1,'#0d2010');
    bc.fillStyle=sandG;bc.fillRect(0,sandY,BW,BH-sandY);
    bc.save();
    for(let i=0;i<8;i++){
      const bx=30+i*55+Math.sin(frameCount*0.03+i)*10;
      const by=sandY-20-(frameCount*0.5+i*30)%(sandY-10);
      bc.globalAlpha=0.15+Math.sin(frameCount*0.08+i)*0.08;
      bc.strokeStyle='rgba(100,220,255,0.6)';bc.lineWidth=1;
      bc.beginPath();bc.arc(bx,by,3+i%3*2,0,Math.PI*2);bc.stroke();
    }
    bc.restore();

  } else {
    // ── THẾ GIỚI NGOÀI — PIXEL ART như ảnh tham khảo ─────────
    const BW=bcv.width, BH=bcv.height;
    const PS=4; // pixel size for pixel art grid

    // ── Bầu trời pixel ────────────────────────────────────────
    if(night){
      // Đêm: gradient tối xanh navy
      const sky=bc.createLinearGradient(0,0,0,BH*0.62);
      sky.addColorStop(0,'#020818');sky.addColorStop(0.6,'#061230');sky.addColorStop(1,'#0a1c48');
      bc.fillStyle=sky;bc.fillRect(0,0,BW,BH*0.62);
    } else {
      // Ngày: bầu trời xanh pixel art (dải màu ngang như ảnh)
      const skyRows=[
        [0,    0.08, '#5ba4d4'],
        [0.08, 0.18, '#62aad8'],
        [0.18, 0.30, '#6ab2dc'],
        [0.30, 0.42, '#72b8e0'],
        [0.42, 0.55, '#7ec0e8'],
        [0.55, 0.62, '#8ecaee'],
      ];
      skyRows.forEach(([y0,y1,col])=>{
        bc.fillStyle=col;
        bc.fillRect(0,Math.round(BH*y0),BW,Math.round(BH*(y1-y0))+1);
      });
    }

    // ── Sao ban đêm ───────────────────────────────────────────
    if(night){
      bc.save();
      for(let s=0;s<28;s++){
        const sx=((s*67+13)%BW),sy=((s*41+7)%(BH*0.48));
        const twinkle=0.3+Math.sin(frameCount*0.09+s*1.4)*0.4;
        bc.globalAlpha=twinkle;
        bc.fillStyle=s%4===0?'#aaccff':'#ffffff';
        bc.fillRect(Math.round(sx/PS)*PS,Math.round(sy/PS)*PS,s%3===0?2:PS,s%3===0?2:PS);
      }
      // Trăng pixel
      bc.globalAlpha=0.92;
      const moonX=Math.round(BW*0.78/PS)*PS, moonY=Math.round(BH*0.08/PS)*PS;
      const moonPixels=[
        [0,0,4,3],[PS,0,4,3],[-PS,PS,4,3],[0,PS,4,3],[PS,PS,4,3],[2*PS,PS,4,3],
        [-PS,2*PS,4,3],[0,2*PS,4,3],[PS,2*PS,4,3],[2*PS,2*PS,4,3],
        [0,3*PS,4,3],[PS,3*PS,4,3],
      ];
      moonPixels.forEach(([dx,dy,w,h])=>{
        bc.fillStyle='#f0e090';bc.fillRect(moonX+dx,moonY+dy,w,h);
      });
      bc.restore();
    }

    // ── Mây pixel art (giống ảnh) ─────────────────────────────
    if(!night){
      bc.save();
      bc.imageSmoothingEnabled=false;
      // Hàm vẽ mây pixel đơn
      function drawPixelCloud(cx,cy,scale){
        const S=PS*scale;
        // Mây trắng với viền xanh nhạt – style pixel
        const cloudShape=[
          // [dx_blocks, dy_blocks, w_blocks, h_blocks]
          [2,1,3,1],[1,0,5,1],[0,1,7,2],[1,3,5,1],[2,4,3,1], // body
        ];
        cloudShape.forEach(([bx,by,bw,bh])=>{
          bc.fillStyle='#f0f8ff';
          bc.fillRect(cx+bx*S,cy+by*S,bw*S,bh*S);
        });
        // Highlight trên cùng
        [[2,1,3,1],[1,0,5,1]].forEach(([bx,by,bw])=>{
          bc.fillStyle='#ffffff';
          bc.fillRect(cx+bx*S,cy+by*S,bw*S,Math.max(2,S*0.5));
        });
        // Bóng tối dưới
        [[0,2,7,1],[1,3,5,1]].forEach(([bx,by,bw])=>{
          bc.fillStyle='rgba(180,210,240,0.55)';
          bc.fillRect(cx+bx*S,cy+by*S,bw*S,S*0.5);
        });
      }
      // Mây trôi nhẹ (frameCount để animate)
      const cloudDrift=(frameCount*0.18)%BW;
      const clouds=[
        {bx:20,  by:Math.round(BH*0.07), sc:1.1},
        {bx:140, by:Math.round(BH*0.04), sc:0.9},
        {bx:260, by:Math.round(BH*0.09), sc:1.0},
        {bx:370, by:Math.round(BH*0.05), sc:0.85},
      ];
      clouds.forEach(({bx,by,sc})=>{
        const cx=((bx+cloudDrift)%BW+BW)%BW;
        drawPixelCloud(cx,by,sc);
        // Vẽ thêm lần nữa nếu mây gần rìa phải để wrap mượt
        if(cx+100>BW) drawPixelCloud(cx-BW,by,sc);
      });
      bc.restore();
    }

    // ── Hàng cây pixel art phía sau (tán tròn kiểu ảnh) ───────
    const treeLineY=Math.round(BH*0.55); // đường cỏ cây phía xa
    bc.save();
    bc.imageSmoothingEnabled=false;

    function drawPixelTree(tx,ty,sz,isDark){
      // Thân cây pixel
      const trunkW=Math.max(4,Math.round(sz*0.18/PS)*PS);
      const trunkH=Math.round(sz*0.38);
      const trunkX=tx-trunkW/2;
      const trunkY=ty-trunkH;
      const trunkDark=isDark?'#1a0c04':'#5c3010';
      const trunkMid=isDark?'#220e06':'#7a4218';
      bc.fillStyle=trunkDark;bc.fillRect(trunkX,trunkY,trunkW,trunkH);
      bc.fillStyle=trunkMid;bc.fillRect(trunkX+2,trunkY+2,Math.max(2,trunkW-4),trunkH-4);

      // Tán cây tròn pixel (dùng lưới pixel)
      const R=Math.round(sz*0.46);
      const centerX=tx, centerY=ty-trunkH-R*0.7;
      const canopyColors=isDark
        ?['#0e2408','#142e0a','#0a1c06','#183210']
        :['#2e8018','#3a9820','#269010','#44a828','#1e6a10'];
      const darkerEdge=isDark?'#0a1c06':'#1e6a10';
      const highlight=isDark?'#1c3a0e':'#4ab830';

      // Vẽ tán theo lưới pixel
      const step=PS*1;
      for(let py=centerY-R;py<=centerY+R;py+=step){
        for(let px=centerX-R;px<=centerX+R;px+=step){
          const dist=Math.sqrt((px-centerX)**2+(py-centerY)**2);
          if(dist<=R){
            // Màu theo khoảng cách từ tâm
            let col;
            if(dist<R*0.25) col=highlight;
            else if(dist<R*0.55) col=canopyColors[1];
            else if(dist<R*0.78) col=canopyColors[0];
            else col=darkerEdge;
            // Thêm variation dựa trên vị trí
            const noiseIdx=Math.abs(Math.round(px/PS+py/PS*3))%canopyColors.length;
            if(dist>R*0.3 && dist<R*0.85) col=canopyColors[noiseIdx];
            bc.fillStyle=col;
            bc.fillRect(Math.round(px/PS)*PS,Math.round(py/PS)*PS,step,step);
          }
        }
      }
      // Highlight phía trên trái (ánh sáng)
      if(!isDark){
        bc.save();bc.globalAlpha=0.35;
        bc.fillStyle='#80e840';
        for(let py=centerY-R;py<=centerY-R*0.2;py+=step){
          for(let px=centerX-R*0.6;px<=centerX+R*0.2;px+=step){
            const dist=Math.sqrt((px-centerX)**2+(py-centerY)**2);
            if(dist<=R*0.75) bc.fillRect(Math.round(px/PS)*PS,Math.round(py/PS)*PS,step,step);
          }
        }
        bc.restore();
      }
    }

    // Cây to 2 bên (như ảnh tham khảo)
    if(!night){
      // Cây trái to
      drawPixelTree(Math.round(BW*0.18),treeLineY+Math.round(BH*0.1),56,false);
      // Cây phải to
      drawPixelTree(Math.round(BW*0.78),treeLineY+Math.round(BH*0.06),60,false);
      // Cây nhỏ giữa/nền
      drawPixelTree(Math.round(BW*0.5),treeLineY+Math.round(BH*0.03),32,false);
    } else {
      drawPixelTree(Math.round(BW*0.18),treeLineY+Math.round(BH*0.1),56,true);
      drawPixelTree(Math.round(BW*0.78),treeLineY+Math.round(BH*0.06),60,true);
      drawPixelTree(Math.round(BW*0.5),treeLineY+Math.round(BH*0.03),32,true);
    }
    bc.restore();

    // ── Dải cỏ nền xa (hàng pixel ngang) ─────────────────────
    const grassFarY=treeLineY;
    if(!night){
      // Nhiều lớp cỏ xa
      [[0,'#2a6e18'],[PS,'#348820'],[PS*2,'#3a9224'],[PS*3,'#3e9828']].forEach(([dy,col])=>{
        bc.fillStyle=col;bc.fillRect(0,grassFarY+dy,BW,PS);
      });
      // Bush/bụi cỏ xa pixel - hàng ngang
      bc.fillStyle='#2e8018';
      for(let bx=0;bx<BW;bx+=PS*3){
        const bh=(Math.sin(bx*0.13+7)*2+3);
        bc.fillRect(bx,grassFarY-Math.round(bh/PS)*PS,PS*3,Math.round(bh/PS)*PS);
      }
    } else {
      [[0,'#0c2008'],[PS,'#0e2a0a'],[PS*2,'#102c0c']].forEach(([dy,col])=>{
        bc.fillStyle=col;bc.fillRect(0,grassFarY+dy,BW,PS);
      });
    }

    // ── Dải cỏ pixel chính (ground level) ────────────────────
    const groundY2=Math.round(BH*0.78);
    bc.save();
    bc.imageSmoothingEnabled=false;
    if(!night){
      // Cỏ xanh nhiều lớp pixel art
      const grassLayers=[
        {y:0,   col:'#48b030', h:PS},
        {y:PS,  col:'#3ea028', h:PS},
        {y:PS*2,col:'#369020', h:PS},
        {y:PS*3,col:'#2e8018', h:PS*2},
        {y:PS*5,col:'#286a14', h:PS},
      ];
      grassLayers.forEach(({y,col,h})=>{
        bc.fillStyle=col;bc.fillRect(0,groundY2+y,BW,h);
      });
      // Ngọn cỏ pixel lắc nhẹ
      for(let gx=0;gx<BW;gx+=PS){
        if((gx/PS)%2===0) continue;
        const swing=Math.round(Math.sin(frameCount*0.05+(gx*0.08))*1)*PS;
        const gh=PS*(2+((gx/PS)%3));
        bc.fillStyle=(gx/PS)%3===0?'#5acc3a':'#48b030';
        bc.fillRect(gx+swing,groundY2-gh,PS,gh);
      }
      // Bụi cỏ thưa trên cỏ
      bc.fillStyle='#3ea028';
      for(let bx=8;bx<BW;bx+=PS*6){
        const bh=PS*2+((bx/PS)%3)*PS;
        const bw=PS*4;
        bc.fillRect(bx,groundY2-bh,bw,bh);
        bc.fillStyle='#4ab82e';bc.fillRect(bx+PS,groundY2-bh-PS,PS*2,PS);bc.fillStyle='#3ea028';
      }
    } else {
      const grassDarkLayers=[
        {y:0,   col:'#183810', h:PS},
        {y:PS,  col:'#142e0e', h:PS},
        {y:PS*2,col:'#10260a', h:PS*2},
        {y:PS*4,col:'#0c1e08', h:PS*2},
      ];
      grassDarkLayers.forEach(({y,col,h})=>{
        bc.fillStyle=col;bc.fillRect(0,groundY2+y,BW,h);
      });
      // Ngọn cỏ đêm
      for(let gx=0;gx<BW;gx+=PS){
        if((gx/PS)%2===0) continue;
        const swing=Math.round(Math.sin(frameCount*0.05+(gx*0.08))*1)*PS;
        const gh=PS*(1+((gx/PS)%3));
        bc.fillStyle='#1e3c14';
        bc.fillRect(gx+swing,groundY2-gh,PS,gh);
      }
    }

    // ── Đất nâu pixel dưới cỏ ─────────────────────────────────
    const dirtY=groundY2+PS*6;
    const dirtLayers=night
      ?[['#1e0e04',0],['#180a02',PS],['#120802',PS*2],['#0e0602',PS*3]]
      :[['#7a4828',0],['#6a3a1c',PS],['#5c3014',PS*2],['#4e2810',PS*3],['#3e2008',PS*4]];
    dirtLayers.forEach(([col,dy])=>{
      bc.fillStyle=col;bc.fillRect(0,dirtY+dy,BW,PS+(dy===dirtLayers[dirtLayers.length-1][1]?BH:0));
    });
    // Đất fill hết xuống đáy
    bc.fillStyle=night?'#0a0402':dirtLayers[dirtLayers.length-1][0];
    bc.fillRect(0,dirtY+dirtLayers.length*PS,BW,BH);

    bc.restore();
  }

  // ── ATTACK ANIMATIONS (weapon-specific) ─────────────────
  if(atk){
    bc.save();
    const anim=animType||bLastAnim||'atk';
    // Common screen flash
    bc.globalAlpha=0.14;
    const flashColors={
      atk:'#ffff88', fire:'#ff6600', fireblast:'#ff4400',
      thunder:'#aaddff', double:'#88ffcc', water:'#44aaff',
      magic:'#cc88ff', windblast:'#88ffaa', burn:'#ff8800',
      shadow:'#440088', crit:'#ff4400'
    };
    const fl=bc.createRadialGradient(300,65,5,300,65,200);
    fl.addColorStop(0,flashColors[anim]||'#ffff88');fl.addColorStop(1,'transparent');
    bc.fillStyle=fl;bc.fillRect(0,0,bcv.width,bcv.height);
    bc.restore();

    bc.save();
    if(anim==='atk'||anim==='double'){
      // Slash lines from player to monster
      const slashes=anim==='double'?2:1;
      bc.strokeStyle='#ffff88';bc.lineWidth=2.5;bc.shadowColor='#ffff00';bc.shadowBlur=10;bc.globalAlpha=0.8;
      for(let si=0;si<slashes;si++){
        const oy=si*14-7;
        bc.beginPath();let lx=145,ly=68+oy;bc.moveTo(lx,ly);
        while(lx<295){lx+=18+Math.random()*12;ly=68+oy+(Math.random()-0.5)*14;bc.lineTo(lx,ly);}
        bc.stroke();
      }
      // Impact sparks
      for(let s=0;s<7;s++){
        const sx=285+Math.random()*20,sy=65+(Math.random()-0.5)*22;
        bc.fillStyle='#ffee44';bc.beginPath();bc.arc(sx,sy,1+Math.random()*2.5,0,Math.PI*2);bc.fill();
      }
    }
    else if(anim==='fire'||anim==='fireblast'||anim==='burn'){
      // ── PIXEL ART FIREBALL flying from player to monster ─────
      const BW=bcv.width, BH=bcv.height;
      const ps=5; // pixel size
      // Fireball position: travels from player (x≈110) to monster (x≈290)
      const fbProgress=0.65; // snapshot at ~2/3 of travel
      const fbX=Math.round(110+fbProgress*(290-110));
      const fbY=68;

      // ── Fireball core (pixel orb, lấy từ ảnh: vòng tròn cam/vàng) ──
      const fbPixels=[
        // glow trail (left of ball — hướng bay)
        ['#cc2200',-12,-1,2,2],['#cc2200',-14,0,2,2],['#dd3300',-10,-1,3,2],
        ['#ee5500',-8,0,3,3],['#ff6600',-6,-1,4,3],['#ff8800',-5,0,5,4],
        // ball body
        ['#ff8800',-3,-4,8,3],['#ff6600',-4,-3,10,6],['#ff4400',-4,-1,10,5],
        ['#ff6600',-3, 2, 8,3],
        // yellow center
        ['#ffaa00',-2,-3, 6,2],['#ffcc00',-1,-2, 4,4],['#ffee00', 0,-1, 2,2],
        // white hot core
        ['#ffffff', 0,-1, 1,1],
        // orange outer ring
        ['#ff4400',-5,-5,10,2],['#ff4400',-5, 3,10,2],
        ['#ff4400',-6,-4, 2,8],['#ff4400', 4,-4, 2,8],
        // spark particles around ball
        ['#ff8800', 6,-5, 2,2],['#ffaa00', 7,-2, 2,2],['#ff6600', 6, 2, 2,2],
        ['#ff4400',-8,-6, 2,2],['#cc2200',-9,-2, 2,2],['#ff6600',-8, 3, 2,2],
        ['#ffcc00', 8,-6, 2,2],['#ff8800',-10,-4, 2,2],
        // scattered outer sparks
        ['#ff6600', 9,-8, 2,2],['#ff4400',-11,-7, 2,2],
        ['#ffaa00', 3,-9, 2,2],['#dd3300',-5,-8, 2,2],
        ['#ff8800', 2, 5, 2,2],['#ff4400',-3, 6, 2,2],
      ];
      bc.save();
      bc.imageSmoothingEnabled=false;
      fbPixels.forEach(([col,dx,dy,w,h])=>{
        bc.fillStyle=col;
        bc.fillRect(fbX+dx*ps, fbY+dy*ps, w*ps, h*ps);
      });
      // Glow halo
      bc.globalAlpha=0.35;
      const fg2=bc.createRadialGradient(fbX,fbY,2,fbX,fbY,28);
      fg2.addColorStop(0,'#ffee00');fg2.addColorStop(0.4,'#ff6600');fg2.addColorStop(1,'transparent');
      bc.fillStyle=fg2;bc.beginPath();bc.arc(fbX,fbY,28,0,Math.PI*2);bc.fill();
      bc.restore();

      // ── Impact flash on monster ─────────────────────────────
      bc.save();bc.globalAlpha=0.45;
      const impG=bc.createRadialGradient(300,70,3,270,80,38);
      impG.addColorStop(0,'#ffee00');impG.addColorStop(0.3,'#ff6600');impG.addColorStop(1,'transparent');
      bc.fillStyle=impG;bc.beginPath();bc.arc(300,70,38,0,Math.PI*2);bc.fill();
      bc.restore();

      // Burn label
      if(anim==='burn'||bBurnTurns>0){
        bc.save();bc.globalAlpha=0.95;bc.fillStyle='#ff4400';bc.font='bold 10px serif';bc.textAlign='center';
        bc.shadowColor='#ff2200';bc.shadowBlur=6;
        bc.fillText('🔥 THIÊU ĐỐT!',_isTouchDevice?280:300,22);bc.restore();
      }
    }
    else if(anim==='thunder'){
      // Lightning bolt from top of monster downward
      bc.strokeStyle='#aaddff';bc.lineWidth=3;bc.shadowColor='#ffffff';bc.shadowBlur=20;bc.globalAlpha=0.95;
      bc.beginPath();
      let tx=300,ty=0;bc.moveTo(tx,ty);
      while(ty<75){ty+=12;tx+=((Math.random()-0.5)*22);bc.lineTo(tx,ty);}
      bc.stroke();
      // Secondary thinner bolt
      bc.strokeStyle='#ffffff';bc.lineWidth=1;bc.shadowBlur=8;bc.globalAlpha=0.6;
      bc.beginPath();tx=300;ty=0;bc.moveTo(tx,ty);
      while(ty<75){ty+=10;tx+=((Math.random()-0.5)*18);bc.lineTo(tx,ty);}
      bc.stroke();
      // Electric glow at monster
      const eg=bc.createRadialGradient(300,70,2,300,70,30);
      eg.addColorStop(0,'rgba(150,200,255,0.8)');eg.addColorStop(1,'transparent');
      bc.fillStyle=eg;bc.globalAlpha=0.7;bc.beginPath();bc.arc(300,70,30,0,Math.PI*2);bc.fill();
      // Stun stars around monster
      if(bStunned){
        bc.fillStyle='#ffff00';bc.font='12px serif';bc.globalAlpha=0.9;
        ['⭐','★','⭐'].forEach((s,i)=>bc.fillText(s,278+i*18,45));
      }
    }
    else if(anim==='water'){
      // Blue water droplets arc
      for(let d=0;d<8;d++){
        const t=d/7;
        const wx=120+t*125, wy=80-Math.sin(t*Math.PI)*35+t*10;
        const wr=3+Math.random()*3;
        const dg=bc.createRadialGradient(wx,wy,0,wx,wy,wr);
        dg.addColorStop(0,'#aaddff');dg.addColorStop(1,'rgba(68,170,255,0.1)');
        bc.fillStyle=dg;bc.globalAlpha=0.4+t*0.5;
        bc.beginPath();bc.arc(wx,wy,wr,0,Math.PI*2);bc.fill();
      }
      bc.fillStyle='#44aaff';bc.font='12px serif';bc.globalAlpha=0.9;
      bc.fillText('💧+MANA',55,30);
    }
    else if(anim==='windblast'){
      // Wind ball flying at monster
      const wg=bc.createRadialGradient(295,68,3,245,90,28);
      wg.addColorStop(0,'rgba(200,255,200,0.9)');wg.addColorStop(0.5,'rgba(100,220,100,0.5)');wg.addColorStop(1,'transparent');
      bc.fillStyle=wg;bc.globalAlpha=0.8;bc.beginPath();bc.arc(245,90,28,0,Math.PI*2);bc.fill();
      // 3 red arrows falling on monster
      bc.fillStyle='#ff4444';bc.font='bold 14px serif';bc.globalAlpha=0.9;
      ['↓','↓','↓'].forEach((a,i)=>bc.fillText(a,284+i*10,55-(i%2)*8));
      // Wind spiral
      bc.strokeStyle='rgba(180,255,180,0.7)';bc.lineWidth=1.5;bc.globalAlpha=0.6;
      bc.beginPath();
      for(let a2=0;a2<Math.PI*3;a2+=0.15){
        const wr=a2*4,wx2=295+wr*Math.cos(a2),wy2=68+wr*Math.sin(a2)*0.4;
        if(a2<0.15)bc.moveTo(wx2,wy2);else bc.lineTo(wx2,wy2);
      }
      bc.stroke();
    }
    else if(anim==='magic'){
      // Purple magic orb
      const mg=bc.createRadialGradient(295,68,3,245,90,26);
      mg.addColorStop(0,'#ffffff');mg.addColorStop(0.4,'#cc44ff');mg.addColorStop(1,'transparent');
      bc.fillStyle=mg;bc.globalAlpha=0.85;bc.beginPath();bc.arc(245,90,26,0,Math.PI*2);bc.fill();
      // Stars
      for(let s2=0;s2<5;s2++){
        const a3=s2/5*Math.PI*2;
        bc.fillStyle='#ffaa44';bc.globalAlpha=0.7;bc.font='10px serif';
        bc.fillText('✦',290+Math.cos(a3)*22,65+Math.sin(a3)*14);
      }
    }
    else if(anim==='shadow'){
      // Dark void tendrils from monster toward player
      bc.strokeStyle='#8800cc';bc.lineWidth=2;bc.shadowColor='#440088';bc.shadowBlur=12;bc.globalAlpha=0.85;
      for(let t=0;t<4;t++){
        bc.beginPath();let sx=295,sy=68;bc.moveTo(sx,sy);
        while(sx>90){sx-=22;sy+=( Math.random()-0.5)*20;bc.lineTo(sx,sy);}
        bc.stroke();
      }
      // Shadow wisp on player
      const swg=bc.createRadialGradient(75,70,3,75,70,30);
      swg.addColorStop(0,'rgba(100,0,180,0.7)');swg.addColorStop(1,'transparent');
      bc.fillStyle=swg;bc.globalAlpha=0.6;bc.beginPath();bc.arc(75,70,30,0,Math.PI*2);bc.fill();
      bc.fillStyle='#cc44ff';bc.font='bold 10px serif';bc.globalAlpha=0.9;
      bc.fillText('🌑 ÁM HẮC!',55,28);
    }
    bc.restore();
  }

  // Soul state overlay on monster (Ám Long linh hồn)
  if(bShadowSoulState){
    bc.save();
    const soulPulse=0.12+Math.sin(frameCount*0.25)*0.08;
    const sg2=bc.createRadialGradient(305,70,5,305,70,60);
    sg2.addColorStop(0,'rgba(160,0,255,'+soulPulse*3+')');sg2.addColorStop(1,'transparent');
    bc.fillStyle=sg2;bc.beginPath();bc.arc(305,70,60,0,Math.PI*2);bc.fill();
    // Ghost shimmer streaks
    bc.strokeStyle='rgba(180,80,255,0.3)';bc.lineWidth=1;
    for(let gi=0;gi<5;gi++){
      bc.beginPath();bc.moveTo(265+Math.random()*80,50+Math.random()*40);
      bc.lineTo(265+Math.random()*80,50+Math.random()*40);bc.stroke();
    }
    bc.fillStyle='#cc44ff';bc.font='bold 9px serif';bc.globalAlpha=0.8+Math.sin(frameCount*0.2)*0.2;
    bc.fillText('👻 LINH HỒN x'+bShadowSoulTurns,270,18);
    bc.restore();
  }
  // Shadow debuff on player
  // Cập nhật text turns cho debuff Hắc Long
  if(bHacDmgDebuff){
    document.getElementById('hac-dmg-tag').textContent='🔮 QUẢ CẦU HẮC ÁM — Sát thương -40% ('+bHacDmgTurns+' vòng)';
  }
  if(bHacDefDebuff){
    document.getElementById('hac-def-tag').textContent='🌑 HƠI THỞ BÓNG TỐI — Phòng thủ -50% ('+bHacDefTurns+' vòng)';
  }
  if(bShadowDmgDebuff){
    bc.save();bc.globalAlpha=0.08+Math.sin(frameCount*0.15)*0.04;
    const dg2=bc.createRadialGradient(75,70,5,75,70,50);
    dg2.addColorStop(0,'rgba(80,0,150,0.8)');dg2.addColorStop(1,'transparent');
    bc.fillStyle=dg2;bc.beginPath();bc.arc(75,70,50,0,Math.PI*2);bc.fill();
    bc.restore();
    bc.save();bc.fillStyle='#aa44ff';bc.font='8px serif';bc.globalAlpha=0.8;
    bc.fillText('👁-50%×'+bShadowDebuffTurns,28,22);bc.restore();
  }

  // Wind shield aura around player (persistent when active)
  if(bWindShield){
    bc.save();bc.globalAlpha=0.25+Math.sin(frameCount*0.15)*0.12;
    const sg=bc.createRadialGradient(80,68,18,80,68,40);
    sg.addColorStop(0,'transparent');sg.addColorStop(0.7,'rgba(100,255,100,0.5)');sg.addColorStop(1,'transparent');
    bc.fillStyle=sg;bc.beginPath();bc.arc(70,90,40,0,Math.PI*2);bc.fill();
    bc.strokeStyle='rgba(150,255,150,0.4)';bc.lineWidth=2;
    bc.beginPath();bc.arc(70,90,36,0,Math.PI*2);bc.stroke();
    bc.restore();
  }

  if(def){
    bc.save();bc.globalAlpha=0.22;
    const sf=bc.createRadialGradient(80,76,5,80,76,100);
    sf.addColorStop(0,'#4499ff');sf.addColorStop(1,'transparent');
    bc.fillStyle=sf;bc.fillRect(0,0,170,160);
    bc.restore();
  }

  // ── GROUND ───────────────────────────────────────────────────
  const BW=bcv.width, BH=bcv.height;
  const groundY=BH-52;
  const gnd=bc.createLinearGradient(0,groundY,0,BH);
  gnd.addColorStop(0,'#2d1c3a');gnd.addColorStop(1,'#160c22');
  bc.fillStyle=gnd;bc.fillRect(0,groundY,BW,BH-groundY);
  bc.save();bc.globalAlpha=0.18;bc.strokeStyle='#ffffff';bc.lineWidth=0.5;
  for(let tx=0;tx<BW;tx+=40){bc.beginPath();bc.moveTo(tx,groundY);bc.lineTo(tx,BH);bc.stroke();}
  bc.beginPath();bc.moveTo(0,groundY+20);bc.lineTo(BW,groundY+20);bc.stroke();
  bc.restore();
  // Bỏ thanh cỏ xanh trong battle

  // ── AMBIENT GLOW ─────────────────────────────────────────────
  bc.save();bc.globalAlpha=0.10+Math.sin(frameCount*0.07)*0.04;
  const ag=bc.createRadialGradient(BW/2,BH*0.55,5,BW/2,BH*0.55,120);
  ag.addColorStop(0,'#8833ff');ag.addColorStop(1,'transparent');
  bc.fillStyle=ag;bc.fillRect(0,0,BW,BH);
  bc.restore();

  // ── PLAYER KNIGHT (left) ─────────────────────────────────────
  const pShake=def?(Math.sin(frameCount*0.5)*3):0;
  if(def){
    bc.save();bc.globalAlpha=0.5+Math.sin(frameCount*0.3)*0.3;
    bc.strokeStyle='#4499ff';bc.lineWidth=2;bc.shadowColor='#4499ff';bc.shadowBlur=8;
    bc.beginPath();bc.arc(74+pShake,groundY-40,28,0,Math.PI*2);bc.stroke();
    bc.restore();
  }
  // Animation knight trong battle
  // Backup và patch P.attackAnim để drive animation
  const _savedAtk=P.attackAnim;
  if(atk && bKnightAtkAnim>0){ P.attackAnim=bKnightAtkAnim; bKnightAtkAnim=Math.max(0,bKnightAtkAnim-4); }
  else P.attackAnim=0;
  drawKnight(bc, 36+pShake, groundY-80, false, false, frameCount, !atk);
  P.attackAnim=_savedAtk; // restore
  // Persistent burn flames ở chân player khi đang bị thiêu đốt
  if(bPlayerBurnTurns>0 && !FX.active){
    // Vẽ trực tiếp lên fxctx (persistent, không cần FX loop)
    const _f=frameCount%65;
    FX.drawFrame_playerBurn.call({MX:FX.MX,MY:FX.MY,PX:FX.PX,PY:FX.PY},_f,65);
  }
  // Hurt flash: tint đỏ khi bị đánh
  if(def){
    bc.save();bc.globalAlpha=0.25+Math.sin(frameCount*0.4)*0.15;
    bc.fillStyle='#ff2200';
    bc.fillRect(36+pShake-2,groundY-80,56,84);
    bc.restore();
  }

  // ── DEBUFF VISUALS trên người knight ─────────────────────────
  const kx=62+pShake, ky=groundY-40; // tâm knight
  const kHead=groundY-84;            // trên đỉnh đầu

  // 🔮 Quả Cầu Hắc Ám: hào quang tím xung quanh người, particles xoay
  if(bHacDmgDebuff){
    bc.save();
    // Hào quang tím nhịp đập
    const pulse=0.25+Math.sin(frameCount*0.15)*0.12;
    const dg=bc.createRadialGradient(kx,ky,8,kx,ky,36);
    dg.addColorStop(0,`rgba(160,0,255,${pulse})`);
    dg.addColorStop(0.6,`rgba(100,0,200,${pulse*0.5})`);
    dg.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=dg;
    bc.beginPath();bc.arc(kx,ky,36,0,Math.PI*2);bc.fill();
    // 3 orb nhỏ xoay quanh người
    for(let i=0;i<3;i++){
      const a=frameCount*0.07+i*2.09;
      const ox=Math.cos(a)*28, oy=Math.sin(a)*20;
      bc.globalAlpha=0.8;
      const og=bc.createRadialGradient(kx+ox,ky+oy,0,kx+ox,ky+oy,5);
      og.addColorStop(0,'rgba(220,120,255,0.9)');
      og.addColorStop(1,'rgba(120,0,200,0)');
      bc.fillStyle=og;
      bc.beginPath();bc.arc(kx+ox,ky+oy,5,0,Math.PI*2);bc.fill();
    }
    bc.globalAlpha=1;
    // Icon + số vòng trên đầu
    bc.font='bold 8px serif';bc.textAlign='center';
    bc.shadowColor='#9900ff';bc.shadowBlur=6;
    bc.fillStyle='#cc88ff';
    bc.fillText('🔮 -40% ATK',kx,kHead-2);
    bc.fillStyle='rgba(80,0,120,0.7)';
    bc.fillRect(kx-18,kHead+2,36,9);
    bc.fillStyle='#ff88ff';bc.font='bold 7px serif';
    bc.fillText(bHacDmgTurns+' vòng',kx,kHead+9);
    bc.shadowBlur=0;
    bc.restore();
  }

  // 🌑 Hơi Thở Bóng Tối: bóng tối bao phủ, khiên vỡ
  if(bHacDefDebuff){
    bc.save();
    // Lớp tối phủ lên người
    const dp=0.18+Math.sin(frameCount*0.12)*0.08;
    bc.globalAlpha=dp;
    bc.fillStyle='#000022';
    bc.beginPath();bc.ellipse(kx,ky,24,38,0,0,Math.PI*2);bc.fill();
    // Viền tối nhấp nháy
    bc.globalAlpha=0.5+Math.sin(frameCount*0.1)*0.2;
    bc.strokeStyle='#440066';bc.lineWidth=2;
    bc.setLineDash([4,3]);
    bc.beginPath();bc.ellipse(kx,ky,28,42,0,0,Math.PI*2);bc.stroke();
    bc.setLineDash([]);
    // Smoke particles nhỏ bốc lên
    for(let i=0;i<4;i++){
      const sx=kx-12+i*8;
      const sy=ky-20+Math.sin(frameCount*0.08+i*1.2)*6;
      bc.globalAlpha=0.35+Math.sin(frameCount*0.1+i)*0.15;
      bc.fillStyle='#220033';
      bc.beginPath();bc.arc(sx,sy,4+i%2*2,0,Math.PI*2);bc.fill();
    }
    bc.globalAlpha=1;
    // Icon + số vòng
    const yOff = bHacDmgDebuff ? kHead-14 : kHead-2; // tránh chồng lên nhau
    bc.font='bold 8px serif';bc.textAlign='center';
    bc.shadowColor='#440066';bc.shadowBlur=6;
    bc.fillStyle='#aa66dd';
    bc.fillText('🌑 -50% DEF',kx,yOff);
    bc.fillStyle='rgba(30,0,50,0.7)';
    bc.fillRect(kx-18,yOff+2,36,9);
    bc.fillStyle='#cc88ff';bc.font='bold 7px serif';
    bc.fillText(bHacDefTurns+' vòng',kx,yOff+9);
    bc.shadowBlur=0;
    bc.restore();
  }

  // ── MONSTER (right, faces LEFT toward player) ────────────────
  const mShake=atk?(Math.sin(frameCount*0.5)*4):0;
  if(atk){
    bc.save();bc.globalAlpha=0.4;
    bc.strokeStyle='#ff4400';bc.lineWidth=2;bc.shadowColor='#ff2200';bc.shadowBlur=10;
    bc.beginPath();bc.arc(Math.round(BW*0.78)+mShake,groundY-55,26,0,Math.PI*2);bc.stroke();
    bc.restore();
  }
  if(bMon){
    const mspr=bMon.type;
    const mframe=Math.floor(frameCount/7);
    const MCX=Math.round(BW*0.78);
    const MGY=groundY;
    if(night){
      const mScale=0.9+nMult*0.15;
      bc.save();
      const aura=bc.createRadialGradient(MCX,MGY-55,5,MCX,MGY-55,70);
      const auraC=mspr==='orc'?'rgba(180,0,255,':mspr==='sea_dragon'||mspr==='seadragon'?'rgba(0,180,160,':'rgba(220,0,40,';
      aura.addColorStop(0,auraC+(0.25+Math.sin(frameCount*0.08)*0.15)+')');
      aura.addColorStop(1,'rgba(0,0,0,0)');
      bc.fillStyle=aura;bc.beginPath();bc.arc(MCX,MGY-55,70,0,Math.PI*2);bc.fill();
      bc.translate(MCX,MGY);bc.scale(mScale,mScale);bc.translate(-MCX,-MGY);
      if(mspr==='goblin')      drawGoblin(bc,MCX-16+mShake,MGY-56,false,mframe);
      else if(mspr==='bat')    drawBat(bc,MCX-20+mShake,MGY-28,mframe);
      else if(mspr==='orc')    drawOrc(bc,MCX-22+mShake,MGY-78,false,mframe);
      else if(mspr==='sea_crab')    drawSeaCrab(bc,MCX-36+mShake,MGY-60,mframe,1.5);
      else if(mspr==='hermit_crab') drawHermitCrab(bc,MCX-26+mShake,MGY-66,mframe,1);
      else if(mspr==='big_crab')    drawBigCrab(bc,MCX-44+mShake,MGY-68,mframe,2.0);
      else if(mspr==='hermit_boss') drawHermitBoss(bc,MCX-26+mShake,MGY-66,mframe,1);
      else if(mspr==='octopus')     drawOctopus(bc,MCX-28+mShake,MGY-100,mframe,2.8);
      else if(mspr==='squid')       drawSquid(bc,MCX-24+mShake,MGY-108,mframe,2.6);
      else if(mspr==='shark'){
        bc.save(); const _ssc=2.2;
        drawShark(bc,MCX+mShake,MGY-Math.round(10*_ssc),mframe,_ssc);
        bc.restore();
      }
      else if(mspr==='tropical')    drawTropicalFish(bc,MCX-30+mShake,MGY-48,mframe,1.4);
      else if(mspr==='dragon'){
        bc.save();
        if(bHacPhase2){
          // ── Phase 2: Linh Hồn Bóng Tối ─────────────────────
          // Thân mờ đi + flickering
          const flicker=0.32+Math.sin(frameCount*0.18)*0.14+Math.sin(frameCount*0.31)*0.08;
          bc.globalAlpha=flicker;
          bc.filter='hue-rotate(200deg) saturate(4) brightness(0.5)';
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
          // Bản sao bóng mờ thứ 2 (ghosting)
          bc.save();
          bc.globalAlpha=flicker*0.4;
          bc.filter='hue-rotate(220deg) saturate(5) brightness(0.3)';
          drawDragon(bc,MCX-64+mShake+4,MGY-112+3,false,mframe);
          bc.restore();
          // Bóng đen (shadow wisps) bay quanh
          bc.save();
          for(let wi=0;wi<8;wi++){
            const wa=(frameCount*0.035+wi*0.785)%(Math.PI*2);
            const wr=38+Math.sin(frameCount*0.05+wi*1.3)*14;
            const wx2=MCX+Math.cos(wa)*wr;
            const wy2=MGY-55+Math.sin(wa)*wr*0.55;
            bc.globalAlpha=0.55+Math.sin(frameCount*0.09+wi)*0.3;
            // Wisp tím-đen
            const wg=bc.createRadialGradient(wx2,wy2,0,wx2,wy2,7);
            wg.addColorStop(0,'rgba(80,0,120,0.9)');
            wg.addColorStop(1,'rgba(0,0,0,0)');
            bc.fillStyle=wg;
            bc.beginPath();bc.arc(wx2,wy2,7,0,Math.PI*2);bc.fill();
            // Hạt nhỏ hơn lơ lửng bên trong
            bc.globalAlpha*=0.7;
            bc.fillStyle='#440066';
            bc.beginPath();bc.arc(wx2,wy2,2.5,0,Math.PI*2);bc.fill();
          }
          // Rơi đen (falling dark particles từ đỉnh xuống)
          for(let di=0;di<6;di++){
            const dt=((frameCount*0.04+di*0.6)%1);
            const dx2=MCX-50+di*20+Math.sin(frameCount*0.06+di)*8;
            const dy2=MGY-112+dt*(MGY-MGY+80);
            bc.globalAlpha=(1-dt)*0.7;
            bc.fillStyle='#220033';
            bc.beginPath();bc.arc(dx2,dy2,2+di%3,0,Math.PI*2);bc.fill();
          }
          // Label LINH HỒN
          bc.globalAlpha=0.75+Math.sin(frameCount*0.1)*0.2;
          bc.fillStyle='#dd00ff';
          bc.font='bold 8px "Times New Roman",serif';
          bc.textAlign='center';
          bc.shadowColor='#9900cc';bc.shadowBlur=8;
          bc.fillText('💀 LINH HỒN BÓNG TỐI',MCX,MGY-126);
          bc.shadowBlur=0;
          bc.restore();
        } else if(bShadowSoulState){
          bc.globalAlpha=0.4+Math.sin(frameCount*0.09)*0.12;
          bc.filter='hue-rotate(200deg) saturate(3) brightness(0.7)';
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
        } else {
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
        }
      }
      else if(mspr==='dragon_mini'){bc.save();bc.translate(MCX,MGY);bc.scale(1.15,1.15);bc.translate(-MCX,-MGY);drawOrc(bc,MCX-22+mShake,MGY-78,false,mframe);bc.restore();bc.save();const _dmfg=bc.createRadialGradient(MCX,MGY-55,5,MCX,MGY-55,48);_dmfg.addColorStop(0,'rgba(255,80,0,'+(0.3+Math.sin(frameCount*0.12)*0.15)+')');_dmfg.addColorStop(1,'rgba(0,0,0,0)');bc.fillStyle=_dmfg;bc.beginPath();bc.arc(MCX,MGY-55,48,0,Math.PI*2);bc.fill();bc.restore();}
      else if(mspr==='sea_dragon'||mspr==='seadragon'){
        bc.save(); const _sc=1.5;
        drawSeaDragon(bc,MCX+mShake,groundY-Math.round(30*_sc),mframe,_sc);
        bc.restore();
      }
      else if(mspr==='dragon_shadow'){
        bc.save();bc.filter='hue-rotate(200deg) saturate(2) brightness(0.6)';
        drawDragon(bc,MCX-130+mShake,MGY-175,false,mframe);bc.restore();
        if(bShadowSoulState){bc.save();bc.globalAlpha=0.35;bc.filter='hue-rotate(200deg) saturate(3) brightness(0.4)';drawDragon(bc,MCX-120+mShake,MGY-185,false,mframe);bc.restore();}
      }
      else if(mspr==='fire_dragon'){
        bc.save();bc.translate(MCX,MGY);bc.scale(0.667,0.667);bc.translate(-MCX,-MGY);drawFireDragon(bc,MCX-88,MGY-171,false,0);bc.restore();
      }
      bc.restore();

    } else {
      if(mspr==='goblin')      drawGoblin(bc,MCX-16+mShake,MGY-56,false,mframe);
      else if(mspr==='bat')    drawBat(bc,MCX-20+mShake,MGY-28,mframe);
      else if(mspr==='orc')    drawOrc(bc,MCX-22+mShake,MGY-78,false,mframe);
      else if(mspr==='sea_crab')    drawSeaCrab(bc,MCX-36+mShake,MGY-60,mframe,1.5);
      else if(mspr==='hermit_crab') drawHermitCrab(bc,MCX-26+mShake,MGY-66,mframe,1);
      else if(mspr==='big_crab')    drawBigCrab(bc,MCX-44+mShake,MGY-68,mframe,2.0);
      else if(mspr==='hermit_boss') drawHermitBoss(bc,MCX-26+mShake,MGY-66,mframe,1);
      else if(mspr==='octopus')     drawOctopus(bc,MCX-28+mShake,MGY-100,mframe,2.8);
      else if(mspr==='squid')       drawSquid(bc,MCX-24+mShake,MGY-108,mframe,2.6);
      else if(mspr==='shark'){
        bc.save(); const _ssc=2.2;
        drawShark(bc,MCX+mShake,MGY-Math.round(10*_ssc),mframe,_ssc);
        bc.restore();
      }
      else if(mspr==='tropical')    drawTropicalFish(bc,MCX-30+mShake,MGY-48,mframe,1.4);
      else if(mspr==='dragon'){
        bc.save();
        if(bHacPhase2){
          // ── Phase 2: Linh Hồn Bóng Tối ─────────────────────
          // Thân mờ đi + flickering
          const flicker=0.32+Math.sin(frameCount*0.18)*0.14+Math.sin(frameCount*0.31)*0.08;
          bc.globalAlpha=flicker;
          bc.filter='hue-rotate(200deg) saturate(4) brightness(0.5)';
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
          // Bản sao bóng mờ thứ 2 (ghosting)
          bc.save();
          bc.globalAlpha=flicker*0.4;
          bc.filter='hue-rotate(220deg) saturate(5) brightness(0.3)';
          drawDragon(bc,MCX-64+mShake+4,MGY-112+3,false,mframe);
          bc.restore();
          // Bóng đen (shadow wisps) bay quanh
          bc.save();
          for(let wi=0;wi<8;wi++){
            const wa=(frameCount*0.035+wi*0.785)%(Math.PI*2);
            const wr=38+Math.sin(frameCount*0.05+wi*1.3)*14;
            const wx2=MCX+Math.cos(wa)*wr;
            const wy2=MGY-55+Math.sin(wa)*wr*0.55;
            bc.globalAlpha=0.55+Math.sin(frameCount*0.09+wi)*0.3;
            // Wisp tím-đen
            const wg=bc.createRadialGradient(wx2,wy2,0,wx2,wy2,7);
            wg.addColorStop(0,'rgba(80,0,120,0.9)');
            wg.addColorStop(1,'rgba(0,0,0,0)');
            bc.fillStyle=wg;
            bc.beginPath();bc.arc(wx2,wy2,7,0,Math.PI*2);bc.fill();
            // Hạt nhỏ hơn lơ lửng bên trong
            bc.globalAlpha*=0.7;
            bc.fillStyle='#440066';
            bc.beginPath();bc.arc(wx2,wy2,2.5,0,Math.PI*2);bc.fill();
          }
          // Rơi đen (falling dark particles từ đỉnh xuống)
          for(let di=0;di<6;di++){
            const dt=((frameCount*0.04+di*0.6)%1);
            const dx2=MCX-50+di*20+Math.sin(frameCount*0.06+di)*8;
            const dy2=MGY-112+dt*(MGY-MGY+80);
            bc.globalAlpha=(1-dt)*0.7;
            bc.fillStyle='#220033';
            bc.beginPath();bc.arc(dx2,dy2,2+di%3,0,Math.PI*2);bc.fill();
          }
          // Label LINH HỒN
          bc.globalAlpha=0.75+Math.sin(frameCount*0.1)*0.2;
          bc.fillStyle='#dd00ff';
          bc.font='bold 8px "Times New Roman",serif';
          bc.textAlign='center';
          bc.shadowColor='#9900cc';bc.shadowBlur=8;
          bc.fillText('💀 LINH HỒN BÓNG TỐI',MCX,MGY-126);
          bc.shadowBlur=0;
          bc.restore();
        } else if(bShadowSoulState){
          bc.globalAlpha=0.4+Math.sin(frameCount*0.09)*0.12;
          bc.filter='hue-rotate(200deg) saturate(3) brightness(0.7)';
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
        } else {
          drawDragon(bc,MCX-64+mShake,MGY-112,false,mframe);
          bc.restore();
        }
      }
      else if(mspr==='dragon_mini'){bc.save();bc.translate(MCX,MGY);bc.scale(1.15,1.15);bc.translate(-MCX,-MGY);drawOrc(bc,MCX-22+mShake,MGY-78,false,mframe);bc.restore();bc.save();const _dmfg=bc.createRadialGradient(MCX,MGY-55,5,MCX,MGY-55,48);_dmfg.addColorStop(0,'rgba(255,80,0,'+(0.3+Math.sin(frameCount*0.12)*0.15)+')');_dmfg.addColorStop(1,'rgba(0,0,0,0)');bc.fillStyle=_dmfg;bc.beginPath();bc.arc(MCX,MGY-55,48,0,Math.PI*2);bc.fill();bc.restore();}
      else if(mspr==='sea_dragon'||mspr==='seadragon'){
        bc.save(); const _sc=1.5;
        drawSeaDragon(bc,MCX+mShake,groundY-Math.round(30*_sc),mframe,_sc);
        bc.restore();
      }
      else if(mspr==='dragon_shadow'){bc.save();bc.filter='hue-rotate(200deg) saturate(2) brightness(0.6)';drawDragon(bc,MCX-130+mShake,MGY-175,false,mframe);bc.restore();}
      else if(mspr==='fire_dragon'){
        bc.save();bc.translate(MCX,MGY);bc.scale(0.667,0.667);bc.translate(-MCX,-MGY);drawFireDragon(bc,MCX-88,MGY-171,false,0);bc.restore();
      }
    }
    if(night){
      bc.save();bc.globalAlpha=0.55+Math.sin(frameCount*0.1)*0.25;
      bc.fillStyle='rgba(180,0,30,0.7)';bc.fillRect(MCX-50,10,100,14);
      bc.fillStyle='#ff8888';bc.font='bold 18px "Times New Roman"';bc.textAlign='center';
      bc.shadowColor='#ff0000';bc.shadowBlur=8;
      bc.fillText('🌑 BUFF ĐÊM x'+nMult.toFixed(1),MCX,22);
      bc.restore();
    }
  }

  // ── VS EMBLEM ────────────────────────────────────────────────
  bc.save();
  bc.globalAlpha=0.6+Math.sin(frameCount*0.08)*0.2;
  bc.strokeStyle='#ffd700';bc.lineWidth=1.5;bc.shadowColor='#ffd700';bc.shadowBlur=6;
  bc.beginPath();bc.arc(BW/2,groundY-50,15,0,Math.PI*2);bc.stroke();
  bc.globalAlpha=1;
  bc.fillStyle='#1a0a00';bc.beginPath();bc.arc(BW/2,groundY-50,13,0,Math.PI*2);bc.fill();
  bc.fillStyle='#ffd700';bc.font='bold 10px "Cinzel",serif';bc.textAlign='center';
  bc.shadowColor='#ffd700';bc.shadowBlur=6;
  bc.fillText('VS',BW/2,groundY-46);
  bc.restore();

}
function updateBHUD(){
  document.getElementById('b-php').style.width=(bPHP/bMaxPHP*100)+'%';
  document.getElementById('b-mhp').style.width=(bMHP/bMaxMHP*100)+'%';
  document.getElementById('b-php-n').textContent=bPHP;
  document.getElementById('b-mhp-n').textContent=bMHP;
  // Mana bar
  const mpFill=document.getElementById('b-mp-fill');
  if(mpFill) mpFill.style.width=(playerMana/playerMaxMana*100)+'%';
  const mpTxt=document.getElementById('b-mp-txt');
  if(mpTxt) mpTxt.textContent=playerMana+'/'+playerMaxMana;
  // Dim magic button if insufficient mana
  const manaCost=equippedArmor&&equippedArmor.id==='magic'?18:28;
  const magicBtn=document.querySelector('.bbtn-m');
  if(magicBtn) magicBtn.style.opacity=playerMana>=manaCost?'1':'0.4';
}
function setBLog(t){const el=document.getElementById('b-log');el.innerHTML+='<div>'+t+'</div>';el.scrollTop=el.scrollHeight;}