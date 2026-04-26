function isNightTime(){
  const td=Math.sin(timeOfDay*Math.PI*2);
  return td < -0.1;
}
function _buildBlockedZones(){
  const zones = [{x1:LAKE_X1-80, x2:LAKE_X2+80}];
  if(typeof houses!=='undefined') houses.forEach(h=>zones.push({x1:h.worldX-60, x2:h.worldX+h.width+60}));
  if(typeof caveEntrance!=='undefined') zones.push({x1:caveEntrance.worldX-60, x2:caveEntrance.worldX+caveEntrance.width+60});
  if(typeof undergroundEntrance!=='undefined') zones.push({x1:undergroundEntrance.worldX-50, x2:undergroundEntrance.worldX+undergroundEntrance.width+50});
  return zones;
}
function _isBlocked(wx, zones){ return zones.some(z=>wx>z.x1 && wx<z.x2); }

const worldTrees=[0,90,160,260,310,450,600,680,800,960,1040,1200,1280,1420,1600,1750,1880,2020,2180,2350,2500,2700,2850,3000,3150,3400,3550,3750,3900,4050,4200,4350,4500,4650,4800,4950,5100,5250,5400,5600,5750,5900,6000].map(wx=>({wx}));

// Pixel rocks scattered in world
const worldRocks = [130,240,520,740,1100,1320,1570,1820,2100,2400,2640,2900,3200,3500,3780,4100,4400,4700,5000,5300,5600].map((wx,i)=>({wx, rtype:i%5, scale:0.75+((wx*7)%5)*0.12}));

