import { List } from "immutable"
import { pos } from "../../../helpers/positionHelpers"
import { RegularBoard } from "./RegularBoard"
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./regularPieces"

test("Pawn returns two valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(0, 1) as Pawn

    const expected = [
        {
            captureAt: List([pos(0, 2)]),
            moveTo: pos(0, 2),
            piece
        },
        {
            captureAt: List([pos(0, 3)]),
            moveTo: pos(0, 3),
            piece
        }
    ]

    expect(piece).toBeInstanceOf(Pawn)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})

test("Knight returns two valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(1, 0) as Knight

    const expected = [
        {
            captureAt: List([pos(2, 2)]),
            moveTo: pos(2, 2),
            piece
        },
        {
            captureAt: List([pos(0, 2)]),
            moveTo: pos(0, 2),
            piece
        }
    ]

    expect(piece).toBeInstanceOf(Knight)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})

test("Bishop returns no valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(2, 0) as Bishop

    const expected = []

    expect(piece).toBeInstanceOf(Bishop)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})

test("Queen returns no valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(3, 0) as Queen

    const expected = []

    expect(piece).toBeInstanceOf(Queen)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})

test("King returns no valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(4, 0) as King
    const expected = []

    expect(piece).toBeInstanceOf(King)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})

test("Rook returns no valid actions on start", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(0, 0) as Rook

    const expected = []

    expect(piece).toBeInstanceOf(Rook)
    expect(piece.possibleActions(board).filter(action => board.validateAction(action)).toArray()).toEqual(expected)
})
