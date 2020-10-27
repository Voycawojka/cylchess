import { Color } from "../interface/types"
import { toggleColor } from "./colorHelpers"

test("Color toggling switches between white and black", () => {
    expect(toggleColor(Color.WHITE)).toBe(Color.BLACK)
    expect(toggleColor(Color.BLACK)).toBe(Color.WHITE)
})
