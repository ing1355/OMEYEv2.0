import DeleteIcon from '../../../assets/img/closeIcon.png'
import CompleteIcon from '../../../assets/img/exportCompleteIcon.png'
import { GetCameraById } from "../../../Model/SiteDataModel"
import { OptionTags } from "../Constants"
import ProgressAIIcon from '../../../assets/img/ProgressAIIcon.png'
import ProgressVideoIcon from '../../../assets/img/ProgressVideoIcon.png'
import encodingIcon from '../../../assets/img/encodingIcon.png'
import editIcon from '../../../assets/img/cctvEditIcon.png'
import { convertFullTimeStringToHumanTimeFormat, getLoadingTimeString, videoDownloadByPath } from "../../../Functions/GlobalFunctions"
import CCTVNameById from "../../Constants/CCTVNameById"
import Progress from "../../Layout/Progress"
import { VideoExportRowDataType } from '../../../Model/VideoExportDataModel'
import DownloadingExportIcon from '../../../assets/img/downloadingExportIcon.png'
import CompleteExportIcon from '../../../assets/img/completeExportIcon.png'
import CanDownloadExportIcon from '../../../assets/img/canDownloadExportIcon.png'
import { VideoExportParameterInputType } from '.'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { ContentsBorderColor, TextActivateColor, globalStyles } from '../../../styles/global-styled'
import Button from '../../Constants/Button'
import AddExportIcon from '../../../assets/img/addExportIcon.png'
import { ManagementCancelFunc } from '../../../Functions/NetworkFunctions'

