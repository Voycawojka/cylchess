import { takeWhile } from "rxjs/operators"
import { RegularBoard } from "../implementations/variants"
import { Player } from "../interface/Player"
import { Color } from "../interface/types"
import { GameEngine } from "./GameEngine"

test("GameEngine pushes board states continously", done => {
    const whiteActiveBoard = new RegularBoard()
    const blackActiveBoard = new RegularBoard(undefined, 1)

    const whiteMakeMove = jest.fn().mockReturnValue(Promise.resolve(blackActiveBoard))
    const blackMakeMove = jest.fn().mockReturnValue(Promise.resolve(whiteActiveBoard))

    const whitePlayer: Player = {
        name: "Marvin",
        color: Color.WHITE,
        isBot: false,
        makeMove: whiteMakeMove
    }

    const blackPlayer: Player = {
        name: "Q",
        color: Color.BLACK,
        isBot: false,
        makeMove: blackMakeMove
    }

    const engine = new GameEngine(whitePlayer, blackPlayer)

    let states = 0

    engine.stateFeed(whiteActiveBoard)
        .pipe(takeWhile(() => states < 4))
        .subscribe({
            next: newBoard => {
                expect(newBoard).toBeInstanceOf(RegularBoard)
                states ++
            },
            complete: () => {
                expect(states).toBe(4)
                expect(whiteMakeMove).toBeCalledTimes(3)
                expect(blackMakeMove).toBeCalledTimes(2)
                done()
            }
        })
})
