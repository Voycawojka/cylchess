import { List } from "immutable";
import { Piece } from "../../interface/Piece";
import { RegularBoard } from "../regular/RegularBoard";

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

    // This board wraps around top to bottom so the coordinates need to be transformed
    pieceAt(x: number, y: number): Piece | null {
        const at = this.wrappedPos(x, y);
        return super.pieceAt(at.x, at.y)
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