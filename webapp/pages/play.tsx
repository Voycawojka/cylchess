import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRoomCtx } from "../components/RoomProvider/RoomProvider";

export default function Play() {
    const [room] = useRoomCtx()
    const router = useRouter()

    // TODO if in lobby, subscribe for an opponent joining

    if (room.id === -1) {
        router.push('/')
        return null
    }

    if (room.playerNames.length < 2) {
        return <span>Waiting for an opponnent. You can invite someone with this link {window.location.hostname}/invite/{room.id}</span>
    }

    return <span>Playing! {room.playerNames[0]} vs {room.playerNames[1]}</span>
}
