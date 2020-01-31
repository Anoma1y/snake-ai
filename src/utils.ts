import {TMatrix} from "./types";

export function mergeOptions<T extends object>(master: T, slaves: T): T {
  return Object.assign(master, slaves);
}

export function getRandomFloat(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min) + min) / 100
}

export function getRandomInt(num: number): number {
  return Math.floor(Math.random() * num);
}

export function isAtOnePoint(leftArr: number[], rightArr: number[]): boolean {
  return leftArr[0] === rightArr[0] && leftArr[1] === rightArr[1];
}

export function calcArea(x: number, y: number): number {
  return x * y;
}

export function getAvailablePoint<T = number[] | TMatrix>(snake: T, hasSlice: boolean = true): TMatrix {
  const snakeX: T = hasSlice ? snake[0] : snake;

  return [
    [snakeX[0] - 1, snakeX[1]], // by left
    [snakeX[0] + 1, snakeX[1]], // by right
    [snakeX[0], snakeX[1] - 1], // by top
    [snakeX[0], snakeX[1] + 1] // by bottom
  ];
}

export function checkPenetratesItSelf(position: TMatrix): boolean {
  for (let s = 1; s < position.length; s++) {
    if (position[0][0] === position[s][0] && position[0][1] === position[s][1]) {
      return true;
    }
  }

  return false;
}
