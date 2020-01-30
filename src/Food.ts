import {TMatrix} from "./types";

class Food {
	foodPosition: number[] = [];
	availablePosition: TMatrix = [[]];

	constructor(private grid: TMatrix, private snake: TMatrix) {
		this.initialPosition();
	}

	private initialPosition() {
		for (let g of this.grid) {
			let flag = true;

			for (let s of this.snake) {
				if (s[0] === g[0] && s[1] === g[1]) {
					flag = false;
					break;
				}
			}

			if (flag) {
				this.availablePosition.push(g);
			}
		}

		this.foodPosition = this.availablePosition[Math.floor(Math.random() * this.availablePosition.length)];
	}
}

export default Food;