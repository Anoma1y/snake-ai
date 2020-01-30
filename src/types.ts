export type TMatrix<T = number> = T[][];

export type TNextPosition = {
	availability: boolean
	position: number[] | null
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
}