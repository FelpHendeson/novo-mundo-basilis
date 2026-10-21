import { TrainingScene } from "./scenes/TrainingScene";
import { ContactScene } from "./scenes/ContactScene";
import { CastleScene } from "./scenes/CastleScene";
import { CreatureScene } from "./scenes/CreatureScene";
import { ArrivalScene } from "./scenes/ArrivalScene";
import { ExplorationScene } from "./scenes/ExplorationScene";
import "./style.css";
import Phaser from "phaser";
import { CombatScene } from "./scenes/CombatScene";
import { BootScene } from "./scenes/BootScene";
import { BattleScene } from "./scenes/BattleScene";
new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 768,
  height: 576,
  backgroundColor: "#121e22",
  pixelArt: true,
  roundPixels: true,
  scene: [BootScene, ArrivalScene, ExplorationScene, ContactScene, CastleScene, TrainingScene, CreatureScene, BattleScene, CombatScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
});
