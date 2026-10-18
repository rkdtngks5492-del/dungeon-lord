/* =========================================================
   보상 (일일 퀘스트 · 출석 · 접속상자 · 클리어 · 우편)
   reward = { gems:◆, soul:영혼석 }. ◆는 광고를 보면 2배, 영혼석은 언제나 그대로.
   ========================================================= */

/* 일일 퀘스트: 매일 자정 초기화. id는 게임 코드가 진행도를 올릴 때 쓰는 이름이라 바꾸지 말 것 */
const DAILY_QUESTS = [
  { id:'clear', name:'관문 3회 클리어',  need:3,  reward:{ gems:50, soul:2 } },
  { id:'kill',  name:'용사 20명 처치',   need:20, reward:{ gems:50, soul:2 } },
  { id:'pull',  name:'권속 소환 3회',    need:3,  reward:{ gems:50, soul:2 } },
  { id:'ad',    name:'광고 1회 시청',    need:1,  reward:{ gems:50, soul:2 } },
  { id:'deck',  name:'덱 편성 변경 1회', need:1,  reward:{ gems:50, soul:2 } },
];
const DAILY_ALL = { gems:150, soul:10 };   /* 5개 모두 완료 보너스 */

/* 주간 퀘스트: 매주 월요일 자정 초기화. id는 'w_'로 시작 */
const WEEKLY_QUESTS = [
  { id:'w_clear',  name:'관문 10회 클리어',  need:10, reward:{ gems:120, soul:5 } },
  { id:'w_summon', name:'권속 소환 30회',    need:30, reward:{ gems:120, soul:5 } },
  { id:'w_trap',   name:'함정 배치 50회',    need:50, reward:{ gems:120, soul:5 } },
  { id:'w_kill',   name:'용사 100명 처치',   need:100,reward:{ gems:120, soul:5 } },
  { id:'w_deck',   name:'덱 편성 변경 5회',  need:5,  reward:{ gems:120, soul:5 } },
];
const WEEKLY_ALL = { gems:500, soul:30 };   /* 5개 모두 완료 주간 보너스 */

/* 출석: 7일 주기, 하루 1번 (연속이 아니어도 됨). 7일차를 받으면 1일차로 돌아간다 */
const ATTEND = [
  { gems:100 }, { gems:100 }, { gems:150, soul:5 }, { gems:150 },
  { gems:200, soul:5 }, { gems:200 }, { gems:500, soul:20 },
];

/* 일일 상자 (상점): 하루 무료 1회 + 광고 1회. 권속 카드 min~max장, 등급 확률(%) N=일반 R=희귀 SR=영웅 */
const DAILY_BOX = { min:1, max:3, rates:{ N:70, R:25, SR:5 } };

/* 접속상자: hours마다 하나 (앱을 꺼도 시간은 흐른다) */
const BOX = { hours:9, reward:{ gems:300 } };

/* 클리어 보상
   stars[n] = 관문에서 별 n+1개를 처음 달성했을 때 ◆ (★1 = 최초 클리어)
   starAt[n] = 별 n+1개 조건: 남은 수호석 비율 */
const CLEAR_REWARD = {
  stars:[30, 10, 20],
  starAt:[0, 0.5, 0.8],
  starName:['관문 돌파', '수호석 50% 이상', '수호석 80% 이상'],
  milestone:{ 5:{ gems:200, soul:10 }, 10:{ gems:300, soul:20 }, 15:{ gems:500, soul:30 } },
};

/* 시스템 우편 (업데이트·이벤트 보상). id가 같으면 한 번만 받을 수 있다 */
const MAIL = [
  { id:'welcome', title:'마왕의 던전에 오신 걸 환영해요!', body:'첫 출정 준비금이에요', reward:{ gems:200 } },
];

/* 시즌 패스: 30일 시즌, 40레벨, 일퀘/주퀘 완료마다 경험치 +1 */
const SEASON_PASS = {
  duration: 30,
  levels: [
    { lv:1,  free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:2,  free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:3,  free:{soul:2},           premium:{gems:100,soul:5} },
    { lv:4,  free:{gems:50},          premium:{gems:100} },
    { lv:5,  free:{gems:100,soul:3},  premium:{gems:200,soul:5} },
    { lv:6,  free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:7,  free:{soul:3},           premium:{gems:150,soul:5} },
    { lv:8,  free:{gems:50},          premium:{gems:100} },
    { lv:9,  free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:10, free:{gems:200,soul:5},  premium:{gems:400,soul:8,tickets:1} },
    { lv:11, free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:12, free:{soul:3},           premium:{gems:150,soul:5} },
    { lv:13, free:{gems:100},         premium:{gems:200,soul:3} },
    { lv:14, free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:15, free:{gems:200,soul:5},  premium:{gems:400,soul:10,tickets:1} },
    { lv:16, free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:17, free:{soul:5},           premium:{gems:150,soul:8} },
    { lv:18, free:{gems:100},         premium:{gems:200,soul:3} },
    { lv:19, free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:20, free:{gems:300,soul:8},  premium:{gems:500,soul:15,tickets:2} },
    { lv:21, free:{gems:50},          premium:{gems:100,soul:3} },
    { lv:22, free:{soul:5},           premium:{gems:150,soul:8} },
    { lv:23, free:{gems:100},         premium:{gems:200,soul:5} },
    { lv:24, free:{gems:50},          premium:{gems:100,soul:2} },
    { lv:25, free:{gems:300,soul:8},  premium:{gems:600,soul:15,tickets:2}, skin:true },
    { lv:26, free:{gems:100},         premium:{gems:200,soul:5} },
    { lv:27, free:{soul:5},           premium:{gems:150,soul:10} },
    { lv:28, free:{gems:100},         premium:{gems:200,soul:5} },
    { lv:29, free:{gems:200,soul:5},  premium:{gems:400,soul:10,tickets:1} },
    { lv:30, free:{gems:500,soul:10}, premium:{gems:1000,soul:20,tickets:5}, skin:true },
    { lv:31, free:{gems:100},          premium:{gems:200,soul:5} },
    { lv:32, free:{soul:5,cards:[{key:'goblin',n:2}]}, premium:{gems:200,soul:8} },
    { lv:33, free:{gems:150},          premium:{gems:300,soul:5} },
    { lv:34, free:{cards:[{key:'imp',n:2}]},  premium:{gems:200,soul:5} },
    { lv:35, free:{gems:300,soul:10},  premium:{gems:600,soul:20,tickets:2}, skin:true },
    { lv:36, free:{gems:100},          premium:{gems:200,soul:5} },
    { lv:37, free:{soul:8,cards:[{key:'skel',n:2}]},  premium:{gems:250,soul:8} },
    { lv:38, free:{gems:200},          premium:{gems:300,soul:10} },
    { lv:39, free:{cards:[{key:'ghost',n:2}]}, premium:{gems:200,soul:8,tickets:1} },
    { lv:40, free:{gems:800,soul:20},  premium:{gems:1500,soul:40,tickets:5}, skin:true },
  ]
};

/* 길드 보물함 보상 (기여도 소모) */
const GUILD_TREASURY = [
  { id:'gt1', name:'수정 꾸러미',    cost:10,  reward:{gems:200},    weekly:3 },
  { id:'gt2', name:'영혼석 묶음',    cost:20,  reward:{soul:10},     weekly:2 },
  { id:'gt3', name:'소환권',         cost:50,  reward:{tickets:1},   weekly:1 },
  { id:'gt4', name:'대형 수정 상자', cost:100, reward:{gems:1000},   weekly:1 },
];
