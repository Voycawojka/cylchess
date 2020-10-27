import { List } from "immutable"
import { pos, positionsNextTo } from "./positionHelpers"

test("`pos` helper produces a proper object", () => {
    expect(pos(-3, 1)).toEqual({ x: -3, y : 1 })
})

test("helper returns positions next to the given one", () => {
    const expected = List([
        pos(2, 1),
        pos(0, 1),
        pos(1, 2),
        pos(1, 0)
    ])
    const actual = positionsNextTo(pos(1, 1), false)

    expect(actual).toEqual(expected)
})

test("helper returns positions next to the given one, also diagonally", () => {
    const expected = List([
        pos(2, 1),
        pos(0, 1),
        pos(1, 2),
        pos(1, 0),
        pos(0, 0),
        pos(0, 2),
        pos(2, 0),
        pos(2, 2)
    ])
    const actual = positionsNextTo(pos(1, 1), true)

    expect(actual).toEqual(expected)
})
