import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles, loadingAIAnalysisColor, loadingVideoDownloadColor } from "../../styles/global-styled"
import React, { Suspense, useEffect, useRef, useState } from "react"
import Button from "../Constants/Button"
import { AdditionalReIdApi, ReidCancelApi, SseStartApi, StartReIdApi } from "../../Constants/ApiRoutes"
import { useRecoilState, useSetRecoilState } from "recoil"
import { AdditionalReIDRequestParamsType, ReIDAllResultData, ReIDRequestParamsType, ReIDResultData, ReIDResultSelectedCondition, ReIDResultSelectedView } from "../../Model/ReIdResultModel"
import ProgressTimeIcon from '../../assets/img/ProgressTimeIcon.png'
import ProgressVideoIcon from '../../assets/img/ProgressVideoIcon.png'
import ProgressLocationIcon from '../../assets/img/ProgressLocationIcon.png'
import ProgressAIIcon from '../../assets/img/ProgressAIIcon.png'
import Progress from "./Progress"
import CollapseArrow from "../Constants/CollapseArrow"
import { Axios, reidCancelFunc } from "../../Functions/NetworkFunctions"
import { convertFullTimeStringToHumanTimeFormat } from "../../Functions/GlobalFunctions"
import CCTVNameById from "../Constants/CCTVNameById"
import { CameraDataType } from "../../Constants/GlobalTypes"
import useMessage from "../../Hooks/useMessage"
import { PROGRESS_STATUS, ProgressData, ProgressDataParamsTimesDataType, ProgressDataType, ProgressRequestParams, ProgressStatus, SSEProgressResponseType, defaultProgressRequestParams } from "../../Model/ProgressModel"
import { CustomEventSource, ReIdMenuKey } from "../../Constants/GlobalConstantsValues"
import { ReIDStartRequestParamsType } from "../../Constants/NetworkTypes"
import { conditionMenu } from "../../Model/ConditionMenuModel"
import { ReIDMenuKeys } from "../ReID/ConstantsValues"
import { menuState } from "../../Model/MenuModel"

type ReIDProgressProps = {
    visible: boolean
}

const REID_START_MSG = 'REID_START'
const REID_COMPLETE_MSG = 'REID_COMPLETE'
const REID_CANCEL_MSG = 'REID_CANCEL'
export const SSE_DESTORY_MSG = 'SSE_DESTROY'

const getAllProgressPercent = (data: ProgressDataType[]) => {
    return data.reduce((pre, cur) => pre + getConditionPercent(cur.times), 0) / data.length
}

const getConditionPercent = (data: ProgressDataType['times']) => {
    return data.reduce((pre, cur) => pre + Number(getTimeGroupPercent(cur)), 0) / data.length
}

const getTimeGroupPercent = (data: ProgressDataParamsTimesDataType) => {
    const cctvIds = Object.keys(data.data)
    return Math.floor(cctvIds.reduce((pre, cur) => (data.data[Number(cur)].aiPercent + data.data[Number(cur)].videoPercent) / 2 + pre, 0) / cctvIds.length)
}

const getSuccessByTimeGroup = (data: ProgressDataParamsTimesDataType['data']) => {
    const cctvIds = Object.keys(data)
    const success = cctvIds.filter(_ => data[Number(_)].aiPercent === 100 && data[Number(_)].videoPercent === 100).length
    return success
}

const getFailByTimeGroup = (data: ProgressDataParamsTimesDataType['data']) => {
    const cctvIds = Object.keys(data)
    const fail = cctvIds.filter(_ => data[Number(_)].aiPercent === -1 || data[Number(_)].videoPercent === -1).length
    return fail
}

let intervalId: NodeJS.Timer

const getLoadingTimeString = (time: number) => {
    const hour = Math.floor(time / 3600)
    const minute = Math.floor(time / 60) % 60
    const second = time % 60
    let str = ""
    if (hour) str += `${hour}시간 `
    if (minute) str += `${minute}분 `
    str += `${second}초 경과`
    return str
}

