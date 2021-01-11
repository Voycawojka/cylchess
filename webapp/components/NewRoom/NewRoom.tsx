import { useIntInput, useTextInput } from "../../hooks/useInput"
import styles from '../../styles/Home.module.css'
import { variants } from "cylchess-logic"
import { gql, useMutation } from "@apollo/client"
import { useEffect } from "react"

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom($variantIndex: Int!, $playerName: String!) {
        createRoom(variantIndex: $variantIndex, playerName: $playerName) {
            room {
                id
            }
            playerToken
        }
    }
`

export default function NewRoom() {
    const [variantIndex, , bindVariantIndex] = useIntInput(0)
    const [playerName, , bindPlayerName] = useTextInput('')

    const [createRoom, { data, loading, error, called }] = useMutation(CREATE_ROOM_MUTATION)

    useEffect(() => {
        if (data && called && !loading && !error) {
            console.log("!")
            console.log(data)
        }
    }, [data, loading, error, called])

    const onPlayOnline = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        createRoom({ variables: { variantIndex, playerName } })
    }

    return (
        <div className={styles.card}>
            <h3>New game</h3>
            <p>Play with people or AI on your own terms.</p>
            <form className={styles.form}>
              <select className={styles.input} {...bindVariantIndex}>
                {variants.map((variant, i) => <option key={i} value={i}>{variant.name}</option>)}
              </select>
              <input placeholder="Nickname" className={styles.input} {...bindPlayerName}></input>
              <button className={styles.button} onClick={onPlayOnline}>Play online</button>
              <button className={styles.button}>Play with AI</button>
            </form>
        </div>
    )
}