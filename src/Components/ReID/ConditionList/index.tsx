import styled from "styled-components"
import { globalStyles } from "../../../styles/global-styled"
import Button from "../../Constants/Button"
import { useEffect, useState } from "react"
import ConditionListSetByType from "./ConditionListSetByType"
import { ObjectTypes, ReIDObjectTypes } from "../ConstantsValues"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { conditionTargetDatasListByObjectType, selectedConditionObjectType } from "../../../Model/ConditionDataModel"
import reidReqIcon from '../../../assets/img/reidReqIcon.png'
import { PROGRESS_STATUS, ProgressRequestParams, ProgressStatus } from "../../../Model/ProgressModel"
import { ReIDObjectTypeKeys } from "../../../Constants/GlobalTypes"

const ConditionList = () => {
    const [selectedTab, setSelectedTab] = useState<ReIDObjectTypeKeys>(ReIDObjectTypeKeys[ObjectTypes['PERSON']])
    const [conditionList, setConditionList] = useRecoilState(conditionTargetDatasListByObjectType(selectedTab))
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const progressStatus = useRecoilValue(ProgressStatus)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    
    useEffect(() => {
        if(currentObjectType) setSelectedTab(currentObjectType)
    },[currentObjectType])

    return <Container>
        <Header>
            <TypeTabs>
                <div>
                    필터 :
                </div>
                {
                    ReIDObjectTypes.map((_, ind) => <Tab hover key={ind} activate={selectedTab === _.key} onClick={() => {
                        setSelectedTab(_.key)
                    }}>
                        {_.title}
                    </Tab>)
                }
            </TypeTabs>
            <CompleteBtn icon={reidReqIcon} disabled={progressStatus.status === PROGRESS_STATUS['RUNNING'] || !conditionList.find(_ => _.selected)} concept="activate" onClick={() => {
                setProgressRequestParams({
                    type: 'REID',
                    params: conditionList.filter(_ => _.selected).map(_ => ({
                        title: _.name,
                        rank: _.rank,
                        etc: _.etc,
                        objects: _.targets.map(__ => ({
                            id: __.objectId!,
                            src: __.src,
                            type: __.type
                        })),
                        timeGroups: _.time.map(__ => ({
                            startTime: __.time[0],
                            endTime: __.time[1]
                        })),
                        cctvIds: _.cctv.map(_ => _.cctvList)
                    }))
                })
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