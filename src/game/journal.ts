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
  if (c.adaptation.claimed) entries.push(`Kit recebido uma única vez. Bolsa: ${c.adaptation.potions} poções e ${c.adaptation.rations} rações restantes. Arma de adaptação equipada.`);
  entries.push(c.adaptation.manaStep === 3 ? "Primeiro exercício de mana concluído. Não concede XP nem bônus permanente." : `Exercício de mana opcional: ${c.adaptation.manaStep}/3 etapas. Continue pela consulta ao Sistema.`);
  if (c.creature.observed) entries.push("Toca observada: a criatura protege a entrada e não persegue quem mantém distância.");
  if (c.creature.outcome === "avoided") entries.push("Você contornou a toca sem confronto. A trilha continua acessível.");
  if (c.creature.outcome === "repelled") entries.push("A criatura foi afugentada. Não houve saque ou recompensa de XP.");
  if (c.creature.outcome === "retreated") entries.push("Você recuou do confronto na toca e continuou a jornada.");
  if (c.creature.engaged && c.creature.outcome === "pending") entries.push("Confronto da toca interrompido: volte aos rastros para reiniciar ou encerrar recuando.");
  if (c.metLyra) entries.push("Lyra ofereceu ajuda para proteger a passagem nas ruínas.");
  if (c.passageCleared) entries.push("Passagem liberada. A recompensa da primeira vitória já foi registrada.");
  if (c.base.prepared) entries.push("Abrigo preparado com três suprimentos, pagos uma única vez.");
  if (c.base.lyraRecruited) entries.push(`Lyra aceitou integrar o grupo e está ${c.base.lyraDeployed ? "na equipe" : "na reserva"}.`);
  return entries;
}
