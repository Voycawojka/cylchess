import { List } from "immutable";
import { walkerActions } from "../../helpers/actionHelpers";
import { pos, positionsNextTo } from "../../helpers/positionHelpers";
import { Action } from "../../interface/Action";
import { Board } from "../../interface/Board";
import { Piece } from "../../interface/Piece";
import { CellPosition, Color } from "../../interface/types";
import { King } from "../regular/regularPieces";

/**
 * Works like a regular Pawn but moves in the opossite direction
 */
export class Nwap implements Piece {
    readonly display: string
    readonly name: string = "PIECE.CYLCHESS.NWAP"

    constructor(readonly color: Color, readonly position: CellPosition, private readonly movedTimes = 0) {
        this.display = this.color === Color.WHITE ? "2659" : "265F" // TODO change codes
    }

    possibleActions(board: Board): List<Action> {
        const direction = this.color === Color.WHITE ? 1 : -1
        const maxMoves = this.movedTimes === 0 ? 2 : 1

        const normalMoves = walkerActions(this, board, List([pos(0, direction)]), maxMoves)

        // TODO en passant

        return normalMoves
    }

    moved(pos: CellPosition): Nwap {
        return new Nwap(this.color, pos, this.movedTimes + 1)
    }
}

/**
 * This piece can only move in the same way as pieces next to it (no matter the color) apart from kings and other spies.
 */
export class Spy implements Piece {
    readonly display: string
    readonly name: string = "PIECE.CYLCHESS.SPY"

    constructor(readonly color: Color, readonly position: CellPosition) {
        this.display = this.color === Color.WHITE ? "2659" : "265F" // TODO change codes
    }

    possibleActions(board: Board): List<Action> {
        return positionsNextTo(this.position, true)
            .map(({ x, y }) => board.pieceAt(x, y))
            .filter(piece => piece !== null)
            .map(piece => piece as Piece) // without this line typescript thinks the type of `piece` is `Piece | null` for some reason
            .filterNot(piece => piece instanceof King || piece instanceof Spy)
            .map(piece => this.copyOtherPiece(piece, this.position))
            .flatMap(copy => copy.possibleActions(board))
    }

    moved(pos: CellPosition): Spy {
        return new Spy(this.color, pos)
    }

    private copyOtherPiece<T extends Piece>(piece: T, newPos: CellPosition): T {
        const copy = JSON.parse(JSON.stringify(piece))
        copy.position = newPos

        return copy as T
    }
}
