import { UnsplashResult } from "@components/Goal/unsplash.type"
import { create } from "zustand"

export const useUnSplashImageStore = create<UnSplashImageProps>(set => ({
	image: null,
	updateUnSplashImage: image => set({ image }),
}))

interface UnSplashImageProps {
	image: UnsplashResult | null
	updateUnSplashImage: (image: UnsplashResult | null) => void
}
