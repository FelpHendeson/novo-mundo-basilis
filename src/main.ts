import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { BattleScene } from './scenes/BattleScene';
new Phaser.Game({ type:Phaser.AUTO,parent:'game',width:768,height:576,backgroundColor:'#121e22',pixelArt:true,roundPixels:true,scene:[BootScene,BattleScene],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH} });
