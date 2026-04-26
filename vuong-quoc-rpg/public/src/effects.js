// ── DEVICE DETECTION — must be first ──────────────────────────
const _isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
let GW = _isTouchDevice ? 360 : 640;
let GH = _isTouchDevice ? 640 : 360;
if(_isTouchDevice) document.body.classList.add('touch-mode');
// Set canvas dimensions
document.querySelectorAll('#gc,#ic').forEach(cv=>{ cv.width=GW; cv.height=GH; });
// ═══════════════════════════════════════════
// CANVAS & CONSTANTS
// ═══════════════════════════════════════════
const gc=document.getElementById('gc'),ctx=gc.getContext('2d');
const ic=document.getElementById('ic'),ictx=ic.getContext('2d');
const bcv=document.getElementById('b-canvas'),bctx=bcv.getContext('2d');
// Set battle canvas size based on device
if(_isTouchDevice){ bcv.width=360; bcv.height=200; }
else { bcv.width=440; bcv.height=180; }
const fxcv=document.getElementById('fx-canvas'),fxctx=fxcv.getContext('2d');
fxcv.width=bcv.width; fxcv.height=bcv.height;
fxctx.imageSmoothingEnabled=false;

// ═══════════════════════════════════════════════════════════
// PIXEL ART SKILL EFFECT ENGINE
// ═══════════════════════════════════════════════════════════
const FX={
  active:false, frame:0, skill:null, rafId:null,
  MX:_isTouchDevice?280:320, MY:_isTouchDevice?105:90,
  PX:_isTouchDevice?70:75, PY:_isTouchDevice?100:88, // monster & player center on battle canvas

  // px(x,y,w,h,col) — draw pixel block on fx canvas
  px(x,y,w,h,col,alpha=1){
    if(!isFinite(x)||!isFinite(y))return;
    fxctx.save();
    if(alpha<1)fxctx.globalAlpha=alpha;
    fxctx.fillStyle=col;
    fxctx.fillRect(Math.round(x),Math.round(y),w,h);
    fxctx.restore();
  },

  // glow circle
  _a(v){ return isFinite(v)?Math.max(0,Math.min(1,v)):0; },

  glow(x,y,r,col,alpha=0.6){
    if(!isFinite(x)||!isFinite(y)||!isFinite(r)||r<=0)return;
    r=Math.abs(r); alpha=this._a(alpha);
    fxctx.save();
    const g=fxctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col.replace(')',`,${alpha})`).replace('rgb(','rgba('));
    g.addColorStop(1,'rgba(0,0,0,0)');
    fxctx.fillStyle=g; fxctx.beginPath(); fxctx.arc(x,y,r,0,Math.PI*2); fxctx.fill();
    fxctx.restore();
  },

  ring(x,y,r,col,lw=2,alpha=1){
    if(!isFinite(x)||!isFinite(y)||!isFinite(r)||r<=0)return;
    r=Math.abs(r); alpha=this._a(alpha);
    fxctx.save(); fxctx.globalAlpha=alpha;
    fxctx.strokeStyle=col; fxctx.lineWidth=lw;
    fxctx.shadowColor=col; fxctx.shadowBlur=6;
    fxctx.beginPath(); fxctx.arc(x,y,r,0,Math.PI*2); fxctx.stroke();
    fxctx.restore();
  },

  // Pixel slash lines
  slash(x,y,ang,len,col,thick=2){
    if(!isFinite(x)||!isFinite(y)||!isFinite(ang)||!isFinite(len))return;
    fxctx.save();
    fxctx.strokeStyle=col; fxctx.lineWidth=thick;
    fxctx.shadowColor=col; fxctx.shadowBlur=8;
    fxctx.beginPath();
    fxctx.moveTo(x+Math.cos(ang)*len*0.3,y+Math.sin(ang)*len*0.3);
    fxctx.lineTo(x-Math.cos(ang)*len*0.7,y-Math.sin(ang)*len*0.7);
    fxctx.stroke();
    fxctx.restore();
  },

  // Jagged lightning bolt (segments)
  bolt(x1,y1,x2,y2,col='#aaddff',lw=2.5,branch=false){
    if(!isFinite(x1)||!isFinite(y1)||!isFinite(x2)||!isFinite(y2))return;
    fxctx.save();
    fxctx.strokeStyle=col; fxctx.lineWidth=lw;
    fxctx.shadowColor=col; fxctx.shadowBlur=14;
    fxctx.beginPath();
    let cx=x1,cy=y1,dx=x2-x1,dy=y2-y1;
    const steps=8; fxctx.moveTo(cx,cy);
    for(let i=1;i<=steps;i++){
      const t=i/steps;
      const jitter=(Math.random()-0.5)*(branch?10:18);
      cx=x1+dx*t+jitter; cy=y1+dy*t+jitter*0.3;
      fxctx.lineTo(cx,cy);
    }
    fxctx.stroke();
    // glow pass
    fxctx.globalAlpha=0.3; fxctx.lineWidth=lw*3; fxctx.strokeStyle='#ffffff';
    fxctx.stroke();
    fxctx.restore();
  },

  // Pixel art fireball (5×5 sprite scaled)
  fireball(cx,cy,r,t){ // t=0..1 life
    const flicker=Math.sin(t*Math.PI*8)*0.15;
    // Core white
    this.glow(cx,cy,r*0.4,'rgb(255,255,220)',0.9);
    // Orange body
    this.glow(cx,cy,r*0.8,'rgb(255,120,0)',0.7+flicker);
    // Red outer
    this.glow(cx,cy,r*1.2,'rgb(200,30,0)',0.4);
    // Pixel sparks around
    const sparks=[[-2,-3],[3,-2],[-3,2],[2,3],[0,-4],[4,0],[-4,1],[1,4]];
    sparks.forEach(([ox,oy])=>{
      const alpha=(0.5+Math.random()*0.5)*(1-t*0.5);
      const col=Math.random()>0.5?'#ffaa00':'#ff6600';
      this.px(cx+ox*r*0.2,cy+oy*r*0.2,2,2,col,alpha);
    });
  },

  // Pixel wind orb
  windOrb(cx,cy,r,t){
    this.glow(cx,cy,r*0.5,'rgb(180,255,180)',0.8);
    this.glow(cx,cy,r,'rgb(100,220,120)',0.4);
    // Pixel swirl dots
    for(let i=0;i<8;i++){
      const ang=i/8*Math.PI*2+t*Math.PI*4;
      const d=r*0.7;
      const wx=cx+Math.cos(ang)*d, wy=cy+Math.sin(ang)*d*0.5;
      this.px(wx-1,wy-1,2,2,'#aaffaa',0.7);
    }
    // Outline ring
    this.ring(cx,cy,r*0.9,'#88ff88',1.5,0.5);
  },

  // Pixel water drop arc
  waterDrop(cx,cy,r){
    this.glow(cx,cy,r,'rgb(50,150,255)',0.7);
    this.px(cx-1,cy-r,2,3,'#88ccff',0.9);
    this.px(cx-2,cy-r+2,4,2,'#44aaff',0.8);
  },

  // Electric star (stun)
  star(cx,cy,r,col='#ffff44'){
    fxctx.save();
    fxctx.fillStyle=col; fxctx.shadowColor=col; fxctx.shadowBlur=8;
    fxctx.beginPath();
    for(let i=0;i<10;i++){
      const ang=i/10*Math.PI*2-Math.PI/2;
      const rad=i%2===0?r:r*0.4;
      const sx=cx+Math.cos(ang)*rad, sy=cy+Math.sin(ang)*rad;
      i===0?fxctx.moveTo(sx,sy):fxctx.lineTo(sx,sy);
    }
    fxctx.closePath(); fxctx.fill();
    fxctx.restore();
  },

  // Arrow pixel sprite (pointing down)
  arrow(cx,cy,col='#ff3333'){
    const p=this.px.bind(this);
    p(cx-1,cy,2,4,col);   // shaft
    p(cx-3,cy+2,6,2,col); // head wide
    p(cx-2,cy+4,4,2,col);
    p(cx-1,cy+6,2,2,col);
  },

  // Pixel shield hexagon
  shield(cx,cy,r,col='#88ffcc'){
    fxctx.save();
    fxctx.strokeStyle=col; fxctx.lineWidth=2.5;
    fxctx.shadowColor=col; fxctx.shadowBlur=12;
    fxctx.fillStyle=col.replace('rgb','rgba').replace(')',',0.08)');
    fxctx.beginPath();
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2-Math.PI/6;
      i===0?fxctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)
           :fxctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
    }
    fxctx.closePath(); fxctx.fill(); fxctx.stroke();
    fxctx.restore();
  },

  // Pixel crit burst (8 rays)
  critBurst(cx,cy,r,col='#ffee00'){
    if(!isFinite(cx)||!isFinite(cy)||!isFinite(r)||r<=0)return;
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2;
      const x1=cx+Math.cos(a)*r*0.3, y1=cy+Math.sin(a)*r*0.3;
      const x2=cx+Math.cos(a)*r, y2=cy+Math.sin(a)*r;
      fxctx.save();
      fxctx.strokeStyle=col; fxctx.lineWidth=3;
      fxctx.shadowColor=col; fxctx.shadowBlur=10;
      fxctx.beginPath(); fxctx.moveTo(x1,y1); fxctx.lineTo(x2,y2); fxctx.stroke();
      fxctx.restore();
    }
    // inner diamond
    fxctx.save(); fxctx.fillStyle=col; fxctx.shadowColor=col; fxctx.shadowBlur=16;
    fxctx.beginPath();
    fxctx.moveTo(cx,cy-r*0.25); fxctx.lineTo(cx+r*0.15,cy);
    fxctx.lineTo(cx,cy+r*0.25); fxctx.lineTo(cx-r*0.15,cy);
    fxctx.closePath(); fxctx.fill(); fxctx.restore();
  },

  // ── TEXT ──────────────────────────────────────────────────
  label(txt,x,y,col,alpha=1){
    fxctx.save(); fxctx.globalAlpha=alpha;
    fxctx.font='bold 11px "Times New Roman",serif';
    fxctx.textAlign='center'; fxctx.fillStyle=col;
    fxctx.shadowColor=col; fxctx.shadowBlur=10;
    fxctx.fillText(txt,x,y);
    fxctx.restore();
  },

  // ── SKILL ANIMATIONS ──────────────────────────────────────

  drawFrame_slash(f,maxF,isCrit){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const t=f/maxF;
    const c=fxctx;

    // ── PHASE 1 (0→0.55): Vòng cung trắng quét từ player ─────
    if(t<0.7){
      const p=Math.min(1,t/0.55);
      // Vòng cung chính (hình chữ C lớn — như ảnh)
      // Arc quét từ góc 200° → 10° (ngược chiều kim đồng hồ)
      const arcCX=PX+12, arcCY=PY+5;
      const arcR=isCrit?42:32;
      // Góc bắt đầu mở rộng theo progress
      const startA=Math.PI*1.15; // ~207°
      const sweepA= -Math.PI*1.5*p; // quét rộng dần

      c.save();
      c.globalAlpha=0.92*(1-Math.max(0,p-0.7)/0.3);
      c.strokeStyle='#ffffff';
      c.lineWidth=isCrit?7:5;
      c.shadowColor='#ffffff';c.shadowBlur=12;
      c.lineCap='round';
      c.beginPath();
      c.arc(arcCX,arcCY,arcR,startA,startA+sweepA,false);
      c.stroke();

      // Viền trong mỏng hơn (tạo độ dày như ảnh)
      c.lineWidth=isCrit?3:2;
      c.globalAlpha=0.6*(1-Math.max(0,p-0.7)/0.3);
      c.beginPath();
      c.arc(arcCX,arcCY,arcR-6,startA,startA+sweepA,false);
      c.stroke();

      // Crit: thêm 1 vòng cung nằm ngang bên dưới (như ảnh top-right)
      if(isCrit && p>0.3){
        const p2=(p-0.3)/0.7;
        c.globalAlpha=0.8*(1-p2*0.4);
        c.lineWidth=5;
        c.beginPath();
        const hArcR=28+p2*10;
        c.arc(arcCX+8,arcCY+22,hArcR,Math.PI*1.6,Math.PI*0.05,false);
        c.stroke();
      }

      // Đuôi sáng ở đầu vòng cung
      const tailA=startA+sweepA;
      const tailX=arcCX+Math.cos(tailA)*arcR;
      const tailY=arcCY+Math.sin(tailA)*arcR;
      const glowR=isCrit?14:10;
      const tg=c.createRadialGradient(tailX,tailY,0,tailX,tailY,glowR);
      tg.addColorStop(0,'rgba(255,255,255,0.9)');
      tg.addColorStop(0.4,'rgba(200,220,255,0.5)');
      tg.addColorStop(1,'rgba(0,0,0,0)');
      c.globalAlpha=1;c.fillStyle=tg;
      c.beginPath();c.arc(tailX,tailY,glowR,0,Math.PI*2);c.fill();

      // Vệt motion blur dọc theo arc
      for(let i=0;i<5;i++){
        const ta2=startA+sweepA*(0.7+i*0.06);
        const tx2=arcCX+Math.cos(ta2)*arcR;
        const ty2=arcCY+Math.sin(ta2)*arcR;
        c.globalAlpha=(0.25-i*0.04)*(1-p*0.5);
        c.fillStyle='#ffffff';
        c.beginPath();c.arc(tx2,ty2,isCrit?4:3,0,Math.PI*2);c.fill();
      }
      c.restore();
    }

    // ── PHASE 2 (0.4→1.0): Impact trên quái ──────────────────
    if(t>=0.4){
      const p=Math.min(1,(t-0.4)/0.6);
      if(isCrit){
        // Crit: vòng nổ lớn + chữ
        this.critBurst(MX,MY,14+p*18,'#ffffff');
        this.critBurst(MX,MY,8+p*10,'#ddeeff');
        this.glow(MX,MY,22+p*14,'rgb(200,230,255)',0.65*(1-p));
        this.ring(MX,MY,5+p*28,'#ffffff',3,0.85*(1-p));
        this.ring(MX,MY,3+p*16,'#aaddff',1.5,0.6*(1-p));
        this.label('💥 CHÍ MẠNG!',MX,MY-30,'#ffffff',Math.min(1,p*3)*(1-p*0.3));
      } else {
        // Impact: dấu X trắng
        const s=9+p*9;
        c.save();c.strokeStyle='#ffffff';c.lineWidth=3;
        c.shadowColor='#ffffff';c.shadowBlur=10;
        c.globalAlpha=(1-p)*0.9;
        c.beginPath();c.moveTo(MX-s,MY-s);c.lineTo(MX+s,MY+s);c.stroke();
        c.beginPath();c.moveTo(MX+s,MY-s);c.lineTo(MX-s,MY+s);c.stroke();
        c.restore();
        this.ring(MX,MY,3+p*20,'#ffffff',2.5,0.75*(1-p));
        this.glow(MX,MY,16+p*12,'rgb(220,235,255)',0.5*(1-p));
      }
      // Sparks trắng tỏa ra
      for(let i=0;i<7;i++){
        const sa=(i/7*Math.PI*2)+p*1.5;
        const sd=p*22;
        this.px(MX+Math.cos(sa)*sd,MY+Math.sin(sa)*sd*0.65,2,2,'#ffffff',(1-p)*0.75);
      }
    }

    // ── Double: vòng cung thứ 2 delay 10 frame ────────────────
    if(!isCrit && this._double && f>=10){
      const f2=f-10, t2=Math.min(1,f2/maxF);
      const p2=Math.min(1,t2/0.55);
      const arc2CX=PX+12, arc2CY=PY+8;
      const arc2R=28;
      const startA2=Math.PI*0.5; // 90° — ngang bên dưới
      const sweep2=-Math.PI*1.2*p2;
      c.save();
      c.globalAlpha=0.75*(1-Math.max(0,p2-0.7)/0.3);
      c.strokeStyle='#aaddff';c.lineWidth=4;
      c.shadowColor='#88ccff';c.shadowBlur=8;
      c.lineCap='round';
      c.beginPath();
      c.arc(arc2CX,arc2CY+10,arc2R,startA2,startA2+sweep2,false);
      c.stroke();
      c.restore();
    }
  },

  drawFrame_fire(f,maxF){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const t=f/maxF;
    const ps=4; // pixel size
    const c=fxctx;

    // ── Helper: pixel rect on fx canvas ──────────────────────
    const px=(x,y,w,h,col,a=1)=>{
      if(!isFinite(x)||!isFinite(y))return;
      c.save();if(a<1)c.globalAlpha=a;
      c.imageSmoothingEnabled=false;
      c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w*ps,h*ps);
      c.restore();
    };

    // Phase 1 (0–60%): Fireball flies from player → monster
    const travelEnd=maxF*0.62;
    if(f<travelEnd){
      const p=f/travelEnd;
      // Arc trajectory (slight upward curve)
      const bx=PX+18+(MX-PX-18)*p;
      const by=PY+(MY-PY)*p - Math.sin(p*Math.PI)*18;
      const frame5=Math.floor(f/3)%5; // 5-frame fireball flicker

      // Pixel fireball — matching reference: round orange body, yellow center, scattered sparks
      // Outer red-orange ring
      px(bx-3*ps,by-4*ps,2,1,'#cc2200',0.9); px(bx-1*ps,by-4*ps,4,1,'#dd3300',0.9); px(bx+3*ps,by-4*ps,2,1,'#cc2200',0.9);
      px(bx-4*ps,by-3*ps,1,6,'#dd3300',0.9); px(bx+4*ps,by-3*ps,1,6,'#dd3300',0.9);
      px(bx-3*ps,by+3*ps,2,1,'#cc2200',0.9); px(bx-1*ps,by+3*ps,4,1,'#dd3300',0.9); px(bx+3*ps,by+3*ps,2,1,'#cc2200',0.9);
      // Orange fill body
      px(bx-3*ps,by-3*ps,7,7,'#ff5500',0.95);
      // Yellow-orange inner
      px(bx-2*ps,by-3*ps,5,1,'#ff8800',1); px(bx-3*ps,by-2*ps,7,5,'#ff6600',1);
      px(bx-2*ps,by+2*ps,5,1,'#ff8800',1);
      // Yellow center
      px(bx-2*ps,by-2*ps,5,5,'#ffaa00',1);
      px(bx-1*ps,by-2*ps,3,1,'#ffcc00',1); px(bx-2*ps,by-1*ps,5,3,'#ffcc00',1);
      // White hot core
      px(bx-1*ps,by-1*ps,3,3,'#ffee00',1);
      px(bx,     by,     ps,ps,'#ffffff',0.9);

      // Trail (behind the ball, to the left)
      for(let ti=1;ti<=5;ti++){
        const tp=Math.max(0,p-ti*0.09);
        if(tp<=0)continue;
        const tbx=PX+18+(MX-PX-18)*tp;
        const tby=PY+(MY-PY)*tp - Math.sin(tp*Math.PI)*18;
        const ta=(0.6-ti*0.1)*(1-p*0.4);
        const ts=Math.max(1,4-ti);
        const tcol=ti<2?'#ff8800':ti<4?'#ff5500':'#cc2200';
        px(tbx-1,tby-1,ts,ts,tcol,ta);
      }

      // Scattered pixel sparks (frame-animated)
      const sparkOffsets=[[4,-4],[5,-1],[4,3],[-5,-3],[-6,0],[-4,4],[2,-5],[-2,5]];
      sparkOffsets.forEach(([ox,oy],si)=>{
        if((si+frame5)%3===0){
          const scol=si%2===0?'#ffcc00':'#ff6600';
          px(bx+ox*ps,by+oy*ps,1,1,scol,0.7);
        }
      });

      // Glow halo behind pixels
      c.save();c.globalAlpha=0.25;
      const g=c.createRadialGradient(bx,by,2,bx,by,ps*7);
      g.addColorStop(0,'#ffee00');g.addColorStop(0.5,'#ff6600');g.addColorStop(1,'transparent');
      c.fillStyle=g;c.beginPath();c.arc(bx,by,ps*7,0,Math.PI*2);c.fill();
      c.restore();
    }

    // Phase 2 (60–100%): Explosion at monster
    else {
      const p=(f-travelEnd)/(maxF-travelEnd);
      const exR=1+p*3; // explosion expansion

      // Expanding pixel explosion rings
      [[1,'#ffee00'],[1.8,'#ff8800'],[2.8,'#ff4400'],[3.8,'#cc1100']].forEach(([rm,col])=>{
        const er=Math.round(rm*exR*ps*4);
        if(er<=0)return;
        c.save();c.globalAlpha=(1-p)*0.85;
        c.strokeStyle=col;c.lineWidth=ps;
        c.shadowColor=col;c.shadowBlur=6;
        c.beginPath();c.arc(MX,MY,er,0,Math.PI*2);c.stroke();
        c.restore();
      });

      // Central flash
      if(p<0.4){
        px(MX-3*ps,MY-3*ps,7,7,'#ffffff',(0.4-p)*2);
        px(MX-2*ps,MY-2*ps,5,5,'#ffee00',(0.4-p)*2.5);
      }

      // Flying pixel cinders in 8 directions
      for(let i=0;i<8;i++){
        const ang=i/8*Math.PI*2;
        const dist=p*ps*14;
        const cx2=MX+Math.cos(ang)*dist, cy2=MY+Math.sin(ang)*dist*0.7;
        const col=i%2===0?'#ff8800':'#ffcc00';
        px(cx2-1,cy2-1,2,2,col,(1-p)*0.9);
        // extra trailing cinder
        if(p>0.1) px(cx2-Math.cos(ang)*ps*2,cy2-Math.sin(ang)*ps*1.5,1,1,'#ff5500',(1-p)*0.6);
      }

      // Burn ring glow
      c.save();c.globalAlpha=0.18*(1-p);
      const bg=c.createRadialGradient(MX,MY,0,MX,MY,ps*16);
      bg.addColorStop(0,'#ff8800');bg.addColorStop(1,'transparent');
      c.fillStyle=bg;c.beginPath();c.arc(MX,MY,ps*16,0,Math.PI*2);c.fill();
      c.restore();

      // Burn label
      if(p>0.15&&p<0.75){
        c.save();c.globalAlpha=Math.sin(p*Math.PI);
        c.fillStyle='#ff4400';c.font='bold 11px serif';c.textAlign='center';
        c.shadowColor='#ff2200';c.shadowBlur=8;
        c.fillText('🔥 THIÊU ĐỐT!',MX,MY-32);
        c.restore();
      }
    }
  },

  // Thiêu đốt cháy ở chân (persistent burn indicator per turn)
  drawFrame_burn(f,maxF){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const c=fxctx;
    const ps=4;
    const t=f/maxF;
    // Ground Y on battle canvas
    const monGroundY=_isTouchDevice?118:115;
    const plGroundY=monGroundY;

    const px=(x,y,w,h,col,a=1)=>{
      if(!isFinite(x)||!isFinite(y))return;
      c.save();if(a<1)c.globalAlpha=a;
      c.imageSmoothingEnabled=false;
      c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w*ps,h*ps);
      c.restore();
    };

    // ── drawOneFlame(cx, groundY, fOff, scale) ───────────────
    const drawFlame=(fx,gy,fOff,sc)=>{
      const fr=Math.floor((f*1.5+fOff))%5;
      const s=Math.max(1,Math.round(sc));
      // 5-frame pixel fire matching reference ảnh
      const R='#dd2200',O='#ff5500',Y='#ff9900',W='#ffdd00';
      const frames=[
        // 0 — tall
        [[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],
         [O,-1,-2],[Y,0,-2],[O,1,-2],
         [Y,-1,-3],[W,0,-3],[Y,1,-3],
         [Y,0,-4],[W,0,-5],
         [R,-3,-1],[R,3,-1],[R,-2,-3],[R,2,-4]],
        // 1 — lean right
        [[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],
         [O,0,-2],[Y,1,-2],[O,2,-2],
         [Y,1,-3],[W,2,-3],
         [W,2,-4],[W,3,-4],
         [R,-2,-1],[R,4,-2],[R,3,-4]],
        // 2 — wide
        [[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],
         [O,-2,-2],[Y,-1,-2],[Y,0,-2],[Y,1,-2],[O,2,-2],
         [Y,-1,-3],[W,0,-3],[W,1,-3],[Y,2,-3],
         [W,0,-4],[W,1,-4],
         [R,-4,-1],[R,4,-1],[R,-3,-3],[R,3,-4]],
        // 3 — lean left
        [[O,-3,-1],[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],
         [O,-2,-2],[Y,-1,-2],[O,0,-2],
         [W,-2,-3],[Y,-1,-3],
         [W,-2,-4],[W,-1,-4],
         [R,-4,-2],[R,2,-1],[R,-3,-4]],
        // 4 — low
        [[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],
         [Y,-1,-2],[Y,0,-2],[Y,1,-2],
         [W,0,-3],
         [R,-3,-1],[R,3,-1],[R,1,-3]],
      ];
      const pixels=frames[fr];
      pixels.forEach(([col,dx,dy])=>{
        c.save();c.imageSmoothingEnabled=false;
        c.fillStyle=col;
        c.fillRect(Math.round(fx+dx*s),Math.round(gy+dy*s),s,s);
        c.restore();
      });
    };

    // Monster feet flames (3 flames)
    drawFlame(MX-14, monGroundY, 0,  ps*1.2);
    drawFlame(MX+2,  monGroundY, 7,  ps*1.4);
    drawFlame(MX+16, monGroundY, 14, ps*1.1);
    // Monster body flame
    drawFlame(MX-6,  monGroundY-28, 3, ps*0.9);
    drawFlame(MX+8,  monGroundY-24, 10,ps*0.85);

    // Player feet flames
    drawFlame(PX-14, plGroundY, 4,  ps*1.1);
    drawFlame(PX+2,  plGroundY, 11, ps*1.3);
    drawFlame(PX+16, plGroundY, 18, ps*1.0);
    // Player body flame
    drawFlame(PX-4,  plGroundY-26, 6, ps*0.85);
    drawFlame(PX+10, plGroundY-22, 13,ps*0.8);

    // Burn turns label
    c.save();c.globalAlpha=0.9+Math.sin(f*0.3)*0.1;
    c.fillStyle='#ff4400';c.font='bold 10px serif';c.textAlign='center';
    c.shadowColor='#ff2200';c.shadowBlur=6;
    c.fillText('🔥 THIÊU ĐỐT',MX,monGroundY-52);
    c.restore();
  },

  // ── Hỏa Long Vương: cầu lửa từ rồng → player ────────────────
  drawFrame_dragonFire(f,maxF){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const c=fxctx;
    const ps=3;
    const t=f/maxF;

    const px=(x,y,w,h,col,a=1)=>{
      if(!isFinite(x)||!isFinite(y))return;
      c.save();if(a<1)c.globalAlpha=a;
      c.imageSmoothingEnabled=false;
      c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w*ps,h*ps);
      c.restore();
    };

    // Quỹ đạo: rồng (MX) → player (PX), bắn THẲNG (không cong)
    const travelEnd=maxF*0.58;

    if(f<travelEnd){
      const p=f/travelEnd;
      // Bắn thẳng từ rồng sang player
      const bx=MX-20+(PX-MX+20)*p;
      const by=MY-30+(PY-MY+30)*p;

      // ── 7-frame explosion ball (như ảnh 1) ──
      // Mỗi 4 frame đổi hình dạng
      const fr=Math.floor(f/3)%7;
      const ballR=[5,7,9,11,10,8,6][fr]; // bán kính theo frame
      const innerR=Math.max(2,ballR-3);

      // Lớp ngoài: đỏ đậm
      c.save();
      c.globalAlpha=0.95;
      c.fillStyle='#cc1100';
      c.beginPath();c.arc(bx,by,ballR*ps*0.5,0,Math.PI*2);c.fill();
      // Lớp giữa: cam
      c.fillStyle='#ff5500';
      c.beginPath();c.arc(bx,by,ballR*ps*0.35,0,Math.PI*2);c.fill();
      // Lớp vàng cam
      c.fillStyle='#ff8800';
      c.beginPath();c.arc(bx,by,innerR*ps*0.3,0,Math.PI*2);c.fill();
      // Lõi vàng
      c.fillStyle='#ffcc00';
      c.beginPath();c.arc(bx,by,innerR*ps*0.18,0,Math.PI*2);c.fill();
      // Trung tâm trắng
      c.fillStyle='#ffffff';
      c.beginPath();c.arc(bx,by,ps*0.5,0,Math.PI*2);c.fill();
      c.restore();

      // Các đốm đỏ tối quanh (như ảnh 1: cụm tròn đen đỏ)
      for(let i=0;i<6;i++){
        const a2=i/6*Math.PI*2+f*0.1;
        const dr=(ballR*ps*0.45);
        const dx=bx+Math.cos(a2)*dr, dy=by+Math.sin(a2)*dr;
        c.save();c.globalAlpha=0.7;c.fillStyle='#880000';
        c.beginPath();c.arc(dx,dy,ps*0.7,0,Math.PI*2);c.fill();
        c.fillStyle='#cc2200';
        c.beginPath();c.arc(dx-1,dy-1,ps*0.3,0,Math.PI*2);c.fill();
        c.restore();
      }

      // Vệt lửa phía sau (trail)
      for(let ti=1;ti<=6;ti++){
        const tp=Math.max(0,p-ti*0.07);
        if(tp<=0)continue;
        const tbx=MX-20+(PX-MX+20)*tp;
        const tby=MY-30+(PY-MY+30)*tp;
        const ta=(0.55-ti*0.08)*(1-p*0.3);
        const tr=(ballR-ti*1.2)*ps*0.35;
        if(tr<=0)continue;
        const tcol=ti<2?'#ff6600':ti<4?'#cc3300':'#880000';
        c.save();c.globalAlpha=ta;c.fillStyle=tcol;
        c.beginPath();c.arc(tbx,tby,Math.max(1,tr),0,Math.PI*2);c.fill();
        c.restore();
      }

      // Glow hào quang
      c.save();c.globalAlpha=0.2;
      const g=c.createRadialGradient(bx,by,2,bx,by,ballR*ps*0.7);
      g.addColorStop(0,'#ffcc00');g.addColorStop(0.5,'#ff5500');g.addColorStop(1,'transparent');
      c.fillStyle=g;c.beginPath();c.arc(bx,by,ballR*ps*0.7,0,Math.PI*2);c.fill();
      c.restore();
    }

    // Nổ tại player
    else{
      const p=(f-travelEnd)/(maxF-travelEnd);
      // 7 frame nổ mở rộng (ảnh 1 phần cuối: đen với đốm đỏ)
      const expFr=Math.floor(p*7);
      const exR=(1+p*2.8)*ps*5;

      // Vòng ngoài đen xám (smoke)
      c.save();c.globalAlpha=(1-p)*0.8;
      c.fillStyle=p>0.5?'#222222':'#441100';
      c.beginPath();c.arc(PX,PY,exR,0,Math.PI*2);c.fill();

      // Đốm đỏ rải rác (như ảnh 1 frame cuối)
      if(p>0.3){
        for(let i=0;i<8;i++){
          const a3=i/8*Math.PI*2;
          const dr2=exR*(0.4+Math.random()*0.5);
          c.fillStyle='#cc2200';c.globalAlpha=(1-p)*0.7;
          c.beginPath();c.arc(PX+Math.cos(a3)*dr2,PY+Math.sin(a3)*dr2,ps,0,Math.PI*2);c.fill();
          c.fillStyle='#ff4400';c.globalAlpha=(1-p)*0.4;
          c.beginPath();c.arc(PX+Math.cos(a3)*dr2*0.5,PY+Math.sin(a3)*dr2*0.5,ps*0.6,0,Math.PI*2);c.fill();
        }
      }

      // Flash trung tâm (đầu nổ)
      if(p<0.35){
        c.save();c.globalAlpha=(0.35-p)/0.35;
        c.fillStyle='#ffffff';c.beginPath();c.arc(PX,PY,ps*4,0,Math.PI*2);c.fill();
        c.fillStyle='#ffcc00';c.beginPath();c.arc(PX,PY,ps*6,0,Math.PI*2);c.fill();
        c.restore();
      }
      c.restore();

      // Label
      if(p>0.1&&p<0.7){
        c.save();c.globalAlpha=Math.sin(p*Math.PI)*0.95;
        c.fillStyle='#ff2200';c.font='bold 11px serif';c.textAlign='center';
        c.shadowColor='#ff6600';c.shadowBlur=10;
        c.fillText('🔥 HỎA LONG PHUN LỬA!',PX,PY-36);
        c.restore();
      }
    }
  },

  // ── Hiệu ứng thiêu đốt ở chân player (liên tục) ─────────────
  drawFrame_playerBurn(f,maxF){
    const PX=this.PX;
    const c=fxctx;
    const ps=4; // pixel size lớn hơn cho rõ
    // Chân player = bottom của knight sprite
    const BH=bcv.height;
    const feetY=BH-52; // đúng vị trí chân trên battle canvas

    // ── Pixel flame theo đúng ảnh: rộng, thấp, nhiều ngọn ────
    // Mỗi ngọn lửa vẽ bằng pixel art từng ô ps×ps
    const drawFlame=(cx,baseY,timeOff,height)=>{
      const fr=Math.floor((f*1.6+timeOff))%8;
      const h=Math.max(2,Math.round(height));
      // Màu palette như ảnh: vàng→cam→đỏ cam
      const R='#cc1100', RO='#ee2200', O='#ff5500', OY='#ff8800', Y='#ffaa00', W='#ffdd00';

      // 8 frames pixel art ngọn lửa — mỗi frame là mảng [col, dx_cell, dy_cell]
      // dx_cell/dy_cell tính theo đơn vị ps, gốc (cx, baseY)
      const frames=[
        // Frame 0: cao, 2 ngọn
        [[O,0,-1],[O,-1,-1],[O,1,-1],[OY,0,-2],[OY,-1,-2],[Y,0,-3],[W,0,-4],
         [O,3,-1],[OY,3,-2],[Y,3,-3],
         [RO,-2,-1],[RO,2,-1],[RO,4,-1],[R,-3,-1]],
        // Frame 1: nghiêng phải
        [[O,0,-1],[O,1,-1],[O,2,-1],[OY,1,-2],[OY,2,-2],[Y,1,-3],[Y,2,-3],[W,2,-4],
         [O,4,-1],[OY,4,-2],
         [RO,-1,-1],[RO,3,-1],[R,-2,-1],[R,5,-1]],
        // Frame 2: bùng rộng nhất
        [[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],
         [OY,-1,-2],[OY,0,-2],[OY,1,-2],[OY,2,-2],[OY,3,-2],
         [Y,-1,-3],[Y,0,-3],[Y,1,-3],[Y,2,-3],
         [W,0,-4],[W,1,-4],
         [RO,-2,-1],[RO,4,-1],[R,-3,-1],[R,5,-1],
         [RO,-1,-3],[RO,3,-3]],
        // Frame 3: nghiêng trái
        [[O,-2,-1],[O,-1,-1],[O,0,-1],[OY,-2,-2],[OY,-1,-2],[Y,-2,-3],[Y,-1,-3],[W,-1,-4],
         [O,2,-1],[OY,2,-2],
         [RO,-3,-1],[RO,1,-1],[R,-4,-1],[R,3,-1]],
        // Frame 4: vừa, cân
        [[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],
         [OY,0,-2],[OY,1,-2],[OY,-1,-2],
         [Y,0,-3],[Y,1,-3],[W,0,-4],
         [O,4,-1],[OY,4,-2],[Y,4,-3],
         [RO,-2,-1],[RO,3,-1],[R,-3,-1],[R,5,-1]],
        // Frame 5: cao 2 ngọn riêng biệt
        [[O,0,-1],[OY,0,-2],[Y,0,-3],[W,0,-4],
         [O,4,-1],[OY,4,-2],[Y,4,-3],[W,4,-4],
         [O,2,-1],[OY,2,-2],
         [RO,-1,-1],[RO,1,-1],[RO,3,-1],[RO,5,-1],[R,-2,-1],[R,6,-1]],
        // Frame 6: lan rộng thấp
        [[O,-2,-1],[O,-1,-1],[O,0,-1],[O,1,-1],[O,2,-1],[O,3,-1],[O,4,-1],
         [OY,-1,-2],[OY,0,-2],[OY,1,-2],[OY,2,-2],[OY,3,-2],
         [Y,0,-3],[Y,1,-3],[Y,2,-3],
         [W,1,-4],
         [RO,-3,-1],[RO,5,-1],[R,-4,-1],[R,6,-1]],
        // Frame 7: tàn, nhỏ
        [[O,0,-1],[O,1,-1],[OY,0,-2],[OY,2,-2],[Y,1,-2],
         [O,3,-1],[RO,-1,-1],[RO,4,-1],[R,-2,-1],[R,5,-1]],
      ];
      const pixels=frames[fr];
      pixels.forEach(([col,dx,dy])=>{
        c.fillStyle=col;
        c.fillRect(Math.round(cx+dx*ps),Math.round(baseY+dy*ps),ps,ps);
      });
    };

    // Tàn lửa đỏ bay lên (như ảnh: đốm đỏ cam tỏa ra)
    const drawEmbers=(cx,baseY,timeOff)=>{
      const seeds=[7,13,17,23,29,31,37,41];
      seeds.forEach((seed,i)=>{
        const t2=(f*0.04+timeOff*0.1+i*0.4)%1;
        const ex=cx+(((seed*7+i*13)%18)-9)*ps*0.6;
        const ey=baseY-t2*ps*9-ps;
        const alpha=(1-t2)*0.8;
        if(alpha<=0||t2>0.9)return;
        c.save();c.globalAlpha=alpha;
        c.fillStyle=i%3===0?'#ff2200':i%3===1?'#ff6600':'#ffaa00';
        c.fillRect(Math.round(ex),Math.round(ey),ps*0.75,ps*0.75);
        c.restore();
      });
    };

    // Glow nhẹ dưới chân (nhỏ, mờ)
    c.save();c.globalAlpha=0.18+Math.sin(f*0.2)*0.05;
    const gg=c.createRadialGradient(PX+10,feetY,0,PX+10,feetY,22);
    gg.addColorStop(0,'rgba(255,120,0,0.7)');gg.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=gg;c.beginPath();c.arc(PX+10,feetY,22,0,Math.PI*2);c.fill();
    c.restore();

    // 4 ngọn lửa nhỏ gọn dưới chân (height=2, không to)
    const startX=PX-4;
    drawFlame(startX,    feetY, 0,  2);
    drawFlame(startX+10, feetY, 4,  2.5);
    drawFlame(startX+20, feetY, 8,  2);
    drawFlame(startX+30, feetY, 2,  1.8);

    // Vài tàn lửa nhỏ
    drawEmbers(startX+15, feetY, 0);

    // Label nhỏ TRÊN ĐẦU người chơi
    if(bPlayerBurnTurns>0){
      const headY=feetY-ps*20; // trên đỉnh đầu knight (~80px)
      c.save();c.globalAlpha=0.9;
      c.fillStyle='#ff6600';c.font='bold 7px sans-serif';c.textAlign='center';
      c.shadowColor='#ff2200';c.shadowBlur=4;
      c.fillText('🔥-8HP×'+bPlayerBurnTurns,PX+14,headY);
      c.restore();
    }
  },

  drawFrame_thunder(f,maxF,hasStun){
    const MX=this.MX,MY=this.MY;
    const t=f/maxF;

    // Phase 1 (0-40%): charge clouds at top
    if(f<maxF*0.35){
      const p=f/(maxF*0.35);
      // Dark clouds / charge buildup
      for(let c=0;c<3;c++){
        const cx=MX-22+c*22;
        this.glow(cx,8,'rgb(100,120,200)',0.2+p*0.3);
        this.px(cx-8,4,16,6,'#1a1a4a',0.3+p*0.2);
      }
      // Electric sparks at clouds
      if(f%3===0){
        this.px(MX+(Math.random()-0.5)*30,10,2,2,'#88aaff',0.7);
      }
      // Charge aura around monster
      this.ring(MX,MY,15+p*5,'#4466cc',1.5,p*0.5);
      this.label('⚡',MX,MY-24,'#aaddff',p);
    }

    // Phase 2 (35-65%): BOLT STRIKES DOWN
    if(f>=maxF*0.35 && f<maxF*0.65){
      const p=(f-maxF*0.35)/(maxF*0.3);
      // Main bolt (thick)
      this.bolt(MX,0,MX,MY,'#ffffff',3.5);
      this.bolt(MX-5,0,MX,MY,'#aaddff',2);
      this.bolt(MX+4,0,MX+2,MY,'#88bbff',1.5,true);
      // Electric glow at impact
      this.glow(MX,MY,20+p*12,'rgb(150,200,255)',0.7*(1-p*0.5));
      this.ring(MX,MY,5+p*20,'#aaddff',3,0.9*(1-p*0.3));
      // Ground spark pattern (pixel art)
      const sparkR=p*24;
      for(let i=0;i<6;i++){
        const sa=i/6*Math.PI*2;
        this.px(MX+Math.cos(sa)*sparkR,MY+18+Math.sin(sa)*4,3,2,'#88ccff',0.7*(1-p));
      }
    }

    // Phase 3 (65-100%): stun effect
    if(f>=maxF*0.65){
      const p=(f-maxF*0.65)/(maxF*0.35);
      // Dissipating charge at monster
      this.glow(MX,MY,14+p*8,'rgb(100,150,255)',0.3*(1-p));
      // Stun stars orbiting
      if(hasStun){
        for(let i=0;i<3;i++){
          const sa=i/3*Math.PI*2+p*Math.PI*3;
          const sx=MX+Math.cos(sa)*20, sy=MY-20+Math.sin(sa)*8;
          this.star(sx,sy,4,'#ffff44');
        }
        // Stun swirl background
        this.ring(MX,MY-18,12,'#ffff44',1.5,0.5*(1-p));
        this.label('😵 CHOÁNG!',MX,MY-42,'#ffff44',0.8);
      }
    }
  },

  drawFrame_wind(f,maxF,hasShield){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const t=f/maxF;

    // Phase 1 (0-50%): Wind orb travels to monster
    if(f<maxF*0.5){
      const p=f/(maxF*0.5);
      const bx=PX+10+(MX-PX-10)*p;
      const by=PY+(MY-PY)*p - Math.sin(p*Math.PI)*20;
      this.windOrb(bx,by,10+p*4,t);
      // Swirl trail
      for(let i=1;i<=5;i++){
        const tp=Math.max(0,p-i*0.08);
        if(tp<=0)continue;
        const tbx=PX+10+(MX-PX-10)*tp;
        const tby=PY+(MY-PY)*tp-Math.sin(tp*Math.PI)*20;
        this.glow(tbx,tby,4+i,'rgb(120,255,140)',(0.3-i*0.05)*(1-p*0.4));
      }
    }

    // 3 red arrow missiles (staggered)
    for(let a=0;a<3;a++){
      const delay=maxF*0.15*a;
      const arrowStart=maxF*0.3+delay;
      const arrowEnd=maxF*0.7+delay;
      if(f>=arrowStart && f<arrowEnd){
        const p=(f-arrowStart)/(arrowEnd-arrowStart);
        const ax=MX-10+a*10;
        const ay=-10+p*(MY+20);
        // Arrow pixel art
        fxctx.save();
        fxctx.fillStyle='#ff3333';fxctx.shadowColor='#ff0000';fxctx.shadowBlur=8;
        // Shaft
        fxctx.fillRect(ax-1,ay,2,10);
        // Head
        fxctx.fillStyle='#ff6666';
        fxctx.beginPath();fxctx.moveTo(ax-5,ay+6);fxctx.lineTo(ax,ay+14);fxctx.lineTo(ax+5,ay+6);fxctx.closePath();fxctx.fill();
        // Fletching
        fxctx.fillStyle='#ffaaaa';fxctx.fillRect(ax-3,ay-2,2,4);fxctx.fillRect(ax+1,ay-2,2,4);
        fxctx.restore();
        // Trail
        this.glow(ax,ay,'rgb(255,50,50)',0.25);
      }
    }

    // Phase 2 (55-100%): Impact + debuff
    if(f>=maxF*0.55){
      const p=(f-maxF*0.55)/(maxF*0.45);
      // Wind burst at monster
      const wr=p*30;
      this.ring(MX,MY,wr,'#88ff88',2,0.7*(1-p));
      this.ring(MX,MY,wr*0.5,'#aaffaa',1.5,0.5*(1-p));
      // Pixel leaves/petals
      for(let i=0;i<6;i++){
        const sa=i/6*Math.PI*2+p*Math.PI;
        this.px(MX+Math.cos(sa)*wr*0.8,MY+Math.sin(sa)*wr*0.6,3,3,'#88ffaa',(1-p)*0.7);
      }
      // Debuff label
      if(p<0.7) this.label('💨 -ATK!',MX,MY-32,'#aaffcc',Math.sin(p*Math.PI)*0.9);
    }

    // Wind shield around player (persistent)
    if(hasShield){
      const pulse=0.4+Math.sin(t*Math.PI*6)*0.15;
      this.shield(PX,PY,22+Math.sin(t*Math.PI*4)*2,'#88ffcc');
      this.glow(PX,PY,28,'rgb(100,255,180)',pulse*0.3);
      // Rotating orbit dots
      for(let i=0;i<5;i++){
        const sa=i/5*Math.PI*2+t*Math.PI*6;
        const sx=PX+Math.cos(sa)*24, sy=PY+Math.sin(sa)*14;
        this.px(sx-1,sy-1,2,2,'#aaffcc',0.8);
      }
      if(t<0.3) this.label('🛡️ KHIÊN GIÓ!',PX,PY-38,'#aaffcc',t*3);
    }
  },

  drawFrame_water(f,maxF){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const t=f/maxF;

    // Droplet arc PX→MX
    if(f<maxF*0.55){
      const p=f/(maxF*0.55);
      const bx=PX+12+(MX-PX-12)*p;
      const by=PY+(MY-PY)*p - Math.sin(p*Math.PI)*35;
      // Water drop pixel sprite (teardrop)
      fxctx.save();
      fxctx.fillStyle='#44aaff';fxctx.shadowColor='#2266ff';fxctx.shadowBlur=10;
      fxctx.beginPath();
      fxctx.arc(bx,by+3,5+p*2,0,Math.PI*2);
      fxctx.fill();
      fxctx.fillStyle='#88ddff';
      fxctx.beginPath();fxctx.moveTo(bx,by-4-p*3);fxctx.lineTo(bx-4,by+2);fxctx.lineTo(bx+4,by+2);fxctx.closePath();fxctx.fill();
      fxctx.restore();
      // Water trail
      for(let i=1;i<=4;i++){
        const tp=Math.max(0,p-i*0.1);
        if(tp<=0)continue;
        const tbx=PX+12+(MX-PX-12)*tp;
        const tby=PY+(MY-PY)*tp-Math.sin(tp*Math.PI)*35;
        this.glow(tbx,tby+3,4+i,'rgb(68,150,255)',(0.35-i*0.06)*(1-p*0.4));
      }
    }

    // Impact at monster (55-80%)
    if(f>=maxF*0.55 && f<maxF*0.82){
      const p=(f-maxF*0.55)/(maxF*0.27);
      this.ring(MX,MY,4+p*22,'#44aaff',3,0.8*(1-p));
      this.glow(MX,MY,10+p*16,'rgb(68,150,255)',0.5*(1-p));
      // Water splash drops
      for(let i=0;i<6;i++){
        const sa=i/6*Math.PI*2;
        const sd=p*22;
        fxctx.save();fxctx.fillStyle='#88ccff';fxctx.globalAlpha=(1-p)*0.8;
        fxctx.beginPath();fxctx.arc(MX+Math.cos(sa)*sd,MY+Math.sin(sa)*sd*0.5,2+p*2,0,Math.PI*2);fxctx.fill();
        fxctx.restore();
      }
    }

    // Mana restore flash on player (75-100%)
    if(f>=maxF*0.72){
      const p=(f-maxF*0.72)/(maxF*0.28);
      this.ring(PX,PY,8+p*16,'#2266ff',2,0.9*(1-p));
      this.glow(PX,PY,20+p*8,'rgb(100,160,255)',0.4*(1-p));
      // Mana crystal pixels orbiting player
      for(let i=0;i<4;i++){
        const sa=i/4*Math.PI*2+p*Math.PI*4;
        const sx=PX+Math.cos(sa)*16, sy=PY+Math.sin(sa)*10;
        this.px(sx-1,sy-1,3,3,'#44aaff',0.9*(1-p));
      }
      this.label('💧 +MANA!',PX,PY-36,'#44aaff',Math.sin(p*Math.PI)*0.95);
    }
  },

  drawFrame_magic(f,maxF){
    const MX=this.MX,MY=this.MY,PX=this.PX,PY=this.PY;
    const t=f/maxF;

    // Phase 1: casting circle at player (0-35%)
    if(f<maxF*0.38){
      const p=f/(maxF*0.38);
      this.ring(PX,PY,10+p*8,'#cc44ff',2,p*0.8);
      this.ring(PX,PY,6+p*5,'#ff88ff',1,p*0.6);
      // Rune sparks
      for(let i=0;i<6;i++){
        const sa=i/6*Math.PI*2+p*Math.PI*2;
        const sx=PX+Math.cos(sa)*(10+p*8), sy=PY+Math.sin(sa)*(10+p*8)*0.6;
        this.px(sx-1,sy-1,2,2,'#ff88ff',p*0.8);
      }
      this.glow(PX,PY,12+p*8,'rgb(200,80,255)',p*0.4);
    }

    // Phase 2: orb flies toward monster (30-65%)
    if(f>=maxF*0.28 && f<maxF*0.65){
      const p=(f-maxF*0.28)/(maxF*0.37);
      const bx=PX+10+(MX-PX-10)*p;
      const by=PY+(MY-PY)*p - Math.sin(p*Math.PI)*18;
      // Magic orb (layered circles = pixel art style)
      this.glow(bx,by,14,'rgb(200,80,255)',0.5);
      this.glow(bx,by,8,'rgb(255,150,255)',0.7);
      this.px(bx-2,by-2,4,4,'#ffffff',0.9);
      // Sparkle trail
      for(let i=0;i<5;i++){
        const tp=Math.max(0,p-i*0.1);
        const tbx=PX+10+(MX-PX-10)*tp;
        const tby=PY+(MY-PY)*tp-Math.sin(tp*Math.PI)*18;
        this.px(tbx-1,tby-1,2,2,'#cc44ff',(0.4-i*0.07)*(1-p*0.3));
      }
    }

    // Phase 3: arcane explosion (60-100%)
    if(f>=maxF*0.58){
      const p=(f-maxF*0.58)/(maxF*0.42);
      // Star burst
      this.critBurst(MX,MY,8+p*20,'#cc44ff');
      this.critBurst(MX,MY,4+p*12,'#ff88ff');
      this.glow(MX,MY,16+p*12,'rgb(180,60,255)',0.6*(1-p));
      this.ring(MX,MY,6+p*28,'#cc44ff',2.5,0.8*(1-p));
      // Orbiting rune dots
      for(let i=0;i<8;i++){
        const sa=i/8*Math.PI*2+p*Math.PI*3;
        const r2=p*26;
        this.star(MX+Math.cos(sa)*r2,MY+Math.sin(sa)*r2*0.6,3,'#ffaaff');
      }
      this.label('✨ PHÉP THUẬT!',MX,MY-38,'#cc44ff',Math.sin(p*Math.PI)*0.9);
    }
  },

  // ── ENTRY POINT ──────────────────────────────────────────
  play(animType,extra){
    this.stop();
    this.active=true; this.frame=0; this.skill=animType;
    this._extra=extra||{};
    // Total frames per animation
    const dur={
      atk:28, double:38, crit:42,
      fire:55, fireblast:55, magicburn:55,
      burn:50,
      dragon_fire:70, player_burn:65,
      thunder:65, windblast:72, water:58,
      magic:60,
      naturebind:80, tideheal:65,
      angel_dodge:40, angel_triple:70, angel_revive:90,
    };
    this._maxF=dur[animType]||40;
    this._loop();
  },

  stop(){
    if(this.rafId){cancelAnimationFrame(this.rafId);this.rafId=null;}
    this.active=false; this.frame=0;
    fxctx.clearRect(0,0,bcv.width,bcv.height);
  },

  // ══ NATURE BIND — vines + poison ══
  drawFrame_naturebind(f,mF){
    const cx=fxctx; const t=f/mF;
    const mx=300, my=60; // monster center
    // Phase 1: vines shoot from ground (0-0.4)
    if(t<0.5){
      const p=t/0.5;
      // Green energy orb travels from player to monster
      const ox=80+(mx-80)*p, oy=90-Math.sin(p*Math.PI)*40;
      cx.save();
      const g=cx.createRadialGradient(ox,oy,0,ox,oy,18*p+5);
      g.addColorStop(0,'rgba(100,255,50,0.9)'); g.addColorStop(1,'rgba(0,180,0,0)');
      cx.fillStyle=g; cx.beginPath(); cx.arc(ox,oy,18*p+5,0,Math.PI*2); cx.fill();
      // Leaf particles trailing
      for(let i=0;i<4;i++){
        const lx=ox-i*8*p+Math.sin(f*0.3+i)*4;
        const ly=oy+i*3+Math.cos(f*0.3+i)*3;
        cx.fillStyle='rgba(50,200,20,'+(0.7-i*0.15)+')';
        cx.beginPath(); cx.ellipse(lx,ly,4,2,f*0.1+i,0,Math.PI*2); cx.fill();
      }
      cx.restore();
    }
    // Phase 2: vines wrap around monster (0.4-1.0)
    if(t>=0.3){
      const p=Math.min(1,(t-0.3)/0.7);
      const numVines=6;
      for(let i=0;i<numVines;i++){
        const angle=i*(Math.PI*2/numVines)+f*0.05;
        const r=28+Math.sin(f*0.12+i)*6;
        cx.save();
        cx.strokeStyle=`rgba(30,180,10,${0.8*p})`;
        cx.lineWidth=3*p;
        cx.shadowColor='#00ff44'; cx.shadowBlur=6;
        cx.beginPath();
        for(let j=0;j<20;j++){
          const a=angle+j*0.3;
          const cr=r+Math.sin(j*0.8+f*0.08)*8;
          const vx=mx+Math.cos(a)*cr;
          const vy=my+Math.sin(a)*cr*0.6;
          j===0?cx.moveTo(vx,vy):cx.lineTo(vx,vy);
        }
        cx.stroke();
        // Leaf buds
        const lx=mx+Math.cos(angle)*r, ly=my+Math.sin(angle)*r*0.6;
        cx.fillStyle=`rgba(60,220,20,${0.7*p})`;
        cx.beginPath(); cx.ellipse(lx,ly,5,3,angle,0,Math.PI*2); cx.fill();
        cx.restore();
      }
      // Poison cloud overlay
      if(t>0.6){
        const pp=(t-0.6)/0.4;
        for(let i=0;i<8;i++){
          const px2=mx+Math.cos(f*0.07+i*0.78)*35;
          const py2=my+Math.sin(f*0.07+i*0.78)*22;
          const pg=cx.createRadialGradient(px2,py2,0,px2,py2,10);
          pg.addColorStop(0,`rgba(80,220,0,${0.5*pp})`);
          pg.addColorStop(1,'rgba(0,100,0,0)');
          cx.fillStyle=pg; cx.beginPath(); cx.arc(px2,py2,10,0,Math.PI*2); cx.fill();
        }
        this.label(cx,'🌿 TRÓI CHÂN + ĐỘC!',220,15,'#44ff22',11);
      }
    }
  },

  // ══ TIDE HEAL — ocean wave + gold restore ══
  drawFrame_tideheal(f,mF,heal){
    const cx=fxctx; const t=f/mF;
    const px=80, py=65; // player center
    // Attack wave toward monster
    const wt=Math.min(1,t*2);
    const wx=px+(300-px)*wt;
    cx.save();
    // Water trail
    cx.strokeStyle=`rgba(30,144,255,${0.7*(1-t)})`;
    cx.lineWidth=4; cx.shadowColor='#00bfff'; cx.shadowBlur=10;
    cx.beginPath();
    for(let i=0;i<30;i++){
      const xx=px+i*((wx-px)/30);
      const yy=py+Math.sin(f*0.15+i*0.4)*8;
      i===0?cx.moveTo(xx,yy):cx.lineTo(xx,yy);
    }
    cx.stroke(); cx.restore();
    // Trident hit burst at monster
    if(t>0.35){
      const p=(t-0.35)/0.65;
      const mx2=300;
      for(let i=0;i<12;i++){
        const a=(i/12)*Math.PI*2+f*0.08;
        const r=(20+p*35);
        const bx=mx2+Math.cos(a)*r, by=65+Math.sin(a)*r*0.6;
        cx.save(); cx.globalAlpha=0.8*(1-p);
        cx.fillStyle=i%3===0?'#00e5ff':'#1e90ff';
        cx.beginPath(); cx.arc(bx,by,3,0,Math.PI*2); cx.fill(); cx.restore();
      }
      // Ripple rings
      for(let r2=0;r2<3;r2++){
        const rp=(p+r2*0.25)%1;
        cx.save(); cx.globalAlpha=0.6*(1-rp);
        cx.strokeStyle='#00cfff'; cx.lineWidth=2;
        cx.beginPath(); cx.ellipse(mx2,65,rp*50,rp*30,0,0,Math.PI*2); cx.stroke(); cx.restore();
      }
    }
    // Heal glow on player side
    if(t>0.5&&heal){
      const p2=(t-0.5)/0.5;
      const hg=cx.createRadialGradient(px,py,0,px,py,40*p2);
      hg.addColorStop(0,`rgba(0,255,200,${0.6*(1-p2)})`);
      hg.addColorStop(1,'rgba(0,100,200,0)');
      cx.fillStyle=hg; cx.beginPath(); cx.arc(px,py,40*p2,0,Math.PI*2); cx.fill();
      // Rising heal numbers
      const hy=py-20*p2;
      cx.save(); cx.globalAlpha=1-p2;
      cx.fillStyle='#00ffcc'; cx.font='bold 11px "Times New Roman"'; cx.textAlign='center';
      cx.shadowColor='#00ffcc'; cx.shadowBlur=8;
      cx.fillText('💧 HỒI HP+MANA!',px,hy); cx.restore();
    }
    this.label(cx,'🔱 ĐINH BA THẦN BIỂN!',220,15,'#00d4ff',11);
  },

  // ══ ANGEL DODGE — feather burst ══
  drawFrame_angel_dodge(f,mF){
    const cx=fxctx; const t=f/mF;
    // Player silhouette dodge flash
    cx.save();
    cx.globalAlpha=0.4*(1-t)*Math.sin(f*0.5);
    cx.fillStyle='#ffffaa';
    cx.shadowColor='#ffffff'; cx.shadowBlur=20;
    cx.fillRect(55,30,40,70);
    cx.restore();
    // White feathers fly outward from player
    const numF=10;
    for(let i=0;i<numF;i++){
      const a=(i/numF)*Math.PI*2+f*0.05;
      const r=t*(40+i*3);
      const fx2=80+Math.cos(a)*r, fy=65+Math.sin(a)*r*0.5;
      cx.save(); cx.globalAlpha=(1-t)*0.8;
      cx.translate(fx2,fy); cx.rotate(a);
      cx.fillStyle='#ffffff';
      cx.shadowColor='#ccffff'; cx.shadowBlur=6;
      cx.beginPath(); cx.ellipse(0,0,6,2,0,0,Math.PI*2); cx.fill();
      cx.restore();
    }
    // Golden shield ring
    cx.save(); cx.globalAlpha=0.7*(1-t);
    cx.strokeStyle='#ffd700'; cx.lineWidth=3;
    cx.shadowColor='#ffd700'; cx.shadowBlur=10;
    cx.beginPath(); cx.ellipse(80,65,30+t*15,20+t*10,0,0,Math.PI*2); cx.stroke();
    cx.restore();
    this.label(cx,'👼 NÉ ĐÒN!',80,18,'#ffd700',10);
  },

  // ══ ANGEL TRIPLE — 3 strike flash ══
  drawFrame_angel_triple(f,mF){
    const cx=fxctx; const t=f/mF;
    const strikes=[0,0.28,0.56];
    strikes.forEach((st,i)=>{
      const lt=Math.max(0,Math.min(1,(t-st)/0.3));
      if(lt<=0) return;
      const colors=['#ffffaa','#ffffff','#ffd700'];
      // Arc strike line to monster
      cx.save(); cx.globalAlpha=lt*(1-lt)*4;
      cx.strokeStyle=colors[i]; cx.lineWidth=4+i;
      cx.shadowColor=colors[i]; cx.shadowBlur=12;
      cx.beginPath(); cx.moveTo(120,65);
      cx.quadraticCurveTo(200,30-i*10,290,55+i*5);
      cx.stroke();
      // Impact spark at monster
      for(let j=0;j<6;j++){
        const a=(j/6)*Math.PI*2+i*0.5;
        const r=lt*25;
        cx.fillStyle=colors[i];
        cx.beginPath(); cx.arc(300+Math.cos(a)*r,60+Math.sin(a)*r*0.5,3,0,Math.PI*2); cx.fill();
      }
      cx.restore();
    });
    if(t>0.7){
      this.label(cx,'👼 3 ĐÒN THIÊN THẦN!',220,15,'#fff7aa',12);
    }
  },

  // ══ ANGEL REVIVE — resurrection light ══
  drawFrame_angel_revive(f,mF){
    const cx=fxctx; const t=f/mF;
    // Full screen white flash
    cx.save();
    const flashA=t<0.15?(t/0.15)*0.7:(1-t)*0.5;
    cx.globalAlpha=flashA;
    cx.fillStyle='#ffffff'; cx.fillRect(0,0,340,160);
    cx.restore();
    // Pillar of light on player
    cx.save();
    const pg=cx.createLinearGradient(80,0,80,160);
    pg.addColorStop(0,`rgba(255,255,200,${(1-t)*0.9})`);
    pg.addColorStop(0.5,`rgba(255,230,100,${(1-t)*0.6})`);
    pg.addColorStop(1,'rgba(255,200,0,0)');
    cx.fillStyle=pg; cx.fillRect(55,0,50,160);
    cx.restore();
    // Angel wings expand
    const wp=Math.min(1,t*2.5);
    cx.save(); cx.globalAlpha=(1-t)*0.9;
    cx.strokeStyle='#ffffcc'; cx.lineWidth=3;
    cx.shadowColor='#ffffff'; cx.shadowBlur=15;
    // Left wing
    cx.beginPath(); cx.moveTo(80,60);
    cx.bezierCurveTo(80-wp*60,60-wp*30, 80-wp*50,60+wp*10, 80-wp*20,60+wp*20);
    cx.stroke();
    // Right wing
    cx.beginPath(); cx.moveTo(80,60);
    cx.bezierCurveTo(80+wp*60,60-wp*30, 80+wp*50,60+wp*10, 80+wp*20,60+wp*20);
    cx.stroke();
    // Gold ring of stars
    for(let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2+f*0.08;
      const r=35+wp*20;
      const sx=80+Math.cos(a)*r, sy=60+Math.sin(a)*r*0.5;
      cx.fillStyle='#ffd700';
      cx.beginPath(); cx.arc(sx,sy,3,0,Math.PI*2); cx.fill();
    }
    cx.restore();
    if(t>0.4) this.label(cx,'✨ HỒI SINH! 30% HP + KHIÊN!',220,15,'#ffd700',11);
  },

  _loop(){
    if(!this.active){fxctx.clearRect(0,0,bcv.width,bcv.height);return;}
    fxctx.clearRect(0,0,bcv.width,bcv.height);
    try{
      const f=this.frame, mF=this._maxF;
      const ex=this._extra||{};
      switch(this.skill){
        case 'atk':    this.drawFrame_slash(f,mF,false); break;
        case 'double': this._double=true; this.drawFrame_slash(f,mF,false); break;
        case 'crit':   this.drawFrame_slash(f,mF,true); break;
        case 'fire': case 'fireblast': case 'magicburn':
                       this.drawFrame_fire(f,mF); break;
        case 'burn':   this.drawFrame_burn(f,mF); break;
        case 'dragon_fire': this.drawFrame_dragonFire(f,mF); break;
        case 'player_burn': this.drawFrame_playerBurn(f,mF); break;
        case 'thunder': this.drawFrame_thunder(f,mF,ex.stun); break;
        case 'windblast': this.drawFrame_wind(f,mF,ex.shield); break;
        case 'water':  this.drawFrame_water(f,mF); break;
        case 'magic':  this.drawFrame_magic(f,mF); break;
        case 'naturebind': this.drawFrame_naturebind(f,mF); break;
        case 'tideheal':   this.drawFrame_tideheal(f,mF,ex.heal); break;
        case 'angel_dodge': this.drawFrame_angel_dodge(f,mF); break;
        case 'angel_triple': this.drawFrame_angel_triple(f,mF); break;
        case 'angel_revive': this.drawFrame_angel_revive(f,mF); break;
      }
    }catch(e){ console.warn('FX render error:',e); }
    this.frame++;
    if(this.frame>this._maxF){
      this.active=false;
      fxctx.clearRect(0,0,bcv.width,bcv.height);
      return;
    }
    this.rafId=requestAnimationFrame(()=>this._loop());
  },
};
// (device detection moved to top of script)
const WORLD_W=10400; // mở rộng: hồ trái + lâu đài cuối phải

