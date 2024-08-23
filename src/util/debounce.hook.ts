import { useEffect, useState } from "react"

export function useDebounce<T>(initialValue: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(initialValue)
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		setIsReady(false)
		const timeout = setTimeout(() => {
			setDebouncedValue(initialValue)
			setIsReady(true)
		}, delay)

		return () => clearTimeout(timeout)
	}, [initialValue, delay])

	return [debouncedValue, isReady]
}
