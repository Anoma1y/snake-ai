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
}

export type TRGBArray = [number, number, number]

export type TRGBObject = {
  red: number
  green: number
  blue: number
}
