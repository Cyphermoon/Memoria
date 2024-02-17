import { ImageGenerationMethodOptionProps } from "./src/components/Goal/type";

export const blurHash =
'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const sortOptions = [
    { title: 'By Name', id: 'name_desc' },
    { title: 'By Date', id: 'date_desc' },
    { title: 'By Size', id: 'size_desc' },
];

export const imageGenerationModes: ImageGenerationMethodOptionProps[] = [
    { label: 'AI Generated', value: 'ai', icon: 'wand-magic-sparkles' },
    { label: 'Gallery', value: 'gallery', icon: 'photo-film' },
    { label: 'Unsplash', value: 'unsplash', icon: 'unsplash' },
]