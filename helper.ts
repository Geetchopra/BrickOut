export class Helper {
	private colour : string[] = ["none", "pink", "yellow", "green", "red", "blue"];
	private power_ups : string[] = ["enlarge", "multi_ball", "invulnerable"];

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
		else {
			return "none";
		}
	}

	get_colour(num : number) : string {
		if (num >= 0.00 && num <= 0.30) {
	        return this.colour[1];
	    }
	    else if (num > 0.30 && num <= 0.55) {
	        return this.colour[2];
	    }
	    else if (num > 0.55 && num <= 0.75) {
	        return this.colour[3];
	    }
	    else if (num > 0.75 && num <= 0.90) {
	        return this.colour[4];
	    }
	    else if (num > 0.90 && num <= 1.00) {
	        return this.colour[5];
	    }
	}
}