import { GameObject } from "./GameObject";
import { Renderer } from "./renderer/Renderer";
import { World } from "./world/World";

export class Game {

  private renderer: Renderer;
  public get Renderer(): Renderer {
    return this.renderer;
  }

  private world: World;
  public get World(): World {
    return this.world;
  }

  private gameObjects: GameObject[] = [];
  public get GameObjects(): GameObject[] {
    return this.gameObjects;
  }

  public constructor(canvas: HTMLCanvasElement) {
    this.world = new World();
    this.renderer = new Renderer(this, canvas);

    this.renderer.start();
  }

  public addGameObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
  }

  public removeGameObject(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index > -1) {
      this.gameObjects.splice(index, 1);
    }
  }
}