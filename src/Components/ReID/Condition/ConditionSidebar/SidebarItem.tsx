import styled from "styled-components"
import { globalStyles, TextActivateColor } from "../../../../styles/global-styled"

type SidebarItemProps = {
    title: string
    index: number
    selected: boolean
    onSelect?: Function
}

const SidebarItem = ({ title, index, selected, onSelect }: SidebarItemProps) => {
    return <SidebarItemContainer index={index} selected={selected} onClick={() => {
        if (onSelect) onSelect()
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