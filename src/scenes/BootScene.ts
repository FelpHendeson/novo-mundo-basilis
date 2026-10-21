import Phaser from "phaser";
import { CLASSES, RACES } from "../game/archetypes";
import { characterSheet } from "../ui/characterSheet";
import { campaignStartScene, newCampaign } from "../game/campaign";
import { loadCampaign, saveCampaign, type LoadResult } from "../game/persistence/save";
import type { UnitClass } from "../game/model";

export class BootScene extends Phaser.Scene {
  constructor() { super("Boot"); }
  create() {
    this.cameras.main.setBackgroundColor("#182830");
    const g = this.add.graphics();
    g.fillStyle(0x6e7778).fillRect(0, 0, 768, 330);
    g.fillStyle(0x36494f).fillRect(64, 72, 224, 160);
    g.fillStyle(0xb3c4bd).fillRect(72, 80, 208, 144);
    g.fillStyle(0x36494f).fillRect(170, 80, 8, 144).fillRect(72, 148, 208, 8);
    g.fillStyle(0x65513c).fillRect(0, 330, 768, 246);
    g.fillStyle(0x9b8060).fillRect(120, 310, 528, 160);
    g.fillStyle(0xd5d5c0).fillEllipse(384, 384, 144, 48);
    g.fillStyle(0x896e48).fillRect(358, 362, 40, 20);
    g.fillStyle(0xc7c8ae).fillRect(514, 336, 32, 52);
    this.add.text(384, 494, "NOVO MUNDO: BASILIS", { fontFamily: "Georgia", fontSize: "28px", color: "#eadbb7" }).setOrigin(0.5);
    this.add.text(384, 542, "0.14.0 · Primeiro assentamento · Arte provisória", { fontSize: "16px", color: "#c8d9ca" }).setOrigin(0.5);
    const menu = document.createElement("section");
    menu.id = "boot-ui";
    menu.innerHTML = '<h2>Última manhã</h2><p>Era um dia livre. Você acordara tarde. O mundo parecia seguir seu curso.</p><p>A última lembrança é banal: uma refeição interrompida.</p><p>Depois, apenas uma lacuna. Sem uma resposta sobre o que aconteceu.</p>';
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = "Consultando checkpoint…";
    menu.append(status);
    const start = document.createElement("button");
    start.textContent = "Continuar para criação";
    start.disabled = true;
    menu.append(start);
    document.querySelector("#app")!.append(menu);
    let form: HTMLFormElement | null = null;
    let result: LoadResult | null = null;
    this.events.once("shutdown", () => { menu.remove(); form?.remove(); });
    void loadCampaign().then((loaded) => {
      if (!menu.isConnected) return;
      result = loaded;
      start.disabled = false;
      status.textContent = loaded.status === "loaded" ? "Uma jornada salva foi encontrada. Continuar preserva sua posição e escolhas."
        : loaded.status === "invalid" ? "O checkpoint é incompatível ou está danificado. Ele não foi apagado."
        : loaded.status === "unavailable" ? "Salvamento indisponível. Você pode jogar nesta sessão." : "Nenhuma jornada salva neste navegador.";
      if (loaded.status === "loaded") {
        const resume = document.createElement("button");
        resume.textContent = `Continuar jornada de ${loaded.campaign.character.name}`;
        resume.onclick = () => this.scene.start(campaignStartScene(loaded.campaign), { campaign: loaded.campaign });
        start.before(resume);
      }
    });
    start.onclick = () => {
      if (!result || form) return;
      const hasPrevious = result.status === "loaded" || result.status === "invalid";
      menu.remove();
      form = document.createElement("form"); form.id = "creation";
      form.innerHTML = `<h2>Seu primeiro passo em Basilis</h2><p>Defina o viajante que despertará na clareira.</p><label>Nome<input name="name" maxlength="16" value="Viajante" required></label><label>Raça<select name="race">${RACES.map(r => `<option>${r}</option>`).join("")}</select></label><label>Classe<select name="cls">${CLASSES.map(c => `<option>${c}</option>`).join("")}</select></label><div id="character-preview" aria-live="polite"></div>${hasPrevious ? '<label><input type="checkbox" name="replace" style="width:auto">Iniciar nova jornada e substituir o checkpoint existente</label>' : ''}<button type="submit">Iniciar expedição</button><button type="button" data-menu>Voltar ao menu</button>`;
      form.prepend(status);
      const currentForm = form;
      const preview = form.querySelector<HTMLElement>("#character-preview")!;
      const updatePreview = () => {
        const data = new FormData(currentForm);
        preview.replaceChildren(characterSheet(data.get("cls") as UnitClass, String(data.get("race"))));
      };
      form.addEventListener("change", updatePreview); updatePreview();
      form.querySelector<HTMLButtonElement>("[data-menu]")!.onclick = () => this.scene.restart();
      form.onsubmit = (e) => {
        e.preventDefault();
        const data = new FormData(currentForm);
        if (hasPrevious && !data.has("replace")) { status.textContent = "Marque a substituição do checkpoint para iniciar uma nova jornada, ou volte ao menu para continuar a anterior."; return; }
        const submit = currentForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
        if (submit.disabled) return;
        submit.disabled = true;
        const campaign = newCampaign({ name: String(data.get("name")).trim().slice(0,16) || "Viajante", race: String(data.get("race")), cls: data.get("cls") as UnitClass });
        status.textContent = "Preparando checkpoint da chegada…";
        void saveCampaign(campaign).then(() => {
          if (currentForm.isConnected) this.scene.start("Arrival", { campaign });
        });
      };
      document.querySelector("#app")!.append(form);
      form.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    };
  }
}
