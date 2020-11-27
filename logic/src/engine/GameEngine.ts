import { Observable, queueScheduler, Subscriber } from "rxjs";
import { Board } from "../interface/Board";
import { Player } from "../interface/Player";
import { Color } from "../interface/types";

export class GameEngine {
    constructor(private readonly whitePlayer: Player, private readonly blackPlayer: Player) {       
    }

    stateFeed(board: Board): Observable<Board> {
        return new Observable<Board>(subscriber => {
            let canceled = false;

            const engine = async () => {
                let currentBoard = board

                while (!canceled && !currentBoard.winner() && !currentBoard.isDraw()) {
                    currentBoard = await this.nextState(currentBoard) 
                    subscriber.next(currentBoard)
                }
        
                subscriber.complete()
            }

            engine()
            return () => canceled = true
        })
    }

    private nextState(board: Board): Promise<Board> {
        return this.player(board).makeMove(board)
    }

    private player(board: Board): Player {
        switch (board.turnOf) {
            case Color.WHITE: return this.whitePlayer
            case Color.BLACK: return this.blackPlayer
        }
    }
}
