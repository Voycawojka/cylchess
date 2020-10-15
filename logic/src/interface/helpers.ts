export type CellPosition = { x: number, y: number }

export enum Color {
    WHITE,
    BLACK
}

/**
 * Given WHITE returns BLACK and given BLACK returns WHITE.
 */
export function toggleColor(color: Color) {
    return color === Color.WHITE ? Color.BLACK : Color.WHITE
}
