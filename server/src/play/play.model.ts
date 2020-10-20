import { Field, Int, ObjectType } from "@nestjs/graphql"
import { List } from "immutable"

@ObjectType("Position")
export class PositionModel {
    @Field(type => Int)
    x: number

    @Field(type => Int)
    y: number
}

@ObjectType("Size")
export class SizeModel {
    @Field(type => Int)
    w: number

    @Field(type => Int)
    h: number
}

@ObjectType("Piece")
export class PieceModel {
    @Field()
    display: string

    @Field()
    name: string

    @Field(type => Int)
    colorIndex: number

    @Field(type => PositionModel)
    position: PositionModel
}

@ObjectType("Board")
export class BoardModel {
    @Field(type => Int)
    roomId: number

    @Field(type => Int)
    variantIndex: number

    @Field(type => [PieceModel])
    pieces: List<PieceModel>

    @Field(type => SizeModel)
    size: SizeModel

    @Field(type => [PositionModel])
    noneCells: List<PositionModel>

    @Field(type => Int)
    turnOfIndex: number
}