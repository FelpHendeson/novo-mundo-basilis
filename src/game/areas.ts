export type AreaId = "clearing" | "castle";
export type Position = { x: number; y: number };
export const AREAS = {
  clearing: { name: "Clareira da Outra Margem", width: 8, height: 6 },
  castle: { name: "Castelo abandonado", width: 8, height: 6 },
} as const;
export const CASTLE_FLOOR = ["###..###", "#......#", "#......#", "#......#", "###..###", "###..###"] as const;
export const CASTLE_ENTRANCE: Position = { x: 3, y: 5 };
export const CASTLE_ROUTE = { x: 7, y: 1 } as const;
export const adjacent = (a: Position, b: Position) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<=1;
export function castlePassable(x: number, y: number): boolean {
  return Number.isInteger(x) && Number.isInteger(y) && x>=0 && x<8 && y>=0 && y<6 && CASTLE_FLOOR[y][x] === ".";
}
