import { Color } from "../utils/Color";

export enum ElementType {
  Solid = 0,
  Liquid = 1,
  Gas = 2,
}

export interface INeighbor {
  readonly element: IElement;
  readonly becomes: IElement;
  readonly minimum: number;
  readonly maximum: number;
  readonly affects: number
}

export interface IReaction {
  readonly chance: number;
  readonly becomes: IElement;
  readonly explosion: number;
  readonly singleNeighbor: INeighbor;
  readonly multiNeighbor: INeighbor[];
}

export interface IElement {
  readonly Name: string;
  readonly Colors: Color[];

  readonly Gravity: number;
  readonly Density: number;
  readonly Friction: number;
 
  readonly Reactions: IReaction[];
  readonly SelfReactions: IReaction[];

  readonly Type: ElementType;
}