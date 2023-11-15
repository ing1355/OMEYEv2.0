import styled from "styled-components"
import Sidebar from "../../Layout/Sidebar"
import CCTVTree from "../../Layout/CCTVTree"
import { useState } from "react"
import { CameraDataType } from "../../../Constants/GlobalTypes"
import { globalStyles } from "../../../styles/global-styled"

const AreaAnalyzeSidebar = () => {
    const [selectedCCTV, setSelectedCCTV] = useState<CameraDataType['cameraId'][]>([])
    return <Sidebar>
        <InnerContainer>
            {/* <CCTVTree selectedCCTVs={selectedCCTV} selectedChange={cctvs => {
                setSelectedCCTV(cctvs)
            }} /> */}
        </InnerContainer>
    </Sidebar>
}

export default AreaAnalyzeSidebar

const InnerContainer = styled.div`
    width: 80%;
    height: 100%;
`