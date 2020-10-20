import { Args, Int, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql"
import { PubSub } from "graphql-subscriptions"
import { List } from "immutable"
import { BoardModel } from "src/play/play.model"
import { PlayService } from "src/play/play.service"
import { NewRoomData, Room } from "./room.model"
import { RoomService } from "./room.service"

const pubSub = new PubSub()
const events = {
    roomCreated: "roomCreated"
}

@Resolver(of => Room)
export class RoomResolver {
    constructor(private readonly roomService: RoomService, private readonly playService: PlayService) {
    }

    @Query(returns => Room, { nullable: true })
    room(@Args("id", { type: () => Int }) id: number): Room | null {
        return this.roomService.findById(id)
    }

    @Query(returns => [Room])
    rooms(): List<Room> {
        return this.roomService.allRooms()
    }

    @Mutation(returns => NewRoomData)
    createRoom(
        @Args("playerName" ) playerName: string, 
        @Args("variantIndex", { type: () => Int }) variantIndex: number
    ): NewRoomData {
        const newRoom = this.roomService.createRoom(playerName, variantIndex)
        pubSub.publish(events.roomCreated, { roomCreated: newRoom })
        return newRoom
    }

    @Mutation(returns => [String])
    joinRoom(@Args("id", { type: () => Int }) id: number): [String, String] {
        this.playService.beginMatch()
    }

    @Subscription(returns => Room)
    roomCreated() {
        return pubSub.asyncIterator(events.roomCreated)
    }
}
