import { List } from "immutable";
import { CellPosition } from "../../interface/helpers";
import { Piece } from "../../interface/Piece";
import { RegularBoard } from "../regular/RegularBoard";

/**
 * Atomic Chess implementation.
 * Rules reference: https://en.wikipedia.org/wiki/Atomic_chess
 */
export class AtomicBoard extends RegularBoard {
    // This variant has custom capturing logic
    protected handleCaptures(pieces: List<Piece>, captureAt: List<CellPosition>): List<Piece> {

    }
}
