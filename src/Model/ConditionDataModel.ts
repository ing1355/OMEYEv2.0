import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";
import { ObjectTypes, ReIDObjectTypes } from "../Components/ReID/ConstantsValues";
import { ReIDConditionFormRoute } from "../Components/ReID/Condition/Constants/RouteInfo";
import { conditionRoute } from "./ConditionRouteModel";
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../Constants/GlobalTypes";
import { _timeIndex } from "./ConditionParamsModalModel";
import { AttributionConditionTestData, FaceConditionTestData, PersonConditionTestData, PlateConditionTestData } from "./TestDatas";
import { IS_PRODUCTION } from "../Constants/GlobalConstantsValues";

export type ConditionDataCCTVType = {
    cctvList: number[],
    selected?: boolean
}

export type ConditionDataTimeType = {
    time: string[],
    selected?: boolean
}

export type ConditionDataSingleType = {
    name: string,
    targets: CaptureResultListItemType[],
    cctv: ConditionDataCCTVType[],
    time: ConditionDataTimeType[],
    rank: number,
    etc: string
    isRealTime: boolean
}

type ConditionDataKeyType = {
    [key in ReIDObjectTypeKeys]: ConditionDataSingleType
}

export const createDefaultConditionData = (type: ReIDObjectTypeKeys): ConditionDataSingleType => ({
    name: '',
    targets: [],
    cctv: [],
    time: [],
    rank: 10,
    etc: '',
    isRealTime: false
})

export type ConditionDataType = { selectedType: ReIDObjectTypeKeys | null } & ConditionDataKeyType

const _data = atom<ConditionDataType>({
    key: "conditionData",
    default: {
        selectedType: IS_PRODUCTION ? null : 'PERSON',
        FACE: createDefaultConditionData('FACE'),
        // Face: FaceConditionTestData,
        PERSON: createDefaultConditionData('PERSON'),
        // PERSON: PersonConditionTestData,
        CARPLATE: createDefaultConditionData('CARPLATE'),
        // car_plate: PlateConditionTestData
        // ATTRIBUTION: createDefaultConditionData('ATTRIBUTION')
        ATTRIBUTION: IS_PRODUCTION ? createDefaultConditionData('ATTRIBUTION') : AttributionConditionTestData
    }
})

export type ConditionListType = ConditionDataSingleType & {
    selected?: boolean
    id: number
}

const _listData = atom<{
    [key in ReIDObjectTypeKeys]: ConditionListType[]
}>({
    key: "conditionDataList",
    default: {
        FACE: [],
        PERSON: [],
        CARPLATE: [],
        ATTRIBUTION: []
    }
})

export const conditionTargetDatasListByObjectType = selectorFamily({
    key: 'condompitionData/list/objectType',
    get: (objType: ReIDObjectTypeKeys) => ({ get }) => {
        return get(_listData)[objType]
    },
    set: (objType: ReIDObjectTypeKeys) => ({ set }, newValue) => {
        set(_listData, prev => ({ ...prev, [objType]: newValue }))
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

const _selectedObjectType = selector<ReIDObjectTypeKeys | null>({
    key: "selectedConditionObjectType",
    get: ({ get }) => get(_data).selectedType,
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const _ = get(_data)
            return set(_data, {
                ..._,
                selectedType: newValue
            })
        }
    }
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

export const selectedConditionObjectType = selector({
    key: "selectedConditionObjectType/selector",
    get: ({ get }) => get(_selectedObjectType),
    set: ({ get, set }, newValue) => {
        console.debug(`고속분석 - 조건 입력 - ${newValue} 타입 선택 !`)
        if (!(newValue instanceof DefaultValue)) {
            const _route = get(conditionRoute)
            if (newValue) {
                set(conditionRoute, _route.concat(ReIDConditionFormRoute.key))
            } else {
                set(conditionRoute, _route.slice(0, -1))
            }
            return set(_selectedObjectType, newValue)
        }
    }
})

export const conditionData = selector<ConditionDataSingleType>({
    key: "conditionData/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key]
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key]
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key]
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key]
            default: return data[ReIDObjectTypes[ObjectTypes.FACE].key];
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            const result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = newValue
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = newValue
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = newValue
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = newValue
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionTargetDatas = selectorFamily({
    key: "conditionTargetDatas/selector",
    get: (_type: ReIDObjectTypeKeys|null) => ({ get }) => {
        const type = _type || get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].targets
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].targets
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].targets
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].targets
            default: return [];
        }
    },
    set: (_type: ReIDObjectTypeKeys|null) => ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = _type || get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        targets: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        targets: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        targets: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        targets: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionTimeDatas = selector<ConditionDataSingleType['time']>({
    key: "conditionTimeDatas/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].time
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].time
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].time
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].time
            default: return [];
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        time: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        time: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        time: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        time: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
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

export const conditionAreaDatas = selector<ConditionDataSingleType['cctv']>({
    key: "conditionAreaDatas/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].cctv
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].cctv
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].cctv
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].cctv
            default: return [];
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        cctv: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        cctv: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        cctv: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        cctv: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionIsRealTimeData = selector<ConditionDataSingleType['isRealTime']>({
    key: "conditionRealTimeData/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].isRealTime
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].isRealTime
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].isRealTime
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].isRealTime
            default: return false;
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        isRealTime: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        isRealTime: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        isRealTime: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        isRealTime: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionRankData = selector<number>({
    key: "conditionRankData/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].rank
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].rank
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].rank
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].rank
            default: return 10;
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        rank: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        rank: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        rank: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        rank: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionTitleData = selector<string>({
    key: "conditionTitleData/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].name
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].name
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].name
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].name
            default: return '';
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        name: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        name: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        name: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        name: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionETCData = selector<string>({
    key: "conditionETCData/selector",
    get: ({ get }) => {
        const type = get(_selectedObjectType)
        const data = get(_data)
        switch (type) {
            case ReIDObjectTypes[ObjectTypes.FACE].key:
                return data[ReIDObjectTypes[ObjectTypes.FACE].key].etc
            case ReIDObjectTypes[ObjectTypes.PERSON].key:
                return data[ReIDObjectTypes[ObjectTypes.PERSON].key].etc
            case ReIDObjectTypes[ObjectTypes.PLATE].key:
                return data[ReIDObjectTypes[ObjectTypes.PLATE].key].etc
            case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                return data[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key].etc
            default: return '';
        }
    },
    set: ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            const type = get(_selectedObjectType)
            let result = { ...get(_data) }
            switch (type) {
                case ReIDObjectTypes[ObjectTypes.FACE].key:
                    result[ReIDObjectTypes[ObjectTypes.FACE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.FACE].key],
                        etc: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PERSON].key:
                    result[ReIDObjectTypes[ObjectTypes.PERSON].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PERSON].key],
                        etc: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.PLATE].key:
                    result[ReIDObjectTypes[ObjectTypes.PLATE].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.PLATE].key],
                        etc: newValue
                    }
                    break;
                case ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key:
                    result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key] = {
                        ...result[ReIDObjectTypes[ObjectTypes.ATTRIBUTION].key],
                        etc: newValue
                    }
                    break;
                default: break;
            }
            return set(_data, result)
        }
    }
})

export const conditionAllData = selector({
    key: "conditionAllData/selector",
    get: ({ get }) => {
        return get(_data)
    },
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            return set(_data, newValue)
        }
    }
})