import styled from "styled-components"
import { ButtonBackgroundColor, ContentsBorderColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import AddExportIcon from '../../../assets/img/addExportIcon.png'
import DownloadingExportIcon from '../../../assets/img/downloadingExportIcon.png'
import CompleteExportIcon from '../../../assets/img/completeExportIcon.png'
import CanDownloadExportIcon from '../../../assets/img/canDownloadExportIcon.png'
import DeleteIcon from '../../../assets/img/closeIcon.png'
import CompleteIcon from '../../../assets/img/exportCompleteIcon.png'
import { useEffect, useMemo, useRef, useState } from "react"
import TimeModal from "../../ReID/Condition/Constants/TimeModal"
import CCTVNameById from "../../Constants/CCTVNameById"
import Progress from "../../Layout/Progress"
import AreaSelect from "../../ReID/Condition/Constants/AreaSelect"
import Button from "../../Constants/Button"
import { FileDownloadByUrl, convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions"
import { SseStartApi, VideoExportApi } from "../../../Constants/ApiRoutes"
import { Axios, videoExportCancelFunc } from "../../../Functions/NetworkFunctions"
import { VideoExportApiParameterType, VideoExportRowDataType, VideoExportSseResponseType } from "../../../Model/VideoExportDataModel"
import OptionSelect from "./OptionSelect"
import { CustomEventSource } from "../../../Constants/GlobalConstantsValues"
import { OptionTags } from "../Constants"

type ParameterInputType = {
    index: number
    type: 'cctv' | 'time' | ''
}

const msgByStatus = (status: VideoExportRowDataType['status']) => {
    switch (status) {
        case 'canDownload': return '다운로드 가능'
        case 'complete': return '다운로드 완료'
        case 'downloading': return '다운로드 중'
        case 'cancel': return '취소됨'
        case 'wait': return '대기 중'
        case 'none':
        default: return ''
    }
}

const iconByStatus = (status: VideoExportRowDataType['status']) => {
    switch (status) {
        case 'canDownload': return CanDownloadExportIcon
        case 'complete': return CompleteExportIcon
        case 'downloading': return DownloadingExportIcon
        case 'none':
        default: return AddExportIcon
    }
}

const ExportRow = ({ data, setData, inputTypeChange, deleteCallback, setIndex }: {
    data: VideoExportRowDataType
    setData: (d: VideoExportRowDataType) => void
    inputTypeChange: (type: ParameterInputType['type']) => void
    deleteCallback: (data: VideoExportRowDataType) => void
    setIndex: () => void
}) => {
    const { cctvId, status, options, time } = data
    const [percent, setPercent] = useState(0)
    const [count, setCount] = useState(0)
    const sseRef = useRef<EventSource>()
    const dataRef = useRef(data)
    const timerRef = useRef<NodeJS.Timer>()

    const canChangeInput = useMemo(() => {
        return status === 'none' || status === 'canDownload' || status === 'cancel'
    },[status])
    
    useEffect(() => {
        dataRef.current = data
    }, [data])

    useEffect(() => {
        if (cctvId && time && status === 'none') {
            setData({
                ...data,
                status: 'canDownload'
            })
        }
    }, [cctvId, time, status])

    useEffect(() => {
        if(status === 'downloading') {
            timerRef.current = setInterval(() => setCount(_ => (_ + 1) % 3),1000)
            window.addEventListener('unload', videoExportCancelFunc)
        } else {
            window.addEventListener('unload', videoExportCancelFunc)
            if(status === 'complete' && timerRef.current) clearInterval(timerRef.current)
        }
    },[status])

    const sseSetting = () => {
        sseRef.current = CustomEventSource(SseStartApi)
        sseRef.current.onopen = async (e) => {
            console.debug('video export sse open')
            const res = await Axios('POST', VideoExportApi, [{
                cameraInfo: {
                    id: cctvId,
                    startTime: time?.startTime,
                    endTime: time?.endTime
                },
                options
            }] as VideoExportApiParameterType[])
            if(res) {
                setData({ ...dataRef.current, status: 'downloading' })
            }
        }
        sseRef.current.onmessage = (res: MessageEvent) => {
            console.debug('video export sse message : ', JSON.parse(res.data.replace(/\\/gi, '')))
            const { type, progress, path, status } = JSON.parse(res.data.replace(/\\/gi, '')) as VideoExportSseResponseType
            if (type === 'complete') setPercent(progress)
            if (type === 'done') setData({ ...dataRef.current, status: 'complete' })
            if (path) {
                fetch(path).then(res => res.blob()).then(file => {
                    let tempUrl = URL.createObjectURL(file);
                    FileDownloadByUrl(tempUrl)
                    URL.revokeObjectURL(tempUrl)
                })
            }
            if(status === 'EXPORT_CANCEL') {
                setData({ ...dataRef.current, status: 'cancel' })
            }
            if(status === 'SSE_DESTROY') {
                sseRef.current!.close()
            }
        }
        sseRef.current.onerror = (e) => {
            console.debug('video export sse end')
        }
    }

    return <RowContainer>
        <IconContainer>
            <Icon src={iconByStatus(status)} width="60%" height="60%" />
        </IconContainer>
        <ContentsContainer>
            <StatusTitle status={status}>
                {msgByStatus(status)}
            </StatusTitle>
            <CCTVName>
                <NeedSelectTitle disabled={!canChangeInput} onClick={() => {
                    if(canChangeInput) inputTypeChange('cctv')
                }}>
                    {cctvId ? <CCTVNameById cctvId={cctvId} /> : '클릭하여 반출할 CCTV 선택'}
                </NeedSelectTitle>
            </CCTVName>
            <ProgressContainer>
                <Progress percent={percent} color={TextActivateColor} />
            </ProgressContainer>
            <NeedSelectTitle disabled={!canChangeInput} onClick={() => {
                if(canChangeInput) inputTypeChange('time')
            }}>
                {time ? `${convertFullTimeStringToHumanTimeFormat(time.startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(time.endTime!)}` : '클릭하여 반출할 날짜 선택'}
            </NeedSelectTitle>
            <TagsContainer>
                <OptionTags options={options} />
            </TagsContainer>
        </ContentsContainer>
        <ActionContainer>
            <ActionTopContainer>
                <ActionTopIconContainer onClick={() => {
                    if (status !== 'complete' && status !== 'downloading') {
                        deleteCallback(data)
                    }
                }} disabled={!(status !== 'complete' && status !== 'downloading')}>
                    <Icon src={status === 'complete' ? CompleteIcon : DeleteIcon} width="100%" height="100%" />
                </ActionTopIconContainer>
            </ActionTopContainer>
            <ActionBottomContainer>
                <ActionBottomBtnsContainer>
                    <OptionBtn
                        disabled={status === 'downloading' || status === 'complete'}
                        onClick={() => {
                            setIndex()
                        }}>
                        옵션 선택
                    </OptionBtn>
                </ActionBottomBtnsContainer>
                <ActionBottomBtnsContainer>
                    <ActionBottomBtn disabled={status === 'complete'} onClick={() => {
                        if(status === 'downloading') videoExportCancelFunc()
                        else sseSetting()
                    }}>
                        {status === 'downloading' ? '취소' : '반출하기'}
                    </ActionBottomBtn>
                </ActionBottomBtnsContainer>
            </ActionBottomContainer>
        </ActionContainer>
    </RowContainer>
}

const defaultExportRowData: VideoExportRowDataType = {
    status: 'none',
    cctvId: undefined,
    time: undefined,
    options: {
        masking: []
    }
}

const defaultInputValue: ParameterInputType = {
    type: '',
    index: 0
}

const NewExport = () => {
    const [datas, setDatas] = useState<VideoExportRowDataType[]>([])
    const [newData, setNewData] = useState<VideoExportRowDataType | null>(null)
    const [inputType, setInputType] = useState<ParameterInputType>(defaultInputValue)
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (newData) {
            setDatas(datas.concat(newData))
            setNewData(null)
        }
    }, [newData])

    const clearInputType = () => {
        setInputType(defaultInputValue)
    }
    
    return <>
        <Container>
            {datas.map((_, ind) => <ExportRow setIndex={() => {
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
            }} />)}
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
            <AreaSelect defaultSelected={datas[inputType.index] && datas[inputType.index].cctvId ? [datas[inputType.index].cctvId!] : []} visible={inputType.type === 'cctv'} close={clearInputType} complete={value => {
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
            }} title="CCTV 선택" singleSelect/>
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
        </Container>
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

const RowContainer = styled.div`
    border: 1px solid ${ContentsBorderColor};
    border-radius: 10px;
    padding: 12px 24px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 160px;
    min-height: 160px;
    max-height: 160px;
    width: 100%;
    margin-bottom: 8px;
`

const EmptyRowContainer = styled.div`
    border-radius: 10px;
    border: 2.5px dotted ${ContentsBorderColor};
    ${globalStyles.flex({ gap: '16px' })}
    height: 160px;
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

const IconContainer = styled.div`
    width: 100px;
    height: 100%;
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

const ContentsContainer = styled.div`
    flex: 1;
    ${globalStyles.flex({ alignItems: 'flex-start', gap: '8px' })}
`

const StatusTitle = styled.div<{ status: VideoExportRowDataType['status'] }>`
    color: ${({ status }) => status === 'canDownload' ? TextActivateColor : 'white'};
    opacity: ${({ status }) => status === 'complete' ? 0.5 : 1};
`

const CCTVName = styled.div`
`

const CCTVAndTimeTitle = styled.div`
    font-size: 1.2rem;
`

const NeedSelectTitle = styled.div<{disabled: boolean}>`
    text-decoration: ${({disabled}) => disabled ? 'auto' : 'underline'};
    font-size: 1.2rem;
    cursor: ${({disabled}) => disabled ? 'default' : 'pointer'};
    
`
const ProgressContainer = styled.div`
    width: 60%;
`

const ActionContainer = styled.div`
    width: 250px;
    height: 100%;
    ${globalStyles.flex({ justifyContent: 'space-between' })}
`

const ActionTopContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ alignItems: 'flex-end' })}
`

const ActionTopIconContainer = styled.div<{ disabled: boolean }>`
    width: 30px;
    height: 30px;
    padding: 4px;
    cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
    ${globalStyles.flex()}
`

const ActionBottomContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ justifyContent: 'flex-end', alignItems: 'flex-end', gap: '16px' })}
`

const ActionBottomBtnsContainer = styled.div`
    width: 100%;
    height: 36px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end', gap: '12px' })}
`

const OptionBtn = styled(Button)`
    height: 100%;
    flex: 0 0 50%;
`

const ActionBottomBtn = styled(Button)`
    height: 100%;
    flex: 0 0 50%;
`

const TagsContainer = styled.div`
    ${globalStyles.flex({ justifyContent: 'flex-start', flexDirection: 'row', gap: '8px' })}
`

