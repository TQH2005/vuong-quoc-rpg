function renderBagSections(){
  const sec=document.getElementById('bag-sections');
  sec.innerHTML='';

  // ── Section 1: Vũ Khí Cận Chiến ──
  const ownedMelee=weapons.filter(w=>w.owned&&w.type==='melee');
  if(ownedMelee.length>0){
    const s=document.createElement('div');s.className='bag-section';
    s.innerHTML='<div class="bag-section-title">⚔ Cận Chiến ('+ownedMelee.length+') <span style="font-size:7px;color:#666">— nhấn để trang bị vào ô ⚔</span></div>';
    const g=document.createElement('div');g.className='bag-grid';
    ownedMelee.forEach(w=>{
      const isEq=equippedMelee&&equippedMelee.id===w.id;
      const isCave=w.isCaveReward;
      const slot=document.createElement('div');
      slot.className='bag-slot'+(isEq?' equipped':'');
      if(isCave) slot.style.borderColor='rgba(255,215,0,0.6)';
      const descClean=(w.desc||'').replace(/<[^>]+>/g,'');
      slot.innerHTML=`
        <div class="bag-slot-icon">${w.icon}</div>
        <div class="bag-slot-name">${w.name}</div>
        <div class="bag-slot-stat" style="color:#ffd700">⚔${w.dmg}</div>
        <div class="bag-slot-tip">
          <b style="color:#ffd700">${w.icon} ${w.name}</b><br>
          Sát thương: ${w.dmg} DMG<br>
          ${descClean}<br>
          <span style="color:#aaa">${isEq?'✓ Đang trang bị':'Nhấn để trang bị ô ⚔'}</span>
        </div>`;
      slot.onclick=()=>{
        equippedMelee=w; equippedWpn=w;
        updateHUD(); showNotif(w.icon+' Trang bị CẬN: '+w.name);
        renderBagSections(); refreshBagEquipBar();
      };
      g.appendChild(slot);
    });
    const empties=Math.max(0,5-ownedMelee.length);
    for(let i=0;i<empties;i++){const e=document.createElement('div');e.className='bag-slot empty';g.appendChild(e);}
    s.appendChild(g);sec.appendChild(s);
  }

  // ── Section 2: Vũ Khí Phép ──
  const ownedMagic=weapons.filter(w=>w.owned&&w.type==='magic');
  if(ownedMagic.length>0){
    const s=document.createElement('div');s.className='bag-section';
    s.innerHTML='<div class="bag-section-title">✨ Phép Thuật ('+ownedMagic.length+') <span style="font-size:7px;color:#666">— nhấn để trang bị vào ô ✨</span></div>';
    const g=document.createElement('div');g.className='bag-grid';
    ownedMagic.forEach(w=>{
      const isEq=equippedMagic&&equippedMagic.id===w.id;
      const isCave=w.isCaveReward;
      const slot=document.createElement('div');
      slot.className='bag-slot'+(isEq?' equipped':'');
      if(isCave) slot.style.borderColor='rgba(200,136,255,0.6)';
      if(isEq) slot.style.boxShadow='0 0 8px rgba(200,136,255,0.4)';
      const descClean=(w.desc||'').replace(/<[^>]+>/g,'');
      slot.innerHTML=`
        <div class="bag-slot-icon">${w.icon}</div>
        <div class="bag-slot-name">${w.name}</div>
        <div class="bag-slot-stat" style="color:#cc88ff">✨${w.dmg}</div>
        <div class="bag-slot-tip">
          <b style="color:#cc88ff">${w.icon} ${w.name}</b><br>
          Sát thương: ${w.dmg} DMG<br>
          ${descClean}<br>
          <span style="color:#aaa">${isEq?'✓ Đang trang bị':'Nhấn để trang bị ô ✨'}</span>
        </div>`;
      slot.onclick=()=>{
        equippedMagic=w;
        updateHUD(); showNotif(w.icon+' Trang bị PHÉP: '+w.name);
        renderBagSections(); refreshBagEquipBar();
      };
      g.appendChild(slot);
    });
    const empties=Math.max(0,5-ownedMagic.length);
    for(let i=0;i<empties;i++){const e=document.createElement('div');e.className='bag-slot empty';g.appendChild(e);}
    s.appendChild(g);sec.appendChild(s);
  }

  // ── Section 3: Giáp ──
  const ownedArmors=armors.filter(a=>a.owned);
  if(ownedArmors.length>0){
    const s=document.createElement('div');s.className='bag-section';
    s.innerHTML='<div class="bag-section-title">🛡 Giáp ('+ownedArmors.length+')</div>';
    const g=document.createElement('div');g.className='bag-grid';
    ownedArmors.forEach(a=>{
      const isEq=equippedArmor&&equippedArmor.id===a.id;
      const slot=document.createElement('div');
      slot.className='bag-slot'+(isEq?' equipped':'');
      slot.innerHTML=`
        <div class="bag-slot-icon">${a.icon}</div>
        <div class="bag-slot-name">${a.name}</div>
        <div class="bag-slot-stat" style="color:#2196f3">🛡${a.armor}%</div>
        <div class="bag-slot-tip">
          <b style="color:#ffd700">${a.icon} ${a.name}</b><br>
          Giáp: -${a.armor}% sát thương<br>
          HP: +${a.hp}<br>
          ${a.desc}<br>
          <span style="color:#aaa">${isEq?'✓ Đang mặc':'Nhấn để mặc'}</span>
        </div>`;
      slot.onclick=()=>{
        if(!isEq){
          const prev=equippedArmor;
          playerMaxHP=Math.max(100,100+a.hp);
          playerHP=Math.min(playerHP,playerMaxHP);
          if(a.id==='magic'||a.id==='dragon'){playerMaxMana=80+(a.id==='magic'?30:20);}
          else playerMaxMana=80;
          playerMana=Math.min(playerMana,playerMaxMana);
          equippedArmor=a;
          armors.forEach(x=>x.equipped=false); a.equipped=true;
          updateHUD();showNotif('🛡️ Mặc: '+a.name);
          renderBagSections();
          document.getElementById('bag-eq-armor').textContent=a.icon+' '+a.name;
        }
      };
      g.appendChild(slot);
    });
    const empties=Math.max(0, 5-ownedArmors.length);
    for(let i=0;i<empties;i++){
      const e=document.createElement('div');e.className='bag-slot empty';g.appendChild(e);
    }
    s.appendChild(g);sec.appendChild(s);
  }

  // ── Section 3: Bình ──
  const totalPots=potions.hp+potions.mana;
  const s3=document.createElement('div');s3.className='bag-section';
  s3.innerHTML='<div class="bag-section-title">🧪 Bình ('+totalPots+')</div>';
  const g3=document.createElement('div');g3.className='bag-grid';
  // HP Potion — 1 slot với số lượng
  {
    const slot=document.createElement('div');
    slot.className='bag-slot'+(potions.hp>0?'':' empty');
    if(potions.hp>0){
      slot.innerHTML=`
        <div class="bag-slot-icon">🧪</div>
        <div class="bag-slot-name">Máu</div>
        <div class="bag-slot-stat" style="color:#e74c3c">+50❤</div>
        <div class="bag-slot-qty">×${potions.hp}</div>
        <div class="bag-slot-tip"><b style="color:#ffd700">🧪 Bình Máu</b><br>Hồi 50 HP<br>Số lượng: ${potions.hp}<br><span style="color:#aaa">Dùng trong chiến đấu</span></div>`;
    } else {
      slot.innerHTML=`<div class="bag-slot-icon" style="opacity:0.3">🧪</div><div class="bag-slot-name" style="opacity:0.3">Máu</div><div class="bag-slot-stat" style="color:#555">0</div>`;
    }
    g3.appendChild(slot);
  }
  // Mana Potion — 1 slot với số lượng
  {
    const slot=document.createElement('div');
    slot.className='bag-slot'+(potions.mana>0?'':' empty');
    if(potions.mana>0){
      slot.innerHTML=`
        <div class="bag-slot-icon">💧</div>
        <div class="bag-slot-name">Mana</div>
        <div class="bag-slot-stat" style="color:#2196f3">+40💧</div>
        <div class="bag-slot-qty">×${potions.mana}</div>
        <div class="bag-slot-tip"><b style="color:#ffd700">💧 Bình Mana</b><br>Hồi 40 Mana<br>Số lượng: ${potions.mana}<br><span style="color:#aaa">Dùng trong chiến đấu</span></div>`;
    } else {
      slot.innerHTML=`<div class="bag-slot-icon" style="opacity:0.3">💧</div><div class="bag-slot-name" style="opacity:0.3">Mana</div><div class="bag-slot-stat" style="color:#555">0</div>`;
    }
    g3.appendChild(slot);
  }
  if(totalPots===0){
    const e=document.createElement('div');e.className='bag-slot empty';
    g3.appendChild(e);
  }
  s3.appendChild(g3);sec.appendChild(s3);

  // ── If nothing owned yet ──
  if(ownedMelee.length===0 && ownedMagic.length===0 && ownedArmors.length===0 && totalPots===0){
    sec.innerHTML='<div style="text-align:center;color:#555;font-size:9px;font-family:Times New Roman,serif;padding:20px">Túi đồ trống. Hãy mua đồ từ cửa hàng 🛒</div>';
  }

  // ── Huy hiệu ──
  if(typeof renderBadgeSection==='function') renderBadgeSection(sec);
}


