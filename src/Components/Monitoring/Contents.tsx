import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../styles/global-styled"
import { useEffect, useMemo, useReducer, useState } from "react"
import Video from "../Constants/Video"
import { useRecoilValue } from "recoil"
import { MonitoringDatas } from "../../Model/MonitoringDataModel"
import { CameraDataType } from "../../Constants/GlobalTypes"
import CCTVNameById from "../Constants/CCTVNameById"

const layoutNum = 64
const tempArr: CameraDataType['cameraId'][] = Array.from({length: layoutNum})
let timerId: NodeJS.Timer

const Contents = () => {
    const [count, setCount] = useState(0)
    const monitoringStatus = useRecoilValue(MonitoringDatas('status'))
    const monitoringCCTVs = useRecoilValue(MonitoringDatas('CCTVs'))
    const currentCCTVs = useMemo(() => tempArr.map((_, ind, arr) => {
        const temp = (monitoringCCTVs as CameraDataType['cameraId'][])
        if(ind >= temp.length) return undefined
        const target = temp[((layoutNum * count) + ind) % temp.length]
        return target
    }),[monitoringCCTVs, count])
    
    useEffect(() => {
        if(monitoringStatus === 'RUNNING') {
            setCount(0)
            timerId = setInterval(() => {
                setCount(c => c + 1)
            },10000)
        } else {
            clearInterval(timerId)
        }
    },[monitoringStatus])
    
    return <ContentsContainer>
        <VideosContainer>
            {
                tempArr.map((_, ind) => <VideoCard key={ind}>
                    <VideoTitle>
                        {monitoringStatus === 'RUNNING' && currentCCTVs[ind] ? <CCTVNameById cctvId={currentCCTVs[ind]!}/> : '정보 없음'}
                    </VideoTitle>
                    <VideoInner>
                        <Video cctvId={monitoringStatus === 'RUNNING' && currentCCTVs[ind] ? currentCCTVs[ind] : undefined}/>
                    </VideoInner>
                </VideoCard>)
            }
        </VideosContainer>
    </ContentsContainer>
}

export default Contents

const ContentsContainer = styled.div`
    flex: 1;
    height: 100%;
`

const VideosContainer = styled.div`
    height: 100%;
    ${globalStyles.flex({flexWrap:'wrap', flexDirection:'row'})}
`

const VideoCard = styled.div`
    flex: 0 0 ${100 / Math.sqrt(layoutNum)}%;
    height: ${100 / Math.sqrt(layoutNum)}%;
    border: 1px solid white;
`

const VideoTitle = styled.div`
    height: 24px;
    background-color: ${SectionBackgroundColor};
    ${globalStyles.flex()}
    padding: 0 4px;
`

const VideoInner = styled.div`
    height: calc(100% - 24px);
    ${globalStyles.flex()}
`