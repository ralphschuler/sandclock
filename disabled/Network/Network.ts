import { Layer } from './Layer';
import { Neuron } from './Neuron';

export class Network {
  private inputLayer: Layer;
  private hiddenLayers: Array<Layer>;
  private outputLayer: Layer;

  public constructor(inputLayerLength: number, hiddenLayerLengths: Array<number>, outputLayerLength: number) {
    this.inputLayer = new Layer(inputLayerLength);
    this.hiddenLayers = hiddenLayerLengths.map(length => new Layer(length));
    this.outputLayer = new Layer(outputLayerLength);
  }

  public connect(): void {
    this.inputLayer.connect(this.hiddenLayers[0]);
    this.hiddenLayers.slice(1).forEach((layer, index) => {
      this.hiddenLayers[index].connect(this.hiddenLayers[index + 1]);
    });
    this.hiddenLayers[this.hiddenLayers.length - 1].connect(this.outputLayer);
  }

  public activate(input: Array<number>): Array<number> {
    const output = this.inputLayer.Neurons.map(
      (neuron: Neuron, index: number) => neuron.activate(input[index]));
    return this.outputLayer.Neurons.map(
      (neuron: Neuron, index: number) => neuron.activate(output[index]));
  }

  public propagate(error: Array<number>): void {
    const output = this.inputLayer.Neurons.map(
      (neuron: Neuron, index: number) => neuron.activate(error[index]));
    this.outputLayer.Neurons.map(
      (neuron: Neuron, index: number) => neuron.propagate(output[index]));
  }

  public train(input: Array<number>, output: Array<number>): void {
    const outputActivation = this.activate(input);
    const error = output.map((value, index) => value - outputActivation[index]);
    this.propagate(error);
  }

  public toObject(): object {
    return {
      inputLayer: this.inputLayer.toObject(),
      hiddenLayers: this.hiddenLayers.map(layer => layer.toObject()),
      outputLayer: this.outputLayer.toObject(),
    };
  }
}
