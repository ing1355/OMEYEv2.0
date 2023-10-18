import { PropsWithChildren } from "react"
import Button, { ButtonType } from "../../../Constants/Button"
import styled from "styled-components"

type MonitoringSidebarButtonProps = PropsWithChildren & ButtonType

const MonitoringSidebarButton = ({ children, ref, ...props }: MonitoringSidebarButtonProps) => {
    return <SidebarButton {...props}>
        {children}
    </SidebarButton>
}

export default MonitoringSidebarButton

const SidebarButton = styled(Button)`
    flex: 0 0 48px;
    border-radius: 100%;
    position: relative;
`