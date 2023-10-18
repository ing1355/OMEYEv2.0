import styled from "styled-components"
import SidebarItem from "./SidebarItem"
import { ReIDMenuItems } from "../../MenuItems"
import { useRecoilState } from "recoil"
import { conditionMenu } from "../../../../Model/ConditionMenuModel"
import Sidebar from "../../../Layout/Sidebar"
import { SidebarWidth } from "../../../../Constants/CSSValues"
import { TextActivateColor } from "../../../../styles/global-styled"

const ConditionSidebar = () => {
    const [currentMenu, setCurrentMenu] = useRecoilState(conditionMenu)

    return <Sidebar width={SidebarWidth - 60 + 'px'}>
        {
            ReIDMenuItems.map((_, index) => <SidebarItem key={_.key} title={_.title} index={index} selected={currentMenu === _.key} onSelect={() => {
                setCurrentMenu(_.key)
            }} />)
        }
        <SidebarSelectedBar selectedIndex={ReIDMenuItems.findIndex(_ => _.key === currentMenu)} />
    </Sidebar>
}

export default ConditionSidebar

const SidebarSelectedBar = styled.div<{ selectedIndex: number }>`
    width: 6px;
    height: 60px;
    border-radius: 6px;
    position: absolute;
    background-color: ${TextActivateColor};
    transition: top .2s ease-out;
    top: calc(16px + ${({ selectedIndex }) => selectedIndex * 60}px);
    right: 0;
`