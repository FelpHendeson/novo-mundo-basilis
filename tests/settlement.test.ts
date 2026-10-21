import "fake-indexeddb/auto";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
import {describe,it,expect} from "vitest";
import {newCampaign,parseCampaign,moveExplorer} from "../src/game/campaign";
import {newSettlement, settlementView,performTask,agreeSettlement,departSettlement,arriveSettlement,parseSettlement,SURVIVORS,TASKS,readiness,candidateReason,settlementClock,type TaskId,type Worker} from "../src/game/settlement";
import {CASTLE_POINTS,POINT_IDS} from "../src/game/castle";
import {beginContact,setContactTerms,donateContactRation,finishContact} from "../src/game/contact";
import {claimKit} from "../src/game/adaptation";
import {enterCastle,canMeetContact} from "../src/game/travel";
import {chooseDialogue} from "../src/game/narrative";
const create=()=>{
 const c=newCampaign({name:"Teste",race:"Humano",cls:"Guerreiro"});
 chooseDialogue(c.narrative,"continue");c.castle.visited=true;c.castle.throneActivated=true;c.castle.name="Aurora";c.castle.inspected=[...POINT_IDS];
 c.contact.seen=true;beginContact(c.contact,"withdraw");setContactTerms(c.contact,"honest");return c;
};
const task=(c:ReturnType<typeof create>,id:TaskId,worker:Worker="player")=>{
 const place=TASKS[id].place;c.area=place==="trail"?"clearing":"castle";
 if(place==="trail")c.position={x:7,y:3};else c.castle.position={...CASTLE_POINTS[place]};
 expect(performTask(c,id,worker),id).toBe(true);
};
const prepare=(c:ReturnType<typeof create>,water=2)=>{
 task(c,"tools");for(let i=0;i<6;i++)task(c,"wood");for(let i=0;i<4;i++)task(c,"stone");for(let i=0;i<4;i++)task(c,"food");
 for(const id of ["route","clean","cistern","gate","dormitory"] as const)task(c,id);
 for(let i=0;i<water;i++)task(c,"water");c.area="clearing";c.position={x:7,y:4};
};
describe("assentamento com estoque rastreável e chegada física",()=>{
 it("começa sem recursos, habitantes ou passagem de tempo",()=>{
  const c=create(),v=settlementView(c.settlement);expect(v.stock).toEqual({wood:0,stone:0,food:0,water:0});expect(v.party).toEqual([]);expect(settlementClock(v)).toBe("Dia 1 · período 1/4");expect(c.base.lyraRecruited).toBe(false);
 });
 it("exige posse, localização, inspeção e ferramentas sem mutação parcial",()=>{
  const c=create();c.area="castle";c.castle.position={x:3,y:3};c.castle.name=null;expect(performTask(c,"tools")).toBe(false);
  c.castle.name="Aurora";c.castle.inspected=[];expect(performTask(c,"tools")).toBe(false);c.castle.inspected=["courtyard"];task(c,"tools");
  expect(performTask(c,"tools")).toBe(false);c.area="clearing";c.position={x:1,y:4};expect(performTask(c,"wood")).toBe(false);
  c.position={x:7,y:3};expect(performTask(c,"wood")).toBe(true);expect(settlementView(c.settlement).hours).toBe(2);
 });
 it.each(["wood","stone","food"] as const)("fonte %s é finita e recarga não repõe",id=>{
  const c=create();task(c,"tools");const times={wood:6,stone:4,food:4}[id];for(let i=0;i<times;i++)task(c,id);
  const before=structuredClone(c.settlement);expect(performTask(c,id)).toBe(false);expect(c.settlement).toEqual(before);
  const m=parseCampaign(JSON.parse(JSON.stringify(c)))!;expect(m).not.toBeNull();expect(performTask(m,id)).toBe(false);
 });
 it("água só é tratada após inspeção e consome lenha/comida",()=>{
  const c=create();task(c,"tools");task(c,"wood");task(c,"food");c.area="castle";c.castle.position={...CASTLE_POINTS.courtyard};
  expect(performTask(c,"water")).toBe(false);task(c,"cistern");task(c,"water");expect(settlementView(c.settlement).stock).toEqual({wood:3,stone:0,food:10,water:6});
 });
 it("reparo exige estoque e limpeza; concluí-lo novamente não cobra",()=>{
  const c=create();task(c,"tools");c.castle.position={...CASTLE_POINTS.gate};expect(performTask(c,"gate")).toBe(false);
  task(c,"wood");task(c,"wood");task(c,"stone");task(c,"food");task(c,"gate");const before=structuredClone(c.settlement);expect(performTask(c,"gate")).toBe(false);expect(c.settlement).toEqual(before);
  c.castle.position={...CASTLE_POINTS.dormitory};expect(performTask(c,"dormitory")).toBe(false);
 });
 it("proposta não instala ninguém e critérios variam por indivíduo",()=>{
  const c=create();prepare(c);expect(readiness(settlementView(c.settlement))).toEqual([]);expect(agreeSettlement(c)).toBe(true);
  const v=settlementView(c.settlement);expect(v.phase).toBe("agreed");expect(v.party).toHaveLength(9);expect(v.party).not.toContain("survivor-guard");expect(v.party).not.toContain("survivor-scout");expect(v.party).not.toContain("survivor-injured");
  expect(agreeSettlement(c)).toBe(false);expect(c.base).toEqual({prepared:false,lyraRecruited:false,lyraDeployed:false});expect(c.character.experience).toBe(0);expect(c.supplies).toBe(0);
 });
 it("todos os 12 podem aderir com confiança, ajuda e água",()=>{
  const c=create();c.contact.opening="reassure";c.contact.combat="survived";claimKit(c.adaptation);donateContactRation(c.contact,c.adaptation);prepare(c,3);
  expect(agreeSettlement(c)).toBe(true);expect(settlementView(c.settlement).party).toHaveLength(12);
 });
 it("recusa anterior não impede proposta com provas nem reparo solo",()=>{
  const c=create();c.contact.offer="declined";prepare(c);expect(agreeSettlement(c)).toBe(true);expect(c.contact.offer).toBe("declined");expect(parseCampaign(c)).not.toBeNull();
 });
 it("partida cobra provisões uma vez, recarga conserva escolta e chegada exige fronteira",()=>{
  const c=create();prepare(c);agreeSettlement(c);const before=settlementView(c.settlement);expect(arriveSettlement(c)).toBe(false);expect(departSettlement(c)).toBe(true);expect(departSettlement(c)).toBe(false);
  const v=settlementView(c.settlement);expect(v.stock.food).toBe(before.stock.food-v.party.length);expect(v.stock.water).toBe(before.stock.water-v.party.length);expect(canMeetContact(c)).toBe(false);
  const m=parseCampaign(JSON.parse(JSON.stringify(c)))!;expect(m).not.toBeNull();expect(departSettlement(m)).toBe(false);expect(settlementView(m.settlement)).toEqual(v);
  expect(moveExplorer(m,0,-1)).toBe(true);expect(moveExplorer(m,0,-1)).toBe(true);expect(enterCastle(m)).toBe(true);
  expect(settlementView(m.settlement).phase).toBe("arrived");expect(arriveSettlement(m)).toBe(false);expect(parseCampaign(m)).not.toBeNull();
 });
 it("não parte sem condições nem sem conversa/termos",()=>{
  const c=create();expect(agreeSettlement(c)).toBe(false);prepare(c);c.contact.terms=null;expect(agreeSettlement(c)).toBe(false);expect(departSettlement(c)).toBe(false);
 });
 it("ajuda tardia não adiciona morador silenciosamente; exige reavaliação",()=>{
  const c=create();prepare(c,3);agreeSettlement(c);const n=settlementView(c.settlement).party.length;claimKit(c.adaptation);donateContactRation(c.contact,c.adaptation);
  expect(settlementView(c.settlement).party).toHaveLength(n);expect(parseCampaign(c)).not.toBeNull();expect(agreeSettlement(c)).toBe(true);expect(settlementView(c.settlement).party.length).toBeGreaterThan(n);
 });
 it("delegação só com adulto assentado; crianças e ferido nunca trabalham",()=>{
  const c=create();prepare(c);expect(performTask(c,"storehouse","survivor-carpenter")).toBe(false);agreeSettlement(c);departSettlement(c);c.position={x:7,y:1};enterCastle(c);
  task(c,"storehouse","survivor-carpenter");expect(settlementView(c.settlement).done).toContain("storehouse");
  for(const worker of ["survivor-child-a","survivor-child-b","survivor-injured","survivor-scout"] as const){c.castle.position={...CASTLE_POINTS.courtyard};expect(performTask(c,"water",worker)).toBe(false);}
 });
 it("trabalho durante escolta e coleta externa delegada são bloqueados",()=>{
  const c=create();prepare(c);agreeSettlement(c);departSettlement(c);c.position={x:7,y:3};expect(performTask(c,"food")).toBe(false);
 });
 it("rejeita razão inválida, ação desconhecida e ledger fora de ordem",()=>{
  const c=create();for(const events of [[{type:"arrive"}],[{type:"depart"}],[{type:"task",task:"water",worker:"player"}],[{type:"task",task:"__proto__",worker:"player"}],[{type:"task",task:"tools",worker:"survivor-child-a"}],[null]])expect(parseSettlement({events},c)).toBeNull();
  expect(parseSettlement({events:new Array(129).fill({type:"arrive"})},c)).toBeNull();expect(parseSettlement(null,c)).toBeNull();
 });
 it("rejeita acordo fraudulento, inspeção removida e escolta em castelo sem chegada",()=>{
  const c=create();prepare(c);agreeSettlement(c);const bad=structuredClone(c);const event=bad.settlement.events.find(e=>e.type==="agreement")!;if(event.type==="agreement")event.trust=4;expect(parseCampaign(bad)).toBeNull();
  const removed=structuredClone(c);removed.castle.inspected=[];expect(parseCampaign(removed)).toBeNull();departSettlement(c);c.area="castle";expect(parseCampaign(c)).toBeNull();
 });
 it.each([1,2,3,4,5,6,7,8,9])("schema %i migra sem estoque, moradores ou custos retroativos",schemaVersion=>{
  const c=newCampaign({name:"Legado",race:"Elfo",cls:"Mago"});const m=parseCampaign({...c,schemaVersion})!;expect(m.schemaVersion).toBe(10);expect(m.settlement).toEqual(newSettlement());expect(m.character).toEqual(c.character);expect(m.supplies).toBe(0);
 });
 it("ledger não compartilha referências com dados lidos",()=>{
  const c=create();task(c,"tools");const m=parseCampaign(c)!;(c.settlement.events[0] as {task:string}).task="water";expect(m.settlement.events[0]).toEqual({type:"task",task:"tools",worker:"player"});
 });
 it("tratamento repetido não gasta a madeira necessária às três obras",()=>{
  const c=create();task(c,"tools");for(let i=0;i<6;i++)task(c,"wood");for(let i=0;i<4;i++)task(c,"food");task(c,"cistern");
  for(let i=0;i<6;i++)task(c,"water");expect(performTask(c,"water")).toBe(false);
  for(let i=0;i<4;i++)task(c,"stone");task(c,"gate");task(c,"clean");task(c,"dormitory");task(c,"storehouse");task(c,"route");
  expect(readiness(settlementView(c.settlement))).toEqual([]);
 });
 it("IndexedDB conserva escolta, despesas e chegada sem duplicação",async()=>{
  const c=create();prepare(c);agreeSettlement(c);departSettlement(c);expect(await saveCampaign(c)).toBe(true);
  const result=await loadCampaign();expect(result.status).toBe("loaded");if(result.status!=="loaded")return;
  const m=result.campaign;expect(m.settlement).toEqual(c.settlement);expect(departSettlement(m)).toBe(false);
  m.position={x:7,y:1};expect(enterCastle(m)).toBe(true);expect(await saveCampaign(m)).toBe(true);
  const final=await loadCampaign();expect(final.status).toBe("loaded");if(final.status==="loaded")expect(settlementView(final.campaign.settlement).phase).toBe("arrived");
 });

});
