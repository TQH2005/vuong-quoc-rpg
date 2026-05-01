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
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Đếm, cộng trừ trong 10, so sánh
      {type:'mcq',q:'🍎 3 + 2 = ?',opts:['6','5','7','4'],ans:1},
      {type:'mcq',q:'🌟 7 - 3 = ?',opts:['6','5','3','4'],ans:3},
      {type:'mcq',q:'🐣 Bạn có 5 quả táo, ăn 2 quả. Còn lại mấy quả?',opts:['3','5','4','2'],ans:0},
      {type:'mcq',q:'🎈 4 + 4 = ?',opts:['7','8','6','9'],ans:1},
      {type:'mcq',q:'🐸 9 - 5 = ?',opts:['4','5','6','3'],ans:0},
      {type:'mcq',q:'🍭 2 + 6 = ?',opts:['7','9','8','6'],ans:2},
      {type:'mcq',q:'⚖️ So sánh: 7 ___ 5',opts:['= (bằng)','> (lớn hơn)','< (nhỏ hơn)','Không so sánh được'],ans:1},
      {type:'mcq',q:'⚖️ So sánh: 4 ___ 4',opts:['> (lớn hơn)','Không xác định','< (nhỏ hơn)','= (bằng)'],ans:3},
      {type:'mcq',q:'⚖️ Số nào LỚN HƠN: 3 hay 8?',opts:['3','Bằng nhau','8','Không biết'],ans:2},
      {type:'mcq',q:'⚖️ Số nào NHỎ HƠN: 6 hay 2?',opts:['Bằng nhau','Không so được','6','2'],ans:3},
      {type:'mcq',q:'🌈 Điền dấu đúng: 5 ___ 9',opts:['>','=','≠','<'],ans:3},
      {type:'mcq',q:'🌈 Điền dấu đúng: 10 ___ 7',opts:['≠','>','=','<'],ans:1},
      {type:'imgpick',q:'Hình nào có 4 góc?',opts:[{icon:'▲',l:'Tam giác'},{icon:'⬛',l:'Hình vuông'},{icon:'⭕',l:'Hình tròn'},{icon:'⬟',l:'Thoi'}],ans:1},
      {type:'sort',q:'Sắp xếp từ bé đến lớn:',items:['5','2','8','1'],correct:['1','2','5','8']},
      {type:'wordfill',sent:'Số liền sau của 6 là [?]. Số liền trước của 4 là [?].',blanks:['7','3'],bank:['2','3','5','7','8']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi): Cộng trừ trong 20, so sánh số, bảng 2,3,4,5
      {type:'mcq',q:'🔢 8 + 7 = ?',opts:['16','14','13','15'],ans:3},
      {type:'mcq',q:'🌟 17 - 8 = ?',opts:['9','10','8','7'],ans:0},
      {type:'mcq',q:'🍭 5 × 2 = ?',opts:['7','8','12','10'],ans:3},
      {type:'mcq',q:'🐸 4 × 3 = ?',opts:['13','10','12','11'],ans:2},
      {type:'mcq',q:'🎈 5 × 5 = ?',opts:['23','30','25','20'],ans:2},
      {type:'mcq',q:'⚖️ So sánh: 15 ___ 12',opts:['=','Không xác định','<','>'],ans:3},
      {type:'mcq',q:'⚖️ So sánh: 9 + 3 ___ 11',opts:['Không so được','>','=','<'],ans:1},
      {type:'mcq',q:'⚖️ So sánh: 4 × 2 ___ 10',opts:['<','=','>','≠'],ans:0},
      {type:'mcq',q:'⚖️ Số nào LỚN HƠN: 13 hay 17?',opts:['13','Bằng nhau','Không biết','17'],ans:3},
      {type:'mcq',q:'🌈 Điền dấu: 3 × 4 ___ 14',opts:['<','≠','>','='],ans:0},
      {type:'match',q:'Nối phép tính với kết quả:',colA:['2×5','3×4','4×4','5×3'],colB:['12','16','15','10'],correct:[3,0,1,2]},
      {type:'sort',q:'Sắp xếp từ bé đến lớn:',items:['18','11','15','9'],correct:['9','11','15','18']},
      {type:'wordfill',sent:'Bảng nhân 3: 3×5 = [?] và 3×6 = [?].',blanks:['15','18'],bank:['12','15','18','21','24']},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi): Nhân chia bảng cửu chương, so sánh biểu thức
      {type:'mcq',q:'🔢 6 × 7 = ?',opts:['42','48','45','40'],ans:0},
      {type:'mcq',q:'➗ 32 ÷ 4 = ?',opts:['8','9','6','7'],ans:0},
      {type:'mcq',q:'🔢 9 × 8 = ?',opts:['74','70','72','76'],ans:2},
      {type:'mcq',q:'➗ 63 ÷ 9 = ?',opts:['7','9','6','8'],ans:0},
      {type:'mcq',q:'⚖️ So sánh: 7 × 6 ___ 40',opts:['Không so được','>','=','<'],ans:1},
      {type:'mcq',q:'⚖️ So sánh: 56 ÷ 8 ___ 9',opts:['=','≠','<','>'],ans:2},
      {type:'mcq',q:'⚖️ So sánh: 5 × 9 ___ 45',opts:['≠','=','<','>'],ans:1},
      {type:'mcq',q:'⚖️ Biểu thức nào LỚN HƠN: 8×7 hay 9×6?',opts:['8×7 = 56','9×6 = 54','Bằng nhau','Không so được'],ans:0},
      {type:'mcq',q:'🧮 Tính: 4 × 8 + 5 = ?',opts:['41','37','45','39'],ans:1},
      {type:'mcq',q:'📐 Hình vuông cạnh 4cm. Chu vi là?',opts:['12cm','18cm','16cm','14cm'],ans:2},
      {type:'match',q:'Nối phép tính với kết quả đúng:',colA:['7×8','6×9','8×8','9×7'],colB:['54','56','64','63'],correct:[1,0,2,3]},
      {type:'sort',q:'Sắp xếp kết quả từ nhỏ đến lớn:',items:['8×6','7×7','9×5','6×8'],correct:['9×5','8×6','6×8','7×7']},
      {type:'wordfill',sent:'Lớp học có [?] học sinh, chia 6 nhóm đều, mỗi nhóm có [?] bạn.',blanks:['30','5'],bank:['24','30','36','4','5','6']},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi): Phân số, so sánh phân số, số thập phân
      {type:'mcq',q:'🔢 1/2 + 1/2 = ?',opts:['1/4','1/2','1','2'],ans:2},
      {type:'mcq',q:'📐 Hình chữ nhật dài 8cm, rộng 5cm. Chu vi là?',opts:['28cm','32cm','26cm','30cm'],ans:2},
      {type:'mcq',q:'🔢 3/4 của 20 = ?',opts:['15','16','12','18'],ans:0},
      {type:'mcq',q:'⚖️ So sánh phân số: 1/2 ___ 1/3',opts:['=','>','Không so được','<'],ans:1},
      {type:'mcq',q:'⚖️ So sánh: 3/4 ___ 2/4',opts:['=','<','>','≠'],ans:2},
      {type:'mcq',q:'⚖️ Phân số nào LỚN HƠN: 2/5 hay 3/5?',opts:['2/5','Bằng nhau','3/5','Không so được'],ans:2},
      {type:'mcq',q:'⚖️ So sánh: 0,5 ___ 1/2',opts:['=','<','≠','>'],ans:0},
      {type:'mcq',q:'🔢 0,5 × 4 = ?',opts:['3','2','2,5','1,5'],ans:1},
      {type:'mcq',q:'📊 Trung bình cộng của 6, 8, 10 là?',opts:['10','8','7','9'],ans:1},
      {type:'match',q:'Nối phân số với số thập phân:',colA:['1/2','1/4','3/4','1/5'],colB:['0,2','0,25','0,5','0,75'],correct:[2,1,3,0]},
      {type:'sort',q:'Sắp xếp phân số từ bé đến lớn:',items:['3/4','1/2','1/4','2/4'],correct:['1/4','1/2','2/4','3/4']},
      {type:'wordfill',sent:'Hình vuông cạnh [?]cm có diện tích [?]cm².',blanks:['6','36'],bank:['4','5','6','16','25','36']},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi): Bài toán có lời văn, so sánh nâng cao
      {type:'mcq',q:'🍎 Lan có 24 cái kẹo, chia đều cho 4 bạn. Mỗi bạn được mấy cái?',opts:['6','5','4','8'],ans:0},
      {type:'mcq',q:'🛒 Mua 3 cuốn sách, mỗi cuốn 12.000đ. Tổng tiền là?',opts:['60.000đ','36.000đ','48.000đ','24.000đ'],ans:1},
      {type:'mcq',q:'⚖️ So sánh: 4 × 9 ___ 3 × 12',opts:['≠','<','>','='],ans:3},
      {type:'mcq',q:'⚖️ So sánh: 100 - 35 ___ 70 - 5',opts:['=','<','≠','>'],ans:0},
      {type:'mcq',q:'⚖️ Số nào BẰNG: 2 × 15 hay 3 × 10?',opts:['Chúng bằng nhau','2×15 lớn hơn','Không so được','3×10 lớn hơn'],ans:0},
      {type:'mcq',q:'🔢 Tìm x: x + 15 = 30',opts:['x=20','x=12','x=15','x=10'],ans:2},
      {type:'mcq',q:'📐 Vườn hình vuông cạnh 7m. Chu vi là?',opts:['28m','35m','21m','42m'],ans:0},
      {type:'mcq',q:'⏰ Có 3 giờ = ? phút',opts:['200 phút','120 phút','150 phút','180 phút'],ans:3},
      {type:'match',q:'Nối bài toán với đáp số:',colA:['5×12','100-45','48÷6','3×15'],colB:['55','45','60','8'],correct:[2,0,3,1]},
      {type:'sort',q:'Sắp xếp từ nhỏ đến lớn:',items:['3×8','4×7','5×5','2×13'],correct:['5×5','3×8','4×7','2×13']},
      {type:'wordfill',sent:'Xe đi [?]km trong 2 giờ, mỗi giờ đi 30km. Còn [?]km nữa đến nơi cách 100km.',blanks:['60','40'],bank:['30','40','60','70','100']},
    ],
  },

  geo:{
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Xung quanh em
      {type:'mcq',q:'☀️ Mặt trời mọc ở hướng nào?',opts:['Nam','Đông','Bắc','Tây'],ans:1},
      {type:'mcq',q:'🌙 Ban đêm trên bầu trời có gì sáng?',opts:['Sao băng','Mặt trăng','Cầu vồng','Mặt trời'],ans:1},
      {type:'mcq',q:'🌧️ Khi nào trời mưa?',opts:['Trời có mây đen','Ban đêm','Trời có gió nhẹ','Trời nắng đẹp'],ans:0},
      {type:'mcq',q:'🌏 Thủ đô của Việt Nam là?',opts:['Huế','Sài Gòn','Hà Nội','Đà Nẵng'],ans:2},
      {type:'mcq',q:'🗺️ Nước Việt Nam nằm ở châu lục nào?',opts:['Châu Phi','Châu Á','Châu Mỹ','Châu Âu'],ans:1},
      {type:'mcq',q:'🌊 Biển ở phía Đông Việt Nam gọi là?',opts:['Biển Bắc','Biển Đỏ','Biển Đen','Biển Đông'],ans:3},
      {type:'mcq',q:'🌈 Cầu vồng xuất hiện sau khi nào?',opts:['Mưa','Sấm','Tuyết','Bão'],ans:0},
      {type:'imgpick',q:'Con vật nào sống dưới nước?',opts:[{icon:'🐟',l:'Cá'},{icon:'🐔',l:'Gà'},{icon:'🐄',l:'Bò'},{icon:'🐕',l:'Chó'}],ans:0},
      {type:'match',q:'Nối mùa với đặc điểm:',colA:['Mùa hè','Mùa đông','Mùa xuân','Mùa thu'],colB:['Lá vàng rụng','Hoa nở đẹp','Trời lạnh','Trời nắng nóng'],correct:[3,2,1,0]},
      {type:'wordfill',sent:'Mặt trời mọc ở phía [?] và lặn ở phía [?].',blanks:['Đông','Tây'],bank:['Đông','Tây','Nam','Bắc']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi): Việt Nam cơ bản
      {type:'mcq',q:'🏔️ Núi cao nhất Việt Nam là?',opts:['Ngọc Linh','Phanxipăng','Bạch Mã','Lang Biang'],ans:1},
      {type:'mcq',q:'🌊 Sông nào dài nhất Việt Nam?',opts:['Sông Mã','Sông Cửu Long','Sông Đà','Sông Hồng'],ans:1},
      {type:'mcq',q:'🏙️ Thành phố lớn nhất Việt Nam là?',opts:['Hải Phòng','TP.Hồ Chí Minh','Đà Nẵng','Hà Nội'],ans:1},
      {type:'mcq',q:'🌴 Đồng bằng nào rộng nhất Việt Nam?',opts:['Đồng bằng Thanh Hóa','Đồng bằng sông Hồng','Đồng bằng miền Trung','Đồng bằng sông Cửu Long'],ans:3},
      {type:'mcq',q:'🗺️ Việt Nam có bao nhiêu tỉnh thành?',opts:['60','63','65','58'],ans:1},
      {type:'mcq',q:'🌤️ Miền Nam Việt Nam có mấy mùa?',opts:['Chỉ 1 mùa','4 mùa','2 mùa (mưa và khô)','3 mùa'],ans:2},
      {type:'imgpick',q:'Loại quả nào trồng nhiều ở Đà Lạt?',opts:[{icon:'🍓',l:'Dâu tây'},{icon:'🍌',l:'Chuối'},{icon:'🍍',l:'Dứa'},{icon:'🥥',l:'Dừa'}],ans:0},
      {type:'match',q:'Nối vùng với đặc sản:',colA:['Hà Nội','Huế','TP.HCM','Đà Lạt'],colB:['Bún bò Huế','Phở','Cơm tấm','Dâu tây'],correct:[1,0,2,3]},
      {type:'wordfill',sent:'Việt Nam thuộc khu vực [?] Á, nằm trên bán đảo [?].',blanks:['Đông Nam','Đông Dương'],bank:['Đông Nam','Đông Bắc','Nam','Đông Dương','Ấn Độ']},
      {type:'sort',q:'Sắp xếp từ Bắc vào Nam:',items:['Đà Nẵng','Hà Nội','Cần Thơ','Huế'],correct:['Hà Nội','Huế','Đà Nẵng','Cần Thơ']},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi): Châu Á và thế giới cơ bản
      {type:'mcq',q:'🗾 Thủ đô Nhật Bản là?',opts:['Seoul','Beijing','Osaka','Tokyo'],ans:3},
      {type:'mcq',q:'🌏 Sông nào dài nhất thế giới?',opts:['Amazon','Nile','Mississippi','Dương Tử'],ans:1},
      {type:'mcq',q:'🏔️ Đỉnh núi cao nhất thế giới là?',opts:['Kilimanjaro','K2','Fuji','Everest'],ans:3},
      {type:'mcq',q:'🌊 Đại dương nào lớn nhất thế giới?',opts:['Thái Bình Dương','Ấn Độ Dương','Đại Tây Dương','Bắc Băng Dương'],ans:0},
      {type:'mcq',q:'🗺️ Đất nước nào có diện tích lớn nhất thế giới?',opts:['Trung Quốc','Mỹ','Canada','Nga'],ans:3},
      {type:'mcq',q:'🌍 Châu nào có nhiều nước nhất?',opts:['Châu Mỹ','Châu Âu','Châu Phi','Châu Á'],ans:2},
      {type:'match',q:'Nối nước với thủ đô:',colA:['Pháp','Nhật Bản','Trung Quốc','Hàn Quốc'],colB:['Seoul','Paris','Tokyo','Bắc Kinh'],correct:[1,2,3,0]},
      {type:'imgpick',q:'Động vật nào sống ở vùng cực?',opts:[{icon:'🐧',l:'Chim cánh cụt'},{icon:'🐆',l:'Báo'},{icon:'🦁',l:'Sư tử'},{icon:'🐊',l:'Cá sấu'}],ans:0},
      {type:'wordfill',sent:'ASEAN gồm [?] nước ở khu vực [?] Á.',blanks:['10','Đông Nam'],bank:['8','10','12','Đông Nam','Đông Bắc','Nam']},
      {type:'sort',q:'Sắp xếp các lục địa từ lớn đến nhỏ:',items:['Châu Âu','Châu Á','Châu Phi','Châu Úc'],correct:['Châu Á','Châu Phi','Châu Âu','Châu Úc']},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi): Kiến thức địa lý mở rộng
      {type:'mcq',q:'🌡️ Vùng nào của Trái Đất nóng nhất?',opts:['Vùng cực','Vùng sa mạc','Vùng ôn đới','Vùng xích đạo'],ans:3},
      {type:'mcq',q:'🏔️ Dãy Alps nằm ở châu nào?',opts:['Châu Phi','Châu Á','Châu Âu','Châu Mỹ'],ans:2},
      {type:'mcq',q:'🌊 Eo biển nào ngăn cách châu Á và châu Mỹ?',opts:['Eo Gibraltar','Eo Bering','Eo Hormuz','Eo Malacca'],ans:1},
      {type:'mcq',q:'🗺️ Sa mạc Sahara nằm ở châu nào?',opts:['Châu Mỹ','Châu Úc','Châu Á','Châu Phi'],ans:3},
      {type:'mcq',q:'🌏 Nước nào đông dân nhất thế giới?',opts:['Trung Quốc','Indonesia','Mỹ','Ấn Độ'],ans:3},
      {type:'mcq',q:'🏝️ Đảo nào lớn nhất thế giới?',opts:['New Guinea','Borneo','Sumatra','Greenland'],ans:3},
      {type:'match',q:'Nối nước với châu lục:',colA:['Brazil','Kenya','Canada','Australia'],colB:['Châu Úc','Châu Mỹ','Châu Phi','Châu Mỹ (Bắc)'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Việt Nam giáp với 3 nước: [?], [?] và Campuchia.',blanks:['Trung Quốc','Lào'],bank:['Trung Quốc','Lào','Thái Lan','Myanmar','Campuchia']},
      {type:'sort',q:'Sắp xếp các đới khí hậu từ xích đạo ra cực:',items:['Ôn đới','Cận nhiệt','Cực đới','Nhiệt đới'],correct:['Nhiệt đới','Cận nhiệt','Ôn đới','Cực đới']},
      {type:'mcq',q:'🌐 Kinh tuyến 0° đi qua thành phố nào?',opts:['Berlin','London','Paris','Rome'],ans:1},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi): Địa lý nâng cao
      {type:'mcq',q:'🌋 Núi lửa nào nổi tiếng nhất Nhật Bản?',opts:['Unzen','Sakurajima','Fuji','Aso'],ans:2},
      {type:'mcq',q:'🌊 Đại dương nào nhỏ nhất thế giới?',opts:['Đại Tây Dương','Nam Đại Dương','Bắc Băng Dương','Ấn Độ Dương'],ans:2},
      {type:'mcq',q:'🗺️ Sông Amazon chảy qua nước nào là chủ yếu?',opts:['Colombia','Brazil','Peru','Argentina'],ans:1},
      {type:'mcq',q:'🌍 Lục địa nào không có người ở thường xuyên?',opts:['Châu Đại Dương','Châu Phi','Châu Nam Cực','Châu Á'],ans:2},
      {type:'mcq',q:'🏔️ Everest nằm trên biên giới 2 nước nào?',opts:['Nepal-Trung Quốc','Trung Quốc-Ấn Độ','Bhutan-Trung Quốc','Nepal-Ấn Độ'],ans:0},
      {type:'mcq',q:'🌊 Hồ nào lớn nhất thế giới?',opts:['Hồ Baikal','Hồ Superior','Biển Caspi','Hồ Victoria'],ans:2},
      {type:'match',q:'Nối quốc gia với thủ đô:',colA:['Thái Lan','Indonesia','Malaysia','Philippines'],colB:['Manila','Kuala Lumpur','Bangkok','Jakarta'],correct:[2,3,1,0]},
      {type:'wordfill',sent:'Việt Nam có đường bờ biển dài khoảng [?]km và [?] tỉnh thành.',blanks:['3.260','63'],bank:['2.000','3.260','4.500','58','63','65']},
      {type:'sort',q:'Sắp xếp theo thứ tự từ đông sang tây:',items:['Nhật Bản','Việt Nam','Ấn Độ','Anh'],correct:['Anh','Ấn Độ','Việt Nam','Nhật Bản']},
      {type:'mcq',q:'🌐 Múi giờ Việt Nam là UTC+?',opts:['+5','+7','+6','+8'],ans:1},
    ],
  },

  history:{
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Lịch sử cơ bản
      {type:'mcq',q:'🇻🇳 Thủ đô của Việt Nam là?',opts:['Sài Gòn','Huế','Đà Nẵng','Hà Nội'],ans:3},
      {type:'mcq',q:'👨‍👩‍👧 Ai được gọi là "Cha già dân tộc" của Việt Nam?',opts:['Trần Hưng Đạo','Lê Lợi','Vua Hùng','Bác Hồ'],ans:3},
      {type:'mcq',q:'🎉 Ngày Quốc khánh Việt Nam là ngày nào?',opts:['1/1','19/5','30/4','2/9'],ans:3},
      {type:'mcq',q:'🏯 Lá cờ Việt Nam có màu gì?',opts:['Đỏ và vàng','Vàng và trắng','Xanh và vàng','Đỏ và trắng'],ans:0},
      {type:'mcq',q:'⚔️ Hai Bà Trưng là những anh hùng nào?',opts:['Hai người phụ nữ','Hai người đàn ông','Hai vị vua','Hai vị tướng nam'],ans:0},
      {type:'mcq',q:'🌟 Ngày 30/4 là ngày gì?',opts:['Giải phóng miền Nam','Tết Nguyên Đán','Ngày lao động','Quốc khánh'],ans:0},
      {type:'imgpick',q:'Vua Hùng là ai trong lịch sử Việt Nam?',opts:[{icon:'👑',l:'Vua đầu tiên của Việt Nam'},{icon:'⚔️',l:'Tướng quân anh hùng'},{icon:'📜',l:'Nhà thơ nổi tiếng'},{icon:'🏛️',l:'Quan lại thời xưa'}],ans:0},
      {type:'match',q:'Nối ngày với sự kiện:',colA:['2/9','30/4','19/5','1/6'],colB:['Ngày sinh Bác Hồ','Ngày Thiếu nhi','Quốc khánh','Giải phóng miền Nam'],correct:[2,3,0,1]},
      {type:'wordfill',sent:'Bác Hồ đọc Tuyên ngôn Độc lập ngày [?] tháng [?] năm 1945.',blanks:['2','9'],bank:['1','2','3','8','9','10']},
      {type:'sort',q:'Sắp xếp theo thứ tự thời gian:',items:['Giải phóng miền Nam','Cách mạng tháng Tám','Hai Bà Trưng khởi nghĩa','Bác Hồ đọc Tuyên ngôn'],correct:['Hai Bà Trưng khởi nghĩa','Cách mạng tháng Tám','Bác Hồ đọc Tuyên ngôn','Giải phóng miền Nam']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi)
      {type:'mcq',q:'🏹 Lê Lợi khởi nghĩa chống lại quân nào?',opts:['Quân Nguyên','Quân Tống','Quân Thanh','Quân Minh'],ans:3},
      {type:'mcq',q:'⚔️ Ai đánh tan 29 vạn quân Thanh năm 1789?',opts:['Quang Trung','Gia Long','Lê Lợi','Nguyễn Ánh'],ans:0},
      {type:'mcq',q:'🌊 Trận Bạch Đằng năm 938 do ai chỉ huy?',opts:['Trần Hưng Đạo','Đinh Bộ Lĩnh','Lý Thái Tổ','Ngô Quyền'],ans:3},
      {type:'mcq',q:'🗺️ Chiến thắng Điện Biên Phủ năm nào?',opts:['1975','1968','1954','1945'],ans:2},
      {type:'mcq',q:'📜 Ai viết "Nam quốc sơn hà"?',opts:['Lê Lợi','Lý Thường Kiệt','Nguyễn Trãi','Trần Hưng Đạo'],ans:1},
      {type:'mcq',q:'🏯 Ai lập ra nhà Nguyễn?',opts:['Minh Mạng','Gia Long','Thiệu Trị','Tự Đức'],ans:1},
      {type:'imgpick',q:'Trần Hưng Đạo nổi tiếng về điều gì?',opts:[{icon:'⚔️',l:'Ba lần đánh thắng quân Mông Nguyên'},{icon:'📜',l:'Viết thơ văn nổi tiếng'},{icon:'🏯',l:'Xây dựng kinh đô'},{icon:'🌊',l:'Khám phá biển cả'}],ans:0},
      {type:'match',q:'Nối anh hùng với chiến công:',colA:['Ngô Quyền','Trần Hưng Đạo','Lê Lợi','Quang Trung'],colB:['Đánh Thanh 1789','Bạch Đằng 938','Chống Mông Nguyên','Đuổi quân Minh'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Năm [?], Ngô Quyền đánh tan quân [?] trên sông Bạch Đằng.',blanks:['938','Nam Hán'],bank:['938','979','Nam Hán','Tống','Nguyên']},
      {type:'sort',q:'Sắp xếp đúng thứ tự:',items:['Nhà Trần','Nhà Ngô','Nhà Nguyễn','Nhà Lý'],correct:['Nhà Ngô','Nhà Lý','Nhà Trần','Nhà Nguyễn']},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi)
      {type:'mcq',q:'📜 "Bình Ngô Đại Cáo" do ai viết?',opts:['Lê Lợi','Lý Thường Kiệt','Trần Hưng Đạo','Nguyễn Trãi'],ans:3},
      {type:'mcq',q:'🏹 Khởi nghĩa Yên Thế do ai lãnh đạo?',opts:['Phan Chu Trinh','Phan Bội Châu','Hoàng Hoa Thám','Nguyễn Thái Học'],ans:2},
      {type:'mcq',q:'🌟 Đảng Cộng sản Việt Nam thành lập năm nào?',opts:['1941','1945','1930','1925'],ans:2},
      {type:'mcq',q:'🗺️ Hiệp định Geneva 1954 chia đôi Việt Nam theo vĩ tuyến?',opts:['16°','20°','17°','13°'],ans:2},
      {type:'mcq',q:'🏰 Nhà Lý dời đô về Thăng Long năm nào?',opts:['1054','1009','968','1010'],ans:3},
      {type:'mcq',q:'🐘 Bà Triệu nổi tiếng với hình ảnh nào?',opts:['Cưỡi ngựa bắn tên','Bơi qua sông lớn','Leo núi cao','Cưỡi voi đánh giặc'],ans:3},
      {type:'imgpick',q:'Cách mạng tháng Tám 1945 diễn ra tại?',opts:[{icon:'🏙️',l:'Hà Nội, Sài Gòn, Huế'},{icon:'🌊',l:'Miền biển'},{icon:'🏔️',l:'Vùng núi'},{icon:'🌾',l:'Nông thôn'}],ans:0},
      {type:'match',q:'Nối phong trào với lãnh tụ:',colA:['Yên Thế','Đông Du','Duy Tân','VNQDĐ'],colB:['Nguyễn Thái Học','Hoàng Hoa Thám','Phan Chu Trinh','Phan Bội Châu'],correct:[1,3,2,0]},
      {type:'wordfill',sent:'Chiến dịch [?] kết thúc bằng chiến thắng [?] năm 1954.',blanks:['Đông Xuân','Điện Biên Phủ'],bank:['Đông Xuân','Hồ Chí Minh','Điện Biên Phủ','Huế','Biên giới']},
      {type:'sort',q:'Sắp xếp theo thứ tự:',items:['Thành lập Đảng CSVN','Cách mạng tháng Tám','Hiệp định Paris','Hiệp định Geneva'],correct:['Thành lập Đảng CSVN','Cách mạng tháng Tám','Hiệp định Geneva','Hiệp định Paris']},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi)
      {type:'mcq',q:'📜 Văn Miếu Quốc Tử Giám xây dựng năm nào?',opts:['1128','1010','968','1070'],ans:3},
      {type:'mcq',q:'⚔️ Trận Như Nguyệt 1077 diễn ra trên sông nào?',opts:['Sông Lam','Sông Hồng','Sông Bạch Đằng','Sông Cầu'],ans:3},
      {type:'mcq',q:'🌊 Nhà Trần dùng kế gì đánh Mông Nguyên lần 2?',opts:['Phục kích rừng núi','Vườn không nhà trống','Cầu viện nước ngoài','Tấn công bất ngờ'],ans:1},
      {type:'mcq',q:'🌟 Tên thật của vua Quang Trung là?',opts:['Nguyễn Lữ','Nguyễn Huệ','Nguyễn Ánh','Nguyễn Nhạc'],ans:1},
      {type:'mcq',q:'📚 Hội Việt Nam Cách mạng Thanh niên do ai thành lập?',opts:['Hồ Chí Minh','Nguyễn Thái Học','Trần Phú','Phan Bội Châu'],ans:0},
      {type:'mcq',q:'⚔️ Trận Điện Biên Phủ kéo dài bao nhiêu ngày?',opts:['65 ngày','35 ngày','45 ngày','55 ngày'],ans:3},
      {type:'match',q:'Nối tên cũ với tên mới:',colA:['Thăng Long','Gia Định','Thuận Hóa','Phú Xuân'],colB:['Huế','Hà Nội','TP.Hồ Chí Minh','Cũng là Huế'],correct:[1,2,0,3]},
      {type:'wordfill',sent:'Lý Thường Kiệt tấn công quân [?] năm [?] trước khi họ xâm lược.',blanks:['Tống','1075'],bank:['Tống','Nguyên','1075','1077','938']},
      {type:'sort',q:'3 lần Mông Nguyên xâm lược theo thứ tự:',items:['Lần 3 (1288)','Lần 1 (1258)','Lần 2 (1285)'],correct:['Lần 1 (1258)','Lần 2 (1285)','Lần 3 (1288)']},
      {type:'mcq',q:'🗺️ Ai ký Hiệp ước Nhâm Tuất 1862 nhượng đất cho Pháp?',opts:['Vua Khải Định','Vua Hàm Nghi','Vua Tự Đức','Vua Thành Thái'],ans:2},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi)
      {type:'mcq',q:'📜 Văn Miếu mở trường dạy học năm nào?',opts:['1086','1070','1076','1156'],ans:2},
      {type:'mcq',q:'⚔️ Ai là Thái sư đầu tiên của triều Trần?',opts:['Trần Nhân Tông','Trần Quốc Tuấn','Trần Ích Tắc','Trần Thủ Độ'],ans:3},
      {type:'mcq',q:'🏹 Khởi nghĩa Lam Sơn bắt đầu năm nào?',opts:['1418','1428','1407','1427'],ans:0},
      {type:'mcq',q:'🗺️ Ai là đại tướng chỉ huy chiến dịch Điện Biên Phủ?',opts:['Phạm Văn Đồng','Võ Nguyên Giáp','Hồ Chí Minh','Trường Chinh'],ans:1},
      {type:'mcq',q:'📚 Bác Hồ sinh năm nào?',opts:['1888','1894','1892','1890'],ans:3},
      {type:'mcq',q:'⚔️ Phong trào Cần Vương do vua nào phát động?',opts:['Vua Tự Đức','Vua Hàm Nghi','Vua Đồng Khánh','Vua Duy Tân'],ans:1},
      {type:'match',q:'Nối vua/chúa với triều đại:',colA:['Đinh Tiên Hoàng','Lý Thái Tổ','Lê Lợi','Nguyễn Ánh'],colB:['Nhà Nguyễn','Nhà Đinh','Nhà Lý','Nhà Lê'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Đại tướng [?] chỉ huy chiến dịch [?] đại thắng năm 1954.',blanks:['Võ Nguyên Giáp','Điện Biên Phủ'],bank:['Võ Nguyên Giáp','Hồ Chí Minh','Điện Biên Phủ','Biên Giới','Tây Bắc']},
      {type:'sort',q:'Sắp xếp vương triều theo thứ tự:',items:['Nhà Lý','Nhà Ngô','Nhà Trần','Nhà Đinh'],correct:['Nhà Ngô','Nhà Đinh','Nhà Lý','Nhà Trần']},
      {type:'mcq',q:'🌟 Hiệp định Paris 1973 kết thúc chiến tranh với nước nào?',opts:['Mỹ','Trung Quốc','Nhật Bản','Pháp'],ans:0},
    ],
  },

  literature:{
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Tiếng Việt cơ bản
      {type:'mcq',q:'🔤 "Bút" và "vở" dùng để làm gì?',opts:['Chơi đùa','Nấu ăn','Học bài viết chữ','Ăn uống'],ans:2},
      {type:'mcq',q:'🌙 Từ nào trái nghĩa với "ngày"?',opts:['Chiều','Đêm','Sáng','Trưa'],ans:1},
      {type:'mcq',q:'🌸 Từ nào đồng nghĩa với "xinh đẹp"?',opts:['Bẩn','Xấu','Dữ','Đẹp'],ans:3},
      {type:'mcq',q:'🐾 Con mèo kêu tiếng gì?',opts:['Meo meo','Ò ó o','Gâu gâu','Ủn ỉn'],ans:0},
      {type:'mcq',q:'🌈 Câu nào có từ chỉ màu sắc?',opts:['Cô giáo dạy giỏi','Bạn học chăm chỉ','Bầu trời màu xanh','Con mèo chạy nhanh'],ans:2},
      {type:'mcq',q:'📚 Câu chuyện "Tấm Cám" kể về ai?',opts:['Ông và cháu','Mẹ và con','Hai anh em','Hai chị em'],ans:3},
      {type:'mcq',q:'🔤 Chữ cái đầu tiên trong bảng chữ cái là gì?',opts:['C','A','Ă','B'],ans:1},
      {type:'imgpick',q:'Hình nào mô tả đúng câu "Con chim đang bay"?',opts:[{icon:'🐦',l:'Chim bay trên trời'},{icon:'🐦',l:'Chim đứng trên cành'},{icon:'🥚',l:'Trứng chim'},{icon:'🪺',l:'Tổ chim'}],ans:0},
      {type:'wordfill',sent:'Mặt trời [?] ở phía Đông, trời [?] và ấm áp.',blanks:['mọc','sáng'],bank:['mọc','lặn','sáng','tối','lạnh','nóng']},
      {type:'sort',q:'Sắp xếp thành câu đúng:',items:['học','Em','chăm','bài'],correct:['Em','học','bài','chăm']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi): Từ loại, câu đơn giản
      {type:'mcq',q:'📝 Từ nào là danh từ?',opts:['chạy','nhanh','bàn','đẹp'],ans:2},
      {type:'mcq',q:'🌿 Từ nào là động từ?',opts:['học','hoa','đỏ','nhà'],ans:0},
      {type:'mcq',q:'🎨 Từ nào là tính từ?',opts:['viết','sách','bút','xanh'],ans:3},
      {type:'mcq',q:'🔤 Câu "Em đi học" có mấy từ?',opts:['4 từ','3 từ','2 từ','5 từ'],ans:1},
      {type:'mcq',q:'📚 Trong truyện "Cô bé Lọ Lem", cô bé đến dự gì?',opts:['Lễ hội làng','Cuộc thi hát','Tiệc sinh nhật','Dạ hội hoàng cung'],ans:3},
      {type:'mcq',q:'🌙 "Ông trăng" trong câu "Ông trăng sáng tỏ" là hình ảnh gì?',opts:['Đèn đường','Ông già','Mặt trăng','Ngôi sao'],ans:2},
      {type:'imgpick',q:'Hình ảnh nào gắn với câu thơ "Mặt trời xuống biển như hòn lửa"?',opts:[{icon:'🌅',l:'Hoàng hôn trên biển'},{icon:'🌄',l:'Bình minh trên núi'},{icon:'🌊',l:'Sóng biển'},{icon:'🔥',l:'Lửa cháy'}],ans:0},
      {type:'match',q:'Nối từ với loại từ:',colA:['chạy','đẹp','nhà','học sinh'],colB:['Danh từ','Động từ','Tính từ','Danh từ'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Bầu trời [?] xanh, những đám mây [?] trắng bay.',blanks:['trong','bông'],bank:['trong','đục','bông','tròn','dày','mỏng']},
      {type:'sort',q:'Sắp xếp thành câu đúng:',items:['trường','Chúng em','đến','đi'],correct:['Chúng em','đi','đến','trường']},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi): Tập đọc, hiểu văn
      {type:'mcq',q:'📖 Truyện "Dế Mèn phiêu lưu ký" do ai viết?',opts:['Nam Cao','Nguyên Hồng','Nguyễn Du','Tô Hoài'],ans:3},
      {type:'mcq',q:'📝 Đoạn văn mô tả cảnh vật gọi là?',opts:['Kể chuyện','Thuyết minh','Miêu tả','Nghị luận'],ans:2},
      {type:'mcq',q:'🌸 Câu "Bông hoa như ngôi sao" dùng biện pháp gì?',opts:['Điệp ngữ','Nhân hóa','So sánh','Ẩn dụ'],ans:2},
      {type:'mcq',q:'📚 "Kiều" là nhân vật trong tác phẩm nào?',opts:['Lục Vân Tiên','Truyện Kiều','Chinh Phụ Ngâm','Cung Oán Ngâm Khúc'],ans:1},
      {type:'mcq',q:'🎭 Câu "Con chim hót líu lo" có từ tượng thanh nào?',opts:['líu lo','hót','câu','con chim'],ans:0},
      {type:'mcq',q:'✍️ Phần mở bài trong văn kể chuyện nên làm gì?',opts:['Kể diễn biến chi tiết','Viết cảm nghĩ','Nêu kết thúc','Giới thiệu câu chuyện'],ans:3},
      {type:'match',q:'Nối biện pháp tu từ với ví dụ:',colA:['So sánh','Nhân hóa','Ẩn dụ','Điệp ngữ'],colB:['Mặt trời là trái tim của vũ trụ','Hoa hoa hoa nở khắp nơi','Con sông đang hát','Trăng như chiếc thuyền']},
      {type:'wordfill',sent:'Bài văn gồm 3 phần: [?], thân bài và [?].',blanks:['Mở bài','Kết bài'],bank:['Mở bài','Nội dung','Kết bài','Giới thiệu','Tóm tắt']},
      {type:'sort',q:'Sắp xếp các bước viết bài văn:',items:['Viết kết bài','Lập dàn ý','Viết thân bài','Viết mở bài'],correct:['Lập dàn ý','Viết mở bài','Viết thân bài','Viết kết bài']},
      {type:'mcq',q:'🔤 Từ "mặt trời" trong "Mặt trời của mẹ, con nằm trên lưng" nghĩa là gì?',opts:['Ánh sáng','Đứa con yêu quý','Ngọn lửa','Mặt trời thật'],ans:1},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi)
      {type:'mcq',q:'📖 "Truyện Kiều" có bao nhiêu câu thơ lục bát?',opts:['2.214','3.254','4.112','3.976'],ans:1},
      {type:'mcq',q:'✍️ Nguyễn Du sống vào triều đại nào?',opts:['Nhà Nguyễn','Nhà Lê','Thời Pháp thuộc','Nhà Trần'],ans:0},
      {type:'mcq',q:'📝 Thể thơ lục bát có số tiếng mỗi cặp câu là?',opts:['6-8','5-7','7-7','4-8'],ans:0},
      {type:'mcq',q:'🎭 Câu "Bác Hồ như ánh mặt trời" dùng biện pháp gì?',opts:['Hoán dụ','So sánh','Ẩn dụ','Nhân hóa'],ans:1},
      {type:'mcq',q:'📚 Ai viết bài thơ "Đêm nay Bác không ngủ"?',opts:['Minh Huệ','Huy Cận','Chính Hữu','Tố Hữu'],ans:0},
      {type:'mcq',q:'🌸 "Đất nước mình ngộ quá phải không anh" là thơ của ai?',opts:['Thùy Linh','Trần Đăng Khoa','Nguyễn Nhật Ánh','Lê Minh Quốc'],ans:3},
      {type:'match',q:'Nối tác giả với tác phẩm:',colA:['Nguyễn Du','Tô Hoài','Nam Cao','Nguyên Hồng'],colB:['Dế Mèn phiêu lưu ký','Chí Phèo','Truyện Kiều','Những ngày thơ ấu'],correct:[2,0,1,3]},
      {type:'wordfill',sent:'Thể loại [?] kể lại câu chuyện có nhân vật, cốt truyện. Thể loại [?] bộc lộ cảm xúc.',blanks:['tự sự','trữ tình'],bank:['tự sự','nghị luận','trữ tình','miêu tả','thuyết minh']},
      {type:'sort',q:'Sắp xếp cấu trúc bài văn nghị luận:',items:['Lý lẽ dẫn chứng','Kết luận','Nêu vấn đề','Phân tích'],correct:['Nêu vấn đề','Lý lẽ dẫn chứng','Phân tích','Kết luận']},
      {type:'mcq',q:'🔤 Từ láy trong câu "Cô bé thỏ thẻ kể chuyện" là?',opts:['cô bé','thỏ thẻ','chuyện','kể'],ans:1},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi)
      {type:'mcq',q:'📖 "Lục Vân Tiên" do ai sáng tác?',opts:['Đoàn Thị Điểm','Nguyễn Đình Chiểu','Hồ Xuân Hương','Nguyễn Du'],ans:1},
      {type:'mcq',q:'✍️ Hồ Xuân Hương nổi tiếng với thể thơ gì?',opts:['Lục bát','Thất ngôn bát cú','Ngũ ngôn','Song thất lục bát'],ans:1},
      {type:'mcq',q:'📝 "Chinh phụ ngâm" do ai dịch sang tiếng Việt?',opts:['Nguyễn Du','Nguyễn Gia Thiều','Đoàn Thị Điểm','Hồ Xuân Hương'],ans:2},
      {type:'mcq',q:'🎭 Biện pháp "vắt dòng" trong thơ là gì?',opts:['Lặp lại từ','Dùng từ lạ','Câu thơ dài','Ý thơ tiếp sang dòng sau'],ans:3},
      {type:'mcq',q:'📚 Ai được mệnh danh là "thần đồng thơ" với bài thơ về hạt gạo?',opts:['Trần Đăng Khoa','Tố Hữu','Xuân Diệu','Huy Cận'],ans:0},
      {type:'mcq',q:'🌸 "Thương vợ" là bài thơ của?',opts:['Phan Bội Châu','Nguyễn Khuyến','Tú Xương','Tản Đà'],ans:2},
      {type:'match',q:'Nối thể loại với đặc điểm:',colA:['Lục bát','Thất ngôn bát cú','Song thất lục bát','Thơ tự do'],colB:['Không giới hạn số tiếng','6-8 tiếng xen kẽ','7 tiếng 8 câu','7-7-6-8'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Nguyễn Du tên chữ là [?], quê ở [?], Hà Tĩnh.',blanks:['Tố Như','Tiên Điền'],bank:['Tố Như','Thanh Hiên','Tiên Điền','Nghi Xuân','Nam Đàn']},
      {type:'sort',q:'Sắp xếp các giai đoạn văn học Việt Nam:',items:['Văn học hiện đại','Văn học dân gian','Văn học chữ Hán','Văn học chữ Nôm'],correct:['Văn học dân gian','Văn học chữ Hán','Văn học chữ Nôm','Văn học hiện đại']},
      {type:'mcq',q:'🔤 "Đất Nước" là bài thơ nổi tiếng của?',opts:['Xuân Quỳnh','Tố Hữu','Nguyễn Khoa Điềm','Chế Lan Viên'],ans:2},
    ],
  },

  civic:{
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Quy tắc ứng xử cơ bản
      {type:'mcq',q:'🚦 Đèn đỏ giao thông có nghĩa là gì?',opts:['Đi thật nhanh','Dừng lại','Rẽ phải','Bấm còi'],ans:1},
      {type:'mcq',q:'🤝 Khi gặp người lớn tuổi, em nên làm gì?',opts:['Bỏ qua không chào','Chạy thật nhanh','Chào hỏi lễ phép','Nhìn chằm chằm'],ans:2},
      {type:'mcq',q:'🏫 Ở trường, em nên làm gì khi thầy cô đang giảng bài?',opts:['Nói chuyện riêng','Ngủ gật','Nghịch điện thoại','Chú ý lắng nghe'],ans:3},
      {type:'mcq',q:'🌿 Em nên làm gì để bảo vệ môi trường?',opts:['Đốt rác ở sân','Vứt rác bừa bãi','Chặt cây lấy củi','Bỏ rác vào thùng'],ans:3},
      {type:'mcq',q:'🚸 Khi qua đường, em cần làm gì?',opts:['Chạy thật nhanh','Nhìn hai bên rồi đi qua','Đóng mắt bước','Đi giữa đường'],ans:1},
      {type:'mcq',q:'💧 Tại sao cần tiết kiệm nước?',opts:['Vì uống nhiều không tốt','Vì nước không tái tạo nhanh','Vì không cần thiết','Vì nước đắt tiền'],ans:1},
      {type:'imgpick',q:'Hành động nào là đúng?',opts:[{icon:'🗑️',l:'Bỏ rác đúng chỗ'},{icon:'🌳',l:'Bẻ cành cây'},{icon:'🐟',l:'Đánh cá bằng điện'},{icon:'🔊',l:'Ồn ào nơi công cộng'}],ans:0},
      {type:'match',q:'Nối hành động với kết quả:',colA:['Rửa tay thường xuyên','Ăn nhiều rau','Ngủ đủ giấc','Tập thể dục'],colB:['Cơ thể khỏe mạnh','Không bị bệnh','Tốt cho tiêu hóa','Tinh thần tỉnh táo'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Em cần [?] bố mẹ và [?] thầy cô giáo.',blanks:['kính trọng','lễ phép với'],bank:['kính trọng','bắt nạt','lễ phép với','giận','vâng lời']},
      {type:'sort',q:'Sắp xếp việc làm tốt theo thứ tự ưu tiên ở trường:',items:['Chơi với bạn','Học bài','Giúp đỡ bạn khó','Ăn trưa'],correct:['Học bài','Giúp đỡ bạn khó','Ăn trưa','Chơi với bạn']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi)
      {type:'mcq',q:'🏛️ Ai là người đứng đầu nhà nước Việt Nam hiện nay?',opts:['Chủ tịch Quốc hội','Tổng bí thư','Thủ tướng','Chủ tịch nước'],ans:3},
      {type:'mcq',q:'🌟 Hội đồng nhân dân là cơ quan gì?',opts:['Cơ quan tư pháp','Cơ quan đại diện nhân dân','Cơ quan an ninh','Cơ quan hành pháp'],ans:1},
      {type:'mcq',q:'📜 Hiến pháp Việt Nam quy định điều gì?',opts:['Quyền và nghĩa vụ cơ bản','Quy tắc giao thông','Điều lệ trường học','Luật thuế'],ans:0},
      {type:'mcq',q:'🤝 Quyền trẻ em bao gồm quyền gì?',opts:['Được học, vui chơi, được bảo vệ','Chỉ quyền học','Chỉ quyền vui chơi','Chỉ quyền ăn no'],ans:0},
      {type:'mcq',q:'🌿 Bảo vệ môi trường là trách nhiệm của ai?',opts:['Chỉ nhà nước','Mọi người dân','Chỉ các nhà khoa học','Chỉ người lớn'],ans:1},
      {type:'mcq',q:'🚑 Số điện thoại nào gọi cấp cứu y tế?',opts:['112','115','113','114'],ans:1},
      {type:'match',q:'Nối số điện thoại với dịch vụ:',colA:['113','114','115','1800.599.920'],colB:['Y tế cấp cứu','Đường dây trẻ em','Cảnh sát','Phòng cháy chữa cháy'],correct:[2,3,0,1]},
      {type:'wordfill',sent:'Công dân Việt Nam có quyền [?] và nghĩa vụ [?] bảo vệ Tổ quốc.',blanks:['bầu cử','thực hiện'],bank:['bầu cử','kinh doanh','thực hiện','không cần','từ chối']},
      {type:'sort',q:'Sắp xếp cơ quan nhà nước:',items:['Tòa án','Quốc hội','Chính phủ','Chủ tịch nước'],correct:['Quốc hội','Chủ tịch nước','Chính phủ','Tòa án']},
      {type:'mcq',q:'💚 Trẻ em có quyền được bảo vệ khỏi điều gì?',opts:['Bạo lực và xâm hại','Tham gia hoạt động','Học tập','Lao động nhẹ'],ans:0},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi)
      {type:'mcq',q:'📜 Luật Giáo dục quy định độ tuổi học mẫu giáo là?',opts:['2-5 tuổi','5-8 tuổi','4-7 tuổi','3-6 tuổi'],ans:3},
      {type:'mcq',q:'🌐 Quyền bình đẳng có nghĩa là?',opts:['Mọi người đều có quyền như nhau','Không ai được làm sai','Mọi người đều giàu','Mọi người đều giống nhau'],ans:0},
      {type:'mcq',q:'🏦 Thuế là gì?',opts:['Tiền vay ngân hàng','Tiền ủng hộ từ thiện','Khoản đóng góp cho nhà nước để phát triển xã hội','Tiền phạt vi phạm'],ans:2},
      {type:'mcq',q:'🌿 Công ước LHQ về Quyền Trẻ em được thông qua năm nào?',opts:['1979','1989','1999','2009'],ans:1},
      {type:'mcq',q:'🏛️ Quốc hội Việt Nam họp mấy kỳ mỗi năm?',opts:['1 kỳ','2 kỳ','3 kỳ','4 kỳ'],ans:1},
      {type:'mcq',q:'⚖️ Tư pháp là cơ quan nào?',opts:['Tòa án','Quốc hội','Chính phủ','Công an'],ans:0},
      {type:'match',q:'Nối quyền với ví dụ:',colA:['Quyền học tập','Quyền vui chơi','Quyền được bảo vệ','Quyền tự do ngôn luận'],colB:['Được nói ý kiến','Đến trường học','Được chơi đùa','Không bị bạo lực'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Nhà nước Việt Nam là nhà nước [?] của nhân dân, do nhân dân, vì [?].',blanks:['pháp quyền','nhân dân'],bank:['pháp quyền','quân chủ','nhân dân','vua','chính phủ']},
      {type:'sort',q:'Sắp xếp quá trình ban hành luật:',items:['Biểu quyết thông qua','Công bố và thực hiện','Xây dựng dự thảo','Thảo luận và chỉnh sửa'],correct:['Xây dựng dự thảo','Thảo luận và chỉnh sửa','Biểu quyết thông qua','Công bố và thực hiện']},
      {type:'mcq',q:'🌍 Việt Nam gia nhập Liên Hợp Quốc năm nào?',opts:['1977','1954','1969','1986'],ans:0},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi)
      {type:'mcq',q:'🏛️ Hệ thống chính trị Việt Nam bao gồm mấy nhánh quyền lực?',opts:['2','3','5','4'],ans:1},
      {type:'mcq',q:'📊 GDP là viết tắt của?',opts:['Tổng sản phẩm quốc dân','Tốc độ tăng trưởng','Ngân sách nhà nước','Tổng sản phẩm quốc nội'],ans:3},
      {type:'mcq',q:'🌐 Việt Nam là thành viên của tổ chức nào?',opts:['OPEC','NATO','ASEAN và WTO','G7'],ans:2},
      {type:'mcq',q:'⚖️ Pháp luật có đặc điểm gì khác quy tắc đạo đức?',opts:['Không ai phải tuân theo','Chỉ áp dụng với người giàu','Có thể thay đổi tùy người','Có tính bắt buộc, được nhà nước bảo đảm'],ans:3},
      {type:'mcq',q:'🌿 Ai chịu trách nhiệm bảo vệ môi trường theo Luật?',opts:['Chỉ nhà nước','Chỉ các công ty','Chỉ nông dân','Tất cả tổ chức và cá nhân'],ans:3},
      {type:'mcq',q:'📜 Hiến pháp Việt Nam hiện hành được ban hành năm nào?',opts:['2018','2013','1992','2001'],ans:1},
      {type:'match',q:'Nối tổ chức với chức năng:',colA:['Quốc hội','Chính phủ','Tòa án','Viện kiểm sát'],colB:['Kiểm sát hoạt động tư pháp','Lập pháp — ban hành luật','Hành pháp — điều hành','Xét xử các vụ án'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'Công dân từ [?] tuổi trở lên có quyền bầu cử; từ [?] tuổi có thể ứng cử.',blanks:['18','21'],bank:['16','18','21','25','30']},
      {type:'sort',q:'Sắp xếp cấp hành chính từ cao xuống:',items:['Phường/Xã/Thị trấn','Quận/Huyện','Tỉnh/Thành phố','Trung ương'],correct:['Trung ương','Tỉnh/Thành phố','Quận/Huyện','Phường/Xã/Thị trấn']},
      {type:'mcq',q:'🤝 Nghĩa vụ nào sau đây là của công dân khi đủ tuổi?',opts:['Nghĩa vụ quân sự','Không cần đóng thuế','Chỉ đi bầu cử','Không phải thực hiện gì'],ans:0},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi)
      {type:'mcq',q:'🌐 Số thành viên của Liên Hợp Quốc hiện nay là khoảng?',opts:['193','213','153','183'],ans:0},
      {type:'mcq',q:'📊 Chỉ số HDI đo lường điều gì?',opts:['Tăng trưởng kinh tế','Mức độ dân chủ','Phát triển con người','Tự do báo chí'],ans:2},
      {type:'mcq',q:'⚖️ Nhà nước pháp quyền có đặc điểm cốt lõi là?',opts:['Luật pháp cao hơn mọi quyền lực','Quân đội kiểm soát','Vua đứng đầu','Đảng duy nhất'],ans:0},
      {type:'mcq',q:'🌿 Thỏa thuận Paris về biến đổi khí hậu ký năm?',opts:['2015','2005','2010','2020'],ans:0},
      {type:'mcq',q:'🏛️ Mô hình "tam quyền phân lập" chia quyền lực thành?',opts:['Đảng, Nhà nước, Nhân dân','Lập pháp, Hành pháp, Tư pháp','Trung ương, Địa phương, Cơ sở','Hành chính, Kinh tế, Xã hội'],ans:1},
      {type:'mcq',q:'📜 Công ước UNCRC (Quyền Trẻ Em) có bao nhiêu điều?',opts:['34','64','44','54'],ans:2},
      {type:'match',q:'Nối tổ chức quốc tế với lĩnh vực:',colA:['WHO','UNESCO','UNICEF','WTO'],colB:['Trẻ em','Thương mại','Sức khỏe','Giáo dục và Văn hóa'],correct:[2,3,0,1]},
      {type:'wordfill',sent:'Việt Nam đổi mới từ năm [?], hội nhập quốc tế mạnh mẽ từ năm [?].',blanks:['1986','1995'],bank:['1975','1986','1995','2000','2007']},
      {type:'sort',q:'Sắp xếp các giai đoạn phát triển của Việt Nam:',items:['Đổi mới 1986','Thống nhất 1975','Độc lập 1945','Vào WTO 2007'],correct:['Độc lập 1945','Thống nhất 1975','Đổi mới 1986','Vào WTO 2007']},
      {type:'mcq',q:'🌍 Khủng hoảng khí hậu toàn cầu chủ yếu do nguyên nhân nào?',opts:['Phát thải khí nhà kính','Động đất núi lửa','Thay đổi quỹ đạo Trái Đất','Hoạt động Mặt Trời'],ans:0},
    ],
  },

  english:{
    1:[ // CẤP 1 — Tân Binh (6-7 tuổi): Số, màu, vật dụng
      {type:'mcq',q:'🔤 "Apple" có nghĩa là gì?',opts:['Cam','Táo','Chuối','Dâu'],ans:1},
      {type:'mcq',q:'🎨 "Red" có nghĩa là màu gì?',opts:['Đỏ','Xanh','Vàng','Trắng'],ans:0},
      {type:'mcq',q:'🔢 "Three" là số mấy?',opts:['1','3','2','4'],ans:1},
      {type:'mcq',q:'🐱 "Cat" có nghĩa là gì?',opts:['Gà','Chó','Chim','Mèo'],ans:3},
      {type:'mcq',q:'🌞 "Sun" có nghĩa là gì?',opts:['Mặt trời','Đám mây','Ngôi sao','Mặt trăng'],ans:0},
      {type:'mcq',q:'🎒 "School bag" có nghĩa là gì?',opts:['Bút chì','Cặp sách','Bàn học','Sách vở'],ans:1},
      {type:'mcq',q:'🔤 Con số "Five" là?',opts:['5','3','6','4'],ans:0},
      {type:'imgpick',q:'Hình nào là "Dog"?',opts:[{icon:'🐕',l:'Dog'},{icon:'🐈',l:'Cat'},{icon:'🐟',l:'Fish'},{icon:'🐦',l:'Bird'}],ans:0},
      {type:'match',q:'Nối tiếng Anh với tiếng Việt:',colA:['Book','Pen','Table','Chair'],colB:['Ghế','Sách','Bàn','Bút'],correct:[1,3,2,0]},
      {type:'wordfill',sent:'I have a [?] and a [?] in my bag.',blanks:['book','pen'],bank:['book','dog','pen','cat','chair']},
    ],
    2:[ // CẤP 2 — Chiến Binh (7-8 tuổi): Câu đơn, động từ cơ bản
      {type:'mcq',q:'🔤 "I am a student" nghĩa là?',opts:['Tôi là công nhân','Tôi là bác sĩ','Tôi là học sinh','Tôi là giáo viên'],ans:2},
      {type:'mcq',q:'🌈 "The sky is blue" nghĩa là?',opts:['Hoa màu xanh','Bầu trời màu xanh','Trời đang mưa','Biển rất đẹp'],ans:1},
      {type:'mcq',q:'🔢 "How old are you?" hỏi về điều gì?',opts:['Tên','Nghề nghiệp','Tuổi','Địa chỉ'],ans:2},
      {type:'mcq',q:'📚 "This is my book" nghĩa là?',opts:['Đây là sách của bạn','Đây là sách đẹp','Đây là sách của tôi','Đây là sách của thầy'],ans:2},
      {type:'mcq',q:'🌞 "What is the weather like?" hỏi về gì?',opts:['Địa điểm','Màu sắc','Giờ giấc','Thời tiết'],ans:3},
      {type:'mcq',q:'🔤 "We" có nghĩa là?',opts:['Chúng tôi/ta','Họ','Bạn','Tôi'],ans:0},
      {type:'imgpick',q:'Hình nào minh họa câu "She is running"?',opts:[{icon:'🏃‍♀️',l:'Cô gái đang chạy'},{icon:'😴',l:'Ngủ'},{icon:'📚',l:'Đọc sách'},{icon:'🍽️',l:'Ăn cơm'}],ans:0},
      {type:'match',q:'Nối câu với nghĩa:',colA:['I like cats','She is tall','We play football','He reads books'],colB:['Anh ấy đọc sách','Tôi thích mèo','Cô ấy cao','Chúng tôi chơi bóng'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'My name [?] Lan. I [?] eight years old.',blanks:['is','am'],bank:['is','are','am','be','was']},
      {type:'sort',q:'Sắp xếp thành câu đúng:',items:['a','I','student','am'],correct:['I','am','a','student']},
    ],
    3:[ // CẤP 3 — Anh Hùng (8-9 tuổi): Thì hiện tại, từ vựng mở rộng
      {type:'mcq',q:'🔤 "She plays piano every day" dùng thì gì?',opts:['Hiện tại đơn','Tiếp diễn','Tương lai','Quá khứ'],ans:0},
      {type:'mcq',q:'📝 Chọn từ đúng: "He ___ to school by bus"',opts:['goes','going','gone','go'],ans:0},
      {type:'mcq',q:'🌍 "Where do you live?" hỏi về gì?',opts:['Nghề nghiệp','Sở thích','Nơi ở','Tuổi'],ans:2},
      {type:'mcq',q:'🔢 "There are twelve months in a year" — "twelve" là?',opts:['12','13','10','11'],ans:0},
      {type:'mcq',q:'🌸 "Beautiful" có nghĩa là?',opts:['Đẹp','Chậm','Nhanh','Xấu'],ans:0},
      {type:'mcq',q:'📚 "I don\'t like homework" nghĩa là?',opts:['Tôi thích bài tập về nhà','Tôi không thích bài tập về nhà','Tôi làm bài tập','Tôi quên bài tập'],ans:1},
      {type:'match',q:'Nối nghề nghiệp với tiếng Anh:',colA:['Teacher','Doctor','Engineer','Farmer'],colB:['Nông dân','Giáo viên','Bác sĩ','Kỹ sư'],correct:[1,2,3,0]},
      {type:'wordfill',sent:'I [?] breakfast every morning. My mother [?] coffee.',blanks:['eat','drinks'],bank:['eat','eats','drink','drinks','ate']},
      {type:'sort',q:'Sắp xếp thành câu hỏi đúng:',items:['you','do','like','what'],correct:['what','do','you','like']},
      {type:'mcq',q:'🔤 "Happy" trái nghĩa là?',opts:['Sad','Fun','Joyful','Excited'],ans:0},
    ],
    4:[ // CẤP 4 — Huyền Thoại (9-10 tuổi)
      {type:'mcq',q:'📝 "She was reading when I called" dùng thì gì?',opts:['Quá khứ tiếp diễn','Hiện tại đơn','Tương lai','Quá khứ đơn'],ans:0},
      {type:'mcq',q:'🔤 "Although it rained, we went out" — "although" có nghĩa?',opts:['Khi','Vì','Mặc dù','Vì vậy'],ans:2},
      {type:'mcq',q:'📚 Câu bị động của "Tom wrote this letter" là?',opts:['Tom is writing this letter','This letter was written by Tom','This letter writes Tom','Tom have written this letter'],ans:1},
      {type:'mcq',q:'🌍 "Would you like some tea?" là câu gì?',opts:['Lời đề nghị/mời','Câu cảm thán','Câu lệnh','Câu hỏi thông tin'],ans:0},
      {type:'mcq',q:'🔢 "A dozen" là bao nhiêu?',opts:['13','11','12','10'],ans:2},
      {type:'mcq',q:'📝 Chọn đúng: "Neither he nor she ___ right"',opts:['were','am','is','are'],ans:2},
      {type:'match',q:'Nối từ với nghĩa:',colA:['Environment','Pollution','Recycle','Sustainable'],colB:['Tái chế','Ô nhiễm','Bền vững','Môi trường'],correct:[3,1,0,2]},
      {type:'wordfill',sent:'If I [?] rich, I [?] travel around the world.',blanks:['were','would'],bank:['were','was','would','will','could']},
      {type:'sort',q:'Sắp xếp thành câu đúng:',items:['been','have','I','to Hanoi'],correct:['I','have','been','to Hanoi']},
      {type:'mcq',q:'🌸 "I\'m looking forward to meeting you" — "looking forward to" nghĩa là?',opts:['Sợ hãi khi','Mong đợi được','Ngạc nhiên khi','Buồn bã khi'],ans:1},
    ],
    5:[ // CẤP 5 — Thần Thánh (10 tuổi)
      {type:'mcq',q:'📝 "Had she known the truth, she would not have lied" là câu điều kiện loại?',opts:['Hỗn hợp','Loại 2','Loại 1','Loại 3'],ans:3},
      {type:'mcq',q:'🔤 "Despite the heavy rain, they continued" — "despite" giống với?',opts:['However','Therefore','Although','Because of'],ans:2},
      {type:'mcq',q:'📚 Tìm lỗi: "She suggested to go to the cinema"',opts:['Không có lỗi','Nên là "went"','Nên là "suggested going"','"She" sai'],ans:2},
      {type:'mcq',q:'🌍 "The more you practice, the better you get" là cấu trúc gì?',opts:['So sánh kép','Câu điều kiện','Câu bị động','Câu gián tiếp'],ans:0},
      {type:'mcq',q:'🔢 "Millennium" có nghĩa là bao nhiêu năm?',opts:['1000 năm','500 năm','100 năm','10000 năm'],ans:0},
      {type:'mcq',q:'📝 "It\'s time you went to bed" — "went" ở đây dùng ở dạng nào?',opts:['Hiện tại','Tương lai','Quá khứ giả định','Nguyên thể'],ans:2},
      {type:'match',q:'Nối thành ngữ với nghĩa:',colA:['Break a leg','Hit the books','Under the weather','Cost an arm and a leg'],colB:['Ốm/mệt','Chúc may mắn','Rất đắt','Chăm chỉ học'],correct:[1,3,0,2]},
      {type:'wordfill',sent:'The report [?] be submitted by Monday. It [?] already been reviewed.',blanks:['must','has'],bank:['must','should','has','have','will']},
      {type:'sort',q:'Sắp xếp câu đúng ngữ pháp:',items:['been','have','to Paris','I never'],correct:['I','have','never','been','to Paris']},
      {type:'mcq',q:'🌸 "She\'s the spitting image of her mother" nghĩa là?',opts:['Cô ấy giỏi hơn mẹ','Cô ấy xấu như mẹ','Cô ấy giống mẹ như đúc','Cô ấy yêu mẹ nhiều'],ans:2},
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

  // Badge label trên đầu nhân vật
  if(typeof getEquippedBadgeLabel==='function'){
    const _bl=getEquippedBadgeLabel();
    if(_bl){
      const _bx=px2+P.w/2, _by=P.y-14;
      ctx.save();
      ctx.font='bold 9px "Times New Roman",serif';
      ctx.textAlign='center';
      const _bw=ctx.measureText(_bl.icon+' '+_bl.name).width+10;
      ctx.globalAlpha=0.82;
      ctx.fillStyle='rgba(0,0,0,0.65)';
      ctx.beginPath();ctx.roundRect(_bx-_bw/2,_by-11,_bw,13,4);ctx.fill();
      ctx.globalAlpha=1;
      ctx.fillStyle=_bl.color;
      ctx.shadowColor=_bl.color;ctx.shadowBlur=4;
      ctx.fillText(_bl.icon+' '+_bl.name,_bx,_by);
      ctx.shadowBlur=0;
      ctx.restore();
    }
  }
  
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