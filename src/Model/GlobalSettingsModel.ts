import { DefaultValue, RecoilValueReadOnly, atom, selector, selectorFamily } from "recoil";
import { Axios } from "../Functions/NetworkFunctions";
import { GetCameraStoredTimeApi } from "../Constants/ApiRoutes";
import { distanceDaysTwoDate } from "../Functions/GlobalFunctions";

export type MapPlatformType = "ol" | "kakao" | "naver" | "google" | "apple"

type GlobalSettingType = {
    mapPlatformType: MapPlatformType
    maxStoredDay: number
}

const getMaxStoredDay = selector<number>({
    key: 'maxStoredDay/selector',
    get: async () => {
        return 365
        const res = await Axios("GET", GetCameraStoredTimeApi) as {start: string, end: string}
        if(res) {
            return Math.ceil(distanceDaysTwoDate(new Date(res.end!), new Date(res.start)))
        }
        return 1
    }
})

const maxStoredDay = atom<number>({
    key: "maxStoredDay",
    default: getMaxStoredDay
})

const mapPlatformType = atom<GlobalSettingType['mapPlatformType']>({
    key: "mapPlatformType",
    default: "ol"
})

export const globalSettings = selector<GlobalSettingType>({
    key: "globalSettings/selector",
    get: ({get}) => {
        return {
            mapPlatformType: get(mapPlatformType),
            maxStoredDay: get(maxStoredDay)
        }
    }
})

export const globalSingleSetting = selectorFamily({
    key: "globalSetting/single/selector",
    get: (type: keyof GlobalSettingType) => ({get}) => {
        switch(type) {
            case 'mapPlatformType': return get(mapPlatformType);
            case 'maxStoredDay': return get(maxStoredDay);
            default: break;
        }
    },
    set: (type: keyof GlobalSettingType) => ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            switch(type) {
                case 'mapPlatformType': return set(mapPlatformType, newValue as MapPlatformType)
                case 'maxStoredDay': return set(maxStoredDay, newValue as number)
                default: break;
            }
        }
    }
})