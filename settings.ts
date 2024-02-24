import { ImageGenerationMethodOptionProps, IntervalOptionProps } from "./src/components/Goal/type";

export const blurHash =
'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


// bottom sheet sort action items
export const sortOptions = [
    { title: 'By Name', id: 'name_desc' },
    { title: 'By Date', id: 'date_desc' },
    { title: 'By Size', id: 'size_desc' },
];

// bottom sheet image generation action items
export const imageGenerationModes: ImageGenerationMethodOptionProps[] = [
    { label: 'AI Generated', value: 'ai', icon: 'wand-magic-sparkles' },
    { label: 'Gallery', value: 'gallery', icon: 'photo-film' },
    { label: 'Unsplash', value: 'unsplash', icon: 'unsplash' },
]

// bottom sheet interval action items
export const intervalOptions: IntervalOptionProps[] = [
    { label: 'Daily', value: 'daily', icon: 'calendar-day' },
    { label: 'Weekly', value: 'weekly', icon: 'calendar-week' },
    { label: 'Monthly', value: 'monthly', icon: 'calendar' },
];

export const publishModes = [
    { label: 'Community', value: 'community'},
    { label: 'Personal', value: 'personal'},
]