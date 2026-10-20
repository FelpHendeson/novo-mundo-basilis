import { advanceMana, claimKit, starterWeapon } from "../game/adaptation";
import type { Campaign } from "../game/campaign";
const prompts = [
  { text: "Perceber: mana também pode fortalecer combatentes físicos. Comece observando o próprio fluxo, sem forçar.", answer: "Observar o fluxo", other: "Forçar toda a energia" },
  { text: "Conduzir: mantenha um fluxo pequeno e constante, respeitando os limites do corpo.", answer: "Conduzir com suavidade", other: "Aumentar a força ao máximo" },
  { text: "Estabilizar: reduza o fluxo e retome o ritmo natural antes de encerrar.", answer: "Estabilizar e encerrar", other: "Manter o esforço máximo" },
];
/** HTML controls: no timer, reflex gate, XP reward or permanent stat gain. */
export function adaptationUI(c: Campaign, changed: () => void): HTMLElement {
  const root = document.createElement("div");
  const title = document.createElement("h3"); title.textContent = "Adaptação a Basilis"; root.append(title);
  const p = (text: string) => { const el = document.createElement("p"); el.textContent = text; root.append(el); return el; };
  p(c.adaptation.claimed
    ? `Bolsa recebida · ${starterWeapon(c.character.cls)} · Poções: ${c.adaptation.potions}/3 · Rações: ${c.adaptation.rations}/2`
    : `Kit opcional: bolsa, ${starterWeapon(c.character.cls)}, 3 poções (+12 HP) e 2 rações (+4 energia).`);
  p("A arma é equipada automaticamente. Na batalha, cada consumível atende o aliado selecionado e gasta sua ação. O treino usa uma cópia dos itens. A bolsa reúne o kit; não há limite de peso nesta versão.");
  const actions = document.createElement("div"); actions.className = "actions"; root.append(actions);
  const button = (id: string, label: string, run: () => void, target = actions) => {
    const b = document.createElement("button"); b.textContent = label; b.dataset.choice = id; b.onclick = run; target.append(b); return b;
  };
  if (!c.adaptation.claimed) button("kit", "Receber kit de adaptação", () => { if (claimKit(c.adaptation)) changed(); });
  const tutorial = document.createElement("details"); tutorial.className = "mana-tutorial";
  const summary = document.createElement("summary"); summary.textContent = `Exercício de mana · ${c.adaptation.manaStep}/3 etapas`; tutorial.append(summary); root.append(tutorial);
  const text = document.createElement("p");
  text.textContent = c.adaptation.manaStep === 3
    ? `Exercício concluído${c.adaptation.assisted ? " com assistência" : ""}. Perceber, conduzir com suavidade e estabilizar. A energia (EN) alimenta técnicas físicas e mágicas. Você pode reler estas orientações quando quiser.`
    : prompts[c.adaptation.manaStep].text;
  tutorial.append(text);
  const feedback = document.createElement("p"); feedback.setAttribute("role", "status"); tutorial.append(feedback);
  if (c.adaptation.manaStep < 3) {
    const prompt = prompts[c.adaptation.manaStep];
    const choices = document.createElement("div"); choices.className = "actions"; tutorial.append(choices);
    const next = (assisted: boolean) => { if (advanceMana(c.adaptation, assisted)) changed(); };
    // Alternate order so each stage is a deliberate choice.
    const correct = () => button("mana-answer", prompt.answer, () => next(false), choices);
    const other = () => button("mana-other", prompt.other, () => { feedback.textContent = "Não é necessário forçar. Releia a orientação ou use a assistência; não há penalidade."; }, choices);
    if (c.adaptation.manaStep === 1) { other(); correct(); } else { correct(); other(); }
    button("mana-assist", "Concluir esta etapa com assistência", () => next(true), choices);
  }
  const hint = document.createElement("p"); hint.textContent = "Opcional e sem cronômetro. Seguir pela clareira adia o exercício; a etapa atual fica salva. Não concede XP, itens extras ou bônus permanentes."; tutorial.append(hint);
  return root;
}
