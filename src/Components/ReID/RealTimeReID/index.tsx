import styled from "styled-components"
import { ButtonBorderColor, ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, InputBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import Button from "../../Constants/Button"
import { RealTimeReidApi, RealTimeReidCancelApi, SseStartApi, UpdateRealTimeThresholdApi } from "../../../Constants/ApiRoutes"
import { useRecoilState } from "recoil"
import { realTimeData, realTimeStatus } from "../../../Model/RealTimeDataModel"
import { Axios } from "../../../Functions/NetworkFunctions"
import { getColorByScore } from "../../../Functions/GlobalFunctions"
import { ReIDObjectTypeKeys, setStateType } from "../../../Constants/GlobalTypes"
import Video from "../../Constants/Video"
import ImageView from "../Condition/Constants/ImageView"
import MapComponent from "../../Constants/Map"
import useMessage from "../../../Hooks/useMessage"
import { CustomEventSource, GetAuthorizationToken } from "../../../Constants/GlobalConstantsValues"
import { PROGRESS_STATUS, SSEResponseMsgTypeKeys, SSEResponseMsgTypes, SSEResponseStatusType } from "../../../Model/ProgressModel"
import { ObjectTypes, ReIDObjectTypes } from "../ConstantsValues"
import Slider from "../../Constants/Slider"
import { DescriptionCategoryKeyType, descriptionDataType, descriptionSubDataKeys } from "../Condition/TargetSelect/PersonDescription/DescriptionType"
import CCTVNameById from "../../Constants/CCTVNameById"
import realtimeStartIcon from '../../../assets/img/realtimeStartIcon.png'
import realtimeStopIcon from '../../../assets/img/realtimeStopIcon.png'

const imageBoxHeight = 200
const maxItemNum = 50

const existValueNumsInDescription = (data?: descriptionDataType) => {
    if(!data) return 0;
    return Object.keys(data).map(_ => {
        const subItem = data[_ as DescriptionCategoryKeyType]
        return Object.keys(subItem).flatMap(__ => subItem[__ as descriptionSubDataKeys<keyof descriptionDataType>]).filter(_ => _ && (_ as string|string[]).length > 0).length
    }).reduce((pre, cur) => pre + cur, 0)
}

const ImageComponent = ({ data, y, className, selected, setSelected, onClickCallback }: {
    data: RealTimeDataType
    y: number
    className?: string
    selected: RealTimeDataType | null
    setSelected: setStateType<RealTimeDataType | null>
    onClickCallback: () => void
}) => {

    return <div style={{
        width: '100%',
        height: imageBoxHeight + 'px',
        position: 'absolute',
        top: y * imageBoxHeight + 'px',
        left: 0,
        cursor: 'pointer',
        border: (selected && data && JSON.stringify(selected.imageURL) === JSON.stringify(data.imageURL)) ? `1px solid ${ContentsActivateColor}` : `1px solid ${ContentsBorderColor}`
    }} className={className} onClick={() => {
        onClickCallback()
        if (data) setSelected(data)
    }}>
        <div style={{
            position: 'absolute',
            top: '4px',
            right: '8px',
            fontWeight: 'bold',
            fontSize: '.8rem',
            backgroundColor: data ? getColorByScore(data.accuracy) : 'transparent',
            padding: '4px 6px',
            borderRadius: '12px'
        }}>
            {data ? data.accuracy : 0}%
        </div>
        <div style={{
            position: 'absolute',
            top: '4px',
            left: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: (data && selected && selected.imageURL === data.imageURL) ? ContentsActivateColor : ContentsBorderColor
        }}>
            {y + 1}
        </div>
        <img src={data && data.imageURL} style={{
            width: '100%',
            height: '100%'
        }} />
    </div>
};

type RealTimeDataType = {
    imageURL: string
    timestamp: string
    accuracy: number
    cameraId: number
    error?: string
    status?: SSEResponseStatusType
    min?: number
    max?: number
}

const convertThreshHoldToDescriptionPercent = (threshHold: number, descriptionNums: number) => {
    const tick = 100 / descriptionNums
    const percent = threshHold === descriptionNums ? 100 : (tick * threshHold)
    return percent
}

let timerId: NodeJS.Timer

const cancelFunc = (): void => {
    navigator.sendBeacon(RealTimeReidCancelApi, GetAuthorizationToken());
}

const RealTimeReID = () => {
    const [selected, setSelected] = useState<RealTimeDataType | null>(null)
    const [images, setImages] = useState<RealTimeDataType[]>([])
    const [rtStatus, setRtStatus] = useRecoilState(realTimeStatus)
    const [rtData, setRtData] = useRecoilState(realTimeData)
    const message = useMessage()
    const sseRef = useRef<EventSource>()
    const selectedRef = useRef(selected)
    const statusRef = useRef(rtStatus)
    const imagesRef = useRef<RealTimeDataType[]>([])
    const accuracyRef = useRef(rtData.threshHold)
    const changeTimer = useRef<NodeJS.Timer>()

    useLayoutEffect(() => {
        selectedRef.current = selected
    }, [selected])

    useLayoutEffect(() => {
        statusRef.current = rtStatus
    }, [rtStatus])

    useLayoutEffect(() => {
        accuracyRef.current = rtData.threshHold
    }, [rtData])

    const intervalCallback = useCallback(() => {
        if (imagesRef.current.length > maxItemNum - 1) {
            if (selectedRef.current) {
                const _ = imagesRef.current.findIndex(_ => JSON.stringify(selectedRef.current) === JSON.stringify(_))!
                if (_ < maxItemNum) {
                    imagesRef.current.splice(maxItemNum, imagesRef.current.length - maxItemNum).forEach(_ => {
                        URL.revokeObjectURL(_.imageURL)
                    })
                } else {
                    imagesRef.current[maxItemNum - 1] = { ...selectedRef.current }
                    imagesRef.current.splice(maxItemNum, imagesRef.current.length - maxItemNum).forEach(_ => {
                        if (selectedRef.current?.imageURL !== _.imageURL) URL.revokeObjectURL(_.imageURL)
                    })

                }
            } else {
                imagesRef.current.splice(maxItemNum, imagesRef.current.length - maxItemNum).forEach(_ => {
                    URL.revokeObjectURL(_.imageURL)
                })
            }
        }
        setImages([...imagesRef.current])
    }, [])

    useEffect(() => {
        console.debug("RealTime Status Change : ", rtStatus)
        if (rtStatus === PROGRESS_STATUS['RUNNING']) {
            if(!rtData.objectId) {
                setRtStatus(PROGRESS_STATUS['IDLE'])
                return message.error({ title: '입력값 에러', msg: '분석 대상이 존재하지 않습니다.\n검색 조건 설정에서 먼저 실시간 분석을 진행해주세요.' })
            }
            window.addEventListener("unload", cancelFunc);
            RealTimeSseSetting()
        } else {
            window.removeEventListener("unload", cancelFunc);
        }
    }, [rtStatus])

    const RealTimeSseSetting = async () => {
        console.debug("RealTime Sse Setting")
        sseRef.current = await CustomEventSource(SseStartApi);
        sseRef.current.onopen = async (e: any) => {
            console.debug("sse open realtime: ", e);
            const res = await Axios("POST", RealTimeReidApi, {
                cameraIdList: rtData.cameraIdList,
                objectId: rtData.objectId,
                threshHold: rtData.type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? Math.floor(convertThreshHoldToDescriptionPercent(rtData.threshHold, existValueNumsInDescription(rtData.description))) : rtData.threshHold,
            })
            if (res) {
                setImages([])
                setSelected(null)
                timerId = setInterval(intervalCallback, 500)
                imagesRef.current.forEach(_ => {
                    URL.revokeObjectURL(_.imageURL)
                })
                imagesRef.current = []
            } else {
                setRtStatus(PROGRESS_STATUS['IDLE'])
                sseRef.current?.close()
                sseRef.current = undefined
            }
        };
        sseRef.current.onmessage = (res: MessageEvent) => {
            try {
                const data: RealTimeDataType = JSON.parse(
                    res.data.replace(/\\/gi, "")
                );
                console.debug("sse message realtime : ", data)
                const { imageURL, timestamp, cameraId, accuracy, status } = data
                if (imageURL) {
                    const image = new Image();
                    image.src = imageURL;
                    image.crossOrigin = "Anonymous";
                    image.onload = (e) => {
                        fetch(imageURL)
                            .then((res) => res.blob())
                            .then((blob) => {
                                if (statusRef.current === 'RUNNING') {
                                    imagesRef.current.unshift({
                                        imageURL: URL.createObjectURL(blob),
                                        timestamp,
                                        cameraId,
                                        accuracy,
                                    })
                                    image.onload = null;
                                    image.src = '';
                                    image.remove()
                                }
                            })
                            .catch((err) => {
                                console.error("Image Fetch Fail! ", err);
                            });
                    }
                }
                if (status === SSEResponseMsgTypes[SSEResponseMsgTypeKeys['SSE_DESTROY']]) {
                    console.debug('realtime sse end')
                    setRtStatus(PROGRESS_STATUS['IDLE'])
                    clearInterval(timerId)
                    sseRef.current!.close();
                    sseRef.current = undefined
                }
            } catch (e) {
                console.debug("realtime Error : ", e)
            }
        };
        sseRef.current.onerror = (e: any) => {
            console.debug('realtime sse error', e)
        };
    };

    useEffect(() => {
        if (rtStatus === PROGRESS_STATUS['RUNNING'] && sseRef.current) {
            if (changeTimer.current) clearTimeout(changeTimer.current)
            console.debug("test????")
            changeTimer.current = setTimeout(() => {
                Axios("PUT", UpdateRealTimeThresholdApi, {
                    threshold: rtData.type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? Math.floor(convertThreshHoldToDescriptionPercent(rtData.threshHold, existValueNumsInDescription(rtData.description))) : rtData.threshHold || 1
                })
            }, 300);
        }
    }, [rtData.threshHold])

    return <Container>
        <InputRow>
            <GlobalParamsContainer>
                <div>
                    대상 타입 : <TypeTag activate={!(!rtData.objectId)} disabled={!rtData.objectId}>
                        {ReIDObjectTypes.find(_ => _.key === rtData.type)?.title || '선택한 대상 없음'}
                    </TypeTag>
                </div>
                <div>
                    대상 이미지 : <ObjectTag activate={!(!rtData.src)} disabled={!rtData.src}>
                        자세히 보기
                        {rtData.src && <ObjectImageContainer>
                            <ImageView src={rtData.src}/>
                        </ObjectImageContainer>}
                    </ObjectTag>
                </div>
                <div>
                    CCTV 수 : <TypeTag activate={rtData.cameraIdList.length > 0} disabled={rtData.cameraIdList.length === 0}>
                        {rtData.cameraIdList.length}
                    </TypeTag>
                </div>
            </GlobalParamsContainer>
            <LocalParamsContainer>
                {
                    [ReIDObjectTypes[ObjectTypes['PERSON']].key, ReIDObjectTypes[ObjectTypes['FACE']].key].includes(rtData.type) && <>
                        최소 유사율(%) : <Slider min={1} max={100} value={rtData.threshHold} onChange={val => {
                            setRtData({
                                ...rtData,
                                threshHold: val
                            })
                        }} />
                        <AccuracyInput onlyNumber maxNumber={100} value={rtData.threshHold} onChange={(val) => {
                            setRtData({
                                ...rtData,
                                threshHold: Number(val)
                            })
                        }} maxLength={3} />
                    </>
                }
                {
                    rtData.type === ReIDObjectTypes[ObjectTypes['ATTRIBUTION']].key && rtData.description && <>
                        최소 탐지 개수 : <Slider min={1} max={existValueNumsInDescription(rtData.description)} value={rtData.threshHold} onChange={val => {
                            setRtData({
                                ...rtData,
                                threshHold: val
                            })
                        }} />
                        <AccuracyInput onlyNumber maxNumber={existValueNumsInDescription(rtData.description)} value={rtData.threshHold} onChange={(val) => {
                            setRtData({
                                ...rtData,
                                threshHold: Number(val) || 1
                            })
                        }} maxLength={3} />
                    </>
                }
                {/* <RequestBtn hover onClick={() => {
                    Axios("PUT", UpdateRealTimeThresholdApi, {
                        threshold: accuracy
                    })
                }}>
                    변경
                </RequestBtn> */}
                <RequestBtn icon={rtStatus === PROGRESS_STATUS['RUNNING'] ? realtimeStopIcon : realtimeStartIcon} disabled={!rtData.type} hover onClick={async () => {
                    if (rtStatus === PROGRESS_STATUS['IDLE']) {
                        // if (rtData.type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) return message.error({ title: '입력값 에러', msg: '인상착의로는 실시간 분석을 사용할 수 없습니다.' })
                        setRtStatus(PROGRESS_STATUS['RUNNING'])
                    } else {
                        cancelFunc()
                        // if(res) {
                        // }
                    }
                }}>
                    {rtStatus === PROGRESS_STATUS['RUNNING'] ? '실시간 분석 중지' : '실시간 분석 재시작'}
                </RequestBtn>
            </LocalParamsContainer>
        </InputRow>
        <ResultsContainer>
            <ResultDetailsContainer>
                <ResultImagesContainer>
                    <ResultImagesScrollContainer>
                        {images.map((_, ind) => <ResultImageBox
                            onClickCallback={() => {
                                if (JSON.stringify(selectedRef.current) === JSON.stringify(_)) {
                                    if (timerId) clearInterval(timerId)
                                    if (rtStatus === PROGRESS_STATUS['RUNNING']) timerId = setInterval(intervalCallback, 500)
                                }
                            }}
                            data={_}
                            y={ind}
                            key={JSON.stringify(_)}
                            selected={selected}
                            setSelected={setSelected}
                        />)}
                    </ResultImagesScrollContainer>
                </ResultImagesContainer>
                <ResultDetailContainer>
                    <ResultDetailMediasContainer>
                        <ResultDetailMediaContainer>
                            <ResultDetailTitle>
                                캡쳐된 이미지
                            </ResultDetailTitle>
                            <ResultDetailImageContainer>
                                <ImageView src={selected?.imageURL} />
                            </ResultDetailImageContainer>
                        </ResultDetailMediaContainer>
                        <ResultDetailMediaContainer>
                            <ResultDetailTitle>
                                라이브 영상
                            </ResultDetailTitle>
                            <ResultDetailVideoContainer>
                                <Video cctvId={selected?.cameraId} objectFit="contain" />
                            </ResultDetailVideoContainer>
                        </ResultDetailMediaContainer>
                    </ResultDetailMediasContainer>
                    <ResultDetailDescriptionContainer>
                        <ResultDetailTitle>
                            상세 정보
                        </ResultDetailTitle>
                        <ResultDetailDescriptionTextContainer>
                            <ResultDetailDescriptionRow>
                                <ResultDetailDescriptionCol>
                                    CCTV 이름
                                </ResultDetailDescriptionCol>
                                <ResultDetailDescriptionCol>
                                    {selected?.cameraId ? <CCTVNameById cctvId={selected.cameraId}/> : '정보 없음'}
                                </ResultDetailDescriptionCol>
                            </ResultDetailDescriptionRow>
                            <ResultDetailDescriptionRow>
                                <ResultDetailDescriptionCol>
                                    유사율
                                </ResultDetailDescriptionCol>
                                <ResultDetailDescriptionCol>
                                    {selected?.accuracy || (selected?.max && selected.min ? `${selected.min} ~ ${selected.max}` : 0)}%
                                </ResultDetailDescriptionCol>
                            </ResultDetailDescriptionRow>
                            <ResultDetailDescriptionRow>
                                <ResultDetailDescriptionCol>
                                    탐지된 시간
                                </ResultDetailDescriptionCol>
                                <ResultDetailDescriptionCol>
                                    {selected?.timestamp || '정보 없음'}
                                </ResultDetailDescriptionCol>
                            </ResultDetailDescriptionRow>
                        </ResultDetailDescriptionTextContainer>
                        <ResultDetailMapContainer>
                            <MapComponent isDebug onlyMap noSelect idForViewChange={selected ? selected.cameraId : undefined} selectedCCTVs={selected ? [selected.cameraId] : undefined} />
                        </ResultDetailMapContainer>
                    </ResultDetailDescriptionContainer>
                </ResultDetailContainer>
            </ResultDetailsContainer>
        </ResultsContainer>
    </Container>
}

export default RealTimeReID

const Container = styled.div`
    background-color: ${SectionBackgroundColor};
    padding: 12px 16px;
    width: 100%;
    height: 100%;
`

const InputRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '12px' })}
    height: 40px;
    font-size: 1.1rem;
    width: 100%;
