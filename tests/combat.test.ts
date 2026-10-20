import { describe, it, expect } from "vitest";
import { Battle } from "../src/game/battle";
import { resolveCombat } from "../src/game/combat";
import { makeUnits, TECHNIQUES, damage } from "../src/game/model";
const create = () =>
  new Battle({ name: "Teste", cls: "Guerreiro", race: "Humano" }, true);
function attack(b: Battle) {
  b.confirm(1, 4);
  b.confirm(1, 4);
  b.openSkills();
  b.chooseSkill(1);
  b.confirm(1, 3);
}
describe("apresentação transacional", () => {
  it("resultado imutável usa o dano da prévia e não modifica unidades", () => {
    const [a, , d] = makeUnits();
    const hp = d.hp;
    const e = resolveCombat(1, a, d, TECHNIQUES.Guerreiro[1]);
    expect(e.damage).toBe(damage(a, d, TECHNIQUES.Guerreiro[1]));
    expect(d.hp).toBe(hp);
    expect(Object.isFrozen(e)).toBe(true);
    expect(Object.isFrozen(e.defender)).toBe(true);
  });
  it("bloqueia entradas, ignora conclusão inválida e aplica custo/dano uma vez", () => {
    const b = create();
    Object.assign(b.units[2], { x: 1, y: 3 });
    attack(b);
    const e = b.pending!;
    const hp = b.units[2].hp,
      ep = b.units[0].ep;
    b.confirm(1, 3);
    b.endTurn();
    b.enemyTurn();
    b.wait();
    b.cancel();
    b.completePresentation(e.id + 1);
    expect(b.phase).toBe("presentation");
    expect(b.pending).toBe(e);
    expect(b.units[2].hp).toBe(hp);
    expect(b.units[0].ep).toBe(ep);
    b.completePresentation(e.id);
    b.completePresentation(e.id);
    expect(b.phase).toBe("idle");
    expect(b.units[0].ep).toBe(ep);
    expect(b.units[0].acted).toBe(true);
  });
  it("aguarda golpe final antes da vitória, mesmo na última ação aliada", () => {
    const b = create();
    b.units[1].acted = true;
    b.units[3].hp = 0;
    Object.assign(b.units[2], { x: 1, y: 3, hp: 1 });
    attack(b);
    expect(b.phase).toBe("presentation");
    expect(b.checkEnd()).toBe(false);
    b.completePresentation(b.pending!.id);
    expect(b.phase).toBe("ended");
    expect(b.turn).toBe(1);
  });
  it("serializa inimigos e só avança rodada após a última apresentação", () => {
    const b = create();
    b.units[0].hp = 100;
    b.units[0].maxHp = 100;
    Object.assign(b.units[2], { x: 1, y: 3 });
    Object.assign(b.units[3], { x: 0, y: 4 });
    b.endTurn();
    b.enemyTurn();
    const first = b.pending!;
    expect(first.attacker.team).toBe("enemy");
    expect(b.turn).toBe(1);
    b.completePresentation(first.id);
    const second = b.pending!;
    expect(second.id).not.toBe(first.id);
    expect(b.turn).toBe(1);
    b.completePresentation(first.id);
    expect(b.pending).toBe(second);
    b.completePresentation(second.id);
    expect(b.turn).toBe(2);
    expect(b.phase).toBe("idle");
  });
  it("aguarda apresentação letal inimiga antes da derrota", () => {
    const b = create();
    b.units[1].hp = 0;
    b.units[0].hp = 1;
    Object.assign(b.units[2], { x: 1, y: 3 });
    b.endTurn();
    b.enemyTurn();
    expect(b.phase).toBe("presentation");
    b.completePresentation(b.pending!.id);
    expect(b.phase).toBe("ended");
  });
});
