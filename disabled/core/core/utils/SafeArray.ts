import { Color } from "three";

export class SafeArray<T> {
    private array: Array<T|null>;
    private addQueue: Array<T>;
    private setQueue: Array<[number, T]>;
    private removeQueue: Array<T>;

    public constructor(length?: number) {
        this.array = new Array<T|null>(length || 0).fill(null);
        this.addQueue = new Array<T>();
        this.setQueue = new Array<[number, T]>();
        this.removeQueue = new Array<T>();
    }

    public get isEmpty(): boolean {
        return this.array.length + this.addQueue.length === 0;
    }

    public get length(): number {
        return this.array.length + this.addQueue.length - this.removeQueue.length;
    }

    public entries(): IterableIterator<[number, T|null]> {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        return this.array.entries();
    }

    public slice(start?: number, end?: number): Array<T|null> {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        return this.array.slice(start, end);
    }

    public add(item: T): void {
        this.addQueue.push(item);
    }

    public remove(item: T): void {
        this.removeQueue.push(item);
    }

    public filter(predicate: (item: T|null, index: number) => boolean): Array<T|null> {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        const result: Array<T|null> = new Array<T|null>();
        this.forEach((item: T|null, index: number) => {
            if (predicate(item, index)) {
                result.push(item);
            }
        });
        return result;
    }

    public forEach(callback: (item: T|null, index: number) => void): void {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        for (const [index, item] of this.array.entries()) {

            if (item !== null && this.removeQueue.indexOf(item) === -1) {
                callback(item, index);
            }
        }
        this.removeQueued();
    }

    public fill(value: T, start?: number, end?: number): void {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        this.array.fill(value, start, end);
    }

    public map<U>(callback: (item: T|null) => U): U[] {
        const result: U[] = [];
        this.forEach((item: T|null) => {
            result.push(callback(item));
        });
        return result;
    }

    public get(index: number): T|null {
        this.addQueued();
        this.setQueued();
        this.removeQueued();
        return this.array[index] || null;
    }

    public set(index: number, item: T): void {
        this.setQueue.push([index, item]);
    }

    private setQueued(): void {
        for (const [index, item] of this.setQueue) {
            this.array[index] = item;
        }
        this.setQueue = [];
    }

    private addQueued(): void {
        this.array = this.array.concat(this.addQueue);
    }

    private removeQueued(): void {
        this.array = this.array.filter((item: T|null) => item !== null && !this.removeQueue.includes(item))
        this.removeQueue = [];
    }

}