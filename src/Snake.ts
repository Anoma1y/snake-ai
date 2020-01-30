import {TDimesions, TMatrix} from "./types";

class Snake {
  public snake: TMatrix;

  constructor(private gridDimensions: TDimesions) {
    const {width, height} = gridDimensions;

    this.snake = [[Math.floor(Math.random() * width), Math.floor(Math.random() * height)]];
  }

  appendToHead(position: number[]): void {
    this.snake.unshift(position);
  }

  appendToTail(position: number[]): void {
    this.snake.push(position);
  }

  getHead(): number[] {
    return this.snake[0];
  }

  removeTail(): number[] | undefined {
    return this.snake.pop();
  }
}

export default Snake;
