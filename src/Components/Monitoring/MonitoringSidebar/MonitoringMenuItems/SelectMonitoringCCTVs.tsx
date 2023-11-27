import { useRecoilState, useRecoilValue } from "recoil"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import styled from "styled-components"
import { ModalBoxShadow, SectionBackgroundColor } from "../../../../styles/global-styled"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"
import { CameraDataType, setStateType } from "../../../../Constants/GlobalTypes"
import useMessage from "../../../../Hooks/useMessage"
import { useEffect, useRef } from "react"
import { menuState } from "../../../../Model/MenuModel"

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
                }} visible={visible === 'CCTVs'}/>
            </InnerContainer>
        </ListContainer>
    </>
}

export default SelectMonitoringCCTVs

const ListContainer = styled.div<{ visible: boolean, index: number }>`
    position: absolute;
    width: ${({ visible }) => visible ? 810 : 0}px;
    height: ${({ visible }) => visible ? 800 : 0}px;
    right: 76px;
    top: ${({index}) => index * 56 + 32}px;
    transition: top .3s ease-out;
    z-index: 1004;
    overflow: ${({visible}) => visible ? 'visible' : 'hidden'};
    padding-right: 10px;
    &:after {
        content: "";
        width: 0px;
        height: 0px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid ${SectionBackgroundColor};
        top: 31px;
        right: -8px;
        position: absolute;
    }
    border-radius: 12px;
    box-shadow: ${ModalBoxShadow};
    background-color: ${SectionBackgroundColor};
`

const InnerContainer = styled.div`
    width: 800px;
    height: 800px;
`