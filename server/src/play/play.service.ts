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

type PromiseData = { playerToken: string, board: Board, resolve: (board: Board) => void }
let movePromises = List<PromiseData>()

@Injectable()
export class PlayService {
    beginMatch(whitePlayerToken: string, blackPlayerToken: string, board: Board, roomId: number, variantIndex: number): void {
        const whitePlayer = this.createOnlinePlayer(whitePlayerToken, Color.WHITE)
        const blackPlayer = this.createOnlinePlayer(blackPlayerToken, Color.BLACK)
        const engine = new GameEngine(whitePlayer, blackPlayer)

        engine.stateFeed(board).subscribe(newBoard => {
            const boardModel = this.boardToModel(newBoard, roomId, variantIndex)
            pubsub.publish("boardStateChanged", boardModel)
        })
    }

    makeAction(playerToken: string, actionInput: ActionInput): void {
        const promise = movePromises?.find(promise => promise.playerToken === playerToken)

        if (promise) {
            movePromises = movePromises.filterNot(p => p === promise)
            const action = this.inputToAction(actionInput, promise.board)
            
            if (action && promise.board.validateAction(action)) {
                const newBoard = promise.board.applyAction(action)
                promise.resolve(newBoard)
            }
        }
    }

    boardStateChangedIterator() {
        return boardIterator
    }

    private createOnlinePlayer(playerToken: string, color: Color): Player {
        return {
            name: `player-${playerToken}`, // TODO use actual player username instead
            color,
            isBot: false,
            makeMove: (board: Board) => new Promise<Board>(resolve => { movePromises = movePromises.push({ playerToken, board, resolve }) })
        }
    }

    private inputToAction(input: ActionInput, board: Board): Action | undefined {
        const piece = board.pieceAt(input.pieceAt.x, input.pieceAt.y)

        return !!piece
            ? {
                piece,
                moveTo: input.moveTo,
                captureAt: input.captureAt,
                chainedAction: !!input.chainedAction ? this.inputToAction(input.chainedAction, board) : undefined
            }
            : undefined
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
