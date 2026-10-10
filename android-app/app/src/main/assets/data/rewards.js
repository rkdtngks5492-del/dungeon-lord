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
const BOX = { hours:4, reward:{ gems:80 } };

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
