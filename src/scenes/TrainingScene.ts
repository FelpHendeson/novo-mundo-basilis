import Phaser from "phaser";
import type { Campaign } from "../game/campaign";
import { CASTLE_POINTS, castleNear } from "../game/castle";
import { contactTrust } from "../game/contact";
import { settlementView, settlementClock, trainingContext, runTraining } from "../game/settlement";
import { trainingRound, roundCount, trainingScore, trainingProblem, championRequirements, TRAINING_LABELS, type Trainee, type Exercise, type TrainingMode, type TrainingCommand } from "../game/training";
import { saveCampaign } from "../game/persistence/save";
export class TrainingScene extends Phaser.Scene {
 private campaign!:Campaign;private panel!:HTMLElement;private graphics!:Phaser.GameObjects.Graphics;
 private labels:Phaser.GameObjects.Text[]=[];private revision=0;private message="";private saved="Salvando checkpoint…";
 private trainee:Trainee="player";private exercise:Exercise="sword";private mode:TrainingMode="manual";
 constructor(){super("Training");}
 init(data:{campaign:Campaign}){this.campaign=data.campaign;this.message="Escolha participante, exercício e modo. O preparo importa mais que a pressa.";this.saved="Salvando checkpoint…";this.trainee="player";this.exercise="sword";this.mode="manual";}
 create(){
  const c=this.campaign;if(c.area!=="castle"||!castleNear(c.castle,CASTLE_POINTS.courtyard)){this.scene.start(c.area==="castle"?"Castle":"Exploration",{campaign:c});return;}
  this.cameras.main.setBackgroundColor("#1a3037");this.graphics=this.add.graphics();this.panel=document.createElement("section");this.panel.id="training-ui";this.panel.setAttribute("aria-label","Formação no pátio");document.querySelector("#app")!.append(this.panel);
  this.events.once("shutdown",()=>{this.revision++;this.panel.remove();});this.draw();this.persist();
 }
 private persist(){const rev=++this.revision;this.saved="Salvando checkpoint…";void saveCampaign(this.campaign).then(ok=>{if(rev!==this.revision||!this.scene.isActive())return;this.saved=ok?"Checkpoint salvo neste navegador.":"Não foi possível salvar. A sessão continua neste navegador até fechar a página.";this.draw();});}
 private command(cmd:TrainingCommand){
  const v=settlementView(this.campaign.settlement),problem=trainingProblem(v.training,cmd,trainingContext(v));
  if(problem){this.message=problem;this.draw();return;}
  if(!runTraining(this.campaign,cmd)){this.message="Atividade indisponível: confira posição no pátio, inspeção e espaço no registro.";this.draw();return;}
  const after=settlementView(this.campaign.settlement);
  if(cmd.type==="answer")this.message=after.training.active?"Resposta registrada; leia o próximo sinal.":after.training.reports.at(-1)??"Exercício concluído.";
  else if(cmd.type==="start")this.message=cmd.mode==="delegated"?after.training.reports.at(-1)!:"Sessão iniciada: custos e tempo debitados uma vez. Recarga retoma a rodada sem repetir a cobrança.";
  else this.message=after.training.reports.at(-1)??"Registro atualizado.";
  this.draw();this.persist();
 }
 private draw(){
  const c=this.campaign,v=settlementView(c.settlement),s=v.training,ctx=trainingContext(v),a=s.active;
  this.graphics.clear();for(const t of this.labels)t.destroy();this.labels=[];
  const text=(x:number,y:number,label:string,size=22)=>this.labels.push(this.add.text(x,y,label,{fontSize:`${size}px`,fontFamily:"Georgia",color:"#eee2bd",wordWrap:{width:640},align:"center"}).setOrigin(0.5));
  this.graphics.fillStyle(0x455c59).fillRect(48,48,672,480);
  if(a?.exercise==="mana"){
   this.graphics.lineStyle(12,0x587d7a).strokeCircle(384,270,120);
   for(let i=0;i<3;i++){const angle=(i*120-90)*Math.PI/180;this.graphics.fillStyle(i===trainingRound(a).answer?0x8ad7cf:0x9c9271).fillCircle(384+Math.cos(angle)*120,270+Math.sin(angle)*120,20);}
   text(384,270,"FLUXO",24);
  }else{
   this.graphics.fillStyle(0x9d825d).fillRect(368,180,32,170).fillRect(300,225,168,22);
   this.graphics.lineStyle(8,0xd5c9a2).lineBetween(280,370,350,290);text(384,405,"Postura · proteção · controle",21);
  }
  text(384,90,a?TRAINING_LABELS[a.exercise]:"FORMAÇÃO NO PÁTIO",27);text(384,485,a?`Etapa ${a.answers.length+1}/${roundCount(a.exercise)} · por turnos`:"Arte provisória · sem espera real",18);
  const focus=document.activeElement?.getAttribute("data-action"),scroll=this.panel.scrollTop;this.panel.replaceChildren();
  const h=document.createElement("h2");h.textContent="Formação no pátio";this.panel.append(h);
  const p=(value:string,role?:string)=>{const e=document.createElement("p");e.textContent=value;if(role)e.setAttribute("role",role);this.panel.append(e);};
  const button=(id:string,label:string,run:()=>void,disabled=false)=>{const b=document.createElement("button");b.type="button";b.dataset.action=id;b.textContent=label;b.disabled=disabled;b.onclick=run;this.panel.append(b);};
  p(`${settlementClock(v)} · Refeições do castelo: ${v.stock.food}. Reserva protegida: ${ctx.reserve}.`);p(this.message,"status");
  p("Treinos por turnos, sem contagem regressiva. Use toque ou Tab/Enter. Assistência mostra a escolha adequada. Proficiência introdutória tem limite3; não aumenta atributos, XP ou técnicas de combate. O exercício de mana da chegada permanece independente.");
  if(a){
   p(`${a.trainee==="player"?c.character.name:"Guardião"} · ${TRAINING_LABELS[a.exercise]} · ${a.mode==="assisted"?"assistido":"manual"} · etapa ${a.answers.length+1}/${roundCount(a.exercise)} · acertos ${trainingScore(a)}.`);
   const round=trainingRound(a);p(round.cue,"status");if(a.mode==="assisted")p(`Orientação: ${round.choices[round.answer]}.`);
   round.choices.forEach((choice,index)=>button(`answer-${index}`,choice,()=>this.command({type:"answer",choice:index})));
   button("cancel","Encerrar sessão sem concluir · sem reembolso",()=>this.command({type:"cancel"}));
  }else{
   if(ctx.residentGuard&&!s.consent)button("consent","Consultar o guardião sobre formação voluntária",()=>this.command({type:"consent"}));
   const select=(id:string,label:string,options:[string,string][],value:string,changed:(value:string)=>void)=>{const l=document.createElement("label");l.htmlFor=id;l.textContent=label;const el=document.createElement("select");el.id=id;el.dataset.action=id;for(const [value,text]of options){const o=document.createElement("option");o.value=value;o.textContent=text;el.append(o);}el.value=value;el.onchange=()=>{changed(el.value);this.draw();};this.panel.append(l,el);};
   select("trainee","Participante",[["player",c.character.name],...(ctx.residentGuard&&s.consent?[["survivor-guard","Guardião"] as [string,string]]:[])],this.trainee,value=>{this.trainee=value as Trainee;if(this.trainee==="player"&&this.exercise==="assessment")this.exercise="sword";});
   select("exercise","Exercício",[["sword","Guarda com espada"],["mana","Circulação de mana"],...(this.trainee==="survivor-guard"?[["assessment","Avaliação prática de guarda"] as [string,string]]:[])],this.exercise,value=>{this.exercise=value as Exercise;if(this.exercise==="assessment"&&this.mode==="delegated")this.mode="assisted";});
   select("mode","Modo",[["manual","Por turnos · até +2proficiência"],["assisted","Assistido · +1proficiência"],...(this.exercise!=="assessment"?[["delegated","Delegado · +1proficiência, 2períodos"] as [string,string]]:[])],this.mode,value=>this.mode=value as TrainingMode);
   const cmd:TrainingCommand={type:"start",trainee:this.trainee,exercise:this.exercise,mode:this.mode},problem=trainingProblem(s,cmd,ctx);
   p(this.exercise==="assessment"?"Avaliação:3decisões, aprovação com2acertos, -2refeições/+1período. Confere proteção do aliado e armamento próprio do guardião; não é um novo minigame de liderança.":"Exercício:6sinais. Manual:4acertos dão +2proficiência, abaixo disso +1. Assistido/delegado dão +1. Custo:1refeição e1período (delegado:2). Fadiga+1 e máximo2sessões por participante/dia.");if(problem)p(problem);
   button("start","Iniciar atividade de formação",()=>this.command(cmd),!!problem);
   const rest:TrainingCommand={type:"rest",trainee:this.trainee},restProblem=trainingProblem(s,rest,ctx);
   button("rest","Descansar participante · 1 refeição + 2 períodos",()=>this.command(rest),!!restProblem);
  }
  for(const id of ["player","survivor-guard"] as const){if(id!=="player"&&!ctx.residentGuard)continue;const t=s.progress[id];p(`${id==="player"?c.character.name:"Guardião"}: guarda${t.sword}/3 · mana${t.mana}/3 · fadiga${t.fatigue}/2 · avaliação${t.assessed?"aprovada":"pendente"}.`);}
  const needs=championRequirements(s,ctx.residentGuard,contactTrust(c.contact));p(needs.length?`Elegibilidade do guardião: ${needs.join("; ")}.`:"Guardião elegível para futura nomeação de campeão: consentimento, confiança, guarda, avaliação e descanso conferidos. Uma vaga inicial está disponível. A nomeação e a entrada na equipe tática ainda não são realizadas nesta versão.");
  if(!ctx.residentGuard)p("A formação pessoal continua disponível sem o guardião. Outros civis, crianças e ferido não são selecionados para formação militar nesta fatia.");
  for(const report of s.reports)p(report);
  button("back","Voltar ao castelo",()=>this.scene.start("Castle",{campaign:c}),!!a);button("menu","Voltar ao menu",()=>this.scene.start("Boot"));p(this.saved);
  if(focus)this.panel.querySelector<HTMLElement>(`[data-action="${focus}"]`)?.focus({preventScroll:true});this.panel.scrollTop=scroll;
 }
}
