import type { Attributes, UnitClass } from "./archetypes";
import { travelerAttributes } from "./progression";

export const EQUIPMENT_IDS = ["training-band", "simple-focus", "reinforced-brooch"] as const;
export type EquipmentId = (typeof EQUIPMENT_IDS)[number];
type Bonus = "attack" | "magic" | "defense";
export const EQUIPMENT: Readonly<Record<EquipmentId, { readonly name: string; readonly stat: Bonus; readonly bonus: number; readonly effect: string }>> = {
  "training-band": { name: "Braçadeira de treino", stat: "attack", bonus: 2, effect: "Ataque +2" },
  "simple-focus": { name: "Foco simples", stat: "magic", bonus: 2, effect: "Magia +2" },
  "reinforced-brooch": { name: "Broche reforçado", stat: "defense", bonus: 2, effect: "Defesa +2" },
};
export function isEquipmentId(value: unknown): value is EquipmentId {
  return typeof value === "string" && (EQUIPMENT_IDS as readonly string[]).includes(value);
}
export function equipmentLabel(equipment: EquipmentId | null = null): string {
  return equipment ? `${EQUIPMENT[equipment].name} · ${EQUIPMENT[equipment].effect}` : "Nenhum acessório";
}
/** Recompute from class and level, never add on top of a previous equipment bonus. */
export function equippedAttributes(cls: UnitClass, experience = 0, equipment: EquipmentId | null = null): Attributes {
  const a = travelerAttributes(cls, experience);
  if (equipment) {
    const item = EQUIPMENT[equipment];
    a[item.stat] += item.bonus;
  }
  return a;
}
