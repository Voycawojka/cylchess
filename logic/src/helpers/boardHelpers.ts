import { List } from "immutable";
import { Action } from "../interface/Action";
import { Board } from "../interface/Board";
import { Piece } from "../interface/Piece";
import { CellPosition, Color } from "../interface/types";
import { offset, pos } from "./positionHelpers";

/**
 * Checks if all cells between `from` and `to` (exclusive) are empty.
 * Starting and ending cells need to be in the same column or row, otherwise the function returns false.
 * 
 * @param from First position (exclusive)
 * @param to Second position (exclusive)
 * @param board The board to check on
 * @param safeFromOnly If specified also checks if each cell is safe from this color (can't be captured by any piece in this color)
 */
export function isEmptyLine(from: CellPosition, to: CellPosition, board: Board, safeFromOnly?: Color): boolean {
    if (from.x !== to.x && from.y !== to.y) {
        return false;
    }

    const direction = from.x === to.x 
        ? from.y < to.y ? pos(0, 1) : pos(0, -1) 
        : from.x < to.x ? pos(1, 0) : pos(-1, 0)
    
    let currPos = offset(from, direction.x, direction.y)

    do {
        if (!!board.pieceAt(currPos.x, currPos.y)) {
            return false
        }

        currPos = offset(currPos, direction.x, direction.y)
    } while (currPos.x !== to.x || currPos.y !== to.y)

    return true
}

/**
 * Checks if the given cell is safe from the given color (can't be captured).
 * Pieces types can be excluded from check via the `excludeTypes` argument.
 */
export function isSafe(pos: CellPosition, board: Board, fromColor: Color, excludeTypes: List<Function> = List()): boolean {
    return !allActions(board, fromColor, excludeTypes).find(action => !!action.captureAt.find(capturePos => capturePos.x === pos.x && capturePos.y === pos.y))
}

/**
 * Returns all actions possible to take by a player of a given color.
 * Only valid actions are returned.
 * Pieces types can be excluded from check via the `excludeTypes` argument.
 */
export function allActions(board: Board, color: Color, excludeTypes: List<Function> = List()): List<Action> {
    return board.pieces
        .filter(piece => piece.color === color)
        .filterNot(piece => excludeTypes.includes(piece.constructor))
        .flatMap(piece => piece.possibleActions(board))
        .filter(action => board.validateAction(action))
}
