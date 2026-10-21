import Phaser from "phaser";
import type { Campaign } from "../game/campaign";
import { near } from "../game/campaign";
import { CREATURE_POSITION, CREATURE_RESULT, observeCreature, avoidCreature, beginCreature, finishCreature } from "../game/creature";
import { saveCampaign } from "../game/persistence/save";
export class CreatureScene extends Phaser.Scene {
  private campaign!: Campaign;
  private panel!: HTMLElement;
  private revision = 0;
  private saveMessage = "Salvando checkpoint…";
  constructor() { super("Creature"); }
  init(data: { campaign: Campaign }) { this.campaign = data.campaign; this.saveMessage = "Salvando checkpoint…"; }
  create() {
    if (!near(this.campaign, CREATURE_POSITION.x, CREATURE_POSITION.y)) {
      this.scene.start("Exploration", { campaign: this.campaign }); return;
    }
    this.cameras.main.setBackgroundColor("#203d38");
    const g = this.add.graphics();
    for (let y = 0; y < 18; y++) for (let x = 0; x < 24; x++)
      g.fillStyle((x+y)%2 ? 0x44664c : 0x507353).fillRect(x*32,y*32,32,32);
    g.fillStyle(0x303a33).fillEllipse(510,310,180,110);
    g.fillStyle(0x162b28).fillEllipse(520,330,120,60);
    // Original provisional quadruped silhouette; no species/lore assigned.
    g.fillStyle(0x8d8265).fillRect(280,290,128,48).fillRect(260,274,48,42);
    g.fillStyle(0x68634f).fillRect(278,332,16,36).fillRect(374,332,16,36);
    g.fillStyle(0x8d8265).fillTriangle(400,296,450,274,414,320);
    g.fillStyle(0x343c31).fillTriangle(262,278,270,252,284,278);
    g.fillStyle(0xd3b46f).fillRect(266,286,6,6);
    this.add.text(384,420,"TOCA NA CLAREIRA",{fontFamily:"Georgia",fontSize:"26px",color:"#e5d4a8"}).setOrigin(0.5);
    this.add.text(384,500,"Representação provisória · espécie não identificada",{fontSize:"15px",color:"#e1e9df"}).setOrigin(0.5);
    this.panel=document.createElement("section"); this.panel.id="encounter-ui";
    this.panel.setAttribute("aria-label","Primeiro encontro de criatura");
    document.querySelector("#app")!.append(this.panel);
    this.events.once("shutdown",()=>{ this.revision++; this.panel.remove(); });
    this.render(); this.persist();
  }
  private persist() {
    const revision=++this.revision; this.saveMessage="Salvando checkpoint…";
    void saveCampaign(this.campaign).then(ok=>{
      if(revision!==this.revision || !this.scene.isActive()) return;
      this.saveMessage=ok ? "Checkpoint salvo neste navegador." : "Não foi possível salvar. A decisão continua nesta sessão.";
      this.render();
    });
  }
  private render() {
    const scroll=this.panel.scrollTop;
    const focused=document.activeElement?.getAttribute("data-action");
    this.panel.replaceChildren();
    const h=document.createElement("h2"); h.textContent="Toca na clareira"; this.panel.append(h);
    const p=(text:string,role?:string)=>{const el=document.createElement("p");el.textContent=text;if(role)el.setAttribute("role",role);this.panel.append(el);};
    const c=this.campaign.creature;
    p(CREATURE_RESULT[c.outcome],"status");
    if(c.observed) p("Observação registrada: ela protege a entrada da toca e acompanha seus movimentos, sem perseguir quem mantém distância.");
    if(c.outcome==="pending" && c.engaged) p("O confronto foi interrompido. Você pode reiniciá-lo com HP/energia restaurados ou encerrar recuando. Itens já gastos não retornam.");
    p("Encontro opcional. Observar não inicia combate. Contornar encerra o encontro pacificamente. Nenhuma escolha concede XP ou saque nesta versão.");
    const actions=document.createElement("div"); actions.className="actions"; this.panel.append(actions);
    const button=(id:string,label:string,run:()=>void)=>{const b=document.createElement("button");b.dataset.action=id;b.textContent=label;b.onclick=run;actions.append(b);};
    const update=(change:()=>boolean)=>{if(change()){this.render();this.persist();}};
    if(c.outcome==="pending") {
      if(!c.engaged) {
        if(!c.observed) button("observe","Observar à distância",()=>update(()=>observeCreature(c)));
        button("avoid","Contornar a toca",()=>update(()=>avoidCreature(c)));
      } else button("retreat","Encerrar recuando",()=>update(()=>finishCreature(c,false)));
      button("fight",c.engaged ? "Reiniciar confronto interrompido" : "Enfrentar a criatura",()=>{
        if(!beginCreature(c)) return;
        this.persist(); this.scene.start("Battle",{...this.campaign.character,campaign:this.campaign,mission:"creature"});
      });
    }
    button("back",c.outcome==="pending" ? "Voltar à trilha e decidir depois" : "Seguir pela clareira",()=>this.scene.start("Exploration",{campaign:this.campaign}));
    p(this.saveMessage);
    if(focused) this.panel.querySelector<HTMLElement>(`[data-action="${focused}"]`)?.focus({preventScroll:true});
    this.panel.scrollTop=scroll;
  }
}
