import * as Phaser from 'phaser';
import {Paddle} from "./paddle";

export class Ball extends Phaser.Physics.Arcade.Sprite {
	private on_paddle : boolean; //To check if the ball is on the paddle.

	/*
		Adds the object to the current scene.
	*/
	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		this.on_paddle = true;
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
	}

	/*	
		Set different properties of the ball and assign it a name.
	*/
	init() : void {
		this.setOrigin(0, 0);
		this.setCollideWorldBounds(true);
    	this.setBounce(1, 1);
    	this.setName("Ball");
	}

	/*
		Check if ball is currently out of bounds. Called in scene.update().
	*/
	out_of_bounds() : boolean {
		return this.y >= 1270;
	}

	/*
		Activates body and makes it interactable again.
	*/
	reset(paddle_x : number) : void {
		this.shrink();
		this.setVelocity(0, 0);
		this.on_paddle = true;
		this.enableBody(false, 0, 0, true, true);
		this.setPosition(paddle_x + 51, 1180);
	}

	/*
		Removes the paddle body from the scene.
	*/
	disable() : void {
		this.disableBody(true, true);
	}

	/*
		Contains logic for what to do when the ball hits the paddle.
	*/
	hit(paddle : Paddle) : void {
		var diff : number = 0;

		//Check position of ball w.r.t. the paddle.
	    diff = Math.abs(this.x - paddle.x);

	    //Ball hit at a position before the center of the paddle.
	    if (diff < 64 * paddle.scaleX)
	    {	
	        this.setVelocityX(-5 * (diff + (64 * paddle.scaleX)));
	    }
	    //Ball hit at a position after the center of the paddle.
	    else if (diff >= 64 * paddle.scaleX)
	    {
	        this.setVelocityX(5 * diff);
	    }
	}

	/*
		Input callback for the ball. Contains logic to shoot the ball.
	*/
	input_callback(pointer) : void {
		if (this.on_paddle)
        {
        	//Randomize the direction in which the ball shoots.
        	let x : number = Math.random() * 100;
        	let y : number = Math.pow(-1, Math.floor(x));
            this.setVelocity(x*y, -600);
            this.on_paddle = false;
        }
	}

	is_on_paddle() : boolean {
		return this.on_paddle;
	}

	/*
		Enlarges the ball
	*/
	enlarge() : void {
		this.setScale(2.5);
	}

	/*
		Shrinks the ball to its original size.
		This function is not supposed to actually 'shrink' the ball, 
		it is used only in conjunction with enlarge().
	*/
	shrink() : void {
		this.setScale(1);
	}
}