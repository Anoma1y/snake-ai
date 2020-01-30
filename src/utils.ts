import { TMatrix } from "./types";

export function renderGrid(width: number, height: number): TMatrix {
	const GRID: TMatrix = [];

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			GRID.push([i, j]);
		}
	}

	return GRID;
}

export function getAffordableFoodCells(GRID: TMatrix, SNAKE: TMatrix) {
	const AFFORDABLE_FOOD_CELLS: TMatrix = [];

	for (let g = 0; g < GRID.length; g++) {
		const grid: number[] = GRID[g];
		let flag = true;

		for (let s = 0; s < SNAKE.length; s++) {
			const snake = SNAKE[s];

			if (snake[0] === grid[0] && snake[1] === grid[1]) {
				flag = false;
				break;
			}
		}

		if (flag) {
			AFFORDABLE_FOOD_CELLS.push(grid);
		}
	}

	return AFFORDABLE_FOOD_CELLS;
}

export function mergeOptions<T extends object>(master: T, slaves: T): T {
	return Object.assign(master, slaves);
}