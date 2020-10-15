import { List } from "immutable"
import { Action } from "../../interface/Action"
import { Board } from "../../interface/Board"
import { CellPosition, Color } from "../../interface/types"
import { Piece } from "../../interface/Piece"
import { toggleColor } from "../helpers"

/**
 * Implementation of classical chess.
 * It's made to be simple to extend and create other variants based on it. Most of the time you don't need to implement Board directly.
 */
export class RegularBoard implements Board {
    readonly pieces: List<Piece>
    readonly turnOf: Color
    
    constructor(private readonly startingColor: Color, pieces?: List<Piece>, readonly turnCount = 0) {
        this.pieces = pieces ?? this.createInitialPieces()
        this.turnOf = turnCount % 2 === 0 ? startingColor : toggleColor(startingColor)
    }

    // This is a getter instead of a readonly property so that it can be overriden
    get size() {
        return { w: 10, h: 10 }
    }

    // This is a getter instead of a readonly property so that it can be overriden
    get noneCells(): List<CellPosition> {
        return List()
    }

    pieceAt(x: number, y: number): Piece | null {
        return this.pieces.find(piece => piece.position.x === x && piece.position.y === y) ?? null;
    }

    inBoard(x: number, y: number): boolean {
        return x >= 0 && x < this.size.w && y >= 0 && y < this.size.h
    }

    applyAction({ piece, moveTo, captureAt, chainedAction }: Action): Board {
        const newPieces = this.handleCaptures(this.pieces, captureAt)
            .map(p => p === piece && !!moveTo ? piece.moved(moveTo) : piece)
        
        const newBoard = this.constructNewInstance(newPieces)
        
        return !!chainedAction
            ? newBoard.applyAction(chainedAction)
            : newBoard
    }

    /**
     * Contains capturing logic. 
     * Creates a new list of pieces based on captured positions.
     */
    protected handleCaptures(pieces: List<Piece>, captureAt: List<CellPosition>): List<Piece> {
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
        return new (this.constructor as any)(this.startingColor, pieces, this.turnCount + 1)
    }
}