import { List } from "immutable";
import { Action } from "../interface/Action";
import { Board } from "../interface/Board";
import { CellPosition, Color } from "../interface/types";
import { offset, pos } from "./positionHelpers";

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
    const direction = from.x === to.x 
        ? from.y < to.y ? pos(0, 1) : pos(0, -1) 
        : from.x < to.x ? pos(1, 0) : pos(-1, 0)
    
    let currPos = offset(from, direction.x, direction.y)

    while (offset(currPos, direction.x, direction.y) !== to) {
        if (!!board.pieceAt(currPos.x, currPos.y)) {
            return false
        }
    }

    return true
}

/**
 * Checks if the given cell is safe from the given color (can't be captured).
 */
export function isSafe(pos: CellPosition, board: Board, fromColor: Color): boolean {
    return !allActions(board, fromColor).find(action => action.captureAt.includes(pos))
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
