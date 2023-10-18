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

    return <Container>
        <HomeBtn src={HomeIcon} onClick={goToMain} />
        <MenuItemsContainer>
            {
                MenuItemList.map((_, ind) => <MenuItem key={ind} selected={currentMenu === _.key} onClick={() => {
                    setCurrentMenu(_.key)
                }}>
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
`

const MenuItemsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const MenuItem = styled.div<{ selected: boolean }>`
    ${({ selected }) => selected && {
        color: TextActivateColor
    }}
    font-size: .8rem;
    padding: 0 12px;
    cursor: pointer;
`