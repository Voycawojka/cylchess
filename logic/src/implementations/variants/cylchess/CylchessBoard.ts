import { List } from "immutable"
import { Piece } from "../../../interface/Piece"
import { RegularBoard } from "../regular/RegularBoard"
import { Bishop, King, Knight, Pawn, Queen, Rook } from "../regular/regularPieces"
import { Nwap, Spy } from "./cylchessPieces"

/**
 * Implementation of a custom cyllindrical variant. 
 * Originaly the Cylchess website was just a simple close-sourced vanilla-js + Express app made specificaly to play this variant online.
 * This is the most nostalgic of variants.
 */
export class CylchessBoard extends RegularBoard {
    // This variant has a bigger board
    get size() {
        return { w: 10, h: 15 }
    }

    pieceValue(piece: Piece): number {
        // TODO take piece placement into account, especially for spies
        switch (piece.constructor) {
            case Pawn: return 1
            case Nwap: return 1
            case Knight: return 3.2
            case Bishop: return 3.33
            case Rook: return 5.1
            case Spy: return 7
            case Queen: return 8.8
            case King: return 1000
            default: return 0
        }
    }

    // This board wraps around top to bottom so the coordinates need to be transformed
    pieceAt(x: number, y: number): Piece | null {
        const at = this.wrappedPos(x, y);
        return super.pieceAt(at.x, at.y)
    }

    // This board has practically infinite Y so only X can be outside
    inBoard(x: number, y: number): boolean {
        return x >= 0 && x < this.size.w
    }

    // This variant has custom starting positions
    protected createInitialPieces(): List<Piece> {
        return List([

        ])
    }

    private wrappedPos(x: number, y: number) {
        return {
            x,
            y: y % this.size.h
        };
    }
}