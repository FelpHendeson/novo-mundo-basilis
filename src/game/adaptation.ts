import type { UnitClass } from "./archetypes";
export const CONSUMABLES = { potions: { initial: 3, restore: 12 }, rations: { initial: 2, restore: 4 } } as const;
export type Consumable = "potions" | "rations";
export type Adaptation = { claimed: boolean; potions: number; rations: number; manaStep: number; assisted: boolean };
export const newAdaptation = (): Adaptation => ({ claimed: false, potions: 0, rations: 0, manaStep: 0, assisted: false });
export const starterWeapon = (cls: UnitClass) => cls === "Mago" ? "Cajado de adaptação · Magia +1" : cls === "Ladino" ? "Adaga de adaptação · Ataque +1" : "Espada de adaptação · Ataque +1";
export function claimKit(a: Adaptation): boolean {
  if (a.claimed) return false;
  a.claimed = true; a.potions = CONSUMABLES.potions.initial; a.rations = CONSUMABLES.rations.initial;
  return true;
}
export function advanceMana(a: Adaptation, assisted = false): boolean {
  if (a.manaStep >= 3) return false;
  a.manaStep++; a.assisted ||= assisted;
  return true;
}
export function parseAdaptation(value: unknown): Adaptation | null {
  if (!value || typeof value !== "object") return null;
  const a = value as Adaptation;
  if (typeof a.claimed !== "boolean" || typeof a.assisted !== "boolean" ||
      !Number.isInteger(a.potions) || a.potions < 0 || a.potions > CONSUMABLES.potions.initial ||
      !Number.isInteger(a.rations) || a.rations < 0 || a.rations > CONSUMABLES.rations.initial ||
      !Number.isInteger(a.manaStep) || a.manaStep < 0 || a.manaStep > 3 ||
      (!a.claimed && (a.potions !== 0 || a.rations !== 0)) || (a.assisted && a.manaStep === 0)) return null;
  return { claimed: a.claimed, potions: a.potions, rations: a.rations, manaStep: a.manaStep, assisted: a.assisted };
}
