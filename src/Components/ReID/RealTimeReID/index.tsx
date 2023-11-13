import styled from "styled-components"
import { ButtonBorderColor, ContentsActivateColor, ContentsBorderColor, InputBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"
import Button from "../../Constants/Button"
import { RealTimeReidApi, RealTimeReidCancelApi, SseStartApi, UpdateRealTimeThresholdApi } from "../../../Constants/ApiRoutes"
import { useRecoilState, useRecoilValue } from "recoil"
import { realTimeStatus } from "../../../Model/RealTimeDataModel"
import { Axios } from "../../../Functions/NetworkFunctions"
import { conditionData, selectedConditionObjectType } from "../../../Model/ConditionDataModel"
import { ArrayDeduplication, getColorByScore } from "../../../Functions/GlobalFunctions"
import { ReIDObjectTypeKeys, setStateType } from "../../../Constants/GlobalTypes"
import Video from "../../Constants/Video"
import ImageView from "../Condition/Constants/ImageView"
import MapComponent from "../../Constants/Map"
import useMessage from "../../../Hooks/useMessage"
import { CustomEventSource, GetAuthorizationToken } from "../../../Constants/GlobalConstantsValues"
import { PROGRESS_STATUS, SSEResponseStatusType } from "../../../Model/ProgressModel"
import { ObjectTypes } from "../ConstantsValues"

const imageBoxHeight = 200

const ImageComponent = ({ data, y, className, selected, setSelected }: {
    data: RealTimeDataType
    y: number
    className?: string
    selected: RealTimeDataType | null
    setSelected: setStateType<RealTimeDataType | null>
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
}

let timerId: NodeJS.Timer

const cancelFunc = (): void => {
    navigator.sendBeacon(RealTimeReidCancelApi, GetAuthorizationToken());
}

const RealTimeReID = () => {
    const [selected, setSelected] = useState<RealTimeDataType | null>(null)
    const [accuracy, setAccuracy] = useState(50)
    const [images, setImages] = useState<RealTimeDataType[]>([])
    const [rtStatus, setRtStatus] = useRecoilState(realTimeStatus)
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const { cctv, targets } = useRecoilValue(conditionData)
    const message = useMessage()
    const sseRef = useRef<EventSource>()
    const selectedRef = useRef(selected)
    const statusRef = useRef(rtStatus)
    const imagesRef = useRef<RealTimeDataType[]>([])

    useLayoutEffect(() => {
        selectedRef.current = selected
    }, [selected])

    useLayoutEffect(() => {
        statusRef.current = rtStatus
    }, [rtStatus])

    useEffect(() => {
        console.debug("RealTime Status Change : ", rtStatus)
        if (rtStatus === PROGRESS_STATUS['RUNNING']) {
            if (ArrayDeduplication(cctv.filter(_ => _.selected).flatMap(_ => _.cctvList)).length === 0) {
                setRtStatus(PROGRESS_STATUS['IDLE'])
                return message.error({ title: '입력값 에러', msg: 'cctv 목록이 선택되지 않았습니다.' })
            }
            if (targets.filter(_ => _.selected).length === 0) {
                setRtStatus(PROGRESS_STATUS['IDLE'])
                return message.error({ title: '입력값 에러', msg: '대상이 선택되지 않았습니다.' })
            }
            if (targets.filter(_ => _.selected).length > 1) {
                setRtStatus(PROGRESS_STATUS['IDLE'])
                return message.error({ title: '입력값 에러', msg: '여러 대상이 선택되었습니다.\n한 대상만 선택해주세요.' })
            }
            window.addEventListener("unload", cancelFunc);
            RealTimeSseSetting()
        } else {
            window.removeEventListener("unload", cancelFunc);
        }
    }, [rtStatus])

    const RealTimeSseSetting = () => {
        console.debug("RealTime Sse Setting")
        sseRef.current = CustomEventSource(SseStartApi);
        sseRef.current.onopen = async (e: any) => {
            console.debug("sse open realtime: ", e);
            const res = await Axios("POST", RealTimeReidApi, {
                cameraIdList: ArrayDeduplication(cctv.filter(_ => _.selected).flatMap(_ => _.cctvList)),
                objectId: targets.filter(_ => _.selected)[0].objectId,
                threshHold: accuracy,
            })
            if (res) {
                timerId = setInterval(() => {
                    if (imagesRef.current.length > 49) {
                        (selectedRef.current ?
                            imagesRef.current.splice(49, imagesRef.current.length - 49, imagesRef.current.find(_ => JSON.stringify(selectedRef.current) === JSON.stringify(_))!) :
                            imagesRef.current.splice(49, imagesRef.current.length - 49)).forEach(_ => {
                                URL.revokeObjectURL(_.imageURL)
                            })
                    }
                    setImages([...imagesRef.current])
                }, 1000)
            } else {
                setRtStatus(PROGRESS_STATUS['IDLE'])
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
                if (status === 'SSE_DESTROY') {
                    console.debug('realtime sse end')
                    if (imagesRef.current.length > 49) {
                        (selectedRef.current ?
                            imagesRef.current.splice(49, imagesRef.current.length - 49, imagesRef.current.find(_ => JSON.stringify(selectedRef.current) === JSON.stringify(_))!) :
                            imagesRef.current.splice(49, imagesRef.current.length - 49)).forEach(_ => {
                                URL.revokeObjectURL(_.imageURL)
                            })
                    }
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

    return <Container>
        <InputRow>
            최소 유사율(%) : <AccuracyInput onlyNumber maxNumber={100} value={accuracy} onChange={(val) => {
                setAccuracy(Number(val))
            }} maxLength={3} />
            <RequestBtn hover onClick={() => {
                Axios("PUT", UpdateRealTimeThresholdApi, {
                    threshold: accuracy
                })
            }}>
                변경
            </RequestBtn>
            <RequestBtn hover onClick={async () => {
                if (rtStatus === PROGRESS_STATUS['IDLE']) {
                    if (currentObjectType === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) return message.error({ title: '입력값 에러', msg: '인상착의로는 실시간 분석을 사용할 수 없습니다.' })
                    setRtStatus(PROGRESS_STATUS['RUNNING'])
                } else {
                    const res = await Axios("POST", RealTimeReidCancelApi)
                    setRtStatus(PROGRESS_STATUS['IDLE'])
                    // if(res) {
                    // }
                }
            }}>
                {rtStatus === PROGRESS_STATUS['RUNNING'] ? '실시간 분석 중지' : '실시간 분석 시작'}
            </RequestBtn>
        </InputRow>
        <ResultsContainer>
            <ResultDetailsContainer>
                <ResultImagesContainer>
                    <ResultImagesScrollContainer>
                        {images.map((_, ind) => <ResultImageBox data={_} y={ind} key={JSON.stringify(_)} selected={selected} setSelected={setSelected} />)}
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
                                    {selected?.cameraId || '정보 없음'}
                                </ResultDetailDescriptionCol>
                            </ResultDetailDescriptionRow>
                            <ResultDetailDescriptionRow>
                                <ResultDetailDescriptionCol>
                                    유사율
                                </ResultDetailDescriptionCol>
                                <ResultDetailDescriptionCol>
                                    {selected?.accuracy || 0}%
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
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end', gap: '12px' })}
    height: 40px;
    font-size: 1.1rem;
    width: 100%;
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