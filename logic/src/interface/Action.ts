import { List } from "immutable"
import { CellPosition } from "./helpers";
import { Piece } from "./Piece";

/**
 * Actions are used to change the game state (board).
 * Each action represents a specific piece changing position and/or capturing. What does it mean "to capture" depends on the Board implementation.
 */
export interface Action {
    /**
     * The piece that is supposed to move and/or capture.
     */
    readonly piece: Piece

    /**
     * Position where the piece should move. Doesn't need to be provided if the piece captures without moving.
     * Note that multiple pieces can occupy the same space (yes, some variants need it), but the website can currently display only up to 2 pieces in one cell.
     */
    readonly moveTo?: CellPosition

    /**
     * List of positions on the board that are "captured". 
     * Most variants intepret it as removing a piece at this position from the game.
     */
    readonly captureAt: List<CellPosition>

    /**
     * Action to be applied at the same time as the parent one.
     * Used when more than 1 piece needs to move simultanously, e.g. when castling.
     */
    readonly chainedAction?: Action
}
