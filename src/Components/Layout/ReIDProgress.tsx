import styled from "styled-components"
import { SectionBackgroundColor, globalStyles, loadingAIAnalysisColor, loadingVideoDownloadColor } from "../../styles/global-styled"
import React, { CSSProperties, useEffect, useRef, useState } from "react"
import Button from "../Constants/Button"
import { ReidCancelApi, SseStartApi } from "../../Constants/ApiRoutes"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { AllReIDResultData, ReIDRequestParamsType, ReIDStatus } from "../../Model/ReIdResultModel"
import CCTVIcon from '../../assets/img/camera.png'
import Progress from "./Progress"
import CollapseArrow from "../Constants/CollapseArrow"
import { Axios, StartPersonDescription } from "../../Functions/NetworkFunctions"
import { convertFullTimeStringToHumanTimeFormat } from "../../Functions/GlobalFunctions"
import CCTVNameById from "../Constants/CCTVNameById"
import { CameraDataType } from "../../Constants/GlobalTypes"
import useMessage from "../../Hooks/useMessage"
import { ProgressDataParamsTimeDataType, ProgressRequestParams, SSEProgressResponseType } from "../../Model/ProgressModel"
import { DescriptionRequestParamsType, descriptionId } from "../../Model/DescriptionDataModel"

type ReIDProgressProps = {
    visible: boolean
}

const getAllProgressPercent = (data: ProgressDataParamsTimeDataType[][]) => {
    const perTimePercent = 100 / data.length
    return data.map(_ => getConditionPercent(_)).reduce((pre, cur) => (cur * perTimePercent) + pre ,0) / 100
}

const getConditionPercent = (data: ProgressDataParamsTimeDataType[]) => {
    const perTimePercent = 100 / data.length
    return data.map(_ => {
        const cctvIds = Object.keys(_)
        return cctvIds.filter(__ => {
            const cctvPercent = _[Number(__)]
            const {aiPercent, videoPercent} = cctvPercent
            return (aiPercent === 100 && videoPercent === 100) || (videoPercent === -1) || (aiPercent === -1)
        }).length / cctvIds.length
    }).reduce((pre, cur) => (cur * perTimePercent) + pre ,0)
}

const getSuccessAndFailByTimeGroup = (data: ProgressDataParamsTimeDataType) => {
    const cctvIds = Object.keys(data)
    const success = cctvIds.filter(_ => data[Number(_)].aiPercent === 100 && data[Number(_)].videoPercent === 100).length
    const fail = cctvIds.filter(_ => data[Number(_)].aiPercent === -1 || data[Number(_)].videoPercent === -1).length
    return createCompleteText({ success, fail, complete: (success + fail) === cctvIds.length })
}

const createCompleteText = (data: {
    success: number,
    fail: number,
    complete: boolean
}) => {
    const {success, fail, complete} = data
    return `${complete ? '완료' : '진행중'}(성공: ${success}, 실패: ${fail})`
}

const ColorsDescription = ({ title, color }: {
    title: string
    color: CSSProperties['color']
}) => {
    return <ColorsDescriptionItem>
        <ColorDescipriotnTitle>
            {title}
        </ColorDescipriotnTitle>
        <ColorDescription color={color} />
    </ColorsDescriptionItem>
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
        <CCTVProgressIcon src={CCTVIcon} />
        <CCTVProgressDataContainer>
            <CCTVProgressLabel>
                <CCTVNameById cctvId={cctvId} />
            </CCTVProgressLabel>
            <ProgressWrapper percent={videoPercent} color={loadingVideoDownloadColor} />
            <ProgressWrapper percent={aiPercent} color={loadingAIAnalysisColor} />
        </CCTVProgressDataContainer>
    </CCTVProgressContainer>
}, (prev, next) => {
    if (prev.videoPercent !== next.videoPercent || prev.aiPercent !== next.aiPercent) return false;
    return true;
})

