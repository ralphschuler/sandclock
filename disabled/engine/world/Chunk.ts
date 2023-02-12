import { CHUNK_SIZE } from "../../../disabled/constants";
import { GameObject } from "../GameObject";
import { Color } from "../utils/Color";
import { Matrix } from "../utils/Matrix";
import { Vector2 } from "../utils/Vector2";
import { Cell } from "./Cell";

export class Chunk extends GameObject {

  private position: Vector2;
  public get Position(): Vector2 {
    return this.position;
  }

  private size: Vector2;
  public get Size(): Vector2 {
    return this.size;
  }

  private cells: Matrix<Cell>;
  public get Cells(): Matrix<Cell> {
    return this.cells;
  }

  public getCell(pos: Vector2): Cell {
    if (!this.cells.has(pos)) {
      this.cells.set(pos, new Cell(this, pos));
    }
    return this.cells.get(pos);
  }
  public setCell(pos: Vector2, cell: Cell): void {
    this.cells.set(pos, cell);
  }

  public constructor(parent: GameObject, position: Vector2) {
    super(parent);
    this.size = new Vector2(CHUNK_SIZE, CHUNK_SIZE);
    this.position = position;
    this.cells = new Matrix<Cell>(this.size);

    this.fillCells();
  }

  public fillCells(): void {
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        this.cells.set(new Vector2(x, y), new Cell(this, new Vector2(x, y)));
      }
    }
  }

  protected onUpdate(deltaTime: number): boolean {
    this.cells.Data.forEach((cell) => cell.update(deltaTime));
    return this.cells.Data.some((cell) => cell.Updated);
  }
}