import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { newCampaign, parseCampaign, finishCampaignBattle, finishEncounter } from "../src/game/campaign";
import { newContact, parseContact, contactTrust, beginContact, finishContact, observeContact, askContact, donateContactRation, setContactTerms, inviteContact, declineContact, reviewContactInvitation, CONTACT_QUESTIONS } from "../src/game/contact";
import { newAdaptation, claimKit } from "../src/game/adaptation";
import { Battle } from "../src/game/battle";
import { canMeetContact } from "../src/game/travel";
import { chooseDialogue } from "../src/game/narrative";
import { saveCampaign, loadCampaign } from "../src/game/persistence/save";
import { journalEntries } from "../src/game/journal";
const create=()=>{const c=newCampaign({name:"Ari",cls:"Guerreiro",race:"Humano"});chooseDialogue(c.narrative,"continue");return c;};
const meet=()=>{const c=create();c.castle.visited=true;c.position={x:6,y:4};c.contact.seen=true;return c;};
const claim=(c:ReturnType<typeof meet>)=>{c.castle.throneActivated=true;c.castle.name="Aurora";};
describe("primeiro contato e decisões finitas",()=>{
 it("rota exige visita ao castelo e proximidade, sem exigir posse/kit/vitória",()=>{
  const c=create();c.position={x:6,y:4};expect(canMeetContact(c)).toBe(false);c.castle.visited=true;expect(canMeetContact(c)).toBe(true);
  c.area="castle";expect(canMeetContact(c)).toBe(false);c.area="clearing";c.position={x:1,y:4};expect(canMeetContact(c)).toBe(false);
 });
 it("observação e abertura só se aplicam uma vez",()=>{
  const c=newContact();expect(observeContact(c)).toBe(false);expect(beginContact(c,"reassure")).toBe(false);c.seen=true;
  expect(observeContact(c)).toBe(true);expect(observeContact(c)).toBe(false);expect(beginContact(c,"reassure")).toBe(true);
  expect(beginContact(c,"demand")).toBe(false);expect(observeContact(c)).toBe(false);expect(contactTrust(c)).toBe(1);
 });
 it("baixar as armas permite diálogo sem combate e sem custo",()=>{
  const c=meet();claimKit(c.adaptation);expect(beginContact(c.contact,"withdraw")).toBe(true);
  expect(c.contact.combat).toBe("retreated");expect(c.adaptation.rations).toBe(2);expect(askContact(c.contact,"injured")).toBe(true);
  expect(parseCampaign(c)).toEqual(c);
 });
 it("perguntas repetidas não acumulam confiança ou duplicam informação",()=>{
  const c=meet();expect(askContact(c.contact,"mistake")).toBe(false);beginContact(c.contact,"withdraw");
  const trust=contactTrust(c.contact);
  for(const id of CONTACT_QUESTIONS){expect(askContact(c.contact,id)).toBe(true);for(let i=0;i<20;i++)expect(askContact(c.contact,id)).toBe(false);}
  expect(c.contact.questions.length).toBe(3);expect(contactTrust(c.contact)).toBe(trust);
 });
 it("ajuda usa uma ração real uma vez e não cria itens, XP, base ou moradores",()=>{
  const c=meet();claimKit(c.adaptation);expect(donateContactRation(c.contact,c.adaptation)).toBe(false);beginContact(c.contact,"withdraw");
  expect(donateContactRation(c.contact,c.adaptation)).toBe(true);expect(c.adaptation.rations).toBe(1);
  for(let i=0;i<20;i++)expect(donateContactRation(c.contact,c.adaptation)).toBe(false);
  expect(c.adaptation.rations).toBe(1);expect(contactTrust(c.contact)).toBe(1);expect(c.character.experience).toBe(0);expect(c.supplies).toBe(0);expect(c.base.prepared).toBe(false);
 });
 it("sem ração, ajuda não é aplicada nem fabrica confiança",()=>{
  const c=meet();beginContact(c.contact,"withdraw");expect(donateContactRation(c.contact,c.adaptation)).toBe(false);expect(contactTrust(c.contact)).toBe(0);
 });
 it.each(["survived","neutralized","retreated"] as const)("resultado %s encerra uma vez sem custo de recuperação",result=>{
  const c=meet();claimKit(c.adaptation);beginContact(c.contact,"reassure");expect(finishContact(c.contact,result,c.adaptation)).toBe(true);
  expect(finishContact(c.contact,"defeated",c.adaptation)).toBe(false);expect(c.adaptation.rations).toBe(2);expect(c.contact.recovery).toBe("none");
 });
 it("derrota usa uma ração uma vez; repetir callback ou recarregar não cobra novamente",async()=>{
  const c=meet();claimKit(c.adaptation);beginContact(c.contact,"reassure");expect(finishCampaignBattle(c,"contact",false)).toBe(true);
  expect(c.contact.recovery).toBe("ration");expect(c.adaptation.rations).toBe(1);expect(finishCampaignBattle(c,"contact",false)).toBe(false);
  expect(await saveCampaign(c)).toBe(true);const r=await loadCampaign();if(r.status!=="loaded")throw Error("checkpoint");
  expect(finishCampaignBattle(r.campaign,"contact",false)).toBe(false);expect(r.campaign.adaptation.rations).toBe(1);
 });
 it("derrota sem estoque permite descanso e conversa sem saldo negativo",()=>{
  const c=meet();beginContact(c.contact,"demand");finishCampaignBattle(c,"contact",false);
  expect(c.contact.recovery).toBe("rest");expect(c.adaptation.rations).toBe(0);expect(askContact(c.contact,"mistake")).toBe(true);expect(parseCampaign(c)).toEqual(c);
 });
 it("reentrada em combate ativo mantém abertura e não reaplica confiança",async()=>{
  const c=meet();beginContact(c.contact,"reassure");expect(await saveCampaign(c)).toBe(true);
  const result=await loadCampaign();if(result.status!=="loaded")throw Error("checkpoint");expect(result.campaign.contact.combat).toBe("active");
  expect(beginContact(result.campaign.contact,"reassure")).toBe(false);expect(contactTrust(result.campaign.contact)).toBe(1);
  expect(finishContact(result.campaign.contact,"retreated",result.campaign.adaptation)).toBe(true);
 });
 it("honestidade e promessa são alternativas exclusivas com consequência limitada",()=>{
  const c=meet();expect(setContactTerms(c.contact,"honest")).toBe(false);beginContact(c.contact,"withdraw");
  expect(setContactTerms(c.contact,"promise")).toBe(true);expect(contactTrust(c.contact)).toBe(-1);
  expect(setContactTerms(c.contact,"honest")).toBe(false);expect(contactTrust(c.contact)).toBe(-1);
 });
 it("convite exige posse e termos; confiança suficiente gera avaliação, não assentamento",()=>{
  const c=meet();beginContact(c.contact,"reassure");finishCampaignBattle(c,"contact",true);
  expect(inviteContact(c.contact,c.castle.name)).toBe(false);claim(c);expect(inviteContact(c.contact,c.castle.name)).toBe(false);
  setContactTerms(c.contact,"honest");expect(inviteContact(c.contact,c.castle.name)).toBe(true);expect(c.contact.response).toBe("considering");
  const before=structuredClone(c);expect(inviteContact(c.contact,c.castle.name)).toBe(false);expect(declineContact(c.contact)).toBe(false);expect(c).toEqual(before);
 });
 it("grupo pode recusar; ajuda posterior só altera resposta após pedido de reavaliação",()=>{
  const c=meet();claim(c);claimKit(c.adaptation);beginContact(c.contact,"demand");finishCampaignBattle(c,"contact",false,true);setContactTerms(c.contact,"honest");
  expect(contactTrust(c.contact)).toBe(1);inviteContact(c.contact,c.castle.name);expect(c.contact.response).toBe("refused");expect(reviewContactInvitation(c.contact)).toBe(false);
  donateContactRation(c.contact,c.adaptation);expect(c.contact.response).toBe("refused");expect(reviewContactInvitation(c.contact)).toBe(true);expect(c.contact.response).toBe("considering");
  expect(reviewContactInvitation(c.contact)).toBe(false);expect(parseCampaign(c)).toEqual(c);
 });
 it("jogador pode encerrar sem convite e sem exigir posse ou ajuda",()=>{
  const c=meet();beginContact(c.contact,"withdraw");expect(declineContact(c.contact)).toBe(true);expect(declineContact(c.contact)).toBe(false);
  claim(c);setContactTerms(c.contact,"honest");expect(inviteContact(c.contact,c.castle.name)).toBe(false);expect(parseCampaign(c)).toEqual(c);
 });
 it("missão de contato não aplica recompensa das ruínas",()=>{
  const c=meet();beginContact(c.contact,"reassure");finishCampaignBattle(c,"contact",false,true);
  expect(c.contact.combat).toBe("survived");expect(c.passageCleared).toBe(false);expect(c.character.experience).toBe(0);expect(c.supplies).toBe(0);
  expect(finishCampaignBattle(c,"ruins",true)).toBe(true);expect(c.supplies).toBe(3);expect(c.character.experience).toBe(100);
 });
});
describe("combate não letal e trégua",()=>{
 it("Guerreiro resiste três rodadas sem matar ou encerrar cedo",()=>{
  const b=new Battle({name:"Teste",cls:"Guerreiro",race:"Humano"},false,undefined,"contact");
  expect(b.allies.length).toBe(1);expect(b.enemies[0].id).toBe("survivor-guard");expect(b.techniques(b.enemies[0])[0].name).toBe("Contenção");
  for(let i=0;i<3;i++){b.endTurn();b.enemyTurn();if(i<2)expect(b.phase).toBe("idle");}
  expect(b.outcome).toBe("truce");expect(b.phase).toBe("ended");expect(b.allies[0].hp).toBeGreaterThan(0);expect(b.enemies[0].hp).toBe(26);
  const snapshot=structuredClone(b.units),log=[...b.log];b.enemyTurn();b.checkEnd();expect(b.units).toEqual(snapshot);expect(b.log).toEqual(log);expect(b.outcome).toBe("truce");
 });
 it.each(["Guerreiro","Mago","Ladino"] as const)("pode neutralizar guardião sem kit e sem morte: %s",cls=>{
  const b=new Battle({name:"Teste",cls,race:"Humano"},false,undefined,"contact");
  for(let i=0;i<5 && b.phase!=="ended";i++){
   const hero=b.allies[0];b.confirm(hero.x,hero.y);b.confirm(5,4);b.openSkills();b.chooseSkill(0);b.confirm(b.enemies[0].x,b.enemies[0].y);if(b.phase==="enemy")b.enemyTurn();
  }
  expect(b.outcome).toBe("win");expect(b.note).toContain("neutralizado");expect(b.allies.length).toBe(1);
 });
 it("derrota prevalece sobre trégua na terceira rodada",()=>{
  const b=new Battle({name:"Teste",cls:"Mago",race:"Humano"},false,undefined,"contact");
  for(let i=0;i<3;i++){b.endTurn();b.enemyTurn();}
  expect(b.outcome).toBe("loss");expect(b.phase).toBe("ended");expect(b.note).toContain("descansar");
 });
 it("terceira cinemática precisa terminar antes de resolver a trégua",()=>{
  const b=new Battle({name:"Teste",cls:"Guerreiro",race:"Humano"},true,undefined,"contact");
  for(let i=0;i<3;i++){
   b.endTurn();b.enemyTurn();expect(b.phase).toBe("presentation");expect(b.outcome).toBeNull();
   const event=b.pending!;b.completePresentation(event.id+100);expect(b.pending?.id).toBe(event.id);
   b.completePresentation(event.id);b.completePresentation(event.id);
  }
  expect(b.phase).toBe("ended");expect(b.outcome).toBe("truce");
 });
});
describe("schema 9 e diário",()=>{
 it.each([1,2,3,4,5,6,7,8])("migra schema %i sem gerar contato, população ou alterar conquistas",schemaVersion=>{
  const c=create();finishEncounter(c,true);c.metLyra=true;c.base={prepared:true,lyraRecruited:true,lyraDeployed:false};c.supplies=0;c.character.equipment="simple-focus";
  c.castle.visited=true;c.castle.throneActivated=true;c.castle.name="Aurora";c.castle.inspected=["gate"];c.castle.priority="gate";claimKit(c.adaptation);c.adaptation.rations=1;
  const m=parseCampaign({...c,schemaVersion})!;expect(m.schemaVersion).toBe(11);expect(m.contact).toEqual(newContact());expect(m.supplies).toBe(0);expect(m.character.experience).toBe(100);
  if(schemaVersion>=4)expect(m.base).toEqual(c.base);if(schemaVersion>=6)expect(m.adaptation).toEqual(c.adaptation);if(schemaVersion>=8)expect(m.castle).toEqual(c.castle);
 });
 it("salva respostas, convite em avaliação, termos e ajuda sem reaplicar custos",async()=>{
  const c=meet();claim(c);claimKit(c.adaptation);beginContact(c.contact,"withdraw");askContact(c.contact,"injured");donateContactRation(c.contact,c.adaptation);setContactTerms(c.contact,"honest");inviteContact(c.contact,c.castle.name);
  expect(await saveCampaign(c)).toBe(true);expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});expect(c.contact.response).toBe("considering");expect(c.adaptation.rations).toBe(1);
 });
 it("diário mostra somente perguntas e consequências aplicadas",()=>{
  const c=meet();expect(journalEntries(c).some(x=>x.includes("quem os contratou"))).toBe(false);beginContact(c.contact,"withdraw");askContact(c.contact,"pursuers");
  expect(journalEntries(c).some(x=>x.includes("quem os contratou"))).toBe(true);expect(journalEntries(c).some(x=>x.includes("sem perguntar"))).toBe(false);
 });
 it("rejeita estados incoerentes e não sobrescreve checkpoint válido",async()=>{
  const c=meet();expect(await saveCampaign(c)).toBe(true);
  for(const contact of [null,{}, {...newContact(),observed:true}, {...newContact(),seen:true,combat:"active"}, {...newContact(),seen:true,opening:"withdraw",combat:"active"},
   {...newContact(),questions:["pursuers"]}, {...newContact(),seen:true,opening:"withdraw",combat:"retreated",questions:["x"]},
   {...newContact(),seen:true,opening:"reassure",combat:"defeated"}, {...newContact(),seen:true,opening:"withdraw",combat:"retreated",recovery:"ration"},
   {...newContact(),seen:true,opening:"withdraw",combat:"retreated",offer:"invited",terms:"promise",response:"considering"}])expect(parseCampaign({...c,contact})).toBeNull();
  expect(parseCampaign({...c,castle:{...c.castle,visited:false}})).toBeNull();
  expect(await saveCampaign({...c,contact:{...c.contact,observed:true,seen:false}})).toBe(false);expect(await loadCampaign()).toEqual({status:"loaded",campaign:c});
 });
});
