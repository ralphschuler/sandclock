import { FILL_COLOR } from "../../constants";
import { Vector2 } from "../utils/Vector2";
import { Color } from "../../engine/utils/Color";

export class Chunk {

  private chunkSize: number;
  private pixels: Map<Vector2, Color>;

  constructor(chunkSize: number) {
    this.chunkSize = chunkSize;
    this.pixels = new Map<Vector2, Color>();

    this.fill(FILL_COLOR);
  }

  private fill(color: Color): void {
    const pixels = new Array<Color>(this.chunkSize * this.chunkSize).fill(color);
    this.pixels = new Map<Vector2, Color>(pixels.map((_, index) => [this.getPixelPos(index), color]));
  }

  public getPixel(pos: Vector2): Color {
    return this.pixels.get(pos) as Color;
  }

  public setPixel(pos: Vector2, color: Color): void {
    this.pixels.set(pos, color);
  }

  public getRange(pos1: Vector2, pos2: Vector2): Color[] {
    const width = pos2.x - pos1.x;
    const height = pos2.y - pos1.y;

    const range: Color[] = new Array<Color>(width * height).fill(FILL_COLOR);
    range.map((_, index) => this.getPixel(this.getPixelPos(index)));

    return range;
  }

  public getPixelIndex(pos: Vector2): number {
    const x = Math.floor(pos.x / this.chunkSize);
    const y = Math.floor(pos.y / this.chunkSize);

    return x + y * this.chunkSize;
  }

  public getPixelPos(index: number): Vector2 {
    const x = index % this.chunkSize;
    const y = Math.floor(index / this.chunkSize);

    return new Vector2(x, y);
  }

  public get Pixels(): Array<Color> {
    return Array.from(this.pixels.values());
  }

}