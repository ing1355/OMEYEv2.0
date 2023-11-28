import { useRecoilState, useRecoilValueLoadable } from "recoil";
import Menus from "../Menus";
import { SitesData, SitesState } from "../../Model/SiteDataModel";
import styled from "styled-components";
import { globalStyles } from "../../styles/global-styled";
import { globalSettings } from "../../Model/GlobalSettingsModel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GetAllSitesData } from "../../Functions/NetworkFunctions";

const LoadingComponent = ({ visible }: {
    visible: boolean
}) => {
    const [count, setCount] = useState(0)
    const timerId = useRef<NodeJS.Timer>()

    useEffect(() => {
        timerId.current = setInterval(() => {
            setCount(_ => (_ + 1) % 3)
        }, 1000)
    }, [])

    return <LoadingContainer visible={visible}>
        서버 정보를 불러오는 중입니다.{Array.from({ length: count }).map(_ => '.')}
    </LoadingContainer>
}

const Main = () => {
    const [sitesState, setSitesState] = useRecoilState(SitesState)
    const vmsStoredTime = useRecoilValueLoadable(globalSettings)
    const testData = useRecoilValueLoadable(SitesData)
    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useLayoutEffect(() => {
        setSitesState({
            state: 'RUNNING',
            data: []
        })
        setIsLoading(true)
        GetAllSitesData().then(res => {
            setSitesState({
                state: 'IDLE',
                data: res
            })
        })
    }, [])

    useEffect(() => {
        if (sitesState.state === 'IDLE' && vmsStoredTime.state === 'hasValue') {
            if (isLoading) setTimeout(() => {
                setIsComplete(true)
            }, 1000);
        }
    }, [sitesState, vmsStoredTime, isLoading])

    return <>
        <LoadingComponent visible={!isComplete} />
        {isComplete && <Menus />}
    </>
}

export default Main;

const LoadingContainer = styled.div<{ visible: boolean }>`
    height: 100%;
    ${globalStyles.flex()}
    font-size: 4rem;
    display: ${({ visible }) => visible ? 'flex' : 'none'};
`

const ContentsContainer = styled.div<{ visible: boolean }>`
    visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
    width: 100%;
    height: 100%;
`