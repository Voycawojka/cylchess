import { List } from "immutable";
import { Action } from "../interface/Action";
import { Board } from "../interface/Board";
import { CellPosition, Color } from "../interface/types";

/**
 * Checks if all cells between `from` and `to` (exclusive) are empty.
 * Starting and ending cells need to be in the same column or row.
 * 
 * @param from First position (exclusive)
 * @param to Second position (exclusive)
 * @param board The board to check on
 * @param safeFromOnly If specified also checks if each cell is safe from this color (can't be captured by any piece in this color)
 */
export function isEmptyLine(from: CellPosition, to: CellPosition, board: Board, safeFromOnly?: Color): boolean {
    
}

/**
 * Checks if the given cell is safe from the given color (can't be captured).
 */
export function isSafe(pos: CellPosition, board: Board, fromColor: Color): boolean {

}

/**
 * Returns all actions possible to take by a player of a given color.
 * Only valid actions are returned.
 */
export function allActions(board: Board, color: Color): List<Action> {
    return board.pieces
        .filter(piece => piece.color === color)
        .flatMap(piece => piece.possibleActions(board))
        .filter(action => board.validateAction(action))
}
