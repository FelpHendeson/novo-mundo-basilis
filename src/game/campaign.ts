import { newCastle, parseCastle, type CastleState } from "./castle";
import type { AreaId } from "./areas";
import type { Mission } from "./missions";
import { newCreature, parseCreature, finishCreature, type CreatureState } from "./creature";
import { newAdaptation, parseAdaptation, type Adaptation } from "./adaptation";
import { newNarrative, legacyNarrative, parseNarrative, type NarrativeState } from "./narrative";
import { EQUIPMENT_IDS, isEquipmentId, type EquipmentId } from "./equipment";
import { ENCOUNTER_XP, validExperience } from "./progression";
import type { Character } from "./battle";
import { RACES, CLASSES } from "./archetypes";
export { RACES } from "./archetypes";
export type Campaign = {
  schemaVersion: 8;
  character: Character & { experience: number; equipment: EquipmentId | null };
  narrative: NarrativeState;
  adaptation: Adaptation;
  creature: CreatureState;
  area: AreaId;
  castle: CastleState;
  inventory: EquipmentId[];
  base: { prepared: boolean; lyraRecruited: boolean; lyraDeployed: boolean };
  position: { x: number; y: number };
  metLyra: boolean;
  passageCleared: boolean;
  supplies: number;
  expeditionComplete: boolean;
};
export const newCampaign = (character: Character): Campaign => ({
  schemaVersion: 8,
  character: { name: character.name, cls: character.cls, race: character.race, experience: 0, equipment: null },
  narrative: newNarrative(),
  adaptation: newAdaptation(),
  creature: newCreature(),
  area: "clearing",
  castle: newCastle(),
  inventory: [...EQUIPMENT_IDS],
  base: { prepared: false, lyraRecruited: false, lyraDeployed: false },
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
  if (c.area !== "clearing" || Math.abs(dx) + Math.abs(dy) !== 1) return false;
  const x = c.position.x + dx,
    y = c.position.y + dy;
  if (!passable(x, y) || (x === 2 && y === 3)) return false;
  c.position = { x, y };
  return true;
}
export const near = (c: Campaign, x: number, y: number) =>
  c.area === "clearing" && Math.abs(c.position.x - x) + Math.abs(c.position.y - y) <= 1;
export function finishEncounter(c: Campaign, won: boolean) {
  if (won && !c.passageCleared) {
    c.passageCleared = true;
    c.supplies += 3;
    c.character.experience = ENCOUNTER_XP;
    return true;
  }
  return false;
}
/** Reject unsupported or malformed saves without silently erasing them. */
export function parseCampaign(value: unknown): Campaign | null {
  if (!value || typeof value !== "object") return null;
  const c = value as Omit<Campaign, "schemaVersion"> & { schemaVersion: number };
  if (
    ![1, 2, 3, 4, 5, 6, 7, 8].includes(c.schemaVersion) ||
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
  // Schema 1 predates XP: award completed encounters once during migration.
  const experience = c.schemaVersion === 1 ? (c.passageCleared ? ENCOUNTER_XP : 0) : c.character.experience;
  if (!validExperience(experience) || experience !== (c.passageCleared ? ENCOUNTER_XP : 0)) return null;
  const inventory = c.schemaVersion < 3 ? [...EQUIPMENT_IDS] : c.inventory;
  const equipment = c.schemaVersion < 3 ? null : c.character.equipment;
  if (!Array.isArray(inventory) || inventory.length > EQUIPMENT_IDS.length ||
      !Array.from(inventory).every(isEquipmentId) || new Set(inventory).size !== inventory.length ||
      (equipment !== null && (!isEquipmentId(equipment) || !inventory.includes(equipment)))) return null;
  const base = c.schemaVersion < 4 ? { prepared: false, lyraRecruited: false, lyraDeployed: false } : c.base;
  if (!base || typeof base.prepared !== "boolean" || typeof base.lyraRecruited !== "boolean" ||
      typeof base.lyraDeployed !== "boolean" || (base.prepared && !c.passageCleared) ||
      (base.lyraRecruited && (!base.prepared || !c.metLyra)) || (base.lyraDeployed && !base.lyraRecruited)) return null;
  const narrative = c.schemaVersion < 5 ? legacyNarrative() : parseNarrative(c.narrative);
  if (!narrative) return null;
  const adaptation = c.schemaVersion < 6 ? newAdaptation() : parseAdaptation(c.adaptation);
  if (!adaptation) return null;
  const creature = c.schemaVersion < 7 ? newCreature() : parseCreature(c.creature);
  if (!creature) return null;
  const area = c.schemaVersion < 8 ? "clearing" : c.area;
  const castle = c.schemaVersion < 8 ? newCastle() : parseCastle(c.castle);
  if (!castle || !["clearing", "castle"].includes(area) || (area === "castle" && (!castle.visited || !narrative.appliedEvents.includes("arrival.completed")))) return null;
  return {
    schemaVersion: 8,
    narrative,
    adaptation,
    creature,
    area,
    castle,
    character: { name: c.character.name, cls: c.character.cls, race: c.character.race, experience, equipment },
    inventory: [...inventory],
    base: { prepared: base.prepared, lyraRecruited: base.lyraRecruited, lyraDeployed: base.lyraDeployed },
    position: { ...c.position },
    metLyra: c.metLyra,
    passageCleared: c.passageCleared,
    supplies: c.supplies,
    expeditionComplete: c.expeditionComplete ?? false,
  };
}

export function restAtCamp(c: Campaign) {
  if (!near(c, 1, 5) || !c.passageCleared) return false;
  c.expeditionComplete = true;
  return true;
}

/** Equipment can be changed from exploration; battle receives a snapshot on entry. */
export function equipAccessory(c: Campaign, equipment: EquipmentId | null): boolean {
  if (equipment !== null && (!isEquipmentId(equipment) || !c.inventory.includes(equipment))) return false;
  if (c.character.equipment === equipment) return false;
  c.character.equipment = equipment;
  return true;
}

export const BASE_COST = 3;
export function prepareBase(c: Campaign): boolean {
  if (c.base.prepared || !c.passageCleared || !near(c, 1, 5) || c.supplies < BASE_COST) return false;
  c.supplies -= BASE_COST;
  c.base.prepared = true;
  return true;
}
export function recruitLyra(c: Campaign): boolean {
  if (c.base.lyraRecruited || !c.base.prepared || !c.metLyra || !near(c, 2, 3)) return false;
  c.base.lyraRecruited = true;
  c.base.lyraDeployed = true;
  return true;
}
export function setLyraDeployed(c: Campaign, deployed: boolean): boolean {
  if (!c.base.lyraRecruited || !near(c, 1, 5) || c.base.lyraDeployed === deployed) return false;
  c.base.lyraDeployed = deployed;
  return true;
}
export function trainingCharacter(c: Campaign): Character | null {
  if (!c.base.prepared || !c.passageCleared || !near(c, 1, 5)) return null;
  return { ...c.character, includeLyra: c.base.lyraRecruited && c.base.lyraDeployed };
}
export function campaignObjective(c: Campaign): string {
  if (!c.passageCleared) return c.metLyra ? "Objetivo: alcance as ruínas e proteja a passagem." : "Objetivo: aproxime-se de Lyra e converse.";
  if (!c.base.prepared) return "Objetivo: prepare a base junto ao abrigo (3 suprimentos).";
  if (!c.base.lyraRecruited) return "Objetivo: volte à trilha e convide Lyra para a equipe.";
  return "Base pronta. Monte a equipe junto ao abrigo e teste a formação em treino.";
}

/** Mission-specific completion prevents the tutorial from granting ruin rewards. */
export function finishCampaignBattle(c: Campaign, mission: Mission, won: boolean): boolean {
  return mission === "creature" ? finishCreature(c.creature, won) : finishEncounter(c, won);
}

/** Narrative consultations return to the current area; legacy saves default to the clearing. */
export function campaignStartScene(c: Campaign): "Arrival" | "Exploration" | "Castle" {
  return c.narrative.sceneId === "SCN_002_AWAKEN" ? "Arrival" : c.area === "castle" ? "Castle" : "Exploration";
}
