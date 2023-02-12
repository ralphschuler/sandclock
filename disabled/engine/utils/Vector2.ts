export class Vector2 {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(this: Vector2, other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public sub(this: Vector2, other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public mul(this: Vector2, other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  public div(this: Vector2, other: Vector2): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  public equals(this: Vector2, other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }
}