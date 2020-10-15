import { List } from "immutable";
import { Action } from "../../interface/Action";
import { Board } from "../../interface/Board";
import { Piece } from "../../interface/Piece";
import { CellPosition, Color } from "../../interface/types";
import { jumperActions, moveCaptureAction, unlimitedWalkerActions } from "../../helpers/actionHelpers";
import { pos } from "../../helpers/positionHelpers";
import { isEmptyLine } from "../../helpers/boardHelpers";

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
        return jumperActions(this, board, List([
            pos(1, 2), pos(-1, 2), pos(1, -2), pos(-1, -2),
            pos(2, 1), pos(-2, 1), pos(2, -1), pos(-2, -1)
        ]))
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
        return unlimitedWalkerActions(this, board, List([pos(-1, -1), pos(-1, 1), pos(1, -1), pos(1, 1)]))
    }

    moved(pos: CellPosition): Bishop {
        return new Bishop(this.color, pos)
    }
}

export class Rook implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.ROOK"

    constructor(readonly color: Color, readonly position: CellPosition, readonly alreadyMoved = false) {
        this.display = this.color === Color.WHITE ? "2656" : "265C"
    }

    possibleActions(board: Board): List<Action> {
        return unlimitedWalkerActions(this, board, List([pos(-1, 0), pos(1, 0), pos(0, -1), pos(0, 1)]))
    }

    moved(pos: CellPosition): Rook {
        return new Rook(this.color, pos, true)
    }
}

export class Queen implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.QUEEN"

    constructor(readonly color: Color, readonly position: CellPosition) {
        this.display = this.color === Color.WHITE ? "2655" : "265B"
    }

    possibleActions(board: Board): List<Action> {
        return unlimitedWalkerActions(this, board, List([
            pos(-1, 0), pos(1, 0), pos(0, -1), pos(0, 1),
            pos(-1, -1), pos(-1, 1), pos(1, -1), pos(1, 1)
        ]))
    }

    moved(pos: CellPosition): Queen {
        return new Queen(this.color, pos)
    }
}

export class King implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.KING"

    constructor(readonly color: Color, readonly position: CellPosition, private readonly alreadyMoved = false) {
        this.display = this.color === Color.WHITE ? "2654" : "265A"
    }

    possibleActions(board: Board): List<Action> {
        const normalActions = jumperActions(this, board, List([pos(1, 0), pos(-1, 0), pos(0, 1), pos(0, -1)]))
        
        const castlingActions: List<Action> = this.alreadyMoved
            ? List([])
            : board.pieces
                .filter(piece => piece.color === this.color && piece instanceof Rook && !piece.alreadyMoved)
                .filter(piece => isEmptyLine(this.position, piece.position, board))
                .map(rook => ({
                        piece: this,
                        moveTo: pos(0, 0), // TODO where to move?
                        captureAt: List([]),
                        chainedAction: {
                            piece: rook,
                            moveTo: pos(0, 0), // TODO where to move?
                            captureAt: List([]),
                        }
                    }
                ))
        
        return normalActions.merge(castlingActions)
    }

    moved(pos: CellPosition): King {
        return new King(this.color, pos, true)
    }
}
