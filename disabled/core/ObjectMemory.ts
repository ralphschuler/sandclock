import { HashTable } from "./utils/HashTable";

export class ObjectMemory {

    private items: HashTable<any>;

    constructor() {
        this.items = new HashTable<any>();
    }

    public get(key: string): any {
        return this.items.get(key);
    }

    public set(key: string, value: any): void {
        this.items.set(key, value);
    }

    public remove(key: string): void {
        this.items.remove(key);
    }

    public save(key: string): void {
        localStorage.setItem(key, JSON.stringify(this.items));
    }

    public load(key: string): void {
        const data = localStorage.getItem(key);
        if (data) {
            const items = JSON.parse(data);
            this.items = new HashTable<any>(items);
        }
    }
}