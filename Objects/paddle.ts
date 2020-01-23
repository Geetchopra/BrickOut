import * as Phaser from 'phaser';
import {Ball} from './ball';

export class Paddle extends Phaser.Physics.Arcade.Sprite {
	/*
		Adds the object to the current scene.
	*/
	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
	}

	/*	
		Set different properties of the paddle and assign it a name.
	*/
	init() : void {
		this.setOrigin(0, 0);
		this.setCollideWorldBounds(true);
    	this.setImmovable();
    	this.setInteractive({draggable: true});
    	this.setName("Paddle");
	}

	/*
		Activates the body of the paddle to make it visible and interactable again.
	*/
	reset() : void {
		this.enableBody(false, 0, 0, true, true);
	}

	/*
		Removes the paddle body from the scene.
	*/
	disable() : void {
		this.disableBody(true, true);
	}

	/*
		Input callback for the paddle. Contains logic to keep the paddle 
		position inside the board always and move the ball with the paddle.
	*/
	input_callback(pointer, ball : Ball) : void {
		this.x = Phaser.Math.Clamp(pointer.x-64, 65, 840 - 80 - 128);
        if (ball.is_on_paddle())
        {
            ball.x = this.x+51;
        }
	}

	/*
		Horiontally enlarges the paddle
	*/
	enlarge() : void {
		this.setScale(2, 1);
	}

	/*
		Horizontally shrinks the paddle to its original size.
		This function is not supposed to actually 'shrink' the paddle, 
		it is used only in conjunction with enlarge().
	*/
	shrink() : void {
		this.setScale(1, 1);
	}
}