/** Engine-free, bounded training. No combat attributes, equipment or XP are granted here. */
export const TRAINEES=["player","survivor-guard"] as const;
export type Trainee=typeof TRAINEES[number];
export type Exercise="mana"|"sword"|"assessment";
export type TrainingMode="manual"|"assisted"|"delegated";
export type TrainingCommand={type:"consent"}|{type:"start";trainee:Trainee;exercise:Exercise;mode:TrainingMode}|{type:"answer";choice:number}|{type:"cancel"}|{type:"rest";trainee:Trainee};
type Progress={mana:number;sword:number;fatigue:number;day:number;sessions:number;assessed:boolean};
export type TrainingState={consent:boolean;progress:Record<Trainee,Progress>;active:null|{trainee:Trainee;exercise:Exercise;mode:"manual"|"assisted";seed:number;answers:number[]};reports:string[]};
export type TrainingContext={hours:number;food:number;residentGuard:boolean;ready:boolean;reserve:number};
export const newTraining=():TrainingState=>({consent:false,progress:{player:{mana:0,sword:0,fatigue:0,day:0,sessions:0,assessed:false},"survivor-guard":{mana:0,sword:0,fatigue:0,day:0,sessions:0,assessed:false}},active:null,reports:[]});
export const TRAINING_LABELS={mana:"Circulação de mana",sword:"Guarda com espada",assessment:"Avaliação prática de guarda"};
const mana=[{cue:"O fluxo acelera; preserve o circuito sem aumentar a pressão.",choices:["Estabilizar o fluxo","Forçar mais energia","Interromper o circuito"],answer:0}, {cue:"O fluxo está estável; conduza uma pequena porção pelo circuito.",choices:["Forçar mais energia","Conduzir com calma","Interromper o circuito"],answer:1}, {cue:"Há pressão acumulada no circuito; reduza o esforço antes de continuar.",choices:["Forçar mais energia","Acelerar o circuito","Pausar e aliviar a pressão"],answer:2}];
const sword=[{cue:"O boneco sinaliza um golpe alto. Proteja a cabeça mantendo os pés firmes.",choices:["Guarda alta","Guarda média","Guarda baixa"],answer:0},{cue:"O boneco sinaliza uma estocada ao tronco. Feche a linha central sem avançar.",choices:["Guarda alta","Guarda média","Guarda baixa"],answer:1},{cue:"O boneco sinaliza um golpe baixo. Cubra a linha inferior sem se inclinar.",choices:["Guarda alta","Guarda média","Guarda baixa"],answer:2}];
const assessment=[{cue:"Um aliado recua com provisões. Qual postura cobre sua retirada?",choices:["Avançar sozinho","Manter a linha entre ameaça e aliado","Virar as costas"],answer:1},{cue:"O adversário simula um golpe alto. O objetivo é proteger, sem perseguir.",choices:["Cobrir a cabeça e manter posição","Abandonar a posição","Atacar sem guarda"],answer:0},{cue:"A retirada terminou. Como encerrar o exercício com segurança?",choices:["Perseguir o adversário","Continuar golpeando","Baixar a arma ao sinal e conferir o aliado"],answer:2}];
export function trainingRound(a:NonNullable<TrainingState["active"]>,index=a.answers.length){const rounds=a.exercise==="mana"?mana:a.exercise==="sword"?sword:assessment;return rounds[a.exercise==="assessment"?index:(a.seed+index)%rounds.length];}
export const roundCount=(e:Exercise)=>e==="assessment"?3:6;
export const trainingScore=(a:NonNullable<TrainingState["active"]>)=>a.answers.reduce((n,answer,i)=>n+Number(answer===trainingRound(a,i).answer),0);
const available=(s:TrainingState,id:Trainee,c:TrainingContext)=>id==="player"||(c.residentGuard&&s.consent);
export function trainingProblem(s:TrainingState,cmd:TrainingCommand,c:TrainingContext):string|null {
 if(!c.ready)return "Prepare o pátio: posse, ferramentas, portão e dormitório restaurados são necessários.";
 if(cmd.type==="consent")return c.residentGuard&&!s.consent&&!s.active?null:"O guardião não está disponível ou já registrou consentimento.";
 if(cmd.type==="answer")return s.active&&Number.isInteger(cmd.choice)&&cmd.choice>=0&&cmd.choice<=2?null:"Resposta indisponível.";
 if(cmd.type==="cancel")return s.active?null:"Não há sessão em andamento.";
 if(s.active)return "Conclua ou encerre a sessão em andamento antes de iniciar outra atividade.";
 if(!TRAINEES.includes(cmd.trainee)||!available(s,cmd.trainee,c))return "Participante indisponível ou sem consentimento.";
 const p=s.progress[cmd.trainee];
 if(cmd.type==="rest")return p.fatigue>0&&c.food-1>=c.reserve?null:"Descanso exige fadiga e uma refeição além da reserva.";
 if(!["mana","sword","assessment"].includes(cmd.exercise)||!["manual","assisted","delegated"].includes(cmd.mode))return "Exercício ou modo inválido.";
 if(cmd.exercise==="assessment"&&(cmd.trainee!=="survivor-guard"||p.sword<2||p.assessed||cmd.mode==="delegated"))return "Avaliação exige guardião voluntário com guarda2/3; não é delegada nem repetida após aprovação.";
 if(cmd.exercise!=="assessment"&&p[cmd.exercise]>=3)return "Proficiência introdutória já concluída; não há bônus por repetição.";
 if(p.fatigue>=2)return "Fadiga2/2: descanse antes de outra sessão.";
 if(p.day===Math.floor(c.hours/4)&&p.sessions>=2)return "Limite de duas sessões por participante neste dia. O descanso avança dois períodos.";
 const cost=cmd.exercise==="assessment"?2:1;
 return c.food-cost<c.reserve?"Refeições insuficientes além da reserva de assentamento.":null;
}
/** Mutate only after every precondition passes. Costs/time belong to the shared settlement clock. */
export function applyTraining(s:TrainingState,cmd:TrainingCommand,c:TrainingContext):{food:number;periods:number}|null {
 if(trainingProblem(s,cmd,c))return null;
 const report=(text:string)=>{s.reports.push(text);if(s.reports.length>8)s.reports.shift();};
 if(cmd.type==="consent"){s.consent=true;report("Guardião: aceito participar da formação. Isso não me torna seu soldado nem seu campeão.");return {food:0,periods:0};}
 if(cmd.type==="cancel"){report("Sessão encerrada sem proficiência; tempo, refeição e fadiga já usados não retornam.");s.active=null;return {food:0,periods:0};}
 if(cmd.type==="rest"){s.progress[cmd.trainee].fatigue=0;report(`${cmd.trainee==="player"?"Viajante":"Guardião"}: descanso concluído, -1refeição, +2períodos; limite diário preservado.`);return {food:1,periods:2};}
 if(cmd.type==="start") {
  const p=s.progress[cmd.trainee],day=Math.floor(c.hours/4);if(p.day!==day){p.day=day;p.sessions=0;}p.sessions++;p.fatigue++;
  if(cmd.mode==="delegated") {p[cmd.exercise as "mana"|"sword"]=Math.min(3,p[cmd.exercise as "mana"|"sword"]+1);report(`${TRAINING_LABELS[cmd.exercise]} delegado: +1proficiência, -1refeição, +2períodos. Participante ocupado nesse intervalo, já resolvido.`);}
  else s.active={trainee:cmd.trainee,exercise:cmd.exercise,mode:cmd.mode,seed:c.hours%3,answers:[]};
  return {food:cmd.exercise==="assessment"?2:1,periods:cmd.mode==="delegated"?2:1};
 }
 const a=s.active!;a.answers.push(cmd.choice);
 if(a.answers.length===roundCount(a.exercise)) {
  const score=trainingScore(a),p=s.progress[a.trainee];
  if(a.exercise==="assessment"){p.assessed=score>=2;report(`Avaliação: ${score}/3. ${p.assessed?"Guarda, proteção do aliado e armamento próprio conferidos; aptidão prática registrada.":"Rever postura e proteção; nova avaliação pode ser feita após preparo e descanso."}`);}
  else {const gain=a.mode==="manual"&&score>=4?2:1;p[a.exercise]=Math.min(3,p[a.exercise]+gain);report(`${TRAINING_LABELS[a.exercise]}: ${score}/6, +${gain}proficiência (limite3). ${a.mode==="assisted"?"Modo assistido.":"Modo por turnos."} Sem XP ou bônus de atributos.`);}
  s.active=null;
 }
 return {food:0,periods:0};
}
export function championRequirements(s:TrainingState,resident:boolean,trust:number):string[]{
 const p=s.progress["survivor-guard"],needs:string[]=[];
 if(!resident)needs.push("Guardião assentado");if(!s.consent)needs.push("Consentimento de formação");if(trust<2)needs.push("Confiança2");if(p.sword<2)needs.push("Guarda2/3");if(!p.assessed)needs.push("Avaliação prática e armamento próprio conferidos");if(p.fatigue>0)needs.push("Descanso após a avaliação");return needs;
}
