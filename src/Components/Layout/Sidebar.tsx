import styled from "styled-components"
import { SidebarWidth } from "../../Constants/CSSValues"
import { CSSProperties, PropsWithChildren } from "react"
import { SectionBackgroundColor } from "../../styles/global-styled"

type SidebarProps = PropsWithChildren & {
    width?: CSSProperties['width']
}

const Sidebar = ({children, width}: SidebarProps) => {

    return <SidebarContainer width={width}>
        <SidebarInnerContainer>
            {children}
        </SidebarInnerContainer>
    </SidebarContainer>
}

export default Sidebar

const SidebarContainer = styled.div<{width: CSSProperties['width']}>`
    height: 100%;
    width: ${({width}) => width || (SidebarWidth + 'px')};
    padding: 0 8px 0 0;
`

const SidebarInnerContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background-color: ${SectionBackgroundColor};
    padding: 8px 12px;
    position: relative;
`