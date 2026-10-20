import { characterSheet } from "../ui/characterSheet";
import Phaser from "phaser";
import {
  restAtCamp,
  moveExplorer,
  near,
  passable,
  type Campaign,
} from "../game/campaign";
import { saveCampaign } from "../game/persistence/save";
export class ExplorationScene extends Phaser.Scene {
  private campaign!: Campaign;
  private g!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private panel!: HTMLElement;
  private message = "O ar é desconhecido. Uma viajante acena perto da trilha.";
  private saveMessage = "Salvando checkpoint…";
  private revision = 0;
  constructor() {
    super("Exploration");
  }
  init(data: { campaign: Campaign }) {
    this.campaign = data.campaign;
    this.message = this.campaign.expeditionComplete
      ? "A expedição está concluída. O abrigo recebe o grupo."
      : this.campaign.passageCleared
        ? "A passagem está segura. Volte ao acampamento."
        : "O ar é desconhecido. Uma viajante acena perto da trilha.";
    this.saveMessage = "Salvando checkpoint…";
  }
  create() {
    this.cameras.main.setBackgroundColor("#122129");
    this.g = this.add.graphics();
    this.panel = document.createElement("section");
    this.panel.id = "exploration-ui";
    this.panel.setAttribute("aria-label", "Exploração");
    document.querySelector("#app")!.append(this.panel);
    this.game.canvas.tabIndex = 0;
    this.input.keyboard?.on("keydown", (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("button,input,select")) return;
      const steps: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        w: [0, -1],
        ArrowDown: [0, 1],
        s: [0, 1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
      };
      if (steps[e.key]) {
        e.preventDefault();
        this.move(...steps[e.key]);
      }
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.game.canvas.focus();
      const x = Math.floor((p.x - 64) / 80),
        y = Math.floor((p.y - 55) / 72);
      const dx = x - this.campaign.position.x,
        dy = y - this.campaign.position.y;
      if (Math.abs(dx) + Math.abs(dy) === 1) this.move(dx, dy);
      else {
        this.message =
          "Clique em uma casa vizinha ou use os botões de direção.";
        this.draw();
      }
    });
    this.events.once("shutdown", () => {
      this.revision++;
      this.input.keyboard?.off("keydown");
      this.input.off("pointerdown");
      this.panel.remove();
    });
    this.draw();
    this.persist();
  }
  private persist() {
    const revision = ++this.revision;
    this.saveMessage = "Salvando checkpoint…";
    void saveCampaign(this.campaign).then((ok) => {
      if (revision !== this.revision || !this.scene.isActive()) return;
      this.saveMessage = ok
        ? "Checkpoint salvo neste navegador."
        : "Não foi possível salvar. Seu progresso atual continua nesta sessão.";
      this.draw();
    });
  }
  private move(dx: number, dy: number) {
    if (moveExplorer(this.campaign, dx, dy)) {
      this.message = "Você segue pela trilha.";
      this.persist();
    } else this.message = "O caminho está bloqueado.";
    this.draw();
  }
  private draw() {
    const c = this.campaign;
    this.g.clear();
    this.labels.forEach((t) => t.destroy());
    this.labels = [];
    const text = (x: number, y: number, label: string, size = 17) =>
      this.labels.push(
        this.add.text(x, y, label, {
          fontSize: `${size}px`,
          color: "#efebd3",
          wordWrap: { width: 640 },
        }),
      );
    text(64, 18, "BASILIS / CLAREIRA DA OUTRA MARGEM", 21);
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 8; x++)
        this.g
          .fillStyle(
            passable(x, y) ? ((x + y) % 2 ? 0x476953 : 0x54765d) : 0x243e39,
          )
          .fillRect(64 + x * 80, 55 + y * 72, 78, 70);
    text(64 + 2 * 80 + 10, 55 + 3 * 72 + 24, "Lyra");
    text(
      64 + 6 * 80 + 3,
      55 + 2 * 72 + 22,
      c.passageCleared ? "Livre" : "Ruínas",
      15,
    );
    text(64 + 1 * 80 + 2, 55 + 5 * 72 + 23, "Abrigo", 15);
    const px = 104 + c.position.x * 80,
      py = 91 + c.position.y * 72;
    this.g.fillStyle(0x7db3e2).fillCircle(px, py, 18);
    text(px - 5, py - 10, "◆");
    text(
      64,
      510,
      "Clique na casa vizinha · Setas/WASD · Converse perto de Lyra",
      15,
    );
    const sheetOpen = this.panel.querySelector<HTMLDetailsElement>(".traveler-sheet")?.open ?? false;
    const scrollTop = this.panel.scrollTop;
    const focused = document.activeElement?.getAttribute("data-action");
    this.panel.replaceChildren();
    const h = document.createElement("h2");
    h.textContent = "A outra margem";
    this.panel.append(h);
    const p = (value: string, role?: string) => {
      const el = document.createElement("p");
      el.textContent = value;
      if (role) el.setAttribute("role", role);
      this.panel.append(el);
      return el;
    };
    p("Uma trilha entre árvores desconhecidas.").className = "scene-intro";
    p(
      `${c.character.name} · ${c.character.race} · ${c.character.cls}`,
    ).className = "profile";
    p(
      c.expeditionComplete
        ? "Expedição concluída. A passagem está livre e o grupo tem um abrigo."
        : c.passageCleared
          ? "Objetivo: retorne ao abrigo para concluir a expedição."
          : c.metLyra
            ? "Objetivo: alcance as ruínas e proteja a passagem."
            : "Objetivo: aproxime-se de Lyra e converse.",
    );
    p(this.message, "status");
    p(this.saveMessage).className = "save-status";
    p(
      `Suprimentos: ${c.supplies} · Posição ${c.position.x + 1}, ${c.position.y + 1}`,
    );
    const actions = document.createElement("div");
    actions.className = "actions";
    this.panel.append(actions);
    const button = (
      id: string,
      label: string,
      fn: () => void,
      disabled = false,
    ) => {
      const b = document.createElement("button");
      b.dataset.action = id;
      b.textContent = label;
      b.disabled = disabled;
      b.onclick = fn;
      actions.append(b);
    };
    for (const [id, label, dx, dy] of [
      ["up", "↑ Norte", 0, -1],
      ["left", "← Oeste", -1, 0],
      ["right", "Leste →", 1, 0],
      ["down", "↓ Sul", 0, 1],
    ] as const)
      button(id, label, () => this.move(dx, dy));
    button(
      "talk",
      "Conversar com Lyra",
      () => {
        c.metLyra = true;

        this.message = c.passageCleared
          ? "Lyra: A trilha está livre. Estes suprimentos vão nos ajudar no abrigo."
          : "Lyra: Há saqueadores nas ruínas além da abertura entre as árvores. Posso lutar ao seu lado. Quando estiver pronto, encontre a passagem.";
        this.persist();
        this.draw();
      },
      !near(c, 2, 3),
    );
    button(
      "battle",
      c.passageCleared ? "Passagem liberada" : "Entrar nas ruínas",
      () => {
        this.scene.start("Battle", { ...c.character, campaign: c });
      },
      !c.metLyra || c.passageCleared || !near(c, 6, 2),
    );
    button(
      "camp",
      "Descansar no abrigo",
      () => {
        restAtCamp(c);
        this.message = c.passageCleared
          ? "Expedição concluída. A passagem está livre e o grupo tem um lugar para descansar. A jornada continua em versões futuras."
          : "Um abrigo simples oferece descanso. Lyra aguarda perto da trilha.";
        this.persist();
        this.draw();
      },
      !near(c, 1, 5),
    );
    button("save", "Salvar checkpoint", () => {
      this.persist();
      this.draw();
    });
    button("menu", "Voltar ao menu", () => this.scene.start("Boot"));
    const sheet = document.createElement("details");
    sheet.className = "traveler-sheet";
    sheet.open = sheetOpen;
    const summary = document.createElement("summary");
    summary.textContent = "Ficha do viajante";
    summary.dataset.action = "sheet";
    sheet.append(summary, characterSheet(c.character.cls, c.character.race));
    this.panel.append(sheet);
    if (focused)
      this.panel
        .querySelector<HTMLElement>(`[data-action="${focused}"]`)
        ?.focus({ preventScroll: true });
    this.panel.scrollTop = scrollTop;
  }
}
