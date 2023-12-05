import { useRecoilState, useRecoilValue } from "recoil"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import { MonitoringDataType, MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import styled from "styled-components"
import { ModalBoxShadow, SectionBackgroundColor } from "../../../../styles/global-styled"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"
import { CameraDataType, setStateType } from "../../../../Constants/GlobalTypes"
import useMessage from "../../../../Hooks/useMessage"
import { useEffect, useRef } from "react"
import VisibleToggleContainer from "../../../Constants/VisibleToggleContainer"
import { TimeModalDataType } from "../../../ReID/Condition/Constants/TimeModal"

const SelectMonitoringCCTVs = ({ index }: {
    index: number
}) => {
    const [visible, setVisible] = useRecoilState(MonitoringDatas('visible'))
    const [selectedCCTVs, setSelectedCCTVs] = useRecoilState(MonitoringDatas('CCTVs'))
    const layoutNum = useRecoilValue(MonitoringDatas('layoutNum'))
    const selectedCCTVsRef = useRef(selectedCCTVs)
    const layoutNumRef = useRef(layoutNum)
    const otherRef = useRef<HTMLButtonElement>(null)
    const message = useMessage()

    useEffect(() => {
        selectedCCTVsRef.current = selectedCCTVs
        layoutNumRef.current = layoutNum
        console.debug("Monitoring (selectedCCTVs, layoutNum) change : ", selectedCCTVs, layoutNum)
    }, [selectedCCTVs, layoutNum])
    
    return <>
        <MonitoringSidebarButton onClick={() => {
            if (visible === 'CCTVs') setVisible(undefined)
            else setVisible('CCTVs')
        }} ref={otherRef}>
            cctv
        </MonitoringSidebarButton>
        <ListContainer index={index} visible={visible === 'CCTVs'} setVisible={v => {
            setVisible(v ? 'CCTVs' : undefined)
        }} otherRef={otherRef}>
            <InnerContainer>
                <TreeAndMapComponent selectedCCTVs={(selectedCCTVs as MonitoringDataType['cctvs']).map(_ => _.cctvId)} setSelectedCCTVs={(cctvs) => {
                    if ((layoutNumRef.current as number) < cctvs.length) message.error({ title: "입력값 에러", msg: "화면 수보다 많은 수를 선택하였습니다." })
                    else {
                        const datas = selectedCCTVs as MonitoringDataType['cctvs'];
                        const added = cctvs.filter(_ => !datas.find(__ => __.cctvId === _));
                        const deleted = datas.filter(_ => !cctvs.includes(_.cctvId));
                        const result = datas.filter(_ => deleted.find(__ => __.cctvId === _.cctvId)).concat(added.map(_ => ({
                            cctvId: _,
                            time: undefined
                        })));
                        setSelectedCCTVs(result)
                    }
                }} visible={visible === 'CCTVs'} />
            </InnerContainer>
        </ListContainer>
    </>
}

export default SelectMonitoringCCTVs

const ListContainer = styled(VisibleToggleContainer) <{ visible: boolean, index: number }>`
    position: absolute;
    width: ${({ visible }) => visible ? 810 : 0}px;
    height: ${({ visible }) => visible ? 800 : 0}px;
    right: 66px;
    top: ${({ index }) => index * 56 - 14}px;
    transition: top .3s ease-out;
    z-index: 1004;
    overflow: ${({ visible }) => visible ? 'visible' : 'hidden'};
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