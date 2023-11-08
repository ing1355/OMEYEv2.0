import styled from "styled-components";
import { globalStyles } from "../../styles/global-styled";
import MainMenuSelector from "./MainMenuSelector";
import { MenuKeys, ReIdMenuKey } from "../../Constants/GlobalConstantsValues";
import { useRecoilValue } from "recoil";
import { menuState } from "../../Model/MenuModel";
import MenuItemList from "../../Constants/MenuItemList";
import { useEffect } from "react";
import useConditionRoutes from "../ReID/Condition/Hooks/useConditionRoutes";
import { conditionRoute } from "../../Model/ConditionRouteModel";
import { ObjectTypeSelectRoute } from "../ReID/Condition/Constants/RouteInfo";

const Menus = () => {
    const currentMenu = useRecoilValue(menuState)
    const _conditionRoute = useRecoilValue(conditionRoute)
    const { routePush } = useConditionRoutes()

    useEffect(() => {
        console.debug("메인 메뉴 전환 : ", currentMenu)
    }, [currentMenu])

    useEffect(() => {
        if (currentMenu === ReIdMenuKey && _conditionRoute.length === 0) {
            routePush(ObjectTypeSelectRoute.key)
        }
    }, [currentMenu, _conditionRoute])
    
    return <>
        <MenuContainer menuState={currentMenu}>
            {
                // 메인 메뉴
                MenuItemList.map(_ => <MainMenuSelector key={_.key} menuKey={_.key} title={_.title} icon={_.icon} />)
            }
        </MenuContainer>
        {
            MenuItemList.map(_ => <MenuContents key={_.key} menuState={currentMenu} menuKey={_.key}>
                <Container>
                    <_.Component />
                </Container>
            </MenuContents>)
        }
    </>
}

export default Menus;

const MenuContainer = styled.div<{ menuState: MenuKeys }>`
    height: 100%;
    ${({ menuState }) => (menuState === null && menuState !== 0) ? globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', gap: '36px' }) : globalStyles.displayNoneByState(true)}
    ${globalStyles.fadeOut()}
    `
    
const MenuContents = styled.div<{
        menuState: MenuKeys
        menuKey: MenuKeys
    }>`
    height: 100%;
    ${({ menuState, menuKey }) => globalStyles.displayNoneByState(!menuState || (menuState !== menuKey))}
    ${globalStyles.fadeOut()}
`
    
const Container = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`