import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import CaptureImageContainer from "../../Constants/CaptureImageContainer"
import Button from "../../../../Constants/Button"
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { conditionTargetDatasCCTVTemp } from "../../../../../Model/ConditionDataModel"
import { CameraDataType, CaptureResultListItemType, setStateType } from "../../../../../Constants/GlobalTypes"
import maskOffIcon from "../../../../../assets/img/maskOffIcon.png"
import maskOnIcon from "../../../../../assets/img/maskOnIcon.png"
import modalCloseIcon from "../../../../../assets/img/modalCloseIcon.png"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Constants/Params"
import Video from "../../../../Constants/Video"
import ImageView from "../../Constants/ImageView"
import Input from "../../../../Constants/Input"
import TimeModal, { TimeModalDataType } from "../../Constants/TimeModal"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../../Functions/GlobalFunctions"
import { Axios } from "../../../../../Functions/NetworkFunctions"
import { GetCameraVideoUrlApi } from "../../../../../Constants/ApiRoutes"
import RtspPlayer from "../../../../../Functions/StreamingControls"

type SelectedCCTVDetailContainerProps = {
    selected: CameraDataType | null
    setSelected: setStateType<CameraDataType | null>
}

let savedVideoPlayer: RtspPlayer;

const SelectedCCTVDetailContainer = ({ selected, setSelected }: SelectedCCTVDetailContainerProps) => {
    const [captureSrc, setCaptureSrc] = useState<string | undefined>(undefined)
    const [targetList, setTargetList] = useRecoilState(conditionTargetDatasCCTVTemp)
    const [timeOpened, setTimeOpened] = useState(false)
    const [timeValue, setTimeValue] = useState<TimeModalDataType|undefined>(undefined)
    const savedVideoRef = useRef<HTMLVideoElement>(null)

    const captureCallback = (resultList: CaptureResultListItemType[]) => {
        setTargetList(targetList.concat(resultList.map(_ => ({
            ..._,
            method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['CCTV']],
            cctvName: selected?.name,
            selected: false
        }))))
    }

    useEffect(() => {
        if(timeValue) {
            Axios('GET', GetCameraVideoUrlApi(selected?.cameraId!, timeValue.startTime)).then(({uuid, url}) => {
                if(uuid) {
                    if(savedVideoPlayer) {
                        savedVideoPlayer.changeStream(uuid, savedVideoRef.current!)
                    } else {
                        savedVideoPlayer = new RtspPlayer(savedVideoRef.current!, RtspPlayer.types.HLS, uuid)
                    }
                } else {
                    if(savedVideoRef.current) savedVideoRef.current.src = url
                }
            })
        }
    },[timeValue])

    return <>
        <Container visible={selected !== null}>
            <DetailTitle>
                {selected?.name}
                <img src={modalCloseIcon} style={{
                    cursor: 'pointer',
                    height: '100%',
                    padding: '4px'
                }} onClick={() => {
                    setSelected(null)
                }} />
            </DetailTitle>
            <DetailInfoRow>
                <DetailInfoCol>
                    주소
                </DetailInfoCol>
                <DetailInfoCol>
                    {selected?.address}
                </DetailInfoCol>
            </DetailInfoRow>
            <DetailInfoRow>
                <DetailInfoCol>
                    위도
                </DetailInfoCol>
                <DetailInfoCol>
                    {selected?.latitude}
                </DetailInfoCol>
            </DetailInfoRow>
            <DetailInfoRow>
                <DetailInfoCol>
                    경도
                </DetailInfoCol>
                <DetailInfoCol>
                    {selected?.longitude}
                </DetailInfoCol>
            </DetailInfoRow>
            <VideosContainer>
                <VideosInnerContainer>
                    <VideosTitle>
                        라이브 영상
                    </VideosTitle>
                    <VideoContainer>
                        <StreamingVideo cctvId={selected?.cameraId} />
                    </VideoContainer>
                    <VideoCaptureBtn onClick={(e) => {
                        const target = e.currentTarget.previousElementSibling?.childNodes[0].childNodes[0] as HTMLVideoElement
                        if (!target.played) return console.log('비디오 준비중!!')
                        let canvas = document.createElement("canvas");
                        canvas.width = target.videoWidth;
                        canvas.height = target.videoHeight;
                        let ctx = canvas.getContext("2d")!;
                        ctx.drawImage(target, 0, 0, target.videoWidth, target.videoHeight);
                        setCaptureSrc(canvas.toDataURL())
                    }}>
                        캡처
                    </VideoCaptureBtn>
                </VideosInnerContainer>
                <VideosInnerContainer>
                    <VideosTitle>
                        <div>
                            과거 영상
                        </div>
                        <div>
                            <StreamingTimeInput onClick={() => {
                                setTimeOpened(true)
                            }}>
                                {timeValue ? convertFullTimeStringToHumanTimeFormat(timeValue.startTime) : '--년--월--일 --시--분--초'}
                            </StreamingTimeInput>
                        </div>
                    </VideosTitle>
                    <VideoContainer>
                        <SavedVideo ref={savedVideoRef} autoPlay/>
                    </VideoContainer>
                    <VideoCaptureBtn onClick={(e) => {
                         const target = e.currentTarget.previousElementSibling?.childNodes[0] as HTMLVideoElement
                         if (!target.played) return console.log('비디오 준비중!!')
                         let canvas = document.createElement("canvas");
                         canvas.width = target.videoWidth;
                         canvas.height = target.videoHeight;
                         let ctx = canvas.getContext("2d")!;
                         ctx.drawImage(target, 0, 0, target.videoWidth, target.videoHeight);
                         setCaptureSrc(canvas.toDataURL())
                    }}>
                        캡처
                    </VideoCaptureBtn>
                </VideosInnerContainer>
            </VideosContainer>
            <CaptureImageContainer src={captureSrc} captureCallback={captureCallback} />
            <DetailTitle>
                대상 조회 결과
            </DetailTitle>
            <CaptureResultListItemsContainer>
                {
                    targetList.map(_ => <CaptureResultListItemBox key={_.id} selected={_.selected!}>
                        <CaptureResultListItemImageContainer>
                            <CaptureResultListItemImage src={_.src} isFace={_.type === 'Face'} />
                        </CaptureResultListItemImageContainer>
                        <CaptureResultListItemFaceSelectContainer>
                            {_.type === 'Face' && <MaskSelectIcon src={maskOffIcon} height="90%" />}
                            <CaptureResultListItemSelectButton activate={_.selected!} selected={_.selected!} isMask={_.type === 'Face'} onClick={() => {
                                setTargetList(targetList.map(__ => {
                                    return __.id === _.id ? {
                                        ...__,
                                        selected: !__.selected
                                    } : __
                                }))
                            }}>
                                {_.selected ? '지정 해제' : '대상 지정'}
                            </CaptureResultListItemSelectButton>
                        </CaptureResultListItemFaceSelectContainer>

                    </CaptureResultListItemBox>)
                }
            </CaptureResultListItemsContainer>
        </Container>
        <TimeModal title="시간 선택" visible={timeOpened} setVisible={setTimeOpened} defaultValue={timeValue} onChange={date => {
            if(date) setTimeValue(date)
        }} noEndTime/>
    </>
}

