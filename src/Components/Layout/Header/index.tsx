import styled from "styled-components"
import { HeaderHeight, SidebarWidth } from "../../../Constants/CSSValues"
import Logo from "../../Constants/Logo"
import { globalStyles } from "../../../styles/global-styled"
import { useRecoilState, useRecoilValue } from "recoil"
import { menuState } from "../../../Model/MenuModel"
import { useEffect, useLayoutEffect, useState } from "react"
import ReIDProgress from "../ReIDProgress"
import ProgressIcon from '../../../assets/img/ProgressIcon.png'
import ProgressActivateIcon from '../../../assets/img/ProgressActivateIcon.png'
import logoTextImg from '../../../assets/img/logoText.png'
import UserMenu from "./UserMenu"
import Menus from "./Menus"
import { PROGRESS_STATUS, ProgressStatus } from "../../../Model/ProgressModel"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import { AllMenuStateInitEvent } from "../../../Model/GlobalEventModel"

const Header = () => {
    const [reIDProgressVisible, setReIDProgressVisible] = useState(false)
    const [currentMenu, setCurrentMenu] = useRecoilState(menuState)
    const [allMenuEvent, setAllMenuEvent] = useRecoilState(AllMenuStateInitEvent)
    const cMenu = useRecoilValue(conditionMenu)
    const progressStatus = useRecoilValue(ProgressStatus)

    const goToMain = () => {
        setAllMenuEvent(true)
        setCurrentMenu(null)
    }

    useLayoutEffect(() => {
        setReIDProgressVisible(false)
    }, [currentMenu, cMenu])

    useEffect(() => {
        if(allMenuEvent) {
            setAllMenuEvent(false)
        }
    },[allMenuEvent])

    return <HeaderContainer>
        <LogoContainer onClick={goToMain}>
            <LogoImg/>
            <LogoTextContainer>
                <img src={logoTextImg} />
            </LogoTextContainer>
        </LogoContainer>
        <Menus />
        <ButtonsContainer>
            v{process.env.REACT_APP_VERSION}
            <ProgressBtn onClick={() => {
                setReIDProgressVisible(!reIDProgressVisible)
            }}>
                <ProgressBtnIcon src={progressStatus.status === PROGRESS_STATUS['RUNNING'] ? ProgressActivateIcon : ProgressIcon} isRunning={progressStatus.status === PROGRESS_STATUS['RUNNING']}/>
                <ReIDProgress visible={reIDProgressVisible} close={() => {
                    setReIDProgressVisible(false)
                }}/>
            </ProgressBtn>
            <UserMenu />
        </ButtonsContainer>
    </HeaderContainer>
}

export default Header



const HeaderContainer = styled.header`
    height: ${HeaderHeight}px;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' })}
`

const LogoContainer = styled.div`
    width: ${SidebarWidth - 60}px;
    height: 100%;
    padding: 0 0 0 4px;
    cursor: pointer;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '2%' })}
`

const LogoTextContainer = styled.div`
    height: 32%;
    & > img {
        width: 100%;
        height: 100%;
    }
    flex: 0 0 70%;
`

const LogoImg = styled(Logo)`
    height: 45%;
    flex: 0 0 20%;
    cursor: pointer;
`

const ButtonsContainer = styled.div`
    height: 80%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const ProgressBtn = styled.div`
    height: 100%;
    position: relative;
    ${globalStyles.flex({ justifyContent: 'space-between' })}
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
`

const ProgressBtnIcon = styled.img<{isRunning: boolean}>`
    height: 75%;
    ${({isRunning}) => isRunning && globalStyles.flash({animationDuration: '3s', animationIterationCount: 'infinite'})}
`