const CCTVProgressRow = React.memo(({ videoPercent, aiPercent, cctvId }: {
    videoPercent: number | string
    aiPercent: number | string
    cctvId: CameraDataType['cameraId']
}) => {
    
    return <CCTVProgressContainer>
        <CCTVProgressDataContainer>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressLocationIcon} />
            </CCTVProgressDataIconContainer>
            <CCTVProgressDataTitleContainer>
                <Suspense fallback={<></>}>
                    <CCTVNameById cctvId={cctvId} />
                </Suspense>
            </CCTVProgressDataTitleContainer>
        </CCTVProgressDataContainer>
        <CCTVProgressDataContainer>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressVideoIcon} />
            </CCTVProgressDataIconContainer>
            <ProgressWrapper noString percent={videoPercent} color={loadingVideoDownloadColor} />
            <CCTVProgressDataLabelContainer>
                {videoPercent}%
            </CCTVProgressDataLabelContainer>
        </CCTVProgressDataContainer>
        <CCTVProgressDataContainer>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressAIIcon} />
            </CCTVProgressDataIconContainer>
            <ProgressWrapper noString percent={aiPercent} color={loadingAIAnalysisColor} />
            <CCTVProgressDataLabelContainer>
                {aiPercent}%
            </CCTVProgressDataLabelContainer>
        </CCTVProgressDataContainer>
    </CCTVProgressContainer>
}, (prev, next) => {
    if (prev.videoPercent !== next.videoPercent || prev.aiPercent !== next.aiPercent) return false;
    return true;
})
const ConditionGroupContainer = ({ num, progressData, visible }: {
    num: number
    progressData: ProgressDataType
    visible: boolean
}) => {
    const [opened, setOpened] = useState(false)
    const [timeGroupOpened, setTimeGroupOpened] = useState<number[]>([])

    useEffect(() => {
        setOpened(false)
        setTimeGroupOpened([])
    }, [visible])

    return <Contents opened={opened}>
        <ConditionTitle onClick={() => {
            setOpened(!opened)
        }}>
            <ConditionTitleText>
                {progressData.title}
            </ConditionTitleText>
            <ConditionTitleSubContainer>
                <ConditionTitleSubContentOne>
                    <LabelWithValue>
                        진행률
                    </LabelWithValue>
                    <ValueWithLabel>
                        {Math.floor(getConditionPercent(progressData.times))}%
                    </ValueWithLabel>
                </ConditionTitleSubContentOne>
                <ConditionTitleSubContentTwo hover disabled={true}>
                    분석 취소
                </ConditionTitleSubContentTwo>
                <ConditionTitleSubContentThree>
                    <TimeGroupCollapse opened={opened} />
                </ConditionTitleSubContentThree>
            </ConditionTitleSubContainer>
        </ConditionTitle>
        {
            progressData.times.map((__, _ind) => <TimeGroupContainer key={_ind} opened={timeGroupOpened.includes(_ind)} rowNum={Math.ceil(Object.keys(__.data).length / 2)}>
                <TimeGroupHeader onClick={() => {
                    if (timeGroupOpened.includes(_ind)) setTimeGroupOpened(timeGroupOpened.filter(t => t !== _ind))
                    else setTimeGroupOpened(timeGroupOpened.concat(_ind))
                }}>
                    <TimeGroupIcon>
                        <CCTVProgressDataIconContents src={ProgressTimeIcon}/>
                    </TimeGroupIcon>
                    <TimeGroupTitle>
                        {__.time}
                    </TimeGroupTitle>
                    <TimeGroupProgress>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                진행률
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getTimeGroupPercent(__)}%
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                전체
                            </LabelWithValue>
                            <ValueWithLabel>
                                {Object.keys(__.data).length}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                성공
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getSuccessByTimeGroup(__.data)}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                실패
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getFailByTimeGroup(__.data)}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                    </TimeGroupProgress>
                    <TimeGroupCollapse opened={timeGroupOpened.includes(_ind)} style={{
                        flex: '0 0 40px',
                        height: '40px',
                        padding: '8px'
                    }} />
                </TimeGroupHeader>
                <TimeGroupContents>
                    {progressData && Object.keys(__.data).map((___, __ind) => <CCTVProgressRow key={__ind} cctvId={Number(___)} videoPercent={__.data[Number(___)].videoPercent} aiPercent={__.data[Number(___)].aiPercent} />)}
                </TimeGroupContents>
            </TimeGroupContainer>)
        }
    </Contents>
}

