import { Game } from "./Game";
import { World } from "./world/World";

export class GameObject {

  private parent: GameObject|Game;
  public get Parent(): GameObject|Game {
    return this.parent;
  }
  private needsUpdate: boolean;
  private children: GameObject[] = [];

  public get Game(): Game {
    if (this.parent instanceof Game) {
      return this.parent;
    } else {
      return this.parent.Game;
    }
  }

  constructor(parent: GameObject|Game) {
    this.parent = parent;

    if (parent instanceof Game) {
      parent.addGameObject(this);
    } else {
      parent.addChild(this);
    }
  }

  public addChild(child: GameObject): void {
    this.children.push(child);
  }

  public removeChild(child: GameObject): void {
    this.children = this.children.filter((c) => c !== child);
  }

  protected onUpdate(deltaTime: number): void {
    // Override this method to update the game object
  }

  protected onRender(world: World): void {
    // Override this method to render the game object
  }

  protected onDestory(): void {
    // Override this method to destroy the game object
  }

  public update(deltaTime: number): void {
    for (let child of this.children) {
      child.update(deltaTime);
    }

    this.onUpdate(deltaTime);
  }

  public render(world: World): void {
    for (let child of this.children) {
      child.render(world);
    }

    this.onRender(world);
  }

  public destroy(): void {
    for (let child of this.children) {
      child.destroy();
    }

    this.onDestory();
  }
}