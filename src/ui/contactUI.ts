import { settlementPanel } from "./settlementUI";
import { settlementView } from "../game/settlement";
import type { Campaign } from "../game/campaign";
import { CONTACT_BALANCE, CONTACT_QUESTIONS, CONTACT_ANSWERS, CONTACT_RESULTS, contactTrust, contactResolved, observeContact, finishContact, askContact, donateContactRation, setContactTerms, inviteContact, declineContact, reviewContactInvitation, type ContactOpening } from "../game/contact";
export function renderContactUI(root:HTMLElement,c:Campaign,changed:(message?:string)=>void,start:(opening?:ContactOpening)=>void,back:()=>void,feedback:string,saveMessage:string) {
  const settlementOpen=root.querySelector<HTMLDetailsElement>(".settlement-panel")?.open??false;
  const escort=settlementView(c.settlement).phase==="escorting";
  const scroll=root.scrollTop,focus=document.activeElement?.getAttribute("data-action");
  const detailsOpen=root.querySelector<HTMLDetailsElement>(".contact-answers")?.open??false;
  root.replaceChildren();const s=c.contact;
  const h=document.createElement("h2");h.textContent="Sobreviventes na trilha";root.append(h);
  const p=(text:string,role?:string)=>{const el=document.createElement("p");el.textContent=text;if(role)el.setAttribute("role",role);root.append(el);return el;};
  p(CONTACT_RESULTS[s.combat],"status");
  if(s.observed) p("Observação registrada: doze pessoas, algumas feridas, ficam atrás do combatente. Elas procuram distância de quem se aproxima armado.");
  if(s.recovery!=="none") p(s.recovery==="ration" ? "Recuperação: uma ração do seu estoque foi usada, uma única vez. Não há ferimentos persistentes." : "Recuperação: descanso assistido, pois você não tinha ração disponível. Não há dívida nem ferimentos persistentes.");
  const trust=contactTrust(s);p(`Confiança inicial do grupo: ${trust} · ${trust>=CONTACT_BALANCE.invitationTrust ? "receptiva ao diálogo" : trust<0 ? "reservada" : "cautelosa"}. A decisão sobre mudança continua sendo deles.`);
  if(feedback) p(feedback,"status");
  const actions=document.createElement("div");actions.className="actions";root.append(actions);
  const button=(id:string,label:string,run:()=>void,disabled=false)=>{const b=document.createElement("button");b.type="button";b.dataset.action=id;b.textContent=label;b.disabled=disabled;b.onclick=run;actions.append(b);};
  const update=(mutate:()=>boolean,text?:string)=>{if(mutate())changed(text);};
  if(s.opening===null) {
    if(!s.observed) button("observe","Observar o grupo à distância",()=>update(()=>observeContact(s)));
    p("Você pode baixar as armas e conversar à distância. Se mantiver a guarda, o mal-entendido vira um confronto individual não letal; resistir três rodadas reduz a desconfiança. Ninguém é recrutado por ser derrotado.");
    p("Se perder o confronto, uma ração disponível será usada na recuperação. Sem ração, o grupo oferece descanso, sem bloquear sua jornada.");
    button("reassure","Não estou perseguindo vocês · manter a guarda",()=>start("reassure"));
    button("demand","Abaixem as armas · manter a guarda",()=>start("demand"));
    button("withdraw","Baixar as armas e conversar à distância",()=>start("withdraw"));
  } else if(s.combat==="active") {
    button("resume","Reiniciar confronto interrompido",()=>start());
    button("retreat","Recuar e conversar",()=>update(()=>finishContact(s,"retreated",c.adaptation)));
  } else if(contactResolved(s)) {
    const labels={pursuers:"Quem os persegue?",injured:"Alguém está ferido?",mistake:"Por que atacaram?"} as const;
    for(const id of CONTACT_QUESTIONS) if(!s.questions.includes(id)) button(`ask-${id}`,labels[id],()=>update(()=>askContact(s,id),CONTACT_ANSWERS[id]));
    button("aid",s.aidGiven ? "Ração oferecida" : `Oferecer uma ração · estoque ${c.adaptation.rations}`,()=>update(()=>donateContactRation(s,c.adaptation),"A porta-voz agradece a ajuda. A ração foi retirada do seu estoque; o grupo continua livre para decidir."),s.aidGiven || !c.adaptation.claimed || c.adaptation.rations<1);
    if(s.terms===null) {
      button("honest","Esclarecer os limites do castelo",()=>update(()=>setContactTerms(s,"honest"),c.castle.name ? "Você esclarece que o castelo ainda não oferece moradia pronta, alimento ou segurança garantida." : "Você esclarece que encontrou uma construção abandonada e ainda não reivindicou sua administração."));
      button("promise","Prometer reparos rápidos",()=>update(()=>setContactTerms(s,"promise"),"Porta-voz: uma promessa não garante água, comida nem segurança. Precisamos de condições verificáveis."));
    } else p(s.terms==="honest" ? "Na conversa inicial, você esclareceu a precariedade do castelo. O quadro de assentamento mostra as condições atuais." : "Promessa registrada: o grupo espera provas dos reparos prometidos.");
    if(s.offer==="none") {
      button("invite","Convidar o grupo a avaliar o castelo",()=>update(()=>inviteContact(s,c.castle.name)),!c.castle.name || s.terms===null);
      if(!c.castle.name) p("Você pode continuar a conversa e ajudar sem ter um castelo. Para oferecer acesso sob sua administração, primeiro decida a reivindicação no trono.");
      else if(s.terms===null) p("Esclareça as condições antes de fazer um convite.");
      button("decline","Encerrar sem oferecer convite",()=>update(()=>declineContact(s),"Você não ofereceu um convite neste contato. O grupo permanece independente e a estrada continua disponível."));
    }
    if(s.offer==="invited") {
      p(s.response==="considering" ? "Porta-voz: vamos avaliar a proposta. Antes de decidir mudar, precisamos verificar água, abrigo e segurança. Ninguém parte agora." : "Porta-voz: nestas condições, não aceitamos a proposta. Podemos conversar, mas a confiança ainda precisa ser construída.");
      if(s.response==="refused") button("review","Pedir reavaliação do convite",()=>update(()=>reviewContactInvitation(s)),trust<CONTACT_BALANCE.invitationTrust);
    }
    if(s.offer==="declined") p("O primeiro contato foi encerrado sem convite. Uma proposta concreta posterior é registrada separadamente no quadro de assentamento.");
    const details=document.createElement("details");details.className="contact-answers";details.open=detailsOpen;
    const summary=document.createElement("summary");summary.dataset.action="answers";summary.textContent="Respostas e consequências";details.append(summary);
    for(const id of s.questions){const el=document.createElement("p");el.textContent=CONTACT_ANSWERS[id];details.append(el);}
    const rules=document.createElement("p");rules.textContent="A abertura cautelosa, a resistência, a ajuda e a honestidade influenciam a confiança. Repetir perguntas não acrescenta pontos. Este encontro não concede XP ou saque.";details.append(rules);root.append(details);
  }
  const work=settlementPanel(c,message=>changed(message),"contact");work.open=settlementOpen;root.append(work);
  if(escort)p("O grupo aguarda sua saída pela clareira. Siga a trilha norte até o castelo.","status");
  button("back","Voltar à clareira",back);
  p(saveMessage).className="save-status";
  if(focus)root.querySelector<HTMLElement>(`[data-action="${focus}"]`)?.focus({preventScroll:true});root.scrollTop=scroll;
}
