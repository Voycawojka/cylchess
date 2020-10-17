import { Board } from "./interface/Board"
import * as boards from "./implementations"
import { List } from "immutable"

export interface Variant {
    name: string
    description: string
    createBoard: () => Board
}

const mutableVariants: Variant[] = []

/**
 * Makes the variant available for users to play.
 */
function registerVariant(name: string, description: string, createBoard: () => Board) {
    mutableVariants.push({ name, description, createBoard })
}

// Keep the variants in alphabetical order and rememeber to update translations (at least the english one).

registerVariant("VARIANT.REGULAR.NAME", "VARIANT.REGULAR.DESC", () => new boards.RegularBoard())
registerVariant("VARIANT.ATOMIC.NAME", "VARIANT.ATOMIC.DESC", () => new boards.AtomicBoard())
registerVariant("VARIANT.CYLCHESS.NAME", "VARIANT.CYLCHESS.DESC", () => new boards.CylchessBoard())

export const variants = List(mutableVariants)
