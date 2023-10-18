import Condition from "./Condition"
import ConditionList from "./ConditionList"
import { ReIDMenuKeys } from "./ConstantsValues"
import ReIDLogs from "./ReIDLogs"
import ReIDResult from "./ReIDResult"
import RealTimeReID from "./RealTimeReID"

export const ReIDMenuItems: {
    key: ReIDMenuKeys
    title: string
    Component: React.FC
}[] = [
    {
        key: ReIDMenuKeys['CONDITION'],
        title: '조건 입력',
        Component: Condition
    },
    {
        key: ReIDMenuKeys['CONDITIONLIST'],
        title: '조건 목록',
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