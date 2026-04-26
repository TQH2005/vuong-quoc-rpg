// ═══════════════════════════════════════════
// INTERACT
// ═══════════════════════════════════════════
function interact(){
  if(window._loginCooldown) return;
  if(inOcean){ exitOceanWorld(); return; }
  if(gameState==='WORLD'&&window._nearCave){ openCave(); return; }
  if(gameState==='WORLD'&&window._nearUnderground){ openUnderground(); return; }
  if(gameState==='WORLD'&&window._nearChest){
    const ch=window._nearChest;ch.opened=true;ch.openedAt=Date.now();
    const reward=3+Math.floor(Math.random()*6);
    coins+=reward;playerHP=Math.min(playerMaxHP,playerHP+15);
    updateHUD();showNotif('🎁 +'+reward+' 🪙 +15❤️');
    spawnMagicBurst(ch.wx+14,ch.wy);
    spawnParticles(ch.wx+14,ch.wy,'#ffd700',16,4,'star');
    spawnParticles(ch.wx+14,ch.wy,'#ff8800',8,3,'circle');
    window._nearChest=null;return;
  }
  if(gameState==='WORLD'&&window._nearHouse)enterHouse(window._nearHouse);
  else if(gameState==='INDOOR')openHouseDialog(currentHouse);
}
function enterHouse(h){
  currentHouse=h;gameState='INDOOR';
  document.getElementById('indoor-wrap').classList.add('on');
  document.getElementById('loc-hud').textContent='🏠 '+h.name;
  // Show mobile exit button if on mobile
  document.getElementById('indoor-exit-btn').style.display='block';
}
function exitHouse(){
  gameState='WORLD';currentHouse=null;
  document.getElementById('indoor-wrap').classList.remove('on');
  document.getElementById('dialog').style.display='none';
  document.getElementById('loc-hud').textContent='🌍 Vương Quốc';
  document.getElementById('indoor-exit-btn').style.display='none';
}
function openHouseDialog(h){
  if(gameState==='PUZZLE')return;
  gameState='DIALOG';
  document.getElementById('dialog').style.display='block';
  document.getElementById('dname').textContent=h.npcName;
  document.getElementById('dbtn-yes').textContent='▶ BẮT ĐẦU HỌC!';
  document.getElementById('dbtn-yes').onclick=()=>{
    document.getElementById('dialog').style.display='none';
    startPuzzle(h.subj);
  };
  document.getElementById('dbtn-no').onclick=()=>{
    document.getElementById('dialog').style.display='none';
    gameState='INDOOR';
  };
  typeDialog(h.greet);
}
function typeDialog(txt){
  const el=document.getElementById('dtext');
  el.textContent='';let i=0;clearInterval(typingInt);
  typingInt=setInterval(()=>{el.textContent+=txt[i++];if(i>=txt.length)clearInterval(typingInt);},22);
}

// ═══════════════════════════════════════════
// DIFFICULTY SCREEN
// ═══════════════════════════════════════════
const DIFF_CONFIG={
  1:{label:'🌱 TÂN BINH',    coinMult:1.0, scoreMult:1.0, penaltyMult:0.5},
  2:{label:'⚔️ CHIẾN BINH',  coinMult:1.5, scoreMult:1.2, penaltyMult:0.8},
  3:{label:'🏆 ANH HÙNG',    coinMult:2.0, scoreMult:1.5, penaltyMult:1.0},
  4:{label:'🔥 HUYỀN THOẠI', coinMult:3.0, scoreMult:2.0, penaltyMult:1.5},
  5:{label:'💀 THẦN THÁNH',  coinMult:4.5, scoreMult:3.0, penaltyMult:2.5},
};
const SUBJ_LABELS={math:'📐 TOÁN HỌC',geo:'🌏 ĐỊA LÝ',history:'🏛️ LỊCH SỬ',literature:'📖 VĂN HỌC',civic:'🏫 CÔNG DÂN',english:'🔤 TIẾNG ANH'};
let pendingSubject=null;
let currentDiff=1;

function openDiffScreen(subject){
  pendingSubject=subject;
  const ds=document.getElementById('diff-screen');
  // Update subject badge
  document.getElementById('diff-subj-badge').textContent=SUBJ_LABELS[subject]||'📚 BÀI HỌC';
  ds.classList.add('on');
  // Hide vcontrols
  document.getElementById('vcontrols').classList.add('hide-controls');
}
function closeDiffScreen(){
  document.getElementById('diff-screen').classList.remove('on');
  pendingSubject=null;
  document.getElementById('vcontrols').classList.remove('hide-controls');
}
function startPuzzleWithDiff(diff){
  document.getElementById('diff-screen').classList.remove('on');
  currentDiff=diff;
  // Get pool based on difficulty (history uses leveled pools, others fall back to flat array)
  const bank=PUZZLES[pendingSubject];
  let pool;
  if(bank && typeof bank==='object' && !Array.isArray(bank) && bank[diff]){
    pool=[...bank[diff]].sort(()=>Math.random()-0.5).slice(0,5);
  } else {
    const arr=Array.isArray(bank)?bank:(bank[1]||[]);
    pool=[...arr].sort(()=>Math.random()-0.5).slice(0,5);
  }
  pSess={qs:pool,idx:0,score:0,earned:0,subject:pendingSubject,diff};
  comboCount=0;streakCount=0;
  startLearnSession(); // track session start time
  document.getElementById('streak-badge').style.display='none';
  const tips=npcTips[pendingSubject]||[];
  if(tips.length){
    const tip=tips[Math.floor(Math.random()*tips.length)];
    setTimeout(()=>{
      const el=document.getElementById('npc-tip');
      el.textContent=tip;el.classList.add('show');
      setTimeout(()=>el.classList.remove('show'),4000);
    },2000);
  }
  gameState='PUZZLE';renderPuzzle();
}

// ═══════════════════════════════════════════
// PUZZLE ENGINE
// ═══════════════════════════════════════════
