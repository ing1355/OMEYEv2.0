import styled from "styled-components"
import { globalStyles } from "../../../styles/global-styled"
import MonitoringMenuItems from "./MonitoringMenuItems"

const MonitoringSidebar = () => {

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