const ConditionGroupContainer = ({ num, data, progressData }: {
    num: number
    data: ReIDRequestParamsType
    progressData: ProgressDataParamsTimeDataType[]
}) => {
    const [timeGroupOpened, setTimeGroupOpened] = useState<number[]>([])
    return <Contents>
        <ConditionTitle>
            조건 {num + 1} {progressData && `(진행률 : ${getConditionPercent(progressData)}%)`}
        </ConditionTitle>
        {
            data.timeAndArea.map((__, _ind) => <TimeGroupContainer key={_ind} opened={timeGroupOpened.includes(_ind)} rowNum={Math.floor(__.cctvs.length / 2) + 1}>
                <TimeGroupHeader onClick={() => {
                    if (timeGroupOpened.includes(_ind)) setTimeGroupOpened(timeGroupOpened.filter(t => t !== _ind))
                    else setTimeGroupOpened(timeGroupOpened.concat(_ind))
                }}>
                    <TimeGroupTitle>
                        {convertFullTimeStringToHumanTimeFormat(__.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(__.endTime)}
                    </TimeGroupTitle>
                    <TimeGroupProgress>
                        {progressData && getSuccessAndFailByTimeGroup(progressData[_ind])}
                    </TimeGroupProgress>
                    <TimeGroupCollapse opened={timeGroupOpened.includes(_ind)} />
                </TimeGroupHeader>
                <TimeGroupContents>
                    {progressData && __.cctvs.map((___, __ind) => <CCTVProgressRow key={__ind} cctvId={___} videoPercent={progressData[_ind][___].videoPercent} aiPercent={progressData[_ind][___].aiPercent} />)}
                </TimeGroupContents>
            </TimeGroupContainer>)
        }
    </Contents>
}

const ReIDProgress = ({ visible }: ReIDProgressProps) => {
    const [loadingTime, setLoadingTime] = useState(0)
    const [reidStatus, setReidStatus] = useRecoilState(ReIDStatus)
    const _progressRequestParams = useRecoilValue(ProgressRequestParams)
    const params = _progressRequestParams.params
    // const [progressData, setProgressData] = useRecoilState(ReIDProgressData)
    const [progressData, setProgressData] = useState<ProgressDataParamsTimeDataType[][]>([])
    const [reidResult, setReidResult] = useRecoilState(AllReIDResultData)
    const setDescriptionUUID = useSetRecoilState(descriptionId)
    const sseRef = useRef<EventSource>()
    const statusRef = useRef(reidStatus)
    const message = useMessage()
    
    function sseSetting() {
        try {
            sseRef.current = new EventSource(SseStartApi);
            sseRef.current.onopen = async (e) => {
                console.log('open : ', e)
                switch(_progressRequestParams.type) {
                    case 'ATTRIBUTION': {
                        const res = await StartPersonDescription(params as DescriptionRequestParamsType);
                        if(res) {
                            setDescriptionUUID(res.uuid)
                        }
                        break;
                    }
                    case 'REID': return;
                    case 'REALTIME': return;
                    default: return;
                }
            };
            sseRef.current.onmessage = (res: MessageEvent) => {
                try {
                    const data = JSON.parse(res.data.replace(/\\/gi, '')) as SSEProgressResponseType
                    const { conditionIndex, timeIndex, cctvId, aiPercent, videoPercent } = data
                    setProgressData(prev => {
                        let temp = [...prev]
                        temp[conditionIndex][timeIndex][cctvId] = {
                            aiPercent,
                            videoPercent
                        }
                        return temp
                    })
                } catch(err) {
                    console.log(err)
                }
            };
            sseRef.current.onerror = (e: any) => {
                console.log(e.statusCode)
                // e.target.close();
                clearInterval(intervalId)
            };
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (_progressRequestParams.type) {
            intervalId = setInterval(() => {
                setLoadingTime(time => time + 1)
            }, 1000)
            if(_progressRequestParams.type === 'REID') {
                const _params = params as ReIDRequestParamsType[]
                setProgressData(_params.map(_ => _.timeAndArea.map(__ => {
                    return __.cctvs.reduce((accumulator, value) => {
                        return {
                            ...accumulator, [value]: {
                                aiPercent: 0,
                                videoPercent: 0
                            }
                        };
                    }, {});
                })))
            } else if(_progressRequestParams.type === 'ATTRIBUTION') {
                const _params = params as DescriptionRequestParamsType
                setProgressData([[_params.cameraSearchAreaList.reduce((acc, value) => {
                    return {
                        ...acc, [value.id]: {
                            aiPercent: 0,
                            videoPercent: 0
                        }
                    };
                },{})]])
            }
            // Axios("POST", '/test/reid', params).then(res => {
            //     setReidResult(reidResult.concat(res))
            //     setReidStatus('IDLE')
            // }).catch(err => {
            //     console.log(err)
            // })
            sseSetting()
            // Axios("POST", StartReIdApi, params).then(async (res) => {
            //     setreidstat(REIDSTATUS['IDLE'])
            //     if (res) setData(await Axios('GET', GetReidDataApi(res.id)))
            //     window.removeEventListener('unload', reidCancelFunc);
            // })
        } else {
            if (intervalId) clearInterval(intervalId)
            setLoadingTime(0)
        }
    //     if(statusRef.current === 'RUNNING' && reidStatus === 'IDLE') {
    //         message.preset('REIDCOMPLETE')
    //     }
    //    statusRef.current = reidStatus
    }, [_progressRequestParams])

    return <>
        <SmallProgress percent={getAllProgressPercent(progressData)} color="white" noString />
        <ProgressContainer visible={visible} onClick={(e) => {
            e.stopPropagation()
        }}>
            <Arrow />
            <Header>
                <Time>
                    {getLoadingTimeString(loadingTime)}
                </Time>
                <ColorsDescriptionContainer>
                    <ColorsDescription title="영상 다운로드" color={loadingVideoDownloadColor} />
                    <ColorsDescription title="AI 분석" color={loadingAIAnalysisColor} />
                </ColorsDescriptionContainer>
                <CancelBtn onClick={() => {
                    navigator.sendBeacon(
                        ReidCancelApi,
                        localStorage.getItem("Authorization")
                    );
                }}>
                    분석 취소
                </CancelBtn>
            </Header>
            {/* <ContentsWrapper>
                {progressData.map((_, ind) => <ConditionGroupContainer key={ind} num={ind} data={_} progressData={progressData[ind]} />)}
            </ContentsWrapper> */}
        </ProgressContainer>
    </>
}

export default ReIDProgress

const progressContainerBackgroundColor = SectionBackgroundColor
const rowHeight = 65

const ProgressContainer = styled.div<{ visible: boolean }>`
    position: absolute;
    cursor: default;
    top: calc(100% + 14px);
    width: 600px;
    height: 800px;
    right: -23px;
    padding: 8px 12px;
    background-color: ${progressContainerBackgroundColor};
    ${globalStyles.zoomIn()}
    z-index: 9999;
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

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    border-bottom: 1px solid white;
    padding-bottom: 8px;
    & div {
        font-size: 0.8rem;
    }
    height: 36px;
`

const Time = styled.div`
    flex: 0 0 130px;
`

const ColorsDescriptionContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 100%;
    flex: 1;
`

const ColorsDescriptionItem = styled.div`
    height: 100%;
    flex: 0 0 120px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const ColorDescipriotnTitle = styled.div`
    
`

const ColorDescription = styled.div<{ color: CSSProperties['color'] }>`
    flex: 0 0 36px;
    height: 70%;
    border-radius: 10px;
    background-color: ${({ color }) => color};
`

const CancelBtn = styled(Button)`
    flex: 0 0 100px;
`

const ContentsWrapper = styled.div`
    overflow: auto;
    padding-top: 8px;
    height: calc(100% - 36px);
    width: 100%;
`

const ConditionTitle = styled.div`
    text-align: center;
    width: 100%;
`

const Contents = styled.div`
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
    margin-bottom: 8px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`

const CCTVProgressContainer = styled.div`
    flex: 0 0 49%;
    height: ${rowHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
`

const CCTVProgressIcon = styled.img`
    width: ${rowHeight - 6}px;
    height: 90%;
`

const CCTVProgressLabel = styled.div`
    font-size: 0.7rem;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 25%;
`

const CCTVProgressDataContainer = styled.div`
    height: 80%;
    flex: 1;
    ${globalStyles.flex({ alignItems: 'flex-start', justifyContent: 'space-between', gap: '4px' })}
`

const ProgressWrapper = styled(Progress)`
    width: 100%;
    height: 35%;
    & div {
        font-size: 0.7rem;
    }
`

const TimeGroupContainer = styled.div<{ opened: boolean, rowNum: number }>`
    border: 1px solid white;
    width: 100%;
    padding: 8px 4px;
    height: ${({ opened, rowNum }) => opened ? (((rowNum * rowHeight) + 62 + ((rowNum - 1) * 8)) > 700 ? 700 : (rowNum * rowHeight) + 62 + ((rowNum - 1) * 8)) : 40}px;
    overflow-y: ${({ opened }) => opened ? 'auto' : 'hidden'};
    transition: height .3s ease-out;
`

const TimeGroupHeader = styled.div`
    cursor: pointer;
    height: 22px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    padding: 0 12px;
`

const TimeGroupTitle = styled.div`
`

const TimeGroupCollapse = styled(CollapseArrow)`
    height: 100%;
    cursor: pointer;
`

const TimeGroupProgress = styled.div`
`

const TimeGroupContents = styled.div`
    width: 100%;
    padding-top: 16px;
    max-height: calc(100% - 28px);
    overflow-y: auto;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`

const SmallProgress = styled(Progress)`
    height: 1.5px;
    width: 100%;
`