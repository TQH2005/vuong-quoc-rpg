function isNightTime(){
  // timeOfDay 0-1: night = roughly 0.0-0.15 and 0.85-1.0 (sin < -0.1)
  const td=Math.sin(timeOfDay*Math.PI*2);
  return td < -0.1;
}
function getNightMult(){
  // Smoothly scale from 1.0 (day) to 1.6 (deep night)
  const td=Math.sin(timeOfDay*Math.PI*2);
  if(td >= 0) return 1.0;
  return 1.0 + (-td) * 0.75; // max ~1.75 at deepest night
}
const NIGHT_NAMES={
  goblin:['👁️ Goblin Bóng Đêm','🌑 Goblin Ám Ảnh','💀 Goblin Hắc Ám'],
  bat:   ['🦇 Dơi Hút Máu','🌑 Dơi Ma Cà Rồng','💀 Quỷ Dơi Đêm'],
  orc:   ['👁️ Orc Bóng Tối','🌑 Orc Hủy Diệt','💀 Chiến Binh Địa Ngục'],
  dragon:['🌑 Hắc Long Bóng Đêm','🔥 Hắc Long Cuồng Nộ','💀 Hắc Long Ác Độc'],
  dragon_mini:['🐉 Long Nhỏ Bóng Đêm','⚡ Tiểu Long Thần Sấm','🌊 Tiểu Long Huyền Bí'],
  sea_dragon:['🌊 Hải Long Vương Hắc Ám','🌑 Minh Long Hải Vương','💀 Vương Long Đại Dương'],
  seadragon:['🌊 HẢI LONG VƯƠNG ĐÊM TỐI','🌑 MINH LONG HẢI VƯƠNG','💀 THỦY LONG THỨC TỈNH'],
  dragon_shadow:['👁️ ÁM LONG VƯƠNG THỨC TỈNH','💀 BÓNG TỐI ÁM LONG','🌑 ÁM LONG LINH HỒN'],
  fire_dragon:['🔥 HỎA LONG ĐỊA NGỤC','💀 HỎA LONG VƯƠNG THẦN','⚡ HỎA LONG BẤT TỬ'],
};

// ═══════════════════════════════════════════════════════════
// BATTLE QUIZ SYSTEM
// ═══════════════════════════════════════════════════════════
let battleDiff = 2;          // selected difficulty before battle
let bqPending = null;        // {type:'attack'|'magic', w, resolve}
let bqMonster = null;        // monster waiting to start battle

// Monster difficulty tier based on maxHp
function getMonsterDiffTier(m){
  if(!m) return 1;
  const hp = m.maxHp || m.hp || 50;
  if(hp <= 50)  return 1;  // goblin/bat yếu
  if(hp <= 120) return 2;  // mid monsters
  if(hp <= 250) return 3;  // orc/hard
  if(hp <= 500) return 4;  // strong
  return 5;                // boss/dragon
}

// Show pre-battle difficulty picker
function showPreBattle(m){
  bqMonster = m;
  document.getElementById('pb-monster-name').textContent = '⚔ VS: ' + m.name;
  document.getElementById('prebattle-screen').classList.add('on');
}

function confirmBattleDiff(diff){
  battleDiff = diff;
  document.getElementById('prebattle-screen').classList.remove('on');
  startBattle(bqMonster);
}

// Pick a battle quiz question based on difficulty
function getBattleQuestion(attackType){
  // Use min of monster tier and selected battleDiff for base, but let player choose up
  const monTier = getMonsterDiffTier(bMon);
  // Question difficulty: at least monster tier, at most battleDiff (player can go higher)
  const effectiveDiff = Math.max(monTier, battleDiff);
  const clampedDiff = Math.min(5, effectiveDiff);
  
  // Build question pool from all subjects, matching difficulty
  let allQs = [];
  const subjects = ['math','geo','history','literature','civic','english'];
  subjects.forEach(subj => {
    const bank = PUZZLES[subj];
    if(!bank) return;
    // Try to get questions at this difficulty level
    let pool = [];
    if(typeof bank === 'object' && !Array.isArray(bank)){
      // Has difficulty tiers
      for(let d = Math.max(1,clampedDiff-1); d <= clampedDiff; d++){
        if(bank[d]) pool = pool.concat(bank[d]);
      }
    } else if(Array.isArray(bank)){
      pool = bank;
    }
    // Only use MCQ type for battle (fast to answer)
    const mcqOnly = pool.filter(q => q.type === 'mcq');
    if(mcqOnly.length) allQs = allQs.concat(mcqOnly);
    else allQs = allQs.concat(pool.filter(q=>q.type==='mcq'||!q.type));
  });
  
  if(!allQs.length){
    // Fallback: pick from any subject level 1
    subjects.forEach(subj => {
      const bank = PUZZLES[subj];
      if(Array.isArray(bank)) allQs = allQs.concat(bank.filter(q=>!q.type||q.type==='mcq'));
      else if(bank && bank[1]) allQs = allQs.concat(bank[1].filter(q=>!q.type||q.type==='mcq'));
    });
  }
  
  if(!allQs.length) return null;
  return allQs[Math.floor(Math.random() * allQs.length)];
}

