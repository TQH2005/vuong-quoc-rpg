// ══════════════════════════════════════════════════
// TRUE / FALSE
// ══════════════════════════════════════════════════
function buildTrueFalse(q){
  return`<div class="tf-wrap">
    <div class="tf-stmt">${q.q}</div>
    <div class="tf-btns">
      <button class="tf-btn true" id="tf-t" onclick="checkTF(true)">✅ ĐÚNG</button>
      <button class="tf-btn false" id="tf-f" onclick="checkTF(false)">❌ SAI</button>
    </div>
    <div class="tf-explain" id="tf-exp" style="display:none"></div>
  </div>`;}
function checkTF(val){
  const q=pSess.qs[pSess.idx];
  document.getElementById('tf-t').disabled=true;
  document.getElementById('tf-f').disabled=true;
  const correct=(val===q.ans);
  document.getElementById(val?'tf-t':'tf-f').classList.add(correct?'ok':'bad');
  if(correct){
    earnScore(20);
  } else {
    loseScore();
    document.getElementById(q.ans?'tf-t':'tf-f').classList.add('ok');
    const exp=document.getElementById('tf-exp');
    if(q.explain){exp.textContent='💡 '+q.explain;exp.style.display='block';}
  }
  setTimeout(nextQ,1500);
}

// ══════════════════════════════════════════════════
// NUMPAD — nhập số
// ══════════════════════════════════════════════════
let _npVal='';
function buildNumpad(q){
  _npVal='';
  return`<div class="np-wrap">
    <div class="qcard"><div class="qnum">NHẬP SỐ</div><div class="qtext">${q.q}</div></div>
    <div class="np-display" id="np-disp">_</div>
    <div class="np-grid">
      ${[7,8,9,4,5,6,1,2,3].map(n=>`<button class="np-key" onclick="npPress('${n}')">${n}</button>`).join('')}
      <button class="np-key np-del" onclick="npDel()">⌫</button>
      <button class="np-key" onclick="npPress('0')">0</button>
      <button class="np-key np-ok" onclick="npSubmit()">✓ OK</button>
    </div>
  </div>`;}
function npPress(v){
  if(_npVal.length>=8)return;
  _npVal+=v;
  document.getElementById('np-disp').textContent=_npVal;
}
function npDel(){
  _npVal=_npVal.slice(0,-1);
  document.getElementById('np-disp').textContent=_npVal||'_';
}
function npSubmit(){
  const q=pSess.qs[pSess.idx];
  if(!_npVal)return;
  const entered=parseInt(_npVal);
  const correct=(entered===q.ans);
  const disp=document.getElementById('np-disp');
  document.querySelectorAll('.np-key').forEach(k=>k.disabled=true);
  if(correct){
    disp.style.color='#2ecc40';disp.style.borderColor='#2ecc40';
    earnScore(20);showNotif('✅ Chính xác: '+q.ans);
  } else {
    disp.style.color='#e74c3c';disp.style.borderColor='#e74c3c';
    loseScore();showNotif('❌ Đáp án đúng: '+q.ans);
  }
  setTimeout(nextQ,1500);
}

// ══════════════════════════════════════════════════
// WORD ORDER — kéo thả sắp xếp từ thành câu
// ══════════════════════════════════════════════════
let _woPlaced=[];
function buildWordOrder(q){
  // Xáo trộn từ
  const shuffled=[...q.words].sort(()=>Math.random()-0.5);
  return`<div class="wo-wrap">
    <div class="qcard"><div class="qnum">SẮP XẾP CÂU</div><div class="qtext">${q.q}</div></div>
    <div class="wo-zone-label">CÂU CỦA BẠN:</div>
    <div class="wo-zone" id="wo-answer"></div>
    <div class="wo-zone-label">TỪ GỢI Ý:</div>
    <div class="wo-zone" id="wo-bank">
      ${shuffled.map((w,i)=>`<span class="wo-chip" id="woc${i}" data-word="${w}" onclick="woClick(this)">${w}</span>`).join('')}
    </div>
    <button class="mcheck" onclick="checkWO()" style="margin-top:6px">✅ KIỂM TRA</button>
  </div>`;}