export let globalCurrentReIdId = 0

const ReIDProgress = ({ visible }: ReIDProgressProps) => {
    const [currentReIdId, setCurrentReIdId] = useState(0)
    const [loadingTime, setLoadingTime] = useState(0)
    const [progressStatus, setProgressStatus] = useRecoilState(ProgressStatus)
    const setReidResultSelectedView = useSetRecoilState(ReIDResultSelectedView)
    const setMenu = useSetRecoilState(conditionMenu)
    const setGlobalMenu = useSetRecoilState(menuState)
    const [_progressRequestParams, setProgressRequestParams] = useRecoilState(ProgressRequestParams)
    const params = _progressRequestParams.params
    const [progressData, setProgressData] = useRecoilState(ProgressData)
    const [reidResult, setReidResult] = useRecoilState(ReIDAllResultData)
    const [singleReIdResult, setSingleReIdresult] = useRecoilState(ReIDResultData((_progressRequestParams.params as AdditionalReIDRequestParamsType).reidId || null))
    const setSelectedResultCondition = useSetRecoilState(ReIDResultSelectedCondition)
    const [isProgress, setIsProgress] = useState(false)
    const sseRef = useRef<EventSource>()
    const message = useMessage()
    const reidResultRef = useRef(reidResult)
    const singleReidResultRef = useRef(singleReIdResult)
    const currentReIdIdRef = useRef(currentReIdId)
    const progressDataRef = useRef(progressData)
    const reidResultTempRef = useRef(reidResult)
    const additionalReidResultTempRef = useRef(singleReIdResult)
    const progressTimer = useRef<NodeJS.Timer>()
    const reidResultTimer = useRef<NodeJS.Timer>()
    const additinoalReidResultTimer = useRef<NodeJS.Timer>()
    
    useEffect(() => {
        reidResultRef.current = reidResult
    }, [reidResult])

    useEffect(() => {
        singleReidResultRef.current = singleReIdResult
    }, [singleReIdResult])

    useEffect(() => {
        currentReIdIdRef.current = currentReIdId
        globalCurrentReIdId = currentReIdId
    }, [currentReIdId])

    useEffect(() => {
        console.debug('progressStatus 변경 : ', progressStatus)
        if (progressStatus.status === PROGRESS_STATUS['RUNNING']) setIsProgress(true)
        else setIsProgress(false)
    }, [progressStatus])

    useEffect(() => {
        if(isProgress) {
            window.addEventListener('unload', reidCancelFunc, {
                once: true,
            });
        } else {
            window.removeEventListener('unload', reidCancelFunc)
        }
    },[isProgress])

    useEffect(() => {
        if (isProgress) {
            setLoadingTime(0)
            intervalId = setInterval(() => {
                setLoadingTime(time => time + 1)
            }, 1000)
            progressTimer.current = setInterval(() => {
                setProgressData(progressDataRef.current)
            }, 300)
            if (_progressRequestParams.type === 'REID') {
                reidResultTimer.current = setInterval(() => {
                    setReidResult(reidResultTempRef.current)
                }, 300)
            } else if (_progressRequestParams.type === 'ADDITIONALREID') {
                additinoalReidResultTimer.current = setInterval(() => {
                    setSingleReIdresult(additionalReidResultTempRef.current)
                }, 300)
            }
        } else {
            clearInterval(intervalId)
            if (progressTimer.current) {
                setProgressData(progressDataRef.current)
                clearInterval(progressTimer.current)
            }
            if (reidResultTimer.current) {
                setReidResult(reidResultTempRef.current)
                clearInterval(reidResultTimer.current)
            }
            if (additinoalReidResultTimer) {
                setSingleReIdresult(additionalReidResultTempRef.current)
                clearInterval(additinoalReidResultTimer.current)
            }
        }
    }, [isProgress])

    function sseSetting() {
        try {
            sseRef.current = CustomEventSource(SseStartApi);
            sseRef.current.onopen = async (e) => {
                console.debug(`${_progressRequestParams.type} sse setting open : `, _progressRequestParams.params)
                switch (_progressRequestParams.type) {
                    case 'ADDITIONALREID': {
                        const _additionalParams = params as AdditionalReIDRequestParamsType
                        const { title, etc, reidId, objects, timeGroups, rank, cctvIds } = _additionalParams
                        console.debug("params : ", _additionalParams)
                        const res = await Axios('POST', AdditionalReIdApi(_additionalParams.reidId!), {
                            etc,
                            objectIds: objects.map(_ => _.id),
                            timeGroups,
                            cctvIds,
                            title,
                            rank
                        })
                        if (res) {
                            if (singleReidResultRef.current) {
                                additionalReidResultTempRef.current = {
                                    ...singleReidResultRef.current,
                                    data: singleReidResultRef.current.data.concat({
                                        title,
                                        etc,
                                        rank,
                                        resultList: objects.map(__ => ({
                                            objectUrl: __.src,
                                            objectId: __.id,
                                            objectType: __.type,
                                            timeAndCctvGroup: timeGroups.map(___ => ({
                                                startTime: ___.startTime,
                                                endTime: ___.endTime,
                                                results: new Map()
                                                // results: cctvIds.flat().reduce((acc, cur) => ({ ...acc, [cur]: [] }), {})
                                            }))
                                        }))
                                    })
                                }
                            }
                        }
                        break;
                    }
                    case 'REID': {
                        const _params = params as ReIDRequestParamsType[]
                        const res: {
                            reidId: number
                        } = await Axios('POST', StartReIdApi, _params.map(_ => ({
                            etc: _.etc,
                            objectIds: _.objects.map(__ => __.id),
                            timeGroups: _.timeGroups,
                            cctvIds: _.cctvIds,
                            title: _.title,
                            rank: _.rank
                        })) as ReIDStartRequestParamsType)
                        if (res) {
                            reidResultTempRef.current = [...reidResult, {
                                reIdId: res.reidId,
                                data: _params.map(__ => ({
                                    title: __.title,
                                    etc: __.etc,
                                    rank: __.rank,
                                    resultList: __.objects.map(___ => ({
                                        objectUrl: ___.src,
                                        objectId: ___.id,
                                        objectType: ___.type,
                                        timeAndCctvGroup: __.timeGroups.map(____ => ({
                                            startTime: ____.startTime,
                                            endTime: ____.endTime,
                                            results: new Map()
                                            // results: __.cctvIds.flat().reduce((acc, cur) => ({
                                            //     ...acc,
                                            //     [cur]: []
                                            // }), {})
                                        }))
                                    }))
                                }))
                            }]
                            setCurrentReIdId(res.reidId)
                            setGlobalMenu(ReIdMenuKey)
                            setMenu(ReIDMenuKeys['REIDRESULT'])
                        } else {
                            setProgressRequestParams(defaultProgressRequestParams)
                        }
                        break;
                    }
                    case 'REALTIME': return;
                    default: return;
                }
            };
            sseRef.current.onmessage = (res: MessageEvent) => {
                try {
                    const data = JSON.parse(res.data.replace(/\\/gi, '')) as SSEProgressResponseType
                    const { conditionIndex, timeIndex, cctvId, aiPercent, videoPercent, status, reIdId, errorCode } = data
                    const { type } = _progressRequestParams

                    if (aiPercent || videoPercent) {
                        console.debug(`${type} type sse percent message : `, data)
                        progressDataRef.current = progressDataRef.current.map((_, ind) => ind === conditionIndex ? ({
                            times: _.times.map((__, _ind) => _ind === timeIndex ? ({
                                time: __.time,
                                data: {
                                    ...__.data,
                                    [cctvId]: {
                                        aiPercent,
                                        videoPercent
                                    }
                                }
                            }) : __),
                            title: _.title
                        }) : _)
                    } else {
                        console.debug(`${type} type sse data message : `, data)
                    }

                    if (status === REID_COMPLETE_MSG) {
                        console.debug(`${type} complete event : `, data)
                        setProgressStatus({ type: type, status: PROGRESS_STATUS['COMPLETE'] })
                        let callback;
                        switch (type) {
                            case 'REID':
                            case 'ADDITIONALREID': {
                                callback = () => {
                                    console.debug(`${type} complete button click by data : `, data)
                                    setReidResultSelectedView([currentReIdIdRef.current])
                                    if (type === 'REID') setSelectedResultCondition(0)
                                    else setSelectedResultCondition(singleReidResultRef.current?.data.length! - 1)
                                    setGlobalMenu(ReIdMenuKey)
                                    setMenu(ReIDMenuKeys['REIDRESULT'])
                                }
                                break;
                            }
                            default: break;
                        }
                        message.preset('REIDCOMPLETE', '', callback)
                    } else if (status === REID_CANCEL_MSG) {
                        console.debug(`${type} cancel event`)
                        message.preset('REIDCANCEL')
                        sseRef.current?.close()
                        setProgressStatus({ type, status: PROGRESS_STATUS['CANCELD'] })
                    } else if (status === REID_START_MSG) {
                        console.debug(`${type} start event`)
                        message.preset('REIDSTART')
                        setProgressStatus({ type, status: PROGRESS_STATUS['RUNNING'] })
                    } else if (status === SSE_DESTORY_MSG) {
                        console.debug(`${type} sse destroy event`)
                        if (errorCode) {
                            message.preset('REIDERROR', errorCode)
                            setProgressStatus({ type, status: PROGRESS_STATUS['IDLE'] })
                        }
                    }
                    switch (type) {
                        case 'ADDITIONALREID': {
                            const { results, objectId } = data
                            if (results) {
                                setCurrentReIdId(reIdId!)
                                if (singleReidResultRef.current) {
                                    additionalReidResultTempRef.current = {
                                        ...singleReidResultRef.current,
                                        data: singleReidResultRef.current.data.map((__, ind, arr) => ind === (arr.length - 1) ? {
                                            ...__,
                                            resultList: __.resultList.map(___ => ___.objectId === objectId ? {
                                                ...___,
                                                timeAndCctvGroup: ___.timeAndCctvGroup.map((____, _ind) => {
                                                    if(_ind === timeIndex) {
                                                        const temp = ____.results
                                                        temp.set(cctvId, results)
                                                        return {
                                                            ...____,
                                                            results: temp
                                                        }
                                                    } else {
                                                        return ____
                                                    }
                                                })
                                            } : ___)
                                        } : __)
                                    }
                                }
                            }
                            break;
                        }
                        case 'REID': {
                            const { results, reIdId, objectId } = data
                            if (results) {
                                reidResultTempRef.current = reidResultTempRef.current.map(_ => _.reIdId === reIdId ? {
                                    ..._,
                                    data: _.data.map((__, ind) => ind === conditionIndex ? {
                                        ...__,
                                        resultList: __.resultList.map(___ => ___.objectId === objectId ? {
                                            ...___,
                                            timeAndCctvGroup: ___.timeAndCctvGroup.map((____, _ind) => {
                                                if(_ind === timeIndex) {
                                                    const temp = ____.results
                                                    temp.set(cctvId, results)
                                                    return {
                                                        ...____,
                                                        results: temp
                                                        // results: {
                                                        //     ...____.results,
                                                        //     [cctvId]: results
                                                        // }
                                                    }
                                                } else {
                                                    return ____
                                                }
                                            })
                                        } : ___)
                                    } : __)
                                } : _)
                            }
                            break;
                        }
                        default: break;
                    }
                } catch (err) {
                    console.error(err)
                }
            };
            sseRef.current.onerror = async (e: any) => {
                console.debug(`${_progressRequestParams.type} sse object delete`)
                e.target.close();
                clearInterval(intervalId)
            };
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        console.debug('Request Params 변경 : ', _progressRequestParams)
        if (_progressRequestParams.type) {
            let temp: typeof progressData = [];
            if (_progressRequestParams.type === 'REID') {
                const _params = params as ReIDRequestParamsType[]
                if (!_params.every(_ => _.objects.every(__ => __.type === _params[0].objects[0].type))) {
                    setProgressRequestParams(defaultProgressRequestParams)
                    return message.error({ title: "입력값 에러", msg: "서로 다른 타입이 요청되었습니다." })
                }
                temp = _params.map(_ => ({
                    title: _.title,
                    times: _.timeGroups.map(__ => {
                        return {
                            time: convertFullTimeStringToHumanTimeFormat(`${__.startTime}`) + ' ~ ' + convertFullTimeStringToHumanTimeFormat(`${__.endTime}`),
                            data: _.cctvIds.flat().reduce((accumulator, value) => {
                                return {
                                    ...accumulator, [value]: {
                                        aiPercent: 0,
                                        videoPercent: 0
                                    }
                                };
                            }, {})
                        }
                    })
                }))
            } else if (_progressRequestParams.type === 'ADDITIONALREID') {
                const _params = params as AdditionalReIDRequestParamsType
                if (!_params.objects.every(__ => __.type === _params.objects[0].type)) {
                    setProgressRequestParams(defaultProgressRequestParams)
                    return message.error({ title: "입력값 에러", msg: "서로 다른 타입이 요청되었습니다." })
                }
                temp = [
                    {
                        title: _params.title,
                        times: [{
                            time: convertFullTimeStringToHumanTimeFormat(`${_params.timeGroups[0].startTime}`) + ' ~ ' + convertFullTimeStringToHumanTimeFormat(`${_params.timeGroups[0].endTime}`),
                            data: _params.cctvIds.flat().reduce((acc, value) => {
                                return {
                                    ...acc, [value]: {
                                        aiPercent: 0,
                                        videoPercent: 0
                                    }
                                };
                            }, {})
                        }]
                    }]
            }
            progressDataRef.current = temp
            console.debug("Progress Data Init : ", temp)
            setProgressData(temp)
            sseSetting()
        }
    }, [_progressRequestParams])
    
    return <>
        <SmallProgress percent={getAllProgressPercent(progressData)} color="white" noString />
        <ProgressContainer visible={visible} onClick={(e) => {
            e.stopPropagation()
        }}>
            <Arrow />
            <HeaderContainer>
                <Header>
                    <TitleContainer>
                        <Title>
                            진행 현황
                        </Title>
                        <TimeTitle>
                            {getLoadingTimeString(loadingTime)}
                        </TimeTitle>
                    </TitleContainer>
                    <CancelBtn hover onClick={() => {
                        if (progressStatus.status === PROGRESS_STATUS['COMPLETE']) {
                            const targetResult = reidResult.find(_ => _.reIdId === currentReIdId)
                            if (targetResult) {
                                setReidResultSelectedView([reidResult[reidResult.length - 1].reIdId])
                                if (_progressRequestParams.type === 'ADDITIONALREID') setSelectedResultCondition(targetResult.data.length - 1)
                                setGlobalMenu(ReIdMenuKey)
                                setMenu(ReIDMenuKeys['REIDRESULT'])

                            } else {
                                message.error({
                                    title: "입력값 에러",
                                    msg: "결과가 존재하지 않습니다.\n분석 로그를 확인해주세요."
                                })
                            }
                        } else {
                            navigator.sendBeacon(
                                ReidCancelApi,
                                localStorage.getItem("Authorization")
                            );
                        }
                    }} disabled={[PROGRESS_STATUS['IDLE'], PROGRESS_STATUS['CANCELD']].includes(progressStatus.status)}>
                        {progressStatus.status === PROGRESS_STATUS['COMPLETE'] ? '결과 보기' : '전체 분석 취소'}
                    </CancelBtn>
                </Header>
                <Progress percent={getAllProgressPercent(progressData) || 0} color={ContentsActivateColor} />
            </HeaderContainer>
            <ContentsWrapper>
                {progressData.map((_, ind) => <ConditionGroupContainer key={ind} num={ind} progressData={_} visible={visible} />)}
            </ContentsWrapper>
        </ProgressContainer>
    </>
}

