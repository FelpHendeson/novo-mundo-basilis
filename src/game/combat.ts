import { damage, type Technique, type Unit } from "./model";
export type CombatEvent = Readonly<{
  id: number;
  attacker: Readonly<Unit>;
  defender: Readonly<Unit>;
  technique: Readonly<Technique>;
  damage: number;
  hpAfter: number;
  epAfter: number;
}>;
/** Pure preview/resolution contract. Presentation never changes game state. */
export function resolveCombat(
  id: number,
  attacker: Unit,
  defender: Unit,
  technique: Technique,
): CombatEvent {
  const dealt = damage(attacker, defender, technique);
  return Object.freeze({
    id,
    attacker: Object.freeze({ ...attacker }),
    defender: Object.freeze({ ...defender }),
    technique: Object.freeze({ ...technique }),
    damage: dealt,
    hpAfter: Math.max(0, defender.hp - dealt),
    epAfter: attacker.ep - technique.cost,
  });
}
