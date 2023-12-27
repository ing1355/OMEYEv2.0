import styled from "styled-components"
import { ButtonBackgroundColor, ContentsBorderColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import AddExportIcon from '../../../assets/img/addExportIcon.png'

import { useEffect, useRef, useState } from "react"
import TimeModal from "../../ReID/Condition/Constants/TimeModal"
import AreaSelect from "../../ReID/Condition/Constants/AreaSelect"
import { RequestManagementStartApi, SseStartApi, VideoExportApi } from "../../../Constants/ApiRoutes"
import { Axios, RequestToManagementServer } from "../../../Functions/NetworkFunctions"
import { VideoExportApiParameterType, VideoExportRowDataType, VideoExportSseResponseType } from "../../../Model/VideoExportDataModel"
import OptionSelect from "./OptionSelect"
import { CustomEventSource, IS_PRODUCTION } from "../../../Constants/GlobalConstantsValues"
import useMessage from "../../../Hooks/useMessage"
import { SSEResponseErrorMsg, SSEResponseMsgTypeKeys, SSEResponseMsgTypes } from "../../../Model/ProgressModel"
import { useRecoilState } from "recoil"
import ForLog from "../../Constants/ForLog"
import useServerConnection from "../../../Hooks/useServerConnection"
import { GlobalEvents } from "../../../Model/GlobalEventsModel"
import ExportRow from "./ExportRow"

export type VideoExportParameterInputType = {
    index: number
    type: 'cctv' | 'time' | ''
}

const defaultExportRowData: VideoExportRowDataType = {
    status: 'none',
    cctvId: undefined,
    time: undefined,
    options: {
        masking: [],
        points: [],
        password: '',
        description: '',
        areaInfoImg: ''
    },
    progress: {
        aiPercent: 0,
        videoPercent: 0,
        status: "WAIT"
    }
}

const defaultInputValue: VideoExportParameterInputType = {
    type: '',
    index: 0
}

const NewExport = () => {
    const [datas, setDatas] = useState<VideoExportRowDataType[]>([])
    const [newData, setNewData] = useState<VideoExportRowDataType | null>(null)
    const [inputType, setInputType] = useState<VideoExportParameterInputType>(defaultInputValue)
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | undefined>(undefined)
    const [currentUUID, setCurrentUUID] = useState<VideoExportRowDataType['videoUUID']>('')
    const [globalEvent, setGlobalEvent] = useRecoilState(GlobalEvents)
    const currentUUIDRef = useRef(currentUUID)
    const sseRef = useRef<EventSource>()
    const datasRef = useRef(datas)
    const currentData = useRef<VideoExportRowDataType>(datas[0])
    const message = useMessage()
    const {healthCheckClear, healthCheckTimerRegister} = useServerConnection()

    const healthCheckClearCallback = () => {
        currentData.current.status = 'cancel'
        setDatas(datasRef.current.map(_ => {
            return _.videoUUID === currentUUIDRef.current ? ({
                ...currentData.current
            }) : _
        }))
    }

    const healthCheckRegisterCallback = () => {
        healthCheckTimerRegister(healthCheckClearCallback)
    }

    useEffect(() => {
        datasRef.current = datas
    }, [datas])

    useEffect(() => {
        currentUUIDRef.current = currentUUID
    }, [currentUUID])

    useEffect(() => {
        if (newData) {
            setDatas(datas.concat(newData))
            setNewData(null)
        }
    }, [newData])

    const clearInputType = () => {
        setInputType(defaultInputValue)
    }

    useEffect(() => {
        if (!IS_PRODUCTION) setDatas([
            {
                "status": "canDownload",
                "cctvId": 5960,
                "time": {
                    "startTime": "20231113000000",
                    "endTime": "20231113000016"
                },
                "options": {
                    "masking": [],
                    "points": [],
                    "password": "",
                    "description": "test",
                    "areaInfoImg": ""
                },
                "progress": {
                    "aiPercent": 0,
                    "videoPercent": 0,
                    "status": "WAIT"
                }
            },
            {
                "status": "canDownload",
                "cctvId": 5961,
                "time": {
                    "startTime": "20231113000000",
                    "endTime": "20231113000030"
                },
                "options": {
                    "masking": [],
                    "points": [],
                    "password": "",
                    "description": "test2",
                    "areaInfoImg": ""
                },
                "progress": {
                    "aiPercent": 0,
                    "videoPercent": 0,
                    "status": "WAIT"
                }
            }
        ])
        return () => {
            if (sseRef.current) {
                sseRef.current.close()
            }
        }
    }, [])

    const exportApi = async (id: VideoExportRowDataType['managementId']) => {
        const target = datas.find(_ => _.managementId === id)
        if(!target) return message.error({title: "입력값 에러", msg: "매니지먼트 Id가 잘못되었습니다."})
        if(!currentData.current) {
            currentData.current = {
                ...target,
                status: 'downloading'
            }
        }
        const res: {
            videoUUID: string
        } = await Axios('POST', RequestManagementStartApi, id)
        setGlobalEvent({
            key: 'Refresh'
        })
        if (res) {
            setCurrentUUID(res.videoUUID)
            currentData.current = {
                ...target,
                videoUUID: res.videoUUID,
                status: 'downloading'
            }
            setDatas(datasRef.current.map((_, ind) => {
                if (_.managementId === target.managementId) {
                    return currentData.current
                } else {
                    return _
                }
            }))
        } else {
            if (sseRef.current) {
                sseRef.current.close()
                sseRef.current = undefined
            }
        }
    }
    
    const sseSetting = async (id: VideoExportRowDataType['managementId']) => {
        currentData.current = datasRef.current.find(_ => _.managementId === id)!
        try {
            sseRef.current = await CustomEventSource(SseStartApi)
            sseRef.current.onopen = async (e) => {
                console.debug('video export sse open')
                exportApi(id)
            }
            sseRef.current.onmessage = (res: MessageEvent) => {
                console.debug('video export sse message : ', JSON.parse(res.data.replace(/\\/gi, '')))
                const { type, videoPercent, path, status, videoUUID, deIdentificationPercent, encodingPercent, aiPercent } = JSON.parse(res.data.replace(/\\/gi, '')) as VideoExportSseResponseType
                if (videoUUID) {
                    if (type === 'complete') {
                        currentData.current.videoUUID = videoUUID
                        currentData.current.progress = {
                            encodingPercent,
                            aiPercent,
                            deIdentificationPercent,
                            videoPercent,
                            status: 'RUNNING'
                        }
                    } else if (type === 'done') {
                        currentData.current.status = 'complete'
                    }
                    if (path) {
                        currentData.current.path = path
                        message.success({ title: "작업 완료", msg: "영상 반출 준비가 완료되었습니다.\n다운로드를 눌러 영상을 다운받아 주세요." })
                    }
                }
                if(status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SSE_CONNECTION']]) {
                    healthCheckRegisterCallback()
                } else if (status && SSEResponseErrorMsg.includes(status)) {
                    currentData.current.progress = {
                        aiPercent: 0,
                        videoPercent: 0,
                        status: 'WAIT'
                    }
                    currentData.current.managementId = undefined
                    currentData.current.status = 'cancel'
                    setGlobalEvent({
                        key: 'Cancel'
                    })
                } else if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SERVER_ALIVE']]) {
                    healthCheckRegisterCallback()
                }
                setDatas(datasRef.current.map(_ => {
                    return _.videoUUID === currentUUIDRef.current ? ({
                        ...currentData.current
                    }) : _
                }))
                if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SSE_DESTROY']]) {
                    healthCheckClear()
                    currentUUIDRef.current = ''
                    sseRef.current!.close()
                    sseRef.current = undefined
                }
            }
            sseRef.current.onerror = (e) => {
                console.debug('video export sse end')
            }
        } catch(e) {
            console.debug("test catch : " , e)
        }
    }

    useEffect(() => {
        if(globalEvent.key === 'VideoExportStart') {
            sseSetting(globalEvent.data)
        }
    },[globalEvent])
    
    return <>
        <Container>
            {datas.map((_, ind, arr) => <ExportRow setIndex={() => {
                setSelectedRowIndex(ind)
            }} key={ind} data={_} setData={d => {
                setDatas(datas.map((__, _ind) => _ind === ind ? d : __))
            }} inputTypeChange={type => {
                setInputType({
                    index: ind,
                    type
                })
            }} deleteCallback={() => {
                setDatas(datas.filter((__, _ind) => _ind !== ind))
            }} exportCallback={() => {
                const params = [{
                    cameraInfo: {
                        id: _.cctvId,
                        startTime: _.time?.startTime,
                        endTime: _.time?.endTime
                    },
                    options: {
                        ..._.options,
                        points: _.options.points.map(_ => _.flat())
                    }
                }] as VideoExportApiParameterType[]
                RequestToManagementServer('VIDEO_EXPORT', params, (res) => {
                    setDatas(datas.map((__, _ind) => ind === _ind ? {
                        ...__,
                        managementId: res,
                        status: 'wait'
                    } : __))
                    setGlobalEvent({
                        key: 'StackManagementServer',
                        data: res,
                        params
                    })
                })
                // if (sseRef.current) {
                //     exportApi(_, ind)
                // } else {
                //     sseSetting(() => {
                //         exportApi(_, ind)
                //     })
                // }
            }} alreadyOtherProgress={currentUUID !== _.videoUUID && arr.find(_ => _.videoUUID === currentUUID)?.status === 'downloading'} />)}
            <EmptyRowContainer onClick={() => {
                setNewData(defaultExportRowData)
            }}>
                <EmptyTitle>
                    새 영상을 반출하려면 여기를 클릭하세요.
                </EmptyTitle>
                <EmptyIconContainer>
                    <Icon src={AddExportIcon} width="100%" height="100%" />
                </EmptyIconContainer>
            </EmptyRowContainer>
        </Container>
        <AreaSelect
            defaultSelected={datas[inputType.index] && datas[inputType.index].cctvId ? [datas[inputType.index].cctvId!] : []}
            visible={inputType.type === 'cctv'}
            close={clearInputType}
            complete={value => {
                if (inputType.index === -1) {
                    setNewData({
                        ...defaultExportRowData,
                        cctvId: value[0]
                    })
                } else {
                    setDatas(datas.map((_, ind) => inputType.index === ind ? ({
                        ..._,
                        cctvId: value[0]
                    }) : _))
                }
            }}
            title="CCTV 선택"
            singleSelect />
        <TimeModal
            visible={inputType.type === 'time'}
            defaultValue={datas[inputType.index] && datas[inputType.index].time}
            title="시간 선택"
            close={clearInputType}
            onChange={time => {
                if (inputType.index === -1) {
                    setNewData({
                        ...defaultExportRowData,
                        time
                    })
                } else {
                    setDatas(datas.map((_, ind) => inputType.index === ind ? ({
                        ..._,
                        time
                    }) : _))
                }
            }} />
        <OptionSelect
            visible={selectedRowIndex !== undefined}
            complete={opts => {
                setDatas(datas.map((_, ind) => ind === selectedRowIndex ? ({
                    ..._,
                    options: opts
                }) : _))
            }}
            close={() => {
                setSelectedRowIndex(undefined)
            }}
            defaultValue={selectedRowIndex !== undefined ? datas[selectedRowIndex] : undefined}
        />
    </>
}

export default NewExport

const RowHeight = 240

const EmptyRowContainer = styled.div`
    border-radius: 10px;
    border: 2.5px dotted ${ContentsBorderColor};
    ${globalStyles.flex({ gap: '16px' })}
    height: ${RowHeight}px;
    width: 100%;
    &:hover {
        background-color: ${ButtonBackgroundColor};
        cursor: pointer;
    }
`

const EmptyTitle = styled.div`
    font-size: 1.2rem;
`

const EmptyIconContainer = styled.div`
    height: 50%;
    ${globalStyles.flex()}
`

const Icon = styled.img`
`

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    ${globalStyles.flex({ justifyContent: 'flex-start' })}
`