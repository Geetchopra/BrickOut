import {BrickOut} from "./Scenes/main-scene";
import * as Phaser from 'phaser';

var config : Phaser.Types.Core.GameConfig = {
    title: "BrickOut",
    type: Phaser.AUTO,
    width: 840,
    height: 1400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [BrickOut]
};

var game = new Phaser.Game(config);

