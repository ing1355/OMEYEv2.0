import styled from "styled-components"
import { GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import useConditionRoutes from "./Hooks/useConditionRoutes"
import Button from "../../Constants/Button"
import { ConditionRouteInfo, ConditionRouteType, ReIDConditionFormRoute, ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectPersonDescriptionBoundaryRoute, ReIDConditionTargetSelectPersonDescriptionCompleteRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "./Constants/RouteInfo"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { conditionRoute } from "../../../Model/ConditionRouteModel"
import { addConditionSingleTimeData, conditionData, conditionTargetDatas, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp, conditionTargetDatasListByObjectType, conditionTimeDatas, selectedConditionObjectType } from "../../../Model/ConditionDataModel"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { ReIDMenuKeys } from "../ConstantsValues"
import { REIDSTATUS, ReIDStatus } from "../../../Model/ReIdResultModel"
import backIcon from '../../../assets/img/backIcon.png'
import reidReqIcon from '../../../assets/img/reidReqIcon.png'
import { descriptionCCTVsData, descriptionData, descriptionRankData, descriptionResultData, descriptionSelectedResult, descriptionStatusData, descriptionTimeData } from "../../../Model/DescriptionDataModel"
import { hasValuePersonDescription } from "./TargetSelect/PersonDescription/Functions"
import { GetObjectIdByImage, StartPersonDescription, reidCancelFunc } from "../../../Functions/NetworkFunctions"
import { ArrayDeduplication, convertFullTimeString } from "../../../Functions/GlobalFunctions"
import { SseStartApi, SseTestApi } from "../../../Constants/ApiRoutes"
import TimeModal from "./Constants/TimeModal"
import { TimeSelectIndex, TimeSelectVisible } from "../../../Model/ConditionParamsModalModel"
import { useLayoutEffect, useMemo } from "react"
import { REALTIMESTATUS, realTimeStatus } from "../../../Model/RealTimeDataModel"
import { ProgressRequestParams } from "../../../Model/ProgressModel"

let listId = 0

const ContentsWrapper = () => {
    const routeInfo = useRecoilValue(conditionRoute)
    const setReIDStatus = useSetRecoilState(ReIDStatus)
    const personDescriptionData = useRecoilValue(descriptionData)
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const _conditionData = useRecoilValue(conditionData)
    const [targetDatas, setTargetDatas] = useRecoilState(conditionTargetDatas)
    const targetDatasCCTVTemp = useRecoilValue(conditionTargetDatasCCTVTemp)
    const targetDatasImageTemp = useRecoilValue(conditionTargetDatasImageTemp)
    const setCurrentMenu = useSetRecoilState(conditionMenu)
    const personDescriptionCCTVs = useRecoilValue(descriptionCCTVsData)
    const personDescriptionTime = useRecoilValue(descriptionTimeData)
    const personDescriptionRank = useRecoilValue(descriptionRankData)
    const [selectedPersonDescription, SelectedPersonDescription] = useRecoilState(descriptionSelectedResult)
    const personDescriptionAttribution = useRecoilValue(descriptionData)
    const [personDescriptionStatus, setPersonDescriptionStatus] = useRecoilState(descriptionStatusData)
    const personDescriptionResult = useRecoilValue(descriptionResultData)
    const [timeIndex, setTimeIndex] = useRecoilState(TimeSelectIndex)
    const [timeData, setTimeData] = useRecoilState(conditionTimeDatas)
    const [timeVisible, setTimeVisible] = useRecoilState(TimeSelectVisible)
    const [conditionList, setConditionList] = useRecoilState(conditionTargetDatasListByObjectType(currentObjectType!))
    const addTimeData = useSetRecoilState(addConditionSingleTimeData)
    const setRtStatus = useSetRecoilState(realTimeStatus)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    const { routePop, routeJump, routePush } = useConditionRoutes()
    const { targets, rank, time, name, cctv, isRealTime, etc } = _conditionData
    const currentRoute = useMemo(() => routeInfo[routeInfo.length - 1],[routeInfo])
    
    useLayoutEffect(() => {
        if (!timeVisible) setTimeIndex(-1)
    }, [timeVisible])

    const getCompleteButtonTextByRoute = () => {
        switch (routeInfo.at(-1)) {
            case ReIDConditionFormRoute.key:
            case ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key:
                return "바로 분석 요청"
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                return "다음"
            case ReIDConditionTargetSelectPersonDescriptionCompleteRoute.key:
                return "선택 완료"
            default:
                return "완료"
        }
    }

    const disableCompleteBtn = (): boolean => {
        switch (routeInfo.at(-1)) {
            case ReIDConditionFormRoute.key:
                if (isRealTime) {
                    return !(targets.filter(_ => _.selected).length > 0 && cctv.filter(_ => _.selected).length > 0)
                } else {
                    return !(targets.filter(_ => _.selected).length > 0 && (time.filter(_ => _.selected).length > 0 || isRealTime) && cctv.filter(_ => _.selected).length > 0 && name && rank)
                }
            case ReIDConditionTargetSelectCCTVRoute.key:
                return targetDatasCCTVTemp.filter(_ => _.selected).length === 0
            case ReIDConditionTargetSelectImageRoute.key:
                return targetDatasImageTemp.filter(_ => _.selected).length === 0
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                return !hasValuePersonDescription(personDescriptionData)
            case ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key:
                return personDescriptionCCTVs.length === 0 || personDescriptionTime.filter(_ => !_).length === 2 || !personDescriptionRank || personDescriptionStatus === 'RUNNING'
            case ReIDConditionTargetSelectCCTVRoute.key:
            case ReIDConditionTargetSelectImageRoute.key:
                return targets.length === 0
            case ReIDConditionTargetSelectMethodRoute.key:
                return true
            default:
                return false
        }
    }

    const completeCallback = async () => {
        switch (routeInfo.at(-1)) {
            case ReIDConditionFormRoute.key:
                if (isRealTime) {
                    setRtStatus(REALTIMESTATUS['RUNNING'])
                    setCurrentMenu(ReIDMenuKeys['REALTIMEREID'])
                } else {
                    setProgressRequestParams({
                        type: 'REID',
                        params: [
                            {
                                title: name,
                                timeAndArea: time.filter(_ => _.selected).map(_ => {
                                    return {
                                        startTime: _.time[0],
                                        endTime: _.time[1],
                                        cctvs: ArrayDeduplication(cctv.filter(_ => _.selected).flatMap(_ => _.cctvList))
                                    }
                                }),
                                rank,
                                etc,
                                objectIds: targets.filter(_ => _.selected).map(_ => _.objectId!)
                            }
                        ]
                    })
                    setReIDStatus(REIDSTATUS['RUNNING'])
                    window.addEventListener('unload', reidCancelFunc, {
                        once: true,
                    });
                }
                break;
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                return routePush(ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key)
            case ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key:
                setProgressRequestParams({
                    type: 'ATTRIBUTION',
                    params: {
                        rank: personDescriptionRank,
                        attribution: personDescriptionAttribution,
                        cameraSearchAreaList: personDescriptionCCTVs.map(_ => ({
                            id: _,
                            startTime: convertFullTimeString(personDescriptionTime[0]),
                            endTime: convertFullTimeString(personDescriptionTime[1]),
                        }))
                    }
                })
                // const res = await StartPersonDescription({
                //     rank: personDescriptionRank,
                //     attribution: personDescriptionAttribution,
                //     cameraSearchAreaList: personDescriptionCCTVs.map(_ => ({
                //         id: _,
                //         startTime: convertFullTimeString(personDescriptionTime[0]),
                //         endTime: convertFullTimeString(personDescriptionTime[1]),
                //     }))
                // })
                // if(res) {
                // } else {
                //     routePush(ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key)
                // }
                return routePush(ReIDConditionTargetSelectPersonDescriptionCompleteRoute.key)
            case ReIDConditionTargetSelectCCTVRoute.key:
                const targets1 = targetDatasCCTVTemp.filter(_ => _.selected)
                if (targets1.length > 0) {
                    const objectIds1 = (await GetObjectIdByImage(targets1.map(_ => ({
                        type: _.type,
                        image: _.src,
                        mask: _.mask
                    })))).map(_ => _)
                    setTargetDatas(targetDatas.concat(targets1.map((_, ind) => ({
                        ..._,
                        selected: false,
                        objectId: objectIds1[ind]
                    }))))
                }
                return routeJump(ReIDConditionFormRoute.key)
            case ReIDConditionTargetSelectImageRoute.key:
                const targets2 = targetDatasImageTemp.filter(_ => _.selected)
                if (targets2.length > 0) {
                    const objectIds2 = (await GetObjectIdByImage(targets2.map(_ => ({
                        type: _.type,
                        image: _.src,
                        mask: _.mask
                    })))).map(_ => _)
                    setTargetDatas(targetDatas.concat(targets2.map((_, ind) => ({
                        ..._,
                        selected: false,
                        objectId: objectIds2[ind]
                    }))))
                }
                return routeJump(ReIDConditionFormRoute.key)
            case ReIDConditionTargetSelectPersonDescriptionCompleteRoute.key:
                const objectIds3 = (await GetObjectIdByImage(selectedPersonDescription.map(_ => ({
                    type: 'Person',
                    image: _.img
                })))).map(_ => _)
                setTargetDatas(targetDatas.concat(selectedPersonDescription.map((_, ind) => ({
                    id: _.id,
                    src: _.img,
                    type: 'Person',
                    cctvId: _.cameraId,
                    occurancy: _.occurancy,
                    time: _.time,
                    method: 'Description',
                    objectId: objectIds3[ind],
                    attributionList: _.detectedAttributionList
                }))))
                return routeJump(ReIDConditionFormRoute.key)
            default:
                return routeJump(ReIDConditionFormRoute.key)
        }
    }

    return <>
        <Container>
            <Header noHeader={routeInfo.length < 2}>
                <BackButton onClick={() => {
                    routePop()
                }} icon={backIcon} />
                <CompleteButtons>
                    {
                        (currentRoute === ReIDConditionTargetSelectPersonDescriptionBoundaryRoute.key || currentRoute === ReIDConditionTargetSelectPersonDescriptionRoute.key) && <CompleteButton disabled={personDescriptionStatus === 'IDLE' && personDescriptionResult.length === 0} onClick={() => {
                            routePush(ReIDConditionTargetSelectPersonDescriptionCompleteRoute.key)
                        }}>
                            결과 보기
                        </CompleteButton>
                    }
                    {routeInfo.length === 2 && <CompleteButton disabled={disableCompleteBtn() || isRealTime} onClick={() => {
                        if(!disableCompleteBtn()) {
                            let tempConditionData = {..._conditionData}
                            tempConditionData.cctv = tempConditionData.cctv.filter(_ => _.selected)
                            tempConditionData.targets = tempConditionData.targets.filter(_ => _.selected)
                            tempConditionData.time = tempConditionData.time.filter(_ => _.selected)
                            setConditionList(conditionList.concat({...tempConditionData, selected: false, id: listId++}))
                        }
                    }}>
                        현재 조건 저장
                    </CompleteButton>}
                    <CompleteButton concept="activate" disabled={disableCompleteBtn()} onClick={() => {
                        completeCallback()
                    }} icon={routeInfo.length === 2 ? reidReqIcon : ''}>
                        {getCompleteButtonTextByRoute()}
                    </CompleteButton>
                </CompleteButtons>
            </Header>
            {(Object.keys(ConditionRouteInfo) as ConditionRouteType['key'][]).map(_ => <ContentsContainer key={_} index={ConditionRouteInfo[_].pageNum} current={_} routeInfo={routeInfo}>
                {ConditionRouteInfo[_].Component}
            </ContentsContainer>)}
        </Container>
        <TimeModal title={`시간 그룹 ${timeIndex === -1 ? (timeData.length && timeData.length + 1) || 1 : (timeIndex + 1)}`} defaultValue={time[timeIndex] && {
            startTime: time[timeIndex].time[0],
            endTime: time[timeIndex].time[1]
        }} onChange={data => {
            if (time[timeIndex]) setTimeData(timeData.map((_, ind) => timeIndex === ind ? { time: [data.startTime, data.endTime!], selected: _.selected } : _))
            else addTimeData({ time: [data.startTime, data.endTime!], selected: false })
        }} visible={timeVisible} setVisible={setTimeVisible} />
    </>
}

export default ContentsWrapper

const HeaderHeight = 40

const Container = styled.div`
    height: 100%;
    position: relative;
    ${globalStyles.fadeOut()}
`

const Header = styled.div<{ noHeader: boolean }>`
    padding: 0 24px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    opacity: ${({ noHeader }) => noHeader ? 0 : 1};
    ${({ noHeader }) => noHeader && {
        pointerEvents: 'none'
    }}
    height: ${HeaderHeight}px;
`

const BackButton = styled(Button)`
    height: 100%;
    padding: 8px;
    cursor: pointer;
    background-color: transparent;
    border: none;
`

const CompleteButton = styled(Button)`
    height: 100%;
    padding: 4px 24px;
    cursor: pointer;
`

const ContentsContainer = styled.div<{ index: number, routeInfo: ConditionRouteType['key'][], current: ConditionRouteType['key'] }>`
    position: absolute;
    top: ${HeaderHeight}px;
    left: ${({ current, routeInfo }) => routeInfo.includes(current) ? '0%' : '100%'};
    z-index: ${({ current, routeInfo, index }) => (routeInfo.at(-1) === current || routeInfo.length >= index) ? 2 : 1};
    padding: 12px 24px 0 24px;
    width: 100%;
    background-color: ${GlobalBackgroundColor};
    transition: left .5s;
    height: calc(100% - ${HeaderHeight}px);
`

const CompleteButtons = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`