import {
  createBufferInfoFromArrays,
  createProgramInfo,
  createTexture,
  drawBufferInfo,
  ProgramInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  BufferInfo
} from "twgl.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { Vector2 } from "../utils/Vector2";
import { Color } from "../utils/Color";

interface PixelArray extends Uint8Array {
  width: number;
  height: number;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private webGLContext: WebGLRenderingContext;
  private programInfo: ProgramInfo;
  private bufferInfo: BufferInfo;
  private texture: WebGLTexture;
  private pixels: PixelArray = new Uint8Array(0) as PixelArray;
  private buffer: Color[] = [];
  public get Buffer(): Color[] {
    return this.buffer;
  }
  public set Buffer(value: Color[]) {
    this.buffer = value;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.webGLContext = canvas.getContext("webgl") as WebGLRenderingContext;

    this.webGLContext.clearColor(0, 0, 0, 1);

    this.programInfo = createProgramInfo(this.webGLContext, [
      vertexShader,
      fragmentShader
    ]);

    this.bufferInfo = createBufferInfoFromArrays(this.webGLContext, {
      position: {
        numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1]
      },
    });

    this.webGLContext.useProgram(this.programInfo.program);

    this.setupBuffers();

    this.texture = createTexture(this.webGLContext, {
      src: this.pixels,
      width: this.pixels.width,
      height: this.pixels.height,
      format: this.webGLContext.RGBA,
      type: this.webGLContext.UNSIGNED_BYTE,
      min: this.webGLContext.NEAREST,
      mag: this.webGLContext.NEAREST,
      wrap: this.webGLContext.CLAMP_TO_EDGE,
    });

    setUniforms(this.programInfo, {
      u_texture: this.texture,
    });
  }

  private setupBuffers() {
    const pixelsWidth = Math.pow(2, Math.ceil(Math.log2(this.canvas.width)));
    const pixelsHeight = Math.pow(2, Math.ceil(Math.log2(this.canvas.height)));
    this.pixels = new Uint8Array(pixelsWidth * pixelsHeight * 4) as PixelArray;
    this.pixels.width = pixelsWidth;
    this.pixels.height = pixelsHeight;

    this.buffer = new Array(this.canvas.width * this.canvas.height);
  }

  public resize(): void {
    resizeCanvasToDisplaySize(this.canvas);
    this.webGLContext.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.setupBuffers();
  }

  public setPixel(pos: Vector2, color: Color): void {
    this.buffer[pos.x + pos.y * this.canvas.width] = color;
  }

  private flush(): void {
    this.pixels = this.buffer.reduce((acc, color, index) => {
      if (color) {
        acc[index * 3] = color.r;
        acc[index * 3 + 1] = color.g;
        acc[index * 3 + 2] = color.b;
        acc[index * 3 + 3] = color.a;
      }
      return acc;
    }, this.pixels) as PixelArray;
  }

  public render() {
    this.webGLContext.clear(this.webGLContext.COLOR_BUFFER_BIT);

    this.flush();

    this.webGLContext.bindTexture(this.webGLContext.TEXTURE_2D, this.texture);
    this.webGLContext.texImage2D(
      this.webGLContext.TEXTURE_2D,
      0,
      this.webGLContext.RGBA,
      this.pixels.width,
      this.pixels.height,
      0,
      this.webGLContext.RGBA,
      this.webGLContext.UNSIGNED_BYTE,
      this.pixels
    );

    setBuffersAndAttributes(this.webGLContext, this.programInfo, this.bufferInfo);

    drawBufferInfo(this.webGLContext, this.bufferInfo);
  }
}