`

const GlobalParamsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px' })}
    height: 100%;
`

const LocalParamsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end', gap: '12px' })}
    height: 100%;
    font-size: 1.1rem;
`

const AccuracyInput = styled(Input)`
    height: 100%;
    width: 60px;
`

const RequestBtn = styled(Button)`
    height: 100%;
    border-width: 0px;
    padding: 4px 16px;
`

const ResultsContainer = styled.div`
    height: calc(100% - 40px);
    width: 100%;
    padding-top: 8px;
`

const ResultDetailsContainer = styled.div`
    height: 100%;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const ResultImagesContainer = styled.div`
    height: 100%;
    width: 360px;
    padding: 8px;
    ${globalStyles.contentsBorder}
`

const ResultImagesScrollContainer = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    overflow: auto;
`

const ResultImageBox = styled(ImageComponent)`
    ${globalStyles.fadeOut()}
    & img {
        object-fit: fill;
    }
`

const ResultDetailContainer = styled.div`
    height: 100%;
    width: calc(100% - 360px - 12px);
    ${globalStyles.flex({ flexDirection: 'row' })}
    margin-left: 12px;
    ${globalStyles.contentsBorder}
    padding: 12px;
`

const ResultDetailMediasContainer = styled.div`
    width: 59%;
    display: inline-block;
    height: 100%;
