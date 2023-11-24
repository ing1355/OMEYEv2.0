import styled from "styled-components"
import { globalStyles, TextActivateColor } from "../../../../styles/global-styled"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ReIDConditionFormRoute } from "../Constants/RouteInfo"

type SidebarItemProps = {
    title: string
    index: number
    selected: boolean
    onSelect?: Function
}

const SidebarItem = ({ title, index, selected, onSelect }: SidebarItemProps) => {
    const {routeJump} = useConditionRoutes()
    return <SidebarItemContainer index={index} selected={selected} onClick={() => {
        if(index === 0 && selected) {
            routeJump(ReIDConditionFormRoute.key)
        } else if(!selected) {
            if (onSelect) onSelect()

        }
    }}>
        {title}
    </SidebarItemContainer>
}

export default SidebarItem

const SidebarItemContainer = styled.div<{ index: number, selected: boolean }>`
    height: 60px;
    width: 100%;
    ${globalStyles.flex()}
    cursor: pointer;
    ${({ selected }) => selected ? `color: ${TextActivateColor};` : `
        color: white;
        &:hover {
            color: ${TextActivateColor};
        }
    `}   
`