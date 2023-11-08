import styled from "styled-components"
import { globalStyles } from "../../../styles/global-styled"
import MonitoringMenuItems from "./MonitoringMenuItems"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useEffect } from "react"
import { menuState } from "../../../Model/MenuModel"
import { MonitoringDatas } from "../../../Model/MonitoringDataModel"
import { PROGRESS_STATUS } from "../../../Model/ProgressModel"

const MonitoringSidebar = () => {
    const setMonitoringStatus = useSetRecoilState(MonitoringDatas("status"))
    const globalMenuState = useRecoilValue(menuState)

    useEffect(() => {
        if(globalMenuState === 'MONITORINGMENU') {
            setMonitoringStatus(PROGRESS_STATUS['RUNNING'])
        } else {
            setMonitoringStatus(PROGRESS_STATUS['IDLE'])
        }
    },[globalMenuState])

    return <>
        <Container>
            <MonitoringMenuItems />
        </Container>
    </>
}

export default MonitoringSidebar

const Container = styled.div`
    flex: 0 0 64px;
    height: 100%;
    ${globalStyles.flex({ justifyContent: 'flex-start', gap:'8px' })}
`