import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { Battle } from "../src/game/battle";
import { CLASSES } from "../src/game/archetypes";
import { newCampaign, parseCampaign, finishEncounter } from "../src/game/campaign";
import { loadCampaign, saveCampaign } from "../src/game/persistence/save";
import { levelFor, travelerAttributes } from "../src/game/progression";
const create = () => newCampaign({ name: "Teste", cls: "Guerreiro", race: "Humano" });

describe("progressão do viajante", () => {
  it("derrota não dá XP; vitória e repetição concedem apenas uma recompensa", () => {
    const c = create();
    expect(c.character.experience).toBe(0);
    expect(levelFor(c.character.experience)).toBe(1);
    finishEncounter(c, false);
    expect(c.character.experience).toBe(0);
    finishEncounter(c, true);
    expect(c.character.experience).toBe(100);
    expect(levelFor(c.character.experience)).toBe(2);
    finishEncounter(c, true);
    finishEncounter(c, false);
    expect(c.character.experience).toBe(100);
    expect(c.supplies).toBe(3);
  });
  it.each([
    ["Guerreiro", [31, 9, 9, 2, 7, 4]],
    ["Mago", [23, 18, 3, 11, 4, 4]],
    ["Ladino", [25, 11, 8, 3, 5, 5]],
  ] as const)("%s evolui com os ganhos publicados, sem mudar NPCs", (cls, expected) => {
    const c = newCampaign({ name: "Teste", cls, race: "Elfo" });
    const before = new Battle(c.character);
    finishEncounter(c, true);
    const after = new Battle(c.character);
    const hero = after.units[0];
    expect([hero.hp, hero.ep, hero.attack, hero.magic, hero.defense, hero.move]).toEqual(expected);
    expect(hero.maxHp).toBe(hero.hp);
    expect(hero.maxEp).toBe(hero.ep);
    expect(after.units.slice(1)).toEqual(before.units.slice(1));
    expect(before.units[0].hp).toBeLessThan(hero.hp);
  });
  it("migra schema 1 antes e depois da vitória sem recompensar novamente", () => {
    for (const passageCleared of [false, true]) {
      const { experience: _, ...character } = create().character;
      const old = { ...create(), schemaVersion: 1, character, passageCleared, supplies: passageCleared ? 3 : 0 };
      const migrated = parseCampaign(old)!;
      expect(migrated.schemaVersion).toBe(5);
      expect(migrated.character.experience).toBe(passageCleared ? 100 : 0);
      if (passageCleared) {
        expect(finishEncounter(migrated, true)).toBe(false);
        expect(migrated.character.experience).toBe(100);
      }
      expect(parseCampaign(migrated)).toEqual(migrated);
      expect(old.schemaVersion).toBe(1);
    }
  });
  it("rejeita XP inválido, ausente ou incompatível com o encontro no schema atual", () => {
    for (const xp of [undefined, null, -1, 1.5, 1, 100, 101, NaN, Infinity, "100"]) {
      const c = create();
      expect(parseCampaign({ ...c, character: { ...c.character, experience: xp } })).toBeNull();
    }
    const c = create();
    finishEncounter(c, true);
    expect(parseCampaign({ ...c, character: { ...c.character, experience: 0 } })).toBeNull();
    expect(parseCampaign({ ...c, schemaVersion: 6 })).toBeNull();
  });
  it("persistência migra checkpoint real antigo e grava schema 5", async () => {
    const { experience: _, ...character } = create().character;
    const old = { ...create(), schemaVersion: 1, character, passageCleared: true, metLyra: true, supplies: 3, position: { x: 1, y: 5 } };
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("basilis-campaign", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("checkpoints");
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("checkpoints", "readwrite");
        tx.objectStore("checkpoints").put(old, "main");
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
    const loaded = await loadCampaign();
    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") throw new Error("migration failed");
    expect(loaded.campaign.character.experience).toBe(100);
    expect(loaded.campaign.position).toEqual(old.position);
    expect(await saveCampaign(loaded.campaign)).toBe(true);
    expect(await loadCampaign()).toEqual(loaded);
    expect(finishEncounter(loaded.campaign, true)).toBe(false);
  });
  it("não altera catálogo nem acumula atributos ao reconstruir a batalha", () => {
    for (const cls of CLASSES) {
      const a = travelerAttributes(cls, 100);
      const b = travelerAttributes(cls, 100);
      a.hp = 0;
      expect(travelerAttributes(cls, 100)).toEqual(b);
      expect(levelFor(0)).toBe(1);
    }
  });
});
