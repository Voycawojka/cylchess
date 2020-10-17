import { List, Map } from "immutable"
import { isSafe, allActions } from "../../../helpers/boardHelpers"
import { toggleColor } from "../../../helpers/colorHelpers"
import { pos } from "../../../helpers/positionHelpers"
import { Action } from "../../../interface/Action"
import { Board } from "../../../interface/Board"
import { Piece } from "../../../interface/Piece"
import { Color, CellPosition } from "../../../interface/types"
import { Pawn, Knight, Bishop, Rook, Queen, King } from "./regularPieces"

/**
 * Implementation of classical chess.
 * It's made to be simple to extend and create other variants based on it. Most of the time you don't need to implement the Board interface directly.
 */
export class RegularBoard implements Board {
    readonly pieces: List<Piece>
    readonly turnOf: Color

    private readonly startingColor = Color.WHITE
    
    constructor(pieces?: List<Piece>, readonly turnCount = 0) {
        this.pieces = pieces ?? this.createInitialPieces()
        this.turnOf = turnCount % 2 === 0 ? this.startingColor : toggleColor(this.startingColor)
    }

    // This is a getter instead of a readonly property so that it can be overriden
    get size() {
        return { w: 10, h: 10 }
    }

    // This is a getter instead of a readonly property so that it can be overriden
    get noneCells(): List<CellPosition> {
        return List()
    }

    // This should generally be overriden for every variant
    pieceValue(piece: Piece): number {
        // Based on Hans Berliner's valuations
        // TODO take pieces' positions into account
        switch (piece.constructor) {
            case Pawn: return 1
            case Knight: return 3.2
            case Bishop: return 3.33
            case Rook: return 5.1
            case Queen: return 8.8
            case King: return 1000
            default: return 0
        }
    }

    pieceAt(x: number, y: number): Piece | null {
        return this.pieces.find(piece => piece.position.x === x && piece.position.y === y) ?? null;
    }

    inBoard(x: number, y: number): boolean {
        return x >= 0 && x < this.size.w && y >= 0 && y < this.size.h && !this.noneCells.includes(pos(x, y))
    }

    applyAction({ piece, moveTo, captureAt, chainedAction }: Action): Board {
        const newPieces = this.handleCaptures(this.pieces, captureAt, piece)
            .map(p => p === piece && !!moveTo ? piece.moved(moveTo) : piece)
        
        const newBoard = this.constructNewInstance(newPieces)
        
        return !!chainedAction
            ? newBoard.applyAction(chainedAction)
            : newBoard
    }

    // By default all actions that would cause the opposite player to be a winner (see `winner` method) are invalid
    validateAction(action: Action): boolean {
        const hyphoteticalBoard = this.applyAction(action)

        return hyphoteticalBoard.winner() !== toggleColor(action.piece.color)
    }

    // By default a player wins if the oponnent's king is in check and the player can't make any valid action
    winner(): Color | null {
        const checkMatedKing = this.pieces
            .filter(piece => piece instanceof King)
            .filterNot(king => isSafe(king.position, this, toggleColor(king.color)))
            .filter(checkedKing => allActions(this, checkedKing.color).size === 0)
            .get(0)
        
        if (!!checkMatedKing) {
            return toggleColor(checkMatedKing.color)
        }

        return null
    }

    // By default a draw occures if there is no winner and the active player cannot take any action
    isDraw(): boolean {
        return allActions(this, this.turnOf).size === 0 && this.winner() === null
    }

    /**
     * Contains capturing logic. 
     * Creates a new list of pieces based on captured positions.
     */
    protected handleCaptures(pieces: List<Piece>, captureAt: List<CellPosition>, _capturer: Piece): List<Piece> {
        return pieces.filter(piece => !captureAt.includes(piece.position))
    }

    /**
     * Constructs pieces for the initial state of the board
     */
    protected createInitialPieces(): List<Piece> {
        return List([

        ])
    }

    /**
     * Constructs a new instance of the object taking inheritance into account.
     * Should be overriden if a child class has different constructor parameters than RegularBoard
     */
    protected constructNewInstance(pieces: List<Piece>): Board {
        return new (this.constructor as any)(pieces, this.turnCount + 1)
    }
}
