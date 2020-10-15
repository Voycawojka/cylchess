import { List } from "immutable"
import { CellPosition } from "../interface/types"

/**
 * Creates a CellPosition object
 */
export function pos(x: number, y: number): CellPosition {
    return { x, y }
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