export class Vector2 {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public mul(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  public div(other: Vector2): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  public equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }
}