export class Cache<T> {
  private key: string;
  private data: T|undefined;

  public get Data(): T {
    if (this.data === undefined) {
      this.load();
    }
    return this.data as T;
  }

  public set Data(data: T) {
    this.data = data;
    this.save();
  }

  public constructor(key: string, data?: T) {
    this.key = key;

    this.load();
    if (this.data === undefined) {
      this.data = data;
    }
  }

  public clear(): void {
    this.data = undefined;
    this.save();
  }

  public load(): void {
    const data = localStorage.getItem(this.key);
    if (data === null) {
      return;
    }
    this.data = JSON.parse(data);
  }

  public save(): void {
    localStorage.setItem(this.key, JSON.stringify(this.data));
  }
}