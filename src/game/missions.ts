import type { Technique, Unit } from "./model";
export type Mission = "ruins" | "creature";
export const MISSIONS = {
  ruins: { title: "Ruínas da Fronteira", banner: "BASILIS / RUÍNAS DA FRONTEIRA", goal: "Derrote os dois saqueadores.", won: "VITÓRIA! A passagem está segura.", lost: "DERROTA. A expedição terminou." },
  creature: { title: "Toca na clareira", banner: "BASILIS / PRIMEIRO CONTATO", goal: "Afugente a criatura ou recue no seu turno. Não é necessário matá-la. Sem XP ou saque.", won: "A criatura recua para a mata. O confronto terminou.", lost: "Você recua para um lugar seguro. A jornada continua." },
} as const;
export const CREATURE_STATS = { hp: 20, ep: 0, attack: 4, magic: 0, defense: 2, move: 3 } as const;
export const CREATURE_TECHNIQUES: readonly Technique[] = [{ name: "Garrada", power: 5, range: 1, cost: 0, kind: "physical" }];
export function creatureUnit(): Unit {
  const s = CREATURE_STATS;
  return { id: "creature", name: "Criatura defensiva", team: "enemy", cls: "Guerreiro", x: 6, y: 4, ...s, maxHp: s.hp, maxEp: s.ep, acted: false };
}
