import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Room {
    @Field(type => Int)
    id: number

    @Field(type => [String])
    playerNames: [string] | [string, string]

    @Field(type => Int)
    variantIndex: number
}

@ObjectType()
export class RoomWithPlayerToken {
    @Field(type => Room)
    room: Room

    @Field()
    playerToken: string
}
