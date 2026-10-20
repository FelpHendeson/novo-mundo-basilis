import { describe, expect, it } from "vitest";
import { CLASSES, RACES, classAttributes, TECHNIQUES } from "../src/game/archetypes";
import { Battle } from "../src/game/battle";
import { newCampaign, parseCampaign } from "../src/game/campaign";

describe("catálogo de personagens e compatibilidade", () => {
  it.each([
    ["Guerreiro", [28, 8, 8, 2, 6, 4]],
    ["Mago", [21, 15, 3, 10, 3, 4]],
    ["Ladino", [23, 10, 7, 3, 4, 5]],
  ] as const)("preserva os atributos publicados de %s", (cls, expected) => {
    const a = classAttributes(cls);
    expect([a.hp, a.ep, a.attack, a.magic, a.defense, a.move]).toEqual(expected);
  });
  for (const cls of CLASSES) for (const race of RACES) {
    it(`${race}/${cls}: checkpoint conserva perfil e batalha usa atributos da prévia`, () => {
      const c = parseCampaign(JSON.parse(JSON.stringify(newCampaign({ name: "Teste", cls, race }))));
      expect(c?.character).toEqual({ name: "Teste", cls, race, experience: 0, equipment: null });
      const battle = new Battle(c!.character);
      const hero = battle.units[0];
      const a = classAttributes(cls);
      expect({ hp: hero.hp, ep: hero.ep, attack: hero.attack, magic: hero.magic, defense: hero.defense, move: hero.move }).toEqual(a);
      expect(hero.maxHp).toBe(a.hp);
      expect(hero.maxEp).toBe(a.ep);
      expect(TECHNIQUES[cls]).toHaveLength(2);
      expect(TECHNIQUES[cls].every(t => t.cost <= a.ep && t.range > 0)).toBe(true);
    });
  }
  it("ferimentos e gasto de energia não vazam para novos personagens", () => {
    const a = classAttributes("Mago");
    a.hp = 0;
    a.ep = 0;
    const battle = new Battle({ name: "Teste", cls: "Mago", race: "Elfo" });
    battle.units[0].hp = 1;
    expect(classAttributes("Mago").hp).toBe(21);
    expect(classAttributes("Mago").ep).toBe(15);
    expect(new Battle({ name: "Outro", cls: "Mago", race: "Humano" }).units[0].hp).toBe(21);
  });
});