// Show battle quiz, returns promise resolving to true(correct)/false(wrong)
function showBattleQuiz(attackType){
  return new Promise(resolve => {
    const q = getBattleQuestion(attackType);
    if(!q){
      resolve(true); // no question → auto pass
      return;
    }
    
    const overlay = document.getElementById('battle-quiz-overlay');
    const titleEl = document.getElementById('bq-title');
    const qEl = document.getElementById('bq-question');
    const optsEl = document.getElementById('bq-opts');
    
    const monTier = getMonsterDiffTier(bMon);
    const isDragon = bMon && bMon.type === 'dragon';
    const attackLabel = attackType === 'magic' ? '✨ PHÉP THUẬT' : '⚔ VŨ KHÍ';
    titleEl.textContent = `❓ GIẢI ĐỐ ĐỂ ${attackLabel}! (Cấp ${Math.max(monTier,battleDiff)})`;
    qEl.textContent = q.q;
    optsEl.innerHTML = '';
    
    // Shuffle options but remember correct
    const correctAns = q.ans; // index of correct answer
    const opts = q.opts || [];
    
    opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'bq-btn';
      btn.textContent = ['A','B','C','D'][i] + '. ' + opt;
      btn.onclick = () => {
        // Disable all buttons
        optsEl.querySelectorAll('.bq-btn').forEach(b => b.disabled = true);
        const correct = (i === correctAns);
        btn.classList.add(correct ? 'bq-ok' : 'bq-bad');
        if(!correct){
          optsEl.querySelectorAll('.bq-btn')[correctAns].classList.add('bq-ok');
        }
        setTimeout(() => {
          overlay.classList.remove('on');
          resolve(correct);
        }, 900);
      };
      optsEl.appendChild(btn);
    });
    
    overlay.classList.add('on');
  });
}
function startBattle(m){
  // Shadow dragon only available at night
  if(m.type==='dragon_shadow'&&!isNightTime()){
    showNotif('🌑 Ám Long chỉ xuất hiện ban đêm!'); return;
  }
  if(m.nightOnly&&!isNightTime()){
    showNotif('🌑 Hắc Long Vương chỉ xuất hiện ban đêm!'); return;
  }
  const nightMult=getNightMult();
  const isNight=isNightTime();
  // Scale HP and reward by night multiplier
  const nightHP = Math.round(m.maxHp * nightMult);
  bMon=m;bPHP=playerHP;
  bMHP=isNight ? nightHP : m.hp;
  bMaxPHP=playerMaxHP;
  bMaxMHP=isNight ? nightHP : m.maxHp;
  bActive=true;
  bKnightAtkAnim=0;
  // Start dragon FX loop nếu là dragon
  if(m.type==='dragon'||m.type==='dragon_shadow'){ startDragonFXLoop(); }
  // Reset battle effects
  bBurnTurns=0; bStunned=false; bWindShield=false; bWindDebuff=false; bLastAnim='';
  bDragonHitCount=0; bPlayerBurnTurns=0;
  bAngelReviveUsed=false; bAngelBlocked=false;
  bNatureBind=false; bNatureBindTurns=0; bNaturePoisonTurns=0;
  // Reset shadow dragon states
  bShadowSoulState=false; bShadowSoulTurns=0; bShadowDmgDebuff=false; bShadowDebuffTurns=0;
  bHacDmgDebuff=false; bHacDmgTurns=0; bHacDefDebuff=false; bHacDefTurns=0; bHacSkillCount=0; bHacNormalCount=0; bHacPhase2=false; bFireNormalCount=0;
  document.getElementById('hac-dmg-tag').classList.remove('on');
  document.getElementById('hac-def-tag').classList.remove('on');
  document.getElementById('shadow-debuff-tag').classList.remove('on');
  document.getElementById('soul-state-tag').classList.remove('on');
  // Night name
  const nightNames=NIGHT_NAMES[m.type]||[];
  const displayName=isNight&&nightNames.length
    ? nightNames[Math.floor(Math.random()*nightNames.length)]
    : m.name;
  document.getElementById('b-mname').textContent=displayName.toUpperCase();
  document.getElementById('b-mname').style.color=m.type==='fire_dragon'?'#ff6622':'';
  document.getElementById('b-mname').style.textShadow=m.type==='fire_dragon'?'0 0 8px #ff4400':'';

  const logMsg=isNight
    ? '🌑 ĐÊM TỐI! '+displayName+' MẠNH HƠN x'+nightMult.toFixed(1)+'!'
    : '⚔ Chiến đấu: '+m.name+'!';
  updateBHUD();setBLog(logMsg);
  drawBattleScene(0,0);gameState='BATTLE';
  document.getElementById('battle').classList.add('on');
  // Ẩn world canvas và underground overlay để tránh lửa/hiệu ứng lộ ra sau battle
  const _gc=document.getElementById('gc');
  const _ugOv=document.getElementById('underground-overlay');
  if(_gc) _gc.style.visibility='hidden';
  if(_ugOv) _ugOv.classList.remove('on');
  document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);
  // Show armor info in battle
  const armorEl=document.getElementById('b-armor-info');
  if(armorEl&&equippedArmor) armorEl.textContent=equippedArmor.icon+' -'+equippedArmor.armor+'%';
  // Sync potion counts
  const bHpPot=document.getElementById('b-hppot');
  const bMpPot=document.getElementById('b-manapot');
  if(bHpPot) bHpPot.textContent=potions.hp;
  if(bMpPot) bMpPot.textContent=potions.mana;
  // Update mana cost display based on armor
  const manaCostEl=document.getElementById('b-mana-cost');
  if(manaCostEl){const mc=equippedArmor&&equippedArmor.id==='magic'?18:28;manaCostEl.textContent='(-'+mc+'MP)';}
}
function doB(type){
  if(!bActive)return;
  const w = (type==='magic')
    ? (equippedMagic || equippedWpn || weapons[0])
    : (equippedMelee || equippedWpn || weapons[0]);
  const armorPct=(equippedArmor?equippedArmor.armor:0)/100;

  if(type==='flee'){setBLog('↩ Bạn chạy thoát!');endBattle(false,0);return;}

  // ── QUIZ gate for attack/magic ──────────────────────────────
  if(type==='attack' || type==='magic'){
    document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
    showBattleQuiz(type).then(correct => {
      if(correct){
        setBLog('✅ ĐÚNG! ' + (type==='magic'?'✨ Thi triển phép thuật!':'⚔ Ra đòn tấn công!'));
        doBAttack(type);
      } else {
        setBLog('❌ SAI! Quái tấn công bạn!');
        // Wrong → monster attacks player immediately
        doBWrongAnswer();
      }
    });
    return;
  }
  if(type==='hppot'){
    if(potions.hp<=0){showNotif('❌ Không có bình máu!');return;}
    potions.hp--;
    bPHP=Math.min(bMaxPHP,bPHP+50);playerHP=bPHP;
    const bHpEl=document.getElementById('b-hppot');if(bHpEl)bHpEl.textContent=potions.hp;
    updateBHUD();updateHUD();drawBattleScene(0,0);
    setBLog('🧪 Uống bình máu! +50 HP ❤️');
    setTimeout(()=>document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false),400);
    return;
  }
  if(type==='manapot'){
    if(potions.mana<=0){showNotif('❌ Không có bình mana!');return;}
    potions.mana--;
    playerMana=Math.min(playerMaxMana,playerMana+50);
    const bMpEl=document.getElementById('b-manapot');if(bMpEl)bMpEl.textContent=potions.mana;
    updateHUD();drawBattleScene(0,0);
    setBLog('💧 Uống bình mana! +50 Mana 💧');
    setTimeout(()=>document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false),400);
    return;
  }

  document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
}