// ═══════════════════════════════════════════
// PUZZLE BANK
// ═══════════════════════════════════════════
const PUZZLES={
  math:{
    1:[ // CẤP 1 — Tân Binh: Cộng trừ cơ bản trong 20
      {type:'mcq',q:'🍎 5 + 3 = ?',opts:['6','7','8','9'],ans:2},
      {type:'mcq',q:'🌟 12 - 4 = ?',opts:['6','7','8','9'],ans:2},
      {type:'mcq',q:'🍭 4 × 2 = ?',opts:['6','8','10','12'],ans:1},
      {type:'mcq',q:'🐸 3 × 3 = ?',opts:['6','7','8','9'],ans:3},
      {type:'mcq',q:'🎈 15 - 6 = ?',opts:['7','8','9','10'],ans:2},
      {type:'mcq',q:'🦋 8 + 5 = ?',opts:['11','12','13','14'],ans:2},
      {type:'imgpick',q:'Hình nào có 3 góc?',opts:[{icon:'▲',l:'Tam giác'},{icon:'⬛',l:'Hình vuông'},{icon:'⭕',l:'Hình tròn'},{icon:'⬡',l:'Lục giác'}],ans:0},
      {type:'match',q:'Nối phép tính với kết quả:',colA:['2+3','4+4','5+2','3+6'],colB:['9','8','5','7'],correct:[2,1,3,0]},
      {type:'wordfill',sent:'Số liền sau của 9 là [?]. Số liền trước của 5 là [?].',blanks:['10','4'],bank:['3','4','5','10','11']},
      {type:'sort',q:'Sắp xếp từ bé đến lớn:',items:['7','3','10','1'],correct:['1','3','7','10']},
    ],
    2:[ // CẤP 2 — Chiến Binh: Nhân chia bảng cửu chương, số đến 100
      {type:'mcq',q:'🔢 7 × 8 = ?',opts:['54','56','58','62'],ans:1},
      {type:'mcq',q:'➗ 36 ÷ 4 = ?',opts:['7','8','9','10'],ans:2},
      {type:'mcq',q:'📐 Hình chữ nhật có chiều dài 6cm, chiều rộng 4cm. Chu vi là?',opts:['24cm','20cm','22cm','18cm'],ans:1},
      {type:'mcq',q:'🔢 63 ÷ 7 = ?',opts:['7','8','9','11'],ans:2},
      {type:'mcq',q:'📊 Số nào chia hết cho cả 2 và 3?',opts:['8','10','12','14'],ans:2},
      {type:'mcq',q:'🔢 9 × 6 = ?',opts:['52','54','56','58'],ans:1},
      {type:'imgpick',q:'Hình nào có diện tích lớn nhất nếu mỗi ô vuông là 1cm²?',opts:[{icon:'▦',l:'2×2=4cm²'},{icon:'▦',l:'3×2=6cm²'},{icon:'▦',l:'4×1=4cm²'},{icon:'▦',l:'3×3=9cm²'}],ans:3},
      {type:'match',q:'Nối phép tính với kết quả đúng:',colA:['8×7','6×9','5×8','7×6'],colB:['54','40','56','42'],correct:[2,0,1,3]},
      {type:'wordfill',sent:'Một lớp có [?] học sinh. Chia thành 6 nhóm đều nhau, mỗi nhóm có [?] bạn.',blanks:['42','7'],bank:['36','42','6','7','8','48']},
      {type:'sort',q:'Sắp xếp kết quả từ nhỏ đến lớn:',items:['8×6','7×7','9×5','6×8'],correct:['9×5','8×6','6×8','7×7']},
    ],
    3:[ // CẤP 3 — Anh Hùng: Phân số, số thập phân, diện tích
      {type:'mcq',q:'📐 1/2 + 1/4 = ?',opts:['2/6','3/4','1/4','3/8'],ans:1},
      {type:'mcq',q:'🔢 0,5 × 6 = ?',opts:['2,5','3,0','3,5','4,0'],ans:1},
      {type:'mcq',q:'📊 Hình vuông cạnh 5cm có diện tích là?',opts:['10cm²','20cm²','25cm²','30cm²'],ans:2},
      {type:'mcq',q:'🔢 3/4 của 20 là?',opts:['12','15','16','18'],ans:1},
      {type:'mcq',q:'📐 Hình tròn bán kính 7cm, chu vi xấp xỉ (π≈3.14) là?',opts:['21.98cm','43.96cm','44cm','48cm'],ans:1},
      {type:'mcq',q:'🔢 2³ + 3² = ?',opts:['13','15','17','19'],ans:2},
      {type:'match',q:'Nối phân số với số thập phân tương đương:',colA:['1/2','1/4','3/4','1/5'],colB:['0.2','0.25','0.5','0.75'],correct:[2,1,3,0]},
      {type:'imgpick',q:'Hình nào có diện tích = 1/2 × đáy × chiều cao?',opts:[{icon:'▲',l:'Tam giác'},{icon:'⬛',l:'Hình vuông'},{icon:'⬡',l:'Lục giác'},{icon:'⭕',l:'Hình tròn'}],ans:0},
      {type:'wordfill',sent:'Tam giác có đáy [?]cm và chiều cao 8cm. Diện tích là [?]cm².',blanks:['10','40'],bank:['8','10','12','40','48','80']},
      {type:'sort',q:'Sắp xếp phân số từ bé đến lớn:',items:['3/4','1/2','7/8','1/4'],correct:['1/4','1/2','3/4','7/8']},
    ],
    4:[ // CẤP 4 — Huyền Thoại: Phương trình, tỉ lệ, thống kê
      {type:'mcq',q:'🔢 Tìm x: 3x + 7 = 25',opts:['x=5','x=6','x=7','x=8'],ans:1},
      {type:'mcq',q:'📊 Tỉ lệ phần trăm: 15 là bao nhiêu % của 60?',opts:['20%','25%','30%','35%'],ans:1},
      {type:'mcq',q:'📐 Khối hộp chữ nhật 4×5×6 cm có thể tích là?',opts:['60cm³','100cm³','120cm³','150cm³'],ans:2},
      {type:'mcq',q:'🔢 Tìm y: 5y - 3 = 2y + 9',opts:['y=3','y=4','y=5','y=6'],ans:1},
      {type:'mcq',q:'📊 Trung bình cộng của 4, 7, 8, 9, 12 là?',opts:['7','8','9','10'],ans:1},
      {type:'mcq',q:'🔢 Số nguyên tố nào lớn hơn 20 và nhỏ hơn 30?',opts:['21','23','25','27'],ans:1},
      {type:'match',q:'Nối bài toán với kết quả:',colA:['2⁴','3³','5²','4³'],colB:['27','25','64','16'],correct:[3,0,1,2]},
      {type:'wordfill',sent:'Xe đi 60km/h trong [?] giờ thì được [?]km.',blanks:['3','180'],bank:['2','3','4','120','180','240']},
      {type:'sort',q:'Sắp xếp từ nhỏ đến lớn:',items:['√25','2³','3²','√49'],correct:['√25','2³','3²','√49']},
      {type:'truefalse',q:'📐 Số nguyên tố là số chỉ chia hết cho 1 và chính nó',ans:true},
      {type:'truefalse',q:'🔢 0,75 = 3/5',ans:false,explain:'0,75 = 3/4'},
      {type:'numpad',q:'🧮 Tính: 2⁴ + 3² = ? (25)',ans:25},
      {type:'wordorder',q:'Sắp xếp công thức đúng:',words:['×','chiều','Diện tích','=','rộng','dài','chiều'],correct:'Diện tích = chiều dài × chiều rộng'},
      {type:'mcq',q:'🔢 Nếu a:b = 2:3 và a+b = 25, thì b bằng?',opts:['10','12','15','18'],ans:2},
    ],
    5:[ // CẤP 5 — Thần Thánh: Nâng cao, tư duy logic
      {type:'mcq',q:'🔢 Tổng 1+2+3+...+100 = ?',opts:['4950','5000','5050','5100'],ans:2},
      {type:'mcq',q:'📐 Tứ giác ABCD có AB∥CD. Góc A=110°, Góc B=70°. Góc C=?',opts:['70°','90°','110°','120°'],ans:0},
      {type:'mcq',q:'🔢 Số nào chia cho 7 dư 3 và chia cho 5 dư 1?',opts:['31','36','46','51'],ans:0},
      {type:'mcq',q:'📊 Xác suất tung đồng xu 3 lần đều ngửa là?',opts:['1/4','1/6','1/8','1/16'],ans:2},
      {type:'mcq',q:'🔢 Phương trình x² - 5x + 6 = 0 có nghiệm là?',opts:['x=1,x=6','x=2,x=3','x=−2,x=−3','x=1,x=−6'],ans:1},
      {type:'mcq',q:'📐 Hình nón có r=3cm, h=4cm. Thể tích là (π≈3.14)?',opts:['37.68cm³','56.52cm³','75.36cm³','94.2cm³'],ans:0},
      {type:'match',q:'Nối định lý với phát biểu đúng:',colA:['Pythagoras','Thales','Euclid','Viète'],colB:['Tỉ lệ cạnh tam giác đồng dạng','Tổng các số tự nhiên','a²+b²=c²','Tổng/tích nghiệm ptb2'],correct:[2,0,1,3]},
      {type:'wordfill',sent:'Trong tam giác vuông, cạnh huyền bình phương bằng [?] bình phương cộng [?] bình phương.',blanks:['cạnh góc vuông thứ nhất','cạnh góc vuông thứ hai'],bank:['cạnh huyền','cạnh góc vuông thứ nhất','cạnh góc vuông thứ hai','đường cao','trung tuyến']},
      {type:'sort',q:'Sắp xếp đúng các bước giải phương trình bậc 2:',items:['Tính nghiệm','Lập bảng xét dấu','Tính delta Δ=b²-4ac','Viết phương trình'],correct:['Viết phương trình','Tính delta Δ=b²-4ac','Lập bảng xét dấu','Tính nghiệm']},
      {type:'mcq',q:'🔢 Dãy số: 1, 1, 2, 3, 5, 8, 13, ... Số tiếp theo là?',opts:['18','19','20','21'],ans:3},
    ],
  },

  geo:{
    1:[ // CẤP 1 — Tân Binh: Địa lý cơ bản Việt Nam & thế giới
      {type:'mcq',q:'🌏 Thủ đô của Việt Nam là thành phố nào?',opts:['Huế','Đà Nẵng','Hà Nội','Hải Phòng'],ans:2},
      {type:'mcq',q:'🌊 Biển nào nằm ở phía Đông Việt Nam?',opts:['Biển Đen','Biển Đỏ','Biển Đông','Biển Bắc'],ans:2},
      {type:'mcq',q:'☀️ Buổi sáng, Mặt trời mọc ở hướng nào?',opts:['Tây','Nam','Bắc','Đông'],ans:3},
      {type:'mcq',q:'🌤️ Mùa nào có nhiều mưa nhất ở miền Nam?',opts:['Mùa xuân','Mùa khô','Mùa mưa','Mùa đông'],ans:2},
      {type:'mcq',q:'🗾 Nước Việt Nam thuộc châu lục nào?',opts:['Châu Âu','Châu Phi','Châu Á','Châu Mỹ'],ans:2},
      {type:'mcq',q:'🏔️ Dãy núi nào dài nhất Việt Nam?',opts:['Dãy Hoàng Liên Sơn','Dãy Trường Sơn','Dãy Con Voi','Dãy Ngân Sơn'],ans:1},
      {type:'imgpick',q:'Con vật nào biết bay?',opts:[{icon:'🦅',l:'Đại bàng'},{icon:'🐠',l:'Cá'},{icon:'🐢',l:'Rùa'},{icon:'🐍',l:'Rắn'}],ans:0},
      {type:'match',q:'Nối mùa với đặc điểm:',colA:['Mùa hè','Mùa đông','Mùa xuân','Mùa thu'],colB:['Lá vàng rụng','Hoa nở đẹp','Trời lạnh giá','Trời nắng nóng'],correct:[3,2,1,0]},
      {type:'wordfill',sent:'Mặt trời mọc ở phía [?] và lặn ở phía [?].',blanks:['Đông','Tây'],bank:['Đông','Tây','Nam','Bắc']},
      {type:'sort',q:'Sắp xếp các mùa trong năm:',items:['Mùa thu','Mùa xuân','Mùa đông','Mùa hè'],correct:['Mùa xuân','Mùa hè','Mùa thu','Mùa đông']},
    ],
    2:[ // CẤP 2 — Chiến Binh: Địa lý Việt Nam trung bình
      {type:'mcq',q:'🏔️ Đỉnh núi cao nhất Việt Nam là gì?',opts:['Ngọc Linh','Phanxipăng','Bạch Mã','Langbiang'],ans:1},
      {type:'mcq',q:'🌊 Sông nào dài nhất Việt Nam?',opts:['Sông Hồng','Sông Mã','Sông Mekong (Cửu Long)','Sông Đà'],ans:2},
      {type:'mcq',q:'🗺️ Việt Nam có bao nhiêu tỉnh thành?',opts:['58','60','63','65'],ans:2},
      {type:'mcq',q:'🏙️ Thành phố nào đông dân nhất Việt Nam?',opts:['Hà Nội','Đà Nẵng','Hải Phòng','TP.Hồ Chí Minh'],ans:3},
      {type:'mcq',q:'🌴 Đồng bằng nào rộng nhất Việt Nam?',opts:['Đồng bằng sông Hồng','Đồng bằng sông Cửu Long','Đồng bằng Thanh - Nghệ','Đồng bằng Duyên hải'],ans:1},
      {type:'mcq',q:'🏝️ Quần đảo nào là lớn nhất Việt Nam?',opts:['Phú Quốc','Côn Đảo','Phú Quý','Trường Sa'],ans:3},
      {type:'match',q:'Nối vùng với đặc sản:',colA:['Hà Nội','Huế','TP.HCM','Đà Lạt'],colB:['Bún bò','Phở','Cơm tấm','Rau củ quả'],correct:[1,0,2,3]},
      {type:'imgpick',q:'Đây là vùng nào của Việt Nam?',opts:[{icon:'❄️',l:'Tây Bắc (rét)'},{icon:'🌊',l:'Đồng bằng Cửu Long'},{icon:'🏖️',l:'Duyên hải miền Trung'},{icon:'🌿',l:'Tây Nguyên'}],ans:1},
      {type:'wordfill',sent:'Việt Nam nằm ở bán đảo [?], thuộc khu vực [?] Á.',blanks:['Đông Dương','Đông Nam'],bank:['Đông Dương','Indochina','Đông Nam','Đông Bắc','Nam','Trung']},
      {type:'sort',q:'Sắp xếp từ Bắc vào Nam:',items:['Đà Nẵng','Hà Nội','Cần Thơ','Huế'],correct:['Hà Nội','Huế','Đà Nẵng','Cần Thơ']},
    ],
    3:[ // CẤP 3 — Anh Hùng: Địa lý châu Á & thế giới
      {type:'mcq',q:'🗾 Thủ đô của Nhật Bản là gì?',opts:['Osaka','Seoul','Tokyo','Beijing'],ans:2},
      {type:'mcq',q:'🌏 Con sông nào dài nhất thế giới?',opts:['Amazon','Nile','Yangtze','Mississippi'],ans:1},
      {type:'mcq',q:'🏔️ Đỉnh núi nào cao nhất thế giới?',opts:['K2','Everest','Kangchenjunga','Lhotse'],ans:1},
      {type:'mcq',q:'🌊 Đại dương nào lớn nhất thế giới?',opts:['Đại Tây Dương','Ấn Độ Dương','Thái Bình Dương','Bắc Băng Dương'],ans:2},
      {type:'mcq',q:'🗺️ Quốc gia nào có diện tích lớn nhất thế giới?',opts:['Canada','Trung Quốc','Mỹ','Nga'],ans:3},
      {type:'mcq',q:'🌍 Châu lục nào có nhiều quốc gia nhất?',opts:['Châu Á','Châu Âu','Châu Phi','Châu Mỹ'],ans:2},
      {type:'match',q:'Nối quốc gia với thủ đô:',colA:['Pháp','Nhật Bản','Úc','Brazil'],colB:['Canberra','Paris','Brasilia','Tokyo'],correct:[1,3,0,2]},
      {type:'imgpick',q:'Địa hình nào chiếm diện tích lớn nhất châu Á?',opts:[{icon:'🏔️',l:'Núi cao'},{icon:'🌾',l:'Đồng bằng'},{icon:'🏜️',l:'Sa mạc'},{icon:'🌲',l:'Rừng nhiệt đới'}],ans:1},
      {type:'wordfill',sent:'ASEAN gồm [?] quốc gia Đông Nam Á, thành lập năm [?].',blanks:['10','1967'],bank:['8','10','12','1967','1975','1995']},
      {type:'sort',q:'Sắp xếp theo diện tích từ lớn đến nhỏ:',items:['Nhật Bản','Trung Quốc','Việt Nam','Singapore'],correct:['Trung Quốc','Nhật Bản','Việt Nam','Singapore']},
    ],
    4:[ // CẤP 4 — Huyền Thoại: Địa lý chuyên sâu
      {type:'mcq',q:'🌡️ Hiện tượng El Niño gây ra điều gì?',opts:['Nhiệt độ biển Thái Bình Dương hạ thấp','Nhiệt độ biển Thái Bình Dương tăng cao','Bão nhiều hơn ở Đại Tây Dương','Lũ lụt ở châu Phi'],ans:1},
      {type:'mcq',q:'🏔️ Dãy Alps nằm ở khu vực nào?',opts:['Bắc Âu','Trung Âu','Nam Âu','Đông Âu'],ans:1},
      {type:'mcq',q:'🌊 Eo biển nào nối Địa Trung Hải với Biển Đỏ?',opts:['Eo Malacca','Eo Gibraltar','Eo Suez (Kênh)','Eo Hormuz'],ans:2},
      {type:'mcq',q:'🗺️ Đường Chí tuyến Bắc đi qua quốc gia nào của Đông Nam Á?',opts:['Việt Nam','Thái Lan','Philippines','Myanmar'],ans:0},
      {type:'mcq',q:'🌍 Hoang mạc Sahara thuộc châu lục nào và là lớn nhất thế giới về diện tích nhiệt đới?',opts:['Châu Á','Châu Mỹ','Châu Phi','Châu Úc'],ans:2},
      {type:'mcq',q:'🏙️ Thành phố nào được gọi là "thành phố không bao giờ ngủ" (New York) nằm ở bang nào?',opts:['California','New York','Texas','Florida'],ans:1},
      {type:'match',q:'Nối biên giới Việt Nam với quốc gia:',colA:['Phía Bắc','Phía Tây','Phía Đông & Nam','Giáp biển phía Tây Nam'],colB:['Biển Đông','Vịnh Thái Lan','Trung Quốc','Lào & Campuchia'],correct:[2,3,0,1]},
      {type:'wordfill',sent:'Đồng bằng sông Cửu Long được tạo thành bởi phù sa sông [?], có [?] nhánh đổ ra biển.',blanks:['Mekong','9'],bank:['Hồng','Mekong','7','9','12','Cửu Long']},
      {type:'sort',q:'Sắp xếp đúng các đới khí hậu từ xích đạo ra cực:',items:['Ôn đới','Cận nhiệt đới','Cực đới','Nhiệt đới'],correct:['Nhiệt đới','Cận nhiệt đới','Ôn đới','Cực đới']},
      {type:'mcq',q:'🌐 Kinh tuyến gốc (0°) đi qua thành phố nào của Anh?',opts:['London (Greenwich)','Manchester','Edinburgh','Birmingham'],ans:0},
    ],
    5:[ // CẤP 5 — Thần Thánh: Địa lý chuyên gia
      {type:'mcq',q:'🌋 Vành đai lửa Thái Bình Dương có khoảng bao nhiêu núi lửa hoạt động?',opts:['250','350','450','550'],ans:2},
      {type:'mcq',q:'🌊 Độ sâu lớn nhất của Vực Mariana (Challenger Deep) là khoảng?',opts:['8.800m','9.500m','11.000m','12.500m'],ans:2},
      {type:'mcq',q:'🗺️ Thuyết kiến tạo mảng cho rằng Trái Đất có bao nhiêu mảng kiến tạo lớn?',opts:['5','7','9','12'],ans:1},
      {type:'mcq',q:'🌍 Quốc gia nào có mật độ dân số cao nhất thế giới (không tính các vùng lãnh thổ nhỏ)?',opts:['Bangladesh','Hà Lan','Hàn Quốc','Ấn Độ'],ans:0},
      {type:'mcq',q:'🌡️ Nhiệt độ nóng nhất từng ghi nhận trên Trái Đất là ở đâu?',opts:['Sahara, Algeria','Death Valley, Mỹ','Kuwait','Lybya'],ans:1},
      {type:'mcq',q:'🏔️ Đỉnh núi Everest thuộc biên giới hai nước nào?',opts:['Trung Quốc và Ấn Độ','Nepal và Ấn Độ','Nepal và Trung Quốc (Tibet)','Bhutan và Trung Quốc'],ans:2},
      {type:'match',q:'Nối dòng hải lưu nổi tiếng với khu vực:',colA:['Gulf Stream','Kuroshio','Benguela','Humboldt'],colB:['Bờ Tây Nam Mỹ','Bờ Tây châu Phi','Bắc Đại Tây Dương','Tây Thái Bình Dương'],correct:[2,3,1,0]},
      {type:'wordfill',sent:'Đường IDL (Đường đổi ngày quốc tế) nằm ở kinh tuyến [?]° và đi qua [?] Thái Bình Dương.',blanks:['180','giữa'],bank:['90','180','0','giữa','bờ đông','bờ tây']},
      {type:'sort',q:'Sắp xếp đúng thứ tự từ trong ra ngoài của Trái Đất:',items:['Lớp phủ','Nhân trong','Vỏ Trái Đất','Nhân ngoài'],correct:['Nhân trong','Nhân ngoài','Lớp phủ','Vỏ Trái Đất']},
      {type:'mcq',q:'🌐 Múi giờ của Việt Nam (UTC+7) có tên tiêu chuẩn là gì?',opts:['ICT (Indochina Time)','VST (Vietnam Standard)','SEA Time','Bangkok Time'],ans:0},
    ],
  },
  history:{
    1:[ // CẤP 1 — Tân Binh (lịch sử cơ bản)
      {type:'mcq',q:'🇻🇳 Thủ đô của Việt Nam là thành phố nào?',opts:['Hồ Chí Minh','Đà Nẵng','Hà Nội','Huế'],ans:2},
      {type:'mcq',q:'👴 Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập vào ngày nào?',opts:['1/1/1945','2/9/1945','30/4/1975','19/8/1945'],ans:1},
      {type:'mcq',q:'🏯 Kinh đô cuối cùng của nhà Nguyễn đặt ở đâu?',opts:['Hà Nội','Hội An','Huế','Đà Lạt'],ans:2},
      {type:'mcq',q:'⚔️ Hai Bà Trưng khởi nghĩa chống lại quân xâm lược nào?',opts:['Quân Pháp','Quân Mỹ','Quân Hán','Quân Minh'],ans:2},
      {type:'mcq',q:'🗺️ Chiến thắng Điện Biên Phủ diễn ra năm nào?',opts:['1945','1954','1968','1975'],ans:1},
      {type:'mcq',q:'🌟 Ngày 30/4/1975 là ngày gì?',opts:['Quốc khánh','Giải phóng miền Nam','Cách mạng tháng Tám','Chiến thắng Điện Biên Phủ'],ans:1},
      {type:'imgpick',q:'Ai là vị anh hùng đã ba lần đánh thắng quân Mông Nguyên?',opts:[{icon:'⚔️',l:'Trần Hưng Đạo'},{icon:'🏹',l:'Lê Lợi'},{icon:'🐘',l:'Bà Triệu'},{icon:'🛡️',l:'Ngô Quyền'}],ans:0},
      {type:'imgpick',q:'Trận Bạch Đằng năm 938 do ai lãnh đạo đánh tan quân Nam Hán?',opts:[{icon:'🌊',l:'Ngô Quyền'},{icon:'⚔️',l:'Đinh Bộ Lĩnh'},{icon:'🏹',l:'Lý Thái Tổ'},{icon:'🛡️',l:'Trần Thái Tông'}],ans:0},
      {type:'match',q:'Nối sự kiện với năm xảy ra:',colA:['Cách mạng tháng Tám','Chiến thắng ĐBP','Giải phóng miền Nam','Tuyên ngôn Độc lập'],colB:['1975','1945 (8)','1954','1945 (9/2)'],correct:[1,3,2,0]},
      {type:'sort',q:'Sắp xếp các triều đại theo thứ tự xuất hiện:',items:['Nhà Nguyễn','Nhà Lý','Nhà Trần','Nhà Đinh'],correct:['Nhà Đinh','Nhà Lý','Nhà Trần','Nhà Nguyễn']},
    ],
    2:[ // CẤP 2 — Chiến Binh
      {type:'mcq',q:'🏹 Lê Lợi khởi nghĩa Lam Sơn chống lại quân xâm lược nào?',opts:['Quân Thanh','Quân Minh','Quân Tống','Quân Nguyên'],ans:1},
      {type:'mcq',q:'⚔️ Trận Đống Đa năm 1789 do ai chỉ huy đánh tan 29 vạn quân Thanh?',opts:['Gia Long','Nguyễn Ánh','Quang Trung','Nguyễn Huệ Đế'],ans:2},
      {type:'mcq',q:'🌊 Chiến thắng Bạch Đằng năm 1288 diễn ra dưới triều đại nào?',opts:['Nhà Lý','Nhà Đinh','Nhà Lê','Nhà Trần'],ans:3},
      {type:'mcq',q:'📜 Ai là người soạn "Hịch tướng sĩ" nổi tiếng trong lịch sử Việt Nam?',opts:['Nguyễn Trãi','Lý Thường Kiệt','Trần Hưng Đạo','Lê Lợi'],ans:2},
      {type:'mcq',q:'🗺️ "Nam quốc sơn hà" được xem là bản Tuyên ngôn Độc lập đầu tiên, do ai viết?',opts:['Trần Quốc Tuấn','Lý Thường Kiệt','Nguyễn Trãi','Lê Lợi'],ans:1},
      {type:'mcq',q:'🏯 Ai là người lập ra nhà Nguyễn (1802)?',opts:['Minh Mạng','Tự Đức','Gia Long','Thiệu Trị'],ans:2},
      {type:'match',q:'Nối vị anh hùng với chiến công:',colA:['Ngô Quyền','Trần Hưng Đạo','Lê Lợi','Quang Trung'],colB:['Đánh Thanh 1789','Bạch Đằng 938','Chống Mông Nguyên','Đánh đuổi quân Minh'],correct:[1,2,3,0]},
      {type:'match',q:'Nối triều đại với kinh đô:',colA:['Nhà Lý','Nhà Trần','Nhà Hồ','Nhà Nguyễn'],colB:['Huế','Tây Đô (Thanh Hóa)','Thăng Long','Thiên Trường'],correct:[2,3,1,0]},
      {type:'wordfill',sent:'Năm [?], Ngô Quyền đánh tan quân [?] trên sông Bạch Đằng.',blanks:['938','Nam Hán'],bank:['938','979','Nam Hán','Tống','Nguyên','1288']},
      {type:'sort',q:'Sắp xếp đúng thứ tự các cuộc kháng chiến:',items:['Kháng chiến chống Mỹ','Trận Bạch Đằng 938','Kháng chiến chống Minh','Kháng chiến chống Mông Nguyên'],correct:['Trận Bạch Đằng 938','Kháng chiến chống Mông Nguyên','Kháng chiến chống Minh','Kháng chiến chống Mỹ']},
      {type:'truefalse',q:'⚔️ Chiến thắng Điện Biên Phủ năm 1954 kết thúc chiến tranh với Pháp',ans:true},
      {type:'truefalse',q:'🏛️ Nhà Nguyễn là triều đại phong kiến đầu tiên của Việt Nam',ans:false,explain:'Nhà Ngô (939) mới là triều đại độc lập đầu tiên'},
      {type:'numpad',q:'📅 Bác Hồ sinh năm nào? (1890)',ans:1890},
      {type:'wordorder',q:'Sắp xếp đúng:',words:['Hồ','Chí','Bác','Minh'],correct:'Bác Hồ Chí Minh'},
    ],
    3:[ // CẤP 3 — Anh Hùng
      {type:'mcq',q:'📜 "Bình Ngô Đại Cáo" được Nguyễn Trãi viết vào năm nào?',opts:['1407','1418','1428','1471'],ans:2},
      {type:'mcq',q:'🏹 Khởi nghĩa Yên Thế (1884-1913) do ai lãnh đạo?',opts:['Phan Bội Châu','Hoàng Hoa Thám','Phan Chu Trinh','Nguyễn Thái Học'],ans:1},
      {type:'mcq',q:'⚔️ Phong trào Cần Vương (1885) do vua nào phát động?',opts:['Vua Hàm Nghi','Vua Tự Đức','Vua Đồng Khánh','Vua Duy Tân'],ans:0},
      {type:'mcq',q:'🌟 Đảng Cộng sản Việt Nam thành lập ngày 3/2 năm nào?',opts:['1925','1930','1941','1945'],ans:1},
      {type:'mcq',q:'🗺️ Hiệp định Geneva (1954) chia đôi Việt Nam theo vĩ tuyến nào?',opts:['13','16','17','20'],ans:2},
      {type:'mcq',q:'🏰 Nhà Lý dời đô từ Hoa Lư về Thăng Long năm nào?',opts:['968','1009','1010','1054'],ans:2},
      {type:'imgpick',q:'Ai là nữ anh hùng cưỡi voi đánh giặc nổi tiếng thế kỷ III?',opts:[{icon:'🐘',l:'Bà Triệu'},{icon:'🏹',l:'Trưng Trắc'},{icon:'⚔️',l:'Trưng Nhị'},{icon:'🛡️',l:'Võ Thị Sáu'}],ans:0},
      {type:'match',q:'Nối phong trào với lãnh tụ:',colA:['Yên Thế','Đông Du','Duy Tân','VNQDĐ'],colB:['Nguyễn Thái Học','Hoàng Hoa Thám','Phan Chu Trinh','Phan Bội Châu'],correct:[1,3,2,0]},
      {type:'wordfill',sent:'Chiến dịch [?] (1953-1954) kết thúc bằng chiến thắng [?] lịch sử.',blanks:['Đông Xuân','Điện Biên Phủ'],bank:['Đông Xuân','Hồ Chí Minh','Điện Biên Phủ','Huế','Biên giới']},
      {type:'sort',q:'Sắp xếp theo thứ tự lịch sử:',items:['Thành lập Đảng CSVN','Cách mạng tháng Tám','Hiệp định Paris','Hiệp định Geneva'],correct:['Thành lập Đảng CSVN','Cách mạng tháng Tám','Hiệp định Geneva','Hiệp định Paris']},
    ],
    4:[ // CẤP 4 — Huyền Thoại
      {type:'mcq',q:'📜 Ai là tác giả của "Đại Việt Sử Ký Toàn Thư"?',opts:['Lê Văn Hưu','Ngô Sĩ Liên','Nguyễn Trãi','Lê Quý Đôn'],ans:1},
      {type:'mcq',q:'⚔️ Trận Như Nguyệt (1077) diễn ra trên dòng sông nào?',opts:['Sông Hồng','Sông Lam','Sông Cầu (Như Nguyệt)','Sông Bạch Đằng'],ans:2},
      {type:'mcq',q:'🏯 Vua nào nhà Lý cho xây Văn Miếu Quốc Tử Giám đầu tiên?',opts:['Lý Thái Tổ','Lý Thái Tông','Lý Thánh Tông','Lý Nhân Tông'],ans:2},
      {type:'mcq',q:'🌊 Nhà Trần dùng kế sách gì để đánh bại Mông Nguyên lần 2 (1285)?',opts:['Vườn không nhà trống','Phục kích rừng núi','Tấn công bất ngờ','Liên minh với Chiêm Thành'],ans:0},
      {type:'mcq',q:'🗺️ Hội nghị Diên Hồng (1284) là hội nghị gì?',opts:['Họp triều đình bí mật','Lấy ý kiến bô lão cả nước chống Mông Nguyên','Ký hiệp ước với Trung Quốc','Bầu chọn vua mới'],ans:1},
      {type:'mcq',q:'📚 Phong trào Đông Kinh Nghĩa Thục (1907) do ai sáng lập?',opts:['Phan Bội Châu','Lương Văn Can','Phan Chu Trinh','Huỳnh Thúc Kháng'],ans:1},
      {type:'match',q:'Nối tên gọi lịch sử với tên hiện nay:',colA:['Thăng Long','Gia Định','Thuận Hóa','Hội An (Faifo)'],colB:['Quảng Nam','Huế','Hà Nội','TP.Hồ Chí Minh'],correct:[2,3,1,0]},
      {type:'wordfill',sent:'Lý Thường Kiệt đánh phủ đầu quân [?] năm [?] trước khi họ kịp xâm lược.',blanks:['Tống','1075'],bank:['Tống','Nguyên','1075','1076','938','Minh']},
      {type:'sort',q:'Thứ tự các lần quân Mông Nguyên xâm lược Đại Việt:',items:['Lần 3 (1288)','Lần 1 (1258)','Lần 2 (1285)','Lần 4 (chưa có)'],correct:['Lần 1 (1258)','Lần 2 (1285)','Lần 3 (1288)','Lần 4 (chưa có)']},
      {type:'mcq',q:'🎯 Chiến lược "vườn không nhà trống" trong kháng chiến chống Pháp 1946 do ai đề xuất?',opts:['Hồ Chí Minh','Võ Nguyên Giáp','Trường Chinh','Phạm Văn Đồng'],ans:0},
    ],
    5:[ // CẤP 5 — Thần Thánh
      {type:'mcq',q:'📜 Văn Miếu Quốc Tử Giám xây năm 1070 và mở trường năm nào?',opts:['1070','1076','1086','1156'],ans:1},
      {type:'mcq',q:'⚔️ Ai là Thái sư đầu tiên giữ quyền nhiếp chính trong triều Trần?',opts:['Trần Thủ Độ','Trần Quốc Tuấn','Trần Ích Tắc','Trần Nhân Tông'],ans:0},
      {type:'mcq',q:'🏹 Cuộc khởi nghĩa Lam Sơn bắt đầu từ năm nào?',opts:['1407','1418','1427','1428'],ans:1},
      {type:'mcq',q:'🌟 Tên thật của vua Quang Trung là gì?',opts:['Nguyễn Huệ','Nguyễn Nhạc','Nguyễn Lữ','Nguyễn Ánh'],ans:0},
      {type:'mcq',q:'🗺️ Ai ký Hiệp ước Nhâm Tuất (1862) nhượng 3 tỉnh Nam Kỳ cho Pháp?',opts:['Vua Tự Đức','Vua Hàm Nghi','Vua Thành Thái','Vua Khải Định'],ans:0},
      {type:'mcq',q:'📚 Hội Việt Nam Cách mạng Thanh niên thành lập năm nào và do ai sáng lập?',opts:['1925 — Hồ Chí Minh','1930 — Trần Phú','1925 — Phan Bội Châu','1927 — Nguyễn Thái Học'],ans:0},
      {type:'mcq',q:'⚔️ Trận Điện Biên Phủ kéo dài bao nhiêu ngày?',opts:['45 ngày','55 ngày','65 ngày','75 ngày'],ans:1},
      {type:'match',q:'Nối vua/chúa với triều đại:',colA:['Đinh Tiên Hoàng','Lý Thái Tổ','Lê Thái Tổ','Nguyễn Ánh'],colB:['Nhà Nguyễn','Nhà Đinh','Nhà Lý','Nhà Lê'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Đại tướng [?] trực tiếp chỉ huy chiến dịch [?] toàn thắng năm 1954.',blanks:['Võ Nguyên Giáp','Điện Biên Phủ'],bank:['Võ Nguyên Giáp','Hồ Chí Minh','Điện Biên Phủ','Biên Giới','Tây Bắc']},
      {type:'sort',q:'Sắp xếp các vương triều độc lập theo thứ tự:',items:['Nhà Lý','Nhà Ngô','Nhà Trần','Nhà Đinh'],correct:['Nhà Ngô','Nhà Đinh','Nhà Lý','Nhà Trần']},
    ],
  },
  literature:{
    1:[ // CẤP 1 — Tân Binh: Tiếng Việt cơ bản, truyện thiếu nhi
      {type:'mcq',q:'🔤 Bảng chữ cái tiếng Việt có bao nhiêu chữ cái?',opts:['26','28','29','30'],ans:2},
      {type:'mcq',q:'🌙 Từ nào trái nghĩa với "ngày"?',opts:['Sáng','Chiều','Đêm','Trưa'],ans:2},
      {type:'mcq',q:'🌸 Từ nào đồng nghĩa với "xinh đẹp"?',opts:['Xấu','Dữ','Đẹp','Bẩn'],ans:2},
      {type:'mcq',q:'📚 Truyện "Rùa và Thỏ" dạy chúng ta điều gì?',opts:['Chạy nhanh thì thắng','Kiên trì sẽ thắng','Ngủ giỏi thì khoẻ','Rùa nhanh hơn thỏ'],ans:1},
      {type:'mcq',q:'✏️ Từ nào là DANH TỪ?',opts:['Chạy','Đẹp','Trường học','Nhanh'],ans:2},
      {type:'mcq',q:'🎵 Câu thơ "Quê hương là chùm khế ngọt" của nhà thơ nào?',opts:['Tố Hữu','Đỗ Trung Quân','Xuân Diệu','Huy Cận'],ans:1},
      {type:'imgpick',q:'Đồ vật nào dùng để viết?',opts:[{icon:'✏️',l:'Bút chì'},{icon:'📏',l:'Thước'},{icon:'✂️',l:'Kéo'},{icon:'📚',l:'Sách'}],ans:0},
      {type:'match',q:'Nối từ trái nghĩa:',colA:['To','Nhanh','Vui','Sáng'],colB:['Tối','Buồn','Nhỏ','Chậm'],correct:[2,3,1,0]},
      {type:'wordfill',sent:'Bầu trời ban ngày có [?] chiếu sáng. Ban đêm có [?] và sao.',blanks:['mặt trời','mặt trăng'],bank:['mặt trời','mặt trăng','ngọn nến','đèn điện']},
      {type:'sort',q:'Sắp xếp đúng thứ tự câu chuyện Rùa-Thỏ:',items:['Rùa về đích','Thỏ ngủ quên','Bắt đầu chạy','Thỏ chạy trước'],correct:['Bắt đầu chạy','Thỏ chạy trước','Thỏ ngủ quên','Rùa về đích']},
    ],
    2:[ // CẤP 2 — Chiến Binh: Ngữ pháp cơ bản, văn học dân gian
      {type:'mcq',q:'📖 Câu "Em học bài rất chăm chỉ" — "rất chăm chỉ" là?',opts:['Chủ ngữ','Vị ngữ','Trạng ngữ','Bổ ngữ'],ans:1},
      {type:'mcq',q:'🐱 Câu "Con mèo kêu meo meo" — "con mèo" đóng vai trò gì?',opts:['Vị ngữ','Chủ ngữ','Bổ ngữ','Trạng ngữ'],ans:1},
      {type:'mcq',q:'📚 Truyện cổ tích "Tấm Cám" thuộc thể loại nào?',opts:['Thần thoại','Truyền thuyết','Cổ tích','Ngụ ngôn'],ans:2},
      {type:'mcq',q:'🎭 Truyện "Cây tre trăm đốt" ca ngợi điều gì?',opts:['Sức mạnh của tre','Lòng tốt và sự thật thà','Sự khéo léo','Tình yêu thiên nhiên'],ans:1},
      {type:'mcq',q:'✍️ Dấu câu nào dùng ở cuối câu hỏi?',opts:['Dấu chấm .','Dấu phẩy ,','Dấu hỏi ?','Dấu chấm than !'],ans:2},
      {type:'mcq',q:'📝 Từ "học sinh" là từ ghép hay từ láy?',opts:['Từ đơn','Từ ghép','Từ láy','Từ tượng thanh'],ans:1},
      {type:'match',q:'Nối thể loại với đặc điểm:',colA:['Thần thoại','Truyền thuyết','Cổ tích','Ngụ ngôn'],colB:['Nhân vật là thần','Dạy đạo đức qua vật','Có yếu tố lịch sử','Nhân vật thường bất hạnh rồi hạnh phúc'],correct:[0,2,3,1]},
      {type:'imgpick',q:'Tác phẩm nào là thơ (không phải văn xuôi)?',opts:[{icon:'🎵',l:'Lượm (Tố Hữu)'},{icon:'📖',l:'Dế Mèn Phiêu Lưu Ký'},{icon:'📚',l:'Tắt Đèn'},{icon:'🗒️',l:'Số Đỏ'}],ans:0},
      {type:'wordfill',sent:'Câu "Trời [?], mây [?]" sử dụng biện pháp tu từ [?].',blanks:['xanh','trắng'],bank:['xanh','trắng','đen','so sánh','nhân hóa','điệp ngữ']},
      {type:'sort',q:'Sắp xếp đúng cấu trúc câu:',items:['chăm chỉ','Em','bài','học'],correct:['Em','học','bài','chăm chỉ']},
    ],
    3:[ // CẤP 3 — Anh Hùng: Văn học Việt Nam cổ điển & hiện đại
      {type:'mcq',q:'📜 "Truyện Kiều" của Nguyễn Du có bao nhiêu câu thơ lục bát?',opts:['2.254','3.254','3.524','4.254'],ans:1},
      {type:'mcq',q:'🖊️ Nhà thơ nào được mệnh danh "Ông hoàng thơ tình" Việt Nam?',opts:['Xuân Diệu','Hàn Mặc Tử','Chế Lan Viên','Huy Cận'],ans:0},
      {type:'mcq',q:'📚 Tác phẩm "Dế Mèn Phiêu Lưu Ký" của ai?',opts:['Tô Hoài','Nam Cao','Ngô Tất Tố','Nguyễn Công Hoan'],ans:0},
      {type:'mcq',q:'🎭 "Đoạn trường tân thanh" là tên khác của tác phẩm nào?',opts:['Cung oán ngâm khúc','Truyện Kiều','Chinh phụ ngâm','Bình Ngô Đại Cáo'],ans:1},
      {type:'mcq',q:'✍️ Biện pháp tu từ nào được dùng trong câu: "Mặt trời của bắp thì nằm trên đồi"?',opts:['So sánh','Nhân hóa','Ẩn dụ','Hoán dụ'],ans:2},
      {type:'mcq',q:'📖 Tác phẩm "Tắt Đèn" phê phán chế độ nào?',opts:['Phong kiến thực dân Pháp','Chế độ Mỹ','Chế độ cộng sản','Chế độ quân chủ lập hiến'],ans:0},
      {type:'match',q:'Nối tác giả với tác phẩm nổi tiếng:',colA:['Nguyễn Du','Nam Cao','Tô Hoài','Hồ Xuân Hương'],colB:['Dế Mèn Phiêu Lưu Ký','Thơ Nôm sắc sảo','Truyện Kiều','Chí Phèo'],correct:[2,3,0,1]},
      {type:'wordfill',sent:'Trong thể thơ lục bát, câu [?] chữ xen kẽ câu [?] chữ.',blanks:['6','8'],bank:['4','6','7','8','9']},
      {type:'sort',q:'Sắp xếp các giai đoạn văn học Việt Nam:',items:['Văn học Đổi Mới 1986','Văn học trung đại','Văn học 1930-1945','Văn học dân gian'],correct:['Văn học dân gian','Văn học trung đại','Văn học 1930-1945','Văn học Đổi Mới 1986']},
      {type:'mcq',q:'🎵 Bài thơ "Đây thôn Vĩ Dạ" của nhà thơ nào?',opts:['Xuân Diệu','Hàn Mặc Tử','Tế Hanh','Chế Lan Viên'],ans:1},
    ],
    4:[ // CẤP 4 — Huyền Thoại: Phong cách ngôn ngữ & phân tích văn bản
      {type:'mcq',q:'📜 "Nam quốc sơn hà" được viết theo thể thơ Đường luật nào?',opts:['Thất ngôn tứ tuyệt','Thất ngôn bát cú','Ngũ ngôn tứ tuyệt','Lục bát'],ans:0},
      {type:'mcq',q:'🖊️ Phong cách nghệ thuật đặc trưng của thơ Hồ Xuân Hương là gì?',opts:['Lãng mạn bay bổng','Trào phúng, đả kích','Anh hùng ca hào hùng','Trữ tình sâu lắng'],ans:1},
      {type:'mcq',q:'📚 Luận điểm chính trong "Bình Ngô Đại Cáo" là gì?',opts:['Kêu gọi chiến tranh','Khẳng định chủ quyền và nhân nghĩa','Mô tả thiên nhiên','Khen ngợi triều đình'],ans:1},
      {type:'mcq',q:'🎭 Trong truyện Kiều, nhân vật phản diện chính là ai?',opts:['Từ Hải','Thúc Sinh','Hoạn Thư','Tú Bà & Mã Giám Sinh'],ans:3},
      {type:'mcq',q:'✍️ "Phép điệp ngữ" trong văn học là gì?',opts:['Lặp lại từ/cụm từ để nhấn mạnh','So sánh hai sự vật','Thay tên này bằng tên khác','Nhân hóa đồ vật'],ans:0},
      {type:'mcq',q:'📖 Tác phẩm "Chiếc lược ngà" của Nguyễn Quang Sáng viết về chủ đề gì?',opts:['Tình yêu đôi lứa','Tình cha con trong chiến tranh','Người nông dân nghèo','Cảnh thiên nhiên miền Nam'],ans:1},
      {type:'match',q:'Nối đặc điểm với phong cách thơ:',colA:['Thơ lãng mạn 1932-1945','Thơ cách mạng','Thơ dân gian','Thơ Đường luật'],colB:['Niêm luật chặt chẽ','Bắt vần tự do, trữ tình','Ca dao, tục ngữ','Hào hùng, kêu gọi chiến đấu'],correct:[1,3,2,0]},
      {type:'wordfill',sent:'Trong câu "Áo chàm đưa buổi phân ly" — "Áo chàm" là [?] tu từ, đại diện cho [?].',blanks:['hoán dụ','người Việt Bắc'],bank:['ẩn dụ','hoán dụ','nhân hóa','người Việt Bắc','màu sắc','quân giải phóng']},
      {type:'sort',q:'Sắp xếp đúng cấu trúc bài thơ Đường luật thất ngôn bát cú:',items:['Thực','Đề','Luận','Kết'],correct:['Đề','Thực','Luận','Kết']},
      {type:'mcq',q:'🎵 "Vội vàng" là bài thơ nổi tiếng nhất của ai trong phong trào Thơ Mới?',opts:['Huy Cận','Chế Lan Viên','Xuân Diệu','Lưu Trọng Lư'],ans:2},
    ],
    5:[ // CẤP 5 — Thần Thánh: Lý luận văn học, phân tích chuyên sâu
      {type:'mcq',q:'📜 Khái niệm "intertextuality" (liên văn bản) trong nghiên cứu văn học do ai đề xuất?',opts:['Roland Barthes','Julia Kristeva','Ferdinand de Saussure','Jacques Derrida'],ans:1},
      {type:'mcq',q:'🖊️ Đặc điểm nào KHÔNG thuộc trường phái văn học hiện thực phê phán?',opts:['Phản ánh hiện thực khách quan','Phê phán xã hội','Lý tưởng hóa nhân vật','Xây dựng điển hình'],ans:2},
      {type:'mcq',q:'📚 Tác phẩm nào của Nam Cao thể hiện rõ nhất bi kịch "chết mòn"?',opts:['Chí Phèo','Lão Hạc','Đời thừa','Sống mòn'],ans:3},
      {type:'mcq',q:'🎭 Thủ pháp "dòng ý thức" (stream of consciousness) trong văn học được gắn với tác giả nào?',opts:['Ernest Hemingway','Virginia Woolf','F. Scott Fitzgerald','William Faulkner'],ans:1},
      {type:'mcq',q:'✍️ Trong Truyện Kiều, câu "Trăm năm trong cõi người ta, Chữ tài chữ mệnh khéo là ghét nhau" thuộc phần nào?',opts:['Gặp gỡ và đính ước','Gia biến và lưu lạc','Đoàn tụ','Mở đầu — Luận đề'],ans:3},
      {type:'mcq',q:'📖 Khái niệm "Magical Realism" (Chủ nghĩa hiện thực huyền ảo) gắn liền với nền văn học nào?',opts:['Văn học Nga','Văn học Mỹ Latin','Văn học Pháp','Văn học Nhật Bản'],ans:1},
      {type:'match',q:'Nối tác giả với trường phái/khuynh hướng văn học:',colA:['Kafka','Marquez','Camus','Balzac'],colB:['Hiện thực phê phán Pháp','Chủ nghĩa hiện sinh','Hiện thực huyền ảo','Chủ nghĩa phi lý'],correct:[3,2,1,0]},
      {type:'wordfill',sent:'Thuyết [?] trong văn học cho rằng ý nghĩa nằm ở [?] chứ không phải ở tác giả.',blanks:['Cái chết của tác giả','văn bản'],bank:['Cái chết của tác giả','Phê bình mới','văn bản','người đọc','ngữ cảnh','tác giả']},
      {type:'sort',q:'Sắp xếp đúng các phần của một bài phân tích văn học:',items:['Luận điểm & dẫn chứng','Đặt vấn đề','Kết luận & mở rộng','Phân tích chi tiết'],correct:['Đặt vấn đề','Luận điểm & dẫn chứng','Phân tích chi tiết','Kết luận & mở rộng']},
      {type:'mcq',q:'🎵 Truyện thơ Nôm nào được coi là "tiền thân" của Truyện Kiều về thể loại?',opts:['Cung oán ngâm khúc','Chinh phụ ngâm','Hoa tiên','Bích Câu kỳ ngộ'],ans:2},
    ],
  },

  civic:{
    // Level 1 — Cấp 1: Gia đình và bản thân
    1:[
      {type:'mcq',q:'🏠 Em cần làm gì khi về nhà?',opts:['Chào ba mẹ','Im lặng đi thẳng','Bật TV ngay','Ngủ liền'],ans:0},
      {type:'truefalse',q:'🏛️ Mọi trẻ em đều có quyền được học tập',ans:true},
      {type:'truefalse',q:'👮 Vượt đèn đỏ là hành vi được phép',ans:false,explain:'Vượt đèn đỏ vi phạm luật giao thông'},
      {type:'numpad',q:'🗳️ Tuổi tối thiểu được bầu cử ở Việt Nam là? (18)',ans:18},
      {type:'wordorder',q:'Sắp xếp thành câu đúng:',words:['nhường','Kính','dưới','trên'],correct:'Kính trên nhường dưới'},
      {type:'mcq',q:'🤝 Khi gặp người lớn, em cần?',opts:['Nhìn chỗ khác','Chào hỏi lễ phép','La to','Chạy đi'],ans:1},
      {type:'mcq',q:'🌿 Bảo vệ môi trường là?',opts:['Chỉ việc của người lớn','Trách nhiệm của mọi người','Việc của chính phủ','Không quan trọng'],ans:1},
      {type:'mcq',q:'🚮 Khi thấy rác dưới sân trường em nên?',opts:['Bỏ qua','Nhặt bỏ vào thùng rác','Đá sang chỗ khác','Giả vờ không thấy'],ans:1},
      {type:'mcq',q:'❤️ Tình cảm gia đình là?',opts:['Không quan trọng','Thiêng liêng và quý giá','Chỉ cần tiền','Ai cũng như nhau'],ans:1},
    ],
    // Level 2 — Cấp 2: Nhà trường và bạn bè
    2:[
      {type:'mcq',q:'👩‍🏫 Em phải làm gì khi thầy cô đang giảng bài?',opts:['Nói chuyện riêng','Chú ý lắng nghe','Vẽ bậy','Ngủ gật'],ans:1},
      {type:'mcq',q:'🤼 Khi bạn bị bắt nạt, em nên?',opts:['Coi là chuyện không liên quan','Báo thầy cô và giúp bạn','Cười và bỏ đi','Bắt nạt thêm'],ans:1},
      {type:'mcq',q:'📚 Quyền được học tập của trẻ em là?',opts:['Đặc quyền của người giàu','Quyền của tất cả trẻ em','Không phải quyền','Chỉ dành cho con trai'],ans:1},
      {type:'mcq',q:'🏫 Nội quy trường học nhằm mục đích?',opts:['Trừng phạt học sinh','Giữ gìn trật tự và kỷ luật','Gây khó dễ','Không có ý nghĩa'],ans:1},
      {type:'imgpick',q:'Hành động nào thể hiện tình bạn đẹp?',opts:[{icon:'🤝',l:'Giúp bạn học bài'},{icon:'😡',l:'La mắng bạn'},{icon:'🏃',l:'Bỏ đi khi bạn cần'},{icon:'🤥',l:'Nói dối bạn'}],ans:0},
    ],
    // Level 3 — Cấp 3: Cộng đồng và xã hội
    3:[
      {type:'mcq',q:'🚦 Đi bộ qua đường em phải?',opts:['Chạy nhanh qua','Đi theo vạch kẻ đường và đèn xanh','Đi bất kỳ lúc nào','Không cần để ý'],ans:1},
      {type:'mcq',q:'🏥 Khi thấy người bị tai nạn, em cần?',opts:['Đứng nhìn','Gọi người lớn hoặc cứu thương','Chạy trốn','Chụp ảnh đăng mạng'],ans:1},
      {type:'mcq',q:'🎌 Quốc kỳ Việt Nam có màu gì?',opts:['Xanh lá với sao trắng','Đỏ với ngôi sao vàng năm cánh','Vàng với sao đỏ','Trắng với hoa sen'],ans:1},
      {type:'mcq',q:'🏛️ Chủ tịch nước là người đại diện cho?',opts:['Một tỉnh','Một thành phố','Cả nước Việt Nam','Một quận'],ans:2},
      {type:'mcq',q:'🌐 Tổ quốc của em là?',opts:['Thành phố em ở','Tỉnh em ở','Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam','Châu Á'],ans:2},
    ],
    // Level 4 — Cấp 4: Quyền và bổn phận
    4:[
      {type:'mcq',q:'📜 Công dân Việt Nam có quyền?',opts:['Làm bất cứ điều gì','Học tập, bầu cử, tự do ngôn luận hợp pháp','Không đóng thuế','Không cần tuân luật'],ans:1},
      {type:'mcq',q:'⚖️ Pháp luật Việt Nam quy định?',opts:['Chỉ áp dụng cho người nghèo','Áp dụng bình đẳng cho mọi công dân','Người giàu không cần tuân theo','Tùy từng vùng'],ans:1},
      {type:'mcq',q:'🌊 Biển Đông thuộc chủ quyền của?',opts:['Chỉ Việt Nam','Một phần thuộc chủ quyền Việt Nam','Hoàn toàn của Trung Quốc','Không thuộc nước nào'],ans:1},
      {type:'mcq',q:'🗳️ Bầu cử là quyền của công dân từ bao nhiêu tuổi?',opts:['16 tuổi','18 tuổi','21 tuổi','25 tuổi'],ans:1},
      {type:'mcq',q:'🏳️ Em có bổn phận gì với Tổ quốc?',opts:['Không có bổn phận gì','Yêu nước, học tập tốt, giữ gìn văn hóa','Chỉ cần nộp thuế','Chỉ phục vụ khi được gọi'],ans:1},
    ],
    // Level 5 — Cấp 5: Hiến pháp và pháp luật
    5:[
      {type:'mcq',q:'📖 Hiến pháp là?',opts:['Luật của một địa phương','Đạo luật cơ bản nhất của quốc gia','Quy định của trường học','Luật giao thông'],ans:1},
      {type:'mcq',q:'🏛️ Quốc hội Việt Nam có chức năng?',opts:['Chỉ ban hành luật','Lập pháp, quyết định ngân sách, giám sát nhà nước','Chỉ bầu Chủ tịch nước','Chỉ quản lý kinh tế'],ans:1},
      {type:'mcq',q:'👶 Công ước LHQ về Quyền Trẻ em có bao nhiêu quyền cơ bản?',opts:['10','20','40','54'],ans:3},
      {type:'mcq',q:'⚖️ Nguyên tắc cơ bản của pháp luật là?',opts:['Mạnh được yếu thua','Bình đẳng trước pháp luật','Người quyền thế được ưu tiên','Chỉ áp dụng cho người trưởng thành'],ans:1},
      {type:'mcq',q:'🌍 Việt Nam gia nhập Liên Hợp Quốc năm nào?',opts:['1954','1975','1977','1986'],ans:2},
    ],
  },

  english:{
    // Level 1 — Alphabet & greetings
    1:[
      {type:'mcq',q:'🔤 How many letters are in the English alphabet?',opts:['24','25','26','28'],ans:2},
      {type:'truefalse',q:'🇬🇧 "Cat" means "con mèo"',ans:true},
      {type:'truefalse',q:'📚 "She have a book" is correct',ans:false,explain:'Correct: "She has a book"'},
      {type:'numpad',q:'🔢 How many days in a week? (7)',ans:7},
      {type:'wordorder',q:'Make a sentence:',words:['have','I','a','pen'],correct:'I have a pen'},
      {type:'mcq',q:'☀️ "Good morning" means?',opts:['Chào buổi tối','Chào buổi sáng','Tạm biệt','Xin chào'],ans:1},
      {type:'mcq',q:'🐱 "Cat" means?',opts:['Chó','Mèo','Gà','Cá'],ans:1},
      {type:'mcq',q:'🔴 What color is this? 🍎',opts:['Blue','Green','Red','Yellow'],ans:2},
      {type:'mcq',q:'1️⃣ "One, two, ___"?',opts:['four','five','three','six'],ans:2},
    ],
    // Level 2 — Numbers, colors, animals
    2:[
      {type:'mcq',q:'🐶 "Dog" in Vietnamese means?',opts:['Mèo','Chó','Gà','Vịt'],ans:1},
      {type:'mcq',q:'🔵 "Blue" means?',opts:['Đỏ','Xanh lá','Xanh dương','Vàng'],ans:2},
      {type:'mcq',q:'🔢 How do you say "10" in English?',opts:['Nine','Eleven','Ten','Eight'],ans:2},
      {type:'mcq',q:'👋 "Goodbye" means?',opts:['Xin chào','Cảm ơn','Tạm biệt','Xin lỗi'],ans:2},
      {type:'imgpick',q:'Which animal is a "fish"?',opts:[{icon:'🐦',l:'Bird'},{icon:'🐱',l:'Cat'},{icon:'🐟',l:'Fish'},{icon:'🐘',l:'Elephant'}],ans:2},
    ],
    // Level 3 — Family, body, school
    3:[
      {type:'mcq',q:'👨‍👩‍👧 "Family" means?',opts:['Bạn bè','Gia đình','Trường học','Lớp học'],ans:1},
      {type:'mcq',q:'✋ "Hand" means?',opts:['Chân','Đầu','Tay','Mắt'],ans:2},
      {type:'mcq',q:'📚 "Book" means?',opts:['Bút','Thước','Sách','Bàn'],ans:2},
      {type:'mcq',q:'🍎 "Apple" is a ___?',opts:['vegetable','animal','fruit','flower'],ans:2},
      {type:'mcq',q:'🌞 "The sun is ___." (to describe it as bright)',opts:['sad','bright','dark','cold'],ans:1},
    ],
    // Level 4 — Sentences & grammar
    4:[
      {type:'mcq',q:'📝 Which sentence is correct?',opts:['I am a student.','I is a student.','I are student.','Me am student.'],ans:0},
      {type:'mcq',q:'🐕 "She ___ a dog." (present)',opts:['have','has','is','are'],ans:1},
      {type:'mcq',q:'🌈 "What color ___ the sky?"',opts:['is','are','am','be'],ans:0},
      {type:'mcq',q:'📅 "Today is ___." — Hôm nay là thứ Hai:',opts:['Sunday','Tuesday','Monday','Friday'],ans:2},
      {type:'mcq',q:'🔢 "Twenty + fifteen = ___"',opts:['Thirty','Thirty-five','Forty','Forty-five'],ans:1},
    ],
    // Level 5 — Advanced elementary
    5:[
      {type:'mcq',q:'📖 "She ___ to school every day."',opts:['go','goes','going','gone'],ans:1},
      {type:'mcq',q:'🌍 The capital of England is?',opts:['Paris','Berlin','London','Rome'],ans:2},
      {type:'mcq',q:'🗓️ How many months are in a year?',opts:['10','11','12','13'],ans:2},
      {type:'mcq',q:'🐘 "Elephant" — how many syllables?',opts:['2','3','4','1'],ans:1},
      {type:'mcq',q:'❓ "Where ___ you from?" (correct form)',opts:['is','am','are','be'],ans:2},
    ],
  },
};

// ═══════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════
function renderWorld(){
  ctx.clearRect(0,0,GW,GH);
  const camX=cam.x;
  
  drawSky(ctx,camX);
  drawGround(ctx,camX);
  
  // Hồ nước bên trái
  if(!inOcean){
    const _gY = GH*(_isTouchDevice?0.72:0.65);
    drawLake(ctx, camX, _gY);
  }
  
  // Spawn ambient effects
  maybeSpawnLeaf(camX);
  maybeSpawnDust();
  updateFireflies();

  // Trees (behind houses, skip lake area + house zones)
  const _blockedZones = _buildBlockedZones();
  worldTrees.forEach(t=>{
    const rx=t.wx-camX;
    if(rx<-80||rx>GW+80)return;
    if(_isBlocked(t.wx, _blockedZones))return;
    drawHDTree(ctx,rx,camX);
  });

  // Rocks
  worldRocks.forEach(r=>{
    const rx=r.wx-camX;
    if(rx<-60||rx>GW+60)return;
    if(_isBlocked(r.wx, _blockedZones))return;
    drawPixelRock(ctx,rx,r.rtype,r.scale);
  });
  
  // Houses
  houses.forEach(h=>drawHDHouse(ctx,h,camX));
  
  // Treasure chests
  chests.forEach(ch=>{
    const rx=ch.wx-camX;
    if(rx<-40||rx>GW+40)return;
    const cy=ch.wy;
    if(ch.opened){
      // opened chest - empty
      ctx.fillStyle='#5d3a20';ctx.fillRect(rx,cy+12,28,16);
      ctx.fillStyle='#7a4d2a';ctx.fillRect(rx+2,cy+12,24,12);
      ctx.strokeStyle='#ffd700';ctx.lineWidth=1;ctx.strokeRect(rx,cy+12,28,16);
      ctx.fillStyle='rgba(255,215,0,0.3)';ctx.beginPath();ctx.arc(rx+14,cy+8,14,Math.PI,0);ctx.fill();
      ctx.strokeStyle='#cc8800';ctx.lineWidth=1;ctx.beginPath();ctx.arc(rx+14,cy+8,14,Math.PI,0);ctx.stroke();
    } else {
      // closed chest glow
      ctx.save();
      const pulse=0.7+Math.sin(frameCount*0.08+ch.wx)*0.3;
      ctx.shadowColor='#ffd700';ctx.shadowBlur=12*pulse;
      // chest body
      ctx.fillStyle='#5d3a20';ctx.fillRect(rx,cy+10,28,18);
      ctx.fillStyle='#7a4d2a';ctx.fillRect(rx+2,cy+12,24,14);
      // chest lid
      ctx.fillStyle='#4a2f1a';ctx.fillRect(rx,cy+4,28,10);
      ctx.fillStyle='#6d4c41';ctx.fillRect(rx+2,cy+6,24,8);
      // gold lock
      ctx.fillStyle='#ffd700';ctx.fillRect(rx+10,cy+9,8,6);
      ctx.fillStyle='#cc8800';ctx.beginPath();ctx.arc(rx+14,cy+9,3,Math.PI,0);ctx.fill();
      // gold trim
      ctx.fillStyle='#ffd700';ctx.fillRect(rx,cy+13,28,2);
      ctx.restore();
      // interact hint
      const distC=Math.hypot(P.x+P.w/2-ch.wx-14,P.y+P.h/2-ch.wy-14);
      if(distC<70&&gameState==='WORLD'){
        ctx.save();ctx.globalAlpha=0.9;
        ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(rx-5,cy-18,38,12);
        ctx.fillStyle='#ffd700';ctx.font='bold 13px "Times New Roman"';ctx.textAlign='center';
        ctx.fillText('[E] MỞ',rx+14,cy-10);ctx.restore();
      }
    }
  });

  // ── Underground Dungeon Entrance (past cave, outside town) ───────
  (()=>{
    const rx=undergroundEntrance.worldX-camX;
    if(rx<-120||rx>GW+120) return;
    const gY2=GH*(0.65);
    const cx2=rx+undergroundEntrance.width/2;
    // Stone trapdoor / pit
    ctx.fillStyle='#2a1a0a';ctx.fillRect(rx-5,gY2-4,undergroundEntrance.width+10,12);
    ctx.fillStyle='#1a0a00';ctx.fillRect(rx,gY2-2,undergroundEntrance.width,8);
    // Dark hole with lava glow
    const holeGrad=ctx.createRadialGradient(cx2,gY2+2,4,cx2,gY2+2,38);
    holeGrad.addColorStop(0,'rgba(255,80,0,0.7)');holeGrad.addColorStop(0.5,'rgba(120,20,0,0.4)');holeGrad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=holeGrad;ctx.beginPath();ctx.ellipse(cx2,gY2+2,35,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#050000';ctx.beginPath();ctx.ellipse(cx2,gY2+2,28,7,0,0,Math.PI*2);ctx.fill();
    // Rising embers
    for(let fi=0;fi<5;fi++){
      const fx=cx2-20+fi*10;const fy=gY2-8+Math.sin(frameCount*0.08+fi)*4;
      ctx.globalAlpha=0.3+Math.sin(frameCount*0.1+fi)*0.2;
      ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(fx,fy,2+fi%2,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    // Sign
    ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(cx2-44,gY2-32,88,16);
    ctx.strokeStyle='#ff4400';ctx.lineWidth=1;ctx.strokeRect(cx2-44,gY2-32,88,16);
    ctx.fillStyle='#ff8844';ctx.font='bold 14px "Times New Roman"';ctx.textAlign='center';
    ctx.fillText('🔥 LÒNG ĐẤT',cx2,gY2-19);
    // Proximity prompt
    const distUD=Math.hypot(P.x+P.w/2-(undergroundEntrance.worldX+undergroundEntrance.width/2),P.y-(GND-30));
    window._nearUnderground=distUD<90;
    if(window._nearUnderground&&gameState==='WORLD'){
      ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(cx2-55,gY2-50,110,14);
      ctx.strokeStyle='#ff4400';ctx.lineWidth=1;ctx.strokeRect(cx2-55,gY2-50,110,14);
      ctx.fillStyle='#ff8844';ctx.font='bold 13px "Times New Roman"';ctx.textAlign='center';
      ctx.fillText('[E] XUỐNG LÒNG ĐẤT',cx2,gY2-39);
    }
  })();

  // ── LÂU ĐÀI BÓNG TỐI — Castle only, no sky/ground override ─
  (()=>{
    const gY2=GH*(0.65);
    const castleStart=HELL_START;
    const castleEnd=HELL_END;
    const csRx=castleStart-camX;
    const ceRx=castleEnd-camX;
    if(ceRx<-100||csRx>GW+100) return;

    const midX=(castleStart+castleEnd)/2;
    const castRx=midX-camX;
    const night=isNightTime();

    // ── Dark / dead trees flanking the castle ────────────────
    const darkTreePositions=[
      castleStart+30, castleStart+120, castleStart+210,
      castleEnd-250,  castleEnd-140,   castleEnd-50,
      midX-280, midX-180, midX+180, midX+280,
    ];
    darkTreePositions.forEach((twx,ti)=>{
      const trx=twx-camX;
      if(trx<-80||trx>GW+80) return;
      ctx.save();
      // Dark silhouette tree — bare dead branches
      const trunkH=55+ti%3*10;
      // Shadow/darkness tint — darker at night
      const treeAlpha=night?0.85:0.65;
      ctx.globalAlpha=treeAlpha;
      // Trunk — near-black
      ctx.fillStyle='#0a0608';
      ctx.fillRect(trx+16,gY2-trunkH,8,trunkH);
      // Bare gnarled branches
      const branchAngles=[-0.6,-0.3,0.1,0.45,0.7,-0.8,0.85];
      branchAngles.forEach((ang,bi)=>{
        const blen=18+bi*4;
        const bStartY=gY2-trunkH+bi*(trunkH/7);
        const bDir=bi%2===0?1:-1;
        ctx.strokeStyle='#0d080c';ctx.lineWidth=2-bi*0.15;
        ctx.beginPath();
        ctx.moveTo(trx+20,bStartY);
        ctx.lineTo(trx+20+Math.cos(ang)*blen*bDir, bStartY-Math.sin(Math.abs(ang))*blen);
        ctx.stroke();
        // Sub-branch
        if(bi<4){
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(trx+20+Math.cos(ang)*blen*0.6*bDir, bStartY-Math.sin(Math.abs(ang))*blen*0.6);
          ctx.lineTo(trx+20+Math.cos(ang+0.4)*blen*0.9*bDir, bStartY-Math.sin(Math.abs(ang)+0.3)*blen*0.9);
          ctx.stroke();
        }
      });
      // At night: faint purple glow at roots
      if(night){
        const rg=ctx.createRadialGradient(trx+20,gY2,2,trx+20,gY2,20);
        rg.addColorStop(0,'rgba(80,0,120,0.4)');rg.addColorStop(1,'transparent');
        ctx.fillStyle=rg;ctx.beginPath();ctx.arc(trx+20,gY2,20,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    });

    // ── Castle ────────────────────────────────────────────────
    if(castRx<-300||castRx>GW+300) return;
    const cW=360, cH=280, cX=castRx-cW/2;
    ctx.save();

    // Subtle shadow aura — only at night
    if(night){
      const castleAura=ctx.createRadialGradient(castRx,gY2-cH/2,30,castRx,gY2-cH/2,200);
      const ap=0.15+Math.sin(frameCount*0.025)*0.07;
      castleAura.addColorStop(0,`rgba(60,0,120,${ap})`);castleAura.addColorStop(1,'transparent');
      ctx.fillStyle=castleAura;ctx.beginPath();ctx.arc(castRx,gY2-cH/2,200,0,Math.PI*2);ctx.fill();
    }

    // Main castle body
    const wallG=ctx.createLinearGradient(cX,gY2-cH,cX+cW,gY2);
    wallG.addColorStop(0,'#1a1228');wallG.addColorStop(0.5,'#221840');wallG.addColorStop(1,'#120e22');
    ctx.fillStyle=wallG;ctx.fillRect(cX+40,gY2-cH*0.6,cW-80,cH*0.6);
    ctx.strokeStyle='#3a2070';ctx.lineWidth=2;ctx.strokeRect(cX+40,gY2-cH*0.6,cW-80,cH*0.6);

    // Stone brick lines
    ctx.strokeStyle='rgba(40,20,70,0.5)';ctx.lineWidth=1;
    for(let br=0;br<8;br++){
      const by2=gY2-cH*0.6+br*(cH*0.6/8);
      ctx.beginPath();ctx.moveTo(cX+40,by2);ctx.lineTo(cX+cW-40,by2);ctx.stroke();
      for(let bc=0;bc<5;bc++){
        const bx2=cX+40+bc*(cW-80)/5+(br%2)*((cW-80)/10);
        ctx.beginPath();ctx.moveTo(bx2,by2);ctx.lineTo(bx2,by2+(cH*0.6/8));ctx.stroke();
      }
    }

    // Towers
    const towers=[
      [cX,       cH*0.88, 55],
      [cX+68,    cH*0.72, 45],
      [castRx-28,cH,      62],
      [cX+cW-113,cH*0.72, 45],
      [cX+cW-55, cH*0.88, 55],
    ];
    towers.forEach(([tx,th,tw])=>{
      const tg=ctx.createLinearGradient(tx,gY2-th,tx+tw,gY2);
      tg.addColorStop(0,'#160a2a');tg.addColorStop(0.5,'#221040');tg.addColorStop(1,'#100820');
      ctx.fillStyle=tg;ctx.fillRect(tx,gY2-th,tw,th);
      ctx.strokeStyle='#3a2070';ctx.lineWidth=1.5;ctx.strokeRect(tx,gY2-th,tw,th);
      // Battlements
      for(let b=0;b<Math.floor(tw/14);b++){
        ctx.fillStyle='#0c0618';ctx.fillRect(tx+b*14,gY2-th-14,10,14);
      }
      // Conical roof
      ctx.fillStyle='#0e0820';
      ctx.beginPath();ctx.moveTo(tx,gY2-th);ctx.lineTo(tx+tw,gY2-th);ctx.lineTo(tx+tw/2,gY2-th-28);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#3a2070';ctx.lineWidth=1;ctx.stroke();
      // Windows — glow when night
      [[0.3,0.3],[0.3,0.6]].forEach(([wxf,wyf])=>{
        const wx2=tx+tw*wxf+6, wy2=gY2-th+th*wyf;
        if(night){
          const wg=ctx.createRadialGradient(wx2,wy2,1,wx2,wy2,9);
          const pulse=0.55+Math.sin(frameCount*0.06+tx*0.01+wyf)*0.35;
          wg.addColorStop(0,`rgba(180,80,255,${pulse})`);wg.addColorStop(1,'transparent');
          ctx.fillStyle=wg;ctx.fillRect(wx2-5,wy2-7,10,14);
        }
        ctx.fillStyle=night?`rgba(100,30,180,0.7)`:'rgba(40,20,60,0.5)';
        ctx.fillRect(wx2-3,wy2-5,6,10);
      });
    });

    // Main gate arch
    const gateX=castRx-22,gateW=44,gateH=68;
    ctx.fillStyle='#050308';
    ctx.beginPath();ctx.moveTo(gateX,gY2);ctx.lineTo(gateX,gY2-gateH+gateW/2);
    ctx.arc(castRx,gY2-gateH+gateW/2,gateW/2,Math.PI,0);
    ctx.lineTo(gateX+gateW,gY2);ctx.fill();
    ctx.strokeStyle='#5a20a0';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(gateX,gY2);ctx.lineTo(gateX,gY2-gateH+gateW/2);
    ctx.arc(castRx,gY2-gateH+gateW/2,gateW/2,Math.PI,0);
    ctx.lineTo(gateX+gateW,gY2);ctx.stroke();
    for(let gb=0;gb<5;gb++){
      ctx.strokeStyle='#2a0a50';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(gateX+6+gb*7,gY2);ctx.lineTo(gateX+6+gb*7,gY2-gateH+12);ctx.stroke();
    }

    // Bats — always a few, more at night
    const batCount=night?10:4;
    for(let bt=0;bt<batCount;bt++){
      const ba=(frameCount*0.016+bt*0.628)%(Math.PI*2);
      const br=75+Math.sin(frameCount*0.02+bt*1.1)*25;
      const bx2=castRx+Math.cos(ba)*br;
      const by2=gY2-cH*0.5+Math.sin(ba*2)*br*0.25;
      ctx.globalAlpha=(night?0.7:0.35)+Math.sin(frameCount*0.08+bt)*0.2;
      ctx.fillStyle=night?'#0a0015':'#1a1428';
      ctx.beginPath();ctx.ellipse(bx2,by2,7,3.5,Math.sin(ba),0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(bx2,by2,2.5,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    // Castle name sign — always visible
    ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(castRx-62,gY2-cH-20,124,16);
    ctx.strokeStyle=night?'#7700cc':'#44286a';ctx.lineWidth=1.5;ctx.strokeRect(castRx-62,gY2-cH-20,124,16);
    ctx.fillStyle=night?'#cc66ff':'#8855aa';
    ctx.font='bold 13px "Times New Roman"';ctx.textAlign='center';
    if(night){ctx.shadowColor='#7700cc';ctx.shadowBlur=8;}
    ctx.fillText('🏰 LÂU ĐÀI BÓNG TỐI',castRx,gY2-cH-7);
    ctx.shadowBlur=0;

    // Night hint / day hint below name
    ctx.font='10px "Times New Roman"';
    if(!night){
      ctx.fillStyle='rgba(120,80,160,0.7)';
      ctx.fillText('🌙 Hắc Long xuất hiện ban đêm',castRx,gY2-cH-28);
    } else if(hacLongUnlocked){
      const np=0.7+Math.sin(frameCount*0.09)*0.3;
      ctx.globalAlpha=np;
      ctx.fillStyle='#ff4444';
      ctx.fillText('🐉 HẮC LONG VƯƠNG đang chờ — [F] CHIẾN ĐẤU!',castRx,gY2-cH-28);
      ctx.globalAlpha=1;
    } else {
      const np=0.7+Math.sin(frameCount*0.09)*0.3;
      ctx.globalAlpha=np;
      ctx.fillStyle='#ee88ff';
      ctx.fillText('🏰 [E] Thách đấu cờ vua với Hắc Long Vương',castRx,gY2-cH-28);
      ctx.globalAlpha=1;
    }
    ctx.restore();
  })();

  // Cave Entrance
  (()=>{
    const rx=caveEntrance.worldX-camX;
    if(rx<-200||rx>GW+200) return;
    const gY2=GH*(0.65);
    const cw=caveEntrance.width, ch2=caveEntrance.height;
    const cx2=rx+cw/2;

    // Cave rock mound bg
    ctx.fillStyle='#2a2420';
    ctx.beginPath();ctx.arc(cx2,gY2,cw*0.55,Math.PI,0);ctx.fill();
    ctx.fillStyle='#1a1410';
    ctx.beginPath();ctx.arc(cx2,gY2,cw*0.48,Math.PI,0);ctx.fill();

    // Rock layers
    ['#3d3530','#4a4035','#332a25'].forEach((col,i)=>{
      ctx.fillStyle=col;
      ctx.beginPath();ctx.arc(cx2+(i-1)*15,gY2+2,cw*(0.42-i*0.04),Math.PI,0);ctx.fill();
    });

    // Cave mouth - dark opening
    ctx.fillStyle='#0a0608';
    ctx.beginPath();ctx.arc(cx2,gY2+4,cw*0.28,Math.PI,0);ctx.fill();
    // Inner glow
    const caveGlow=ctx.createRadialGradient(cx2,gY2-ch2*0.1,4,cx2,gY2-ch2*0.1,cw*0.25);
    caveGlow.addColorStop(0,'rgba(100,50,200,0.6)');
    caveGlow.addColorStop(0.5,'rgba(50,20,120,0.3)');
    caveGlow.addColorStop(1,'transparent');
    ctx.fillStyle=caveGlow;
    ctx.beginPath();ctx.arc(cx2,gY2,cw*0.28,Math.PI,0);ctx.fill();

    // Stalactites on cave mouth top
    ctx.fillStyle='#2a2420';
    for(let s=0;s<5;s++){
      const sx=cx2-cw*0.2+s*(cw*0.1);
      const sh=8+Math.sin(s*1.5)*4;
      ctx.beginPath();ctx.moveTo(sx-4,gY2-cw*0.24);ctx.lineTo(sx+4,gY2-cw*0.24);ctx.lineTo(sx,gY2-cw*0.24+sh);ctx.closePath();ctx.fill();
    }

    // Glowing runes/symbols around cave
    ctx.save();
    const runes=['✦','⬡','◈'];
    runes.forEach((r,i)=>{
      const angle=-Math.PI+i*(Math.PI/4)+(frameCount*0.008);
      const rx2=cx2+Math.cos(angle)*cw*0.42;
      const ry2=gY2+Math.sin(angle)*30-30;
      ctx.globalAlpha=0.5+Math.sin(frameCount*0.05+i)*0.4;
      ctx.fillStyle='#aa66ff';ctx.font='10px serif';
      ctx.textAlign='center';ctx.shadowColor='#9900ff';ctx.shadowBlur=8;
      ctx.fillText(r,rx2,ry2);
    });
    ctx.restore();

    // Sign "HANG ĐỘNG"
    ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(cx2-45,gY2-ch2+10,90,16);
    ctx.strokeStyle='#9b59b6';ctx.lineWidth=1;ctx.strokeRect(cx2-45,gY2-ch2+10,90,16);
    ctx.fillStyle='#cc88ff';ctx.font='bold 15px "Times New Roman"';ctx.textAlign='center';
    ctx.fillText('🗺 HANG ĐỘNG',cx2,gY2-ch2+22);

    // Proximity prompt - use WORLD coords for distance check
    const caveCenterWorldX = caveEntrance.worldX + cw/2;
    const caveCenterWorldY = GND - ch2/2;
    const distWorld = Math.hypot(P.x+P.w/2 - caveCenterWorldX, P.y+P.h/2 - caveCenterWorldY);
    window._nearCave = distWorld < 110;
    if(window._nearCave && gameState==='WORLD'){
      ctx.save();ctx.globalAlpha=0.95;
      ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(cx2-50,gY2-ch2-8,100,14);
      ctx.strokeStyle='#9b59b6';ctx.lineWidth=1;ctx.strokeRect(cx2-50,gY2-ch2-8,100,14);
      ctx.fillStyle='#cc88ff';ctx.font='bold 13px "Times New Roman"';ctx.textAlign='center';
      ctx.fillText('[E] VÀO HANG ĐỘNG',cx2,gY2-ch2+3);ctx.restore();
    }
  })();

  // Coins with glow
  wcoins.forEach(co=>{
    if(co.collected)return;
    const rx=co.wx-camX;
    const ry=co.wy+Math.sin(frameCount*0.07+co.wx)*4;
    if(rx<-20||rx>GW+20)return;
    ctx.save();
    ctx.shadowColor='#ffd700';ctx.shadowBlur=10;
    const cg=ctx.createRadialGradient(rx,ry-2,1,rx,ry,8);
    cg.addColorStop(0,'#fff8aa');cg.addColorStop(0.5,'#ffd700');cg.addColorStop(1,'#cc8800');
    ctx.fillStyle=cg;ctx.beginPath();ctx.arc(rx,ry,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.4)';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
    ctx.fillText('¢',rx,ry+3);
    ctx.restore();
  });
  
  // Monsters
  monsters.forEach(m=>{
    if(!m.alive)return;
    if(m.nightOnly&&!isNightTime())return; // night-only monsters hidden during day
    if(m.lockedUntilChess&&!hacLongUnlocked)return; // ẩn Hắc Long cho đến khi thắng cờ vua
    const rx=m.wx-camX;const ry=m.wy;
    if(rx<-60||rx>GW+60)return;
    
    const night=isNightTime();
    const nMult=getNightMult();
    // At night monsters appear bigger (scale canvas)
    const nightScale=night?0.85+nMult*0.18:1.0; // up to ~1.17x size
    const cx=rx+m.w/2, cy=ry+m.h/2;

    // Night aura glow behind monster
    if(night){
      ctx.save();
      const glowPulse=0.3+Math.sin(frameCount*0.07+m.wx)*0.2;
      const auraColor=m.type==='orc'?'rgba(200,0,255,':'rgba(255,0,60,';
      const aura=ctx.createRadialGradient(cx,cy,2,cx,cy,m.w*1.4*nightScale);
      aura.addColorStop(0,auraColor+(glowPulse*0.9)+')');
      aura.addColorStop(0.5,auraColor+(glowPulse*0.4)+')');
      aura.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=aura;
      ctx.beginPath();ctx.ellipse(cx,cy,m.w*1.4*nightScale,m.h*nightScale,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }

    // Shadow
    ctx.save();ctx.globalAlpha=night?0.6:0.3;ctx.fillStyle='#000';
    ctx.beginPath();ctx.ellipse(cx,GND+2,m.w/2*nightScale,5,0,0,Math.PI*2);ctx.fill();ctx.restore();
    
    const frame2=Math.floor(frameCount/8);
    // Scale up at night
    if(night&&nightScale!==1){
      ctx.save();
      ctx.translate(cx,ry+m.h);
      ctx.scale(nightScale,nightScale);
      ctx.translate(-cx,-(ry+m.h));
    }
    if(m.type==='goblin') drawGoblin(ctx,rx,ry,m.dir<0,frame2);
    else if(m.type==='bat') drawBat(ctx,rx,ry,frame2);
    else if(m.type==='orc') drawOrc(ctx,rx,ry,m.dir<0,frame2);
    else if(m.type==='dragon_mini'||m.type==='dragon_shadow'){
      // Zone mini-dragon / shadow dragon aura
      ctx.save();
      const dcx=rx+m.w/2;const dcy=ry+m.h/2;
      const isShadow=m.type==='dragon_shadow';
      const night=isNightTime();
      if(isShadow&&!night){ctx.restore();return;} // shadow dragon only at night
      const ap=0.25+Math.sin(frameCount*0.06)*0.12;
      const aura=ctx.createRadialGradient(dcx,dcy,8,dcx,dcy,75);
      if(isShadow){
        aura.addColorStop(0,'rgba(100,0,180,'+ap+')');aura.addColorStop(0.5,'rgba(40,0,80,'+(ap*0.5)+')');
      } else {
        const zColors=['rgba(200,80,0,','rgba(100,100,200,','rgba(0,150,200,','rgba(100,200,0,','rgba(150,100,0,','rgba(0,180,100,'];
        const zc=zColors[m.zoneIdx%zColors.length]||'rgba(180,0,0,';
        aura.addColorStop(0,zc+ap+')');aura.addColorStop(0.5,zc+(ap*0.5)+')');
      }
      aura.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=aura;ctx.beginPath();ctx.ellipse(dcx,dcy,75,60,0,0,Math.PI*2);ctx.fill();
      if(isShadow){
        // Shadow wisps
        for(let wi=0;wi<6;wi++){
          const wa=(frameCount*0.02+wi*1.05)%(Math.PI*2);
          const wr=35+Math.sin(frameCount*0.04+wi)*15;
          const wx2=dcx+Math.cos(wa)*wr;const wy2=dcy+Math.sin(wa)*wr*0.5;
          ctx.globalAlpha=0.4+Math.sin(frameCount*0.1+wi)*0.3;
          ctx.fillStyle='#8800ff';ctx.beginPath();ctx.arc(wx2,wy2,2,0,Math.PI*2);ctx.fill();
        }
      }
      ctx.restore();
      // Scale mini-dragon 65%
      ctx.save();ctx.translate(rx+m.w/2,ry+m.h);ctx.scale(0.65,0.65);ctx.translate(-(rx+m.w/2),-(ry+m.h));
      if(isShadow){
        // Purple tint for shadow dragon
        ctx.save();ctx.filter='hue-rotate(200deg) saturate(2) brightness(0.7)';
        drawDragon(ctx,rx+m.w/2-52,ry+m.h-88,m.dir<0,frame2);ctx.restore();
      } else {
        drawDragon(ctx,rx+m.w/2-52,ry+m.h-88,m.dir<0,frame2);
      }
      ctx.restore();
    }
    else if(m.type==='dragon'){
      // Dragon boss aura — pulsing red-black glow
      ctx.save();
      const dragonCX=rx+m.w/2;const dragonCY=ry+m.h/2;
      const auraPulse=0.3+Math.sin(frameCount*0.06)*0.15;
      const dragonAura=ctx.createRadialGradient(dragonCX,dragonCY,10,dragonCX,dragonCY,110);
      dragonAura.addColorStop(0,'rgba(200,0,0,'+auraPulse+')');
      dragonAura.addColorStop(0.5,'rgba(100,0,20,'+auraPulse*0.5+')');
      dragonAura.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=dragonAura;ctx.beginPath();ctx.ellipse(dragonCX,dragonCY,110,90,0,0,Math.PI*2);ctx.fill();
      // Small floating embers
      for(let ei=0;ei<6;ei++){
        const ea=((frameCount*0.03)+ei*1.05)%(Math.PI*2);
        const er=50+Math.sin(frameCount*0.04+ei)*20;
        const ex=dragonCX+Math.cos(ea)*er;const ey=dragonCY+Math.sin(ea)*er*0.5;
        ctx.globalAlpha=0.5+Math.sin(frameCount*0.1+ei)*0.3;
        ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(ex,ey,1.5,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
      drawDragon(ctx,rx,ry,m.dir<0,frame2);
    }
    if(night&&nightScale!==1) ctx.restore();

    // (Red eye night effect removed)

    // HP bar — red-tinted at night
    const bw=m.w+10;const bx=rx-5;const by=ry-10;
    ctx.fillStyle=night?'rgba(60,0,0,0.85)':'rgba(0,0,0,0.7)';ctx.fillRect(bx,by,bw,5);
    const hpColor=night
      ? (m.hp/m.maxHp>0.6?'#ff4444':m.hp/m.maxHp>0.3?'#ff8800':'#cc0000')
      : (m.hp/m.maxHp>0.6?'#e74c3c':m.hp/m.maxHp>0.3?'#f39c12':'#c0392b');
    ctx.fillStyle=hpColor;ctx.fillRect(bx,by,bw*(m.hp/m.maxHp),5);
    if(night){
      // Night glow on HP bar
      ctx.save();ctx.shadowColor=hpColor;ctx.shadowBlur=6;
      ctx.fillStyle=hpColor;ctx.fillRect(bx,by,bw*(m.hp/m.maxHp),5);
      ctx.restore();
    }
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=0.5;ctx.strokeRect(bx,by,bw,5);

    // Night warning label above monster
    if(night){
      ctx.save();
      ctx.globalAlpha=0.7+Math.sin(frameCount*0.1)*0.3;
      ctx.fillStyle='rgba(150,0,0,0.8)';
      ctx.fillRect(cx-18,ry-22,36,10);
      ctx.fillStyle='#ff6666';ctx.font='bold 20px "Times New Roman"';ctx.textAlign='center';
      ctx.fillText('🌑 ĐÊM',cx,ry-14);
      ctx.restore();
    }

    // Dragon boss label — Hắc Long Vương (no "trùm cuối")
    if(m.type==='dragon'){
      ctx.save();
      const pulse=0.85+Math.sin(frameCount*0.07)*0.15;
      ctx.globalAlpha=pulse;
      // Name tag above dragon
      const lblW=130;const lblX=cx-lblW/2;const lblY=ry-32;
      ctx.fillStyle='rgba(20,0,40,0.92)';ctx.fillRect(lblX,lblY,lblW,15);
      ctx.strokeStyle='#8800cc';ctx.lineWidth=1;ctx.strokeRect(lblX,lblY,lblW,15);
      ctx.fillStyle='#cc66ff';ctx.font='bold 18px "Times New Roman"';ctx.textAlign='center';
      ctx.shadowColor='#6600aa';ctx.shadowBlur=8;
      ctx.fillText('🐉 Hắc Long Vương',cx,lblY+12);
      ctx.shadowBlur=0;ctx.restore();
    }
    // Zone mini-dragon label
    if(m.type==='dragon_mini'){
      ctx.save();
      const pulse=0.7+Math.sin(frameCount*0.1)*0.3;
      ctx.globalAlpha=pulse;
      const lblW=100;const lblX=cx-lblW/2;const lblY=ry-22;
      const zoneColors=['#ff6600','#6666ff','#00aaff','#44cc00','#cc8800','#00cc88'];
      ctx.fillStyle='rgba(20,0,0,0.88)';ctx.fillRect(lblX,lblY,lblW,13);
      ctx.strokeStyle=zoneColors[m.zoneIdx%zoneColors.length];ctx.lineWidth=1;ctx.strokeRect(lblX,lblY,lblW,13);
      ctx.fillStyle=zoneColors[m.zoneIdx%zoneColors.length];ctx.font='bold 15px "Times New Roman"';ctx.textAlign='center';
      ctx.fillText('🐉 RỒNG KHU '+((m.zoneIdx||0)+1),cx,lblY+10);
      ctx.restore();
    }
    // Shadow dragon label (night only)
    if(m.type==='dragon_shadow'&&isNightTime()){
      ctx.save();
      const pulse=0.6+Math.sin(frameCount*0.07)*0.4;
      ctx.globalAlpha=pulse;
      const lblW=120;const lblX=cx-lblW/2;const lblY=ry-28;
      ctx.fillStyle='rgba(10,0,20,0.95)';ctx.fillRect(lblX,lblY,lblW,14);
      ctx.strokeStyle='#aa00ff';ctx.lineWidth=1;ctx.strokeRect(lblX,lblY,lblW,14);
      ctx.fillStyle='#cc44ff';ctx.font='bold 17px "Times New Roman"';ctx.textAlign='center';
      ctx.shadowColor='#8800ff';ctx.shadowBlur=10;
      ctx.fillText('👁 ÁM LONG VƯƠNG',cx,lblY+11);
      ctx.restore();
    }
    
    // Attack hint
    const dist=Math.hypot(P.x-m.wx-m.w/2,P.y-m.wy-m.h/2);
    const isShadowDragon=m.type==='dragon_shadow';
    const isNightOnly=m.nightOnly;
    if((isShadowDragon||isNightOnly)&&!isNightTime()) return; // skip night-only during day
    if(dist<80&&gameState==='WORLD'){
      ctx.save();ctx.globalAlpha=0.9;
      ctx.fillStyle=night?'rgba(80,0,0,0.9)':'rgba(0,0,0,0.8)';ctx.fillRect(rx-5,ry-22,m.w+10,12);
      ctx.fillStyle=night?'#ff4444':'#ff8a65';ctx.font='bold 15px "Times New Roman"';ctx.textAlign='center';
      ctx.fillText('[F] TẤN CÔNG',rx+m.w/2,ry-13);ctx.restore();
    }
  });
  
  // Player shadow
  ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle='#000';
  ctx.beginPath();ctx.ellipse(P.x-camX+P.w/2,GND+3,P.w/2,7,0,0,Math.PI*2);ctx.fill();ctx.restore();
  
  // Player
  const px2=P.x-camX;
  const walking=Math.abs(P.vx)>0.3&&P.onGround;
  const frame2=Math.floor(frameCount/7);
  drawKnight(ctx,px2,P.y,P.facing<0,walking,frame2);
  
  // Hurt flash
  if(P.hurtAnim>0){
    ctx.save();ctx.globalAlpha=P.hurtAnim/20*0.5;ctx.fillStyle='#ff0000';
    ctx.fillRect(px2,P.y,P.w,P.h);ctx.restore();
  }
  
  // Particles
  drawParticles(camX);
  
  // Fireflies
  drawFireflies(camX);

  // Night darkness overlay
  const tdNight=Math.sin(timeOfDay*Math.PI*2);
  if(tdNight<0){
    ctx.save();ctx.globalAlpha=Math.min(0.55,(-tdNight)*0.7);
    const nightOv=ctx.createLinearGradient(0,0,0,GH);
    nightOv.addColorStop(0,'#000418');nightOv.addColorStop(1,'#010206');
    ctx.fillStyle=nightOv;ctx.fillRect(0,0,GW,GH);
    ctx.restore();
  }

  // Vignette
  const vig=ctx.createRadialGradient(GW/2,GH/2,GH*0.3,GW/2,GH/2,GH*0.8);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,GW,GH);

  // Mini-map (bottom-right corner)
  const MM_W=110,MM_H=22,MM_X=GW-MM_W-6,MM_Y=GH-MM_H-6;
  ctx.save();ctx.globalAlpha=0.85;
  ctx.fillStyle='rgba(0,0,0,0.8)';ctx.fillRect(MM_X-2,MM_Y-2,MM_W+4,MM_H+4);
  ctx.strokeStyle='#8B6914';ctx.lineWidth=1;ctx.strokeRect(MM_X-2,MM_Y-2,MM_W+4,MM_H+4);
  // World bar
  ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(MM_X,MM_Y,MM_W,MM_H);
  // Houses on minimap
  houses.forEach(h=>{
    const hx=MM_X+Math.floor(h.worldX/WORLD_W*MM_W);
    ctx.fillStyle={math:'#e74c3c',geo:'#3498db',history:'#9b59b6',literature:'#2ecc40',civic:'#1a88dd',english:'#e84040'}[h.subj]||'#fff';
    ctx.fillRect(hx,MM_Y+2,4,MM_H-4);
  });
  // Monsters on minimap
  monsters.forEach(m=>{
    if(!m.alive)return;
    if(m.type==='dragon_shadow'&&!isNightTime())return;
    const mx=MM_X+Math.floor(m.wx/WORLD_W*MM_W);
    const col=m.type==='dragon'||m.type==='dragon_mini'||m.type==='fire_dragon'?'#ff8800':m.type==='dragon_shadow'?'#aa00ff':'#ff4444';
    ctx.fillStyle=col;ctx.fillRect(mx,MM_Y+MM_H/2-2,3,4);
  });
  // Chests on minimap
  chests.forEach(ch=>{
    if(ch.opened)return;
    const cx2=MM_X+Math.floor(ch.wx/WORLD_W*MM_W);
    ctx.fillStyle='#ffd700';ctx.fillRect(cx2,MM_Y+2,3,4);
  });
  // Underground entrance on minimap
  {const ux=MM_X+Math.floor(undergroundEntrance.worldX/WORLD_W*MM_W);ctx.fillStyle='#ff4400';ctx.fillRect(ux,MM_Y,3,5);}
  // Hell corridor on minimap — red gradient band
  {const hx1=MM_X+Math.floor(HELL_START/WORLD_W*MM_W);const hx2=MM_X+Math.floor(HELL_END/WORLD_W*MM_W);ctx.fillStyle='rgba(255,60,0,0.5)';ctx.fillRect(hx1,MM_Y,hx2-hx1,MM_H);}
  // Player on minimap
  const ppx=MM_X+Math.floor(P.x/WORLD_W*MM_W);
  ctx.fillStyle='#00ffff';ctx.fillRect(ppx-1,MM_Y,3,MM_H);
  ctx.restore();
}

function renderIndoor(house){
  const c=ictx;
  c.clearRect(0,0,GW,GH);
  
  // Background
  const bg=c.createLinearGradient(0,0,0,GH);
  const wallCols={math:'#1a0800',geo:'#00080f',history:'#0f0005',literature:'#00100a',civic:'#00080f',english:'#0f0005'};
  bg.addColorStop(0,wallCols[house.subj]||'#0a0510');
  bg.addColorStop(1,'#000308');
  c.fillStyle=bg;c.fillRect(0,0,GW,GH);
  
  // Stone wall texture
  c.fillStyle='rgba(255,255,255,0.03)';
  for(let row=0;row<12;row++){
    for(let col=0;col<8;col++){
      const ox=row%2*40;
      c.fillRect(col*80+ox,row*30,78,28);
      c.strokeStyle='rgba(255,255,255,0.05)';c.lineWidth=1;
      c.strokeRect(col*80+ox,row*30,78,28);
    }
  }
  
  // Floor
  const floor=c.createLinearGradient(0,GH*0.7,0,GH);
  floor.addColorStop(0,'#3d2010');floor.addColorStop(1,'#1a0a05');
  c.fillStyle=floor;c.fillRect(0,GH*0.7,GW,GH*0.3);
  // Floor planks
  for(let fp=0;fp<GW;fp+=60){
    c.fillStyle='rgba(0,0,0,0.2)';c.fillRect(fp,GH*0.7,59,GH*0.3);
    c.fillStyle='rgba(255,255,255,0.03)';c.fillRect(fp,GH*0.7,59,2);
  }
  // Floor/wall border
  const fwBord=c.createLinearGradient(0,GH*0.7-2,0,GH*0.7+6);
  fwBord.addColorStop(0,'#886633');fwBord.addColorStop(1,'#4a2810');
  c.fillStyle=fwBord;c.fillRect(0,GH*0.7-2,GW,8);
  
  // Torches on walls — enhanced flame
  [80,300,500,580].forEach((tx,i)=>{
    const ty=GH*0.25+Math.sin(i)*20;
    // Wall mount bracket
    c.fillStyle='#4a3020';c.fillRect(tx-7,ty+18,14,8);
    c.fillStyle='#6d4c41';c.fillRect(tx-4,ty-4,8,24);
    c.fillStyle='#8B5E3C';c.fillRect(tx-5,ty+20,10,4);
    // Torch bowl
    c.fillStyle='#5d4037';c.beginPath();c.arc(tx,ty+2,5,0,Math.PI*2);c.fill();
    // Flame layers
    const flTime=frameCount*0.18+i*1.7;
    const fl1=Math.sin(flTime)*2.5,fl2=Math.sin(flTime*1.3+1)*2,fl3=Math.sin(flTime*0.8+2)*1.5;
    c.save();
    // Outer flame
    c.shadowColor='#ff6600';c.shadowBlur=22+fl1*2;
    c.globalAlpha=0.7;c.fillStyle='#ff3300';
    c.beginPath();c.ellipse(tx+fl1*0.3,ty-6+fl1,6,11,0,0,Math.PI*2);c.fill();
    // Mid flame
    c.shadowColor='#ff9900';c.shadowBlur=14;
    c.globalAlpha=0.85;c.fillStyle='#ff6600';
    c.beginPath();c.ellipse(tx+fl2*0.4,ty-4+fl2,4.5,8,0,0,Math.PI*2);c.fill();
    // Inner flame
    c.globalAlpha=1;c.fillStyle='#ffaa00';
    c.beginPath();c.ellipse(tx+fl3*0.2,ty-2+fl3,3,6,0,0,Math.PI*2);c.fill();
    // Core white
    c.fillStyle='#ffffcc';
    c.beginPath();c.ellipse(tx+fl3*0.1,ty+1+fl3*0.5,1.5,3,0,0,Math.PI*2);c.fill();
    c.restore();
    // Warm glow on surroundings
    c.save();c.globalAlpha=0.12+Math.sin(flTime*0.5)*0.05;
    const tg=c.createRadialGradient(tx,ty,0,tx,ty,90);
    tg.addColorStop(0,'#ff8800');tg.addColorStop(0.5,'rgba(255,100,0,0.3)');tg.addColorStop(1,'transparent');
    c.fillStyle=tg;c.fillRect(tx-90,ty-90,180,180);c.restore();
    // Flickering light on floor
    c.save();c.globalAlpha=0.06+Math.sin(flTime*0.6)*0.03;
    const fg=c.createRadialGradient(tx,GH*0.7,0,tx,GH*0.7,60);
    fg.addColorStop(0,'#ff8800');fg.addColorStop(1,'transparent');
    c.fillStyle=fg;c.fillRect(tx-60,GH*(0.65),120,GH*0.28);
    c.restore();
  });
  
  // Blackboard / teaching board in center
  const bw=240,bh=80,bx=GW/2-120,by=GH*0.15;
  // Frame
  c.fillStyle='#5d3a20';c.fillRect(bx-8,by-8,bw+16,bh+16);
  c.fillStyle='#4a2f1a';c.fillRect(bx-6,by-6,bw+12,bh+12);
  const bdark={math:'#0a1a08',geo:'#080d14',history:'#140808',literature:'#080f08',civic:'#050d1a',english:'#1a0505'};
  c.fillStyle=bdark[house.subj]||'#0a1a0a';c.fillRect(bx,by,bw,bh);
  // Chalk effect text
  c.save();c.globalAlpha=0.85;
  c.fillStyle='#e8e8f0';c.font='bold 13px "Times New Roman"';c.textAlign='center';
  const bLabel={math:'📐 TOÁN HỌC',geo:'🌍 ĐỊA LÝ',history:'🏛 LỊCH SỬ',literature:'📖 VĂN HỌC',civic:'🏫 CÔNG DÂN',english:'🔤 TIẾNG ANH'};
  c.fillText(bLabel[house.subj]||'',GW/2,by+28);
  c.font='15px "Times New Roman"';c.fillStyle='rgba(200,200,200,0.7)';
  c.fillText('Hãy nói chuyện với '+house.npcName+' để bắt đầu!',GW/2,by+52);
  c.restore();
  // Board chalk tray
  c.fillStyle='#4a2f1a';c.fillRect(bx,by+bh+6,bw,6);
  // Chalk sticks
  ['#fff','#ffaa88','#88aaff'].forEach((col,i)=>{
    c.fillStyle=col;c.fillRect(bx+20+i*18,by+bh+7,14,4);
  });
  
  // (decorations removed)
  
  // Player sprite indoor (left side)
  const pix=60,piy=Math.floor(GH*0.7)-60;
  drawKnight(ictx,pix,piy,false,false,frameCount);
  
  // NPC sprite
  const npx=GW-120,npy=Math.floor(GH*0.7)-64;
  const nbob=Math.floor(Math.sin(frameCount*0.04)*2);
  if(house.npcType==='wizard') drawWizard(ictx,npx,npy+nbob,frameCount);
  else drawMerchant(ictx,npx,npy+nbob,frameCount);
  
  // NPC name bubble
  c.fillStyle='rgba(0,0,0,0.85)';
  c.fillRect(npx-10,npy-18,80,14);
  c.strokeStyle='#ffd700';c.lineWidth=1;c.strokeRect(npx-10,npy-18,80,14);
  c.fillStyle='#ffd700';c.font='13px "Times New Roman"';c.textAlign='center';
  c.fillText(house.npcName,npx+30,npy-8);
  
  // Exit door - sits on floor at GH*0.7
  const doorW=40,doorH=65;
  const doorX=18,doorY=Math.floor(GH*0.7)-doorH;
  c.fillStyle='#4a2f1a';c.fillRect(doorX-3,doorY-3,doorW+6,doorH+3);
  c.fillStyle='#5d3a20';c.fillRect(doorX,doorY,doorW,doorH);
  // Arch top
  c.fillStyle='#4a2f1a';c.beginPath();c.arc(doorX+doorW/2,doorY,doorW/2,Math.PI,0);c.fill();
  c.fillStyle='#5d3a20';c.beginPath();c.arc(doorX+doorW/2,doorY,doorW/2-3,Math.PI,0);c.fill();
  // Door panels
  c.fillStyle='#6d4c41';c.fillRect(doorX+3,doorY+8,doorW/2-5,doorH/2-4);
  c.fillStyle='#6d4c41';c.fillRect(doorX+doorW/2+2,doorY+8,doorW/2-5,doorH/2-4);
  c.fillStyle='#6d4c41';c.fillRect(doorX+3,doorY+doorH/2+4,doorW/2-5,doorH/2-8);
  c.fillStyle='#6d4c41';c.fillRect(doorX+doorW/2+2,doorY+doorH/2+4,doorW/2-5,doorH/2-8);
  // Handle
  c.fillStyle='#ffd700';c.beginPath();c.arc(doorX+doorW-8,doorY+doorH/2,3,0,Math.PI*2);c.fill();
  // Border glow
  c.strokeStyle='#ffd700';c.lineWidth=1.5;
  c.strokeRect(doorX-3,doorY-3,doorW+6,doorH+3);
  // Label above door
  c.fillStyle='#ffd700';c.font='13px "Times New Roman"';c.textAlign='center';
  c.fillText('← RA',doorX+doorW/2,doorY-8);
  
  // Bottom hint bar
  c.fillStyle='rgba(0,0,0,0.88)';c.fillRect(0,GH-22,GW,22);
  c.strokeStyle='rgba(139,105,20,0.5)';c.lineWidth=1;c.beginPath();c.moveTo(0,GH-22);c.lineTo(GW,GH-22);c.stroke();
  c.fillStyle='#888';c.font='13px "Times New Roman"';c.textAlign='center';
  c.fillText('E/SPACE = NÓI CHUYỆN  ·  B = CỬA HÀNG  ·  ESC = RA NGOÀI',GW/2,GH-8);
}

function startPuzzle(subject){
  // Show difficulty screen first for all subjects
  openDiffScreen(subject);
}
function renderPuzzle(){
  const el=document.getElementById('puzzle');
  el.classList.add('on');
  const q=pSess.qs[pSess.idx];
  const s=pSess.subject;
  const diff=pSess.diff||1;
  const dc=DIFF_CONFIG[diff];
  const caveCh = CHAPTERS.find(c=>c.id===s);
  const BG=caveCh?caveCh.bg:({math:'linear-gradient(160deg,#001500 0%,#002500 50%,#001000 100%)',geo:'linear-gradient(160deg,#000a1a 0%,#00152e 50%,#000508 100%)',history:'linear-gradient(160deg,#1a0500 0%,#2e0a00 50%,#0f0200 100%)',literature:'linear-gradient(160deg,#001a00 0%,#002a00 50%,#000f00 100%)',civic:'linear-gradient(160deg,#00061a 0%,#000f2e 50%,#000210 100%)',english:'linear-gradient(160deg,#1a0000 0%,#2a0508 50%,#0f0000 100%)'}[s]||'linear-gradient(135deg,#050010,#0a0020)');
  const BC=caveCh?caveCh.color:({math:'#2e7d32',geo:'#1565c0',history:'#bf360c',literature:'#1b5e20'}[s]||'#9b59b6');
  const BL=caveCh?`${caveCh.icon} ${caveCh.name.toUpperCase()}`:({math:'📐 TOÁN HỌC',geo:'🌏 ĐỊA LÝ',history:'🏛️ LỊCH SỬ',literature:'📖 VĂN HỌC'}[s]||'❓ BÀI HỌC');
  const diffColors=['','#4caf50','#8bc34a','#ffc107','#ff7043','#e91e63'];
  el.style.background=BG;
  let h=`
    <div style="display:flex;gap:6px;align-items:center;justify-content:center;margin-bottom:4px">
      <div class="p-badge" style="border-color:${BC};color:${BC};background:rgba(0,0,0,0.5)">${BL}</div>
      <div class="p-badge" style="border-color:${diffColors[diff]};color:${diffColors[diff]};background:rgba(0,0,0,0.5);font-size:5px">${dc.label}</div>
    </div>
    <div class="p-title">⚙ GIẢI ĐỐ ⚙</div>
    <div class="p-prog">${pSess.qs.map((_,i)=>`<div class="pdot${i<pSess.idx?' done':i===pSess.idx?' cur':''}"></div>`).join('')}</div>
    <div class="star-row">${[1,2,3].map(s=>`<span class="star-icon${pSess.score>=(s*pSess.qs.length/3*20)?' lit':''}">⭐</span>`).join('')}</div>
    <div class="p-score">🔥 Combo: ${comboCount} &nbsp;|&nbsp; 🪙 ${pSess.earned} xu &nbsp;|&nbsp; Câu ${pSess.idx+1}/${pSess.qs.length}</div>
  `;
  if(q.type==='mcq')h+=buildMCQ(q);
  else if(q.type==='imgpick')h+=buildImgPick(q);
  else if(q.type==='match')h+=buildMatch(q);
  else if(q.type==='wordfill')h+=buildWordFill(q);
  else if(q.type==='sort')h+=buildSort(q);
  else if(q.type==='truefalse')h+=buildTrueFalse(q);
  else if(q.type==='numpad')h+=buildNumpad(q);
  else if(q.type==='wordorder')h+=buildWordOrder(q);
  h+=`<div class="pnav"><button class="pnav-btn pexit" onclick="exitPuzzleEarly()">✕ THOÁT</button></div>`;
  el.innerHTML=h;
  if(q.type==='match')initMatch(q);
  else if(q.type==='wordfill')initWordFill(q);
  else if(q.type==='sort')initSort(q);
  else if(q.type==='wordorder')initWordOrder(q);
}
function buildMCQ(q){return`<div class="qcard"><div class="qnum">CÂU ${pSess.idx+1}</div><div class="qtext">${q.q}</div></div><div class="agrid">${['A','B','C','D'].map((l,i)=>`<button class="abtn" id="a${i}" onclick="checkMCQ(${i})"><span class="albl">${l}</span>${q.opts[i]}</button>`).join('')}</div>`;}
function checkMCQ(i){const q=pSess.qs[pSess.idx];document.querySelectorAll('.abtn').forEach(b=>b.disabled=true);document.getElementById('a'+i).classList.add(i===q.ans?'ok':'bad');if(i===q.ans){earnScore(20);}else{loseScore();document.getElementById('a'+q.ans).classList.add('ok');showNotif('❌ Đáp án đúng: '+q.opts[q.ans]);}setTimeout(nextQ,1400);}
function buildImgPick(q){return`<div class="qcard"><div class="qnum">CHỌN HÌNH</div><div class="qtext">${q.q}</div></div><div class="ipgrid">${q.opts.map((o,i)=>`<button class="ipbtn" id="ip${i}" onclick="checkIP(${i})"><span style="font-size:32px">${o.icon}</span><span style="font-family:"Times New Roman";font-size:7px">${o.l}</span></button>`).join('')}</div>`;}
function checkIP(i){const q=pSess.qs[pSess.idx];document.querySelectorAll('.ipbtn').forEach(b=>b.disabled=true);document.getElementById('ip'+i).classList.add(i===q.ans?'ok':'bad');if(i===q.ans){earnScore(20);}else{loseScore();document.getElementById('ip'+q.ans).classList.add('ok');showNotif('❌ Đáp án: '+q.opts[q.ans].l);}setTimeout(nextQ,1400);}
function buildMatch(q){
  return`<div class="match-wrap">
    <div class="mtitle">${q.q}</div>
    <div class="mcols">
      <div class="mcol">
        <div class="mhead">CỘT A</div>
        ${q.colA.map((a,i)=>`<div class="mitem" id="mA${i}" data-si="A" data-i="${i}">${a}</div>`).join('')}
      </div>
      <div class="marrs">
        ${q.colA.map((_,i)=>`<div class="marr" id="mr${i}">→</div>`).join('')}
      </div>
      <div class="mcol">
        <div class="mhead">CỘT B</div>
        ${q.colB.map((b,i)=>`<div class="mitem" id="mB${i}" data-si="B" data-i="${i}">${b}</div>`).join('')}
      </div>
    </div>
    <div style="text-align:center"><button class="mcheck" onclick="checkMatch()">✅ KIỂM TRA</button></div>
  </div>`;
}
function initMatch(q){
  matchPairs={};  // matchPairs[A_idx] = B_idx
  let selA=null;
  const resetHighlight=()=>{
    document.querySelectorAll('[data-si="A"]').forEach(e=>{
      if(!e.classList.contains('mok')&&!e.classList.contains('mbad')){
        e.classList.remove('sel');
        // re-highlight if already paired
        const ai=parseInt(e.dataset.i);
        if(matchPairs[ai]!==undefined) e.style.borderColor='#00bcd4';
        else e.style.borderColor='';
      }
    });
  };
  document.querySelectorAll('.mitem').forEach(el=>{
    el.addEventListener('click',()=>{
      if(el.classList.contains('mok')||el.classList.contains('mbad')) return;
      const si=el.dataset.si, idx=parseInt(el.dataset.i);
      if(si==='A'){
        // Toggle: click same A again = deselect
        if(selA===idx){ selA=null; el.classList.remove('sel'); return; }
        resetHighlight();
        selA=idx;
        el.classList.add('sel');
      } else {
        // Click B without selecting A — do nothing
        if(selA===null) return;
        // Remove old pairing if B was already used by another A
        for(const [ai,bi] of Object.entries(matchPairs)){
          if(bi===idx && parseInt(ai)!==selA){
            delete matchPairs[ai];
            document.getElementById('mA'+ai).style.borderColor='';
            document.getElementById('mr'+ai).textContent='→';
          }
        }
        // Remove old pairing of this A if existed
        if(matchPairs[selA]!==undefined){
          document.getElementById('mB'+matchPairs[selA]).style.borderColor='';
        }
        // Set new pair
        matchPairs[selA]=idx;
        document.getElementById('mA'+selA).classList.remove('sel');
        document.getElementById('mA'+selA).style.borderColor='#00bcd4';
        el.style.borderColor='#00bcd4';
        document.getElementById('mr'+selA).textContent='↔';
        selA=null;
        resetHighlight();
      }
    });
  });
}
function checkMatch(){
  const q=pSess.qs[pSess.idx];
  let ok=0;
  q.colA.forEach((_,i)=>{
    const cb=q.correct[i];
    const userAns=matchPairs[i];
    if(userAns===cb){
      ok++;
      document.getElementById('mA'+i).classList.add('mok');
      document.getElementById('mB'+cb).classList.add('mok');
      document.getElementById('mr'+i).classList.add('done');
      document.getElementById('mr'+i).textContent='✓';
    } else {
      document.getElementById('mA'+i).classList.add('mbad');
      document.getElementById('mA'+i).style.borderColor='';
      // Show correct B in green
      document.getElementById('mB'+cb).classList.add('mok');
      document.getElementById('mr'+i).textContent='✗';
      document.getElementById('mr'+i).style.color='#e74c3c';
    }
  });
  document.querySelector('.mcheck').disabled=true;
  const pts=Math.round(ok/q.colA.length*20);
  if(pts>0) earnScore(pts);
  showNotif(`✅ ${ok}/${q.colA.length} cặp đúng!`);
  setTimeout(nextQ,2500);
}
function buildWordFill(q){let s=q.sent;q.blanks.forEach((_,i)=>{s=s.replace('[?]',`<span class="blank" id="bl${i}" onclick="clickBlank(${i})">____</span>`);});return`<div class="wf-sent">${s}</div><div class="wbank">${q.bank.map((w,i)=>`<span class="wchip" id="wc${i}" onclick="clickChip(${i},'${w}')">${w}</span>`).join('')}</div><div style="text-align:center"><button class="mcheck" onclick="checkWF()">✅ KIỂM TRA</button></div>`;}
function initWordFill(q){wfFilled=new Array(q.blanks.length).fill(null);wfSelChip=null;wfSelBlank=null;}
function clickChip(i,w){if(document.getElementById('wc'+i).classList.contains('used'))return;document.querySelectorAll('.wchip').forEach(c=>c.classList.remove('sel'));if(wfSelChip&&wfSelChip.i===i){wfSelChip=null;return;}document.getElementById('wc'+i).classList.add('sel');wfSelChip={i,w};if(wfSelBlank!==null)doFill();}
function clickBlank(i){wfSelBlank=i;document.querySelectorAll('.blank').forEach(b=>b.style.borderBottomColor='#ffd700');document.getElementById('bl'+i).style.borderBottomColor='#00bcd4';if(wfSelChip)doFill();}
function doFill(){const bi=wfSelBlank,{i:ci,w}=wfSelChip;const prev=wfFilled[bi];if(prev!==null){const old=document.querySelector(`.wchip[onclick*="'${prev}'"]`);if(old)old.classList.remove('used');}wfFilled[bi]=w;const bl=document.getElementById('bl'+bi);bl.textContent=w;bl.classList.add('filled');bl.style.borderBottomColor='#2ecc40';document.getElementById('wc'+ci).classList.add('used');document.getElementById('wc'+ci).classList.remove('sel');wfSelChip=null;wfSelBlank=null;}
function checkWF(){const q=pSess.qs[pSess.idx];let ok=0;q.blanks.forEach((ans,i)=>{const bl=document.getElementById('bl'+i);if(wfFilled[i]===ans){ok++;bl.style.color='#2ecc40';}else{bl.textContent=ans;bl.style.color='#e74c3c';}});document.querySelector('.mcheck').disabled=true;const pts=Math.round(ok/q.blanks.length*20);if(pts>0)earnScore(pts);showNotif(`✅ ${ok}/${q.blanks.length} đúng!`);setTimeout(nextQ,1800);}
function buildSort(q){
  const hint=`<div style="font-size:9px;color:#666;text-align:center;margin-bottom:6px;font-family:'Times New Roman','IM Fell English SC',serif">✋ GIỮ VÀ KÉO ĐỂ SẮP XẾP</div>`;
  return`<div class="sort-q">${q.q}</div>${hint}<div class="sort-area" id="sort-area">${q.items.map((item,i)=>`<div class="sitem" id="si${i}">${item}</div>`).join('')}</div><div style="text-align:center"><button class="mcheck" onclick="checkSort()">✅ KIỂM TRA</button></div>`;
}
function initSort(q){
  const area=document.getElementById('sort-area');
  if(!area)return;

  // ── Shared state ──────────────────────────
  let dragEl=null;       // element being dragged
  let ghost=null;        // floating clone following finger
  let startX=0,startY=0;
  let origIndex=0;

  function getElAtPoint(x,y){
    // Hide ghost so elementFromPoint works
    if(ghost) ghost.style.display='none';
    const el=document.elementFromPoint(x,y);
    if(ghost) ghost.style.display='';
    if(!el) return null;
    return el.closest('.sitem');
  }

  function insertRelative(target){
    if(!dragEl||!target||target===dragEl) return;
    const all=[...area.children].filter(c=>c!==dragEl);
    const ti=all.indexOf(target);
    const di=[...area.children].indexOf(dragEl);
    if(di<[...area.children].indexOf(target)){
      area.insertBefore(dragEl,target.nextSibling);
    } else {
      area.insertBefore(dragEl,target);
    }
  }

  // ── TOUCH drag ────────────────────────────
  area.querySelectorAll('.sitem').forEach(el=>{
    el.addEventListener('touchstart',e=>{
      e.preventDefault();
      const t=e.touches[0];
      startX=t.clientX; startY=t.clientY;
      dragEl=el;
      el.style.opacity='0.35';
      el.style.transform='scale(1.08)';

      // Create ghost clone
      const r=el.getBoundingClientRect();
      ghost=el.cloneNode(true);
      ghost.style.cssText=`
        position:fixed;left:${r.left}px;top:${r.top}px;
        width:${r.width}px;height:${r.height}px;
        opacity:0.85;pointer-events:none;z-index:9999;
        border-color:#ffd700;box-shadow:0 4px 20px rgba(255,215,0,0.5);
        transition:none;margin:0;
      `;
      document.body.appendChild(ghost);
    },{passive:false});

    el.addEventListener('touchmove',e=>{
      if(!dragEl||!ghost) return;
      e.preventDefault();
      const t=e.touches[0];
      const dx=t.clientX-startX, dy=t.clientY-startY;
      const r=dragEl.getBoundingClientRect();
      ghost.style.left=(r.left+dx-(t.clientX-startX-dx+dx))+'px';
      // simpler: just follow finger
      ghost.style.left=(t.clientX - ghost.offsetWidth/2)+'px';
      ghost.style.top=(t.clientY - ghost.offsetHeight/2)+'px';

      const over=getElAtPoint(t.clientX,t.clientY);
      if(over&&over!==dragEl&&over.parentElement===area){
        // Preview highlight
        area.querySelectorAll('.sitem').forEach(s=>s.style.borderColor='rgba(255,255,255,0.15)');
        over.style.borderColor='#00bcd4';
        insertRelative(over);
      }
    },{passive:false});

    el.addEventListener('touchend',e=>{
      e.preventDefault();
      if(ghost){ghost.remove();ghost=null;}
      if(dragEl){
        dragEl.style.opacity='1';
        dragEl.style.transform='';
        dragEl=null;
      }
      area.querySelectorAll('.sitem').forEach(s=>s.style.borderColor='rgba(255,255,255,0.15)');
    },{passive:false});

    el.addEventListener('touchcancel',e=>{
      if(ghost){ghost.remove();ghost=null;}
      if(dragEl){dragEl.style.opacity='1';dragEl.style.transform='';dragEl=null;}
    },{passive:false});
  });

  // ── MOUSE drag (desktop fallback) ─────────
  area.querySelectorAll('.sitem').forEach(el=>{
    el.setAttribute('draggable','true');
    el.addEventListener('dragstart',e=>{
      dragEl=el;el.style.opacity='.4';
      e.dataTransfer.effectAllowed='move';
    });
    el.addEventListener('dragend',()=>{
      if(dragEl){dragEl.style.opacity='1';dragEl=null;}
    });
    el.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';});
    el.addEventListener('drop',e=>{
      e.preventDefault();
      if(dragEl&&dragEl!==el) insertRelative(el);
    });
  });
}
function checkSort(){const q=pSess.qs[pSess.idx];const area=document.getElementById('sort-area');const order=[...area.children].map(c=>c.textContent);const ok=q.correct.every((v,i)=>v===order[i]);document.querySelector('.mcheck').disabled=true;if(ok){area.querySelectorAll('.sitem').forEach(s=>s.style.borderColor='#2ecc40');earnScore(20);showNotif('✅ Đúng thứ tự!');}else{area.querySelectorAll('.sitem').forEach(s=>s.style.borderColor='#e74c3c');showNotif('❌ Sai thứ tự!');}setTimeout(nextQ,1800);}

