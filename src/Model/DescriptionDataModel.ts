import { DefaultValue, atom, selector, selectorFamily } from "recoil";
import { DescriptionCategoryKeyType, PersonDescriptionResultType, descriptionDataSingleType, descriptionDataType, descriptionParamType } from "../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType";
import { CameraDataType, TimeDataType } from "../Constants/GlobalTypes";

export const descriptionInitialData: descriptionParamType = {
    general: {
        gender: null,
        // age: null,
        hair: null
    },
    outer: {
        type: null,
        shape: null,
        pattern: null,
        color: []
    },
    inner: {
        pattern: null,
        color: []
    },
    bottom: {
        type: null,
        pattern: null,
        color: []
    },
    shoes: {
        type: null
    },
    etc: {
        mask: null,
        glasses: null,
        bag: null,
        walkingaids: null
    }
}

const _data = atom({
    key: "descriptionData",
    default: descriptionInitialData
})

export type DescriptionRequestParamsType = {
    rank: number,
    attribution: descriptionDataType,
    cameraSearchAreaList: (TimeDataType & {
        id: number
    })[]
}

export const descriptionData = selector({
    key: "descriptionData/selector",
    get: ({ get }) => get(_data),
    set: ({ set }, newValue) => {
        set(_data, newValue)
    }
})

export const descriptionSingleData = selectorFamily<descriptionParamType[DescriptionCategoryKeyType], DescriptionCategoryKeyType>({
    key: 'descriptionData/single',
    get: (key: DescriptionCategoryKeyType) => ({ get }) => {
        return get(_data)[key] as descriptionParamType[DescriptionCategoryKeyType]
    },
    set: (key: DescriptionCategoryKeyType) => ({ get, set }, newValue) => {
        let oldData = get(_data)
        if (!(newValue instanceof DefaultValue)) {
            set(_data, {
                ...oldData,
                [key]: newValue as descriptionDataSingleType<typeof key>
            })
        }
    }
})