import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import { Vector2 } from '../renderer/Vector2';

export function Noise(offset: Vector2, size: number, seed: number, args: {
    octaves: number,
    persistence: number,
    lacunarity: number,
    frequency: number,
    amplitude: number,
    scale: number,
}) {
    const prng = alea(seed);
    let noise2D = createNoise2D(prng)
    let data = new Float32Array(size * size);
    let scale = args.scale;
    let frequency = args.frequency;
    let amplitude = args.amplitude;
    let persistence = args.persistence;
    let lacunarity = args.lacunarity;
    let octaves = args.octaves;
    let max = 0;
    let min = 0;
    for (let octave = 0; octave < octaves; octave++) {
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let noise = noise2D(
                    (x + offset.x) * frequency * scale,
                    (y + offset.y) * frequency * scale
                );
                data[x + y * size] += noise * amplitude;
                if (data[x + y * size] > max) max = data[x + y * size];
                if (data[x + y * size] < min) min = data[x + y * size];
            }
        }
        frequency *= lacunarity;
        amplitude *= persistence;
    }
    return data;
}