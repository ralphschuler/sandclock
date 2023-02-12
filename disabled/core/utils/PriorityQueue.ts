export type ComparatorFunction<T> = (a: T, b: T) => number;

export type PriorityQueueOptions<T> = {
    comparatorFunction: ComparatorFunction<T>;
    initialValues?: Array<T>;
}

export type Optional<T> = T | null;

export class PriorityQueue<T> {
    private values: Array<T|null> = []
    private comparatorFunction: ComparatorFunction<T>;
    private length: number = 0;

    public constructor(options: PriorityQueueOptions<T>) {
        this.comparatorFunction = options.comparatorFunction;

        if (options.initialValues) {
            options.initialValues.forEach(value => this.enqueue(value))
        }
    }

    public enqueue(value: T): void {
        if (this.values.length <= this.length) {
            this.values.length = Math.max(1, this.values.length * 2)
        }

        this.values[this.length++] = value
        this.bubbleUp();
    }

    public dequeue(): Optional<T|null> {
        if (this.length === 0) {
            return null
        }

        const node = this.values[0]

        if (this.length === 1) {
            this.length = 0
            this.values[0] = null
            return node
        }

        this.values[0] = this.values[this.length - 1]
        this.values[this.length - 1] = null
        this.length--

        this.bubbleDown()

        return node
    }

    public heapSort(): Array<T|null> {
        return Array.from({length: this.length}, () => this.dequeue());
    }

    private parent(nodeIndex: number): number|null {
        if (nodeIndex === 0) {
            return null
        }
        return (nodeIndex - 1) >>> 1
    }

    private leftChild(nodeIndex: number): number|null {
        const child = (nodeIndex * 2) + 1
        if (child >= this.length ){
            return null
        }
        return child
    }

    private rightChild(nodeIndex: number): number|null {
        const child = (nodeIndex * 2) + 2
        if (child >= this.length) {
            return null
        }
        return child
    }

    private bubbleUp(nodeIndex: number = this.length - 1) {
        const parent = this.parent(nodeIndex)

        if (parent !== null && this.comparatorFunction(this.values[nodeIndex] as T, this.values[parent] as T) < 0) {
            const node = this.values[nodeIndex]
            this.values[nodeIndex] = this.values[parent]
            this.values[parent] = node
            this.bubbleUp(parent)
        }

        return
    }

    public bubbleDown(nodeIndex: number = 0) {
        const leftChild = this.leftChild(nodeIndex)
        const rightChild = this.rightChild(nodeIndex)

        let swapCandidate = nodeIndex
        if (leftChild !== null && this.comparatorFunction(this.values[swapCandidate] as T, this.values[leftChild] as T) > 0) {
            swapCandidate = leftChild
        }

        if (rightChild !== null && this.comparatorFunction(this.values[swapCandidate] as T, this.values[rightChild] as T) > 0) {
            swapCandidate = rightChild
        }

        if (swapCandidate !== nodeIndex) {
            const node = this.values[nodeIndex]
            this.values[nodeIndex] = this.values[swapCandidate]
            this.values[swapCandidate] = node
            this.bubbleDown(swapCandidate)
        }

        return
    }
}