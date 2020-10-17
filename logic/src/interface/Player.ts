import { Board } from "./Board";
import { Color } from "./types";

/**
 * Represents a player that can manipulate the state of the board.
 * It can be either a human or AI.
 */
export interface Player {
    /**
     * Player's name
     */
    readonly name: string

    /**
     * Player's color
     */
    readonly color: Color
    
    /**
     * Determines if the player implementation is AI-based
     */
    readonly isBot: boolean

    /**
     * Asynchronously returns a new board reflecting the state of the game after the player made its move.
     * Does *not* mutate the board.
     */
    makeMove(board: Board): Promise<Board>
}
