import './style.css';
import {TMatrix, TSafePathToFood} from './types';
import {getAvailablePoint, isAtOnePoint, checkPenetratesItSelf, getRandomInt} from './utils';
import Fast from 'fast.js';
import Render from './Render';
import Snake from './Snake';
import Food from './Food';
import Colors from "./Colors";
import Timeout = NodeJS.Timeout;
import {FOOD_COLOR, GRID_CELL_COLOR, DOCUMENT_TITLE} from "./constants";

class Main {
  private render: Render;
  private snake: Snake;
  private food: Food;

  private timer: Timeout | undefined;

  constructor() {
    const canvas = document.getElementById("snake") as HTMLCanvasElement;

    this.render = new Render(canvas);
    this.snake = new Snake(this.render.getDimensions());
    this.food = new Food(this.render.getGrid(), this.snake.getSnake());

    document.title = `${DOCUMENT_TITLE} [Start]`;
  }

  private checkBoundary(pos: number[]): boolean {
    const {width, height} = this.render.getDimensions();

    return (pos[0] >= 0)
      && (pos[0] < height)
      && (pos[1] >= 0)
      && (pos[1] < width);
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

    Fast.forEach(snakeRest, (s: number[]) => board[s[0]][s[1]] = -1);

    return board;
  }

  private getSafeMove(snake: TMatrix): TMatrix {
    const move: TMatrix = [];
    const AVAILABLE_SAFE_MOVE: TMatrix = getAvailablePoint(snake);

    Fast.forEach(AVAILABLE_SAFE_MOVE, (safeMove: number[]) => {
      let tmp_snake: TMatrix = [...snake];

      tmp_snake.unshift(safeMove);
      tmp_snake.pop();

      if (this.checkBoundary(safeMove) && !checkPenetratesItSelf(tmp_snake)) {
        move.push(safeMove);
      }

    });

    return move;
  }

  private distanceToFood(snake: TMatrix, food: number[]): number {
    const snakeHead = snake[0];

    if (isAtOnePoint(snakeHead, food))
      return 0;

    let board: TMatrix<number | null> = this.createBoard(snake);

    const nextPath = [[snakeHead]];

    board[snakeHead[0]][snakeHead[1]] = 0;

    while (true) {
      if (nextPath[nextPath.length - 1].length === 0)
        return Infinity;

      nextPath.push([]);

      const st = nextPath[nextPath.length - 2];

      for (let s = 0; s < st.length; s++) {
        const nextPathEl = st[s];
        const availableSteps = getAvailablePoint(nextPathEl, false);

        for (let g = 0; g < availableSteps.length; g++) {
          const availableStep = availableSteps[g];

          if (this.checkBoundary(availableStep) && board[availableStep[0]][availableStep[1]] === null) {
            nextPath[nextPath.length - 1].push(availableStep);
            board[availableStep[0]][availableStep[1]] = (board[nextPathEl[0]][nextPathEl[1]] as number) + 1;

            if (availableStep[0] === food[0] && availableStep[1] === food[1])
              return (board[availableStep[0]][availableStep[1]] as number);
          }
        }
      }
    }
  }

  private getShortDistinationPath(snake: TMatrix, food: number[], positions: TMatrix): number[] {
    const destinations: number[] = [];

    Fast.forEach(positions, (pos: number[]) => {
      const snake_clone: TMatrix = [...snake];

      snake_clone.unshift(pos);

      if (!(pos[0] === food[0] && pos[1] === food[1])) {
        snake_clone.pop();
      }

      destinations.push(this.distanceToFood(snake_clone, food));
    });

    return destinations;
  }

