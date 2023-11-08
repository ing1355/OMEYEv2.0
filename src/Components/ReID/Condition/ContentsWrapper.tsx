import styled from "styled-components"
import { GlobalBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import useConditionRoutes from "./Hooks/useConditionRoutes"
import Button from "../../Constants/Button"
import { ConditionRouteInfo, ConditionRouteType, ReIDConditionFormRoute, ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "./Constants/RouteInfo"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { conditionRoute } from "../../../Model/ConditionRouteModel"
import { addConditionSingleTimeData, conditionAreaDatas, conditionData, conditionTargetDatas, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp, conditionTargetDatasListByObjectType, conditionTimeDatas, selectedConditionObjectType } from "../../../Model/ConditionDataModel"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { ObjectTypes, ReIDMenuKeys, ReIDObjectTypes } from "../ConstantsValues"
import backIcon from '../../../assets/img/backIcon.png'
import reidReqIcon from '../../../assets/img/reidReqIcon.png'
import { descriptionData } from "../../../Model/DescriptionDataModel"
import { hasValuePersonDescription } from "./TargetSelect/PersonDescription/Functions"
import { GetObjectIdByImage } from "../../../Functions/NetworkFunctions"
import { ArrayDeduplication, DivToImg } from "../../../Functions/GlobalFunctions"
import TimeModal from "./Constants/TimeModal"
import { AreaSelectIndex, AreaSelectVisible, TimeSelectIndex, TimeSelectVisible } from "../../../Model/ConditionParamsModalModel"
import { Fragment, useEffect, useLayoutEffect, useState } from "react"
import { realTimeStatus } from "../../../Model/RealTimeDataModel"
import { PROGRESS_STATUS, ProgressRequestParams, ProgressStatus } from "../../../Model/ProgressModel"
import AreaSelect from "./Constants/AreaSelect"
import useMessage from "../../../Hooks/useMessage"
import { PersonDescriptionResultImageID } from "./Constants/ConstantsValues"
import { getLastTargetListId } from "./Constants/ImageViewWithCanvas"
import { ReIDObjectTypeKeys } from "../../../Constants/GlobalTypes"
import ForLog from "../../Constants/ForLog"

let listId = 0

const ContentsWrapper = () => {
    const [saveDisabled, setSaveDisabled] = useState(false)
    const routeInfo = useRecoilValue(conditionRoute)
    const progressStatus = useRecoilValue(ProgressStatus)
    const personDescriptionData = useRecoilValue(descriptionData)
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const _conditionData = useRecoilValue(conditionData)
    const [targetDatas, setTargetDatas] = useRecoilState(conditionTargetDatas(currentObjectType))
    const targetDatasCCTVTemp = useRecoilValue(conditionTargetDatasCCTVTemp)
    const targetDatasImageTemp = useRecoilValue(conditionTargetDatasImageTemp)
    const setCurrentMenu = useSetRecoilState(conditionMenu)
    const [timeIndex, setTimeIndex] = useRecoilState(TimeSelectIndex)
    const [timeData, setTimeData] = useRecoilState(conditionTimeDatas)
    const [timeVisible, setTimeVisible] = useRecoilState(TimeSelectVisible)
    const [conditionList, setConditionList] = useRecoilState(conditionTargetDatasListByObjectType(currentObjectType!))
    const [areaVisible, setAreaVisible] = useRecoilState(AreaSelectVisible)
    const [areaIndex, setAreaIndex] = useRecoilState(AreaSelectIndex)
    const [areaData, setAreaData] = useRecoilState(conditionAreaDatas)
    const addTimeData = useSetRecoilState(addConditionSingleTimeData)
    const [rtStatus, setRtStatus] = useRecoilState(realTimeStatus)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    const { routePop, routeJump, routePush, getAllRoutes, getRouteName } = useConditionRoutes()
    const { targets, rank, time, name, cctv, isRealTime, etc } = _conditionData
    const message = useMessage()

    useEffect(() => {
        setSaveDisabled(false)
    }, [_conditionData])

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
                if(targets.length === 0 || cctv.length === 0 || (isRealTime ? false : time.length === 0) || progressStatus.status === PROGRESS_STATUS['RUNNING']) return true
                return false;
                // if (isRealTime) {
                //     return !(targets.filter(_ => _.selected).length > 0 && cctv.filter(_ => _.selected).length > 0) || rtStatus === PROGRESS_STATUS['RUNNING']
                // } else {
                //     return !(targets.filter(_ => _.selected).length > 0 && (time.filter(_ => _.selected).length > 0 || isRealTime) && cctv.filter(_ => _.selected).length > 0 && name && rank) || progressStatus.status === 'RUNNING'
                // }
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
            case ReIDConditionFormRoute.key:
                if(isRealTime) {
                    if(rtStatus === PROGRESS_STATUS['RUNNING']) return message.error({ title: '입력값 에러', msg: '이미 실시간 분석을 사용 중입니다.' })
                    if(currentObjectType === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) return message.error({ title: '입력값 에러', msg: '인상착의로는 실시간 분석을 사용할 수 없습니다.' })
                }
                if (isRealTime) {
                    if (ArrayDeduplication(cctv.filter(_ => _.selected).flatMap(_ => _.cctvList)).length === 0) {
                        return message.error({ title: '입력값 에러', msg: 'cctv 목록이 선택되지 않았습니다.' })
                    }
                    if (targets.filter(_ => _.selected).length === 0) {
                        return message.error({ title: '입력값 에러', msg: '대상이 선택되지 않았습니다.' })
                    }
                    if (targets.filter(_ => _.selected).length > 1) {
                        return message.error({ title: '입력값 에러', msg: '여러 대상이 선택되었습니다.\n한 대상만 선택해주세요.' })
                    }
                    if (targets.filter(_ => _.selected).find(_ => _.type === 'ATTRIBUTION')) {
                        return message.error({ title: '입력값 에러', msg: '인상착의 대상은 실시간 분석을 사용할 수 없습니다.' })
                    }
                    setRtStatus(PROGRESS_STATUS['RUNNING'])
                    setCurrentMenu(ReIDMenuKeys['REALTIMEREID'])
                } else {
                    if(targets.filter(_ => _.selected).length === 0) return message.error({title: "입력값 에러", msg:"대상을 1개 이상 선택해주세요."})
                    if(time.filter(_ => _.selected).length === 0) return message.error({title: "입력값 에러", msg:"시간을 1개 이상 선택해주세요."})
                    if(cctv.filter(_ => _.selected).length === 0) return message.error({title: "입력값 에러", msg:"CCTV를 1개 이상 선택해주세요."})
                    setProgressRequestParams({
                        type: 'REID',
                        params: [
                            {
                                title: name || ReIDObjectTypes.find(_ => _.key === currentObjectType)?.title + " 검색",
                                timeGroups: time.filter(_ => _.selected).map(_ => ({
                                    startTime: _.time[0],
                                    endTime: _.time[1]
                                })),
                                cctvIds: cctv.filter(_ => _.selected).map(_ => _.cctvList),
                                rank,
                                etc,
                                objects: targets.filter(_ => _.selected).map(_ => ({
                                    id: _.objectId!,
                                    src: _.src,
                                    type: _.type
                                }))
                            }
                        ]
                    })
                }
                break;
            case ReIDConditionTargetSelectPersonDescriptionRoute.key:
                const target = document.getElementById(PersonDescriptionResultImageID) as HTMLDivElement
                if(!target) return message.error({title: "입력값 에러", msg:"인상착의 이미지를 설정하지 않았습니다."})
                const image = await DivToImg(target)
                const objectIds4 = (await GetObjectIdByImage([{
                    type: 'ATTRIBUTION',
                    image,
                    attribution: personDescriptionData
                }]))
                setTargetDatas(targetDatas.concat({
                    id: getLastTargetListId(),
                    type: 'ATTRIBUTION',
                    src: image,
                    selected: false,
                    objectId: objectIds4[0],
                    method: 'Description',
                    description: personDescriptionData
                }))
                return routeJump(ReIDConditionFormRoute.key)
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
            default:
                return routeJump(ReIDConditionFormRoute.key)
        }
    }

    return <>
        <Container>
            <Header noHeader={routeInfo.length < 2}>
                <HeaderSubContainer>
                    <BackButton onClick={() => {
                        routePop()
                    }} icon={backIcon} />
                    <HeaderHistories>
                        {
                            getAllRoutes().map((_, ind, arr) => <Fragment key={ind}>
                                {ind !== 0 ? '/' : ''}
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
                    {routeInfo.length === 2 && <CompleteButton disabled={disableCompleteBtn() || isRealTime || saveDisabled || conditionList.some(_ => JSON.stringify({..._}) === JSON.stringify({..._conditionData, selected: _.selected, id: _.id}))} onClick={() => {
                        setSaveDisabled(true)
                        let tempConditionData = { ..._conditionData }
                        tempConditionData.cctv = tempConditionData.cctv.filter(_ => _.selected)
                        tempConditionData.targets = tempConditionData.targets.filter(_ => _.selected)
                        tempConditionData.time = tempConditionData.time.filter(_ => _.selected)
                        setConditionList(conditionList.concat({ ...tempConditionData, selected: false, id: listId++ }))
                        message.success({
                            title: "저장 성공",
                            msg: '조건 저장에 성공하였습니다.\n저장하신 조건들은 좌측 "조건 목록" 메뉴에서 확인할 수 있습니다.'
                        })
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
        <TimeModal title={`시간 ${timeIndex === -1 ? (timeData.length && timeData.length + 1) || 1 : (timeIndex + 1)}`} defaultValue={time[timeIndex] && {
            startTime: time[timeIndex].time[0],
            endTime: time[timeIndex].time[1]
        }} onChange={data => {
            if (time[timeIndex]) setTimeData(timeData.map((_, ind) => timeIndex === ind ? { time: [data.startTime, data.endTime!], selected: _.selected } : _))
            else addTimeData({ time: [data.startTime, data.endTime!], selected: false })
        }} visible={timeVisible} close={() => {
            setTimeVisible(false)
        }} />
        <AreaSelect
            title={`CCTV${areaIndex === -1 ? ((areaData.length && areaData.length + 1) || 1) : (areaIndex + 1)}`}
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
            }} />
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
        text-decoration: underline;
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
    left: ${({ current, routeInfo }) => routeInfo.includes(current) ? '0%' : '100%'};
    visibility: ${({ current, routeInfo }) => routeInfo.at(-1) === current ? 'visible' : 'hidden'};
    z-index: ${({ current, routeInfo, index }) => (routeInfo.at(-1) === current || routeInfo.length >= index) ? 2 : 1};
    padding: 12px 24px 0 24px;
    width: 100%;
    background-color: ${GlobalBackgroundColor};
    transition: all .5s;
    height: calc(100% - ${HeaderHeight}px);
`

const CompleteButtons = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`