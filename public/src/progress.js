function openProgress(){
  document.getElementById('prog-overlay').classList.add('on');
  progTab('overview');
}
function closeProgress(){
  document.getElementById('prog-overlay').classList.remove('on');
}

function progTab(tab){
  _progTab = tab;
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on'));
  const el = document.getElementById('ptab-'+tab);
  if(el) el.classList.add('on');
  renderProgBody(tab);
}

function fmt(ms){
  const s=Math.floor(ms/1000);
  if(s<60) return s+'s';
  const m=Math.floor(s/60);
  if(m<60) return m+'p'+(s%60)+'s';
  return Math.floor(m/60)+'h'+m%60+'p';
}
function fmtTime(ts){
  const d=new Date(ts);
  return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+
    ' '+d.getDate()+'/'+( d.getMonth()+1);
}
function pct(c,a){ return a>0?Math.round(c/a*100):0; }
function barColor(p){ return p>=80?'#2ecc40':p>=60?'#ffd700':p>=40?'#e67e22':'#e74c3c'; }

function renderProgBody(tab){
  const body = document.getElementById('prog-body');
  const ls = learnStats;

  if(tab==='overview'){
    const totAcc = pct(
      Object.values(ls.subjects).reduce((s,v)=>s+v.correct,0),
      Object.values(ls.subjects).reduce((s,v)=>s+v.answered,0)
    );
    const totStars = Object.values(ls.subjects).reduce((s,v)=>s+(v.bestStars||0),0);
    body.innerHTML = `
      <div class="prog-summary">
        <div class="psum-card"><div class="psum-val">${ls.totalSessions}</div><div class="psum-lbl">Buổi học</div></div>
        <div class="psum-card"><div class="psum-val">${totAcc}%</div><div class="psum-lbl">Độ chính xác</div></div>
        <div class="psum-card"><div class="psum-val">${fmt(ls.totalTime)}</div><div class="psum-lbl">Tổng thời gian</div></div>
        <div class="psum-card"><div class="psum-val">${ls.totalCoinsEarned}🪙</div><div class="psum-lbl">Xu kiếm được</div></div>
      </div>
      <div class="prog-section-title">📚 Tổng quan từng môn</div>
      <div class="prog-subjects">
        ${Object.entries(SUBJ_CONFIG).map(([key,cfg])=>{
          const s=ls.subjects[key];
          const acc=pct(s.correct,s.answered);
          const bc=barColor(acc);
          const scoreAcc=s.maxScore>0?pct(s.totalScore,s.maxScore):0;
          return `<div class="subj-card">
            <div class="subj-card-hdr"><span class="subj-icon">${cfg.icon}</span><span class="subj-name">${cfg.name}</span></div>
            <div class="subj-stat-row"><span class="subj-stat">Buổi: <span>${s.sessions}</span></span><span class="subj-stat">TG: <span>${fmt(s.time)}</span></span></div>
            <div class="subj-stat-row"><span class="subj-stat">Đúng: <span>${s.correct}/${s.answered}</span></span><span class="subj-stat">Điểm TB: <span>${scoreAcc}%</span></span></div>
            <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${acc}%;background:${bc}"></div></div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:9px;color:${bc}">${acc}% chính xác</span>
              <span class="subj-stars">${'⭐'.repeat(s.bestStars)}${'☆'.repeat(3-s.bestStars)}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
      <button class="export-btn" onclick="exportCSV()">⬇ Xuất CSV nghiên cứu</button>
    `;
  }

  else if(tab==='subjects'){
    body.innerHTML = Object.entries(SUBJ_CONFIG).map(([key,cfg])=>{
      const s=ls.subjects[key];
      const lvEntries=Object.entries(s.levels);
      return `
        <div class="prog-section-title">${cfg.icon} ${cfg.name}</div>
        <div class="prog-subjects" style="grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px">
          <div class="psum-card"><div class="psum-val">${s.sessions}</div><div class="psum-lbl">Buổi</div></div>
          <div class="psum-card"><div class="psum-val">${pct(s.correct,s.answered)}%</div><div class="psum-lbl">Chính xác</div></div>
          <div class="psum-card"><div class="psum-val">${s.correct}/${s.answered}</div><div class="psum-lbl">Đúng/Tổng</div></div>
          <div class="psum-card"><div class="psum-val">${fmt(s.time)}</div><div class="psum-lbl">Thời gian</div></div>
        </div>
        ${lvEntries.length>0?`
          <div style="font-size:9px;color:#664400;letter-spacing:1px;margin-bottom:6px">CẤP ĐỘ ĐÃ CHƠI</div>
          <div class="lv-grid" style="margin-bottom:12px">
            ${lvEntries.map(([lk,lv])=>`
              <div class="lv-cell ${lv.stars>=3?'perfect':lv.stars>0?'done':''}">
                <div class="lv-num">${lk.toUpperCase()}</div>
                <div class="lv-sc">${lv.score}/${lv.maxScore}</div>
                <div class="lv-stars">${'⭐'.repeat(lv.stars)}${'☆'.repeat(3-lv.stars)}</div>
              </div>`).join('')}
          </div>`:'<div style="font-size:9px;color:#444;margin-bottom:12px">Chưa có dữ liệu màn</div>'}
      `;
    }).join('');
  }

  else if(tab==='types'){
    body.innerHTML = `
      <div class="prog-section-title">🧩 Độ chính xác theo loại câu hỏi</div>
      <div class="type-grid">
        ${Object.entries(Q_TYPE_CONFIG).map(([key,cfg])=>{
          const t=ls.types[key];
          const acc=pct(t.c,t.a);
          const bc=barColor(acc);
          return `<div class="type-card">
            <div class="type-icon">${cfg.icon}</div>
            <div class="type-name">${cfg.name}</div>
            <div class="type-acc" style="color:${bc}">${acc}%</div>
            <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${acc}%;background:${bc}"></div></div>
            <div class="type-count">${t.c}/${t.a} câu đúng</div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:10px;padding:8px;background:#080400;border:1px solid #1a1000;border-radius:4px;font-size:9px;color:#664400;line-height:1.6">
        💡 <strong style="color:#ffd700">Gợi ý:</strong> ${getWeaknessTip()}
      </div>
    `;
  }

  else if(tab==='cave'){
    body.innerHTML = `
      <div class="prog-section-title">🏔 Tiến độ Hang Động</div>
      <div class="cave-prog-grid">
        ${CHAPTERS.map((ch,ci)=>{
          const prog=caveProgress[ci];
          const done=prog.filter(l=>l.done).length;
          const perfect=prog.filter(l=>l.stars===3).length;
          return `<div class="cave-chap-card">
            <div class="cave-chap-name">${ch.icon} ${ch.name}</div>
            <div style="font-size:9px;color:#666;margin-bottom:6px">${done}/10 màn · ${perfect} hoàn hảo</div>
            <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${done*10}%;background:${ch.color}"></div></div>
            <div class="cave-lv-row" style="margin-top:6px">
              ${prog.map((lv,i)=>`
                <div class="cave-lv-dot ${lv.done?(lv.stars===3?'perfect':'done'):''}">
                  ${lv.done?'⭐'.repeat(lv.stars):'·'}
                </div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:12px">
        <div class="prog-section-title">📊 Thống kê tổng hang động</div>
        <div class="prog-summary">
          <div class="psum-card"><div class="psum-val">${caveProgress.flat().filter(l=>l.done).length}/30</div><div class="psum-lbl">Màn hoàn thành</div></div>
          <div class="psum-card"><div class="psum-val">${caveProgress.flat().filter(l=>l.stars===3).length}</div><div class="psum-lbl">3 sao</div></div>
          <div class="psum-card"><div class="psum-val">${caveProgress.flat().reduce((s,l)=>s+l.stars,0)}/90</div><div class="psum-lbl">Tổng sao</div></div>
          <div class="psum-card"><div class="psum-val">${Math.round(caveProgress.flat().reduce((s,l)=>s+l.stars,0)/90*100)}%</div><div class="psum-lbl">Hoàn thiện</div></div>
        </div>
      </div>
    `;
  }

  else if(tab==='log'){
    const log=ls.log;
    body.innerHTML = `
      <div class="prog-section-title">📋 Lịch sử buổi học (${log.length} buổi gần nhất)</div>
      ${log.length===0?'<div style="font-size:10px;color:#444;text-align:center;padding:20px">Chưa có lịch sử học</div>':''}
      <div class="sess-log">
        ${log.map(e=>{
          const subjName=SUBJ_CONFIG[e.subject]?.name||CHAPTERS.find(c=>'cave_'+c.id===e.subject)?.name||e.subject;
          const subjIcon=SUBJ_CONFIG[e.subject]?.icon||(e.isCave?'🏔':'📚');
          const acc=pct(e.correct,e.answered);
          return `<div class="sess-row">
            <span style="font-size:11px">${subjIcon}</span>
            <span class="sess-subj">${subjName}</span>
            <span class="sess-score">${'⭐'.repeat(e.stars)}${'☆'.repeat(3-e.stars)} ${e.score}/${e.maxScore}</span>
            <span class="sess-acc">${acc}%</span>
            <span style="color:#ffd700;font-size:9px">+${e.coins}🪙</span>
            <span style="color:#888;font-size:9px">${fmt(e.ms)}</span>
            <span class="sess-time">${fmtTime(e.t)}</span>
          </div>`;
        }).join('')}
      </div>
      ${log.length>0?`<button class="export-btn" onclick="exportCSV()">⬇ Xuất CSV nghiên cứu</button>`:''}
    `;
  }
}

function getWeaknessTip(){
  const types=learnStats.types;
  let worst=null, worstAcc=101;
  Object.entries(types).forEach(([k,v])=>{
    if(v.a>0){
      const a=pct(v.c,v.a);
      if(a<worstAcc){worstAcc=a;worst=k;}
    }
  });
  if(!worst||worstAcc===101) return 'Hãy làm nhiều bài tập hơn để xem gợi ý cải thiện!';
  const tips={
    mcq:'Câu trắc nghiệm — hãy đọc kỹ từng đáp án trước khi chọn.',
    imgpick:'Câu chọn hình — chú ý quan sát từng hình ảnh cẩn thận.',
    match:'Câu nối đôi — ôn lại các cặp khái niệm liên quan.',
    wordfill:'Câu điền từ — ôn từ vựng và ngữ cảnh câu.',
    sort:'Câu sắp xếp — ôn lại thứ tự, quy trình, trình tự thời gian.',
  };
  return `Dạng yếu nhất: <strong style="color:#ffd700">${Q_TYPE_CONFIG[worst]?.name}</strong> (${worstAcc}%). ${tips[worst]||''}`;
}

function exportCSV(){
  const rows=[['Thời gian','Môn học','Điểm','Điểm tối đa','Sao','Đúng','Tổng câu','Chính xác (%)','Xu nhận','Thời gian (giây)','Loại']];
  learnStats.log.forEach(e=>{
    const d=new Date(e.t);
    const timeStr=d.toLocaleDateString('vi-VN')+' '+d.toLocaleTimeString('vi-VN');
    const subjName=SUBJ_CONFIG[e.subject]?.name||CHAPTERS.find(c=>'cave_'+c.id===e.subject)?.name||e.subject;
    rows.push([
      timeStr, subjName, e.score, e.maxScore, e.stars,
      e.correct, e.answered, pct(e.correct,e.answered),
      e.coins, Math.round(e.ms/1000),
      e.isCave?'Hang Động':'Thế Giới'
    ]);
  });
  // Type accuracy rows
  rows.push([]);
  rows.push(['LOẠI CÂU HỎI','','Đúng','Tổng','Chính xác (%)']);
  Object.entries(Q_TYPE_CONFIG).forEach(([k,cfg])=>{
    const t=learnStats.types[k];
    rows.push([cfg.name,'',t.c,t.a,pct(t.c,t.a)]);
  });
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const bom='\uFEFF'; // UTF-8 BOM for Excel
  const blob=new Blob([bom+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='tien-do-hoc-tap-'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();URL.revokeObjectURL(url);
  showNotif('✅ Đã xuất CSV!');
}


// ── 🌊 HẢI LONG VƯƠNG — pixel-art sea dragon boss
// Rồng biển xoắn chữ S, thân teal, bụng vàng, mắt đỏ, sóng xanh
// ── 🌊 HẢI LONG VƯƠNG — pixel-perfect từ ảnh gốc (grid 62×62, gs=24px)
function drawSeaDragon(cx,x,y,frame,sc){
  sc=sc||1; cx.save(); cx.imageSmoothingEnabled=false;
  const bob=Math.round(Math.sin(frame*0.06)*2);
  // Anchor: tâm grid (31,31)
  const ox=Math.round(x-31*sc), oy=Math.round(y-31*sc+bob);
  const p=(gx,gy,w,h,col)=>{
    if(!col)return; cx.fillStyle=col;
    cx.fillRect(ox+gx*sc, oy+gy*sc, Math.max(1,w*sc), Math.max(1,h*sc));
  };
  // Palette từ ảnh gốc
  const K ='#08082a';const D1='#12166e';const D2='#1a2090';
  const B1='#2244b8';const B2='#3a78d8';const B3='#55a8ee';
  const B4='#77ccf8';const C1='#99ddf8';const C2='#bbecff';
  const WH='#ddf4ff';const W ='#f0faff';

  // r0
  p(18,0,1,1,D2);p(19,0,1,1,D1);p(20,0,1,1,D2);p(24,0,2,1,WH);p(40,0,1,1,D2);p(41,0,1,1,D1);p(42,0,1,1,D2);p(52,0,2,1,WH);
  // r1
  p(18,1,1,1,D2);p(19,1,1,1,B1);p(20,1,1,1,B2);p(21,1,1,1,D2);p(24,1,2,1,WH);p(36,1,3,1,B1);p(39,1,1,1,D2);p(40,1,2,1,B1);p(42,1,1,1,D2);p(52,1,2,1,WH);
  // r2
  p(4,2,3,1,B2);p(18,2,1,1,D2);p(19,2,1,1,B1);p(20,2,1,1,B2);p(21,2,2,1,B1);p(23,2,1,1,D2);p(34,2,1,1,D2);p(35,2,1,1,B1);p(36,2,2,1,B2);p(38,2,4,1,B1);p(42,2,1,1,D2);
  // r3
  p(3,3,1,1,B3);p(4,3,3,1,B2);p(19,3,2,1,D2);p(21,3,1,1,B4);p(22,3,2,1,D2);p(33,3,3,1,B1);p(36,3,1,1,B2);p(37,3,3,1,B3);p(40,3,1,1,B1);p(41,3,1,1,D2);
  // r4
  p(2,4,2,1,B2);p(4,4,1,1,WH);p(5,4,1,1,C1);p(6,4,1,1,B2);p(7,4,1,1,D2);p(19,4,1,1,D2);p(20,4,1,1,B1);p(21,4,1,1,B4);p(22,4,1,1,D2);p(23,4,10,1,D1);p(33,4,1,1,D2);p(34,4,1,1,B4);p(35,4,4,1,B3);p(39,4,1,1,D2);p(40,4,1,1,D1);
  // r5
  p(2,5,2,1,D2);p(4,5,1,1,C1);p(5,5,1,1,B4);p(6,5,1,1,B1);p(7,5,1,1,D2);p(18,5,1,1,B1);p(19,5,1,1,B2);p(20,5,3,1,B3);p(23,5,1,1,C1);p(24,5,3,1,C2);p(27,5,1,1,B4);p(28,5,1,1,B3);p(29,5,4,1,B2);p(33,5,3,1,B3);p(36,5,2,1,B4);p(38,5,1,1,B2);p(39,5,7,1,D2);
  // r6
  p(2,6,1,1,D2);p(3,6,1,1,B1);p(4,6,1,1,B2);p(5,6,2,1,B1);p(7,6,1,1,D2);p(18,6,1,1,B1);p(19,6,1,1,B2);p(20,6,1,1,B3);p(21,6,2,1,B4);p(23,6,2,1,C1);p(25,6,2,1,C2);p(27,6,1,1,C1);p(28,6,1,1,B4);p(29,6,2,1,B3);p(31,6,1,1,B2);p(32,6,3,1,B1);p(35,6,3,1,B3);p(38,6,1,1,B2);p(39,6,6,1,B1);p(45,6,1,1,B2);p(46,6,1,1,B1);p(57,6,2,1,B2);p(59,6,1,1,B3);
  // r7
  p(3,7,1,1,WH);p(4,7,3,1,D2);p(18,7,1,1,D2);p(19,7,1,1,B1);p(20,7,1,1,B3);p(21,7,2,1,B4);p(23,7,2,1,B3);p(25,7,4,1,B4);p(29,7,2,1,B3);p(31,7,2,1,B1);p(33,7,1,1,D2);p(34,7,1,1,D1);p(35,7,1,1,B3);p(36,7,4,1,B2);p(40,7,5,1,B3);p(45,7,1,1,B2);p(46,7,1,1,B1);p(47,7,2,1,D2);p(56,7,2,1,B2);p(58,7,2,1,B3);p(60,7,1,1,D2);
  // r8
  p(18,8,1,1,D2);p(19,8,1,1,B1);p(20,8,1,1,B3);p(21,8,4,1,B2);p(25,8,3,1,B4);p(28,8,2,1,B3);p(30,8,1,1,D1);p(31,8,1,1,C1);p(32,8,1,1,C2);p(33,8,1,1,B4);p(34,8,1,1,D1);p(35,8,1,1,B3);p(36,8,3,1,B2);p(39,8,3,1,B4);p(42,8,5,1,B3);p(47,8,2,1,D1);p(49,8,1,1,D2);p(56,8,1,1,B2);p(57,8,2,1,C2);p(59,8,1,1,B4);p(60,8,1,1,D1);p(61,8,1,1,D2);
  // r9
  p(10,9,4,1,D2);p(14,9,1,1,B2);p(15,9,1,1,B1);p(16,9,2,1,D2);p(18,9,1,1,B1);p(19,9,1,1,B2);p(20,9,1,1,B1);p(21,9,2,1,D2);p(23,9,1,1,B1);p(24,9,3,1,B2);p(27,9,1,1,B1);p(28,9,2,1,D2);p(30,9,1,1,C2);p(31,9,1,1,C1);p(32,9,1,1,B3);p(33,9,1,1,B2);p(34,9,1,1,D1);p(35,9,1,1,B3);p(36,9,2,1,B2);p(38,9,1,1,B3);p(39,9,4,1,B4);p(43,9,4,1,B3);p(47,9,3,1,B1);p(50,9,1,1,D2);p(56,9,1,1,B1);p(57,9,2,1,B4);p(59,9,1,1,B3);p(60,9,1,1,D1);p(61,9,1,1,D2);
  // r10
  p(9,10,1,1,D2);p(10,10,1,1,B1);p(11,10,3,1,B2);p(14,10,2,1,B1);p(16,10,2,1,B2);p(18,10,1,1,B1);p(19,10,1,1,D2);p(20,10,1,1,B1);p(21,10,2,1,B2);p(23,10,2,1,B1);p(25,10,1,1,B2);p(26,10,1,1,B3);p(27,10,1,1,B2);p(28,10,1,1,B1);p(29,10,1,1,D2);p(30,10,1,1,B2);p(31,10,3,1,B1);p(34,10,1,1,B2);p(35,10,3,1,B3);p(38,10,2,1,B4);p(40,10,1,1,C1);p(41,10,1,1,C2);p(42,10,2,1,B4);p(44,10,3,1,B3);p(47,10,2,1,B2);p(49,10,1,1,B1);p(50,10,1,1,D2);p(56,10,4,1,B1);p(60,10,1,1,D2);
  // r11
  p(8,11,1,1,D2);p(9,11,1,1,B1);p(10,11,1,1,B3);p(11,11,1,1,C1);p(12,11,1,1,B4);p(13,11,1,1,B3);p(14,11,2,1,B1);p(16,11,2,1,B3);p(18,11,3,1,B1);p(21,11,1,1,B4);p(22,11,1,1,B3);p(23,11,1,1,B2);p(24,11,1,1,B1);p(25,11,1,1,B2);p(26,11,2,1,C1);p(28,11,1,1,B2);p(29,11,5,1,B1);p(34,11,3,1,B3);p(37,11,2,1,B4);p(39,11,1,1,C1);p(40,11,2,1,C2);p(42,11,3,1,B4);p(45,11,2,1,B3);p(47,11,2,1,B2);p(49,11,1,1,B1);p(50,11,1,1,D2);p(57,11,3,1,D2);
  // r12
  p(7,12,1,1,D2);p(8,12,1,1,D1);p(9,12,1,1,B3);p(10,12,1,1,C1);p(11,12,2,1,WH);p(13,12,5,1,B3);p(18,12,4,1,B4);p(22,12,2,1,B3);p(24,12,1,1,B4);p(25,12,2,1,C1);p(27,12,2,1,B4);p(29,12,7,1,B3);p(36,12,2,1,B4);p(38,12,1,1,C1);p(39,12,1,1,WH);p(40,12,1,1,C1);p(41,12,4,1,B4);p(45,12,4,1,B2);p(49,12,1,1,B1);p(50,12,1,1,D2);p(52,12,2,1,WH);
  // r13
  p(7,13,1,1,D2);p(8,13,1,1,D1);p(9,13,1,1,B4);p(10,13,2,1,C2);p(12,13,1,1,C1);p(13,13,1,1,B3);p(14,13,3,1,B4);p(17,13,1,1,B3);p(18,13,1,1,B4);p(19,13,1,1,C2);p(20,13,2,1,WH);p(22,13,4,1,C1);p(26,13,2,1,B4);p(28,13,6,1,B3);p(34,13,4,1,B4);p(38,13,2,1,C1);p(40,13,5,1,B4);p(45,13,1,1,B3);p(46,13,5,1,B2);p(51,13,1,1,D2);p(52,13,2,1,WH);
  // r14
  p(6,14,2,1,D2);p(8,14,1,1,B2);p(9,14,1,1,B4);p(10,14,2,1,C2);p(12,14,2,1,B4);p(14,14,2,1,C2);p(16,14,3,1,B4);p(19,14,1,1,C2);p(20,14,1,1,WH);p(21,14,3,1,C1);p(24,14,5,1,B4);p(29,14,2,1,B3);p(31,14,3,1,B4);p(34,14,1,1,C2);p(35,14,1,1,C1);p(36,14,9,1,B4);p(45,14,1,1,B3);p(46,14,3,1,B2);p(49,14,1,1,B3);p(50,14,1,1,B2);p(51,14,1,1,D1);
  // r15
  p(6,15,1,1,D1);p(7,15,1,1,D2);p(8,15,1,1,B3);p(9,15,1,1,B4);p(10,15,1,1,C1);p(11,15,1,1,C2);p(12,15,2,1,B4);p(14,15,2,1,C2);p(16,15,3,1,B4);p(19,15,1,1,C1);p(20,15,1,1,C2);p(21,15,1,1,B4);p(22,15,1,1,C1);p(23,15,6,1,B4);p(29,15,2,1,B3);p(31,15,1,1,B4);p(32,15,1,1,C1);p(33,15,1,1,C2);p(34,15,1,1,WH);p(35,15,1,1,C1);p(36,15,2,1,B4);p(38,15,3,1,B3);p(41,15,4,1,B4);p(45,15,1,1,B3);p(46,15,2,1,B2);p(48,15,2,1,B3);p(50,15,1,1,B2);p(51,15,1,1,D1);
  // r16
  p(6,16,1,1,D1);p(7,16,1,1,D2);p(8,16,1,1,B3);p(9,16,1,1,B4);p(10,16,1,1,C1);p(11,16,14,1,B4);p(25,16,6,1,B3);p(31,16,1,1,B4);p(32,16,1,1,C2);p(33,16,2,1,WH);p(35,16,1,1,C1);p(36,16,2,1,B4);p(38,16,2,1,B3);p(40,16,2,1,B2);p(42,16,1,1,B3);p(43,16,4,1,B4);p(47,16,1,1,B3);p(48,16,2,1,B4);p(50,16,1,1,B2);p(51,16,1,1,D1);
  // r17
  p(6,17,1,1,D1);p(7,17,1,1,D2);p(8,17,1,1,B3);p(9,17,1,1,WH);p(10,17,1,1,C2);p(11,17,1,1,B4);p(12,17,1,1,B3);p(13,17,9,1,B4);p(22,17,9,1,B3);p(31,17,7,1,B4);p(38,17,1,1,B3);p(39,17,3,1,B2);p(42,17,3,1,B3);p(45,17,3,1,B2);p(48,17,2,1,B3);p(50,17,1,1,B2);p(51,17,1,1,D1);
  // r18
  p(3,18,2,1,WH);p(6,18,1,1,D1);p(7,18,1,1,D2);p(8,18,1,1,B4);p(9,18,1,1,C1);p(10,18,1,1,B4);p(11,18,2,1,B3);p(13,18,4,1,B4);p(17,18,3,1,B3);p(20,18,2,1,B4);p(22,18,2,1,B3);p(24,18,1,1,B2);p(25,18,1,1,D2);p(26,18,1,1,B3);p(27,18,1,1,B1);p(28,18,1,1,D2);p(29,18,1,1,B1);p(30,18,2,1,B3);p(32,18,5,1,B4);p(37,18,2,1,B3);p(39,18,1,1,B2);p(40,18,1,1,B1);p(41,18,2,1,D2);p(43,18,1,1,B3);p(44,18,7,1,B2);p(51,18,1,1,B1);p(52,18,2,1,D2);
  // r19
  p(3,19,2,1,WH);p(5,19,1,1,D2);p(6,19,1,1,B1);p(7,19,1,1,B2);p(8,19,3,1,B4);p(11,19,3,1,B3);p(14,19,2,1,B4);p(16,19,7,1,B3);p(23,19,1,1,B2);p(24,19,4,1,B1);p(28,19,2,1,D2);p(30,19,2,1,B3);p(32,19,6,1,B4);p(38,19,1,1,B3);p(39,19,4,1,B1);p(43,19,9,1,B2);p(52,19,1,1,B1);p(53,19,2,1,D2);
  // r20
  p(3,20,2,1,WH);p(5,20,1,1,D2);p(6,20,1,1,B1);p(7,20,1,1,B3);p(8,20,1,1,B4);p(9,20,5,1,B3);p(14,20,2,1,B4);p(16,20,1,1,B3);p(17,20,1,1,B2);p(18,20,5,1,B3);p(23,20,1,1,B1);p(24,20,1,1,D2);p(25,20,1,1,B2);p(26,20,1,1,D2);p(27,20,2,1,B1);p(29,20,1,1,D2);p(30,20,1,1,B3);p(31,20,7,1,B4);p(38,20,1,1,B3);p(39,20,1,1,D2);p(40,20,1,1,B1);p(41,20,3,1,B2);p(44,20,2,1,B3);p(46,20,7,1,B2);p(53,20,1,1,B1);p(54,20,2,1,D2);
  // r21
  p(5,21,1,1,D2);p(6,21,1,1,B1);p(7,21,1,1,B3);p(8,21,1,1,B4);p(9,21,1,1,B3);p(10,21,1,1,B1);p(11,21,2,1,D1);p(13,21,4,1,B3);p(17,21,1,1,D1);p(18,21,1,1,B2);p(19,21,1,1,B1);p(20,21,3,1,D1);p(23,21,1,1,B1);p(24,21,4,1,B2);p(28,21,1,1,B1);p(29,21,1,1,D2);p(30,21,5,1,B3);p(35,21,2,1,B4);p(37,21,2,1,B3);p(39,21,1,1,D2);p(40,21,1,1,B1);p(41,21,3,1,B2);p(44,21,3,1,B4);p(47,21,4,1,B3);p(51,21,3,1,B2);p(54,21,1,1,B1);p(55,21,1,1,D1);
  // r22
  p(5,22,1,1,B1);p(6,22,1,1,D2);p(7,22,1,1,B1);p(8,22,1,1,B3);p(9,22,3,1,D2);p(12,22,1,1,D1);p(13,22,2,1,B3);p(15,22,1,1,B2);p(16,22,1,1,D2);p(17,22,1,1,B1);p(18,22,3,1,D2);p(21,22,1,1,B1);p(22,22,1,1,D1);p(23,22,1,1,B1);p(24,22,2,1,B2);p(26,22,1,1,B3);p(27,22,1,1,B2);p(28,22,1,1,B1);p(29,22,1,1,D2);p(30,22,7,1,B3);p(37,22,1,1,B2);p(38,22,1,1,D2);p(39,22,1,1,B1);p(40,22,1,1,B2);p(41,22,1,1,B3);p(42,22,1,1,C1);p(43,22,4,1,B4);p(47,22,4,1,B3);p(51,22,4,1,B2);p(55,22,1,1,B3);p(56,22,1,1,D1);p(57,22,1,1,D2);
  // r23
  p(6,23,1,1,D1);p(7,23,1,1,D2);p(8,23,1,1,B3);p(9,23,2,1,D2);p(12,23,1,1,D2);p(13,23,1,1,B1);p(14,23,1,1,B3);p(15,23,1,1,B2);p(16,23,1,1,D2);p(18,23,3,1,D2);p(22,23,1,1,D1);p(23,23,1,1,B1);p(24,23,2,1,B2);p(26,23,1,1,B3);p(27,23,1,1,B2);p(28,23,1,1,B1);p(29,23,1,1,D2);p(30,23,2,1,B3);p(32,23,1,1,B2);p(33,23,5,1,B1);p(38,23,1,1,B2);p(39,23,2,1,B3);p(41,23,1,1,B4);p(42,23,1,1,C1);p(43,23,5,1,B4);p(48,23,3,1,B3);p(51,23,4,1,B2);p(55,23,1,1,B3);p(56,23,1,1,B2);p(57,23,1,1,B1);p(58,23,1,1,D2);
  // r24
  p(6,24,1,1,D1);p(7,24,1,1,D2);p(8,24,1,1,B2);p(9,24,2,1,D2);p(13,24,1,1,D1);p(14,24,1,1,B2);p(15,24,1,1,B1);p(16,24,1,1,D2);p(22,24,1,1,D1);p(23,24,1,1,B1);p(24,24,1,1,B2);p(25,24,2,1,B3);p(27,24,1,1,B2);p(28,24,2,1,B1);p(30,24,2,1,B3);p(32,24,1,1,B1);p(33,24,3,1,D1);p(36,24,1,1,D2);p(37,24,1,1,B1);p(38,24,7,1,B4);p(45,24,2,1,C1);p(47,24,3,1,B4);p(50,24,2,1,B3);p(52,24,3,1,B2);p(55,24,2,1,B3);p(57,24,1,1,B1);p(58,24,1,1,D2);
  // r25
  p(7,25,1,1,D2);p(8,25,2,1,D1);p(10,25,1,1,D2);p(14,25,1,1,D2);p(15,25,1,1,D1);p(16,25,1,1,D2);p(22,25,1,1,D1);p(23,25,1,1,B1);p(24,25,1,1,B2);p(25,25,2,1,B3);p(27,25,2,1,B1);p(29,25,2,1,B3);p(31,25,2,1,D2);p(35,25,1,1,D2);p(36,25,1,1,B1);p(37,25,1,1,B4);p(38,25,2,1,C1);p(40,25,5,1,B4);p(45,25,1,1,C2);p(46,25,1,1,WH);p(47,25,4,1,B4);p(51,25,1,1,B3);p(52,25,1,1,B2);p(53,25,1,1,B1);p(54,25,1,1,B2);p(55,25,2,1,B3);p(57,25,1,1,B1);p(58,25,1,1,D2);
  // r26
  p(20,26,2,1,D2);p(22,26,1,1,B1);p(23,26,1,1,B2);p(24,26,2,1,B3);p(26,26,1,1,B2);p(27,26,1,1,D2);p(28,26,1,1,B1);p(29,26,1,1,B4);p(30,26,1,1,B3);p(31,26,2,1,D2);p(36,26,1,1,D2);p(37,26,1,1,B1);p(38,26,6,1,B4);p(44,26,1,1,C2);p(45,26,2,1,WH);p(47,26,5,1,B4);p(52,26,2,1,B2);p(54,26,3,1,B3);p(57,26,1,1,B1);p(58,26,1,1,D2);
  // r27
  p(20,27,1,1,D2);p(21,27,1,1,D1);p(22,27,1,1,B1);p(23,27,4,1,B2);p(27,27,1,1,D2);p(28,27,1,1,B1);p(29,27,1,1,B4);p(30,27,1,1,B3);p(31,27,2,1,D2);p(36,27,2,1,D2);p(38,27,6,1,B4);p(44,27,1,1,C2);p(45,27,2,1,WH);p(47,27,4,1,B4);p(51,27,2,1,B2);p(53,27,4,1,B3);p(57,27,1,1,B1);p(58,27,1,1,D2);
  // r28
  p(20,28,1,1,D2);p(21,28,1,1,D1);p(22,28,1,1,B1);p(23,28,3,1,B2);p(26,28,2,1,B1);p(28,28,1,1,B2);p(29,28,1,1,B4);p(30,28,1,1,B2);p(31,28,1,1,B1);p(32,28,1,1,D2);p(36,28,2,1,D2);p(38,28,1,1,B2);p(39,28,5,1,B4);p(44,28,1,1,C2);p(45,28,2,1,WH);p(47,28,2,1,C1);p(49,28,2,1,B4);p(51,28,2,1,B2);p(53,28,4,1,B3);p(57,28,2,1,B1);p(59,28,1,1,D2);
  // r29
  p(20,29,1,1,B3);p(21,29,1,1,D2);p(22,29,1,1,B1);p(23,29,3,1,B2);p(26,29,1,1,D2);p(27,29,1,1,B2);p(28,29,2,1,B4);p(30,29,1,1,D1);p(31,29,1,1,B1);p(37,29,2,1,D1);p(39,29,2,1,B3);p(41,29,3,1,B4);p(44,29,1,1,C2);p(45,29,3,1,WH);p(48,29,1,1,C1);p(49,29,2,1,B4);p(51,29,2,1,B2);p(53,29,5,1,B3);p(58,29,1,1,B2);p(59,29,1,1,D2);
  // r30
  p(19,30,1,1,B2);p(20,30,1,1,D2);p(21,30,5,1,B2);p(26,30,1,1,D2);p(27,30,1,1,B3);p(28,30,1,1,B4);p(29,30,1,1,B3);p(30,30,1,1,D1);p(31,30,1,1,B1);p(37,30,2,1,D1);p(39,30,2,1,B3);p(41,30,4,1,B4);p(45,30,1,1,C2);p(46,30,2,1,WH);p(48,30,1,1,C1);p(49,30,2,1,B4);p(51,30,1,1,B2);p(52,30,1,1,B3);p(53,30,3,1,B4);p(56,30,2,1,B3);p(58,30,1,1,B2);p(59,30,1,1,D2);
  // r31
  p(19,31,2,1,D2);p(21,31,1,1,B2);p(22,31,1,1,D2);p(23,31,2,1,B1);p(25,31,1,1,D2);p(26,31,1,1,B2);p(27,31,1,1,B4);p(28,31,1,1,B3);p(29,31,2,1,B1);p(31,31,2,1,WH);p(37,31,2,1,D1);p(39,31,3,1,B3);p(42,31,2,1,B4);p(44,31,3,1,C2);p(47,31,2,1,C1);p(49,31,1,1,B4);p(50,31,3,1,B3);p(53,31,3,1,B4);p(56,31,2,1,B3);p(58,31,1,1,B2);p(59,31,1,1,B1);
  // r32
  p(18,32,3,1,D2);p(21,32,5,1,B1);p(26,32,2,1,B4);p(28,32,1,1,B3);p(29,32,1,1,D2);p(31,32,2,1,WH);p(38,32,1,1,D2);p(39,32,1,1,B2);p(40,32,3,1,B3);p(43,32,1,1,B4);p(44,32,1,1,C1);p(45,32,2,1,C2);p(47,32,3,1,B4);p(50,32,2,1,B3);p(52,32,4,1,B4);p(56,32,1,1,B3);p(57,32,1,1,B4);p(58,32,1,1,B3);p(59,32,1,1,B1);
  // r33
  p(17,33,1,1,B1);p(18,33,4,1,D2);p(22,33,1,1,B3);p(23,33,2,1,B1);p(25,33,1,1,B3);p(26,33,2,1,B4);p(28,33,1,1,B2);p(29,33,1,1,D2);p(39,33,1,1,D2);p(40,33,1,1,B2);p(41,33,3,1,B3);p(44,33,1,1,B4);p(45,33,1,1,C1);p(46,33,1,1,C2);p(47,33,3,1,B4);p(50,33,2,1,B3);p(52,33,3,1,B4);p(55,33,2,1,B3);p(57,33,1,1,B4);p(58,33,1,1,B2);p(59,33,1,1,D2);
  // r34
  p(17,34,1,1,D1);p(18,34,1,1,B2);p(19,34,2,1,B4);p(21,34,5,1,B3);p(26,34,2,1,B4);p(28,34,1,1,B2);p(29,34,1,1,D2);p(39,34,1,1,D2);p(40,34,1,1,B2);p(41,34,3,1,B3);p(44,34,3,1,B4);p(47,34,4,1,B3);p(51,34,7,1,B4);p(58,34,1,1,B2);p(59,34,1,1,D2);
  // r35
  p(17,35,1,1,D1);p(18,35,1,1,B2);p(19,35,3,1,B4);p(22,35,3,1,B3);p(25,35,1,1,B4);p(26,35,2,1,B3);p(28,35,1,1,B2);p(29,35,1,1,D2);p(39,35,1,1,D2);p(40,35,1,1,B2);p(41,35,1,1,B4);p(42,35,1,1,B3);p(43,35,2,1,B4);p(45,35,3,1,B3);p(48,35,1,1,B2);p(49,35,1,1,B3);p(50,35,4,1,B4);p(54,35,1,1,B3);p(55,35,1,1,B4);p(56,35,2,1,B3);p(58,35,1,1,B2);p(59,35,1,1,D2);
  // r36
  p(10,36,3,1,B2);p(17,36,1,1,D2);p(18,36,1,1,B1);p(19,36,1,1,B2);p(20,36,2,1,B4);p(22,36,1,1,B2);p(23,36,1,1,B1);p(24,36,1,1,B2);p(25,36,1,1,B4);p(26,36,1,1,B3);p(27,36,1,1,B2);p(28,36,1,1,B1);p(29,36,1,1,D2);p(38,36,1,1,D2);p(39,36,1,1,B2);p(40,36,3,1,B3);p(43,36,1,1,B4);p(44,36,1,1,B3);p(45,36,3,1,B2);p(48,36,1,1,B3);p(49,36,4,1,B4);p(53,36,3,1,B3);p(56,36,1,1,B2);p(57,36,1,1,B3);p(58,36,1,1,B2);p(59,36,1,1,D2);
  // r37
  p(9,37,1,1,B2);p(10,37,1,1,B3);p(11,37,3,1,B2);p(18,37,1,1,D2);p(19,37,1,1,B1);p(20,37,2,1,B2);p(22,37,2,1,D2);p(24,37,1,1,B1);p(25,37,2,1,B2);p(27,37,1,1,B1);p(28,37,1,1,D2);p(37,37,1,1,D1);p(38,37,1,1,D2);p(39,37,1,1,B4);p(40,37,4,1,B3);p(44,37,4,1,B2);p(48,37,4,1,B4);p(52,37,4,1,B3);p(56,37,2,1,B2);p(58,37,1,1,B1);p(59,37,1,1,D2);
  // r38
  p(9,38,1,1,B2);p(10,38,1,1,B4);p(11,38,1,1,C2);p(12,38,1,1,B4);p(13,38,2,1,B2);p(19,38,1,1,D2);p(20,38,2,1,D1);p(22,38,1,1,B1);p(24,38,1,1,B1);p(25,38,1,1,D2);p(26,38,1,1,D1);p(27,38,1,1,D2);p(37,38,1,1,B2);p(38,38,1,1,D2);p(39,38,3,1,B3);p(42,38,5,1,B2);p(47,38,5,1,B4);p(52,38,3,1,B3);p(55,38,2,1,B2);p(57,38,2,1,D2);
  // r39
  p(9,39,1,1,B2);p(10,39,1,1,B3);p(11,39,1,1,B4);p(12,39,1,1,B3);p(13,39,2,1,D2);p(36,39,2,1,B1);p(38,39,2,1,B3);p(40,39,4,1,B2);p(44,39,8,1,B4);p(52,39,1,1,B3);p(53,39,4,1,B2);p(57,39,2,1,D2);
  // r40
  p(9,40,1,1,B1);p(10,40,1,1,B3);p(11,40,1,1,B4);p(12,40,1,1,B3);p(13,40,2,1,D2);p(34,40,2,1,D2);p(36,40,1,1,B1);p(37,40,5,1,B2);p(42,40,2,1,B3);p(44,40,4,1,B4);p(48,40,2,1,C1);p(50,40,1,1,B4);p(51,40,2,1,B3);p(53,40,4,1,B2);p(57,40,2,1,D2);
  // r41
  p(9,41,1,1,D2);p(10,41,3,1,B2);p(13,41,2,1,D2);p(32,41,4,1,D2);p(36,41,5,1,B2);p(41,41,1,1,B3);p(42,41,1,1,B4);p(43,41,7,1,C1);p(50,41,1,1,B3);p(51,41,1,1,B2);p(52,41,1,1,B3);p(53,41,3,1,B2);p(56,41,1,1,B1);p(57,41,2,1,D2);
  // r42
  p(10,42,2,1,D2);p(12,42,1,1,D1);p(32,42,2,1,D2);p(34,42,5,1,B2);p(39,42,2,1,B3);p(41,42,1,1,B4);p(42,42,1,1,C1);p(43,42,4,1,WH);p(47,42,2,1,C1);p(49,42,1,1,B3);p(50,42,6,1,B2);p(56,42,1,1,D1);p(57,42,1,1,D2);
  // r43
  p(31,43,2,1,D2);p(33,43,6,1,B2);p(39,43,1,1,B3);p(40,43,2,1,B4);p(42,43,1,1,C1);p(43,43,2,1,WH);p(45,43,1,1,C2);p(46,43,2,1,C1);p(48,43,7,1,B2);p(55,43,1,1,B3);p(56,43,1,1,D1);p(57,43,1,1,D2);p(59,43,2,1,WH);
  // r44
  p(27,44,4,1,D2);p(31,44,1,1,B2);p(32,44,3,1,B3);p(35,44,1,1,B2);p(36,44,4,1,B3);p(40,44,1,1,B4);p(41,44,1,1,C1);p(42,44,1,1,C2);p(43,44,1,1,WH);p(44,44,1,1,C2);p(45,44,1,1,C1);p(46,44,5,1,B2);p(51,44,3,1,B3);p(54,44,1,1,B2);p(55,44,1,1,B1);p(56,44,1,1,D2);p(59,44,2,1,WH);
  // r45
  p(26,45,1,1,D2);p(27,45,4,1,B1);p(31,45,3,1,B3);p(34,45,1,1,B4);p(35,45,1,1,B3);p(36,45,5,1,B4);p(41,45,1,1,C1);p(42,45,3,1,C2);p(45,45,1,1,B4);p(46,45,2,1,B3);p(48,45,3,1,B2);p(51,45,2,1,B3);p(53,45,1,1,B2);p(54,45,1,1,B1);p(55,45,1,1,D2);
  // r46
  p(26,46,1,1,D2);p(27,46,1,1,B2);p(28,46,5,1,B3);p(33,46,8,1,B4);p(41,46,3,1,C1);p(44,46,4,1,B4);p(48,46,5,1,B3);p(53,46,1,1,B1);p(54,46,1,1,D2);
  // r47
  p(24,47,1,1,B1);p(25,47,1,1,D1);p(26,47,6,1,B3);p(32,47,3,1,B4);p(35,47,2,1,B3);p(37,47,4,1,B4);p(41,47,3,1,C1);p(44,47,3,1,B4);p(47,47,5,1,B3);p(52,47,2,1,D2);
  // r48
  p(23,48,1,1,D2);p(24,48,1,1,B1);p(25,48,11,1,B3);p(36,48,5,1,B4);p(41,48,1,1,C1);p(42,48,5,1,B4);p(47,48,4,1,B3);p(51,48,2,1,D2);
  // r49
  p(10,49,2,1,WH);p(18,49,5,1,D2);p(23,49,1,1,B1);p(24,49,1,1,B2);p(25,49,7,1,B3);p(32,49,5,1,B4);p(37,49,1,1,C1);p(38,49,1,1,C2);p(39,49,1,1,C1);p(40,49,8,1,B4);p(48,49,2,1,B3);p(50,49,1,1,B2);p(51,49,1,1,D1);
  // r50
  p(10,50,2,1,WH);p(16,50,7,1,D2);p(23,50,1,1,B2);p(24,50,8,1,B3);p(32,50,1,1,B4);p(33,50,4,1,C1);p(37,50,1,1,C2);p(38,50,1,1,WH);p(39,50,1,1,C1);p(40,50,8,1,B4);p(48,50,2,1,B3);p(50,50,1,1,B2);p(51,50,1,1,D2);
  // r51
  p(15,51,3,1,D1);p(18,51,4,1,B2);p(22,51,6,1,B3);p(28,51,5,1,B4);p(33,51,1,1,C1);p(34,51,5,1,WH);p(39,51,1,1,C1);p(40,51,8,1,B4);p(48,51,1,1,B3);p(49,51,1,1,B1);p(50,51,1,1,D2);
  // r52
  p(13,52,2,1,D2);p(15,52,1,1,B1);p(16,52,3,1,B3);p(19,52,9,1,B2);p(28,52,1,1,B3);p(29,52,2,1,B4);p(31,52,1,1,C2);p(32,52,6,1,WH);p(38,52,1,1,C1);p(39,52,4,1,B4);p(43,52,6,1,B2);p(49,52,1,1,B1);p(50,52,1,1,D2);
  // r53
  p(11,53,1,1,D2);p(12,53,1,1,D1);p(13,53,3,1,B2);p(16,53,1,1,B3);p(17,53,4,1,B2);p(21,53,1,1,B3);p(22,53,5,1,B2);p(27,53,1,1,B3);p(28,53,3,1,B4);p(31,53,1,1,C2);p(32,53,4,1,WH);p(36,53,1,1,C2);p(37,53,1,1,C1);p(38,53,2,1,B4);p(40,53,5,1,B3);p(45,53,4,1,B2);p(49,53,1,1,B1);p(50,53,1,1,D2);
  // r54
  p(9,54,2,1,D2);p(11,54,2,1,B1);p(13,54,4,1,B3);p(17,54,10,1,B2);p(27,54,3,1,B4);p(30,54,1,1,C1);p(31,54,5,1,C2);p(36,54,1,1,C1);p(37,54,3,1,B4);p(40,54,1,1,B3);p(41,54,2,1,B2);p(43,54,2,1,B4);p(45,54,1,1,B3);p(46,54,2,1,B2);p(48,54,2,1,B1);p(50,54,1,1,D2);
  // r55
  p(3,55,2,1,WH);p(9,55,2,1,D2);p(11,55,1,1,B1);p(12,55,2,1,B3);p(14,55,9,1,B2);p(23,55,1,1,B3);p(24,55,5,1,B4);p(29,55,1,1,C1);p(30,55,1,1,WH);p(31,55,1,1,C1);p(32,55,11,1,B4);p(43,55,2,1,B2);p(45,55,2,1,B1);p(47,55,1,1,B2);p(48,55,2,1,D2);
  // r56
  p(3,56,2,1,WH);p(7,56,1,1,D2);p(8,56,1,1,D1);p(9,56,4,1,B3);p(13,56,4,1,B2);p(17,56,1,1,B3);p(18,56,1,1,B2);p(19,56,1,1,B3);p(20,56,18,1,B4);p(38,56,8,1,B2);p(46,56,1,1,B1);p(47,56,1,1,B2);p(48,56,2,1,D2);
  // r57
  p(3,57,2,1,WH);p(5,57,3,1,D2);p(8,57,1,1,D1);p(9,57,1,1,D2);p(10,57,1,1,B2);p(11,57,1,1,B3);p(12,57,4,1,B2);p(16,57,2,1,B1);p(18,57,2,1,D2);p(20,57,1,1,B1);p(21,57,5,1,B4);p(26,57,5,1,B1);p(31,57,2,1,B3);p(33,57,4,1,B2);p(37,57,1,1,B1);p(38,57,3,1,D2);p(41,57,1,1,B1);p(42,57,3,1,B2);p(45,57,2,1,B1);p(47,57,5,1,D2);p(57,57,5,1,D2);
  // r58
  p(0,58,5,1,D2);p(5,58,5,1,B1);p(10,58,1,1,B2);p(11,58,3,1,B1);p(14,58,3,1,B2);p(17,58,4,1,B1);p(21,58,5,1,B2);p(26,58,5,1,B1);p(31,58,2,1,B2);p(33,58,19,1,B1);p(52,58,5,1,D2);p(57,58,5,1,B1);
  // r59
  p(0,59,5,1,D2);p(5,59,1,1,B3);p(6,59,4,1,B4);p(10,59,1,1,B2);p(11,59,2,1,D2);p(13,59,2,1,B1);p(15,59,1,1,B2);p(16,59,5,1,B4);p(21,59,5,1,D2);p(26,59,5,1,B4);p(31,59,1,1,B1);p(32,59,4,1,D2);p(36,59,1,1,B2);p(37,59,4,1,B4);p(41,59,1,1,B3);p(42,59,1,1,B1);p(43,59,4,1,D2);p(47,59,5,1,B4);p(52,59,5,1,D2);p(57,59,1,1,B3);p(58,59,4,1,B4);
  // r60
  p(0,60,5,1,B4);p(5,60,5,1,B3);p(10,60,3,1,B4);p(13,60,2,1,C1);p(15,60,1,1,B4);p(16,60,5,1,B3);p(21,60,5,1,B4);p(26,60,5,1,B3);p(31,60,6,1,B4);p(37,60,3,1,B3);p(40,60,2,1,B4);p(42,60,1,1,C1);p(43,60,4,1,B4);p(47,60,5,1,B3);p(52,60,6,1,B4);p(58,60,4,1,B3);
  // r61
  p(0,61,5,1,B3);p(5,61,5,1,B2);p(10,61,6,1,B3);p(16,61,5,1,B2);p(21,61,5,1,B3);p(26,61,5,1,B2);p(31,61,6,1,B3);p(37,61,2,1,B2);p(39,61,1,1,B3);p(40,61,1,1,B2);p(41,61,6,1,B3);p(47,61,5,1,B2);p(52,61,5,1,B3);p(57,61,5,1,B2);

  // Mắt phát sáng
  const eyeX=ox+31*sc, eyeY=oy+8*sc;
  if(isFinite(eyeX)&&isFinite(eyeY)){
    cx.save(); cx.globalCompositeOperation='lighter';
    const eg=cx.createRadialGradient(eyeX,eyeY,0,eyeX,eyeY,sc*5);
    eg.addColorStop(0,'rgba(180,240,255,0.9)'); eg.addColorStop(0.4,'rgba(80,180,255,0.4)'); eg.addColorStop(1,'rgba(0,80,200,0)');
    cx.fillStyle=eg; cx.beginPath(); cx.arc(eyeX,eyeY,sc*5,0,Math.PI*2); cx.fill();
    cx.restore();
  }
  cx.restore();
}




// ── 🦈 SHARK SWIM WRAPPER ────────────────────────────────────────────
function drawSharkSwim(cx,x,y,frame,sc){
  sc=sc||2;
  const bob=Math.sin(frame*0.08)*4;
  drawShark(cx, x, y+bob, frame, sc);
}

