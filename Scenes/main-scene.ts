import * as Phaser from 'phaser';
import {Ball} from './../Objects/ball';
import {Paddle} from "./../Objects/paddle";
import {Brick} from "./../Objects/brick";
import {Helper} from "./../Helpers/helper";

export class BrickOut extends Phaser.Scene {
	private bricks : Array<Brick> = [];
	private paddle : Paddle;
	private ball : Ball;
	private score_text : Phaser.GameObjects.Text;
	private score : number;
	private lives_text : Phaser.GameObjects.Text;
	private lives : number;
	private full_reset : boolean;
	private helper : Helper = new Helper();

	/*
		Load all assets into the game for use
	*/
	preload() : void {
		let assets : Array<string> = ["bomb", "frozen_paddle", "red_brick", "super_bar", "you_win", "you_lose", "flower", "drop", "leaf", "blue_brick", "yellow_brick", "green_brick", "ball", "paddle", "background"];
		for (var i = 0; i < assets.length; i++) {
			this.load.image(assets[i], "Assets/" + assets[i] + ".png");
		}
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	}

	create() : void {
		this.physics.world.setBounds(65, 65, 715, 1275, true, true, true, false);
		
		//Initialize all UI elements (Background, Score, Lives etc.)
		this.init_UI();

		//Initialize the paddle
		this.paddle = new Paddle({scene: this, x: 356, y: 1230, key: 'paddle'});
		this.paddle.init();

		//Initialize the ball
		this.ball = new Ball({scene: this, x: this.paddle.x + 51.5, y: this.paddle.y - 50, key: 'ball'});
		this.ball.init();

		//Add a collider between the ball and the paddle
		this.physics.add.collider(this.ball, this.paddle, this.hit_paddle, null, this);

		//Generate the brick board
		this.init_bricks();
	}

	/*	
		Randomly generate a brick board with different colours and power-ups.
	*/	
	init_bricks() : void {
		//Starting position of the bricks.
		let brick_x : number = 132;
	    let brick_y : number = 150;

	    let brick_colour : string;

	    for (var i = 0; i < 5; i++) {
	        for (var j = 0; j < 9; j++) {
	        	//Get random colour and generate brick
	        	brick_colour = this.helper.get_colour(Math.random());
	            let brick = new Brick({scene: this, x: brick_x, y: brick_y, key: brick_colour + "_brick"});
	            brick.init(this.ball);
	            this.bricks.push(brick);

	            //Add a collider between the ball and the brick
	            this.physics.add.collider(this.ball, brick, this.hit_brick, null, this);
	            brick_x += 64;
	        }
	        brick_x = 132;
	        brick_y += 32;
	    }
	}

	/*
		Initializes the UI elements of the scene, including the score text,
		lives and background.
	*/
	init_UI() : void {
		this.full_reset = false;
		this.add.image(0, 0, 'background').setOrigin(0, 0);
		
		this.score = 0;
    	this.lives = 3;

    	//Delayed call to ensure that the font has loaded properly!
    	this.time.delayedCall(500, function () {
    		this.score_text = this.add.text(350, 20, "Score: " + this.score, {fill: "#fbd063", font : "30px Baloo Bhai", stroke : "#42210b", strokeThickness: "5"});
    		this.lives_text = this.add.text(360, 1345, "Lives: " + this.lives, {fill: "#fbd063", font : "30px Baloo Bhai", stroke : "#42210b", strokeThickness: "5"});
    	}, [], this);
	}

	/*
		Called in every frame. Checks if the ball is out of the boundary
		area and deducts a life accordingly. If all lives are lost then
		calls lose(). Also calls the input_manager().
	*/
	update() : void {
		this.input_manager();
		if (this.ball.out_of_bounds()) {
			if (--this.lives == 0)
				this.lose();
			else
				this.reset_game();
		}
	}

	/*
		Main input manager. Allows for the paddle to be dragged and the
		ball to be shot from it.
	*/
	input_manager() : void {
		//Allows the paddle to be dragged
		this.paddle.on('drag', (pointer) => {
			this.paddle.input_callback(pointer, this.ball);
		});

		//When clicked on the paddle, it shoots the ball if not already in motion
		this.paddle.on('pointerup', (pointer) => {
			this.ball.input_callback(pointer);
		});
	}

	/*
		Callback invoked on collision between a brick and a ball.
		Updates score and checks for the win condition accordingly.
	*/
	hit_brick(ball : Ball, brick : Brick) : void {
		this.score += brick.hit();
		this.score_text.setText("Score: " + this.score);
		if (this.check_win())
			this.win();
	}

	/*
		Returns false when an active brick is found in the scene.
		Otherwise returns true, which is the win condition since all 
		bricks are inactive or dead.
	*/
	check_win() : boolean {
		let i : integer;
		for (i = 0; i < this.bricks.length; i++) {
			if (!this.bricks[i].is_dead())
				return false;
		}
		return true;
	}

	/*
		Callback invoked on collision between the ball and the paddle.
	*/
	hit_paddle(ball : Ball, paddle : Paddle) : void {
		ball.hit(paddle);
	}

	/*
		Function to be called when the game is lost. Disables input on the 
		paddle so it cannot be moved. Also adds a retry image and button
		to the scene which restarts the game.
	*/
	lose() : void {
		this.full_reset = true;

		//Disable input on the paddle so it can't be moved.
		this.paddle.removeInteractive();

		//Add a retry button
		let retry : Phaser.GameObjects.Image = this.physics.add.sprite(60, 460, "you_lose").setOrigin(0, 0).setInteractive();
		retry.on('pointerup', () => {
			this.paddle.setInteractive({draggable: true});
			retry.destroy();
		});
	}

	/*
		Reset the game. Reinitialize all UI elements and reset the bricks, 
		the ball and the paddle to their original state in the beginning.
	*/
	reset_game() : void {
		this.lives_text.setText("Lives: " + (this.lives));

		//Only reset UI elements when all lives are lost
	    if (this.full_reset) {
	        this.lives = 3;
	        this.score = 0;
	        this.score_text.setText("Score: " + this.score);
	        this.lives_text.setText("Lives: " + this.lives);
	        this.full_reset = false;
	        for (var i = 0; i < this.bricks.length; i++) {
	   			this.bricks[i].reset();
	        }
	    }

	    this.paddle.reset();
	    this.ball.reset(this.paddle.x);
	}

	/*
		Function to be called when the game is won. Disables the ball and 
		paddle and adds a win image to the screen.
	*/
	win() : void {
		let sprite : Phaser.GameObjects.Image;
		sprite = this.add.image(60, 460, "you_win").setOrigin(0, 0).setScale(0);

		this.ball.disable();
		this.paddle.disableBody(true, true);

		//Add a simple tween to the image.
		let tween = this.tweens.add({
	        targets: sprite,
	        scale: 1,
	        ease: 'linear',
	        duration: 500,
	        yoyo: false
    	});
	}
}




