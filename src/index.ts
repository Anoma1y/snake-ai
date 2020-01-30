import './style.css';
import { TMatrix, TNextPosition, TDimesions, TRenderOptions } from './types';
import { mergeOptions } from './utils';
import Render from './Render';
import Snake from './Snake';
import Food from './Food';
import Timeout = NodeJS.Timeout;

class Main {
	private render: Render;
	private snake: Snake;
	private food: Food;
	private timer: Timeout | undefined;

	constructor() {
		const canvas = document.getElementById("snake") as HTMLCanvasElement;

		this.render = new Render(canvas);
		this.snake = new Snake(this.render.getDimensions());
		this.food = new Food(this.render.grid, this.snake.snake);

		this.timer = setInterval(() => this.update(), 1000);
	}

	private getAvailablePoint<T = number[] | TMatrix>(snake: T, hasSlice: boolean = true): TMatrix {
		const snakeX: T = hasSlice ? snake[0] : snake;

		return [
			[snakeX[0] - 1, snakeX[1]], // by left
			[snakeX[0] + 1, snakeX[1]], // by right
			[snakeX[0], snakeX[1] - 1], // by top
			[snakeX[0], snakeX[1] + 1] // by bottom
		];
	}

	private checkBoundary(pos: number[]): boolean {
		const { width, height } = this.render.getDimensions();

		return pos[0] >= 0 && pos[0] < height && pos[1] >= 0 && pos[1] < width;
	}

	private checkEatSelf(snakeNextPos: TMatrix): boolean {
		for (let s = 1; s < snakeNextPos.length; s++) {
			if (snakeNextPos[0][0] === snakeNextPos[s][0] && snakeNextPos[0][1] === snakeNextPos[s][1]) {
				return true;
			}
		}

		return false;
	}

	private createBoard(snake: TMatrix, isTrimEnd: boolean = false): TMatrix<number | null> {
		const { width, height } = this.render.getDimensions();
		const board: TMatrix<number | null> = [];

		for (let x = 0; x < height; x++) {
			board.push([]);

			for (let y = 0; y < width; y++) {
				board[board.length - 1].push(null);
			}
		}

		const snakeRest: TMatrix = snake.slice(1, isTrimEnd ? snake.length - 1 : undefined);

		for (let s = 0; s < snakeRest.length; s++) {
			board[snakeRest[s][0]][snakeRest[s][1]] = -1;
		}

		return board;
	}

	private getSafeMove(snake: TMatrix): TMatrix {
		const move: TMatrix = [];
		const AVAILABLE_SAFE_MOVE: TMatrix = this.getAvailablePoint(snake);

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

			if (this.checkBoundary(AVAILABLE_SAFE_MOVE[b]) && !this.checkEatSelf(tmp_snake)) {
				move.push(AVAILABLE_SAFE_MOVE[b]);
			}
		}

		return move;
	}

	private distanceToFood(snake: TMatrix, food: number[]): number {
		const snakeHead: number[] = snake[0];

		if (snakeHead[0] === food[0] && snakeHead[1] === food[1]) return 0;

		let board: TMatrix<number | null> = this.createBoard(snake);

		const step = [[snakeHead]];

		board[snakeHead[0]][snakeHead[1]] = 0;

		while (true) {
			if (step[step.length - 1].length === 0) return Infinity;

			step.push([]);

			const st = step[step.length - 2];

			for (let s = 0; s < st.length; s++) {
				const stepEl = st[s];
				const slaves = this.getAvailablePoint(stepEl, false);

				for (let g = 0; g < slaves.length; g++) {
					const slaveEl = slaves[g];

					if (this.checkBoundary(slaveEl) && board[slaveEl[0]][slaveEl[1]] === null) {
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

	private getNextPosition(snake: TMatrix, food: number[]): TNextPosition {
		const savePosition: TMatrix = this.getSafeMove(snake);
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

			dist.push(this.distanceToFood(tmp_snake, food));
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

	private update() {
		if (!this.food.foodPosition || this.food.foodPosition.length === 0 || this.getSafeMove(this.snake.snake).length === 0) {
			return this.ggwp();
		}

		const nextPosition = this.getNextPosition(this.snake.snake, this.food.foodPosition);

		let direction: number[] | null = [];

		if (nextPosition.availability) {
			direction = nextPosition.position;
		} else {

		}
		console.log(direction)
	}

	private ggwp() {
		console.log('Good Game');

		if (this.timer) {
			clearInterval(this!.timer);
		}
	}
}

const asd = new Main();