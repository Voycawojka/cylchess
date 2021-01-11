import { useState, ChangeEvent } from 'react'

const useInput = <T>(initialValue: T, transformInput: (value: string) => T) => {
    const [value, setValue] = useState(initialValue)

    const bind = {
        value,
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
