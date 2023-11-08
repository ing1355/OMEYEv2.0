import { lazy } from "react"
// import Condition from "./Condition"
// import ConditionList from "./ConditionList"
import { ReIDMenuKeys } from "./ConstantsValues"
// import ReIDLogs from "./ReIDLogs"
// import ReIDResult from "./ReIDResult"
// import RealTimeReID from "./RealTimeReID"

const Condition = lazy(() => import('./Condition'))
const ConditionList = lazy(() => import('./ConditionList'))
const ReIDLogs = lazy(() => import('./ReIDLogs'))
const ReIDResult = lazy(() => import('./ReIDResult'))
const RealTimeReID = lazy(() => import('./RealTimeReID'))

export const ReIDMenuItems: {
    key: ReIDMenuKeys
    title: string
    Component: React.FC
}[] = [
    {
        key: ReIDMenuKeys['CONDITION'],
        title: '검색 조건 설정',
        Component: Condition
    },
    {
        key: ReIDMenuKeys['CONDITIONLIST'],
        title: '검색 조건 목록',
        Component: ConditionList
    },
    {
        key: ReIDMenuKeys['REIDRESULT'],
        title: '분석 결과',
        Component: ReIDResult
    },
    {
        key: ReIDMenuKeys['REIDLOGS'],
        title: '분석 로그',
        Component: ReIDLogs
    },
    {
        key: ReIDMenuKeys['REALTIMEREID'],
        title: '실시간 분석 현황',
        Component: RealTimeReID
    },
]