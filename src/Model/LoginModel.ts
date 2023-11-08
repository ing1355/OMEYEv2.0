import { DefaultValue, atom, selector } from "recoil";
import { AuthorizationKey } from "../Constants/GlobalConstantsValues";
import { menuState } from "./MenuModel";
import { conditionRoute } from "./ConditionRouteModel";
import { _areaIndex, _areaVisible, _timeIndex, _timeVisible } from "./ConditionParamsModalModel";

const loginToken = atom<string|null>({
    key: "isLogin",
    default: localStorage.getItem(AuthorizationKey)
})

export const isLogin = selector<string|null>({
    key: "isLogin/get",
    get: ({get}) => get(loginToken),
    set: ({set}, newValue) => {
        if(!(newValue instanceof DefaultValue)) {
            if(!newValue) { // 로그아웃
                // 모든 데이터 초기화
                localStorage.removeItem(AuthorizationKey)
                window.location.reload()
                set(conditionRoute, [])
            } else {
                localStorage.setItem(AuthorizationKey, newValue)
            }
            return set(loginToken, newValue)
        }
    }
})