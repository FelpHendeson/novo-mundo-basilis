import type { Adaptation } from "./adaptation";
export const CONTACT_POSITION = { x:7, y:4 } as const;
export const CONTACT_ACTORS = { guard: { id:"survivor-guard", name:"Guardião dos sobreviventes" }, spokesperson: { id:"survivor-spokesperson", name:"Porta-voz" } } as const;
export const CONTACT_QUESTIONS = ["pursuers", "injured", "mistake"] as const;
export type ContactQuestion = (typeof CONTACT_QUESTIONS)[number];
export type ContactOpening = "reassure" | "demand" | "withdraw";
export type ContactCombat = "none" | "active" | "survived" | "neutralized" | "defeated" | "retreated";
export type ContactTerms = "honest" | "promise";
export type ContactState = {
  seen:boolean; observed:boolean; opening:ContactOpening|null; combat:ContactCombat;
  questions:ContactQuestion[]; aidGiven:boolean; terms:ContactTerms|null;
  offer:"none"|"invited"|"declined"; response:"none"|"considering"|"refused";
  recovery:"none"|"ration"|"rest";
};
export const CONTACT_BALANCE = { invitationTrust:2, reassure:1, demand:-1, survival:1, rationAid:1, honesty:1, vaguePromise:-1, recoveryRations:1 } as const;
export const newContact = (): ContactState => ({ seen:false, observed:false, opening:null, combat:"none", questions:[], aidGiven:false, terms:null, offer:"none", response:"none", recovery:"none" });
export const contactResolved = (c:ContactState) => !["none","active"].includes(c.combat);
/** Derive trust from finite decisions; repeating a line cannot farm relationship points. */
export function contactTrust(c:ContactState): number {
  return (c.opening==="reassure" ? CONTACT_BALANCE.reassure : c.opening==="demand" ? CONTACT_BALANCE.demand : 0)
    +(c.combat==="survived" ? CONTACT_BALANCE.survival : 0)
    +(c.aidGiven ? CONTACT_BALANCE.rationAid : 0)
    +(c.terms==="honest" ? CONTACT_BALANCE.honesty : c.terms==="promise" ? CONTACT_BALANCE.vaguePromise : 0);
}
export function observeContact(c:ContactState):boolean {
  if(!c.seen || c.opening!==null || c.observed) return false;
  c.observed=true;return true;
}
export function beginContact(c:ContactState, opening:ContactOpening):boolean {
  if(!c.seen || c.opening!==null || !["reassure","demand","withdraw"].includes(opening)) return false;
  c.opening=opening;c.combat=opening==="withdraw" ? "retreated" : "active";return true;
}
export function finishContact(c:ContactState, result:Exclude<ContactCombat,"none"|"active">, bag:Adaptation):boolean {
  if(c.combat!=="active" || !["survived","neutralized","defeated","retreated"].includes(result)) return false;
  c.combat=result;
  if(result==="defeated") {
    if(bag.claimed && bag.rations>=CONTACT_BALANCE.recoveryRations) { bag.rations-=CONTACT_BALANCE.recoveryRations;c.recovery="ration"; }
    else c.recovery="rest";
  }
  return true;
}
export function askContact(c:ContactState, question:ContactQuestion):boolean {
  if(!contactResolved(c) || !(CONTACT_QUESTIONS as readonly string[]).includes(question) || c.questions.includes(question)) return false;
  c.questions.push(question);return true;
}
export function donateContactRation(c:ContactState, bag:Adaptation):boolean {
  if(!contactResolved(c) || c.aidGiven || !bag.claimed || bag.rations<1) return false;
  bag.rations--;c.aidGiven=true;return true;
}
export function setContactTerms(c:ContactState, terms:ContactTerms):boolean {
  if(!contactResolved(c) || c.terms!==null || !["honest","promise"].includes(terms)) return false;
  c.terms=terms;return true;
}
export function inviteContact(c:ContactState, castleName:string|null):boolean {
  if(!contactResolved(c) || !castleName || c.terms===null || c.offer!=="none") return false;
  c.offer="invited";c.response=contactTrust(c)>=CONTACT_BALANCE.invitationTrust ? "considering" : "refused";return true;
}
export function declineContact(c:ContactState):boolean {
  if(!contactResolved(c) || c.offer!=="none") return false;
  c.offer="declined";return true;
}
export function reviewContactInvitation(c:ContactState):boolean {
  if(c.offer!=="invited" || c.response!=="refused" || contactTrust(c)<CONTACT_BALANCE.invitationTrust) return false;
  c.response="considering";return true;
}
export const CONTACT_ANSWERS:Record<ContactQuestion,string> = {
  pursuers:"Guardião: há perseguidores na estrada. Não sabemos quem os contratou. Não vou inventar uma certeza para convencer você.",
  injured:"Porta-voz: algumas pessoas estão feridas. Uma ração ajuda no repouso, mas não resolve ferimentos nem compra a decisão de ninguém.",
  mistake:"Guardião: nossos perseguidores não costumam fazer perguntas. Confundimos você com eles. Isso não apaga o erro.",
};
export const CONTACT_RESULTS:Record<ContactCombat,string> = {
  none:"Vozes e marcas de luta surgem na trilha. Um combatente se interpõe: ‘Pare! Mais um caçador? Não vai levar ninguém!’",
  active:"O confronto foi interrompido. Reinicie com HP/energia restaurados ou recue para conversar. Itens já gastos não retornam.",
  survived:"O guardião abaixa a arma: ‘Basta. Você manteve a guarda sem nos perseguir.’ O grupo aceita conversar.",
  neutralized:"O guardião foi neutralizado e a luta é interrompida. Ninguém foi morto. O grupo mantém distância, mas aceita conversar.",
  defeated:"O guardião interrompe o confronto e o grupo ajuda você a descansar. A conversa pode continuar; ninguém morreu.",
  retreated:"Você baixa as armas e mantém distância. O grupo não se aproxima, mas a porta-voz aceita conversar.",
};
export function parseContact(value:unknown):ContactState|null {
  if(!value || typeof value!=="object") return null;
  const c=value as ContactState;
  if(typeof c.seen!=="boolean" || typeof c.observed!=="boolean" || typeof c.aidGiven!=="boolean" ||
    ![null,"reassure","demand","withdraw"].includes(c.opening) || !["none","active","survived","neutralized","defeated","retreated"].includes(c.combat) ||
    ![null,"honest","promise"].includes(c.terms) || !["none","invited","declined"].includes(c.offer) || !["none","considering","refused"].includes(c.response) ||
    !["none","ration","rest"].includes(c.recovery) || !Array.isArray(c.questions) || c.questions.length>CONTACT_QUESTIONS.length ||
    !Array.from(c.questions).every(q=>(CONTACT_QUESTIONS as readonly unknown[]).includes(q)) || new Set(c.questions).size!==c.questions.length) return null;
  if((!c.seen && (c.observed || c.opening!==null)) || (c.opening===null)!==(c.combat==="none") || (c.opening==="withdraw" && c.combat!=="retreated") ||
    (!contactResolved(c) && (c.questions.length>0 || c.aidGiven || c.terms!==null || c.offer!=="none")) ||
    (c.combat==="defeated" ? c.recovery==="none" : c.recovery!=="none") ||
    (c.offer==="invited" ? c.response==="none" || c.terms===null : c.response!=="none") ||
    (c.response==="considering" && contactTrust(c)<CONTACT_BALANCE.invitationTrust)) return null;
  return {seen:c.seen,observed:c.observed,opening:c.opening,combat:c.combat,questions:[...c.questions],aidGiven:c.aidGiven,terms:c.terms,offer:c.offer,response:c.response,recovery:c.recovery};
}
