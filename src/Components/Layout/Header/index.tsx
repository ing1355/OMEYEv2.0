import styled from "styled-components"
import { HeaderHeight, SidebarWidth } from "../../../Constants/CSSValues"
import Logo from "../../Constants/Logo"
import { globalStyles } from "../../../styles/global-styled"
import { useRecoilState, useSetRecoilState } from "recoil"
import { menuState } from "../../../Model/MenuModel"
import { useEffect } from "react"
import logoTextImg from '../../../assets/img/logoText.png'
import UserMenu from "./UserMenu"
import Menus from "./Menus"
import ManagementComponent from "./ManagementComponent"
import ReIDProgress from "./ReIDProgress"
import { GlobalEvents } from "../../../Model/GlobalEventsModel"

const Header = () => {
    
    const setCurrentMenu = useSetRecoilState(menuState)
    const setGlobalEvent = useSetRecoilState(GlobalEvents)

    const goToMain = () => {
        setGlobalEvent({
            key: 'AllMenuStateInit',
            data: undefined
        })
        setCurrentMenu(null)
    }

    return <HeaderContainer>
        <LogoContainer onClick={goToMain}>
            <LogoImg />
            <LogoTextContainer>
                <img src={logoTextImg} />
            </LogoTextContainer>
        </LogoContainer>
        <Menus />
        <ButtonsContainer>
            <ManagementComponent />
            <ReIDProgress/>
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
    width: 400px;
    height: 100%;
    padding: 0 0 0 4px;
    cursor: pointer;
    padding-right: ${400 - (SidebarWidth - 60)}px;
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
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px', justifyContent:'flex-end' })}
    width: 400px;
`