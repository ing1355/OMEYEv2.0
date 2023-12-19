import styled from "styled-components"
import { GlobalBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import useConditionRoutes from "./Hooks/useConditionRoutes"
import Button from "../../Constants/Button"
import { ConditionRouteInfo, ConditionRouteType, ReIDConditionFormRoute, ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "./Constants/RouteInfo"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { conditionRoute } from "../../../Model/ConditionRouteModel"
import { addConditionSingleTimeData, conditionAreaDatas, conditionData, conditionSelectedType, conditionTargetDatas, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp, conditionTimeDatas } from "../../../Model/ConditionDataModel"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { ObjectTypes, ReIDMenuKeys, ReIDObjectTypes } from "../ConstantsValues"
import homeIcon from '../../../assets/img/homeIcon.png'
import hoverHomeIcon from '../../../assets/img/hoverHomeIcon.png'
import reidReqIcon from '../../../assets/img/reidReqIcon.png'
import { descriptionData } from "../../../Model/DescriptionDataModel"
import { hasValuePersonDescription } from "./TargetSelect/PersonDescription/Functions"
import { GetObjectIdByImage } from "../../../Functions/NetworkFunctions"
import { DivToImg } from "../../../Functions/GlobalFunctions"
import TimeModal from "./Constants/TimeModal"
import { AreaSelectIndex, AreaSelectVisible, TimeSelectIndex, TimeSelectVisible } from "../../../Model/ConditionParamsModalModel"
import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { realTimeData, realTimeStatus } from "../../../Model/RealTimeDataModel"
import { PROGRESS_STATUS, ProgressRequestParams, ProgressStatus, ReIdRequestFlag } from "../../../Model/ProgressModel"
import AreaSelect from "./Constants/AreaSelect"
import useMessage from "../../../Hooks/useMessage"
import { PersonDescriptionResultImageID } from "./Constants/ConstantsValues"
import { ReIDObjectTypeKeys } from "../../../Constants/GlobalTypes"
import ForLog from "../../Constants/ForLog"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "./Constants/Params"
import { GlobalEvents } from "../../../Model/GlobalEventsModel"

const ContentsWrapper = () => {
    const [homeHover, setHomeHover] = useState(false)
    const routeInfo = useRecoilValue(conditionRoute)
    const progressStatus = useRecoilValue(ProgressStatus)
    const personDescriptionData = useRecoilValue(descriptionData)
    const _conditionData = useRecoilValue(conditionData)
    const [targetDatas, setTargetDatas] = useRecoilState(conditionTargetDatas)
    const targetDatasCCTVTemp = useRecoilValue(conditionTargetDatasCCTVTemp)
    const targetDatasImageTemp = useRecoilValue(conditionTargetDatasImageTemp)
    const setRequestFlag = useSetRecoilState(ReIdRequestFlag)
    const [timeIndex, setTimeIndex] = useRecoilState(TimeSelectIndex)
    const [timeData, setTimeData] = useRecoilState(conditionTimeDatas)
    const [timeVisible, setTimeVisible] = useRecoilState(TimeSelectVisible)
    const [areaVisible, setAreaVisible] = useRecoilState(AreaSelectVisible)
    const [areaIndex, setAreaIndex] = useRecoilState(AreaSelectIndex)
    const [areaData, setAreaData] = useRecoilState(conditionAreaDatas)
    const [globalEvent, setGlobalEvent] = useRecoilState(GlobalEvents)
    const addTimeData = useSetRecoilState(addConditionSingleTimeData)
    const rtStatus = useRecoilValue(realTimeStatus)
    const setRealTimeData = useSetRecoilState(realTimeData)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    const currentObjectType = useRecoilValue(conditionSelectedType)
    const { routeJump, getAllRoutes, getRouteName } = useConditionRoutes()
    const { targets, rank, time, title, cctv, isRealTime, etc } = _conditionData
    const message = useMessage()
    const allSelected = useMemo(() => {
        return isRealTime ? (targets.every(_ => _.selected) && cctv.every(_ => _.selected)) : (time.every(_ => _.selected) && targets.every(_ => _.selected) && cctv.every(_ => _.selected))
    }, [_conditionData, isRealTime])
    
    useLayoutEffect(() => {
        if (!timeVisible) setTimeIndex(-1)
    }, [timeVisible])

    const getCompleteButtonTextByRoute = () => {
        switch (routeInfo.at(-1)) {
            case ReIDConditionTargetSelectCCTVRoute.key:
            case ReIDConditionTargetSelectImageRoute.key:
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                return "대상 추가"
            case ReIDConditionFormRoute.key:
                return "바로 분석 요청"
            default:
                return "완료"
        }
    }

    const disableCompleteBtn = (): boolean => {
        switch (routeInfo.at(-1)) {
            case ReIDConditionFormRoute.key:
                if (targets.length === 0 || cctv.length === 0 || (isRealTime ? false : time.length === 0) || progressStatus.status === PROGRESS_STATUS['RUNNING']) return true
                return false;
            case ReIDConditionTargetSelectCCTVRoute.key:
                return targetDatasCCTVTemp.filter(_ => _.selected).length === 0
            case ReIDConditionTargetSelectImageRoute.key:
                return targetDatasImageTemp.filter(_ => _.selected).length === 0
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                return !hasValuePersonDescription(personDescriptionData)
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
        console.debug('route : ', routeInfo.at(-1))
        switch (routeInfo.at(-1)) {
            case ReIDConditionFormRoute.key: {
                const filteredTarget = targets.filter(_ => _.selected)
                if (filteredTarget.length === 0) return message.error({ title: "입력값 에러", msg: "대상을 1개 이상 선택해주세요." })
                if (cctv.filter(_ => _.selected).length === 0) return message.error({ title: "입력값 에러", msg: "CCTV 그룹을 1대 이상 선택해주세요." })
                if (filteredTarget.some(_ => filteredTarget.find(__ => __.type !== _.type))) return message.error({ title: "입력값 에러", msg: `여러 타입의 대상을 선택하셨습니다.\n하나의 타입만 선택해주세요.\n선택된 타입 : ${targets.map(_ => ReIDObjectTypes.find(__ => __.key === _.type)?.title).deduplication().join(',')}` })
                if (isRealTime) {
                    if (rtStatus === PROGRESS_STATUS['RUNNING']) return message.error({ title: '입력값 에러', msg: '이미 실시간 분석을 사용 중입니다.' })
                    if (filteredTarget.length > 1) {
                        return message.error({ title: '입력값 에러', msg: '여러 대상이 선택되었습니다.\n한 대상만 선택해주세요.' })
                    }
                    if (filteredTarget[0].type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) {
                        setRealTimeData({
                            type: filteredTarget[0].type,
                            cameraIdList: cctv.filter(_ => _.selected).flatMap(_ => _.cctvList).deduplication(),
                            objectId: filteredTarget[0].objectId,
                            threshHold: 1,
                            description: filteredTarget[0].description,
                            src: filteredTarget[0].src
                        })
                    } else {
                        setRealTimeData({
                            type: filteredTarget[0].type,
                            cameraIdList: cctv.filter(_ => _.selected).flatMap(_ => _.cctvList).deduplication(),
                            objectId: filteredTarget[0].objectId,
                            threshHold: 50,
                            src: filteredTarget[0].src
                        })
                    }
                    setGlobalEvent({
                        key: 'RealTimeStack'
                    })
                } else {
                    if (time.filter(_ => _.selected).length === 0) return message.error({ title: "입력값 에러", msg: "시간 그룹을 1개 이상 선택해주세요." })
                    if (progressStatus.status === PROGRESS_STATUS['RUNNING']) message.error({ title: "입력값 에러", msg: "이미 고속분석 요청이 진행 중입니다." })
                    setRequestFlag(true)
                    setProgressRequestParams({
                        type: 'REID',
                        params: [
                            {
                                title: title || "빈 타이틀",
                                timeGroups: time.filter(_ => _.selected).map(_ => ({
                                    startTime: _.time[0],
                                    endTime: _.time[1]
                                })),
                                cctvIds: cctv.filter(_ => _.selected).map(_ => _.cctvList),
                                rank,
                                etc,
                                objects: filteredTarget.map(_ => ({
                                    id: _.objectId!,
                                    src: _.src,
                                    type: _.type
                                }))
                            }
                        ]
                    })
                }
                break;
            }
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                const target = document.getElementById(PersonDescriptionResultImageID) as HTMLDivElement
                if (!target) return message.error({ title: "입력값 에러", msg: "인상착의 이미지를 설정하지 않았습니다." })
                const image = await DivToImg(target)
                const objectIds4 = (await GetObjectIdByImage([{
                    type: 'ATTRIBUTION',
                    src: image,
                    description: personDescriptionData,
                    method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['DESCRIPTION']]
                }]))
                if (objectIds4) {
                    setTargetDatas(targetDatas.concat({
                        type: 'ATTRIBUTION',
                        src: image,
                        selected: false,
                        objectId: objectIds4[0],
                        method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['DESCRIPTION']],
                        description: personDescriptionData
                    }))
                    return routeJump(ReIDConditionFormRoute.key)
                }
                break;
            case ReIDConditionTargetSelectCCTVRoute.key:
                const targets1 = targetDatasCCTVTemp.filter(_ => _.selected)
                if (targets1.length > 0) {
                    const objectIds1 = await GetObjectIdByImage(targets1)
                    if (objectIds1) {
                        setTargetDatas(targetDatas.concat(targets1.map((_, ind) => ({
                            ..._,
                            selected: false,
                            objectId: objectIds1[ind]
                        }))))
                    }
                    return routeJump(ReIDConditionFormRoute.key)
                }
                break;
            case ReIDConditionTargetSelectImageRoute.key:
                const targets2 = targetDatasImageTemp.filter(_ => _.selected)
                if (targets2.length > 0) {
                    const objectIds2 = await GetObjectIdByImage(targets2)
                    if (objectIds2) {
                        setTargetDatas(targetDatas.concat(targets2.map((_, ind) => ({
                            ..._,
                            selected: false,
                            objectId: objectIds2[ind]
                        }))))
                        return routeJump(ReIDConditionFormRoute.key)
                    }
                }
                break;
            default:
                return routeJump(ReIDConditionFormRoute.key)
        }
    }

    return <>
        <Container>
            <Header noHeader={false}>
                <HeaderSubContainer>
                    {routeInfo.length > 1 && <BackButton onClick={() => {
                        routeJump(ReIDConditionFormRoute.key)
                        setHomeHover(false)
                    }} icon={homeHover ? hoverHomeIcon : homeIcon}
                        onMouseOver={() => {
                            setHomeHover(true)
                        }} onMouseLeave={() => {
                            setHomeHover(false)
                        }} />}
                    <HeaderHistories>
                        {
                            getAllRoutes().slice(1,).map((_, ind, arr) => <Fragment key={ind}>
                                {'>'}
                                <HeaderHistoryItem onClick={() => {
                                    if (ind !== arr.length - 1) routeJump(_)
                                }}>
                                    {getRouteName(_)}{ind === 1 ? ` - ${ReIDObjectTypes.find(__ => __.key === currentObjectType)?.title}` : ''}
                                </HeaderHistoryItem>
                            </Fragment>)
                        }
                    </HeaderHistories>
                </HeaderSubContainer>
                <CompleteButtons>
                    {routeInfo.length === 1 && <CompleteButton hover disabled={isRealTime ? (targets.length === 0 && cctv.length === 0) : (targets.length === 0 && cctv.length === 0 && time.length === 0)} onClick={() => {
                        if (allSelected) {
                            setTargetDatas(targets.map(_ => ({
                                ..._,
                                selected: false
                            })))
                            if (!isRealTime) {
                                setTimeData(time.map(_ => ({
                                    ..._,
                                    selected: false
                                })))
                            }
                            setAreaData(cctv.map(_ => ({
                                ..._,
                                selected: false
                            })))
                        } else {
                            if (isRealTime && targets.length > 1) {
                                message.error({ title: "입력값 에러", msg: "실시간 분석은 하나의 대상만 선택해야 합니다." })
                            } else {
                                setTargetDatas(targets.map(_ => ({
                                    ..._,
                                    selected: true
                                })))
                            }
                            if (!isRealTime) {
                                setTimeData(time.map(_ => ({
                                    ..._,
                                    selected: true
                                })))
                            }
                            setAreaData(cctv.map(_ => ({
                                ..._,
                                selected: true
                            })))
                        }
                    }}>
                        전체 선택{allSelected && ' 해제'}
                    </CompleteButton>}
                    {!(currentObjectType !== ReIDObjectTypes[ObjectTypes['ATTRIBUTION']].key && (routeInfo.length === 2 || routeInfo.length === 3)) && <CompleteButton 
                    concept="activate" 
                    disabled={disableCompleteBtn()} 
                    hover
                    onClick={() => {
                        completeCallback()
                    }} 
                    icon={routeInfo.length === 2 ? reidReqIcon : ''}>
                        {getCompleteButtonTextByRoute()}
                    </CompleteButton>}
                </CompleteButtons>
            </Header>
            {(Object.keys(ConditionRouteInfo) as ConditionRouteType['key'][]).map(_ => <ContentsContainer key={_} index={ConditionRouteInfo[_].pageNum} current={_} routeInfo={routeInfo}>
                {ConditionRouteInfo[_].Component}
            </ContentsContainer>)}
        </Container>
        <TimeModal
            title={`그룹 ${timeIndex === -1 ? (timeData.length && timeData.length + 1) || 1 : (timeIndex + 1)}`}
            defaultValue={time[timeIndex] && {
                startTime: time[timeIndex].time[0],
                endTime: time[timeIndex].time[1]
            }} onChange={data => {
                if (time[timeIndex]) setTimeData(timeData.map((_, ind) => timeIndex === ind ? { time: [data.startTime, data.endTime!], selected: _.selected } : _))
                else addTimeData({ time: [data.startTime, data.endTime!], selected: false })
            }} visible={timeVisible} close={() => {
                setTimeVisible(false)
            }} lowBlur />
        <AreaSelect
            title={`그룹 ${areaIndex === -1 ? ((areaData.length && areaData.length + 1) || 1) : (areaIndex + 1)}`}
            visible={areaVisible}
            defaultSelected={(areaData[areaIndex] && areaData[areaIndex].cctvList) || []}
            complete={data => {
                if (areaIndex === -1) {
                    setAreaData(areaData.concat({
                        cctvList: data,
                        selected: false
                    }))
                } else {
                    setAreaData(areaData.map((_, ind) => ind === areaIndex ? {
                        cctvList: data,
                        selected: _.selected || false
                    } : _))
                }
            }} close={() => {
                setAreaVisible(false)
                setAreaIndex(-1)
            }} lowBlur />
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

const HeaderSubContainer = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px' })}
`

const HeaderHistories = styled.div`
    font-size: 1.2rem;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const HeaderHistoryItem = styled.div`
    font-size: 1rem;
    cursor: pointer;
    &:last-child {
        cursor: default;
        font-size: 1.3rem;
    }
    &:not(:last-child):hover {
        color: ${TextActivateColor};
    }
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
    display: ${({ current, routeInfo }) => routeInfo.at(-1) === current ? 'block' : 'none'};
    z-index: ${({ current, routeInfo, index }) => (routeInfo.at(-1) === current || routeInfo.length >= index) ? 2 : 1};
    padding: 12px 24px 0 24px;
    width: 100%;
    ${globalStyles.slideToLeft({ animationDuration: '.5s' })}
    background-color: ${GlobalBackgroundColor};
    transition: all .5s;
    height: calc(100% - ${HeaderHeight}px);
`

const CompleteButtons = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`