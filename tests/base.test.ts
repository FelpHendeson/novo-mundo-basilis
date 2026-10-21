import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { Battle } from "../src/game/battle";
import { newCampaign, finishEncounter, prepareBase, recruitLyra, setLyraDeployed, trainingCharacter, parseCampaign } from "../src/game/campaign";
import { loadCampaign, saveCampaign } from "../src/game/persistence/save";
const create = () => newCampaign({ name: "Teste", cls: "Guerreiro", race: "Humano" });
const victorious = () => { const c = create(); c.metLyra = true; finishEncounter(c, true); return c; };
const prepared = () => { const c = victorious(); prepareBase(c); return c; };
const recruited = () => { const c = prepared(); c.position = { x: 1, y: 3 }; recruitLyra(c); return c; };

describe("base, recrutamento e formação", () => {
  it("primeiro encontro mantém Lyra temporária sem recrutar", () => {
    const c = create();
    expect(new Battle(c.character).allies.map(u => u.id)).toEqual(["hero", "lyra"]);
    expect(c.base.lyraRecruited).toBe(false);
    expect(trainingCharacter(c)).toBeNull();
    expect(recruitLyra(c)).toBe(false);
  });
  it("base exige vitória, proximidade e recursos; custo é cobrado uma vez", () => {
    const c = create();
    c.supplies = 3;
    expect(prepareBase(c)).toBe(false);
    c.supplies = 0;
    finishEncounter(c, true);
    c.position = { x: 6, y: 2 };
    expect(prepareBase(c)).toBe(false);
    c.position = { x: 1, y: 4 };
    c.supplies = 2;
    expect(prepareBase(c)).toBe(false);
    c.supplies = 3;
    expect(prepareBase(c)).toBe(true);
    expect(c.supplies).toBe(0);
    expect(prepareBase(c)).toBe(false);
    expect(finishEncounter(c, true)).toBe(false);
    expect(c.supplies).toBe(0);
  });
  it("convite exige base, diálogo e proximidade; recruta uma vez e ativa Lyra", () => {
    const c = victorious();
    expect(recruitLyra(c)).toBe(false);
    prepareBase(c);
    c.position = { x: 6, y: 2 };
    expect(recruitLyra(c)).toBe(false);
    c.position = { x: 1, y: 3 };
    c.metLyra = false;
    expect(recruitLyra(c)).toBe(false);
    c.metLyra = true;
    expect(recruitLyra(c)).toBe(true);
    expect(c.base.lyraDeployed).toBe(true);
    expect(recruitLyra(c)).toBe(false);
    expect(c.character.experience).toBe(100);
  });
  it("formação só muda junto à base e só inclui aliado recrutado", () => {
    const c = prepared();
    expect(setLyraDeployed(c, true)).toBe(false);
    c.position = { x: 1, y: 3 };
    recruitLyra(c);
    expect(setLyraDeployed(c, false)).toBe(false);
    c.position = { x: 1, y: 4 };
    expect(setLyraDeployed(c, false)).toBe(true);
    expect(setLyraDeployed(c, false)).toBe(false);
    expect(new Battle(trainingCharacter(c)!).allies.map(u => u.id)).toEqual(["hero"]);
    expect(setLyraDeployed(c, true)).toBe(true);
    expect(new Battle(trainingCharacter(c)!).allies.map(u => u.id)).toEqual(["hero", "lyra"]);
  });
  it("treino disponível apenas na base, snapshot não muda campanha nem formação", () => {
    const c = recruited();
    expect(trainingCharacter(c)).toBeNull();
    c.position = { x: 1, y: 4 };
    const before = structuredClone(c);
    const character = trainingCharacter(c)!;
    const battle = new Battle(character);
    battle.units[0].hp = 0;
    battle.units[1].hp = 0;
    battle.endTurn(); battle.enemyTurn();
    expect(c).toEqual(before);
    expect(finishEncounter(c, true)).toBe(false);
    expect(c.supplies).toBe(0);
    expect(c.character.experience).toBe(100);
    setLyraDeployed(c, false);
    expect(new Battle(character).allies).toHaveLength(2);
  });
  it.each([1, 2, 3])("migra schema %i sem gastar suprimentos ou recrutar automaticamente", (schemaVersion) => {
    const c = victorious();
    const { base: _, ...old } = c;
    const migrated = parseCampaign({ ...old, schemaVersion })!;
    expect(migrated.schemaVersion).toBe(10);
    expect(migrated.base).toEqual({ prepared: false, lyraRecruited: false, lyraDeployed: false });
    expect(migrated.supplies).toBe(3);
    expect(migrated.character.experience).toBe(100);
    expect(migrated.position).toEqual(c.position);
  });
  it("rejeita base malformada ou estados impossíveis", () => {
    for (const base of [undefined, null, {}, { prepared: "yes", lyraRecruited: false, lyraDeployed: false }, { prepared: false, lyraRecruited: true, lyraDeployed: false }, { prepared: false, lyraRecruited: false, lyraDeployed: true }, { prepared: true, lyraRecruited: false, lyraDeployed: false }]) {
      expect(parseCampaign({ ...create(), base })).toBeNull();
    }
    const c = recruited();
    expect(parseCampaign({ ...c, metLyra: false })).toBeNull();
  });
  it("rejeita inventário esparso corrompido em vez de falhar na interface", () => {
    expect(parseCampaign({ ...create(), inventory: new Array(1) })).toBeNull();
  });
  it("checkpoint conserva base, reserva, equipamento, recursos e XP", async () => {
    const c = recruited();
    c.position = { x: 1, y: 4 };
    c.character.equipment = "reinforced-brooch";
    setLyraDeployed(c, false);
    expect(await saveCampaign(c)).toBe(true);
    expect(await loadCampaign()).toEqual({ status: "loaded", campaign: c });
    expect(await saveCampaign({ ...c, base: { ...c.base, lyraRecruited: false, lyraDeployed: true } })).toBe(false);
    expect(await loadCampaign()).toEqual({ status: "loaded", campaign: c });
  });
});
