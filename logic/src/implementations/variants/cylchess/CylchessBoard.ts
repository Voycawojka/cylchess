import { List } from "immutable"
import { pos } from "../../../helpers/positionHelpers"
import { Piece } from "../../../interface/Piece"
import { Color } from "../../../interface/types"
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
        return { w: 8, h: 14 }
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
            new Nwap(Color.WHITE, pos(0, 2)),
            new Nwap(Color.WHITE, pos(1, 2)),
            new Nwap(Color.WHITE, pos(2, 2)),
            new Nwap(Color.WHITE, pos(3, 2)),
            new Nwap(Color.WHITE, pos(4, 2)),
            new Nwap(Color.WHITE, pos(5, 2)),
            new Nwap(Color.WHITE, pos(6, 2)),
            new Nwap(Color.WHITE, pos(7, 2)),

            new Rook(Color.WHITE, pos(0, 3)),
            new Knight(Color.WHITE, pos(1, 3)),
            new Bishop(Color.WHITE, pos(2, 3)),
            new Queen(Color.WHITE, pos(3, 3)),
            new King(Color.WHITE, pos(4, 3)),
            new Bishop(Color.WHITE, pos(5, 3)),
            new Knight(Color.WHITE, pos(6, 3)),
            new Rook(Color.WHITE, pos(7, 3)),

            new Pawn(Color.WHITE, pos(0, 4)),
            new Pawn(Color.WHITE, pos(1, 4)),
            new Pawn(Color.WHITE, pos(2, 4)),
            new Pawn(Color.WHITE, pos(3, 4)),
            new Pawn(Color.WHITE, pos(4, 4)),
            new Pawn(Color.WHITE, pos(5, 4)),
            new Pawn(Color.WHITE, pos(6, 4)),
            new Spy(Color.WHITE, pos(7, 4)),

            new Pawn(Color.BLACK, pos(0, 9)),
            new Pawn(Color.BLACK, pos(1, 9)),
            new Pawn(Color.BLACK, pos(2, 9)),
            new Pawn(Color.BLACK, pos(3, 9)),
            new Pawn(Color.BLACK, pos(4, 9)),
            new Pawn(Color.BLACK, pos(5, 9)),
            new Pawn(Color.BLACK, pos(6, 9)),
            new Pawn(Color.BLACK, pos(7, 9)),

            new Rook(Color.BLACK, pos(0, 10)),
            new Knight(Color.BLACK, pos(1, 10)),
            new Bishop(Color.BLACK, pos(2, 10)),
            new Queen(Color.BLACK, pos(3, 10)),
            new King(Color.BLACK, pos(4, 10)),
            new Bishop(Color.BLACK, pos(5, 10)),
            new Knight(Color.BLACK, pos(6, 10)),
            new Rook(Color.BLACK, pos(7, 10)),

            new Nwap(Color.BLACK, pos(0, 11)),
            new Nwap(Color.BLACK, pos(1, 11)),
            new Nwap(Color.BLACK, pos(2, 11)),
            new Nwap(Color.BLACK, pos(3, 11)),
            new Nwap(Color.BLACK, pos(4, 11)),
            new Nwap(Color.BLACK, pos(5, 11)),
            new Nwap(Color.BLACK, pos(6, 11)),
            new Spy(Color.BLACK, pos(7, 11)),
        ])
    }

    private wrappedPos(x: number, y: number) {
        return {
            x,
            y: y % this.size.h
        };
    }
}