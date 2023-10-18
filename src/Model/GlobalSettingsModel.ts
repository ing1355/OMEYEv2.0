import { DefaultValue, atom, selector } from "recoil";

export type MapPlatformType = "ol" | "kakao" | "naver" | "google" | "apple"
type GlobalSettingType = {
    mapPlatformType: MapPlatformType
}

const g_settings = atom<GlobalSettingType>({
    key: "globalSettings",
    default: {
        mapPlatformType: "ol"
    }
})

export const globalSettings = selector({
    key: "globalSettings/selector",
    get: ({get}) => get(g_settings),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            return set(g_settings, newValue)
        }
    }
})