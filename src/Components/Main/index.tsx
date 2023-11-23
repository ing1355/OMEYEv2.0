import { useRecoilState, useRecoilValueLoadable } from "recoil";
import Menus from "../Menus";
import { SitesData, SitesState } from "../../Model/SiteDataModel";
import styled from "styled-components";
import { globalStyles } from "../../styles/global-styled";
import { globalSettings } from "../../Model/GlobalSettingsModel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GetAllSitesData } from "../../Functions/NetworkFunctions";

const LoadingComponent = () => {
    const [count, setCount] = useState(0)
    const timerId = useRef<NodeJS.Timer>()

    useEffect(() => {
        timerId.current = setInterval(() => {
            setCount(_ => (_ + 1) % 3)
        }, 1000)
    }, [])

    return <LoadingContainer>
        서버 정보를 불러오는 중입니다.{Array.from({ length: count }).map(_ => '.')}
    </LoadingContainer>
}

const Main = () => {
    const [sitesState, setSitesState] = useRecoilState(SitesState)
    const vmsStoredTime = useRecoilValueLoadable(globalSettings)
    const testData = useRecoilValueLoadable(SitesData)
    
    useLayoutEffect(() => {
        setSitesState({
            state: 'RUNNING',
            data: []
        })
        GetAllSitesData().then(res => {
            setSitesState({
                state: 'IDLE',
                data: res
            })
        })
    },[])

    if (sitesState.state === 'RUNNING') return <LoadingComponent />
    if (vmsStoredTime.state === 'loading') return <LoadingComponent />
    
    return <Menus />
}

export default Main;

const LoadingContainer = styled.div`
    height: 100%;
    ${globalStyles.flex()}
    font-size: 4rem;
`