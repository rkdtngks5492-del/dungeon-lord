/* =========================================================
   화폐 · 행동력 · 강화 수치
   숫자만 고치면 게임 전체에 반영된다.
   ========================================================= */
/* ◆(수정) = 강화 전용, 쉽게 모임 / ◈(영혼석) = 소환·행동력 전용, 귀함 */
const CUR = {
  gem:  { ico:'◆', col:'#8be9ff', name:'수정' },
  soul: { ico:'◈', col:'#c77dff', name:'영혼석' },
  stam: { ico:'⚡', col:'#ffd35a', name:'행동력' },
};

/* 새로 시작할 때, 그리고 옛 저장(영혼석이 없던 버전)을 처음 불러올 때 주는 영혼석 */
const START_SOUL = 30;

/* 행동력: 최대치, 관문 1회 소모량, 몇 분마다 1 회복, 충전 가격(영혼석)과 충전량 */
const STAM = { max:30, cost:6, regenMin:5, buySoul:20, buyAmt:30 };

/* 소환 가격 (영혼석). ×10은 정예 이상 1개 보장 */
const PULL_COST = { minion:{ one:10, ten:90 }, trap:{ one:8, ten:72 } };

/* 권속 성급(★)과 레벨 (◆로 레벨업)
   need[n] = n+1성 → n+2성 승급에 드는 같은 권속 카드 수, cap[n] = n+1성 최대 레벨, bonus = 승급마다 기본 능력치 +15% */
const STAR = { max:5, need:[2, 4, 8, 16], cap:[10, 20, 30, 40, 50], bonus:0.15 };
/* 레벨업 비용 = round(base × 현재레벨^pow) ◆, per = 마일스톤이 아닌 레벨마다 공격·체력 +4% */
const LVUP = { base:60, pow:1.5, per:0.04 };

/* 권속 카드팩 (영혼석): n장, 마지막 장은 희귀 이상 보장 */
const CARD_PACK = { n:5, soul:45 };

/* 광고 제거 패키지. id는 Play Console 인앱 상품 ID와 같아야 한다. price는 표시용 (실제 가격은 스토어가 정함) */
const NO_ADS = { id:'remove_ads', price:'₩3,900' };

/* 함정 강화 (◆): 1단계에서 시작해 최대 10단계, 단계마다 공격력 +5%.
   cost[0] = 1→2단계, cost[1] = 2→3단계 ... 표가 끝나면 마지막 값에 grow를 계속 곱한다 (4→5 이후 ×1.5씩) */
const ENH = { max:10, per:0.05, cost:[100, 200, 400, 800], grow:1.5 };

/* 광고 보상: ◆ (하루 횟수, 양), 무료 소환 횟수, 영혼석 (하루 횟수, 양) */
const AD_DAILY_MAX = 5, AD_DAILY_GEMS = 150, AD_PULL_MAX = 3;
const AD_SOUL = { max:3, amt:3 };

/* 방치 보상: 분당 영혼석 생산량, 오프라인 최대 반영 시간 */
const IDLE_SOUL_PER_MIN = 1, IDLE_MAX_HOURS = 8;
