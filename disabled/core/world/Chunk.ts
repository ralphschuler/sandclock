import { Color } from "../renderer/Color";
import { Vector2 } from "../renderer/Vector2";
import { Cache } from "../utils/Cache";

export class Chunk {
  private width: number;
  private height: number;

  private data: Color[];

  public constructor(size: Vector2) {
    this.width = size.x;
    this.height = size.y;

    this.data = new Array(this.width * this.height);
  }

  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }

  public setPixel(pos: Vector2, color: Color): void {
    const index = pos.x + pos.y * this.width;
    this.data[index] = color;
  }

  public getPixel(pos: Vector2): Color {
    const index = pos.x + pos.y * this.width;
    if (!this.data[index]) {
      this.setPixel(pos, new Color(0x000000));
    }
    const pixel = this.data[index]
    console.log("getPixel", pixel);
    return pixel;
  }

  public clear(): void {
    this.data = new Array(this.width * this.height);
  }

  public fill(color: Color): void {
    this.data = new Array(this.width * this.height).fill(color);
  }

  public swap(pos1: Vector2, pos2: Vector2): void {
    const temp = this.getPixel(pos1);
    this.setPixel(pos1, this.getPixel(pos2));
    this.setPixel(pos2, temp);
  }

}