// Called after quiz CORRECT — perform actual attack
function doBAttack(type){
  bKnightAtkAnim=32; // trigger attack animation
  drawBattleScene(0,0); // redraw immediately để thấy anim
  const w = (type==='magic')
    ? (equippedMagic || equippedWpn || weapons[0])
    : (equippedMelee || equippedWpn || weapons[0]);
  const armorPct=(equippedArmor?equippedArmor.armor:0)/100;
  // Reward multiplier based on battleDiff
  const diffRwMult = [0,1.05,1.15,1.30,1.60,2.20][battleDiff]||1;

  // ── APPLY PLAYER BURN TICK (bị rồng đốt) ────────────────
  if(bPlayerBurnTurns>0){
    const playerBurnDmg=8;
    bPHP=Math.max(0,bPHP-playerBurnDmg);playerHP=bPHP;
    bPlayerBurnTurns--;
    const pBurnMsg=bPlayerBurnTurns>0?` 🔥 Bạn đang cháy -${playerBurnDmg}HP! (${bPlayerBurnTurns} lượt)`:` 🔥 Hết thiêu đốt!`;
    updateBHUD();updateHUD();
    setBLog(pBurnMsg);
    if(bPHP<=0){endBattle(false,0);return;}
    drawBattleScene(0,0);
  }

  // ── NATURE POISON TICK ────────────────────────────────────
  if(bNaturePoisonTurns>0){
    const poisonDmg=6;
    bMHP=Math.max(0,bMHP-poisonDmg);
    bNaturePoisonTurns--;
    updateBHUD();
    if(bMHP<=0){
      if(bMon.type==='dragon'&&!bHacPhase2){
        document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
        triggerHacLongPhase2();return;
      }
      endBattle(true,bMon.rw);return;
    }
    drawBattleScene(0,0);
  }

  // ── APPLY BURN TICK (if active) ──────────────────────────
  if(bBurnTurns>0){
    const burnDmg=w.special==='firewand'?5:8;
    bMHP=Math.max(0,bMHP-burnDmg);
    bBurnTurns--;
    const burnMsg=bBurnTurns>0?` 🔥 Thiêu đốt -${burnDmg}HP! (${bBurnTurns} lượt)`:` 🔥 Hết thiêu đốt!`;
    updateBHUD();
    if(bMHP<=0){
      if(bMon.type==='dragon'&&!bHacPhase2){
        document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
        triggerHacLongPhase2();return;
      }
      endBattle(true,bMon.rw);return;
    }
    drawBattleScene(0,0);
    FX.play('burn',{});
  }

  // ── MAGIC ATTACK ─────────────────────────────────────────
  if(type==='magic'){
    const manaCost=equippedArmor&&equippedArmor.id==='magic'?18:28;
    if(playerMana<manaCost){
      setBLog('💧 Không đủ Mana! (cần '+manaCost+')');
      showNotif('❌ Cần '+manaCost+' Mana!');
      setTimeout(()=>document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false),600);
      return;
    }
    playerMana=Math.max(0,playerMana-manaCost);updateHUD();

    let pdmg=Math.floor(w.dmg*1.6+Math.random()*14+playerLevel*3);
    // Shadow debuff: player deals 50% less damage
    // Cập nhật text turns cho debuff Hắc Long
  if(bHacDmgDebuff){
    document.getElementById('hac-dmg-tag').textContent='🔮 QUẢ CẦU HẮC ÁM — Sát thương -40% ('+bHacDmgTurns+' vòng)';
  }
  if(bHacDefDebuff){
    document.getElementById('hac-def-tag').textContent='🌑 HƠI THỞ BÓNG TỐI — Phòng thủ -50% ('+bHacDefTurns+' vòng)';
  }
  if(bShadowDmgDebuff){ pdmg=Math.floor(pdmg*0.5); }
    if(bHacDmgDebuff){ pdmg=Math.floor(pdmg*0.6); } // Quả cầu hắc ám -40%
    let logParts=[];
    let animType='magic';

    // Weapon-specific magic effects
    if(w.special==='magicburn'){ // Gậy Lửa
      bBurnTurns=3;
      logParts.push('🔥 Thiêu Đốt! (-5HP/lượt x3)');
      animType='fireblast';
    }
    if(w.special==='stun'){ // Gậy Sét
      if(Math.random()<(w.stunChance||0.3)){
        bStunned=true;
        logParts.push('⚡ CHOÁNG! Địch mất lượt tấn công!');
      }
      animType='thunder';
    }
    if(w.special==='windshield'){ // Gậy Gió
      pdmg=Math.floor(pdmg*0.85);
      bWindDebuff=true;
      if(Math.random()<(w.shieldChance||0.1)){
        bWindShield=true;
        logParts.push('🛡️ Khiên Gió! Chặn 1 đòn tiếp theo!');
      }
      logParts.push('💨 Giảm sát thương địch!');
      animType='windblast';
    }
    if(w.special==='none'){ // Gậy Phép thường
      pdmg=Math.floor(pdmg*1.15);
      animType='magic';
    }
    if(w.special==='naturebind'){ // Gậy Thiên Nhiên
      const bindRoll=Math.random();
      if(bindRoll<(w.bindChance||0.35)){
        bNatureBind=true;
        bNatureBindTurns=2;   // enemy can't attack 2 turns
        bNaturePoisonTurns=3; // poison -6HP/turn x3
        bWindDebuff=true;     // also reduce atk 40%
        logParts.push('🌿 TRÓI CHÂN! Địch bị Độc (-6HP×3) + Giảm sát thương 40%!');
      }
      animType='naturebind';
    }

    bMHP=Math.max(0,bMHP-pdmg);
    bLastAnim=animType;
    if(bMon.type==='dragon'||bMon.type==='dragon_shadow') dragonHurtFlash=20;
    updateBHUD();drawBattleScene(1,0,animType);
    FX.play(animType,{stun:bStunned,shield:bWindShield});
    // Khi kỹ năng có thiêu đốt → phát thêm burn FX sau khi fireball nổ
    if(bBurnTurns>0&&(animType==='fire'||animType==='fireblast'||animType==='magicburn')){
      setTimeout(()=>{ if(bActive) FX.play(bMon&&bMon.type==='fire_dragon'?'player_burn':'burn',{}); },600);
    }
    setBLog('✨ Phép thuật! -'+manaCost+'MP → '+pdmg+' sát thương! '+logParts.join(' '));
    if(bMHP<=0){
      if(bMon.type==='dragon'&&!bHacPhase2){
        document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
        triggerHacLongPhase2();return;
      }
      endBattle(true,bMon.rw);return;
    }

  } else {
    // ── NORMAL ATTACK ───────────────────────────────────────
    let baseDmg=w.dmg+Math.floor(Math.random()*10)+playerLevel*2;
    // Shadow debuff: player deals 50% less damage
    // Cập nhật text turns cho debuff Hắc Long
  if(bHacDmgDebuff){
    document.getElementById('hac-dmg-tag').textContent='🔮 QUẢ CẦU HẮC ÁM — Sát thương -40% ('+bHacDmgTurns+' vòng)';
  }
  if(bHacDefDebuff){
    document.getElementById('hac-def-tag').textContent='🌑 HƠI THỞ BÓNG TỐI — Phòng thủ -50% ('+bHacDefTurns+' vòng)';
  }
  if(bShadowDmgDebuff){ baseDmg=Math.floor(baseDmg*0.5); }
    if(bHacDmgDebuff){ baseDmg=Math.floor(baseDmg*0.6); } // Quả cầu hắc ám -40%
    // Dragon armor bonus vs any dragon type
    const isDragonEnemy=bMon&&(bMon.type==='dragon'||bMon.type==='dragon_mini'||bMon.type==='dragon_shadow'||bMon.type==='fire_dragon'||bMon.type==='sea_dragon'||bMon.type==='seadragon');
    if(equippedArmor&&equippedArmor.dragonBonus&&isDragonEnemy){
      baseDmg=Math.floor(baseDmg*(1+equippedArmor.dragonBonus));
      // log will be appended below
    }
    let logParts=[];
    let animType='atk';

    // Angel armor: 20% triple strike
    if(equippedArmor&&equippedArmor.id==='angelarmor'&&Math.random()<(equippedArmor.tripleChance||0.2)){
      const d2=Math.floor(baseDmg*0.7), d3=Math.floor(baseDmg*0.5);
      baseDmg+=d2+d3;
      logParts.push('👼 3 ĐÒN THIÊN THẦN! (+'+d2+'+'+d3+')');
      animType='angel_triple';
    } else {
      if(w.special==='crit'){ // Kiếm Sắt
        if(Math.random()<(w.critChance||0.2)){baseDmg*=2;logParts.push('💥 CHÍ MẠNG!');}
      }
      if(w.special==='double'){ // Kiếm Gió
        if(Math.random()<(w.doubleChance||0.2)){
          const dmg2=w.dmg+Math.floor(Math.random()*10)+playerLevel*2;
          baseDmg+=dmg2;logParts.push('🌀 ĐÁNH ĐÔI! (+'+dmg2+')');animType='double';
        }
      }
      if(w.special==='burn'){ // Rìu Lửa
        if(Math.random()<(w.burnChance||0.2)){
          bBurnTurns=3;logParts.push('🔥 Thiêu Đốt! (-8HP/lượt x3)');animType='fire';
        }
      }
      if(w.special==='manaon'){ // Kiếm Thủy
        if(Math.random()<(w.manaChance||0.2)){
          const manaGain=Math.floor(playerMaxMana/4);
          playerMana=Math.min(playerMaxMana,playerMana+manaGain);
          updateHUD();logParts.push('💧 Hồi +'+manaGain+' Mana!');animType='water';
        }
      }
      if(w.special==='tideheal'){ // Đinh Ba Thần Biển
        let didHeal=false;
        if(Math.random()<(w.healChance||0.35)){
          const hpGain=Math.floor(playerMaxHP/4);
          const mpGain=Math.floor(playerMaxMana/4);
          bPHP=Math.min(bMaxPHP,bPHP+hpGain);playerHP=bPHP;
          playerMana=Math.min(playerMaxMana,playerMana+mpGain);
          updateHUD();
          logParts.push('🔱 HỒI PHỤC! +'+hpGain+'HP +'+mpGain+'MP!');
          animType='tideheal'; didHeal=true;
          setTimeout(()=>FX.play('tideheal',{heal:true}),100);
        } else animType='atk';
      }
    }

    bMHP=Math.max(0,bMHP-baseDmg);
    if(bMon.type==='dragon'||bMon.type==='dragon_shadow') dragonHurtFlash=20;
    bLastAnim=animType;
    const fxAnim=animType==='tideheal'?'atk':logParts.some(l=>l.includes('CHÍ MẠNG'))?'crit':animType;
    updateBHUD();drawBattleScene(1,0,animType);
    if(animType!=='tideheal') FX.play(fxAnim,{shield:bWindShield});
    if(animType==='angel_triple') FX.play('angel_triple',{});
    // Rìu Lửa có burn → phát burn FX sau khi slash
    if(bBurnTurns>0&&(animType==='fire'||fxAnim==='fire')){
      setTimeout(()=>{ if(bActive) FX.play('burn',{}); },500);
    }
    if(equippedArmor&&equippedArmor.dragonBonus&&isDragonEnemy)logParts.push('🐉 +'+Math.round(equippedArmor.dragonBonus*100)+'% Giáp Rồng!');
    // Apply diff reward multiplier to endBattle rw
    setBLog(w.icon+' '+baseDmg+' sát thương! '+logParts.join(' '));
    playerMana=Math.min(playerMaxMana,playerMana+6);updateHUD();
    if(bMHP<=0){
      if(bMon.type==='dragon'&&!bHacPhase2){
        document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
        triggerHacLongPhase2();return;
      }
      endBattle(true,bMon.rw);return;
    }
  }

  // ── ENEMY COUNTER-ATTACK ─────────────────────────────────
  setTimeout(()=>{
    // Stun check — skip enemy turn
    if(bStunned){
      bStunned=false;
      setBLog('😵 '+bMon.name+' bị CHOÁNG — mất lượt tấn công!');
      drawBattleScene(0,0);
      setTimeout(()=>{
        if(bBurnTurns>0){const bd=w.special==='firewand'?5:8;bMHP=Math.max(0,bMHP-bd);bBurnTurns--;updateBHUD();if(bMHP<=0){endBattle(true,bMon.rw);return;}}
        document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);
        drawBattleScene(0,0);
      },600);
      return;
    }
    // Nature bind check — skip enemy attack turns
    if(bNatureBindTurns>0){
      bNatureBindTurns--;
      setBLog('🌿 '+bMon.name+' bị TRÓI CHÂN — không thể tấn công! ('+bNatureBindTurns+' lượt còn lại)');
      drawBattleScene(0,0);
      setTimeout(()=>{ document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false); drawBattleScene(0,0); },600);
      return;
    }
    const nightMult=getNightMult();
    const isDragon=bMon.type==='dragon'||bMon.type==='dragon_mini'||bMon.type==='fire_dragon'||bMon.type==='sea_dragon';
    const isShadowDragon=bMon.type==='dragon_shadow';

    // ── SHADOW DRAGON SPECIAL MECHANICS ──────────────────────────
    if(isShadowDragon){
      bDragonHitCount++;
      // Tick debuff turns
      if(bShadowDebuffTurns>0){ bShadowDebuffTurns--; if(bShadowDebuffTurns===0){bShadowDmgDebuff=false;document.getElementById('shadow-debuff-tag').classList.remove('on');} }
      if(bHacDmgTurns>0){ bHacDmgTurns--; if(bHacDmgTurns===0){bHacDmgDebuff=false;document.getElementById('hac-dmg-tag').classList.remove('on');} }
      if(bHacDefTurns>0){ bHacDefTurns--; if(bHacDefTurns===0){bHacDefDebuff=false;document.getElementById('hac-def-tag').classList.remove('on');} }
      // Tick soul turns
      if(bShadowSoulTurns>0){ bShadowSoulTurns--; if(bShadowSoulTurns===0){bShadowSoulState=false;document.getElementById('soul-state-tag').classList.remove('on');} }
      // Enter soul state randomly (30% chance every 3 hits)
      if(bDragonHitCount%3===0&&Math.random()<0.30){
        bShadowSoulState=true; bShadowSoulTurns=2;
        document.getElementById('soul-state-tag').classList.add('on');
        setBLog('👻 ÁM LONG vào TRẠNG THÁI LINH HỒN! 2 lượt không thể đánh, sát thương giảm!');
        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},700);
        return;
      }
      // Apply debuff (ám hắc — giảm ST người chơi) every 2 hits
      if(bDragonHitCount%2===0&&!bShadowDmgDebuff){
        bShadowDmgDebuff=true; bShadowDebuffTurns=3;
        document.getElementById('shadow-debuff-tag').classList.add('on');
        setBLog('🌑 ÁM LONG dùng ÁM HẮC! Sát thương của bạn giảm 50% trong 3 lượt!');
        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},700);
        return;
      }
      // Soul state — still attacks but with 40% damage
      const soulMult=bShadowSoulState?0.4:1;
      if(bWindShield){
        setBLog('🛡️ KHIÊN GIÓ chặn đòn Ám Long!');
        bWindShield=false;
        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);return;
      }
      const sdBase=bMon.dragonAtk||18;
      let sdDmg=Math.round((sdBase+Math.floor(Math.random()*12))*soulMult);
      let sdMsg=bShadowSoulState?' 👻 (linh hồn)':'';
      if(Math.random()<(bMon.dragonCritChance||0.2)&&!bShadowSoulState){ sdDmg=Math.floor(sdDmg*1.8);sdMsg+=' 💥 CHÍ MẠNG!'; }
      const armorPct=equippedArmor?equippedArmor.armor/100:0;
      const finalSd=Math.max(1,Math.floor(sdDmg*(1-armorPct)));
      if(finalSd>0){bPHP=Math.max(0,bPHP-finalSd);playerHP=bPHP;P.hurtAnim=20;}
      updateBHUD();updateHUD();drawBattleScene(0,1,'shadow');
      setBLog('🌑 ÁM LONG tấn công '+finalSd+' DMG'+sdMsg+' (giáp -'+Math.floor(armorPct*100)+'%)');
      if(bMon.type==='dragon'||bMon.type==='dragon_shadow'){
        const _BCX=Math.round(bcv.width*0.78), _BGY=bcv.height-52;
        dragonTriggerBreath(bShadowSoulState, _BCX, _BGY);
      }
      if(bPHP<=0){setTimeout(()=>endBattle(false,0),700);return;}
      setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
      return;
    }

    // ── HẮC LONG VƯƠNG: Chỉ tấn công khi player TRẢ LỜI SAI ──
    if(bMon.type==='dragon'){
      // Phase 2: 30% né đòn
      if(bHacPhase2&&Math.random()<(bMon._dodgeChance||0.30)){
        setBLog('💨 Linh Hồn Hắc Long né đòn! (30%)');
        drawBattleScene(0,0);
        setTimeout(()=>{document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},400);
        return;
      }
      // Tấn công đúng → không phản đòn (nhưng damage vẫn áp dụng)
      setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},400);
      return;
    }
    // ── CÁC RỒNG KHÁC (phản đòn bình thường) ────────────────
    if(isDragon){
      bDragonHitCount++;

      // ── HỎA LONG VƯƠNG: cứ 3 đòn thường → Hơi Thở Địa Ngục ──
      if(bMon.type==='fire_dragon'){
        bFireNormalCount++;

        if(bFireNormalCount%3===0){
          // ── KỸ NĂNG: HƠI THỞ ĐỊA NGỤC ──────────────────────
          const breathBase=(bMon.dragonAtk||35)*1.4;
          const armorPct0=equippedArmor?equippedArmor.armor/100:0;
          const breathDmg=Math.max(1,Math.floor(breathBase*(1-armorPct0)));
          bPlayerBurnTurns=3; // thiêu đốt 3 vòng
          if(breathDmg>0){bPHP=Math.max(0,bPHP-breathDmg);playerHP=bPHP;P.hurtAnim=25;}
          updateBHUD();updateHUD();drawBattleScene(0,1,'fire');
          // Animation: cầu lửa bắn thẳng vào player
          FX.play('dragon_fire',{});
          // Sau khi cầu lửa nổ → lửa bùng ở chân player (liên tục 3 vòng)
          setTimeout(()=>{ if(bActive) FX.play('player_burn',{}); },800);
          setBLog('🔥 HỎA LONG VƯƠNG dùng HƠI THỞ ĐỊA NGỤC! -'+breathDmg+' DMG! 🔥 Thiêu đốt -8HP/lượt × 3 vòng!');
          if(bPHP<=0){setTimeout(()=>endBattle(false,0),900);return;}
          setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},900);
          return;
        }

        // Đòn thường của Hỏa Long
        const dragonBase=bMon.dragonAtk||35;
        let dragonDmg=dragonBase+Math.floor(Math.random()*15);
        let critMsg='';
        if(Math.random()<(bMon.dragonCritChance||0.22)){dragonDmg=Math.floor(dragonDmg*2);critMsg=' 💥 CHÍ MẠNG!';}
        if(bWindShield){dragonDmg=0;bWindShield=false;critMsg=' 🛡️ KHIÊN GIÓ chặn đòn!';}
        const armorPct3=equippedArmor?equippedArmor.armor/100:0;
        let finalDmg3=Math.max(1,Math.floor(dragonDmg*(1-armorPct3)));
        if(dragonDmg===0) finalDmg3=0;
        if(finalDmg3>0){bPHP=Math.max(0,bPHP-finalDmg3);playerHP=bPHP;P.hurtAnim=20;}
        updateBHUD();updateHUD();drawBattleScene(0,1);
        setBLog('🔥 Hỏa Long cào '+finalDmg3+' DMG! (giáp -'+Math.floor(armorPct3*100)+'%)'+critMsg
          +(bFireNormalCount%3===2?' [Chiêu tiếp theo: HƠI THỞ ĐỊA NGỤC!🔥]':''));
        if(bPHP<=0){endBattle(false,0);return;}
        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
        return;
      }

      // Các loại rồng khác (dragon_mini...): phun lửa sau 3 đòn
      if(bDragonHitCount%3===0 && bMon.type!=='dragon_mini' && bMon.type!=='dragon'){
        bPlayerBurnTurns=3;
        const burnDmg=25;
        bPHP=Math.max(0,bPHP-burnDmg);playerHP=bPHP;P.hurtAnim=25;
        updateBHUD();updateHUD();drawBattleScene(0,1,'fire');
        FX.play('fireblast',{});
        setBLog('🔥 RỒNG PHUN LỬA! -'+burnDmg+' DMG! 🔥 Thiêu đốt! (-8HP/lượt x3)');
        if(bPHP<=0){setTimeout(()=>endBattle(false,0),700);return;}
        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},700);
        return;
      }

      // ── HẮC LONG VƯƠNG (type==='dragon') ────────────────────
      if(bMon.type==='dragon'){
        const BCX=Math.round(bcv.width*0.78), BGY=bcv.height-52;

        // Đòn tấn công THƯỜNG trước
        bHacNormalCount++;

        // Tính sát thương đòn thường
        const dragonBase=bMon.dragonAtk||22;
        let dragonDmg=dragonBase+Math.floor(Math.random()*15);
        let critMsg='';
        if(Math.random()<(bMon.dragonCritChance||0.3)){dragonDmg=Math.floor(dragonDmg*2);critMsg=' 💥 CHÍ MẠNG RỒNG!';}
        if(bWindShield){dragonDmg=0;bWindShield=false;critMsg=' 🛡️ KHIÊN GIÓ chặn đòn!';}
        let armorPct=equippedArmor?equippedArmor.armor/100:0;
        if(bHacDefDebuff) armorPct=armorPct*0.5; // Hơi thở bóng tối: giáp -50%
        let finalDmg=Math.max(1,Math.floor(dragonDmg*(1-armorPct)));
        if(dragonDmg===0) finalDmg=0;
        if(finalDmg>0){bPHP=Math.max(0,bPHP-finalDmg);playerHP=bPHP;P.hurtAnim=20;}
        updateBHUD();updateHUD();drawBattleScene(0,1);
        // Trigger claw FX cho đòn thường
        dragonTriggerClaw(bShadowSoulState, BCX, BGY);
        setBLog('🐉 Hắc Long cào '+finalDmg+' DMG! (giáp -'+Math.floor(armorPct*100)+'%)'+critMsg);
        if(bPHP<=0){endBattle(false,0);return;}

        // Sau mỗi 2 đòn THƯỜNG → dùng kỹ năng đặc biệt (delay nhỏ)
        if(bHacNormalCount%2===0){
          bHacSkillCount++;
          const useOrb=(bHacSkillCount%2===1); // luân phiên Orb → Breath → Orb...
          setTimeout(()=>{
            if(!bActive)return;
            document.querySelectorAll('.bbtn').forEach(b=>b.disabled=true);
            if(useOrb){
              // ── KỸ NĂNG 1: QUẢ CẦU HẮC ÁM ──────────────────
              const dmgOrb=Math.floor((bMon.dragonAtk||22)*0.8);
              const ap=equippedArmor?equippedArmor.armor/100:0;
              const orbDmg=Math.max(1,Math.floor(dmgOrb*(1-ap)));
              if(orbDmg>0){bPHP=Math.max(0,bPHP-orbDmg);playerHP=bPHP;P.hurtAnim=20;}
              updateBHUD();updateHUD();
              dragonOrbFX(bctx,BCX,BGY);
              drawBattleScene(0,1,'magic');
              if(bHacPhase2||Math.random()<0.40){
                bHacDmgDebuff=true;bHacDmgTurns=3;
                document.getElementById('hac-dmg-tag').classList.add('on');
                document.getElementById('hac-dmg-tag').textContent='🔮 QUẢ CẦU HẮC ÁM — Sát thương -40% (3 vòng)';
                setBLog('🔮 QUẢ CẦU HẮC ÁM! -'+orbDmg+' DMG! ☠️ Sát thương của bạn -40% trong 3 vòng!');
              } else {
                setBLog('🔮 QUẢ CẦU HẮC ÁM! -'+orbDmg+' DMG!');
              }
              if(bPHP<=0){setTimeout(()=>endBattle(false,0),700);return;}
              setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},900);
            } else {
              // ── KỸ NĂNG 2: HƠI THỞ BÓNG TỐI ────────────────
              const dmgBr=Math.floor((bMon.dragonAtk||22)*1.1);
              const ap=equippedArmor?equippedArmor.armor/100:0;
              const brDmg=Math.max(1,Math.floor(dmgBr*(ap*0.5>0?(1-ap*0.5):(1-ap))));
              if(brDmg>0){bPHP=Math.max(0,bPHP-brDmg);playerHP=bPHP;P.hurtAnim=25;}
              updateBHUD();updateHUD();
              dragonTriggerBreath(true,BCX,BGY);
              drawBattleScene(0,1,'shadow');
              bHacDefDebuff=true;bHacDefTurns=2;
              document.getElementById('hac-def-tag').classList.add('on');
              document.getElementById('hac-def-tag').textContent='🌑 HƠI THỞ BÓNG TỐI — Phòng thủ -50% (2 vòng)';
              setBLog('🌑 HƠI THỞ BÓNG TỐI! -'+brDmg+' DMG! 🛡️ Phòng thủ của bạn -50% trong 2 vòng!');
              if(bPHP<=0){setTimeout(()=>endBattle(false,0),700);return;}
              setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},1000);
            }
          }, 700); // Delay 700ms sau đòn thường
          return; // Chặn enable buttons — kỹ năng sẽ enable sau
        }

        setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
        return;
      }

      // Các loại rồng khác (dragon_mini, fire_dragon...): đòn thường
      const dragonBase=bMon.dragonAtk||22;
      let dragonDmg=dragonBase+Math.floor(Math.random()*15);
      let critMsg='';
      if(Math.random()<(bMon.dragonCritChance||0.3)){dragonDmg=Math.floor(dragonDmg*2);critMsg=' 💥 CHÍ MẠNG RỒNG!';}
      if(bWindShield){dragonDmg=0;bWindShield=false;critMsg=' 🛡️ KHIÊN GIÓ chặn đòn!';}
      const armorPct2=equippedArmor?equippedArmor.armor/100:0;
      let finalDmg2=Math.max(1,Math.floor(dragonDmg*(1-armorPct2)));
      if(dragonDmg===0) finalDmg2=0;
      if(finalDmg2>0){bPHP=Math.max(0,bPHP-finalDmg2);playerHP=bPHP;P.hurtAnim=20;}
      updateBHUD();updateHUD();drawBattleScene(0,1);
      const dName=bMon.type==='fire_dragon'?'🔥 HỎA LONG':'🐉 RỒNG';
      setBLog(dName+' cào '+finalDmg2+' DMG! (giáp -'+Math.floor(armorPct2*100)+'%)'+critMsg);
      if(bPHP<=0){endBattle(false,0);return;}
      setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
      return;
    }

    // ── NORMAL MONSTER ATTACK ─────────────────────────────────
    const armorPct=equippedArmor?equippedArmor.armor/100:0;
    const baseRaw={goblin:8,bat:12,orc:22}[bMon.type]||10+Math.floor(Math.random()*8);
    let rawDmg=Math.round(baseRaw*nightMult);
    if(bWindDebuff){rawDmg=Math.floor(rawDmg*0.7);bWindDebuff=false;}
    let mdmg=Math.max(1,Math.floor(rawDmg*(1-armorPct)));
    let shieldMsg='';
    // Angel armor: post-revive block
    if(bAngelBlocked){
      mdmg=0; bAngelBlocked=false;
      shieldMsg=' 👼 KHIÊN THIÊN THẦN chặn đòn!';
      FX.play('angel_dodge',{});
    } else if(bWindShield){
      mdmg=0; bWindShield=false;
      shieldMsg=' 🛡️ KHIÊN GIÓ chặn đòn!';
    } else if(equippedArmor&&equippedArmor.id==='angelarmor'&&Math.random()<(equippedArmor.dodgeChance||0.35)){
      // Angel dodge
      mdmg=0;
      shieldMsg=' 👼 NÉ ĐÒN THIÊN THẦN!';
      FX.play('angel_dodge',{});
    }
    if(mdmg>0){bPHP=Math.max(0,bPHP-mdmg);playerHP=bPHP;P.hurtAnim=20;}
    updateBHUD();updateHUD();drawBattleScene(0,1);
    const nightTag=isNightTime()?'🌑 ':'';
    setBLog(nightTag+bMon.name+' phản công '+(mdmg>0?mdmg:'0')+' DMG'+shieldMsg+' (giáp -'+Math.floor(armorPct*100)+'%)!');
    if(bMon.type==='dragon'||bMon.type==='dragon_shadow'){
      const _BCX=Math.round(bcv.width*0.78), _BGY=bcv.height-52;
      dragonTriggerClaw(bShadowSoulState, _BCX, _BGY);
    }
    // Angel armor REVIVE — triggers when HP hits 0
    if(bPHP<=0&&equippedArmor&&equippedArmor.id==='angelarmor'&&!bAngelReviveUsed){
      bAngelReviveUsed=true;
      const reviveHP=Math.floor(playerMaxHP*0.3);
      bPHP=reviveHP; playerHP=reviveHP;
      bAngelBlocked=true; // block next hit
      updateBHUD();updateHUD();
      FX.play('angel_revive',{});
      setBLog('✨ HỒI SINH THIÊN THẦN! +'+reviveHP+' HP! Chặn đòn tiếp theo!');
      setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},1200);
      return;
    }
    if(bPHP<=0){endBattle(false,0);return;}
    setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
  },700);
  // Apply diff reward multiplier on kill
}

