import { PieceType } from "./ChessUtils";

export interface Vector2 {
  x: number;
  y: number;
}

export enum ActionType {
  Move = "Move",
  Transform = "Transform",
  Take = "Take",
  Promote = "Promote",
  EnPassant = "EnPassant",
  FirstMove = "FirstMove",
  MovedUI = "MovedUI"
}

export interface BaseAction {
  id: string;
  type: ActionType;
}

export interface MoveAction extends BaseAction {
  type: ActionType.Move;
  from: Vector2;
  to: Vector2;
}

export interface TransformAction extends BaseAction {
  type: ActionType.Transform;
  at: Vector2;
  pieceType: PieceType;
}

export interface TakeAction extends BaseAction {
  type: ActionType.Take;
  at: Vector2;
}

export interface PromoteAction extends BaseAction {
  type: ActionType.Promote;
  at: Vector2;
  pieceType: PieceType;
}

export interface EnPassantAction extends BaseAction {
  type: ActionType.EnPassant;
  at: Vector2;
}

export interface FirstMoveAction extends BaseAction {
  type: ActionType.FirstMove;
  at: Vector2;
}

export interface MovedUIAction extends BaseAction {
  type: ActionType.MovedUI;
  fromFrom: Vector2;
  fromTo: Vector2;
  toFrom: Vector2;
  toTo: Vector2;
}

export type Action =
  | MoveAction
  | TransformAction
  | TakeAction
  | PromoteAction
  | EnPassantAction
  | FirstMoveAction
  | MovedUIAction;

export interface MoveLog {
  actions: Action[];
}

const moveLogs = {
  logs: [] as MoveLog[],
  offset: 0 as number,

  addAction(action: Action) {
    if (this.logs.length === 0) {
      this.logs.push({ actions: [action] });
    } else {
      this.logs[this.logs.length - 1].actions.push(action);
    }
  },

  addLog(log: MoveLog) {
    this.logs.push(log);
  },

  nextLog() {
    if (this.offset < this.logs.length - 1) {
      this.offset++;
    }
    return this.logs[this.offset];
  },

  previousLog() {
    if (this.offset > 0) {
      this.offset--;
    }
    return this.logs[this.offset];
  }
};
