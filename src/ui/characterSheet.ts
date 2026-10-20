import { CLASS_DATA, TECHNIQUES, RACE_NOTICE, classAttributes, type UnitClass } from "../game/archetypes";
/** Preview and exploration use the same catalog as battle unit creation. */
export function characterSheet(cls: UnitClass, race: string): HTMLElement {
  const root = document.createElement("div");
  root.className = "character-sheet";
  const p = (text: string) => { const el = document.createElement("p"); el.textContent = text; root.append(el); };
  p(`${race} · ${cls} — ${CLASS_DATA[cls].description}`);
  const a = classAttributes(cls);
  p(`HP ${a.hp} · Energia ${a.ep} · Ataque ${a.attack} · Magia ${a.magic} · Defesa ${a.defense} · Movimento ${a.move}`);
  const list = document.createElement("ul");
  list.setAttribute("aria-label", "Técnicas iniciais");
  for (const t of TECHNIQUES[cls]) {
    const item = document.createElement("li");
    item.textContent = `${t.name}: ${t.kind === "magic" ? "mágica" : "física"} · potência ${t.power} · alcance ${t.range} · ${t.cost} EN`;
    list.append(item);
  }
  root.append(list);
  p("Potência soma-se ao ataque ou à magia; defesa e terreno reduzem o dano. A prévia de dano aparece ao selecionar um alvo na batalha.");
  p(RACE_NOTICE);
  return root;
}
