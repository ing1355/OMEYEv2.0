import { DefaultValue, atom, selector, selectorFamily } from "recoil";
import { DescriptionCategoryKeyType, PersonDescriptionResultType, descriptionDataSingleType, descriptionDataType, descriptionParamType } from "../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType";
import { CameraDataType, TimeDataType } from "../Constants/GlobalTypes";

const initialData: descriptionParamType = {
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

const _targetId = atom({
    key: "desriptionUUID",
    default: ''
})

const _data = atom({
    key: "descriptionData",
    default: initialData
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

export const descriptionId = selector({
    key: "descriptionUUID/selector",
    get: ({ get }) => get(_targetId),
    set: ({ set }, newValue) => {
        set(_targetId, newValue)
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
            (oldData[key] as descriptionDataSingleType<typeof key>) = newValue as descriptionDataSingleType<typeof key>;
            set(_data, oldData)
        }
    }
})

const _rank = atom({
    key: "descriptionRank",
    default: 20
})

const _options = atom<{
    cctvs: CameraDataType['cameraId'][]
    time: Date[]
}>({
    key: "descriptionOptions",
    default: {
        cctvs: [],
        time: []
    }
})

const _result = atom<PersonDescriptionResultType[]>({
    key: "descriptionResult",
    default: []
})

const _selectedResult = atom<PersonDescriptionResultType[]>({
    key: "descriptionSelectedResult",
    default: []
})

export const descriptionResultData = selector({
    key: 'descriptionResult/selector',
    get: ({ get }) => get(_result),
    set: ({ set }, newValue) => {
        set(_result, newValue)
    }
})

export const descriptionCCTVsData = selector({
    key: 'descriptionOptions/selector/cctv',
    get: ({ get }) => get(_options)['cctvs'],
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const old = get(_options)
            set(_options, {
                ...old,
                cctvs: newValue
            })
        }
    }
})

export const descriptionTimeData = selector({
    key: 'descriptionOptions/selector/time',
    get: ({ get }) => get(_options)['time'],
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const old = get(_options)
            set(_options, {
                ...old,
                time: newValue
            })
        }
    }
})

export const descriptionRankData = selector({
    key: 'descriptionOptions/selector/rank',
    get: ({get}) => get(_rank),
    set: ({ set }, newValue) => {
        set(_rank, newValue)
    }
})

export const descriptionSelectedResult = selector({
    key: 'descriptionSelected/result/selector',
    get: ({get}) => get(_selectedResult),
    set: ({ set }, newValue) => {
        set(_selectedResult, newValue)
    }
})