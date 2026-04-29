// ═══════════════════════════════════════════
// HUD & NOTIF
// ═══════════════════════════════════════════
function updateHUD(){
  document.getElementById('c-hud').textContent=coins;
  // Dual weapon display
  const meleeName = equippedMelee ? equippedMelee.name : (equippedWpn&&equippedWpn.type==='melee'?equippedWpn.name:'—');
  document.getElementById('w-hud').textContent = meleeName;
  const magicWrap = document.getElementById('magic-hud-wrap');
  const magicSpan = document.getElementById('m-hud');
  if(equippedMagic && magicSpan && magicWrap){
    magicSpan.textContent = equippedMagic.name;
    magicWrap.style.display='';
  } else if(magicWrap){
    magicWrap.style.display='none';
  }
  document.getElementById('lv-hud').textContent='Lv'+playerLevel;
  document.getElementById('hp-txt').textContent=playerHP;
  const pct=playerHP/playerMaxHP*100;
  document.getElementById('hp-fill').style.width=pct+'%';
  const hpcol=pct>50?'linear-gradient(90deg,#2ecc40,#57ff6e)':pct>25?'linear-gradient(90deg,#f39c12,#f9ca24)':'linear-gradient(90deg,#e74c3c,#ff6b6b)';
  document.getElementById('hp-fill').style.background=hpcol;
  // Mana bar
  const mpct=Math.max(0,playerMana/playerMaxMana*100);
  const mpFill=document.getElementById('mp-fill');
  if(mpFill) mpFill.style.width=mpct+'%';
  const mpTxt=document.getElementById('mp-txt');
  if(mpTxt) mpTxt.textContent=playerMana;
  // Potions
  const potEl=document.getElementById('pot-hud');
  if(potEl) potEl.textContent=potions.hp;
  const mpotEl=document.getElementById('mpot-hud');
  if(mpotEl) mpotEl.textContent=potions.mana;
}
let nTimer=null;
function showNotif(txt){
  const el=document.getElementById('notif');el.textContent=txt;el.style.opacity='1';
  clearTimeout(nTimer);nTimer=setTimeout(()=>el.style.opacity='0',2000);
}

