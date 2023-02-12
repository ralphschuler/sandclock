import { Vector2 } from "./Vector2";

export class Matrix<T> {

  private size: Vector2;
  private data: T[];

  public constructor(size: Vector2) {
    this.size = size;
    this.data = new Array<T>(size.x * size.y);
  }

  public get Width(): number {
    return this.size.x;
  }

  public get Height(): number {
    return this.size.y;
  }

  public get Data(): T[] {
    return this.data;
  }

  public set Data(data: T[]) {
    this.data = data;
  }

  public get(pos: Vector2): T {
    return this.data[pos.y * this.size.x + pos.x];
  }

  public set(pos: Vector2, value: T): void {
    this.data[pos.y * this.size.x + pos.x] = value;
  }

  public has(pos: Vector2): boolean {
    return this.data[pos.y * this.size.x + pos.x] !== undefined;
  }

  public delete(pos: Vector2): void {
    delete this.data[pos.y * this.size.x + pos.x];
  }

  public fill(value: T): void {
    this.data.fill(value);
  }

  public forEach(callback: (value: T, pos: Vector2) => void): void {
    for (let index = 0; index < this.data.length; index++) {
      const x = index % this.size.x;
      const y = Math.floor(index / this.size.x);
      callback(this.data[index], new Vector2(x, y));
    }
  }

  public merge(this: Matrix<T>, ...matrices: Matrix<T>[]) {
    const matrix = Matrix.merge(this, ...matrices);
    this.data = matrix.data;
    return this;
  }

  public clone(): Matrix<T> {
    const matrix = new Matrix<T>(this.size);
    matrix.Data = this.data.slice();
    return matrix;
  }

  public static create<T>(size: Vector2, value: T): Matrix<T> {
    const matrix = new Matrix<T>(size);
    matrix.fill(value);
    return matrix;
  }

  public static merge<T>(...matrices: Matrix<T>[]): Matrix<T> {
    const size = new Vector2(
      Math.max(...matrices.map(matrix => matrix.Width)),
      Math.max(...matrices.map(matrix => matrix.Height))
    );

    const matrix = new Matrix<T>(size);
    matrices.forEach(matrix => {
      matrix.forEach((value, pos) => {
        if (pos.x < size.x && pos.y < size.y) {
          matrix.set(pos, value);
        }
      });
    });

    return matrix;
  }

}