import type { Campaign } from "../game/campaign";
import { contactTrust, contactResolved } from "../game/contact";
import { TASKS, SURVIVORS, SOURCE_LIMITS, RESOURCE_POINT, settlementView, settlementClock, taskProblem, taskLocation, performTask, readiness, candidateReason, agreeSettlement, departSettlement, type Worker, type TaskId } from "../game/settlement";
const labels={wood:"madeira",stone:"pedra",food:"refeições",water:"água"};
const amounts=(stock:Partial<Record<keyof typeof labels,number>>)=>Object.entries(stock).map(([k,n])=>`${n} ${labels[k as keyof typeof labels]}`).join(", ")||"sem consumo de estoque";
/** A shared management panel; commands re-check location, costs and individual availability. */
export function settlementPanel(c:Campaign,changed:(message:string)=>void,mode:"castle"|"trail"|"contact"):HTMLDetailsElement {
 const root=document.createElement("details");root.className="settlement-panel";root.open=false;
 const summary=document.createElement("summary");summary.textContent="Assentamento e trabalho";summary.dataset.action="settlement";root.append(summary);
 const v=settlementView(c.settlement);
 const p=(s:string)=>{const e=document.createElement("p");e.textContent=s;root.append(e);};
 const button=(id:string,label:string,run:()=>void,disabled=false)=>{const b=document.createElement("button");b.type="button";b.dataset.action=`settle-${id}`;b.textContent=label;b.disabled=disabled;b.onclick=run;root.append(b);};
 p(`${settlementClock(v)} · ${v.phase==="arrived"?v.party.length:0} moradores assentados · ${v.done.includes("dormitory")?12:0} lugares habitáveis.`);
 p(`Estoque do castelo: ${amounts(v.stock)}. Ferramentas: ${v.done.includes("tools")?"recuperadas e reutilizáveis":"a recuperar no pátio"}.`);
 if(!c.castle.name){p("Reivindique o castelo voluntariamente no trono para administrar recursos e obras. Visitar ou conversar não cria moradores.");return root;}
 p("Quatro períodos de trabalho formam um dia. A tarefa ocupa o responsável e resolve seu tempo de jogo ao confirmar, sem espera real. Refeições de trabalho e viagem são debitadas; ainda não há fome diária automática. Rações do kit e suprimentos do abrigo são estoques separados.");
 p(`Coleta na trilha: casa ${RESOURCE_POINT.x+1},${RESOURCE_POINT.y+1}. Fontes finitas restantes: ${SOURCE_LIMITS.wood-v.gathered.wood} madeira caída, ${SOURCE_LIMITS.stone-v.gathered.stone} pedra solta e ${SOURCE_LIMITS.food-v.gathered.food} refeições seladas numa carroça abandonada. Sem reposição automática.`);
 if(v.phase==="escorting")p(`Você acompanha ${v.party.length} pessoas. Siga ao norte até a trilha do castelo (casa 8,2) e entre pelo portão. Elas permanecem junto de você após recarga; a partida não cobra novamente.`);
 if(mode!=="contact" && v.phase!=="escorting") {
  const workers:Worker[]=["player",...SURVIVORS.filter(s=>v.phase==="arrived"&&v.party.includes(s.id)&&s.works).map(s=>s.id)];
  const label=document.createElement("label");label.textContent="Responsável pela próxima tarefa";label.htmlFor="settlement-worker";
  const select=document.createElement("select");select.id="settlement-worker";select.dataset.action="settle-worker";
  for(const id of workers){const o=document.createElement("option");o.value=id;o.textContent=id==="player"?"Você":SURVIVORS.find(p=>p.id===id)!.name;select.append(o);}root.append(label,select);
  for(const id of Object.keys(TASKS) as TaskId[]) {
   const t=TASKS[id];if((mode==="trail")!==(t.place==="trail"))continue;
   if(t.once && v.done.includes(id)){p(`Concluído: ${t.name}.`);continue;}
   const problem=taskProblem(v,id,"player");
   const info=`${t.name} · ${t.hours} período(s) · ${amounts(t.cost)}${Object.keys(t.gain).length?` → ${amounts(t.gain)}`:""}`;
   const location=taskLocation(c,id);
   p(`${info}.${!location?` Aproxime-se de ${t.place==="trail"?"casa 8,4 na clareira":t.place==="courtyard"?"Pátio":t.place==="gate"?"Portão":t.place==="dormitory"?"Dormitório":"Depósito"}.`:""}${problem?" "+problem:""}`);
   button(id,`Executar: ${t.name}`,()=>{
    if(performTask(c,id,select.value as Worker))changed(`${t.name} concluído. Custos debitados e tempo de trabalho registrado.`);
    else changed("Tarefa indisponível: confira responsável, inspeção do local, ferramentas e estoque.");
   },!location || !!problem || (t.place!=="trail"&&!c.castle.inspected.includes(t.place)));
  }
 }
 const needs=readiness(v);p(needs.length?`Antes da proposta: ${needs.join("; ")}.`:"Condições mínimas verificadas: abrigo, portão, trilha, comida e água. A segurança é local; perseguidores continuam um risco.");
 p("As identidades abaixo são papéis provisórios. Morador não se torna combatente nem campeão. Crianças e o viajante ferido não entram na lista de trabalhadores.");
 const roster=document.createElement("ul");
 for(const s of SURVIVORS){const li=document.createElement("li"),reason=candidateReason(v,s.id,contactTrust(c.contact),c.contact.aidGiven);li.textContent=`${s.name} · ${s.job} · ${v.phase==="arrived"?(v.party.includes(s.id)?"morador":"permaneceu na estrada") : v.phase==="escorting"?(v.party.includes(s.id)?"acompanhando a viagem":"permaneceu na estrada") : v.phase==="agreed"?(v.party.includes(s.id)?"aceitou partir":"não aceitou a proposta atual"):reason??"disposto a avaliar quando você apresentar a proposta"}.`;roster.append(li);}root.append(roster);
 if(mode==="contact" && c.contact.terms===null)p("Esclareça os limites do castelo ou registre seus termos na conversa antes da proposta concreta.");
 if(mode==="contact" && ["camp","agreed"].includes(v.phase)) {
  p("Uma proposta concreta pode reabrir o assunto mesmo após recusa ou encerramento do convite inicial. Nenhum ponto de confiança é dado por obras; cada pessoa mantém suas exigências. Ajuda posterior exige nova avaliação antes da partida.");
  button("agree",v.phase==="agreed"?"Reapresentar condições ao grupo":"Apresentar plano concreto de abrigo",()=>{if(agreeSettlement(c))changed("Decisões individuais registradas. Confira quem aceitou antes de partir.");else changed("Não houve mudança nas decisões; verifique as condições antes de reapresentar.");},!!needs.length||!contactResolved(c.contact)||c.contact.terms===null);
  button("depart",`Partir acompanhando o grupo · ${v.party.length} refeições + ${v.party.length} água`,()=>{if(departSettlement(c))changed("Provisões separadas. Volte à clareira e acompanhe o grupo até o castelo pela trilha norte.");},v.phase!=="agreed"||!!needs.length);
 }
 if(v.history.length){const h=document.createElement("h3");h.textContent="Últimos registros";root.append(h);const ul=document.createElement("ul");for(const line of v.history.slice(-6)){const li=document.createElement("li");li.textContent=line;ul.append(li);}root.append(ul);}
 return root;
}
