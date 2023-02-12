import { CHUNK_SIZE } from "../../../disabled/constants";
import { Game } from "../Game";
import { GameObject } from "../GameObject";
import { Matrix } from "../utils/Matrix";
import { Vector2 } from "../utils/Vector2";
import { Cell } from "./Cell";
import { Chunk } from "./Chunk";

export class World extends GameObject {

  private size: Vector2;
  public get Size(): Vector2 {
    return this.size;
  }

  private chunks: Matrix<Chunk>;

  public get Cells(): Matrix<Cell> {
    return this.chunks.Data.map((chunk) => chunk.Cells).reduce((a: Matrix<Cell>, b: Matrix<Cell>) => a.merge(b), new Matrix<Cell>(this.size));
  }

  public constructor(parent: GameObject|Game, size: Vector2) {
    super(parent);
    this.size = size;
    this.chunks = new Matrix<Chunk>(new Vector2(
      Math.ceil(this.size.x / CHUNK_SIZE),
      Math.ceil(this.size.y / CHUNK_SIZE)
    ));
  }

  public getChunk(pos: Vector2): Chunk {
    if (!this.chunks.has(pos)) {
      this.chunks.set(pos, new Chunk(this, pos));
    }
    return this.chunks.get(pos);
  }

  public setCell(pos: Vector2, cell: Cell): void {
    const chunkPos = new Vector2(
      Math.floor(pos.x / CHUNK_SIZE),
      Math.floor(pos.y / CHUNK_SIZE)
    );
    const cellPos = new Vector2(
      pos.x % CHUNK_SIZE,
      pos.y % CHUNK_SIZE
    );
    this.getChunk(chunkPos).setCell(cellPos, cell);
  }

  public getCell(pos: Vector2): Cell {
    const chunkPos = new Vector2(
      Math.floor(pos.x / CHUNK_SIZE),
      Math.floor(pos.y / CHUNK_SIZE)
    );
    const cellPos = new Vector2(
      pos.x % CHUNK_SIZE,
      pos.y % CHUNK_SIZE
    );
    return this.getChunk(chunkPos).getCell(cellPos);
  }

  public swapCells(pos1: Vector2, pos2: Vector2): void {
    const cell1 = this.getCell(pos1);
    const cell2 = this.getCell(pos2);
    this.setCell(pos1, cell2);
    this.setCell(pos2, cell1);
  }

  protected onUpdate(deltaTime: number): boolean {
    this.chunks.Data.forEach((chunk) => chunk.update(deltaTime));
    return this.chunks.Data.some((chunk) => chunk.Updated);
  }
}