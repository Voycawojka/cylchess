import { Injectable } from "@nestjs/common";
import { Player } from "cylchess-logic/dist/interface/Player";
import { GameEngine } from "cylchess-logic/dist/engine/GameEngine"
import { PubSub } from "graphql-subscriptions";
import { Board } from "cylchess-logic/dist/interface/Board";
import { BoardModel, PieceModel, PositionModel, SizeModel } from "./play.model";
import { CellPosition, Size } from "cylchess-logic/dist/interface/types";
import { Piece } from "cylchess-logic/dist/interface/Piece";

const pubsub = new PubSub()
const boardIterator = pubsub.asyncIterator("boardStateChanged")

@Injectable()
export class PlayService {
    beginMatch(player1: Player, player2: Player, board: Board, roomId: number, variantIndex: number) {
        const engine = new GameEngine(player1, player2)

        engine.stateFeed(board).subscribe(newBoard => {
            const boardModel = this.boardToModel(newBoard, roomId, variantIndex)
            pubsub.publish("boardStateChanged", boardModel)
        })
    }

    boardStateChangedIterator() {
        return boardIterator
    }

    private boardToModel(board: Board, roomId: number, variantIndex: number): BoardModel {
        const model = new BoardModel()

        model.roomId = roomId
        model.variantIndex = variantIndex
        model.pieces = board.pieces.map(piece => this.pieceToModel(piece))
        model.size = this.sizeToModel(board.size)
        model.noneCells = board.noneCells.map(cell => this.posToModel(cell))
        model.turnOfIndex = board.turnOf

        return model
    }

    private pieceToModel(piece: Piece): PieceModel {
        const model = new PieceModel()

        model.display = piece.display
        model.name = piece.name
        model.colorIndex = piece.color
        model.position = this.posToModel(piece.position)

        return model
    }

    private sizeToModel(size: Size): SizeModel {
        const model = new SizeModel()

        model.w = size.w
        model.h = size.h

        return model
    }

    private posToModel(pos: CellPosition): PositionModel {
        const model = new PositionModel()

        model.x = pos.x
        model.y = pos.y

        return model
    }
}
