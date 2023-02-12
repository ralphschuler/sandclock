import { GameObject } from "./GameObject";
import { Color } from "../engine/utils/Color";
import { World } from "./world/World";
import { Renderer } from "./renderer/Renderer";
import { ThreadPool } from "./threadPool/ThreadPool";

export class Game {

  private isRunning: boolean = false;
  private lastTime: number = 0;

  private threadPool: ThreadPool;
  private renderer: Renderer;
  private gameObjects: GameObject[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.threadPool = new ThreadPool(4);
    this.renderer = new Renderer(canvas);
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

    if (now % 5000 < deltaTime) {
      console.log("FPS:", Math.round(1000 / deltaTime), "Delta:", deltaTime + "ms");
    }

    this.update(deltaTime);
    this.renderer.render(...this.gameObjects);

    if (this.isRunning) {
      this.lastTime = now;
      requestAnimationFrame(() => this.loop());
    }
  }

  private update(deltaTime: number): void {
    for (let gameObject of this.gameObjects) {
      gameObject.update(deltaTime);
    }
  }

  public addGameObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
  }

  public removeGameObject(gameObject: GameObject): void {
    this.gameObjects = this.gameObjects.filter((go) => go !== gameObject);
  }
}