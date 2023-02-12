import { Vector2 } from "../utils/Vector2";
import { Chunk } from "./Chunk";
import { Color } from "../../engine/utils/Color";

export class World {

  private chunkSize: number;
  private chunks: Map<Vector2, Chunk>;

  constructor(chunkSize?: number) {
    this.chunkSize = chunkSize || 128;
    this.chunks = new Map<Vector2, Chunk>();
  }

  public getPixel(pos: Vector2): Color {
    const chunk = this.getChunk(pos);
    return chunk.getPixel(pos);
  }

  public setPixel(pos: Vector2, color: Color): void {
    const chunk = this.getChunk(pos);
    chunk.setPixel(pos, color);
  }

  public swapPixel(pos1: Vector2, pos2: Vector2): void {
    const color1 = this.getPixel(pos1);
    const color2 = this.getPixel(pos2);

    this.setPixel(pos1, color2);
    this.setPixel(pos2, color1);
  }

  public getRange(pos1: Vector2, pos2: Vector2): Color[] {
    const width = pos2.x - pos1.x;
    const height = pos2.y - pos1.y;

    const range: Color[] = [];

    const startChunkIndex = this.getChunkIndex(pos1);
    const endChunkIndex = this.getChunkIndex(pos2);

    const startChunk = this.getChunk(pos1);
    const middleChunks = new Array<Chunk>(width * height)
    for (let i = startChunkIndex + 1; i <= endChunkIndex - 1; i++) {
      middleChunks.push(this.getChunk(this.getChunkPos(i)));
    }
    const endChunk = this.getChunk(pos2);

    const startPixels = startChunk.getRange(pos1, new Vector2(this.chunkSize, this.chunkSize));
    const middlePixels = middleChunks.map(chunk => chunk.getRange(new Vector2(0, 0), new Vector2(this.chunkSize, this.chunkSize)));
    const endPixels = endChunk.getRange(new Vector2(0, 0), pos2);

    startPixels.forEach(pixel => range.push(pixel));
    middlePixels.forEach(pixels => range.push(...pixels));
    endPixels.forEach(pixel => range.push(pixel));

    return range;
  }

  public getChunk(pos: Vector2): Chunk {
    if (!this.chunks.has(pos)) {
      this.chunks.set(pos, new Chunk(this.chunkSize));
    }

    return this.chunks.get(pos) as Chunk;
  }

  public getChunkPos(index: number): Vector2 {
    const x = index % this.chunkSize;
    const y = Math.floor(index / this.chunkSize);

    return new Vector2(x, y);
  }

  public getChunkIndex(pos: Vector2): number {
    const x = Math.floor(pos.x / this.chunkSize);
    const y = Math.floor(pos.y / this.chunkSize);

    return x + y * this.chunkSize;
  }
}