export default ReIDProgress

const progressContainerBackgroundColor = SectionBackgroundColor
const rowHeight = 72
const headerHeight = 54

const ProgressContainer = styled.div<{ visible: boolean }>`
    position: absolute;
    cursor: default;
    top: calc(100% + 14px);
    width: 600px;
    height: 800px;
    max-height: 800px;
    right: -23px;
    padding: 8px 12px;
    background-color: ${progressContainerBackgroundColor};
    ${globalStyles.zoomIn()}
    z-index: 9998;
    display: ${({ visible }) => visible ? 'block' : 'none'}
`

const Arrow = styled.div`
    width: 0;
    height: 0;
    border-bottom: 10px solid ${progressContainerBackgroundColor};
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    top: -10px;
    left: 91%;
`

const HeaderContainer = styled.div`
    height: ${headerHeight}px;
    padding-bottom: 8px;
`

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    margin-bottom: 4px;
`

const TitleContainer = styled.div`
    flex: 0 0 200px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
`

const Title = styled.div`
    font-size: 1.3rem;
`

const TimeTitle = styled.div`
    color: rgba(255,255,255,.5);
`

const CancelBtn = styled(Button)`
    flex: 0 0 120px;
`

const ContentsWrapper = styled.div`
    overflow: auto;
    height: auto;
    transition: height .1s ease;
    max-height: calc(100% - ${headerHeight}px);
    width: 100%;
