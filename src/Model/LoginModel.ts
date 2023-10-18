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
                set(conditionRoute, [])
                console.log('로그아웃 성공 !')
            } else {
                localStorage.setItem(AuthorizationKey, newValue)
                console.log('로그인 성공 !')
            }
            set(_timeVisible, false)
            set(_timeIndex, 0)
            set(_areaVisible, false)
            set(_areaIndex, 0)
            set(menuState, null)
            return set(loginToken, newValue)
        }
    }
})