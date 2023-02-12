export type Connection = {
    weight: number;
    neuron: Neuron;
}

export class Neuron {
    private incomingConnections: Array<{ weight: number, neuron: Neuron }>;
    private outgoingConnections: Array<{ weight: number, neuron: Neuron }>;

    private bias: number;

    public constructor(bias: number) {
        this.bias = bias;
    }

    public connect(neuron: Neuron, weight: number): void {
        this.outgoingConnections.push({
            weight,
            neuron
        });

        neuron.incomingConnections.push({
            weight,
            neuron: this
        });
    }

    public activate(input: number): number {
        let sum = 0;
        for (const connection of this.incomingConnections) {
            sum += connection.weight * connection.neuron.activate(input);
        }
        return this.bias + sum;
    }

    public propagate(error: number): void {
        for (const connection of this.outgoingConnections) {
            connection.neuron.propagate(error * connection.weight);
        }
    }

    public toObject(): object {
        return {
            bias: this.bias,
            incomingConnections: this.incomingConnections.map(connection => {
                return {
                    weight: connection.weight,
                    neuron: connection.neuron.toObject()
                };
            }),
            outgoingConnections: this.outgoingConnections.map(connection => {
                return {
                    weight: connection.weight,
                    neuron: connection.neuron.toObject()
                };
            })
        }
    }
}