/* =========================================================
   도감
   keys = 도감에 실리는 순서 (게임 데이터 DEF의 키). 이름·그림은 DEF를 그대로 쓴다.
   부하·함정은 '가진 적이 있으면' 등록, 용사는 '처음 처치하면' 등록된다.
   tiers = 달성도 보상. at = 달성 비율, soul = 영혼석, fx = 능력치 보너스 (받은 것끼리 더해진다)
     minAtk/minHp = 부하 공격력/체력, all = 부하 전체 능력치, trapDmg = 함정 피해, trapSlot = 함정 칸,
     heroGem = 용사 처치 ◆, lordHp = 마왕(수호석) 체력
   ========================================================= */
const CODEX = {
  minion: {
    name:'부하',
    /* 등급순: 부하 6 → 정예 5 → 권속 3 → 마왕 2 */
    keys:['slime', 'goblin', 'bat', 'zombie', 'spider', 'wolf',
          'skel', 'imp', 'ghost', 'darkkn', 'succub',
          'golem', 'witch', 'lich',
          'dragon', 'demon'],
    tiers:[
      { at:0.25, soul:5,  fx:{ minAtk:0.03 }, desc:'부하 공격력 +3%' },
      { at:0.50, soul:10, fx:{ minHp:0.05 },  desc:'부하 체력 +5%' },
      { at:0.75, soul:15, fx:{ minAtk:0.07 }, desc:'부하 공격력 +7%' },
      { at:1.00, soul:30, fx:{ all:0.10 },    desc:'부하 전체 능력치 +10%' },
    ],
  },
  trap: {
    name:'함정',
    /* 가시 / 독안개 / 화염 / 얼음 / 낙석 / 폭탄 / 늪(감속) / 마법진 */
    keys:['spikes', 'gas', 'fire', 'ice', 'rock', 'lava', 'poison', 'curse'],
    tiers:[
      { at:0.25, soul:5,  fx:{ trapDmg:0.03 }, desc:'함정 피해 +3%' },
      { at:0.50, soul:10, fx:{ trapDmg:0.06 }, desc:'함정 피해 +6%' },
      { at:0.75, soul:15, fx:{ trapSlot:1 },   desc:'함정 설치칸 +1' },
      { at:1.00, soul:30, fx:{ trapDmg:0.15 }, desc:'함정 피해 +15%' },
    ],
  },
  hero: {
    name:'용사',
    /* 견습 검사 / 궁수 / 도적 / 성직자 / 마법사 / 기사 / 성기사 / 암살자 / 용사 대장 / 용사 왕 */
    keys:['trainee', 'ranger', 'looter', 'cleric', 'warlock', 'lancer', 'paladin', 'assassin', 'champion', 'heroking'],
    tiers:[
      { at:0.25, soul:5,  fx:{ heroGem:0.05 }, desc:'용사 처치 ◆ +5%' },
      { at:0.50, soul:10, fx:{ heroGem:0.10 }, desc:'용사 처치 ◆ +10%' },
      { at:0.75, soul:15, fx:{ lordHp:0.05 },  desc:'마왕 체력 +5%' },
      { at:1.00, soul:30, fx:{ lordHp:0.10 },  desc:'마왕 체력 +10%' },
    ],
  },
};

/* 네임드 용사: 5·10·15관문(0부터 세서 4·9·14) 마지막 웨이브에 이 중 하나가 랜덤으로 끼어든다 */
const NAMED_POOL = {
  4:  ['looter', 'lancer', 'ranger', 'cleric', 'warlock', 'assassin'],
  9:  ['lancer', 'warlock', 'assassin', 'paladin', 'champion'],
  14: ['assassin', 'paladin', 'champion', 'heroking'],
};
/* 네임드 능력치 배율 (접두 능력과 같은 형식) */
const NAMED_AFFIX = { name:'네임드', col:'#ff7ad9', hp:2.5, dmg:1.4, spd:1.0, sc:1.2 };
