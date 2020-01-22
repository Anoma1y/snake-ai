import './style.css';
import { TMatrix, TNextPosition } from './types';
import { GRID_COLOR, GRID_MARGIN, GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';
import { renderGrid, getAffordableFoodCells } from './utils';

const canvas = document.getElementById("snake") as HTMLCanvasElement;

let nextPosition;
let FOOD_POSITION;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const width: number = Math.floor(canvas.width / GRID_SIZE);
const height: number = Math.floor(canvas.height / GRID_SIZE);

const GRID: TMatrix = renderGrid(width, height);

function drawGrid(x: number, y: number, color: string = GRID_COLOR): void {
	ctx.fillStyle = color;

	ctx.fillRect(
		GRID_MARGIN + (GRID_SIZE* y),
		GRID_MARGIN + (GRID_SIZE* x),
		(GRID_SIZE - 2) * GRID_MARGIN,
		(GRID_SIZE - 2) * GRID_MARGIN
	);
}

GRID.forEach((el: number[]) => {
	drawGrid(el[0], el[1], GRID_COLOR)
});

const SNAKE: TMatrix = [[
	Math.floor(Math.random() * width),
	Math.floor(Math.random() * height)
]];

const AFFORDABLE_FOOD_CELLS: TMatrix = getAffordableFoodCells(GRID, SNAKE);

FOOD_POSITION = AFFORDABLE_FOOD_CELLS[Math.floor(Math.random() * AFFORDABLE_FOOD_CELLS.length)];

function createBoard(snake: TMatrix): TMatrix<number | null> {
	const board: TMatrix<number | null> = [];
	const snakeRest: TMatrix = snake.slice(1);

	for (let x = 0; x < height; x++) {
		board.push([]);

		for (let y = 0; y < width; y++) {
			board[board.length - 1].push(null);
		}
	}

	for (let s = 0; s < snakeRest.length; s++) {
		board[s[0]][s[1]] = -1;
	}

	return board;
}

function getAvailablePoint<T = number[] | TMatrix>(snake: T, hasSlice: boolean = true): TMatrix {
	const snakeX: T = hasSlice ? snake[0] : snake;

	return [
		[snakeX[0] - 1, snakeX[1]], // by left
		[snakeX[0] + 1, snakeX[1]], // by right
		[snakeX[0], snakeX[1] - 1], // by top
		[snakeX[0], snakeX[1] + 1] // by bottom
	];
}

function distanceToFood(snake: TMatrix, food: number[]): number {
	const snakeHead: number[] = snake[0];

	if (snakeHead[0] === food[0] && snakeHead[1] === food[1]) return 0;

	let board: TMatrix<number | null> = createBoard(snake);

	const step = [[snakeHead]];

	board[snakeHead[0]][snakeHead[1]] = 0;

	while (true) {
		if (step[step.length - 1].length === 0) return Infinity;

		step.push([]);

		const st = step[step.length - 2];

		for (let s = 0; s < st.length; s++) {
			const stepEl = st[s];
			const slaves = getAvailablePoint(stepEl, false);

			for (let g = 0; g < slaves.length; g++) {
				const slaveEl = slaves[g];

				if (checkBoundary(slaveEl) && board[slaveEl[0]][slaveEl[1]] === null) {
					step[step.length - 1].push(slaveEl);
					board[slaveEl[0]][slaveEl[1]] = (board[stepEl[0]][stepEl[1]] as number) + 1;

					if (slaveEl[0] === food[0] && slaveEl[1] === food[1]) {
						return (board[slaveEl[0]][slaveEl[1]] as number);
					}
				}
			}
		}
	}
}

function checkBoundary(pos: number[]): boolean {
	return pos[0] >= 0 && pos[0] < height && pos[1] >= 0 && pos[1] < width;
}

function checkEatSelf(snakeNextPos: TMatrix): boolean {
	for (let s = 1; s < snakeNextPos.length; s++) {
		if (snakeNextPos[0][0] === snakeNextPos[s][0] && snakeNextPos[0][1] === snakeNextPos[s][1]) {
			return true;
		}
	}

	return false;
}

function getSafeMove(snake: TMatrix): TMatrix {
	const move: TMatrix = [];
	const AVAILABLE_SAFE_MOVE: TMatrix = getAvailablePoint(snake);

	for (let b = 0; b < AVAILABLE_SAFE_MOVE.length; b++) {
		let tmp_snake: TMatrix = [];

		for (let s = 0; s < snake.length; s++) {
			tmp_snake = [];

			for (let s1 = 0; s1 < snake.length; s1++) {
				tmp_snake.push(snake[s1])
			}
		}

		tmp_snake.unshift(AVAILABLE_SAFE_MOVE[b]);
		tmp_snake.pop();

		if (checkBoundary(AVAILABLE_SAFE_MOVE[b]) && !checkEatSelf(tmp_snake)) {
			move.push(AVAILABLE_SAFE_MOVE[b]);
		}
	}

	return move;
}

function getNextPosition(snake: TMatrix, food: number[]): TNextPosition {
	const savePosition: TMatrix = getSafeMove(snake);
	const dist: number[] = [];

	for (let p = 0; p < savePosition.length; p++) {
		const tmp_snake: TMatrix = [];

		for (let s = 0; s < snake.length; s++) {

			tmp_snake.push(snake[s]);
		}

		tmp_snake.unshift(savePosition[p]);

		if (!(p[0] === food[0] && p[1] === food[1])) {
			tmp_snake.pop();
		}

		dist.push(distanceToFood(tmp_snake, food));
	}

	let nextPositionIndex;
	let tmp_dist = Infinity;

	for (let i = 0; i < dist.length; i++) {
		if (dist[i] < tmp_dist) {
			tmp_dist = dist[i];
			nextPositionIndex = i;
		}
	}

	const availability = nextPositionIndex !== undefined;

	return {
		availability,
		position: availability ? savePosition[nextPositionIndex] : null
	}
}

function snakeUpdate() {
	if (AFFORDABLE_FOOD_CELLS.length === 0 || getSafeMove(SNAKE).length === 0) {
		console.log('game over')
	}

	nextPosition = getNextPosition(SNAKE, FOOD_POSITION);

	if (nextPosition.availability) {

	}

	const snakeHead = SNAKE[0];

	if (!checkBoundary(snakeHead)) {
		console.log('game over')
	}
}

snakeUpdate();
