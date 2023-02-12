import { Neuron } from './Neuron';

export class Layer {

    private neurons: Array<Neuron>;
    public get Neurons(): Array<Neuron> {
        return this.neurons;
    }

    public constructor(length: number) {
        this.neurons = new Array<Neuron>(length);
    }

    public connect(layer: Layer): void {
        for (let i = 0; i < this.Neurons.length; i++) {
            for (let j = 0; j < layer.Neurons.length; j++) {
                this.Neurons[i].connect(layer.Neurons[j], Math.random());
            }
        }
    }

    public toObject(): object {
        return {
            neurons: this.neurons.map(neuron => neuron.toObject())
        };
    }
}