export default SelectedCCTVDetailContainer

const Container = styled.div<{ visible: boolean }>`
    height: 100%;
    flex: 0 0 50%;
    padding: 24px 16px;
    position: relative;
    z-index: 1002;
    transition: left .25s ease-out;
    overflow: auto;
    ${({ visible }) => `left: ${visible ? -50 : 0}%;`}
`

const DetailTitle = styled.div`
    font-size: 1.8rem;
    height: 32px;
    margin-bottom: 12px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const DetailInfoRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    line-height: 28px;
    overflow: hidden;
`

const DetailInfoCol = styled.div`
    font-size: 1.1rem;
    &:first-child {
        flex: 0 0 30%;
    }
    &:last-child {
        flex: 0 0 70%;
        min-width: 0;
    }
`

const CaptureResultListItemsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' })}
`

const CaptureResultListItemBox = styled.div<{ selected: boolean }>`
    flex: 0 0 200px;
    height: 200px;
    ${globalStyles.flex()}
`

const CaptureResultListItemImageContainer = styled.div`
    height: calc(100% - 40px);
    border: 1px solid white;
    width: 100%;
    ${globalStyles.flex()}
`

const CaptureResultListItemImage = styled(ImageView) <{ isFace: boolean }>`
    width: 100%;
    height: 100%;
`

const MaskSelectIcon = styled.img`
    cursor: pointer;
`

const CaptureResultListItemFaceSelectContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    width: 100%;
    height: 40px;
`

const CaptureResultListItemSelectButton = styled(Button) <{ selected: boolean, isMask: boolean }>`
    ${({ isMask }) => `flex: 0 0 ${isMask ? 75 : 100}%;`}
    height: 100%;
    border-radius: 12px;
`

const VideosContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    margin-bottom: 16px;
`

const VideosInnerContainer = styled.div`    
    flex: 50%;
    height: 320px;
    margin-top: 12px;
`

const VideosTitle = styled.div`
    font-size: 1.3rem;
    & > div {
        height: 100%;
        font-size: 1.3rem;
        flex: 0 0 100px;
    }
    & > div:last-child {
        flex: 1;
        ${globalStyles.flex({ alignItems: 'flex-end' })}
    }
    height: 28px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const VideoContainer = styled.div`
    height: calc(100% - 60px);
    ${globalStyles.flex()}
    border: 1px solid white;
`

const StreamingVideo = styled(Video)`
    height: 100%;
`

const VideoCaptureBtn = styled(Button)`
    width: 100%;
    height: 32px;
`

const StreamingTimeInput = styled(Button)`
    background-color: ${SectionBackgroundColor};
    ${globalStyles.flex()}
    border-radius: 8px;
    height: 100%;
    cursor: pointer;
`

const SavedVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: fill;
`