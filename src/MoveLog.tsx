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
  transformFrom: PieceType;
  transformTo: PieceType;
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

class MoveLogs {
  logs: MoveLog[] = [];
  offset: number = 0;

  addLog(log: MoveLog) {
    if (this.offset < this.logs.length)
      this.logs = this.logs.slice(0, this.offset);

    this.logs.push(log);
    this.offset = this.logs.length;
  }

  nextLog() {
    if (this.offset < this.logs.length) this.offset++;
    else return null;
    return this.logs[this.offset - 1];
  }

  previousLog() {
    if (this.offset > 0) this.offset--;
    else return null;

    return this.logs[this.offset];
  }
}

export default MoveLogs;
