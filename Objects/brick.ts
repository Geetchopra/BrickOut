import * as Phaser from 'phaser';
import {Power_Up} from "./power_up";
import {Paddle} from "./paddle";
import {Ball} from "./ball";
import {Helper} from "./../Helpers/helper";

export class Brick extends Phaser.Physics.Arcade.Sprite {
	private colour : string[] = ["none", "yellow", "red", "green", "blue"];
	private current_colour : string; //For keeping track of current state in the game.
	private original_colour : string; //Used for resetting the game. Keeps track of the original state of the brick.
	private helper : Helper;
	private power : Power_Up; //Holds the power up of the brick
	private dead : boolean; 
	private ball : Ball; //Reference to the ball for power up manipulations

	/*
		Adds the object to the current scene. Also initializes key attributes.
	*/
	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		this.current_colour = params.key.replace("_brick", "");
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
		this.helper = new Helper();
		this.dead = false;
	}

	/*
		Initializes different properties of the brick and adds a power up to 
		the brick based on what the helper function returns.
	*/
	init(ball : Ball) : void {
		this.ball = ball;
	    this.original_colour = this.current_colour;
	    this.setOrigin(0, 0);
	    let power_up = this.helper.get_power_up(Math.random());
	    if (power_up != "none") {
	    	this.power =  new Power_Up({scene: this.scene, x: this.x + 22, y: this.y + 6, key: power_up});
	    	this.power.init();
	    	let paddle = this.scene.children.getByName("Paddle");
			this.scene.physics.add.collider(this.power, paddle, this.apply_power, null, this);
	    }
	    this.setImmovable();	    
	}

	/*
		Callback invoked on collision between the paddle and a power up. Calls the 
		apply function of this.power.
	*/
	apply_power(power: Power_Up, paddle : Paddle) : void {
		this.power.apply(paddle, this.ball);
	}

	/*
		Sets the colour to the original colour and makes the brick visible in the scene.
		Also resets the power up if there is one.
	*/
	reset() : void {
		this.setTexture(this.original_colour + "_brick");
		this.current_colour = this.original_colour;
	    this.enableBody(false, 0, 0, true, true);

	    if (this.power)
	    	this.power.reset();
	}

	/*
		Disables the body of the brick and sets it as dead.
	*/
	disable() : void {
		this.disableBody(true, true);
		this.dead = true;
	}

	is_dead() : boolean {
		return this.dead;
	}

	/*
		Main logic describing what happens when a brick is hit.
		Returns a score of 10 if the brick was not destroyed and 35 otherwise. 
	*/
	hit() : number {
		let index : number = this.colour.indexOf(this.current_colour);
		let score : number;

		this.current_colour = this.colour[index-1];

		if (this.current_colour == "none") {
			score = 35;
			this.disable();
			if (this.power)
			 	this.power.drop();
		}
		else {
			score = 10;
			this.setTexture(this.current_colour + "_brick");
		}
		return score;
	}

}