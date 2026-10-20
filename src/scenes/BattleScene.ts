import { equipmentLabel } from "../game/equipment";
import { progressLabel } from "../game/progression";
import { finishEncounter, type Campaign } from "../game/campaign";
import { saveCampaign } from "../game/persistence/save";
import Phaser from "phaser";
import { WIDTH, HEIGHT, TERRAIN, reachable } from "../game/model";
const CELL = 48,
  X0 = 48,
  Y0 = 68;
import { Battle, type Character } from "../game/battle";
import { renderBattleUI } from "../ui/battleUI";
export class BattleScene extends Phaser.Scene {
  private battle!: Battle;
  private character!: Character & { campaign?: Campaign; practice?: boolean };
  private savedResult = false;
  private campaignSaveNote = "";
  private timer: Phaser.Time.TimerEvent | null = null;
  private graphics!: Phaser.GameObjects.Graphics;
  private overlay: Phaser.GameObjects.GameObject[] = [];
  private status!: Phaser.GameObjects.Text;
  private cursor = { x: 1, y: 4 };
  constructor() {
    super("Battle");
  }
  init(data: Character & { campaign?: Campaign; practice?: boolean }) {
    this.character = { ...data, ...(data.campaign?.character ?? {}) };
    this.savedResult = false;
    this.campaignSaveNote = "";
    this.battle = new Battle(this.character, true);
    this.cursor = { x: 1, y: 4 };
    this.timer = null;
    this.presenting = null;
  }
  create() {
    this.cameras.main.setBackgroundColor("#152229");
    this.add.text(48, 20, "BASILIS  /  RUÍNAS DA FRONTEIRA", {
      fontFamily: "monospace",
      fontSize: "21px",
      color: "#e5d4a8",
    });
    this.game.canvas.tabIndex = 0;
    this.graphics = this.add.graphics();
    this.status = this.add.text(48, 475, "", {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#e2f0e0",
      wordWrap: { width: 650 },
    });
    this.add.text(
      48,
      550,
      "Clique no tabuleiro · Setas/WASD + Enter · ESC cancela · E encerra o turno",
      { fontSize: "13px", color: "#a4b4ac" },
    );
    this.input.on(
      "pointerdown",
      (
        pointer: Phaser.Input.Pointer,
        over: Phaser.GameObjects.GameObject[],
      ) => {
        if (over.length) return;
        this.game.canvas.focus();
        const x = Math.floor((pointer.x - X0) / CELL),
          y = Math.floor((pointer.y - Y0) / CELL);
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
          this.cursor = { x, y };
          this.battle.confirm(x, y);
          this.redraw();
        }
      },
    );
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) =>
      this.handleKey(event),
    );
    this.events.once("shutdown", () => {
      this.input.keyboard?.off("keydown");
      this.input.off("pointerdown");
      this.timer?.remove();
      if (this.scene.isActive("Combat")) this.scene.stop("Combat");
      document.querySelector("#battle-ui")?.remove();
    });
    this.redraw();
  }
  private presenting: number | null = null;
  private redraw() {
    if (
      this.battle.phase === "ended" &&
      this.character.campaign &&
      !this.character.practice &&
      !this.savedResult
    ) {
      this.savedResult = true;
      const c = this.character.campaign;
      if (finishEncounter(c, this.battle.enemies.length === 0)) {
        this.campaignSaveNote = "Vitória: +3 suprimentos · +100 XP · Nível 2. Salvando checkpoint…";
        void saveCampaign(c).then((ok) => {
          if (!this.scene.isActive()) return;
          this.campaignSaveNote = ok
            ? "Vitória: +3 suprimentos · +100 XP · Nível 2. Checkpoint salvo."
            : "Vitória: +3 suprimentos · +100 XP · Nível 2 nesta sessão; não foi possível salvar.";
          this.redraw();
        });
      }
    }
    if (this.battle.pending) {
      const event = this.battle.pending;
      if (this.presenting !== event.id) {
        this.presenting = event.id;
        document.querySelector("#battle-ui")?.setAttribute("hidden", "");
        this.scene.pause();
        this.scene.launch("Combat", {
          event,
          onComplete: () => {
            this.presenting = null;
            this.battle.completePresentation(event.id);
            this.scene.resume();
            this.redraw();
            this.game.canvas.focus();
          },
        });
      }
      return;
    }
    document.querySelector("#battle-ui")?.removeAttribute("hidden");
    this.graphics.clear();
    this.overlay.forEach((item) => item.destroy());
    this.overlay = [];
    const moves =
      this.battle.phase === "move" && this.battle.selected
        ? reachable(this.battle.selected, this.battle.units)
        : new Set<string>();
    for (let y = 0; y < HEIGHT; y++)
      for (let x = 0; x < WIDTH; x++) {
        const t = TERRAIN[y][x],
          color =
            t === 2
              ? 0x525865
              : t === 1
                ? 0x2e644e
                : (x + y) % 2
                  ? 0x57785e
                  : 0x68886d;
        this.graphics
          .fillStyle(color)
          .fillRect(X0 + x * CELL, Y0 + y * CELL, CELL - 2, CELL - 2);
        if (t === 2) {
          this.graphics
            .fillStyle(0x9d9d9f)
            .fillTriangle(
              X0 + x * CELL + 9,
              Y0 + y * CELL + 37,
              X0 + x * CELL + 25,
              Y0 + y * CELL + 9,
              X0 + x * CELL + 39,
              Y0 + y * CELL + 37,
            );
        }
        if (t === 1) {
          this.graphics
            .fillStyle(0x214d3b)
            .fillCircle(X0 + x * CELL + 22, Y0 + y * CELL + 21, 13);
        }
        if (moves.has(x + "," + y))
          this.graphics
            .fillStyle(0xbadfff, 0.24)
            .fillRect(X0 + x * CELL + 3, Y0 + y * CELL + 3, CELL - 8, CELL - 8);
      }
    if (
      this.battle.phase === "target" &&
      this.battle.selected &&
      this.battle.skill
    ) {
      for (const target of this.battle.enemies)
        if (
          this.battle.canAttack(this.battle.selected, target, this.battle.skill)
        )
          this.graphics
            .lineStyle(4, 0xffbe82)
            .strokeRect(
              X0 + target.x * CELL,
              Y0 + target.y * CELL,
              CELL - 2,
              CELL - 2,
            );
    }
    for (const u of this.battle.units.filter((u) => u.hp > 0)) {
      const cx = X0 + u.x * CELL + 24,
        cy = Y0 + u.y * CELL + 21;
      this.graphics
        .fillStyle(
          u.team === "ally" ? (u.acted ? 0x526782 : 0x3767b9) : 0xa04144,
        )
        .fillCircle(cx, cy, 16);
      this.graphics
        .lineStyle(2, u.team === "ally" ? 0xc0d5ff : 0xf4c4b5)
        .strokeCircle(cx, cy, 16);
      this.graphics.fillStyle(0x222b2b).fillRect(cx - 19, cy + 19, 38, 6);
      this.graphics
        .fillStyle(u.team === "ally" ? 0x8ad77d : 0xeab27b)
        .fillRect(cx - 18, cy + 20, (36 * u.hp) / u.maxHp, 4);
      const label = this.add
        .text(cx, cy, u.cls === "Mago" ? "M" : u.cls === "Ladino" ? "L" : "G", {
          fontFamily: "monospace",
          fontSize: "17px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      this.overlay.push(label);
    }
    this.graphics
      .lineStyle(3, 0xf8d77f)
      .strokeRect(
        X0 + this.cursor.x * CELL + 1,
        Y0 + this.cursor.y * CELL + 1,
        CELL - 4,
        CELL - 4,
      );
    this.status.setText(
      "Turno " +
        this.battle.turn +
        " · " +
        this.battle.units.filter((u) => u.team === "ally" && u.hp > 0).length +
        " aliados / " +
        this.battle.units.filter((u) => u.team === "enemy" && u.hp > 0).length +
        " inimigos\n" +
        this.battle.note,
    );
    renderBattleUI(
      this.battle,
      this.cursor,
      () => this.redraw(),
      () => this.scene.restart(this.character),
      () => this.scene.start("Boot"),
      this.character.campaign
        ? () =>
            this.scene.start("Exploration", {
              campaign: this.character.campaign,
            })
        : undefined,
      this.character.practice ?? false,
    );
    const progress = document.createElement("p");
    progress.textContent = `${this.character.practice ? "TREINO · sem XP ou recompensa · " : ""}${progressLabel(this.character.experience)} · Atributos desta batalha · ${equipmentLabel(this.character.equipment)}`;
    document.querySelector("#battle-ui")?.append(progress);
    if (this.campaignSaveNote) {
      const p = document.createElement("p");
      p.textContent = this.campaignSaveNote;
      document.querySelector("#battle-ui")?.append(p);
    }
    if (this.battle.phase === "enemy" && !this.timer) {
      this.timer = this.time.delayedCall(450, () => {
        this.timer = null;
        this.battle.enemyTurn();
        this.redraw();
      });
    }
  }
  private handleKey(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest("button,input,select")) return;
    if (this.battle.phase === "enemy" || this.battle.phase === "ended") return;
    const map: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      w: [0, -1],
      s: [0, 1],
      a: [-1, 0],
      d: [1, 0],
    };
    const step = map[e.key];
    if (step) {
      e.preventDefault();
      this.cursor.x = Phaser.Math.Clamp(this.cursor.x + step[0], 0, WIDTH - 1);
      this.cursor.y = Phaser.Math.Clamp(this.cursor.y + step[1], 0, HEIGHT - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.battle.confirm(this.cursor.x, this.cursor.y);
    } else if (e.key === "Escape") this.battle.cancel();
    else if (e.key.toLowerCase() === "e") this.battle.endTurn();
    this.redraw();
  }
}
