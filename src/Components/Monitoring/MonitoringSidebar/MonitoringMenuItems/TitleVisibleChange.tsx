import { useRef } from "react"
import useMessage from "../../../../Hooks/useMessage"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"
import { useRecoilState } from "recoil"
import { ModalBoxShadow, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import styled from "styled-components"
import VisibleToggleContainer from "../../../Constants/VisibleToggleContainer"
import MonitoringSidebarButton from "./MonitoringSidebarButton"

const TitleVisibleChange = ({ index }: {
    index: number
}) => {
    const [visible, setVisible] = useRecoilState(MonitoringDatas('visible'))
    const [titleVisible, setTitleVisible] = useRecoilState(MonitoringDatas('titleVisible'))
    const message = useMessage()
    const otherRef = useRef(null)

    return <>
        <MonitoringSidebarButton onClick={() => {
            if (visible === 'titleVisible') setVisible(undefined)
            else setVisible('titleVisible')
        }} ref={otherRef}>
            TITLE
        </MonitoringSidebarButton>
        <ListContainer index={index} visible={visible === 'titleVisible'} setVisible={v => {
            setVisible(v ? 'titleVisible' : undefined)
        }} otherRef={otherRef}>
            <InnerContainer>
                <Label>
                    타이틀 표시 :
                </Label>
                <div className="button r" id="button-7">
                    {/* <input type="checkbox" class="checkbox" /> */}
                    <input type="checkbox" checked={titleVisible as boolean} onChange={e => {
                        setTitleVisible(e.target.checked)
                    }}/>
                    {/* <div class="knobs">
                        <span></span>
                    </div>
                    <div class="layer"></div> */}
                </div>
            </InnerContainer>
        </ListContainer>
    </>
}

export default TitleVisibleChange

const ListContainer = styled(VisibleToggleContainer) <{ visible: boolean, index: number }>`
    position: absolute;
    width: ${({ visible }) => visible ? 212.5 : 0}px;
    height: ${({ visible }) => visible ? 48 : 0}px;
    right: 56px;
    top: ${({ index }) => index * 56 + 12}px;
    overflow: ${({ visible }) => visible ? 'visible' : 'hidden'};
    transition: overflow .3s ease-out .3s;
    z-index: 1004;
`

const Label = styled.div`
    font-size: 1.1rem;
    flex: 0 0 90px;
`

const InnerContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    height: 48px;
    width: 200px;
    background-color: ${SectionBackgroundColor};
    padding: 6px 16px;
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

const ToggleBtn = styled.label`
    
`