// ═══════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════
window.addEventListener('keydown',e=>{
  if(_cheatOpen) return; // console đang mở — không truyền phím xuống game
  keys[e.key]=true;
  if(['ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();
  if(e.key==='w'||e.key==='W'||e.key==='ArrowUp'||e.key===' ')jumpPressed=true;
  if(e.key==='Escape'){
    if(gameState==='INDOOR')exitHouse();
    else if(gameState==='PUZZLE')exitPuzzleEarly();
    else if(gameState==='SHOP')closeShop();
    else if(gameState==='BAG')closeBag();
  }
  if((e.key==='e'||e.key==='E')&&gameState!=='PUZZLE'&&gameState!=='BATTLE')interact();
  if((e.key==='f'||e.key==='F')&&gameState==='WORLD'){
    // Ocean world battle trigger
    if(inOcean && !oceanBattleActive && !oceanFloorCleared){
      const oFloor=oceanChallengeFloors[oceanFloor-1];
      if(oFloor){
        P.attackAnim=32;
        spawnParticles(P.x+P.w/2,P.y+P.h/2,'#00ddff',8,2);
        oceanBattleActive=true;
        startOceanBattle(oFloor);
      }
    } else if(window._nearMon){
      P.attackAnim=32;
      spawnParticles(P.x+P.w/2,P.y+P.h/2,'#ff4400',8,3);
      showPreBattle(window._nearMon);
    }
  }
  if((e.key==='b'||e.key==='B')&&(gameState==='WORLD'||gameState==='INDOOR'))openShop();
  if((e.key==='i'||e.key==='I')&&(gameState==='WORLD'||gameState==='INDOOR'||gameState==='OCEAN'||gameState==='UNDERGROUND'))openBag();
  if((e.key==='i'||e.key==='I')&&gameState==='BAG')closeBag();
  if((e.key==='t'||e.key==='T')&&!_cheatOpen&&gameState!=='BATTLE'&&gameState!=='PUZZLE'){
    // Chỉ mở console khi đã đăng nhập (login-screen đã ẩn)
    if(document.getElementById('login-screen').classList.contains('off')){
      e.preventDefault();openCheatConsole();
    }
  }
  if(e.key==='Escape'&&_cheatOpen){e.stopPropagation();closeCheatConsole();}
});
window.addEventListener('keyup',e=>keys[e.key]=false);


// ═══════════════════════════════════════════
// CAVE SYSTEM — 3 Chapters × 10 Levels
// ═══════════════════════════════════════════
const CHAPTERS=[
  {
    id:'grassland',name:'Vùng Đồng Cỏ',icon:'🌿',color:'#4caf50',
    desc:'Khám phá thiên nhiên mặt đất: cây cối, động vật và các hiện tượng tự nhiên!',
    bg:'linear-gradient(135deg,#001a00 0%,#002800 50%,#001200 100%)',
    questions:{
      easy:[
        {type:'mcq',q:'🌱 Cây cần gì để lớn?',opts:['Đá','Nước và ánh sáng','Cát','Muối'],ans:1},
        {type:'mcq',q:'🍂 Mùa nào lá cây hay rụng?',opts:['Xuân','Hạ','Thu','Đông'],ans:2},
        {type:'mcq',q:'🐝 Con ong làm ra thứ gì ngọt?',opts:['Sữa','Mật ong','Nước','Đường'],ans:1},
        {type:'mcq',q:'🌻 Hoa hướng dương luôn quay về hướng nào?',opts:['Bắc','Nam','Mặt trời','Mặt trăng'],ans:2},
        {type:'mcq',q:'🐛 Con sâu lớn lên biến thành con gì?',opts:['Ruồi','Muỗi','Bướm','Ong'],ans:2},
        {type:'mcq',q:'🌳 Phần nào của cây hút nước từ đất?',opts:['Lá','Hoa','Rễ','Thân'],ans:2},
        {type:'mcq',q:'🦔 Con nhím có bao nhiêu chân?',opts:['2','4','6','8'],ans:1},
        {type:'mcq',q:'🌾 Cây lúa trồng ở đâu?',opts:['Trên núi','Dưới nước biển','Ruộng nước','Sa mạc'],ans:2},
        {type:'mcq',q:'🐞 Con bọ rùa có màu gì?',opts:['Xanh','Vàng','Đỏ đốm đen','Trắng'],ans:2},
        {type:'mcq',q:'🌿 Lá cây có màu xanh nhờ chất gì?',opts:['Nước','Diệp lục','Đất','Khí trời'],ans:1},
        {type:'mcq',q:'🦋 Con bướm uống gì từ hoa?',opts:['Nước','Mật hoa','Sữa','Nhựa cây'],ans:1},
        {type:'mcq',q:'🌵 Cây xương rồng sống ở đâu?',opts:['Dưới nước','Sa mạc khô','Rừng mưa','Tuyết'],ans:1},
        {type:'mcq',q:'🐘 Con voi uống nước bằng gì?',opts:['Miệng thẳng','Vòi','Chân','Tai'],ans:1},
        {type:'mcq',q:'🐸 Con ếch sống ở đâu?',opts:['Trên cây cao','Dưới nước và trên cạn','Sa mạc','Tuyết giá'],ans:1},
        {type:'mcq',q:'🌺 Hoa dùng màu sắc và mùi thơm để làm gì?',opts:['Xua đuổi côn trùng','Thu hút ong bướm thụ phấn','Hút nước','Tạo bóng mát'],ans:1},
        {type:'mcq',q:'🐦 Chim dùng cái gì để bay?',opts:['Chân','Đuôi','Cánh','Mỏ'],ans:2},
        {type:'mcq',q:'🍃 Quá trình cây nhả khí oxy gọi là?',opts:['Hô hấp','Quang hợp','Tiêu hóa','Bay hơi'],ans:1},
        {type:'mcq',q:'🐍 Con rắn di chuyển bằng cách nào?',opts:['Nhảy','Bò bằng bụng','Chạy bốn chân','Bay'],ans:1},
        {type:'mcq',q:'🌰 Hạt dẻ rơi từ cây nào?',opts:['Cây thông','Cây dẻ','Cây chuối','Cây dừa'],ans:1},
        {type:'mcq',q:'🐇 Con thỏ ăn gì chủ yếu?',opts:['Thịt','Cá','Cỏ và rau củ','Côn trùng'],ans:2},
        {type:'mcq',q:'🌿 Thực vật nào không cần đất để sống?',opts:['Lúa','Rêu','Bèo nước','Cải'],ans:2},
        {type:'mcq',q:'🦎 Con thằn lằn thuộc loài nào?',opts:['Thú','Bò sát','Chim','Lưỡng cư'],ans:1},
        {type:'mcq',q:'🐜 Con kiến sống thành đàn hay đơn lẻ?',opts:['Đơn lẻ','Đàn đông','Từng đôi','Nhóm 3'],ans:1},
        {type:'mcq',q:'🌱 Phần nào của cây tiếp xúc với ánh sáng nhiều nhất?',opts:['Rễ','Thân','Lá','Hoa'],ans:2},
        {type:'mcq',q:'🐓 Con gà trống kêu như thế nào?',opts:['Meo meo','Gáy ò ó o','Ủn ỉn','Cạp cạp'],ans:1},
        {type:'mcq',q:'🍄 Nấm thuộc nhóm sinh vật nào?',opts:['Thực vật','Động vật','Nấm (không phải cây)','Vi khuẩn'],ans:2},
        {type:'mcq',q:'🌾 Cây lúa cho ra sản phẩm gì?',opts:['Bột mì','Gạo','Ngô','Khoai'],ans:1},
        {type:'mcq',q:'🐊 Con cá sấu là động vật máu nóng hay lạnh?',opts:['Nóng','Lạnh (biến nhiệt)','Tùy nhiệt độ','Không có máu'],ans:1},
        {type:'imgpick',q:'Con vật nào sống trên mặt đất?',opts:[{icon:'🐘',l:'Voi'},{icon:'🐬',l:'Cá heo'},{icon:'🦅',l:'Đại bàng'},{icon:'🐠',l:'Cá vàng'}],ans:0},
        {type:'imgpick',q:'Cây nào cho bóng mát to nhất?',opts:[{icon:'🌵',l:'Xương rồng'},{icon:'🌱',l:'Cỏ non'},{icon:'🌲',l:'Cây đại thụ'},{icon:'🌸',l:'Hoa anh đào'}],ans:2},
        {type:'imgpick',q:'Con vật nào ăn mật hoa?',opts:[{icon:'🦁',l:'Sư tử'},{icon:'🐝',l:'Ong mật'},{icon:'🐊',l:'Cá sấu'},{icon:'🦈',l:'Cá mập'}],ans:1},
        {type:'imgpick',q:'Loài cây nào sống ở nước?',opts:[{icon:'🌵',l:'Xương rồng'},{icon:'🌲',l:'Thông'},{icon:'🪷',l:'Hoa sen'},{icon:'🌾',l:'Lúa mì'}],ans:2},
        {type:'match',q:'Nối con vật với thức ăn:',colA:['🐰 Thỏ','🐼 Gấu trúc','🦁 Sư tử','🐿 Sóc'],colB:['Thịt','Hạt dẻ','Cỏ/cà rốt','Tre'],correct:[2,3,0,1]},
        {type:'match',q:'Nối con vật với nơi sống:',colA:['🐟 Cá','🦅 Đại bàng','🐍 Rắn','🐝 Ong'],colB:['Tổ sáp','Dưới nước','Trên không','Mặt đất'],correct:[1,2,3,0]},
        {type:'match',q:'Nối bộ phận cây với chức năng:',colA:['Rễ','Lá','Hoa','Quả'],colB:['Chứa hạt','Hút nước','Quang hợp','Thu hút thụ phấn'],correct:[1,2,3,0]},
        {type:'wordfill',sent:'Cây quang hợp dùng [?] mặt trời để tạo ra [?] và oxy.',blanks:['ánh sáng','đường'],bank:['ánh sáng','gió','đường','nước','đất']},
        {type:'wordfill',sent:'Con bướm bắt đầu từ [?] rồi thành sâu, rồi [?], rồi bướm.',blanks:['trứng','nhộng'],bank:['trứng','cánh','nhộng','tổ','hoa']},
        {type:'sort',q:'Sắp xếp vòng đời của bướm:',items:['Bướm trưởng thành','Trứng','Nhộng','Sâu bướm'],correct:['Trứng','Sâu bướm','Nhộng','Bướm trưởng thành']},
        {type:'truefalse',q:'🌿 Quang hợp giúp cây tạo ra oxy và glucose',ans:true},
        {type:'truefalse',q:'🦁 Sư tử là động vật ăn cỏ',ans:false,explain:'Sư tử là động vật ăn thịt'},
        {type:'numpad',q:'🐾 Mèo có bao nhiêu chân? (4)',ans:4},
        {type:'wordorder',q:'Sắp xếp chuỗi thức ăn:',words:['→','Cỏ','Thỏ','Cáo'],correct:'Cỏ → Thỏ → Cáo'},
        {type:'sort',q:'Sắp xếp chuỗi thức ăn đồng cỏ:',items:['Hổ','Cỏ','Hươu','Thỏ'],correct:['Cỏ','Thỏ','Hươu','Hổ']},
      ],
      hard:[
        {type:'mcq',q:'🌍 Quá trình nước bốc hơi rồi thành mây rồi mưa gọi là?',opts:['Quang hợp','Vòng tuần hoàn nước','Thụ phấn','Quang dưỡng'],ans:1},
        {type:'mcq',q:'🌱 Rễ cây có chức năng gì NGOÀI hút nước?',opts:['Quang hợp','Tạo hoa','Giữ cây vào đất','Tạo quả'],ans:2},
        {type:'mcq',q:'🌸 Hoa cần con vật nào giúp thụ phấn?',opts:['Chim ưng','Cá sấu','Ong bướm','Rắn'],ans:2},
        {type:'mcq',q:'🐜 Kiến sống thành?',opts:['Đàn','Tổ đơn','Từng con riêng lẻ','Gia đình 4 con'],ans:0},
        {type:'mcq',q:'🌿 Thực vật tự tạo thức ăn qua quá trình nào?',opts:['Hô hấp','Quang hợp','Tiêu hóa','Sinh sản'],ans:1},
        {type:'mcq',q:'🌲 Cây thông thuộc loại cây gì (lá không rụng theo mùa)?',opts:['Cây lá rộng','Cây lá kim thường xanh','Cây leo','Cây cỏ'],ans:1},
        {type:'mcq',q:'🧬 Chất nào trong lá cây hấp thụ ánh sáng mặt trời?',opts:['Cellulose','Diệp lục (Chlorophyll)','Glucose','Tinh bột'],ans:1},
        {type:'mcq',q:'🌾 Lúa mì và lúa gạo đều thuộc họ thực vật nào?',opts:['Họ đậu','Họ hòa thảo','Họ hoa hồng','Họ cải'],ans:1},
        {type:'mcq',q:'🦋 Hiện tượng sâu biến thành bướm gọi là?',opts:['Sinh sản','Biến thái','Quang hợp','Thụ phấn'],ans:1},
        {type:'mcq',q:'🌳 Vòng tròn trên thân cây (vân gỗ) cho biết điều gì?',opts:['Loài cây','Tuổi cây','Chiều cao','Màu lá'],ans:1},
        {type:'match',q:'Nối cây với loại lá:',colA:['Cây thông','Cây dừa','Cây sen','Cây tre'],colB:['Lá hình quạt','Lá kim dài','Lá tròn nổi nước','Lá dài nhỏ'],correct:[1,0,2,3]},
        {type:'match',q:'Nối động vật với loại máu:',colA:['Ếch','Rắn','Chó','Chim'],colB:['Máu nóng (đồng nhiệt)','Máu lạnh','Máu lạnh','Máu nóng (đồng nhiệt)'],correct:[1,2,0,3]},
        {type:'wordfill',sent:'Ong cái chúa đẻ [?], ong thợ đi thu [?] về làm mật.',blanks:['trứng','phấn hoa'],bank:['trứng','mật','phấn hoa','nhựa','sữa']},
        {type:'sort',q:'Sắp xếp chuỗi thức ăn đúng:',items:['Sư tử','Cỏ','Ngựa vằn','Châu chấu'],correct:['Cỏ','Châu chấu','Ngựa vằn','Sư tử']},
        {type:'sort',q:'Sắp xếp từ nhỏ đến lớn:',items:['Vi khuẩn','Tế bào','Cơ thể','Mô/cơ quan'],correct:['Vi khuẩn','Tế bào','Mô/cơ quan','Cơ thể']},
      ],
    }
  },
  {
    id:'ocean',name:'Đại Dương',icon:'🌊',color:'#2196f3',
    desc:'Lặn sâu khám phá đại dương: sinh vật biển, hệ sinh thái và hiện tượng kỳ diệu!',
    bg:'linear-gradient(135deg,#000a1a 0%,#001525 50%,#000510 100%)',
    questions:{
      easy:[
        {type:'mcq',q:'🐠 Con cá thở bằng gì?',opts:['Phổi','Mang','Miệng','Da'],ans:1},
        {type:'mcq',q:'🦑 Con mực có bao nhiêu xúc tu?',opts:['6','8','10','12'],ans:2},
        {type:'mcq',q:'🌊 Sóng biển do đâu tạo ra?',opts:['Cá to bơi','Gió','Mặt trăng','Núi lửa'],ans:1},
        {type:'mcq',q:'🐚 Vỏ ốc có hình dạng gì đặc trưng?',opts:['Vuông','Tam giác','Xoắn ốc','Tròn dẹt'],ans:2},
        {type:'mcq',q:'🦀 Cua bơi bằng cách nào?',opts:['Vẫy đuôi','Dùng càng','Bơi nghiêng bằng chân','Bay'],ans:2},
        {type:'mcq',q:'🐬 Cá heo thuộc loài gì?',opts:['Cá','Thú có vú','Bò sát','Lưỡng cư'],ans:1},
        {type:'mcq',q:'🌊 Thủy triều lên xuống do ảnh hưởng của?',opts:['Mặt trời','Gió','Mặt trăng','Cá voi'],ans:2},
        {type:'mcq',q:'🐙 Con bạch tuộc có bao nhiêu tay?',opts:['6','8','10','4'],ans:1},
        {type:'mcq',q:'🦭 Hải cẩu ăn gì?',opts:['Rong biển','Cá','Sứa','Tôm'],ans:1},
        {type:'mcq',q:'🐡 Cá nào có thể phồng to khi bị nguy hiểm?',opts:['Cá ngựa','Cá mú','Cá nóc','Cá voi'],ans:2},
        {type:'mcq',q:'🦈 Cá mập thở bằng gì?',opts:['Phổi','Mang','Da','Mũi'],ans:1},
        {type:'mcq',q:'🌊 Nước biển có vị gì?',opts:['Ngọt','Đắng','Mặn','Chua'],ans:2},
        {type:'mcq',q:'🐢 Rùa biển đẻ trứng ở đâu?',opts:['Dưới nước','Trên bãi cát','Trên đá','Dưới lòng biển'],ans:1},
        {type:'mcq',q:'🦞 Con tôm hùm có màu gì khi còn sống?',opts:['Đỏ','Xanh đen','Vàng','Trắng'],ans:1},
        {type:'mcq',q:'🌿 Rong biển là loại thực vật hay động vật?',opts:['Động vật','Thực vật biển','Nấm','Vi khuẩn'],ans:1},
        {type:'mcq',q:'🐋 Cá voi khổng lồ ăn gì chủ yếu?',opts:['Cá mập','Tôm cá lớn','Sinh vật phù du nhỏ','Rong biển'],ans:2},
        {type:'mcq',q:'🦀 Con cua lột xác để làm gì?',opts:['Sạch vỏ','Tăng trưởng lớn hơn','Thay màu','Bơi nhanh hơn'],ans:1},
        {type:'mcq',q:'🐠 Cá hề sống cộng sinh với sinh vật nào?',opts:['San hô','Hải quỳ','Cá mập','Rùa'],ans:1},
        {type:'mcq',q:'🌊 Biển chiếm bao nhiêu % diện tích Trái Đất?',opts:['30%','50%','70%','90%'],ans:2},
        {type:'mcq',q:'🐟 Cá di cư theo mùa để làm gì chủ yếu?',opts:['Tìm ấm','Đẻ trứng','Trốn kẻ thù','Tìm thức ăn mới'],ans:1},
        {type:'mcq',q:'🦑 Mực phun mực đen ra để làm gì?',opts:['Giao tiếp','Đánh dấu lãnh thổ','Trốn thoát kẻ thù','Thu hút con mồi'],ans:2},
        {type:'mcq',q:'🌊 Đại dương nào lớn nhất thế giới?',opts:['Ấn Độ Dương','Đại Tây Dương','Thái Bình Dương','Bắc Băng Dương'],ans:2},
        {type:'imgpick',q:'Con vật nào sống ở biển?',opts:[{icon:'🦒',l:'Hươu cao cổ'},{icon:'🐋',l:'Cá voi'},{icon:'🐘',l:'Voi'},{icon:'🦁',l:'Sư tử'}],ans:1},
        {type:'imgpick',q:'Sinh vật nào phát sáng dưới đáy biển?',opts:[{icon:'🐟',l:'Cá thường'},{icon:'🦑',l:'Mực phát quang'},{icon:'🐢',l:'Rùa'},{icon:'🦀',l:'Cua'}],ans:1},
        {type:'imgpick',q:'Con vật nào có vỏ cứng bên ngoài?',opts:[{icon:'🐬',l:'Cá heo'},{icon:'🦈',l:'Cá mập'},{icon:'🦀',l:'Cua'},{icon:'🐋',l:'Cá voi'}],ans:2},
        {type:'imgpick',q:'Sinh vật nào tạo nên rạn san hô?',opts:[{icon:'🐟',l:'Cá lớn'},{icon:'🪸',l:'San hô'},{icon:'🦈',l:'Cá mập'},{icon:'🌊',l:'Sóng'}],ans:1},
        {type:'match',q:'Nối sinh vật biển với đặc điểm:',colA:['🐬 Cá heo','🦈 Cá mập','🐠 Cá hề','🦀 Cua'],colB:['Sống trong hải quỳ','Có vỏ cứng','Thú thông minh','Săn mồi hung dữ'],correct:[2,3,0,1]},
        {type:'match',q:'Nối số lượng xúc tu/chân:',colA:['Bạch tuộc','Mực','Tôm hùm','Cua'],colB:['10 chân','8 tay','10 xúc tu','8 xúc tu'],correct:[3,2,0,1]},
        {type:'wordfill',sent:'Cá thở bằng [?] và bơi bằng [?].',blanks:['mang','vây'],bank:['mang','phổi','vây','chân','đuôi']},
        {type:'wordfill',sent:'Nước biển mặn vì chứa nhiều [?], chiếm khoảng [?]% diện tích Trái Đất.',blanks:['muối','70'],bank:['muối','đường','70','50','90']},
        {type:'sort',q:'Sắp xếp từ nông đến sâu:',items:['Đáy biển tối','Vùng triều','Tầng giữa','Mặt nước'],correct:['Mặt nước','Vùng triều','Tầng giữa','Đáy biển tối']},
        {type:'sort',q:'Sắp xếp chuỗi thức ăn biển từ nhỏ đến lớn:',items:['Cá mập','Tôm','Phù du','Cá thu'],correct:['Phù du','Tôm','Cá thu','Cá mập']},
      ],
      hard:[
        {type:'mcq',q:'🪸 San hô là gì?',opts:['Cây dưới nước','Đá','Tập đoàn sinh vật nhỏ','Rong biển'],ans:2},
        {type:'mcq',q:'🌊 Hiện tượng thủy triều xảy ra mấy lần/ngày?',opts:['1','2','3','4'],ans:1},
        {type:'mcq',q:'🌊 Sóng thần (tsunami) do đâu gây ra?',opts:['Gió mạnh','Động đất dưới biển','Cá voi','Núi lửa trên cạn'],ans:1},
        {type:'mcq',q:'🌡️ Nước biển sâu hơn có nhiệt độ như thế nào?',opts:['Nóng hơn','Lạnh hơn','Bằng nhau','Tùy mùa'],ans:1},
        {type:'mcq',q:'🧂 Độ mặn trung bình của nước biển là bao nhiêu?',opts:['1%','3,5%','7%','10%'],ans:1},
        {type:'mcq',q:'🌊 Vùng biển nào không có băng quanh năm?',opts:['Bắc Cực','Nam Cực','Vùng nhiệt đới','Greenland'],ans:2},
        {type:'mcq',q:'🦠 Sinh vật nào là nền tảng chuỗi thức ăn đại dương?',opts:['Cá mập','Cá voi','Phù du thực vật','San hô'],ans:2},
        {type:'match',q:'Nối hiện tượng biển với nguyên nhân:',colA:['Thủy triều','Sóng biển','Dòng chảy ấm','Bão'],colB:['Gió nhiệt đới','Hấp thu nhiệt mặt trời','Lực hút Mặt trăng','Sức gió'],correct:[2,3,1,0]},
        {type:'match',q:'Nối đại dương với đặc điểm nổi bật:',colA:['Thái Bình Dương','Ấn Độ Dương','Đại Tây Dương','Bắc Băng Dương'],colB:['Nhỏ nhất, đóng băng','Lớn nhất thế giới','Ấm nhất','Chứa dòng Gulf Stream'],correct:[1,2,3,0]},
        {type:'wordfill',sent:'Rạn san hô là [?] sinh học quan trọng, nơi sinh sống của [?] loài cá.',blanks:['hệ sinh thái','hàng nghìn'],bank:['hệ sinh thái','đảo','hàng nghìn','vài','tầng']},
        {type:'sort',q:'Sắp xếp theo kích thước từ nhỏ đến lớn:',items:['Cá voi xanh','Cá ngựa','Cá thu','Cá mập trắng'],correct:['Cá ngựa','Cá thu','Cá mập trắng','Cá voi xanh']},
        {type:'truefalse',q:'🌊 Đại dương Thái Bình Dương là lớn nhất thế giới',ans:true},
        {type:'truefalse',q:'🐬 Cá heo là loài cá',ans:false,explain:'Cá heo là động vật có vú'},
        {type:'numpad',q:'🌊 Trái Đất có bao nhiêu đại dương? (5)',ans:5},
        {type:'wordorder',q:'Sắp xếp độ sâu tăng dần:',words:['Đáy vực','Mặt biển','Tầng giữa'],correct:'Mặt biển Tầng giữa Đáy vực'},
        {type:'sort',q:'Sắp xếp độ sâu đại dương từ nông đến sâu:',items:['Vực Mariana (11km)','Vùng ánh sáng (200m)','Vùng chạng vạng (1000m)','Vùng tối (4000m)'],correct:['Vùng ánh sáng (200m)','Vùng chạng vạng (1000m)','Vùng tối (4000m)','Vực Mariana (11km)']},
      ],
    }
  },
  {
    id:'sky',name:'Bầu Trời',icon:'☁️',color:'#9c27b0',
    desc:'Bay lên khám phá bầu trời: mây, chim chóc, hiện tượng khí quyển kỳ diệu!',
    bg:'linear-gradient(135deg,#0a0015 0%,#100025 50%,#050010 100%)',
    questions:{
      easy:[
        {type:'mcq',q:'🌈 Cầu vồng có bao nhiêu màu?',opts:['5','6','7','8'],ans:2},
        {type:'mcq',q:'⛈️ Sấm sét xảy ra vào thời tiết nào?',opts:['Nắng đẹp','Mưa to','Tuyết rơi','Sương mù'],ans:1},
        {type:'mcq',q:'🌤️ Mây trắng xốp có tên là?',opts:['Mây ti','Mây tích','Mây vũ tích','Mây tầng'],ans:1},
        {type:'mcq',q:'🦅 Con chim nào bay cao nhất?',opts:['Chim sẻ','Đại bàng','Chim cánh cụt','Gà'],ans:1},
        {type:'mcq',q:'❄️ Tuyết được tạo thành từ gì?',opts:['Đường','Muối','Tinh thể nước đá','Bông'],ans:2},
        {type:'mcq',q:'🌪️ Lốc xoáy hình thành thế nào?',opts:['Gió nóng gặp gió lạnh','Mặt trời chiếu','Mưa đá','Sóng biển'],ans:0},
        {type:'mcq',q:'🌙 Mặt trăng tự phát sáng không?',opts:['Có','Không, phản chiếu ánh sáng Mặt trời','Có vào ban đêm','Không ai biết'],ans:1},
        {type:'mcq',q:'🐦 Chim cánh cụt không biết bay nhưng biết làm gì?',opts:['Leo cây','Bơi rất giỏi','Đào hang','Chạy nhanh'],ans:1},
        {type:'mcq',q:'💧 Sương mai xuất hiện vào lúc nào?',opts:['Buổi trưa','Buổi tối','Sáng sớm','Chiều tối'],ans:2},
        {type:'mcq',q:'☀️ Mặt trời cách Trái đất bao xa?',opts:['Rất gần','150 triệu km','5 km','1000 km'],ans:1},
        {type:'mcq',q:'🌬️ Gió là gì?',opts:['Hơi nước di chuyển','Không khí di chuyển','Ánh sáng di chuyển','Nhiệt độ thay đổi'],ans:1},
        {type:'mcq',q:'🌧️ Mưa hình thành từ đâu?',opts:['Từ biển','Từ mây','Từ núi','Từ đất'],ans:1},
        {type:'mcq',q:'⭐ Ban đêm nhìn thấy ngôi sao vì sao?',opts:['Ngôi sao phát sáng','Mặt trăng chiếu vào','Mắt nhạy hơn','Không có mây'],ans:0},
        {type:'mcq',q:'🌤️ Bầu trời màu xanh vì lý do gì?',opts:['Biển phản chiếu','Ánh sáng xanh tán xạ nhiều nhất','Khói màu xanh','Không khí màu xanh'],ans:1},
        {type:'mcq',q:'🌨️ Mưa đá (hail) được tạo ra như thế nào?',opts:['Tuyết rơi','Nước đóng băng trong mây giông','Đá từ núi','Cát đóng thành'],ans:1},
        {type:'mcq',q:'🕊️ Chim di cư về phía nào khi trời lạnh?',opts:['Bắc','Nam (ấm hơn)','Đông','Tây'],ans:1},
        {type:'mcq',q:'🌫️ Sương mù là gì?',opts:['Khói','Mây sát mặt đất','Hơi biển','Bụi mịn'],ans:1},
        {type:'mcq',q:'🌡️ Đơn vị đo nhiệt độ thường dùng ở Việt Nam là?',opts:['Fahrenheit','Kelvin','Celsius','Newton'],ans:2},
        {type:'mcq',q:'🌞 Năng lượng Mặt trời đến Trái Đất dưới dạng?',opts:['Điện','Ánh sáng và nhiệt','Âm thanh','Từ trường'],ans:1},
        {type:'mcq',q:'⚡ Sét đánh thường xảy ra trong thời tiết nào?',opts:['Tuyết rơi','Nắng hanh','Giông bão','Sương mù'],ans:2},
        {type:'mcq',q:'🐦 Chim dùng gì để định hướng khi di cư?',opts:['Ánh sáng ban ngày','Từ trường Trái Đất và các vì sao','GPS','Tiếng động'],ans:1},
        {type:'mcq',q:'🌈 Màu nào xuất hiện ở trên cùng của cầu vồng?',opts:['Tím','Xanh lam','Xanh lá','Đỏ'],ans:3},
        {type:'imgpick',q:'Hiện tượng nào xảy ra trên bầu trời?',opts:[{icon:'🌈',l:'Cầu vồng'},{icon:'🌋',l:'Núi lửa'},{icon:'🌊',l:'Sóng biển'},{icon:'🌱',l:'Cây mọc'}],ans:0},
        {type:'imgpick',q:'Con chim nào di cư theo mùa?',opts:[{icon:'🐧',l:'Chim cánh cụt'},{icon:'🦢',l:'Thiên nga'},{icon:'🐓',l:'Gà trống'},{icon:'🦜',l:'Vẹt'}],ans:1},
        {type:'imgpick',q:'Loại mây nào thường báo mưa to?',opts:[{icon:'☁️',l:'Mây trắng xốp'},{icon:'🌧️',l:'Mây đen vũ tích'},{icon:'🌤️',l:'Mây mỏng'},{icon:'⛅',l:'Mây ít'}],ans:1},
        {type:'imgpick',q:'Hiện tượng nào tạo ra ánh sáng?',opts:[{icon:'🌙',l:'Mặt trăng'},{icon:'⚡',l:'Sét'},{icon:'🌧️',l:'Mưa'},{icon:'🌫️',l:'Sương'}],ans:1},
        {type:'match',q:'Nối hiện tượng với mô tả:',colA:['🌈 Cầu vồng','⚡ Sét','❄️ Tuyết','🌪️ Lốc'],colB:['Gió xoáy mạnh','7 màu sắc','Điện khí quyển','Tinh thể băng'],correct:[1,2,3,0]},
        {type:'match',q:'Nối loài chim với đặc điểm:',colA:['🦅 Đại bàng','🐧 Cánh cụt','🦜 Vẹt','🦚 Công'],colB:['Đuôi xòe sặc sỡ','Bay cao săn mồi','Bơi giỏi không bay','Nói được tiếng người'],correct:[1,2,3,0]},
        {type:'wordfill',sent:'Cầu vồng xuất hiện sau [?] khi có [?] chiếu qua.',blanks:['mưa','ánh sáng'],bank:['mưa','gió','ánh sáng','mây','bão']},
        {type:'wordfill',sent:'Gió hình thành do sự chênh lệch [?] giữa hai vùng, không khí chảy từ nơi [?] sang nơi thấp.',blanks:['áp suất','cao'],bank:['áp suất','nhiệt độ','cao','nóng','thấp']},
        {type:'sort',q:'Sắp xếp các lớp khí quyển từ thấp lên cao:',items:['Tầng ion','Tầng đối lưu','Tầng bình lưu'],correct:['Tầng đối lưu','Tầng bình lưu','Tầng ion']},
        {type:'truefalse',q:'☀️ Mặt Trời là một ngôi sao',ans:true},
        {type:'truefalse',q:'🌙 Mặt Trăng tự phát sáng',ans:false,explain:'Mặt Trăng phản chiếu ánh sáng Mặt Trời'},
        {type:'numpad',q:'🪐 Hệ Mặt Trời có bao nhiêu hành tinh? (8)',ans:8},
        {type:'wordorder',q:'Sắp xếp từ gần đến xa Mặt Trời:',words:['Trái Đất','Sao Kim','Sao Hỏa'],correct:'Sao Kim Trái Đất Sao Hỏa'},
        {type:'sort',q:'Sắp xếp chu trình nước đúng thứ tự:',items:['Mây tạo thành','Hơi nước bay lên','Mưa rơi','Nước bốc hơi'],correct:['Nước bốc hơi','Hơi nước bay lên','Mây tạo thành','Mưa rơi']},
      ],
      hard:[
        {type:'mcq',q:'🌪️ Cấp độ bão được đo bằng thang nào?',opts:['Thang Richter','Thang Beaufort','Thang Celsius','Thang Newton'],ans:1},
        {type:'mcq',q:'☁️ Mây hình thành khi nào?',opts:['Hơi nước gặp lạnh ngưng tụ','Gió thổi mạnh','Mặt trời chiếu xuống nước','Tuyết tan'],ans:0},
        {type:'mcq',q:'🌞 Hiện tượng ngày dài hơn đêm xảy ra vào mùa nào ở bán cầu Bắc?',opts:['Đông','Thu','Hè','Xuân'],ans:2},
        {type:'mcq',q:'⚡ Sét đánh từ đâu xuống đâu?',opts:['Đất lên mây','Mây xuống đất','Mây sang mây','Tất cả đáp án'],ans:3},
        {type:'mcq',q:'🌍 Tầng ozone nằm ở đâu trong khí quyển?',opts:['Tầng đối lưu','Tầng bình lưu','Tầng trung lưu','Tầng ion'],ans:1},
        {type:'mcq',q:'🌡️ Nhiệt độ giảm trung bình bao nhiêu khi lên cao 1000m?',opts:['1°C','6.5°C','10°C','0.5°C'],ans:1},
        {type:'mcq',q:'🌪️ Bão nhiệt đới ở Tây Thái Bình Dương gọi là?',opts:['Hurricane','Cyclone','Typhoon (Bão)','Tornado'],ans:2},
        {type:'match',q:'Nối loại mây với đặc điểm:',colA:['Mây ti','Mây tích','Mây vũ tích','Mây tầng'],colB:['Mây xám trải rộng','Mây gây bão lớn','Mây trắng xốp','Mây cao mỏng trắng'],correct:[3,2,1,0]},
        {type:'match',q:'Nối hiện tượng với nguyên nhân:',colA:['Cầu vồng','Sương mai','Nhật thực','Nguyệt thực'],colB:['Trái Đất che Mặt trăng','Mặt trăng che Mặt trời','Tán xạ ánh sáng qua nước','Hơi nước ngưng tụ sáng sớm'],correct:[2,3,1,0]},
        {type:'wordfill',sent:'Ánh sáng Mặt trời đi qua giọt nước mưa tạo ra [?] có [?] màu.',blanks:['cầu vồng','7'],bank:['cầu vồng','sét','7','5','mây']},
        {type:'sort',q:'Sắp xếp cấp độ bão từ yếu đến mạnh:',items:['Áp thấp nhiệt đới','Siêu bão','Bão','Bão mạnh'],correct:['Áp thấp nhiệt đới','Bão','Bão mạnh','Siêu bão']},
        {type:'sort',q:'Sắp xếp nhiệt độ từ lạnh đến nóng:',items:['Bề mặt Mặt trời (5500°C)','Tuyết (0°C)','Nhiệt đới (35°C)','Lõi Trái Đất (6000°C)'],correct:['Tuyết (0°C)','Nhiệt đới (35°C)','Bề mặt Mặt trời (5500°C)','Lõi Trái Đất (6000°C)']},
      ],
    }
  },
];
// Track used question indices per chapter to avoid repeats across levels
const caveUsed = { 0:{easy:[],hard:[]}, 1:{easy:[],hard:[]}, 2:{easy:[],hard:[]} };

// Cave progress: chapIdx -> levelIdx(0-9) -> {stars, done}
const caveProgress = [
  Array.from({length:10},()=>({stars:0,done:false})),
  Array.from({length:10},()=>({stars:0,done:false})),
  Array.from({length:10},()=>({stars:0,done:false})),
];