import { List } from "immutable";
import { Action } from "../interface/Action";
import { Board } from "../interface/Board";
import { Piece } from "../interface/Piece";
import { CellPosition } from "../interface/types";
import { toggleColor } from "./colorHelpers";
import { offset } from "./positionHelpers";

/**
 * Produces a typical action of moving and capturing into a tile
 * 
 * @param piece Piece this action is related to
 * @param toPos Position to move onto and capture at
 */
export function moveCaptureAction(piece: Piece, toPos: CellPosition): Action {
    return {
        piece,
        moveTo: toPos,
        captureAt: List([toPos])
    }
}

/**
 * Produces a typical set of actions for a jumping piece (like a knight in classical chess). 
 * Can also be used for pieces like classical king since its movement can be considered jumping.
 * Pieces of the same color block movement, others are captured
 * 
 * @param piece Piece those actions are related to
 * @param board Current board
 * @param offsets List of jumping offsets
 */
export function jumperActions(piece: Piece, board: Board, offsets: List<CellPosition>): List<Action> {
    return List(offsets)
        .map(off => moveCaptureAction(piece, offset(this.position, off.x, off.y)))
        .filter(({ moveTo }) => moveTo === undefined || board.pieceAt(moveTo.x, moveTo.y)?.color !== this.color)
}

/**
 * Produces a typical set of actions for a piece walking in endless straight lines (like a bishop or a queen in classical chess).
 * Pieces of the same color block movement, others block movement and are captured
 * 
 * @param piece Piece those actions are related to
 * @param board Curren board
 * @param directionOffsets Direction vectors. For example <1, 0> will allow the piece to move endlessly to the right and <-2,-2> will allow the piece to move endlessly diagonally to the top-left jumping every other space
 */
export function unlimitedWalkerActions(piece: Piece, board: Board, directionOffsets: List<CellPosition>): List<Action> {
    return directionOffsets
        .flatMap(vector => {
            const traversedCells: CellPosition[] = []
            let pos = offset(piece.position, vector.x, vector.y)
            let pieceAtCell = board.pieceAt(pos.x, pos.y)

            while (pieceAtCell === null && board.inBoard(pos.x, pos.y)) {
                traversedCells.push(pos)
                pieceAtCell = board.pieceAt(pos.x, pos.y)
            }

            if (pieceAtCell !== null && pieceAtCell.color !== piece.color) {
                traversedCells.push(pos)
            }

            return List(traversedCells)
        })
        .map(position => moveCaptureAction(piece, position))
}

