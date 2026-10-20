import { describe, expect, it } from "vitest";
import { Battle } from "../src/game/battle";
import { TECHNIQUES, reachable } from "../src/game/model";
const create = () =>
  new Battle({ name: "Felipe", cls: "Guerreiro", race: "Humano" });
describe("regras e regressões de combate", () => {
  it("desfaz movimento cancelado e impede movimento infinito", () => {
    const b = create();
    b.confirm(1, 4);
    b.confirm(1, 3);
    expect(b.selected?.y).toBe(3);
    b.cancel();
    expect(b.units[0].y).toBe(4);
    b.confirm(1, 4);
    expect(reachable(b.selected!, b.units).has("1,0")).toBe(true);
  });
  it("não permite atacar ou esperar durante movimento", () => {
    const b = create();
    b.confirm(1, 4);
    b.wait();
    b.chooseSkill(0);
    expect(b.phase).toBe("move");
    expect(b.units[0].acted).toBe(false);
  });
  it("bloqueia rochas, energia insuficiente e alvo inválido sem gastar ação", () => {
    const b = create();
    b.confirm(1, 4);
    b.confirm(2, 4);
    expect(b.phase).toBe("move");
    b.confirm(1, 4);
    b.openSkills();
    b.selected!.ep = 0;
    b.chooseSkill(1);
    expect(b.phase).toBe("skills");
    b.chooseSkill(0);
    b.confirm(9, 2);
    expect(b.phase).toBe("target");
    expect(b.selected!.acted).toBe(false);
  });
  it("resolve vitória antes de agendar inimigos e ignora callback atrasado", () => {
    const b = create();
    b.units[1].acted = true;
    b.units[3].hp = 0;
    Object.assign(b.units[2], { x: 1, y: 3, hp: 1 });
    b.confirm(1, 4);
    b.confirm(1, 4);
    b.openSkills();
    b.chooseSkill(0);
    b.confirm(1, 3);
    expect(b.phase).toBe("ended");
    const hp = b.units[0].hp;
    b.enemyTurn();
    expect(b.phase).toBe("ended");
    expect(b.units[0].hp).toBe(hp);
    expect(b.turn).toBe(1);
  });
  it("fecha rodada, recupera energia sem ultrapassar máximo e reseta ações", () => {
    const b = create();
    b.units[0].ep = 0;
    for (const u of b.allies) {
      b.confirm(u.x, u.y);
      b.confirm(u.x, u.y);
      b.wait();
    }
    expect(b.phase).toBe("enemy");
    b.enemyTurn();
    expect(b.turn).toBe(2);
    expect(b.units[0].ep).toBe(2);
    expect(b.allies.every((u) => !u.acted && u.ep <= u.maxEp)).toBe(true);
  });
  it("inimigo usa alcance da técnica e consome energia", () => {
    const b = create();
    const e = b.units[2];
    e.cls = "Mago";
    e.ep = 10;
    e.magic = 10;
    e.move = 0;
    e.x = 4;
    e.y = 4;
    b.units[3].hp = 0;
    b.endTurn();
    const hp = b.units[0].hp;
    b.enemyTurn();
    expect(b.units[0].hp).toBeLessThan(hp);
    expect(e.ep).toBe(8);
  });
  it("derrota encerra a rodada sem regenerar ou avançar turno", () => {
    const b = create();
    b.units[1].hp = 0;
    b.units[0].hp = 1;
    Object.assign(b.units[2], { x: 1, y: 3 });
    b.endTurn();
    b.enemyTurn();
    expect(b.phase).toBe("ended");
    expect(b.turn).toBe(1);
  });
  for (const cls of ["Guerreiro", "Mago", "Ladino"] as const)
    it(`permite concluir encontro como ${cls}`, () => {
      const b = new Battle({ name: "Viajante", cls, race: "Elfo" });
      for (let round = 0; round < 60 && b.phase !== "ended"; round++) {
        for (const unit of [...b.allies]) {
          if (b.phase !== "idle") break;
          const target = [...b.enemies].sort((a, c) => a.hp - c.hp)[0];
          if (!target) break;
          const skills = TECHNIQUES[unit.cls].filter((s) => s.cost <= unit.ep);
          const positions = [...reachable(unit, b.units)].map((k) =>
            k.split(",").map(Number),
          );
          positions.sort(
            (a, c) =>
              Math.abs(a[0] - target.x) +
              Math.abs(a[1] - target.y) -
              Math.abs(c[0] - target.x) -
              Math.abs(c[1] - target.y),
          );
          b.confirm(unit.x, unit.y);
          b.confirm(positions[0][0], positions[0][1]);
          b.openSkills();
          const skill = [...skills]
            .sort((a, c) => c.power - a.power)
            .find((s) => b.canAttack(unit, target, s));
          if (skill) {
            b.chooseSkill(TECHNIQUES[unit.cls].indexOf(skill));
            b.confirm(target.x, target.y);
          } else {
            b.cancel();
            b.wait();
          }
        }
        if (b.phase === "idle") b.endTurn();
        b.enemyTurn();
      }
      expect(b.phase).toBe("ended");
      expect(b.enemies).toHaveLength(0);
    });
});
