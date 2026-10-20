import { BASE_COST, near, trainingCharacter, type Campaign } from "../game/campaign";

export function basePanel(c: Campaign, actions: { prepare: () => void; recruit: () => void; toggle: () => void; train: () => void }): HTMLDetailsElement {
  const root = document.createElement("details");
  root.className = "base-panel";
  const summary = document.createElement("summary");
  summary.textContent = "Base e equipe";
  summary.dataset.action = "base";
  root.append(summary);
  const p = (text: string) => { const el = document.createElement("p"); el.textContent = text; root.append(el); };
  p(`Abrigo: ${c.base.prepared ? "base preparada" : "improvisado"} · Suprimentos: ${c.supplies}. Preparar custa ${BASE_COST}, uma única vez, perto do abrigo após a vitória.`);
  p(c.base.lyraRecruited ? `Lyra recrutada · ${c.base.lyraDeployed ? "na equipe" : "na reserva"}. Formação de treino: viajante${c.base.lyraDeployed ? " + Lyra" : " sozinho"}.` : "Lyra ainda não foi recrutada. Prepare a base e convide-a perto da trilha. Na primeira batalha ela acompanha temporariamente.");
  const buttons = document.createElement("div");
  buttons.className = "roster";
  const button = (id: string, text: string, run: () => void, disabled: boolean) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.action = id; b.textContent = text; b.onclick = run; b.disabled = disabled; buttons.append(b);
  };
  button("prepare-base", c.base.prepared ? "Base preparada" : `Preparar base · ${BASE_COST} suprimentos`, actions.prepare, c.base.prepared || !c.passageCleared || !near(c, 1, 5) || c.supplies < BASE_COST);
  button("recruit-lyra", c.base.lyraRecruited ? "Lyra recrutada" : "Convidar Lyra para a equipe", actions.recruit, c.base.lyraRecruited || !c.base.prepared || !c.metLyra || !near(c, 2, 3));
  button("toggle-lyra", c.base.lyraDeployed ? "Deixar Lyra na reserva" : "Colocar Lyra na equipe", actions.toggle, !c.base.lyraRecruited || !near(c, 1, 5));
  button("train", "Treinar com a formação · sem recompensa", actions.train, trainingCharacter(c) === null);
  root.append(buttons);
  p("Formação alterada somente junto ao abrigo; viajante sempre participa. Treino reutiliza o tabuleiro das ruínas e não dá XP, suprimentos ou ferimentos persistentes. Base e recrutamento usam conteúdo provisório.");
  return root;
}
