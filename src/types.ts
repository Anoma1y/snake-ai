export type TContext<T = null | CanvasRenderingContext2D> = T;

export type TMatrix<T = number> = T[][];

export type TSafePathToFood = {
  availability: boolean
  position?: number[]
}

export type TRenderOptions = {
  width: number;
  height: number;
  gridColor: string;
  gridSize: number;
  gridMargin: number;
}

export type TDimesions = {
  width: number
  height: number
  area: number
  grid_size: number
  grid_margin: number
}

export type TRGBArray = [number, number, number]

export type TRGBObject = {
  red: number
  green: number
  blue: number
}

