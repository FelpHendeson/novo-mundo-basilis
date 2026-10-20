import Phaser from 'phaser';
import type {UnitClass} from '../game/model';
export class BootScene extends Phaser.Scene{
 constructor(){super('Boot');}
 create(){
  this.cameras.main.setBackgroundColor('#122129');
  this.add.text(384,95,'NOVO MUNDO',{fontFamily:'Georgia',fontSize:'42px',color:'#e5d4a8'}).setOrigin(.5);
  this.add.text(384,153,'B A S I L I S',{fontFamily:'Georgia',fontSize:'30px',color:'#b7d9c1'}).setOrigin(.5);
  this.add.text(384,200,'PRÓLOGO · A OUTRA MARGEM',{fontSize:'16px',color:'#a8c4b6'}).setOrigin(.5);
  let name='Viajante',race='Humano',cls:UnitClass='Guerreiro',ri=0,ci=0;
  const races=['Humano','Elfo','Anão','Teriano','Draconiano','Demoniano'],classes:UnitClass[]=['Guerreiro','Mago','Ladino'];
  const field=(y:number,label:string,fn:(text:Phaser.GameObjects.Text)=>void)=>{const text=this.add.text(384,y,label,{fontFamily:'monospace',fontSize:'21px',color:'#fff0d0',backgroundColor:'#263b40',padding:{x:18,y:10}}).setOrigin(.5).setInteractive({useHandCursor:true});text.on('pointerdown',()=>fn(text));return text;};
  field(265,'NOME: Viajante [editar]',t=>{const entered=window.prompt('Nome do personagem (até 16 caracteres):',name);if(entered!==null){name=entered.trim().slice(0,16)||'Viajante';t.setText('NOME: '+name+' [editar]');}});
  field(322,'RAÇA: Humano [trocar]',t=>{race=races[++ri%races.length];t.setText('RAÇA: '+race+' [trocar]');});
  field(379,'CLASSE: Guerreiro [trocar]',t=>{cls=classes[++ci%classes.length];t.setText('CLASSE: '+cls+' [trocar]');});
  field(460,'INICIAR EXPEDIÇÃO',()=>this.scene.start('Battle',{name,race,cls}));
  this.add.text(384,532,'Versão técnica 0.1 · atributos raciais ainda não implementados',{fontSize:'13px',color:'#869d95'}).setOrigin(.5);
 }
}
