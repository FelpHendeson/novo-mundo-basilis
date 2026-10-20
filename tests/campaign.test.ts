import "fake-indexeddb/auto";
import { describe, it, expect, vi } from "vitest";
import {
  restAtCamp,
  newCampaign,
  moveExplorer,
  parseCampaign,
  finishEncounter,
  near,
} from "../src/game/campaign";
import { loadCampaign, saveCampaign } from "../src/game/persistence/save";
const create = () =>
  newCampaign({ name: "Felipe", cls: "Mago", race: "Draconiano" });
describe("exploração e checkpoint", () => {
  it("bloqueia saltos, limites, barreiras e casa do NPC", () => {
    const c = create();
    expect(moveExplorer(c, -2, 0)).toBe(false);
    c.position = { x: 0, y: 0 };
    expect(moveExplorer(c, -1, 0)).toBe(false);
    c.position = { x: 3, y: 1 };
    expect(moveExplorer(c, 1, 0)).toBe(false);
    c.position = { x: 1, y: 3 };
    expect(moveExplorer(c, 1, 0)).toBe(false);
  });
  it("permite chegar ao NPC e atravessar a abertura até as ruínas", () => {
    const c = create();
    moveExplorer(c, 1, 0);
    expect(near(c, 2, 3)).toBe(true);
    for (const [dx, dy] of [
      [1, 0],
      [0, -1],
      [0, -1],
      [1, 0],
      [1, 0],
      [1, 0],
    ])
      expect(moveExplorer(c, dx, dy)).toBe(true);
    expect(near(c, 6, 2)).toBe(true);
  });
  it("vitória recompensa uma vez; derrota não altera progresso", () => {
    const c = create();
    expect(finishEncounter(c, false)).toBe(false);
    expect(c.supplies).toBe(0);
    expect(finishEncounter(c, true)).toBe(true);
    expect(finishEncounter(c, true)).toBe(false);
    expect(c.supplies).toBe(3);
  });
  it("rejeita schema futuro, coordenadas inválidas e perfil inválido", () => {
    const c = create();
    expect(parseCampaign({ ...c, schemaVersion: 4 })).toBeNull();
    expect(parseCampaign({ ...c, position: { x: 4, y: 0 } })).toBeNull();
    expect(
      parseCampaign({ ...c, character: { ...c.character, cls: "Deus" } }),
    ).toBeNull();
    expect(parseCampaign({ ...c, supplies: -1 })).toBeNull();
  });
  it("grava e restaura perfil, posição, diálogo e vitória com IndexedDB", async () => {
    const c = create();
    c.position = { x: 6, y: 2 };
    c.metLyra = true;
    finishEncounter(c, true);
    expect(await saveCampaign(c)).toBe(true);
    const loaded = await loadCampaign();
    expect(loaded.status).toBe("loaded");
    if (loaded.status === "loaded") expect(loaded.campaign).toEqual(c);
  });
  it("serializa escritas e captura snapshots sem regredir ao mover rápido", async () => {
    const c = create();
    const first = saveCampaign(c);
    c.position = { x: 3, y: 4 };
    const last = saveCampaign(c);
    c.position = { x: 0, y: 0 };
    await Promise.all([first, last]);
    const loaded = await loadCampaign();
    expect(loaded.status === "loaded" && loaded.campaign.position).toEqual({
      x: 3,
      y: 4,
    });
  });
  it("não sobrescreve checkpoint com objeto inválido", async () => {
    expect(await saveCampaign({ ...create(), schemaVersion: 4 } as never)).toBe(
      false,
    );
    expect((await loadCampaign()).status).toBe("loaded");
  });
  it("conclusão só ocorre perto do abrigo após vitória e é persistida", async () => {
    const c = create();
    expect(restAtCamp(c)).toBe(false);
    finishEncounter(c, true);
    c.position = { x: 6, y: 2 };
    expect(restAtCamp(c)).toBe(false);
    c.position = { x: 1, y: 4 };
    expect(restAtCamp(c)).toBe(true);
    await saveCampaign(c);
    const r = await loadCampaign();
    expect(r.status === "loaded" && r.campaign.expeditionComplete).toBe(true);
  });
  it("falha de armazenamento é relatada sem lançar erro na sessão", async () => {
    vi.stubGlobal("indexedDB", {
      open() {
        throw new Error("denied");
      },
    });
    expect(await saveCampaign(create())).toBe(false);
    expect((await loadCampaign()).status).toBe("unavailable");
    vi.unstubAllGlobals();
  });
});
