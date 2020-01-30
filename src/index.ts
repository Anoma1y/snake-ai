import './style.css';
import {TMatrix, TSafePathToFood, TDimesions, TRenderOptions} from './types';
import {getAvailablePoint, isAtOnePoint, checkPenetratesItSelf} from './utils';
import Render from './Render';
import Snake from './Snake';
import Food from './Food';
import Colors from "./Colors";
import Timeout = NodeJS.Timeout;
import {GRID_CELL_COLOR} from "./constants";

class Main {
  public render: Render;
  private snake: Snake;
  private food: Food;
  private colors: Colors;

  private readonly timer: Timeout | undefined;

  constructor() {
    const canvas = document.getElementById("snake") as HTMLCanvasElement;

    this.render = new Render(canvas);
    this.snake = new Snake(this.render.getDimensions());
    this.food = new Food(this.render.grid, this.snake.snake);
    this.colors = new Colors();

    this.timer = setInterval(() => this.gameUpdate(), 100);
  }

  private checkBoundary(pos: number[]): boolean {
    const {width, height} = this.render.getDimensions();

    return pos[0] >= 0 && pos[0] < height && pos[1] >= 0 && pos[1] < width;
  }

  private createBoard(snake: TMatrix, isTrimEnd: boolean = false): TMatrix<number | null> {
    const {width, height} = this.render.getDimensions();
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

      if (this.checkBoundary(AVAILABLE_SAFE_MOVE[b]) && !checkPenetratesItSelf(tmp_snake)) {
        move.push(AVAILABLE_SAFE_MOVE[b]);
      }
    }

    return move;
  }

  private distanceToFood(snake: TMatrix, food: number[]): number {
    const snakeHead = snake[0];

    if (isAtOnePoint(snakeHead, food)) return 0;

    let board: TMatrix<number | null> = this.createBoard(snake);

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

  private getShortDistinationPath(snake: TMatrix, food: number[], positions: TMatrix): number[] {
    const destinations: number[] = [];

    for (let p = 0; p < positions.length; p++) {
      const snake_clone: TMatrix = [...snake];

      snake_clone.unshift(positions[p]);

      if (!(p[0] === food[0] && p[1] === food[1])) {
        snake_clone.pop();
      }

      destinations.push(this.distanceToFood(snake_clone, food));
    }
    return destinations;
  }

  private getSafePathToFood(snake: TMatrix, food: number[]): TSafePathToFood {
    const savePositions: TMatrix = this.getSafeMove(snake);
    const dist = this.getShortDistinationPath(snake, food, savePositions);

    let dist_temp: number = Infinity; // default Infinity
    let nextPositionIndex;

    for (let i = 0; i < dist.length; i++) {
      if (dist_temp > dist[i]) {
        dist_temp = dist[i];
        nextPositionIndex = i;
      }
    }

    const availability = nextPositionIndex !== undefined;

    return {
      availability,
      position: savePositions[nextPositionIndex]
    }
  }

  private gameUpdate() {
    if (!this.food.foodPosition || this.food.foodPosition.length === 0 || this.getSafeMove(this.snake.snake).length === 0) {
      return this.ggwp();
    }

    this.snake.appendToHead(this.getSafePathToFood(this.snake.snake, this.food.foodPosition).position);

    const snakeHead = this.snake.getHead();

    if (!this.checkBoundary(snakeHead)) return this.ggwp();

    if (isAtOnePoint(snakeHead, this.food.foodPosition)) {
      this.food.recalculateAvailablePosition();
    } else {
      const snakeTail = this.snake.removeTail();

      if (checkPenetratesItSelf(this.snake.snake)) {
        return this.ggwp();
      }

      if (Array.isArray(snakeTail)) {
        this.render.drawCell(snakeTail[0], snakeTail[1], GRID_CELL_COLOR);
      }
    }

    for (let i = 0; i < this.snake.snake.length; i++) {
      this.render.drawCell(this.snake.snake[i][0], this.snake.snake[i][1], 'red');
    }

    if (this.food.foodPosition) {
      this.render.drawCell(this.food.foodPosition[0], this.food.foodPosition[1], "green");
    }
  }

  private ggwp() {
    console.log('[GGWP] Good Game, Well Played!');

    if (this.timer) {
      clearInterval(this!.timer);
    }
  }
}

new Main();
