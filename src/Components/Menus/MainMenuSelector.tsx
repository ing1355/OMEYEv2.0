import styled from "styled-components"
import { TextActivateColor, globalStyles } from "../../styles/global-styled"
import Button from "../Constants/Button"
import { useSetRecoilState } from "recoil"
import { menuState } from "../../Model/MenuModel"
import { MenuKeys } from "../../Constants/GlobalConstantsValues"

type MainMenuSelectorProps = {
    menuKey: MenuKeys
    title: string
    icon: string
}

const MainMenuSelector = ({ title, menuKey, icon }: MainMenuSelectorProps) => {
    const setCurrentMenu = useSetRecoilState(menuState)
    
    return <Item onClick={() => {
        setCurrentMenu(menuKey)
    }}>
        <Icon src={icon} />
        <Title>
            {title}
        </Title>
    </Item>
}

export default MainMenuSelector

const Item = styled(Button)`
    flex: 0 0 20%;
    height: 50%;
    border: 1px solid black;
    ${globalStyles.flex({flexDirection:'column', gap: '16%'})}
    &:hover {
        border: 1px solid ${TextActivateColor};
    }
`

const Icon = styled.img`
    width: 60%;
`

const Title = styled.div`
    font-size: 2.5rem;
`