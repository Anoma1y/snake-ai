import {TDimesions, TMatrix} from "./types";

class Snake {
	public snake: TMatrix;

	constructor(private gridDimensions: TDimesions) {
		const { width, height } = gridDimensions;

		this.snake = [[Math.floor(Math.random() * width), Math.floor(Math.random() * height)]];
	}
}

export default Snake;