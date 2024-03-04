import { View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons'
import { clsx } from 'clsx'
import Text from './Text'

interface Props {
    label?: string
    type: string
    placeholder?: string
    variant?: 'outline' | 'filled'
    value: string
    onChange: (text: string) => void
    onSubmit?: () => void
}

const FormControl = ({ label, variant, type, value, onChange: _onChange, onSubmit }: Props) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (value: boolean) => {
        setIsFocused(value);
    }

    const onChange = (text: string) => {
        setIsFocused(text !== '');
        _onChange(text);
    }

    const handleClear = () => {
        _onChange('');
        handleFocus(false);
    }

    const INPUT_STYLE = clsx('py-1 px-3 rounded-xl flex-row space-x-3 items-center', {
        'bg-primary-300': variant === 'filled',
        'border-secondary border-2': variant === 'outline',
    })

    return (
        <>
            {label && <Text className='text-base mb-0.5 font-medium'>{label}</Text>}

            <View className={`flex items-center justify-between ${INPUT_STYLE}`}>
                <TextInput
                    className={`flex-grow py-2 w-10 text-base text-secondary`}
                    value={value}
                    onChangeText={onChange}
                    placeholder={label ? label : "Enter text..."}
                    onFocus={() => handleFocus(true)}
                    onBlur={() => handleFocus(false)}
                    secureTextEntry={type === 'password'}
                    keyboardType={type === 'email' ? 'email-address' : 'default'}
                    onSubmitEditing={onSubmit}
                />
                {isFocused && value !== '' &&
                    <Entypo name="cross" size={26} color="#F9FAFB" onPress={handleClear} />
                }
            </View>

        </>
    )
}

export default FormControl