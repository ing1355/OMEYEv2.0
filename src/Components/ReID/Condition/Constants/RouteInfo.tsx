import { ChildrenType } from '../../../../global'
import ObjectTypeSelect from '../ObjectTypeSelect'
import ReIDConditionForm from '../ReIDConditionForm'
import TargetSelect from '../TargetSelect'
import CCTVVideo from '../TargetSelect/CCTVVideo'
import ImageUpload from '../TargetSelect/ImageUpload'
import PersonDescription from '../TargetSelect/PersonDescription'
import PersonDescriptionBoundarySelect from '../TargetSelect/PersonDescription/PersonDescriptionBoundarySelect'
import PersonDescriptionResult from '../TargetSelect/PersonDescription/PersonDescriptionResult'

export const ObjectTypeSelectRoute: ConditionRouteType = {
    key: 'OBJECTTYPESELECTROUTE',
    Component: <ObjectTypeSelect/>,
    pageNum: 0
}
export const ReIDConditionFormRoute: ConditionRouteType = {
    key: 'REIDCONDITIONFORMROUTE',
    Component: <ReIDConditionForm/>,
    pageNum: 1
}
export const ReIDConditionTargetSelectMethodRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTMETHODROUTE',
    Component: <TargetSelect/>,
    pageNum: 2
}
export const ReIDConditionTargetSelectCCTVRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTCCTVROUTE',
    Component: <CCTVVideo/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectImageRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTIMAGEROUTE',
    Component: <ImageUpload/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectPersonDescriptionRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONROUTE',
    Component: <PersonDescription/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectPersonDescriptionBoundaryRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONBOUNDARYROUTE',
    Component: <PersonDescriptionBoundarySelect/>,
    pageNum: 3
}
export const ReIDConditionTargetSelectPersonDescriptionCompleteRoute: ConditionRouteType = {
    key: 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONCOMPLETEROUTE',
    Component: <PersonDescriptionResult/>,
    pageNum: 3
}

export type ConditionRouteType = {
    key: 'OBJECTTYPESELECTROUTE' | 'REIDCONDITIONFORMROUTE' | 'REIDCONDITIONTARGETSELECTMETHODROUTE' | 'REIDCONDITIONTARGETSELECTCCTVROUTE' | 'REIDCONDITIONTARGETSELECTIMAGEROUTE' | 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONROUTE' | 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONBOUNDARYROUTE' | 'REIDCONDITIONTARGETSELECTPERSONDESCRIPTIONCOMPLETEROUTE'
    Component: ChildrenType
    pageNum: number
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
} = createRouteInfo(ObjectTypeSelectRoute, ReIDConditionFormRoute, ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectPersonDescriptionRoute, ReIDConditionTargetSelectPersonDescriptionBoundaryRoute, ReIDConditionTargetSelectPersonDescriptionCompleteRoute)