function initWordOrder(q){_woPlaced=[];}
function woClick(el){
  const word=el.dataset.word;
  const ansZone=document.getElementById('wo-answer');
  const bankZone=document.getElementById('wo-bank');
  if(el.classList.contains('placed')){
    // Bỏ khỏi câu trả lời → về bank
    el.classList.remove('placed');
    bankZone.appendChild(el);
  } else {
    // Thêm vào câu trả lời
    el.classList.add('placed');
    ansZone.appendChild(el);
  }
}
function checkWO(){
  const q=pSess.qs[pSess.idx];
  const ansZone=document.getElementById('wo-answer');
  const words=[...ansZone.children].map(c=>c.dataset.word);
  const answer=words.join(' ');
  const correct=answer===q.correct;
  document.querySelector('.mcheck').disabled=true;
  [...ansZone.children].forEach(c=>c.classList.add(correct?'ok':'bad'));
  if(correct){
    earnScore(20);showNotif('✅ Câu đúng!');
  } else {
    loseScore();showNotif('❌ Đáp án: '+q.correct);
  }
  setTimeout(nextQ,1800);
}
function earnScore(pts){
  const dc=DIFF_CONFIG[pSess.diff||1];
  const scaledPts=Math.round(pts*dc.scoreMult);
  const coinGain=Math.round(scaledPts/2*dc.coinMult)|0;
  pSess.score+=scaledPts;pSess.earned+=coinGain;coins+=coinGain;
  comboCount++;streakCount++;totalCorrect++;totalAnswered++;
  // Track type accuracy
  if(pSess.qs[pSess.idx]) trackAnswer(pSess.qs[pSess.idx].type, true);
  playerMana=Math.min(playerMaxMana,playerMana+5);
  updateHUD();
  // Combo popup
  if(comboCount>=2){
    const pop=document.createElement('div');
    pop.className='combo-pop';
    const msgs=['','','🔥 2 LIÊN!','⚡ 3 LIÊN!','💥 4 LIÊN!','🌟 XUẤT SẮC!'];
    pop.textContent=msgs[Math.min(comboCount,5)]||'🏆 TUYỆT VỜI!';
    pop.style.color=comboCount>=4?'#ff6600':'#ffd700';
    pop.style.textShadow='0 0 10px currentColor';
    document.getElementById('canvas-border').appendChild(pop);
    setTimeout(()=>pop.remove(),900);
  }
  // Streak badge
  const sb=document.getElementById('streak-badge');
  if(streakCount>=3){sb.style.display='block';document.getElementById('streak-num').textContent=streakCount;}
  // Flash green
  flashAns('✅','rgba(46,204,64,0.25)');
  // Level up
  playerXP++;if(playerXP>=8){playerLevel++;playerXP=0;playerMaxHP+=15;playerHP=Math.min(playerHP+15,playerMaxHP);updateHUD();showNotif('🎉 LÊN CẤP '+playerLevel+'! HP +15');if(window.saveGameData)window.saveGameData();}
}
function loseScore(){
  const dc=DIFF_CONFIG[pSess.diff||1];
  const penalty=Math.round(5*dc.penaltyMult);
  pSess.score=Math.max(0,pSess.score-penalty);
  comboCount=0;totalAnswered++;
  // Track type accuracy
  if(pSess.qs[pSess.idx]) trackAnswer(pSess.qs[pSess.idx].type, false);
  flashAns('❌','rgba(231,76,60,0.25)');
  document.getElementById('streak-badge').style.display='none';
}
function flashAns(emoji,bg){
  const el=document.getElementById('ans-flash');
  el.textContent=emoji;el.style.background=bg;el.style.opacity='1';
  setTimeout(()=>el.style.opacity='0',500);
}
function nextQ(){pSess.idx++;if(pSess.idx<pSess.qs.length)renderPuzzle();else endPuzzle();}
function exitPuzzleEarly(){
  document.getElementById('puzzle').classList.remove('on');
  document.getElementById('puzzle').innerHTML='';
  document.getElementById('puzzle').style.background='';
  if(pSess.isCave){
    gameState='CAVE';
    document.getElementById('cave-overlay').classList.add('on');
    selectChap(pSess.caveChap||0);
  } else {
    gameState=currentHouse?'INDOOR':'WORLD';
  }
}
function endPuzzle(){
  document.getElementById('puzzle').classList.remove('on');
  document.getElementById('puzzle').innerHTML='';
  const sc=pSess.score,tot=pSess.qs.length*20;
  let em,ti,ms;
  if(sc>=tot*0.8){em='🏆';ti='XUẤT SẮC!';ms='Bạn thật xuất sắc! Vương quốc tự hào về bạn! 🌟';}
  else if(sc>=tot*0.6){em='⭐';ti='TỐT LẮM!';ms='Bạn làm rất tốt! Tiếp tục cố gắng nhé! 💪';}
  else if(sc>=tot*0.4){em='😊';ti='CỐ LÊN!';ms='Không sao, thử lại sẽ tiến bộ hơn! 📚';}
  else{em='💪';ti='THỬ LẠI!';ms='Bạn có thể làm được! Đừng nản lòng! 🎯';}
  const stars=sc>=tot*0.8?3:sc>=tot*0.5?2:sc>=tot*0.3?1:0;
  const starsHtml='⭐'.repeat(stars)+'☆'.repeat(3-stars);
  document.getElementById('res-emoji').textContent=em;
  document.getElementById('res-title').textContent=ti;
  document.getElementById('res-score').textContent=starsHtml+' Điểm: '+sc+'/'+tot;
  document.getElementById('res-coins').textContent='🪙 Nhận: '+pSess.earned+' xu  |  🔥 Combo cao nhất: '+comboCount;
  document.getElementById('res-msg').textContent=ms;
  // Save learning progress
  endLearnSession(pSess.subject, sc, tot, stars, totalCorrect, totalAnswered, pSess.earned, undefined);
  gameState='RESULT';
  document.getElementById('result').classList.add('on');
}
function returnGame(){
  document.getElementById('result').classList.remove('on');
  wcoins.forEach(c=>c.collected=false);
  // Respawn some chests & monsters
  chests.forEach(ch=>{ if(ch.opened&&ch.openedAt&&(Date.now()-ch.openedAt)>=300000) ch.opened=false; }); // 5 min respawn
  // Monster respawn handled by 3-min timer in game loop
  comboCount=0;streakCount=0;
  document.getElementById('streak-badge').style.display='none';
  gameState=currentHouse?'INDOOR':'WORLD';
}
function openShopFromRes(){document.getElementById('result').classList.remove('on');openShop();}

