import Phaser from "phaser";
import type { UnitClass } from "../game/model";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }
  create() {
    this.cameras.main.setBackgroundColor("#122129");
    this.add
      .text(384, 150, "NOVO MUNDO", {
        fontFamily: "Georgia",
        fontSize: "42px",
        color: "#e5d4a8",
      })
      .setOrigin(0.5);
    this.add
      .text(384, 220, "B A S I L I S", {
        fontFamily: "Georgia",
        fontSize: "30px",
        color: "#b7d9c1",
      })
      .setOrigin(0.5);
    this.add
      .text(384, 315, "Uma pessoa da Terra. Uma margem desconhecida.", {
        fontSize: "19px",
        color: "#c8d9ca",
      })
      .setOrigin(0.5);
    this.add
      .text(384, 370, "PRÓLOGO · A OUTRA MARGEM", {
        fontSize: "16px",
        color: "#a8c4b6",
      })
      .setOrigin(0.5);
    this.add
      .text(384, 480, "v0.2.0 · Protótipo de combate tático", {
        fontSize: "16px",
        color: "#a8c4b6",
      })
      .setOrigin(0.5);
    const form = document.createElement("form");
    form.id = "creation";
    form.innerHTML = `<h2>Seu primeiro passo em Basilis</h2><p>Crie o viajante e proteja a passagem com Lyra.</p><label>Nome<input name="name" maxlength="16" value="Viajante" required></label><label>Raça<select name="race">${["Humano", "Elfo", "Anão", "Teriano", "Draconiano", "Demoniano"].map((r) => `<option>${r}</option>`).join("")}</select></label><label>Classe<select name="cls">${["Guerreiro", "Mago", "Ladino"].map((c) => `<option>${c}</option>`).join("")}</select></label><p>Guerreiro: resistente. Mago: alcance. Ladino: mobilidade.<br>Raça é uma escolha narrativa nesta versão; aparência ainda não disponível.</p><button type="submit">Iniciar expedição</button><p>Mouse ou toque no tabuleiro. Setas/WASD + Enter também movem o cursor. Tab e Enter acionam os comandos.</p>`;
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = new FormData(form);
      this.scene.start("Battle", {
        name: String(data.get("name")).trim().slice(0, 16) || "Viajante",
        race: String(data.get("race")),
        cls: data.get("cls") as UnitClass,
      });
    };
    document.querySelector("#app")!.append(form);
    this.events.once("shutdown", () => form.remove());
  }
}
