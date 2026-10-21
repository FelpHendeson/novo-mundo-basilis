import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { newCampaign, parseCampaign } from "../src/game/campaign";
import { newNarrative, chooseDialogue, openSystem, campaignScene, parseNarrative, recordNarrativeEvent, NARRATIVE_EVENTS } from "../src/game/narrative";
import { journalEntries } from "../src/game/journal";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
const create = () => newCampaign({ name: "Teste", cls: "Mago", race: "Elfo" });

describe("introdução, Sistema e diário", () => {
  it("nova jornada retoma chegada; adiar libera exploração sem remover a consulta", () => {
    const c = create();
    expect(campaignScene(c.narrative)).toBe("Arrival");
    recordNarrativeEvent(c.narrative, "system.welcome");
    expect(chooseDialogue(c.narrative, "defer")).toBe(true);
    expect(campaignScene(c.narrative)).toBe("Exploration");
    expect(c.narrative.appliedEvents).toContain("system.deferred");
    openSystem(c.narrative);
    expect(campaignScene(c.narrative)).toBe("Arrival");
    expect(c.narrative.nodeId).toBe("welcome");
    expect(c.narrative.appliedEvents).toContain("arrival.completed");
  });
  it("reentrada não duplica eventos nem altera recursos, perfil ou posição", () => {
    const c = create();
    const { narrative: _, ...before } = structuredClone(c);
    for (let i = 0; i < 30; i++) {
      openSystem(c.narrative);
      chooseDialogue(c.narrative, "where");
      chooseDialogue(c.narrative, "identity");
      chooseDialogue(c.narrative, "defer");
    }
    expect(new Set(c.narrative.appliedEvents).size).toBe(c.narrative.appliedEvents.length);
    expect(c.narrative.appliedEvents.length).toBeLessThanOrEqual(NARRATIVE_EVENTS.length);
    const { narrative: __, ...after } = c;
    expect(after).toEqual(before);
  });
  it("repetir resposta é idempotente e continuar não exige todas as perguntas", () => {
    const n = newNarrative();
    expect(chooseDialogue(n, "where")).toBe(true);
    expect(chooseDialogue(n, "where")).toBe(false);
    expect(chooseDialogue(n, "continue")).toBe(true);
    expect(chooseDialogue(n, "identity")).toBe(false);
    expect(campaignScene(n)).toBe("Exploration");
    expect(n.appliedEvents).not.toContain("system.identity");
  });
  it.each([1, 2, 3, 4])("migra fixture schema %i sem reiniciar chegada ou regressar conquistas", version => {
    const fixture: Record<string, unknown> = {
      schemaVersion: version,
      character: { name: "Legado", cls: "Guerreiro", race: "Draconiano", ...(version >= 2 ? { experience:100 } : {}), ...(version >= 3 ? { equipment: "reinforced-brooch" } : {}) },
      position: { x: 3, y: 2 }, metLyra: true, passageCleared: true, supplies: version === 4 ? 0 : 3, expeditionComplete: true,
      ...(version >= 3 ? { inventory: ["training-band", "simple-focus", "reinforced-brooch"] } : {}),
      ...(version === 4 ? { base: { prepared:true, lyraRecruited:true, lyraDeployed:false } } : {}),
    };
    const c = parseCampaign(fixture)!;
    expect(c.schemaVersion).toBe(8);
    expect(campaignScene(c.narrative)).toBe("Exploration");
    expect(c.position).toEqual(fixture.position);
    expect(c.character.experience).toBe(100);
    expect(c.character.equipment).toBe(version >= 3 ? "reinforced-brooch" : null);
    expect(c.supplies).toBe(fixture.supplies);
    expect(c.base.prepared).toBe(version === 4);
    expect(c.base.lyraRecruited).toBe(version === 4);
    expect(c.base.lyraDeployed).toBe(false);
    expect(c.narrative.appliedEvents).toEqual(["journey.legacy", "arrival.completed"]);
    expect(parseCampaign(c)).toEqual(c);
    expect(fixture).not.toHaveProperty("narrative");
  });
  it("retoma resposta persistida em vez de repetir a introdução ou perder a pergunta", async () => {
    const c = create();
    recordNarrativeEvent(c.narrative, "system.welcome");
    chooseDialogue(c.narrative, "identity");
    expect(await saveCampaign(c)).toBe(true);
    const r = await loadCampaign();
    expect(r.status).toBe("loaded");
    if (r.status !== "loaded") throw new Error("save failed");
    expect(campaignScene(r.campaign.narrative)).toBe("Arrival");
    expect(r.campaign.narrative.nodeId).toBe("identity");
    chooseDialogue(r.campaign.narrative, "defer");
    await saveCampaign(r.campaign);
    const after = await loadCampaign();
    expect(after.status === "loaded" && campaignScene(after.campaign.narrative)).toBe("Exploration");
  });
  it("diário revela somente informações consultadas e eventos realmente concluídos", () => {
    const c = create();
    chooseDialogue(c.narrative, "where");
    expect(journalEntries(c).some(text => text.includes("região não identificada"))).toBe(true);
    expect(journalEntries(c).some(text => text.includes("não é exclusivo"))).toBe(false);
    c.metLyra = true;
    c.passageCleared = true;
    c.base.prepared = true;
    c.base.lyraRecruited = true;
    expect(journalEntries(c).some(text => text.includes("Abrigo preparado"))).toBe(true);
    expect(journalEntries(c).some(text => text.includes("na reserva"))).toBe(true);
  });
  it("rejeita nós, cenas, eventos duplicados/desconhecidos e estados incoerentes", () => {
    for (const value of [null, {}, { ...newNarrative(), sceneId:"CASTLE" }, { ...newNarrative(), nodeId:"unknown" }, { ...newNarrative(), appliedEvents:["grant.gold"] }, { ...newNarrative(), appliedEvents:["system.where", "system.where"] }, { ...newNarrative(), appliedEvents:new Array(1) }, { ...newNarrative(), sceneId:"AREA_CLEARING" }, { ...newNarrative(), nodeId:"where" }, { ...newNarrative(), nodeId:"deferred" }]) expect(parseNarrative(value)).toBeNull();
    expect(parseCampaign({ ...create(), narrative:undefined })).toBeNull();
    expect(parseCampaign({ ...create(), schemaVersion:9 })).toBeNull();
  });
  it("checkpoint narrativo inválido não sobrescreve save válido", async () => {
    const c = create();
    chooseDialogue(c.narrative, "continue");
    expect(await saveCampaign(c)).toBe(true);
    expect(await saveCampaign({ ...c, narrative:{ ...c.narrative, appliedEvents:[] } })).toBe(false);
    expect(await loadCampaign()).toEqual({ status:"loaded", campaign:c });
  });
});
