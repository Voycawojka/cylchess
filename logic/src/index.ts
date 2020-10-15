import { Board } from "./interface/Board"
import { Color } from "./interface/types"
import * as boards from "./implementations"

export const variants = []

/**
 * Makes the variant available for users to play.
 */
function registerVariant(name: string, description: string, createBoard: (startingColor: Color) => Board) {
    variants.push({ name, description, createBoard })
}

// Keep the variants in alphabetical order and rememeber to update translations (at least the english one).

registerVariant("VARIANT.REGULAR.NAME", "VARIANT.REGULAR.DESC", color => new boards.RegularBoard(color))
registerVariant("VARIANT.ATOMIC.NAME", "VARIANT.ATOMIC.DESC", color => new boards.AtomicBoard(color))
registerVariant("VARIANT.CYLCHESS.NAME", "VARIANT.CYLCHESS.DESC", color => new boards.CylchessBoard(color))
