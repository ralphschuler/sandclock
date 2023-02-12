import { Game } from "../Game";
import { GameObject } from "../GameObject";
import { ElementType, IElement } from "../interfaces/IElement";
import { Color } from "../utils/Color";
import { Vector2 } from "../utils/Vector2";

export class Cell extends GameObject {
  private position: Vector2;
  public get Position(): Vector2 {
    return this.position;
  }
  private element: IElement;

  public get Color(): Color {
    const colors = this.element.Colors;
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  public constructor(parent: GameObject | Game, position: Vector2, element?: IElement) {
    super(parent);
    this.position = position;
    this.element = element || {
      Name: "Empty",
      Colors: [Color.Black, Color.White],
      Gravity: 0,
      Density: 0,
      Friction: 0,
      Reactions: [],
      SelfReactions: [],
      Type: ElementType.Gas,
    };
  }

  protected onUpdate(deltaTime: number): boolean {
    return true;
  }
}
