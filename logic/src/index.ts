import { Board } from "./interface/Board"
import * as boards from "./implementations/variants"
import { List } from "immutable"
import { Cyleigh } from "./implementations/ai/cyleigh/Cyleigh"
import { Color } from "./interface/types"
import { Player } from "./interface/Player"

export interface Bot {
    name: string,
    instance: (color: Color) => Player
}

export interface Variant {
    name: string
    description: string
    createBoard: () => Board
    compatibleAIs: List<Bot>
}

const mutableVariants: Variant[] = []

/**
 * Makes the variant available for users to play.
 */
function registerVariant(name: string, description: string, createBoard: () => Board, customAIs: List<Bot> = List()) {
    const compatibleAIs = customAIs.push({
        name: "Cyleigh",
        instance: (color: Color) => new Cyleigh(color)
    })
    
    mutableVariants.push({ name, description, createBoard, compatibleAIs })
}

// Keep the variants in alphabetical order and rememeber to update translations (at least the english one).

registerVariant("VARIANT.REGULAR.NAME", "VARIANT.REGULAR.DESC", () => new boards.RegularBoard())
registerVariant("VARIANT.ATOMIC.NAME", "VARIANT.ATOMIC.DESC", () => new boards.AtomicBoard())
registerVariant("VARIANT.CYLCHESS.NAME", "VARIANT.CYLCHESS.DESC", () => new boards.CylchessBoard())

export const variants = List(mutableVariants)
export const version = "0.0.1"
