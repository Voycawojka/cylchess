import { Injectable } from "@nestjs/common";
import { Player } from "cylchess-logic/dist/interface/Player";
import { GameEngine } from "cylchess-logic/dist/engine/GameEngine"
import { PubSub } from "graphql-subscriptions";
import { Board } from "cylchess-logic/dist/interface/Board";

const pubsub = new PubSub()
const boardIterator = pubsub.asyncIterator("boardStateChanged")

@Injectable()
export class PlayService {
    beginMatch(player1: Player, player2: Player, board: Board) {
        const engine = new GameEngine(player1, player2)

        engine.stateFeed(board).subscribe(newBoard => {
            pubsub.publish("boardStateChanged", newBoard)
        })
    }

    boardStateChangedIterator() {
        return boardIterator
    }
}
