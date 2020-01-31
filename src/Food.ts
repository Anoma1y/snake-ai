import {TMatrix} from "./types";
import Fast from 'fast.js';
import {getRandomInt} from "./utils";

class Food {
  _food: number[] = [];
  availablePosition: TMatrix = [[]];

  constructor(private grid: TMatrix, private snake: TMatrix) {
    this.recalculateAvailablePosition();
  }

  public recalculateAvailablePosition(): void {
    this.availablePosition = [];

    Fast.forEach(this.grid, (grid: number[]) => {
      let isAvailablePosition = true;

      Fast.forEach(this.snake, (snake: number[]) => {
        if (snake[0] === grid[0] && snake[1] === grid[1]) {
          isAvailablePosition = false; // snake in this position
          return;
        }
      });

      if (isAvailablePosition)
        this.availablePosition.push(grid);
    });

    this._food = this.availablePosition[getRandomInt(this.availablePosition.length)];
  }

  public getFood(): number[] {
    return this._food;
  }
}

export default Food;
