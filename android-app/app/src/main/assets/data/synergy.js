/* =========================================================
   권속 시너지 — 같은 계열 권속을 2종 이상 편성하면 활성화
   tier.need = 필요 종류 수 (중복 없이 셈)
   효과: as = 공격속도 보너스, atk = 공격력 보너스,
         dr = 받는 피해 감소, heroSpd = 용사 이동속도 감소
   ========================================================= */
const SYNERGY = {
  demon:    { name:'악마계', ico:'😈',
              keys:['imp','demon','succub','darkkn','dragon'],
              tiers:[
                { need:2, label:'악마 공명',  desc:'공격속도 +10%',                      as:0.10 },
                { need:4, label:'마계의 지배', desc:'공격속도 +20% · 공격력 +10%',        as:0.20, atk:0.10 },
              ]},
  undead:   { name:'언데드', ico:'☠',
              keys:['zombie','skel','ghost','lich'],
              tiers:[
                { need:2, label:'공포의 기운', desc:'용사 이동속도 -5%',                  heroSpd:0.05 },
                { need:4, label:'죽음의 군단', desc:'용사 이동속도 -15% · 공격력 +10%',   heroSpd:0.15, atk:0.10 },
              ]},
  beast:    { name:'야수',   ico:'🐾',
              keys:['wolf','spider','bat','slime','goblin'],
              tiers:[
                { need:2, label:'야생의 본능', desc:'공격속도 +8%',                       as:0.08 },
                { need:3, label:'무리 사냥',   desc:'공격속도 +15% · 공격력 +8%',         as:0.15, atk:0.08 },
              ]},
  guardian: { name:'수호자', ico:'🛡',
              keys:['golem','gargoyle','minotaur','darkkn','zombie'],
              tiers:[
                { need:2, label:'철벽 수호',   desc:'받는 피해 -10%',                     dr:0.10 },
                { need:3, label:'불굴의 요새', desc:'받는 피해 -20%',                     dr:0.20 },
              ]},
};
