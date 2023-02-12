import { Game } from "../Game";
import { Camera } from "./Camera";
import { Color } from "./Color";
import { Vector2 } from "./Vector2";
import { WebGL } from "./WebGL";

export class Renderer {

  private isRunning: boolean = false;
  private lastTime: number = 0;

  private webgl: WebGL;

  private game: Game;
  private camera: Camera;

  public constructor(game: Game, canvas: HTMLCanvasElement) {
    this.game = game;

    this.webgl = new WebGL(canvas);

    this.camera = new Camera(new Vector2(0, 0), new Vector2(canvas.width, canvas.height));
  }

  public start(): void {
    this.isRunning = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  public stop(): void {
    this.isRunning = false;
  }
  
  private loop(): void {
    const now = Date.now();
    const deltaTime = now - this.lastTime;

    this.update(deltaTime);
    this.render(deltaTime);
    // this.drawScene();

    this.lastTime = now;

    if (this.isRunning) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  private update(deltaTime: number): void {
    this.game.World.update(deltaTime);
    this.game.GameObjects.forEach((gameObject) => {
      gameObject.update(deltaTime);
    });
  }

  private render(deltaTime: number): void {
    this.game.World.render(deltaTime);
    this.game.GameObjects.forEach((gameObject) => {
      gameObject.render(deltaTime);
    });
  }

  private drawScene(): void {
    const scene = this.game.World.getArea(this.camera.Pos, this.camera.Size);
    this.webgl.drawScene(scene);
  }
}

