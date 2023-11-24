import { useRecoilValue, useSetRecoilState } from "recoil"
import { AllMenuStateInitEvent } from "../../../Model/GlobalEventModel"
import { conditionRoute } from "../../../Model/ConditionRouteModel"
import { ReIDConditionFormRoute } from "./Constants/RouteInfo"
import { useEffect } from "react"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { ReIDMenuKeys } from "../ConstantsValues"

const MenuStateManagement = () => {
    const allMenuStateInit = useRecoilValue(AllMenuStateInitEvent)
    const setCRoute = useSetRecoilState(conditionRoute)
    const setCMenu = useSetRecoilState(conditionMenu)

    useEffect(() => {
        if(allMenuStateInit) {
            setCMenu(ReIDMenuKeys['CONDITION'])
            setCRoute([ReIDConditionFormRoute.key])
        }
    },[allMenuStateInit])

    return <></>
}

export default MenuStateManagement