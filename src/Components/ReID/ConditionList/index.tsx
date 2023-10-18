import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Button from "../../Constants/Button"
import { useState } from "react"
import { ReIDObjectTypeKeys, ReIDObjectTypes } from "../ConstantsValues"
import ConditionListSetByType from "./ConditionListSetByType"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { REIDSTATUS, ReIDStatus } from "../../../Model/ReIdResultModel"
import { conditionTargetDatasListByObjectType } from "../../../Model/ConditionDataModel"
import { SseTestApi } from "../../../Constants/ApiRoutes"
import reidReqIcon from '../../../assets/img/reidReqIcon.png'
import { ProgressRequestParams } from "../../../Model/ProgressModel"

const ConditionList = () => {
    const [selectedTab, setSelectedTab] = useState<ReIDObjectTypeKeys>('Person')
    const [conditionList, setConditionList] = useRecoilState(conditionTargetDatasListByObjectType(selectedTab))
    const [reidStatus, setReIDStatus] = useRecoilState(ReIDStatus)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    
    return <Container>
        <Header>
            <TypeTabs>
                <div>
                    필터 :
                </div>
                {
                    ReIDObjectTypes.map((_, ind) => <Tab key={ind} activate={selectedTab === _.key} onClick={() => {
                        setSelectedTab(_.key)
                    }}>
                        {_.title}
                    </Tab>)
                }
            </TypeTabs>
            <CompleteBtn icon={reidReqIcon} disabled={reidStatus === 'RUNNING' || !conditionList.find(_ => _.selected)} concept="activate" onClick={() => {
                setProgressRequestParams({
                    type: 'REID',
                    params: conditionList.filter(_ => _.selected).map(_ => ({
                        title: _.name,
                        rank: _.rank,
                        etc: _.etc,
                        objectIds: _.targets.map(__ => __.objectId!),
                        timeAndArea: _.time.map(__ => ({
                            startTime: __.time[0],
                            endTime: __.time[1],
                            cctvs: _.cctv.flatMap(__ => __.cctvList)
                        }))
                    }))
                })
                setReIDStatus(REIDSTATUS['RUNNING'])
            }}>
                분석 요청
            </CompleteBtn>
        </Header>
        <Contents>
            <ConditionListSetByType type={selectedTab}/>
        </Contents>
    </Container>
}

export default ConditionList

const Container = styled.div`
    height: 100%;
    padding: 16px 24px;
`

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 48px;
    padding-bottom: 8px;
`

const TypeTabs = styled.div`
    ${globalStyles.flex({flexDirection:'row', gap: '8px'})}
`

const CompleteBtn = styled(Button)`
    height: 100%;
`

const Tab = styled(Button)`
    
`

const Contents = styled.div`
    height: calc(100% - 48px);
    overflow: auto;
`