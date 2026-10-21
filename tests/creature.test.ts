import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { newCreature, observeCreature, avoidCreature, beginCreature, finishCreature, parseCreature } from "../src/game/creature";
import { newCampaign, parseCampaign, finishCampaignBattle, near } from "../src/game/campaign";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
import { Battle } from "../src/game/battle";
import { TECHNIQUES } from "../src/game/model";
import { journalEntries } from "../src/game/journal";
import { claimKit, advanceMana } from "../src/game/adaptation";
const create=()=>newCampaign({name:"Teste",cls:"Mago",race:"Humano"});
describe("primeiro encontro opcional",()=>{
  it("observa uma vez sem iniciar combate ou bloquear desvio",()=>{
    const c=newCreature(); expect(observeCreature(c)).toBe(true);
    expect(observeCreature(c)).toBe(false); expect(c.engaged).toBe(false);
    expect(c.outcome).toBe("pending"); expect(avoidCreature(c)).toBe(true);
    expect(c).toEqual({observed:true,engaged:false,outcome:"avoided"});
  });
  it("permite contornar sem observar e impede qualquer replay de resultado",()=>{
    const c=newCreature(); expect(avoidCreature(c)).toBe(true);
    const before=structuredClone(c);
    expect(beginCreature(c)).toBe(false); expect(observeCreature(c)).toBe(false);
    expect(avoidCreature(c)).toBe(false); expect(finishCreature(c,true)).toBe(false);
    expect(c).toEqual(before);
  });
  it.each([true,false])("vitória/retirada é terminal e idempotente: %s",won=>{
    const c=newCreature(); expect(finishCreature(c,won)).toBe(false);
    beginCreature(c); expect(avoidCreature(c)).toBe(false); expect(observeCreature(c)).toBe(false);
    expect(finishCreature(c,won)).toBe(true);
    expect(c.outcome).toBe(won?"repelled":"retreated");
    expect(finishCreature(c,!won)).toBe(false); expect(beginCreature(c)).toBe(false);
  });
  it("reentrada do confronto interrompido não cria recompensas ou contadores",()=>{
    const c=create(); beginCreature(c.creature); const before=structuredClone(c);
    for(let i=0;i<30;i++) expect(beginCreature(c.creature)).toBe(true);
    expect(c).toEqual(before);
  });
  it.each([true,false])("resultado da criatura nunca libera ruínas, XP ou suprimentos: %s",won=>{
    const c=create(); claimKit(c.adaptation); c.adaptation.potions=1;
    beginCreature(c.creature);
    expect(finishCampaignBattle(c,"creature",won)).toBe(true);
    expect(finishCampaignBattle(c,"creature",won)).toBe(false);
    expect(c.character.experience).toBe(0); expect(c.supplies).toBe(0);
    expect(c.passageCleared).toBe(false); expect(c.adaptation.potions).toBe(1);
    expect(finishCampaignBattle(c,"ruins",true)).toBe(true);
    expect(c.character.experience).toBe(100); expect(c.supplies).toBe(3);
    expect(finishCampaignBattle(c,"ruins",true)).toBe(false);
  });
  it.each([1,2,3,4,5,6])("schema %i migra sem forçar contato ou mudar conquistas",schemaVersion=>{
    const c=create(); finishCampaignBattle(c,"ruins",true);
    c.metLyra=true; c.base={prepared:true,lyraRecruited:true,lyraDeployed:false}; c.supplies=0;
    c.character.equipment="simple-focus"; claimKit(c.adaptation); advanceMana(c.adaptation,true);
    const old={...structuredClone(c),schemaVersion};
    const migrated=parseCampaign(old)!;
    expect(migrated.schemaVersion).toBe(9); expect(migrated.creature).toEqual(newCreature());
    expect(migrated.position).toEqual(c.position); expect(migrated.character.experience).toBe(100);
    expect(migrated.supplies).toBe(0); expect(migrated.metLyra).toBe(true);
    if(schemaVersion>=3) expect(migrated.character.equipment).toBe("simple-focus");
    if(schemaVersion>=4) expect(migrated.base).toEqual(c.base);
    if(schemaVersion>=6) expect(migrated.adaptation).toEqual(c.adaptation);
  });
  it.each(["pending","avoided","repelled","retreated"] as const)("persiste descoberta e resultado: %s",async outcome=>{
    const c=create(); observeCreature(c.creature);
    if(outcome==="avoided") avoidCreature(c.creature);
    if(outcome==="repelled" || outcome==="retreated") { beginCreature(c.creature); finishCreature(c.creature,outcome==="repelled"); }
    expect(await saveCampaign(c)).toBe(true);
    expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});
  });
  it("retoma confronto interrompido com consumo preservado",async()=>{
    const c=create(); claimKit(c.adaptation); c.adaptation.potions=2; beginCreature(c.creature);
    expect(await saveCampaign(c)).toBe(true);
    const r=await loadCampaign(); if(r.status!=="loaded") throw Error("checkpoint");
    expect(r.campaign.creature.engaged).toBe(true); expect(r.campaign.creature.outcome).toBe("pending");
    expect(r.campaign.adaptation.potions).toBe(2);
    expect(finishCreature(r.campaign.creature,false)).toBe(true);
  });
  it("rejeita estados impossíveis sem sobrescrever checkpoint",async()=>{
    const c=create(); expect(await saveCampaign(c)).toBe(true);
    for(const bad of [null,{}, {...newCreature(),outcome:"unknown"}, {...newCreature(),observed:1},
      {...newCreature(),outcome:"repelled"}, {...newCreature(),outcome:"retreated"}, {...newCreature(),outcome:"avoided",engaged:true}]) {
      expect(parseCreature(bad)).toBeNull(); expect(parseCampaign({...c,creature:bad})).toBeNull();
    }
    expect(await saveCampaign({...c,creature:{...c.creature,outcome:"repelled"}})).toBe(false);
    expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});
  });
  it("diário não revela observação ou resultado antes da escolha",()=>{
    const c=create(); expect(journalEntries(c).some(s=>s.includes("Toca observada"))).toBe(false);
    observeCreature(c.creature); expect(journalEntries(c).some(s=>s.includes("Toca observada"))).toBe(true);
    avoidCreature(c.creature); expect(journalEntries(c).some(s=>s.includes("sem confronto"))).toBe(true);
    expect(near(c,3,1)).toBe(false); c.position={x:3,y:2}; expect(near(c,3,1)).toBe(true);
  });
});
describe("missões isoladas e combate da criatura",()=>{
  it("ruínas mantêm unidades e técnicas anteriores",()=>{
    const b=new Battle(create().character);
    expect(b.units.map(u=>u.id)).toEqual(["hero","lyra","bandit1","bandit2"]);
    expect(b.techniques(b.units[2])).toEqual(TECHNIQUES.Guerreiro);
  });
  it.each(["Guerreiro","Mago","Ladino"] as const)("vitória alcançável sem kit ou mana tutorial: %s",cls=>{
    const b=new Battle({name:"Teste",cls,race:"Humano"},false,undefined,"creature");
    expect(b.allies.length).toBe(1); expect(b.enemies.length).toBe(1);
    for(let i=0;i<10 && b.phase!=="ended";i++) {
      const hero=b.allies[0]; b.confirm(hero.x,hero.y); b.confirm(5,4); b.openSkills(); b.chooseSkill(0);
      b.confirm(b.enemies[0].x,b.enemies[0].y);
      if(b.phase==="enemy") b.enemyTurn();
    }
    expect(b.phase).toBe("ended"); expect(b.enemies.length).toBe(0); expect(b.note).toContain("recua");
  });
  it("criatura usa garrada, não técnicas humanas, e derrota é saída segura",()=>{
    const b=new Battle(create().character,false,undefined,"creature");
    expect(b.techniques(b.enemies[0]).map(t=>t.name)).toEqual(["Garrada"]);
    b.enemies[0].x=4; b.enemies[0].y=4; b.allies[0].hp=1; b.endTurn(); b.enemyTurn();
    expect(b.phase).toBe("ended"); expect(b.note).toContain("jornada continua");
  });
  it("cinemática confirma conclusão uma só vez e conserva o snapshot animal",()=>{
    const b=new Battle(create().character,true,undefined,"creature");
    b.enemies[0].hp=1; b.confirm(3,4); b.confirm(3,4); b.openSkills(); b.chooseSkill(0); b.confirm(6,4);
    const event=b.pending!; expect(event.defender.id).toBe("creature"); expect(b.phase).toBe("presentation");
    b.completePresentation(event.id); expect(b.phase).toBe("ended");
    const before=structuredClone(b.units); b.completePresentation(event.id); expect(b.units).toEqual(before);
  });
});
