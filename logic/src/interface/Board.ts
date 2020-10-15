import { List } from "immutable";
import { Action } from "./Action";
import { CellPosition, Color } from "./helpers";
import { Piece } from "./Piece";

/**
 * Represents the state of the board in a specific turn and contains variant specific logic.
 * Board implementation is equivalent to a game variant.
 */
export interface Board {
    /**
     * All pieces currently on the board.
     */
    readonly pieces: List<Piece>

    /**
     * The size of the board. In case of non-rectangular boards it represents a rectangle in which all the cells can fit.
     */
    readonly size: { w: number; h: number }

    /**
     * The list of positions that are inside the `size` but are not part of the board. Used for non-rectangular boards.
     */
    readonly noneCells: List<CellPosition>

    /**
     * Active player's color
     */
    readonly turnOf: Color

    /**
     * Returns a piece at the <x,y> position.
     * Null means there is no piece at this position either because the cell is empty or because the position is outside of the board.
     */
    pieceAt(x: number, y: number): Piece | null

    /**
     * Returns a new instance of the board reflecting the state of the game after applying the action.
     * Does *not* mutate the object.
     */
    applyAction(action: Action): Board
}
