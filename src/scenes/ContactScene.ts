import { canMeetContact } from "../game/travel";
import Phaser from "phaser";
import { campaignStartScene, type Campaign } from "../game/campaign";
import { beginContact, type ContactOpening } from "../game/contact";
import { renderContactUI } from "../ui/contactUI";
import { saveCampaign } from "../game/persistence/save";
export class ContactScene extends Phaser.Scene {
  private campaign!:Campaign;
  private panel!:HTMLElement;
  private revision=0;
  private feedback="";
  private saveMessage="Salvando checkpoint…";
  constructor(){super("Contact");}
  init(data:{campaign:Campaign}){this.campaign=data.campaign;this.feedback="";this.saveMessage="Salvando checkpoint…";}
  create(){
    const c=this.campaign;
    if(!canMeetContact(c)){this.scene.start(campaignStartScene(c),{campaign:c});return;}
    c.contact.seen=true;
    this.cameras.main.setBackgroundColor("#283f39");
    const g=this.add.graphics();
    for(let y=0;y<18;y++)for(let x=0;x<24;x++)g.fillStyle((x+y)%2?0x476953:0x54765d).fillRect(x*32,y*32,32,32);
    g.fillStyle(0x938469).fillRect(0,350,768,115);
    for(let i=0;i<12;i++){
      const x=440+(i%4)*58,y=225+Math.floor(i/4)*62;
      g.fillStyle([0x7e9797,0xa58a68,0x8b829a,0x7b976f][i%4]).fillRect(x-12,y,24,30);
      g.fillStyle(0xcbb18e).fillRect(x-8,y-16,16,16);
      g.fillStyle(0x354348).fillRect(x-10,y+28,8,14).fillRect(x+2,y+28,8,14);
    }
    g.fillStyle(0x8198b1).fillRect(290,305,36,55);g.fillStyle(0xcbb18e).fillRect(298,281,20,24);
    g.lineStyle(5,0xd6d3bd).lineBetween(278,292,278,354);
    this.add.text(384,470,"VOZES NA TRILHA",{fontFamily:"Georgia",fontSize:"26px",color:"#e5d4a8"}).setOrigin(0.5);
    this.add.text(384,530,"Representação provisória · um grupo com suas próprias decisões",{fontSize:"14px",color:"#dce6d5"}).setOrigin(0.5);
    this.panel=document.createElement("section");this.panel.id="contact-ui";this.panel.setAttribute("aria-label","Primeiro contato com sobreviventes");
    document.querySelector("#app")!.append(this.panel);
    this.events.once("shutdown",()=>{this.revision++;this.panel.remove();});
    this.render();this.persist();
  }
  private persist(){
    const revision=++this.revision;this.saveMessage="Salvando checkpoint…";
    void saveCampaign(this.campaign).then(ok=>{
      if(revision!==this.revision || !this.scene.isActive())return;
      this.saveMessage=ok?"Checkpoint salvo neste navegador.":"Não foi possível salvar. As decisões continuam nesta sessão.";this.render();
    });
  }
  private start(opening?:ContactOpening){
    const c=this.campaign;
    if(opening && !beginContact(c.contact,opening))return;
    if(c.contact.combat==="active"){
      this.persist();this.scene.start("Battle",{...c.character,campaign:c,mission:"contact"});
    }else{this.render();this.persist();}
  }
  private render(){renderContactUI(this.panel,this.campaign,message=>{this.feedback=message??"";this.render();this.persist();},opening=>this.start(opening),()=>this.scene.start("Exploration",{campaign:this.campaign}),this.feedback,this.saveMessage);}
}
