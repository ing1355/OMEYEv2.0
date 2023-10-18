import { DefaultValue, atom, selector } from "recoil";

export const _timeVisible = atom<boolean>({
    key: "conditionParamsModal/time",
    default: false
})

export const _timeIndex = atom<number>({
    key: "conditionParamsModal/time/index",
    default: -1
})

export const _areaVisible = atom<boolean>({
    key: "conditionParamsModal/area",
    default: false
})

export const _areaIndex = atom<number>({
    key: "conditionParamsModal/area/index",
    default: -1
})

export const TimeSelectVisible = selector({
    key: "conditionParamsModal/selector/time",
    get: ({get}) => get(_timeVisible),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            return set(_timeVisible, newValue)
        }
    }
})

export const TimeSelectIndex = selector({
    key: "conditionParamsModal/selector/time/index",
    get: ({get}) => get(_timeIndex),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            return set(_timeIndex, newValue)
        }
    }
})

export const AreaSelectVisible = selector({
    key: "conditionParamsModal/selector/area",
    get: ({get}) => get(_areaVisible),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            return set(_areaVisible, newValue)
        }
    }
})

export const AreaSelectIndex = selector({
    key: "conditionParamsModal/selector/area/index",
    get: ({get}) => get(_areaIndex),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            return set(_areaIndex, newValue)
        }
    }
})