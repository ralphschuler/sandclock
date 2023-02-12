import { Game } from "./Game";
import { Renderer } from "./renderer/Renderer";
import { Matrix } from "./utils/Matrix";
import { Cell } from "./world/Cell";

export abstract class GameObject {

  private parent: GameObject | Game;
  public get Parent(): GameObject | Game {
    return this.parent;
  }
  public get Game(): Game {
    return this.parent instanceof Game ? this.parent : this.parent.Game;
  }

  private updated: boolean;
  public get Updated(): boolean {
    return this.updated;
  }

  private children: GameObject[];
  public get Children(): GameObject[] {
    return this.children;
  }
  protected set Children(children: GameObject[]) {
    this.children = children;
  }

  public constructor(parent: GameObject | Game) {
    this.updated = false;
    this.parent = parent;
    this.children = [];
  }

  public addChild(child: GameObject): void {
    this.children.push(child);
  }

  public removeChild(child: GameObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  protected beforeUpdate(deltaTime: number): void {}
  protected onUpdate(deltaTime: number): boolean { return false; }
  protected afterUpdate(deltaTime: number): void {}
  public update(deltaTime: number): void {
    this.beforeUpdate(deltaTime);

    this.children.forEach((child) => child.update(deltaTime));

    this.updated = this.children.some((child) => child.Updated) || this.updated;
    this.updated = this.onUpdate(deltaTime) || this.Updated;

    this.afterUpdate(deltaTime);
  }

  protected onRender(renderer: Renderer): void {}
  public render(renderer: Renderer): void {
    if (!this.Updated) {
      return;
    }
    this.children.forEach((child) => child.render(renderer));
    this.onRender(renderer);

    this.updated = false;
  }
}