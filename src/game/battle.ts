import {
  damage,
  dist,
  makeUnits,
  reachable,
  TECHNIQUES,
  type Technique,
  type Unit,
  type UnitClass,
} from "./model";

export type Phase =
  | "idle"
  | "move"
  | "action"
  | "skills"
  | "target"
  | "enemy"
  | "ended";
export type Character = { name: string; cls: UnitClass; race: string };
/** Rules and turn transitions are independent of Phaser and rendering. */
export class Battle {
  units: Unit[];
  phase: Phase = "idle";
  selected: Unit | null = null;
  skill: Technique | null = null;
  turn = 1;
  note = "Selecione um aliado azul disponível.";
  log: string[] = [];
  private origin: { x: number; y: number } | null = null;

  constructor(character: Character) {
    this.units = makeUnits(character.name, character.cls);
  }
  say(message: string) {
    this.note = message;
    this.log = [...this.log.slice(-5), message];
  }
  get allies() {
    return this.units.filter((u) => u.team === "ally" && u.hp > 0);
  }
  get enemies() {
    return this.units.filter((u) => u.team === "enemy" && u.hp > 0);
  }
  checkEnd() {
    if (!this.enemies.length || !this.allies.length) {
      this.phase = "ended";
      this.selected = null;
      this.skill = null;
      this.say(
        !this.enemies.length
          ? "VITÓRIA! A passagem está segura."
          : "DERROTA. A expedição terminou.",
      );
      return true;
    }
    return false;
  }
  confirm(x: number, y: number) {
    if (this.phase === "idle") {
      const unit = this.allies.find((u) => !u.acted && u.x === x && u.y === y);
      if (!unit) return this.say("Selecione um aliado disponível.");
      this.selected = unit;
      this.origin = { x, y };
      this.phase = "move";
      this.say("Escolha uma posição azul; a posição atual também vale.");
    } else if (this.phase === "move" && this.selected) {
      if (!reachable(this.selected, this.units).has(`${x},${y}`))
        return this.say("Posição bloqueada ou fora do alcance.");
      this.selected.x = x;
      this.selected.y = y;
      this.phase = "action";
      this.say("Escolha Técnicas ou Esperar.");
    } else if (this.phase === "target" && this.selected && this.skill) {
      const target = this.enemies.find((u) => u.x === x && u.y === y);
      if (!target || !this.canAttack(this.selected, target, this.skill))
        return this.say("Alvo inválido ou fora do alcance.");
      this.attack(this.selected, target, this.skill);
      this.finish();
    }
  }
  canAttack(unit: Unit, target: Unit, skill: Technique) {
    return (
      unit.hp > 0 &&
      target.hp > 0 &&
      unit.team !== target.team &&
      unit.ep >= skill.cost &&
      dist(unit, target) <= skill.range
    );
  }
  chooseSkill(index: number) {
    if (this.phase !== "skills" || !this.selected) return;
    const skill = TECHNIQUES[this.selected.cls][index];
    if (!skill || this.selected.ep < skill.cost)
      return this.say("Energia insuficiente.");
    this.skill = skill;
    this.phase = "target";
    this.say(
      `${skill.name}: selecione um inimigo destacado (alcance ${skill.range}).`,
    );
  }
  openSkills() {
    if (this.phase === "action") this.phase = "skills";
  }
  cancel() {
    if (this.phase === "action" || this.phase === "move") {
      if (this.selected && this.origin)
        Object.assign(this.selected, this.origin);
      this.phase = "idle";
      this.selected = null;
      this.skill = null;
      this.origin = null;
    } else if (this.phase === "skills") this.phase = "action";
    else if (this.phase === "target") {
      this.phase = "skills";
      this.skill = null;
    } else return;
    this.say("Ação cancelada. Movimento só é confirmado ao atacar ou esperar.");
  }
  wait() {
    if (this.phase === "action") {
      this.say(`${this.selected?.name} aguardou.`);
      this.finish();
    }
  }
  private finish() {
    if (this.selected) this.selected.acted = true;
    this.selected = null;
    this.skill = null;
    this.origin = null;
    if (this.checkEnd()) return;
    this.phase = "idle";
    if (this.allies.every((u) => u.acted)) this.endTurn();
  }
  endTurn() {
    if (this.phase !== "idle" || this.checkEnd()) return;
    this.phase = "enemy";
    this.say("Os inimigos estão agindo...");
  }
  private attack(unit: Unit, target: Unit, skill: Technique) {
    const dealt = damage(unit, target, skill);
    target.hp = Math.max(0, target.hp - dealt);
    unit.ep -= skill.cost;
    this.say(
      `${unit.name} usou ${skill.name}: ${dealt} de dano em ${target.name}${target.hp === 0 ? " (derrotado)" : ""}.`,
    );
  }
  enemyTurn() {
    // A stale callback cannot advance an ended battle.
    if (this.phase !== "enemy" || this.checkEnd()) return;
    for (const enemy of this.enemies) {
      const target = [...this.allies].sort(
        (a, b) => dist(a, enemy) - dist(b, enemy),
      )[0];
      if (!target) break;
      const skills = TECHNIQUES[enemy.cls].filter((t) => enemy.ep >= t.cost);
      const positions = [...reachable(enemy, this.units)].map((key) => {
        const [x, y] = key.split(",").map(Number);
        return { x, y };
      });
      positions.sort((a, b) => {
        const canA = skills.some((t) => dist(a, target) <= t.range);
        const canB = skills.some((t) => dist(b, target) <= t.range);
        return (
          Number(canB) - Number(canA) ||
          dist(a, enemy) - dist(b, enemy) ||
          dist(a, target) - dist(b, target)
        );
      });
      const attacking = positions.find((p) =>
        skills.some((t) => dist(p, target) <= t.range),
      );
      const next =
        attacking ??
        positions.sort((a, b) => dist(a, target) - dist(b, target))[0];
      if (next) Object.assign(enemy, next);
      const skill = skills.find((t) => this.canAttack(enemy, target, t));
      if (skill) this.attack(enemy, target, skill);
      if (this.checkEnd()) return;
    }
    for (const unit of this.units.filter((u) => u.hp > 0)) {
      unit.acted = false;
      unit.ep = Math.min(unit.maxEp, unit.ep + 2);
    }
    this.turn++;
    this.phase = "idle";
    this.say("Seu turno. Energia +2. Selecione um aliado.");
  }
}
