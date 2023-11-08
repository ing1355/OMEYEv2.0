import { CameraDataType } from "../../../../../Constants/GlobalTypes"

export type descriptionColorType = 'red' | 'orange' | 'yellow' | 'green' | 'beige' | 'pink' | 'blue' | 'navy' | 'brown' | 'purple' | 'white' | 'gray' | 'black'
export type descriptionPatternType = "plain" | "checked" | "stripe" | "printing" | "colorblocking" | 'pattern' | null

export type descriptionGeneralType = {
    gender: 'male' | 'female' | null
    // age: 'child' | 'young' | 'old' | null
    hair: "shorthair" | "bobbedhair" | "longhair" | "ponytail" | "bald" | "helmet" | "hat" | null
}

export type descriptionOuterType = {
    type: "shortouter" | "longouter" | "shirt" | "onepiece" | null
    shape: "longsleeve" | "shortsleeve" | "sleeveless" | null
    pattern: descriptionPatternType
    color: descriptionColorType[]
}

export type descriptionOuterParamType = {
    type: "shortouter" | "longouter" | "shirt" | "onepiece" | null
    shape: "longsleeve" | "shortsleeve" | "sleeveless" | null
    pattern: descriptionPatternType
    color: descriptionColorType[]
}

export type descriptionInnerType = {
    pattern: descriptionPatternType
    color: descriptionColorType[]
}

export type descriptionInnerParamType = {
    pattern: descriptionPatternType
    color: descriptionColorType[]
}

export type descriptionBottomType = {
    type: "shortpants" | "longpants" | "shortskirt" | "longskirt" | null
    pattern: 'plain' | 'pattern' | null
    color: descriptionColorType[]
}

export type descriptionBottomParamType = {
    type: "shortpants" | "longpants" | "shortskirt" | "longskirt" | null
    pattern: 'plain' | 'pattern' | null
    color: descriptionColorType[]
}

export type descriptionShoesType = {
    type: "sneakers" | "boots" | "slipper" | null
}

export type descriptionETCType = {
    mask: 'mask' | null
    glasses: 'glasses' | 'sunglasses' | null
    bag: "backpack" | "bag" | "carrier" | null
    walkingaids: "crutch" | "cane" | "wheelchair" | "walkingframe" | null
}

export type descriptionDataType = {
    general: descriptionGeneralType
    outer: descriptionOuterType
    inner: descriptionInnerType
    bottom: descriptionBottomType
    shoes: descriptionShoesType
    etc: descriptionETCType
}

export type descriptionParamType = {
    general: descriptionGeneralType
    outer: descriptionOuterParamType
    inner: descriptionInnerParamType
    bottom: descriptionBottomParamType
    shoes: descriptionShoesType
    etc: descriptionETCType
}

export type descriptionDataSingleType<descriptionType extends DescriptionCategoryKeyType> = descriptionDataType[descriptionType]
export type descriptionSubDataKeys<T extends DescriptionCategoryKeyType> = keyof descriptionDataType[T]
export type descriptionValueDataKeys<A extends DescriptionCategoryKeyType, B extends descriptionSubDataKeys<DescriptionCategoryKeyType>> = keyof descriptionDataType[A][B]

export type DescriptionCategoryKeyType = keyof descriptionDataType

export const DescriptionCategories: {
    key: DescriptionCategoryKeyType
    title: string
}[] = [
        // {
        //     key: 'general',
        //     title: '성별·나이·헤어'
        // },
        {
            key: 'general',
            title: '성별·헤어'
        },
        {
            key: 'outer',
            title: '상의\n(아우터)'
        },
        {
            key: 'inner',
            title: '상의\n(이너)'
        },
        {
            key: 'bottom',
            title: '하의'
        },
        {
            key: 'shoes',
            title: '신발'
        },
        {
            key: 'etc',
            title: '기타'
        },
    ]

export type PersonDescriptionResultType = {
    id: number;
    img: string;
    time: string;
    accuracy: number;
    cameraId: CameraDataType['cameraId'];
    rank: number;
    detectedAttributionList: Array<string>;
}