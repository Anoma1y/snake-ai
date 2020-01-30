import {TDimesions, TMatrix, TRenderOptions, TRGBArray, TRGBObject} from "./types";
import {mergeOptions} from "./utils";
import {CANVAS_HEIGHT, CANVAS_WIDTH, GRID_MARGIN, GRID_SIZE, GRID_CELL_COLOR} from "./constants";

class Render {
  private readonly ctx: null | CanvasRenderingContext2D = null;

  public grid: TMatrix = [[]];
  public width: number = 0;
  public height: number = 0;

  private readonly options: TRenderOptions = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    gridSize: GRID_SIZE,
    gridMargin: GRID_MARGIN,
    gridColor: GRID_CELL_COLOR,
  };

  constructor(canvasEl, opt?) {
    this.options = mergeOptions(this.options, opt);

    canvasEl.width = this.options.width;
    canvasEl.height = this.options.height;

    this.ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

    this.width = Math.floor(canvasEl.width / this.options.gridSize);
    this.height = Math.floor(canvasEl.height / this.options.gridSize);

    this.grid = this.renderGrid();

    this.grid.forEach(g => this.drawCell(g[0], g[1], this.options.gridColor));
  }

  getDimensions(): TDimesions {
    return {
      width: this.width,
      height: this.height,
      area: this.getArea()
    }
  }

  private getArea(): number {
    return this.width * this.height;
  }

  private renderGrid(): TMatrix {
    const GRID: TMatrix = [];

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        GRID.push([i, j]);
      }
    }

    return GRID;
  }

  public drawCell(i: number, j: number, color: string): void {
    const {gridSize, gridMargin} = this.options;

    if (!this.ctx) {
      throw new Error('Context is null');
    }

    this!.ctx.fillStyle = color;
    this!.ctx.fillRect(
      j * gridSize + gridMargin,
      i * gridSize + gridMargin,
      gridSize - 2 * gridMargin,
      gridSize - 2 * gridMargin
    );
  }
}

export default Render;
