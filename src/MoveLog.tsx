import { PieceType } from "./ChessUtils";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Action {
  id: string;
}

export class MoveAction implements Action {
  id: string = "";
  from: Vector2 = { x: 0, y: 0 };
  to: Vector2 = { x: 0, y: 0 };
}

export class TransformAction implements Action {
  id: string = "";
  at: Vector2 = { x: 0, y: 0 };
  pieceType: PieceType = PieceType.Empty;
}

export class TakeAction implements Action {
  id: string = "";
  at: Vector2 = { x: 0, y: 0 };
}

export class PromoteAction implements Action {
  id: string = "";
  at: Vector2 = { x: 0, y: 0 };
  pieceType: PieceType = PieceType.Empty;
}

export class EnPassantAction implements Action {
  id: string = "";
  at: Vector2 = { x: 0, y: 0 };
}

export class FirstMoveAction implements Action {
  id: string = "";
  at: Vector2 = { x: 0, y: 0 };
}

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
