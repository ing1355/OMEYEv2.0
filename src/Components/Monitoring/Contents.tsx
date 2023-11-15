import styled from "styled-components"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../styles/global-styled"
import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react"
import Video from "../Constants/Video"
import { useRecoilState, useRecoilValue } from "recoil"
import { MonitoringDatas } from "../../Model/MonitoringDataModel"
import { CameraDataType } from "../../Constants/GlobalTypes"
import CCTVNameById from "../Constants/CCTVNameById"
import { PROGRESS_STATUS } from "../../Model/ProgressModel"
import closeIcon from '../../assets/img/closeIcon.png'

// let timerId: NodeJS.Timer
// let count = 0

const VideoCard = memo(({cctvId}: {
    cctvId: CameraDataType['cameraId']|undefined
}) => {
    const [cctvs, setCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))
    const monitoringStatus = useRecoilValue(MonitoringDatas('status'))

    return <>
        <VideoTitle>
            {monitoringStatus === PROGRESS_STATUS['RUNNING'] && cctvId ? <CCTVNameById cctvId={cctvId} /> : '정보 없음'}
            {cctvId && <VideoCloseIcon onClick={() => {
                setCCTVs((cctvs as number[]).filter(_ => _ !== cctvId))
            }}>
                <img src={closeIcon}/>
            </VideoCloseIcon>}
        </VideoTitle>
        <VideoInner>
            <Video cctvId={monitoringStatus === PROGRESS_STATUS['RUNNING'] ? cctvId : undefined} />
        </VideoInner>
    </>
}, (pre, next) => {
    if(pre.cctvId !== next.cctvId) return false
    return true
})

const Contents = () => {
    const monitoringLayoutNums = useRecoilValue(MonitoringDatas('layoutNum'))
    const monitoringCCTVs = useRecoilValue(MonitoringDatas('CCTVs'))
    const cctvListTemp = useRef<(CameraDataType['cameraId']|undefined)[]>([])
    const cctvList = useMemo(() => {
        let count = 0
        let temp: (number|undefined)[] = Array.from({length: monitoringLayoutNums as number})
        const _new = monitoringCCTVs as CameraDataType['cameraId'][]
        const _old = cctvListTemp.current as CameraDataType['cameraId'][]
        const added = _new.filter(_ => !_old.includes(_))
        const deleted = _old.filter(_ => !_new.includes(_))
        temp = temp.map((_, ind) => cctvListTemp.current[ind] ? (deleted.includes(cctvListTemp.current[ind]!) ? added[count++] : cctvListTemp.current[ind]) : added[count++])
        cctvListTemp.current = [...temp]
        return temp
    },[monitoringCCTVs, monitoringLayoutNums])

    return <ContentsContainer>
        <VideosContainer>
            {
                cctvList.map((_, ind) => <VideoCardContainer layoutNum={monitoringLayoutNums as number} key={ind}>
                    <VideoCard cctvId={cctvList[ind]}/>
                </VideoCardContainer>)
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
    ${globalStyles.flex({ flexWrap: 'wrap', flexDirection: 'row' })}
`

const VideoCardContainer = styled.div<{layoutNum: number}>`
    flex: 0 0 ${({layoutNum}) => 100 / Math.sqrt(layoutNum)}%;
    height: ${({layoutNum}) => 100 / Math.sqrt(layoutNum)}%;
    border: 1px solid ${ContentsBorderColor};
`

const VideoTitle = styled.div`
    height: 24px;
    background-color: ${SectionBackgroundColor};
    ${globalStyles.flex()}
    padding: 0 4px;
    position: relative;
`

const VideoCloseIcon = styled.div`
    position: absolute;
    right: 2px;
    top: 0;
    height: 100%;
    width: 24px;
    padding: 4px;
    cursor: pointer;
    ${globalStyles.flex()}
    & > img {
        width: 100%;
        height: 100%;
    }
`

const VideoInner = styled.div`
    height: calc(100% - 24px);
    ${globalStyles.flex()}
`