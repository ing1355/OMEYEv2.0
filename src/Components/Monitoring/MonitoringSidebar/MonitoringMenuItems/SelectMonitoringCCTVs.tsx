import { useRecoilState } from "recoil"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import styled from "styled-components"
import { SectionBackgroundColor } from "../../../../styles/global-styled"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"
import { CameraDataType } from "../../../../Constants/GlobalTypes"
import { useEffect } from "react"

const SelectMonitoringCCTVs = () => {
    const [visible, setVisible] = useRecoilState(MonitoringDatas('visible'))
    const [selectedCCTVs, setSelectedCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))

    return <>
        <MonitoringSidebarButton onClick={() => {
            setVisible(!visible)
        }}>
            cctv
        </MonitoringSidebarButton>
        <ListContainer visible={visible as boolean} onClick={(e) => {
            e.stopPropagation()
        }}>
            <InnerContainer>
                <TreeAndMapComponent defaultValue={selectedCCTVs as CameraDataType['cameraId'][]} onChange={selected => {
                    setSelectedCCTVs(selected)
                }} />
            </InnerContainer>
        </ListContainer>
    </>
}

export default SelectMonitoringCCTVs

const ListContainer = styled.div<{ visible: boolean }>`
    position: absolute;
    width: ${({ visible }) => visible ? 812.5 : 0}px;
    height: ${({ visible }) => visible ? 800 : 0}px;
    right: 63px;
    top: 10%;
    transition: all .3s ease-out;
    overflow: hidden;
    z-index: 9999;
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
        border-left: 8px solid red;
        top: 11px;
        right: 5px;
        position: absolute;
    }
`