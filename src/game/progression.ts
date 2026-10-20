import { classAttributes, type Attributes, type UnitClass } from "./archetypes";

export const ENCOUNTER_XP = 100;
export const MAX_EXPERIENCE = 100;
export const MAX_LEVEL = 2;
/** Initial two-level prototype. Progression applies only to the traveler. */
export const LEVEL_GROWTH: Readonly<Record<UnitClass, Readonly<Attributes>>> = {
  Guerreiro: { hp: 3, ep: 1, attack: 1, magic: 0, defense: 1, move: 0 },
  Mago: { hp: 2, ep: 3, attack: 0, magic: 1, defense: 1, move: 0 },
  Ladino: { hp: 2, ep: 1, attack: 1, magic: 0, defense: 1, move: 0 },
};
export function validExperience(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= MAX_EXPERIENCE;
}
export function levelFor(experience = 0): number {
  return validExperience(experience) && experience >= ENCOUNTER_XP ? MAX_LEVEL : 1;
}
export function travelerAttributes(cls: UnitClass, experience = 0): Attributes {
  const a = classAttributes(cls);
  if (levelFor(experience) === 2) {
    for (const key of Object.keys(a) as (keyof Attributes)[]) a[key] += LEVEL_GROWTH[cls][key];
  }
  return a;
}
export function progressLabel(experience = 0): string {
  return levelFor(experience) === MAX_LEVEL
    ? `Nível 2 · ${experience} XP · limite atual do protótipo`
    : `Nível 1 · ${experience}/${ENCOUNTER_XP} XP para o nível 2`;
}
