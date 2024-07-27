import React, { createContext, useContext, useState } from "react"

// Defining the shape of the context
interface ContextProps {
	position: number
	setPosition: (position: number) => void
}

interface Props {
	children: React.ReactNode
}

// Creating the context with default values
const PositionContext = createContext<ContextProps>({
	position: 0, // Default slide position
	setPosition: () => {}, // Default setPosition function (does nothing)
})

// Custom hook to use the PositionContext
export const useSlidePosition = () => useContext(PositionContext)

// Provider component for the PositionContext
const SlidePositionProvider = ({ children }: Props) => {
	// State for the current slide position
	const [position, setPosition] = useState(0)

	// Providing the state and the updater function to children
	return <PositionContext.Provider value={{ position, setPosition }}>{children}</PositionContext.Provider>
}

// Exporting the provider as default
export default SlidePositionProvider
