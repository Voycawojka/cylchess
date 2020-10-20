import { Injectable } from "@nestjs/common";
import { Player } from "cylchess-logic/dist/interface/Player";
import { GameEngine } from "cylchess-logic/dist/engine/GameEngine"
import { PubSub } from "graphql-subscriptions";
import { Board } from "cylchess-logic/dist/interface/Board";
import { ActionInput, BoardModel, PieceModel, PositionModel, SizeModel } from "./play.model";
import { CellPosition, Color, Size } from "cylchess-logic/dist/interface/types";
import { Piece } from "cylchess-logic/dist/interface/Piece";
import { Action } from "cylchess-logic/dist/interface/Action";
import { List } from "immutable";

const pubsub = new PubSub()
const boardIterator = pubsub.asyncIterator("boardStateChanged")

type PromiseData = { playerId: string, board: Board, resolve: (board: Board) => void }
let movePromises = List<PromiseData>()

@Injectable()
export class PlayService {
    beginMatch(playerId: string, playerId2: string, board: Board, roomId: number, variantIndex: number) {
        const whitePlayer = this.getPlayer(playerId, Color.WHITE)
        const blackPlayer = this.getPlayer(playerId2, Color.BLACK)
        const engine = new GameEngine(whitePlayer, blackPlayer)

        engine.stateFeed(board).subscribe(newBoard => {
            const boardModel = this.boardToModel(newBoard, roomId, variantIndex)
            pubsub.publish("boardStateChanged", boardModel)
        })
    }

    getPlayer(playerId: string, color: Color): Player {
        return {
            name: `player-${playerId}`,
            color,
            isBot: false,
            makeMove: (board: Board) => new Promise<Board>(resolve => { movePromises = movePromises.push({ playerId, board, resolve }) })
        }
    }

    makeAction(playerId: string, actionInput: ActionInput): void {
        const promise = movePromises?.find(promise => promise.playerId === playerId)

        if (promise) {
            movePromises = movePromises.filterNot(p => p === promise)

            const action = this.inputToAction(actionInput, promise.board)
            const newBoard = promise.board.applyAction(action)
            promise.resolve(newBoard)
        }
    }

    boardStateChangedIterator() {
        return boardIterator
    }

    private inputToAction(input: ActionInput, board: Board): Action {
        return {
            piece: board.pieceAt(input.pieceAt.x, input.pieceAt.y),
            moveTo: input.moveTo,
            captureAt: input.captureAt,
            chainedAction: !!input.chainedAction ? this.inputToAction(input.chainedAction, board) : undefined
        }
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
