export class HashTable<T> {
    private table: { [key: string]: { [key: string]: T } }

    public constructor(table?: { [key: string]: { [key: string]: T } }) {
        this.table = table || {}
    }

    private hash(key: string): number {
        return parseInt(Object.values(key).reduce((sum, value) => sum + value))
    }

    public has(key: string): boolean {
        const hash = this.hash(key)
        return this.table[hash] && this.table[hash][key] !== undefined
    }

    public get(key: string): T {
        const hash = this.hash(key)
        if (!this.table[hash]) {
            throw new Error("Missing item in HashTable")
        }
        return this.table[hash][key]
    }

    public set(key: string, value: T) {
        const hash = this.hash(key)
        if (!this.table[hash]) {
            this.table[hash] = { [key]: value  }
        }
    }

    public remove(key: string) {
        const hash = this.hash(key)
        if (!this.table[hash]) {
            throw new Error("Missing item in HashTable")
        }
        delete this.table[hash][key]
    }
}