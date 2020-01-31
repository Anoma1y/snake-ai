import {TContext, TDimesions, TMatrix, TRenderOptions} from "./types";
import {calcArea, mergeOptions} from "./utils";
import {CANVAS_HEIGHT, CANVAS_WIDTH, GRID_MARGIN, GRID_SIZE, GRID_CELL_COLOR} from "./constants";

class Render {
  private readonly ctx: TContext = null;

  public _grid: TMatrix = [[]];
  public width: number = 0;
  public height: number = 0;

  private readonly _dimensions: TDimesions;

  private readonly _options: TRenderOptions = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    gridSize: GRID_SIZE,
    gridMargin: GRID_MARGIN,
    gridColor: GRID_CELL_COLOR,
  };

  constructor(private readonly canvasEl, private readonly opt?) {
    this._options = mergeOptions(this._options, opt);

    if (!this.canvasEl) {
      throw new Error('Canvas element not found')
    }

    canvasEl.width = this._options.width;
    canvasEl.height = this._options.height;

    this.ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

    if (!this.ctx) {
      throw new Error('Canvas context not found')
    }

    this.width = Math.floor(canvasEl.width / this._options.gridSize);
    this.height = Math.floor(canvasEl.height / this._options.gridSize);

    this._grid = this.renderGrid();

    this.drawGrid();

    this._dimensions = {
      width: this.width,
      height: this.height,
      area: calcArea(this.width, this.height),
      grid_margin: GRID_MARGIN,
      grid_size: GRID_SIZE,
    }
  }

  getDimensions(): TDimesions {
    return this._dimensions;
  }

  getGrid(): TMatrix {
    return this._grid;
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

  private drawGrid() {
    const grid = this.getGrid();

    for (let g = 0; g < grid.length; g++) {
      this.drawCell(grid[g][0], grid[g][1], this._options.gridColor)
    }
  }

  public drawCell(i: number, j: number, color: string): void {
    const {gridSize, gridMargin} = this._options;

    (this.ctx as TContext<CanvasRenderingContext2D>).fillStyle = color;
    (this.ctx as TContext<CanvasRenderingContext2D>).fillRect(
      gridSize * j + gridMargin,
      gridSize * i + gridMargin,
      gridSize - 2 * gridMargin,
      gridSize - 2 * gridMargin
    );
  }
}

export default Render;
