import { ChildrenType } from '../../../../global'
import ObjectTypeSelect from '../ObjectTypeSelect'
import ReIDConditionForm from '../ReIDConditionForm'
import TargetSelect from '../TargetSelect'
import CCTVVideo from '../TargetSelect/CCTVVideo'
import ImageUpload from '../TargetSelect/ImageUpload'
import PersonDescription from '../TargetSelect/PersonDescription'

export const ObjectTypeSelectRoute: ConditionRouteType = {
    key: 'OBJECTTYPESELECTROUTE',
    title: "타입 설정",
    Component: <ObjectTypeSelect/>,
    pageNum: 0
}
export const ReIDConditionFormRoute: ConditionRouteType = {
    key: 'REIDCONDITIONFORMROUTE',
    title: "조건 설정",
    Component: <ReIDConditionForm/>,
    pageNum: 1
}
export const ReIDConditionTargetSelectMethodRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTMETHODROUTE',
    title: "대상 추가",
    Component: <TargetSelect/>,
    pageNum: 2
}
export const ReIDConditionTargetSelectCCTVRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTCCTVROUTE',
    title: "CCTV로 선택",
    Component: <CCTVVideo/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectImageRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTIMAGEROUTE',
    title: "이미지로 선택",
    Component: <ImageUpload/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectPersonDescriptionRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONROUTE',
    title: "인상착의로 선택",
    Component: <PersonDescription/>,
    pageNum: 3
}

export type ConditionRouteType = {
    key: 'OBJECTTYPESELECTROUTE' | 'REIDCONDITIONFORMROUTE' | 'REIDCONDITIONTARGETSELECTMETHODROUTE' | 'REIDCONDITIONTARGETSELECTCCTVROUTE' | 'REIDCONDITIONTARGETSELECTIMAGEROUTE' | 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONROUTE'
    Component: ChildrenType
    pageNum: number
    title: string
}

//8개

const createRouteInfo = (...routeInfo: ConditionRouteType[]) => {
    const _: {
        [key:string] : ConditionRouteType
    } = {}
    routeInfo.forEach(__ => {
        _[__.key] = __
    })
    return _
}

export const ConditionRouteInfo: {
    [key: string] : ConditionRouteType
} = createRouteInfo(ObjectTypeSelectRoute, ReIDConditionFormRoute, ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectPersonDescriptionRoute)