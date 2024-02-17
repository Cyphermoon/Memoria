export type GoalItemProps = {
    id: string,
    description: string,
    imageUrl: string,
}

export type ImageGenerationMethodOptionProps = {
    label: string,
    value: string,
    icon: "wand-magic-sparkles" | "unsplash" | "photo-film"
}

export interface ImageGeneratedProps {
    url: string
    generationMethod: string
}

// export type GoalItemEditorProps = {
//     id: string,
//     url: string,
//     name: string,
// }
