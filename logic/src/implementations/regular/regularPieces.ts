import { List } from "immutable";
import { Action } from "../../interface/Action";
import { Board } from "../../interface/Board";
import { Piece } from "../../interface/Piece";
import { CellPosition, Color } from "../../interface/types";
import { jumperActions, walkerActions } from "../../helpers/actionHelpers";
import { pos } from "../../helpers/positionHelpers";
import { isEmptyLine, isSafe } from "../../helpers/boardHelpers";
import { toggleColor } from "../../helpers/colorHelpers";

export class Pawn implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.PAWN"

    constructor(readonly color: Color, readonly position: CellPosition, private readonly movedTimes = 0) {
        this.display = this.color === Color.WHITE ? "2659" : "265F"
    }

    possibleActions(board: Board): List<Action> {
        const direction = this.color === Color.WHITE ? -1 : 1
        const maxMoves = this.movedTimes === 0 ? 2 : 1

        const normalMoves = walkerActions(this, board, List([pos(0, direction)]), maxMoves)

        // TODO en passant

        return normalMoves
    }

    moved(pos: CellPosition): Pawn {
        return new Pawn(this.color, pos, this.movedTimes + 1)
    }
}

export class Knight implements Piece {
    readonly display: string
    readonly name: string = "PIECE.REGULAR.KNIGHT"

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
        return walkerActions(this, board, List([pos(-1, -1), pos(-1, 1), pos(1, -1), pos(1, 1)]))
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
        return walkerActions(this, board, List([pos(-1, 0), pos(1, 0), pos(0, -1), pos(0, 1)]))
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
        return walkerActions(this, board, List([
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
        const opponentColor = toggleColor(this.color)

        const normalActions = jumperActions(this, board, List([pos(1, 0), pos(-1, 0), pos(0, 1), pos(0, -1)]))
            .filter(action => !action.moveTo || isSafe(action.moveTo, board, opponentColor))
        
        const castlingActions: List<Action> = this.alreadyMoved || !isSafe(this.position, board, opponentColor)
            ? List([])
            : board.pieces
                .filter(piece => piece.color === this.color && piece instanceof Rook && !piece.alreadyMoved)
                .filter(piece => isEmptyLine(this.position, piece.position, board, opponentColor))
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
