import styled from "styled-components"
import { ProgressErrorColor, ContentsActivateColor, ModalBoxShadow, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import Button from "../../../Constants/Button"
import { AdditionalReIdApi, ReidCancelApi, RequestManagementStartApi, SseStartApi } from "../../../../Constants/ApiRoutes"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { AdditionalReIDRequestParamsType, ReIDAllResultData, ReIDRequestParamsType, ReIDRequestServerParamsType, ReIDResultData, ReIDResultSelectedCondition, ReIDResultSelectedView, globalCurrentReidId } from "../../../../Model/ReIdResultModel"
import { Axios, ManagementCancelFunc, ReIDStartApi, RequestToManagementServer } from "../../../../Functions/NetworkFunctions"
import Progress from "../../Progress"
import { convertFullTimeStringToHumanTimeFormat, getLoadingTimeString } from "../../../../Functions/GlobalFunctions"
import useMessage from "../../../../Hooks/useMessage"
import { PROGRESS_STATUS, ProgressData, ProgressDataParamsTimesDataType, ProgressDataPercentType, ProgressDataType, ProgressRequestParams, ProgressRequestType, ProgressStatus, ProgressrequestParamsDataType, ReIdRequestFlag, SSEProgressResponseType, SSEResponseMsgTypeKeys, SSEResponseMsgTypes, SSEResponseSingleProgressErrorMsg, defaultProgressRequestParams } from "../../../../Model/ProgressModel"
import { CustomEventSource, IS_PRODUCTION, ReIdMenuKey } from "../../../../Constants/GlobalConstantsValues"
import { conditionMenu } from "../../../../Model/ConditionMenuModel"
import { ReIDMenuKeys } from "../../../ReID/ConstantsValues"
import { menuState } from "../../../../Model/MenuModel"
import useServerConnection from "../../../../Hooks/useServerConnection"
import VisibleToggleContainer from "../../../Constants/VisibleToggleContainer"
import { ConditionGroupContainer } from "./ProgressInner"
import ProgressActivateIcon from '../../../../assets/img/ProgressActivateIcon.png'
import ProgressIcon from '../../../../assets/img/ProgressIcon.png'
import { GlobalEvents } from "../../../../Model/GlobalEventsModel"
import { currentManagementId } from "../../../../Model/ServerManagementModel"

type ReIDProgressProps = {

}

export const getAllProgressPercent = (data: ProgressDataType[]) => {
    return Math.floor(data.reduce((pre, cur) => pre + getConditionPercent(cur.times), 0) / data.length)
}

export const getConditionPercent = (data: ProgressDataType['times']) => {
    return Math.floor(data.reduce((pre, cur) => pre + Number(getTimeGroupPercent(cur)), 0) / data.length)
}

export const getTimeGroupPercent = (data: ProgressDataParamsTimesDataType) => {
    const cctvIds = Object.keys(data.data)
    return Math.floor(cctvIds.reduce((pre, cur) => (data.data[Number(cur)].aiPercent! + data.data[Number(cur)].videoPercent) / 2 + pre, 0) / cctvIds.length)
}

let intervalId: NodeJS.Timer

const ReIDProgress = ({ }: ReIDProgressProps) => {
    const [loadingTime, setLoadingTime] = useState(0)
    const [reIDProgressVisible, setReIDProgressVisible] = useState(false)
    const [isProgress, setIsProgress] = useState(false)
    const [progressStatus, setProgressStatus] = useRecoilState(ProgressStatus)
    const [_progressRequestParams, setProgressRequestParams] = useRecoilState(ProgressRequestParams)
    const [progressData, setProgressData] = useRecoilState(ProgressData)
    const [globalCurrentReIdId, setGlobalCurrentReIdId] = useRecoilState(globalCurrentReidId)
    const [reidResult, setReidResult] = useRecoilState(ReIDAllResultData)
    const [singleReIdResult, setSingleReIdresult] = useRecoilState(ReIDResultData((_progressRequestParams.params as AdditionalReIDRequestParamsType).reIdId || null))
    const [requestFlag, setRequestFlag] = useRecoilState(ReIdRequestFlag)
    const [globalEvents, setGlobalEvents] = useRecoilState(GlobalEvents)
    const managementId = useRecoilValue(currentManagementId)
    const setReidResultSelectedView = useSetRecoilState(ReIDResultSelectedView)
    const setMenu = useSetRecoilState(conditionMenu)
    const setGlobalMenu = useSetRecoilState(menuState)
    const setSelectedResultCondition = useSetRecoilState(ReIDResultSelectedCondition)
    const cMenu = useRecoilValue(conditionMenu)
    const currentMenu = useRecoilValue(menuState)
    const sseRef = useRef<EventSource>()
    const message = useMessage()
    const reidResultRef = useRef(reidResult)
    const singleReidResultRef = useRef(singleReIdResult)
    const currentReIdIdRef = useRef(globalCurrentReIdId)
    const progressDataRef = useRef(progressData)
    const reidResultTempRef = useRef(reidResult)
    const additionalReidResultTempRef = useRef(singleReIdResult)
    const progressTimer = useRef<NodeJS.Timer>()
    const reidResultTimer = useRef<NodeJS.Timer>()
    const additinoalReidResultTimer = useRef<NodeJS.Timer>()
    const healthCheckTimer = useRef<NodeJS.Timer>()
    const managementIdRef = useRef(managementId)
    const params = _progressRequestParams.params
    const { healthCheckClear, healthCheckTimerRegister } = useServerConnection()

    const healthCheckClearCallback = (type: ProgressRequestType) => {
        setProgressStatus({ type, status: PROGRESS_STATUS['IDLE'] })
    }

    const healthCheckRegisterCallback = (type: ProgressRequestType) => {
        healthCheckTimerRegister(() => {
            healthCheckClearCallback(type)
        })
    }

    const cancelFunc = useCallback(() => {
        ManagementCancelFunc('REID', managementIdRef.current)
    }, [])

    useLayoutEffect(() => {
        managementIdRef.current = managementId
    }, [managementId])

    useLayoutEffect(() => {
        setReIDProgressVisible(false)
    }, [currentMenu, cMenu])

    useEffect(() => {
        if (!IS_PRODUCTION) setProgressData([
            {
                "times": [
                    {
                        "time": "2023-11-21 00:00:00 ~ 2023-11-21 00:05:00",
                        "data": {
                            "5925": {
                                "aiPercent": 20,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5926": {
                                "aiPercent": 20,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5927": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5928": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5929": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5930": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5931": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5932": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5933": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5934": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5935": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5936": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5937": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5938": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5939": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5940": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5941": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5942": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5943": {
                                "aiPercent": 0,
                                "videoPercent": 100,
                                "status": "RUNNING"
                            },
                            "5944": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5945": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6293": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "FAIL",
                                "errReason": "LOCAL_DOWNLOAD_FAIL"
                            },
                            "6419": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6420": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6421": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6422": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6423": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6424": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6425": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6426": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6427": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            }
                        }
                    },
                    {
                        "time": "2023-11-21 00:05:00 ~ 2023-11-21 00:15:00",
                        "data": {
                            "5925": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5926": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5927": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5928": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5929": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5930": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5931": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5932": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5933": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5934": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5935": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5936": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5937": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5938": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5939": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5940": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5941": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5942": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5943": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5944": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5945": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6293": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6419": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6420": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6421": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6422": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6423": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6424": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6425": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6426": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6427": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            }
                        }
                    },
                    {
                        "time": "2023-11-21 00:15:00 ~ 2023-11-21 00:20:00",
                        "data": {
                            "5925": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5926": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5927": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5928": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5929": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5930": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5931": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5932": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5933": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5934": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5935": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5936": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5937": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5938": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5939": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5940": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5941": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5942": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5943": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5944": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "5945": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6293": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6419": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6420": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6421": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6422": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6423": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6424": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6425": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6426": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            },
                            "6427": {
                                "aiPercent": 0,
                                "videoPercent": 0,
                                "status": "WAIT"
                            }
                        }
                    }
                ],
                "title": "사람(전신) 검색"
            }
        ])
        return () => {
            if(sseRef.current) {
                sseRef.current.close()
            }
        }
    }, [])


    useEffect(() => {
        reidResultRef.current = reidResult
        reidResultTempRef.current = reidResult
    }, [reidResult])

    useEffect(() => {
        singleReidResultRef.current = singleReIdResult
    }, [singleReIdResult])

    useEffect(() => {
        currentReIdIdRef.current = globalCurrentReIdId
    }, [globalCurrentReIdId])

    useEffect(() => {
        console.debug('progressStatus 변경 : ', progressStatus)
        if (progressStatus.status === PROGRESS_STATUS['RUNNING']) {
            setIsProgress(true)
        }
        else {
            setIsProgress(false)
        }
    }, [progressStatus])
    
    useEffect(() => {
        const intervalTime = 500
        if (isProgress) {
            window.addEventListener('beforeunload', cancelFunc);
            setLoadingTime(0)
            intervalId = setInterval(() => {
                setLoadingTime(time => time + 1)
            }, 1000)
            progressTimer.current = setInterval(() => {
                setProgressData(progressDataRef.current)
            }, intervalTime)
            if (_progressRequestParams.type === 'REID') {
                reidResultTimer.current = setInterval(() => {
                    setReidResult(reidResultTempRef.current)
                }, intervalTime)
            } else if (_progressRequestParams.type === 'ADDITIONALREID') {
                additinoalReidResultTimer.current = setInterval(() => {
                    setSingleReIdresult(additionalReidResultTempRef.current)
                }, intervalTime)
            }
        } else {
            clearTimeout(healthCheckTimer.current)
            window.removeEventListener('beforeunload', cancelFunc)
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
        return () => {
            if (progressTimer.current) {
                clearInterval(progressTimer.current)
            }
            if (reidResultTimer.current) {
                clearInterval(reidResultTimer.current)
            }
            if (additinoalReidResultTimer) {
                clearInterval(additinoalReidResultTimer.current)
            }
        }
    }, [isProgress])

    async function sseSetting() {
        try {
            sseRef.current = await CustomEventSource(SseStartApi);
            sseRef.current.onopen = async (e) => {
                console.debug(`${_progressRequestParams.type} sse setting open : `, _progressRequestParams.params)
                const res = await Axios('POST', RequestManagementStartApi, globalEvents.data)
                if (res && res.storageExceeded) {
                    message.warning({ title: "스토리지 사용량 경고", msg: "서버 스토리지가 한계치에 임박하였습니다.\n관리자에게 문의하세요." })
                }
                setGlobalEvents({
                    key: 'Refresh'
                })
                switch (_progressRequestParams.type) {
                    case 'ADDITIONALREID': {
                        const _additionalParams = params as AdditionalReIDRequestParamsType
                        const { title, etc, reIdId, objects, timeGroups, rank, cctvIds } = _additionalParams
                        console.debug("params : ", _additionalParams)
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
                        if (res) {
                            reidResultTempRef.current = [...reidResult, {
                                reIdId: res.reIdId,
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
                                        }))
                                    }))
                                }))
                            }]
                        } else {
                            // setProgressRequestParams(defaultProgressRequestParams)
                        }
                        break;
                    }
                    default: return;
                }
            };
            sseRef.current.onmessage = (res: MessageEvent) => {
                try {
                    const { type } = _progressRequestParams
                    const data = JSON.parse(res.data.replace(/\\/gi, '')) as SSEProgressResponseType
                    const { conditionIndex, timeIndex, cctvId, aiPercent, videoPercent, status, reIdId, errorCode } = data
                    if (aiPercent || videoPercent) {
                        console.debug(`${type} type sse percent message : `, data)
                        progressDataRef.current = progressDataRef.current.map((_, ind) => ind === conditionIndex ? ({
                            times: _.times.map((__, _ind) => _ind === timeIndex ? ({
                                time: __.time,
                                data: {
                                    ...__.data,
                                    [cctvId]: {
                                        aiPercent,
                                        videoPercent,
                                        status: __.data[cctvId].status === 'WAIT' ? 'RUNNING' : ((aiPercent === 100 && videoPercent === 100) ? 'SUCCESS' : __.data[cctvId].status)
                                    }
                                }
                            }) : __),
                            title: _.title
                        }) : _)
                    } else {
                        console.debug(`${type} type sse data message : `, data)
                        if (SSEResponseSingleProgressErrorMsg.includes(status)) {
                            console.debug(`${type} sse fail event`)
                            progressDataRef.current = progressDataRef.current.map((_, ind) => ind === conditionIndex ? ({
                                times: _.times.map((__, _ind) => _ind === timeIndex ? ({
                                    time: __.time,
                                    data: {
                                        ...__.data,
                                        [cctvId]: {
                                            ...__.data[cctvId],
                                            status: 'FAIL',
                                            errReason: status
                                        }
                                    }
                                }) : __),
                                title: _.title
                            }) : _)
                        }
                    }

                    if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SSE_CONNECTION']]) {
                        healthCheckRegisterCallback(type)
                    } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['REID_COMPLETE']]) {
                        setProgressStatus({ type: type, status: PROGRESS_STATUS['COMPLETE'] })
                        let callback;
                        switch (type) {
                            case 'REID':
                            case 'ADDITIONALREID': {
                                callback = () => {
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
                    } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['REID_CANCEL']]) {
                        console.debug(`${type} cancel event`)
                        message.preset('REIDCANCEL')
                        setGlobalEvents({
                            key: 'Cancel'
                        })
                        setProgressStatus({ type, status: PROGRESS_STATUS['CANCELD'] })
                    } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['REID_START']]) {
                        console.debug(`${type} start event`)
                        message.preset('REIDSTART')
                        if (reIdId) {
                            setReidResultSelectedView([reIdId])
                            setGlobalCurrentReIdId(reIdId)
                            setSelectedResultCondition(0)
                        } else if (type === 'ADDITIONALREID') {
                            const _additionalParams = params as AdditionalReIDRequestParamsType
                            setReidResultSelectedView([_additionalParams.reIdId!])
                            setGlobalCurrentReIdId(_additionalParams.reIdId!)
                            setSelectedResultCondition(singleReidResultRef.current?.data.length!)
                        }
                        setGlobalMenu(ReIdMenuKey)
                        setMenu(ReIDMenuKeys['REIDRESULT'])
                        setProgressStatus({ type, status: PROGRESS_STATUS['RUNNING'] })
                    } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SSE_DESTROY']]) {
                        console.debug(`${type} sse destroy event`)
                        if (errorCode) {
                            message.preset('REIDERROR', errorCode)
                            setProgressStatus({ type, status: PROGRESS_STATUS['IDLE'] })
                        }
                        healthCheckClear()
                        sseRef.current?.close()
                        sseRef.current = undefined
                    } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SERVER_ALIVE']]) {
                        healthCheckRegisterCallback(type)
                    }

                    switch (type) {
                        case 'ADDITIONALREID': {
                            const { results, objectId } = data
                            if (results) {
                                if (singleReidResultRef.current) {
                                    additionalReidResultTempRef.current = {
                                        ...singleReidResultRef.current,
                                        data: singleReidResultRef.current.data.map((__, ind, arr) => ind === (arr.length - 1) ? {
                                            ...__,
                                            resultList: __.resultList.map(___ => ___.objectId === objectId ? {
                                                ...___,
                                                timeAndCctvGroup: ___.timeAndCctvGroup.map((____, _ind) => {
                                                    if (_ind === timeIndex) {
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
                                                if (_ind === timeIndex) {
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
                clearInterval(intervalId)
                e.target.close();
                sseRef.current = undefined
            };
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        console.debug('Request Params 변경 : ', _progressRequestParams, requestFlag)
        if (requestFlag) {
            let paramTemp: ReIDRequestServerParamsType[]
            if (_progressRequestParams.type === 'REID') {
                paramTemp = (params as ReIDRequestParamsType[]).map(_ => ({
                    etc: _.etc,
                    objectIds: _.objects.map(__ => __.id),
                    timeGroups: _.timeGroups,
                    cctvIds: _.cctvIds,
                    title: _.title,
                    rank: _.rank
                }))
            } else {
                const _additionalParams = params as AdditionalReIDRequestParamsType
                const { title, etc, reIdId, objects, timeGroups, rank, cctvIds } = _additionalParams
                paramTemp = [{
                    etc,
                    objectIds: objects.map(_ => _.id),
                    timeGroups,
                    cctvIds,
                    title,
                    rank,
                    originalReId: reIdId
                }]
            }
            RequestToManagementServer('REID', paramTemp, (res) => {
                setGlobalEvents({
                    key: 'StackManagementServer',
                    data: res,
                    params: paramTemp
                })
            })
            setRequestFlag(false)
        }
    }, [_progressRequestParams, requestFlag])

    useEffect(() => {
        if (globalEvents.key === 'ReIDStart' && globalEvents.data && globalEvents.params) {
            console.debug("ReID Start Event Params : ", globalEvents)
            const paramTemp = globalEvents.params as ReIDRequestServerParamsType[]
            let temp: ProgressDataType[] = [];
            if (paramTemp[0].originalReId) {
                const _params = params as AdditionalReIDRequestParamsType
                temp = [
                    {
                        title: _params.title,
                        times: [{
                            time: convertFullTimeStringToHumanTimeFormat(`${_params.timeGroups[0].startTime}`) + ' ~ ' + convertFullTimeStringToHumanTimeFormat(`${_params.timeGroups[0].endTime}`),
                            data: _params.cctvIds.flat().reduce((acc, value) => {
                                return {
                                    ...acc, [value]: {
                                        aiPercent: 0,
                                        videoPercent: 0,
                                        status: 'WAIT'
                                    } as ProgressDataPercentType
                                };
                            }, {})
                        }]
                    }]
            } else {
                const _params = params as ReIDRequestParamsType[]
                temp = _params.map(_ => ({
                    title: _.title,
                    times: _.timeGroups.map(__ => {
                        return {
                            time: convertFullTimeStringToHumanTimeFormat(`${__.startTime}`) + ' ~ ' + convertFullTimeStringToHumanTimeFormat(`${__.endTime}`),
                            data: _.cctvIds.flat().reduce((accumulator, value) => {
                                return {
                                    ...accumulator, [value]: {
                                        aiPercent: 0,
                                        videoPercent: 0,
                                        status: 'WAIT'
                                    } as ProgressDataPercentType
                                };
                            }, {})
                        }
                    })
                }))
            }
            progressDataRef.current = temp
            console.debug("Progress Data Init : ", temp)
            // setProgressData(temp)
            sseSetting()
        }
    }, [globalEvents])

    return <>
        <ProgressBtn visible={reIDProgressVisible} setVisible={v => {
            setReIDProgressVisible(v)
        }}>
            <ProgressBtnIcon src={progressStatus.status === PROGRESS_STATUS['RUNNING'] ? ProgressActivateIcon : ProgressIcon} isRunning={progressStatus.status === PROGRESS_STATUS['RUNNING']} />
            <SmallProgress percent={getAllProgressPercent(progressData)} color={isProgress ? ContentsActivateColor : (progressStatus.status === PROGRESS_STATUS['CANCELD'] ? ProgressErrorColor : 'white')} noString />
            <ProgressContainer visible={reIDProgressVisible}>
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
                                const targetResult = reidResult.find(_ => _.reIdId === globalCurrentReIdId)
                                if (targetResult) {
                                    setReIDProgressVisible(false)
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
                                ManagementCancelFunc('REID', managementId)
                                // navigator.sendBeacon(
                                //     ReidCancelApi,
                                //     localStorage.getItem("Authorization")
                                // );
                            }
                        }} disabled={[PROGRESS_STATUS['IDLE'], PROGRESS_STATUS['CANCELD']].includes(progressStatus.status)}>
                            {progressStatus.status === PROGRESS_STATUS['COMPLETE'] ? '결과 보기' : '전체 분석 취소'}
                        </CancelBtn>
                    </Header>
                    <Progress percent={getAllProgressPercent(progressData) || 0} color={progressStatus.status === PROGRESS_STATUS['CANCELD'] ? ProgressErrorColor : ContentsActivateColor} />
                </HeaderContainer>
                <ContentsWrapper>
                    {progressData.map((_, ind) => <ConditionGroupContainer key={ind} num={ind} progressData={_} visible={reIDProgressVisible} />)}
                </ContentsWrapper>
            </ProgressContainer>
        </ProgressBtn>
    </>
}

export default ReIDProgress

const progressContainerBackgroundColor = SectionBackgroundColor

const headerHeight = 54

const ProgressBtn = styled(VisibleToggleContainer)`
    height: 100%;
    position: relative;
    ${globalStyles.flex({ justifyContent: 'space-between' })}
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
`

const ProgressBtnIcon = styled.img<{ isRunning: boolean }>`
    height: 75%;
    ${({ isRunning }) => isRunning && globalStyles.flash({ animationDuration: '3s', animationIterationCount: 'infinite' })}
`

const ProgressContainer = styled.div<{ visible: boolean }>`
    position: absolute;
    cursor: default;
    top: calc(100% + 14px);
    width: 800px;
    height: 800px;
    max-height: 800px;
    right: -23px;
    padding: 8px 12px;
    border-radius: 12px;
    background-color: ${progressContainerBackgroundColor};
    ${globalStyles.zoomIn()}
    z-index: 9998;
    display: ${({ visible }) => visible ? 'block' : 'none'};
    box-shadow: ${ModalBoxShadow};
`

const Arrow = styled.div`
    width: 0;
    height: 0;
    border-bottom: 10px solid ${progressContainerBackgroundColor};
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    top: -10px;
    right: 36px;
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

const SmallProgress = styled(Progress)`
    height: 1.5px;
    width: 100%;
`