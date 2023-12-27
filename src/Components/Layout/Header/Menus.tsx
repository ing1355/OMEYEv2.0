import styled from "styled-components"
import HomeIcon from '../../../assets/img/MenuIcon.png'
import { TextActivateColor, globalStyles } from "../../../styles/global-styled"
import { HeaderHeight } from "../../../Constants/CSSValues"
import MenuItemList from "../../../Constants/MenuItemList";
import { menuState } from "../../../Model/MenuModel";
import { useRecoilState } from "recoil";

const Menus = () => {
    const [currentMenu, setCurrentMenu] = useRecoilState(menuState)

    const goToMain = () => {
        setCurrentMenu(null)
    }

    return currentMenu && <Container>
        <MenuItemsContainer>
            {
                MenuItemList.map((_, ind) => <MenuItem key={ind} selected={currentMenu === _.key} onClick={() => {
                    setCurrentMenu(_.key)
                }}>
                    <IconContainer>
                        <Icon src={_.icon}/>
                    </IconContainer>
                    {_.title}
                </MenuItem>)
            }
        </MenuItemsContainer>
    </Container>
}

export default Menus

const Container = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
`

const HomeBtn = styled.img`
    height: ${HeaderHeight / 1.25}px;
    padding: 8px;
    cursor: pointer;
    pointer-events: auto;
`

const MenuItemsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const MenuItem = styled.div<{ selected: boolean }>`
    ${({ selected }) => selected && {
        color: TextActivateColor
    }}
    &:hover {
        color: ${TextActivateColor};
    }
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 8px;
    display: inline-flex;
    min-width: 87px;
`

const IconContainer = styled.div`
    width: 24px;
    margin-right: 8px;
    ${globalStyles.flex()}
    height: 100%;
`

const Icon = styled.img`
    width: 100%;
    height: 100%;
`