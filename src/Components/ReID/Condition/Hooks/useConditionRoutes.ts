import { useRecoilState } from "recoil"
import { ConditionRouteInfo, ConditionRouteType } from "../Constants/RouteInfo"
import { conditionRoute } from "../../../../Model/ConditionRouteModel"

const useConditionRoutes = () => {
    const [route, setRoute] = useRecoilState(conditionRoute)
    
    const routePush = (newRoute: ConditionRouteType['key']) => {
        setRoute(route.concat(newRoute))
    }
    const routePop = () => {
        const _ = [...route]
        _.pop()
        setRoute(_)
    }
    const routeJump = (routeName: ConditionRouteType['key']) => {
        const ind = route.findLastIndex(_ => _ === routeName)
        if (ind === -1) throw ""
        else setRoute(route.slice(0, ind + 1))
    }

    const getRouteName = (key: ConditionRouteType['key']) => {
        return ConditionRouteInfo[key].title
    }

    const getAllRoutes = () => route

    return { routePush, routePop, routeJump, getRouteName, getAllRoutes, setRoute }
}

export default useConditionRoutes