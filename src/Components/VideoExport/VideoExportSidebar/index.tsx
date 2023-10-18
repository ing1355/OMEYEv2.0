import { useState } from "react"
import CCTVTree from "../../Layout/CCTVTree"
import Sidebar from "../../Layout/Sidebar"
import styled from "styled-components"

const VideoExportSidebar = () => {
    const [selectedCCTV, setSelectedCCTV] = useState<number[]>([])
    return <Sidebar>
        <InnerContainer>
            <CCTVTree selectedCCTVs={selectedCCTV} selectedChange={cctvs => {
                setSelectedCCTV(cctvs)
            }} singleTarget />
        </InnerContainer>
    </Sidebar>
}

export default VideoExportSidebar

const InnerContainer = styled.div`
    width: 95%;
    overflow: auto;
`