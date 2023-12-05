import styled from "styled-components"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../styles/global-styled"
import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react"
import Video from "../Constants/Video"
import { useRecoilState, useRecoilValue } from "recoil"
import { MonitoringCCTVDataType, MonitoringDataType, MonitoringDatas } from "../../Model/MonitoringDataModel"
import { CameraDataType } from "../../Constants/GlobalTypes"
import CCTVNameById from "../Constants/CCTVNameById"
import { PROGRESS_STATUS } from "../../Model/ProgressModel"
import closeIcon from '../../assets/img/closeIcon.png'
import timeIcon from '../../assets/img/ProgressTimeIcon.png'
import noImage from '../../assets/img/logo.png'
import TimeModal, { TimeModalDataType } from "../ReID/Condition/Constants/TimeModal"

// let timerId: NodeJS.Timer
// let count = 0

const VideoCard = memo(({ data, timeVisibleChange }: {
    data: MonitoringCCTVDataType
    timeVisibleChange: (visible: boolean) => void
}) => {
    const [cctvs, setCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))
    const monitoringStatus = useRecoilValue(MonitoringDatas('status'))
    const {cctvId, time} = data || {}
    console.debug(data)
    return <>
        <VideoTitle hasIcon={!(!cctvId)} data-title={cctvId && <CCTVNameById cctvId={cctvId} />}>
            {cctvId && <VideoTimeIcon onClick={() => {
                timeVisibleChange(true)
            }}>
                <img src={timeIcon} />
            </VideoTimeIcon>}
            {monitoringStatus === PROGRESS_STATUS['RUNNING'] && cctvId ? <CCTVNameById cctvId={cctvId} /> : '정보 없음'}
            {cctvId && <VideoCloseIcon onClick={() => {
                setCCTVs((cctvs as MonitoringDataType['cctvs']).filter(_ => _.cctvId !== cctvId))
            }}>
                <img src={closeIcon} />
            </VideoCloseIcon>}
        </VideoTitle>
        {cctvId && <VideoInner>
            <Video cctvId={monitoringStatus === PROGRESS_STATUS['RUNNING'] ? cctvId : undefined} timeValue={time} />
        </VideoInner>}

    </>
}, (prev, next) => {
    if (JSON.stringify(prev.data) !== JSON.stringify(next.data)) return false
    return true
})

const Contents = () => {
    const monitoringLayoutNums = useRecoilValue(MonitoringDatas('layoutNum'))
    const [monitoringCCTVs, setMonitoringCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))
    const cctvListTemp = useRef<MonitoringDataType['cctvs']>(monitoringCCTVs as MonitoringDataType['cctvs'])
    const [timeVisible, setTimeVisible] = useState(-1)
    
    const cctvList = useMemo(() => {
        let count = 0
        const datas = monitoringCCTVs as MonitoringDataType['cctvs']
        let temp: MonitoringDataType['cctvs'] = Array.from({ length: monitoringLayoutNums as number }).map((_, ind) => ({
            cctvId: datas[ind] && datas[ind].cctvId,
            time: datas[ind] && datas[ind].time
        }))
        const _new = (monitoringCCTVs as MonitoringDataType['cctvs'])
        const _old = cctvListTemp.current
        console.debug(temp, _new, _old)
        const added = _new.filter(_ => !_old.find(__ => __ && __.cctvId === _.cctvId))
        const deleted = _old.filter(_ => !_new.find(__ => _ && __.cctvId === _.cctvId))
        console.debug(added, deleted)
        temp = temp.map((_, ind) => cctvListTemp.current[ind] ? (deleted.includes(cctvListTemp.current[ind]!) ? added[count++] : cctvListTemp.current[ind]) : added[count++])
        cctvListTemp.current = [...temp] as MonitoringDataType['cctvs']
        return temp
    }, [monitoringCCTVs, monitoringLayoutNums])
    
    return <>
        <ContentsContainer>
            <VideosContainer>
                <NoImage>
                    <img src={noImage} />
                </NoImage>
                {
                    cctvList.map((_, ind) => <VideoCardContainer layoutNum={monitoringLayoutNums as number} key={ind}>
                        <VideoCard data={_} timeVisibleChange={v => {
                            if(v) {
                                setTimeVisible(ind)
                            }
                        }}/>
                    </VideoCardContainer>)
                }
            </VideosContainer>
        </ContentsContainer>
        <TimeModal visible={timeVisible !== -1} title="영상 시간 선택" onChange={value => {
            console.debug(value, timeVisible, (monitoringCCTVs as MonitoringDataType['cctvs']).map((_, ind) => ind === timeVisible ? ({
                ..._,
                time: value
            }) : _))
            setMonitoringCCTVs((monitoringCCTVs as MonitoringDataType['cctvs']).map((_, ind) => ind === timeVisible ? ({
                ..._,
                time: value
            }) : _))
        }} noEndTime close={() => {
            setTimeVisible(-1)
        }} defaultValue={cctvList[timeVisible] && cctvList[timeVisible].time} />
    </>
}

export default Contents

const ContentsContainer = styled.div`
    flex: 1;
    height: 100%;
`

const VideosContainer = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexWrap: 'wrap', flexDirection: 'row' })}
    box-sizing: border-box;
`

const VideoCardContainer = styled.div<{ layoutNum: number }>`
    width: ${({ layoutNum }) => 100 / Math.sqrt(layoutNum)}%;
    height: ${({ layoutNum }) => 100 / Math.sqrt(layoutNum)}%;
    border: 1px solid ${ContentsBorderColor};
    background-color: transparent;
    position: relative;
`

const VideoTitle = styled.div<{ hasIcon: boolean }>`
    height: 24px;
    background-color: ${SectionBackgroundColor};
    line-height: 24px;
    text-align: center;
    padding: 0 4px;
    padding-right: ${({ hasIcon }) => hasIcon ? 50 : 4}px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    ${globalStyles.fadeOut()}
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

const VideoTimeIcon = styled.div`
    position: absolute;
    right: 26px;
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

const NoImage = styled.div`
    width: calc(100% - 64px);
    height: 100%;
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    ${globalStyles.flex()}
`