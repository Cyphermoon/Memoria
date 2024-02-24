import React from 'react'
import Text from './Text'

interface Props {
    liked: boolean
    count: number
}

const Counter = ({ liked, count }: Props) => {
    return (
        <Text className={`text-sm ${liked ? 'text-accent' : 'text-gray-500'} ml-1`}>
            {count}
        </Text>
    )
}

export default Counter