  private getAlternativeShortDistinationPath(snake: TMatrix, positions: TMatrix, food?: number[]): number[] {
    const destinations: number[] = [];

    Fast.forEach(positions, (pos: number[]) => {
      const snake_clone: TMatrix = [...snake];

      snake_clone.unshift(pos);

      if (!food || !(pos[0] === food[0] && pos[1] === food[1])) {
        snake_clone.pop();
      }

      destinations.push(this.distanceAlternativeToFood(snake_clone));
    });

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

  private distanceAlternativeToFood(snake: TMatrix): number {
    if (snake.length === 1)
      return 0;

    const board = this.createBoard(snake, true);

    const snakeHead = snake[0];
    const snakeTail = snake[snake.length - 1];
    const nextPath = [[snakeHead]];

    board[snakeHead[0]][snakeHead[1]] = 0;

    while (true) {
      if (nextPath[nextPath.length - 1].length === 0)
        return Infinity;

      nextPath.push([]);

      const availableSteps = nextPath[nextPath.length - 2];

      for (let s = 0; s < availableSteps.length; s++) {
        const points = getAvailablePoint(availableSteps[s], false);

        for (let e = 0; e < points.length; e++) {
          if (this.checkBoundary(points[e]) && board[points[e][0]][points[e][1]] === null) {
            board[points[e][0]][points[e][1]] = (board[availableSteps[s][0]][availableSteps[s][1]] as number) + 1;
            nextPath[nextPath.length - 1].push(points[e]);

            if (points[e][0] === snakeTail[0] && points[e][1] === snakeTail[1])
              return (board[points[e][0]][points[e][1]] as number);
          }
        }
      }
    }
  }

  private getAlternativeSafePathToFood(snake: TMatrix, food?: number[]) {
    const savePositions = this.getSafeMove(snake);
    const dist = this.getAlternativeShortDistinationPath(snake, savePositions, food);

    let nextPositionIndex;
    let dist_temp = -Infinity;

    for (let i = 0; i < dist.length; i++) {
      if (isFinite(dist[i]) && (dist[i] > dist_temp)) {
        dist_temp = dist[i];
        nextPositionIndex = i;
      }
    }

    const availability = nextPositionIndex !== undefined;

    return {
      availability,
      position: availability
        ? savePositions[nextPositionIndex] // next safe position
        : savePositions[getRandomInt(savePositions.length)] // next random position
    }
  }

  private checkSafePosition(snake: TMatrix, food: number[]): boolean {
    const {area} = this.render.getDimensions();
    const snake_clone = [...snake];

    while (true) {
      const {availability, position} = this.getSafePathToFood(snake_clone, food);

      if (!availability)
        return false;

      snake_clone.unshift(position as number[]);

      if (snake_clone[0][0] === food[0] && snake_clone[0][1] === food[1]) {
        return (snake_clone.length === area)
          ? true // nowhere to go
          : this.getAlternativeSafePathToFood(snake_clone).availability
      }

      snake_clone.pop();
    }
  }

  private getNextPosition(snake: TMatrix, food: number[]): number[] {
    const nextPosition = this.getSafePathToFood(snake, food);
    const isSavePosition = this.checkSafePosition(snake, food);

    return (nextPosition.availability && isSavePosition)
      ? (nextPosition.position as number[])
      : this.getAlternativeSafePathToFood(snake, food).position;
  }

  private gameUpdate() {
    if (!this.food.getFood() || this.food.getFood().length === 0 || this.getSafeMove(this.snake.getSnake()).length === 0)
      return this.ggwp();

    this.snake.appendToHead(this.getNextPosition(this.snake.getSnake(), this.food.getFood()));

    const snakeHead = this.snake.getHead();

    if (!this.checkBoundary(snakeHead))
      return this.ggwp();

    if (isAtOnePoint(snakeHead, this.food.getFood())) {
      this.food.recalculateAvailablePosition();
    } else {
      const snakeTail = this.snake.removeTail();

      if (checkPenetratesItSelf(this.snake.getSnake()))
        return this.ggwp();

      if (Array.isArray(snakeTail))
        this.render.drawCell(snakeTail[0], snakeTail[1], GRID_CELL_COLOR);
    }

    const snakeColors = Colors.interpolationColors(
      "rgb(255, 171, 41)",
      "rgb(39, 169, 255)",
      this.snake.getLength()
    );

    if (this.food.getFood())
      this.render.drawCell(this.food.getFood()[0], this.food.getFood()[1], FOOD_COLOR);

    Fast.forEach(this.snake.getSnake(), (pos: number[], i) => {
      this.render.drawCell(pos[0], pos[1], snakeColors[i]);
    });
  }

  private ggwp() {
    console.log('[GGWP] Good Game, Well Played!');

    document.title = `${DOCUMENT_TITLE} [End]`;

    if (this.timer)
      clearInterval(this!.timer);
  }

  public run(interval: number = 10): void {
    this.timer = setInterval(() => {
      this.gameUpdate();
    }, interval);
  }
}

new Main().run();


