import styled from "styled-components"
import { GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import { useEffect, useRef, useState } from "react"
import { CameraDataType } from "../../../../../Constants/GlobalTypes"
import SelectedCCTVListItem from "./SelectedCCTVListItem"
import SelectedCCTVDetailContainer from "./SelectedCCTVDetailContainer"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { conditionTargetDatasCCTVTemp, selectedConditionObjectType } from "../../../../../Model/ConditionDataModel"
import TreeAndMapComponent from "../../../../Constants/TreeAndMapComponent"
import TimeModal, { TimeModalDataType } from "../../Constants/TimeModal"
import useMessage from "../../../../../Hooks/useMessage"

const CCTVVideo = () => {
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [selectedVideo, setSelectedVideo] = useState<CameraDataType | null>(null)
    const [timeOpened, setTimeOpened] = useState(false)
    const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined)
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const setCctvDatasTemp = useSetRecoilState(conditionTargetDatasCCTVTemp)
    const [grabbed, setGrabbed] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const message = useMessage()

    useEffect(() => {
        if(!selectedCCTVs.find(_ => _ === selectedVideo?.cameraId)) setSelectedVideo(null)
    },[selectedCCTVs])

    useEffect(() => {
        setCctvDatasTemp([])
        if (selectedVideo && containerRef.current) {
            containerRef.current.scrollTo({
                behavior: 'smooth',
                left: containerRef.current.clientWidth
            })
        }
    }, [selectedVideo])

    useEffect(() => {
        if(grabbed) {
            document.addEventListener('mouseup', () => {
                setGrabbed(false)
            }, {
                once: true
            })
        }
    },[grabbed])

    useEffect(() => {
        setSelectedVideo(null)
    },[currentObjectType])

    return <>
        <Container ref={containerRef} onMouseEnter={e => {
            e.currentTarget.style.cursor = 'grab'
        }} onMouseDown={e => {
            e.currentTarget.style.cursor = 'grabbing'
            setGrabbed(true)
        }} onMouseLeave={e => {
            e.currentTarget.style.cursor = 'default'
        }} onMouseUp={e => {
            e.currentTarget.style.cursor = 'grab'
        }} onMouseMove={e => {
            if(grabbed) {
                e.currentTarget.scrollBy({
                    left: e.movementX*-1
                })
            }
        }}>
            <TreeMapComponentContainer>
                <TreeAndMapComponent selectedCCTVs={selectedCCTVs} setSelectedCCTVs={(cctvs) => {
                    if(cctvs.length > 15) return message.error({title: "입력값 에러", msg: "너무 많은 수를 선택하였습니다.(최대 15개)"})
                    setSelectedCCTVs(cctvs)
                }} />
            </TreeMapComponentContainer>
            <SelectedCCTVListContainer selected={selectedVideo !== null}>
                <FlexContainer>
                    {
                        selectedCCTVs.map(_ => <SelectedCCTVListItem key={_} cctvId={_} selectedCCTVs={selectedCCTVs} setSelectedCCTVs={setSelectedCCTVs} selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />)
                    }
                </FlexContainer>
            </SelectedCCTVListContainer>
            <SelectedCCTVDetailContainer selected={selectedVideo} setSelected={setSelectedVideo} setTimeModalOpened={setTimeOpened} timeValue={timeValue} />
        </Container>
        <TimeModal title="시간 선택" visible={timeOpened} close={() => {
            setTimeOpened(false)
        }} defaultValue={timeValue} onChange={date => {
            if (date) setTimeValue(date)
        }} noEndTime />
    </>
}

export default CCTVVideo

const Container = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '1%' })}
    overflow: auto;
    position: relative;
`

const TreeMapComponentContainer = styled.div`
    height: 100%;
    flex: 0 0 49.5%;
    position: relative;
    border: 1px solid black;
    overflow: auto;
    transition: left .25s ease-out;
    z-index: 10;
`

const SelectedCCTVListContainer = styled.div<{ selected: boolean }>`
    height: 100%;
    flex: 0 0 49.5%;
    border: 1px solid black;
    position: relative;
    transition: left .25s ease-out;
    overflow: auto;
    z-index: 11;
    background-color: ${SectionBackgroundColor};
    border-radius: 10px;
    padding: 12px 16px;
`

const FlexContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-start' })}
`