// ── HỒ NƯỚC ─────────────────────────────────────────────────
const LAKE_X1   = 300;   // bắt đầu hồ (world coords)
const LAKE_X2   = 1600;  // kết thúc hồ
const LAKE_SURF = null;  // tính động từ gY
const LAKE_DEEP = 300;   // độ sâu hồ (px dưới đất) - portal ở đáy

// ── OCEAN WORLD state ────────────────────────────────────────
let inOcean = false;      // đang trong thế giới đại dương
let oceanBubbles = [];    // bong bóng nổi lên
let oceanCorals  = [];    // san hô đáy biển
let oceanFish    = [];    // cá bơi
let oceanCam     = {x:0, y:0}; // camera ocean (scroll 2D)
let oceanRuins   = [];    // tàn tích đá pixel
let oceanSeaweed = [];    // rong biển
let oceanSmallFish = [];  // cá nhỏ theo đàn
let oceanDebris  = [];    // mảnh đá đáy
const OCEAN_W    = 2000;  // chiều rộng ocean world
const OCEAN_H    = 800;   // chiều cao ocean world (sâu)
const OCEAN_SURF = 80;    // y mặt nước tính từ trên
let portalRipple = 0;     // hiệu ứng gợn sóng portal
let lakeSplashes = [];    // pixel splash animations on lake surface
let lakeSplashTimer = 0;  // countdown to next splash spawn

