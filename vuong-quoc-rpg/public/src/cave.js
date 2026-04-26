function pickCaveQuestions(ch, chapIdx, count, useHard){
  const used = caveUsed[chapIdx];
  let result = [];

  const pickFrom = (pool, usedArr, needed) => {
    // Reset if all used
    if(usedArr.length >= pool.length) usedArr.length = 0;
    // Available indices
    const avail = pool.map((_,i)=>i).filter(i=>!usedArr.includes(i));
    // Shuffle available
    for(let i=avail.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[avail[i],avail[j]]=[avail[j],avail[i]];}
    const picked = avail.slice(0, needed);
    picked.forEach(i=>usedArr.push(i));
    return picked.map(i=>pool[i]);
  };

  if(useHard){
    const hardPool = ch.questions.hard;
    const easyPool = ch.questions.easy;
    const hardCount = Math.min(Math.ceil(count*0.6), hardPool.length);
    const easyCount = count - hardCount;
    result = [
      ...pickFrom(hardPool, used.hard, hardCount),
      ...pickFrom(easyPool, used.easy, easyCount),
    ];
  } else {
    result = pickFrom(ch.questions.easy, used.easy, count);
  }
  // Shuffle final result
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
// First level always unlocked
let currentCaveChap = 0;
let pendingLevel = null; // {chap, level}

function isLevelUnlocked(chap, level){
  if(level === 0) return true;
  return caveProgress[chap][level-1].done;
}

function openCave(){
  gameState='CAVE';
  document.getElementById('cave-overlay').classList.add('on');
  selectChap(0);
}
function closeCave(){
  document.getElementById('cave-overlay').classList.remove('on');
  gameState='WORLD';
}

function selectChap(idx){
  currentCaveChap = idx;
  // Update tab styles
  document.querySelectorAll('.chap-tab').forEach((t,i)=>{
    t.classList.toggle('active', i===idx);
  });
  // Update description
  const ch = CHAPTERS[idx];
  document.getElementById('chap-info').textContent =
    `Chương ${idx+1}: ${ch.name} — ${ch.desc}`;
  renderCaveMap(idx);
}

function renderCaveMap(chapIdx){
  const ch = CHAPTERS[chapIdx];
  const prog = caveProgress[chapIdx];
  const map = document.getElementById('cave-map');
  map.innerHTML = '';

  for(let lv=0; lv<10; lv++){
    const cell = document.createElement('div');
    const isBoss = lv === 9;
    const isHard = lv === 4 || isBoss;
    const unlocked = isLevelUnlocked(chapIdx, lv);
    const done = prog[lv].done;
    const stars = prog[lv].stars;

    // Find next available
    const isNext = unlocked && !done && (lv===0 || prog[lv-1].done);

    cell.className = 'map-cell ' +
      (isBoss ? 'boss' : isHard ? 'hard' : 'normal') +
      (done ? ' done' : '') +
      (!unlocked ? ' locked' : '') +
      (isNext ? ' active-cell' : '');

    const icons = ['🌱','🐛','🌸','🦋','⚔️','🌿','🍀','🌾','🌳','👑'];
    const oceanIcons = ['🐚','🐠','🦀','🐙','⚔️','🦑','🐬','🦭','🐋','👑'];
    const skyIcons = ['🌤️','🌈','🐦','⛅','⚔️','🌩️','❄️','🌪️','🌙','👑'];
    const iconSet = [icons, oceanIcons, skyIcons][chapIdx];

    let starsHtml = '';
    if(done) starsHtml = '⭐'.repeat(stars)+'☆'.repeat(3-stars);
    else if(unlocked) starsHtml = '- - -';
    else starsHtml = '🔒';

    let tagHtml = '';
    if(isBoss) tagHtml=`<span class="cell-tag" style="background:#9b59b6;color:#fff">BOSS</span>`;
    else if(lv===4) tagHtml=`<span class="cell-tag" style="background:#e74c3c;color:#fff">KHÓ</span>`;

    cell.innerHTML = tagHtml +
      `<div class="cell-num" style="color:${ch.color}">MÀN ${lv+1}</div>` +
      `<div class="cell-icon">${iconSet[lv]}</div>` +
      `<div class="cell-stars">${starsHtml}</div>`;

    if(unlocked){
      cell.addEventListener('click', ()=> showLevelStart(chapIdx, lv));
    }
    map.appendChild(cell);
  }
}

function showLevelStart(chap, level){
  pendingLevel = {chap, level};
  const ch = CHAPTERS[chap];
  const isBoss = level === 9;
  const isHard = level === 4 || isBoss;
  const qCount = isBoss ? 10 : 5;

  document.getElementById('ls-icon').textContent =
    isBoss ? '👑' : isHard ? '⚔️' : ch.icon;
  document.getElementById('ls-title').textContent =
    `${ch.name} — Màn ${level+1}`;
  document.getElementById('ls-desc').textContent =
    isBoss ? `Màn BOSS cuối chương! Thử thách khó nhất với ${qCount} câu hỏi!` :
    isHard ? `Màn khó! ${qCount} câu hỏi về ${ch.name} sẽ thử thách bạn!` :
    `${qCount} câu hỏi về ${ch.name}. Cố gắng đạt 3 sao nhé!`;
  document.getElementById('ls-qs').textContent =
    `${qCount} câu hỏi${isHard?' (khó hơn)':''}`;

  document.getElementById('level-start').classList.add('on');
}

function closeLevelStart(){
  document.getElementById('level-start').classList.remove('on');
  pendingLevel = null;
}

function startLevelPuzzle(){
  if(!pendingLevel) return;
  document.getElementById('level-start').classList.remove('on');
  document.getElementById('cave-overlay').classList.remove('on');

  const {chap, level} = pendingLevel;
  const ch = CHAPTERS[chap];
  const isBoss = level === 9;
  const isHard = level === 4 || isBoss;
  const qCount = isBoss ? 10 : 5;

  // Pick questions: no repeats across levels, hard levels use hard pool
  const pool = pickCaveQuestions(ch, chap, qCount, isHard);

  // Use existing puzzle engine with cave context
  pSess = {qs:pool, idx:0, score:0, earned:0, subject:ch.id,
           caveChap:chap, caveLevel:level, isCave:true};
  comboCount=0; streakCount=0;
  startLearnSession(); // track session start
  document.getElementById('streak-badge').style.display='none';

  // Style puzzle background per chapter
  const puzzle = document.getElementById('puzzle');
  puzzle.style.background = ch.bg;
  gameState='PUZZLE';
  renderPuzzle();
}

// Override endPuzzle to handle cave progress
const _origEndPuzzle = endPuzzle;
function endPuzzle(){
  // If it's a cave level, save progress
  if(pSess.iscave || pSess.isCave){
    const {caveChap, caveLevel} = pSess;
    const tot = pSess.qs.length * 20;
    const sc = pSess.score;
    const stars = sc >= tot*0.8 ? 3 : sc >= tot*0.5 ? 2 : sc >= tot*0.3 ? 1 : 0;
    // Save if better
    const prev = caveProgress[caveChap][caveLevel];
    if(!prev.done || stars > prev.stars){
      caveProgress[caveChap][caveLevel] = {stars, done:true};
    }
    // ══ CAVE BOSS REWARD ══ grant special item on boss (level 9) completion
    if(caveLevel === 9 && stars >= 1){
      grantCaveReward(caveChap);
    }
  }
  // Call original
  document.getElementById('puzzle').classList.remove('on');
  document.getElementById('puzzle').innerHTML='';
  document.getElementById('puzzle').style.background='';
  const sc=pSess.score, tot=pSess.qs.length*20;
  let em,ti,ms;
  if(sc>=tot*0.8){em='🏆';ti='XUẤT SẮC!';ms='Bạn thật xuất sắc! Vương quốc tự hào về bạn! 🌟';}
  else if(sc>=tot*0.6){em='⭐';ti='TỐT LẮM!';ms='Bạn làm rất tốt! Tiếp tục cố gắng nhé! 💪';}
  else if(sc>=tot*0.4){em='😊';ti='CỐ LÊN!';ms='Không sao, thử lại sẽ tiến bộ hơn! 📚';}
  else{em='💪';ti='THỬ LẠI!';ms='Bạn có thể làm được! Đừng nản lòng! 🎯';}
  const stars2=sc>=tot*0.8?3:sc>=tot*0.5?2:sc>=tot*0.3?1:0;
  const starsHtml='⭐'.repeat(stars2)+'☆'.repeat(3-stars2);
  document.getElementById('res-emoji').textContent=em;
  document.getElementById('res-title').textContent=ti;
  document.getElementById('res-score').textContent=starsHtml+' Điểm: '+sc+'/'+tot;
  document.getElementById('res-coins').textContent='🪙 Nhận: '+pSess.earned+' xu  |  🔥 Combo: '+comboCount;
  document.getElementById('res-msg').textContent=ms;
  // Save learning progress (cave)
  const _caveSubj = pSess.isCave ? ('cave_'+CHAPTERS[pSess.caveChap]?.id) : pSess.subject;
  endLearnSession(_caveSubj||pSess.subject, sc, tot, stars2, totalCorrect, totalAnswered, pSess.earned, pSess.isCave?pSess.caveLevel:undefined);
  gameState='RESULT';
  document.getElementById('result').classList.add('on');
}
const _origReturnGame = returnGame;
function returnGame(){
  document.getElementById('result').classList.remove('on');
  wcoins.forEach(c=>c.collected=false);
  chests.forEach(ch=>{ if(ch.opened&&ch.openedAt&&(Date.now()-ch.openedAt)>=300000) ch.opened=false; }); // 5 min respawn
  // Monster respawn handled by 3-min timer in game loop
  comboCount=0;streakCount=0;
  document.getElementById('streak-badge').style.display='none';

  if(pSess.isCave){
    // Return to cave map
    pendingLevel = null;
    gameState='CAVE';
    document.getElementById('cave-overlay').classList.add('on');
    selectChap(pSess.caveChap||0);
  } else {
    gameState=currentHouse?'INDOOR':'WORLD';
  }
}

// ═══════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════
P.y=GND-GRASS_H-P.h-1;
P.x=2400; // spawn an toàn: cách nhà Toán (door=275) 125px, cách nhà Địa (door=975) >400px
