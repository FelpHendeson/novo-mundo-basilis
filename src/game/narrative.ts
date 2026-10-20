/** Small, bounded ledger of narrative effects; no engine or reward logic. */
export const NARRATIVE_EVENTS = ["journey.legacy", "system.welcome", "system.where", "system.identity", "system.deferred", "arrival.completed"] as const;
export type NarrativeEvent = (typeof NARRATIVE_EVENTS)[number];
export const DIALOGUE_NODES = ["welcome", "where", "identity", "deferred", "ready"] as const;
export type DialogueNode = (typeof DIALOGUE_NODES)[number];
export type NarrativeState = {
  sceneId: "SCN_002_AWAKEN" | "AREA_CLEARING";
  nodeId: DialogueNode;
  appliedEvents: NarrativeEvent[];
};
export const newNarrative = (): NarrativeState => ({ sceneId: "SCN_002_AWAKEN", nodeId: "welcome", appliedEvents: [] });
export const legacyNarrative = (): NarrativeState => ({ sceneId: "AREA_CLEARING", nodeId: "welcome", appliedEvents: ["journey.legacy", "arrival.completed"] });
export function recordNarrativeEvent(n: NarrativeState, event: NarrativeEvent): boolean {
  if (n.appliedEvents.includes(event)) return false;
  n.appliedEvents.push(event);
  return true;
}
export function openSystem(n: NarrativeState): void {
  n.sceneId = "SCN_002_AWAKEN";
  n.nodeId = "welcome";
  recordNarrativeEvent(n, "system.welcome");
}
export type DialogueChoice = "where" | "identity" | "defer" | "continue";
export function chooseDialogue(n: NarrativeState, choice: DialogueChoice): boolean {
  if (n.sceneId !== "SCN_002_AWAKEN") return false;
  if (choice === "where" || choice === "identity") {
    const changed = recordNarrativeEvent(n, choice === "where" ? "system.where" : "system.identity");
    const differentNode = n.nodeId !== choice;
    n.nodeId = choice;
    return changed || differentNode;
  }
  if (choice !== "defer" && choice !== "continue") return false;
  if (choice === "defer") recordNarrativeEvent(n, "system.deferred");
  recordNarrativeEvent(n, "arrival.completed");
  n.sceneId = "AREA_CLEARING";
  n.nodeId = choice === "defer" ? "deferred" : "ready";
  return true;
}
export const systemDialogue: Record<DialogueNode, string> = {
  welcome: "Seja bem-vindo a Basilis. Identidade reconhecida. Instruções básicas disponíveis.",
  where: "Designação ambiental: Basilis. Região: não identificada.",
  identity: "Interface de registro e orientação. O Sistema se aplica aos seres deste mundo; não é uma habilidade exclusiva sua.",
  deferred: "As instruções continuam disponíveis quando desejar consultá-las.",
  ready: "O caminho está diante de você. As instruções podem ser consultadas novamente.",
};
export function parseNarrative(value: unknown): NarrativeState | null {
  if (!value || typeof value !== "object") return null;
  const n = value as NarrativeState;
  if (!["SCN_002_AWAKEN", "AREA_CLEARING"].includes(n.sceneId) ||
      !(DIALOGUE_NODES as readonly unknown[]).includes(n.nodeId) || !Array.isArray(n.appliedEvents) ||
      n.appliedEvents.length > NARRATIVE_EVENTS.length ||
      !Array.from(n.appliedEvents).every(e => (NARRATIVE_EVENTS as readonly unknown[]).includes(e)) ||
      new Set(n.appliedEvents).size !== n.appliedEvents.length) return null;
  if (n.sceneId === "AREA_CLEARING" && !n.appliedEvents.includes("arrival.completed")) return null;
  if (n.sceneId === "SCN_002_AWAKEN" && ["deferred", "ready"].includes(n.nodeId)) return null;
  if ((n.nodeId === "where" && !n.appliedEvents.includes("system.where")) ||
      (n.nodeId === "identity" && !n.appliedEvents.includes("system.identity")) ||
      (n.nodeId === "deferred" && !n.appliedEvents.includes("system.deferred"))) return null;
  return { sceneId: n.sceneId, nodeId: n.nodeId, appliedEvents: [...n.appliedEvents] };
}
export const campaignScene = (n: NarrativeState): "Arrival" | "Exploration" => n.sceneId === "SCN_002_AWAKEN" ? "Arrival" : "Exploration";