// ── OCEAN CHALLENGE — 10 màn dưới đại dương ─────────────────
const oceanChallengeFloors=[
  {floor:1, name:'Tầng 1 — Vùng Nông',       drawFn:'drawSeaCrab',   sc:1.2, anchorRows:24, topRows:28, monster:{type:'seacrab',  name:'🦀 Cua Biển Nhỏ',     hp:70,  maxHp:70,  rw:7,  dragonAtk:0}},
  {floor:2, name:'Tầng 2 — Rạn San Hô',      drawFn:'drawTropical',  sc:1.4, anchorRows:8,  topRows:0, monster:{type:'tropical', name:'🐡 Cá Nhiệt Đới',     hp:110, maxHp:110, rw:9,  dragonAtk:0}},
  {floor:3, name:'Tầng 3 — Hang Cua',        drawFn:'drawBigCrab',   sc:1.6, anchorRows:24, topRows:28, monster:{type:'bigcrab',  name:'🦀 Cua Khổng Lồ',    hp:190, maxHp:190, rw:18, dragonAtk:0}},
  {floor:4, name:'Tầng 4 — Vực Tối',         drawFn:'drawTropical',  sc:1.8, anchorRows:8,  topRows:0, monster:{type:'tropical', name:'🐠 Cá Nhiệt Đới To',  hp:260, maxHp:260, rw:24, dragonAtk:0}},
  {floor:5, name:'Tầng 5 — Boss: Mực Ống',   drawFn:'drawSquid',     sc:2.4, anchorRows:36, topRows:0, monster:{type:'squid',    name:'🦑 Mực Ống Khổng',    hp:450, maxHp:450, rw:65, dragonAtk:18,dragonCritChance:0.12,isBoss:true}},
  {floor:6, name:'Tầng 6 — Bạch Tuộc',       drawFn:'drawOctopus',   sc:2.2, anchorRows:30, topRows:13, monster:{type:'octopus',  name:'🐙 Bạch Tuộc Tím',    hp:360, maxHp:360, rw:32, dragonAtk:0}},
  {floor:7, name:'Tầng 7 — Cá Mập',          drawFn:'drawSharkSwim', sc:2.4, anchorRows:14, topRows:10, monster:{type:'shark',    name:'🦈 Cá Mập Trắng',     hp:460, maxHp:460, rw:40, dragonAtk:0}},
  {floor:8, name:'Tầng 8 — Bạch Tuộc Lớn',   drawFn:'drawOctopus',   sc:2.8, anchorRows:30, topRows:13, monster:{type:'octopus',  name:'🐙 Bạch Tuộc Khổng',  hp:580, maxHp:580, rw:55, dragonAtk:0}},
  {floor:9, name:'Tầng 9 — Mực Chúa',        drawFn:'drawSquid',     sc:2.6, anchorRows:36, topRows:0, monster:{type:'squid',    name:'🦑 Mực Chúa Vực Sâu', hp:750, maxHp:750, rw:85, dragonAtk:25,dragonCritChance:0.16}},
  {floor:10,name:'Tầng 10 — HẢI LONG VƯƠNG', drawFn:'drawSeaDragon', sc:2.4, anchorRows:28, topRows:28, monster:{type:'seadragon',name:'🌊 HẢI LONG VƯƠNG',   hp:1400,maxHp:1400,rw:180,dragonAtk:35,dragonCritChance:0.22,isBoss:true}},
];
let oceanFloor=1;
let oceanBattleActive=false;
let oceanFloorCleared=false;
let oceanDoorOpen=false;
ctx.imageSmoothingEnabled=false;
ictx.imageSmoothingEnabled=false;
bctx.imageSmoothingEnabled=false;

