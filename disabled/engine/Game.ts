import { Renderer } from "./renderer/Renderer";
import { Matrix } from "./utils/Matrix";
import { Vector2 } from "./utils/Vector2";
import { Cell } from "./world/Cell";
import { World } from "./world/World";

export class Game {

  private isRunning: boolean = false;
  private world: World;
  public get World(): World {
    return this.world;
  }
  private renderer: Renderer;
  public get Renderer(): Renderer {
    return this.renderer;
  }

  public constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.world = new World(this, new Vector2(canvas.width, canvas.height));
  }

  public start() {
    this.isRunning = true;
    const now = Date.now();
    requestAnimationFrame(() => this.loop.bind(this)(now));
  }

  public stop() {
    this.isRunning = false;
  }

  private update(delta: number) {
    this.world.update(delta);
  }

  private render() {
    const cells = this.world.Cells;

    this.renderer.Buffer = cells.Data.map((cell) => cell.Color);

    this.renderer.render();
  }

  private loop(time: number = Date.now()) {
    const now = Date.now();
    const delta = now - time;

    this.update(delta);
    this.render();

    if (this.isRunning) {
      requestAnimationFrame(() => this.loop.bind(this)(now));
    }
  }
}