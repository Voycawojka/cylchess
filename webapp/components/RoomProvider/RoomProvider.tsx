import { createContext, Dispatch, useContext, useReducer } from "react";

interface RoomState {
    id: number
    playerNames: string[]
    variantIndex: number
}

type RoomAction = {
    type: 'SET_ROOM'
    payload: RoomState
} | {
    type: 'PLAYER_JOINED'
    payload: { name: string }
}

const RoomStateContext = createContext<RoomState>(undefined)
const RoomDispatchContext = createContext<Dispatch<RoomAction>>(undefined)

const reducer = (state: RoomState, action: RoomAction): RoomState => {
    switch (action.type) {
        case 'SET_ROOM':
            return action.payload
        case 'PLAYER_JOINED':
            return {
                ...state,
                playerNames: [...state.playerNames, action.payload.name]
            }
        default:
            throw new Error('Unknown action')
    }
}

const defaultState: RoomState = {
    id: -1,
    playerNames: [],
    variantIndex: -1
}

export const RoomProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultState)

    return (
        <RoomDispatchContext.Provider value={dispatch}>
            <RoomStateContext.Provider value={state}>
                {children}
            </RoomStateContext.Provider>
        </RoomDispatchContext.Provider>
    )
}

export const useRoomCtx = (): [RoomState, Dispatch<RoomAction>] => [useContext(RoomStateContext), useContext(RoomDispatchContext)]
