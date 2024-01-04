import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import Menus from "../Menus";
import { SitesState } from "../../Model/SiteDataModel";
import styled from "styled-components";
import { GlobalBackgroundColor, globalStyles } from "../../styles/global-styled";
import { globalSettings } from "../../Model/GlobalSettingsModel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Axios, GetAllSitesData, GetProfileData, refreshFunction } from "../../Functions/NetworkFunctions";
import { isLogin, userProfile } from "../../Model/LoginModel";
import { AliveApi } from "../../Constants/ApiRoutes";
import useMessage from "../../Hooks/useMessage";
import { IS_PRODUCTION } from "../../Constants/GlobalConstantsValues";

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
    const [isAlive, setIsAlive] = useState(false)
    const vmsStoredTime = useRecoilValueLoadable(globalSettings)
    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useRecoilState(userProfile)
    const setIsLogin = useSetRecoilState(isLogin)
    const message = useMessage()

    useLayoutEffect(() => {
        if (IS_PRODUCTION) { // 새로고침 막기
            window.addEventListener('beforeunload', e => {
                e.preventDefault()
                e.returnValue = ''
                refreshFunction()
            })
        } else {
            window.addEventListener('beforeunload', e => {
                // e.preventDefault()
                // e.returnValue = ''
                refreshFunction()
            })
        }
        Axios('POST', AliveApi).then(_ => {
            if (_) {
                setIsAlive(true)
                GetProfileData().then(res => {
                    setProfile({
                        state: 'IDLE',
                        data: res
                    })
                })
                GetAllSitesData().then(res => {
                    setSitesState({
                        state: 'IDLE',
                        data: res.filter(_ => _.siteId !== 77)
                    })
                })
            } else {
                message.error({ title: "입력값 에러", msg: "로그인 세션이 만료되었습니다.\n다시 로그인해주세요." })
                setIsLogin(null)
            }
        })
    }, [])

    useEffect(() => { // 뒤로가기 막기
        const preventGoBack = () => {
            window.history.pushState(null, '', window.location.href);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', preventGoBack);

        return () => window.removeEventListener('popstate', preventGoBack);
    }, []);

    useEffect(() => {
        if (sitesState.state === 'IDLE' && vmsStoredTime.state === 'hasValue' && isAlive && profile.state == 'IDLE') {
            setIsLoading(false)
            setTimeout(() => {
                setIsComplete(true)
            }, 2000);
        }
    }, [sitesState, vmsStoredTime, isLoading, isAlive, profile])

    return <>
        {!isComplete && <LoadingComponent />}
        {!isLoading && <Menus />}
    </>
}

export default Main;

const LoadingContainer = styled.div`
    height: 100%;
    ${globalStyles.flex()}
    font-size: 4rem;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: ${GlobalBackgroundColor};
`