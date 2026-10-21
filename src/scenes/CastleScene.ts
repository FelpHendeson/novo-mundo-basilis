import { settlementPanel } from "../ui/settlementUI";
import { settlementView } from "../game/settlement";
import Phaser from "phaser";
import type { Campaign } from "../game/campaign";
import { AREAS, CASTLE_ENTRANCE, castlePassable } from "../game/areas";
import { CASTLE_POINTS, POINT_IDS, REPAIR_IDS, THRONE, castleNear, moveInCastle, inspectCastle, activateThrone, deferCastle, claimCastle, normalizeCastleName, prioritizeRepair, type CastlePoint } from "../game/castle";
import { canLeaveCastle, leaveCastle } from "../game/travel";
import { openSystem } from "../game/narrative";
import { saveCampaign } from "../game/persistence/save";
import { journalPanel } from "../ui/journalUI";

/** Area presentation and HTML controls; castle decisions live in the pure domain module. */
export class CastleScene extends Phaser.Scene {
  private campaign!: Campaign;
  private panel!: HTMLElement;
  private graphics!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private revision = 0;
  private message = "";
  private saveMessage = "Salvando checkpoint…";
  private draftName = "";
  constructor() { super("Castle"); }
  init(data: { campaign: Campaign }) {
    this.campaign = data.campaign;
    const v=settlementView(this.campaign.settlement);
    this.message = v.phase==="arrived" ? `${v.party.length} pessoas chegaram pela trilha e se instalaram no dormitório. Confira reservas e tarefas no quadro.` : v.done.includes("gate") ? "O portão reforçado recebe você. A origem do castelo permanece desconhecida." : "A trilha termina num portão quebrado. O castelo está silencioso; sua história permanece desconhecida.";
    this.saveMessage = "Salvando checkpoint…";
    this.draftName = "";
  }
  create() {
    if(settlementView(this.campaign.settlement).training.active){this.scene.start("Training",{campaign:this.campaign});return;}
    if (this.campaign.area !== "castle") { this.scene.start("Exploration", { campaign: this.campaign }); return; }
    this.cameras.main.setBackgroundColor("#192d30");
    this.graphics = this.add.graphics();
    this.panel = document.createElement("section");
    this.panel.id = "castle-ui"; this.panel.setAttribute("aria-label", "Exploração do castelo");
    document.querySelector("#app")!.append(this.panel);
    this.game.canvas.tabIndex = 0;
    this.input.keyboard?.on("keydown", (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("button,input,select,summary,textarea,a")) return;
      const directions: Record<string, [number, number]> = { ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0] };
      if (directions[e.key]) { e.preventDefault(); this.move(...directions[e.key]); }
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.game.canvas.focus();
      const x = Math.floor((p.x - 64) / 80), y = Math.floor((p.y - 55) / 72);
      const dx = x - this.campaign.castle.position.x, dy = y - this.campaign.castle.position.y;
      if (Math.abs(dx) + Math.abs(dy) === 1) this.move(dx,dy);
    });
    this.events.once("shutdown", () => {
      this.revision++; this.panel.remove();
      this.input.keyboard?.off("keydown"); this.input.off("pointerdown");
    });
    this.draw(); this.persist();
  }
  private persist() {
    const revision = ++this.revision; this.saveMessage = "Salvando checkpoint…";
    void saveCampaign(this.campaign).then(ok => {
      if (revision !== this.revision || !this.scene.isActive()) return;
      this.saveMessage = ok ? "Checkpoint salvo neste navegador." : "Não foi possível salvar. O progresso continua nesta sessão.";
      this.draw();
    });
  }
  private move(dx: number, dy: number) {
    if (moveInCastle(this.campaign.castle,dx,dy)) { this.message = "Você avança pelo castelo."; this.persist(); }
    else this.message = "Uma parede ou o limite da área impede a passagem.";
    this.draw();
  }
  private inspect(id: CastlePoint) {
    const c = this.campaign.castle;
    const v=settlementView(this.campaign.settlement);
    this.message = v.done.includes(id as "gate"|"dormitory"|"storehouse") ? `${CASTLE_POINTS[id].name}: reparo concluído. A descoberta inicial continua registrada no diário.` : CASTLE_POINTS[id].clue;
    if (inspectCastle(c,id)) this.persist();
    this.draw();
  }
  private draw() {
    const c = this.campaign.castle;
    const settlement=settlementView(this.campaign.settlement);
    this.graphics.clear(); this.labels.forEach(t => t.destroy()); this.labels = [];
    const text = (x:number,y:number,label:string,size=15) => this.labels.push(this.add.text(x,y,label,{fontSize:`${size}px`,color:"#eee2bd",wordWrap:{width:640}}));
    text(64,18,"BASILIS / CASTELO ABANDONADO",21);
    for (let y=0;y<AREAS.castle.height;y++) for (let x=0;x<AREAS.castle.width;x++) {
      const walk = castlePassable(x,y);
      this.graphics.fillStyle(walk ? ((x+y)%2 ? 0x697575 : 0x73807d) : 0x344646).fillRect(64+x*80,55+y*72,78,70);
      if (!walk) this.graphics.lineStyle(1,0x526263).lineBetween(64+x*80,90+y*72,142+x*80,90+y*72);
    }
    const short: Record<CastlePoint,string> = {gate:"Portão",courtyard:"Pátio",storehouse:"Depósito",wall:"Muralha",records:"Registros",tower:"Torre",dormitory:"Dorm."};
    for (const id of POINT_IDS) {
      const p=CASTLE_POINTS[id];
      this.graphics.fillStyle(c.inspected.includes(id) ? 0xb7c982 : 0xd5b16c).fillRect(70+p.x*80,61+p.y*72,12,12);
      text(68+p.x*80,80+p.y*72,short[id],13);
    }
    for(const id of ["gate","dormitory","storehouse"] as const) if(settlement.done.includes(id)) {
      const p=CASTLE_POINTS[id];this.graphics.lineStyle(4,0xb9d78b).strokeRect(66+p.x*80,57+p.y*72,74,66);
    }
    if(settlement.phase==="arrived")text(64,480,`${settlement.party.length} moradores · obras concluídas em verde`,15);
    this.graphics.fillStyle(c.name ? 0xd5b46f : 0x82619b).fillRect(314,60,28,24);
    text(310,96,"Trono",13); text(306,442,"Trilha",13);
    const x=104+c.position.x*80,y=91+c.position.y*72;
    this.graphics.fillStyle(0x75b8e2).fillCircle(x,y,14).lineStyle(2,0xd3eaff).strokeCircle(x,y,14);
    text(64,515,"Arte provisória · marque descobertas perto dos pontos de interesse",14);
    this.renderPanel();
  }
  private renderPanel() {
    const c=this.campaign.castle;
    const settlement=settlementView(this.campaign.settlement);
    const settlementOpen=this.panel.querySelector<HTMLDetailsElement>(".settlement-panel")?.open??false;
    const oldInput=this.panel.querySelector<HTMLInputElement>("#castle-name");
    if (oldInput) this.draftName=oldInput.value;
    const focus=document.activeElement?.getAttribute("data-action"), scroll=this.panel.scrollTop;
    const guideOpen=this.panel.querySelector<HTMLDetailsElement>(".castle-guide")?.open ?? false;
    const journalOpen=this.panel.querySelector<HTMLDetailsElement>(".journal-panel")?.open ?? false;
    this.panel.replaceChildren();
    const h=document.createElement("h2");h.textContent=c.name ? `Castelo ${c.name}` : "Castelo abandonado";this.panel.append(h);
    const p=(text:string,role?:string)=>{const el=document.createElement("p");el.textContent=text;if(role)el.setAttribute("role",role);this.panel.append(el);return el;};
    p(`Posição ${c.position.x+1}, ${c.position.y+1} · Descobertas ${c.inspected.length}/${POINT_IDS.length}`);
    p(this.message,"status"); p(this.saveMessage).className="save-status";
    const actions=document.createElement("div");actions.className="actions";this.panel.append(actions);
    const button=(id:string,label:string,run:()=>void,disabled=false,target:HTMLElement=actions)=>{
      const b=document.createElement("button");b.type="button";b.dataset.action=id;b.textContent=label;b.disabled=disabled;b.onclick=run;target.append(b);
    };
    for (const [id,label,dx,dy] of [["up","↑ Norte",0,-1],["left","← Oeste",-1,0],["right","Leste →",1,0],["down","↓ Sul",0,1]] as const)
      button(id,label,()=>this.move(dx,dy));
    for (const id of POINT_IDS) if (castleNear(c,CASTLE_POINTS[id]))
      button(`inspect-${id}`,`${c.inspected.includes(id) ? "Reler" : "Inspecionar"}: ${CASTLE_POINTS[id].name}`,()=>this.inspect(id));
    if (castleNear(c,THRONE) && !c.throneActivated) button("throne","Aproximar-se e sentar no trono",()=>{
      if(!activateThrone(c)) return;
      this.message="Sistema: núcleo territorial inativo detectado. Você pode reivindicar a administração ou adiar a decisão.";
      this.draw();this.persist();
    });
    if (castleNear(c,THRONE) && c.throneActivated && !c.name) {
      p("A reivindicação é opcional. O nome ficará registrado; a posse sistêmica não representa reconhecimento de outras autoridades.");
      const form=document.createElement("form");form.className="castle-claim";form.noValidate=true;
      const label=document.createElement("label");label.htmlFor="castle-name";label.textContent="Nome do castelo (3–32 caracteres)";
      const input=document.createElement("input");input.id="castle-name";input.name="castle-name";input.maxLength=32;input.dataset.action="castle-name";input.value=this.draftName;input.autocomplete="off";
      const help=document.createElement("p");help.id="castle-name-help";help.textContent="Use letras, números, espaços, apóstrofos ou hífens. A confirmação registra o nome uma única vez.";input.setAttribute("aria-describedby",help.id);
      const submit=document.createElement("button");submit.type="submit";submit.dataset.action="claim";submit.textContent="Reivindicar e registrar nome";
      form.append(label,input,help,submit);
      form.onsubmit=e=>{
        e.preventDefault();this.draftName=input.value;
        if(!normalizeCastleName(input.value)) { this.message="Nome inválido: informe de 3 a 32 caracteres usando letras, números, espaços, apóstrofos ou hífens.";this.draw();return; }
        if(!claimCastle(c,input.value)) return;
        this.message="Autoridade administrativa registrada. O castelo ainda não tem moradores assentados nem materiais de construção.";
        this.draw();this.persist();
      };
      this.panel.append(form);
      button("defer","Adiar a reivindicação",()=>{
        if(deferCastle(c)) this.persist();
        this.message="Decisão adiada. Explore livremente e volte ao trono quando desejar.";this.draw();
      });
    }
    if (c.name) {
      p(`Administração do castelo · ${settlement.phase==="arrived"?settlement.party.length:0} moradores assentados · ${settlement.done.filter(id=>["gate","dormitory","storehouse"].includes(id)).length} obras concluídas. Lyra continua aliada da expedição; não foi transferida automaticamente para a população.`);
      p("Prioridade de reparo: "+(c.priority ? CASTLE_POINTS[c.priority].repair : "ainda não definida")+". Escolher a prioridade não executa a obra. Use o quadro de assentamento para reunir recursos e trabalhar.");
      const repairs=document.createElement("div");repairs.className="roster castle-repairs";
      for(const id of REPAIR_IDS) button(`priority-${id}`,`Priorizar: ${CASTLE_POINTS[id].repair}${c.inspected.includes(id) ? "" : " · inspecione primeiro"}`,()=>{
        if(!prioritizeRepair(c,id)) return;
        this.message=`Prioridade registrada: ${CASTLE_POINTS[id].repair}. Nenhum material foi consumido.`;this.draw();this.persist();
      },!c.inspected.includes(id) || c.priority===id,repairs);
      this.panel.append(repairs);
    } else p(c.claimDeferred ? "Reivindicação adiada. O castelo permanece acessível; volte ao trono para decidir." : "A administração só será registrada se você decidir reivindicar o castelo no trono.");
    const work=settlementPanel(this.campaign,message=>{this.message=message;this.draw();this.persist();},"castle");work.open=settlementOpen;this.panel.append(work);
    button("training","Ir à formação no pátio",()=>this.scene.start("Training",{campaign:this.campaign}),!castleNear(c,CASTLE_POINTS.courtyard)||!c.inspected.includes("courtyard")||!["tools","gate","dormitory"].every(id=>settlement.done.includes(id as "tools"|"gate"|"dormitory")));
    button("exit","Voltar pela trilha à clareira",()=>{
      if(!leaveCastle(this.campaign)) return;
      this.persist();this.scene.start("Exploration",{campaign:this.campaign});
    },!canLeaveCastle(this.campaign));
    button("system","Consultar o Sistema",()=>{
      openSystem(this.campaign.narrative);this.persist();this.scene.start("Arrival",{campaign:this.campaign});
    });
    button("save","Salvar checkpoint",()=>{this.persist();this.draw();});
    button("menu","Voltar ao menu",()=>this.scene.start("Boot"));
    const guide=document.createElement("details");guide.className="castle-guide";guide.open=guideOpen;
    const summary=document.createElement("summary");summary.textContent="Mapa e descobertas";summary.dataset.action="guide";guide.append(summary);
    const list=document.createElement("ul");
    for(const id of POINT_IDS) {const item=document.createElement("li"),point=CASTLE_POINTS[id];item.textContent=`${point.name} · casa ${point.x+1},${point.y+1}${c.inspected.includes(id) ? " · "+point.clue : " · não inspecionado"}`;list.append(item);}
    const help=document.createElement("p");help.textContent=`Trono: casa ${THRONE.x+1},${THRONE.y+1}. Saída: casa ${CASTLE_ENTRANCE.x+1},${CASTLE_ENTRANCE.y+1}. Interaja na casa ou em uma vizinha. Paredes escuras bloqueiam passagem.`;guide.append(help,list);this.panel.append(guide);
    const journal=journalPanel(this.campaign);journal.open=journalOpen;this.panel.append(journal);
    if(focus) this.panel.querySelector<HTMLElement>(`[data-action="${focus}"]`)?.focus({preventScroll:true});
    this.panel.scrollTop=scroll;
  }
}
