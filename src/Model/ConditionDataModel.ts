import { DefaultValue, atom, selector, selectorFamily } from "recoil";
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../Constants/GlobalTypes";
import { _timeIndex } from "./ConditionParamsModalModel";
import { AttributionConditionTestData, FaceConditionTestData, PersonConditionTestData, PlateConditionTestData } from "./TestDatas";
import { IS_PRODUCTION } from "../Constants/GlobalConstantsValues";
import { ObjectTypes } from "../Components/ReID/ConstantsValues";

export type ConditionDataCCTVType = {
    cctvList: number[],
    selected?: boolean
}

export type ConditionDataTimeType = {
    time: string[],
    selected?: boolean
}

export type ConditionDataType = {
    name: string,
    targets: CaptureResultListItemType[],
    cctv: ConditionDataCCTVType[],
    time: ConditionDataTimeType[],
    rank: number,
    etc: string
    isRealTime: boolean
}

export const createDefaultConditionData = (): ConditionDataType => ({
    name: '',
    targets: [],
    cctv: [],
    time: [],
    rank: 10,
    etc: '',
    isRealTime: false
})

const _data = atom<ConditionDataType>({
    key: "conditionData",
    default: IS_PRODUCTION ? createDefaultConditionData() : AttributionConditionTestData
})

const _type = atom<ReIDObjectTypeKeys>({
    key: "conditionSelectedType",
    default: ReIDObjectTypeKeys[ObjectTypes['PERSON']]
})

export type ConditionListType = ConditionDataType & {
    selected?: boolean
    id: number
}

const _listData = atom<ConditionListType[]>({
    key: "conditionDataList",
    default: []
})

export const conditionListDatas = selector({
    key: 'condompitionData/list',
    get: ({ get }) => {
        return get(_listData)
    },
    set: ({ set }, newValue) => {
        set(_listData, newValue)
    }
})

const _tempTargetImageDatas = atom<CaptureResultListItemType[]>({
    key: "conditionData/target/temp/Image",
    default: []
})

const _tempTargetCCTVDatas = atom<CaptureResultListItemType[]>({
    key: "conditionData/target/temp/CCTV",
    default: []
})

export const conditionTargetDatasCCTVTemp = selector({
    key: "conditionData/target/temp/selector/CCTV",
    get: ({ get }) => get(_tempTargetCCTVDatas),
    set: ({ set }, newValue) => {
        set(_tempTargetCCTVDatas, newValue)
    }
})

export const conditionTargetDatasImageTemp = selector({
    key: "conditionData/target/temp/selector/Image",
    get: ({ get }) => get(_tempTargetImageDatas),
    set: ({ set }, newValue) => {
        set(_tempTargetImageDatas, newValue)
    }
})

export const conditionData = selector<ConditionDataType>({
    key: "conditionData/selector",
    get: ({ get }) => {
        return get(_data)
    },
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            return set(_data, newValue)
        }
    }
})

export const conditionSelectedType = selector({
    key: "conditionSelectedType/selector",
    get: ({ get }) => {
        return get(_type)
    },
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            return set(_type, newValue)
        }
    }
})

export const conditionTargetDatas = selector({
    key: "conditionTargetDatas/selector",
    get: ({ get }) => {
        return get(_data).targets
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, targets: newValue})
        }
    }
})

export const conditionTimeDatas = selector<ConditionDataType['time']>({
    key: "conditionTimeDatas/selector",
    get: ({ get }) => {
        return get(_data).time
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, time: newValue})
        }
    }
})

export const addConditionSingleTimeData = selector<ConditionDataTimeType>({
    key: "conditionTimeDatas/selector/single/add",
    get: ({ get }) => {
        const _index = get(_timeIndex)
        return get(conditionTimeDatas)[_index]
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const times = get(conditionTimeDatas)
            set(conditionTimeDatas, times.concat(newValue as ConditionDataTimeType))
        }
    }
})

export const conditionAreaDatas = selector<ConditionDataType['cctv']>({
    key: "conditionAreaDatas/selector",
    get: ({ get }) => {
        return get(_data).cctv
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, cctv: newValue})
        }
    }
})

export const conditionIsRealTimeData = selector<ConditionDataType['isRealTime']>({
    key: "conditionRealTimeData/selector",
    get: ({ get }) => {
        return get(_data).isRealTime
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, isRealTime: newValue})
        }
    }
})

export const conditionRankData = selector<number>({
    key: "conditionRankData/selector",
    get: ({ get }) => {
        return get(_data).rank        
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, rank: newValue})
        }
    }
})

export const conditionTitleData = selector<string>({
    key: "conditionTitleData/selector",
    get: ({ get }) => {
        return get(_data).name
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, name: newValue})
        }
    }
})

export const conditionETCData = selector<string>({
    key: "conditionETCData/selector",
    get: ({ get }) => {
        return get(_data).etc
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let result = { ...get(_data) }
            return set(_data, {...result, etc: newValue})
        }
    }
})