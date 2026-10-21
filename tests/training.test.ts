import "fake-indexeddb/auto";
import {describe,it,expect} from "vitest";
import {newTraining,applyTraining,trainingRound,championRequirements,roundCount,trainingProblem,type TrainingContext,type TrainingCommand} from "../src/game/training";
import {newCampaign,parseCampaign,campaignStartScene} from "../src/game/campaign";
import {settlementView,runTraining,performTask,agreeSettlement,departSettlement,TASKS,type TaskId} from "../src/game/settlement";
import {CASTLE_POINTS,POINT_IDS} from "../src/game/castle";
import {enterCastle,leaveCastle} from "../src/game/travel";
import {chooseDialogue} from "../src/game/narrative";
import {beginContact,setContactTerms,donateContactRation} from "../src/game/contact";
import {claimKit} from "../src/game/adaptation";
import {saveCampaign,loadCampaign} from "../src/game/persistence/save";
const ctx=():TrainingContext=>({hours:0,food:30,residentGuard:true,ready:true,reserve:0});
const start=(exercise="sword",mode="manual",trainee="player")=>({type:"start",trainee,exercise,mode} as TrainingCommand);
const task=(c:ReturnType<typeof newCampaign>,id:TaskId)=>{const p=TASKS[id].place;c.area=p==="trail"?"clearing":"castle";if(p==="trail")c.position={x:7,y:3};else c.castle.position={...CASTLE_POINTS[p]};expect(performTask(c,id)).toBe(true);};
const ready=(arrived=true)=>{
 const c=newCampaign({name:"Aprendiz",race:"Humano",cls:"Guerreiro"});chooseDialogue(c.narrative,"continue");c.castle.visited=true;c.castle.throneActivated=true;c.castle.name="Aurora";c.castle.inspected=[...POINT_IDS];
 c.contact.seen=true;beginContact(c.contact,"withdraw");setContactTerms(c.contact,"honest");claimKit(c.adaptation);donateContactRation(c.contact,c.adaptation);
 task(c,"tools");for(let i=0;i<6;i++)task(c,"wood");for(let i=0;i<4;i++)task(c,"stone");for(let i=0;i<4;i++)task(c,"food");for(const t of ["route","clean","cistern","gate","dormitory","water","water","water"] as const)task(c,t);
 if(arrived){c.area="clearing";c.position={x:7,y:4};agreeSettlement(c);departSettlement(c);c.position={x:7,y:1};enterCastle(c);}
 c.area="castle";c.castle.position={...CASTLE_POINTS.courtyard};return c;
};
const finish=(c:ReturnType<typeof ready>,correct=true)=>{while(settlementView(c.settlement).training.active){const a=settlementView(c.settlement).training.active!;expect(runTraining(c,{type:"answer",choice:(trainingRound(a).answer+(correct?0:1))%3})).toBe(true);}};
describe("formação finita e consentida",()=>{
 it("não altera atributos, XP, itens, kit ou formação tática",()=>{
  const c=ready();const snapshot={character:structuredClone(c.character),adaptation:structuredClone(c.adaptation),base:structuredClone(c.base),inventory:[...c.inventory]};const before=settlementView(c.settlement);
  expect(runTraining(c,start())).toBe(true);finish(c);const v=settlementView(c.settlement);expect(v.training.progress.player.sword).toBe(2);expect(v.stock.food).toBe(before.stock.food-1);expect(v.hours).toBe(before.hours+1);expect({character:c.character,adaptation:c.adaptation,base:c.base,inventory:c.inventory}).toEqual(snapshot);
 });
 it.each(["mana","sword"])("%s manual usa seis sinais e limita proficiência a3",exercise=>{
  const c=ready();expect(runTraining(c,start(exercise))).toBe(true);finish(c);expect(runTraining(c,start(exercise))).toBe(true);finish(c);expect(settlementView(c.settlement).training.progress.player[exercise as "mana"|"sword"]).toBe(3);expect(runTraining(c,start(exercise))).toBe(false);
 });
 it("falhar seis decisões dá experiência introdutória pequena, não morte ou bloqueio",()=>{const c=ready();runTraining(c,start());finish(c,false);expect(settlementView(c.settlement).training.progress.player.sword).toBe(1);});
 it.each(["assisted","delegated"])("modo %s chega ao mesmo limite sem item exclusivo",mode=>{
  const c=ready();for(let i=0;i<3;i++){if(i===2)expect(runTraining(c,{type:"rest",trainee:"player"})).toBe(true);expect(runTraining(c,start("sword",mode))).toBe(true);if(mode!=="delegated")finish(c);}
  expect(settlementView(c.settlement).training.progress.player.sword).toBe(3);
 });
 it("guardião precisa estar assentado e consentir; consentimento é único",()=>{const c=ready();expect(runTraining(c,start("sword","delegated","survivor-guard"))).toBe(false);expect(runTraining(c,{type:"consent"})).toBe(true);expect(runTraining(c,{type:"consent"})).toBe(false);expect(runTraining(c,start("sword","delegated","survivor-guard"))).toBe(true);});
 it("sem guardião, treino pessoal permanece acessível e outros civis não são militarizados",()=>{
  const c=ready(false);expect(runTraining(c,{type:"consent"})).toBe(false);expect(runTraining(c,start("mana","delegated"))).toBe(true);expect(runTraining(c,start("sword","delegated","survivor-child-a"))).toBe(false);
 });
 it("não pode nomear campeão por XP nem exigir mana de um espadachim",()=>{
  const c=ready();runTraining(c,{type:"consent"});runTraining(c,start("sword","manual","survivor-guard"));finish(c);expect(runTraining(c,start("assessment","assisted","survivor-guard"))).toBe(true);finish(c);
  let v=settlementView(c.settlement);expect(championRequirements(v.training,true,2)).toContain("Descanso após a avaliação");expect(runTraining(c,{type:"rest",trainee:"survivor-guard"})).toBe(true);v=settlementView(c.settlement);expect(championRequirements(v.training,true,2)).toEqual([]);expect(v.training.progress["survivor-guard"].mana).toBe(0);expect(c.character.experience).toBe(0);expect(c.base.lyraRecruited).toBe(false);
 });
 it("avaliação exige preparo; fracasso permite nova tentativa e aprovação não é farmável",()=>{
  const c=ready();runTraining(c,{type:"consent"});expect(runTraining(c,start("assessment","manual","survivor-guard"))).toBe(false);runTraining(c,start("sword","manual","survivor-guard"));finish(c);expect(runTraining(c,start("assessment","delegated","survivor-guard"))).toBe(false);runTraining(c,start("assessment","manual","survivor-guard"));finish(c,false);expect(settlementView(c.settlement).training.progress["survivor-guard"].assessed).toBe(false);runTraining(c,{type:"rest",trainee:"survivor-guard"});expect(runTraining(c,start("assessment","manual","survivor-guard"))).toBe(true);finish(c);expect(runTraining(c,start("assessment","manual","survivor-guard"))).toBe(false);
 });
 it("interrupção/recarga retoma respostas e não cobra novamente nem premia duas vezes",async()=>{
  const c=ready();runTraining(c,start("mana","assisted"));const answer=trainingRound(settlementView(c.settlement).training.active!).answer;runTraining(c,{type:"answer",choice:answer});const before=settlementView(c.settlement);expect(await saveCampaign(c)).toBe(true);const loaded=await loadCampaign();expect(loaded.status).toBe("loaded");if(loaded.status!=="loaded")return;const m=loaded.campaign;expect(campaignStartScene(m)).toBe("Training");expect(settlementView(m.settlement)).toEqual(before);expect(runTraining(m,start())).toBe(false);finish(m);expect(runTraining(m,{type:"answer",choice:0})).toBe(false);expect(settlementView(m.settlement).stock.food).toBe(before.stock.food);expect(settlementView(m.settlement).training.progress.player.mana).toBe(1);
 });
 it("cancelamento não reembolsa e libera trabalho, saída e próxima sessão",()=>{
  const c=ready();const before=settlementView(c.settlement);runTraining(c,start());expect(performTask(c,"water")).toBe(false);expect(leaveCastle(c)).toBe(false);expect(runTraining(c,{type:"cancel"})).toBe(true);expect(settlementView(c.settlement).stock.food).toBe(before.stock.food-1);expect(settlementView(c.settlement).training.progress.player.sword).toBe(0);expect(performTask(c,"water")).toBe(true);
 });
 it("fadiga bloqueia terceiro treino; descanso custa comida/tempo e não apaga limite diário",()=>{
  const s=newTraining(),c=ctx();applyTraining(s,start("mana","delegated"),c);applyTraining(s,start("sword","delegated"),c);expect(trainingProblem(s,start(),c)).toContain("Fadiga");expect(applyTraining(s,{type:"rest",trainee:"player"},c)).toEqual({food:1,periods:2});expect(trainingProblem(s,start(),c)).toContain("Limite");c.hours=4;expect(applyTraining(s,start(),c)).not.toBeNull();
 });
 it("protege a reserva anterior ao assentamento e rejeita falta de comida sem mutação",()=>{
  const s=newTraining(),c=ctx();c.food=24;c.reserve=24;const before=structuredClone(s);expect(applyTraining(s,start(),c)).toBeNull();expect(s).toEqual(before);
 });
 it("comandos inválidos, respostas extras e localização incorreta são rejeitados",()=>{
  const c=ready();expect(runTraining(c,{type:"answer",choice:0})).toBe(false);expect(runTraining(c,start("unknown"))).toBe(false);c.castle.position={x:3,y:5};expect(runTraining(c,start())).toBe(false);c.castle.position={...CASTLE_POINTS.courtyard};runTraining(c,start());for(const choice of [-1,3,0.5,NaN])expect(runTraining(c,{type:"answer",choice})).toBe(false);
 });
 it("parser rejeita sessão movida para fora do pátio, comando desconhecido e consentimento forjado",()=>{
  const c=ready();runTraining(c,start());const away=structuredClone(c);away.castle.position={x:3,y:5};expect(parseCampaign(away)).toBeNull();const bad=structuredClone(c);bad.settlement.events.push({type:"training",command:{type:"oops"}} as never);expect(parseCampaign(bad)).toBeNull();
  const old=ready(false);old.settlement.events.push({type:"training",command:{type:"consent"}});expect(parseCampaign(old)).toBeNull();
 });
 it.each([1,2,3,4,5,6,7,8,9,10])("schema%i migra sem treinar, cobrar ou promover automaticamente",schemaVersion=>{
  const c=newCampaign({name:"Legado",race:"Elfo",cls:"Mago"});const m=parseCampaign({...c,schemaVersion})!;expect(m.schemaVersion).toBe(11);expect(settlementView(m.settlement).training).toEqual(newTraining());expect(m.adaptation).toEqual(c.adaptation);expect(m.base).toEqual(c.base);
 });
 it("schema10 conserva obras/moradores/estoque e não aceita comandos de treino retroativos",()=>{
  const c=ready();const before=settlementView(c.settlement);const migrated=parseCampaign({...c,schemaVersion:10})!;expect(settlementView(migrated.settlement)).toEqual(before);runTraining(c,start());expect(parseCampaign({...c,schemaVersion:10})).toBeNull();
 });
});
