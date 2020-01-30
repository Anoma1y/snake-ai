import {TMatrix} from "./types";

class Food {
  foodPosition: number[] = [];
  availablePosition: TMatrix = [[]];

  constructor(private grid: TMatrix, private snake: TMatrix) {
    this.recalculateAvailablePosition();
  }

  recalculateAvailablePosition(): void {
    this.availablePosition = [];

    for (let g = 0; g < this.grid.length; g++) {
      let isAvailablePosition = true;

      for (let s = 0; s < this.snake.length; s++) {
        if (this.snake[s][0] === this.grid[g][0] && this.snake[s][1] === this.grid[g][1]) {
          isAvailablePosition = false; // snake in this position
          break;
        }
      }

      if (isAvailablePosition) {
        this.availablePosition.push(this.grid[g]);
      }
    }

    this.foodPosition = this.availablePosition[this.getRandomPositionIndex()];
  }

  getRandomPositionIndex(): number {
    return Math.floor(Math.random() * this.availablePosition.length);
  }
}

export default Food;
