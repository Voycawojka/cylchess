import { List } from "immutable";
import { CellPosition } from "../../interface/types";
import { Piece } from "../../interface/Piece";
import { RegularBoard } from "../regular/RegularBoard";
import { positionsNextTo } from "../../helpers/colorHelpers";
import { Pawn } from "../regular/regularPieces";

/**
 * Atomic Chess implementation.
 * Rules reference: https://en.wikipedia.org/wiki/Atomic_chess
 */
export class AtomicBoard extends RegularBoard {
    // This variant has custom capturing logic
    protected handleCaptures(pieces: List<Piece>, captureAt: List<CellPosition>): List<Piece> {
        const explosionPositions = List([
            ...captureAt,
            ...captureAt
                .flatMap(position => positionsNextTo(position, true))
                .filterNot(({ x, y }) => this.pieceAt(x, y) instanceof Pawn)
        ])
        
        return super.handleCaptures(pieces, explosionPositions)
    }
}
