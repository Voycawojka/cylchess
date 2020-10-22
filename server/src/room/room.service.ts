import { Injectable } from "@nestjs/common"
import { List } from "immutable"
import { Base64 } from "js-base64"
import { PlayService } from "src/play/play.service"
import { VariantService } from "src/variant/variant.service"
import { Room, RoomWithPlayerToken } from "./room.model"

interface RoomWithPlayerIds {
    model: Room
    playerTokens: [string] | [string, string]
}

@Injectable()
export class RoomService {
    private rooms: List<RoomWithPlayerIds> = List()
    private nextRoomId: number = 0
    private nextPlayerId: number = 0

    constructor(private playService: PlayService, private variantService: VariantService) {
    }

    allRooms(): List<RoomWithPlayerIds> {
        return this.rooms.map(room => room)
    }

    findById(id: number): RoomWithPlayerIds {
        return this.rooms.find(room => room.model.id === id)
    }

    createRoom(playerName: string, variantIndex: number): RoomWithPlayerIds {
        const room = new Room()

        room.id = this.nextRoomId
        room.playerNames = [playerName]
        room.variantIndex = variantIndex

        const roomWithIds: RoomWithPlayerIds = {
            model: room, 
            playerTokens: [this.generatePlayerToken(playerName)]
        }

        this.rooms = this.rooms.push(roomWithIds)
        this.nextRoomId ++

        return roomWithIds
    }

    joinRoomAndBeginMatch(playerName: string, roomId: number): RoomWithPlayerToken {
        const room = this.findById(roomId)
        const newPlayerToken = this.generatePlayerToken(playerName)

        room.playerTokens.push()

        const [whitePlayerToken, blackPlayerToken] = room.playerTokens.sort(() => Math.random() - 0.5) // TODO this should be chosen by the player during room creation
        const board = this.variantService.createBoard(room.model.variantIndex)

        this.playService.beginMatch(whitePlayerToken, blackPlayerToken, board, roomId, room.model.variantIndex)

        return {
            room: room.model,
            playerToken: newPlayerToken
        }
    }

    private generatePlayerToken(name: string): string {
        this.nextPlayerId ++
        return Base64.encode(`${name}-${this.nextPlayerId}-${Math.floor(Math.random() * 1000000)}`)
    }
}