`

const ConditionTitle = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 36px;
    width: 100%;
    cursor: pointer;
    margin-bottom: 12px;
`

const ConditionTitleText = styled.div`
    font-weight: bold;
    font-size: 1.2rem;
    flex: 1;
    padding-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const ConditionTitleSubContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'space-around' })}
    flex: 0 0 220px;
    padding: 0 0 0 16px;
    border-left: 1px solid ${ContentsBorderColor};
    height: 100%;
`

const ConditionTitleSubContentOne = styled.div`
    flex: 1;
    height: 100%;    
`

const LabelWithValue = styled.div`
    font-size: .8rem;
    text-align: center;
`
const ValueWithLabel = styled.div`
    font-size: 1.3rem;
    text-align: center;
    font-weight: bold;
`

const ConditionTitleSubContentTwo = styled(Button)`
    flex: 1;
`

const ConditionTitleSubContentThree = styled.div`
    height: 100%;
    flex: 0 0 36px;
`

const Contents = styled.div<{ opened: boolean }>`
    width: 100%;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    padding: 12px;
    max-height: 100%;
    height: ${({ opened }) => opened ? 'auto' : '60px'};
    overflow-y: auto;
    transition: height .1s ease;
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '6px' })}
`

const CCTVProgressContainer = styled.div`
    flex: 0 0 49%;
    max-width: 49%;
    height: ${rowHeight}px;
    ${globalStyles.flex({ gap : '4px'})}
`

const CCTVProgressDataContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '4px' })}
`

const CCTVProgressDataIconContainer = styled.div`
    flex: 0 0 16px;
    height: 16px;
`

const CCTVProgressDataIconContents = styled.img`
    width: 100%;
    height: 100%;
`

const CCTVProgressDataTitleContainer = styled.div`
    font-size: 1.1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 0 0 calc(90% - 16px)%;
`

const CCTVProgressDataLabelContainer = styled.div`
    flex: 0 0 36px;
`

const ProgressWrapper = styled(Progress)`
    flex: 1;
    height: 35%;
`

const TimeGroupContainer = styled.div<{ opened: boolean, rowNum: number }>`
    background-color: ${GlobalBackgroundColor};
    border-radius: 8px;
    width: 100%;
    height: ${({ opened, rowNum }) => opened ? (60 + (rowNum * rowHeight)) : 60}px;
    overflow-y: ${({ opened }) => opened ? 'auto' : 'hidden'};
    transition: height .3s ease-out;
`

const TimeGroupHeader = styled.div`
    cursor: pointer;
    height: 60px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
    padding: 0 6px;
`

const TimeGroupIcon = styled.div`
    flex: 0 0 18px;
    height: 18px;
`

const TimeGroupTitle = styled.div`
    letter-spacing: -0.5px;
    font-size: 1rem;
    font-weight: bold;
    flex: 1;
`

const TimeGroupCollapse = styled(CollapseArrow)`
    height: 100%;
    cursor: pointer;
`

const TimeGroupProgress = styled.div`
    flex: 0 0 160px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '12px' })}
`

const TimeGroupProgressItem = styled.div`
    flex: 1;
`

const TimeGroupContents = styled.div`
    width: 100%;
    max-height: calc(100% - 28px);
    overflow-y: auto;
    padding: 0 6px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '1%', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`

const SmallProgress = styled(Progress)`
    height: 1.5px;
    width: 100%;
`