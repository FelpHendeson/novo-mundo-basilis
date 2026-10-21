import { CONTACT_ACTORS } from "./contact";
import type { Technique, Unit } from "./model";
export type Mission = "ruins" | "creature" | "contact";
export const MISSIONS = {
  ruins: { title: "Ruínas da Fronteira", banner: "BASILIS / RUÍNAS DA FRONTEIRA", goal: "Derrote os dois saqueadores.", won: "VITÓRIA! A passagem está segura.", lost: "DERROTA. A expedição terminou." },
  creature: { title: "Toca na clareira", banner: "BASILIS / TOCA NA CLAREIRA", goal: "Afugente a criatura ou recue no seu turno. Não é necessário matá-la. Sem XP ou saque.", won: "A criatura recua para a mata. O confronto terminou.", lost: "Você recua para um lugar seguro. A jornada continua." },
  contact: { title:"Sobreviventes na trilha", banner:"BASILIS / PRIMEIRO CONTATO", goal:"Confronto não letal: resista por três rodadas, neutralize o guardião ou recue no seu turno. HP 0 indica neutralização, sem morte. Resistir reduz a desconfiança. Sem XP ou saque.", won:"O guardião foi neutralizado. O grupo aceita conversar.", lost:"O confronto termina. O grupo ajuda você a descansar e aceita conversar." },
} as const;
export const CREATURE_STATS = { hp: 20, ep: 0, attack: 4, magic: 0, defense: 2, move: 3 } as const;
export const CREATURE_TECHNIQUES: readonly Technique[] = [{ name: "Garrada", power: 5, range: 1, cost: 0, kind: "physical" }];
export function creatureUnit(): Unit {
  const s = CREATURE_STATS;
  return { id: "creature", name: "Criatura defensiva", team: "enemy", cls: "Guerreiro", x: 6, y: 4, ...s, maxHp: s.hp, maxEp: s.ep, acted: false };
}

export const CONTACT_TRUCE_ROUNDS = 3;
export const GUARD_STATS = { hp:26, ep:0, attack:7, magic:0, defense:4, move:3 } as const;
export const GUARD_TECHNIQUES:readonly Technique[] = [{ name:"Contenção", power:5, range:1, cost:0, kind:"physical" }];
export function contactGuardUnit():Unit {
  const s=GUARD_STATS;
  return {id:CONTACT_ACTORS.guard.id,name:CONTACT_ACTORS.guard.name,team:"enemy",cls:"Guerreiro",x:6,y:4,...s,maxHp:s.hp,maxEp:s.ep,acted:false};
}
