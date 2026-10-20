import type { Character } from "./battle";
import { RACES, CLASSES } from "./archetypes";
export { RACES } from "./archetypes";
export type Campaign = {
  schemaVersion: 1;
  character: Character;
  position: { x: number; y: number };
  metLyra: boolean;
  passageCleared: boolean;
  supplies: number;
  expeditionComplete: boolean;
};
export const newCampaign = (character: Character): Campaign => ({
  schemaVersion: 1,
  character: { ...character },
  position: { x: 1, y: 4 },
  metLyra: false,
  passageCleared: false,
  supplies: 0,
  expeditionComplete: false,
});
export const passable = (x: number, y: number) =>
  Number.isInteger(x) &&
  Number.isInteger(y) &&
  x >= 0 &&
  x < 8 &&
  y >= 0 &&
  y < 6 &&
  !((x === 4 && y !== 2) || (x === 2 && y === 1));
export function moveExplorer(c: Campaign, dx: number, dy: number) {
  if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
  const x = c.position.x + dx,
    y = c.position.y + dy;
  if (!passable(x, y) || (x === 2 && y === 3)) return false;
  c.position = { x, y };
  return true;
}
export const near = (c: Campaign, x: number, y: number) =>
  Math.abs(c.position.x - x) + Math.abs(c.position.y - y) <= 1;
export function finishEncounter(c: Campaign, won: boolean) {
  if (won && !c.passageCleared) {
    c.passageCleared = true;
    c.supplies += 3;
    return true;
  }
  return false;
}
/** Reject unsupported or malformed saves without silently erasing them. */
export function parseCampaign(value: unknown): Campaign | null {
  if (!value || typeof value !== "object") return null;
  const c = value as Campaign;
  if (
    c.schemaVersion !== 1 ||
    !c.character ||
    typeof c.character.name !== "string" ||
    !c.character.name.trim() ||
    c.character.name.length > 16 ||
    !RACES.includes(c.character.race as (typeof RACES)[number]) ||
    !CLASSES.includes(c.character.cls) ||
    !c.position ||
    !passable(c.position.x, c.position.y) ||
    (c.position.x === 2 && c.position.y === 3) ||
    typeof c.metLyra !== "boolean" ||
    typeof c.passageCleared !== "boolean" ||
    !Number.isInteger(c.supplies) ||
    c.supplies < 0
  )
    return null;
  if (
    c.expeditionComplete !== undefined &&
    typeof c.expeditionComplete !== "boolean"
  )
    return null;
  if (c.expeditionComplete && !c.passageCleared) return null;
  return structuredClone({
    ...c,
    expeditionComplete: c.expeditionComplete ?? false,
  });
}

export function restAtCamp(c: Campaign) {
  if (!near(c, 1, 5) || !c.passageCleared) return false;
  c.expeditionComplete = true;
  return true;
}
