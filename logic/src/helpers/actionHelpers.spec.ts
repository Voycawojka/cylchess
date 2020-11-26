import { List } from "immutable"
import { RegularBoard } from "../implementations/variants"
import { King, Rook } from "../implementations/variants/regular/regularPieces"
import { Piece } from "../interface/Piece"
import { Color } from "../interface/types"
import { jumperActions, moveCaptureAction, walkerAction, walkerActions } from "./actionHelpers"
import { pos } from "./positionHelpers"

test("moveCaptureAction produces the right object", () => {
    const piece = new King(Color.WHITE, pos(0, 0))
    const moveTo = pos(0, 1)

    const output = moveCaptureAction(piece, moveTo)

    expect(output.piece).toBe(piece)
    expect(output.moveTo).toEqual(moveTo)
    expect(output.captureAt.size).toEqual(1)
    expect(output.captureAt.get(0)).toEqual(moveTo)
    expect(output.chainedAction).not.toBeDefined()
})

test("jumperActions won't move to a field taken by the same color", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(1, 0) as Piece
    const offsets = List([pos(1, 0), pos(0, 1)])

    const output = jumperActions(piece, board, offsets)

    expect(output.size).toEqual(0)
})

test("jumperActions will move onto empty fields", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(1, 0) as Piece
    const offsets = List([pos(1, 2), pos(0, 4)])

    const output = jumperActions(piece, board, offsets)

    expect(output.size).toEqual(2)
    
    const [action1, action2] = output

    expect(action1.piece).toBe(piece)
    expect(action2.piece).toBe(piece)
    expect(action1.moveTo).toEqual(pos(2, 2))
    expect(action2.moveTo).toEqual(pos(1, 4))
    expect(action1.captureAt.size).toEqual(1)
    expect(action2.captureAt.size).toEqual(1)
    expect(action1.captureAt.get(0)).toEqual(pos(2, 2))
    expect(action2.captureAt.get(0)).toEqual(pos(1, 4))
    expect(action1.chainedAction).not.toBeDefined()
    expect(action2.chainedAction).not.toBeDefined()
})

test("jumperActions will move onto fields taken by the opponent", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(1, 0) as Piece
    const offsets = List([pos(1, 6), pos(3, 7)])

    const output = jumperActions(piece, board, offsets)

    expect(output.size).toEqual(2)
    
    const [action1, action2] = output

    expect(action1.piece).toBe(piece)
    expect(action2.piece).toBe(piece)
    expect(action1.moveTo).toEqual(pos(2, 6))
    expect(action2.moveTo).toEqual(pos(4, 7))
    expect(action1.captureAt.size).toEqual(1)
    expect(action2.captureAt.size).toEqual(1)
    expect(action1.captureAt.get(0)).toEqual(pos(2, 6))
    expect(action2.captureAt.get(0)).toEqual(pos(4, 7))
    expect(action1.chainedAction).not.toBeDefined()
    expect(action2.chainedAction).not.toBeDefined()
})

test("walkerAction move continously until opponent's piece is enountered, inclusive", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(3, 1) as Piece

    const output = walkerAction(piece, board, pos(0, 1))
    const expectedPositions = List([
        pos(3, 2),
        pos(3, 3),
        pos(3, 4),
        pos(3, 5),
        pos(3, 6)
    ])

    expect(output.map(action => action.moveTo)).toEqual(expectedPositions)
    expect(output.map(action => action.captureAt)).toEqual(expectedPositions.map(p => List([p])))
})

test("walkerAction move continously until same colored piece is encountered, exclusive", () => {
    const board = new RegularBoard()
    const piece = new Rook(Color.BLACK, pos(3, 1))

    const output = walkerAction(piece, board, pos(0, 1))
    const expectedPositions = List([
        pos(3, 2),
        pos(3, 3),
        pos(3, 4),
        pos(3, 5),
    ])

    expect(output.map(action => action.moveTo)).toEqual(expectedPositions)
    expect(output.map(action => action.captureAt)).toEqual(expectedPositions.map(p => List([p])))
})

test("walkerAction move continously until the end of the board", () => {
    const board = new RegularBoard()
    const piece = new Rook(Color.BLACK, pos(4, 2))

    const output = walkerAction(piece, board, pos(1, 0))
    const expectedPositions = List([
        pos(5, 2),
        pos(6, 2),
        pos(7, 2)
    ])

    expect(output.map(action => action.moveTo)).toEqual(expectedPositions)
    expect(output.map(action => action.captureAt)).toEqual(expectedPositions.map(p => List([p])))
})

test("walkerAction move up to a given range, if specified", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(3, 1) as Piece

    const output = walkerAction(piece, board, pos(0, 1), 3)
    const expectedPositions = List([
        pos(3, 2),
        pos(3, 3),
        pos(3, 4)
    ])

    expect(output.map(action => action.moveTo)).toEqual(expectedPositions)
    expect(output.map(action => action.captureAt)).toEqual(expectedPositions.map(p => List([p])))
})

test("walkerActions works as multiple walkerAction calls", () => {
    const board = new RegularBoard()
    const piece = board.pieceAt(3, 1) as Piece

    const output = walkerActions(piece, board, List([pos(0, 1), pos(1, 1)]), 3)
    const expectedPositions = List([
        pos(3, 2),
        pos(3, 3),
        pos(3, 4),
        pos(4, 2),
        pos(5, 3),
        pos(6, 4)
    ])

    expect(output.map(action => action.moveTo)).toEqual(expectedPositions)
    expect(output.map(action => action.captureAt)).toEqual(expectedPositions.map(p => List([p])))
})