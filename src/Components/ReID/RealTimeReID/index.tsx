import styled from "styled-components"
import { ButtonBorderColor, ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, InputBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import { useEffect, useReducer, useRef, useState } from "react"
import Button from "../../Constants/Button"
import { RealTimeReidApi, ReidCancelApi, SseStartApi } from "../../../Constants/ApiRoutes"
import { useRecoilState, useRecoilValue } from "recoil"
import { REALTIMESTATUS, realTimeStatus } from "../../../Model/RealTimeDataModel"
import { Axios, reidCancelFunc } from "../../../Functions/NetworkFunctions"
import { conditionData } from "../../../Model/ConditionDataModel"
import { ArrayDeduplication, getColorByScore } from "../../../Functions/GlobalFunctions"
import { setStateType } from "../../../Constants/GlobalTypes"
import Video from "../../Constants/Video"
import ImageView from "../Condition/Constants/ImageView"
import MapComponent from "../../Constants/Map"

const testDataSet = (threshHold: number) => ({
    cameraIdList: [612],
    objectId: 1472,
    threshHold,
})

const imageBoxHeight = 200

let sse

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
        border: (selected && selected.imageURL === data.imageURL) ? `1px solid ${ContentsActivateColor}` : `1px solid ${ContentsBorderColor}`
    }} className={className} onClick={() => {
        setSelected(data)
    }}>
        <div style={{
            position: 'absolute',
            top: '4px',
            right: '8px',
            fontWeight: 'bold',
            fontSize: '.8rem',
            backgroundColor: getColorByScore(data.maxScore),
            padding: '4px 6px',
            borderRadius: '12px'
        }}>
            {data.maxScore}%
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
            backgroundColor: (selected && selected.imageURL === data.imageURL) ? ContentsActivateColor : ContentsBorderColor
        }}>
            {y + 1}
        </div>
        <img src={data.imageURL} style={{
            width: '100%',
            height: '100%'
        }} />
    </div>
};

type RealTimeDataType = {
    imageURL: string
    timestamp: string
    maxScore: number
    cameraId: number
    error?: string
}

let images: RealTimeDataType[] = []

const RealTimeReID = () => {
    const [selected, setSelected] = useState<RealTimeDataType | null>(null)
    const [occurancy, setOccurancy] = useState(50)
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
    const [rtStatus, setRtStatus] = useRecoilState(realTimeStatus)
    const { cctv, targets } = useRecoilValue(conditionData)

    useEffect(() => {
        if (rtStatus === REALTIMESTATUS['RUNNING']) {
            window.addEventListener("unload", reidCancelFunc);
            RealTimeSseSetting()
            Axios("POST", RealTimeReidApi, testDataSet(occurancy) || {
                cameraIdList: ArrayDeduplication(cctv.filter(_ => _.selected).flatMap(_ => _.cctvList)),
                objectId: targets.filter(_ => _.selected)[0].objectId,
                threshHold: occurancy,
            }).then(res => {
                console.log(res)
            }).catch(err => {
                setRtStatus(REALTIMESTATUS['IDLE'])
            })
        } else {
            window.removeEventListener("unload", reidCancelFunc);
        }
    }, [rtStatus])

    // useEffect(() => {
    //     setInterval(() => {
    //         images.unshift("/file/reidResult/1927/img/697_camera_1927_0_/1_20230807000000_0_69966dot66666666667sec_390_452_465_648_frame.png")
    //         forceUpdate()
    //     },1000)
    // },[])

    const RealTimeSseSetting = () => {
        sse = new EventSource(SseStartApi);
        // sse = new EventSource(SseTestApi);
        sse.onopen = (e: any) => {
            console.log("open : ", e);
            setInterval(() => {
                images.splice(50,).forEach(_ => {
                    URL.revokeObjectURL(_.imageURL)
                })
                forceUpdate()
            }, 500)
        };
        sse.onmessage = (res: MessageEvent) => {
            const data: RealTimeDataType = JSON.parse(
                res.data.replace(/\\/gi, "")
            );
            const image = new Image();
            image.src = data.imageURL;
            image.crossOrigin = "Anonymous";
            image.onload = (e) => {
                fetch(data.imageURL)
                    .then((res) => res.blob())
                    .then((blob) => {
                        images.unshift({
                            imageURL: URL.createObjectURL(blob),
                            timestamp: data.timestamp,
                            cameraId: data.cameraId,
                            maxScore: data.maxScore,
                        })
                        image.onload = null;
                        image.src = '';
                        image.remove()
                    })
                    .catch((err) => {
                        console.log("Image Fetch Fail! ", err);
                    });
            }
        };
        sse.onerror = (e: any) => {
            e.target.close();
        };
    };

    return <Container>
        <InputRow>
            최소 유사율(%) : <OccurancyInput value={occurancy} onChange={(val) => {
                setOccurancy(Number(val))
            }} maxLength={3} />
            <RequestBtn>
                변경
            </RequestBtn>
            <RequestBtn concept="activate" onClick={() => {
                if (rtStatus === REALTIMESTATUS['IDLE']) {
                    setRtStatus(REALTIMESTATUS['RUNNING'])
                } else {
                    Axios("POST", ReidCancelApi).then(res => {
                        setRtStatus(REALTIMESTATUS['IDLE'])
                    })
                }
            }}>
                {rtStatus === REALTIMESTATUS['RUNNING'] ? '실시간 분석 중지' : '실시간 분석 시작'}
            </RequestBtn>
        </InputRow>
        <ResultsContainer>
            <ResultDetailsContainer>
                <ResultImagesContainer>
                    <ResultImagesScrollContainer>
                        {images.map((_, ind) => <ResultImageBox data={_} y={ind} key={_.imageURL} selected={selected} setSelected={setSelected} />)}
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
                                    {selected?.maxScore || 0}%
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
                            <MapComponent singleCamera={selected?.cameraId} forSingleCamera noSearch />
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

const OccurancyInput = styled(Input)`
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