/** Bounded first-contact record. No XP, loot or stat reward is attached. */
export const CREATURE_POSITION = { x: 3, y: 1 } as const;
export const CREATURE_OUTCOMES = ["pending", "avoided", "repelled", "retreated"] as const;
export type CreatureOutcome = (typeof CREATURE_OUTCOMES)[number];
export type CreatureState = { observed: boolean; engaged: boolean; outcome: CreatureOutcome };
export const newCreature = (): CreatureState => ({ observed: false, engaged: false, outcome: "pending" });
export function observeCreature(c: CreatureState): boolean {
  if (c.outcome !== "pending" || c.engaged || c.observed) return false;
  c.observed = true; return true;
}
export function avoidCreature(c: CreatureState): boolean {
  if (c.outcome !== "pending" || c.engaged) return false;
  c.outcome = "avoided"; return true;
}
/** Re-entry after an interrupted battle restarts this encounter, never rewards it. */
export function beginCreature(c: CreatureState): boolean {
  if (c.outcome !== "pending") return false;
  c.engaged = true; return true;
}
export function finishCreature(c: CreatureState, won: boolean): boolean {
  if (c.outcome !== "pending" || !c.engaged) return false;
  c.outcome = won ? "repelled" : "retreated"; return true;
}
export function parseCreature(value: unknown): CreatureState | null {
  if (!value || typeof value !== "object") return null;
  const c = value as CreatureState;
  if (typeof c.observed !== "boolean" || typeof c.engaged !== "boolean" ||
      !(CREATURE_OUTCOMES as readonly unknown[]).includes(c.outcome) ||
      (c.outcome === "avoided" && c.engaged) ||
      (["repelled", "retreated"].includes(c.outcome) && !c.engaged)) return null;
  return { observed: c.observed, engaged: c.engaged, outcome: c.outcome };
}
export const CREATURE_RESULT: Record<CreatureOutcome, string> = {
  pending: "Um animal de focinho alongado protege uma toca. Ele rosna quando alguém se aproxima. A espécie ainda não foi identificada.",
  avoided: "Você contornou a toca. A criatura permaneceu onde estava, e a trilha continua acessível.",
  repelled: "A criatura recuou para a mata. Você manteve distância da toca e pode seguir pela clareira.",
  retreated: "Você se afastou da toca. O confronto terminou e a jornada pode continuar, sem ferimentos persistentes.",
};
