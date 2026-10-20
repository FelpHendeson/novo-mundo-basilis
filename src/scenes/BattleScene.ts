import Phaser from 'phaser';
import { WIDTH,HEIGHT,TERRAIN,TECHNIQUES,dist,damage,makeUnits,reachable,type Unit,type UnitClass,type Technique } from '../game/model';
const CELL=48,X0=48,Y0=68;
type Phase='idle'|'move'|'action'|'skills'|'target'|'enemy'|'ended';
export class BattleScene extends Phaser.Scene{
 private units:Unit[]=[];private hero='Viajante';private heroClass:UnitClass='Guerreiro';private race='Humano';
 private selected:Unit|null=null;private skill:Technique|null=null;private phase:Phase='idle';private turn=1;private note='Clique em uma unidade azul.';
 private graphics!:Phaser.GameObjects.Graphics;private overlay:Phaser.GameObjects.GameObject[]=[];private status!:Phaser.GameObjects.Text;
 private cursor={x:1,y:4};private result='';
 constructor(){super('Battle');}
 init(data:{name:string;cls:UnitClass;race:string}){this.hero=data.name||'Viajante';this.heroClass=data.cls||'Guerreiro';this.race=data.race||'Humano';this.units=makeUnits(this.hero,this.heroClass);this.selected=null;this.skill=null;this.phase='idle';this.turn=1;this.result='';this.note='Clique em uma unidade azul.';}
 create(){
  this.cameras.main.setBackgroundColor('#152229');
  this.add.text(48,20,'BASILIS  /  RUÍNAS DA FRONTEIRA',{fontFamily:'monospace',fontSize:'21px',color:'#e5d4a8'});
  this.graphics=this.add.graphics();
  this.status=this.add.text(48,475,'',{fontFamily:'monospace',fontSize:'15px',color:'#e2f0e0'});
  this.add.text(48,550,'Clique no tabuleiro · Setas/WASD + Enter · ESC cancela · E encerra o turno',{fontSize:'13px',color:'#a4b4ac'});
  this.input.on('pointerdown',(pointer:Phaser.Input.Pointer,over:Phaser.GameObjects.GameObject[])=>{if(over.length)return;const x=Math.floor((pointer.x-X0)/CELL),y=Math.floor((pointer.y-Y0)/CELL);if(x>=0&&x<WIDTH&&y>=0&&y<HEIGHT){this.cursor={x,y};this.confirm();}});
  this.input.keyboard?.on('keydown',(event:KeyboardEvent)=>this.handleKey(event));
  this.redraw();
 }
 private button(y:number,label:string,callback:()=>void){
  const btn=this.add.text(638,y,label,{fontFamily:'monospace',fontSize:'14px',color:'#fff0d2',backgroundColor:'#26434d',padding:{x:10,y:10}}).setInteractive({useHandCursor:true});
  btn.on('pointerdown',callback);this.overlay.push(btn);
 }
 private redraw(){
  this.graphics.clear();this.overlay.forEach(item=>item.destroy());this.overlay=[];
  const moves=this.phase==='move'&&this.selected?reachable(this.selected,this.units):new Set<string>();
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
   const t=TERRAIN[y][x],color=t===2?0x525865:t===1?0x2e644e:(x+y)%2?0x57785e:0x68886d;
   this.graphics.fillStyle(color).fillRect(X0+x*CELL,Y0+y*CELL,CELL-2,CELL-2);
   if(t===2){this.graphics.fillStyle(0x9d9d9f).fillTriangle(X0+x*CELL+9,Y0+y*CELL+37,X0+x*CELL+25,Y0+y*CELL+9,X0+x*CELL+39,Y0+y*CELL+37);}
   if(t===1){this.graphics.fillStyle(0x214d3b).fillCircle(X0+x*CELL+22,Y0+y*CELL+21,13);}
   if(moves.has(x+','+y))this.graphics.fillStyle(0xbadfff,.24).fillRect(X0+x*CELL+3,Y0+y*CELL+3,CELL-8,CELL-8);
  }
  for(const u of this.units.filter(u=>u.hp>0)){
   const cx=X0+u.x*CELL+24,cy=Y0+u.y*CELL+21;
   this.graphics.fillStyle(u.team==='ally'?(u.acted?0x526782:0x3767b9):0xa04144).fillCircle(cx,cy,16);
   this.graphics.lineStyle(2,u.team==='ally'?0xc0d5ff:0xf4c4b5).strokeCircle(cx,cy,16);
   this.graphics.fillStyle(0x222b2b).fillRect(cx-19,cy+19,38,6);
   this.graphics.fillStyle(u.team==='ally'?0x8ad77d:0xeab27b).fillRect(cx-18,cy+20,36*u.hp/u.maxHp,4);
   const label=this.add.text(cx,cy,u.cls==='Mago'?'M':u.cls==='Ladino'?'L':'G',{fontFamily:'monospace',fontSize:'17px',color:'#ffffff'}).setOrigin(.5);this.overlay.push(label);
  }
  this.graphics.lineStyle(3,0xf8d77f).strokeRect(X0+this.cursor.x*CELL+1,Y0+this.cursor.y*CELL+1,CELL-4,CELL-4);
  this.status.setText('Turno '+this.turn+' · '+this.units.filter(u=>u.team==='ally'&&u.hp>0).length+' aliados / '+this.units.filter(u=>u.team==='enemy'&&u.hp>0).length+' inimigos\n'+this.note);
  if(this.phase==='action'){this.button(87,'Técnicas',()=>{this.phase='skills';this.redraw();});this.button(130,'Esperar',()=>this.finish());this.button(173,'Cancelar',()=>this.cancel());}
  if(this.phase==='skills'&&this.selected){TECHNIQUES[this.selected.cls].forEach((t,i)=>this.button(87+i*43,t.name+' ('+t.cost+' EN)',()=>{if(!this.selected)return;if(this.selected.ep<t.cost){this.note='Energia insuficiente';this.redraw();return;}this.skill=t;this.phase='target';this.note='Selecione um inimigo no alcance '+t.range+'.';this.redraw();}));this.button(87+TECHNIQUES[this.selected.cls].length*43,'Voltar',()=>{this.phase='action';this.redraw();});}
  if(this.phase==='ended'){this.button(87,'Reiniciar',()=>this.scene.restart({name:this.hero,cls:this.heroClass,race:this.race}));this.button(130,'Personagem',()=>this.scene.start('Boot'));}
 }
 private handleKey(e:KeyboardEvent){
  if(this.phase==='enemy'||this.phase==='ended')return;
  const map:Record<string,[number,number]>={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
  const step=map[e.key];if(step){e.preventDefault();this.cursor.x=Phaser.Math.Clamp(this.cursor.x+step[0],0,WIDTH-1);this.cursor.y=Phaser.Math.Clamp(this.cursor.y+step[1],0,HEIGHT-1);this.redraw();}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();this.confirm();}
  else if(e.key==='Escape')this.cancel();
  else if(e.key.toLowerCase()==='e'&&this.phase==='idle')this.endTurn();
 }
 private cancel(){if(this.phase==='move'||this.phase==='action'){this.phase='idle';this.selected=null;}else if(this.phase==='skills')this.phase='action';else if(this.phase==='target')this.phase='skills';this.note='Ação cancelada.';this.redraw();}
 private confirm(){
  if(this.phase==='idle'){
   const u=this.units.find(u=>u.hp>0&&u.team==='ally'&&!u.acted&&u.x===this.cursor.x&&u.y===this.cursor.y);
   if(u){this.selected=u;this.phase='move';this.note='Escolha uma posição (a posição atual também vale).';}else this.note='Selecione um aliado disponível.';
  }else if(this.phase==='move'&&this.selected){
   if(reachable(this.selected,this.units).has(this.cursor.x+','+this.cursor.y)){this.selected.x=this.cursor.x;this.selected.y=this.cursor.y;this.phase='action';this.note='Escolha uma ação.';}else this.note='Fora do alcance.';
  }else if(this.phase==='target'&&this.selected&&this.skill){
   const target=this.units.find(u=>u.hp>0&&u.team==='enemy'&&u.x===this.cursor.x&&u.y===this.cursor.y);
   if(target&&dist(target,this.selected)<=this.skill.range){const dealt=damage(this.selected,target,this.skill);target.hp=Math.max(0,target.hp-dealt);this.selected.ep-=this.skill.cost;this.note=this.selected.name+' causou '+dealt+' de dano.';this.finish(false);this.checkEnd();}
   else this.note='Alvo inválido ou fora do alcance.';
  }
  this.redraw();
 }
 private finish(draw=true){if(this.selected)this.selected.acted=true;this.selected=null;this.skill=null;this.phase='idle';if(this.units.filter(u=>u.team==='ally'&&u.hp>0).every(u=>u.acted))this.endTurn();else if(draw)this.redraw();}
 private endTurn(){if(this.phase!=='idle')return;this.phase='enemy';this.note='Os inimigos estão agindo...';this.redraw();this.time.delayedCall(350,()=>this.enemyTurn());}
 private enemyTurn(){
  for(const enemy of this.units.filter(u=>u.team==='enemy'&&u.hp>0)){
   const allies=this.units.filter(u=>u.team==='ally'&&u.hp>0).sort((a,b)=>dist(a,enemy)-dist(b,enemy));if(!allies.length)break;
   if(dist(enemy,allies[0])>1){const positions=[...reachable(enemy,this.units)].map(k=>k.split(',').map(Number));positions.sort((a,b)=>dist({x:a[0],y:a[1]},allies[0])-dist({x:b[0],y:b[1]},allies[0]));if(positions.length){enemy.x=positions[0][0];enemy.y=positions[0][1];}}
   const target=this.units.filter(u=>u.team==='ally'&&u.hp>0).sort((a,b)=>dist(a,enemy)-dist(b,enemy))[0];
   if(target&&dist(enemy,target)===1){const d=damage(enemy,target,TECHNIQUES[enemy.cls][0]);target.hp=Math.max(0,target.hp-d);this.note=enemy.name+' atacou '+target.name+' causando '+d+'.';}
  }
  if(this.checkEnd()){this.redraw();return;}
  for(const u of this.units.filter(u=>u.team==='ally'&&u.hp>0)){u.acted=false;u.ep=Math.min(u.maxEp,u.ep+2);}
  this.turn++;this.phase='idle';this.note='Seu turno. Selecione uma unidade.';this.redraw();
 }
 private checkEnd(){if(this.units.every(u=>u.team!=='enemy'||u.hp<=0)){this.phase='ended';this.note='VITÓRIA! A passagem está segura.';return true;}if(this.units.every(u=>u.team!=='ally'||u.hp<=0)){this.phase='ended';this.note='DERROTA. A expedição terminou.';return true;}return false;}
}
