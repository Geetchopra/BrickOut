import * as Phaser from 'phaser';
import {Paddle} from "./paddle";
import {Ball} from "./ball";

export class Power_Up extends Phaser.Physics.Arcade.Sprite {
	private original_x : number; //For resetting its x position
	private original_y : number; //For resetting its y position
	private power_type : string; //String keyword of the type of power up

	/*
	Adds the object to the current scene. Also initializes key attributes.
	*/
	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
		this.original_x = params.x;
		this.original_y = params.y;
		this.power_type = params.key;
	}

	/*
		Sets the scale to 65% (Artistic need).
	*/
	init() : void {
		this.setOrigin(0, 0);
		this.setScale(0.65);
	}

	/*
		Sets its position to be the same as the starting position and enables 
		the body.
	*/
	reset() : void {
		this.setVelocity(0, 0);
		this.setPosition(this.original_x, this.original_y);
		this.enableBody(false, 0, 0, true, true);
	}

	get_type() : string {
		return this.power_type;
	}

	get_position() : [number, number] {
		return [this.original_x, this.original_y];
	}

	/*
		Sets a downward velocity so that the power up "drops"
	*/
	drop() : void {
		this.setVelocityY(400);
	}

	/*
		Removes the paddle body from the scene.
	*/
	disable() : void {
		this.disableBody(true, true);
	}

	/*
		Apply a power up. Performs the required operations based on the type 
		of power up.
		Leaf - Enlarges paddle for 10 seconds.
		Flower - Grants invulnerability, i.e. creates a bar on the screen spanning
		the length of the entire board.
		More under development!!
	*/
	apply(paddle : Paddle) : void {
		this.disable();
		if (this.power_type == "leaf") {
			paddle.enlarge();
			this.scene.time.delayedCall(10000, function () {
				paddle.shrink();
			}, [], this.scene);
		}
		else if (this.power_type == "flower") {
			let bar = this.scene.physics.add.sprite(60, 1265, "super_bar").setOrigin(0,0);
			this.scene.physics.add.collider(this.scene.children.getByName("Ball"), bar, null, null, this);
    		bar.setImmovable();
    		this.scene.time.delayedCall(10000, function () {
				bar.destroy();
			}, [], this.scene);
		}
	}

}