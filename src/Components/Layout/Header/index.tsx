import styled from "styled-components"
import { HeaderHeight, SidebarWidth } from "../../../Constants/CSSValues"
import Logo from "../../Constants/Logo"
import { globalStyles } from "../../../styles/global-styled"
import Button from "../../Constants/Button"
import { useSetRecoilState } from "recoil"
import { menuState } from "../../../Model/MenuModel"
import { useState } from "react"
import ReIDProgress from "../ReIDProgress"
import ProgressIcon from '../../../assets/img/ProgressIcon.png'
import UserMenu from "./UserMenu"
import Menus from "./Menus"

const Header = () => {
    const setCurrentMenu = useSetRecoilState(menuState)
    const [reIDProgressVisible, setReIDProgressVisible] = useState(false)

    const goToMain = () => {
        setCurrentMenu(null)
    }

    return <HeaderContainer>
        <LogoImg onClick={goToMain} />
        <Menus/>
        <ButtonsContainer>
            <ProgressBtn onClick={() => {
                setReIDProgressVisible(!reIDProgressVisible)
            }}>
                <ProgressBtnIcon src={ProgressIcon}/>
                <ReIDProgress visible={reIDProgressVisible} />
            </ProgressBtn>
            <UserMenu/>
        </ButtonsContainer>
    </HeaderContainer>
}

export default Header



const HeaderContainer = styled.header`
    height: ${HeaderHeight}px;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' })}
`

const LogoImg = styled(Logo)`
    width: ${SidebarWidth - 60}px;
    height: ${HeaderHeight / 1.5}px;
    cursor: pointer;
`

const ButtonsContainer = styled.div`
    height: 80%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`
const MenuButton = styled(Button)`
    height: 100%;
`

const ProgressBtn = styled.div`
    height: 100%;
    position: relative;
    ${globalStyles.flex({justifyContent:'space-between'})}
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
`

const ProgressBtnIcon = styled.img`
    height: 75%;
`