import styled from "styled-components"
import Contents from "./Contents"
import MonitoringSidebar from "./MonitoringSidebar"
import { globalStyles } from "../../styles/global-styled"

const Monitoring = () => {
    return <Container>
        <Contents />
        <MonitoringSidebar/>
    </Container>
}

export default Monitoring

const Container = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex({flexDirection:'row', gap: '4px'})}
`