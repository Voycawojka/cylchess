import { List } from "immutable";
import { Action } from "../interface/Action";
import { Piece } from "../interface/Piece";
import { CellPosition, Color } from "../interface/types";

/**
 * Given WHITE returns BLACK and given BLACK returns WHITE.
 * 
 * @param color Color to be toggled
 */
export function toggleColor(color: Color) {
    return color === Color.WHITE ? Color.BLACK : Color.WHITE
}

/**
 * Returns cell positions next to the provided one
 * 
 * @param param0 Position to find neighbors for
 * @param diagonally If true includes diagonal neighbors
 */
export function positionsNextTo({ x, y }: CellPosition, diagonally: boolean): List<CellPosition> {
    return List([
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
        ...(diagonally 
            ? [
                { x: x - 1, y: y - 1 },
                { x: x - 1, y: y + 1 },
                { x: x + 1, y: y - 1 },
                { x: x + 1, y: y + 1 }
            ]
            : []
        )
    ])
}

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
 * Returns a new position offset by the given values
 * 
 * @param pos Position to offset
 * @param offX X offset
 * @param offY Y offset
 */
export function offset(pos: CellPosition, offX: number, offY: number): CellPosition {
    return {
        x: pos.x + offX,
        y: pos.y + offY
    }
}
