import { travelerAttributes } from "./progression";
export type Team = "ally" | "enemy";
import { classAttributes } from "./archetypes";
import type { UnitClass, Technique } from "./archetypes";
export { TECHNIQUES } from "./archetypes";
export type { UnitClass, Technique } from "./archetypes";
export type Unit = {
  id: string;
  name: string;
  team: Team;
  cls: UnitClass;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  ep: number;
  maxEp: number;
  attack: number;
  magic: number;
  defense: number;
  move: number;
  acted: boolean;
};
export const WIDTH = 12,
  HEIGHT = 8;
export const TERRAIN = [
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
] as const;
export const dist = (
  a: { x: number; y: number },
  b: { x: number; y: number },
) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const inside = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
export const walkable = (x: number, y: number) =>
  inside(x, y) && TERRAIN[y][x] !== 2;
export function reachable(unit: Unit, units: Unit[]): Set<string> {
  const occupied = new Set(
    units
      .filter((u) => u.hp > 0 && u.id !== unit.id)
      .map((u) => u.x + "," + u.y),
  );
  const costs = new Map<string, number>([[unit.x + "," + unit.y, 0]]);
  const queue: [number, number, number][] = [[unit.x, unit.y, 0]];
  for (let i = 0; i < queue.length; i++) {
    const [x, y, c] = queue[i];
    if (c !== costs.get(x + "," + y)) continue;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx,
        ny = y + dy,
        key = nx + "," + ny;
      if (!walkable(nx, ny) || occupied.has(key)) continue;
      const next = c + (TERRAIN[ny][nx] === 1 ? 2 : 1);
      if (next <= unit.move && next < (costs.get(key) ?? Infinity)) {
        costs.set(key, next);
        queue.push([nx, ny, next]);
      }
    }
  }
  return new Set(costs.keys());
}
export function damage(a: Unit, b: Unit, skill: Technique): number {
  const armor = skill.kind === "magic" ? Math.floor(b.defense / 2) : b.defense;
  return Math.max(
    1,
    (skill.kind === "magic" ? a.magic : a.attack) +
      skill.power -
      armor -
      (TERRAIN[b.y][b.x] === 1 ? 2 : 0),
  );
}
export function makeUnits(
  name = "Viajante",
  cls: UnitClass = "Guerreiro",
  experience = 0,
): Unit[] {
  function create(
    id: string,
    n: string,
    team: Team,
    c: UnitClass,
    x: number,
    y: number,
  ): Unit {
    const { hp, ep, attack, magic, defense, move } = id === "hero" ? travelerAttributes(c, experience) : classAttributes(c);
    return {
      id,
      name: n,
      team,
      cls: c,
      x,
      y,
      hp,
      maxHp: hp,
      ep,
      maxEp: ep,
      attack,
      magic,
      defense,
      move,
      acted: false,
    };
  }
  return [
    create("hero", name, "ally", cls, 1, 4),
    create("lyra", "Lyra", "ally", "Mago", 1, 6),
    create("bandit1", "Saqueador", "enemy", "Guerreiro", 9, 2),
    create("bandit2", "Batedor", "enemy", "Ladino", 10, 5),
  ];
}
