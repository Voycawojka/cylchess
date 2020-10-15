import { List } from "immutable"
import { Action } from "./Action";
import { Board } from "./Board";
import { CellPosition, Color } from "./types"

/**
 * Represents a state of a piece on the board and contains its movement/capturing logic
 */
export interface Piece {
    /**
     * Unicode to be displayed to the user as a representation of the piece.
     */
    readonly display: string

    /**
     * Name of the piece used in addition to the `display` property. 
     * It should use a localization key (e.g. "PIECE.REGULAR.QUEEN"). Make sure to add at least english translation for it.
     */
    readonly name: string

    /**
     * Determines which player the piece belongs to
     */
    readonly color: Color

    /**
     * Current position on the board.
     */
    readonly position: CellPosition

    /**
     * Returns the list of possible actions for the given game state (board)
     */
    possibleActions(board: Board): List<Action>

    /**
     * Returns a new instance of the piece with new coordinates.
     * Does *not* mutate the object.
     */
    moved(pos: CellPosition): Piece
}