// ═══════════════════════════════════════════
// PARTICLE SYSTEM (enhanced)
// ═══════════════════════════════════════════
const particles=[];
function spawnParticles(x,y,col,n=8,speed=2,type='circle'){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2;
    const s=speed*(0.5+Math.random());
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:1,col,size:2+Math.random()*3,type,rot:Math.random()*Math.PI*2,spin:(Math.random()-0.5)*0.2});
  }
}
function spawnMagicBurst(x,y){
  const cols=['#bb00ff','#ff00bb','#6600ff','#00aaff','#ffffff'];
  for(let i=0;i<16;i++){
    const a=i*(Math.PI*2/16)+Math.random()*0.3;
    const s=2+Math.random()*3;
    const col=cols[Math.floor(Math.random()*cols.length)];
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-0.5,life:1,col,size:1.5+Math.random()*2.5,type:'star',rot:Math.random()*Math.PI,spin:(Math.random()-0.5)*0.3});
  }
}
function spawnBloodHit(x,y){
  for(let i=0;i<10;i++){
    const a=-Math.PI/2+(Math.random()-0.5)*Math.PI*1.2;
    const s=1.5+Math.random()*3;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,col:Math.random()<0.5?'#ff2200':'#cc0000',size:2+Math.random()*3,type:'circle',rot:0,spin:0});
  }
}
function spawnLeaves(x,y){
  const leafCols=['#4caf50','#66bb6a','#388e3c','#f9a825','#e65100'];
  for(let i=0;i<6;i++){
    const col=leafCols[Math.floor(Math.random()*leafCols.length)];
    particles.push({x:x+(Math.random()-0.5)*20,y,vx:(Math.random()-0.5)*1.5,vy:-Math.random()*1.5-0.5,life:1,col,size:3+Math.random()*2,type:'leaf',rot:Math.random()*Math.PI*2,spin:(Math.random()-0.5)*0.15});
  }
}
function spawnDust(x,y){
  for(let i=0;i<5;i++){
    particles.push({x:x+(Math.random()-0.5)*10,y:y+20,vx:(Math.random()-0.5)*1.2,vy:-0.3-Math.random()*0.5,life:0.7,col:'rgba(210,190,160,0.6)',size:3+Math.random()*4,type:'circle',rot:0,spin:0});
  }
}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.vy+=0.08;
    p.rot+=p.spin;
    if(p.type==='leaf'){p.vx+=Math.sin(p.rot*2)*0.04;p.vy+=0.02;p.life-=0.012;}
    else p.life-=0.025;
    if(p.life<=0)particles.splice(i,1);
  }
}
function drawStar5(cx,x,y,r,col,alpha){
  cx.save();cx.globalAlpha=alpha;cx.fillStyle=col;
  cx.shadowColor=col;cx.shadowBlur=8;
  cx.beginPath();
  for(let i=0;i<10;i++){
    const a=i*Math.PI/5-Math.PI/2;
    const rd=i%2===0?r:r*0.42;
    if(i===0)cx.moveTo(x+Math.cos(a)*rd,y+Math.sin(a)*rd);
    else cx.lineTo(x+Math.cos(a)*rd,y+Math.sin(a)*rd);
  }
  cx.closePath();cx.fill();cx.restore();
}
function drawParticles(camX){
  particles.forEach(p=>{
    const sx=p.x-camX;
    const pr=Math.max(0.1,p.size*p.life);
    if(p.type==='star'){
      drawStar5(ctx,sx,p.y,pr,p.col,p.life);
    } else if(p.type==='leaf'){
      ctx.save();ctx.globalAlpha=p.life*0.9;
      ctx.translate(sx,p.y);ctx.rotate(p.rot);
      ctx.fillStyle=p.col;
      ctx.beginPath();ctx.ellipse(0,0,pr*1.5,pr*0.7,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    } else {
      ctx.save();ctx.globalAlpha=p.life;
      ctx.fillStyle=p.col;
      ctx.shadowColor=p.col;ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(sx,p.y,pr,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  });
}

// ═══════════════════════════════════════════
// AMBIENT PARTICLES (fireflies, floating dust)
// ═══════════════════════════════════════════
const fireflies=[];
for(let i=0;i<18;i++){
  fireflies.push({
    wx:Math.random()*2400,
    y:GH*0.2+Math.random()*GH*(0.30),
    phase:Math.random()*Math.PI*2,
    speed:0.3+Math.random()*0.5,
    size:1+Math.random()*1.5,
    col:Math.random()<0.5?'#aaff44':'#ffff88',
  });
}
function updateFireflies(){
  fireflies.forEach(f=>{
    f.wx+=(Math.sin(f.phase*0.7)*0.6+0.1)*f.speed;
    f.y+=Math.cos(f.phase*1.1)*0.4;
    f.phase+=0.02+Math.random()*0.01;
    if(f.wx>WORLD_W) f.wx=0;
    if(f.y<GH*0.1) f.y=GH*0.1;
    if(f.y>GH*(0.65)) f.y=GH*(0.63);
  });
}
function drawFireflies(camX){
  const td=Math.sin(timeOfDay*Math.PI*2);
  if(td>0.4)return;
  const alpha=(0.4-td)/0.4;
  fireflies.forEach(f=>{
    const sx=f.wx-camX;
    if(sx<-10||sx>GW+10)return;
    const glow=0.5+Math.sin(f.phase*3)*0.5;
    ctx.save();
    ctx.globalAlpha=glow*alpha*0.8;
    ctx.shadowColor=f.col;ctx.shadowBlur=12;
    ctx.fillStyle=f.col;
    ctx.beginPath();ctx.arc(sx,f.y,f.size,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

let leafTimer=0;
function maybeSpawnLeaf(camX){
  leafTimer++;
  if(leafTimer%45===0){
    const wx=camX+Math.random()*GW;
    const near=worldTrees.some(t=>Math.abs(t.wx-wx)<80);
    if(near) spawnLeaves(wx,GH*0.3+Math.random()*GH*0.2);
  }
}
let dustTimer=0;
function maybeSpawnDust(){
  if(Math.abs(P.vx)>1&&P.onGround){
    dustTimer++;
    if(dustTimer%8===0) spawnDust(P.x+P.w/2,P.y+P.h);
  }
}

// ═══════════════════════════════════════════
// HD SPRITE RENDERER  (draws with sub-rects)
// ═══════════════════════════════════════════
// Each color key maps to an RGBA
// ═══════════════════════════════════════════════════════════════
// SPRITE SYSTEM — Scale 3px per unit for better detail
// All sprites use pixel grid, sc=3 for world rendering
// ═══════════════════════════════════════════════════════════════

// Updated color palette
// ═══════════════════════════════════════════════════════════════
// PIXEL ART SPRITES — sc=2, faithful to reference images
// Each sprite drawn pixel-by-pixel matching reference exactly
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// HIGH-DETAIL PIXEL ART — pixel-by-pixel from reference images
// sc=2 (small on screen but very faithful to references)
// Grids: Knight 24×36, Goblin 16×28, Orc 22×36, Bat 20×14
// ═══════════════════════════════════════════════════════════════
const C={
  // Knight — image 4: silver plate armor, red plume+cape, gold trim
  k1:'#d0d8e4',k2:'#a0aabb',k3:'#707888',k4:'#e8eef8',k5:'#50586a',k6:'#384050',
  kr:'#cc1818',kr2:'#ff2828',kr3:'#881010',
  kg:'#e0aa00',kg2:'#b08000',
  kf:'#f2c89a',kf2:'#c89060',
  // Goblin — image 3: vivid green, huge yellow eyes, brown cloth
  g1:'#5acc3a',g2:'#3a8c24',g3:'#7ade50',g4:'#1e5c12',g5:'#a0f070',g6:'#8edc60',
  gy:'#ffdd00',gy2:'#ffaa00',gy3:'#dd6600',gy4:'#ff6600',
  gc:'#8a5c20',gc2:'#5e3c10',gc3:'#b07a30',
  // Orc — image 2: olive green skin, brown leather vest, ORANGE belt+silver buckle
  o1:'#4a7030',o2:'#30501e',o3:'#6a9044',o4:'#203010',o5:'#80aa58',
  ol:'#7a4018',ol2:'#502808',ol3:'#a06030',
  oo:'#e86000',oo2:'#ff8800',oo3:'#b04400',
  om:'#b0b8c0',om2:'#808c94',om3:'#d0d8e0',
  // Bat — image 1: near-black body, BRIGHT YELLOW eyes, spread angular wings
  b1:'#181820',b2:'#282830',b3:'#383848',b4:'#0c0c14',b5:'#484858',
  by:'#ffee00',by2:'#ddbb00',by3:'#ffff88',
  T:'transparent',
};

// ──────────────────────────────────────────────────────────────
// KNIGHT  24×36 grid · sc=2 → 48×72px
// Image 4: full plate armor, red plume, red cape, shield+sword
// ──────────────────────────────────────────────────────────────
