import Phaser from "phaser";
import type { Campaign } from "../game/campaign";
import { chooseDialogue, recordNarrativeEvent, systemDialogue, type DialogueChoice } from "../game/narrative";
import { saveCampaign } from "../game/persistence/save";

export class ArrivalScene extends Phaser.Scene {
  private campaign!: Campaign;
  private panel!: HTMLElement;
  private revision = 0;
  private saveMessage = "Salvando checkpoint…";
  constructor() { super("Arrival"); }
  init(data: { campaign: Campaign }) {
    this.campaign = data.campaign;
    this.saveMessage = "Salvando checkpoint…";
  }
  create() {
    const revisiting = this.campaign.narrative.appliedEvents.includes("arrival.completed");
    this.cameras.main.setBackgroundColor("#17383c");
    const g = this.add.graphics();
    // Original placeholder tiles at 32px and one 32x48 avatar, all integer pixels.
    for (let y = 0; y < 18; y++) for (let x = 0; x < 24; x++) {
      g.fillStyle((x + y) % 2 ? 0x496c53 : 0x52745c).fillRect(x * 32, y * 32, 32, 32);
      if ((x * 7 + y * 11) % 9 === 0) g.fillStyle(0x789072).fillRect(x * 32 + 12, y * 32 + 10, 4, 6);
    }
    for (const x of [32, 128, 576, 672]) {
      g.fillStyle(0x30473d).fillRect(x + 16, 128, 16, 160);
      g.fillStyle(0x284f43).fillRect(x, 80, 64, 80);
    }
    const x = 368, y = 272;
    const clothes = this.campaign.character.cls === "Mago" ? 0x9b82bd : this.campaign.character.cls === "Ladino" ? 0x779b89 : 0x7e9db4;
    g.fillStyle(0x243d38).fillRect(x - 8, y + 44, 48, 8);
    g.fillStyle(0xd2b58d).fillRect(x + 8, y, 16, 12);
    g.fillStyle(0x403d39).fillRect(x + 8, y, 16, 4);
    g.fillStyle(clothes).fillRect(x + 4, y + 12, 24, 24);
    g.fillStyle(0x303f4d).fillRect(x + 8, y + 36, 6, 12).fillRect(x + 18, y + 36, 6, 12);
    this.add.text(384, 400, revisiting ? "O SISTEMA" : "A OUTRA MARGEM", { fontFamily: "Georgia", fontSize: "28px", color: "#e5d4a8" }).setOrigin(0.5);
    this.add.text(384, 450, revisiting ? "A interface responde. Você pode voltar ao caminho quando quiser." : "A cabeça lateja. A grama está molhada. O céu é diferente.", { fontSize: "17px", color: "#d7e4d2", wordWrap: { width: 620 }, align: "center" }).setOrigin(0.5);
    this.add.text(384, 530, "Representação provisória · aparência personalizável ainda indisponível", { fontSize: "14px", color: "#d7e4d2" }).setOrigin(0.5);
    this.panel = document.createElement("section");
    this.panel.id = "system-ui"; this.panel.setAttribute("aria-label", "Consulta ao Sistema");
    document.querySelector("#app")!.append(this.panel);
    recordNarrativeEvent(this.campaign.narrative, "system.welcome");
    this.events.once("shutdown", () => { this.revision++; this.panel.remove(); });
    this.render(); this.persist();
  }
  private persist() {
    const revision = ++this.revision;
    this.saveMessage = "Salvando checkpoint…";
    void saveCampaign(this.campaign).then(ok => {
      if (revision !== this.revision || !this.scene.isActive()) return;
      this.saveMessage = ok ? "Checkpoint salvo neste navegador." : "Não foi possível salvar. Você pode continuar nesta sessão.";
      this.render();
    });
  }
  private render() {
    const scrollTop = this.panel.scrollTop;
    const focused = document.activeElement?.getAttribute("data-choice");
    this.panel.replaceChildren();
    const title = document.createElement("h2"); title.textContent = "Interface do Sistema"; this.panel.append(title);
    const name = document.createElement("p"); name.textContent = this.campaign.character.name; this.panel.append(name);
    const line = document.createElement("p"); line.className = "system-speech"; line.setAttribute("role", "status");
    line.textContent = systemDialogue[this.campaign.narrative.nodeId]; this.panel.append(line);
    const actions = document.createElement("div"); actions.className = "actions";
    for (const [id, label] of [["where", "Onde estou?"], ["identity", "Quem é você?"], ["defer", "Agora não"], ["continue", "Seguir pela clareira"]] as const) {
      const b = document.createElement("button"); b.dataset.choice = id; b.textContent = label;
      b.onclick = () => this.choose(id); actions.append(b);
    }
    this.panel.append(actions);
    const hint = document.createElement("p"); hint.textContent = "Você pode seguir sem consultar tudo. As instruções e o diário continuam disponíveis na exploração."; this.panel.append(hint);
    const saved = document.createElement("p"); saved.textContent = this.saveMessage; saved.className = "save-status"; this.panel.append(saved);
    if (focused) this.panel.querySelector<HTMLElement>(`[data-choice="${focused}"]`)?.focus({ preventScroll: true });
    this.panel.scrollTop = scrollTop;
  }
  private choose(choice: DialogueChoice) {
    if (!chooseDialogue(this.campaign.narrative, choice)) return;
    this.persist();
    if (this.campaign.narrative.sceneId === "AREA_CLEARING") this.scene.start("Exploration", { campaign: this.campaign });
    else this.render();
  }
}
