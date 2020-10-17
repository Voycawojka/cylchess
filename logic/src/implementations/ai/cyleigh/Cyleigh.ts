import { allActions } from "../../../helpers/boardHelpers";
import { Board } from "../../../interface/Board";
import { Player } from "../../../interface/Player";
import { Color } from "../../../interface/types";

/**
 * Cyleigh is a generic AI capable of playing any chess variant.
 */
export class Cyleigh implements Player {
    readonly name: string = "Cyleigh"
    readonly isBot: boolean = true

    constructor(readonly color: Color) {
    }

    // TODO implement a proper AI with minimaxing and alpha-beta pruning (and probably webworkers)
    makeMove(board: Board): Promise<Board> {
        const possibleActions = allActions(board, this.color)
        const chosenActionIdx = Math.floor(Math.random() * possibleActions.size)
        
        return Promise.resolve(possibleActions[chosenActionIdx])
    }
}
