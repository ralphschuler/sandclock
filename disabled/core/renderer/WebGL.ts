import { ProgramInfo, BufferInfo, getContext, createBufferInfoFromArrays, createProgramInfo, setDefaults, createTexture } from "twgl.js";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { Color } from "./Color";

interface PixelBuffer extends Uint8Array {
  width: number;
  height: number;
}

export class WebGL {
  private gl: WebGLRenderingContext;
  private programInfo: ProgramInfo;
  private bufferInfo: BufferInfo;

  public constructor(canvas: HTMLCanvasElement) {
    this.gl = getContext(canvas, {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });

    this.bufferInfo = createBufferInfoFromArrays(this.gl, {
      position: {
        numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1]
      }
    });

    this.programInfo = createProgramInfo(this.gl, [
      vertexShader, fragmentShader
    ]);

    this.gl.useProgram(this.programInfo.program);

    setDefaults({
      attribPrefix: "a_",
      textureColor: [0, 0, 0, 1],
    })

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clearColor(0, 0, 0, 1);
  }

  public get BufferInfo(): BufferInfo {
    return this.bufferInfo;
  }

  public drawScene(colors: Color[]): void {
    const pixels: PixelBuffer = new Uint8Array(this.gl.canvas.width * this.gl.canvas.height * 4) as PixelBuffer;
    pixels.width = this.gl.canvas.width;
    pixels.height = this.gl.canvas.height;
    colors.forEach((color: Color, index) => {
      const [r, g, b] = color.toRgb();
      pixels[index * 3] = r;
      pixels[index * 3 + 1] = g;
      pixels[index * 3 + 2] = b;
    });
    const texture = createTexture(this.gl, {
      src: pixels,
      width: this.gl.canvas.width,
      height: this.gl.canvas.height,
      min: this.gl.NEAREST,
      mag: this.gl.NEAREST,
      wrap: this.gl.CLAMP_TO_EDGE,
    });

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.canvas.width, this.gl.canvas.height, 0, this.gl.RGB, this.gl.UNSIGNED_BYTE, pixels);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.bufferInfo.numElements);
  }
}