import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { newAdaptation, claimKit, advanceMana, parseAdaptation } from "../src/game/adaptation";
import { newCampaign, parseCampaign, finishEncounter } from "../src/game/campaign";
import { Battle } from "../src/game/battle";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
const create = () => newCampaign({ name: "Ari", cls: "Mago", race: "Humano" });
describe("kit, mana e consumíveis", () => {
  it("recebe somente uma vez, inclusive após consumir e reabrir", () => {
    const a = newAdaptation(); expect(claimKit(a)).toBe(true);
    a.potions = 0; a.rations = 1;
    for(let i=0;i<20;i++) expect(claimKit(a)).toBe(false);
    expect(a.potions).toBe(0); expect(a.rations).toBe(1);
  });
  it("mana é independente do kit, opcional, limitada e sem XP ou recursos", () => {
    const c = create(); const before = structuredClone(c);
    expect(advanceMana(c.adaptation)).toBe(true);
    expect(advanceMana(c.adaptation, true)).toBe(true);
    expect(advanceMana(c.adaptation)).toBe(true);
    for(let i=0;i<20;i++) expect(advanceMana(c.adaptation)).toBe(false);
    expect(c.adaptation).toEqual({ ...before.adaptation, manaStep:3, assisted:true });
    expect(c.character).toEqual(before.character);
    expect(c.supplies).toBe(0);
  });
  it.each(["Guerreiro","Mago","Ladino"] as const)("arma compatível não se acumula nem modifica Lyra: %s", cls => {
    const c = newCampaign({ name:"Ari", cls, race:"Humano" });
    const bare = new Battle(c.character); claimKit(c.adaptation);
    const armed = new Battle(c.character, false, c.adaptation);
    const stat = cls === "Mago" ? "magic" : "attack";
    expect(armed.units[0][stat]).toBe(bare.units[0][stat]+1);
    expect(new Battle(c.character, false, c.adaptation).units[0][stat]).toBe(armed.units[0][stat]);
    expect(armed.units[1]).toEqual(bare.units[1]);
  });
  it("não gasta item fora da ação, em recurso cheio, morto ou estoque vazio", () => {
    const c = create(); claimKit(c.adaptation);
    const b = new Battle(c.character, false, c.adaptation);
    expect(b.useItem("potions")).toBe(false);
    b.confirm(1,4); b.confirm(1,4);
    expect(b.useItem("potions")).toBe(false);
    expect(b.useItem("rations")).toBe(false);
    b.selected!.hp = 0;
    expect(b.useItem("potions")).toBe(false);
    b.selected!.hp = 1; c.adaptation.potions = 0;
    expect(b.useItem("potions")).toBe(false);
    expect(b.phase).toBe("action");
  });
  it.each(["potions","rations"] as const)("uso restaura até o máximo, gasta um item e uma ação: %s", item => {
    const c = create(); claimKit(c.adaptation);
    const b = new Battle(c.character, false, c.adaptation);
    b.confirm(1,4); b.confirm(1,4); const u = b.selected!;
    u.hp--; u.ep--;
    const qty = c.adaptation[item];
    expect(b.useItem(item)).toBe(true);
    expect(item === "potions" ? u.hp : u.ep).toBe(item === "potions" ? u.maxHp : u.maxEp);
    expect(c.adaptation[item]).toBe(qty-1);
    expect(u.acted).toBe(true); expect(b.selected).toBeNull();
    expect(b.useItem(item)).toBe(false);
    b.cancel(); expect(c.adaptation[item]).toBe(qty-1);
  });
  it("cura 12 HP e ração restaura 4 EN sem alterar máximos", () => {
    const c=create(); claimKit(c.adaptation); const b=new Battle(c.character,false,c.adaptation);
    b.confirm(1,4); b.confirm(1,4); const hero=b.selected!; hero.hp=1;
    b.useItem("potions"); expect(hero.hp).toBe(13);
    b.confirm(1,6); b.confirm(1,6); const lyra=b.selected!; lyra.ep=0;
    b.useItem("rations"); expect(lyra.ep).toBe(4);
  });
  it("treino com cópia não gasta kit da campanha", () => {
    const c=create(); claimKit(c.adaptation);
    const b=new Battle(c.character,false,structuredClone(c.adaptation));
    b.confirm(1,4); b.confirm(1,4); b.selected!.hp=1; b.useItem("potions");
    expect(c.adaptation.potions).toBe(3); expect(b.adaptation!.potions).toBe(2);
  });
  it("migra schema 5 preservando jornada, equipamento, XP e recursos sem premiar kit", () => {
    const c=create(); finishEncounter(c,true); c.metLyra=true; c.character.equipment="simple-focus";
    const { adaptation:_, ...old }=c;
    const migrated=parseCampaign({...old,schemaVersion:5})!;
    expect(migrated).toEqual(c);
    expect(migrated.adaptation.claimed).toBe(false);
    expect(old).not.toHaveProperty("adaptation");
  });
  it("retoma tutorial parcial e estoque usado via IndexedDB, sem reposição", async () => {
    const c=create(); claimKit(c.adaptation); advanceMana(c.adaptation,true); c.adaptation.potions=1;
    expect(await saveCampaign(c)).toBe(true);
    const r=await loadCampaign();
    if(r.status!=="loaded") throw Error("checkpoint");
    expect(r.campaign).toEqual(c);
    expect(claimKit(r.campaign.adaptation)).toBe(false);
  });
  it("rejeita estados impossíveis e não sobrescreve checkpoint válido", async () => {
    const c=create(); expect(await saveCampaign(c)).toBe(true);
    for(const bad of [null,{}, {...newAdaptation(),potions:1}, {...newAdaptation(),manaStep:4},
      {...newAdaptation(),manaStep:0.5}, {...newAdaptation(),assisted:true}, {...newAdaptation(),claimed:true,rations:-1},
      {...newAdaptation(),claimed:true,potions:4}, {...newAdaptation(),claimed:"yes"}]) {
      expect(parseAdaptation(bad)).toBeNull();
      expect(parseCampaign({...c,adaptation:bad})).toBeNull();
    }
    expect(await saveCampaign({...c,adaptation:{...c.adaptation,potions:4}})).toBe(false);
    expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});
  });
});
