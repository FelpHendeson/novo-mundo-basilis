import { adjacent, castlePassable, CASTLE_ENTRANCE, type Position } from "./areas";
export const CASTLE_POINTS = {
  gate: { name: "Portão", x:3, y:4, clue:"O portão está parcialmente quebrado. Há espaço para passar, mas ele não protege a entrada.", repair:"Reforçar o portão" },
  courtyard: { name:"Pátio", x:3, y:3, clue:"Pedras gastas e vegetação marcam uma ocupação antiga. Ninguém responde ao chamado." },
  storehouse: { name:"Depósito", x:1, y:2, clue:"O depósito está vazio e precisa de reparos. Não há materiais aproveitáveis registrados.", repair:"Recuperar o depósito" },
  wall: { name:"Muralha", x:6, y:2, clue:"A muralha conserva trechos firmes e rachaduras. Sua origem permanece desconhecida." },
  records: { name:"Registros", x:2, y:1, clue:"Restam marcas e páginas deterioradas. Ainda não é possível identificar antigos donos ou reivindicações." },
  tower: { name:"Torre", x:6, y:3, clue:"A escada da torre está danificada. Da base se vê parte da trilha, sem explorar os andares inseguros." },
  dormitory: { name:"Dormitório", x:5, y:1, clue:"O dormitório está vazio. Limpeza e reparos serão necessários antes de receber habitantes.", repair:"Restaurar o dormitório" },
} as const;
export type CastlePoint = keyof typeof CASTLE_POINTS;
export const POINT_IDS = Object.keys(CASTLE_POINTS) as CastlePoint[];
export const REPAIR_IDS = ["gate", "storehouse", "dormitory"] as const;
export type RepairId = (typeof REPAIR_IDS)[number];
export const THRONE: Position = { x:3, y:0 };
export type CastleState = {
  visited: boolean; position: Position; inspected: CastlePoint[];
  throneActivated: boolean; claimDeferred: boolean; name: string | null; priority: RepairId | null;
};
export const newCastle = (): CastleState => ({ visited:false, position:{...CASTLE_ENTRANCE}, inspected:[], throneActivated:false, claimDeferred:false, name:null, priority:null });
export const castleNear = (c: CastleState, p: Position) => c.visited && adjacent(c.position,p);
export function moveInCastle(c: CastleState, dx: number, dy: number): boolean {
  if (!c.visited || Math.abs(dx)+Math.abs(dy)!==1) return false;
  const x=c.position.x+dx,y=c.position.y+dy;
  if (!castlePassable(x,y)) return false;
  c.position={x,y};return true;
}
export function inspectCastle(c: CastleState, id: CastlePoint): boolean {
  const point=CASTLE_POINTS[id];
  if(!point || !castleNear(c,point) || c.inspected.includes(id)) return false;
  c.inspected.push(id);return true;
}
export function activateThrone(c: CastleState): boolean {
  if(!castleNear(c,THRONE) || c.throneActivated) return false;
  c.throneActivated=true;return true;
}
export function deferCastle(c: CastleState): boolean {
  if(!castleNear(c,THRONE) || !c.throneActivated || c.name!==null || c.claimDeferred) return false;
  c.claimDeferred=true;return true;
}
/** Normalize user input; persisted names must already be in this canonical form. */
export function normalizeCastleName(value: unknown): string | null {
  if(typeof value!=="string" || value.length>128 || /[\p{Cc}\p{Cf}]/u.test(value)) return null;
  const name=value.normalize("NFC").trim().replace(/ +/g," ");
  if(Array.from(name).length<3 || Array.from(name).length>32 || !/^[\p{L}\p{N}][\p{L}\p{N} '’\-]*$/u.test(name)) return null;
  return name;
}
export function claimCastle(c: CastleState, value: unknown): boolean {
  const name=normalizeCastleName(value);
  if(!name || !castleNear(c,THRONE) || !c.throneActivated || c.name!==null) return false;
  c.name=name;return true;
}
export function prioritizeRepair(c: CastleState, id: RepairId): boolean {
  if(!c.visited || !c.name || !(REPAIR_IDS as readonly string[]).includes(id) || !c.inspected.includes(id) || c.priority===id) return false;
  c.priority=id;return true;
}
export function parseCastle(value: unknown): CastleState | null {
  if(!value || typeof value!=="object") return null;
  const c=value as CastleState;
  if(typeof c.visited!=="boolean" || typeof c.throneActivated!=="boolean" || typeof c.claimDeferred!=="boolean" ||
      !c.position || !castlePassable(c.position.x,c.position.y) || !Array.isArray(c.inspected) || c.inspected.length>POINT_IDS.length ||
      !Array.from(c.inspected).every(id=>(POINT_IDS as readonly unknown[]).includes(id)) || new Set(c.inspected).size!==c.inspected.length ||
      (c.name!==null && (normalizeCastleName(c.name)!==c.name || typeof c.name!=="string")) ||
      (c.priority!==null && (!(REPAIR_IDS as readonly unknown[]).includes(c.priority) || !c.name || !c.inspected.includes(c.priority))) ||
      (!c.throneActivated && (c.name!==null || c.claimDeferred)) ||
      (!c.visited && (c.inspected.length>0 || c.throneActivated || c.position.x!==CASTLE_ENTRANCE.x || c.position.y!==CASTLE_ENTRANCE.y))) return null;
  return { visited:c.visited, position:{x:c.position.x,y:c.position.y}, inspected:[...c.inspected], throneActivated:c.throneActivated, claimDeferred:c.claimDeferred, name:c.name, priority:c.priority };
}
