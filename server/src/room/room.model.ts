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
