import { Battle } from "../game/battle";
import { damage, TECHNIQUES, WIDTH, HEIGHT, TERRAIN } from "../game/model";

export function renderBattleUI(
  battle: Battle,
  cursor: { x: number; y: number },
  refresh: () => void,
  restart: () => void,
  creation: () => void,
  returnToMap?: () => void,
  practice = false,
  itemUsed?: () => void,
) {
  let root = document.querySelector<HTMLElement>("#battle-ui");
  if (!root) {
    root = document.createElement("section");
    root.id = "battle-ui";
    root.setAttribute("aria-label", "Comandos da batalha");
    document.querySelector("#app")!.append(root);
  }
  const scrollTop = root.scrollTop;
  const guideOpen = root.querySelector("details")?.open ?? false;
  const focused = document.activeElement?.getAttribute("data-action");
  root.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = `Ruínas da Fronteira · Turno ${battle.turn}`;
  root.append(title);
  const goal = document.createElement("p");
  goal.textContent =
    "Objetivo: derrote os dois saqueadores. Floresta: movimento 2 e proteção +2. Rochas: bloqueadas.";
  const guide = document.createElement("details");
  guide.open = guideOpen;
  const summary = document.createElement("summary");
  summary.textContent = "Objetivo, terreno e histórico";
  guide.append(summary, goal);
  const note = document.createElement("p");
  note.className = "notice";
  note.setAttribute("role", "status");
  note.textContent = battle.note;
  root.append(note);
  const unit =
    battle.selected ??
    battle.units.find((u) => u.hp > 0 && u.x === cursor.x && u.y === cursor.y);
  if (unit) {
    const info = document.createElement("p");
    info.textContent = `${unit.name} · ${unit.cls} · HP ${unit.hp}/${unit.maxHp} · EN ${unit.ep}/${unit.maxEp} · Ataque ${unit.attack} · Magia ${unit.magic} · Defesa ${unit.defense} · Movimento ${unit.move}${unit.acted ? " · Já agiu" : ""}`;
    root.append(info);
  }
  const actions = document.createElement("div");
  actions.className = "actions";
  root.append(actions);
  if (battle.phase === "move") {
    const nav = document.createElement("div");
    nav.className = "touch-cursor";
    nav.setAttribute("aria-label", "Mover cursor no tabuleiro");
    const current = document.createElement("p");
    const terrain = TERRAIN[cursor.y][cursor.x];
    current.textContent = `Casa ${cursor.x + 1}, ${cursor.y + 1} · ${terrain === 2 ? "rocha" : terrain === 1 ? "floresta" : "grama"}`;
    nav.append(current);
    for (const [id, label, dx, dy] of [
      ["north", "↑ Cursor", 0, -1],
      ["west", "← Cursor", -1, 0],
      ["east", "Cursor →", 1, 0],
      ["south", "↓ Cursor", 0, 1],
    ] as const) {
      const b = document.createElement("button");
      b.dataset.action = id;
      b.textContent = label;
      b.onclick = () => {
        cursor.x = Math.max(0, Math.min(WIDTH - 1, cursor.x + dx));
        cursor.y = Math.max(0, Math.min(HEIGHT - 1, cursor.y + dy));
        refresh();
      };
      nav.append(b);
    }
    const confirm = document.createElement("button");
    confirm.dataset.action = "position";
    confirm.textContent = "Confirmar posição";
    confirm.onclick = () => {
      battle.confirm(cursor.x, cursor.y);
      refresh();
    };
    nav.append(confirm);
    root.append(nav);
  }
  const button = (
    id: string,
    label: string,
    run: () => void,
    disabled = false,
  ) => {
    const el = document.createElement("button");
    el.dataset.action = id;
    el.textContent = label;
    el.disabled = disabled;
    el.onclick = () => {
      run();
      refresh();
    };
    actions.append(el);
  };
  if (battle.phase === "action") {
    button("skills", "Técnicas", () => battle.openSkills());
    button("wait", "Esperar", () => battle.wait());
    if (battle.adaptation?.claimed) {
      for (const item of ["potions", "rations"] as const)
        button(item, `${item === "potions" ? "Poção +12 HP" : "Ração +4 EN"} · ${battle.adaptation[item]} · usa ação${practice ? " · treino" : ""}`, () => {
          if (battle.useItem(item)) itemUsed?.();
        }, !battle.canUseItem(item));
    }
  }
  if (battle.phase === "skills" && battle.selected) {
    TECHNIQUES[battle.selected.cls].forEach((skill, i) =>
      button(
        `skill-${i}`,
        `${skill.name} · ${skill.cost} EN · alcance ${skill.range}`,
        () => battle.chooseSkill(i),
        battle.selected!.ep < skill.cost,
      ),
    );
  }
  if (battle.phase === "target" && battle.selected && battle.skill) {
    for (const target of battle.enemies) {
      const valid = battle.canAttack(battle.selected, target, battle.skill);
      button(
        `target-${target.id}`,
        `${target.name} · ${valid ? damage(battle.selected, target, battle.skill) + " de dano" : "fora do alcance"}`,
        () => battle.confirm(target.x, target.y),
        !valid,
      );
    }
  }
  if (["move", "action", "skills", "target"].includes(battle.phase))
    button("cancel", "Voltar / cancelar", () => battle.cancel());
  if (battle.phase === "idle")
    button("end", "Encerrar turno [E]", () => battle.endTurn());
  if (battle.phase === "ended") {
    button("restart", "Repetir batalha", restart);
    if (returnToMap) button("map", "Voltar à exploração", returnToMap);
    else button("character", "Criar personagem", creation);
  }
  if (practice && returnToMap && battle.phase !== "ended")
    button("leave-training", "Sair do treino", returnToMap, battle.phase === "enemy" || battle.phase === "presentation");
  const roster = document.createElement("div");
  roster.className = "roster";
  for (const ally of battle.allies) {
    const el = document.createElement("button");
    el.textContent = `${ally.name} · HP ${ally.hp}/${ally.maxHp} · EN ${ally.ep}/${ally.maxEp}${ally.acted ? " · agiu" : ""}`;
    el.disabled = battle.phase !== "idle" || ally.acted;
    el.onclick = () => {
      cursor.x = ally.x;
      cursor.y = ally.y;
      battle.confirm(ally.x, ally.y);
      refresh();
    };
    roster.append(el);
  }
  root.append(roster);
  const history = document.createElement("ol");
  history.setAttribute("aria-label", "Histórico de combate");
  for (const item of battle.log) {
    const li = document.createElement("li");
    li.textContent = item;
    history.append(li);
  }
  guide.append(history);
  root.append(guide);
  if (focused)
    root
      .querySelector<HTMLButtonElement>(`[data-action="${focused}"]`)
      ?.focus({ preventScroll: true });
  root.scrollTop = scrollTop;
}
