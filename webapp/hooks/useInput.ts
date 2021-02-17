import { useState, ChangeEvent, SetStateAction, Dispatch } from 'react'

interface Bind<T> {
    value: T,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const useInput = <T>(initialValue: T, transformInput: (value: string) => T): [T, Dispatch<SetStateAction<T>>, Bind<T>] => {
    const [value, setValue] = useState(initialValue)

    const bind: Bind<T> = {
        value,
        onChange: (event) => {
            event.preventDefault()
            setValue(transformInput(event.target.value))
        }
    }

    return [value, setValue, bind]
}

export const useTextInput = (initialValue: string) => {
    return useInput(initialValue, value => value)
}

export const useIntInput = (initialValue: number) => {
    return useInput(initialValue, value => Number.parseInt(value))
}