const msgByStatus = (status: VideoExportRowDataType['status'], progress?: VideoExportRowDataType['progress']) => {
    switch (status) {
        case 'canDownload': return <>&nbsp;</>
        case 'complete': return '완료'
        case 'downloading': {
            if (progress) {
                if (progress.videoPercent < 100) return '영상 다운로드 중'
                else if ((progress.deIdentificationPercent || 0) < 100) return '영상 비식별화 진행 중'
                else if ((progress.encodingPercent || 0) < 100) return '영상 인코딩 진행 중'
                else return '영상 변환 중'
            } else {
                return '영상 반출 진행 중'
            }
        }
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

const btnMsgByStatus = (status: VideoExportRowDataType['status']) => {
    switch (status) {
        case 'downloadComplete':
        case 'complete': return '다운로드'
        case 'downloading': return '취소'
        default: return '반출하기'
    }
}

const ExportRow = ({ data, setData, inputTypeChange, deleteCallback, setIndex, exportCallback, alreadyOtherProgress }: {
    data: VideoExportRowDataType
    setData: (d: VideoExportRowDataType) => void
    inputTypeChange: (type: VideoExportParameterInputType['type']) => void
    deleteCallback: (data: VideoExportRowDataType) => void
    setIndex: () => void
    exportCallback: () => void
    alreadyOtherProgress: boolean
}) => {
    const { cctvId, status, options, time, progress, path, managementId } = data
    const [count, setCount] = useState(0)
    const dataRef = useRef(data)
    const timerRef = useRef<NodeJS.Timer>()
    const cctvInfo = useRecoilValue(GetCameraById(cctvId || 0))
    const managementIdRef = useRef(managementId)
    
    const canChangeInput = useMemo(() => {
        return status === 'none' || status === 'canDownload' || status === 'cancel' || status === 'wait'
    }, [status])

    useEffect(() => {
        dataRef.current = data
    }, [data])

    useEffect(() => {
        managementIdRef.current = managementId
    }, [managementId])

    useEffect(() => {
        if (cctvId && time && status === 'none') {
            setData({
                ...data,
                status: 'canDownload'
            })
        }
    }, [cctvId, time, status])

    const cancelFunc = useCallback(() => {
        ManagementCancelFunc('VIDEO_EXPORT', managementIdRef.current!)
    },[])

    useEffect(() => {
        if (status === 'downloading') {
            timerRef.current = setInterval(() => setCount(_ => _ + 1), 1000)
            window.addEventListener('beforeunload', cancelFunc)
        } else if(status === 'none' || status === 'cancel') {
            setCount(0)
        } else {
            window.removeEventListener('beforeunload', cancelFunc)
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
        return () => {
            window.removeEventListener('beforeunload', cancelFunc)
        }
    }, [status])

    return <RowContainer>
        <IconContainer>
            <Icon src={iconByStatus(status)} width="60%" height="60%" />
            {!canChangeInput && <CountText>
                {getLoadingTimeString(count)}
            </CountText>}
        </IconContainer>
        <ContentsContainer>
            <TitleContainer>
                <StatusTitle status={status}>
                    {msgByStatus(status, progress)}{status === 'downloading' && Array.from({ length: count % 4 }).map(_ => '.')}
                </StatusTitle>
                {/* {!canChangeInput && <CountText>
                    {getLoadingTimeString(count)}
                </CountText>} */}
            </TitleContainer>
            <CCTVName disabled={!canChangeInput} onClick={() => {
                if (canChangeInput) inputTypeChange('cctv')
            }}>
                <NeedSelectTitle>
                    {cctvId ? <CCTVNameById cctvId={cctvId} /> : 'CCTV 선택'}
                </NeedSelectTitle>
                {canChangeInput && <EditIconContainer>
                    <img src={editIcon} />
                </EditIconContainer>}
            </CCTVName>
            <CCTVName disabled={!canChangeInput} onClick={() => {
                if (canChangeInput) inputTypeChange('time')
            }}>
                <NeedSelectTitle>
                    {time ? `${convertFullTimeStringToHumanTimeFormat(time.startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(time.endTime!)}` : '날짜 선택'}
                </NeedSelectTitle>
                {canChangeInput && <EditIconContainer>
                    <img src={editIcon} />
                </EditIconContainer>}
            </CCTVName>
            <ProgressContainer>
                <Progress percent={progress.videoPercent || 0} color={TextActivateColor} outString icon={ProgressVideoIcon} />
            </ProgressContainer>
            <ProgressContainer>
                <Progress percent={progress.aiPercent || progress.deIdentificationPercent || 0} color={TextActivateColor} outString icon={ProgressAIIcon} />
            </ProgressContainer>
            {options.masking.length > 0 && <ProgressContainer>
                <Progress percent={progress.encodingPercent || 0} color={TextActivateColor} outString icon={encodingIcon} />
            </ProgressContainer>}
            {options.description && <ETCContainer>
                <div>
                    비고 :
                </div>
                <div>
                    {options.description}
                </div>
            </ETCContainer>}
            <TagsContainer>
                <OptionTags options={options} />
            </TagsContainer>
        </ContentsContainer>
        <ActionContainer>
            <ActionTopContainer>
                {canChangeInput && <ActionTopIconContainer onClick={() => {
                    if (status !== 'complete' && status !== 'downloading') {
                        deleteCallback(data)
                    }
                }} disabled={!(status !== 'complete' && status !== 'downloading')}>
                    <Icon src={status === 'complete' ? CompleteIcon : DeleteIcon} width="100%" height="100%" />
                </ActionTopIconContainer>}
            </ActionTopContainer>
            <ActionBottomContainer>
                <ActionBottomBtnsContainer>
                    <OptionBtn
                        disabled={!canChangeInput}
                        onClick={() => {
                            setIndex()
                        }}>
                        옵션 선택
                    </OptionBtn>
                </ActionBottomBtnsContainer>
                <ActionBottomBtnsContainer>
                    <ActionBottomBtn disabled={(status === 'complete' && !path) || status === 'none' || alreadyOtherProgress || (status === 'downloadComplete')} onClick={() => {
                        if (status === 'downloading') {
                            cancelFunc()
                        }
                        if (status === 'canDownload' || status === 'cancel') exportCallback()
                        if (status === 'complete') {
                            setData({
                                ...data,
                                status: 'downloadComplete'
                            })
                            videoDownloadByPath(path!, `${cctvInfo?.name}_${time?.startTime}_${time?.endTime}`)
                        }
                    }}>
                        {btnMsgByStatus(status)}
                    </ActionBottomBtn>
                </ActionBottomBtnsContainer>
            </ActionBottomContainer>
        </ActionContainer>
    </RowContainer>
}

export default ExportRow

const RowHeight = 240

const RowContainer = styled.div`
    border: 1px solid ${ContentsBorderColor};
    border-radius: 10px;
    padding: 12px 24px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: ${RowHeight}px;
    min-height: ${RowHeight}px;
    max-height: ${RowHeight}px;
    width: 100%;
    margin-bottom: 8px;
`

const IconContainer = styled.div`
    width: 140px;
    height: 100%;
    ${globalStyles.flex()}
`

const Icon = styled.img`
`

const ContentsContainer = styled.div`
    flex: 1;
    ${globalStyles.flex({ alignItems: 'flex-start', gap: '8px' })}
`

const TitleContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
`

const StatusTitle = styled.div<{ status: VideoExportRowDataType['status'] }>`
    color: ${({ status }) => status === 'canDownload' ? TextActivateColor : 'white'};
    opacity: ${({ status }) => status === 'complete' ? 0.5 : 1};
`

const CountText = styled.div`
`

const CCTVName = styled.div<{ disabled: boolean }>`
    &:hover {
        & > div {
            text-decoration: ${({ disabled }) => disabled ? 'auto' : 'underline'};
        }
    }
    cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`

const NeedSelectTitle = styled.div`
    font-size: 1.2rem;
    display: inline-block;
    
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

const ETCContainer = styled.div`
    width: calc(100% - 140px);
    ${globalStyles.flex({ flexDirection: 'row', justifyContent:'flex-start', gap: '4px', flexWrap:'wrap' })}
    & > div:first-child {
        flex: 0 0 48px;
        font-size: 1.2rem;
    }
    & > div:last-child {
        font-size: 1.1rem;
        max-width: 800px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`

const EditIconContainer = styled.div`
    display: inline-block;
    position: relative;
    height: 14px;
    & > img {
        width: 100%;
        height: 100%;
    }
`