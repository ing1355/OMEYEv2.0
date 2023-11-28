import styled from "styled-components"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import CaptureImageContainer from "../../Constants/CaptureImageContainer"
import Button from "../../../../Constants/Button"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { conditionTargetDatasCCTVTemp } from "../../../../../Model/ConditionDataModel"
import { CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys, setStateType } from "../../../../../Constants/GlobalTypes"
import maskIcon from "../../../../../assets/img/maskIcon.png"
import modalCloseIcon from "../../../../../assets/img/modalCloseIcon.png"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Constants/Params"
import Video from "../../../../Constants/Video"
import ImageView from "../../Constants/ImageView"
import { convertFullTimeString, convertFullTimeStringToHumanTimeFormat, convertFullTimeStringToHumanTimeFormatByDate } from "../../../../../Functions/GlobalFunctions"
import { ObjectTypes } from "../../../ConstantsValues"
import { TimeModalDataType } from "../../Constants/TimeModal"
import ResetIcon from '../../../../../assets/img/resetIcon.png'
import useMessage from "../../../../../Hooks/useMessage"
import ForLog from "../../../../Constants/ForLog"
import { conditionRoute } from "../../../../../Model/ConditionRouteModel"

type SelectedCCTVDetailContainerProps = {
    selected: CameraDataType | null
    setSelected: setStateType<CameraDataType | null>
    setTimeModalOpened: setStateType<boolean>
    timeValue?: TimeModalDataType
}

