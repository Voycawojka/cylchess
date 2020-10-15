import { List } from "immutable";
import { Action } from "../../interface/Action";
import { Board } from "../../interface/Board";
import { Piece } from "../../interface/Piece";
import { CellPosition, Color } from "../../interface/types";
import { moveCaptureAction, offset } from "../helpers";

export class Pawn implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.PAWN"

    constructor(readonly color: Color, readonly position: CellPosition, private readonly alreadyMoved = false) {
        this.display = this.color === Color.WHITE ? "2659" : "265F"
    }
    
    possibleActions(board: Board): List<Action> {

    }

    moved(pos: CellPosition): Pawn {
        return new Pawn(this.color, pos, true)
    }
}

export class Knight implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.PAWN"

    constructor(readonly color: Color, readonly position: CellPosition) {
        this.display = this.color === Color.WHITE ? "2658" : "265E"
    }

    possibleActions(board: Board): List<Action> {
        return List([
                { x: 1, y: 2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: -1, y: -2 },
                { x: 2, y: 1 }, { x: -2, y: 1 }, { x: 2, y: -1 }, { x: -2, y: -1 }
            ])
            .map(off => moveCaptureAction(this, offset(this.position, off.x, off.y)))
            .filter(({ moveTo }) => board.pieceAt(moveTo.x, moveTo.y).color !== this.color)
    }

    moved(pos: CellPosition): Knight {
        return new Knight(this.color, pos)
    }
}

export class Bishop implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.BISHOP"

    constructor(readonly color: Color, readonly position: CellPosition) {
        this.display = this.color === Color.WHITE ? "2657" : "265D"
    }

    possibleActions(board: Board): List<Action> {
        
    }

    moved(pos: CellPosition): Bishop {
        return new Bishop(this.color, pos)
    }
}
