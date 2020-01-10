import * as Phaser from 'phaser';
import {Paddle} from "./paddle";
import {Ball} from "./ball";

export class Power_Up extends Phaser.Physics.Arcade.Sprite {

	private original_x : number;
	private original_y : number;
	private power_type : string;

	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);

		this.original_x = params.x;
		this.original_y = params.y;
		this.power_type = params.key;

	}

	init() : void {
		this.setOrigin(0, 0);
		this.setScale(0.65);
		
	}

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

	drop() : void {
		this.setVelocityY(400);
	}

	disable() : void {
		this.disableBody(true, true);
	}

	apply(paddle : Paddle) : void {
		this.disable();
		if (this.power_type == "enlarge") {
			paddle.enlarge();
			this.scene.time.delayedCall(10000, function () {
				paddle.shrink();
			}, [], this.scene);
		}
		else if (this.power_type == "invulnerable") {
			let bar = this.scene.physics.add.sprite(0, 1230, "super_bar").setOrigin(0,0);
			this.scene.physics.add.collider(this.scene.children.getByName("Ball"), bar, null, null, this);
    		bar.setImmovable();
    		this.scene.time.delayedCall(10000, function () {
				bar.destroy();
			}, [], this.scene);
		}
	}

}