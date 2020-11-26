import { Observable, Subscriber } from "rxjs";
import { Board } from "../interface/Board";
import { Player } from "../interface/Player";
import { Color } from "../interface/types";

export class GameEngine {
    constructor(private readonly whitePlayer: Player, private readonly blackPlayer: Player) {       
    }

    stateFeed(board: Board): Observable<Board> {
        return new Observable(subscriber => { this.pushNextStates(board, subscriber) })
    }

    private async pushNextStates(board: Board, subscriber: Subscriber<Board>): Promise<void> {
        let currentBoard = board

        while (!currentBoard.winner() && !currentBoard.isDraw()) {
            currentBoard = await this.nextState(currentBoard) 
            subscriber.next(currentBoard)
        }

        subscriber.complete()
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
