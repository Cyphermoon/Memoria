import { useEffect, useState } from "react"

export function useDebounce(initialValue: number | string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(initialValue)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(initialValue)
		}, delay)

		return () => clearTimeout(timeout)
	}, [initialValue, delay])

	return debouncedValue
}
