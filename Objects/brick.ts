import * as Phaser from 'phaser';
import {Power_Up} from "./power_up";
import {Paddle} from "./paddle";
import {Helper} from "./../Helpers/helper";

export class Brick extends Phaser.Physics.Arcade.Sprite {

	private colour : string[] = ["none", "pink", "yellow", "green", "red", "blue"];
	private power_ups : string[] = ["enlarge", "multi_ball", "invulnerable"];
	private current_colour : string;
	private original_colour : string;
	private helper : Helper;
	private power : Power_Up;
	private dead : boolean; 

	constructor(params) {
		super (params.scene, params.x, params.y, params.key);
		this.current_colour = params.key.replace("_brick", "");
		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);
		this.helper = new Helper();
		this.dead = false;
	}

	init() : void {
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

	apply_power(power: Power_Up, paddle : Paddle) : void {
		this.power.apply(paddle);
	}

	update() : void {

	}

	reset() : void {
		this.setTexture(this.original_colour + "_brick");
		this.current_colour = this.original_colour;
	    this.enableBody(false, 0, 0, true, true);

	    if (this.power)
	    	this.power.reset();
	}

	disable() : void {
		this.disableBody(true, true);
		this.dead = true;
	}

	is_dead() : boolean {
		return this.dead;
	}

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