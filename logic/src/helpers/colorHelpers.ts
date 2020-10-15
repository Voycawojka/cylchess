import { Color } from "../interface/types";

/**
 * Given WHITE returns BLACK and given BLACK returns WHITE.
 * 
 * @param color Color to be toggled
 */
export function toggleColor(color: Color) {
    return color === Color.WHITE ? Color.BLACK : Color.WHITE
}
