import { useRecoilState, useRecoilValue } from "recoil"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import styled from "styled-components"
import { SectionBackgroundColor } from "../../../../styles/global-styled"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"
import { CameraDataType, setStateType } from "../../../../Constants/GlobalTypes"
import useMessage from "../../../../Hooks/useMessage"
import { useEffect, useRef } from "react"

const SelectMonitoringCCTVs = ({index}: {
    index: number
}) => {
    const [visible, setVisible] = useRecoilState(MonitoringDatas('visible'))
    const [selectedCCTVs, setSelectedCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))
    const layoutNum = useRecoilValue(MonitoringDatas('layoutNum'))
    const selectedCCTVsRef = useRef(selectedCCTVs)
    const layoutNumRef = useRef(layoutNum)
    const message = useMessage()

    useEffect(() => {
        selectedCCTVsRef.current = selectedCCTVs
        layoutNumRef.current = layoutNum
        console.debug("Monitoring (selectedCCTVs, layoutNum) change : ", selectedCCTVs, layoutNum)
    },[selectedCCTVs, layoutNum])

    return <>
        <MonitoringSidebarButton onClick={() => {
            if(visible === 'CCTVs') setVisible(undefined)
            else setVisible('CCTVs')
        }}>
            cctv
        </MonitoringSidebarButton>
        <ListContainer index={index} visible={visible === 'CCTVs'} onClick={(e) => {
            e.stopPropagation()
        }}>
            <InnerContainer>
                <TreeAndMapComponent selectedCCTVs={selectedCCTVs as CameraDataType['cameraId'][]} setSelectedCCTVs={(cctvs) => {
                    if((layoutNumRef.current as number) < cctvs.length) message.error({title: "입력값 에러", msg: "화면 수보다 많은 수를 선택하였습니다."})
                    else (setSelectedCCTVs as setStateType<CameraDataType['cameraId'][]>)(cctvs)
                }} />
            </InnerContainer>
        </ListContainer>
    </>
}

export default SelectMonitoringCCTVs

const ListContainer = styled.div<{ visible: boolean, index: number }>`
    position: absolute;
    width: ${({ visible }) => visible ? 812.5 : 0}px;
    height: ${({ visible }) => visible ? 800 : 0}px;
    right: 66px;
    top: ${({index}) => index * 56 + 44}px;
    transition: all .3s ease-out;
    overflow: hidden;
    z-index: 1004;
`

const InnerContainer = styled.div`
    width: 800px;
    background-color: ${SectionBackgroundColor};
    height: 800px;
    padding: 6px;
    &:before {
        content: "";
        width: 0px;
        height: 0px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid ${SectionBackgroundColor};
        top: 11px;
        right: 5px;
        position: absolute;
    }
`