import { gql, useMutation, useQuery } from "@apollo/client"
import { variants } from "cylchess-logic"
import { useEffect, useState } from "react"
import styles from '../../styles/Home.module.css'
import { useRoomCtx } from "../RoomProvider/RoomProvider"
import { useRouter } from 'next/router'

interface RoomData {
    id: number
    playerNames: [string] | [string, string]
    variantIndex: number
}

interface RoomsData {
    rooms: RoomData[]
}

interface RoomCreatedData {
    roomCreated: RoomData
}

interface JoinRoomData {
    playerToken: string
    joinRoom: {
        room: RoomData
    }
}

const ROOMS_QUERY = gql`
    query {
        rooms {
            id
            playerNames
            variantIndex
        }
    }
`

const ROOMS_SUBSCRIPTION = gql`
    subscription {
        roomCreated {
            id
            variantIndex
            playerNames
        }
    }
`

const JOIN_ROOM_MUTATION = gql`
    mutation JoinRoom($roomId: Int!, $playerName: String!) {
        joinRoom(roomId: $roomId, playerName: $playerName) {
            room {
                id
                playerNames
                variantIndex
            }
            playerToken
        }
    }
`

export default function Rooms() {
    const query = useQuery<RoomsData>(ROOMS_QUERY)
    const [subscribed, setSubscribed] = useState(false)
    const [joinRoom, joinMut] = useMutation<JoinRoomData>(JOIN_ROOM_MUTATION)
    const [, roomDispatch] = useRoomCtx()
    const router = useRouter()

    const handleJoin = (index: number) => {
        const roomData = query.data.rooms[index]

        joinRoom({
            variables: {
                roomId: roomData.id,
                playerName: 'Em, guest?' // TODO prompt for username
            }
        })
    }

    useEffect(() => {
        if (joinMut.data && joinMut.called && !joinMut.loading && !joinMut.error) {
            console.log(joinMut.data)
            roomDispatch({
                type: "SET_ROOM",
                payload: {
                    id: joinMut.data.joinRoom.room.id,
                    playerNames: joinMut.data.joinRoom.room.playerNames,
                    variantIndex: joinMut.data.joinRoom.room.variantIndex
                }
            })
            router.push(`/play`)
        }
    }, [joinMut.data, joinMut.loading, joinMut.error, joinMut.called])

    useEffect(() => {
        if (query.loading || query.error || subscribed) {
            return
        }

        query.subscribeToMore<RoomCreatedData>({
            document: ROOMS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                const newRoom = subscriptionData.data.roomCreated
                
                return { rooms: [newRoom, ...prev.rooms] }
            }
        })

        setSubscribed(true)
    }, [query.loading, query.error, subscribed])

    return (
        <div className={styles.card}>
            <h3>Join</h3>
            <p>Those people are waiting for you to play with them:</p>
           
            {(() => {
                if (query.loading) {
                    return 'Fetching...'
                }
                
                if (query.error) {
                    console.error(query.error)
                    return 'Sorry, something went wrong while fetching data :/'
                }
        
                return (
                    <ul>
                        {query.data.rooms.map((room, i) => (
                            <li key={room.id}>
                                {room.playerNames.join(', ')}, {variants.get(room.variantIndex).name}
                                <button onClick={() => handleJoin(i)}>Join</button>
                            </li>
                        ))}
                    </ul>
                )
            })()}
        </div>
    )
}