`

const ResultDetailMediaContainer = styled.div`
    width: 100%;
    height: 50%;
`

const ResultDetailImageContainer = styled.div`
    width: 100%;
    height: calc(100% - 32px);
    ${globalStyles.flex()}
    padding: 8px 0;
`

const ResultDetailVideoContainer = styled.div`
    height: calc(100% - 32px);
    width: 100%;
    ${globalStyles.flex()}
    padding: 8px 0;
`

const ResultDetailTitle = styled.div`
    height: 32px;
    background-color: ${ButtonBorderColor};
    border-radius: 12px;
    width: 100%;
    ${globalStyles.flex()}
`

const ResultDetailDescriptionContainer = styled.div`
    width: 40%;
    margin-left: 1%;
    display: inline-block;
    height: 100%;
    ${globalStyles.flex()}
`

const ResultDetailDescriptionRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    height: 36px;
    padding: 4px 0;
`

const ResultDetailDescriptionCol = styled.div`
    &:nth-child(2) {
        background-color: ${InputBackgroundColor};
        border-radius: 8px;
    }
    height: 100%;
    flex: 1;
    ${globalStyles.flex()}
`

const ResultDetailMapContainer = styled.div`
    width: 100%;
    height: calc(100% - ${48 + 36 * 3}px);
`

const ResultDetailDescriptionTextContainer = styled.div`
    width: 100%;
    margin: 8px 0;
`

const TypeTag = styled(Button)`
`

const ObjectTag = styled(Button)`
    position: relative;
    z-index: 100;
    &:not(:hover) > div {
        display: none;
    }   
`

const ObjectImageContainer = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background-color: ${GlobalBackgroundColor};
    border-radius: 8px;
    z-index: 100;
`