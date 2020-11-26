import { RegularBoard } from "../implementations/variants"
import { Color } from "../interface/types"
import { allActions, isEmptyLine, isSafe } from "./boardHelpers"
import { pos } from "./positionHelpers"

test("allActions returns all possible action for the given color", () => {
    const output = allActions(new RegularBoard(), Color.WHITE)

    expect(output.size).toEqual(20)
})

test("isSafe returns true for safe fields", () => {
    const output = isSafe(pos(0, 2), new RegularBoard(), Color.BLACK)

    expect(output).toBe(true)
})

test("isSafe returns false for captureable fields", () => {
    const output = isSafe(pos(0, 2), new RegularBoard(), Color.WHITE)

    expect(output).toBe(false)
})

test("isEmptyLine returns false for positions not in the same column or row", () => {
    const output = isEmptyLine(pos(5, 5), pos(4, 4), new RegularBoard())

    expect(output).toBe(false)
})

test("isEmptyLine returns true for empty horizontal lines", () => {
    const output = isEmptyLine(pos(5, 5), pos(7, 5), new RegularBoard())

    expect(output).toBe(true)
})

test("isEmptyLine returns true for empty vertical lines", () => {
    const output = isEmptyLine(pos(5, 2), pos(5, 5), new RegularBoard())

    expect(output).toBe(true)
})

test("isEmptyLine returns false for blocked horizontal lines", () => {
    const output = isEmptyLine(pos(5, 1), pos(7, 1), new RegularBoard())

    expect(output).toBe(false)
})

test("isEmptyLine returns false for empty vertical lines", () => {
    const output = isEmptyLine(pos(5, 2), pos(5, 7), new RegularBoard())

    expect(output).toBe(false)
})

test("isEmptyLine is exclusive", () => {
    const output = isEmptyLine(pos(5, 1), pos(5, 6), new RegularBoard())

    expect(output).toBe(true)
})

test("isEmptyLine returns true only if all fields are safe, if requested so", () => {
    // TODO
})
