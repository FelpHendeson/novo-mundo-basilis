import { CLASSES, RACES } from "../game/archetypes";
import { characterSheet } from "../ui/characterSheet";
import { newCampaign } from "../game/campaign";
import { loadCampaign } from "../game/persistence/save";
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
      .text(384, 480, "v0.7.0 · Exploração e combate", {
        fontSize: "16px",
        color: "#a8c4b6",
      })
      .setOrigin(0.5);
    const form = document.createElement("form");
    form.id = "creation";
    form.innerHTML = `<h2>Seu primeiro passo em Basilis</h2><p>Crie o viajante e proteja a passagem com Lyra.</p><label>Nome<input name="name" maxlength="16" value="Viajante" required></label><label>Raça<select name="race">${RACES.map((r) => `<option>${r}</option>`).join("")}</select></label><label>Classe<select name="cls">${CLASSES.map((c) => `<option>${c}</option>`).join("")}</select></label><div id="character-preview" aria-live="polite"></div><button type="submit">Iniciar expedição</button><p>Mouse ou toque no tabuleiro. Setas/WASD + Enter também movem o cursor. Tab e Enter acionam os comandos.</p>`;
    const preview = form.querySelector<HTMLElement>("#character-preview")!;
    const updatePreview = () => {
      const data = new FormData(form);
      preview.replaceChildren(characterSheet(data.get("cls") as UnitClass, String(data.get("race"))));
    };
    form.addEventListener("change", updatePreview);
    updatePreview();
    let hasPrevious = false;
    let ready = false;
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = "Consultando checkpoint…";
    form.prepend(status);
    const submit = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    )!;
    submit.disabled = true;
    void loadCampaign().then((result) => {
      if (!form.isConnected) return;
      ready = true;
      submit.disabled = false;
      hasPrevious = result.status === "loaded" || result.status === "invalid";
      status.textContent =
        result.status === "loaded"
          ? "Uma jornada salva foi encontrada."
          : result.status === "invalid"
            ? "O checkpoint não é compatível ou está danificado. Ele não foi apagado."
            : result.status === "unavailable"
              ? "Salvamento indisponível neste navegador. Você pode jogar nesta sessão."
              : "Nenhuma jornada salva neste navegador.";
      if (result.status === "loaded") {
        const continueButton = document.createElement("button");
        continueButton.type = "button";
        continueButton.textContent = `Continuar jornada de ${result.campaign.character.name}`;
        continueButton.onclick = () =>
          this.scene.start("Exploration", { campaign: result.campaign });
        status.after(continueButton);
      }
      if (hasPrevious) {
        const label = document.createElement("label");
        const check = document.createElement("input");
        check.type = "checkbox";
        check.name = "replace";
        check.style.width = "auto";
        label.append(
          check,
          document.createTextNode(
            "Iniciar nova jornada e substituir o checkpoint existente",
          ),
        );
        submit.before(label);
      }
    });
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!ready) return;
      const data = new FormData(form);
      if (hasPrevious && !data.has("replace")) {
        status.textContent =
          "Para uma nova jornada, marque a substituição do checkpoint ou continue a jornada salva.";
        return;
      }
      this.scene.start("Exploration", {
        campaign: newCampaign({
          name: String(data.get("name")).trim().slice(0, 16) || "Viajante",
          race: String(data.get("race")),
          cls: data.get("cls") as UnitClass,
        }),
      });
    };
    document.querySelector("#app")!.append(form);
    this.events.once("shutdown", () => form.remove());
  }
}
