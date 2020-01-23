import {BrickOut} from "./Scenes/main-scene";
import * as Phaser from 'phaser';

//Game configuration object
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

//Initialize a new game. This is the entry point for the Phaser app.
var game = new Phaser.Game(config);