// Called after quiz WRONG — monster attacks player
function doBWrongAnswer(){
  const armorPct=(equippedArmor?equippedArmor.armor:0)/100;
  const nightMult=getNightMult();
  const isDragon=bMon&&(bMon.type==='dragon'||bMon.type==='dragon_mini'||bMon.type==='fire_dragon'||bMon.type==='sea_dragon'||bMon.type==='seadragon');
  const isShadow=bMon&&bMon.type==='dragon_shadow';
  setTimeout(()=>{
    if(isShadow){
      const soulMult=bShadowSoulState?0.4:1;
      const sdBase=bMon.dragonAtk||18;
      let dmg=Math.round((sdBase+Math.floor(Math.random()*10))*soulMult);
      if(bWindShield){dmg=0;bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn đòn Ám Long!');}
      else setBLog('⚔ ❌ Sai → Ám Long phản công '+Math.max(1,Math.floor(dmg*(1-(equippedArmor?equippedArmor.armor:0)/100)))+' DMG!'+(bShadowSoulState?' 👻':''));
      const fd=Math.max(1,Math.floor(dmg*(1-(equippedArmor?equippedArmor.armor:0)/100)));
      if(fd>0&&dmg>0){bPHP=Math.max(0,bPHP-fd);playerHP=bPHP;P.hurtAnim=20;}
    } else if(isDragon){
      // Hắc Long Vương: trả lời sai → dùng kỹ năng luân phiên
      if(bMon.type==='dragon'){
        const BCX=Math.round(bcv.width*0.78), BGY=bcv.height-52;
        bHacSkillCount++;
        const useOrb=(bHacSkillCount%2===1);
        if(useOrb){
          // Kỹ năng 1: Quả Cầu Hắc Ám
          const dmgOrb=Math.floor((bMon.dragonAtk||22)*1.1);
          const orbDmg=bWindShield?0:Math.max(1,Math.floor(dmgOrb*(1-armorPct)));
          if(bWindShield){bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn Quả Cầu Hắc Ám!');}
          else {
            if(orbDmg>0){bPHP=Math.max(0,bPHP-orbDmg);playerHP=bPHP;P.hurtAnim=20;}
            dragonOrbFX(bctx,BCX,BGY);
            if(bHacPhase2||Math.random()<0.40){
              bHacDmgDebuff=true;bHacDmgTurns=3;
              document.getElementById('hac-dmg-tag').classList.add('on');
              document.getElementById('hac-dmg-tag').textContent='🔮 QUẢ CẦU HẮC ÁM — Sát thương -40% (3 vòng)';
              setBLog('⚔ ❌ Sai → 🔮 QUẢ CẦU HẮC ÁM! -'+orbDmg+' DMG! ☠️ Sát thương -40% trong 3 vòng!');
            } else {
              setBLog('⚔ ❌ Sai → 🔮 QUẢ CẦU HẮC ÁM! -'+orbDmg+' DMG!');
            }
          }
        } else {
          // Kỹ năng 2: Hơi Thở Bóng Tối
          const dmgBr=Math.floor((bMon.dragonAtk||22)*1.3);
          const brDmg=bWindShield?0:Math.max(1,Math.floor(dmgBr*(1-armorPct)));
          if(bWindShield){bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn Hơi Thở Bóng Tối!');}
          else {
            if(brDmg>0){bPHP=Math.max(0,bPHP-brDmg);playerHP=bPHP;P.hurtAnim=25;}
            dragonTriggerBreath(true,BCX,BGY);
            bHacDefDebuff=true;bHacDefTurns=2;
            document.getElementById('hac-def-tag').classList.add('on');
            document.getElementById('hac-def-tag').textContent='🌑 HƠI THỞ BÓNG TỐI — Phòng thủ -50% (2 vòng)';
            setBLog('⚔ ❌ Sai → 🌑 HƠI THỞ BÓNG TỐI! -'+brDmg+' DMG! 🛡️ Phòng thủ -50% trong 2 vòng!');
          }
        }
      } else if(bMon.type==='fire_dragon'){
        // Hỏa Long: trả lời sai → Hơi Thở Địa Ngục luôn
        const breathBase=(bMon.dragonAtk||35)*1.2;
        const breathDmg=bWindShield?0:Math.max(1,Math.floor(breathBase*(1-armorPct)));
        if(bWindShield){bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn Hơi Thở Địa Ngục!');}
        else{
          bPlayerBurnTurns=3;
          if(breathDmg>0){bPHP=Math.max(0,bPHP-breathDmg);playerHP=bPHP;P.hurtAnim=25;}
          FX.play('dragon_fire',{});
          setTimeout(()=>{ if(bActive) FX.play('player_burn',{}); },800);
          setBLog('⚔ ❌ Sai → 🔥 HƠI THỞ ĐỊA NGỤC! -'+breathDmg+' DMG! 🔥 Thiêu đốt × 3 vòng!');
        }
      } else {
        // Các rồng khác: đánh thường
        const dragonBase=bMon.dragonAtk||22;
        let dmg=dragonBase+Math.floor(Math.random()*10);
        if(Math.random()<(bMon.dragonCritChance||0.18)){dmg=Math.floor(dmg*1.8);setBLog('⚔ ❌ Sai → Rồng CHÍ MẠNG! '+Math.max(1,Math.floor(dmg*(1-armorPct)))+' DMG!');}
        else setBLog('⚔ ❌ Sai → Rồng phản công '+Math.max(1,Math.floor(dmg*(1-armorPct)))+' DMG!');
        if(bWindShield){dmg=0;bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn đòn!');}
        const fd=Math.max(1,Math.floor(dmg*(1-armorPct)));
        if(fd>0&&dmg>0){bPHP=Math.max(0,bPHP-fd);playerHP=bPHP;P.hurtAnim=20;}
      }
    } else {
      const baseRaw={goblin:8,bat:12,orc:22}[bMon.type]||10+Math.floor(Math.random()*8);
      let rawDmg=Math.round(baseRaw*nightMult);
      if(bWindDebuff){rawDmg=Math.floor(rawDmg*0.7);bWindDebuff=false;}
      let mdmg=Math.max(1,Math.floor(rawDmg*(1-armorPct)));
      if(bAngelBlocked){mdmg=0;bAngelBlocked=false;setBLog('⚔ ❌ Sai → Khiên Thiên Thần chặn đòn!');}
      else if(bWindShield){mdmg=0;bWindShield=false;setBLog('⚔ ❌ Sai → Khiên Gió chặn đòn!');}
      else if(equippedArmor&&equippedArmor.id==='angelarmor'&&Math.random()<(equippedArmor.dodgeChance||0.35)){mdmg=0;setBLog('⚔ ❌ Sai → Né đòn Thiên Thần!');}
      else setBLog('⚔ ❌ Trả lời sai! '+bMon.name+' tấn công '+mdmg+' DMG!');
      if(mdmg>0){bPHP=Math.max(0,bPHP-mdmg);playerHP=bPHP;P.hurtAnim=20;}
    }
    updateBHUD();updateHUD();drawBattleScene(0,1);
    if(bPHP<=0&&equippedArmor&&equippedArmor.id==='angelarmor'&&!bAngelReviveUsed){
      bAngelReviveUsed=true;const revHP=Math.floor(playerMaxHP*0.3);bPHP=revHP;playerHP=revHP;bAngelBlocked=true;
      updateBHUD();updateHUD();FX.play('angel_revive',{});
      setBLog('✨ HỒI SINH THIÊN THẦN! +'+revHP+' HP!');
      setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},1200);return;
    }
    if(bPHP<=0){endBattle(false,0);return;}
    setTimeout(()=>{drawBattleScene(0,0);document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);},600);
  },400);
}


function triggerHacLongPhase2(){
  // Hắc Long hồi sinh dạng Linh Hồn Bóng Tối: 10% HP, 30% né, dmg cao hơn
  bHacPhase2=true;
  const phase2HP=Math.floor(bMon.maxHp*0.10);
  bMHP=phase2HP; bMon.maxHp=phase2HP;
  // Tăng sát thương
  bMon.dragonAtk=Math.floor((bMon.dragonAtk||22)*1.6);
  bMon.dragonCritChance=0.35;
  // Né đòn 30%
  bMon._dodgeChance=0.30;
  // Reset counters
  bHacNormalCount=0; bHacSkillCount=0;
  // Visual flash
  dragonHurtFlash=0;
  updateBHUD();updateHUD();
  drawBattleScene(0,0);
  // Thông báo
  setBLog('💀 HẮC LONG VƯƠNG HỒI SINH! LINH HỒN BÓNG TỐI — 30% né đòn, sát thương tăng 60%!');
  showNotif('💀 Hắc Long Vương hồi sinh dạng Linh Hồn!');
  // FX: particles tím bùng nổ
  const BCX=Math.round(bcv.width*0.78), BGY=bcv.height-52;
  for(let i=0;i<25;i++){
    const a=Math.random()*Math.PI*2, spd=2+Math.random()*4;
    dragonSpawnP(BCX+Math.cos(a)*20,BGY-60+Math.sin(a)*20,
      Math.cos(a)*spd,Math.sin(a)*spd,
      `hsla(${260+Math.random()*60},90%,65%,0.9)`,
      40+Math.random()*20,4+Math.random()*3,'curse');
  }
  startDragonFXLoop();
  setTimeout(()=>{
    document.querySelectorAll('.bbtn').forEach(b=>b.disabled=false);
  },1200);
}

function endBattle(won,rw){
  stopDragonFXLoop();
  bActive=false;
  FX.stop();
  // Clean up shadow dragon debuffs
  bShadowDmgDebuff=false; bShadowSoulState=false; bShadowDebuffTurns=0; bShadowSoulTurns=0;
  bHacDmgDebuff=false; bHacDmgTurns=0; bHacDefDebuff=false; bHacDefTurns=0; bHacSkillCount=0; bHacNormalCount=0; bHacPhase2=false; bFireNormalCount=0;
  document.getElementById('hac-dmg-tag').classList.remove('on');
  document.getElementById('hac-def-tag').classList.remove('on');
  document.getElementById('shadow-debuff-tag').classList.remove('on');
  document.getElementById('soul-state-tag').classList.remove('on');

  // ── Underground battles — fully handled here, no fallthrough ──
  const isUGBattle = undergroundActive && bMon && bMon.id && bMon.id.startsWith('ug_');
  if(isUGBattle){
    const nightBonus=isNightTime()?Math.round(rw*0.5):0;
    const diffMult=[0,1.05,1.15,1.30,1.60,2.20][battleDiff]||1;
    const finalRw=won?Math.round((rw+nightBonus)*diffMult):0;
    if(won){ coins+=finalRw; updateHUD(); }
    else { if(playerHP<=0) playerHP=Math.floor(playerMaxHP*0.3); }
    setBLog(won?'🏆 THẮNG! +'+finalRw+' 🪙':'💀 Bạn đã thua...');
    document.getElementById('battle').classList.remove('on');
    _onUGBattleEnd(won);
    return;
  }

  // Fire dragon: exit underground
  if(won && bMon && bMon.type==='fire_dragon'){
    undergroundFireDragonDefeated=true;
    document.getElementById('battle').classList.remove('on');
    _onUGBattleEnd(true);
    return;
  }

  const nightBonus=isNightTime()?Math.round(rw*0.5):0;
  const totalRw=rw+nightBonus;
  const diffMult=[0,1.05,1.15,1.30,1.60,2.20][battleDiff]||1;
  const finalRw=won?Math.round(totalRw*diffMult):0;
  if(won){
    coins+=finalRw;if(bMon){bMon.alive=false;bMon.deathTime=Date.now();}updateHUD();
    const bonusTxt=nightBonus>0?' (+🌑'+nightBonus+' thưởng đêm)':'';
    const diffLabel=battleDiff>1?' 📚×'+[0,'','1.15','1.30','1.60','2.20'][battleDiff]:'';
    setBLog('🏆 THẮNG! +'+finalRw+' 🪙'+bonusTxt+diffLabel);
  }else{if(playerHP<=0)playerHP=Math.floor(playerMaxHP*0.3);setBLog('💀 Bạn đã thua...');}
  setTimeout(()=>{
    document.getElementById('battle').classList.remove('on');
    // Hiện lại world canvas
    const _gc=document.getElementById('gc');
    if(_gc) _gc.style.visibility='visible';
    gameState='WORLD';updateHUD();
    showNotif(won?'🏆 Chiến thắng! +'+finalRw+' 🪙':'Đã thoát trận chiến');
  },1500);
}
// ── Pixel art fire for battle canvas ─────────────────────────────


function drawHacLongBG(bc, BW, BH){
  // ══ NỀN LÂU ĐÀI ĐÁ TỐI — pixel art style ══════════════════
  // Màu palette đá (tối, xanh lạnh)
  const C1='#1a1e2e'; // đá tối nhất
  const C2='#232840'; // đá tối
  const C3='#2e3550'; // đá trung
  const C4='#3a4265'; // đá sáng
  const C5='#454e70'; // đá highlight
  const C6='#1c2035'; // đá nền
  const CF='#0d1020'; // nền rất tối
  const CG='#3a4f5e'; // đá ánh xanh lạnh
  const CH='#5a7080'; // highlight lạnh
  const CA='#4a6070'; // đá xanh accent

  // ── 1. Nền tối gradient ──────────────────────────────────────
  const bg=bc.createLinearGradient(0,0,0,BH);
  bg.addColorStop(0,CF);bg.addColorStop(0.4,C1);bg.addColorStop(1,'#090c18');
  bc.fillStyle=bg;bc.fillRect(0,0,BW,BH);

  const p=(x,y,w,h,col,alpha)=>{
    if(alpha!==undefined){bc.save();bc.globalAlpha=alpha;}
    bc.fillStyle=col;bc.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
    if(alpha!==undefined)bc.restore();
  };

  // ── 2. Tường gạch đá (background) ───────────────────────────
  const brickW=22, brickH=10, mortar=2;
  const wallColors=[C2,C3,C1,C3,C2,C4,C1,C3];
  for(let row=0;row<Math.ceil(BH*0.82/( brickH+mortar));row++){
    const by=row*(brickH+mortar);
    const offset=(row%2===0)?0:brickW/2;
    for(let col=0;col<Math.ceil(BW/(brickW+mortar))+1;col++){
      const bx=col*(brickW+mortar)-offset;
      const col2=wallColors[(row*3+col)%wallColors.length];
      p(bx,by,brickW,brickH,col2);
      // Highlight trên đỉnh viên gạch
      p(bx+1,by+1,brickW-2,1,C5,0.25);
      // Shadow dưới viên gạch
      p(bx+1,by+brickH-1,brickW-2,1,'#0a0c14',0.3);
      // Crack effect (ngẫu nhiên theo seed)
      const seed=(row*17+col*31)%100;
      if(seed<12){
        bc.save();bc.globalAlpha=0.18;bc.strokeStyle='#0a0d18';bc.lineWidth=1;
        bc.beginPath();
        bc.moveTo(bx+brickW*0.3,by+2);
        bc.lineTo(bx+brickW*0.5+seed%5-2,by+brickH-2);
        bc.stroke();bc.restore();
      }
    }
  }
  // Mortar lines ngang
  bc.save();bc.globalAlpha=0.35;bc.fillStyle='#0d1020';
  for(let row=0;row<Math.ceil(BH*0.82/(brickH+mortar));row++){
    const by=row*(brickH+mortar)+brickH;
    bc.fillRect(0,by,BW,mortar);
  }
  bc.restore();

  // ── 3. Nền sàn đá (ground area) ─────────────────────────────
  const groundY=Math.round(BH*0.75);
  const floorG=bc.createLinearGradient(0,groundY,0,BH);
  floorG.addColorStop(0,'#1e2535');floorG.addColorStop(0.3,'#252d40');floorG.addColorStop(1,'#151820');
  bc.fillStyle=floorG;bc.fillRect(0,groundY,BW,BH-groundY);

  // Đá sàn (tile gạch lớn hơn)
  const tileW=36, tileH=12;
  bc.save();bc.globalAlpha=0.7;
  for(let tr=0;tr<3;tr++){
    const ty=groundY+tr*tileH;
    for(let tc=0;tc<Math.ceil(BW/tileW)+1;tc++){
      const tx=tc*tileW+(tr%2===0?0:tileW/2);
      const tc2=tr%2===0?'#252d42':'#1f2838';
      p(tx,ty,tileW-1,tileH-1,tc2);
      p(tx+1,ty+1,tileW-3,1,CH,0.15);
      // Crack sàn
      const ts=(tr*11+tc*23)%100;
      if(ts<18){
        bc.save();bc.globalAlpha=0.2;bc.strokeStyle='#0a0d18';bc.lineWidth=1;
        bc.beginPath();bc.moveTo(tx+5,ty+3);bc.lineTo(tx+tileW*0.7,ty+tileH-3);bc.stroke();bc.restore();
      }
    }
  }
  bc.restore();

  // ── 4. CỘT ĐÁ (2 bên) ───────────────────────────────────────
  const drawPillar=(px)=>{
    const pw=24, ph=Math.round(BH*0.78);
    // Bệ dưới
    p(px-4,groundY-2,pw+8,10,'#2a3248');
    p(px-2,groundY,pw+4,6,'#354060');
    p(px-6,groundY+5,pw+12,5,'#1e2535');
    // Thân cột
    const cg=bc.createLinearGradient(px,0,px+pw,0);
    cg.addColorStop(0,'#1e2438');cg.addColorStop(0.2,'#2e3a50');
    cg.addColorStop(0.5,'#3a4865');cg.addColorStop(0.8,'#2e3a50');cg.addColorStop(1,'#1a2030');
    bc.fillStyle=cg;bc.fillRect(px,0,pw,ph);
    // Groove (rãnh dọc)
    bc.save();bc.globalAlpha=0.3;
    bc.fillStyle='#0d1020';bc.fillRect(px+pw*0.4,0,2,ph);
    bc.fillStyle=CH;bc.globalAlpha=0.12;bc.fillRect(px+2,0,2,ph);
    bc.restore();
    // Đỉnh cột
    p(px-3,0,pw+6,8,'#354060');
    p(px-5,6,pw+10,5,'#2a3248');
    p(px-1,1,pw+2,4,CH,0.15);
    // Đá trang trí giữa cột
    const mid=Math.round(ph*0.35);
    p(px-3,mid,pw+6,8,'#2e3a52');
    p(px-1,mid+1,pw+2,2,CH,0.2);
  };
  drawPillar(8);
  drawPillar(BW-32);

  // ── 5. CỔNG VÒNG CUỐN (arch) — trung tâm ────────────────────
  const archCX=Math.round(BW*0.5);
  const archW=Math.round(BW*0.28);
  const archH=Math.round(BH*0.58);
  const archBaseY=groundY;
  const archR=Math.round(archW*0.5);
  const archTopY=archBaseY-archH+archR;

  // Viền ngoài cổng (đá nhô ra)
  bc.save();
  bc.fillStyle='#2e3550';
  bc.beginPath();
  bc.moveTo(archCX-archW/2-8,archBaseY+2);
  bc.lineTo(archCX-archW/2-8,archTopY);
  bc.arc(archCX,archTopY,archW/2+8,Math.PI,0,false);
  bc.lineTo(archCX+archW/2+8,archBaseY+2);
  bc.closePath();bc.fill();

  // Thân cổng (đá tối hơn)
  bc.fillStyle='#252d42';
  bc.beginPath();
  bc.moveTo(archCX-archW/2-3,archBaseY+2);
  bc.lineTo(archCX-archW/2-3,archTopY);
  bc.arc(archCX,archTopY,archW/2+3,Math.PI,0,false);
  bc.lineTo(archCX+archW/2+3,archBaseY+2);
  bc.closePath();bc.fill();
  bc.restore();

  // Lỗ cổng (bóng tối hoàn toàn)
  bc.save();
  bc.fillStyle='#000005';
  bc.beginPath();
  bc.moveTo(archCX-archW/2,archBaseY);
  bc.lineTo(archCX-archW/2,archTopY);
  bc.arc(archCX,archTopY,archW/2,Math.PI,0,false);
  bc.lineTo(archCX+archW/2,archBaseY);
  bc.closePath();bc.fill();
  // Fog/mist trong cổng (ánh sáng xanh mờ)
  const gfg=bc.createRadialGradient(archCX,archTopY+archR*0.5,0,archCX,archTopY+archR*0.5,archW*0.55);
  gfg.addColorStop(0,'rgba(50,80,120,0.18)');
  gfg.addColorStop(0.5,'rgba(20,40,80,0.1)');
  gfg.addColorStop(1,'rgba(0,0,0,0)');
  bc.fillStyle=gfg;
  bc.beginPath();
  bc.moveTo(archCX-archW/2,archBaseY);
  bc.lineTo(archCX-archW/2,archTopY);
  bc.arc(archCX,archTopY,archW/2,Math.PI,0,false);
  bc.lineTo(archCX+archW/2,archBaseY);
  bc.closePath();bc.fill();
  bc.restore();

  // Đá cuốn vòng (keystone và voussoirs)
  bc.save();
  const archStones=8;
  for(let i=0;i<archStones;i++){
    const a=Math.PI-(i/(archStones-1))*Math.PI;
    const r1=archW/2+3, r2=archW/2+13;
    const x1=archCX+Math.cos(a)*r1, y1=archTopY+Math.sin(a)*r1;
    const x2=archCX+Math.cos(a)*r2, y2=archTopY+Math.sin(a)*r2;
    const a2=a+Math.PI/(archStones-1)*0.45;
    const x3=archCX+Math.cos(a2)*r2, y3=archTopY+Math.sin(a2)*r2;
    const x4=archCX+Math.cos(a2)*r1, y4=archTopY+Math.sin(a2)*r1;
    bc.fillStyle=i%2===0?'#354060':'#2a3450';
    bc.beginPath();bc.moveTo(x1,y1);bc.lineTo(x2,y2);bc.lineTo(x3,y3);bc.lineTo(x4,y4);bc.closePath();bc.fill();
    bc.strokeStyle='#1a2035';bc.lineWidth=1;bc.stroke();
    // Highlight đá vòng cuốn
    bc.globalAlpha=0.2;bc.fillStyle=CH;
    bc.beginPath();bc.moveTo(x1,y1);bc.lineTo(x2,y2);
    bc.lineTo((x2+x3)/2,(y2+y3)/2);bc.lineTo((x1+x4)/2,(y1+y4)/2);bc.closePath();bc.fill();
    bc.globalAlpha=1;
  }
  // Keystone (đá chốt giữa vòm)
  p(archCX-6,archTopY-archW/2-11,12,14,'#404e68');
  p(archCX-4,archTopY-archW/2-9,8,3,CH,0.25);
  bc.restore();

  // ── 6. ĐÈN ĐUỐC 2 BÊN CỔNG ─────────────────────────────────
  [archCX-archW/2-14, archCX+archW/2+2].forEach((tx,ti)=>{
    // Giá đuốc
    p(tx,archTopY+10,12,4,'#2a3248');
    p(tx+2,archTopY+14,8,18,'#252d3e');
    p(tx+1,archTopY+32,10,3,'#2a3248');
    // Lửa đuốc
    const flicker=Math.sin(frameCount*0.18+ti*2.1)*0.3;
    const torchX=tx+6, torchY=archTopY+10;
    const tg=bc.createRadialGradient(torchX,torchY,1,torchX,torchY,12+flicker*3);
    tg.addColorStop(0,'rgba(200,220,255,0.9)');
    tg.addColorStop(0.2,'rgba(100,150,230,0.7)');
    tg.addColorStop(0.6,'rgba(40,80,180,0.3)');
    tg.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=tg;bc.beginPath();bc.arc(torchX,torchY,12+flicker*2,0,Math.PI*2);bc.fill();
    // Ánh sáng đuốc lên tường
    bc.save();bc.globalAlpha=0.08+flicker*0.04;
    const wg=bc.createRadialGradient(torchX,torchY,0,torchX,torchY,40);
    wg.addColorStop(0,'rgba(100,150,255,0.8)');wg.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=wg;bc.beginPath();bc.arc(torchX,torchY,40,0,Math.PI*2);bc.fill();
    bc.restore();
  });

  // ── 7. BẬC THANG đá trước cổng ─────────────────────────────
  const stepColors=['#2a3248','#303a52','#384260'];
  for(let s=0;s<3;s++){
    const sw=archW*0.55+s*24, sh=5, sx=archCX-sw/2, sy=groundY+s*sh;
    p(sx,sy,sw,sh,stepColors[s]);
    p(sx+1,sy+1,sw-2,1,CH,0.2);
    // Crack
    bc.save();bc.globalAlpha=0.15;bc.strokeStyle='#0d1020';bc.lineWidth=1;
    bc.beginPath();bc.moveTo(sx+sw*0.3,sy+2);bc.lineTo(sx+sw*0.35,sy+sh-1);bc.stroke();
    bc.restore();
  }

  // ── 8. SƯƠNG MÙ + ÁNH SÁNG LẠO XẠO ─────────────────────────
  // Ánh sáng xanh lạnh từ cổng tỏa ra
  bc.save();
  const glow=bc.createRadialGradient(archCX,archBaseY-10,5,archCX,archBaseY-10,archW*0.8);
  const glowAlpha=0.06+Math.sin(frameCount*0.04)*0.025;
  glow.addColorStop(0,`rgba(60,100,180,${glowAlpha*3})`);
  glow.addColorStop(0.5,`rgba(30,60,120,${glowAlpha})`);
  glow.addColorStop(1,'rgba(0,0,0,0)');
  bc.fillStyle=glow;bc.beginPath();bc.arc(archCX,archBaseY-10,archW*0.8,0,Math.PI*2);bc.fill();
  // Sương mù cuộn dưới sàn
  for(let mi=0;mi<4;mi++){
    const mx=((frameCount*0.3+mi*BW/4)%BW);
    const mistG=bc.createRadialGradient(mx,BH-4,0,mx,BH-4,40);
    mistG.addColorStop(0,'rgba(40,60,100,0.12)');
    mistG.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=mistG;bc.beginPath();bc.ellipse(mx,BH-4,45,12,0,0,Math.PI*2);bc.fill();
  }
  bc.restore();

  // ── 9. Phase 2: hiệu ứng tối hơn ────────────────────────────
  if(bHacPhase2){
    bc.save();
    bc.globalAlpha=0.22+Math.sin(frameCount*0.07)*0.08;
    const darkG=bc.createRadialGradient(archCX,archTopY,10,archCX,archTopY,BW*0.7);
    darkG.addColorStop(0,'rgba(60,0,100,0.5)');
    darkG.addColorStop(1,'rgba(0,0,0,0)');
    bc.fillStyle=darkG;bc.fillRect(0,0,BW,BH);
    bc.restore();
  }
}