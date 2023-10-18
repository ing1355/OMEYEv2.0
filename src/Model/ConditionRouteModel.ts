import { DefaultValue, atom, selector } from "recoil";
import { ConditionRouteType, ObjectTypeSelectRoute } from "../Components/ReID/Condition/Constants/RouteInfo";

let start = new Date()

const _route = atom<ConditionRouteType['key'][]>({
    key: "conditionRoute",
    default: [ObjectTypeSelectRoute.key]
})

export const conditionRoute = selector({
    key: "conditionRoute/selector",
    get: ({get}) => get(_route),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            if(new Date().getTime() - start.getTime() >= 500) {
                start = new Date()
                if(newValue.length > 0) console.log("고속분석 - 조건 입력 라우팅 정보 변경 : ", newValue)
                return set(_route, newValue)
            }
        }
    }
})