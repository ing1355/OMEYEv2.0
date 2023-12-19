import { useRecoilValue, useSetRecoilState } from "recoil"
import { conditionRoute } from "../../../Model/ConditionRouteModel"
import { ReIDConditionFormRoute } from "./Constants/RouteInfo"
import { useEffect } from "react"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { ReIDMenuKeys } from "../ConstantsValues"
import { GlobalEvents } from "../../../Model/GlobalEventsModel"

const MenuStateManagement = () => {
    const globalEvent = useRecoilValue(GlobalEvents)
    const setCRoute = useSetRecoilState(conditionRoute)
    const setCMenu = useSetRecoilState(conditionMenu)

    useEffect(() => {
        if(globalEvent.key === 'AllMenuStateInit') {
            setCMenu(ReIDMenuKeys['CONDITION'])
            setCRoute([ReIDConditionFormRoute.key])
        }
    },[globalEvent])

    return <></>
}

export default MenuStateManagement