const SelectedCCTVDetailContainer = ({ selected, setSelected, setTimeModalOpened, timeValue }: SelectedCCTVDetailContainerProps) => {
    const [captureSrc, setCaptureSrc] = useState<string | undefined>(undefined)
    const [captureTime, setCaptureTime] = useState<string>('')
    const [targetList, setTargetList] = useRecoilState(conditionTargetDatasCCTVTemp)
    const routeInfo = useRecoilValue(conditionRoute)
    const message = useMessage()

    const captureCallback = (resultList: CaptureResultListItemType[]) => {
        setTargetList(targetList.map(_ => ({
            ..._,
            isCurrent: false
        })).concat(resultList.map(_ => ({
            ..._,
            method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['CCTV']],
            cctvName: selected?.name,
            selected: false,
            time: captureTime,
            isCurrent: true
        }))))
    }

    useEffect(() => {
        if (!selected) setCaptureSrc(undefined)
    }, [selected])

    useEffect(() => {
        if(targetList.length > 0) {
            setTargetList(targetList.map(_ => ({
                ..._,
                selected: false
            })))
        }
    },[routeInfo])

    return <>
        <Container visible={selected !== null}>
            <DetailTitle>
                {selected?.name}
                <img src={modalCloseIcon} style={{
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    padding: '4px',
                    position: 'absolute',
                    right: 16,
                    top: 24,
                    pointerEvents: 'auto'
                }} onClick={() => {
                    setSelected(null)
                }} />
            </DetailTitle>
            {/* <DetailInfoRow>
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
            </DetailInfoRow> */}
            <VideosContainer>
                <VideosInnerContainer>
                    <VideosTitle>
                        라이브 영상
                    </VideosTitle>
                    <VideoContainer>
                        <StreamingVideo cctvId={selected?.cameraId} />
                    </VideoContainer>
                    <VideoCaptureBtn hover onClick={(e) => {
                        const target = e.currentTarget.previousElementSibling?.childNodes[0].childNodes[0] as HTMLVideoElement
                        if (target.played.length === 0) return message.error({
                            title: "입력값 에러",
                            msg: "캡처할 영상이 존재하지 않습니다."
                        })
                        let canvas = document.createElement("canvas");
                        canvas.width = target.videoWidth;
                        canvas.height = target.videoHeight;
                        let ctx = canvas.getContext("2d")!;
                        ctx.drawImage(target, 0, 0, target.videoWidth, target.videoHeight);
                        setCaptureSrc(canvas.toDataURL())
                        setCaptureTime(convertFullTimeString(new Date()))
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
                            <StreamingTimeInput hover onClick={() => {
                                setTimeModalOpened(true)
                            }}>
                                {timeValue ? convertFullTimeStringToHumanTimeFormat(timeValue.startTime) : '--년--월--일 --시--분--초'}
                            </StreamingTimeInput>
                        </div>
                    </VideosTitle>
                    <VideoContainer>
                        <StreamingVideo cctvId={selected?.cameraId} isTime timeValue={timeValue} />
                    </VideoContainer>
                    <VideoCaptureBtn hover onClick={(e) => {
                        const target = e.currentTarget.previousElementSibling?.childNodes[0].childNodes[0] as HTMLVideoElement
                        if (target.played.length === 0) return message.error({
                            title: "입력값 에러",
                            msg: "캡처할 영상이 존재하지 않습니다."
                        })
                        let canvas = document.createElement("canvas");
                        canvas.width = target.videoWidth;
                        canvas.height = target.videoHeight;
                        let ctx = canvas.getContext("2d")!;
                        ctx.drawImage(target, 0, 0, target.videoWidth, target.videoHeight);
                        setCaptureSrc(canvas.toDataURL())
                        const tempTime = new Date(convertFullTimeStringToHumanTimeFormat(timeValue!.startTime))
                        tempTime.setSeconds(tempTime.getSeconds() + Math.floor(target.currentTime))
                        setCaptureTime(convertFullTimeString(tempTime))
                    }}>
                        캡처
                    </VideoCaptureBtn>
                </VideosInnerContainer>
            </VideosContainer>
            <CaptureImageContainer src={captureSrc} captureCallback={captureCallback} type="CCTV"/>
            <DetailTitle>
                대상 조회 결과
                <ResetBtn disabled={targetList.length === 0} onClick={() => {
                    setTargetList([])
                }}>
                    <img src={ResetIcon} width="100%" height="100%" />
                </ResetBtn>
            </DetailTitle>
            <CaptureResultListItemsContainer>
                {
                    targetList.map((_, ind) => <CaptureResultListItemBox key={ind} selected={_.selected!}>
                        <CaptureResultListItemImageContainer>
                            <CaptureResultListItemImage src={_.src} isFace={_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']]} style={{
                                height: _.time ? 'calc(100% - 24px)' : '100%'
                            }} />
                            {_.time && <CaptureResultListItemTimeText>
                                {convertFullTimeStringToHumanTimeFormat(_.time)}
                            </CaptureResultListItemTimeText>}
                        </CaptureResultListItemImageContainer>
                        <CaptureResultListItemFaceSelectContainer>
                            {_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <MaskSelect hover activate={_.mask || false} onClick={() => {
                                setTargetList(targetList.map((__, _ind) => ind === _ind ? ({
                                    ...__,
                                    mask: !__.mask
                                }) : __))
                            }}>
                                <img src={maskIcon} />
                            </MaskSelect>}
                            <CaptureResultListItemSelectButton hover activate={_.selected!} selected={_.selected!} isMask={_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']]} onClick={() => {
                                setTargetList(targetList.map((__, _ind) => {
                                    return ind === _ind ? {
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
    overflow-y: auto;
    display: ${({ visible }) => visible ? 'block' : 'none'};
`

const DetailTitle = styled.div`
    font-size: 1.8rem;
    height: 32px;
    margin-bottom: 12px;
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
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '4px', flexWrap: 'wrap' })}
`

const CaptureResultListItemBox = styled.div<{ selected: boolean }>`
    flex: 0 0 200px;
    height: 200px;
    ${globalStyles.flex({gap: '3px'})}
`

const CaptureResultListItemImageContainer = styled.div`
    height: calc(100% - 43px);
    border: 1px solid ${ContentsBorderColor};
    width: 100%;
    ${globalStyles.flex()}
`

const CaptureResultListItemImage = styled(ImageView) <{ isFace: boolean }>`
    
`

const CaptureResultListItemTimeText = styled.div`
    ${globalStyles.flex()}
    height: 24px;
`

const MaskSelect = styled(Button)`
    padding: 4px;
    height: 100%;
    width: 40px;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const CaptureResultListItemFaceSelectContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    width: 100%;
    height: 36px;
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
    height: 324px;
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
    border: 1px solid ${ContentsBorderColor};
`

const StreamingVideo = styled(Video)`
    height: 100%;
`

const VideoCaptureBtn = styled(Button)`
    width: 100%;
    margin-top: 3px;
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

const ResetBtn = styled(Button)`
    height: 30px;
    width: 30px;
    padding: 4px;
    margin-left: 12px;
`