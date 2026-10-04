/* =========================================================
   권속 스킬
   레벨 마일스톤: Lv5 액티브 개방 / Lv10 패시브1 / Lv15 액티브 강화 / Lv20 패시브2 / Lv30 액티브 최종 강화
   (그 밖의 레벨은 공격·체력 +4% — data/currency.js LVUP.per)

   act = 액티브. 전투 하단 초상화의 원형 게이지가 다 차면 탭해서 발동. cd = 게이지 완충 시간(초)
     type:
       guard   — dur초간 받는 피해 -dr, taunt면 주변 침입자 도발, heal이면 최대 체력 비율 회복
       multi   — 앞의 적 하나에 hits번 × pct배 (ls = 준 피해의 흡혈 비율)
       blast   — 적이 가장 몰린 곳에 반경 r, pct배 (burn = 초당 공격력 비율 화상 burnT초 / slow = 이동 속도 배율 slowT초)
       pierce  — 같은 길에 보이는 적 전체를 꿰뚫어 pct배 (burn 선택)
       split   — 작은 분신 n마리를 dur초 동안 소환 (체력·공격 = 본체의 hp 비율)
       charge  — 반경 r 안의 적에게 pct배 + stun초 기절
       charm   — 가장 강한 용사 1명이 dur초간 같은 편 용사를 공격
       petrify — dur초간 무적, 끝나면 반경 r 안의 적 stun초 기절
   p1 / p2 = 패시브. hp·atk = 능력치 %, dr = 받는 피해 감소, as = 공격 속도, ls = 흡혈, gauge = 게이지 충전 속도
   ========================================================= */
const MILESTONE = { act:5, p1:10, up1:15, p2:20, up2:30 };
/* 강화 단계: 위력(pow) 배율, 게이지 시간(cd) 배율, 지속 시간(dur) 배율 — 기본 대비 */
const SKILL_UP = { up1:{ pow:1.3, cd:0.9, dur:1 }, up2:{ pow:1.6, cd:0.8, dur:1.5 } };
/* 게이지 추가 충전: 탱커는 맞을 때, 딜러는 때릴 때 */
const GAUGE_BONUS = 0.03;

const USKILL = {
  slime:   { act:{ name:'분열', type:'split', cd:20, n:2, hp:0.3, dur:8 },
             p1:{ name:'말랑한 몸', dr:0.08 }, p2:{ name:'끈적한 재생', hp:0.15 } },
  goblin:  { act:{ name:'연속 찌르기', type:'multi', cd:10, hits:3, pct:1.2 },
             p1:{ name:'창술 훈련', atk:0.10 }, p2:{ name:'날렵한 발', as:0.12 } },
  bat:     { act:{ name:'흡혈 난무', type:'multi', cd:12, hits:4, pct:0.7, ls:0.5 },
             p1:{ name:'피의 갈증', ls:0.08 }, p2:{ name:'초음파', as:0.15 } },
  zombie:  { act:{ name:'불사의 몸', type:'guard', cd:18, dur:6, dr:0.3, heal:0.35 },
             p1:{ name:'썩은 살', hp:0.12 }, p2:{ name:'고통 무감', dr:0.10 } },
  spider:  { act:{ name:'거미줄 투척', type:'blast', cd:14, pct:0.8, r:70, slow:0.5, slowT:4 },
             p1:{ name:'맹독', atk:0.10 }, p2:{ name:'사냥 본능', gauge:0.15 } },
  wolf:    { act:{ name:'사냥개의 이빨', type:'multi', cd:10, hits:3, pct:1.0 },
             p1:{ name:'질주', as:0.10 }, p2:{ name:'무리 사냥', atk:0.12 } },
  skel:    { act:{ name:'관통 사격', type:'pierce', cd:12, pct:1.8 },
             p1:{ name:'뼈 화살', atk:0.10 }, p2:{ name:'명사수', gauge:0.15 } },
  imp:     { act:{ name:'화염구', type:'blast', cd:14, pct:2.0, r:60, burn:0.2, burnT:3 },
             p1:{ name:'지옥불', atk:0.12 }, p2:{ name:'악마의 민첩', as:0.12 } },
  ghost:   { act:{ name:'원한의 냉기', type:'blast', cd:14, pct:1.0, r:70, slow:0.6, slowT:3 },
             p1:{ name:'실체 없음', dr:0.10 }, p2:{ name:'저주', atk:0.12 } },
  darkkn:  { act:{ name:'암흑 결의', type:'guard', cd:16, dur:5, dr:0.4, taunt:true },
             p1:{ name:'흑철 갑옷', hp:0.12 }, p2:{ name:'타락한 검', ls:0.06 } },
  succub:  { act:{ name:'매혹', type:'charm', cd:25, dur:4 },
             p1:{ name:'유혹의 향기', gauge:0.12 }, p2:{ name:'정기 흡수', ls:0.08 } },
  golem:   { act:{ name:'대지의 수호', type:'guard', cd:18, dur:5, dr:0.5, taunt:true },
             p1:{ name:'바위 피부', hp:0.12 }, p2:{ name:'흔들림 없는 산', dr:0.10 } },
  witch:   { act:{ name:'저주 폭발', type:'blast', cd:16, pct:1.8, r:70, burn:0.15, burnT:4 },
             p1:{ name:'마녀의 비약', atk:0.12 }, p2:{ name:'주문 가속', gauge:0.15 } },
  lich:    { act:{ name:'냉기 폭풍', type:'blast', cd:22, pct:1.5, r:80, slow:0.6, slowT:4 },
             p1:{ name:'죽음의 기운', atk:0.12 }, p2:{ name:'불멸의 성물함', hp:0.15 } },
  dragon:  { act:{ name:'화염 브레스', type:'pierce', cd:18, pct:2.2, burn:0.2, burnT:3 },
             p1:{ name:'용린', dr:0.10 }, p2:{ name:'고룡의 분노', atk:0.15 } },
  demon:   { act:{ name:'대지 분쇄', type:'charge', cd:20, pct:1.5, stun:2, r:150 },
             p1:{ name:'마계의 육체', hp:0.15 }, p2:{ name:'공포의 군주', dr:0.12 } },
  minotaur:{ act:{ name:'돌진', type:'charge', cd:16, pct:1.0, stun:2, r:160 },
             p1:{ name:'황소의 근력', atk:0.10 }, p2:{ name:'미궁의 주인', hp:0.12 } },
  gargoyle:{ act:{ name:'석화', type:'petrify', cd:20, dur:3, stun:1.5, r:80 },
             p1:{ name:'돌의 피부', dr:0.10 }, p2:{ name:'밤의 파수꾼', hp:0.12 } },
};
