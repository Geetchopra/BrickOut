import * as Phaser from 'phaser';

export class Paddle extends Phaser.Physics.Arcade.Sprite {

	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
	}

	init() : void {
		this.setOrigin(0, 0);
		this.setCollideWorldBounds(true);
    	this.setImmovable();
    	this.setInteractive({draggable: true});
    	this.setName("Paddle");
	}

	update() : void {

	}

	reset() : void {
		this.setVelocity(0, 0);
		this.enableBody(false, 0, 0, true, true);
	}

	disable() : void {
		this.disableBody(true, true);
	}

	input_callback(pointer, ball) : void {
		this.x = Phaser.Math.Clamp(pointer.x-64, 0, 720-128);
        if (ball.is_on_paddle())
        {
            ball.x = this.x+51;
        }
	}

	enlarge() : void {
		this.setScale(this.scaleX + 1, this.scaleY);
	}

	shrink() : void {
		this.setScale(this.scaleX - 1, this.scaleY);
	}

}