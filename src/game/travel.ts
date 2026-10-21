import { CONTACT_POSITION } from "./contact";
import type { Campaign } from "./campaign";
import { CASTLE_ROUTE, CASTLE_ENTRANCE, adjacent } from "./areas";
export function canEnterCastle(c: Campaign): boolean {
  return c.area === "clearing" && c.narrative.sceneId === "AREA_CLEARING" && adjacent(c.position,CASTLE_ROUTE);
}
export function enterCastle(c: Campaign): boolean {
  if(!canEnterCastle(c)) return false;
  c.castle.visited=true; c.castle.position={...CASTLE_ENTRANCE}; c.area="castle"; return true;
}
export function canLeaveCastle(c: Campaign): boolean {
  return c.area === "castle" && adjacent(c.castle.position,CASTLE_ENTRANCE);
}
export function leaveCastle(c: Campaign): boolean {
  if(!canLeaveCastle(c)) return false;
  c.area="clearing";return true;
}

export function canMeetContact(c: Campaign): boolean {
  return c.area === "clearing" && c.narrative.sceneId === "AREA_CLEARING" && c.castle.visited && adjacent(c.position, CONTACT_POSITION);
}
