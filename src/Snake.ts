import {TDimesions, TMatrix} from "./types";

class Snake {
  private readonly _snake: TMatrix;

  constructor(private gridDimensions: TDimesions) {
    const {width, height} = gridDimensions;

    this._snake = [[Math.floor(Math.random() * width), Math.floor(Math.random() * height)]];
  }

  public getSnake(): TMatrix {
    return this._snake;
  }

  appendToHead(position: number[]): void {
    this._snake.unshift(position);
  }

  appendToTail(position: number[]): void {
    this._snake.push(position);
  }

  getHead(): number[] {
    return this._snake[0];
  }

  removeTail(): number[] | undefined {
    return this._snake.pop();
  }
}

export default Snake;