// ═══════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════
let currentShopTab = 'wpn';
function openShop(){
  document.getElementById('shop-cn').textContent=coins;
  document.getElementById('shop-hp').textContent=playerHP+'/'+playerMaxHP;
  document.getElementById('shop-mp').textContent=playerMana+'/'+playerMaxMana;
  document.getElementById('shop').classList.add('on');
  gameState='SHOP';
  shopTab(currentShopTab);
}
function shopTab(tab){
  currentShopTab=tab;
  // Update tab styles
  ['wpn','armor','potion'].forEach(t=>{
    const el=document.getElementById('stab-'+t);
    if(el) el.classList.toggle('active', t===tab);
  });
  const grid=document.getElementById('shop-grid');
  grid.innerHTML='';
  if(tab==='wpn') renderShopWeapons(grid);
  else if(tab==='armor') renderShopArmor(grid);
  else renderShopPotions(grid);
}
function renderShopWeapons(grid){
  const chapNames=['🌿 Đồng Cỏ','🌊 Đại Dương','☁️ Bầu Trời'];
  weapons.forEach(w=>{
    const isEq=equippedWpn&&equippedWpn.id===w.id;
    // Kiểm tra khoá: isCaveReward và chưa hoàn thành bài 10 của chương tương ứng
    const isLocked = w.isCaveReward && !w.owned && !caveProgress[w.caveChap][9].done;
    const card=document.createElement('div');
    card.className='wcard'+(w.owned?' owned':'')+(isEq?' eqd':'')+(isLocked?' locked':'');
    const typeTag=w.type==='magic'?'<div style="font-size:7px;color:#cc88ff;letter-spacing:1px;margin-bottom:1px">✨ PHÉP</div>':'<div style="font-size:7px;color:#ffd700;letter-spacing:1px;margin-bottom:1px">⚔ CẬN</div>';
    const lockInfo=isLocked?`<div style="font-size:7px;color:#ff8844;margin-top:3px">🔒 Hoàn thành bài 10<br>hang ${chapNames[w.caveChap]}</div>`:'';
    card.innerHTML=`<div class="wc-icon">${isLocked?'🔒':w.icon}</div><div class="wc-name">${w.name}</div>${typeTag}<div class="wc-dmg">⚔ ${w.dmg} DMG</div><div style="font-size:7px;color:#886633;margin:2px 0;line-height:1.3;min-height:20px">${isLocked?'':w.desc||''}</div>${lockInfo}<div class="wc-price">${w.owned?'✅ CÓ':isLocked?'🔒 KHOÁ':'🪙 '+w.price}</div>${isEq?'<div class="wc-badge">DÙNG</div>':''}`;
    card.onclick=()=>{
      if(isLocked){showNotif('🔒 Cần hoàn thành bài 10 hang '+chapNames[w.caveChap]);return;}
      if(!w.owned){if(coins>=w.price){coins-=w.price;w.owned=true;updateHUD();showNotif('✅ Mua '+w.name);shopTab('wpn');if(window.saveGameData)window.saveGameData();}else showNotif('❌ Thiếu '+(w.price-coins)+' xu');}
      else{
        if(w.type==='melee'){equippedMelee=w;equippedWpn=w;}
        else{equippedMagic=w;}
        updateHUD();showNotif(w.icon+' Trang bị: '+w.name);shopTab('wpn');
      }
    };
    grid.appendChild(card);
  });
}
function renderShopArmor(grid){
  const chapNames=['🌿 Đồng Cỏ','🌊 Đại Dương','☁️ Bầu Trời'];
  armors.forEach(a=>{
    const isEq=equippedArmor&&equippedArmor.id===a.id;
    const isLocked = a.isCaveReward && !a.owned && !caveProgress[a.caveChap][9].done;
    const card=document.createElement('div');
    card.className='wcard'+(a.owned?' owned':'')+(isEq?' armor-eq':'')+(isLocked?' locked':'');
    const lockInfo=isLocked?`<div style="font-size:7px;color:#ff8844;margin-top:3px">🔒 Hoàn thành bài 10<br>hang ${chapNames[a.caveChap]}</div>`:'';
    card.innerHTML=`
      <div class="wc-icon">${isLocked?'🔒':a.icon}</div>
      <div class="wc-name">${a.name}</div>
      <div class="wc-dmg" style="color:#2196f3">🛡 ${a.armor}% &nbsp; ❤️+${a.hp}</div>
      <div class="wcard-desc">${isLocked?'':a.desc}</div>
      ${lockInfo}
      <div class="wc-price">${a.owned?'✅ CÓ':isLocked?'🔒 KHOÁ':'🪙 '+a.price}</div>
      ${isEq?'<div class="wc-badge" style="background:#00bcd4">MẶCC</div>':''}`;
    card.onclick=()=>{
      if(isLocked){showNotif('🔒 Cần hoàn thành bài 10 hang '+chapNames[a.caveChap]);return;}
      if(!a.owned){
        if(coins>=a.price){
          coins-=a.price; a.owned=true;
          // Apply HP bonus
          const prev=equippedArmor;
          playerMaxHP=100+(a.hp);
          playerHP=Math.min(playerHP+(a.hp-prev.hp),playerMaxHP);
          if(a.id==='magic'||a.id==='dragon'){playerMaxMana=80+(a.id==='magic'?30:20);playerMana=Math.min(playerMana+20,playerMaxMana);}
          equippedArmor=a;
          updateHUD();showNotif('🛡️ Mua & mặc: '+a.name);shopTab('armor');
          if(window.saveGameData)window.saveGameData();
        } else showNotif('❌ Thiếu '+(a.price-coins)+' xu');
      } else {
        // Swap armor
        const prev=equippedArmor;
        playerMaxHP=Math.max(100,100+(a.hp));
        playerHP=Math.min(playerHP,playerMaxHP);
        if(a.id==='magic'||a.id==='dragon') playerMaxMana=80+(a.id==='magic'?30:20);
        else playerMaxMana=80;
        playerMana=Math.min(playerMana,playerMaxMana);
        equippedArmor=a;
        updateHUD();showNotif('🛡️ Mặc: '+a.name);shopTab('armor');
        if(window.saveGameData)window.saveGameData();
      }
    };
    grid.appendChild(card);
  });
}
function renderShopPotions(grid){
  grid.style.gridTemplateColumns='repeat(3,1fr)';
  potionDefs.forEach(p=>{
    const owned=(p.type==='hp'?potions.hp:p.type==='mana'?potions.mana:Math.min(potions.hp,potions.mana));
    const card=document.createElement('div');
    card.className='pot-card';
    card.innerHTML=`
      <div class="pot-icon">${p.icon}</div>
      <div class="pot-name">${p.name}</div>
      <div class="pot-desc">${p.desc}</div>
      <div class="pot-stack">Có: ${p.type==='hp'?potions.hp:p.type==='mana'?potions.mana:0}🧴</div>
      <div class="pot-price">🪙 ${p.price}</div>`;
    card.onclick=()=>{
      if(coins>=p.price){
        coins-=p.price;
        if(p.type==='hp') potions.hp++;
        else if(p.type==='mana') potions.mana++;
        else {potions.hp++;potions.mana++;}
        updateHUD();showNotif('🧪 Mua: '+p.name);shopTab('potion');
        if(window.saveGameData)window.saveGameData();
      } else showNotif('❌ Thiếu '+(p.price-coins)+' xu');
    };
    grid.appendChild(card);
  });
}
function closeShop(){
  document.getElementById('shop').classList.remove('on');
  if(pSess&&pSess.isCave&&!currentHouse) gameState='CAVE';
  else gameState=currentHouse?'INDOOR':'WORLD';
}

