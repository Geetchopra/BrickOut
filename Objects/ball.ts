import * as Phaser from 'phaser';

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
		Logic for what to do when the ball hits the paddle.
		Used same math logic as the Breakout game at 
		https://phaser.io/examples/v3/view/games/breakout/breakout
	*/
	hit(paddle_x : number) : void {
		var diff : number = 0;
	    if (this.x < paddle_x)
	    {
	        diff = paddle_x - this.x;
	        this.setVelocity(-5 * diff, this.body.velocity.y);
	    }
	    else if (this.x >= paddle_x)
	    {
	        diff = this.x - paddle_x;
	        this.setVelocity(5 * diff, this.body.velocity.y);
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