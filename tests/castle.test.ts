import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { newCastle, parseCastle, CASTLE_POINTS, POINT_IDS, THRONE, moveInCastle, inspectCastle, activateThrone, deferCastle, claimCastle, prioritizeRepair, normalizeCastleName, type CastleState } from "../src/game/castle";
import { CASTLE_ENTRANCE, castlePassable } from "../src/game/areas";
import { newCampaign, parseCampaign, moveExplorer, campaignStartScene, prepareBase, recruitLyra, setLyraDeployed, trainingCharacter, finishEncounter } from "../src/game/campaign";
import { enterCastle, leaveCastle, canEnterCastle, canLeaveCastle } from "../src/game/travel";
import { chooseDialogue, openSystem } from "../src/game/narrative";
import { claimKit, advanceMana } from "../src/game/adaptation";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
import { journalEntries } from "../src/game/journal";
const create=()=>{const c=newCampaign({name:"Ari",cls:"Mago",race:"Elfo"});chooseDialogue(c.narrative,"continue");return c;};
const arrive=()=>{const c=create();c.position={x:6,y:1};expect(enterCastle(c)).toBe(true);return c;};
const atThrone=(c:CastleState)=>{c.position={x:3,y:1};};
/** Walk the actual map via legal unit steps, rather than assigning a destination. */
function walk(c:CastleState,target:{x:number;y:number}) {
 const queue=[{...c.position,path:[] as [number,number][]}],seen=new Set<string>();
 for(let i=0;i<queue.length;i++) {
  const p=queue[i]; if(p.x===target.x&&p.y===target.y){for(const [dx,dy] of p.path)expect(moveInCastle(c,dx,dy)).toBe(true);return;}
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]] as const){const x=p.x+dx,y=p.y+dy,key=`${x},${y}`;
   if(!castlePassable(x,y)||seen.has(key))continue;seen.add(key);queue.push({x,y,path:[...p.path,[dx,dy]]});}
 }throw Error("Unreachable map point");
}
describe("castelo: rota e exploração",()=>{
 it("exige proximidade da saída e não exige kit, criatura, vitória ou Lyra",()=>{
  const c=create();expect(canEnterCastle(c)).toBe(false);expect(enterCastle(c)).toBe(false);
  c.position={x:6,y:1};const before=structuredClone(c);expect(enterCastle(c)).toBe(true);
  expect(c.area).toBe("castle");expect(c.castle.visited).toBe(true);expect(c.castle.position).toEqual(CASTLE_ENTRANCE);
  expect(c.position).toEqual(before.position);expect(c.character).toEqual(before.character);
  expect(c.adaptation.claimed).toBe(false);expect(c.creature.outcome).toBe("pending");expect(c.passageCleared).toBe(false);expect(c.metLyra).toBe(false);
  expect(enterCastle(c)).toBe(false);
 });
 it("entrada não pode antecipar a criação/chegada e narrativa",()=>{
  const c=newCampaign({name:"Novo",cls:"Guerreiro",race:"Humano"});c.position={x:6,y:1};expect(enterCastle(c)).toBe(false);
 });
 it("impede passos diagonais, saltos, paredes e ações da clareira dentro do castelo",()=>{
  const c=arrive();expect(moveInCastle(c.castle,1,1)).toBe(false);expect(moveInCastle(c.castle,0,-2)).toBe(false);
  expect(moveInCastle(c.castle,-1,0)).toBe(false);expect(moveExplorer(c,1,0)).toBe(false);
  expect(prepareBase(c)).toBe(false);expect(recruitLyra(c)).toBe(false);expect(setLyraDeployed(c,true)).toBe(false);expect(trainingCharacter(c)).toBeNull();
 });
 it("todos os pontos e trono são alcançáveis; inspeções e saída funcionam caminhando",()=>{
  const c=arrive();
  for(const id of POINT_IDS){walk(c.castle,CASTLE_POINTS[id]);expect(inspectCastle(c.castle,id)).toBe(true);expect(inspectCastle(c.castle,id)).toBe(false);}
  expect(c.castle.inspected.length).toBe(7);walk(c.castle,THRONE);expect(activateThrone(c.castle)).toBe(true);
  expect(leaveCastle(c)).toBe(false);walk(c.castle,CASTLE_ENTRANCE);expect(canLeaveCastle(c)).toBe(true);expect(leaveCastle(c)).toBe(true);
  expect(c.area).toBe("clearing");expect(c.position).toEqual({x:6,y:1});expect(c.castle.inspected.length).toBe(7);
 });
 it("retorno à clareira preserva conquistas, consumíveis, XP e formação legados",()=>{
  const c=create();finishEncounter(c,true);c.metLyra=true;c.base={prepared:true,lyraRecruited:true,lyraDeployed:false};c.supplies=0;
  c.character.equipment="simple-focus";claimKit(c.adaptation);advanceMana(c.adaptation,true);c.adaptation.potions=1;c.position={x:6,y:1};
  const before=structuredClone(c);enterCastle(c);expect(leaveCastle(c)).toBe(true);
  const {castle:_,...after}=c;const {castle:__,...expected}=before;expect(after).toEqual(expected);
 });
 it("reentrada começa pelo portão; continuar save conserva posição interna",()=>{
  const c=arrive();walk(c.castle,{x:3,y:1});const saved=parseCampaign(c)!;expect(saved.castle.position).toEqual({x:3,y:1});
  expect(campaignStartScene(saved)).toBe("Castle");walk(c.castle,CASTLE_ENTRANCE);leaveCastle(c);enterCastle(c);expect(c.castle.position).toEqual(CASTLE_ENTRANCE);
 });
 it("Sistema e adiamento retornam à área correta sem mover o personagem",()=>{
  const c=arrive();walk(c.castle,{x:3,y:1});openSystem(c.narrative);expect(campaignStartScene(c)).toBe("Arrival");
  const saved=parseCampaign(c)!;expect(saved.area).toBe("castle");expect(chooseDialogue(saved.narrative,"defer")).toBe(true);
  expect(campaignStartScene(saved)).toBe("Castle");expect(saved.castle.position).toEqual({x:3,y:1});
 });
});
describe("posse voluntária, nomes e prioridade",()=>{
 it("trono, adiamento e posse exigem proximidade e intenção",()=>{
  const c=arrive().castle;expect(activateThrone(c)).toBe(false);expect(claimCastle(c,"Aurora")).toBe(false);expect(deferCastle(c)).toBe(false);
  atThrone(c);expect(claimCastle(c,"Aurora")).toBe(false);expect(activateThrone(c)).toBe(true);expect(activateThrone(c)).toBe(false);
  expect(deferCastle(c)).toBe(true);expect(deferCastle(c)).toBe(false);expect(c.name).toBeNull();
  expect(claimCastle(c,"Aurora")).toBe(true);expect(c.claimDeferred).toBe(true);expect(claimCastle(c,"Outra posse")).toBe(false);expect(c.name).toBe("Aurora");
 });
 it.each(["", "  ", "AB", "x".repeat(33), "<img src=x>", "A/B", "Casa\nNova", "A\u0000B", "Nome\u200bOculto", "Nome💀", null, 123])("rejeita nome inválido sem modificar posse: %s",name=>{
  const c=arrive().castle;atThrone(c);activateThrone(c);const before=structuredClone(c);expect(claimCastle(c,name)).toBe(false);expect(c).toEqual(before);
 });
 it.each([["  São   João  ","São João"],["D'Água","D'Água"],["Éter-7","Éter-7"],["A\u0301gua","Água"],["x".repeat(32),"x".repeat(32)]])("normaliza nome válido: %s",(input,expected)=>{
  const c=arrive().castle;atThrone(c);activateThrone(c);expect(normalizeCastleName(input)).toBe(expected);expect(claimCastle(c,input)).toBe(true);expect(c.name).toBe(expected);expect(parseCastle(c)).toEqual(c);
 });
 it("prioridade exige posse e inspeção, pode mudar sem custo, não constrói",()=>{
  const c=arrive();inspectCastle(c.castle,"gate");expect(prioritizeRepair(c.castle,"gate")).toBe(false);
  atThrone(c.castle);activateThrone(c.castle);claimCastle(c.castle,"Aurora");
  expect(prioritizeRepair(c.castle,"dormitory")).toBe(false);expect(prioritizeRepair(c.castle,"gate")).toBe(true);expect(prioritizeRepair(c.castle,"gate")).toBe(false);
  walk(c.castle,CASTLE_POINTS.dormitory);inspectCastle(c.castle,"dormitory");expect(prioritizeRepair(c.castle,"dormitory")).toBe(true);
  expect(c.supplies).toBe(0);expect(c.character.experience).toBe(0);expect(c.base.prepared).toBe(false);
  expect(parseCampaign(c)).toEqual(c);
 });
 it("diário revela somente pontos visitados e decisões feitas",()=>{
  const c=create();expect(journalEntries(c).some(x=>x.includes("núcleo territorial"))).toBe(false);
  c.position={x:6,y:1};enterCastle(c);expect(journalEntries(c).some(x=>x.includes("antigos donos"))).toBe(true);
  expect(journalEntries(c).some(x=>x.includes("páginas deterioradas"))).toBe(false);
  walk(c.castle,CASTLE_POINTS.records);inspectCastle(c.castle,"records");expect(journalEntries(c).some(x=>x.includes("páginas deterioradas"))).toBe(true);
 });
});
describe("checkpoint schema 8",()=>{
 it.each([1,2,3,4,5,6,7])("migra schema %i sem visitar ou reivindicar castelo",schemaVersion=>{
  const c=create();finishEncounter(c,true);c.metLyra=true;c.base={prepared:true,lyraRecruited:true,lyraDeployed:false};c.supplies=0;
  c.character.equipment="simple-focus";claimKit(c.adaptation);advanceMana(c.adaptation,true);c.adaptation.potions=1;c.creature={observed:true,engaged:false,outcome:"avoided"};
  const old={...structuredClone(c),schemaVersion};const m=parseCampaign(old)!;
  expect(m.schemaVersion).toBe(8);expect(m.area).toBe("clearing");expect(m.castle).toEqual(newCastle());expect(m.position).toEqual(c.position);
  expect(m.character.experience).toBe(100);expect(m.supplies).toBe(0);
  if(schemaVersion>=3)expect(m.character.equipment).toBe("simple-focus");if(schemaVersion>=4)expect(m.base).toEqual(c.base);
  if(schemaVersion>=6)expect(m.adaptation).toEqual(c.adaptation);if(schemaVersion>=7)expect(m.creature).toEqual(c.creature);
 });
 it("retoma castelo nomeado, inspeções, prioridade e área pelo IndexedDB",async()=>{
  const c=arrive();inspectCastle(c.castle,"gate");atThrone(c.castle);activateThrone(c.castle);deferCastle(c.castle);claimCastle(c.castle,"São João");prioritizeRepair(c.castle,"gate");
  expect(await saveCampaign(c)).toBe(true);const result=await loadCampaign();expect(result).toEqual({status:"loaded",campaign:c});
  if(result.status!=="loaded")throw Error("checkpoint");expect(campaignStartScene(result.campaign)).toBe("Castle");
 });
 it("retoma adiamento sem reivindicação automática",async()=>{
  const c=arrive();atThrone(c.castle);activateThrone(c.castle);deferCastle(c.castle);expect(await saveCampaign(c)).toBe(true);
  const r=await loadCampaign();if(r.status!=="loaded")throw Error("checkpoint");expect(r.campaign.castle.claimDeferred).toBe(true);expect(r.campaign.castle.name).toBeNull();
 });
 it("rejeita estados impossíveis sem sobrescrever save válido",async()=>{
  const c=create();expect(await saveCampaign(c)).toBe(true);
  for(const castle of [null,{}, {...newCastle(),visited:true,inspected:["unknown"]}, {...newCastle(),visited:true,inspected:["gate","gate"]}, {...newCastle(),throneActivated:true}, {...newCastle(),name:"Aurora"}, {...newCastle(),visited:true,name:"Aurora",throneActivated:true,priority:"gate"}, {...newCastle(),visited:true,position:{x:0,y:0}}, {...newCastle(),visited:true,throneActivated:true,name:"  Aurora  "}]) expect(parseCampaign({...c,castle})).toBeNull();
  expect(parseCampaign({...c,area:"unknown"})).toBeNull();expect(parseCampaign({...c,area:"castle"})).toBeNull();
  expect(await saveCampaign({...c,area:"castle"})).toBe(false);expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});
 });
});
