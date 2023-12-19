import styled from "styled-components"
import { HeaderHeight } from "../../../Constants/CSSValues"
import { globalStyles } from "../../../styles/global-styled"
import { useEffect, useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { GetServerInfoApi } from "../../../Constants/ApiRoutes"
import { GetServerInfoType } from "../../Settings/ServerManagement"

const Footer = () => {
    const [BVersion, setBVersion] = useState('')
    const [AIVersion, setAIVersion] = useState('')
    const GetServerInfo = async () => {
        const res: GetServerInfoType = await Axios('GET', GetServerInfoApi)
        if(res) {
            setBVersion(res.omeyeVersion.BE)
            setAIVersion(res.omeyeVersion.AI)
        }
      }
    useEffect(() => {
        GetServerInfo()
    },[])
    return <Container>
        front - v{process.env.REACT_APP_VERSION}, back - v{BVersion}, AI - v{AIVersion}
    </Container>
}

export default Footer

const Container = styled.div`
    height: ${HeaderHeight/2}px;
    width: 100%;
    ${globalStyles.flex({alignItems:'flex-start'})}
`