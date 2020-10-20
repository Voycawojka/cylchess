import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Room {
    @Field(type => Int)
    id: number

    @Field()
    waitingPlayerName: string

    @Field(type => Int)
    variantIndex: number
}

@ObjectType()
export class NewRoomData {
    @Field(type => Room)
    room: Room

    @Field()
    playerId: string
}