function closeShop(){
  document.getElementById('shop').classList.remove('on');
  if(pSess&&pSess.isCave&&!currentHouse) gameState='CAVE';
  else gameState=currentHouse?'INDOOR':'WORLD';
}

// ══════════════════════════════════════════
// TÚI ĐỒ (INVENTORY BAG)
// ══════════════════════════════════════════
// ══════════════════════════════════════════
// CAVE REWARDS
// ══════════════════════════════════════════
function grantCaveReward(chap){
  // chap 0=grassland→naturewand, 1=ocean→trident, 2=sky→angelarmor
  let item=null, isArmor=false;
  if(chap===0){
    item=weapons.find(w=>w.id==='naturewand');
  } else if(chap===1){
    item=weapons.find(w=>w.id==='trident');
  } else if(chap===2){
    item=armors.find(a=>a.id==='angelarmor');
    isArmor=true;
  }
  if(!item) return;
  if(item.owned) return; // already granted
  item.owned=true;
  // Show popup
  const chapNames=['🌿 Vùng Đồng Cỏ','🌊 Vùng Đại Dương','☁️ Vùng Bầu Trời'];
  document.getElementById('crp-icon').textContent=item.icon;
  document.getElementById('crp-name').textContent=item.name;
  // Strip HTML tags for desc
  const descPlain=(item.desc||'').replace(/<[^>]+>/g,'');
  document.getElementById('crp-desc').textContent='Phần thưởng chinh phục '+chapNames[chap]+'!\n'+descPlain;
  document.getElementById('cave-reward-popup').classList.add('on');
  if(window.saveGameData) window.saveGameData();
}
function closeCaveRewardPopup(){
  document.getElementById('cave-reward-popup').classList.remove('on');
  // Show notif summary
  showNotif('🎁 Phần thưởng đã vào túi đồ! Mở 🎒 để trang bị!');
}

