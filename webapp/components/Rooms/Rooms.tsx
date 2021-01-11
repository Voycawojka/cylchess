import { gql, useQuery } from "@apollo/client"
import { variants } from "cylchess-logic"
import { useEffect, useState } from "react"
import styles from '../../styles/Home.module.css'

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

export default function Rooms() {
    const { loading, error, data, subscribeToMore } = useQuery<RoomsData>(ROOMS_QUERY)
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        if (loading || error || subscribed) {
            return
        }

        subscribeToMore<RoomCreatedData>({
            document: ROOMS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                const newRoom = subscriptionData.data.roomCreated
                
                return { rooms: [newRoom, ...prev.rooms] }
            }
        })

        setSubscribed(true)
    }, [loading, error, subscribed])

    return (
        <div className={styles.card}>
            <h3>Join</h3>
            <p>Those people are waiting for you to play with them:</p>
           
            {(() => {
                if (loading) {
                    return 'Fetching...'
                }
                
                if (error) {
                    console.error(error)
                    return 'Sorry, something went wrong while fetching data :/'
                }
        
                return (
                    <ul>
                        {data.rooms.map(room => <li key={room.id}>{room.playerNames.join(', ')}, {variants.get(room.variantIndex).name}</li>)}
                    </ul>
                )
            })()}
        </div>
    )
}