import { GameObject } from "../GameObject";
import { World } from "../world/World";
import { drawBufferInfo, setBuffersAndAttributes, setUniforms, BufferInfo, createBufferInfoFromArrays, createProgramInfo, ProgramInfo, resizeCanvasToDisplaySize, createTexture } from "twgl.js";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { Vector2 } from "../utils/Vector2";
import { Color } from "../../engine/utils/Color";


export class Renderer {

  private canvas: HTMLCanvasElement;
  private webGLContext: WebGLRenderingContext;
  private programInfo: ProgramInfo;
  private bufferInfo: BufferInfo;
  private texture: WebGLTexture | null = null;
  private pixels: PixelArray | null = null;

  private world: World;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.webGLContext = canvas.getContext("webgl") as WebGLRenderingContext;

    this.webGLContext.clearColor(0, 0, 0, 1);

    this.world = new World(64);

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

    this.setup();
  }

  private setup() {
    const pixelsWidth = Math.pow(2, Math.ceil(Math.log2(this.canvas.width)));
    const pixelsHeight = Math.pow(2, Math.ceil(Math.log2(this.canvas.height)));
    this.pixels = new Uint8Array(pixelsWidth * pixelsHeight * 3) as PixelArray;
    this.pixels.width = pixelsWidth;
    this.pixels.height = pixelsHeight;

    this.texture = createTexture(this.webGLContext, {
      src: this.pixels,
      width: this.pixels.width,
      height: this.pixels.height,
      format: this.webGLContext.RGB,
      type: this.webGLContext.UNSIGNED_BYTE,
      min: this.webGLContext.NEAREST,
      mag: this.webGLContext.NEAREST,
      wrap: this.webGLContext.CLAMP_TO_EDGE,
    });

    setUniforms(this.programInfo, {
      u_texture: this.texture,
    });
  }

  public render(...gameObjects: GameObject[]) {
    this.resize();

    for (let gameObject of gameObjects) {
      gameObject.render(this.world);
    }

    this.flush();
    this.draw();
  }

  private resize() {
    this.setup();
    resizeCanvasToDisplaySize(this.canvas);
    this.webGLContext.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private flush() {
    const range = this.world.getRange(new Vector2(0, 0), new Vector2(this.canvas.width, this.canvas.height));

    for (let i = 0; i < range.length; i++) {
      const color = range[i];
      const [r, g, b] = color.toRgb();

      (this.pixels as PixelArray)[i * 3] = Math.floor(r * 255);
      (this.pixels as PixelArray)[i * 3 + 1] = Math.floor(g * 255);
      (this.pixels as PixelArray)[i * 3 + 2] = Math.floor(b * 255);
    }
  }

  private draw() {
    this.webGLContext.clear(this.webGLContext.COLOR_BUFFER_BIT);

    this.webGLContext.bindTexture(this.webGLContext.TEXTURE_2D, this.texture);

    this.webGLContext.texImage2D(this.webGLContext.TEXTURE_2D, 0, this.webGLContext.RGB, this.canvas.width, this.canvas.height, 0, this.webGLContext.RGB, this.webGLContext.UNSIGNED_BYTE, this.pixels);

    setBuffersAndAttributes(this.webGLContext, this.programInfo, this.bufferInfo);

    drawBufferInfo(this.webGLContext, this.bufferInfo, this.webGLContext.TRIANGLE_STRIP);
  }

}