function openBag(){
  // Update header stats
  document.getElementById('bag-hp').textContent=playerHP+'/'+playerMaxHP;
  document.getElementById('bag-mp').textContent=playerMana+'/'+playerMaxMana;
  document.getElementById('bag-coins').textContent=coins;
  document.getElementById('bag-lv').textContent='Lv'+playerLevel;
  // Equipped bar — dual weapons
  const meleeEl=document.getElementById('bag-eq-melee');
  const magicEl=document.getElementById('bag-eq-magic');
  if(meleeEl) meleeEl.textContent=equippedMelee?equippedMelee.icon+' '+equippedMelee.name:'—';
  if(magicEl) magicEl.textContent=equippedMagic?equippedMagic.icon+' '+equippedMagic.name:'—';
  document.getElementById('bag-eq-armor').textContent=equippedArmor?equippedArmor.icon+' '+equippedArmor.name:'—';
  document.getElementById('bag-eq-pots').textContent='❤️×'+potions.hp+'  💧×'+potions.mana;
  renderBagSections();
  document.getElementById('bag-overlay').classList.add('on');
  gameState='BAG';
}
// ══════════════════════════════════════════
// CHEAT CONSOLE
// ══════════════════════════════════════════
let _cheatOpen=false;
function openCheatConsole(){
  if(gameState==='BATTLE'||gameState==='PUZZLE') return;
  _cheatOpen=true;
  const el=document.getElementById('cheat-console');
  el.classList.add('on');
  document.getElementById('cheat-input').value='';
  document.getElementById('cheat-result').textContent='';
  // Blur active element trước để tránh mobile zoom khi focus input
  if(document.activeElement) document.activeElement.blur();
  setTimeout(()=>{
    const inp=document.getElementById('cheat-input');
    inp.setAttribute('readonly','readonly');
    inp.focus();
    inp.removeAttribute('readonly');
  },100);
}
function execCheatFromBtn(){
  const val=document.getElementById('cheat-input').value.trim();
  if(val) execCheat(val);
}
function closeCheatConsole(){
  _cheatOpen=false;
  document.getElementById('cheat-console').classList.remove('on');
}
function handleCheatKey(e){
  if(e.key==='Escape'){e.stopPropagation();closeCheatConsole();return;}
  if(e.key==='Enter'){
    e.preventDefault();
    execCheat(document.getElementById('cheat-input').value.trim());
  }
}
function execCheat(cmd){
  const res=document.getElementById('cheat-result');
  const c=cmd.toLowerCase().replace(/\s+/g,' ');

  if(c==='give me all'){
    // All weapons
    weapons.forEach(w=>{ w.owned=true; });
    equippedMelee = weapons.find(w=>w.id==='trident') || weapons.find(w=>w.type==='melee');
    equippedMagic = weapons.find(w=>w.id==='naturewand') || weapons.find(w=>w.type==='magic');
    equippedWpn   = equippedMelee;
    // All armors
    armors.forEach(a=>{ a.owned=true; a.equipped=false; });
    const angel=armors.find(a=>a.id==='angelarmor');
    equippedArmor = angel || armors[armors.length-1];
    equippedArmor.equipped=true;
    playerMaxHP  = 100 + equippedArmor.hp;
    playerHP     = playerMaxHP;
    playerMaxMana= 80 + (equippedArmor.id==='magic'?30:equippedArmor.id==='dragon'?20:equippedArmor.id==='angelarmor'?0:0);
    playerMana   = playerMaxMana;
    // Potions 99
    potions.hp   = 99;
    potions.mana = 99;
    updateHUD();
    if(typeof BADGE_DEFS!=='undefined'&&typeof learnStats!=='undefined'){
      if(!learnStats.unlockedBadges) learnStats.unlockedBadges=[];
      Object.keys(BADGE_DEFS).forEach(id=>{
        if(!learnStats.unlockedBadges.includes(id)) learnStats.unlockedBadges.push(id);
      });
    }
    res.style.color='#00ff88';
    res.textContent='✅ Tất cả trang bị + huy hiệu đã được thêm!';
    showNotif('🎁 give me all — Đã nhận tất cả!');
    setTimeout(closeCheatConsole, 1200);

  } else if(c==='heal'){
    playerHP=playerMaxHP; playerMana=playerMaxMana; updateHUD();
    res.style.color='#00ff88'; res.textContent='❤️ HP & Mana hồi đầy!';
    setTimeout(closeCheatConsole,900);

  } else if(c.startsWith('give coins ')){
    const n=parseInt(c.split(' ')[2]);
    if(!isNaN(n)){coins+=n;updateHUD();res.style.color='#ffd700';res.textContent='🪙 +'+n+' xu!';}
    else{res.style.color='#e74c3c';res.textContent='❌ Cú pháp: give coins <số>';}
    setTimeout(closeCheatConsole,900);

  } else if(c==='god mode'||c==='godmode'){
    playerHP=9999;playerMaxHP=9999;
    playerMana=9999;playerMaxMana=9999;
    if(equippedWpn)  equippedWpn.dmg=9999;
    if(equippedMelee)equippedMelee.dmg=9999;
    if(equippedMagic)equippedMagic.dmg=9999;
    updateHUD();
    res.style.color='#ffd700';res.textContent='👑 God Mode! HP/Mana/Dame → 9999';
    showNotif('👑 God Mode ON!');
    setTimeout(closeCheatConsole,900);

  } else if(c==='level up'){
    playerLevel=Math.min(playerLevel+1,20);playerXP=0;
    playerMaxHP+=15;playerHP=Math.min(playerHP+15,playerMaxHP);
    updateHUD();res.style.color='#00ff88';res.textContent='⭐ Lên cấp '+playerLevel+'!';
    setTimeout(closeCheatConsole,900);

  } else if(c==='help'){
    res.style.color='#aaa';
    res.textContent='give me all · heal · give coins N · god mode · level up · go underground N · go ocean N · speed N · time set day/night · dame N (max 9999) · mana N (max 9999)';

  } else if(c.startsWith('go underground ')){
    const n=parseInt(c.split(' ')[2]);
    if(isNaN(n)||n<1||n>10){
      res.style.color='#e74c3c';
      res.textContent='❌ Cú pháp: go underground <1-10>  (ví dụ: go underground 5)';
    } else {
      closeCheatConsole();
      if(gameState==='UNDERGROUND') exitUnderground();
      if(gameState==='CAVE'){ document.getElementById('cave-overlay').classList.remove('on'); gameState='WORLD'; }
      if(gameState==='BATTLE'){ document.getElementById('battle').classList.remove('on'); gameState='WORLD'; }
      setTimeout(()=>{
        if(ugCanvas){ ugCanvas.width=_isTouchDevice?360:640; ugCanvas.height=_isTouchDevice?260:300; }
        undergroundFloor=n;
        undergroundActive=true;
        ugDoorOpen=false; ugRoomCleared=false; ugInBattle=false;
        UP.x=80; UP.y=UG_GY-UP.h; UP.vx=0; UP.vy=0; UP.facing=1;
        ugCamX=0;
        _spawnUGMonster();
        document.getElementById('underground-overlay').classList.add('on');
        const ctrl=document.getElementById('ug-controls');
        if(ctrl) ctrl.style.display=_isTouchDevice?'flex':'none';
        gameState='UNDERGROUND';
        if(ugCtx) _startUGLoop();
        showNotif('⛏ Teleport → Lòng đất Tầng '+n+'/10');
      }, 200);
    }

  } else if(c.startsWith('go ocean ')){
    const n=parseInt(c.split(' ')[2]);
    if(isNaN(n)||n<1||n>10){
      res.style.color='#e74c3c';
      res.textContent='❌ Cú pháp: go ocean <1-10>  (ví dụ: go ocean 5)';
    } else {
      closeCheatConsole();
      // Thoát các state hiện tại
      if(gameState==='UNDERGROUND') exitUnderground();
      if(gameState==='CAVE'){ document.getElementById('cave-overlay').classList.remove('on'); gameState='WORLD'; }
      if(gameState==='BATTLE'){ document.getElementById('battle').classList.remove('on'); gameState='WORLD'; }
      if(inOcean) exitOceanWorld();
      setTimeout(()=>{
        // Vào đại dương tại màn n
        initOceanWorld();
        oceanFloor = n;
        oceanFloorCleared = false;
        oceanBattleActive = false;
        // Reset HP của floor đó
        const fl = oceanChallengeFloors[n-1];
        if(fl) fl.monster.hp = fl.monster.maxHp;
        showNotif('🌊 Teleport → Đại Dương Tầng '+n+'/10');
      }, 200);
    }

  } else if(c.startsWith('speed ')){
    const n=parseInt(c.split(' ')[1]);
    if(isNaN(n)||n<1||n>10){
      res.style.color='#e74c3c';
      res.textContent='❌ Cú pháp: speed <1-10>  (mặc định: 1)';
    } else {
      P.speed=1.8*n;
      UP.speed=2.2*n;
      res.style.color='#00ff88';
      res.textContent='💨 Tốc độ x'+n+(n===1?' (mặc định)':n<=3?' (nhanh)':n<=6?' (rất nhanh)':'⚡ (tối đa)')+'!';
      showNotif('💨 Speed x'+n);
      setTimeout(closeCheatConsole,900);
    }

  } else if(c==='time set day'){
    // Đặt thời gian thành ban ngày (timeOfDay = 0.5 = giữa trưa)
    timeOfDay=0.5;
    res.style.color='#ffdd00';
    res.textContent='☀️ Đã chuyển sang ban ngày!';
    showNotif('☀️ Ban ngày!');
    setTimeout(closeCheatConsole,800);

  } else if(c==='time set night'){
    // Đặt thời gian thành ban đêm (timeOfDay = 0.0 = nửa đêm)
    timeOfDay=0.0;
    res.style.color='#aaaaff';
    res.textContent='🌙 Đã chuyển sang ban đêm!';
    showNotif('🌙 Ban đêm!');
    setTimeout(closeCheatConsole,800);

  } else if(c.startsWith('dame ')){
    const n=parseInt(c.split(' ')[1]);
    if(isNaN(n)||n<1||n>9999){
      res.style.color='#e74c3c';
      res.textContent='❌ Cú pháp: dame <1-9999>  (ví dụ: dame 9999)';
    } else {
      // Tăng sát thương vũ khí đang dùng lên n
      if(equippedWpn){ equippedWpn.dmg=n; }
      if(equippedMelee){ equippedMelee.dmg=n; }
      if(equippedMagic){ equippedMagic.dmg=n; }
      res.style.color='#ff8844';
      res.textContent='⚔️ Sát thương đã đặt thành '+n+' DMG!';
      showNotif('⚔️ Dame → '+n);
      setTimeout(closeCheatConsole,900);
    }

  } else if(c.startsWith('mana ')){
    const n=parseInt(c.split(' ')[1]);
    if(isNaN(n)||n<1||n>9999){
      res.style.color='#e74c3c';
      res.textContent='❌ Cú pháp: mana <1-9999>  (ví dụ: mana 9999)';
    } else {
      playerMaxMana=n; playerMana=n;
      updateHUD();
      res.style.color='#44aaff';
      res.textContent='💧 Mana tối đa đã đặt thành '+n+'!';
      showNotif('💧 Mana → '+n);
      setTimeout(closeCheatConsole,900);
    }

  } else {
    res.style.color='#e74c3c';
    res.textContent='❌ Lệnh không tồn tại. Gõ "help" để xem danh sách.';
  }
}

function closeBag(){
  document.getElementById('bag-overlay').classList.remove('on');
  gameState=currentHouse?'INDOOR':'WORLD';
}
function refreshBagEquipBar(){
  const meleeEl=document.getElementById('bag-eq-melee');
  const magicEl=document.getElementById('bag-eq-magic');
  if(meleeEl) meleeEl.textContent=equippedMelee?equippedMelee.icon+' '+equippedMelee.name:'—';
if(magicEl) magicEl.textContent=equippedMagic?equippedMagic.icon+' '+equippedMagic.name:'—';
}