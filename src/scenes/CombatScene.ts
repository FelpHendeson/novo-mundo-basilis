import Phaser from "phaser";
import type { CombatEvent } from "../game/combat";

type CombatData = { event: CombatEvent; onComplete: () => void };
/** An audiovisual projection of an already committed immutable result. */
export class CombatScene extends Phaser.Scene {
  private combatData!: CombatData;
  private elapsed = 0;
  private speed = 1;
  private done = false;
  private impacted = false;
  private actor!: Phaser.GameObjects.Container;
  private target!: Phaser.GameObjects.Container;
  private effect!: Phaser.GameObjects.Graphics;
  private bars!: Phaser.GameObjects.Graphics;
  private hp!: Phaser.GameObjects.Text;
  private hit!: Phaser.GameObjects.Text;
  private controls: HTMLElement | null = null;
  constructor() {
    super("Combat");
  }
  init(data: CombatData) {
    this.combatData = data;
    this.elapsed = 0;
    this.speed = 1;
    this.done = false;
    this.impacted = false;
  }
  create() {
    const e = this.combatData.event;
    this.cameras.main.setBackgroundColor("#101d2c");
    const g = this.add.graphics();
    g.fillStyle(0x1c3440).fillRect(0, 230, 768, 346);
    g.fillStyle(0x354c48).fillEllipse(384, 450, 1000, 190);
    for (let i = 0; i < 8; i++)
      g.fillStyle(0x223d3d).fillTriangle(
        i * 115 - 40,
        365,
        i * 115 + 30,
        150 + (i % 3) * 30,
        i * 115 + 110,
        365,
      );
    this.add
      .text(384, 40, e.technique.name, {
        fontFamily: "Georgia",
        fontSize: "32px",
        color: "#f4dda5",
      })
      .setOrigin(0.5);
    this.add
      .text(
        384,
        82,
        e.attacker.team === "ally" ? "AÇÃO ALIADA" : "AÇÃO INIMIGA",
        { fontSize: "15px", color: "#b7d9c1" },
      )
      .setOrigin(0.5);
    this.actor = this.fighter(
      190,
      375,
      e.attacker.id === "creature" ? "creature" : e.attacker.cls,
      e.attacker.team === "ally" ? 0x629de0 : 0xc66a69,
      1,
    );
    this.target = this.fighter(
      570,
      375,
      e.defender.id === "creature" ? "creature" : e.defender.cls,
      e.defender.team === "ally" ? 0x629de0 : 0xc66a69,
      -1,
    );
    this.add.text(
      140,
      480,
      `${e.attacker.name}\nHP ${e.attacker.hp}/${e.attacker.maxHp}\nEN ${e.attacker.ep} → ${e.epAfter}`,
      { fontSize: "19px", color: "#e3ebdf" },
    );
    this.hp = this.add.text(
      520,
      480,
      `${e.defender.name}\nHP ${e.defender.hp}/${e.defender.maxHp}`,
      { fontSize: "19px", color: "#e3ebdf" },
    );
    this.hit = this.add
      .text(570, 225, "", { fontSize: "38px", color: "#ffe1aa" })
      .setOrigin(0.5);
    this.effect = this.add.graphics();
    this.bars = this.add.graphics();
    this.drawBars(e.defender.hp);
    const root = document.createElement("section");
    root.id = "combat-ui";
    root.setAttribute("aria-label", "Cena de combate");
    const title = document.createElement("h2");
    title.textContent = "Confronto";
    root.append(title);
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = `${e.attacker.name} usa ${e.technique.name} contra ${e.defender.name}.`;
    root.append(status);
    const speed = document.createElement("button");
    speed.textContent = "Acelerar · 1×";
    speed.onclick = () => {
      this.speed = this.speed === 1 ? 3 : 1;
      speed.textContent = `Acelerar · ${this.speed}×`;
    };
    root.append(speed);
    const skip = document.createElement("button");
    skip.textContent = "Pular animação";
    skip.onclick = () => this.finish();
    root.append(skip);
    const help = document.createElement("p");
    help.textContent =
      "Acompanhe o confronto em 1× ou 3×, ou pule para voltar ao tabuleiro.";
    root.append(help);
    document.querySelector("#app")!.append(root);
    this.controls = root;
    skip.focus();
    this.events.once("shutdown", () => {
      this.controls?.remove();
      this.controls = null;
    });
  }
  private fighter(
    x: number,
    y: number,
    cls: string,
    color: number,
    facing: number,
  ) {
    const body = this.add.graphics();
    body.fillStyle(0x0a151a, 0.5).fillEllipse(0, 65, 100, 24);
    if (cls === "creature") {
      body.fillStyle(0x8d8265).fillRect(-48, -10, 96, 42).fillRect(32, -24, 40, 34);
      body.fillStyle(0x68634f).fillRect(-38, 28, 14, 36).fillRect(24, 28, 14, 36);
      body.fillStyle(0x343c31).fillTriangle(38, -20, 48, -44, 58, -20);
      body.fillStyle(0xd3b46f).fillRect(56, -15, 5, 5);
      return this.add.container(x, y, [body]).setScale(facing, 1);
    }
    body.fillStyle(color).fillRect(-25, -20, 50, 70);
    body.fillStyle(0xd9b991).fillCircle(0, -45, 22);
    body.fillStyle(0x182932).fillRect(-22, 45, 17, 24).fillRect(5, 45, 17, 24);
    if (cls === "Mago") {
      body.fillStyle(0xb6a4ef).fillTriangle(-32, -58, 0, -112, 32, -58);
      body.lineStyle(7, 0xd6b67a).lineBetween(42, -55, 42, 60);
    } else {
      body
        .lineStyle(cls === "Ladino" ? 7 : 12, 0xdfe4dc)
        .lineBetween(40, -45, 40, 35);
    }
    return this.add.container(x, y, [body]).setScale(facing, 1);
  }
  update(_time: number, delta: number) {
    if (this.done) return;
    this.elapsed += Math.min(delta, 100) * this.speed;
    const e = this.combatData.event,
      physical = e.technique.kind === "physical" && e.technique.range === 1;
    const progress = Phaser.Math.Clamp((this.elapsed - 350) / 650, 0, 1);
    this.effect.clear();
    if (physical) this.actor.x = 190 + Math.sin(progress * Math.PI) * 240;
    else if (progress > 0 && progress < 1) {
      this.effect
        .fillStyle(e.technique.kind === "magic" ? 0xc9a3ff : 0xf0e1bb)
        .fillCircle(
          220 + progress * 340,
          320,
          e.technique.kind === "magic" ? 19 : 7,
        );
    }
    if (this.elapsed >= 1000 && !this.impacted) {
      this.impacted = true;
      this.drawBars(e.hpAfter);
      this.hp.setText(
        `${e.defender.name}\nHP ${e.hpAfter}/${e.defender.maxHp}`,
      );
      this.hit.setText(`−${e.damage}`);
      this.cameras.main.shake(120, 0.006);
    }
    if (this.impacted) {
      this.target.alpha =
        e.hpAfter === 0 ? Math.max(0, 1 - (this.elapsed - 1100) / 600) : 1;
      this.hit.y = 225 - Math.max(0, this.elapsed - 1000) / 35;
    }
    if (this.elapsed >= 2100) this.finish();
  }
  private drawBars(hp: number) {
    const e = this.combatData.event;
    this.bars
      .clear()
      .fillStyle(0x101a22)
      .fillRect(140, 463, 150, 10)
      .fillRect(520, 463, 150, 10);
    this.bars
      .fillStyle(0x88c996)
      .fillRect(140, 463, (150 * e.attacker.hp) / e.attacker.maxHp, 10);
    this.bars
      .fillStyle(0xe6ac83)
      .fillRect(520, 463, (150 * hp) / e.defender.maxHp, 10);
  }
  private finish() {
    if (this.done) return;
    this.done = true;
    const complete = this.combatData.onComplete;
    this.scene.stop();
    complete();
  }
}
