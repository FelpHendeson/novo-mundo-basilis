import { equippedAttributes, equipmentLabel, type EquipmentId } from "../game/equipment";
import { progressLabel, LEVEL_GROWTH } from "../game/progression";
import { CLASS_DATA, TECHNIQUES, RACE_NOTICE, type UnitClass } from "../game/archetypes";
/** Preview and exploration use the same catalog as battle unit creation. */
export function characterSheet(cls: UnitClass, race: string, experience = 0, equipment: EquipmentId | null = null): HTMLElement {
  const root = document.createElement("div");
  root.className = "character-sheet";
  const p = (text: string) => { const el = document.createElement("p"); el.textContent = text; root.append(el); };
  p(`${race} · ${cls} — ${CLASS_DATA[cls].description}`);
  p(progressLabel(experience));
  const a = equippedAttributes(cls, experience, equipment);
  p(`HP ${a.hp} · Energia ${a.ep} · Ataque ${a.attack} · Magia ${a.magic} · Defesa ${a.defense} · Movimento ${a.move}`);
  p(`Acessório: ${equipmentLabel(equipment)}`);
  const list = document.createElement("ul");
  list.setAttribute("aria-label", "Técnicas iniciais");
  for (const t of TECHNIQUES[cls]) {
    const item = document.createElement("li");
    item.textContent = `${t.name}: ${t.kind === "magic" ? "mágica" : "física"} · potência ${t.power} · alcance ${t.range} · ${t.cost} EN`;
    list.append(item);
  }
  root.append(list);
  p("Potência soma-se ao ataque ou à magia; defesa e terreno reduzem o dano. A prévia de dano aparece ao selecionar um alvo na batalha.");
  const g = LEVEL_GROWTH[cls];
  p(`Ganhos no nível 2: HP +${g.hp}, energia +${g.ep}, ${g.magic ? "magia +" + g.magic : "ataque +" + g.attack}, defesa +${g.defense}. Movimento e técnicas não mudam.`);
  p("A primeira vitória nas ruínas concede 100 XP ao viajante. Repetir a batalha não concede recompensa adicional.");
  p(RACE_NOTICE);
  return root;
}
