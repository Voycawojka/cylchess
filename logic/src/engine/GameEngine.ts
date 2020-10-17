import { Observable, Subscriber } from "rxjs";
import { Board } from "../interface/Board";
import { Player } from "../interface/Player";
import { Color } from "../interface/types";

export class GameEngine {
    constructor(private readonly whitePlayer: Player, private readonly blackPlayer: Player) {       
    }

    stateFeed(board: Board): Observable<Board> {
        return new Observable(subscriber => this.pushNextStates(board, subscriber))
    }

    private pushNextStates(board: Board, subscriber: Subscriber<Board>): void {
        this.nextState(board).then(newBoard => {
            subscriber.next(newBoard)

            if (!!newBoard.winner() || newBoard.isDraw()) {
                subscriber.complete()
            } else {
                this.pushNextStates(newBoard, subscriber)
            }
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
