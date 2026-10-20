import type { Campaign } from "./campaign";
import { campaignObjective } from "./campaign";
export function journalEntries(c: Campaign): string[] {
  const events = c.narrative.appliedEvents;
  const entries = [campaignObjective(c)];
  if (events.includes("journey.legacy")) entries.push("A jornada já estava em curso. Perfil, posição e conquistas anteriores foram preservados.");
  if (events.includes("system.welcome")) entries.push("Uma interface apresentou o nome Basilis. A origem do transporte continua desconhecida.");
  if (events.includes("system.where")) entries.push("Sistema: designação ambiental Basilis; região não identificada.");
  if (events.includes("system.identity")) entries.push("O Sistema registra e orienta os seres deste mundo. Ele não é exclusivo do viajante.");
  if (events.includes("system.deferred")) entries.push("Você adiou as instruções. Consultar o Sistema continua disponível na exploração.");
  if (c.metLyra) entries.push("Lyra ofereceu ajuda para proteger a passagem nas ruínas.");
  if (c.passageCleared) entries.push("Passagem liberada. A recompensa da primeira vitória já foi registrada.");
  if (c.base.prepared) entries.push("Abrigo preparado com três suprimentos, pagos uma única vez.");
  if (c.base.lyraRecruited) entries.push(`Lyra aceitou integrar o grupo e está ${c.base.lyraDeployed ? "na equipe" : "na reserva"}.`);
  return entries;
}
