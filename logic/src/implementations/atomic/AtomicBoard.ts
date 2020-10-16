import { List } from "immutable";
import { CellPosition } from "../../interface/types";
import { Piece } from "../../interface/Piece";
import { RegularBoard } from "../regular/RegularBoard";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "../regular/regularPieces";
import { positionsNextTo } from "../../helpers/positionHelpers";

/**
 * Atomic Chess implementation.
 * Rules reference: https://en.wikipedia.org/wiki/Atomic_chess
 */
export class AtomicBoard extends RegularBoard {
    pieceValue(piece: Piece): number {
        switch(piece.constructor) {
            case Pawn: return 1
            case Knight: return 1.5
            case Bishop: return 1.5
            case Rook: return 3
            case Queen: return 6
            case King: return 1000
            default: return 0
        }
    }

    // This variant has custom capturing logic (explosions)
    protected handleCaptures(pieces: List<Piece>, captureAt: List<CellPosition>, capturer: Piece): List<Piece> {
        const explosionPositions = captureAt
                .flatMap(position => positionsNextTo(position, true))
                .filterNot(({ x, y }) => this.pieceAt(x, y) instanceof Pawn)
                .merge(captureAt)
                .merge(List([capturer.position]))
        
        return super.handleCaptures(pieces, explosionPositions, capturer)
    }
}
