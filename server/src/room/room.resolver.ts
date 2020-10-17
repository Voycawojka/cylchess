import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql"
import { PubSub } from "graphql-subscriptions"
import { List } from "immutable"
import { Room } from "./room.model"
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
        return this.roomService.findById(id)
    }

    @Query(returns => [Room])
    rooms(): List<Room> {
        return this.roomService.allRooms()
    }

    @Mutation(returns => Room)
    createRoom(
        @Args({ name: "playerName" }) playerName: string, 
        @Args({ name: "variantIndex", type: () => Int }) variantIndex: number
    ): Room {
        const newRoom = this.roomService.createRoom(playerName, variantIndex)
        pubSub.publish(events.roomCreated, { roomCreated: newRoom })
        return newRoom
    }

    @Subscription(returns => Room)
    roomCreated() {
        return pubSub.asyncIterator(events.roomCreated)
    }
}
