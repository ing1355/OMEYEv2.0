import { DefaultValue, atom, selector } from "recoil";
import { ConditionRouteType, ObjectTypeSelectRoute, ReIDConditionFormRoute, ReIDConditionTargetSelectCCTVRoute } from "../Components/ReID/Condition/Constants/RouteInfo";
import { IS_PRODUCTION } from "../Constants/GlobalConstantsValues";

let start = new Date()

const _route = atom<ConditionRouteType['key'][]>({
    key: "conditionRoute",
    default: IS_PRODUCTION ? [] : [ObjectTypeSelectRoute.key, ReIDConditionFormRoute.key]
})

export const conditionRoute = selector({
    key: "conditionRoute/selector",
    get: ({get}) => get(_route),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            if(new Date().getTime() - start.getTime() >= 250) {
                start = new Date()
                if(newValue.length > 0) console.debug("고속분석 - 조건 입력 라우팅 정보 변경 : ", newValue)
                return set(_route, newValue)
            }
        }
    }
})