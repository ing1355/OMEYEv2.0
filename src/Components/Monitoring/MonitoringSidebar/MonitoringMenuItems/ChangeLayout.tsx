import styled from "styled-components"
import { ModalBoxShadow, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import Dropdown from "../../../Layout/Dropdown"
import { useRecoilState, useRecoilValue } from "recoil"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import useMessage from "../../../../Hooks/useMessage"
import VisibleToggleContainer from "../../../Constants/VisibleToggleContainer"
import { useEffect, useRef } from "react"

const layoutNums = [1,4,9,16,25,36,64]

const ChangeLayout = ({index}: {
    index: number
}) => {
    const [visible, setVisible] = useRecoilState(MonitoringDatas('visible'))
    const [monitoringLayoutNums, setMonitoringLayoutNums] = useRecoilState(MonitoringDatas('layoutNum'))
    const cctvNums = useRecoilValue(MonitoringDatas('CCTVs'))
    const message = useMessage()

    return <>
        <MonitoringSidebarButton onClick={() => {
            if(visible === 'layoutNum') setVisible(undefined)
            else setVisible('layoutNum')
        }}>
            view
        </MonitoringSidebarButton>
        <ListContainer index={index} visible={visible === 'layoutNum'} setVisible={v => {
            setVisible(v ? 'layoutNum' : undefined)
        }}>
            <InnerContainer>
                <Label>
                    화면 분할 :
                </Label>
                 <Dropdown<number> defaultValue={monitoringLayoutNums as number} itemList={layoutNums.map(_ => ({
                    key: _,
                    value: _,
                    label: _
                }))} onChange={({value}) => {
                    setMonitoringLayoutNums(value)
                    setVisible(undefined)
                }} disableFunc={({value}) => {
                    return (cctvNums as number[]).length > value
                }} disableCallback={() => {
                    message.error({title: "입력값 에러", msg: "현재 표출되는 영상보다 작은 화면 분할을 사용할 수 없습니다."})
                }}/>
            </InnerContainer>
        </ListContainer>
    </>
}

export default ChangeLayout

const ListContainer = styled(VisibleToggleContainer)<{ visible: boolean, index: number }>`
    position: absolute;
    width: ${({ visible }) => visible ? 212.5 : 0}px;
    height: ${({ visible }) => visible ? 48 : 0}px;
    right: 66px;
    top: ${({index}) => index * 56 + 4}px;
    overflow: ${({visible}) => visible ? 'visible' : 'hidden'};
    transition: overflow .3s ease-out .3s;
    z-index: 1004;
`

const Label = styled.div`
    font-size: 1.1rem;
    flex: 0 0 90px;
`

const InnerContainer = styled.div`
    width: 200px;
    background-color: ${SectionBackgroundColor};
    height: 48px;
    padding: 6px 16px;
    ${globalStyles.flex({ flexDirection: 'row' })}
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
    border-radius: 12px;
    box-shadow: ${ModalBoxShadow};
`