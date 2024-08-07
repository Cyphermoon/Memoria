import React from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import Text from "./Text"

export interface CustomButtonProps extends TouchableOpacityProps {
	children: React.ReactNode
	variant?: "normal" | "inverse" | "outline" | "muted" | "danger"
	fullWidth?: boolean
	className?: string
	disableZoomOutEffect?: boolean
	disabled?: boolean
	onPress?: () => void
	isText?: boolean
}

const Touchable = ({
	children,
	variant = "normal",
	fullWidth,
	className,
	disableZoomOutEffect,
	disabled,
	isText,
	onPress,
	...rest
}: CustomButtonProps) => {
	// Generate dynamic class names based on variant and fullWidth
	const buttonClass = `px-3 inline-block py-4 rounded-lg transition capitalize text-base cursor-pointer 
    ${variant === "normal" ? "bg-accent" : ""}
    ${variant === "inverse" ? "bg-primary text-accent" : ""}
    ${variant === "outline" ? "border-2 border-accent text-accent bg-transparent" : ""}
    ${variant === "muted" ? "text-accent-900 bg-gray-200" : ""}
    ${variant === "danger" ? "bg-red-500 text-white" : ""}
    ${fullWidth ? "w-full" : ""}
    ${!disableZoomOutEffect ? "hover:opacity-80 hover:scale-95" : ""}
    ${disabled ? "opacity-70 pointer-events-none bg-gray-600" : ""}
    ${className}`

	return (
		<TouchableOpacity onPress={onPress} className={buttonClass} disabled={disabled} {...rest}>
			{isText ? <Text className="text-center text-primary">{children}</Text> : children}
		</TouchableOpacity>
	)
}

export default Touchable
