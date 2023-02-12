export class DNA {
    private readonly genes: Array<number>;
    public get Genes(): Array<number> {
        return this.genes;
    }

    constructor(genes: Array<number>) {
        this.genes = genes;
    }

    public crossover(partner: DNA): DNA {
        let midpoint = Math.floor(Math.random() * this.genes.length);
        let childGenes: Array<number> = [];

        for (let i = 0; i < this.genes.length; i++) {
            if (i > midpoint) {
                childGenes[i] = this.genes[i];
            } else {
                childGenes[i] = partner.genes[i];
            }
        }

        return new DNA(childGenes);
    }

    public mutate(mutationRate: number): void {
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < mutationRate) {
                this.genes[i] = Math.floor(Math.random() * 256);
            }
        }
    }

    public copy(): DNA {
        return new DNA(this.genes);
    }

    public toString(): string {
        return this.genes.join("");
    }

    public static random(length: number): DNA {
        let genes: Array<number> = [];

        for (let i = 0; i < length; i++) {
            genes[i] = Math.floor(Math.random() * 256);
        }

        return new DNA(genes);
    }

    public static fromString(str: string): DNA {
        let genes: Array<number> = [];

        for (let i = 0; i < str.length; i++) {
            genes[i] = str.charCodeAt(i);
        }

        return new DNA(genes);
    }
}