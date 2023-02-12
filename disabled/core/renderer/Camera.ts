import { Vector2 } from "./Vector2";

export class Camera {

  private pos: Vector2;
  private size: Vector2;

  public constructor(pos: Vector2, size: Vector2) {
    this.pos = pos;
    this.size = size;
  }

  public get Pos(): Vector2 {
    return this.pos;
  }

  public get Size(): Vector2 {
    return this.size;
  }

  public set Pos(pos: Vector2) {
    this.pos = pos;
  }

  public set Size(size: Vector2) {
    this.size = size;
  }
}