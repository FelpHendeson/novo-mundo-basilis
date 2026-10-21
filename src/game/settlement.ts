import type { Campaign } from "./campaign";
import { adjacent } from "./areas";
import { contactResolved, contactTrust } from "./contact";
import { CASTLE_POINTS, castleNear } from "./castle";

/** Provisional roles, not canonical names. Children and the wounded are never workers. */
export const SURVIVORS = [
  {id:"survivor-guard",name:"Guardião",job:"Defesa",works:true},
  {id:"survivor-spokesperson",name:"Porta-voz",job:"Organização",works:true},
  {id:"survivor-carpenter",name:"Carpinteiro",job:"Reparos",works:true},
  {id:"survivor-healer",name:"Cuidadora",job:"Cuidados",works:true},
  {id:"survivor-gatherer",name:"Coletora",job:"Coleta",works:true},
  {id:"survivor-water",name:"Aguadeiro",job:"Água",works:true},
  {id:"survivor-mason",name:"Pedreira",job:"Alvenaria",works:true},
  {id:"survivor-cook",name:"Cozinheiro",job:"Cozinha / responsável pelas duas crianças",works:true},
  {id:"survivor-scout",name:"Batedora",job:"Exploração",works:true},
  {id:"survivor-injured",name:"Viajante ferido",job:"Recuperação",works:false},
  {id:"survivor-child-a",name:"Criança mais velha",job:"Sob cuidado do cozinheiro",works:false},
  {id:"survivor-child-b",name:"Criança mais nova",job:"Sob cuidado do cozinheiro",works:false},
] as const;
export type SurvivorId = typeof SURVIVORS[number]["id"];
export type Worker = "player" | SurvivorId;
export const RESOURCE_POINT = {x:7,y:3} as const;
export const SOURCE_LIMITS = {wood:24,stone:12,food:48};
type Stock = {wood:number;stone:number;food:number;water:number};
export const TASKS = {
  tools:{name:"Recuperar ferramentas do pátio",place:"courtyard",hours:1,cost:{},gain:{},once:true},
  wood:{name:"Recolher madeira caída",place:"trail",hours:1,cost:{},gain:{wood:4},once:false},
  stone:{name:"Separar pedra solta",place:"trail",hours:1,cost:{},gain:{stone:3},once:false},
  food:{name:"Recolher provisões seladas da carroça",place:"trail",hours:1,cost:{},gain:{food:12},once:false},
  route:{name:"Vistoriar a trilha de retorno",place:"trail",hours:1,cost:{food:1},gain:{},once:true},
  clean:{name:"Limpar o dormitório",place:"dormitory",hours:1,cost:{food:1},gain:{},once:true},
  cistern:{name:"Inspecionar a cisterna do pátio",place:"courtyard",hours:1,cost:{food:1},gain:{},once:true},
  water:{name:"Ferver água da cisterna",place:"courtyard",hours:1,cost:{wood:1,food:1},gain:{water:6},once:false},
  gate:{name:"Reforçar o portão",place:"gate",hours:2,cost:{wood:6,stone:3,food:2},gain:{},once:true},
  dormitory:{name:"Restaurar o dormitório",place:"dormitory",hours:3,cost:{wood:8,stone:3,food:3},gain:{},once:true},
  storehouse:{name:"Recuperar o depósito",place:"storehouse",hours:2,cost:{wood:4,stone:2,food:2},gain:{},once:true},
} as const;
export type TaskId = keyof typeof TASKS;
export type SettlementEvent = {type:"task";task:TaskId;worker:Worker} | {type:"agreement";trust:number;aided:boolean} | {type:"depart"} | {type:"arrive"};
export type SettlementState = {events:SettlementEvent[]};
export const newSettlement = ():SettlementState => ({events:[]});
export type SettlementView = {stock:Stock;gathered:Stock;hours:number;done:TaskId[];party:SurvivorId[];phase:"camp"|"agreed"|"escorting"|"arrived";history:string[]};
const emptyView = ():SettlementView => ({stock:{wood:0,stone:0,food:0,water:0},gathered:{wood:0,stone:0,food:0,water:0},hours:0,done:[],party:[],phase:"camp",history:[]});
export const settlementClock = (v:SettlementView) => `Dia ${1+Math.floor(v.hours/4)} · período ${1+v.hours%4}/4`;
const keys = ["wood","stone","food","water"] as const;
export function taskProblem(v:SettlementView,id:TaskId,worker:Worker):string|null {
  const t=TASKS[id]; if(!Object.hasOwn(TASKS,id))return "Tarefa desconhecida.";
  if(v.phase==="escorting")return "Conclua o retorno do grupo antes de trabalhar.";
  if(worker!=="player" && (v.phase!=="arrived" || !v.party.includes(worker) || !SURVIVORS.find(p=>p.id===worker)?.works))return "Esta pessoa não está disponível para trabalho.";
  if(worker!=="player" && t.place==="trail")return "A coleta externa é pessoal nesta versão; expedições delegadas virão depois.";
  if(t.once && v.done.includes(id))return "Tarefa já concluída.";
  if(["wood","stone","gate","dormitory","storehouse","water"].includes(id) && !v.done.includes("tools"))return "Recupere as ferramentas no pátio primeiro.";
  if(id==="water" && !v.done.includes("cistern"))return "Inspecione a cisterna antes de tratar a água.";
  if(id==="dormitory" && !v.done.includes("clean"))return "Limpe o dormitório antes do reparo.";
  // Keep finite construction sources recoverable even if water treatment is repeated early.
  if(id==="water") {
    const reserved=["gate","dormitory","storehouse"].filter(r=>!v.done.includes(r as TaskId)).reduce((n,r)=>n+(TASKS[r as "gate"|"dormitory"|"storehouse"].cost.wood),0);
    if(v.stock.wood+SOURCE_LIMITS.wood-v.gathered.wood-1<reserved)return "A madeira restante está reservada para as obras ainda pendentes.";
  }
  for(const key of keys){
    if(v.stock[key]<((t.cost as Partial<Stock>)[key]??0))return "Estoque insuficiente para os custos exibidos.";
    if(key!=="water" && v.gathered[key]+((t.gain as Partial<Stock>)[key]??0)>SOURCE_LIMITS[key])return "Esta fonte foi esgotada. Não há reposição automática.";
  }
  return null;
}
export function readiness(v:SettlementView):string[] {
  const problems:string[]=[];
  if(!v.done.includes("route"))problems.push("Vistoriar a trilha");
  if(!v.done.includes("gate"))problems.push("Reforçar o portão");
  if(!v.done.includes("dormitory"))problems.push("Restaurar os 12 lugares do dormitório");
  if(v.stock.food<24)problems.push("Reunir 24 refeições (viagem e reserva)");
  if(v.stock.water<12)problems.push("Tratar 12 porções de água");
  return problems;
}
export function candidateReason(v:SettlementView,id:SurvivorId,trust:number,aided:boolean):string|null {
  if(readiness(v).length)return "Aguarda condições mínimas do grupo.";
  if(id==="survivor-guard" && trust<2)return "Prefere ficar na estrada: exige confiança 2.";
  if(id==="survivor-spokesperson" && trust<1)return "Ainda não confia na administração (confiança 1).";
  if(id==="survivor-scout" && trust<3)return "Prefere investigar os perseguidores (confiança 3).";
  if(id==="survivor-injured" && (!aided || v.stock.water<18))return "Precisa da ajuda inicial e de 18 porções de água antes de partir.";
  return null;
}
function apply(v:SettlementView,e:SettlementEvent):boolean {
  if(e.type==="task") {
    if(taskProblem(v,e.task,e.worker))return false;
    const t=TASKS[e.task];for(const key of keys){const gain=(t.gain as Partial<Stock>)[key]??0;v.stock[key]+=gain-((t.cost as Partial<Stock>)[key]??0);v.gathered[key]+=gain;}
    v.hours+=t.hours;if(t.once)v.done.push(e.task);
    v.history.push(`${settlementClock(v)}: ${t.name} · ${e.worker==="player"?"você":SURVIVORS.find(p=>p.id===e.worker)!.name}.`);return true;
  }
  if(e.type==="agreement") {
    if(!["camp","agreed"].includes(v.phase) || readiness(v).length || !Number.isInteger(e.trust) || e.trust< -2 || e.trust>4 || typeof e.aided!=="boolean")return false;
    const party=SURVIVORS.filter(p=>!candidateReason(v,p.id,e.trust,e.aided)).map(p=>p.id);
    if(v.phase==="agreed" && party.join()===v.party.join())return false;
    v.party=party;v.phase="agreed";
    v.history.push(`Proposta concreta: ${v.party.length} pessoas decidiram acompanhar você.`);return true;
  }
  if(e.type==="depart") {
    if(v.phase!=="agreed" || readiness(v).length || !v.party.length || v.stock.food<v.party.length*2 || v.stock.water<v.party.length)return false;
    v.stock.food-=v.party.length;v.stock.water-=v.party.length;v.hours++;v.phase="escorting";v.history.push(`Partida: ${v.party.length} refeições e porções de água separadas para a viagem.`);return true;
  }
  if(e.type==="arrive") {
    if(v.phase!=="escorting")return false;
    v.phase="arrived";v.history.push(`Chegada física ao castelo: ${v.party.length} moradores, com reserva de refeições.`);return true;
  }
  return false;
}
export function settlementView(s:SettlementState):SettlementView {
  const v=emptyView();for(const e of s.events)if(!apply(v,e))throw new Error("Invalid settlement ledger");return v;
}
const append = (c:Campaign,e:SettlementEvent):boolean => {
  if(!c.castle.name || c.settlement.events.length>=128)return false;
  const v=settlementView(c.settlement);if(!apply(v,e))return false;c.settlement.events.push(e);return true;
};
export function taskLocation(c:Campaign,id:TaskId):boolean {
  const place=TASKS[id]?.place;
  return place==="trail" ? c.area==="clearing" && adjacent(c.position,RESOURCE_POINT) : c.area==="castle" && !!place && castleNear(c.castle,CASTLE_POINTS[place]);
}
export function performTask(c:Campaign,id:TaskId,worker:Worker="player"):boolean {
  if(!Object.hasOwn(TASKS,id) || !taskLocation(c,id) || !c.castle.name)return false;
  const place=TASKS[id].place;
  if(place!=="trail" && !c.castle.inspected.includes(place))return false;
  return append(c,{type:"task",task:id,worker});
}
export function agreeSettlement(c:Campaign):boolean {
  if(c.area!=="clearing" || !adjacent(c.position,{x:7,y:4}) || !contactResolved(c.contact) || c.contact.terms===null)return false;
  return append(c,{type:"agreement",trust:contactTrust(c.contact),aided:c.contact.aidGiven});
}
export function departSettlement(c:Campaign):boolean {
  return c.area==="clearing" && adjacent(c.position,{x:7,y:4}) && append(c,{type:"depart"});
}
/** Called only at the real area boundary, never when merely accepting the proposal. */
export function arriveSettlement(c:Campaign):boolean {
  return c.area==="castle" && append(c,{type:"arrive"});
}
export function parseSettlement(value:unknown,c:Pick<Campaign,"castle"|"contact"|"area">):SettlementState|null {
  if(!value || typeof value!=="object" || !Array.isArray((value as SettlementState).events))return null;
  const events=(value as SettlementState).events;if(events.length>128 || (events.length && !c.castle.name))return null;
  const v=emptyView(),copy:SettlementEvent[]=[];
  for(const raw of events){
    if(!raw || typeof raw!=="object")return null;
    let e:SettlementEvent;
    if(raw.type==="task") {
      if(!Object.hasOwn(TASKS,raw.task) || (raw.worker!=="player" && !SURVIVORS.some(p=>p.id===raw.worker)))return null;
      const place=TASKS[raw.task].place;if(place!=="trail" && !c.castle.inspected.includes(place))return null;
      e={type:"task",task:raw.task,worker:raw.worker};
    }else if(raw.type==="agreement") {
      // Contact help can happen later; preserve the earlier decision instead of silently recruiting more.
      if(!contactResolved(c.contact) || c.contact.terms===null || (raw.aided && !c.contact.aidGiven) || raw.trust!==contactTrust(c.contact)-(c.contact.aidGiven&&!raw.aided?1:0))return null;
      e={type:"agreement",trust:raw.trust,aided:raw.aided};
    }else if(raw.type==="depart" || raw.type==="arrive")e={type:raw.type};else return null;
    if(!apply(v,e))return null;copy.push(e);
  }
  if(v.phase==="escorting" && c.area!=="clearing")return null;
  return {events:copy};
}
