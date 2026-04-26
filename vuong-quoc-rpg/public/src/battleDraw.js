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
    // ── HỎA LONG — địa ngục tầng 10, dung nham ──────────────
    const BW=bcv.width, BH=bcv.height;
    // Nền gradient đỏ đen sâu
    const fbg=bc.createLinearGradient(0,0,0,BH);
    fbg.addColorStop(0,'#080000');fbg.addColorStop(0.35,'#1c0200');
    fbg.addColorStop(0.7,'#2e0500');fbg.addColorStop(1,'#200300');
    bc.fillStyle=fbg;bc.fillRect(0,0,BW,BH);
    // Trần hang động (nhũ đá đen)
    bc.fillStyle='#0a0000';
    for(let s=0;s<18;s++){
      const sx=s*26+4+Math.sin(s*2.1)*6, sh=12+Math.sin(s*1.7)*10;
      bc.beginPath();bc.moveTo(sx,0);bc.lineTo(sx+13,0);bc.lineTo(sx+6,sh);bc.closePath();bc.fill();
    }
    // Cột đá địa ngục
    bc.fillStyle='#100000';
    for(let p=0;p<4;p++){
      const px=40+p*120;
      bc.fillRect(px,0,18,Math.round(BH*0.65));
      // crack sáng đỏ trên cột
      const glow=0.3+Math.sin(frameCount*0.06+p)*0.15;
      bc.save();bc.strokeStyle=`rgba(255,60,0,${glow})`;bc.lineWidth=1.5;
      bc.beginPath();bc.moveTo(px+4,5);bc.lineTo(px+7,Math.round(BH*0.3));bc.lineTo(px+12,Math.round(BH*0.55));bc.stroke();
      bc.restore();
    }
    // Núi lửa xa (silhouette)
    bc.fillStyle='#0d0000';
    bc.beginPath();bc.moveTo(0,BH);
    for(let hm=0;hm<9;hm++){bc.lineTo(hm*52+10,BH*0.38+Math.sin(hm*2.1)*BH*0.12);}
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
    // ── THẾ GIỚI NGOÀI — vẽ y hệt ngoài map ──────────────────
    const BW=bcv.width, BH=bcv.height; // 440 x 130
    const bGY=Math.round(BH*0.69);     // đường đất trong battle canvas

    // ── Bầu trời (logic giống drawSky) ────────────────────────
    {
      const td=Math.sin(timeOfDay*Math.PI*2);
      const isDawn=timeOfDay>0.1&&timeOfDay<0.3;
      const isDusk=timeOfDay>0.6&&timeOfDay<0.85;
      let skyTop,skyMid,skyBot;
      if(night){skyTop='#020410';skyMid='#050820';skyBot='#0a0d1a';}
      else if(isDawn){const t=(timeOfDay-0.1)/0.2;skyTop=`hsl(240,60%,${8+t*22}%)`;skyMid=`hsl(${220+t*40},70%,${18+t*30}%)`;skyBot=`hsl(${10+t*20},80%,${30+t*25}%)`;}
      else if(isDusk){const t=(timeOfDay-0.6)/0.25;skyTop=`hsl(${240-t*60},55%,${30-t*12}%)`;skyMid=`hsl(${30+t*10},90%,${40+t*5}%)`;skyBot='hsl(15,95%,50%)';}
      else{skyTop=`hsl(210,${60+td*30}%,${15+td*38}%)`;skyMid=`hsl(200,55%,${25+td*35}%)`;skyBot=`hsl(195,${50+td*20}%,${35+td*30}%)`;}
      const sky=bc.createLinearGradient(0,0,0,bGY);
      sky.addColorStop(0,skyTop);sky.addColorStop(0.5,skyMid);sky.addColorStop(1,skyBot);
      bc.fillStyle=sky;bc.fillRect(0,0,BW,bGY);
      // Sao đêm
      if(td<0.3){
        bc.save();bc.globalAlpha=Math.min(1,(0.3-td)/0.3);
        for(let s=0;s<30;s++){
          const sx=(s*157+33)%BW,sy=(s*97)%(bGY*0.75);
          bc.fillStyle=s%5===0?'#aaddff':'#ffffff';
          bc.globalAlpha*=0.4+Math.sin(frameCount*0.04+s*1.3)*0.6;
          bc.fillRect(sx,sy,s%7===0?2:1,s%7===0?2:1);
          bc.globalAlpha=Math.min(1,(0.3-td)/0.3);
        }
        const moonX=BW*0.78,moonY=bGY*0.15;
        bc.globalAlpha=0.9;bc.shadowColor='#cceeff';bc.shadowBlur=12;
        bc.fillStyle='#e8f0ff';bc.beginPath();bc.arc(moonX,moonY,8,0,Math.PI*2);bc.fill();
        bc.fillStyle='#c8d8f0';bc.beginPath();bc.arc(moonX+2,moonY-2,6,0,Math.PI*2);bc.fill();
        bc.shadowBlur=0;bc.restore();
      }
      if(td>-0.1){
        const sunX=BW*0.74,sunY=bGY*0.18+td*(-bGY*0.1);
        bc.save();
        const halo=bc.createRadialGradient(sunX,sunY,0,sunX,sunY,28);
        if(isDusk||isDawn){halo.addColorStop(0,'rgba(255,180,60,0.5)');halo.addColorStop(0.4,'rgba(255,120,30,0.2)');halo.addColorStop(1,'transparent');}
        else{halo.addColorStop(0,'rgba(255,230,150,0.4)');halo.addColorStop(0.5,'rgba(255,210,100,0.1)');halo.addColorStop(1,'transparent');}
        bc.fillStyle=halo;bc.beginPath();bc.arc(sunX,sunY,28,0,Math.PI*2);bc.fill();
        const sunCol=isDusk||isDawn?'#ff8c00':'#fff5cc';
        bc.shadowColor=sunCol;bc.shadowBlur=14;
        bc.fillStyle=sunCol;bc.fillRect(sunX-5,sunY-5,10,10);
        bc.fillStyle=isDusk||isDawn?'#ffcc44':'#fffde0';bc.fillRect(sunX-3,sunY-3,6,6);
        bc.fillStyle='#ffffff';bc.fillRect(sunX-1,sunY-4,3,2);bc.shadowBlur=0;
        bc.strokeStyle=isDusk||isDawn?'rgba(255,140,0,0.4)':'rgba(255,220,100,0.35)';bc.lineWidth=1;
        for(let r=0;r<8;r++){const a=r*Math.PI/4+frameCount*0.006;bc.beginPath();bc.moveTo(sunX+Math.cos(a)*7,sunY+Math.sin(a)*7);bc.lineTo(sunX+Math.cos(a)*13,sunY+Math.sin(a)*13);bc.stroke();}
        bc.restore();
      }
    }

    // ── Núi xa ────────────────────────────────────────────────
    {
      bc.save();bc.globalAlpha=night?0.7:0.55;
      const mt=bc.createLinearGradient(0,bGY*0.3,0,bGY);
      mt.addColorStop(0,night?'#0d1525':'#1e2d4a');mt.addColorStop(1,night?'#060a12':'#0e1825');
      bc.fillStyle=mt;bc.beginPath();bc.moveTo(0,bGY);
      [[0,0.5],[0.08,0.28],[0.18,0.45],[0.28,0.16],[0.4,0.35],[0.52,0.12],[0.65,0.3],[0.78,0.1],[0.9,0.28],[1,0.22]].forEach(([fx,fy])=>bc.lineTo(fx*BW,bGY*(0.32+fy*0.38)));
      bc.lineTo(BW,bGY);bc.closePath();bc.fill();bc.restore();
    }

    // ── Đồi gần ───────────────────────────────────────────────
    {
      bc.save();bc.globalAlpha=night?0.85:0.75;
      const hil=bc.createLinearGradient(0,bGY*0.45,0,bGY);
      hil.addColorStop(0,night?'#0d1a12':'#1a3a22');hil.addColorStop(1,night?'#080d09':'#0f2215');
      bc.fillStyle=hil;bc.beginPath();bc.moveTo(0,bGY);
      for(let hx=0;hx<=BW+5;hx+=3){bc.lineTo(hx,bGY*0.62+Math.sin(hx*0.04)*9+Math.sin(hx*0.09)*5);}
      bc.lineTo(BW,bGY);bc.closePath();bc.fill();
      bc.globalAlpha=0.15;bc.strokeStyle=night?'#203828':'#4a8a52';bc.lineWidth=1;
      bc.beginPath();for(let hx=0;hx<=BW+5;hx+=3){const hy=bGY*0.62+Math.sin(hx*0.04)*9+Math.sin(hx*0.09)*5;if(hx===0)bc.moveTo(hx,hy);else bc.lineTo(hx,hy);}bc.stroke();
      bc.restore();
    }

    // ── Mây (gọi hàm drawPixelCloud từ worldDraw) ─────────────
    if(!night){
      bc.save();
      [{ox:0,oy:bGY*0.10,speed:0.06,sc:0.48,alpha:0.92},{ox:160,oy:bGY*0.06,speed:0.04,sc:0.70,alpha:0.88},{ox:290,oy:bGY*0.14,speed:0.08,sc:0.38,alpha:0.85},{ox:400,oy:bGY*0.08,speed:0.05,sc:0.58,alpha:0.90}].forEach(cl=>{
        const cx2=((cl.ox+frameCount*cl.speed*0.5)%(BW+180)+BW+180)%(BW+180)-90;
        bc.globalAlpha=cl.alpha;
        drawPixelCloud(bc,cx2,cl.oy+Math.sin(frameCount*0.005+cl.ox*0.003)*1.5,cl.sc,frameCount+cl.ox);
      });
      bc.restore();
    }

    // ── Đất + cỏ (giống drawGround) ───────────────────────────
    {
      const dirt=bc.createLinearGradient(0,bGY+8,0,BH);
      dirt.addColorStop(0,night?'#2a1a08':'#8B6914');dirt.addColorStop(0.15,night?'#1e1004':'#7a5c0f');
      dirt.addColorStop(0.4,night?'#160c02':'#6b4c0a');dirt.addColorStop(1,night?'#0e0802':'#3a2204');
      bc.fillStyle=dirt;bc.fillRect(0,bGY+8,BW,BH-bGY-8);
      for(let dl=0;dl<4;dl++){bc.fillStyle=`rgba(0,0,0,${0.04+dl*0.012})`;bc.fillRect(0,bGY+10+dl*6,BW,2);}
      for(let p=0;p<16;p++){const px2=(p*139)%BW,py2=bGY+12+(p*43)%15,rs=1+p%3;bc.fillStyle=night?'rgba(80,60,30,0.3)':'rgba(160,140,90,0.35)';bc.beginPath();bc.ellipse(px2,py2,rs,rs*0.6,0,0,Math.PI*2);bc.fill();}
      const gr=bc.createLinearGradient(0,bGY,0,bGY+10);
      if(night){gr.addColorStop(0,'#1a3a1a');gr.addColorStop(1,'#0e2010');}
      else{gr.addColorStop(0,'#56c45a');gr.addColorStop(0.3,'#4caf50');gr.addColorStop(1,'#388e3c');}
      bc.fillStyle=gr;bc.fillRect(0,bGY,BW,10);
      bc.fillStyle=night?'#1e441e':'#76c442';bc.fillRect(0,bGY,BW,2);
      bc.fillStyle=night?'#264e26':'#96e060';bc.fillRect(0,bGY,BW,1);
      for(let gx=0;gx<BW+4;gx+=4){
        const seed=Math.floor(gx/4);const h=2+Math.sin(seed*7.3)*1.5;
        const sway=Math.sin(frameCount*0.04+(gx*0.05))*1.2*(seed%3===0?1.5:0.8);
        bc.fillStyle=night?(seed%4===0?'#2a6020':'#1e4a18'):(seed%4===0?'#a0e860':'#76c442');
        bc.beginPath();bc.moveTo(gx,bGY);bc.lineTo(gx+sway,bGY-h);bc.lineTo(gx+1+sway*0.7,bGY-h);bc.lineTo(gx+1,bGY);bc.fill();
      }
      if(!night){
        [[55,'#ff6b9d','#ffdd00'],[130,'#ff8c00','#ffffaa'],[225,'#aa88ff','#ffeecc'],[340,'#ff4488','#ffffff'],[420,'#ee3366','#ffee88']].forEach(([fx,petCol,centCol],fi)=>{
          if(fx>=BW)return;const bob=Math.sin(frameCount*0.06+fi)*0.8;
          bc.fillStyle='#4a8c20';bc.fillRect(fx,bGY-4+bob,1,4);
          bc.fillStyle=petCol;[[0,-2],[2,0],[0,2],[-2,0],[1,-1]].forEach(([px,py],i)=>{if(i<5)bc.fillRect(fx+px-1,bGY-6+bob+py-1,2,2);});
          bc.fillStyle=centCol;bc.fillRect(fx-1,bGY-6+bob-1,2,2);
        });
      }
    }

    // ── Cây (thu nhỏ drawHDTree cho battle canvas 440x130) ────
    {
      const td2=Math.sin(timeOfDay*Math.PI*2);
      const bright=td2>0;
      function drawBattleTree(rx){
        const wSway=Math.sin(frameCount*0.03+rx*0.02)*1.2;
        bc.save();bc.globalAlpha=0.15;bc.fillStyle='#000';bc.beginPath();bc.ellipse(rx+11,bGY+4,17+Math.abs(wSway),3,0,0,Math.PI*2);bc.fill();bc.restore();
        bc.fillStyle='#5d4037';
        [[rx+4,bGY+4,rx+7,bGY+1],[rx+15,bGY+4,rx+12,bGY+1]].forEach(([x1,y1,x2,y2])=>{
          bc.beginPath();bc.moveTo(x1,y1);bc.quadraticCurveTo((x1+x2)/2+wSway*0.2,y2+2,x2,y2);bc.lineWidth=1.5;bc.strokeStyle='#5d4037';bc.stroke();
        });
        const tr=bc.createLinearGradient(rx+7,0,rx+13,0);
        tr.addColorStop(0,'#8d6e63');tr.addColorStop(0.3,'#a0856a');tr.addColorStop(0.6,'#8d6e63');tr.addColorStop(1,'#5d4037');
        bc.fillStyle=tr;bc.fillRect(rx+7+wSway*0.1,bGY-28,6,30);
        bc.fillStyle='rgba(0,0,0,0.15)';for(let bl=0;bl<4;bl++)bc.fillRect(rx+7+bl%2*2+wSway*0.1,bGY-27+bl*6,2,1);
        const fData=[
          {x:11,y:-48,r:14,col:bright?'#1b5e20':'#0d3010'},{x:4,y:-40,r:11,col:bright?'#2e7d32':'#1a4820'},
          {x:18,y:-38,r:10,col:bright?'#2e7d32':'#1a4820'},{x:11,y:-55,r:12,col:bright?'#388e3c':'#204a22'},
          {x:3,y:-45,r:10,col:bright?'#43a047':'#2a5a2e'},{x:19,y:-43,r:10,col:bright?'#388e3c':'#204a22'},
          {x:11,y:-34,r:14,col:bright?'#33691e':'#1c3b10'},{x:5,y:-32,r:10,col:bright?'#388e3c':'#204a22'},
          {x:17,y:-32,r:9,col:bright?'#2e7d32':'#1a4820'},{x:7,y:-52,r:7,col:bright?'#4caf50':'#2a6030'},
          {x:15,y:-47,r:6,col:bright?'#43a047':'#265028'},
        ];
        const sw=wSway*0.5;
        fData.forEach((f,i)=>{const ls=sw*(i<3?0.5:i<9?0.8:1.1);bc.fillStyle=f.col;bc.beginPath();bc.arc(rx+f.x+ls,bGY+f.y,f.r,0,Math.PI*2);bc.fill();});
        bc.save();bc.globalAlpha=0.35+td2*0.1;bc.fillStyle='#76c442';
        [[8,-52,6],[15,-44,4],[6,-38,4]].forEach(([lx,ly,lr])=>{bc.beginPath();bc.arc(rx+lx+sw,bGY+ly,lr,0,Math.PI*2);bc.fill();});
        bc.globalAlpha=0.15;bc.fillStyle='#c8f098';bc.beginPath();bc.arc(rx+9+sw,bGY-55,3,0,Math.PI*2);bc.fill();bc.restore();
        [['#e53935',16,-38],['#c62828',6,-30],['#ef5350',12,-28]].forEach(([col,fx,fy])=>{bc.fillStyle=col;bc.beginPath();bc.arc(rx+fx+sw*0.7,bGY+fy,1.5,0,Math.PI*2);bc.fill();});
      }
      drawBattleTree(18);    // Cây trái
      drawBattleTree(392);   // Cây phải
      // Cây giữa nhỏ hơn
      bc.save();bc.translate(Math.round(BW*0.46),0);bc.scale(0.72,0.72);bc.translate(-Math.round(BW*0.46/0.72),0);
      drawBattleTree(Math.round(BW*0.46/0.72));bc.restore();
    }

    // ── Đá ────────────────────────────────────────────────────
    {
      bc.save();
      const S=0.52;bc.scale(S,S);
      const sy=bGY/S;
      function _bRS(x,y,w,h){if(w<=0||h<=0)return;x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);bc.beginPath();bc.moveTo(x+w*0.2,y);bc.lineTo(x+w*0.55,y);bc.lineTo(x+w*0.78,y+h*0.06);bc.lineTo(x+w,y+h*0.3);bc.lineTo(x+w*0.92,y+h*0.7);bc.lineTo(x+w*0.72,y+h);bc.lineTo(x+w*0.28,y+h);bc.lineTo(x+w*0.06,y+h*0.72);bc.lineTo(x,y+h*0.38);bc.lineTo(x+w*0.08,y+h*0.12);bc.closePath();bc.fill();}
      function bRock(rx,rw,rh){
        bc.save();bc.globalAlpha=0.18;bc.fillStyle='#000';bc.beginPath();bc.ellipse(rx+rw/2,sy+3,rw*0.5,3,0,0,Math.PI*2);bc.fill();bc.restore();
        bc.fillStyle='#3a4a58';_bRS(rx-1,sy-rh-1,rw+2,rh+2);bc.fillStyle='#4a5a6a';_bRS(rx,sy-rh+rh*0.45,rw,rh*0.55);
        bc.fillStyle='#7a8ea0';_bRS(rx,sy-rh,rw,rh*0.8);bc.fillStyle='#96aabf';_bRS(rx+rw*0.1,sy-rh,rw*0.8,rh*0.55);
        bc.fillStyle='#b8ccd8';_bRS(rx+rw*0.12,sy-rh+rh*0.08,rw*0.55,rh*0.38);
        bc.fillStyle='#d8eaf4';bc.fillRect(Math.round(rx+rw*0.14),Math.round(sy-rh+rh*0.1),Math.round(rw*0.22),Math.round(rh*0.16));
        bc.fillStyle='#3a4a58';bc.fillRect(Math.round(rx+rw*0.56),Math.round(sy-rh+rh*0.22),1,Math.round(rh*0.18));
        bc.fillStyle='#4a7a30';for(let m=0;m<3;m++)bc.fillRect(Math.round(rx+rw*(0.2+m*0.22)),Math.round(sy-rh+rh*0.85),2,2);
      }
      bRock(Math.round(BW*0.28/S),34,24);
      bRock(Math.round(BW*0.55/S),22,16);
      bc.restore();
    }
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

      // Burn label (disabled - replaced by red tint)
      if(false && (anim==='burn'||bBurnTurns>0)){
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
  // Thiêu đốt: nhân vật ửng đỏ (không hiệu ứng lửa bay)
  if(bPlayerBurnTurns>0){
    bc.save();
    bc.globalAlpha=0.28+Math.sin(frameCount*0.18)*0.1;
    bc.fillStyle='#ff2200';
    bc.fillRect(36+pShake-2, groundY-82, 56, 86);
    bc.restore();
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