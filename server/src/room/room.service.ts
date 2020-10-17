import { Injectable } from "@nestjs/common"
import { List } from "immutable"
import { Room } from "./room.model"

@Injectable()
export class RoomService {
    private readonly rooms: Room[] = []
    private nextId: number = 0

    allRooms(): List<Room> {
        return List(this.rooms)
    }

    findById(id: number): Room {
        return this.rooms.find(room => room.id === id)
    }

    createRoom(playerName: string, variantIndex: number): Room | null {
        const room = new Room()

        room.id = this.nextId
        room.waitingPlayerName = playerName
        room.variantIndex = variantIndex

        this.rooms.push(room)
        this.nextId ++

        return room
    }
}
