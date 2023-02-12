import { GameObject } from "../GameObject";
import { Color } from "../renderer/Color";
import { Vector2 } from "../renderer/Vector2";
import { Chunk } from "./Chunk";

export class World extends GameObject {
  private chunkSize: Vector2;
  private data: Map<Vector2, Chunk>;

  public constructor(chunkSize?: Vector2) {
    super();

    this.chunkSize = chunkSize || new Vector2(64, 64);

    this.data = new Map();
  }

  public get Data(): IterableIterator<[Vector2, Chunk]> {
    return this.data.entries();
  }

  public getChunk(pos: Vector2): Chunk {
    if (!this.data.has(pos)) {
      const chunk = new Chunk(this.chunkSize);
      chunk.fill(Color.fromHex("#032400"));
      this.data.set(pos, chunk);
    }

    return this.data.get(pos) as Chunk;
  }

  public getArea(pos: Vector2, size: Vector2): Color[] {
    const result: Color[] = [];
    for (let y = 0; y < size.y; y++) {
      for (let x = 0; x < size.x; x++) {
        result.push(this.getPixel(new Vector2(pos.x + x, pos.y + y)));
      }
    }
    return result;
  }

  public setPixel(pos: Vector2, color: Color): void {
    const chunkPos = new Vector2(
      Math.floor(pos.x / 64),
      Math.floor(pos.y / 64)
    );
    const pixelPos = new Vector2(
      pos.x % this.chunkSize.x,
      pos.y % this.chunkSize.y
    );
    this.getChunk(chunkPos).setPixel(pixelPos, color);
  }

  public getPixel(pos: Vector2): Color {
    const chunkPos = new Vector2(
      Math.floor(pos.x / 64),
      Math.floor(pos.y / 64)
    );
    const pixelPos = new Vector2(
      pos.x % this.chunkSize.x,
      pos.y % this.chunkSize.y
    );
    return this.getChunk(chunkPos).getPixel(pixelPos);
  }

  public swap(pos1: Vector2, pos2: Vector2): void {
    const temp = this.getPixel(pos1);
    this.setPixel(pos1, this.getPixel(pos2));
    this.setPixel(pos2, temp);
  }

}