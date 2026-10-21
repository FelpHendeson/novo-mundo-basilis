import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { CLASSES } from "../src/game/archetypes";
import { Battle } from "../src/game/battle";
import { equipAccessory, finishEncounter, newCampaign, parseCampaign } from "../src/game/campaign";
import { EQUIPMENT, EQUIPMENT_IDS, equippedAttributes, type EquipmentId } from "../src/game/equipment";
import { damage, TECHNIQUES } from "../src/game/model";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
const create = () => newCampaign({ name: "Teste", cls: "Guerreiro", race: "Humano" });

describe("inventário e acessório do viajante", () => {
  it("troca e remove sem acumular bônus ou compartilhar inventários", () => {
    const c = create(), other = create();
    expect(c.character.equipment).toBeNull();
    expect(c.inventory).toHaveLength(3);
    expect(equipAccessory(c, "training-band")).toBe(true);
    expect(equipAccessory(c, "training-band")).toBe(false);
    expect(new Battle(c.character).units[0].attack).toBe(10);
    equipAccessory(c, "reinforced-brooch");
    expect(new Battle(c.character).units[0].attack).toBe(8);
    expect(new Battle(c.character).units[0].defense).toBe(8);
    expect(equipAccessory(c, null)).toBe(true);
    expect(new Battle(c.character).units[0].defense).toBe(6);
    c.inventory.pop();
    expect(other.inventory).toHaveLength(3);
  });
  for (const cls of CLASSES) for (const experience of [0, 100]) for (const id of EQUIPMENT_IDS) {
    it(`${cls} / ${experience} XP / ${id}: ficha coincide com batalha e não altera NPCs`, () => {
      const profile = { name: "Teste", race: "Elfo", cls, experience };
      const base = new Battle(profile);
      const equipped = new Battle({ ...profile, equipment: id });
      const a = equippedAttributes(cls, experience, id);
      const hero = equipped.units[0], original = base.units[0], item = EQUIPMENT[id];
      expect({ hp:hero.hp, ep:hero.ep, attack:hero.attack, magic:hero.magic, defense:hero.defense, move:hero.move }).toEqual(a);
      expect(hero[item.stat]).toBe(original[item.stat] + item.bonus);
      expect(equipped.units.slice(1)).toEqual(base.units.slice(1));
      expect(hero.hp).toBe(original.hp);
      expect(hero.ep).toBe(original.ep);
      expect(hero.move).toBe(original.move);
    });
  }
  it("aplica ataque/magia/defesa à resolução do dano", () => {
    const c = create();
    const base = new Battle(c.character);
    equipAccessory(c, "training-band");
    const offensive = new Battle(c.character);
    expect(damage(offensive.units[0], offensive.units[2], TECHNIQUES.Guerreiro[0])).toBe(damage(base.units[0], base.units[2], TECHNIQUES.Guerreiro[0]) + 2);
    equipAccessory(c, "reinforced-brooch");
    const defensive = new Battle(c.character);
    expect(damage(defensive.units[2], defensive.units[0], TECHNIQUES.Guerreiro[0])).toBe(damage(base.units[2], base.units[0], TECHNIQUES.Guerreiro[0]) - 2);
    const mage = new Battle({ ...c.character, cls: "Mago", equipment: "simple-focus" });
    const bareMage = new Battle({ ...c.character, cls: "Mago", equipment: null });
    expect(damage(mage.units[0], mage.units[2], TECHNIQUES.Mago[0])).toBe(damage(bareMage.units[0], bareMage.units[2], TECHNIQUES.Mago[0]) + 2);
  });
  it("recusa item desconhecido ou não possuído", () => {
    const c = create();
    c.inventory = [];
    expect(equipAccessory(c, "training-band")).toBe(false);
    expect(equipAccessory(c, "forged" as EquipmentId)).toBe(false);
    expect(c.character.equipment).toBeNull();
  });
  it("rejeita inventário malformado e acessório ausente/não possuído no schema atual", () => {
    for (const inventory of [undefined, null, {}, ["unknown"], ["training-band", "training-band"], [123]]) {
      expect(parseCampaign({ ...create(), inventory })).toBeNull();
    }
    for (const equipment of [undefined, "unknown", 1, {}]) {
      const c = create();
      expect(parseCampaign({ ...c, character: { ...c.character, equipment } })).toBeNull();
    }
    const c = create();
    expect(parseCampaign({ ...c, inventory: [], character: { ...c.character, equipment: "training-band" } })).toBeNull();
  });
  it.each([1, 2])("migra schema %i preservando perfil, vitória e XP sem equipar automaticamente", (version) => {
    const c = create();
    finishEncounter(c, true);
    const { equipment: _, ...character } = c.character;
    const { inventory: __, ...old } = c;
    const source = { ...old, schemaVersion: version, character };
    const migrated = parseCampaign(source)!;
    expect(migrated.schemaVersion).toBe(8);
    expect(migrated.character.experience).toBe(100);
    expect(migrated.character.equipment).toBeNull();
    expect(migrated.inventory).toEqual(EQUIPMENT_IDS);
    expect(migrated.position).toEqual(c.position);
    expect(migrated.supplies).toBe(3);
    expect(parseCampaign(migrated)).toEqual(migrated);
    expect(source).not.toHaveProperty("inventory");
  });
  it("checkpoint persiste item equipado e inválido não sobrescreve o válido", async () => {
    const c = create();
    finishEncounter(c, true);
    equipAccessory(c, "simple-focus");
    expect(await saveCampaign(c)).toBe(true);
    expect(await loadCampaign()).toEqual({ status: "loaded", campaign: c });
    expect(await saveCampaign({ ...c, inventory: [] })).toBe(false);
    expect(await loadCampaign()).toEqual({ status: "loaded", campaign: c });
  });
  it("alterar equipamento da campanha não modifica uma batalha já iniciada", () => {
    const c = create();
    const battle = new Battle(c.character);
    equipAccessory(c, "training-band");
    expect(battle.units[0].attack).toBe(8);
    expect(new Battle(c.character).units[0].attack).toBe(10);
  });
});
