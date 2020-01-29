/*
	Helper class. Contains different helper functions that are used throughout the game.
*/

export class Helper {
	private colour : string[] = ["none", "yellow", "red", "green", "blue"];
	private power_ups : string[] = ["leaf", "flower", "bomb", "drop"];

	/*
		Return a random power up from the array above, assuming an equal weight
		for all of them. Could return "none" as well. 30% chance in total, that
		a power up will be selected, 70% chance for no power up.
	*/
	get_power_up(num: number) : string {
		if (num >= 0.00 && num <= 0.10) {
			return this.power_ups[0];
		}
		else if (num > 0.10 && num <= 0.20) {
			return this.power_ups[1];
		}
		else if (num > 0.20 && num <= 0.30) {
			return this.power_ups[2];
		}
		else if (num > 0.30 && num <= 0.40) {
			return this.power_ups[3];
		}
		else {
			return "none";
		}
	}

	/*
		Return a random colour from the array above. Each colour is weigthed 
		differently based on how easy / hard it is to destroy the colour.
	*/
	get_colour(num : number) : string {
		//50% chance for yellow
		if (num >= 0.00 && num <= 0.50) {
	        return this.colour[1];
	    }
	    //25% chance for red
	    else if (num > 0.50 && num <= 0.75) {
	        return this.colour[2];
	    }
	    //15% chance for green
	    else if (num > 0.75 && num <= 0.90) {
	        return this.colour[3];
	    }
	    //10% chance for blue
	    else if (num > 0.90 && num <= 1.00) {
	        return this.colour[4];
	    }
	}
}