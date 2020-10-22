import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql"
import { PubSub } from "graphql-subscriptions"
import { List } from "immutable"
import { RoomWithPlayerToken, Room } from "./room.model"
import { RoomService } from "./room.service"

const pubSub = new PubSub()
const events = {
    roomCreated: "roomCreated"
}

@Resolver(of => Room)
export class RoomResolver {
    constructor(private readonly roomService: RoomService) {
    }

    @Query(returns => Room, { nullable: true })
    room(@Args("id", { type: () => Int }) id: number): Room | null {
        return this.roomService.findById(id)?.model ?? null
    }

    @Query(returns => [Room])
    rooms(): List<Room> {
        return this.roomService.allRooms().map(room => room.model)
    }

    @Mutation(returns => RoomWithPlayerToken)
    createRoom(
        @Args("playerName") playerName: string, 
        @Args("variantIndex", { type: () => Int }) variantIndex: number
    ): RoomWithPlayerToken {
        const newRoom = this.roomService.createRoom(playerName, variantIndex)
        pubSub.publish(events.roomCreated, { roomCreated: newRoom })

        const roomData = new RoomWithPlayerToken()

        roomData.room = newRoom.model
        roomData.playerToken = newRoom.playerTokens[0]

        return roomData
    }

    @Mutation(returns => RoomWithPlayerToken, { nullable: true })
    joinRoom(
        @Args("playerName") playerName: string,
        @Args("roomId", { type: () => Int }) roomId: number
    ): RoomWithPlayerToken | null {
        return this.roomService.joinRoomAndBeginMatch(playerName, roomId) ?? null
    }

    @Subscription(returns => Room)
    roomCreated() {
        return pubSub.asyncIterator(events.roomCreated)
    }
}
